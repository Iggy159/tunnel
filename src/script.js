import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const texture = new THREE.TextureLoader().load( 'https://images.unsplash.com/photo-1511877448058-cbf344a6a85a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' );


// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



class CustomSinCurve extends THREE.Curve {
	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = Math.cos( 2 * Math.PI * t );
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0.1 * Math.sin( 10 * Math.PI * t );


		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

	}

}

const path = new CustomSinCurve( 30 );
const tubeGeometry = new THREE.TubeGeometry( path, 100, 0.3, 20, false );


const material = new THREE.MeshBasicMaterial({

  side: THREE.DoubleSide,
  map: texture,
  color: 0x543312

 } );
material.map.wrapS = THREE.RepeatWrapping;
material.map.wrapT = THREE.RepeatWrapping;
material.map.repeat.set(15, 1)

const mesh = new THREE.Mesh( tubeGeometry, material );


scene.add( mesh );


//light
let light = new THREE.PointLight(0xffffff, 3)
light.position.set(0,300,500)
scene.add(light)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	10.5,
	1.4,
	1.85
  );
  bloomPass.exposure = 0.3
  bloomPass.threshold = 0.0;
  bloomPass.strength = 0.1; //intensity of glow
  bloomPass.radius = 0.2;

  const composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.renderToScreen = true;
  composer.addPass(renderScene);
  composer.addPass(bloomPass)


/**
 * Animate
 */

let normal = new THREE.Vector3()
let binormal = new THREE.Vector3()
let lookAt = new THREE.Vector3()
const position = new THREE.Vector3();
const params = {
	spline: 'GrannyKnot',
	scale: 8,
	extrusionSegments: 100,
	radiusSegments: 1,
	closed: true,
	animationView: true,
	lookAhead: false,
	cameraHelper: false,
};

const tick = () =>
{
  	const time = Date.now()
  	const looptime = 40 * 1000
  	const t = (time % looptime) / looptime
	const  pos = tubeGeometry.parameters.path.getPointAt( t )
	tubeGeometry.parameters.path.getPointAt( t )

	const segments = tubeGeometry.tangents.length;
	const pickt = t * segments;
	const pick = Math.floor( pickt );
	const pickNext = ( pick + 1 ) % segments;

	binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
	binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );

	const dir = tubeGeometry.parameters.path.getTangentAt( t );
	const offset = 0;

	normal.copy( binormal ).cross( dir );

				// we move on a offset on its binormal

	pos.add( normal.clone().multiplyScalar( offset ) );

	camera.position.copy( pos, pos );


				// using arclength for stablization in look ahead

	tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1, lookAt);

  	camera.matrix.lookAt( camera.position, lookAt, normal );
  	camera.rotation.setFromRotationMatrix( camera.matrix, camera.rotation.order );

  	// controls.update()
  	//camera.rotation.y = Math.PI
  // Render
  	renderer.render(scene, camera)

  // Call tick again on the next frame
  	window.requestAnimationFrame(tick)
}

tick()
