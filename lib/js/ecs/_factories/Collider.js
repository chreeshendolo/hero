"use strict";

const Collider = {};

Collider.inactive = [];

Collider.deactivate = function (collider) {
	Shape.deactivate(collider.shape);
	this.inactive.push(collider);
};

Collider.create = function (type) {

	let collider = this.inactive.pop();
	if (collider === undefined) {
		collider = {
			type,
			mask: COLLIDER_TYPE.NONE,
			responses: [],
			shape: undefined,
		};
	} else {
		collider.type = type;
		collider.mask = COLLIDER_TYPE.NONE;
		collider.responses.length = 0;
		collider.shape = undefined;
	}

	return collider;
};
