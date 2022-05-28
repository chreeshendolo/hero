"use strict";

const Interest = {};

Interest.type = "interest";

Interest.create = function () {
	return {
		interested: [],
		pickupable: [],
	};
};
