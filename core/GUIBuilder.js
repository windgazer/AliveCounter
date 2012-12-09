window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GUIBuilder = (function( domain ) {

	var defaultId = "content",
		id = defaultId,
		template = typeof nl_windgazer_template==="undefined"?"":nl_windgazer_template;
		dblclick = false;
		startHash = document.location.hash;

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
				var t = windgazer.ALCounterHelper.getType(ct.type);
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
	
	ce.attachEvent("log.modified", function(eventType, data) {

		var out = pad( data.time.getHours(), 2 ) + ":" + pad( data.time.getMinutes(), 2 ) + ":" + pad( data.time.getSeconds(), 2 ) + " - ";
		for ( var j = 0; j < data.content.length; j++ ) {
			if ( j > 0 ) {
				out += " ";
			}
			out += JSON.stringify( data.content[j] );
		}
		var span = document.createElement("span");
		span.appendChild( document.createTextNode( out ) );
		var log = document.getElementById("log");
		if ( log ) log.appendChild( span );

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