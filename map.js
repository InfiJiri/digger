var Map = function(canvas) {
	debug("Map.init");
	this._canvas  = canvas;
	this._context = canvas.getContext("2d");

	// TESTESTESSTETS
	var image = new Image();
	image.src = "images/bg.png";
	this._context.drawImage(image, 0, 0);
};

Map.prototype = {
	_canvas: null,
	_context: null,
	draw: function() {
		//debug("Map.draw");
	}
};