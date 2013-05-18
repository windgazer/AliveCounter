describe("GameLog", function() {

    //Fake event with only those parts of an event that are required for script to work
	var resetEvent = {
			button: 0,
			target: {
				nodeName: "a",
				getAttribute: function() {
					return "reset";
				}
			}
	}
	
	beforeEach( function() {

	    var id = GUIBuilder.getRoot(),
			n = document.getElementById(id);
		
		if (n) {
			n.parentNode.removeChild(n);
		}

		var n = document.createElement("div");
		n.id = id;
		document.body.appendChild(n);
		GUIBuilder.setTemplate( 
		        [
                     {
                         title: "My Life",
                         type:"CounterFive",
                         value:20
                     },
                     {
                         title: "Player 1",
                         type:"CounterFive",
                         value:20
                     }
                ]
		);
		//GameLog.clearLog();

	});

	it("Exists", function() {

		expect(GameLog).toBeDefined();

	});
	
	it("Can render a string with log statements", function() {

		var log = GameLog.getLog();
		expect(typeof log).toBe("string");

	});
	
	it("Logs a game reset", function() {

	    var finished = false,
	        log1 = GameLog.getLog();

	    runs( function() {
	        GUIBuilder.on( "render", function() {
	            finished = true;
	        });
	        GUIBuilder.render();
	    } );
        
        waitsFor( function() {
            return GameLog.getLog() !== log1;
        }, 2000, "game reset...");

        runs( function() {
    		var log2 = GameLog.getLog();
    		expect(log1).not.toBe(log2);
        } );
		
	});
	
	it("Logs a counter modification", function() {

	    jasmine.Clock.useMock();		

	    var counters = window.windgazer.counters,
		    guids = new Array(),
		    logBefore = GameLog.getLog();

		for ( var cntr in counters ){
            if ( counters.hasOwnProperty( cntr ) ) {
                guids.push(cntr);
            }
        }

		GUIBuilder.render();
	    GUIBuilder.getCounters()[0].modify( 1 );

	    jasmine.Clock.tick(5000);

        expect( logBefore ).not.toBe( GameLog.getLog() );

	});
	
	it("Can forcibly clear the log", function() {

		GameLog.clearLog();

		var log1 = GameLog.getLog();
		
		var count = log1.split("\n").length;
		
		expect(count).toBe(2);

	});
    
    it("Groups multiple modifications on a single counter", function() {

        jasmine.Clock.useMock();        
        GameLog.clearLog();
        
        orgLength = GameLog.getLog().split("\n").length;

        var cntr1 = GUIBuilder.getCounters()[0];
        cntr1.modify(  5 );
        cntr1.modify(  2 );
        cntr1.modify( -3 );

        var log1 = GameLog.getLog(),
            count = log1.split("\n").length;
        expect(count).toBe(orgLength);

        //Fast-forward time ;)
        jasmine.Clock.tick(5000);

        log1 = GameLog.getLog();
        count = log1.split("\n").length;
        expect(count).toBe(orgLength + 1);
        
    });
    
    it("Groups multiple modifications on multiple counters", function() {

        jasmine.Clock.useMock();        
        GameLog.clearLog();
        
        orgLength = GameLog.getLog().split("\n").length;

        var cntr1 = GUIBuilder.getCounters()[0],
            cntr2 = GUIBuilder.getCounters()[1];
        cntr1.modify(  5 );
        cntr1.modify(  2 );
        cntr2.modify( -3 );

        var log1 = GameLog.getLog(),
            count = log1.split("\n").length;
        expect(count).toBe(orgLength);

        //Fast-forward time ;)
        jasmine.Clock.tick(5000);

        log1 = GameLog.getLog();
        count = log1.split("\n").length;
        expect(count).toBe(orgLength + 1);
        
    });

});
