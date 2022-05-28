"use strict";

const Gamepad = {};

Gamepad.type = "gamepad";

Gamepad.create = function () {
	return {
		index: 0,
		type: GAMEPAD_TYPE.DUAL_SHOCK_4,
		axes: {},
		buttons: {},
	};
};
