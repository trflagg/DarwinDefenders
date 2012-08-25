define(["./util"],
function(util) {
	Class = function() {
		Class.superclass.constructor.call(this);
		
		return this;
	};
	

	Class.prototype = {
		
	};
	
	extend(Class, CAAT.ActorContainer);
	
	return Class;
});