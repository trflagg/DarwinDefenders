define(["./util", "./Ship"],
function(util,Ship) {
	Enemy = function() {
		Enemy.superclass.constructor.call(this);
		this.currentPath = null;
		this.id = null;
		
		return this;
	};
	

	Enemy.prototype = {
		movingTowards: null,
		currentPath: null,
		id: null,
		chromosome: null,
		
		initializeFromChromosome: function(chromosome) {
			this.chromosome = chromosome;
			//first 6 are position types
			for (var i=0;i<6; i++)
			{
				var newSegment = this.createSegmentFromType(chromosome[i])
				if (newSegment !== null)
				{
					this.addBodySegment(newSegment, i);
				}
			}
			//next is side
			this.setScreenSide(chromosome[6]);
			
			//set path
			this.setNewPath();
		},
		
		setNewPath: function() { 
			
		},
			
		
		setId: function(id) {
			this.id = id;
		},
		
		setScreenSide: function(side) {
			switch(side)
			{
				case util.SIDE_TOP:
					this.setLocation(Math.random() * util.canvasWidth, -10);
					this.movingTowards = util.SIDE_BOTTOM;
					break;
				case util.SIDE_RIGHT:
					this.setLocation(util.canvasWidth + 10, Math.random() * util.canvasHeight);
					this.movingTowards = util.SIDE_LEFT;
					break;
				case util.SIDE_BOTTOM:
					this.setLocation(Math.random() * util.canvasWidth, util.canvasHeight + 10);
					this.movingTowards = util.SIDE_TOP;
					break;
				case util.SIDE_LEFT:
					this.setLocation(-10, Math.random() * util.canvasHeight);
					this.movingTowards = util.SIDE_RIGHT;
					break;
			}
		},
	};
	
	extend(Enemy, Ship);
	
	return Enemy;
});