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
	data = [
		1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1,
		1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1,
		1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1,
		1,	1,	1,	1,	0,	1,	0,	0,	0,	1,	1,	E,	E,	E,	1,	1,	1,	1,	1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	E,	E,	E,	1,	1,	1,	1,	1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	E,	E,	E,	1,	1,	1,	1,	1, 1,
		1,	1,	1,	1,	0,	0,	0,	D,	0,	0,	0,	0,	0,	0,	0,	1,	1,	1,	1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1 ];

	// Store original map
	this._start = data;
	this._map   = data;

	this.reset();
};

Map.prototype = {
	_canvas:  null,
	_context: null,
	_numcols: 20,
	_tileWidth:  40,
	_tileHeight: 40,
	_start:   [],
	_map:     [],
	_images:  {},
	digger:   null,
	entities: [],
	isEntityInRow: function(entity) {
		return entity.y % this._tileHeight == 0;
	},
	isEntityInColumn: function(entity) {
		return entity.x % this._tileWidth == 0;
	},
	getNormalizedEntityPosition: function(entity){
		return { 
			x: Math.ceil(entity.x / this._tileWidth), 
			y: Math.ceil(entity.y / this._tileHeight) 
		}
	},
	reset: function() {	
		this._context.drawImage(this._images["bg"], 0, 0);
		for( var y=0; y<this._start.length/this._numcols; y++ ) {
			var offset = y * this._numcols;
			var o      = null; // Object to be placed on map
			for( var x=0; x<this._numcols; x++ ) {
				var value = this._start[offset + x];
				switch( value ) {
					case E: // Emerald
						var o = new Emerald();

						// Place object on map.
						o.x = x * this._tileWidth + (0.5 * (this._tileWidth - o.width));
						o.y = y * this._tileHeight + (0.5 * (this._tileHeight - o.height));;

						this.entities.push(o);
						break;
					case D: // Digger
						var o = new Digger();

						// Place object on map.
						o.x = x * this._tileWidth;
						o.y = y * this._tileHeight;
						this.digger = o;
					default:
						continue; // Nothing to do
				}
			}
		}

		this.draw();
	},
	update: function() {
		// FIXME drawing and updating must be separate processes
        this._context.beginPath();
        this._context.arc(this.digger.x + this._tileWidth*0.5, this.digger.y + this._tileWidth*0.5, this._tileWidth * 0.5, 0, 2 * Math.PI, false);
        this._context.fillStyle = "#000000";
        this._context.fill();

		var normalizedPosition = this.getNormalizedEntityPosition(this.digger);
		this._map[normalizedPosition.y * this._numcols + normalizedPosition.x] = 0; // Update tunnels in map
	},
	draw: function() {
		debug("Map.draw");

		for( var y=0; y<this._start.length/this._numcols; y++ ) {
			var offset = y*this._numcols;
			for( var x=0; x<this._numcols; x++ ) {
				var value = this._start[offset + x];

				if (value!==0) {
					continue; // Nothing to do
				}

				//this._context.drawImage(this._images["th"], x*this._tileWidth, y*this._tileHeight);
				this._context.beginPath();
				this._context.arc(x * this._tileWidth + (0.5 * this._tileWidth), y * this._tileWidth + (0.5 * this._tileWidth), this._tileWidth * 0.5, 0, 2 * Math.PI, false);
				this._context.fillStyle = "#000000";
				this._context.fill();				
			}
		}
	}
};