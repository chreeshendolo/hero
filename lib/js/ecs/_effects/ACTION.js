"use strict";

const ACTION = {};

ACTION[ACTION_TYPE.NONE] = function (core, entityID, action) {};

ACTION[ACTION_TYPE.MOVE] = function (core, entityID, action) {
	const velocity = core.getComponent(entityID, Velocity);
	velocity[0] += action[0];
	velocity[1] += action[1];
};

ACTION[ACTION_TYPE.ROTATE] = function (core, entityID, action) {
	core.getComponentRoot(Angle).record[entityID] = action;
};

ACTION[ACTION_TYPE.ROTATE_AT] = function (core, entityID, action) {
	const position = core.getComponent(entityID, Position);
	const direction = vec2.subtract(action, position, action);

	core.getComponentRoot(Angle).record[entityID] = vec2.angle(direction);

};

ACTION[ACTION_TYPE.SET_POINT_OF_INTEREST] = function (core, entityID, action) {
	const [position, angle, bounds] = core.getComponents(entityID, [Position, Angle, Bounds]);

	const transform = new DOMMatrix();

	transform.translateSelf(position[0], position[1]);
	transform.rotateSelf(math.radiansToDegrees(angle));

	transform.invertSelf();

	transform.translateSelf(action[0], action[1]);

	const colliders = bounds.colliders;
	for (let i = 0; i < colliders.length; i++) {
		const collider = colliders[i];
		if (collider.type !== COLLIDER_TYPE.INTEREST) { continue; }
		const point = collider.shape;
		point.position[0] = transform.e;
		point.position[1] = transform.f;
	}

};

ACTION[ACTION_TYPE.SPAWN_PROJECTILE] = function (core, entityID, action) {
	if (action[1] > 0) { return; }
	action[1] = action[0];

	const [position, angle, velocity, gamepad] = core.getComponents(entityID, [Position, Angle, Velocity, Gamepad]);

	const direction = vec2.fromAngle(angle, []);

	vec2.scale(direction, 48, direction);
	vec2.add(position, direction, direction);

	core.createArchetype(ARCHETYPE.PROJECTILE, direction[0], direction[1], angle, 500);

	if (gamepad === undefined) { return; }
	const source = navigator.getGamepads()[gamepad.index];
	if (source === null) { return; }

	source.vibrationActuator.playEffect('dual-rumble', {
		startDelay: 0,
		duration: 200,
		weakMagnitude: 1.0,
		strongMagnitude: 1.0,
	});

};

ACTION[ACTION_TYPE.DASH] = function (core, entityID, action) {
	if (action[1] > 0) { return; }
	action[1] = action[0];

	const [angle, velocity] = core.getComponents(entityID, [Angle, Velocity]);

	const direction = vec2.fromAngle(angle, []);

	vec2.scale(direction, 31, direction);
	vec2.add(velocity, direction, velocity);
};

ACTION[ACTION_TYPE.HEAL] = function (core, entityID, hp) {
	const mortal = core.getComponent(entityID, Mortal);
	mortal[0] = mortal[1];
};

ACTION[ACTION_TYPE.PICKUP] = function (core, entityID, pickups) {
	for (let i = 0; i < pickups.length; i++) {
		const id = pickups[i];
		const pickup = core.getComponent(id, Pickup);
		if (pickup.used === true) { continue; }
		ACTION[pickup.action.type](core, entityID, pickup.action.data);
		pickup.used = true;
		core.getComponentRoot(Remove).record[id] = true;
	}
};
