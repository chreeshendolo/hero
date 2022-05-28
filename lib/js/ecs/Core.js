"use strict";

const Core = (function () {
	const inactiveIDs = [];

	Core.PRE_UPDATE = 0;
	Core.UPDATE = 1;
	Core.POST_UPDATE = 2;

	function Core() {
		this.globalID = this.getID();
		this.archetypes = {};
		this.components = {};
		this.systems = {
			[Core.PRE_UPDATE]: [],
			[Core.UPDATE]: [],
			[Core.POST_UPDATE]: [],
		};
		this._stop = true;
		this.time = 0;
		this.accumulator = 0;
		this.fixed = 1000 / 60;
	}

	Core.prototype.getID = function () {
		if (inactiveIDs.length > 0) {
			return inactiveIDs.pop();
		}

		return random.id();
	};

	Core.prototype.registerComponent = function (component) {
		this.components[component.type] = {
			reference: component,
			record: {},
			active: [],
			inactive: [],
		};
	};

	Core.prototype.registerArchetype = function (archetype, components, callback) {
		this.archetypes[archetype] = {components, callback};
	};

	Core.prototype.registerSystem = function (system, event) {
		this.systems[event].push(system);
	};

	Core.prototype.createArchetype = function (archetype, ...args) {
		const entityID = this.getID();
		this.addComponents(entityID, this.archetypes[archetype].components);
		this.archetypes[archetype].callback(entityID, ...args);
		return entityID;
	};

	Core.prototype.addComponents = function (entityID, components) {
		for (let i = 0; i < components.length; i++) {
			this.addComponent(entityID, components[i]);
		}
	};

	Core.prototype.addComponent = function (entityID, component) {
		const _component = this.components[component.type];
		let data = _component.inactive.pop();
		if (data === undefined) {
			data = component.create();
		}
		_component.record[entityID] = data;
		_component.active.push(entityID);
	};

	Core.prototype.removeEntity = function (entityID) {
		for (const type in this.components) {
			this.removeComponent(entityID, this.components[type].reference);
		}

		inactiveIDs.push(entityID);
	};

	Core.prototype.removeComponent = function (entityID, component) {
		const _component = this.components[component.type];
		const index = _component.active.indexOf(entityID);
		if (index < 0) { return; }
		_component.inactive.push(_component.record[entityID]);
		_component.record[entityID] = undefined;
		_component.active.splice(index, 1);
	};

	Core.prototype.getEntities = function (components) {
		const entities = [];
		const _components = this.components;
		const active = this.getComponentRoot(components[0]).active;
		for (let i = 0; i < active.length; i++) {
			const entityID = active[i];
			let valid = true;
			for (let ii = 1; ii < components.length; ii++) {
				const component = this.getComponentRoot(components[ii]);
				if (component.record[entityID] === undefined) {
					valid = false;
					break;
				}
			}

			if (!valid) { continue; }
			entities.push(entityID);
		}

		return entities;
	};

	Core.prototype.getComponents = function (entityID, components) {
		const _components = [];
		for (let i = 0; i < components.length; i++) {
			_components.push(this.getComponent(entityID, components[i]));
		}

		return _components;
	};

	Core.prototype.getComponent = function (entityID, component) {
		return this.components[component.type].record[entityID];
	};

	Core.prototype.getComponentRoot = function (component) {
		return this.components[component.type];
	};

	Core.prototype.start = function () {
		this._stop = false;
		this.accumulator = 0;
		this.time = 0;
		this.loop(this.time);
	};

	Core.prototype.stop = function () {
		this._stop = true;
	};

	Core.prototype.loop = function (time) {
		const deltaTime = time - this.time;
		this.time = time;

		this.accumulator += deltaTime;

		this.update(deltaTime, Core.PRE_UPDATE);

		while (this.accumulator > 0) {
			this.accumulator -= this.fixed;

			this.update(this.fixed, Core.UPDATE);
		}

		this.update(deltaTime, Core.POST_UPDATE);

		if (this._stop) { return; }
		requestAnimationFrame(this.loop.bind(this));
	};

	Core.prototype.update = function (deltaTime, event) {
		for (let i = 0; i < this.systems[event].length; i++) {
			this.systems[event][i].update(this, deltaTime);
		}
	};

	return Core;
})();
