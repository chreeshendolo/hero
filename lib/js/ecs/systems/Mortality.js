"use strict";

const Mortality = {};

Mortality.components = [Mortal];

Mortality.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [mortal] = core.getComponents(entityID, this.components);

		if (mortal[0] > 0) { continue; }

		core.getComponentRoot(Remove).record[entityID] = true;
	}

};
