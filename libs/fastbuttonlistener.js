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
		coords			= new Array(),
		timers			= new Array(),
		body			= document.documentElement||document.body,
		handlers		= {},
		touchEnd		= false,
		touchMove		= false
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
		if ( a !== false ) {
			//Add start coords
			addCoords(e);
			//Add touch handlers
			touchMove = events.attach( t, "touchmove", function( e ) {
				handleTouchMove(e);
			});
			touchEnd = events.attach( body, "touchend", function( e ) {
				handleTouchEnd(e);
			});
			timers.push( w.setTimeout(clear, 2500) );
			return events.cancel( e );
		}

	}
	
	function handleTouchMove(e) {
		var e = e||event,
			t = e.target||e.srcElement;
		
	}
	
	function handleTouchEnd(e) {
		var e = e||event,
			t = e.target||e.srcElement;
		
		if ( coords.length > 0 && t === coords[0].t ) {
			handleClick( e, TYPE.TOUCH_END );
		}

		reset();
		return events.cancel( e );
	}

	function handleClick( e, type ) {

		var e = e||event,
			t = e.target||e.srcElement;

		var a = validateNode( t );
		if ( (type > TYPE.CLICK || coords.length < 1) && a !== false ) {
			var r = handlers[a.action]( a, type );
		}

	}

	function addCoords(e) {

		var x = e.touches[0].clientX,
			y = e.touches[0].clientY,
			t = e.target||e.srcElement;
		
		coords.push({x:x,y:y,t:t});

		var c = coords;
		timers.push( w.setTimeout(c.shift, 2000) );
		
	}
	
	function reset() {
		//unset touchEnd/touchMove
		if (touchMove){
			events.detach(touchMove);
			touchMove = false;
		}
		if (touchEnd) {
			events.detach(touchEnd);
			touchEnd = false;
		}
	}
	
	function clear() {
		reset();
		while (timers.length) {
			w.clearTimeout( timers.shift() );
		}
		coords = new Array();
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

		var LinkListenerClick = events.attach( body, "click", function( e ) {
			handleClick( e, TYPE.CLICK );
		} );

		var LinkListenerTouch = events.attach( body, "touchstart", function( e ) {
			handleTouchStart( e, TYPE.TOUCH );
		} );

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
				console.log("+++++++++++", coords, timers);
				clear();
				events = this.eventsOrigin;
			}

	};

	init();

	return publicInterface;

} )( window, document, Events );