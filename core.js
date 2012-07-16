var Core = function(canvas) {
	debug("Core.init");

	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	// FIXME clean-up (testing purposes)
	this.entities.push(new Digger());
}

Core.prototype = {
	_canvas:   null,
	_context:  null,
	fps: 50,
	entities: [],
	reset: function() {
		debug("Core.reset");
	},
	update: function() {
		debug("update");
	},
	draw: function(interpolation) {
		this._context.clearRect(0, 0, this._context.width, this._context.height);

		for( var i=0; i<this.entities.length; i++ ) {
			var entity = this.entities[i].draw(this._context);
		}
	},
	step: function() {
		//http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
		var loops        = 0;
		var skipTicks    = 1000 / this.fps;
		var maxFrameSkip = 10;
		var nextGameTick = (new Date).getTime();
		var lastGameTick;	
		
		while ((new Date).getTime() > nextGameTick) {
		  this.update();

		  nextGameTick += skipTicks;
		  loops++;
		}
		debug("draw");

		if (!loops) {
		  this.draw((nextGameTick - (new Date).getTime()) / skipTicks);
		} else {
		  this.draw(0);
		}
	}	
};