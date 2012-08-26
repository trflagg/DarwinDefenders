define(["./util"],
function(util) {
	Bullet = function() {
		Bullet.superclass.constructor.call(this);
		
		this.vx = 0;
		this.vy = 0;
		
		this.initialize( 8, 30, 10 ).
        setSize(50,50).
        setFillStyle('#00f').
        setStrokeStyle('#0f0');
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