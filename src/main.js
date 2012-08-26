requirejs.config({
    //By default load any module IDs from scripts
    baseUrl: 'src',
    //except, if the module ID starts with "lib",
    //load it from the scripts/lib directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        lib: 'lib'
    }
});

// Start the main app logic.
require(['./util','./Body','./Shield', './Gun', './Ship'],
function   (util, Body, Shield, Gun, Ship) {

// create a director object
var director = new CAAT.Director().initialize(
        util.canvasHeight,    
        util.canvasWidth,
        document.getElementById('c1')
);

// add a scene object to the director.
var scene=     director.createScene();

// create a CAAT actor
 ship = new Ship();
 ship.addBodySegment(new Gun(), util.SEGMENT_TOP_RIGHT);
 ship.addBodySegment(new Gun(), util.SEGMENT_FRONT);
 ship.addBodySegment(new Gun(), util.SEGMENT_BOTTOM_RIGHT);
 var nb = new Body().addBodySegment(new Gun(), util.SEGMENT_TOP_RIGHT).addBodySegment(new Gun(), util.SEGMENT_BACK).addBodySegment(new Gun(), util.SEGMENT_TOP_LEFT);
 nb.addBodySegment(new Gun(), util.SEGMENT_FRONT);
 ship.addBodySegment(nb, util.SEGMENT_TOP_LEFT);
 ship.addBodySegment(new Body(), util.SEGMENT_BACK);
 ship.addBodySegment(new Body(), util.SEGMENT_BOTTOM_LEFT);

ship2 = new Ship().setLocation(300,300);
var nb2 = new Body().addBodySegment(new Shield(), util.SEGMENT_TOP_LEFT);
ship2.addBodySegment(nb2, util.SEGMENT_TOP_RIGHT);
ship2.addBodySegment(new Shield(), util.SEGMENT_FRONT);
ship2.addBodySegment(new Shield(), util.SEGMENT_BOTTOM_RIGHT);
ship2.addBodySegment(new Shield(), util.SEGMENT_BOTTOM_LEFT);
ship2.addBodySegment(new Shield(), util.SEGMENT_BACK);
ship2.addBodySegment(new Shield(), util.SEGMENT_TOP_LEFT);
scene.addChild(ship2);

//collision hash
hash= new CAAT.SpatialHash().initialize( util.canvasWidth, util.canvasHeight, util.hashGridSizeX, util.hashGridSizeY);


//make list of bullets
bulletList = new Array();
	
scene.mouseMove = function(mouseEvent) {
	ship.setLocation(mouseEvent.x, mouseEvent.y);
	//shield.setLocation(mouseEvent.x, mouseEvent.y);
};
	 
scene.mouseDown = function(mouseEvent) {
	var newBList = ship.shoot();
	bulletList = bulletList.concat(newBList);
	for (var i=0;i<newBList.length; i++)
	{
		scene.addChild(newBList[i]);
	}
};

//function for each rendered frame
director.onRenderStart= function(director, time) {

	//prepare collision detection
    hash.clearObject();

	for (var i=0;i<bulletList.length; i++)
	{
		var b = bulletList[i];
		b.move();
		

		//check bounds
		if (b.x < 0 || b.y < 0 || b.x > util.canvasWidth  || b.y > util.canvasHeight )
		{
			if (b !== undefined)
			{
				b.setDiscardable(true);
				scene.removeChild(b);
				bulletList.splice(i,1);
			}
		}
		else
		{
			//add to space hash
			hash.addObject( {
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
	var collisionRect = ship2.getCollisionRect();
	hash.collide(collisionRect.x, collisionRect.y, collisionRect.width, collisionRect.height, function(obj) { 
		
		var b = bulletList[obj.id];
		//check against ship
		if(ship2.checkBulletCollision(b))
		{
			//delete bullet
			if (b !== undefined)
			{
				b.setDiscardable(true);
				scene.removeChild(b);
				bulletList.splice(obj.id,1); 
			}
		}
		
	});
}

// add it to the scene
scene.addChild(ship);

//turn off actor events globally
CAAT.Actor.prototype.mouseEnabled= false;

// start the animation loop
CAAT.loop(1);
});