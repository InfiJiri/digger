var MapRenderer = function(canvas, map) {
	debug("MapRenderer.init");

	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	// Preload images
	var bg               = new Image();
	bg.src               = "images/bg.png";

	this._images["bg"] = bg;

	this._map   = map;

	this.reset();
	
};

MapRenderer.prototype = {
	_canvas:  null,
	_context: null,
	_images: [],
	getCanvasDimensions: function() {
		return { "width": this._context.width, "height": this._context.height };
	},	
	reset: function() {	
		this._context.drawImage(this._images["bg"], 0, 0);

		this.draw();
	},
	update: function() {
		this.updateTunnels();
	},
	updateTunnels: function() {
		var digger = this._map.getDigger();

		var normalizedPosition = this._map.getNormalizedEntityPosition(digger);

		var tileWidth  = this._map.getTileWidth();
		var tileHeight = this._map.getTileHeight();		
		
        this._context.beginPath();
        this._context.arc(
			digger.x - this._map.getEntityOffsetWidth(digger) + (tileWidth * 0.5),
			digger.y - this._map.getEntityOffsetHeight(digger) + (tileHeight * 0.5),
			tileWidth * 0.5, 0, 2 * Math.PI, false);
        this._context.fillStyle = "#000000";
        this._context.fill();
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

				this._context.beginPath();
				this._context.arc(x * tileWidth + (0.5 * tileWidth), y * tileWidth + (0.5 * tileWidth), tileWidth * 0.5, 0, 2 * Math.PI, false);
				this._context.fillStyle = "#000000";
				this._context.fill();
			}
		}
	}
};