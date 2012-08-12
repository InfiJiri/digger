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
	direction: {x:0,y:0},
	getNormalizedPosition: function() {
		return this._map.getNormalizedEntityPosition(this);
	},
	collide: function(entity) {
		if (entity.type == "monster") { // Touch enemy?
			this.kill();
		}
	},
	respawn: function() {
		var position = this.getStartPosition();

		this._map.setEntityNormalizedPosition(this, position.x, position.y);

		this.action = "stand";
	},
	getStartPosition: function() {
		var data    = this._map.getStartData();
		var numCols = this._map.getNumCols();

		for( var y=0; y<data.length/numCols; y++ ) {
			for( var x=0; x<numCols; x++ ) {
				if ((data[(y * numCols) + x] & 0xF0 ) == D) { // value - walls = Digger?
					return {x:x, y:y};
				}
			}
		}
	},
	kill: function() {
		//alert("This kills the Digger");
		this.action = "die";

		this.vx = this.vy = 0;
	},
	update: function() {
		var cd = {
			width: this._map.getNumCols() * this._map.getTileWidth(),
			height: this._map.getNumRows() * this._map.getTileHeight()
		};

		var np = this.getNormalizedPosition();
		if ( this.vx ) {
			if ( this._map.isEntityInRow(this) ) { // Exit / enter column
				this.action = (this.vx>0) ? "moveright" : "moveleft";
				this.x = Math.min(Math.max(this._map.getOffsetX() + this._map.getEntityOffsetWidth(this), this.x + this.vx), this._map.getOffsetX() + cd.width - this.width - this._map.getEntityOffsetWidth(this));
			} else if ( this.vy==0 ) { // Digger wants to move horizontaly, but is not in a row -> move to nearest row
				var speed = (this.action=="movedown") ? this.speed : -this.speed;

				this.y = Math.min(Math.max(this._map.getOffsetY() + this._map.getEntityOffsetHeight(this), this.y + speed), this._map.getOffsetY() + cd.height - this.height - this._map.getEntityOffsetHeight(this));
			}
		}

		if ( this.vy ) {
			if (this._map.isEntityInColumn(this)) { // Exit / enter row
				this.action = (this.vy>0) ? "movedown" : "moveup";
				this.y = Math.min(Math.max(this._map.getOffsetY() + this._map.getEntityOffsetHeight(this), this.y + this.vy), this._map.getOffsetY() + cd.height - this.height - this._map.getEntityOffsetHeight(this));
			} else if (this.vx==0) { // Digger wants to move vertically, but is not in a column -> move to nearest column
				var speed = (this.action=="moveright") ? this.speed : -this.speed;

				this.x = Math.min(Math.max(this._map.getOffsetX() + this._map.getEntityOffsetWidth(this), this.x + speed), this._map.getOffsetX() + cd.width - this.width - this._map.getEntityOffsetWidth(this));
			}
		}	
	},
	animate: function(context, interpolation) {
		this._timer.tick();

		var animation = this._animations[this.action];
		animation.animate(this._timer.getSeconds());

		var frame = animation.getSprite();

		//debug("WH: " + this.x + " " + this.y);

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