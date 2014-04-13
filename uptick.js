require('raf.js'); // polyfills requestAnimationFrame
var keyAlias = require('keycode');

exports.scene = function() {
	var displaying = false;
	var width, height, ctx;
	var entities = {};
	var state = {};
	var inputTracker;

	function drawLoop() {
		if (!displaying) return;
		state = tick(entities, state);
		inputTracker.tick();
		ctx.clearRect(0, 0, width, height);
		draw(ctx, entities, state);
		requestAnimationFrame(drawLoop);
	}

	function tick(nodeEntities, nodeState) {
		var newState = {};
		Object.keys(nodeEntities).forEach(function(entityKey) {
			var entity = nodeEntities[entityKey];
			newState[entityKey] = entity.update(nodeState[entityKey], state, inputTracker.input);
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
			inputTracker = makeInputTracker(canvas);
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

function makeInputTracker(canvas) {
	var input = {
		keysDown: {},
		keysUp: {},
		keysHeld: {},
		click: false,
		clickHeld: false,
		mouseLoc: [0, 0]
	};

	function tick() {
		input.keysUp = {};
		input.keysDown = {};
		input.click = false;
	}

	addEventListener('mousedown', function(e) {
		input.click = true;
		input.clickHeld = true;
	});

	addEventListener('mouseup', function(e) {
		input.clickHeld = false;
	});

	addEventListener('mousemove', function(e) {
		input.mouseLoc = [
			Math.max(0, e.pageX - canvas.offsetLeft),
			Math.max(0, e.pageX - canvas.offsetTop)
		];
	});

	addEventListener('keydown', function(e) {
		var keyCode = e.which || e.keyCode;
		var alias = keyAlias(keyCode);
		input.keysDown[keyCode] = input.keysDown[alias] = true;
		input.keysHeld[keyCode] = input.keysHeld[alias] = true;
	});

	addEventListener('keyup', function(e) {
		var keyCode = e.which || e.keyCode;
		var alias = keyAlias(keyCode);
		input.keysDown[keyCode] = input.keysDown[alias] = false;
		input.keysHeld[keyCode] = input.keysHeld[alias] = false;
	});

	return {
		input: input,
		tick: tick
	};
}
