window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;
windgazer.ALCounterHelper = {};

var ALCounter = ( function( domain ) {

	var uidI = 0;

	domain.ALCounterHelper = {
			
			queue: {},
			
			templates: {},

			/**
			 * Attempt to load an html-template into memory based on the
			 * type of a 'component'. This method expects the file name
			 * to match the type and the template to reside in the same
			 * directory as well as having the same filename (with an
			 * html extension instead of js...)
			 */
			loadTemplate : function( type ) {

				var scripts = document.getElementsByTagName("script"),
					l = scripts.length,
					i = l,
					re = new RegExp("^(.*/)" + type + ".js\\b.*$", "i");
				
				for (i; i--; ) {
		
					var s = scripts[i];
					var url = s.src;
					var m = url.match( re );
					
					if ( m ) {
		
						var templateUrl = m[1] + type + ".html";

						if ( typeof this.templates[ templateUrl ] === "undefined"
							 && typeof this.queue[ templateUrl ] === "undefined" ) {

							console.log( "Setting new template loading to queue", templateUrl );
							this,queue[ templateUrl ] = new HTTPRequest( null, false );

						}
		
					}
		
				}

			}
			
	};

	function generateUID() {
		return "ALCounter" + uidI++;
	};

	return Class.extend({
		init: function( params ) {
			var params = params||{};
			this.id = generateUID();
			this.title = typeof params.title == 'undefined'?"No Title":params.title;
			this.value = typeof params.value == 'undefined'?0:params.value;
		},
		getId: function() {
			return this.id;
		},
		getType: function() {
			throw "Must be implemented!!";
		},
		getTitle: function() {
			return this.title;
		},
		getValue: function() {
			return this.value;
		}
	});

})( windgazer );
