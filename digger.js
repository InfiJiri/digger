var Digger = function() {
	debug("Digger.init");

	var sprites = new SpriteSheet({
		width: 35,
		height: 33,
		sprites: [
			{ name: "walk1", x: 0, y: 1 },
			{ name: "walk2", x: 0, y: 1 },
			{ name: "walk3", x: 0, y: 1 },
		]
	});

	this._animations = {
		"walk": new Animation([
			{ sprite: "walk1", time: 0.1 },
			{ sprite: "walk2", time: 0.1 },
			{ sprite: "walk3", time: 0.1 },
		], sprites)
	};

	this._image = new Image();
	this._image.src = "images/digger.png";
};

Digger.prototype = {
	//_image: null,
	_timer: new FrameTimer(),
	_animations: {},
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	speed:  4,
	height: 33,
	width:  35,
	move: function(direction) {
		
	},
	collide: function(entity) {
		if (entity.type=="emerald") {
			entity.dispose();

			
		}
	},
	animate: function(context, interpolation) {
		this._timer.tick();
		var walk = this._animations["walk"];
		walk.animate(this._timer.getSeconds());
		var frame = walk.getSprite();

		context.drawImage(this._image,
			frame.x,
			0, // FIXME FRAME Y
			this.width,
			this.height,
			this.x + this.vx * interpolation,
			this.y + this.vy * interpolation,
			this.width,
			this.height);
	},
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	}
}