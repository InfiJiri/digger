var MapRenderer = function(canvas, map, offset) {
	debug("MapRenderer.init");

	this._canvas  = canvas;
	this._context = canvas.getContext("2d");
	
	// Preload images
	var bg               = new Image();
	bg.src               = "images/bg.png";

	this._images["bg"] = bg;

	this._map   = map;

	if (offset) {
		this._x = offset.x ? offset.x : 0;
		this._y = offset.y ? offset.y : 0;
	}
	
	//this.reset();
};

MapRenderer.prototype = {
	_canvas:  null,
	_context: null,
	_images: [],
	getXOffset: function() {
		//return this._map._x;
		return 0;
	},
	getYOffset: function() {
		//return this._map._y;
		return 0;
	},
	getCanvasDimensions: function() {
		return { "width": this._context.width, "height": this._context.height };
	},
	reset: function() {	
		this._context.drawImage(this._images["bg"], this.getXOffset(), this.getYOffset());

		this.draw();
	},
	update: function() {
		this.updateTunnels();
	},
	updateTunnels: function() {
		//var digger = this._map.getDigger();
		for (var i=0; i<this._map.entities.length; i++) {
			var entity = this._map.entities[i];
			if (entity.type!="digger" && entity.type!="monster") { // Draw tunnels for Digger and Monsters
				continue;
			}

			var normalizedPosition = this._map.getNormalizedEntityPosition(entity);

			var tileWidth  = this._map.getTileWidth();
			var tileHeight = this._map.getTileHeight();		
			
			var radius = this.getTunnelRadius();
			
			this._context.beginPath();
			this._context.arc(
				entity.x - this._map.getEntityOffsetWidth(entity) + (tileWidth * 0.5),
				entity.y - this._map.getEntityOffsetHeight(entity) + (tileHeight * 0.5),
				radius, 0, 2 * Math.PI, false);
			this._context.fillStyle = "#000000";
			this._context.fill();			
		}
	},
	getTunnelRadius: function() {
		return 0.5 * this._map.getTileWidth() - 2; // 1px on each side	
	},
	draw: function() {
		debug("MapRenderer.draw");
		
		//var start = this._map.getStartData();
		var data = this._map.getMapData();
		for( var y=0; y<data.length/this._map.getNumCols(); y++ ) {
			var offset = y * this._map.getNumCols();
			for( var x=0; x<this._map.getNumCols(); x++ ) {
				var value = data[offset + x];

				if ((value & 0x0F) == 0x0F) { // Sand tile
					continue; // Nothing to do
				}

				// Draws predefined tunnels
				var tileWidth  = this._map.getTileWidth();
				var tileHeight = this._map.getTileHeight();
				
				var radius   = this.getTunnelRadius();
				var diameter = 2 * radius;

				var tunnelXL = this._map.getOffsetX() + x * tileWidth;  // Left of tile
				var tunnelYT = this._map.getOffsetY() + y * tileHeight; // Top of tile
				var tunnelXC = tunnelXL + (0.5 * tileWidth);			// Center of tile
				var tunnelYC = tunnelYT + (0.5 * tileHeight)            // Middle of tile
				
				this._context.beginPath();
				this._context.arc(tunnelXC, tunnelYC, radius, 0, 2 * Math.PI, false);
				this._context.fillStyle = "#000000";
				this._context.fill();
						
				// TODO: put in a function and resolve code duplication
				if ((value & 0x01) == 0) { // Top is open -> fill upper half
					this._context.fillRect(tunnelXC - radius, tunnelYT, diameter, tileHeight * 0.5);
				}

				if ((value & 0x02) == 0) { // Right is open -> fill right half
					this._context.fillRect(tunnelXC, tunnelYC - radius, tileWidth * 0.5, diameter);
				}

				if ((value & 0x04) == 0) { // Bottom is open -> fill bottom half
					this._context.fillRect(tunnelXC - radius, tunnelYC, diameter, tileHeight * 0.5);
				}

				if ((value & 0x08) == 0) { // Left is open -> fill left half
					this._context.fillRect(tunnelXL, tunnelYC - radius, diameter * 0.5, diameter);
				}

				//this._context.closePath();
			}
		}
	}
};