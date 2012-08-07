// FIXME Global variables :'(
var B = 0x1F;  // Bonus
var D = 0x20;  // Digger
var E = 0x3F;  // Emerald
var G = 0x40;  // Gold
var M = 0x5F;  // Monster
var S = 0x60;  // Spawn-point (monsters)
var X = 0x0F;  // Untouched tile
var H = 0x0A;  // Horizontal tile
var V = 0x05;  // Vertical tile
// 0 .. 15 define walls

var Map = function(data) {
	debug("Map.init");

	// TODO load map
	// TEST map
	data = [
		X,	X,	X,	X,	0,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X, X, X, X,  
		X,	X,	X,	X,	0,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X, X, X, S,
		X,	X,	G,	X,	0,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X,	X, X, X, 0,
		X,	X,	X,	X,	0,	X,	0,	0,	D,	X,	X,	E,	E,	E,	X,	X,	X,	X, X, X, 0,
		X,	X,	G,	G,	X,	X,	X,	X,	0,	X,	X,	E,	E,	E,	X,	X,	X,	X, X, X, 0,
		X,	X,	X,	X,	X,	X,	X,	X,	0,	X,	X,	E,	E,	E,	0,	0,	0,	0, 0, 0, 0,
		X,	X,	X,	X,	0,	0,	0,	X,	0,	0,	0,	0,	0,	0,	0,	X,	X,	X, X, X, X  ];

	// Store original map
	this._start = data;
	this.reset();
};

