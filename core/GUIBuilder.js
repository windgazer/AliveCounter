window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var GUIBuilder = (function( domain ) {
	var queueEmpty = true;

	var isTemplateQueueEmpty = function() {

		var q = windgazer.ALCounterHelper.queue,
			queueEmpty = true;
		for (n in q) { queueEmpty = queueEmpty && !q.hasOwnProperty(n) };
		
		return queueEmpty

	};
	
	var render = function() {

		if ( queueEmpty ) {

			var alc = new ALCounter();
			document.documentElement.appendChild(alc.renderTemplate());

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