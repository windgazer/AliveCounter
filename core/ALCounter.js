window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var ALCounter = ( function( domain ) {

	var uidI = 0,
		type = "ALCounter",
		counters = {},
		types = {};
	
	domain.counters = counters;
	
	helper = {
			
			queue: {},
			
			templates: {},
			
			re: /\${([^}]+)}/gi,

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

						if ( typeof this.templates[ type ] === "undefined"
							 && typeof this.queue[ templateUrl ] === "undefined" ) {

							var that = this;
							var request = new HTTPRequest( function( wrapper ) {

								var txt = wrapper.httpRequest.responseText;
								delete that.queue[ templateUrl ];
								that.addTemplate( type, txt );
								ce.fireEvent("template.finished", {type: type, template: txt});

							}, false );

							this.queue[ templateUrl ] = request;
							ce.fireEvent( "template.queued", {type: type, url: templateUrl} );
							request.doGet( templateUrl );

						}
		
					}
		
				}

			},
			
			addTemplate : function( type, template ) {

				this.templates[ type ] = template;

			},
			
			getTemplate : function( type ) {

				return this.templates[ type ]?this.templates[ type ]:null;

			},
			
			fillTemplate : function( template, values ) {

				var o = "",
				    m = null,
				    preIndex = 0;

				while (m = this.re.exec(template)) {
					var v = values[m[1]];
					v = typeof v!=="undefined"?v:m[1];
					o += RegExp.leftContext.substr(preIndex) + v;
					preIndex = this.re.lastIndex;
				}

				o += RegExp.rightContext;

				return o;
			},
			
			addType: function( type, object ) {

				types[ type ] = object;

			},
			
			getType: function( type ) {

				return types[ type ];

			},
			
			getCounter: function( id ) {

				return counters[id];

			}
			
	};

	domain.ALCounterHelper = helper;

	function generateUID() {
		return type + uidI++;
	};
	
	helper.loadTemplate(type);
	
	function modifyCounterByLink( a, inc ) {
		var counter = counters[a.id];

		counter.modify( inc );
		return false;
	}
	
	FastButtonListener.addHandler( "countUp", function( a ) {
		return modifyCounterByLink( a, 1 );
	});
	FastButtonListener.addHandler( "countDown", function( a ) {
		return modifyCounterByLink( a, -1 );
	});

	var alcounterClass = Class.extend({
		init: function( params ) {
			var params = params||{};
			this.id = generateUID();
			this.title = typeof params.title == 'undefined'?"No Title":params.title;
			this.value = typeof params.value == 'undefined'?0:params.value;
			this.type = type;
			counters[this.id] = this;
		},
		getId: function() {
			return this.id;
		},
		getType: function() {
			return this.type;
		},
		getTitle: function() {
			return this.title;
		},
		getValue: function() {
			return this.value;
		},
		modify: function( inc ) {
			this.value = this.value + inc;
			ce.fireEvent("counter.modified", { id: this.id, counter: this });
		},
		renderTemplate: function( node ) {
			var doc = document.createDocumentFragment(),
				div = document.createElement("div"),
				template = helper.getTemplate( this.getType() ),
				that = this,
				values = {
					title	: that.getTitle(),
					id		: that.getId(),
					value	: that.getValue(),
					type	: that.getType()
				};
			
			div.innerHTML = helper.fillTemplate( template, values );
			while ( div.firstChild ) doc.appendChild( div.firstChild );
			if ( node ) node.parentNode.replaceChild( node, doc );
			return doc;
		}
	});
	
	helper.addType( type, alcounterClass );

	return alcounterClass;

})( windgazer );
