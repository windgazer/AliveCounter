describe("ALCounterHelper", function() {
	
	it("can return an ALCounter type Class", function() {
		var alclass = windgazer.ALCounterHelper.getType("ALCounter");

		expect(typeof alclass).toBe("function");
		
		var alc = new alclass();

		expect(typeof alc).toBe("object");
	});

});

describe("ALCounter", function() {
	var t0 = "<div id=\"${id}\" class=\"Counter.spec\"><h3>${title}</h3><p>${value}</p></div>",
		t1 = '<h3>My Counter</h3><p>42</p>';

	it("exists", function() {
		expect( ALCounter ).toBeDefined();
	});

	it("can create a new one", function() {
		var alc = new ALCounter();

		expect( alc ).toBeDefined();
	});

	it("creates unique id's per instance", function() {
		var alc1 = new ALCounter();
		var alc2 = new ALCounter();
		
		expect( alc1.getId() ).not.toEqual( alc2.getId() );
	});

	it("gets the type for this type of counter", function(){
		var alc1 = new ALCounter();
		
		expect( alc1.getType() ).toBe("ALCounter");
	});

	it("sets default title to 'No Title'", function(){
		var alc1 = new ALCounter();
		
		expect(alc1.getTitle()).toBe('No Title');
	});
	
	it("sets title to provided title", function(){
		var title = "My Counter";
		var alc1 = new ALCounter( {title: title} );
		
		expect( alc1.getTitle() ).toBe( title );
	});

	it("sets default value to 0", function(){
		var alc1 = new ALCounter();
		
		expect(alc1.getValue()).toBe( 0 );
	});

	it("sets value to provided value", function(){
		var v = 42;
		var alc1 = new ALCounter( {value: v} );
		
		expect( alc1.getValue() ).toBe( v );
	});

	it("can alter the value of the counter", function(){
		var v = 42,
			et = "counter.modified",
			eventType = null,
			id;

		var alc1 = new ALCounter( {value: v} );

		alc1.on( et, function ( event ) {
			eventType = event.type;
			id = event.id;
		} );
		
		alc1.modify(5);

		expect( eventType ).toBe( et );
		expect( id ).toBe( alc1.getId() );
		expect( alc1.getValue() ).toBe( v + 5 );
		
		alc1.modify(-8);
		
		expect( alc1.getValue() ).toBe( v - 3 );
	});
	
	it("renders it's template", function() {
		var v = 42,
			t = "My Counter",
			alc1 = new ALCounter( { title: t, value: v } ),
			node = null;

		ClassTemplate.addTemplate( "ALCounter", t0 );
		runs( function() {

		    alc1.renderTemplate().then( function( v ) {
	            node = v.node;
	        } );

		} );
		
		waitsFor( function() {

		    return node != null;

		}, 3000, "Waiting for counter to render..." );

		runs( function() {

		    expect( node.childNodes.length ).toBe( 2 );
    		expect( node.innerHTML ).toBe( t1 );

		} );

	});

});
