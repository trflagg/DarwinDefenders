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
		
	};
	
	extend(Bullet, CAAT.StarActor);
	
	return Bullet;
});