window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GUIBuilder = (function( domain ) {

	var defaultId = "content",
		id = defaultId,
		template = typeof nl_windgazer_template==="undefined"?"":nl_windgazer_template;
		dblclick = false;
		startHash = document.location.hash,
		logStash = new Array();

	//+++OPTIONS
	LinkListener.addHandler( "reset", function( a ) {

		render();
		return true;

	});
	//OPTIONS---

	//Prevent endless 'back'-button behavior (keeping history clean...)
	LinkListener.addHandler( "dialogEnd", function( a ) {

		//Making sure we're not still on the first page dialog that we opened with...
		if ( document.location.hash !== startHash ) {
			history.back(1);
			return false;
		} else {
			document.location.replace( a.href );
			startHash = document.location.hash;
			return false;
		}
		return true;

	} );

	var isTemplateQueueEmpty = function() {

		var q = windgazer.ALCounterHelper.queue,
			queueEmpty = true;
		for (n in q) { queueEmpty = queueEmpty && !q.hasOwnProperty(n) };
		
		return queueEmpty

	};
	
	function pad( i, n ) {
		return (1<<2).toString(2).substr(1,n-(""+i).length) + i;
	}
	
	var render = function() {

		if ( isTemplateQueueEmpty() ) {

			ce.fireEvent("gui.render", {  });

			var cnt = document.getElementById(id);
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

				var ct = template[ i ];
				var t = windgazer.ALCounterHelper.getType( ct.type );
				var c = new t({
					title: ct.title,
					value: ct.value
				});
				cnt.appendChild(c.renderTemplate());

			}
			
			cnt.className = cnt.className.replace(/ ?counters_./gi, "");
			cnt.className += " counters_" + template.length;

		}

	};
	
	ce.attachEvent("template.finished", function(eventType, data) {

		render();

	});
	
	ce.attachEvent("counter.modified", function( eventType, data ) {

		var node = document.getElementById( data.id );
		if (node) {

			node.parentNode.replaceChild( data.counter.renderTemplate(), node );

		};

	});
	
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
	
	function createEntry( data ) {

		var timeString = pad( data.time.getHours(), 2 ) + ":" + pad( data.time.getMinutes(), 2 ) + ":" + pad( data.time.getSeconds(), 2 ),
	    	dataEntry = data.content,
	    	dataEntered = false;

		//Create a new table-row with log-entry data
		var entry = document.createElement("tr");

		entry.appendChild( document.createElement( "th" ) ).
			appendChild( document.createTextNode( timeString ) );

		for (var i = 0; i < template.length; i++ ) {
			var ct = template[ i ],
				inc = false,
				total = false;
			
			if ( ct.title == dataEntry[2] ) {
				inc = dataEntry[0];
				total = dataEntry[1];
				dataEntered = true;
			}
			entry.appendChild( document.createElement( "td" ) ).
				appendChild( document.createTextNode( inc===false?"":inc ) );
			entry.appendChild( document.createElement( "td" ) ).
				appendChild( document.createTextNode( total===false?"":total ) );
		}

		if ( !dataEntered ) {
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
		if ( log ) log.appendChild( entry );
		

	};
	
	ce.attachEvent("log.modified", function(eventType, data) {

		var table = document.querySelector("#log table");


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

	render();

	return {

		isTemplateQueueEmpty:isTemplateQueueEmpty,
		render: render,
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
		}

	};

})( windgazer );