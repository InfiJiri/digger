var Hud = function(canvas, hudSize) {
	debug("Hud.init");

	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	this._width  = hudSize.width;
	this._height = hudSize.height;

	this._sprites = new SpriteSheet({
		width: 24,
		height: 24,
		sprites: {
			"0": { x: 0, y: 0 },
			"1": { x: 1, y: 0 },
			"2": { x: 2, y: 0 },
			"3": { x: 3, y: 0 },
			"4": { x: 4, y: 0 },
			"5": { x: 5, y: 0},
			"6": { x: 6, y: 0 },
			"7": { x: 7, y: 0 },
			"8": { x: 8, y: 0 },			
			"9": { x: 9, y: 0 },
		}
	});	

	this._image = new Image();
	this._image.src = "images/chars.png";	
};

Hud.prototype = {
	x: 0,
	y: 0,
	score:   0,
	_height: 30,
	getWidth: function() {
		return this._width;
	},	
	getHeight: function() {
		return this._height;
	},
	reset: function() {
	},
	draw: function() {	
		this._context.beginPath();
        this._context.rect(0, 0, this._width, this._height);
        this._context.fillStyle = '#000000';
        this._context.fill();

		var width  = this._sprites.getWidth();   // character width
		var height = this._sprites.getHeight();  // character height

		var scoreChars = this.score.toString();
		for( var i=0; i<scoreChars.length; i++ ) {
			var xOffset = i * width;
			
			var frame = this._sprites.getOffset(scoreChars[i]);

			this._context.drawImage(this._image,
				frame.x,
				frame.y,
				width,
				height,
				xOffset,
				0,
				width,
				height);		
		}
	}
}