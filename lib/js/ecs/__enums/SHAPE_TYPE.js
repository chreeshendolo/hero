"use strict";

const SHAPE_TYPE = (function () {
	let num = 1;
	return {
		RECTANGLE: num,
		CIRCLE: num <<= 1,
		POINT: num <<= 1,
		POLYGON: num <<= 1,
	};
})();
