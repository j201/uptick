;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var uptick = require('../uptick');

var canvas = document.getElementsByTagName('canvas')[0];

var scene = uptick.scene();

scene.addEntity('bouncer', {
	initial: {
		y: 250,
		goingDown: true
	},
	update: function(state) {
		var goingDown = (state.goingDown && state.y < 490) ||
			(!state.goingDown && state.y < 10);
		return {
			y: state.y + (goingDown ? 10 : -10),
			goingDown: goingDown
		};
	},
	draw: function(ctx, state) {
		ctx.fillStyle = "black";
		ctx.fillRect(240, state.y - 10, 20, 20);
	}
});

scene.show(canvas);

},{"../uptick":2}],2:[function(require,module,exports){

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
		requestAnimationFrame(drawLoop);
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

},{}]},{},[1])
;