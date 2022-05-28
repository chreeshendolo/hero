"use strict";

const CONTROL_TYPE = (function () {
	let num = 0;
	return {
		KEYS_TO_MOVE: num++,
		MOUSE_TO_ROTATE: num++,
		MOUSE_TO_POINT_OF_INTEREST: num++,
		MOUSE_BUTTONS_TO_ACT: num++,
		GAMEPAD_BUTTONS_TO_MOVE: num++,
		GAMEPAD_BUTTONS_TO_ACT: num++,
		GAMEPAD_AXES_TO_MOVE: num++,
		GAMEPAD_AXES_TO_ROTATE: num++,
		AI: num++,
	};
})();
