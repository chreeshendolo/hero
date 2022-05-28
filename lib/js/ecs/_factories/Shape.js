"use strict";

const Shape = {};

Shape.inactive = {};

Shape.deactivate = function (shape) {
	this.inactive[shape.type].push(shape);
};

Shape.create = function (type) {
	if (this.inactive[type] === undefined) {
		this.inactive[type] = [];
	}

	let shape = this.inactive[type].pop();
	if (shape === undefined) {
		shape = {type, angle: 0, position: [0, 0], data: []};
	} else {
		shape.type = type;
		shape.angle = 0;
		shape.position[0] = shape.position[1] = 0;
		shape.data.length = 0;
	}

	return this[type](shape);
};

Shape[SHAPE_TYPE.POINT] = function (shape) {
	return shape;
};

Shape[SHAPE_TYPE.CIRCLE] = function (shape) {
	shape.data[0] = 0;

	return shape;
};

Shape[SHAPE_TYPE.RECTANGLE] = function (shape) {
	shape.data[0] = shape.data[1] = 0;

	return shape;
};

Shape[SHAPE_TYPE.POLYGON] = function (shape) {
	return shape;
};
