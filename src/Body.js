define(["./util", "./BodySegment", './Bullet', './EnemyBullet'],
function(util, BodySegment, Bullet, EnemyBullet) {
	Body = function() {
		Body.superclass.constructor.call(this);
		
		this.vertical = util.bodySizeV;
		this.horizontal = util.bodySizeH;
		this.setSize(3 * util.bodySizeH, 6 * util.bodySizeV);
		//this.horizontal = this.vertical * 2 * Math.cos(Math.PI / 6);
		
        this.setFillStyle('#ebce9e');
        this.setStrokeStyle('#000000');

		this.segments = new Array();
		for (var i=0; i<6; i++)
		{
			this.segments[i] = null;
		}
		this.bodyType = util.TYPE_BODY;
		
		return this;
	};
	

	Body.prototype = {
		
		vertical: null,
		horizontal: null,
		segments: null,
		ownerPosition: null,
		owner: null,
		
		addBodySegmentSomewhere: function(segment) {
			var found = false;
			//need a count as a lazy way to thwart infinite loops
			var count = 0;
			//find random position that's open or a body
			while(!found || (count > 100))
			{
				var pos = Math.floor(Math.random() * 6);
				count++;
				if (this.segments[pos] === null)
				{
					this.addBodySegment(segment, pos);
					found = true;
				}
				else if(this.segments[pos].bodyType == util.TYPE_BODY)
				{
					//try and find something on that
					this.segments[pos].addBodySegmentSomewhere(segment);
					found = true;
				}
			}
		},
		
		getCollisionRect: function() {
			var x = this.getBaseX();
			var y = this.getBaseY();
			var width = (this.width) ;
			var height = (this.height); 
			var myRect = new CAAT.Rectangle().setBounds(x,y,width,height);
			
			//check for slaves
			for(var i=0; i<this.segments.length; i++)
			{
				var seg = this.segments[i];
				if (seg !== null)
				{
					if (seg.bodyType == util.TYPE_BODY)
					{
						var newRect = seg.getCollisionRect();
						newRect = this.moveBodyLocationByPosition(newRect, i);
						
						myRect.unionRectangle(newRect);
					}
				}
			}
			
			return myRect;
			
		},
		
		segmentHit: function(seg, position) {
			this.removeChild(seg);
			this.segments[position] = null;
		},
		
		
		checkBulletCollision: function(bullet) {
			//console.log("Body CheckBulletCollision("+bullet.x+","+bullet.y+")");
			var bulletPos = new CAAT.Point(bullet.x, bullet.y);
			var modelPos = this.viewToModel(bulletPos);
			//console.log("modelPos: ("+modelPos.x+","+modelPos.y+")");
			
			//make sure your own mask is secure before helping others
			if (this.isPointInBody(modelPos))
			{
				console.log("********hit BODY********");
				return this;
			}
			
			//now check the segments
			for(var i=0; i<this.segments.length; i++)
			{
				var seg = this.segments[i];
				if (seg !== null)
				{
					if (seg.bodyType == util.TYPE_BODY)
					{
						//run this method instead
						var result = seg.checkBulletCollision(bullet);
						if (result !== null)
						{
							//was it the base
							if (result.bodyType == util.TYPE_BODY)
							{
								//remove it!
								this.segmentHit(result, i)
							}
							return result;
						}
					}
					else
					{
				 		modelPos = seg.viewToModel(new CAAT.Point(bullet.x, bullet.y))
				 		if (seg.checkPointCollision(modelPos))
				 		{
				 			//remove it
				 			this.segmentHit(seg, i);
				 			return seg;
				 		}
					}
				}
			}
			
			return null;
		},
		
		isPointInBody: function(modelPos) {	
			if (this.owner !== null) 
			{
				//convert points for slaves
				modelPos = this.changePointByBodyPosition(modelPos, this.invertPosition(this.ownerPosition));
				//console.log("SLAVE modelPos: ("+modelPos.x+","+modelPos.y+")");
			}
			//convert pos to center
			var centerX = this.x + util.bodySizeH;
			var centerY = this.y + (2 * util.bodySizeV);
			//console.log("centerX: "+centerX+" centerY: "+centerY);
			//check if point is in hexagon
			//big ups to http://www.playchilla.com/how-to-check-if-a-point-is-inside-a-hexagon
			var q2x = Math.abs(modelPos.x - centerX);         // transform the test point locally and to quadrant 2
    		var q2y = Math.abs(modelPos.y - centerY);         // transform the test point locally and to quadrant 2
    		if (q2x > util.bodySizeH || q2y > util.bodySizeV*2) return false;           // bounding test (since q2 is in quadrant 2 only 2 tests are needed)
    		return 2 * util.bodySizeV *util.bodySizeH - util.bodySizeV * q2x - util.bodySizeH * q2y >= 0;
		},
		
		makeSlave: function(owner, ownerPosition) {
			this.owner = owner;
			this.ownerPosition = ownerPosition;
			
			return this;
		},
		
		shoot : function(morality, owner) {
			var bulletList = new Array();
			
			//run through segments looking for guns or bodies
			for (var i=0;i < 6; i++)
			{
				if (this.segments[i] !== null)
				{
					var seg = this.segments[i];
					
					if (seg.bodyType == util.TYPE_BODY)
					{
						//attached bodies shoot
						var bl = seg.shoot(morality, owner);
						bulletList = bulletList.concat(bl);
					}
					else if (seg.bodyType == util.TYPE_GUN)
					{
						//make a bullet based on morality
						if (morality == util.GOOD)
						{
							var bullet = new Bullet();
						}
						else if (morality == util.EVIL)
						{
							var bullet = new EnemyBullet(owner);
						}
						bullet.setLocation(this.getBaseX(), this.getBaseY());
						
						//move based on body if owned body
			 			if (this.owner !== null) 
			 			{
			 				bullet = this.moveBodyLocationByPosition(bullet, this.invertPosition(this.ownerPosition));
			 			}
						//figure out vx & vy based on segment position
						switch(i)
						{
							case util.SEGMENT_TOP_RIGHT:
								bullet = this.moveLocationByPosition(bullet, util.SEGMENT_TOP_RIGHT);
								bullet.vx = 5;
								bullet.vy = -5;
								break;
							case util.SEGMENT_FRONT:
								bullet = this.moveLocationByPosition(bullet, util.SEGMENT_FRONT);
								bullet.vx = 5;
								bullet.vy = 0;
								break;
							case util.SEGMENT_BOTTOM_RIGHT:
								bullet = this.moveLocationByPosition(bullet, util.SEGMENT_BOTTOM_RIGHT);
								bullet.vx = 5;
								bullet.vy = 5;
								break;
							case util.SEGMENT_BOTTOM_LEFT:
								bullet = this.moveLocationByPosition(bullet, util.SEGMENT_BOTTOM_LEFT);
								bullet.vx = -5;
								bullet.vy = 5;
								break;
							case util.SEGMENT_BACK:
								bullet = this.moveLocationByPosition(bullet, util.SEGMENT_BACK);
								bullet.vx = -5;
								bullet.vy = 0;
								break;
							case util.SEGMENT_TOP_LEFT:
								bullet = this.moveLocationByPosition(bullet, util.SEGMENT_TOP_LEFT);
								bullet.vx = -5;
								bullet.vy = -5;
								break;
							
						}
						
						bulletList.push(bullet);
					}
				}
			}
			
			return bulletList;
		},
		
		addBodySegment: function(segment, position) {
			
			if (segment.bodyType == util.TYPE_BODY) 
			{
				this.moveBodyLocationByPosition(segment, position);
				var invertPos = this.invertPosition(position);
				segment.makeSlave(this, invertPos);
				
			}
			else
			{
				this.moveLocationByPosition(segment, position);
			}
			this.segments[position] = segment;
			this.addChild(segment);
			
			return this;
		},
		
		moveLocationByPosition: function( actor, position) {
			
			switch(position)
			{
				case util.SEGMENT_TOP_RIGHT:
					actor.setRotationAnchored(0.261799388+(Math.PI / 3),0,0).setLocation(actor.x + util.bodySizeH * 2, actor.y + util.bodySizeV-util.shieldSize);
					break;
				case util.SEGMENT_FRONT:
					actor.setRotationAnchored(0.261799388+(Math.PI / 3)+(Math.PI / 3),0,0).setLocation(actor.x + 3 * util.bodySizeH, actor.y +  2 * util.bodySizeV);
					break;
				case util.SEGMENT_BOTTOM_RIGHT:
					actor.setRotationAnchored(0.261799388+(3 * (Math.PI / 3)),0,0).setLocation(actor.x + util.bodySizeH * 2, actor.y +  5 * util.bodySizeV);
					break;
				case util.SEGMENT_BOTTOM_LEFT:
					actor.setRotationAnchored(0.261799388+(4 * (Math.PI / 3)),0,0).setLocation(actor.x + 0, actor.y +  5 * util.bodySizeV);
					break;
				case util.SEGMENT_BACK:
					actor.setRotationAnchored(0.261799388+(5 * (Math.PI / 3)),0,0).setLocation(actor.x + -util.bodySizeH, actor.y +  2 * util.bodySizeV);
					break;
				case util.SEGMENT_TOP_LEFT:
					actor.setRotationAnchored(0.261799388,0,0).setLocation(actor.x + 0, actor.y +  util.bodySizeV-util.shieldSize);
					break;
			}	
			
			return actor;
			
		},
		
		moveBodyLocationByPosition: function(body, position) {
			
			switch(position)
			{
				case util.SEGMENT_TOP_RIGHT:
					body.setLocation(body.x + util.bodySizeH, body.y + (-3 * util.bodySizeV));
					break;
				case util.SEGMENT_FRONT:
					body.setLocation(body.x + (2 * util.bodySizeH), body.y + 0);
					break;
				case util.SEGMENT_BOTTOM_RIGHT:
					body.setLocation(body.x + util.bodySizeH, body.y + (3 * util.bodySizeV));
					break;
				case util.SEGMENT_BOTTOM_LEFT:
					body.setLocation(body.x + -util.bodySizeH, body.y + (3 * util.bodySizeV));
					break;
				case util.SEGMENT_BACK:
					body.setLocation(body.x + (-2 * util.bodySizeH), body.y + 0);
					break;
				case util.SEGMENT_TOP_LEFT:
					body.setLocation(body.x + (-util.bodySizeH), body.y + (-3 * util.bodySizeV));
					break;
			}	
			
			return body;
			
		},
		
		changePointByBodyPosition: function(point, position) {
			
			switch(position)
			{
				case util.SEGMENT_TOP_RIGHT:
					point.x = point.x + util.bodySizeH;
					point.y = point.y + (-3 * util.bodySizeV);
					break;
				case util.SEGMENT_FRONT:
					point.x = point.x + (2 * util.bodySizeH);
					point.y = point.y + 0;
					break;
				case util.SEGMENT_BOTTOM_RIGHT:
					point.x = point.x + util.bodySizeH;
					point.y = point.y + (3 * util.bodySizeV);
					break;
				case util.SEGMENT_BOTTOM_LEFT:
					point.x = point.x + -util.bodySizeH;
					point.y = point.y + (3 * util.bodySizeV);
					break;
				case util.SEGMENT_BACK:
					point.x = point.x + (-2 * util.bodySizeH);
					point.y = point.y + 0;
					break;
				case util.SEGMENT_TOP_LEFT:
					point.x = point.x + (-util.bodySizeH);
					point.y = point.y + (-3 * util.bodySizeV);
					break;
			}	
			
			return point;
			
		},
		
		invertPosition: function(position) {
			switch(position)
			{
				case util.SEGMENT_TOP_RIGHT:
					return util.SEGMENT_BOTTOM_LEFT;
				case util.SEGMENT_FRONT:
					return util.SEGMENT_BACK;
				case util.SEGMENT_BOTTOM_RIGHT:
					return util.SEGMENT_TOP_LEFT;
				case util.SEGMENT_BOTTOM_LEFT:
					return util.SEGMENT_TOP_RIGHT;
				case util.SEGMENT_BACK:
					return util.SEGMENT_FRONT;
				case util.SEGMENT_TOP_LEFT:
					return util.SEGMENT_BOTTOM_RIGHT;
			}	
			
			return null;
		},
		
		getBaseX: function() {
			if (this.owner == null)
			{
				if(this.parent !== null)
				{
					return this.parent.x;
				}
				return 0
			}
			
			return this.owner.getBaseX();
		},
		
		getBaseY: function() {
			if (this.owner == null)
			{
				if(this.parent !== null)
				{
					return this.parent.y;
				}
				return 0;
			}
			
			return this.owner.getBaseY();
		},
		
		paint : function(director, time) {
			var ctx = director.ctx;
			
            ctx.lineWidth= this.lineWidth;
			
            if ( this.lineCap ) {
                ctx.lineCap= this.lineCap;
            }
            if ( this.lineJoin )    {
                ctx.lineJoin= this.lineJoin;
            }
            if ( this.miterLimit )  {
                ctx.miterLimit= this.miterLimit;
            }
            if ( null!==this.strokeStyle ) 
			{
                //ctx.strokeStyle= this.strokeStyle;
			}
			
            if ( null!==this.fillStyle ) 
			{
                ctx.fillStyle= this.fillStyle;
			}
			
			//up 2v
			var addV = 2 * this.vertical;
			var addH = this.horizontal;
			
			ctx.beginPath();
			ctx.moveTo(addH+0,addV+(2 * this.vertical));
			//to the right and down
			ctx.lineTo(addH+this.horizontal, addV+this.vertical);
			ctx.lineTo(addH+this.horizontal, addV-this.vertical);
			//to the bottom
			ctx.lineTo(addH+0, addV+(-2 * this.vertical));
			//to the left and up
			ctx.lineTo(addH-this.horizontal, addV-this.vertical);
			ctx.lineTo(addH-this.horizontal, addV+this.vertical);
			//back up
			ctx.lineTo(addH+0,addV+(2 * this.vertical));
			ctx.fill();
			ctx.stroke();
			

			ctx.closePath();

		},
	};
	
	extend(Body, BodySegment, null);
	
	return Body;
});