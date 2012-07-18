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
		1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	G,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	0,	1,	0,	0,	D,	1,	1,	E,	E,	E,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	1,	G,	1,	1,	1,	1,	1,	1,	1,	E,	E,	E,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	E,	E,	E,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1 ];

	// Store original map
	this._start = data;
	this._map   = data;

	this.reset();
};

Map.prototype = {
	_canvas:  null,
	_context: null,
	_numcols: 24,
	_tileWidth:  34,
	_tileHeight: 34,
	_start:   [],
	_map:     [],
	_images:  {},
	_diggerEntityIndex: null,
	getDigger: function() {
		return this.entities[this._diggerEntityIndex];
	},
	entities: [],
	isEntityInRow: function(entity) {
		return (entity.y - this.getEntityOffsetHeight(entity)) % this._tileHeight == 0;
	},
	isEntityInColumn: function(entity) {
		return (entity.x - this.getEntityOffsetWidth(entity)) % this._tileWidth == 0;
	},
	isEntityCentered: function( entity ) {
		//return this.isEntityInRow(entity) && this.isEntityInColumn(entity);
	},
	getEntityOffsetWidth: function(entity) {
		return ((this._tileWidth - entity.width) * 0.5);
	},
	getEntityOffsetHeight: function(entity) {
		return ((this._tileHeight - entity.height) * 0.5);
	},	
	getNormalizedPosition: function(x, y) {
		return { 
			x: Math.ceil(x / this._tileWidth), 
			y: Math.ceil(y / this._tileHeight) 
		}	
	},
	getNormalizedEntityPosition: function(entity){
		var x = entity.x - this.getEntityOffsetWidth(entity);
		var y = entity.y - this.getEntityOffsetHeight(entity);

		return this.getNormalizedPosition(x , y);
	},
	centerEntity: function(entity) {
		var normalizedPosition = this.getNormalizedEntityPosition(entity);
		entity.x = normalizedPosition.x * this._tileWidth + this.getEntityOffsetWidth(entity);
		entity.y = normalizedPosition.y * this._tileWidth + this.getEntityOffsetHeight(entity);
	},
	moveEntity: function(entity, direction) {
		entity.action = "stand";

		/*if (	
			(entity.vx != 0 && direction!="left" && direction !="right") ||
			(entity.vy != 0 && direction!="up" && direction != "down" )) {
			return;
		}

		var normalizedPosition = this.getNormalizedEntityPosition(entity);
		switch( direction ) {
			case "up":
				if (normalizedPosition.y == 0) { // Top Border
					entity.vy = 0;
					return;
				}

				entity.action = "moveup";  // Rendering purposes only
				entity.target = normalizedPosition;
				// debug(normalizedPosition);
				// sdassdfafsda
				entity.target.y--;
				entity.vy     = -entity.speed;
				break;
			case "left":
				if (normalizedPosition.x == 0) { // Left Border
					entity.vx = 0;
					return;
				}

				entity.action = "moveleft";  // Rendering purposes only
				entity.target = normalizedPosition;
				entity.target.x--;
				entity.vx     = -entity.speed;
				break;
			case "right":
				if (normalizedPosition.x == this._numcols) { // Right Border
					entity.vx = 0;
					return;
				}

				//var x2 = ( entity.x + entity.width );
				//var y2 = ( entity.x + entity.width );
				//this.getNormalizedPosition(x2, y2) != 
				debug(normalizedPosition.x);
				entity.action = "moveright";  // Rendering purposes only
				entity.target = normalizedPosition;
				entity.target.x++;
				//debug(entity.target.x);
				//sdafafsfs				
				entity.vx     = entity.speed;
				break;
			case "down":
				if (normalizedPosition.y == this._map.length / this._numcols ) { // Bottom Border
					entity.vy = 0;
					return;
				}

				entity.action = "movedown"; // Rendering purposes only
				entity.target = normalizedPosition;
				entity.target.y++;
				entity.vy     = entity.speed;
				break;
		}*/

		
	},
	reset: function() {	
		this._context.drawImage(this._images["bg"], 0, 0);
		this.entities = [];

		for( var y=0; y<this._start.length/this._numcols; y++ ) {
			var offset = y * this._numcols;
			var o      = null; // Object to be placed on map
			for( var x=0; x<this._numcols; x++ ) {
				var value = this._start[offset + x];
				switch( value ) { // FIXME Code duplication
					case E: // Emerald
						o = new Emerald();
						break;
					case G: // Gold
						o = new Gold();
						break;
					case D: // Digger
						var o = new Digger();
						this.digger = o; // Store reference to array-object
						break;
					default:
						continue; // Nothing to do
				}

				// Place object on map.
				o.x = x * this._tileWidth + this.getEntityOffsetWidth(o);
				o.y = y * this._tileHeight + this.getEntityOffsetHeight(o);	
				this.entities.push(o);
			}
		}

		this.draw();
	},
	update: function() {
		// FIXME drawing and updating must be separate processes
		var normalizedPosition = this.getNormalizedEntityPosition(this.digger);
		
        this._context.beginPath();
        this._context.arc(
			this.digger.x - this.getEntityOffsetWidth(this.digger) + (this._tileWidth * 0.5),
			this.digger.y - this.getEntityOffsetHeight(this.digger) + (this._tileHeight * 0.5),
			this._tileWidth * 0.5, 0, 2 * Math.PI, false);
        this._context.fillStyle = "#000000";
        this._context.fill();

		var normalizedPosition = this.getNormalizedEntityPosition(this.digger);
		this._map[normalizedPosition.y * this._numcols + normalizedPosition.x] = 0; // Update tunnels in map
		//this._map[normalizedPosition.y * this._numcols + normalizedPosition.x] = D; // Update tunnels in map
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