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
	_fellMultipleRows: false, // Did the bag fall multiple rows?
	isdisposed: false,
	state: "bag",
	x     : 0,
	y     : 0,
	width : 34,
	height: 34,	
	vx    : 0,
	vy    : 0,
	vspeed: 4,
	hspeed: 4,
	type: "gold",
	target: null,
	direction: {x: 0, y: 0},	
	isMoving: function() {
		return this.target!==null;
	},
	moveToField: function(x, y) {
		var np = this.getNormalizedPosition();

		if (np.x!=x) { // Special action for horizontal movement (pushing)
			if (x < 0 || x >= this._map.getNumCols()) {
				return false;
			}
		
			var direction = (x - np.x);

			for( var i=0; i<this._map.entities.length; i++ ) {
				var entity = this._map.entities[i];
				if (entity.type!="digger" && entity.type!="monster" && entity.type!="gold") {
					continue; // empty field, or emerald -> go
				}

				var npEntity = this._map.getNormalizedEntityPosition(entity);
				if (npEntity.x == x && npEntity.y==y) { // This entity is in the target field, can we move there?
					if ( !( (entity.type=="gold") ? entity.moveHorizontal(this) : false) ) {
						return false;
					}					
				}
			}
		}

		this._map.setPositionValue(np.x, np.y, this._map.getPositionValue(np.x, np.y) & 0x0F); // Update map, remove 'gold'-value
	
		this._map.moveEntityToField(this, x, y);

		return true;
	},
	moveHorizontal: function(pusherEntity) {
		var np        = this.getNormalizedPosition();

		var npEntity = this._map.getNormalizedEntityPosition(pusherEntity);
		
		this.direction.x = (pusherEntity.direction.x > 0 ? 1 : -1);
		if (
			(npEntity.x<np.x && this.direction.x<0) ||
			(npEntity.x>np.x && this.direction.x>0) ) {
			return true;
		}

		var x = np.x + this.direction.x;

		this.vx = pusherEntity.vx * 2; // Bump bag ahead.
		if (!this.moveToField( x, np.y )) {
			this.vx = 0;

			this.direction.x = 0;

			if (pusherEntity.type=="monster" || pusherEntity.type=="digger") {
				if (pusherEntity.type=="monster") {
					pusherEntity.hnt++; // Not able to enter: increase anger
				}

				pusherEntity.x -= pusherEntity.vx;
			}

			return false;
		}

		return true;
	},
	getNormalizedPosition: function() {
		return this._map.getNormalizedEntityPosition(this);
	},
	collide: function(entity) {
		if (entity.type=="digger" || entity.type=="monster" || entity.type=="gold" ) {
			var npEntity = entity.getNormalizedPosition();
			var npGold = this.getNormalizedPosition();

			var npEntityTop    = this._map.getNormalizedPosition(entity.x, entity.y);
			var npEntityBottom = this._map.getNormalizedPosition(entity.x, entity.y + entity.height);

			if (this.state=="bag" || this.state=="bagfall" || this.state=="shake" ) { // Vertical collision
				if ( (npEntityTop.y==npGold.y-1) && entity.vy>0 && (entity.type!="gold") ) {
					entity.y -= entity.vy;
				} else if ( (npEntityBottom.y==npGold.y+1) && entity.vy<0 && (entity.type!="gold") ) {
					entity.y -= entity.vy;
				}
			}

			if (this.state == "bag" ) {
				if ( npEntity.y == npGold.y ) { // Same row: pushing bag
					if (entity.type == "monster" && entity.isHobbin()) { // Hobbin eats bag
						this.dispose();
						return;
					}

					if ( ( (npEntity.x<npGold.x) && (npEntity.y==npGold.y) ) ||
						( (npEntity.x>npGold.x)  && (npEntity.y==npGold.y) ) ) { // Is the entity pushing the bag?
						this.moveHorizontal(entity);
					}
				}
			} else if (this.state == "gold" && (entity.type=="monster" || entity.type=="digger")) {
				this.dispose();

				if (entity.type == "digger") {
					return {score: 500};
				}
			} else if (this.state == "bagfall" && ((entity.y + entity.height)>this.y) && 
				(entity.type=="monster" || entity.type=="digger")) { // Bag to the face?

				return entity.kill();
			}
		} else if (entity.type=="monster" && (this.state=="gold" || this.state=="goldfall") ) { // Both monsters and digger eat gold
			this.dispose();
		}
	},
	fall: function(fallImmediately) { // fallImmediately -> don't shake
		if (
			this.state == "gold" || (
			this.state == "shake" &&
			this._fallDelay >= (new Date).getTime() - this._fallStart )) { 

			// Wait for it

			return;
		}

		// Done shaking? Fall!

		var np        = this._map.getNormalizedEntityPosition(this);
		var nextRow   = np.y + 1;
		var index     = (nextRow * this._map.getNumCols()) + np.x; // Row + col below bag

		if( index<this._map.getMapData().length && this.isEmptyField(index) ) { // Top of row below is open (i.e. row below bag is empty)?
			if (!fallImmediately && this.state == "bag") { // Initiate delayed fall
				this.state = "shake";

				this._fallStart = (new Date).getTime();
				return;
			}

			this.state = this.state == "gold" ? "gold" : "bagfall";

			this.vy = this.vspeed;

			if (this.target && (nextRow > this.target.ny)) { // Fall another row?
				this._fellMultipleRows = true;
			}

			this.moveToField( np.x, nextRow );
		} else if ( this.target && this.y >= this.target.y ) { // Target defined, and no empty row under bag -> stop?
			this.vx = this.vy = 0;
			this.y  = this.target.y;

			if (this.state == "bagfall") {
				this.state = "bag"; // Fall one row? no gold.
				if (this._fellMultipleRows) {
					this.state = "goldfall";

					this._fallGoldStart = (new Date).getTime();
					this.target = null;
				}				
			}
		}
	},
	isEmptyField: function(index) {
		var map = this._map.getMapData();
		
		return ((map[ index ] & 8) == 0) || ((map[ index ] & 2) == 0)|| ((map[ index ] & 1) == 0);
	},
	update: function() {
		if (this.isdisposed) { // Object is not part of the game anymore
			return;
		}

		//this.updatecollisionmask();
		
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

					this._map.setPositionValue(np.x, np.y, this._map.getPositionValue(np.x, np.y) | G); // Update map 'gold'-value (global variable >:( )
					
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