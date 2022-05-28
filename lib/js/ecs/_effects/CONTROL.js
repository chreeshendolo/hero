"use strict";

const CONTROL = {};

CONTROL.movementKeyDown = function (key, opposite) {
	return key && !opposite;
};

CONTROL.anyKeyDown = function (keyboard, keys) {
	for (let i = 0; i < keys.length; i++) {
		if (keyboard[keys[i]]) { return true; }
	}
	return false;
}

CONTROL[CONTROL_TYPE.KEYS_TO_MOVE] = function (core, entityID, keys, actions) {
	const keyboard = core.getComponent(entityID, Keyboard);
	if (keyboard === undefined) { return; }

	if (!this.anyKeyDown(keyboard, keys)) { return; }

	const action = Actions.get(ACTION_TYPE.MOVE);
	const data = action.data;

	data[0] = data[1] = 0;

	if (keyboard[keys[0]] && !keyboard[keys[2]]) {
		data[0] = 1;
	}

	if (keyboard[keys[2]] && !keyboard[keys[0]]) {
		data[0] = -1;
	}

	if (keyboard[keys[1]] && !keyboard[keys[3]]) {
		data[1] = 1;
	}

	if (keyboard[keys[3]] && !keyboard[keys[1]]) {
		data[1] = -1;
	}

	actions.push(action);

};

CONTROL[CONTROL_TYPE.MOUSE_TO_ROTATE] = function (core, entityID, data, actions) {
	const mouse = core.getComponent(entityID, Mouse);
	if (mouse === undefined) { return; }

	const action = Actions.get(ACTION_TYPE.ROTATE_AT);
	action.data[0] = mouse.position[0];
	action.data[1] = mouse.position[1];

	actions.push(action);

};

CONTROL[CONTROL_TYPE.MOUSE_TO_POINT_OF_INTEREST] = function (core, entityID, data, actions) {
	const mouse = core.getComponent(entityID, Mouse);
	if (mouse === undefined) { return; }

	const action = Actions.get(ACTION_TYPE.SET_POINT_OF_INTEREST);
	action.data[0] = mouse.position[0];
	action.data[1] = mouse.position[1];

	actions.push(action);

};

CONTROL[CONTROL_TYPE.GAMEPAD_BUTTONS_TO_MOVE] = function (core, entityID, buttons, actions) {
	const gamepad = core.getComponent(entityID, Gamepad);

	if (gamepad === undefined) { return; }

	if (!this.anyKeyDown(gamepad.buttons, buttons)) { return; }

	const action = Actions.get(ACTION_TYPE.MOVE);
	const data = action.data;

	data[0] = data[1] = 0;

	if (gamepad.buttons[buttons[0]] && !gamepad.buttons[buttons[2]]) {
		data[0] = 1;
	}

	if (gamepad.buttons[buttons[2]] && !gamepad.buttons[buttons[0]]) {
		data[0] = -1;
	}

	if (gamepad.buttons[buttons[1]] && !gamepad.buttons[buttons[3]]) {
		data[1] = 1;
	}

	if (gamepad.buttons[buttons[3]] && !gamepad.buttons[buttons[1]]) {
		data[1] = -1;
	}

	actions.push(action);

};

CONTROL[CONTROL_TYPE.GAMEPAD_AXES_TO_MOVE] = function (core, entityID, axes, actions) {
	const gamepad = core.getComponent(entityID, Gamepad);

	if (gamepad === undefined) { return; }

	const action = Actions.get(ACTION_TYPE.MOVE);
	const data = action.data;

	data[0] = gamepad.axes[axes[0]] ?? 0;
	data[1] = gamepad.axes[axes[1]] ?? 0;

	const deadzone = 0.2;
	const magnitude = vec2.magnitude(data);
	if (magnitude < deadzone) { return; }

	actions.push(action);

};

