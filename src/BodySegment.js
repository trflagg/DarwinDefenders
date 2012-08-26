define(["./util"],
function(util) {
	BodySegment = function() {
		BodySegment.superclass.constructor.call(this);
		
		return this;
	};
	

	BodySegment.prototype = {
		type: null,
		
		checkPointCollision : function(pos)
		{
			return false;
		}
	};
	
	extend(BodySegment, CAAT.ActorContainer, null);
	
	return BodySegment;
});