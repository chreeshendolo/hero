"use strict";

const ASSET_TYPE = (function () {
	let num = 0;
	return {
		IMAGE: num++,
		AUDIO: num++,
	};
})();
