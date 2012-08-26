define(["./util", "./Ship", "./Shield", "./Body", "./Gun"],
function(util, Ship, Shield, Body, Gun) {
	GameScene = function(director) {
		
		//set director & scene
		this.director = director;
		this.scene = director.createScene();
		
		//spacial-hash for collisions
		this.hash= new CAAT.SpatialHash().initialize( util.canvasWidth, util.canvasHeight, util.hashGridSizeX, util.hashGridSizeY);

		//we gotta have a player
		this.player = new Ship().setLocation(0,0);
		this.player.addBodySegment(new Gun(), util.SEGMENT_FRONT);
		this.scene.addChild(this.player);	
		
		//and an enemy
		this.ship2 = new Ship().setLocation(300,300);
		var nb2 = new Body().addBodySegment(new Shield(), util.SEGMENT_TOP_LEFT);
		this.ship2.addBodySegment(nb2, util.SEGMENT_TOP_RIGHT);
		this.ship2.addBodySegment(new Shield(), util.SEGMENT_FRONT);
		this.ship2.addBodySegment(new Shield(), util.SEGMENT_BOTTOM_RIGHT);
		this.ship2.addBodySegment(new Shield(), util.SEGMENT_BOTTOM_LEFT);
		this.ship2.addBodySegment(new Shield(), util.SEGMENT_BACK);
		this.ship2.addBodySegment(new Shield(), util.SEGMENT_TOP_LEFT);
		this.scene.addChild(this.ship2);

		//list of bullets
		this.bulletList = new Array();
		
		
		//add our event methods to the scene
		this.scene.mouseMove = function(mouseEvent) {
			gameScene.player.setLocation(mouseEvent.x, mouseEvent.y);
		};
		this.scene.mouseDown = function(mouseEvent) {
			var newBList = gameScene.player.shoot();
			gameScene.bulletList = gameScene.bulletList.concat(newBList);
			for (var i=0;i<newBList.length; i++)
			{
				this.addChild(newBList[i]);
			}
		};	
		
		return this;
	};
	

	GameScene.prototype = {
		director: null,
		scene: null,
		
		onTick: function(director, time) {
			//prepare collision detection
			this.hash.clearObject();
			
			//move all of the bullets
			for (var i=0;i<this.bulletList.length; i++)
			{
				var b = this.bulletList[i];
				b.move();
	
				//check in bounds
				if (b.x < 0 || b.y < 0 || b.x > util.canvasWidth  || b.y > util.canvasHeight )
				{
					if (b !== undefined)
					{
						b.setDiscardable(true);
						this.scene.removeChild(b);
						this.bulletList.splice(i,1);
					}
				}
				else
				{
					//add to space hash
					this.hash.addObject( {
						id: i,
						x: b.x,
						y: b.y,
						width: b.width,
						height: b.height,
						rectangular: true
					});
				}	 
			}
			
			//check enemies against bullets
			var collisionRect = this.ship2.getCollisionRect();
			this.hash.collide(collisionRect.x, collisionRect.y, collisionRect.width, collisionRect.height, function(obj) { 	
				//run this on collision
				var b = gameScene.bulletList[obj.id];
				//check against ship
				if(gameScene.ship2.checkBulletCollision(b))
				{
					//delete bullet
					if (b !== undefined)
					{
						b.setDiscardable(true);
						gameScene.scene.removeChild(b);
						gameScene.bulletList.splice(obj.id,1); 
					}
				}
			});
		},
	};
	
	
	return GameScene;
});