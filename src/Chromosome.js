define(["./util", "./SegmentGene"],
function(util, SegmentGene) {
	Chromosome = function() {
		
		this.genes = new Array();
		return this;
	};
	

	Chromosome.prototype = {
		genes: null,
		
		setGenes: function(geneArray)
		{
			this.genes = geneArray;
			return this;
		},
		
		randomizeGenes: function()
		{
			//first 6 are segment genes
			var hasBody = false;
			for (var i=0;i<6;i++)
			{
				var type = new SegmentGene().randomGene(1, hasBody);
				if (type == util.TYPE_BODY)
					hasBody = true;
				this.genes.push(type);
			}
			//next is side
			this.genes.push(Math.floor(Math.random() * util.sideCount));
			//next is behavior
			this.genes.push(Math.floor(Math.random() * util.behaviorCount));
			
			return this;
		},
		
		getGene: function(index)
		{
			return this.genes[index];
		}
		
	};
	
	
	return Chromosome;
});