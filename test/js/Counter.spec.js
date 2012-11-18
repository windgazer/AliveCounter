describe("ALCounter", function() {
	it("exists", function() {
		expect(ALCounter).toBeDefined();
	});
	it("can create a new one", function() {
		var alc = new ALCounter();
		expect(alc).toBeDefined();
		expect(alc.getId().indexOf("ALCounter")).toBe(0);
	});
	it("creates unique id's per instance", function() {
		var alc1 = new ALCounter();
		var alc2 = new ALCounter();
		
		expect(alc1.getId()).not.toEqual(alc2.getId());
	});
});
