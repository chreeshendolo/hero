"use strict";

const Pickup = {};

Pickup.type = "pickup";

Pickup.create = function () {
	return {used: false, action: {type: ACTION_TYPE.NONE, data: []}};
};
