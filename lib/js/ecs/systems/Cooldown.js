"use strict";

const Cooldown = {};

Cooldown.components = [Abilities];

Cooldown.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [abilities] = core.getComponents(entityID, this.components);
		for (let ii = 0; ii < abilities.length; ii++) {
			const ability = abilities[ii];
			if (ability.data[1] <= 0) { continue; }
			ability.data[1] -= deltaTime;
		}
	}

};
