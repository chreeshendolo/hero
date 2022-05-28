"use strict";
const WIDTH = 960;
const HEIGHT = 540;
const core = new Core();

assets.load([
	{type: ASSET_TYPE.IMAGE, key: "indicator_red", uri: "assets/images/indicator_red.png"},
	{type: ASSET_TYPE.AUDIO, key: "simple", uri: "assets/audio/simple.wav"},
], core.start.bind(core));

renderer.initialize(960, 540);

window.addEventListener("keydown", input.keydown.bind(input));
window.addEventListener("keyup", input.keyup.bind(input));
renderer.canvas.addEventListener("contextmenu", input.contextmenu.bind(input));
renderer.canvas.addEventListener("mousemove", input.mousemove.bind(input));
renderer.canvas.addEventListener("mousedown", input.mousedown.bind(input));
renderer.canvas.addEventListener("mouseup", input.mouseup.bind(input));

core.registerComponent(Keyboard);
core.registerComponent(Mouse);
core.registerComponent(Gamepad);
core.registerComponent(Actions);
core.registerComponent(Abilities);
core.registerComponent(Controller);
core.registerComponent(Position);
core.registerComponent(Velocity);
core.registerComponent(Angle);
core.registerComponent(Bounds);
core.registerComponent(Render);
core.registerComponent(Speed);
core.registerComponent(Remove);
core.registerComponent(Mortal);
core.registerComponent(Damage);
core.registerComponent(Interest);
core.registerComponent(Pickup);
core.registerComponent(Ai);
core.registerComponent(Faction);

core.registerArchetype(ARCHETYPE.HERO, [
	Keyboard,
	Mouse,
	// Gamepad,
	Controller,
	Actions,
	Abilities,
	Position,
	Velocity,
	Speed,
	Angle,
	Bounds,
	Render,
	Mortal,
	Interest,
	Remove,
	Faction,
	Damage,
], function (entityID, x, y) {
	const [position, bounds, render, controller, abilities, mortal, faction] = core.getComponents(entityID, [Position, Bounds, Render, Controller, Abilities, Mortal, Faction]);

	faction.type = FACTION_TYPE.GOOD;
	faction.enemies = [FACTION_TYPE.BAD];
	faction.friends = [FACTION_TYPE.GOOD];

	mortal[0] = mortal[1] = 1000;

	abilities[0] = {type: ACTION_TYPE.SPAWN_PROJECTILE, data: [500, 0]};
	abilities[1] = {type: ACTION_TYPE.DASH, data: [1000, 0]};

	core.getComponentRoot(Speed).record[entityID] = 60;

	controller.push(
		{type: CONTROL_TYPE.KEYS_TO_MOVE, data: ["d", "s", "a", "w"]},
		{type: CONTROL_TYPE.KEYS_TO_MOVE, data: ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]},
		{type: CONTROL_TYPE.MOUSE_TO_ROTATE},
		{type: CONTROL_TYPE.MOUSE_TO_POINT_OF_INTEREST},
		{type: CONTROL_TYPE.MOUSE_BUTTONS_TO_ACT, data: [0, 2]},
		// {type: CONTROL_TYPE.GAMEPAD_BUTTONS_TO_MOVE, data: [BUTTON_TYPE.DPAD_RIGHT, BUTTON_TYPE.DPAD_DOWN, BUTTON_TYPE.DPAD_LEFT, BUTTON_TYPE.DPAD_UP]},
		// {type: CONTROL_TYPE.GAMEPAD_BUTTONS_TO_ACT, data: [BUTTON_TYPE.R2]},
		// {type: CONTROL_TYPE.GAMEPAD_BUTTONS_TO_ACT, data: [BUTTON_TYPE.L2]},
		// {type: CONTROL_TYPE.GAMEPAD_AXES_TO_MOVE, data: [BUTTON_TYPE.LEFT_AXES_X, BUTTON_TYPE.LEFT_AXES_Y]},
		// {type: CONTROL_TYPE.GAMEPAD_AXES_TO_ROTATE, data: [BUTTON_TYPE.RIGHT_AXES_X, BUTTON_TYPE.RIGHT_AXES_Y]},
	);

	position[0] = x;
	position[1] = y;

	const body = Collider.create(COLLIDER_TYPE.BODY);
	body.shape = Shape.create(SHAPE_TYPE.CIRCLE);
	body.shape.data[0] = 32;
	body.mask = COLLIDER_TYPE.BODY | COLLIDER_TYPE.PROJECTILE;
	body.responses = [
		{type: COLLIDER_TYPE.BODY, response: RESPONSE_TYPE.DISPLACE},
		{type: COLLIDER_TYPE.PROJECTILE, response: RESPONSE_TYPE.HURT},
	];
	bounds.colliders.push(body);

	// const damage = Collider.create(COLLIDER_TYPE.PROJECTILE);
	// damage.mask = COLLIDER_TYPE.BODY;
	// damage.shape = Shape.create(SHAPE_TYPE.CIRCLE);
	// damage.shape.position[0] = 48;
	// damage.shape.data[0] = 16;
	// // damage.shape.data[1] = 48;
	// bounds.colliders.push(damage);

	const face = Collider.create(COLLIDER_TYPE.NONE);
	face.shape = Shape.create(SHAPE_TYPE.POINT);
	face.shape.position[0] = 16;
	bounds.colliders.push(face);

	const pickup = Collider.create(COLLIDER_TYPE.PICKUP);
	pickup.shape = Shape.create(SHAPE_TYPE.CIRCLE);
	pickup.shape.data[0] = 64;
	pickup.mask = COLLIDER_TYPE.ITEM;
	pickup.responses = [
		{type: COLLIDER_TYPE.ITEM, response: RESPONSE_TYPE.PICKUPABLE},
	];
	bounds.colliders.push(pickup);

	const interest = Collider.create(COLLIDER_TYPE.INTEREST);
	interest.shape = Shape.create(SHAPE_TYPE.POINT);
	interest.mask = COLLIDER_TYPE.ITEM;
	interest.responses = [
		{type: COLLIDER_TYPE.ITEM, response: RESPONSE_TYPE.INTEREST},
	];
	bounds.colliders.push(interest);

	render.push(RENDER_TYPE.BOUNDS, RENDER_TYPE.MORTAL);
});

