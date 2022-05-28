"use strict";

const COLLISION = {};

COLLISION[SHAPE_TYPE.RECTANGLE] = function (bodyA, bodyB) {
	return false;
};

COLLISION[SHAPE_TYPE.CIRCLE] = function (bodyA, bodyB) {

	const transform = new DOMMatrix();
	transform.translateSelf(bodyA.position[0], bodyA.position[1]);
	transform.rotateSelf(math.radiansToDegrees(bodyA.angle));
	transform.translateSelf(bodyA.shape.position[0], bodyA.shape.position[1]);
	transform.rotateSelf(math.radiansToDegrees(bodyA.shape.angle));

	transform.invertSelf();

	transform.translateSelf(bodyB.position[0], bodyB.position[1]);
	transform.rotateSelf(math.radiansToDegrees(bodyB.angle));
	transform.translateSelf(bodyB.shape.position[0], bodyB.shape.position[1]);
	transform.rotateSelf(math.radiansToDegrees(bodyB.shape.angle));

	const position = [transform.e, transform.f];
	vec2.subtract(bodyA.shape.position, position, position);
	const distance = vec2.magnitude(position);

	const radius = bodyA.shape.data[0] + bodyB.shape.data[0];

	return distance < radius;
};

COLLISION[SHAPE_TYPE.POINT | SHAPE_TYPE.CIRCLE] = function (bodyA, bodyB) {

	const point = bodyA.shape.type === SHAPE_TYPE.POINT ? bodyA : bodyB;
	const circle = bodyA.shape.type === SHAPE_TYPE.CIRCLE ? bodyA : bodyB;

	const transform = new DOMMatrix();
	transform.translateSelf(circle.position[0], circle.position[1]);
	transform.rotateSelf(math.radiansToDegrees(circle.angle));
	transform.translateSelf(circle.shape.position[0], circle.shape.position[1]);

	transform.invertSelf();

	transform.translateSelf(point.position[0], point.position[1]);
	transform.rotateSelf(math.radiansToDegrees(point.angle));
	transform.translateSelf(point.shape.position[0], point.shape.position[1]);

	const position = [transform.e, transform.f];

	vec2.subtract(circle.shape.position, position, position);
	const distance = vec2.magnitude(position);

	const radius = circle.shape.data[0];

	return distance < radius;
};

COLLISION[SHAPE_TYPE.CIRCLE | SHAPE_TYPE.RECTANGLE] = function (bodyA, bodyB) {

	const circle = bodyA.shape.type === SHAPE_TYPE.CIRCLE ? bodyA : bodyB;
	const rectangle = bodyA.shape.type === SHAPE_TYPE.RECTANGLE ? bodyA : bodyB;

	const transform = new DOMMatrix();
	transform.translateSelf(rectangle.position[0], rectangle.position[1]);
	transform.rotateSelf(math.radiansToDegrees(rectangle.angle));
	transform.translateSelf(rectangle.shape.position[0], rectangle.shape.position[1]);
	transform.rotateSelf(math.radiansToDegrees(rectangle.shape.angle));

	transform.invertSelf();

	transform.translateSelf(circle.position[0], circle.position[1]);
	transform.rotateSelf(math.radiansToDegrees(circle.angle));
	transform.translateSelf(circle.shape.position[0], circle.shape.position[1]);
	transform.rotateSelf(math.radiansToDegrees(circle.shape.angle));

	const position = [transform.e, transform.f];
	const [width, height] = rectangle.shape.data;

	const nearestPoint = [
		Math.max(rectangle.shape.position[0] - width * 0.5, Math.min(position[0], rectangle.shape.position[0] + width * 0.5)),
		Math.max(rectangle.shape.position[1] - height * 0.5, Math.min(position[1], rectangle.shape.position[1] + height * 0.5)),
	];

	vec2.subtract(position, nearestPoint, nearestPoint);
	const distance = vec2.magnitude(nearestPoint);

	const radius = circle.shape.data[0];

	return distance < radius;
};

COLLISION[SHAPE_TYPE.POINT | SHAPE_TYPE.RECTANGLE] = function (bodyA, bodyB) {

	const point = bodyA.shape.type === SHAPE_TYPE.POINT ? bodyA : bodyB;
	const rectangle = bodyA.shape.type === SHAPE_TYPE.RECTANGLE ? bodyA : bodyB;

	const transform = new DOMMatrix();
	transform.translateSelf(rectangle.position[0], rectangle.position[1]);
	transform.translateSelf(rectangle.shape.position[0], rectangle.shape.position[1]);

	transform.invertSelf();

	transform.translateSelf(point.position[0], point.position[1]);
	transform.rotateSelf(math.radiansToDegrees(point.angle));
	transform.translateSelf(point.shape.position[0], point.shape.position[1]);

	const px = transform.e;
	const py = transform.f;

	const [rx, ry] = rectangle.shape.position;
	const [width, height] = rectangle.shape.data;

	const left = rx - width * 0.5;
	const right = rx + width * 0.5;
	const top = ry - height * 0.5;
	const bottom = ry + height * 0.5;

	return (
		px >= left
		&& px <= right
		&& py >= top
		&& py <= bottom
	);
};
