var Debug = {
	enabled: false,
	writeln: function(o) {
		if (this.enabled) {
			console.log(o);
		}
	}
};

function debug(o) {
	Debug.writeln(o);
}