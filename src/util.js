define ({
	canvasHeight: 640,
	canvasWidth: 960,
	hashGridSizeX: 100,
	hashGridSizeY: 100,

	bodySizeV: 10,
	bodySizeH: 10 * 2 * Math.cos(Math.PI / 6),
	shieldSize: 10 * 2,
	bulletSize: 10,
	
	enemyMoveSpeed: .1,
	enemyMaxSpeed: 5,
	
	enemyShootProbability:.01,
	
	maxBodyLevel: 1,
	
	EVIL: 0,
	GOOD: 1,
	
	SEGMENT_TOP_RIGHT: 0,
	SEGMENT_FRONT: 1,
	SEGMENT_BOTTOM_RIGHT: 2,
	SEGMENT_BOTTOM_LEFT: 3,
	SEGMENT_BACK: 4,
	SEGMENT_TOP_LEFT: 5,
	
	typeCount: 4,
	TYPE_NONE: 0,
	TYPE_BODY: 1,
	TYPE_SHIELD: 2,
	TYPE_GUN: 3,
	
	sideCount: 4,
	SIDE_TOP: 0,
	SIDE_LEFT: 1,
	SIDE_BOTTOM: 2,
	SIDE_RIGHT: 3,
	
	behaviorCount: 1,
	BEHAVIOR_SEEK: 0,
});