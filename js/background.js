var mainColor = new THREE.Color(0x384AF4);
var backgroundColor = new THREE.Color(0x384AF4);
var timeScale = 0.1;
var distortionIntensity = new THREE.Vector3(50.0, 10.0, 50.0);
var sphereCount = 12;
var noiseFrequencyMin = 0.01;
var noiseFrequencyMax = 0.05;
var positionXVariance = 50.0;
var positionYVariance = 20.0;
var radiusMin = 20.0;
var radiusMax = 50.0;
var segments = 256;
var rings = 128;

var renderer, scene, camera;
var allUniforms = [];

init();
var startTime = Date.now();
animate();

function init() {
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 300;

	scene = new THREE.Scene();
	scene.background = backgroundColor;

	for (var i = 0; i < sphereCount; i++) {
		var currentUniforms = {
			time: {
				value: 0.0,
				type: "f"
			},
			timeOffset: {
				value: randRange(0.0, 10.0)
			},
			noiseFrequency: {
				value: randRange(noiseFrequencyMin, noiseFrequencyMax)
			},
			distortionIntensity: {
				value: distortionIntensity,
				type: "v3"
			},
			color: {
				value: mainColor
			}
		};

		allUniforms.push(currentUniforms);
		var material = new THREE.ShaderMaterial({
			uniforms: currentUniforms,
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent
		});

		var radius = randRange(radiusMin, radiusMax);
		var geometry = new THREE.SphereBufferGeometry(radius, segments, rings);

		var sphere = new THREE.Mesh(geometry, material);
		sphere.translateX(randNorm(positionXVariance));
		sphere.translateY(randNorm(positionYVariance));

		scene.add(sphere);
	}

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	var container = document.getElementById('background');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
}

function randNorm(radius) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return radius * Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function randRange(min, max) {
	var r=min + Math.random() * (max - min);
	return r;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	var elapsedMilliseconds = Date.now() - startTime;
	var time = elapsedMilliseconds / 1000.;

	for (uniform of allUniforms) {
		uniform.time.value = time * timeScale;
	}

	renderer.render(scene, camera);
}
