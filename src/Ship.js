define(["./util", './Body'],
function(util,Body) {
	Ship = function(baseBody) {
		Ship.superclass.constructor.call(this);
		
		this.baseBody = new Body();
		this.addChild(this.baseBody);
		this.setSize(4 * util.bodySizeH, 6 * util.bodySizeV);
		this.bodyCount++;
		
		return this;
	};
	

	Ship.prototype = {
		baseBody: null,
		bodyCount: 0,
		alive: true,
		
		hit: function(bullet) {
			//they got us!
			//remove baseBody
			this.removeChild(this.baseBody);
			//callback to parent or something
			
		},
		
		die: function() {
			//they got us!
			this.alive = false;
		},
		
		checkBulletCollision: function(bullet) {
			//just checking
			if (bullet === undefined)
			{
				return false;
			}
			
			//ask our ship body
			var seg = this.baseBody.checkBulletCollision(bullet);
			
			if (seg !== null)
			{
				//is was it the base?
				if (seg == this.baseBody)
				{
					//we're toast
					this.die();
				}
				else
				{
					//no biggie
				}
				return true;
			}
			
			return false;
		},
		
		addBodySegment: function(segment, position) {
			var result =this.baseBody.addBodySegment(segment, position);
			if (segment.bodyType == util.TYPE_BODY)
			{
				this.bodyCount++;
			}
			return this;
		},
		
		getCollisionRect: function() {
			
			return this.baseBody.getCollisionRect();
		},
		
		shoot : function(morality, owner) {
			var bulletList = this.baseBody.shoot(morality, owner);
			
			return bulletList;
		},
		
		addBodySegmentSomewhere: function(segment) {
			if (segment === null)
			{
				return this;
			}
			var result =this.baseBody.addBodySegmentSomewhere(segment);
			if (segment.bodyType == util.TYPE_BODY)
			{
				this.bodyCount++;
			}
			return this;
			
		},
			
		/*
		paint: function(director, time) {
			var ctx = director.ctx;
			
			ctx.strokeStyle = "#000000";
			var r = this.getCollisionRect();
			var p = this.viewToModel(new CAAT.Point(r.x, r.y));
			ctx.strokeRect(p.x, p.y, r.width, r.height);
		},
		/**/
		
	};
	
	extend(Ship, CAAT.ActorContainer);
	
	return Ship;
});