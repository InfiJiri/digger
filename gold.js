var Gold = function() {
	debug("Gold.init");

	var sprites = new SpriteSheet({
		width: 34,
		height: 34,
		sprites: {
			"bag":       { x: 0, y: 0 },
			"moveleft":  { x: 1, y: 0 },
			"moveright": { x: 2, y: 0 },
			"bagfall":   { x: 3, y: 0 },
			"gold":      { x: 1, y: 1 },
			"goldfall":  { x: 0, y: 1 }			
		}
	});

	this._animations = {
		"bag": new Animation([
			{ sprite: "bag", time: 0.1 }
		], sprites),
		"move": new Animation([
			{ sprite: "moveleft", time: 0.4 },
			//{ sprite: "bag", time: 0.4 },
			{ sprite: "moveright", time: 0.4 },
			//{ sprite: "bag", time: 0.4 },
		], sprites),
		"bagfall": new Animation([
			{ sprite: "bagfall", time: 0.1 },
		], sprites),
		"goldfall": new Animation([
			{ sprite: "goldfall", time: 0.1 }
		], sprites),
		"gold": new Animation([
			{ sprite: "gold", time: 0.1 }
		], sprites)
	};	

	this._image = new Image();
	this._image.src = "images/gold.png";
};

Gold.prototype = {
	_timer: new FrameTimer(),
	_animations: {},
	state: "bag",	
	x     : 0,
	y     : 0,
	width : 34,
	height: 34,	
	vy    : 0,
	speed : 0,
	type: "gold",
	animate: function(context, interpolation) {
		this._timer.tick();

		var animation = this._animations[this.state];
		animation.animate(this._timer.getSeconds());

		var frame = animation.getSprite();

		context.drawImage(this._image,
			frame.x,
			frame.y,
			this.width,
			this.height,
			this.x,
			this.y, //this.y + this.vy * interpolation,
			this.width,
			this.height);
	},
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	}
};