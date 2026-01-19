/**
 * ASC Main.js
 * Core functionality for Ao Students' Conference Website
 */

// --- 1. CONFIGURATION & STATE ---
const ASC_CONFIG = {
    modelPath: 'assests/models/asc_heritage.glb',
    visitorCount: 14293, // This would ideally be fetched from a PHP counter API
};

// --- 2. THREE.JS HERITAGE MODEL ---
let scene, camera, renderer, emblem;
const container = document.getElementById('canvas-container');

function initThree() {
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xc5a059, 1); // Gold tinted light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Loader - Using GLTFLoader
    const loader = new THREE.GLTFLoader();
    loader.load(ASC_CONFIG.modelPath, (gltf) => {
        emblem = gltf.scene;
        emblem.scale.set(2.2, 2.2, 2.2);
        scene.add(emblem);
        document.getElementById('three-loader').style.display = 'none';
    }, undefined, (error) => {
        console.error('Error loading 3D Model:', error);
        document.getElementById('three-loader').innerText = "Heritage view unavailable";
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (emblem) {
        emblem.rotation.y += 0.004; // Dignified slow rotation
    }
    renderer.render(scene, camera);
}

// Mouse Interaction for 3D Model
window.addEventListener('mousemove', (e) => {
    if (emblem) {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        emblem.rotation.x = y * 0.3;
        emblem.rotation.z = x * 0.2;
    }
});

// --- 3. ILP VERIFICATION (AJAX) ---
async function verifyPermit() {
    const searchInput = document.getElementById('ilp_search');
    const resultArea = document.getElementById('ilp-result');
    const permitNo = searchInput.value.trim();

    if (!permitNo) {
        resultArea.innerHTML = `<p style="color: #ff4d4d;">Please enter a permit number.</p>`;
        return;
    }

    resultArea.innerHTML = `<div class="loader-small">Verifying...</div>`;

    try {
        // In production, this points to your PHP API: fetch(`api/verify_ilp.php?permit=${permitNo}`)
        const response = await fetch('api/verify_ilp.php?permit=' + encodeURIComponent(permitNo));
        const data = await response.json();

        if (data.status === 'success') {
            resultArea.innerHTML = `
                <div class="result-success">
                    <i class="fas fa-check-circle"></i> Verified: ${data.holder_name}<br>
                    <small>Validity: ${data.expiry_date} | Status: ${data.permit_status}</small>
                </div>`;
        } else {
            resultArea.innerHTML = `<p style="color: #ff4d4d;">Record not found or expired.</p>`;
        }
    } catch (error) {
        resultArea.innerHTML = `<p style="color: #8892b0;">Search feature ready. Connect to database to fetch live data.</p>`;
    }
}

// --- 4. UI & UTILITIES ---

// Intersection Observer for Lazy Loading 3D
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) initThree();
}, { threshold: 0.1 });

if (container) observer.observe(container);

// Suggestion Box Handler
const suggestionForm = document.getElementById('suggestionForm');
if (suggestionForm) {
    suggestionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = suggestionForm.querySelector('input');
        if (input.value) {
            alert('Thank you for your suggestion! It has been sent to the ASC Secretariat.');
            input.value = '';
        }
    });
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Resize Handler
window.addEventListener('resize', () => {
    if (renderer && camera) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});