CONTROL[CONTROL_TYPE.GAMEPAD_AXES_TO_ROTATE] = function (core, entityID, axes, actions) {
	const gamepad = core.getComponent(entityID, Gamepad);

	if (gamepad === undefined) { return; }

	const direction = [
		gamepad.axes[axes[0]] ?? 0,
		gamepad.axes[axes[1]] ?? 0,
	];

	const deadzone = 0.2;
	const magnitude = vec2.magnitude(direction);
	if (magnitude < deadzone) { return; }

	const action = Actions.get(ACTION_TYPE.ROTATE);

	action.data = vec2.angle(direction);

	actions.push(action);

};

CONTROL[CONTROL_TYPE.MOUSE_BUTTONS_TO_ACT] = function (core, entityID, buttons, actions) {
	const [mouse, abilities, interest] = core.getComponents(entityID, [Mouse, Abilities, Interest]);
	if (mouse === undefined) { return; }

	if (mouse.buttons[buttons[0]] === true) {

		const pickups = [];
		for (let i = 0; i < interest.interested.length; i++) {
			const interested = interest.interested[i];
			for (let ii = 0; ii < interest.pickupable.length; ii++) {
				const pickupable = interest.pickupable[ii];
				if (interested !== pickupable) { continue; }
				pickups.push(pickupable);
			}
		}
		if (pickups.length > 0) {
			actions.push({type: ACTION_TYPE.PICKUP, data: pickups});
		} else {
			actions.push(abilities[0]);
		}
	}

	if (mouse.buttons[buttons[1]] === true) {
		actions.push(abilities[1]);
	}

};

CONTROL[CONTROL_TYPE.GAMEPAD_BUTTONS_TO_ACT] = function (core, entityID, buttons, actions) {
	const [gamepad, abilities, interest] = core.getComponents(entityID, [Gamepad, Abilities, Interest]);
	if (gamepad === undefined) { return; }

	if (gamepad.buttons[buttons[0]] === true) {
		const pickups = [];
		for (let i = 0; i < interest.interested.length; i++) {
			const interested = interest.interested[i];
			for (let ii = 0; ii < interest.pickupable.length; ii++) {
				const pickupable = interest.pickupable[ii];
				if (interested !== pickupable) { continue; }
				pickups.push(pickupable);
			}
		}
		if (pickups.length > 0) {
			actions.push({type: ACTION_TYPE.PICKUP, data: pickups});
		} else {
			actions.push(abilities[0]);
		}
	}

	if (gamepad.buttons[buttons[1]] === true) {
		actions.push(abilities[1]);
	}

};

CONTROL[CONTROL_TYPE.ANGLE_TO_MOVE] = function (core, entityID, data, actions) {
	const angle = core.getComponent(entityID, Angle);

	const action = Actions.get(ACTION_TYPE.MOVE);

	vec2.fromAngle(angle, action.data);

	actions.push(action);
};

CONTROL[CONTROL_TYPE.AI] = function (core, entityID, data, actions) {
	const [ai, faction, position, abilities, angle] = core.getComponents(entityID, [Ai, Faction, Position, Abilities, Angle]);

	if (ai.aware.length < 1) { return; }

	const enemies = [];
	for (let i = 0; i < ai.aware.length; i++) {
		const aware = ai.aware[i];
		const _faction = core.getComponent(aware, Faction);
		if (_faction === undefined || faction.enemies.indexOf(_faction.type) < 0) { continue; }
		enemies.push(aware);
	}

	const enemyID = enemies[0];
	if (enemyID === undefined) { return; }

	const [enemyPosition] = core.getComponents(enemyID, [Position]);

	const face = Actions.get(ACTION_TYPE.ROTATE_AT);
	face.data[0] = enemyPosition[0];
	face.data[1] = enemyPosition[1];

	const move = Actions.get(ACTION_TYPE.MOVE);

	vec2.fromAngle(angle, move.data);

	actions.push(face);
	actions.push(move);
	actions.push(abilities[0]);
};
