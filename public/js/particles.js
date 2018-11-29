// Create a new emitter
window.makeEmitter = function(container, x, y) {
  return new PIXI.particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    container,

    // The collection of particle images to use
    [PIXI.Texture.fromImage('images/HardCircle.png')],

    // Emitter configuration, edit this to change the look
    // of the emitter

    // trying on bg: #6CBE42
{
	"alpha": {
		"start": 1,
		"end": 0
	},
	"scale": {
		"start": 0.35,
		"end": 0.1,
		"minimumScaleMultiplier": 1
	},
	"color": {
		"start": "#3fcbff",
		"end": "#e4f9ff"
	},
	"speed": {
		"start": 111,
		"end": 25,
		"minimumSpeedMultiplier": 1
	},
	"acceleration": {
		"x": 0,
		"y": 0
	},
	"maxSpeed": 0,
	"startRotation": {
		"min": 0,
		"max": 360
	},
	"noRotation": false,
	"rotationSpeed": {
		"min": 0,
		"max": 0
	},
	"lifetime": {
		"min": 0.1,
		"max": 0.22
	},
	"blendMode": "normal",
	"frequency": 0.001,
	"emitterLifetime": 0.1,
	"maxParticles": 50,
	"pos": {
		"x": x,
		"y": y
	},
	"addAtBack": false,
	"spawnType": "circle",
	"spawnCircle": {
		"x": 0,
		"y": 0,
		"r": 0
	}
}
  );
}
