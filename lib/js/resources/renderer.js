"use strict";

const renderer = {};

renderer.canvas = undefined;
renderer.ctx = undefined;

renderer.initialize = function (width, height) {
	const canvas = this.canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.style.backgroundColor = "#000";
	document.body.appendChild(canvas);

	this.ctx = canvas.getContext("2d");
};
