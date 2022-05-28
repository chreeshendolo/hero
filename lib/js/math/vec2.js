"use strict";

const vec2 = {};

vec2.magnitude = function (v2) {
	return Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
};

vec2.angle = function (v2) {
	return Math.atan2(v2[1], v2[0]);
};

vec2.fromAngle = function (angle, out) {
	out[0] = Math.cos(angle);
	out[1] = Math.sin(angle);
	return out;
};

vec2.normalize = function (v2, out) {
	const magnitude = this.magnitude(v2);
	out[0] = v2[0] / magnitude;
	out[1] = v2[1] / magnitude;
	return out;
};

vec2.scale = function (v2, scale, out) {
	const magnitude = this.magnitude(v2);
	out[0] = v2[0] * scale;
	out[1] = v2[1] * scale;
	return out;
};

vec2.subtract = function (v2a, v2b, out) {
	out[0] = v2a[0] - v2b[0];
	out[1] = v2a[1] - v2b[1];
	return out;
};

vec2.add = function (v2a, v2b, out) {
	out[0] = v2a[0] + v2b[0];
	out[1] = v2a[1] + v2b[1];
	return out;
};
