define(["./util", './Body'],
function(util,Body) {
	Ship = function(baseBody) {
		Ship.superclass.constructor.call(this);
		
		this.baseBody = new Body();
		this.addChild(this.baseBody);
		
		return this;
	};
	

	Ship.prototype = {
		baseBody: null,
		
		addBodySegment: function(segment, position) {
			this.baseBody.addBodySegment(segment, position);
		},
		
		shoot : function() {
			var bulletList = this.baseBody.shoot();
			
			return bulletList;
		},
	};
	
	extend(Ship, CAAT.ActorContainer);
	
	return Ship;
});