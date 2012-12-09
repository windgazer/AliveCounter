describe("GameLog", function() {
	
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
		
	});
	
	it("Groups multiple modifications on a single counter", function() {
		
	});

});
