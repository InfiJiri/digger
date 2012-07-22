var Emerald = function(map) {
	debug("Emerald.init");

	this._image = new Image();
	this._image.src = "images/emerald.png";

	this._map = map;
};

Emerald.prototype = {
	type: "emerald",
	isdisposed: false,
	x: 0,
	y: 0,
	width: 34,
	height: 34,
	collide: function(entity) {
		if (entity.type=="digger" || (entity.type=="monster" && entity.isHobbin()) ) {
			this.dispose();
		}
	},	
	dispose: function() {
		this.isdisposed = true;
	},
	draw: function(context) {
		if (!this.isdisposed) {
			context.drawImage(this._image, this.x, this.y);
		}
	}
};