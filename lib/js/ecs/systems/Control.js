"use strict";

const Control = {};

Control.components = [Controller, Actions];

Control.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [controller, actions] = core.getComponents(entityID, this.components);
		for (let ii = 0; ii < controller.length; ii++) {
			const control = controller[ii];
			CONTROL[control.type](core, entityID, control.data, actions);
		}
	}

};
