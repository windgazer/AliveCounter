window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var CounterFive = ( function( domain ) {

	var uidI = 0,
		type = "CounterFive";

	function generateUID() {
		return type + uidI++;
	};
	
	domain.ALCounterHelper.loadTemplate(type);
	
	FastButtonListener.addHandler( "countFiveUp", function( a ) {
		return domain.ALCounterHelper.modifyCounterByLink( a, 5 );
	});
	FastButtonListener.addHandler( "countFiveDown", function( a ) {
		return domain.ALCounterHelper.modifyCounterByLink( a, -5 );
	});

	var counterFiveClass = ALCounter.extend({
		init: function( params ) {
			this._super( params );
			this.type = type; //Type is different...
		}
	});
	
	domain.ALCounterHelper.addType( type, counterFiveClass );

	return counterFiveClass;

})( windgazer );
