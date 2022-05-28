"use strict";

const ACTION_TYPE = (function () {
	let num = 0;;
	return {
		NONE: num++,
		MOVE: num++,
		ROTATE: num++,
		ROTATE_AT: num++,
		SET_POINT_OF_INTEREST: num++,
		SPAWN_PROJECTILE: num++,
		DASH: num++,
		PICKUP: num++,
		HEAL: num++,
	};
})();
