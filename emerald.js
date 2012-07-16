var Emerald = function() {
	debug("Emerald.init");

	this._image = new Image();
	this._image.src = "images/emerald.png";
};

Emerald.prototype = {
	_image: null,

	v: 0,
	x: 0,
	y: 0,

	draw: function(context, interpolate) {
		context.drawImage(this._image, this.x, this.y + this.v);
	}
};