var Emerald = function() {
	debug("Emerald.init");

	this._image = new Image();
	this._image.src = "images/emerald.png";
};

Emerald.prototype = {
	_image: null,

	x: 0,
	y: 0,
	width: 23,
	height: 18,

	draw: function(context) {
		context.drawImage(this._image, this.x, this.y);
	}
};