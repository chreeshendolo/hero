"use strict";

const Bounds = {};

Bounds.type = "bounds";

Bounds.create = function () {
	return {
		colliders: [],
		responses: [],
	};
};
