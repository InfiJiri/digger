var Hud = function(canvas, frameTimer) {
	debug("Hud.init");

	this._timer   = frameTimer;
	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	this.width = canvas.width;

	this.draw();
};

Hud.prototype = {
	x: 0,
	y: 0,
	speed:  2,
	height: 30,
	update: function() {
		
	},
	draw: function(context, interpolation) {
	
		this._context.beginPath();
        this._context.rect(0, 0, this.width, this.height);
        this._context.fillStyle = '#000000';
        this._context.fill();
	}
}