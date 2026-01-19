// Scene Setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Institutional Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

camera.position.z = 5;

let emblem;

// Load the 3D Model (ASC Emblem or Symbolic Monument)
const loader = new THREE.GLTFLoader();
loader.load('assets/models/asc_heritage.glb', (gltf) => {
    emblem = gltf.scene;
    emblem.scale.set(2, 2, 2);
    scene.add(emblem);
    
    // Hide loader text once model is ready
    document.getElementById('three-loader').style.display = 'none';
}, 
(xhr) => {
    // Optional: Progress Bar logic
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    if (emblem) {
        emblem.rotation.y += 0.005; // Slow, dignified rotation
    }
    
    renderer.render(scene, camera);
}

// Performance: Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Start Animation
animate();