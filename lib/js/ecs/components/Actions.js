"use strict";

const Actions = {};

Actions.type = "actions";

Actions.create = function () {
	return [];
};

Actions.inactive = {};

Actions.deactivate = function (action) {
	if (this.inactive[action.type] === undefined) {
		this.inactive[action.type] = [];
	}
	this.inactive[action.type].push(action);
};

Actions.get = function (type) {
	if (this.inactive[type] === undefined || this.inactive[type].length < 1) {
		return {type, data: this[type]()};
	}
	return this.inactive[type].pop();
};

Actions[ACTION_TYPE.MOVE] = function () {
	return [0, 0];
};

Actions[ACTION_TYPE.ROTATE] = function () {
	return 0;
};

Actions[ACTION_TYPE.ROTATE_AT] = function () {
	return [0, 0];
};

Actions[ACTION_TYPE.SET_POINT_OF_INTEREST] = function () {
	return [0, 0];
};
