"use strict";

const Removal = {};

Removal.components = [Remove];

Removal.update = function (core, deltaTime) {

	this.processResponses(core, deltaTime);
	this.processRemove(core, deltaTime);

};

Removal.processResponses = function (core, deltaTime) {
	const entities = core.getEntities([Bounds]);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [boundsA, removeA] = core.getComponents(entityID, [Bounds, Remove]);
		const responses = boundsA.responses;

		for (let ii = 0; ii < responses.length; ii++) {
			const response = responses[ii];

			const [boundsB, removeB] = core.getComponents(response.entityID, [Bounds, Remove]);

			if (removeA !== true && removeB !== true) { continue; }

			response.contactType = CONTACT_TYPE.END;
			RESPONSE[response.type](core, entityID, response);
		}

	}

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const bounds = core.getComponent(entityID, Bounds);
		const responses = bounds.responses;

		for (let ii = responses.length - 1; ii >= 0; ii--) {
			const response = responses[ii];

			if (response.contactType !== CONTACT_TYPE.END) { continue; }

			responses.splice(ii, 1);
		}

	}
};

Removal.processRemove = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [remove] = core.getComponents(entityID, this.components);
		if (remove !== true) { continue; }
		core.removeEntity(entityID);
	}
};
