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
	
	this.reset();
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
		var start = this._map.getStartData();
		for( var y=0; y<start.length/this._map.getNumCols(); y++ ) {
			var offset = y*this._map.getNumCols();
			for( var x=0; x<this._map.getNumCols(); x++ ) {
				var value = start[offset + x];

				if (value!==0) {
					continue; // Nothing to do
				}

				// Draws predefined tunnels
				var tileWidth  = this._map.getTileWidth();
				var tileHeight = this._map.getTileHeight();
				
				var radius = this.getTunnelRadius();			

				var tunnelX = this.getXOffset() + x * tileWidth + (0.5 * tileWidth);
				var tunnelY = this.getYOffset() + y * tileHeight + (0.5 * tileHeight)
				
				this._context.beginPath();
				this._context.arc(tunnelX, tunnelY, radius, 0, 2 * Math.PI, false);
				this._context.fillStyle = "#000000";
				this._context.fill();
			}
		}
	}
};