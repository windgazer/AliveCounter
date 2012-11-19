
describe("ALCounterHelper", function() {
	
	var t = "<div id=\"${id}\" class=\"Counter.spec\"><h3>${title}</h3><p>${value}</p></div>",
		t1 = "<div id=\"id\" class=\"Counter.spec\"><h3>myTitle</h3><p>value</p></div>",
		t2 = "<div id=\"myId\" class=\"Counter.spec\"><h3>myTitle</h3><p>myValue</p></div>",
		t3 = "<div id=\"id\" class=\"Counter.spec\"><h3>myTitle</h3><p>And this is a somewhat longer value type with some <code>&lt;html></code> in the mix :)</p></div>",
		tt = "Counter.spec",
		oldTemplates = {};

	beforeEach(function() {
		oldTemplates = windgazer.ALCounterHelper.templates;
		windgazer.ALCounterHelper.queue = {};
		windgazer.ALCounterHelper.templates = {};
	});

	afterEach(function() {
		windgazer.ALCounterHelper.templates = oldTemplates;
	});
	
	it("loads a template for Counter.spec type", function() {

		runs(function() {
			windgazer.ALCounterHelper.loadTemplate(tt);
		});
		
		waitsFor(function() {
			return windgazer.ALCounterHelper.getTemplate(tt) !== null;
		}, "The template should be available", 500);
		
		runs(function() {
			var tmplt = windgazer.ALCounterHelper.getTemplate(tt);
			console.debug( tmplt );
			expect( tmplt ).toBe( t );
		});
		
	});

	it("parses and renders templates with provided value", function() {
	
		var tmplt = windgazer.ALCounterHelper.fillTemplate( t, {
			title: "myTitle"
		} );
		expect( tmplt ).toBe( t1 );

	});

	it("parses and renders templates with provided values", function() {
	
		var tmplt = windgazer.ALCounterHelper.fillTemplate( t, {
			title: "myTitle",
			id : "myId",
			value : "myValue"
		} );
		expect( tmplt ).toBe( t2 );

	});

	it("parses and renders templates with complex values", function() {
	
		var tmplt = windgazer.ALCounterHelper.fillTemplate( t, {
			title: "myTitle",
			value : "And this is a somewhat longer value type with some <code>&lt;html></code> in the mix :)"
		} );
		expect( tmplt ).toBe( t3 );

	});

});

describe("ALCounter", function() {

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
		var v = 42;
		var alc1 = new ALCounter( {value: v} );
		
		alc1.modify(5);
		
		expect( alc1.getValue() ).toBe( v + 5 );
		
		alc1.modify(-8);
		
		expect( alc1.getValue() ).toBe( v - 3 );
	});
	
	it("renders it's template", function() {
		var v = 42,
			t = "My Counter",
			alc1 = new ALCounter( { title: t, value: v } ),
			node = alc1.renderTemplate();

		console.debug( node, windgazer.ALCounterHelper.templates );
		expect( node.childNodes.length ).toBe( 1 );
		expect( node.firstChild.childNodes.length ).toBe( 4 );
	});

});
