window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GUIBuilder = ( function( domain ) {

	var defaultId = "content",
		id = defaultId,
		template = typeof nl_windgazer_template==="undefined"?"":nl_windgazer_template;
		dblclick = false;
		startHash = document.location.hash,
		logStash = new Array();
	    
    function bubbleEvent( source, target, event ) {
        source.on( event, function( e ) {
            target.trigger( event, e );
        } );
    }

	function GUIBuilderClass() {
	    //Nothing for now.
	    this.counters = new Array();
	};

	GUIBuilderClass.prototype = {

        render: function() {
            
            var promises = new Array();
            this.counters = new Array();

            this.trigger( "gui.render", { src: this } );

            var cnt = document.getElementById( id );

            if ( cnt ) {

                cnt.innerHTML = "";
                
                if ( dblclick === false ) {
                    dblclick = Events.attach( cnt, "dblclick", function(e) {
                        return Events.cancel(e||Event);
                    } );
                    Events.attach( cnt, "selectstart", function(e) {
                        return Events.cancel(e||Event);
                    } );
                }
    
                for (var i = 0; i < template.length; i++ ) {

                    var ct = template[ i ],
                        t = windgazer.ALCounterHelper.getType( ct.type ),
                        promise = new RSVP.Promise(),
                        c = new t({
                            title: ct.title,
                            value: ct.value
                        });
                    
                    bubbleEvent( c, this, "counter.modified" )

                    c.renderTemplate().then( function( v ) {

                        cnt.appendChild( v.node );
                        promise.resolve( { node: v.node } );

                    } );

                    this.counters.push( c );
                    promises.push( promise );
    
                }
                
                cnt.className = cnt.className.replace(/ ?counters_./gi, "");
                cnt.className += " counters_" + template.length;

            }

            return RSVP.all( promises );

        },
        setRoot: function( guid ) {
            id = guid;
        },
        getRoot: function() {
            return id;
        },
        setTemplate: function( t ) {
            template = t;
        },
        getTemplate: function() {
            return template;
        },
        getCounters: function() {
            return this.counters;
        }

	}

	RSVP.EventTarget.mixin( GUIBuilderClass.prototype );

	//+++OPTIONS
	FastButtonListener.addHandler( "reset", function( a ) {

		gb.render();
		return true;

	});
	//OPTIONS---

	//Prevent endless 'back'-button behavior (keeping history clean...)
	FastButtonListener.addHandler( "dialogEnd", function( a ) {

		//Making sure we're not still on the first page dialog that we opened with...
		if ( document.location.hash !== startHash ) {
			history.back(1);
			return false;
		} else {
		    if (a.href) {
		        document.location.replace( a.href );
		    } else {
                document.location.replace( "#" + a.target.id );
		    }
		    Interactions.clear();
			startHash = document.location.hash;
			return false;
		}
		return true;

	} );
	
	function pad( i, n ) {
		return (1<<2).toString(2).substr(1,n-(""+i).length) + i;
	}
	
	var gb = new GUIBuilderClass();
	
	function setupLogTable( table ) {

		var tr = table.appendChild( document.createElement("thead") ).
			appendChild( document.createElement("tr") );

		tr.appendChild( document.createElement( "th" ) ).
			appendChild( document.createTextNode( "" ) );

		for (var i = 0; i < template.length; i++ ) {
			var ct = template[ i ];
			var cell = tr.appendChild( document.createElement( "td" ) );
			cell.setAttribute("colspan", 2);
			cell.appendChild( document.createTextNode( ct.title ) );
		}

	};
	
	function parseData( data ) {
	    var out = [],
	        blob;

	    if (data.length < 3) { out = data };
	    while ( data.length >= 3 ) {
	        blob = data.splice(0, 3);
	        out[blob[2]] = blob;
	    }
	    return out;
	}
	
	function createEntry( data ) {

		var timeString = pad( data.time.getHours(), 2 ) + ":" + pad( data.time.getMinutes(), 2 ) + ":" + pad( data.time.getSeconds(), 2 ),
	    	dataEntry = data.content,
	    	dataEntered = parseData( dataEntry );

		//Create a new table-row with log-entry data
		var entry = document.createElement("tr");

		entry.appendChild( document.createElement( "th" ) ).
			appendChild( document.createTextNode( timeString ) );

		for (var i = 0; i < template.length; i++ ) {
			var ct = template[ i ],
				inc = false,
				total = false;
			
			if ( dataEntered[ct.title] ) {
				inc = dataEntered[ct.title][0];
				total = dataEntered[ct.title][1];
			}
			entry.appendChild( document.createElement( "td" ) ).
				appendChild( document.createTextNode( inc===false?"":inc ) );
			entry.appendChild( document.createElement( "td" ) ).
				appendChild( document.createTextNode( total===false?"":total ) );
		}

		if ( dataEntered.length > 0 ) {
			var cell = entry.appendChild( document.createElement( "td" ) );
			cell.className = "free";
			cell.appendChild( document.createTextNode( dataEntry[0] ) );
		}

		return entry;
		
	};
	
	function parseLog( data ) {

		var table = document.querySelector("#log table");

		var entry = createEntry( data );

		var log = document.querySelector("#log tbody");

		//Create the table contents if not available
		if ( !log ) {

			setupLogTable( table );

			log = table.appendChild( document.createElement("tbody") );

		}
		if ( log ) log.insertBefore( entry, log.firstChild );
		

	};
	
	gb.on( "log.modified", function( e ) {

		var table = document.querySelector("#log table"),
		    data = e.data;

		if ( !table ) {
			logStash.push(data);
		} else {
			var d = null;
			while ( d = logStash.shift() ) {
				parseLog( d );
			}
			parseLog( data );
		}

	});

	Events.attach( window, "load", function() {
	    gb.render();
	});

	return gb;

})( windgazer );