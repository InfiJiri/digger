var Digger = function() {
	debug("Digger.init");

	var sprites = new SpriteSheet({
		width: 34,
		height: 34,
		sprites: {
			"moveright1": { x: 0, y: 0 },
			"moveright2": { x: 1, y: 0 },
			"moveright3": { x: 2, y: 0 },
			"moveleft1": { x: 0, y: 1 },
			"moveleft2": { x: 1, y: 1 },
			"moveleft3": { x: 2, y: 1 },
			"moveup1": { x: 0, y: 2 },
			"moveup2": { x: 1, y: 2 },
			"moveup3": { x: 2, y: 2 },			
			"movedown1": { x: 0, y: 3 },
			"movedown2": { x: 1, y: 3 },
			"movedown3": { x: 2, y: 3 },
		}
	});

	this._animations = {
		"moveright": new Animation([
			{ sprite: "moveright1", time: 0.1 },
			{ sprite: "moveright2", time: 0.1 },
			{ sprite: "moveright3", time: 0.1 },
		], sprites),
		"movedown": new Animation([
			{ sprite: "movedown1", time: 0.1 },
			{ sprite: "movedown2", time: 0.1 },
			{ sprite: "movedown3", time: 0.1 },
		], sprites),
		"moveleft": new Animation([
			{ sprite: "moveleft1", time: 0.1 },
			{ sprite: "moveleft2", time: 0.1 },
			{ sprite: "moveleft3", time: 0.1 },
		], sprites),
		"moveup": new Animation([
			{ sprite: "moveup1", time: 0.1 },
			{ sprite: "moveup2", time: 0.1 },
			{ sprite: "moveup3", time: 0.1 },
		], sprites),		
		"stand": new Animation([
			{ sprite: "moveright1", time: 0.1 },
			{ sprite: "moveright2", time: 0.1 },
			{ sprite: "moveright3", time: 0.1 },
		], sprites)
	};

	this._image = new Image();
	this._image.src = "images/digger.png";
};

Digger.prototype = {
	_timer: new FrameTimer(),
	_animations: {},
    action: "stand",
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	speed:  2,
	height: 34,
	width:  34,
	collide: function(entity) {
		if (entity.type=="emerald") {
			entity.dispose();
		}
	},
	animate: function(context, interpolation) {
		this._timer.tick();

		var animation = this._animations[this.action];
		animation.animate(this._timer.getSeconds());

		var frame = animation.getSprite();

		context.drawImage(this._image,
			frame.x,
			frame.y, // FIXME FRAME Y
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