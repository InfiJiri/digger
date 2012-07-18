var Hobbin = function(map) {
	debug("Hobbin.init");

	this._image = new Image();
	this._image.src = "images/hobbin.png";
	this._timer = new FrameTimer();
	this._map = map;
};

Hobbin.prototype = {
	_animations: {},
    action: "stand",
	type: "hobbin",
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	speed:  2,
	height: 34,
	width:  34,

	kill: function() {
		alert("This kills the Hobbin");
	},
	update: function() {

	},
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	}
}