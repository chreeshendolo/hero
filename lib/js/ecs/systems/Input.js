"use strict";

const Input = {};

Input.components = [];

Input.update = function (core, deltaTime) {

	this.updateKeyboards(core);
	this.updateMice(core);
	this.updateGamepads(core);

};

Input.updateKeyboards = function (core) {
	const entities = core.getEntities([Keyboard]);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const keyboard = core.getComponent(entityID, Keyboard);
		for (const key in input.keyboard) {
			keyboard[key] = input.keyboard[key].pressed;
		}
	}

};

Input.updateMice = function (core) {
	const entities = core.getEntities([Mouse]);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const mouse = core.getComponent(entityID, Mouse);
		mouse.position[0] = input.mouse.position[0];
		mouse.position[1] = input.mouse.position[1];
		for (let i = 0; i < input.mouse.buttons.length; i++) {
			if (input.mouse.buttons[i] === undefined) { continue; }
			mouse.buttons[i] = input.mouse.buttons[i].pressed;
		}
	}

};

Input.updateGamepads = function (core) {
	const entities = core.getEntities([Gamepad]);
	const sources = input.getGamepads();

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const gamepad = core.getComponent(entityID, Gamepad);

		const source = sources[gamepad.index];
		if (source === null) { continue; }

		const map = GAMEPAD[gamepad.type];

		for (let ii = 0; ii < source.buttons.length; ii++) {
			const button = map.buttons[ii];
			gamepad.buttons[button] = source.buttons[ii].pressed;
		}

		for (let ii = 0; ii < source.axes.length; ii++) {
			const axes = map.axes[ii];
			gamepad.axes[axes] = source.axes[ii];
		}
	}

};
