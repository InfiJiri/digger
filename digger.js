var Digger = function(map) {
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
			"die1": { x: 0, y: 4 },	// Dead Digger
			"die2": { x: 1, y: 5 }, // RIP 25%
			"die3": { x: 0, y: 5 }, // RIP 50%
			"die4": { x: 2, y: 4 }, // RIP 75%
			"die5": { x: 1, y: 4 }, // RIP full
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
		], sprites),
		"die": new Animation([
			{ sprite: "die1", time: 1.0 },
			{ sprite: "die2", time: 0.2 },
			{ sprite: "die3", time: 0.2 },
			{ sprite: "die4", time: 0.2 },
			{ sprite: "die5", time: null },
		], sprites),		
	};

	this._image = new Image();
	this._image.src = "images/digger.png";
	this._timer = new FrameTimer();
	this._map = map;
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
	collide: function(entity) {
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
					var np = this._map.getNormalizedEntityPosition(this);
					var x  = this.x>entity.x ? this.x - 1 : this.x + 1;

					entity.moveToField(x, entity.y);
				} else if ( this.y >= entity.y && (this.x >= bagCenter && this.x <= maxX) ) { // Digging below bag
					entity.initFall(map);
				} else {
					//debug(this.x);
					//debug(entity.width * 0.5);
				}
				// FIMXE Implement
			} else if (entity.state == "bagfall") {
				//debug("KEIDOOD");
				this.kill();
			}
		}
	},
	kill: function() {
		//alert("This kills the Digger");
		this.action = "die";
	},
	update: function() {
		//cd = this._map.getCanvasDimensions();
		var cd = {
			width: this._map.getNumCols() * this._map.getTileWidth(),
			height: this._map.getNumRows() * this._map.getTileHeight()
		};

		if ( this.vx ) {
			if ( this._map.isEntityInRow(this) ) {
				this.action = (this.vx>0) ? "moveright" : "moveleft";
				this.x = Math.min(Math.max(0, this.x + this.vx), cd.width - this.width);
			} else if ( this.vy==0 ) { // Digger wants to move horizontaly, but is not in a row -> move to nearest row
				var speed = (this.action=="movedown") ? this.speed : -this.speed;

				this.y = Math.min(Math.max(0, this.y + speed), cd.height - this.height);
			}
		}

		if ( this.vy ) {
			if (this._map.isEntityInColumn(this)) {
				this.action = (this.vy>0) ? "movedown" : "moveup";
				this.y = Math.min(Math.max(0, this.y + this.vy), cd.height - this.height);
			} else if (this.vx==0) { // Digger wants to move vertically, but is not in a column -> move to nearest column
				var speed = (this.action=="moveright") ? this.speed : -this.speed;

				this.x = Math.min(Math.max(0, this.x + speed), cd.width - this.width);
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