"use strict";

const RESPONSE = {};

RESPONSE[RESPONSE_TYPE.INTEREST] = function (core, entityID, response) {
	const [render] = core.getComponents(response.entityID, [Render]);
	const [interest] = core.getComponents(entityID, [Interest]);

	switch (response.contactType) {
		case CONTACT_TYPE.BEGIN: {
			interest.interested.push(response.entityID);
			render.push(RENDER_TYPE.INFO);
			break;
		}
		case CONTACT_TYPE.END: {
			interest.interested.splice(interest.interested.indexOf(response.entityID), 1);
			render.splice(render.indexOf(RENDER_TYPE.INFO), 1);
			break;
		}
		default: {}
	}

};

RESPONSE[RESPONSE_TYPE.PICKUPABLE] = function (core, entityID, response) {
	const [interest] = core.getComponents(entityID, [Interest]);

	switch (response.contactType) {
		case CONTACT_TYPE.BEGIN: {
			interest.pickupable.push(response.entityID);
			break;
		}
		case CONTACT_TYPE.END: {
			interest.pickupable.splice(interest.interested.indexOf(response.entityID), 1);
			break;
		}
		default: {}
	}

};

RESPONSE[RESPONSE_TYPE.DISPLACE] = function (core, entityID, response) {
	if (response.contactType === CONTACT_TYPE.END) { return; }

	const {entityID: entityB, colliderA, colliderB} = response;

	const [boundsA, positionA, angleA, velocityA] = core.getComponents(entityID, [Bounds, Position, Angle, Velocity]);
	const [boundsB, positionB, angleB, velocityB] = core.getComponents(entityB, [Bounds, Position, Angle, Velocity]);

	const bodyA = {entityID, position: positionA, angle: angleA, shape: boundsA.colliders[colliderA].shape, static: velocityA === undefined};
	const bodyB = {entityID: entityB, position: positionB, angle: angleB, shape: boundsB.colliders[colliderB].shape, static: velocityB === undefined};

	if (bodyA.static && bodyB.static) { return; }

	DISPLACE[bodyA.shape.type | bodyB.shape.type](bodyA, bodyB);

};

RESPONSE[RESPONSE_TYPE.HURT] = function (core, entityID, response) {
	if (response.contactType !== CONTACT_TYPE.BEGIN) { return; }
	const damage = core.getComponentRoot(Damage).record[response.entityID];
	const mortal = core.getComponent(entityID, Mortal)
	mortal[0] -= damage;
};

RESPONSE[RESPONSE_TYPE.REMOVE] = function (core, entityID, response) {
	core.getComponentRoot(Remove).record[entityID] = true;
};

RESPONSE[RESPONSE_TYPE.AWARE] = function (core, entityID, response) {
	const ai = core.getComponent(entityID, Ai);

	switch (response.contactType) {
		case CONTACT_TYPE.BEGIN: {
			ai.aware.push(response.entityID);
			break;
		}
		case CONTACT_TYPE.END: {
			ai.aware.splice(ai.aware.indexOf(response.entityID), 1);
			break;
		}
		default: {}
	}

};
