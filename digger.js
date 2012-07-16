var Digger = function() {
	debug("Digger.init");

	// FIXME clean-up (testing purposes)
	// this.entities.push(new Digger());
	self = this;
	document.onkeydown = function(e) {
		switch( e.keyCode ) {
			case 37: // LEFT
				self.vx = -2;
				self.vy = 0;
				break;
			case 38: // UP
				self.vx = 0;
				self.vy = -2;
				break;
			case 39: // RIGHT
				self.vx = 2;
				self.vy = 0;
				break;
			case 40: // DOWN
				self.vx = 0;
				self.vy = 2;
				break;
		}
	};

	document.onkeyup = function(e) {
		self.vx = 2;
		self.vy = 0;
	};	
};

Digger.prototype = {
	vx: 2,
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