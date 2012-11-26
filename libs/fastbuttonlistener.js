/**
 * FastButtonListener is a singleton class that listens to certain
 * events in order to ascertain if that was a valid call to action
 * on a 'fast button'.
 * The concept of a 'fast button' is based on an answer by google
 * to my own negative experiences with using 'anchors' as call to
 * action elements and how this fails to bring the right kind of
 * responsiveness on HTML5 based applications.
 * 
 * As a result it borrows from my own LinkListener and the concepts
 * outlined in the google article, on hopes of creating the same
 * powerful and easy-to-use solution as what I had before...
 * 
 * @see https://developers.google.com/mobile/articles/fast_buttons
 */

var FastButtonListener = ( function( w, document, eventsGlobal ){

	var re 				= /^b$/i,
		startNode		= false,
		body			= document.documentElement||document.body,
		handlers		= {},
		touchEnd		= false,
		mouseUp			= false
		events			= eventsGlobal,
		dataAttributes	= [ "action", "tid" ]; //list of data-* attributes we want to access

	var TYPE = {
			CLICK		: 1,
			TOUCH_START	: 2,
			TOUCH_MOVE	: 4,
			TOUCH_END	: 8
	}

	//Setup some extra touch handlers and init the right info
	function handleTouchStart(e) {

		var e = e||event,
			t = e.target||e.srcElement;

		//validate target node;
		var a = validateNode( t );
		if ( startNode === false && a !== false ) {
			//Add start node
			startNode = t;
			var race = true;
			//Add touch handlers
			var f = function( e ) {
				if (race) {
					race = false;
					handleTouchEnd(e);
				}
			}
			touchEnd = events.attach( body, "touchend", f );
			//Add touch handlers
			mouseUp = events.attach( body, "mouseup", f );
		}

	}
	
	function handleTouchEnd(e) {
		
		if ( startNode !== false ) {

			var e = e||event,
				t = e.target||e.srcElement;
			
			if ( startNode && startNode === t ) {
				handleClick( e, TYPE.TOUCH_END );
			}
			startNode = false;
	
			reset();
		}

		return events.cancel( e );
	}

	function handleClick( e, type ) {

		var e = e||event,
			t = e.target||e.srcElement;

		var a = validateNode( t );
		if ( a !== false ) {
			var r = handlers[a.action]( a, type );
		}

	}
	
	function reset() {
		//unset events
		if (mouseUp){
			events.detach(mouseUp);
			mouseUp = false;
		}
		if (touchEnd) {
			events.detach(touchEnd);
			touchEnd = false;
		}
	}
	
	function validateNode( n ) {

		if ( re.test( n.nodeName ) ) {

			var a = parseNode( n );
			if ( a && a.action && handlers[a.action] ) {
				return a;
			}
			
		}
		
		return false;

	}

	function parseNode( n, type ) {

		var o = { n: n };

		for ( var i = dataAttributes.length; i--; ) {
			var d = dataAttributes[i];
			o[d] = n.getAttribute( "data-" + d );
		}

		if ( o.tid ) {
			var t = document.getElementById( o.tid );
			o["target"] = t;
		}

		return o;

	}

	function init() {

		/**
		 * To protect stupid developers, mobile devices seem to still implement
		 * a mousedown/up event-stack on top of touchstart/end. Since I won't
		 * trust the bastards to keep this up I've implemented race-condition
		 * checks.
		 * As the above mentioned doesn't appear to happen simultaneously I've
		 * had to set the delay to 150 milliseconds. At this speed my test-devices
		 * did not register ghost-clicks and the responsiveness was acceptable.
		 */
		var race = true;
		
		var f = function( e ) {
			if (race) {
				race = false;
				window.setTimeout( function(){ race = true; }, 150 );
				handleTouchStart( e, TYPE.TOUCH );
			}
		};

		var LinkListenerClick = events.attach( body, "mousedown", f );

		var LinkListenerTouch = events.attach( body, "touchstart", f );

	}

	var publicInterface = {

			addHandler: function( action, handler ) {
				handlers[ action ] = handler;
			},
			debug: function( eventsOverride ) {
				console.debug(this);
				this.eventsOrigin = events;
				events = eventsOverride;
				init();
			},
			endDebug: function() {
				reset();
				events = this.eventsOrigin;
			}

	};

	init();

	return publicInterface;

} )( window, document, Events );