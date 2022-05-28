"use strict";

const assets = {};

assets.cache = {
	[ASSET_TYPE.IMAGE]: {},
	[ASSET_TYPE.AUDIO]: {},
};

assets.loaded = 0;

assets.load = function (_assets, callback) {
	const cache = this.cache;
	const total = _assets.length;
	assets.loaded = 0;

	for (let i = 0; i < total; i++) {
		const data = _assets[i];
		let asset;
		switch (data.type) {
			case ASSET_TYPE.IMAGE: {
				asset = new Image();
				asset.src = data.uri;
				asset.onload = this.onload.bind(this, total, callback);
				break;
			}
			case ASSET_TYPE.AUDIO: {
				asset = new Audio(data.uri);
				asset.oncanplaythrough = this.onload.bind(this, total, callback);
				break;
			}
			default: throw new Error("INVALID ASSET_TYPE: " + data.type);
		}

		cache[data.type][data.key] = asset;
	}
};

assets.onload = function (total, callback) {
	if (++this.loaded < total) { return; }
	callback();
};

assets.getImage = function (key) {
	return this.cache[ASSET_TYPE.IMAGE][key];
};

assets.getAudio = function (key) {
	return this.cache[ASSET_TYPE.AUDIO][key];
};
