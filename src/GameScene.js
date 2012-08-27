define(["./util", "./Ship", "./Shield", "./Body", "./Gun", "./Enemy","./Chromosome"],
function(util, Ship, Shield, Body, Gun, Enemy, Chromosome) {
	GameScene = function(director) {
		
		//set director & scene
		this.director = director;
		this.scene = director.createScene();
		
		//spacial-hash for collisions
		this.hash= new CAAT.SpatialHash().initialize( util.canvasWidth, util.canvasHeight, util.hashGridSizeX, util.hashGridSizeY);

		//set level
		this.maxBodyLevel = 2;
		
		this.statusText = new CAAT.TextActor().setFont("12pt Helvetica").setLocation(10, 10);
		
		
		
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
		
		updateStatus: function() {
			this.scene.removeChild(this.statusText);
			this.statusText.setText("Wave: "+ this.waveCount + " / "+util.waveGoal+"          Shields:"+ this.playerShields+"%");
			this.scene.addChild(this.statusText);
		},
		
		winGame: function() {
			alert("Congratulations! Y'know, this game is different every time you play. You should play again!");
			window.location.href = "index.html";
			this.director.endLoop();
			
		},
		
		endGame: function() {
			alert("Game Over! Y'know, this game is different every time you play. You should play again!");
			window.location.href = "index.html";
			this.director.endLoop();
		},
		
		startGame: function() {
			
			//this.scene.emptyChildren();
			
			this.scene.addChild(this.statusText);
			//we gotta have a player
			this.player = new Ship().setLocation(0,0);
			this.player.addBodySegmentSomewhere(new Gun());
			this.player.addBodySegmentSomewhere(new Shield());
			this.scene.addChild(this.player);	
			this.playerShields = 100;
		
		
			//and enemies
			this.enemies = new Array();

			//list of bullets
			this.bulletList = new Array();
			this.enemyBulletList = new Array();
		
		
		
			//make first wave	
			this.waveCount = 1;
			this.updateStatus();
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
			
			/*
			if (!this.player.alive)
			{
				this.playerHit();
				this.player.alive = true;
			}
			*/
			
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
			this.playerShields -= 5;
			this.updateStatus();
			
			//reset bullets due to bug
			this.bulletList = new Array();
			
			if (this.playerShields <= 0)
			{
				//game over
				this.endGame();
			}
		},
		
		nextWave: function()
		{
			//update wave
			this.waveCount++;
			this.updateStatus();
			
			if (this.waveCount > util.waveGoal)
			{
				this.winGame();
				return;
			}
			
			//add to the player
			//(exclude NONE type)
			var type = Math.floor(Math.random() * (util.typeCount - 1)) + 1;
			this.player.addBodySegmentSomewhere(this.createSegmentFromType(type));
				
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