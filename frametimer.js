// http://codeutopia.net/blog/2009/08/21/using-canvas-to-do-bitmap-sprite-animation-in-javascript/
var FrameTimer = function() {
};
 
FrameTimer.prototype = {
	_lastTick:     (new Date()).getTime(),
	_frameSpacing: 0,
    getSeconds: function() {
        var seconds = this._frameSpacing / 1000;
        if(isNaN(seconds)) {
            return 0;
        }
 
        return seconds;
    },
	getFps: function() {
		return parseInt(this._frameSpacing ? 1000 / this._frameSpacing : 0);
	},
    tick: function() {
        var currentTick    = (new Date()).getTime();
        this._frameSpacing = currentTick - this._lastTick;
        this._lastTick     = currentTick;
    }
};