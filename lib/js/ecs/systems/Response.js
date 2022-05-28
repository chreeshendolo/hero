"use strict";

const Response = {};

Response.components = [Bounds];

Response.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [bounds] = core.getComponents(entityID, this.components);
		const responses = bounds.responses;

		for (let ii = 0; ii < responses.length; ii++) {
			const response = responses[ii];
			RESPONSE[response.type](core, entityID, response);
			response.contactType = CONTACT_TYPE.STALE;
		}

	}

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [boundsA, positionA, angleA] = core.getComponents(entityID, [Bounds, Position, Angle]);
		const responses = boundsA.responses;

		for (let ii = 0; ii < responses.length; ii++) {
			const response = responses[ii];

			const colliderA = boundsA.colliders[response.colliderA];

			const [boundsB, positionB, angleB] = core.getComponents(response.entityID, [Bounds, Position, Angle]);

			const colliderB = boundsB.colliders[response.colliderB];

			const shapeA = colliderA.shape;
			const shapeB = colliderB.shape;

			if (COLLISION[shapeA.type | shapeB.type](
					{
						position: positionA,
						angle: angleA,
						shape: shapeA,
					},
					{
						position: positionB,
						angle: angleB,
						shape: shapeB,
					},
				)) { continue; }

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
