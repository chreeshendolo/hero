"use strict";

const Physics = {};

Physics.components = [Velocity, Speed, Position];

Physics.update = function (core, deltaTime) {
	const entities = core.getEntities(this.components);

	for (let i = 0; i < entities.length; i++) {
		const entityID = entities[i];
		const [velocity, speed, position] = core.getComponents(entityID, this.components);

		position[0] += velocity[0] * speed * (deltaTime / 1000);
		position[1] += velocity[1] * speed * (deltaTime / 1000);

		velocity[0] = velocity[1] = 0;
	}

};
