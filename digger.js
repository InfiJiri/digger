var Digger = function() {
	debug("Digger.init");

	// FIXME clean-up (testing purposes)
	// this.entities.push(new Digger());
	self = this;
};

Digger.prototype = {
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	height: 20,
	width:  20,
	animate: function(context, interpolation) {
		context.fillStyle = "#ffffff";

		context.fillRect(this.x + this.vx * interpolation, this.y + this.vy * interpolation, this.width, this.height);
	},
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	}
}