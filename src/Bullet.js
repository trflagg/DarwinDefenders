define(["./util"],
function(util) {
	Bullet = function() {
		Bullet.superclass.constructor.call(this);
		
		this.vx = 0;
		this.vy = 0;
		
		this.initialize( 8, 30, 10 )
			.setSize(util.bulletSize, util.bulletSize)
			.setFillStyle('#E01B6A')
			.setStrokeStyle('#000000');
		return this;
	};
	

	Bullet.prototype = {
		move: function()
		{
			this.setPosition(this.x + this.vx, this.y + this.vy);
			
		},
	};
	
	extend(Bullet, CAAT.ShapeActor);
	
	return Bullet;
});