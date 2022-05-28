"use strict";

const random = {};

random.id = function () {
	const available = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let id = "";
	let length = 10;
	while (--length > 0) {
		id += available[Math.floor(Math.random() * available.length)];
	}

	return id;
};
