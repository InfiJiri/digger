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
	getNormalizedPosition: function() {
		return this._map.getNormalizedEntityPosition(this);
	},	
	collide: function(entity) {
		if (entity.type=="digger" || (entity.type=="monster" && entity.isHobbin()) ) {
			this.dispose();

			if (entity.type == "digger") {
				return {score: 50};
			}
		}
	},	
	dispose: function() {
		this.isdisposed = true;

		// Clean emerald value of map, but keep wall values
		var position = this.getNormalizedPosition();

		this._map.setPositionValue(position.x, position.y, this._map.getPositionValue(position.x, position.y) & 0x0F);
	},
	draw: function(context) {
		if (!this.isdisposed) {
			context.drawImage(this._image, this.x, this.y);
		}
	}
};