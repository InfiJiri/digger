// http://codeutopia.net/blog/2009/08/21/using-canvas-to-do-bitmap-sprite-animation-in-javascript/
var SpriteSheet = function(data) {
    this.load(data);
};

SpriteSheet.prototype = {
    _sprites: {},
    _width: 0,
    _height: 0,
 
    load: function(data) {
        this._height  = data.height;
        this._width   = data.width;
        this._sprites = data.sprites;
    },

	getWidth: function() {
		return this._width;
	},	
	
	getHeight: function() {
		return this._height;
	},
 
    getOffset: function(spriteName) {
		var sprite = this._sprites[spriteName];
		return {
			x: this._width * (sprite.x||0),
			y: this._height * (sprite.y||0),
			width: this._width,
			height: this._height
		};
    }
};