var SpawnPoint = function(map) {
	debug("SpawnPoint.init");

	this._timer = new FrameTimer();
	this._map = map;
};

SpawnPoint.prototype = {
	x: 0,
	y: 0,
	height:   34,
	width:    34,
	_currentMonsterCount: 0,
	monsterCount: 0,
	delay: 4000, // ms
	_timerStart: 0,
	update: function() {
		if (this._timerStart == 0 || this.delay < (new Date).getTime() - this._timerStart) {
			if (this._currentMonsterCount < this.monsterCount) {
				var m = new Monster(this._map);
				m.x = this.x;
				m.y = this.y;

				this._map.entities.push(m);
				this._currentMonsterCount++;				
			}
		
			this._timerStart = (new Date).getTime();
		}
	},

	getNormalizedPosition: function() {
		return this._map.getNormalizedEntityPosition(this);
	},

	canEnterTile: function(x, y) {
		return this._map.canEntityEnterTile(this, x, y);
	},

	step: function() {
		
	}
}