window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GameLog = (function( domain ) {
	
	var Logger = Class.extend( {
		init: function() {
			this.logs = new Array();
			this.log("Start");
		},
		log: function( arguments ) {
			var now = new Date();
			var entry = {
					time: now,
					content: arguments
			};
			this.logs.push( entry );
		},
		toString: function() {
			var out = "";
			for ( var i = 0; i < this.logs.length; i++ ) {
				var entry = this.logs[i];
				out += entry.time.toTimeString();
				out += ": ";
				out += JSON.stringify( entry.content );
				out += "\n";
			}
			return out;
		}
	} );
	
	var logger = new Logger();

	ce.attachEvent("gui.render", function( eventType, data ) {

		logger.log( "New Game" );

	});

	ce.attachEvent("counter.modified", function( eventType, data ) {

		logger.log( data );

	});
	
	return {
		getLog: function() {
			return logger.toString();
		},
		clearLog: function() {
			logger = new Logger();
		}
	};

})( windgazer );