"use strict";

const ARCHETYPE = (function () {
	let num = 0;
	return {
		HERO: num++,
		ITEM: num++,
		WALL: num++,
		PROJECTILE: num++,
		ENEMY: num++,
	};
})();
