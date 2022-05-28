"use strict";

const DISPLACE = {};

DISPLACE[SHAPE_TYPE.CIRCLE] = function (bodyA, bodyB) {

	const transform = new DOMMatrix();
	transform.translateSelf(bodyB.position[0], bodyB.position[1]);
	transform.rotateSelf(math.radiansToDegrees(bodyB.angle));
	transform.translateSelf(bodyB.shape.position[0], bodyB.shape.position[1]);

	transform.invertSelf();

	transform.translateSelf(bodyA.position[0], bodyA.position[1]);
	transform.rotateSelf(math.radiansToDegrees(bodyA.angle));
	transform.translateSelf(bodyA.shape.position[0], bodyA.shape.position[1]);

	const position = [transform.e, transform.f];
	const distance = vec2.subtract(position, bodyB.shape.position, []);
	const direction = vec2.normalize(distance, []);

	const nearestPoint = vec2.scale(direction, bodyB.shape.data[0], []);

	vec2.subtract(position, nearestPoint, distance);
	vec2.normalize(distance, direction);
	vec2.scale(direction, bodyA.shape.data[0], direction);

	vec2.subtract(direction, distance, distance);

	if (bodyB.static) {
		vec2.add(bodyA.position, distance, bodyA.position);
	} else if (bodyA.static) {
		vec2.scale(distance, -1, distance);
		vec2.add(bodyB.position, distance, bodyB.position);
	} else {
		vec2.scale(distance, 0.5, distance);
		vec2.add(bodyA.position, distance, bodyA.position);
		vec2.scale(distance, -1, distance);
		vec2.add(bodyB.position, distance, bodyB.position);
	}
};

DISPLACE[SHAPE_TYPE.CIRCLE | SHAPE_TYPE.RECTANGLE] = function (bodyA, bodyB) {

	const circle = bodyA.shape.type === SHAPE_TYPE.CIRCLE ? bodyA : bodyB;
	const rectangle = bodyA.shape.type === SHAPE_TYPE.RECTANGLE ? bodyA : bodyB;

	const transform = new DOMMatrix();
	transform.translateSelf(rectangle.position[0], rectangle.position[1]);
	transform.rotateSelf(math.radiansToDegrees(rectangle.angle));
	transform.translateSelf(rectangle.shape.position[0], rectangle.shape.position[1]);

	transform.invertSelf();

	transform.translateSelf(circle.position[0], circle.position[1]);
	transform.rotateSelf(math.radiansToDegrees(circle.angle));
	transform.translateSelf(circle.shape.position[0], circle.shape.position[1]);

	const position = [transform.e, transform.f];
	const [width, height] = rectangle.shape.data;

	const nearestPoint = [
		Math.max(rectangle.shape.position[0] - width * 0.5, Math.min(position[0], rectangle.shape.position[0] + width * 0.5)),
		Math.max(rectangle.shape.position[1] - height * 0.5, Math.min(position[1], rectangle.shape.position[1] + height * 0.5)),
	];

	const distance = vec2.subtract(position, nearestPoint, []);
	const direction = vec2.normalize(distance, []);
	const radius = circle.shape.data[0];
	vec2.scale(direction, radius, direction);
	vec2.subtract(direction, distance, distance);

	if (rectangle.static) {
		vec2.add(circle.position, distance, circle.position);
	} else if (circle.static) {
		vec2.scale(distance, -1, distance);
		vec2.add(rectangle.position, distance, rectangle.position);
	} else {
		vec2.scale(distance, 0.5, distance);
		vec2.add(circle.position, distance, circle.position);
		vec2.scale(distance, -1, distance);
		vec2.add(rectangle.position, distance, rectangle.position);
	}

};
