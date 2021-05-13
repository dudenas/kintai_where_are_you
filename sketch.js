const openSimplex = openSimplexNoise(1);

const _pd = 2

let ease, styles
let _myFont

let _finnished = false
const _sw = 0.5
const _r = Math.pow(2.71828, 1)
const _totalFrames = 300
const _clrs = [5, 250,
	[85, 255, 0], // KOSMIS
	[0, 255, 85] // MARTIS
]

let _minX, _minY
const _zoom = 14
const _clan = '55.41913874282551'
const _clon = '21.262353075227914'

const token = 'pk.eyJ1Ijoia292aW5pc3BpZXN0dWthcyIsImEiOiJjajZ3MGh2M2oxMGd6MnF1aHNhYmYxa3k4In0.oAftkxmk5QdCeBspaxOXag'
const mapAPI = `https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/\
				${_clon},${_clan},${_zoom}/1024x1024?\
				access_token=pk.eyJ1Ijoia292aW5pc3BpZXN0dWthcyIsImEiOiJjajZ3MGh2M2oxMGd6MnF1aHNhYmYxa3k4In0.oAftkxmk5QdCeBspaxOXag`
let _map

const _lat = _clan
const _lon = _clon
let _current = 3
const _speed = 20

let _cx
let _cy

let _zdiff = 0

var easy

//————————————————————————————————————————————— preload
function preload() {
	// load map
	_map = loadImage(mapAPI)
	// load font
	_myFont = loadFont('data/Silka-Regular.otf');
	// load data
	loadData()
}

//————————————————————————————————————————————— setup
function setup() {
	createCanvas(1024, 1024, WEBGL);

	pixelDensity(_pd)
	frameRate(30)

	// init easing functions
	ease = new p5.Ease();
	styles = ease.listAlgos();
	styles = [
		'quadraticInOut', 'quadraticInOut', 'doubleEllipticOgee',
		'circularInOut', 'elasticInOut', 'doubleExponentialSigmoid',
		'gompertz', 'exponentialEmphasis', 'normalizedInverseErf',
		'backInOut', 'bounceInOut'
	];

	// definte font style
	textAlign(CENTER, CENTER)
	textSize(12)
	textFont(_myFont)

	// other variables
	imageMode(CENTER)
	// strokeCap(SQUARE);
	// strokeJoin(BEVEL)

	// save setup
	saveSetup();
	// noLoop()

	_cx = mercX(_clon)
	_cy = mercY(_clan)

	// easy = createEasyCam()
	strokeWeight(_sw)
}

//————————————————————————————————————————————— draw
function draw() {
	background(_clrs[0])
	// push()
	// translate(width / 2, height / 2)
	let percent = (frameCount % _totalFrames) / _totalFrames
	const angleX = map(sin(percent * TWO_PI), -1, 1, 0, PI / 2)
	const angleY = map(percent, 0, 1, 0, TWO_PI)
	_zdiff = map(sin(percent * TWO_PI), -1, 1, 0, 50)
	rotateX(angleX)
	// rotateZ(angleY)

	push()
	translate(0, 0, 0)
	image(_map, 0, 0)
	pop()

	if (_finnished) {
		console.log("finnished")
		noLoop()
	}

	//————————————————————————————————————————————— draw drawPoint
	for (let i = 0; i < _data.length; i++) {
		const obj = _data[i]
		obj.show(angleX)
	}

	noStroke()
	fill(_clrs[1])
	// KINTAI RESIDENCY
	const x = mercX(_lon) - _cx
	const y = mercY(_lat) - _cy
	ellipse(x, y, 4, 4)


	//————————————————————————————————————————————— draw save
	if (_save) {
		saveDraw()
		if (frameCount > _totalFrames) {
			_finnished = true
		}
	}
}

//————————————————————————————————————————————— Path functions

// TODO: LATER FIX THESE
function moveAlongPath(cx, cy) {
	// console.log('test')
	const track = _data[_current].coordinates
	const diff = _data[_current].diffTime
	const percent = (frameCount % floor(diff / _speed)) / floor(diff / _speed)
	const pos = createVector(0, 0)
	const currTrack = int(map(percent, 0, 1, 0, track.length - 1))
	const partLen = 1 / track.length
	// noLoop()
	// console.log(percent)
	// console.log(time)
	// console.log(track)
	if (track.length > 3) {
		beginShape()
		for (let j = 0; j < track.length; j++) {
			const point = track[j]
			const x = mercX(point[0]) - cx
			const y = mercY(point[1]) - cy
			vertex(x, y)
			if (currTrack == j) {
				pos.x = x
				pos.y = y
			}
		}
		endShape()
	}

	noStroke()
	fill(_clrs[2])
	ellipse(pos.x, pos.y, _r * 2, _r * 2)
}