"use strict";

const RENDER = {};

RENDER[RENDER_TYPE.BOUNDS] = function (core, ctx, entityID) {
	const [bounds] = core.getComponents(entityID, [Bounds]);
	const colliders = bounds.colliders;

	for (let i = 0; i < colliders.length; i++) {
		ctx.save();

		const shape = colliders[i].shape;
		ctx.translate(shape.position[0], shape.position[1]);
		ctx.rotate(shape.angle);

		switch (shape.type) {
			case SHAPE_TYPE.POINT: {
				ctx.fillStyle = "#f00";
				ctx.fillRect(-1, -1, 2, 2);
				break;
			}
			case SHAPE_TYPE.RECTANGLE: {
				const [width, height] = shape.data;

				ctx.strokeStyle = "#f00";
				ctx.strokeRect(-width * 0.5, -height * 0.5, width, height);
				break;
			}
			case SHAPE_TYPE.CIRCLE: {
				const [radius] = shape.data;

				ctx.strokeStyle = "#f00";
				ctx.beginPath();
				ctx.arc(0, 0, radius, 0, Math.PI * 2);
				ctx.closePath();
				ctx.stroke();
				break;
			}
			default: {}
		}

		ctx.restore();
	}

};

RENDER[RENDER_TYPE.INFO] = function (core, ctx, entityID) {
	const [bounds] = core.getComponents(entityID, [Bounds]);
	const colliders = bounds.colliders;

	for (let i = 0; i < colliders.length; i++) {
		ctx.save();

		const shape = colliders[i].shape;
		ctx.translate(shape.position[0], shape.position[1]);
		ctx.rotate(shape.angle);

		switch (shape.type) {
			case SHAPE_TYPE.POINT: {
				ctx.fillStyle = "#fff";
				ctx.fillRect(-1, -1, 2, 2);
				break;
			}
			case SHAPE_TYPE.RECTANGLE: {
				const [width, height] = shape.data;

				ctx.fillStyle = "#fff";
				ctx.fillRect(-width * 0.5, -height * 0.5, width, height);
				break;
			}
			case SHAPE_TYPE.CIRCLE: {
				const [radius] = shape.data;

				ctx.fillStyle = "#fff";
				ctx.beginPath();
				ctx.arc(0, 0, radius, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
				break;
			}
			default: {}
		}

		ctx.restore();
	}

};

RENDER[RENDER_TYPE.MORTAL] = function (core, ctx, entityID) {
	const [mortal, bounds, angle] = core.getComponents(entityID, [Mortal, Bounds, Angle]);

	let y = 0;
	let width = 0;
	for (let i = 0; i < bounds.colliders.length; i++) {
		const collider = bounds.colliders[i];
		if (collider.type !== COLLIDER_TYPE.BODY) { continue; }

		const shape = collider.shape;
		switch (shape.type) {
			case SHAPE_TYPE.CIRCLE:
				y = Math.max(y, shape.data[0]);
				width = Math.max(width, shape.data[0] * 2);
				break;
			case SHAPE_TYPE.RECTANGLE:
				y = Math.max(y, shape.data[1] * 0.5);
				width = Math.max(width, shape.data[0]);
				break;
			default:
		}
	}

	const height = 8;

	ctx.save();

	ctx.rotate(-angle);

	ctx.fillStyle = "#fff";
	ctx.fillRect(-width * 0.5, -y - 12, width, height);

	ctx.fillStyle = "#f00";
	ctx.fillRect(-width * 0.5 + 2, -y - 12 + 2, (width - 4) * mortal[0] / mortal[1], height - 4);

	ctx.restore();

};
