// FIXME Global variables :'(
var B = 3;	// Bonus
var D = 4;	// Digger
var E = 5;  // Emerald
var G = 6;  // Gold
var H = 7;  // Hobbin
var N = 8;  // Nobbin

var Map = function(canvas, data) {
	debug("Map.init");
	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	// Preload images
	var bg               = new Image();
	var tunnelHorizontal = new Image();
	var tunnelVertical   = new Image();

	bg.src               = "images/bg.png";
	tunnelHorizontal.src = "images/tunnel-horizontal.png";
	tunnelVertical.src   = "images/tunnel-vertical.png";

	this._images["bg"] = bg;
	this._images["th"] = tunnelHorizontal;
	this._images["tv"] = tunnelVertical;
	
	// TODO load map
	// TEST map
	start = [
		0,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	1,	0,	1,	1,	1,	0,	0,	E,	E,	E,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	E,	E,	E,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	E,	E,	E,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	1,	1,	1,	D,	1,	1,	1,	1,	1,	1,	1,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0,
		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0, 0 ];

	// Store original map
	this._start    = start;
};

Map.prototype = {
	_canvas:  null,
	_context: null,
	_numcols: 20,
	_start:   [],
	_images:  {},
	diggerX:  0, // NEIENIENIEN
	diggerY:  0,
	digger:   null,
	entities: [],
	reset: function() {	
		this._context.drawImage(this._images["bg"], 0, 0);
		for( var y=0; y<start.length/this._numcols; y++ ) {
			var offset = y*this._numcols;
			for( var x=0; x<this._numcols; x++ ) {
				var value = start[offset + x];
				switch( value ) {
					case 1:
						// FIXME Positioning
						this._context.drawImage(this._images["th"], x*25, y*25);

						break;
					case D:
						// FIXME Positioning
						var emerald = new Emerald();
						emerald.x = x * 25;
						emerald.y = y * 25;
						this.entities.push(emerald)
						break;						
					case E:
						// FIXME Positioning
						var emerald = new Emerald();
						emerald.x = x * 25;
						emerald.y = y * 25;
						this.entities.push(emerald)
						break;						
					default:
						continue; // Nothing to do
				}				
			}
		}

		this.draw();
	},
	draw: function() {
		debug("Map.draw");
		for( var y=0; y<start.length/this._numcols; y++ ) {
			var offset = y*this._numcols;
			for( var x=0; x<this._numcols; x++ ) {
				var value = start[offset + x];

				if (value!==1) {
					continue; // Nothing to do
				}

				this._context.drawImage(this._images["th"], x*25, y*25);
			}
		}
	}
};