var Core = function(canvas, frameTimer, map) {
	debug("Core.init");

	this._canvas     = canvas;
	this._context    = canvas.getContext("2d");
	this._frametimer = frameTimer;
	this.map         = map;

	// FIXME
	// Hmpf the handling of these key events should be
	// in the Digger class, but it doesn't work (probably
	// some reference / clone issue)
	var self = this;
	document.onkeydown = function(e) {
		var digger = self.getDigger();

		switch( e.keyCode ) {
			case 32: // SPACE
				self.togglePause();
				break;
			case 37: // LEFT
				digger.vx = -digger.speed;

				break;
			case 38: // UP
				digger.vy = -digger.speed;

				break;
			case 39: // RIGHT
				digger.vx = digger.speed;

				break;
			case 40: // DOWN
				digger.vy = digger.speed;

				break;
		}
	};

	document.onkeyup = function(e) {
		var digger = self.getDigger();
		switch( e.keyCode ) {
			case 37: // LEFT
			case 39: // RIGHT
				digger.vx = 0;
				
				break;
			case 38: // UP
			case 40: // DOWN
				digger.vy = 0;
				break;
		}
	};

	Debug.setFrameTimer(frameTimer);
}

Core.prototype = {
	_canvas:       null,
	_context:      null,
	_frametimer:   null,
	_nextGameTick: null,
	_intervalId:   false,
	ispaused:      false,
	fps:           50,
	map:           null,
	getDigger: function() { // Player
		return this.map.digger;
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
	reset: function() {
		debug("Core.reset");

		if (this._intervalId!==false) { // Enforce PAUSE
			clearInterval(this._intervalId);
			this._intervalId = false;
		}

		this.map.reset();
		
		// Undo pause
		this.togglePause();
	},
	update: function() {
		//debug("Core.update");

		// Update all entities in the game
		for( var i=0; i<this.map.entities.length; i++ ) {
			var entity = this.map.entities[i];
			if (entity.update) {
				entity.update();
			}
		}
		
		this.map.update();

		this.detectcollision();	

		this._frametimer.tick();
	},
	detectcollision: function() {
		// Detect collisions between all entities in the game
	
		// Not super-efficient, but that can be fixed when shit starts hitting the fan
		for( var i=0; i<this.map.entities.length; i++ ) {
			var entity1 = this.map.entities[i];
			if (entity1.isdisposed) { // Entity is not part of the game anymore
				continue;
			}

			for( var j=0; j<this.map.entities.length; j++ ) {
				var entity2 = this.map.entities[j];
				if (j==i || entity1.isdisposed) { // Don't detect collision with self, and don't collide entities that aren't part of the game anymore
					continue;
				}

				if (
					(entity1.x >= entity2.x || (entity1.x+entity1.width) >= entity2.x) &&
					(entity1.x <= (entity2.x + entity2.width) || entity1.x <= (entity2.x + entity2.width) ) &&
					(entity1.y >= entity2.y || (entity1.y+entity1.height) >= entity2.y) &&
					(entity1.y <= (entity2.y + entity2.height) || entity1.y <= (entity2.y + entity2.height)) ) {

					if (entity2.collide) { // Entity has 'collide' function?
						entity2.collide(entity1, this.map);
					}
				}
			}
		}
	},
	draw: function(interpolation) {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

		for( var i=0; i<this.map.entities.length; i++ ) {
			var entity = this.map.entities[i];

			entity.draw(this._context, interpolation);
		}

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