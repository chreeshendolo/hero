"use strict";

const RESPONSE_TYPE = (function () {
	let num = 0;
	return {
		NONE: num++,
		INTEREST: num++,
		DISPLACE: num++,
		REMOVE: num++,
		HURT: num++,
		AWARE: num++,
	};
})();
