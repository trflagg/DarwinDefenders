define(["./util", "./BodySegment", './Bullet'],
function(util, BodySegment, Bullet) {
	Body = function() {
		Body.superclass.constructor.call(this);
		
		this.vertical = util.bodySizeV;
		this.horizontal = util.bodySizeH;
		//this.horizontal = this.vertical * 2 * Math.cos(Math.PI / 6);
		
        this.setFillStyle('#ff0000');
        this.setStrokeStyle('#000000');

		this.segments = new Array();
		
		this.bodyType = util.TYPE_BODY;
		
		return this;
	};
	

	Body.prototype = {
		
		vertical: null,
		horizontal: null,
		segments: null,
	
		shoot : function() {
			var bulletList = new Array();
			
			//run through segments looking for guns
			for (var i=0;i < 6; i++)
			{
				if (this.segments[i] !== 'undefined')
				{
					var seg = this.segments[i];
					
					if (seg.bodyType == util.TYPE_GUN)
					{
						//make a bullet
						var bullet = new CAAT.ShapeActor().setSize(10,10).setFillStyle('#ff0000').setStrokeStyle('#000000').setLocation(this.parent.x, this.parent.y);
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
			
			switch(position)
			{
				case util.SEGMENT_TOP_RIGHT:
					segment.setRotationAnchored(0.261799388+(Math.PI / 3),0,0).setLocation(util.bodySizeH * 2, util.bodySizeV-util.shieldSize);
					break;
				case util.SEGMENT_FRONT:
					segment.setRotationAnchored(0.261799388+(Math.PI / 3)+(Math.PI / 3),0,0).setLocation(3 * util.bodySizeH, 2 * util.bodySizeV);
					break;
				case util.SEGMENT_BOTTOM_RIGHT:
					segment.setRotationAnchored(0.261799388+(3 * (Math.PI / 3)),0,0).setLocation(util.bodySizeH * 2, 5 * util.bodySizeV);
					break;
				case util.SEGMENT_BOTTOM_LEFT:
					segment.setRotationAnchored(0.261799388+(4 * (Math.PI / 3)),0,0).setLocation(0, 5 * util.bodySizeV);
					break;
				case util.SEGMENT_BACK:
					segment.setRotationAnchored(0.261799388+(5 * (Math.PI / 3)),0,0).setLocation(-util.bodySizeH, 2 * util.bodySizeV);
					break;
				case util.SEGMENT_TOP_LEFT:
					segment.setRotationAnchored(0.261799388,0,0).setLocation(0, util.bodySizeV-util.shieldSize);
					break;
			}	
			
			this.segments[position] = segment;
			this.addChild(segment);
			
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
			
			ctx.fillStyle='#000000';
			ctx.fillRect(0,0,5,5); 

			ctx.closePath();

		},
	};
	
	extend(Body, BodySegment, null);
	
	return Body;
});