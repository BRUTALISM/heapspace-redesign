var renderer, scene, camera;

var sphere, uniforms;

var displacement, noise;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 300;

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x050505);

	uniforms = {
		amplitude: {
			value: 1.0
		},
		color: {
			value: new THREE.Color(0x00A5A5)
		}
	};

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent
	});


	var radius = 50,
		segments = 128,
		rings = 64;

	var geometry = new THREE.SphereBufferGeometry(radius, segments, rings);

	displacement = new Float32Array(geometry.attributes.position.count);
	noise = new Float32Array(geometry.attributes.position.count);

	for (var i = 0; i < displacement.length; i++) {
		noise[i] = Math.random() * 5;
	}

	geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

	sphere = new THREE.Mesh(geometry, shaderMaterial);
	scene.add(sphere);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	var container = document.getElementById('background');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
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
	var time = Date.now() * 0.01;

	sphere.rotation.y = sphere.rotation.z = 0.01 * time;

	uniforms.amplitude.value = 2.5 * Math.sin(sphere.rotation.y * 0.125);
	uniforms.color.value.offsetHSL(0.0005, 0, 0);

	for (var i = 0; i < displacement.length; i++) {
		displacement[i] = Math.sin(0.1 * i + time);

		noise[i] += 0.5 * (0.5 - Math.random());
		noise[i] = THREE.Math.clamp(noise[i], -5, 5);

		displacement[i] += noise[i];
	}

	sphere.geometry.attributes.displacement.needsUpdate = true;

	renderer.render(scene, camera);
}
