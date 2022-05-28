"use strict";

const COLLIDER_TYPE = (function () {
	let num = 1;
	return {
		NONE: 0,
		BODY: num,
		PROJECTILE: num <<= 1,
		PICKUP: num <<= 1,
		ITEM: num <<= 1,
		INTEREST: num <<= 1,
		AWARENESS: num <<= 1,
	};
})();
