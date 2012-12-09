window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GameLog = (function( domain ) {
	
	var Logger = Class.extend( {
		init: function() {
			this.logs = new Array();
			this.log("Start");
		},
		log: function( ) {
			var now = new Date();
			var entry = {
					time: now,
					content: arguments
			};
			this.logs.push( entry );
			ce.fireEvent("log.modified", entry);
		},
		toString: function() {
			var out = "";
			for ( var i = 0; i < this.logs.length; i++ ) {
				var entry = this.logs[i];
				out += entry.time.toTimeString();
				out += ": ";
				for ( var j = 0; j < entry.content.length; j++ ) {
					if ( j > 0 ) {
						out += " ";
					}
					out += JSON.stringify( entry.content[j] );
				}
				out += "\n";
			}
			return out;
		}
	} );
	
	var logger = new Logger(),
		timeout = false,
		tuid = null,
		ttotal = 0;

	function resolveTimer() {

		var cntr = domain.counters[tuid];
		try {
			logger.log( cntr.getTitle() + ": " +  ttotal + " => " + cntr.getValue() );
		} catch ( whatever ) {}
		tuid = null;
		ttotal = 0;
		timeout = false;

	}

	ce.attachEvent("gui.render", function( eventType, data ) {

		logger.log( "New Game" );

	});

	ce.attachEvent("counter.modified", function( eventType, data ) {

		if ( timeout ) {

			//Clear current timeout
			window.clearTimeout( timeout );

			if ( tuid == data.id ) {

				ttotal += data.inc;

			} else {

				resolveTimer();

			}

		}
		if ( tuid=== null ) {

			tuid = data.id;
			ttotal = data.inc;

		}
		//logger.log( data );
		
		timeout = window.setTimeout( resolveTimer, 3000 );

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