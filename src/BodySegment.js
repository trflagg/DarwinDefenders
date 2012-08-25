define(["./util"],
function(util) {
	BodySegment = function() {
		BodySegment.superclass.constructor.call(this);
		
		return this;
	};
	

	BodySegment.prototype = {
	};
	
	extend(BodySegment, CAAT.ActorContainer, null);
	
	return BodySegment;
});