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
	this._timer = new FrameTimer();
};

Digger.prototype = {
	_animations: {},
    action: "stand",
	type: "digger",
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	speed:  2,
	height: 34,
	width:  34,
	collide: function(entity, map) {
		if (entity.type=="emerald") {
			entity.dispose();
		} else if (entity.type=="gold") {
			if (entity.state == "gold") {
				entity.dispose();
			} else if (entity.state == "bag") {
				debug("bag");
				// Due to Digger speed > 1, not all (pixel) positions in the map
				// can be reached.
				var bagCenter = (entity.x + (entity.width * 0.5));
				var maxX      = bagCenter + 1;

				if (this.y == entity.y) { // Pushing bag
					//entity.move(digger.x<entity.x ? "right" : "left" );
				} else if ( this.y >= entity.y && (this.x >= bagCenter && this.x <= maxX) ) { // Digging below bag
					entity.state = "shake";
				} else {
					debug(this.x);
					debug(entity.width * 0.5);
				}
				// FIMXE Implement
			}
		}
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
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	}
}