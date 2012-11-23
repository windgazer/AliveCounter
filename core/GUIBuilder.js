window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GUIBuilder = (function( domain ) {

	var id = "content",
		template = typeof nl_windgazer_template==="undefined"?"":nl_windgazer_template;
		dblclick = false;

	LinkListener.addHandler( "reset", function( a ) {

		render();
		return false;

	});

	var isTemplateQueueEmpty = function() {

		var q = windgazer.ALCounterHelper.queue,
			queueEmpty = true;
		for (n in q) { queueEmpty = queueEmpty && !q.hasOwnProperty(n) };
		
		return queueEmpty

	};
	
	var render = function() {

		if ( isTemplateQueueEmpty() ) {

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