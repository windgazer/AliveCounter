window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GUIBuilder = (function( domain ) {
	var queueEmpty = true;

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

		if ( queueEmpty ) {
			var cnt = document.getElementById("content");
			cnt.innerHTML = "";

			for (var i = 0; i < nl_windgazer_template.length; i++ ) {

				var ct = nl_windgazer_template[ i ];
				var t = windgazer.ALCounterHelper.getType(ct.type);
				var c = new t({
					title: ct.title,
					value: ct.value
				});
				cnt.appendChild(c.renderTemplate());

			}

		}

	};
	
	ce.attachEvent("template.finished", function(eventType, data) {

		queueEmpty = isTemplateQueueEmpty();
		Console.log("receiving event template.finished.", data, queueEmpty);
		render();

	});
	
	ce.attachEvent("counter.modified", function( eventType, data ) {

		var node = document.getElementById( data.id );
		if (node) {

			node.parentNode.replaceChild( data.counter.renderTemplate(), node );

		};

	});
	
	queueEmpty = isTemplateQueueEmpty();
	
	console.log( queueEmpty );
	
	render();

	return {};

})( windgazer );