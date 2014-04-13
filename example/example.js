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
