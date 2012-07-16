var Core = function(canvas, frametimer) {
	debug("Core.init");

	this._canvas     = canvas;
	this._context    = canvas.getContext("2d");
	this._frametimer = frametimer;

	Debug.setFrameTimer(this._frametimer);

	// FIXME clean-up (testing purposes)
	this.entities.push(new Digger());
}

Core.prototype = {
	_canvas:   null,
	_context:  null,
	_frametimer: null,
	_nextGameTick: (new Date).getTime(),
	fps: 50,
	entities: [],
	reset: function() {
		debug("Core.reset");
	},
	update: function() {
		this._frametimer.tick();
	},
	draw: function(interpolation) {
		this._context.clearRect(0, 0, this._context.width, this._context.height);

		for( var i=0; i<this.entities.length; i++ ) {
			//var entity = this.entities[i].draw(this._context);
		}

		Debug.drawFps();		
	},
	step: function() {
		//http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
		var loops        = 0;
		var skipTicks    = 1000 / this.fps;
		var maxFrameSkip = 10;
		
		var lastGameTick;	
		
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