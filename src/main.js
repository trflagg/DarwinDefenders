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
require(['./util','./Body','./Shield', './Gun', './Ship', './GameScene'],
function   (util, Body, Shield, Gun, Ship, GameScene) {

// create a director object
var director = new CAAT.Director().initialize(
        util.canvasHeight,    
        util.canvasWidth,
        document.getElementById('c1')
);

//start the game
gameScene = new GameScene(director);

//function for each rendered frame
director.onRenderStart= function(director, time) {
	gameScene.onTick(director, time);
}

//turn off actor events globally
CAAT.Actor.prototype.mouseEnabled= false;

// start the animation loop
CAAT.loop(1);
});