core.registerArchetype(ARCHETYPE.ENEMY, [
	Gamepad,
	Controller,
	Actions,
	Position,
	Angle,
	Velocity,
	Bounds,
	Render,
	Mortal,
	Remove,
	Abilities,
	Ai,
	Faction,
	Damage,
], function (entityID, x, y) {
	const [position, bounds, render, mortal, controller, abilities, faction] = core.getComponents(entityID, [Position, Bounds, Render, Mortal, Controller, Abilities, Faction]);

	faction.type = FACTION_TYPE.BAD;
	faction.enemies = [FACTION_TYPE.GOOD];
	faction.friends = [FACTION_TYPE.BAD];

	abilities[0] = {type: ACTION_TYPE.SPAWN_PROJECTILE, data: [500, 0]};
	abilities[1] = {type: ACTION_TYPE.DASH, data: [1000, 0]};

	controller.push(
		{type: CONTROL_TYPE.AI},
	);

	core.getComponentRoot(Speed).record[entityID] = 30;

	mortal[0] = mortal[1] = 100;

	position[0] = x;
	position[1] = y;

	const body = Collider.create(COLLIDER_TYPE.BODY);
	body.mask = COLLIDER_TYPE.BODY | COLLIDER_TYPE.PROJECTILE;
	body.responses = [
		{type: COLLIDER_TYPE.BODY, response: RESPONSE_TYPE.DISPLACE},
		{type: COLLIDER_TYPE.PROJECTILE, response: RESPONSE_TYPE.HURT},
	];
	body.shape = Shape.create(SHAPE_TYPE.CIRCLE);
	body.shape.data[0] = 24;
	bounds.colliders.push(body);

	const face = Collider.create(COLLIDER_TYPE.NONE);
	face.shape = Shape.create(SHAPE_TYPE.POINT);
	face.shape.position[0] = 16;
	bounds.colliders.push(face);

	const awareness = Collider.create(COLLIDER_TYPE.AWARENESS);
	awareness.mask = COLLIDER_TYPE.BODY;
	awareness.responses = [
		{type: COLLIDER_TYPE.BODY, response: RESPONSE_TYPE.AWARE},
	];
	awareness.shape = Shape.create(SHAPE_TYPE.CIRCLE);
	awareness.shape.data[0] = 160;
	bounds.colliders.push(awareness);

	render.push(RENDER_TYPE.BOUNDS, RENDER_TYPE.MORTAL);
});

