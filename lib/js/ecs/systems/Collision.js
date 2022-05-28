"use strict";

const Collision = {};

Collision.components = [Bounds, Position, Angle];

Collision.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityA = entities[i];
		const [boundsA, positionA, angleA] = core.getComponents(entityA, this.components);

		const collidersA = boundsA.colliders;

		for (let ii = 0; ii < collidersA.length; ii++) {
			const colliderA = collidersA[ii];

			for (let iii = 0; iii < entities.length; iii++) {
				const entityB = entities[iii];
				if (entityA === entityB) { continue; }

				const [boundsB, positionB, angleB] = core.getComponents(entityB, this.components);

				const collidersB = boundsB.colliders;

				for (let iiii = 0; iiii < collidersB.length; iiii++) {
					const colliderB = collidersB[iiii];

					if ((colliderB.type & colliderA.mask) === 0) { continue; }

					let alreadyColliing = false;
					for (let iiiii = 0; iiiii < boundsA.responses.length; iiiii++) {
						const response = boundsA.responses[iiiii];
						if (
							response.entityID === entityB
							&& response.colliderA === ii
							&& response.colliderB === iiii
						) {
							alreadyColliing = true;
							break;
						}
					}

					if (alreadyColliing) { continue; }

					const shapeA = colliderA.shape;
					const shapeB = colliderB.shape;

					if (!COLLISION[shapeA.type | shapeB.type](
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

					for (let r = 0; r < colliderA.responses.length; r++) {
						const resp = colliderA.responses[r];
						if (resp.type !== colliderB.type) { continue; }
						boundsA.responses.push({
							type: resp.response,
							entityID: entityB,
							colliderA: ii,
							colliderB: iiii,
							contactType: CONTACT_TYPE.BEGIN,
						});
					}

				}

			}

		}


	}

};
