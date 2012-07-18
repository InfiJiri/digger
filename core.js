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
				// digger.moveLeft
				self.map.moveEntity(digger, "left");
				//digger.vx = -digger.speed;

				/*var normalizedPos = self.map.getNormalizedEntityPosition(digger);
				debug(normalizedPos.x);
				var x  = digger.x;
				var vx = digger.vx;
				var vy = digger.vy;
				
				digger.y += vy;
				digger.vx = -digger.speed;

				var normalizedPos2 = self.map.getNormalizedEntityPosition(digger);
				
				if (normalizedPos.y!=normalizedPos2.y) {
					digger.y  = y;
					digger.vy = 0;
				} else {
					digger.vx = vx;
					digger.vy = vy;
				}*/

				break;
			case 38: // UP
				self.map.moveEntity(digger, "up");
				//digger.vy = -digger.speed;

				break;
			case 39: // RIGHT
				self.map.moveEntity(digger, "right");

				break;
			case 40: // DOWN
				self.map.moveEntity(digger, "down");
				// digger.vy = digger.speed;

				break;
		}
	};

	document.onkeyup = function(e) {
		//var digger = self.getDigger();
		switch( e.keyCode ) {
			case 37: // LEFT
			case 39: // RIGHT
				//digger.vx = 0;
				
				break;
			case 38: // UP
			case 40: // DOWN
				//digger.vy = 0;
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
		var digger = this.getDigger();
		var normalizedPosition = this.map.getNormalizedEntityPosition(digger);
		
		/*if( pijltjeingedruktomhoogofomlaag && digger.x = digger.xinrooster*40 ) {
			digger.y += vy;
			digger.richting = omhoog of omlaag;
		} else if( pijltjeingedruktlinksofrechts && digger.y = digger.yinrooster*40 ) {
			digger.x += vx;
			digger.richting = links of rechts;
		} else {
			if( digger.x != digger.xinrooster*40 && digger.y != digger.yinrooster*40 ) {
			// loop in de richting waarin je aan het lopen was tot je op een roosterpunt uitkomt.
			
			}
		}*/

		if ( digger.target &&
			normalizedPosition.x ==	digger.target.x &&
			normalizedPosition.y == digger.target.y) {
			digger.target = null;
			digger.vx = 0;
			digger.vy = 0;
		//	digger.x = digger.target.x*40;
		//	digger.y = digger.target.y*40;
		}
		
		if (digger.vx) {
			digger.x += digger.vx;
		} else if (digger.vy) {
			digger.y += digger.vy;
		} else {
			//return;
		}
		
		this.detectcollision();

		this.map.update();

		this._frametimer.tick();
	},
	detectcollision: function() {
		// Not super-efficient, but that can be fixed when shit starts hitting the fan
		var entity2 = this.getDigger();
		for( var i=0; i<this.map.entities.length; i++ ) {
			var entity1 = this.map.entities[i];
		//	for( var j=0; j<this.map.entities; j++ ) {
		//		if (j==i) { // Don't detect collision with self
		//			continue;
		//		}

		//		var entity2 = this.map.entities[j];
						
				if (
					(entity1.x >= entity2.x || (entity1.x+entity1.width) >= entity2.x) &&
					(entity1.x <= (entity2.x + entity2.width) || entity1.x <= (entity2.x + entity2.width) ) &&
					(entity1.y >= entity2.y || (entity1.y+entity1.height) >= entity2.y) &&
					(entity1.y <= (entity2.y + entity2.height) || entity1.y <= (entity2.y + entity2.height)) ) {

					entity2.collide(entity1);					
				}
			//}
		}

		
	},
	draw: function(interpolation) {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

		for( var i=0; i<this.map.entities.length; i++ ) {
			var entity = this.map.entities[i];

			entity.draw(this._context, interpolation);
		}

		this.getDigger().draw(this._context, interpolation);

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