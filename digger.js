var Digger = function() {
	debug("Digger.init");
};

Digger.prototype = {
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	height: 10,
	width:  10,
	animate: function(context, interpolation) {
		context.fillStyle = "#ffffff";
		context.fillRect(this.xy, this.y + this.vy * interpolation, this.width, this.height);
	},
	draw: function(context, interpolation) {
		interpolation = 20;
		this.animate(context, interpolation);
	}
}