define(["./util", "BodySegment"],
function(util, BodySegment) {
	Shield = function() {
		Shield.superclass.constructor.call(this);
		
		this.side = util.shieldSize;
		return this;
	};
	

	Shield.prototype = {
		side: null,
		
		paintCircle : function(director, time) {
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
			
			var vert = this.side * Math.cos(1.31);
			var horiz = this.side * Math.sin(1.31);
			ctx.beginPath();
			ctx.moveTo(0,0);
			//right
			ctx.lineTo(horiz, vert);
			//down & left
			ctx.lineTo(vert, horiz);
			//back up
			ctx.lineTo(0,0);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		},
	};
	
	extend(Shield, BodySegment);
	
	return Shield;
});