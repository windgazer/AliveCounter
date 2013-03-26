xdescribe("GameLog", function() {
	
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

	});

	it("Exists", function() {

		expect(GameLog).toBeDefined();

	});
	
	it("Can render a string with log statements", function() {

		var log = GameLog.getLog();
		
		expect(typeof log).toBe("string");

	});
	
	it("Logs a game reset", function() {

		var log1 = GameLog.getLog();

		LinkListener.handler( resetEvent );

		var log2 = GameLog.getLog();

		expect(log1).not.toBe(log2);
		
	});
	
	it("Logs a counter modification", function() {
		
		var log1 = GameLog.getLog();
		var counters = window.windgazer.counters;

		for ( var cntr in counters ){
			if ( counters.hasOwnProperty( cntr ) ) {
				cntr = counters[cntr];
				cntr.modify( 1 );
			}
		}
		var log2 = GameLog.getLog();

		expect(log1).not.toBe(log2);

	});
	
	it("Can forcibly clear the log", function() {

		GameLog.clearLog();
		var log1 = GameLog.getLog();
		
		var count = log1.split("\n").length;
		
		expect(count).toBe(2);

	});
	
	it("Groups multiple modifications on a single counter", function() {

		var uid = null,
			counters = window.windgazer.counters,
			orgLength = 0,
			guids = new Array();

		runs( function() {
			
			GameLog.clearLog();
	
			for ( var cntr in counters ){
				if ( counters.hasOwnProperty( cntr ) ) {
					guids.push(cntr);
				}
			}
			
			var uid = guids[0];
			
			var cntr1 = counters[uid],
				cntr2 = counters[guids[1]];
			
			orgLength = GameLog.getLog().split("\n").length;
	
			cntr1.modify(5);
			cntr1.modify(2);
			cntr1.modify(-3);

		});
		
		waitsFor( function() {

			var nl = GameLog.getLog().split("\n").length;
			return nl > orgLength;

		}, "The counter should have been incremented", 7500);

		runs( function() {

			var log1 = GameLog.getLog();
			
			var count = log1.split("\n").length;
			//var newValue = cntr1.getValue();
			
			expect(count).toBe(3);

		});
		
	});

});
