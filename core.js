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
//			http://stackoverflow.com/questions/4871669/collision-detection-in-javascript-game
				digger.vy = -digger.speed;

				break;
			case 39: // RIGHT
				//var normalizedPos = self.map.getNormalizedEntityPosition(digger);
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

		debug(self.map._map);
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

		// FIXME proper collision detection
		var digger = this.getDigger();
		if (this.map.isEntityInRow(digger) && digger.vx) {
			digger.x = Math.min(Math.max(0, digger.x + digger.vx), this._canvas.width - digger.width);
		} else if (digger.vx!=0 && digger.vy==0) { // Digger wants to move horizontaly, but is not in a row -> move to nearest row
			digger.y = Math.min(Math.max(0, digger.y + digger.speed), this._canvas.height - digger.height);
		}

		if (this.map.isEntityInColumn(digger)) {
			digger.y = Math.min(Math.max(0, digger.y + digger.vy), this._canvas.height - digger.height);
		} else if (digger.vy!=0 && digger.vx==0) { // Digger wants to move vertically, but is not in a column -> move to nearest column
			digger.x = Math.min(Math.max(0, digger.x + digger.speed), this._canvas.width - digger.width);
		}

		this.map.update();
		
		this._frametimer.tick();
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