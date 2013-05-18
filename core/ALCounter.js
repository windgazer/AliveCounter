window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var ALCounter = ( function( domain ) {

	var uidI = 0,
		type = "ALCounter",
		counters = {},
		types = {};
	
	domain.counters = counters;
	
	DragDrop.addHandler('life', function(src,trgt) {
//	    console.log('%cFiring handler!!','color:blue;',src, trgt);
	    if (src.id !== trgt.id) {
            helper.getCounter(src.id).modify(-1);
            helper.getCounter(trgt.id).modify(+1);
	    }
	})
	
	helper = {

			addType: function( type, object ) {

				types[ type ] = object;

			},
			
			getType: function( type ) {

				return types[ type ];

			},
			
			getCounter: function( id ) {

				return counters[id];

			},
			
			modifyCounterByLink: function( a, inc ) {
				var counter = counters[a.id];

				counter.modify( inc );
				return false;
			}

	};

	domain.ALCounterHelper = helper;

	function generateUID() {
		return type + uidI++;
	};
	
	ClassTemplate.loadTemplate( type );
	
	FastButtonListener.addHandler( "countUp", function( a ) {
		return helper.modifyCounterByLink( a, 1 );
	});
	FastButtonListener.addHandler( "countDown", function( a ) {
		return helper.modifyCounterByLink( a, -1 );
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
			this.trigger( "counter.modified", { id: this.id, counter: this, inc: inc } );
			return this.renderTemplate( this.node );
		},
		renderTemplate: function( node ) {
			var div = document.createElement("div"),
				that = this,
				values = {
					title	: that.getTitle(),
					id		: that.getId(),
					value	: that.getValue(),
					type	: that.getType()
				};

			return ClassTemplate.renderTemplate( that.type, values, div ).then( function( v ) {
			    that.node = v.node.firstChild;
			    if ( node && node.parentNode ) {
			        var p = node.parentNode;
			        node.parentNode.replaceChild( that.node, node );
			    }
			    return { node: that.node };
			} );
		}
	});
	
	RSVP.EventTarget.mixin( alcounterClass.prototype );

	helper.addType( type, alcounterClass );

	return alcounterClass;

})( windgazer );
