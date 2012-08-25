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
        setLocation(0,0).
        setSize(60,60).
        setFillStyle('#00ffff').
        setStrokeStyle('#000000');

 shield2=  new Shield().
        setLocation(0,0).
        setSize(60,60).
        setFillStyle('#00ffff').
        setStrokeStyle('#000000');

 shield3=  new Shield().
        setLocation(0,0).
        setSize(60,60).
        setFillStyle('#00ffff').
        setStrokeStyle('#000000');

 shield4=  new Shield().
        setLocation(0,0).
        setSize(60,60).
        setFillStyle('#00ffff').
        setStrokeStyle('#000000');

 shield5=  new Shield().
        setLocation(0,0).
        setSize(60,60).
        setFillStyle('#00ffff').
        setStrokeStyle('#000000');
 shield6=  new Shield().
        setLocation(0,0).
        setSize(60,60).
        setFillStyle('#00ffff').
        setStrokeStyle('#000000');

scene.mouseMove = function(mouseEvent) {
	circle.setLocation(mouseEvent.x, mouseEvent.y);
	//shield.setLocation(mouseEvent.x, mouseEvent.y);
};
	 

// add it to the scene
//rotate to top-left
shield.setRotationAnchored(0.261799388,0,0).setLocation(0, util.bodySizeV-util.shieldSize);
//rotate to top-right
shield2.setRotationAnchored(0.261799388+(Math.PI / 3),0,0).setLocation(util.bodySizeH * 2, util.bodySizeV-util.shieldSize);
//rotate to front
shield3.setRotationAnchored(0.261799388+(Math.PI / 3)+(Math.PI / 3),0,0).setLocation(3 * util.bodySizeH, 2 * util.bodySizeV);
//rotate to bottom-right
shield4.setRotationAnchored(0.261799388+(3 * (Math.PI / 3)),0,0).setLocation(util.bodySizeH * 2, 5 * util.bodySizeV);
//rotate to bottom-left
shield5.setRotationAnchored(0.261799388+(4 * (Math.PI / 3)),0,0).setLocation(0, 5 * util.bodySizeV);
//rotate to back
shield6.setRotationAnchored(0.261799388+(5 * (Math.PI / 3)),0,0).setLocation(-util.bodySizeH, 2 * util.bodySizeV);

circle.addChild(shield);
circle.addChild(shield2);
circle.addChild(shield3);
circle.addChild(shield4);
circle.addChild(shield5);
circle.addChild(shield6);
scene.addChild(circle);

//turn off actor events globally
CAAT.Actor.prototype.mouseEnabled= false;

// start the animation loop
CAAT.loop(1);
});