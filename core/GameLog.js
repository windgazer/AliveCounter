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
			this.trigger( "log.modified", { data:entry } );
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
	
	RSVP.EventTarget.mixin( Logger.prototype );

	var logger = new Logger(),
		timeout = false,
		tuid = null,
		ttotal = 0;

	function resolveTimer() {

		var cntr = domain.counters[tuid];
		try {
			logger.log( ttotal, cntr.getValue(), cntr.getTitle() );
		} catch ( whatever ) { if ( console ) console.error( whatever ); }
		tuid = null;
		ttotal = 0;
		timeout = false;

	}

	GUIBuilder.on("gui.render", function( eventType, data ) {

		logger.log( "New Game" );

	});

	GUIBuilder.on("counter.modified", function( e ) {

		if ( timeout ) {

			//Clear current timeout
			window.clearTimeout( timeout );

			if ( tuid == e.id ) {

				ttotal += e.inc;

			} else {

				resolveTimer();

			}

		}
		if ( tuid=== null ) {

			tuid = e.id;
			ttotal = e.inc;

		}
		
		timeout = window.setTimeout( resolveTimer, 3000 );

	});
	
	function bubbleEvent( source, target, event ) {
	    source.on( event, function( e ) {
	        target.trigger( event, e );
	        GUIBuilder.trigger( event, e );
        } );
	}
    
    function GameLog() {
        bubbleEvent( logger, this, "log.modified" );
    };
    
    GameLog.prototype = {
        getLog: function() {
            return logger.toString();
        },
        clearLog: function() {
            logger = new Logger();
            bubbleEvent( logger, this, "log.modified" );
        }
    };

    RSVP.EventTarget.mixin( GameLog.prototype );
	
	return new GameLog();

})( windgazer );