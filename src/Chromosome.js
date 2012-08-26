define(["./util", "./SegmentGene"],
function(util, SegmentGene) {
	Chromosome = function() {
		
		this.genes = new Array();
		return this;
	};
	

	Chromosome.prototype = {
		genes: null,
		
		crossBreedWith: function(chromosome, size)
		{
			var nextGeneration = new Array();
			for (var i=0;i<size;i++)
			{
				//calculate cross points
				var p1 = Math.floor(Math.random() * util.chromosomeSize);
				var p2 = Math.floor(Math.random() * util.chromosomeSize);
				var firstPoint = Math.min(p1, p2);
				var secondPoint = Math.max(p1,p2);
				
				//cross!
				var firstSlice = this.genes.slice(0,firstPoint)
				var secondSlice = chromosome.genes.slice(firstPoint,secondPoint)
				var thirdSlice = this.genes.slice(secondPoint,util.chromosomeSize);
				var newArray = firstSlice.concat(secondSlice.concat(thirdSlice));
				
				var newChromosome = new Chromosome().setGenes(newArray);
				
				//mutate!
				if (Math.random() < util.mutateProbability)
				{
					//select random genome
					var genomeSize = newChromosome.getGenomeSize();
					
					var genomeNum = Math.floor(Math.random() * genomeSize);
					newChromosome.mutateGenome(genomeNum);
					console.log("mutate");
				}
				
				if(newChromosome === undefined)
				{
					console.log("UNDEF!: ("+firstPoint+", "+secondPoint+")");
					i--;
				}
				else
				{
					nextGeneration.push(newChromosome);
				}
			}
			
			return nextGeneration;
		},
		
		mutateGenome: function(genomeNum)
		{
			var currentPos = 0;
			//check bodysegment genomes
			for (var i=0; i<6; i++)
			{
				//get count from this genome
				var count = this.genes[i].countSegments();
				//if count greater, than that's our guy!
				if (currentPos + count > genomeNum)
				{
					var mutateGene = this.genes[i];
					//check types 
					if (mutateGene.bodyType != util.TYPE_BODY)
					{
						//mutate it!
						this.genes[i] = mutateGene.mutate(0);
						return;
					}
					else
					{
						//we need to get the difference inside that body segment
						var diff = genomeNum - (currentPos + count);
						this.genes[i] = mutateGene.mutate(diff);
						return;
					}
				}
				else
				{
					//keep going
					currentPos += count;
				}
			}
			//still going?
			//change screen side
			this.genes[6] = Math.floor(Math.random() * util.sideCount);
		},
		
		getGenomeSize: function()
		{
			//count the body parts!
			var segmentCount = 0;
			for (var i=0;i<6;i++)
			{
				segmentCount += this.genes[i].countSegments();
			}
			
			return segmentCount;
					
		},
		
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