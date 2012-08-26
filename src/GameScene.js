define(["./util", "./Ship", "./Shield", "./Body", "./Gun", "./Enemy","./Chromosome"],
function(util, Ship, Shield, Body, Gun, Enemy, Chromosome) {
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
		
		//and enemies
		this.enemies = new Array();
		
		//set level
		this.maxBodyLevel = 2;
		
		//list of bullets
		this.bulletList = new Array();
		this.enemyBulletList = new Array();
		
		
		//add our event methods to the scene
		this.scene.mouseMove = function(mouseEvent) {
			gameScene.player.setLocation(mouseEvent.x, mouseEvent.y);
		};
		this.scene.mouseDown = function(mouseEvent) {
			var newBList = gameScene.player.shoot(util.GOOD, this);
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
		
		startGame: function() {
			//make first wave	
			for (var i=0;i<util.waveSize;i++)
			{
				var ship2 = new Enemy().initializeFromChromosome(new Chromosome().randomizeGenes());
				this.scene.addChild(ship2);
				var id = this.enemies.push(ship2);
				ship2.setId(id);
			}
		},
		
		shipDied: function(ship) {
			console.log("ship Died");
			if (ship == this.player)
			{
				console.log("player Died");
			}
			else
			{
				this.scene.removeChild(ship);
				
			}
		},
		
		onTick: function(time) {
			//prepare collision detection
			//console.log(time);
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
			var deadEnemyList = new Array();
			for (var i=0;i<this.enemies.length; i++)
			{
				var enemy = this.enemies[i];
				
				if (enemy === null || !enemy.alive)
					continue;
				
				//move enemy
				enemy.onTick(time);
				
				//stop if still waiting
				if (enemy.waiting > 0)
					continue;
				
				//check collisions
				var collisionRect = enemy.getCollisionRect();
				if (collisionRect !== undefined && collisionRect.x > 0)
				{
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
				//check for death
				if (!enemy.alive)
				{
					deadEnemyList.push(enemy);
				}
				
			}
			
			//bring out your dead!
			for (var i=0;i<deadEnemyList.length;i++)
			{
				this.shipDied(deadEnemyList[i]);
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
						b.owner.hitPlayer(1);
						b.setDiscardable(true);
						gameScene.scene.removeChild(b);
						gameScene.bulletList.splice(obj.id,1); 
					}
					
					//player hit
					gameScene.playerHit();
				}
				
			});
			
			//check if wave is over
			var allDead = true;
			for (var i=0; i<this.enemies.length; i++)
			{
				if (this.enemies[i].alive)
					allDead = false;
			}
			
			if (allDead)
			{
				this.nextWave();
			}
			
			
		},
		
		playerHit: function()
		{
			//do nothing right now
		},
		
		nextWave: function()
		{
			//get the fitest
			var maxFitness1 = 0, maxFitness2 = 0;
			var maxId1 = null, maxId2 = null;
			for (var i=0; i<this.enemies.length; i++)
			{
				var enemy = this.enemies[i];
				if (enemy.getFitness() > maxFitness1)
				{
					maxFitness2 = maxFitness1;
					maxId2 = maxId1;
					maxFitness1 = enemy.getFitness();
					maxId1 = i;
				}
				else if (enemy.getFitness() > maxFitness2)
				{
					maxFitness2 = enemy.getFitness();
					maxId2 = i;
				}
			}
			
			//cross-breed
			var nextGeneration = this.enemies[maxId1].chromosome.crossBreedWith(this.enemies[maxId2].chromosome, util.waveSize);
			
			//out with the old
			this.enemies = new Array();
			
			//in with the new
			for (var i=0;i<util.waveSize;i++)
			{
				var ship2 = new Enemy().initializeFromChromosome(nextGeneration[i]);
				this.scene.addChild(ship2);
				var id = this.enemies.push(ship2);
				ship2.setId(id);
			}
			
			
		},
		
		playerHit: function()
		{
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
			var newBList = enemy.shoot(util.EVIL,enemy);
			gameScene.enemyBulletList = gameScene.enemyBulletList.concat(newBList);
			for (var i=0;i<newBList.length; i++)
			{
				gameScene.scene.addChild(newBList[i]);
			}
			
		}
	};
	
	
	return GameScene;
});