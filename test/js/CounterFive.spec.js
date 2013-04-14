describe("ALCounterHelper", function() {
	
	it("can return an CounterFive type Class", function() {
		var alclass = windgazer.ALCounterHelper.getType("CounterFive");

		expect(typeof alclass).toBe("function");
		
		var alc = new alclass();

		expect(typeof alc).toBe("object");
	});

});

describe("ALCounter", function() {

    it("renders it's template", function() {
		var v = 42,
			t = "My Counter",
			alc1 = new CounterFive( { title: t, value: v } ),
			node = null;

		runs( function() {

		    alc1.renderTemplate().then( function( v ) {
	            node = v.node;
	        } );

		} );
		
		waitsFor( function() {

		    return node != null;

		}, 3000, "Waiting for counter to render..." );

		runs( function() {

    		expect( node.className ).toContain( "CounterFive" );

		} );

	});

});
