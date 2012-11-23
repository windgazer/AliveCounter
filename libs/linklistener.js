/**
 * A listener that reacts on click in the document.body
 * and checks if it's a link. If a link is clicked
 * it then checks to see if the rel-attribute of that
 * link has a handler in the LinkListener, if so that
 * handler is called upon, if not the click is ignored.
 * It's easy to add new handlers for a specific page,
 * just call upon
 * LinkListener.addHandler(String, function);
 *
 * @class
 * @singleton
 * @version 2.0.121123
 * @author Martin Reurings - http://www.windgazer.nl/
 * @requires Events
 * @see Events
 * @depends events.js
 */

var LinkListener = ( function(){
	var aRE				=/^(a)|(div)|(span)$/i,
		preventHistory	= false,
		handles			= {
			internal:function(link) {
				return true;
			},
			external:function(link) {
				window.open(link.href, "_blank");
				return false;
			}
		},
		dblHandles		= {};
	
	/**
	 * Handler that actually figures out if we're clicking a valid element.
	 * 
	 * @param e The event
	 * @returns undefined
	 */
	function handler(e, dbl){
		var e = e||event;
		if (e.button > 1 || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return true; //stop handling if not left mousebutton or when a modifier key was pressed.
		var target = e.target||e.srcElement;
		if (!target.nodeName) target = target.parentNode; //Old mozilla's and Safari's
		if (aRE.test(target.nodeName)) {
			var h = dbl?dblHandles:handles;
			var rel = target.getAttribute("rel");
			if (rel && h[rel]) {
				if (!h[rel](target, dbl)) return Events.cancel(e);
			}
			if ( preventHistory ) {
				Console.log("Attempting to prevent history entry to be added.");
				window.location.replace( target.href );
				return Events.cancel(e);
			}
		}		
	}

	//Attach the listeners
	var LinkListenerClick = Events.attach(document.documentElement||document.body, "click", function(e) {
		handler(e);
	});
	var LinkListenerDblClick = Events.attach(document.documentElement||document.body, "dblclick", function(e) {
		handler(e, true);
	});

	return {
		/**
		 * Enable and/or disable links that are followed from going into browser history.
		 * This can be usefull for apps that use swipe-left/right for in-app navigation.
		 * 
		 * @param {boolean} b true for enabling, false for disabling. Disabled by default.
		 */
		setPreventHistory: function(b) {
			preventHistory = b;
		},
		/**
		 * Add an extra handler to the listener.
		 * Use this method to add an extra handler for
		 * a rel that hasn't been defined by default.
		 * 
		 * @param {String} id The value of the rel-attribute on which you want to react.
		 * @param {function} handler A function to handle the event, takes the link as a parameter.
		 */
		addHandler:function(id, handler, dbl, both) {
			if ( !dbl || both ) {
				handles[id] = handler;
			}
			if ( dbl || both ) {
				dblHandles[id] = handler;
			}
		}
	};

})();
