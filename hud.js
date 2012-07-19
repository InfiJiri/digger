var Hud = function(canvas, frameTimer, hudSize) {
	debug("Hud.init");

	this._timer   = frameTimer;
	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	this._width  = hudSize.width;
	this._height = hudSize.height;

	this.draw();
};

Hud.prototype = {
	x: 0,
	y: 0,
	speed:  2,
	_height: 30,
	getWidth: function() {
		return this._width;
	},	
	getHeight: function() {
		return this._height;
	},
	update: function() {
		
	},
	reset: function() {
	},
	draw: function(context, interpolation) {
	
		this._context.beginPath();
        this._context.rect(0, 0, this._width, this._height);
        this._context.fillStyle = '#000000';
        this._context.fill();
	}
}