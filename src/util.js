define ({
	canvasHeight: 640,
	canvasWidth: 480,
	hashGridSizeX: 10,
	hashGridSizeY: 10,

	bodySizeV: 10,
	bodySizeH: 10 * 2 * Math.cos(Math.PI / 6),
	shieldSize: 10 * 2,
	
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
	
});