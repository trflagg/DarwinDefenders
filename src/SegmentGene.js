define(["./util"],
function(util) {
	SegmentGene = function() {
		
		return this;
	};
	

	SegmentGene.prototype = {
		bodyType: null,
		bodyGenes: null,
		
		mutate: function(diff) {
			if (this.bodyType != util.TYPE_BODY)
			{
				var newGene = new SegmentGene().randomGene(1,false);
			}
			else
			{
				//find the diff gene
				var c = 0;
				for (var i=0;i<6;i++)
				{
					c += this.bodyGenes[i].countSegments();
					if (c > diff)
					{
						//found it! mutate through recursion!
						var newGene = this.bodyGenes[i].mutate(c - diff);
						break;
					}
				}
			}
			return newGene;
				
		},
		
		countSegments: function() {
			if (this.bodyType != util.TYPE_BODY)
				return 1;
			else
			{
				var c = 1;
				for (var i=0;i<6;i++)
				{
					c += this.bodyGenes[i].countSegments();
				}
				
				return c;
			}
		},
		
		createSegment: function() {
			//check type
			var newSegment = this.createSegmentFromType(this.bodyType);
			
			if (newSegment !== null)
			{
				//bodies are special
				if (newSegment.bodyType == util.TYPE_BODY)
				{
					//add segments to body
					for (var i=0;i<6;i++)
					{
						var seg2 = this.bodyGenes[i].createSegment();
						if (seg2 != null)
						{
							newSegment.addBodySegment(seg2, i);
						}
					}
					
				}
			}
			return newSegment;
		},
		
		createSegmentFromType: function(type) {
			switch(type)
			{
				case util.TYPE_BODY:
					return new Body();
					break;
				case util.TYPE_SHIELD:
					return new Shield();
					break;
				case util.TYPE_GUN:
					return new Gun();
					break;
			}
			return null;
		},
		
		randomGene: function(level, hasBody) {
			//select random type
			//while(true) {
				var segmentType = Math.floor(Math.random() * util.typeCount);
				//no body: good
				//if (segmentType != util.TYPE_BODY) 
				//	break;
				//check odds
				//if (!hasBody && Math.random() < (1 / (level * 2))) 
				//	break;
		//	}
			//if end up with body, randomize parts
			if (segmentType == util.TYPE_BODY)
			{
				//are we allowed a body
				if (level > util.maxBodyLevel)
				{
					segmentType = util.TYPE_NONE;
				}
				else
				{
					//make body gene
					this.bodyGenes = new Array();
					var nhasBody = false 
					for (var i=0;i<6;i++)
					{
						var type = new SegmentGene().randomGene(level+1, nhasBody);
						if (type == util.TYPE_BODY) 
							nhasBody = true;
						this.bodyGenes.push(type);
					}
				}
			}
				
			this.bodyType = segmentType;
			
			return this;
		},
		
	};
	
	return SegmentGene;
});