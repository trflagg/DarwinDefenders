define(["./util", "./Ship", "./Shield", "./Body", "./Gun", "./Enemy"],
function(util, Ship, Shield, Body, Gun, Enemy) {
	GameScene = function(director) {
		
		//set director & scene
		this.director = director;
		this.scene = director.createScene();
		
		//spacial-hash for collisions
		this.hash= new CAAT.SpatialHash().initialize( util.canvasWidth, util.canvasHeight, util.hashGridSizeX, util.hashGridSizeY);

		//we gotta have a player
		this.player = new Ship().setLocation(0,0);
		this.player.addBodySegment(new Gun(), util.SEGMENT_FRONT).addBodySegment(new Gun(), util.SEGMENT_BACK);
		this.scene.addChild(this.player);	
		
		//and an enemy
		var ship2 = this.createEnemyFromChromosome(
			[util.TYPE_BODY,
			util.TYPE_SHIELD,
			util.TYPE_SHIELD,
			util.TYPE_GUN,
			util.TYPE_SHIELD,
			util.TYPE_GUN,
			util.SIDE_TOP,
			util.BEHAVIOR_SEEK]);
		//ship2.setLocation(300,300);
		this.scene.addChild(ship2);
		
		this.enemies = new Array();
		var id = this.enemies.push(ship2);
		ship2.setId(id);
		
		//list of bullets
		this.bulletList = new Array();
		this.enemyBulletList = new Array();
		
		
		//add our event methods to the scene
		this.scene.mouseMove = function(mouseEvent) {
			gameScene.player.setLocation(mouseEvent.x, mouseEvent.y);
		};
		this.scene.mouseDown = function(mouseEvent) {
			var newBList = gameScene.player.shoot(util.GOOD);
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
				if (b.x <= 0 || b.y <= 0 || b.x >= util.canvasWidth  || b.y >= util.canvasHeight )
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
			for (var i=0;i<this.enemies.length; i++)
			{
				var enemy = this.enemies[i];
				
				//move enemy
				enemy.onTick(time);
				
				//check collisions
				var collisionRect = enemy.getCollisionRect();
				this.hash.collide(collisionRect.x, collisionRect.y, collisionRect.width, collisionRect.height, function(obj) { 	
					//run this on collision
					var b = gameScene.bulletList[obj.id];
					//check against ship
					if(enemy.checkBulletCollision(b))
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
			}
			
			//move enemy bullets
			this.hash.clearObject();
			for (var i=0;i<this.enemyBulletList.length; i++)
			{
				var b = this.enemyBulletList[i];
				b.move();
	
				//check in bounds
				if (b.x <= 0 || b.y <= 0 || b.x >= util.canvasWidth  || b.y >= util.canvasHeight )
				{
					if (b !== undefined)
					{
						b.setDiscardable(true);
						this.scene.removeChild(b);
						this.enemyBulletList.splice(i,1);
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
			//check player against bullets
			var collisionRect = this.player.getCollisionRect();
			this.hash.collide(collisionRect.x, collisionRect.y, collisionRect.width, collisionRect.height, function(obj) { 	
				//run this on collision
				var b = gameScene.enemyBulletList[obj.id];
				//check against ship
				if(gameScene.player.checkBulletCollision(b))
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
		
		createEnemyFromChromosome: function(chromosome)
		{
			var newEnemy = new Enemy().initializeFromChromosome(chromosome);
			return newEnemy;
		},
		
		createSegmentFromType: function(typeNum)
		{
			if (typeNum == util.TYPE_NONE) return null;
			if (typeNum == util.TYPE_BODY) return new Body();
			if (typeNum == util.TYPE_SHIELD) return new Shield();
			if (typeNum == util.TYPE_GUN) return new Gun();
			
			return null;
		},
		
		enemyShoot: function(enemy)
		{
			var newBList = enemy.shoot(util.EVIL);
			gameScene.enemyBulletList = gameScene.enemyBulletList.concat(newBList);
			for (var i=0;i<newBList.length; i++)
			{
				gameScene.scene.addChild(newBList[i]);
			}
			
		}
	};
	
	
	return GameScene;
});