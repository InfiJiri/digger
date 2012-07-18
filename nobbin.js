var Nobbin = function(map) {
	debug("Nobbin.init");

	this._image = new Image();
	this._image.src = "images/nobbin.png";
	this._timer = new FrameTimer();
	this._map = map;
};

Nobbin.prototype = {
	_animations: {},
    action: "stand",
	type: "nobbin",
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	speed:  2,
	height: 34,
	width:  34,

	kill: function() {
		alert("This kills the Nobbin");
	},
	update: function() {

	},
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	}
}