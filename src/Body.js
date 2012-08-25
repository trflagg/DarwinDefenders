define(["./util", "./BodySegment"],
function(util, BodySegment) {
	Body = function() {
		Body.superclass.constructor.call(this);
		
		this.vertical = util.bodySizeV;
		this.horizontal = util.bodySizeH;
		//this.horizontal = this.vertical * 2 * Math.cos(Math.PI / 6);
		return this;
	};
	

	Body.prototype = {
		
		vertical: null,
		horizontal: null,
	
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