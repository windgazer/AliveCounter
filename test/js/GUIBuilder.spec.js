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
			ClassTemplate.addTemplate("ALCounter", "<p id='${id}'>${value}</p>");
			
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

		    var finished = false;
		    
		    runs( function() {

		        //Call for render
	            GUIBuilder.render().then( function () {
	                finished = true;
	            });

		    } );
		    
		    waitsFor( function() {
		        return finished;
		    }, 2000, "Gotta finish rendering...");
		    
		    
		    runs ( function() {

		        //Check if rendering is unlocked
                expect(document.getElementById(id).innerHTML.length > 0).toBe( true );

		    } );
	
		});
		it("will block until all queued counters are finished", function() {

		    //TODO rewrite this test now that queue is gone and working with promises instead...
	
		});
		it("will modify a counter upon clicking", function() {
	

            var finished = false;
            
            runs( function() {

                //Call for render
                GUIBuilder.render().then( function () {
                    finished = true;
                });

            } );
            
            waitsFor( function() {
                return finished;
            }, 2000, "Gotta finish rendering...");

            runs ( function() {
                finished = false
    			var m = document.getElementById(id).innerHTML.match(re);
    			var cnt = windgazer.ALCounterHelper.getCounter(m[1]);
    			//Cause modify event
    			cnt.modify(1).then( function(){
    			    finished = true;
    			} );
			} );
            
            waitsFor( function() {
                return finished;
            }, 2000, "Gotta finish modification...");

            runs ( function() {
                finished = false
                //Check for render-change
                var m2 = document.getElementById(id).innerHTML.match(re);
                expect(m2[2]).toBe("1");
            } );

		});
		it("will reset all counters upon render ", function() {
	

            var finished = false;
            
            runs( function() {

                //Call for render
                GUIBuilder.render().then( function () {
                    finished = true;
                });

            } );
            
            waitsFor( function() {
                return finished;
            }, 2000, "Gotta finish rendering...");

            runs ( function() {
                finished = false
                var m = document.getElementById(id).innerHTML.match(re);
                var cnt = windgazer.ALCounterHelper.getCounter(m[1]);
                //Cause modify event
                cnt.modify(1).then( function(){
                    finished = true;
                } );
            } );
            
            waitsFor( function() {
                return finished;
            }, 2000, "Gotta finish modification...");

            runs ( function() {
                finished = false
                //Check for render-change
                var m2 = document.getElementById(id).innerHTML.match(re);
                expect(m2[2]).toBe("1");
                //Reset
                GUIBuilder.render().then( function(){
                    finished = true;
                } );
            } );
            
            waitsFor( function() {
                return finished;
            }, 2000, "Gotta finish modification...");

            runs ( function() {
    			//Check for render-origin
    			var m2 = document.getElementById(id).innerHTML.match(re);
    			expect(m2[2]).toBe("0");
			} );
	
		});

	});

});
