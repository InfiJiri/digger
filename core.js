var Core = function(canvas, frameTimer, map) {
	debug("Core.init");

	this._canvas     = canvas;
	this._context    = canvas.getContext("2d");
	this._frametimer = frameTimer;
	this.map         = map;

	var digger = new Digger();

	// FIXME
	// Hmpf the handling of these key events should be
	// in the Digger class, but it doesn't work (probably
	// some reference / clone issue)
	var self = this;
	document.onkeydown = function(e) {
		switch( e.keyCode ) {
			case 32: // SPACE
				self.togglePause();
				break;
			case 37: // LEFT
				digger.vx = -2;
				digger.vy = 0;
				break;
			case 38: // UP
				digger.vx = 0;
				digger.vy = -2;
				break;
			case 39: // RIGHT
				digger.vx = 2;
				digger.vy = 0;
				break;
			case 40: // DOWN
				digger.vx = 0;
				digger.vy = 2;
				break;
		}
	};

	document.onkeyup = function(e) {
		digger.vx = 2;
		digger.vy = 0;
	};

	this.digger = digger;

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
	digger:        null, // Player
	togglePause:   function() {
		debug("Core.togglePause(pause:" + (this._intervalId===false ? "off" : "on") + ")");

		self = this;
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
		this.digger.x = Math.min(Math.max(0, this.digger.x + this.digger.vx), this._canvas.width - this.digger.width);
		this.digger.y = Math.min(Math.max(0, this.digger.y + this.digger.vy), this._canvas.height - this.digger.height);

		// FIXME proper handling of Digger movement
		this.map.diggerX = this.digger.x;
		this.map.diggerY = this.digger.y;
		
		this._frametimer.tick();
	},
	draw: function(interpolation) {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

		for( var i=0; i<this.map.entities.length; i++ ) {
			var entity = this.map.entities[i];

			entity.draw(this._context, interpolation);
		}

		this.digger.draw(this._context, interpolation);

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