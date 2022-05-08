import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const texture = new THREE.TextureLoader().load( 'https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80' );


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

/**
 * Cube
 */
// const geometry = new THREE.SphereGeometry(1, 32, 32)
//
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
//
// const tunnel =  new THREE.Mesh(geometry, material)
//
// scene.add(tunnel)

class CustomSinCurve extends THREE.Curve {
	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = Math.cos( 2 * Math.PI * t );
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

	}

}

const path = new CustomSinCurve( 10 );
const tubeGeometry = new THREE.TubeGeometry( path, 200, 1, 32, false );

const material = new THREE.MeshBasicMaterial( {
  side: THREE.DoubleSide,
  map: texture,
 } );
material.map.wrapS = THREE.RepeatWrapping;
material.map.wrapT = THREE.RepeatWrapping;
material.map.repeat.set(10, 1)

const mesh = new THREE.Mesh( tubeGeometry, material );
scene.add( mesh );

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
//let lastElapsedTime = 0
let normal = new THREE.Vector3()
let binormal = new THREE.Vector3()
let lookAt = new THREE.Vector3()


const tick = () =>
{
        // const elapsedTime = clock.getElapsedTime()
        // const deltaTime = elapsedTime - lastElapsedTime
        // lastElapsedTime = elapsedTime

        const time = Date.now();
    		const looptime = 20 * 1000;
    		const t = ( time % looptime ) / looptime;

        let pos = tubeGeometry.parameters.path.getPointAt( t );

				// interpolation
        const segments = tubeGeometry.tangents.length;
				const pickt = t * segments;
				const pick = Math.floor( pickt );
				const pickNext = ( pick + 1 ) % segments;

				binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
				binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );

				const direction = tubeGeometry.parameters.path.getTangentAt( t );
				const offset = 0;

				normal.copy( binormal ).cross( direction );

				// we move on a offset on its binormal

				pos.add( normal.clone().multiplyScalar( offset ) );

				// splineCamera.position.copy( pos );
				camera.position.copy( pos );

        tubeGeometry.parameters.path.getPointAt((t + 1 / tubeGeometry.parameters.path.getLength()) % 1, lookAt)
				// using arclength for stablization in look ahead

				camera.matrix.lookAt( camera.position, lookAt, normal );
				camera.rotation.setFromRotationMatrix( camera.matrix, camera.rotation.order );


        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
}

tick()
