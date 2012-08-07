var Core = function(canvas, mapCanvas, levels, frameTimer, hud) {
	debug("Core.init");

	this._canvas     = canvas;
	this._mapCanvas  = mapCanvas;
	this._context    = canvas.getContext("2d");
	this._frametimer = frameTimer;

	this._levels     = levels;
	
	this._hud 		 = hud

	// FIXME
	// Hmpf the handling of these key events should be
	// in the Digger class, but it doesn't work (probably
	// some reference / clone issue)
	var self = this;
	document.onkeydown = function(e) {
		var digger = self.getDigger();

		if (digger.action == "die") {
			return;
		}

		
		// direction
		// 0 = neutral
		// 1 = up
		// 2 = right
		// 4 = down
		// 8 = left
		
		switch( e.keyCode ) {
			case 90: // Z
				Debug.enabled = !Debug.enabled;
				break;
			case 32: // SPACE
				self.togglePause();
				break;
			case 65:
			case 37: // LEFT
				digger.direction = 8;
				digger.vx = -digger.speed;

				break;
			case 87:
			case 38: // UP
				digger.vy = -digger.speed;
				digger.direction = 1;

				break;
			case 68:
			case 39: // RIGHT
				digger.vx = digger.speed;
				digger.direction = 2;

				break;
			case 83:
			case 40: // DOWN
				digger.vy = digger.speed;
				digger.direction = 4;

				break;
		}
	};

	document.onkeyup = function(e) {
		var digger = self.getDigger();
		switch( e.keyCode ) {
			case 65:
			case 68:
			case 37: // LEFT
			case 39: // RIGHT
				digger.vx        = 0;
				digger.direction = 0;
				
				break;
			case 87:
			case 83:
			case 38: // UP
			case 40: // DOWN
				digger.vy        = 0;
				digger.direction = 0;
				break;
		}
	};

	Debug.setFrameTimer(frameTimer);
}

Core.prototype = {
	_canvas:       null,
	_context:      null,
	_currentLevel:  0,
	_frametimer:   null,
	_nextGameTick: null,
	_intervalId:   false,
	_map:          null,
	isover:        false,
	fps:           50,
	getDigger: function() { // Player
		return this._map.getDigger();
	},
	togglePause:   function() {
		debug("Core.togglePause(pause:" + (this._intervalId===false ? "off" : "on") + ")");

		var self = this;
		if (this._intervalId===false) {
			this._nextGameTick = (new Date).getTime(); // Interpolation reset
			this._intervalId   = setInterval( function() { self.step(); } , 0);
		} else {
			clearInterval(this._intervalId);
			this._intervalId = false;
		}
	},
	gameOver: function() {
		this.isover = true;
		this.playSong();
		
		var self = this;
		setTimeout(function() { self.reset(); }, 5000);
	},
	goToNextLevel: function() {
		if (this._currentLevel == this._levels.length - 1) {
		 this._currentLevel = 0;
		} else {
			this._currentLevel++;
		}

		this.reset();
	},
	reset: function(fullReset) {
		debug("Core.reset");

		if (fullReset) {
			this._currentLevel = 0;
		}
		
		if (this._intervalId!==false) { // Enforce PAUSE
			clearInterval(this._intervalId);
			this._intervalId = false;
		}

		this.isover = false;		

		this._map = new Map(this._levels[this._currentLevel]);
		this._mapRenderer = new MapRenderer(this._mapCanvas, this._map);		
		
		this._hud.reset();

		this._mapRenderer.reset();

		this.playSong();
		// Undo pause
		this.togglePause();
	},
	update: function() {
		//debug("Core.update");
		if (this.getDigger().action == "die") {
			if (!this.isover) {
				this.gameOver();
			}
			return;
		}
		
		// Update all entities in the game
		for( var i=0; i<this._map.entities.length; i++ ) {
			var entity = this._map.entities[i];
			if (entity.update) {
				entity.update();
			}
		}

		this._map.update();
		if (this._map.getEmeraldCount()==0) {
			this.goToNextLevel();
			return;
		}

		this._mapRenderer.update();

		this.detectcollision();	

		this._frametimer.tick();
	},
	detectcollision: function() {
		// Detect collisions between all entities in the game
	
		// Not super-efficient, but that can be fixed when shit starts hitting the fan
		for( var i=0; i<this._map.entities.length; i++ ) {
			var entity1 = this._map.entities[i];
			if (entity1.isdisposed) { // Entity is not part of the game anymore
				continue;
			}

			for( var j=0; j<this._map.entities.length; j++ ) {
				var entity2 = this._map.entities[j];
				if (j==i || entity2.isdisposed) { // Don't detect collision with self, and don't collide entities that aren't part of the game anymore
					continue;
				}
				
				if (this._map.isEntityTouching(entity1, entity2)) {

					if (entity2.collide) { // Entity has 'collide' function?
						entity2.collide(entity1);
					}					
				}
			}
		}
	},
	playSong: function() {
		if (!Debug.enableSound) {
			return;
		}

		var popcorn = "http://www.youtube.com/v/oVO3r16tiek&autoplay=1";
		var funeral = "http://www.youtube.com/v/5NKMk8IpcV8&autoplay=1";

		// FIXME testing purposes
		var url = (this.getDigger().action == "die") ? funeral : popcorn;

		var song = document.getElementById("song");
		song.src = url;
	},
	draw: function(interpolation) {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

		for( var i=0; i<this._map.entities.length; i++ ) {
			var entity = this._map.entities[i];

			if (entity.draw) {
				entity.draw(this._context, interpolation);
			}
		}

		
		// Debug -> move to debug
		if (!Debug.enabled) {
			return;
		}

		for( var i=0; i < this._map._map.length; i++ ) {
			var y = Math.floor(i / this._map.getNumCols());
			var x = i % this._map.getNumCols();

			this._context.fillStyle = "#ffffff";
			this._context.fillText( this._map.getPositionValue(x,y), x * this._map.getTileWidth() + 0.5*this._map.getTileWidth(), y * this._map.getTileHeight() + this._map.getOffsetY() + 0.5 * this._map.getTileHeight() );
		}
		
		//this._mapRenderer.reset();
		Debug.updateFps();
	},
	step: function() {
		
		//http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
		var loops     = 0;
		var skipTicks = 1000 / this.fps;

		// TODO use FrameTimer?
		while ((new Date).getTime() > this._nextGameTick) {
		  this.update();

		  this._nextGameTick += skipTicks;
		  loops++;
		}

		if (!loops) {
		  this.draw((this._nextGameTick - (new Date).getTime()) / skipTicks);
		} else {
		  this.draw(0);
		}
	}
};