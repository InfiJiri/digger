var Gold = function(map) {
	debug("Gold.init");

	var sprites = new SpriteSheet({
		width: 34,
		height: 34,
		sprites: {
			"bag":        { x: 0, y: 0 },
			"shakeleft":  { x: 1, y: 0 },
			"shakeright": { x: 2, y: 0 },
			"bagfall":    { x: 3, y: 0 },
			"gold":       { x: 0, y: 1 },
			"goldfall":   { x: 1, y: 1 }			
		}
	});

	this._animations = {
		"bag": new Animation([
			{ sprite: "bag", time: 0.1 }
		], sprites),
		"shake": new Animation([
			{ sprite: "shakeleft", time: 0.3 },
			{ sprite: "shakeright", time: 0.3 },
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
	this._timer = new FrameTimer();
	this._map = map;	
};

Gold.prototype = {
	//_timer: 
	_animations: {},
	_fallStart: null,
	_fallDelay: 1000, // shake 1 sec before falling
	_fallGoldStart: null,
	_fallGoldDelay: 10, // Display falling gold for 10ms 
	isdisposed: false,
	state: "bag",
	x     : 0,
	y     : 0,
	width : 34,
	height: 34,	
	vx    : 0,
	vy    : 0,
	vspeed : 4,
	type: "gold",
	target: null,
	isMoving: function() {
		return this.target!==null;
	},
	moveToField: function(x, y) {
		var np = this._map.getNormalizedEntityPosition(this);

		var tileHeight = this._map.getTileHeight();
		var tileWidth  = this._map.getTileWidth();
		this.target = {x:tileWidth * x, y:tileHeight * y};
	},
	moveHorizontal: function(pusherEntity, x) {
		var np = this._map.getNormalizedEntityPosition(this);
		if ( x<0 || x==this._map.getNumCols() ) { // Border reached.
			pusherEntity.vx = 0;

			return;
		}

		var tileHeight = this._map.getTileHeight();
		var tileWidth  = this._map.getTileWidth();

		this.vx     = pusherEntity.vx * 2; // Bump bag ahead.
		this.target = {x:tileWidth * x, y:tileHeight * np.y};
	},
	fall: function(fallImmediately) { // fallImmediately -> don't shake
		if (
			this.state == "shake" &&
			this._fallDelay >= (new Date).getTime() - this._fallStart ) { 

			// Wait for it
				
			return;
		}

		// Done shaking? Fall!

		var np        = this._map.getNormalizedEntityPosition(this);
		var nextRow   = np.y + 1;
		var index     = (nextRow * this._map.getNumCols()) + np.x; // Row + col below bag

		if( this._map.getMapData()[ index ] == 0 && index<this._map.getMapData().length ) { // Row below bag is empty?
			if (!fallImmediately && this.state == "bag") { // Initiate delayed fall
				this.state = "shake";

				this._fallStart = (new Date).getTime();
				return;
			}

			this.state = this.state == "gold" ? "gold" : "bagfall";

			this.vy = this.vspeed;
			
			this.moveToField( np.x, nextRow );
		} else if ( this.target && this.y >= this.target.y ) { // Target defined, and no empty row under bag -> stop?
			this.vx = this.vy = 0;
			this.y  = this.target.y;

			if (this.state == "bagfall") {
				this.state = "goldfall";

				this._fallGoldStart = (new Date).getTime();
				this.target = null;
			}
		}
	},
	update: function() {
		if (this.isdisposed) { // Object is not part of the game anymore
			return;
		}

		if (
			this.state == "goldfall" &&
			this._fallGoldDelay <= (new Date).getTime() - this._fallGoldStart ) { // Ha-haaa, gold!

			this.state = "gold";
		}
			

		if (this.isMoving()) {
			var np = this._map.getNormalizedEntityPosition(this);

			if (this.state == "bagfall") {
				this.fall(); // Falling of bag is a special move, and is handled by 'fall' function.	
			} else if (this.state=="bag") { // Moving horizontally
				if ( (this.vx>0 && this.x >= this.target.x) ||
					(this.vx<0 && this.x <= this.target.x) ) { // Reached horizontal destination
					this.vx = this.vy = 0;   // stop
					this.x  = this.target.x; // set exact position

					this.target = null;

					this.fall(true);
				}
			}

			this.x += this.vx;
			this.y += this.vy;
		} else {
			this.fall();
		}
	},
	dispose: function() {
		this.isdisposed = true;
	},
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
			this.y,
			this.width,
			this.height);
	},
	draw: function(context, interpolation) {
		if (!this.isdisposed) {
			this.animate(context, interpolation);
		}
	}
};