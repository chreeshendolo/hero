"use strict";

const BUTTON_TYPE = (function () {
	let num = 0;
	return {
		ACTION_DOWN: num++,
		ACTION_RIGHT: num++,
		ACTION_LEFT: num++,
		ACTION_UP: num++,
		L1: num++,
		R1: num++,
		L2: num++,
		R2: num++,
		SELECT: num++,
		START: num++,
		L3: num++,
		R3: num++,
		DPAD_UP: num++,
		DPAD_DOWN: num++,
		DPAD_LEFT: num++,
		DPAD_RIGHT: num++,
		SPECIAL1: num++,
		SPECIAL2: num++,
		LEFT_AXES_X: num++,
		LEFT_AXES_Y: num++,
		RIGHT_AXES_X: num++,
		RIGHT_AXES_Y: num++,
	};
})();
