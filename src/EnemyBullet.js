define(["./util"],
function(util) {
	EnemyBullet = function(owner) {
		EnemyBullet.superclass.constructor.call(this);
		
		this.vx = 0;
		this.vy = 0;
		
		this.owner = owner;
		
		this.initialize( 8, 30, 10 )
			.setSize(util.bulletSize, util.bulletSize)
			.setFillStyle('#94c3fa')
			.setStrokeStyle('#000000');
		return this;
	};
	

	EnemyBullet.prototype = {
		move: function()
		{
			this.setPosition(this.x + this.vx, this.y + this.vy);
			
		},
	};
	
	extend(EnemyBullet, CAAT.ShapeActor);
	
	return EnemyBullet;
});