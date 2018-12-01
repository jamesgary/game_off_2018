window.makeSplashEmitter = function(container, x, y) {
  return new PIXI.particles.Emitter(
    container,
    [PIXI.Texture.fromImage('images/HardCircle.png')],
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
	"blendMode": "screen",
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

window.makeCreepDeathEmitter = function(container, x, y) {
  return new PIXI.particles.Emitter(
    container,
    [PIXI.Texture.fromImage('images/HardCircle.png')],
    // trying on bg: #6CBE42
{
	"alpha": {
		"start": 1,
		"end": 0.08
	},
	"scale": {
		"start": 0.3,
		"end": 0.1,
		"minimumScaleMultiplier": 1
	},
	"color": {
		"start": "#444477",
		"end": "#222233"
	},
	"speed": {
		"start": 111,
		"end": 71,
		"minimumSpeedMultiplier": 2
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
		"max": 0.32
	},
	"blendMode": "normal",
	"frequency": 0.001,
	"emitterLifetime": 0.1,
	"maxParticles": 20,
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

window.makeHarvestEmitter = function(container, x, y) {
  return new PIXI.particles.Emitter(
    container,
    [PIXI.Texture.fromImage('images/HardCircle.png')],
    // trying on bg: #6CBE42
{
	"alpha": {
		"start": 1,
		"end": 0.73
	},
	"scale": {
		"start": 0.1,
		"end": 0.15,
		"minimumScaleMultiplier": 1
	},
	"color": {
		"start": "#ac3232",
		"end": "#e35b5b"
	},
	"speed": {
		"start": 111,
		"end": 71,
		"minimumSpeedMultiplier": 1
	},
	"acceleration": {
		"x": 0,
		"y": 0
	},
	"maxSpeed": 0,
	"startRotation": {
		"min": 200,
		"max": 340
	},
	"noRotation": false,
	"rotationSpeed": {
		"min": 0,
		"max": 0
	},
	"lifetime": {
		"min": 0.1,
		"max": 0.32
	},
	"blendMode": "normal",
	"frequency": 0.001,
	"emitterLifetime": 0.1,
	"maxParticles": 10,
	"pos": {
		"x": x,
		"y": y
	},
	"addAtBack": false,
	"spawnType": "circle",
	"spawnCircle": {
		"x": 0,
		"y": 0,
		"r": 10
	}
}
  );
}
