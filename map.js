var Map = function(canvas, data) {
	debug("Map.init");
	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	var B = 3;	// Bonus
	var D = 4;	// Digger
	var E = 5;  // Emerald
	var G = 6;  // Gold
	var H = 7;  // Hobbin
	var N = 8;  // Nobbin

	var B = 3;	// Bonus
	var D = 4;	// Digger
	var E = 5;  // Emerald
	var G = 6;  // Gold
	var H = 7;  // Hobbin
	var N = 8;  // Nobbin	
	

	numcols = 20;
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

	this._start    = start;
	
	// TESTESTESSTETS
	var bg               = new Image();
	var tunnelHorizontal = new Image();
	var tunnelVertical   = new Image();

	bg.src               = "images/bg.png";
	tunnelHorizontal.src = "images/tunnel-horizontal.png";
	tunnelVertical.src   = "images/tunnel-vertical.png";

	this._context.drawImage(bg, 0, 0);
	for( var y=0; y<start.length/numcols; y++ ) {
		var offset = y*numcols;
		for( var x=0; x<numcols; x++ ) {
			var value = start[offset + x];
			if (value!==1) {
				continue;
			}

			this._context.drawImage(tunnelHorizontal, x*25, y*25);
		}
	}
};

Map.prototype = {
	_canvas:  null,
	_context: null,
	diggerX:  0,
	diggerY:  0,
	_start:   [],
	getStart: function() {
		return this._start;
	},
	draw: function() {

	}
};