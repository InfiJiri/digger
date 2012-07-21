// FIXME Global variables :'(
var B = 3;	// Bonus
var D = 4;	// Digger
var E = 5;  // Emerald
var G = 6;  // Gold
//var H = 7;  // Hobbin
//var N = 8;  // Nobbin
var M = 7;  // Monster
var S = 8;  // Spawm-point (monsters)

var Map = function(data) {
	debug("Map.init");

	// TODO load map
	// TEST map
	data = [
		1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 0, 0, S, 1,
		1,	1,	G,	1,	0,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 0, 1, 1, 1,
		1,	1,	1,	1,	0,	1,	0,	0,	D,	1,	1,	E,	E,	E,	1,	1,	1,	1, 1, 1, 0, 1, 1, 1,
		1,	1,	G,	G,	1,	1,	1,	1,	0,	1,	1,	E,	E,	E,	1,	1,	1,	1, 1, 1, 0, 1, 1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	0,	1,	1,	E,	E,	E,	0,	0,	0,	0, 0, 0, 0, 1, 1, 1,
		1,	1,	1,	1,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0,	1,	1,	1, 1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1, 1,
		1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1, 1, 1, 1, 1, 1, 1 ];

	// Store original map
	this._start = data;
	for( var i=0; i<data.length; i++ ) {
		this._map.push(data[i]);
	}
//	this._map   = data;

	this.reset();
};

Map.prototype = {
	_numcols: 24,
	_tileWidth:  34,
	_tileHeight: 34,
	_start:   [],
	_map:     [],
	_images:  {},
	_digger: null,
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
	getStartData: function() {	// Returns original map data
		return this._start;
	},
	getMapData: function() {	// Returns current map data
		return this._map;
	},
	getDigger: function() {	// Player
		return this._digger;
	},
	getNumCols: function() {
		return this._numcols;
	},
	getNumRows: function() {
		return this._map.length / this._numcols;
	},
	getTileWidth: function() {
		return this._tileWidth;
	},
	getTileHeight: function() {
		return this._tileHeight;
	},
	canEntityEnterTile: function(entity, x, y) {
		//if (entity.type == "digger") {
		//	}
		if ( entity.type != "digger" ) {
			if ( this.getPositionValue(x, y) == 0 ) {
				return true;
			}
		}

		return false;
	},
	isEntityTouching: function(entity1, entity2) {
		var npEntity1 = this.getNormalizedEntityPosition(entity1);
		var npEntity2 = this.getNormalizedEntityPosition(entity2);

		// Due to Entity.speed > 1, not all (pixel) positions in the map
		// can be reached.
		var npEntity2Center = entity2.x + (entity2.width * 0.5);
		var npEntity2Middle = entity2.y + (entity2.height * 0.5);
		var minX      = npEntity2Center - (0.25 * entity2.width);
		var maxX      = npEntity2Center + (0.25 * entity2.width);
		var minY      = npEntity2Middle - (0.25 * entity2.height);
		var maxY      = npEntity2Middle + (0.25 * entity2.height);

		var x1 = entity1.x;
		var x2 = entity1.x + entity1.width;
		var y1 = entity1.y;
		var y2 = entity1.y + entity1.height;

		if (npEntity1.y == npEntity2.y) { // Touching middle of entity?
			return ((x1 > minX && x1 < maxX) || (x2 > minX && x2 < maxX));
		} else if ( npEntity1.y == npEntity2.y+1 || npEntity1.y == npEntity2.y-1) {
			return (((y1 > minY && y1 < maxY) || (y2 > minY && y2 < maxY)) && npEntity1.x == npEntity2.x);
		}

		return false;
	},
	getEntityOffsetWidth: function(entity) {
		return ((this._tileWidth - entity.width) * 0.5);
	},
	getEntityOffsetHeight: function(entity) {
		return ((this._tileHeight - entity.height) * 0.5);
	},
	getPositionValue: function(x, y) {
		return this._map[ y * this.getNumCols() + x ];
	},
	getNormalizedPosition: function(x, y) {
		return { 
			x: Math.floor(x / this._tileWidth), 
			y: Math.floor(y / this._tileHeight) 
		}	
	},
	getNormalizedEntityPosition: function(entity){ // Where's the center+middle of this entity?
		var x = entity.x + (entity.width * 0.5);
		var y = entity.y + (entity.height * 0.5);

		return this.getNormalizedPosition(x , y);
	},
	reset: function() {	
		this.entities = [];

		for( var y=0; y<this._start.length/this._numcols; y++ ) {
			var offset = y * this._numcols;
			var o      = null; // Object to be placed on map
			for( var x=0; x<this._numcols; x++ ) {
				var value = this._start[offset + x];
				switch( value ) { // FIXME Code duplication
					case E: // Emerald
						o = new Emerald(this);
						break;
					case G: // Gold
						o = new Gold(this);
						break;
					case M: // Monster
						o = new Hobbin(this);
						break;
					case D: // Digger
						var o = new Digger(this);
						this._digger = o; // Store reference to array-object
						break;
					case S: // Spawn-point
						o = new SpawnPoint(this);
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
	},
	update: function() {
		var normalizedPosition = this.getNormalizedEntityPosition(this._digger);

		var coord = normalizedPosition.y * this._numcols + normalizedPosition.x;
		if (this._map[coord]!=S) { // Don't override spawn point
			this._map[coord] = 0; // Update tunnels in map
		}
	}
};