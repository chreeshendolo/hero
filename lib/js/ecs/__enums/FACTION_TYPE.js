"use strict";

const FACTION_TYPE = (function () {
	let num = 0;
	return {
		NEUTRAL: num++,
		GOOD: num++,
		EVIL: num++,
	};
})();