Map.prototype = {
	_numcols: 21,
	_offset: { x: 0, y: 25 },
	_tileWidth:  40,
	_tileHeight: 40,
	_start:   [],
	_map:     [],
	_images:  {},
	_digger:  null,
	entities: [],
	isEntityInRow: function(entity) {
		return (entity.y - this.getOffsetY() - this.getEntityOffsetHeight(entity)) % this._tileHeight == 0;
	},
	isEntityInColumn: function(entity) {
		return (entity.x - this.getOffsetX() - this.getEntityOffsetWidth(entity)) % this._tileWidth == 0;
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
	getOffsetX: function() {
		return this._offset.x;
	},
	getOffsetY: function() {
		return this._offset.y;
	},
	getTileWidth: function() {
		return this._tileWidth;
	},
	getTileHeight: function() {
		return this._tileHeight;
	},
	getEmeraldCount: function() { // Returns all non-disposed emeralds in the game
		var cnt = 0;
		for( var i=0; i<this.entities.length; i++ ) {
			var entity = this.entities[i];

			if (entity.type == "emerald" && !entity.isdisposed) {	
				cnt++;
			}
		}

		return cnt;
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
	isEntityEnteringTile: function(entity, x, y) { // Is entity over 10% of the tile (i.e. does its value require updating?)
		var npEntity = this.getNormalizedEntityPosition(entity);

		// Due to Entity.speed > 1, not all (pixel) positions in the map
		// can be reached.
		var npEntityCenter = entity.x + (entity.width * 0.5);
		var npEntityMiddle = entity.y + (entity.height * 0.5);
		var npTileCenter   = x * this.getTileWidth() + (this.getTileWidth() * 0.5) + this.getOffsetX();
		var npTileMiddle   = y * this.getTileHeight() + (this.getTileHeight() * 0.5) + this.getOffsetY();
		var minX      = npTileCenter - (0.45 * this.getTileWidth());
		var maxX      = npTileCenter + (0.45 * this.getTileWidth());
		var minY      = npTileMiddle - (0.45 * this.getTileHeight());
		var maxY      = npTileMiddle + (0.45 * this.getTileHeight());

		var x1 = entity.x;
		var x2 = entity.x + entity.width;
		var y1 = entity.y;
		var y2 = entity.y + entity.height;

		if (npEntity.y == y && entity.vx > 0) {
			return (x2 > minX && x2 < maxX);
		} else if (npEntity.y == y && entity.vx<0) {
			return (x1 > minX && x1 < maxX);
		} else if  ( ( y == npEntity.y+1 || y == npEntity.y-1 ) && npEntity.x == x ) {
			if (entity.vy>0) {
				return (y2 > minY && y2 < maxY);
			} else if (entity.vy<0) {
				return (y1 > minY && y1 < maxY);
			}
		}

		return false;	
	},
	getEntityOffsetWidth: function(entity) { // Entity tile-offset (when centered)
		return (this.getTileWidth() - entity.width) * 0.5;
	},
	getEntityOffsetHeight: function(entity) { // Entity tile-offset (when centered)
		return (this.getTileHeight() - entity.height) * 0.5;
	},
	getPositionValue: function(x, y) {
		return this._map[ y * this.getNumCols() + x ];
	},
	setPositionValue: function(x, y, value) {
		return this._map[ y * this.getNumCols() + x ] = value;
	},
	getNormalizedPosition: function(x, y) {
		return { 
			x: Math.floor((x - this.getOffsetX()) / this.getTileWidth()), 
			y: Math.floor((y - this.getOffsetY()) / this.getTileHeight()) 
		}
	},
	getNormalizedEntityPosition: function(entity){ // Where's the center+middle of this entity?
		var x = entity.x + (entity.width * 0.5);
		var y = entity.y + (entity.height * 0.5);

		return this.getNormalizedPosition(x , y);
	},
	moveEntityToField: function(entity, x, y) {
		var np = this.getNormalizedEntityPosition(entity);

		var tileHeight = this.getTileHeight();
		var tileWidth  = this.getTileWidth();

		entity.target = {x:tileWidth * x  + this.getOffsetX() +  this.getEntityOffsetWidth(entity),
			y:tileHeight * y + this.getOffsetY() + this.getEntityOffsetHeight(entity), nx: x, ny: y };
	},
	buildInitialTunnel: function() {
		// Walk through all fields, determine which of them are zero - these form the original tunnel
		// the level. Assign these fields their appropriate values (depending on neighbour-fields), and
		// draw the tunnel.

		var startData = this.getStartData();
		var numCols   = this.getNumCols();

		for( var y=0; y<startData.length / numCols; y++ ) {
			var offset = y * numCols;
			for( var x=0; x<numCols; x++ ) {
				if (startData[offset + x] != 0 && startData[offset + x] != D){ // Not tunnel-part, or Digger?
					if (startData[offset + x] != S) { // Not spawn-point
						this.setPositionValue(x, y , this.getPositionValue(x, y) | 0x0F ); // Sand-tile
					}

					continue;
				}

				var top    = (y - 1 < 0) ? 0x0F : this.getPositionValue(x, y - 1);
				var right  = (x + 1 > numCols - 1) ? 0x0F : this.getPositionValue(x + 1, y);
				var bottom = (y + 1 > (startData.length / numCols) - 1) ? 0x0F : this.getPositionValue(x, y + 1);
				var left   = (x - 1 < 0) ? 0x0F : this.getPositionValue(x - 1, y);

				var value  = (top & 4) ? 1 : 0; // Top has bottom wall?
				value     |= (right & 8) ? 2 : 0; // Right has left wall?
				value     |= (bottom & 1) ? 4 : 0; // Bottom has top wall?
				value     |= (left & 2) ? 8 : 0; // Left has right wall?

				this.setPositionValue(x, y , value);
			}
		}
	},
	reset: function() {	
		this.entities = [];
		this._map     = [];

		for( var y=0; y<this._start.length/this.getNumCols(); y++ ) {
			var offset = y * this.getNumCols();
			var o      = null; // Object to be placed on map
			for( var x=0; x<this.getNumCols(); x++ ) {
				var value = this._start[offset + x];
				this._map.push(value);
				switch( value ) { // FIXME Code duplication
					case E: // Emerald
						o = new Emerald(this);
						break;
					case G: // Gold
						o = new Gold(this);
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
				o.x = this.getOffsetX() + x * this.getTileWidth() + this.getEntityOffsetWidth(o);
				o.y = this.getOffsetY() + y * this.getTileHeight() + this.getEntityOffsetHeight(o);	
				this.entities.push(o);
			}
		}

		this.buildInitialTunnel();
	},
	canEntityEnterTile: function(entity, x, y) {
		if (x>=this.getNumCols() || y>=this.getNumRows() || x<0 || y<0) {
			return false;
		}
		
		var np = this.getNormalizedEntityPosition(entity);	
		if ( entity.type != "digger" && !( entity.type=="monster" && entity.isHobbin() ) ) { // Digger and Hobbin get to go anywhere
			var original = this.getPositionValue(x, y);
			var value    = original;

			if (value > 0x0F && (value & 0x0F) ) { // Not a 'sand' tile; monster not allowed to enter
				return false;
			}

			if (value == 0) { // All clear.
				return true;
			}
			
			var result = false;
			if (np.y > y) { // Entering from bottom
				result =  (value & 4) == 0;
			} else if ( np.x < x ) { // Entering from left
				result = (value & 8) == 0;
			} else if (np.y < y) { // Entering from top
				result = (value & 1) == 0;
			} else if (np.x > x) { // Entering from right
				result = (value & 2) == 0;
			}

			return result;
		}

		return true;
	},	
	updateTunnel: function() {
		for( var i=0; i<this.entities.length; i++ ) {
			var entity = this.entities[i];

			// Only walk through 'digger' and 'monsters' (particularly Hobbni), because
			// they are the only tunnel making entities. Also, if
			if (entity.type != "digger" && !(entity.type=="monster" && entity.isHobbin()) ) {
				continue;
			}

			var np    = this.getNormalizedEntityPosition(entity);

			var coord = np.y * this.getNumCols() + np.x;

			if ( entity.vx > 0 && this.isEntityEnteringTile(entity, np.x + 1, np.y)) { // Entering from left.
				this._map[ coord ] &= (0xFF - 2); // Open right side of current tile

				if ( coord + 1 < (this.getNumCols() * np.y + this.getNumCols()) ) { // Not on most right tile, and is entering?
					this._map[ coord + 1 ] &= (0xFF - 8); // Open left side of target tile
				}
			} else if (entity.vx < 0 && this.isEntityEnteringTile(entity, np.x - 1, np.y)) { // Entering from right.
				this._map[ coord ] &= (0xFF - 8);  // Open left side of current tile
				
				if ( coord - 1 > (np.y * this.getNumCols())  ) { // Not on most left tile?
					this._map[ coord - 1 ] &= (0xFF - 2); // Open right side of target tile
				}
			} else if (entity.vy > 0 && this.isEntityEnteringTile(entity, np.x, np.y + 1) ) {
				this._map[ coord ] &= (0xFF - 4);
				
				if ( coord + this.getNumCols() < this._map.length  ) {
					this._map[ coord + this.getNumCols() ] &= (0xFF - 1);	
				}
			} else if (entity.vy < 0 && this.isEntityEnteringTile(entity, np.x, np.y - 1)) {
				this._map[ coord ] &= (0xFF - 1);

				if ( coord - this.getNumCols() > 0) {
					this._map[ coord - this.getNumCols() ] &= (0xFF - 4);
				}
			}
		}
	},
	update: function() {
		// Update tunnels in map
		//for( var i=0; i<this.entities.length; i++ ) {
			//var entity = this.entities[i];

			var normalizedPosition = this.getNormalizedEntityPosition(this.getDigger());

			var coord = normalizedPosition.y * this.getNumCols() + normalizedPosition.x;
			//this._map[coord] = 0; // Update tunnels in map

			this.updateTunnel();

			//this.entityReachedDestination(entity);
/*				if (this._map[coord]==E) { // Don't override spawn point
					this._map[coord] = 0; 
				} else if (this._map[coord]<0x0F) {
					//if (this._
					this._map[coord] |= 0; // Update tunnels in map
				}*/
			//}
			

		//}
	}
};