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
	vspeed : 3,
	type: "gold",
	target: null,
	initFall: function() {
		this.state = "shake";
		this._fallStart = (new Date).getTime();
	},
	isMoving: function() {
		return this.target!==null;
	},
	moveToField: function(x, y) {
		var np = this._map.getNormalizedEntityPosition(this);
		if (y > np.y) {
			this.state = "bagfall";

			this.vy += this.vspeed;
		}

		debug( x + " " + y );
		this.target = {x:x, y:y};
	},
	moveHorizontal: function(pusherEntity, targetX) {
		var np = this._map.getNormalizedEntityPosition(this);

		this.vx = (targetX < np.x) ? -pusherEntity.speed : pusherEntity.speed;
		this.vx *= 2;

		this.target = {x:targetX, y:np.y};
	},
	fall: function() {
		var np        = this._map.getNormalizedEntityPosition(this);
		var nextRow   = np.y + 1;
		var index     = (nextRow * this._map._numcols) + np.x; // Row + col below bag

		if( this._map.getMapData()[ index ] == 0 && index<this._map.getMapData().length) { // Row below bag is empty?
			index += this._map._numcols;

			this.moveToField( np.x, np.y + 1 );
		} else if (this.y >= (this.target.y * this._map._tileHeight)) {
			this.vx = this.vy = 0;
			this.y = this.target.y * this._map._tileHeight;

			if (this.state == "bagfall") {
				this.state = "goldfall";

				this._fallGoldStart = (new Date).getTime();
			}
		}
	},
	update: function() {
		if (this.isdisposed) { // Object is not part of the game anymore
			return;
		}

		if (
			this.state == "shake" &&
			this._fallDelay <= (new Date).getTime() - this._fallStart ) { // Done shaking? Fall!
			
			this.fall();
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
			} else if ( this.target.x == np.x && this.target.y == np.y ) {
				this.vx = this.vy = 0;
				this.target = null;
			}

			this.x += this.vx;
			this.y += this.vy;
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