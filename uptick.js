exports.scene = function() {
	var displaying = false;
	var width, height, ctx;
	var entities = {};
	var state = {};

	function drawLoop() {
		if (!displaying) return;
		state = tick(entities, state);
		ctx.clearRect(0, 0, width, height);
		draw(ctx, entities, state);
		requestAnimationFrame(drawLoop); // TODO: polyfill
	}

	function tick(nodeEntities, nodeState) {
		var newState = {};
		Object.keys(nodeEntities).forEach(function(entityKey) {
			var entity = nodeEntities[entityKey];
			newState[entityKey] = entity.update(nodeState[entityKey], state, {} /* TODO */);
			Object.keys(entity.children).forEach(function(childKey) {
				newState[childKey] = tick(entities[childKey], nodeEntities[entityKey], nodeState[entityKey]);
			});
		});
		return newState;
	}

	function draw(ctx, nodeEntities, nodeState) {
		Object.keys(nodeEntities).forEach(function(entityKey) {
			var entityState = nodeState[entityKey];
			var entity = nodeEntities[entityKey];
			if (!entity.drawChildrenFirst) entity.draw(ctx, entityState, state);
			draw(ctx, entity.children, entityState);
			if (entity.drawChildrenFirst) entity.draw(ctx, entityState, state);
		});
	}

	function addToState(name, entity, state) {
		state[name] = entity.initial;
		Object.keys(entity.children).forEach(function (childKey) {
			addToState(childKey, entity.children[childKey], state[name]);
		});
	}

	var defaultEntity = {
		initial: {},
		update: function(s) { return s; },
		draw: function() {},
		children: {},
	};

	function inherit(a, b) {
		var result = Object.create(a);
		Object.keys(b).forEach(function(k) { result[k] = b[k]; });
		return result;
	}

	var scene = {
		show: function(canvas) {
			displaying = true;
			ctx = canvas.getContext('2d');
			width = canvas.width;
			height = canvas.height;
			drawLoop();
		},
		pause: function() {
			displaying = false;
		},
		reset: function() {
			state = {};
			Object.keys(entities).forEach(function(entityKey) {
				addToState(entityKey, entities[entityKey], state);
			});
		},
		addEntity: function(name, entity) {
			entities[name] = inherit(defaultEntity, entity);
			addToState(name, entities[name], state);
		}
	};

	return scene;
};

// TODO: drawOrder, arrays in children
