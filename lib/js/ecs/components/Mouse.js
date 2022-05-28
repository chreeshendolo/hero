"use strict";

const Mouse = {};

Mouse.type = "mouse";

Mouse.create = function () {
	return {
		position: [0, 0],
		buttons: [],
	};
};
