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
 ship.addBodySegment(new Shield(), util.SEGMENT_TOP_LEFT);
 ship.addBodySegment(new Shield(), util.SEGMENT_BACK);
 ship.addBodySegment(new Shield(), util.SEGMENT_BOTTOM_LEFT);

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
	for (var i=0;i<bulletList.length; i++)
	{
		var b = bulletList[i];
		b.setPosition(b.x + b.vx, b.y + b.vy);
	}
}

// add it to the scene
scene.addChild(ship);

//turn off actor events globally
CAAT.Actor.prototype.mouseEnabled= false;

// start the animation loop
CAAT.loop(1);
});