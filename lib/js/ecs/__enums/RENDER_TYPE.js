"use strict";

const RENDER_TYPE = (function () {
	let num = 0;
	return {
		BOUNDS: num++,
		INFO: num++,
		MORTAL: num++,
	};
})();
