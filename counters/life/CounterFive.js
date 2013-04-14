window.windgazer = typeof window.windgazer == "undefined"? {}: window.windgazer;

var CounterFive = ( function( domain ) {

	var type = "CounterFive";
	
	ClassTemplate.loadTemplate(type);
	
	FastButtonListener.addHandler( "countFiveUp", function( a ) {
		return domain.ALCounterHelper.modifyCounterByLink( a, 5 );
	});
	FastButtonListener.addHandler( "countFiveDown", function( a ) {
		return domain.ALCounterHelper.modifyCounterByLink( a, -5 );
	});

	var CounterFiveClass = ALCounter.extend({
		init: function( params ) {
			this._super( params );
			this.type = type; //Type is different...
		}
	});
	
	domain.ALCounterHelper.addType( type, CounterFiveClass );

	return CounterFiveClass;

})( windgazer );
