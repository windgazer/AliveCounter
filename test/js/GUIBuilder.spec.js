describe("GUIBuilder", function() {
	
	var id = "dummyUI",
		t = [
		     { title: "Test", value: 0, type: "ALCounter" }
	    ],
		oid = null,
		re = /^<p id=.(.*).>(.*)<\/p>$/i;
	    

	it("exists", function() {

		expect(GUIBuilder).toBeDefined();

	});
	
	it("can set templates", function() {

		GUIBuilder.setTemplate( t );
		
		expect(GUIBuilder.getTemplate()).toBe( t );

	});

	it("can read default id", function() {

		expect(GUIBuilder.getRoot()).toBe("content");

	});
	
	it("can set a root id", function() {

		GUIBuilder.setRoot( id );
		
		expect(GUIBuilder.getRoot()).toBe( id );
		
	});

	describe("UI building", function() {
	
		beforeEach( function() {
	
			oid = GUIBuilder.getRoot();
			windgazer.ALCounterHelper.addTemplate("ALCounter", "<p id='${id}'>${value}</p>");
			
			var node = document.createElement( "div" );
			node.id = id;
			
			document.body.appendChild( node );
			GUIBuilder.setRoot( id );
			GUIBuilder.setTemplate( t );
	
		});
		
		afterEach( function() {
	
			var node = document.getElementById( id );
			if ( node ) node.parentNode.removeChild( node );
			GUIBuilder.setRoot( oid );
	
		});
		
		it("will create counters based on a 'template'", function() {
			
			//Call for render
			GUIBuilder.render();
			//Check if rendering is unlocked
			expect(document.getElementById(id).innerHTML.length > 0).toBe(true);
	
		});
		it("will block until all queued counters are finished", function() {
	
			//Add fake template to queue
			windgazer.ALCounterHelper.queue["dummy"] = true;
			GUIBuilder.render();
			//Check if rendering is blocked
			expect(document.getElementById(id).innerHTML).toBe("");
			//Remove fake template from queue
			delete windgazer.ALCounterHelper.queue["dummy"];
			GUIBuilder.render();
			//Check if rendering is unlocked
			var ih = document.getElementById(id).innerHTML;
			var m = ih.match(re);
			console.log(ih, m);
			expect(m).toBeTruthy();
	
		});
		it("will modify a counter upon clicking", function() {
	
			//Call for render
			GUIBuilder.render();
			var m = document.getElementById(id).innerHTML.match(re);
			var cnt = windgazer.ALCounterHelper.getCounter(m[1]);
			//Cause modify event
			cnt.modify(1);
			//Check for render-change
			var m2 = document.getElementById(id).innerHTML.match(re);

			expect(m2[2]).toBe("1");
		});
		it("will reset all counters upon render ", function() {
	
			//Call for render
			GUIBuilder.render();
			//Cause modify event
			var m = document.getElementById(id).innerHTML.match(re);
			var cnt = windgazer.ALCounterHelper.getCounter(m[1]);
			cnt.modify(1);
			//Check for render-change
			var m1 = document.getElementById(id).innerHTML.match(re);
			expect(m1[2]).toBe("1");
			//Reset
			GUIBuilder.render();
			//Check for render-origin
			var m2 = document.getElementById(id).innerHTML.match(re);
			expect(m2[2]).toBe("0");
	
		});

	});

});
