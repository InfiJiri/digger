var Core = function(canvas, frametimer, map) {
	debug("Core.init");

	this._canvas     = canvas;
	this._context    = canvas.getContext("2d");
	this._frametimer = frametimer;
	this.map        = map;

	this.digger     = new Digger();


	Debug.setFrameTimer(this._frametimer);
}

Core.prototype = {
	_canvas:   null,
	_context:  null,
	_frametimer: null,
	_nextGameTick: (new Date).getTime(),
	fps:    50,
	map:    null,
	digger: null,
	entities: [],
	reset: function() {
		debug("Core.reset");
	},
	update: function() {
		// FIXME proper collision detection
		this.digger.x = Math.min(Math.max(0, this.digger.x + this.digger.vx), this._canvas.width - this.digger.width);
		this.digger.y = Math.min(Math.max(0, this.digger.y + this.digger.vy), this._canvas.height - this.digger.height);

		this._frametimer.tick();
	},
	draw: function(interpolation) {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

		for( var i=0; i<this.entities.length; i++ ) {
			var entity = this.entities[i];

			entity.draw(this._context, interpolation);
		}

		this.digger.draw(this._context, interpolation);
		this.map.draw(this._context, interpolation);

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