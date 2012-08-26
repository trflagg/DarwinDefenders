define ({
	canvasHeight: 960,
	canvasWidth: 640,
	hashGridSizeX: 10,
	hashGridSizeY: 10,

	bodySizeV: 5,
	bodySizeH: 5 * 2 * Math.cos(Math.PI / 6),
	shieldSize: 5 * 2,
	bulletSize: 10,
	
	enemyMoveSpeed: .1,
	enemyMaxSpeed: 5,
	
	enemyShootProbability:.05,
	
	EVIL: 0,
	GOOD: 1,
	
	SEGMENT_TOP_RIGHT: 0,
	SEGMENT_FRONT: 1,
	SEGMENT_BOTTOM_RIGHT: 2,
	SEGMENT_BOTTOM_LEFT: 3,
	SEGMENT_BACK: 4,
	SEGMENT_TOP_LEFT: 5,
	
	TYPE_NONE: 0,
	TYPE_BODY: 1,
	TYPE_SHIELD: 2,
	TYPE_GUN: 3,
	
	SIDE_TOP: 0,
	SIDE_LEFT: 1,
	SIDE_BOTTOM: 2,
	SIDE_RIGHT: 3,
	
	BEHAVIOR_SEEK: 0,
});