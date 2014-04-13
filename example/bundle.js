;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var uptick = require('../uptick');

var canvas = document.getElementsByTagName('canvas')[0];

var scene = uptick.scene();

var bouncerSpeed = 5;

scene.addEntity('bouncer', {
	initial: {
		y: 250,
		x: 250,
		colour: "red"
	},
	update: function(state, scene, input) {
		return {
			x: input.keysHeld.left ? Math.max(10, state.x - bouncerSpeed) :
				input.keysHeld.right ? Math.min(490, state.x + bouncerSpeed) :
				state.x,
			y: input.keysHeld.up ? Math.max(10, state.y - bouncerSpeed) :
				input.keysHeld.down ? Math.min(490, state.y + bouncerSpeed) :
				state.y,
			colour: input.click ? (state.colour === "red" ? "green" : "red") :
				state.colour
		};
	},
	draw: function(ctx, state) {
		ctx.fillStyle = state.colour;
		ctx.fillRect(state.x - 10, state.y - 10, 20, 20);
	}
});

scene.show(canvas);

},{"../uptick":4}],2:[function(require,module,exports){
// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

var has = ({}).hasOwnProperty

/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'windows': 91,
  'right click': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222
}

// Helper aliases

var aliases = exports.aliases = {
  'ctl': 17,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'escape': 27,
  'pgup': 33,
  'pgdn': 33,
  'ins': 45,
  'del': 46,
  'spc': 32
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}

},{}],3:[function(require,module,exports){
/*
 * raf.js
 * https://github.com/ngryman/raf.js
 *
 * original requestAnimationFrame polyfill by Erik Möller
 * inspired from paul_irish gist and post
 *
 * Copyright (c) 2013 ngryman
 * Licensed under the MIT license.
 */

(function(window) {
	var lastTime = 0,
		vendors = ['webkit', 'moz'],
		requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame,
		i = vendors.length;

	// try to un-prefix existing raf
	while (--i >= 0 && !requestAnimationFrame) {
		requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
	}

	// polyfill with setTimeout fallback
	// heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function(callback) {
			var now = Date.now(), nextTime = Math.max(lastTime + 16, now);
			return setTimeout(function() {
				callback(lastTime = nextTime);
			}, nextTime - now);
		};

		cancelAnimationFrame = clearTimeout;
	}

	// export to window
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
}(window));
},{}],4:[function(require,module,exports){
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

},{"keycode":2,"raf.js":3}]},{},[1])
;