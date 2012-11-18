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

	it("throws an exception when getting type", function(){
		var alc1 = new ALCounter();
		var checkedException = function() {
			alc1.getType();
		}
		
		expect( checkedException ).toThrow();
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

});

describe("ALCounterHelper", function() {

	it("loads a template for a type", function() {

		windgazer.ALCounterHelper.loadTemplate("ALCounter");

	});

});
