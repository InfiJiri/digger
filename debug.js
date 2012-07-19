var Debug = {
	_frametimer: null,
	_fpsTarget: null,
	enabled: false,
	enableSound: true,
	writeln: function(o) {	
		if (this.enabled) {
			console.log(o);
		}
	},
	setFrameTimer: function(frametimer) {
		this._frametimer = frametimer;
	},
	setFpsTarget: function(target) {
		this._fpsTarget = target;
	},
	updateFps: function() {
		if (this.enabled) {
			this._fpsTarget.value = this._frametimer.getFps();
		}
	},
};

function debug(o) {
	Debug.writeln(o);
}