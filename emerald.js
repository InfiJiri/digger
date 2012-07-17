var Emerald = function() {
	debug("Emerald.init");

	this._image = new Image();
	this._image.src = "images/emerald.png";
};

Emerald.prototype = {
	_image: null,
	type: "emerald",
	isdisposed: false,
	x: 0,
	y: 0,
	width: 23,
	height: 18,
	dispose: function() {
		this.isdisposed = true;
	},
	draw: function(context) {
		if (!this.isdisposed) {
			context.drawImage(this._image, this.x, this.y);
		}
	}
};