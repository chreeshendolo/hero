"use strict";

const Rendering = {};

Rendering.components = [Render, Position, Angle];

Rendering.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	const canvas = renderer.canvas;
	const ctx = renderer.ctx;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [render, position, angle] = core.getComponents(entityID, this.components);

		ctx.translate(position[0], position[1]);
		ctx.rotate(angle);

		ctx.save();
		for (let ii = 0; ii < render.length; ii++) {
			RENDER[render[ii]](core, ctx, entityID);
			ctx.restore();
		}

		ctx.resetTransform();
	}

};
