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
			"5": { x: 5, y: 0 },
			"6": { x: 6, y: 0 },
			"7": { x: 7, y: 0 },
			"8": { x: 8, y: 0 },
			"9": { x: 9, y: 0 },
			"a": { x: 0, y: 1 },
			"b": { x: 1, y: 1 },
			"c": { x: 2, y: 1 },
			"d": { x: 3, y: 1 },
			"e": { x: 4, y: 1 },
			"f": { x: 5, y: 1 },
			"g": { x: 6, y: 1 },
			"h": { x: 7, y: 1 },
			"i": { x: 8, y: 1 },
			"j": { x: 9, y: 1 },
			"k": { x: 0, y: 2 },
			"l": { x: 1, y: 2 },
			"m": { x: 2, y: 2 },
			"n": { x: 3, y: 2 },
			"o": { x: 4, y: 2 },
			"p": { x: 5, y: 2 },
			"q": { x: 6, y: 2 },
			"r": { x: 7, y: 2 },
			"s": { x: 8, y: 2 },
			"t": { x: 9, y: 2 },
			"u": { x: 0, y: 3 },
			"v": { x: 1, y: 3 },
			"w": { x: 2, y: 3 },
			"x": { x: 3, y: 3 },
			"y": { x: 4, y: 3 },
			"z": { x: 5, y: 3 }
		}
	});

	this._image         = new Image();
	this._image.src     = "images/chars.png";
	this._lifeImage     = new Image();
	this._lifeImage.src = "images/life.png";
};

Hud.prototype = {
	x: 0,
	y: 0,
	score:   0,
	lives:   2,
	_height: 30,
	_isPaused: false,
	_isGameOver: false,
	getWidth: function() {
		return this._width;
	},	
	getHeight: function() {
		return this._height;
	},
	reset: function() {
		this._isPaused   = false;
		this._isGameOver = false;
		this.score       = 0;
	},
	isGameOver: function() {
		return this._isGameOver;
	},
	togglePause: function(enablePause) {
		this._isPaused = enablePause;

		this.draw(); // Draw one last time (or first time)
	},
	toggleGameOver: function(enableGameOver) {
		this._isGameOver = enableGameOver;

		this.draw();
	},
	draw: function() {
		// Clear HUD background
		this._context.beginPath();
        this._context.rect(0, 0, this._width, this._height);
        this._context.fillStyle = '#000000';
        this._context.fill();

		// Draw HUD
		if (this._isGameOver) {
			this._drawText("Game over", true);
		} else if (this._isPaused) {
			this._drawText("Press any key", true);
		} else {
			this._drawScore();
		}
	},
	_drawScore: function() {
		var result = this._drawText(this.score);

		this._drawLives(result.width + result.offset);
	},
	_drawText: function(text, centerMessage) {
		xOffset = 0;

		var width  = this._sprites.getWidth();   // character width
		var height = this._sprites.getHeight();  // character height
		
		var chars     = text.toString().toLowerCase();
		var textWidth = (chars.length * width);

		if (centerMessage) {
			xOffset = (this.getWidth() - textWidth) * 0.5;
		}

		for( var i=0; i<chars.length; i++ ) {
			var x = i * width + xOffset;
			if (chars[i] == " ") { // Spaces are no actual chars
				continue;
			}

			var frame = this._sprites.getOffset(chars[i]);

			this._context.drawImage(this._image,
				frame.x,
				frame.y,
				width,
				height,
				x,
				0,
				width,
				height);
		}

		return {offset: xOffset, width: textWidth};
	},
	_drawLives: function(offset) {
		width      = 34; // live width
		var height = this._sprites.getHeight();  // character height		

		// Draw lives
		var y = 0;
		var x = offset + this._sprites.getWidth(); // FIXME 
		for( var i=0; i<this.lives; i++ ) {
			x += i * width;

			this._context.drawImage(this._lifeImage,
				0,
				0,
				width,
				height,
				x,
				y,
				width,
				height);			
		}
	}
}