core.registerArchetype(ARCHETYPE.ITEM, [
	Position,
	Angle,
	Bounds,
	Render,
	Pickup,
	Remove,
], function (entityID, x, y) {
	const [
		position,
		bounds,
		render,
		pickup,
	] = core.getComponents(entityID, [
		Position,
		Bounds,
		Render,
		Pickup,
	]);
	position[0] = x;
	position[1] = y;

	pickup.action = {type: ACTION_TYPE.HEAL, data: 50};

	const item = Collider.create(COLLIDER_TYPE.ITEM);
	item.shape = Shape.create(SHAPE_TYPE.RECTANGLE);
	item.shape.data[0] = item.shape.data[1] = 16;
	bounds.colliders.push(item);

	render.push(RENDER_TYPE.BOUNDS);
});

core.registerArchetype(ARCHETYPE.PROJECTILE, [
	Position,
	Angle,
	Velocity,
	Speed,
	Controller,
	Actions,
	Bounds,
	Render,
	Remove,
	Damage,
], function (entityID, x, y, angle, speed) {
	const [position, bounds, render, controller] = core.getComponents(entityID, [Position, Bounds, Render, Controller]);

	core.getComponentRoot(Remove).record[entityID] = false;
	core.getComponentRoot(Angle).record[entityID] = angle;
	core.getComponentRoot(Speed).record[entityID] = speed;
	controller.length = 0;
	controller.push({type: CONTROL_TYPE.ANGLE_TO_MOVE});

	position[0] = x;
	position[1] = y;

	bounds.colliders.length = 0;
	const body = Collider.create(COLLIDER_TYPE.PROJECTILE);
	body.mask = COLLIDER_TYPE.BODY;
	body.responses = [
		{type: COLLIDER_TYPE.BODY, response: RESPONSE_TYPE.REMOVE},
	];
	body.shape = Shape.create(SHAPE_TYPE.CIRCLE);
	body.shape.data[0] = 8;
	bounds.colliders.push(body);
	bounds.responses.length = 0;

	render.length = 0;
	render.push(RENDER_TYPE.BOUNDS);
});

core.registerArchetype(ARCHETYPE.WALL, [
	Position,
	Angle,
	Bounds,
	Render,
], function (entityID, x, y, width, height, angle) {
	const [position, bounds, render] = core.getComponents(entityID, [Position, Bounds, Render]);

	position[0] = x;
	position[1] = y;

	core.getComponentRoot(Angle).record[entityID] = angle ?? 0;

	const body = Collider.create(COLLIDER_TYPE.BODY);
	body.shape = Shape.create(SHAPE_TYPE.RECTANGLE);
	body.shape.data[0] = width;
	body.shape.data[1] = height;
	bounds.colliders.push(body);

	render.push(RENDER_TYPE.BOUNDS);
});

core.registerSystem(Input, Core.PRE_UPDATE);
core.registerSystem(Control, Core.UPDATE);
core.registerSystem(Cooldown, Core.UPDATE);
core.registerSystem(Act, Core.UPDATE);
core.registerSystem(Physics, Core.UPDATE);
core.registerSystem(Collision, Core.UPDATE);
core.registerSystem(Response, Core.UPDATE);
core.registerSystem(Mortality, Core.UPDATE);
core.registerSystem(Removal, Core.UPDATE);
core.registerSystem(Rendering, Core.POST_UPDATE);

core.createArchetype(ARCHETYPE.HERO, 100, 100);
core.createArchetype(ARCHETYPE.ITEM, 300, 350);
core.createArchetype(ARCHETYPE.ENEMY, 300, 300);
core.createArchetype(ARCHETYPE.WALL, WIDTH * 0.5, 8, WIDTH, 16);
core.createArchetype(ARCHETYPE.WALL, WIDTH * 0.5, HEIGHT - 8, WIDTH, 16);
core.createArchetype(ARCHETYPE.WALL, 8, HEIGHT * 0.5, 16, HEIGHT);
core.createArchetype(ARCHETYPE.WALL, WIDTH - 8, HEIGHT * 0.5, 16, HEIGHT);
core.createArchetype(ARCHETYPE.WALL, 200, 200, 64, 64, Math.PI * 0.25);
