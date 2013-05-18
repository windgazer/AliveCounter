window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GameLog = (function( domain ) {

    var Logger = Class.extend( {
        init: function() {
            this.logs = new Array();
            this.log("Start");
        },
        log: function( ) {
            var now = new Date(),
                args = []; args.push.apply(args, arguments);
            var entry = {
                    time: now,
                    content: args
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
    
    var promise = null,
        logEntries = {},
        logger = new Logger(),
        timeout = false;

	function resolveTimer() {

        if ( timeout ) {
            //Clear current timeout
            window.clearTimeout( timeout );
        }
        timeout = false;
        
        var args = [],
            i;
        
        for (i in logEntries) {
            var uid = i,
                entry = logEntries[uid],
                cntr = domain.counters[uid];

            args[args.length] = entry.mod;
            args[args.length] = cntr.getValue();
            args[args.length] = cntr.getTitle();

        }

		try {
			logger.log.apply( logger, args );
		} catch ( whatever ) { if ( console ) console.error( args ); }
		
		logEntries = {};

	}
	
	function logCounterModification( e ) {

	    if ( timeout ) {
            //Clear current timeout
            window.clearTimeout( timeout );
	    }
	    //Set timeout
        timeout = window.setTimeout( resolveTimer, 2000 );
        
        var uid = e.id,
            entry = logEntries[uid]?logEntries[uid]:{ id: uid, mod: 0 };

        entry.mod += e.inc;
        
        logEntries[uid] = entry;

	}

	GUIBuilder.on("gui.render", function( eventType, data ) {

	    resolveTimer();
		logger.log( "New Game" );

	});

	GUIBuilder.on("counter.modified", logCounterModification);
	
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