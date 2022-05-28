"use strict";

const Act = {};

Act.components = [Actions];

Act.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [actions] = core.getComponents(entityID, this.components);

		for (let ii = 0; ii < actions.length; ii++) {
			const action = actions[ii];
			if (ACTION[action.type] === undefined) {
				console.log(action.type)
				continue;
			}
			ACTION[action.type](core, entityID, action.data);

			Actions.deactivate(action);
		}

		actions.length = 0;
	}

};
