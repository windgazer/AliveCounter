var ALCounter = ( function() {

	var uidI = 0;

	function generateUID() {
		return "ALCounter" + uidI++;
	};

	return Class.extend({
		init: function( params ) {
			this.id = generateUID();
		},
		getId: function() {
			return this.id;
		}
	});

})();