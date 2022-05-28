"use strict";

const input = {};

input.prevent = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"];

input.keyboard = {};

input.mouse = {
	position: [0, 0],
	buttons: [],
};

input.keydown = function (keydown) {
	if (keydown.repeat === true) { return; }
	if (this.prevent.indexOf(keydown.key) >= 0) {
		keydown.preventDefault();
	}

	if (this.keyboard[keydown.key] === undefined) {
		this.keyboard[keydown.key] = {};
	}

	this.keyboard[keydown.key].pressed = true;
	this.keyboard[keydown.key].touched = true;
	this.keyboard[keydown.key].value = 1;
};

input.keyup = function (keyup) {

	if (this.keyboard[keyup.key] === undefined) {
		this.keyboard[keyup.key] = {};
	}

	this.keyboard[keyup.key].pressed = false;
	this.keyboard[keyup.key].touched = true;
	this.keyboard[keyup.key].value = 0;
};

input.contextmenu = function (contextmenu) {
	contextmenu.preventDefault();
};

input.mousemove = function (mousemove) {
	this.mouse.position[0] = mousemove.offsetX;
	this.mouse.position[1] = mousemove.offsetY;
};

input.mousedown = function (mousedown) {
	mousedown.preventDefault();

	if (this.mouse.buttons[mousedown.button] === undefined) {
		this.mouse.buttons[mousedown.button] = {};
	}

	this.mouse.buttons[mousedown.button].pressed = true;
	this.mouse.buttons[mousedown.button].touched = true;
	this.mouse.buttons[mousedown.button].value = 1;
};

input.mouseup = function (mouseup) {
	if (this.mouse.buttons[mouseup.button] === undefined) {
		this.mouse.buttons[mouseup.button] = {};
	}

	this.mouse.buttons[mouseup.button].pressed = false;
	this.mouse.buttons[mouseup.button].touched = true;
	this.mouse.buttons[mouseup.button].value = 0;
};

input.getGamepads = function () {
	return navigator.getGamepads();
};
