define(["./util", "./Ship"],
function(util,Ship) {
	Enemy = function() {
		Enemy.superclass.constructor.call(this);
		this.currentPath = null;
		this.id = null;
		
		this.velocity = new CAAT.Point(0,0);
		
		return this;
	};
	

	Enemy.prototype = {
		movingTowards: null,
		currentPath: null,
		id: null,
		chromosome: null,
		behavior: null,
		velocity: null,
		
		onTick: function(time) {
			var player = gameScene.player;
			
			
			switch(this.behavior)
			{
				case util.BEHAVIOR_SEEK:
					//get direction to player
					var direction = new CAAT.Point(this.x - player.x, this.y - player.y);
					direction.normalize();
					direction.multiply(util.enemyMoveSpeed);
					//edit velocity
					this.velocity = new CAAT.Point(this.velocity.x - direction.x, this.velocity.y - direction.y);
					break;
			}
			
			this.velocity.x = Math.min(this.velocity.x, util.enemyMaxSpeed);
			this.velocity.y = Math.min(this.velocity.y, util.enemyMaxSpeed);
			this.velocity.x = Math.max(this.velocity.x, -util.enemyMaxSpeed);
			this.velocity.y = Math.max(this.velocity.y, -util.enemyMaxSpeed);
			this.x = this.x + this.velocity.x;
			this.y = this.y + this.velocity.y;
			//console.log(this.velocity.x, + " "+this.velocity.y);
			if (this.x <= 0) this.x = util.canvasWidth;
			else if (this.y <= 0) this.y = util.canvasHeight;
			else if (this.x > util.canvasWidth) this.x = 0;
			else if (this.y > util.canvasHeight) this.y = 0;
			
			//shoot the bastards!
			if (Math.random() <= util.enemyShootProbability)
			{
				gameScene.enemyShoot(this);
			}
			
		},
		
		initializeFromChromosome: function(chromosome) {
			this.chromosome = chromosome;
			//first 6 are position types
			for (var i=0;i<6; i++)
			{
				var newSegment = chromosome.getGene(i).createSegment();
				if (newSegment !== null)
				{
					this.addBodySegment(newSegment, i);
				}
			}
			//next is side
			this.setScreenSide(chromosome.getGene(6));
			
			//behavior
			this.behavior = chromosome.getGene(7);
			
			return this;
		},
			
		
		setId: function(id) {
			this.id = id;
		},
		
		setScreenSide: function(side) {
			switch(side)
			{
				case util.SIDE_TOP:
					this.setLocation(Math.random() * util.canvasWidth, 0);
					this.movingTowards = util.SIDE_BOTTOM;
					break;
				case util.SIDE_RIGHT:
					this.setLocation(util.canvasWidth + 0, Math.random() * util.canvasHeight);
					this.movingTowards = util.SIDE_LEFT;
					break;
				case util.SIDE_BOTTOM:
					this.setLocation(Math.random() * util.canvasWidth, util.canvasHeight + 0);
					this.movingTowards = util.SIDE_TOP;
					break;
				case util.SIDE_LEFT:
					this.setLocation(0, Math.random() * util.canvasHeight);
					this.movingTowards = util.SIDE_RIGHT;
					break;
			}
		},
	};
	
	extend(Enemy, Ship);
	
	return Enemy;
});