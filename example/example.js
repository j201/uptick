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
