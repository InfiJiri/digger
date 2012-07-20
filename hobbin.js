var Hobbin = function(map) {
	debug("Hobbin.init");

	var sprites = new SpriteSheet({
		width: 34,
		height: 34,
		sprites: {
			"walk1": { x: 0, y: 0 },
			"walk2": { x: 1, y: 0 },
			"walk3": { x: 2, y: 0 },
		}
	});

	this._animations = {
		"walk": new Animation([
			{ sprite: "walk1", time: 0.15 },
			{ sprite: "walk2", time: 0.15 },
			{ sprite: "walk3", time: 0.15 },
		], sprites)		
	};	
	
	this._image = new Image();
	this._image.src = "images/hobbin.png";
	this._timer = new FrameTimer();
	this._map = map;
};

Hobbin.prototype = {
	_animations: {},
    action: "walk",
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

	animate: function(context, interpolation) {
		this._timer.tick();

		var animation = this._animations[this.action];
		animation.animate(this._timer.getSeconds());

		var frame = animation.getSprite();

		context.drawImage(this._image,
			frame.x,
			frame.y,
			this.width,
			this.height,
			this.x + this.vx * interpolation,
			this.y + this.vy * interpolation,
			this.width,
			this.height);
	},

	update: function() {

	},
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	}
}