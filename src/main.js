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
require(['./util','./Body','./Shield'],
function   (util, Body, Shield) {

// create a director object
var director = new CAAT.Director().initialize(
        util.canvasHeight,    
        util.canvasWidth,
        document.getElementById('c1')
);

// add a scene object to the director.
var scene=     director.createScene();
 
// create a CAAT actor
 circle=  new Body().
        setLocation(20,20).
        setSize(60,60).
        setFillStyle('#ff0000').
        setStrokeStyle('#000000');
 shield=  new Shield().
        setLocation(20,20).
        setSize(60,60).
        setFillStyle('#00ffff').
        setStrokeStyle('#000000');

scene.mouseMove = function(mouseEvent) {
	circle.setLocation(mouseEvent.x, mouseEvent.y);
	//shield.setLocation(mouseEvent.x, mouseEvent.y);
};
	 
// add it to the scene
circle.addChild(shield);
scene.addChild(circle);

//turn off actor events globally
CAAT.Actor.prototype.mouseEnabled= false;

// start the animation loop
CAAT.loop(1);
});