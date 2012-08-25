define(["./util"],
function(util) {
	Gun = function() {
		Gun.superclass.constructor.call(this);
		
        this.setFillStyle('#00ffff');
        this.setStrokeStyle('#000000');

		this.side = util.shieldSize;
		
		this.bodyType = util.TYPE_GUN;
		
		return this;
	};
	

	Gun.prototype = {
		side: null,
		
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
			
			var s = this.side * Math.sqrt(3)  / 2;
			var v1 = s * Math.sin(Math.PI / 8);
			var h1 = s * Math.cos(Math.PI / 8);
			var v2 = this.side / 2 * Math.sin( 0.261799388);
			var h2 = this.side / 2 * Math.cos( 0.261799388);
			var v3 = this.side * Math.cos(1.31);
			var h3 = this.side * Math.sin(1.31);
			var v4 = this.side * Math.sqrt(3) / 2  * Math.sin(Math.PI / 8);
			var h4 = this.side * Math.sqrt(3) / 2 * Math.cos(Math.PI / 8);
			
			ctx.beginPath();
			//right to bottom
			ctx.moveTo(h1,v1);
			ctx.lineTo(h2, v2);
			ctx.lineTo(h3, v3);
			ctx.lineTo(h4, v4);
			ctx.lineTo(h1, v1);
			
			ctx.moveTo(v1, h1);
			ctx.lineTo(v2, h2);
			ctx.lineTo(v3, h3);
			ctx.lineTo(v4, h4);
			ctx.lineTo(v1, h1);
			
			ctx.fill();
			ctx.stroke();
			
			


			ctx.closePath();
		},
	};
	
	extend(Gun, CAAT.ActorContainer);
	
	return Gun;
});