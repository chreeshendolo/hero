"use strict";

const Faction = {};

Faction.type = "faction";

Faction.create = function () {
	return {
		type: FACTION_TYPE.NEUTRAL,
		enemies: [],
		friends: [],
	};
};
