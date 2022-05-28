"use strict";

const CONTACT_TYPE = (function () {
	let num = 0;
	return {
		BEGIN: num++,
		STALE: num++,
		END: num++,
	};
})();
