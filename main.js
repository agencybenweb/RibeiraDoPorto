// ==========================================
// CORE JAVASCRIPT: AZULEJOS EDITION
// ==========================================

// --- PRELOADER ---
const preloader = document.querySelector('.preloader');
const counter = document.querySelector('.preloader-count');
if (preloader && counter) {
    let count = 0;
    let limit = 100;
    
    document.body.style.overflow = 'hidden';

    let loadInterval = setInterval(() => {
        count += Math.floor(Math.random() * 5) + 1;
        if (count > limit) count = limit;
        counter.innerHTML = count + "%";

        if (count === limit) {
            clearInterval(loadInterval);
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    }, 50);
}

// --- GLOBAL MOUSE VARIABLES (Used by 3D Parallax & Cursor) ---
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// --- CUSTOM CURSOR & MOUSE EFFECTS (DESKTOP ONLY) ---
if (!isTouchDevice) {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);

    let dotX = mouseX, dotY = mouseY;
    let outlineX = mouseX, outlineY = mouseY;

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // MAGNETIC BUTTONS
    document.querySelectorAll('.btn, .nav-links a').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    });

    document.querySelectorAll('a, button, input, select, textarea, .menu-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // --- MENU HOVER REVEAL ---
    const hoverImg = document.querySelector('.hover-reveal-img');
    if (hoverImg) {
        document.addEventListener('mousemove', (e) => {
            hoverImg.style.left = e.clientX + 'px';
            hoverImg.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('.menu-item[data-image]').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const imgSrc = item.getAttribute('data-image');
                hoverImg.style.backgroundImage = `url(${imgSrc})`;
                hoverImg.classList.add('visible');
            });
            item.addEventListener('mouseleave', () => {
                hoverImg.classList.remove('visible');
            });
        });
    }
}

// --- MOBILE MENU ---
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
        
        if (mobileNav.classList.contains('open')) {
            gsap.fromTo(mobileLinks, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.2 }
            );
        }
    });
}

// --- SMOOTH SCROLLING (LENIS) ---
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// --- NAVBAR SCROLL EFFECT ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// --- GSAP SCROLL ANIMATIONS ---
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.to(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });
}

// --- PAGE TRANSITIONS ---
window.addEventListener('load', () => {
    gsap.to('.page-transition', {
        duration: 1.2,
        yPercent: -100,
        ease: "power4.inOut",
        delay: 0.1
    });
});

document.querySelectorAll('a[href^="/"], a[href^="."]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = link.getAttribute('href');
        if(target.startsWith('#')) return;
        if(target === window.location.pathname.split('/').pop()) return;
        
        e.preventDefault();
        gsap.set('.page-transition', { yPercent: 100 });
        gsap.to('.page-transition', {
            duration: 1,
            yPercent: 0,
            ease: "power4.inOut",
            onComplete: () => {
                window.location.href = target;
            }
        });
    });
});

// --- THREE.JS IMMERSIVE BACKGROUND : AZULEJOS WALL ---
if (typeof THREE !== 'undefined') {
    const container = document.getElementById('canvas-container');
    if (container) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.012); // Fog pour la profondeur

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 25; 

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        // Déduction de la page actuelle pour adapter la palette !
        const path = window.location.pathname;
        let cDark = '#0A1015', cMain = '#1B4F72', cLight = '#E8E5DF', cAccent = '#D4A843'; // Accueil (Bleu/Or)
        if (path.includes('menu.html')) {
            cDark = '#1A0505'; cMain = '#8B1A1A'; cLight = '#FDF5E6'; cAccent = '#D4A843'; // Rouge Vin/Or
        } else if (path.includes('histoire.html')) {
            cDark = '#1A130A'; cMain = '#8B5A2B'; cLight = '#FFF8DC'; cAccent = '#CD853F'; // Terre/Vintage
        } else if (path.includes('galerie.html')) {
            cDark = '#0A0A0A'; cMain = '#2F4F4F'; cLight = '#F0F8FF'; cAccent = '#C0C0C0'; // Monochromatique Gris/Argent
        } else if (path.includes('reservation.html')) {
            cDark = '#021A10'; cMain = '#0F523A'; cLight = '#E8F5EE'; cAccent = '#D4A843'; // Emeraude/Or
        }

        // Lumières interactives colorées
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(cAccent, 0.8); // Reflet du thème
        dirLight.position.set(20, 30, 20);
        scene.add(dirLight);
        
        const pointLight = new THREE.PointLight(cMain, 2, 60); // Halo du thème
        pointLight.position.set(-10, -10, 15);
        scene.add(pointLight);

        // Configuration de la grille d'Azulejos
        const gridCols = 35;
        const gridRows = 25;
        const count = gridCols * gridRows;

        // Géométrie : Un carreau 3D fin
        const tileGeo = new THREE.BoxGeometry(1.8, 1.8, 0.15);
        const tileMat = new THREE.MeshPhysicalMaterial({
            roughness: 0.15,     // Céramique brillante
            metalness: 0.1,
            clearcoat: 1.0,      // Couche de glaçure (glaze) typoique des azulejos
            clearcoatRoughness: 0.1
        });

        // InstancedMesh pour des performances extrêmes
        const instancedMesh = new THREE.InstancedMesh(tileGeo, tileMat, count);
        scene.add(instancedMesh);

        const dummy = new THREE.Object3D();

        const startPositions = [];
        const startRotations = [];
        const endPositions = [];
        const endRotations = [];

        // Couleurs Thématiques DYNAMIQUES assignées précédemment
        const tColorDark = new THREE.Color(cDark);
        const tColorMain = new THREE.Color(cMain);
        const tColorLight = new THREE.Color(cLight);
        const tColorAccent = new THREE.Color(cAccent);

        let index = 0;
        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                // ETAT FINAL : Mur parfait aligné au fond
                const ex = (i - gridCols / 2) * 1.9;
                const ey = (j - gridRows / 2) * 1.9;
                const ez = -10; 
                endPositions.push(new THREE.Vector3(ex, ey, ez));
                endRotations.push(new THREE.Euler(0, 0, 0));

                // ETAT INITIAL : Éléments dispersés / envolés
                const angle = Math.random() * Math.PI * 2;
                const radius = 20 + Math.random() * 40;
                const height = (Math.random() - 0.5) * 80;
                
                const sx = Math.cos(angle) * radius;
                const sy = height;
                const sz = Math.sin(angle) * radius - 20; // Plus profond
                
                startPositions.push(new THREE.Vector3(sx, sy, sz));
                
                startRotations.push(new THREE.Euler(
                    Math.random() * Math.PI * 2, 
                    Math.random() * Math.PI * 2, 
                    Math.random() * Math.PI * 2
                ));

                // Alternance Sombre / Clair (Checkerboard destructuré) - Dynamique!
                let finalColor = tColorLight;
                if ((i + j) % 2 === 0) {
                    finalColor = Math.random() > 0.3 ? tColorMain : tColorDark;
                } else {
                    finalColor = Math.random() > 0.85 ? tColorAccent : tColorLight;
                }
                
                instancedMesh.setColorAt(index, finalColor);
                index++;
            }
        }
        instancedMesh.instanceColor.needsUpdate = true;

        let maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        });

        // Observer les changements dynamiques
        const observer = new ResizeObserver(() => {
            maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        });
        observer.observe(document.body);

        let smoothMouseX = 0;
        let smoothMouseY = 0;
        
        const clock = new THREE.Clock();
        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            let scrollY = window.scrollY || 0;
            
            let scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
            
            // Lissage du mouvement de souris
            const targetMouseX = (mouseX - window.innerWidth / 2) * 0.001;
            const targetMouseY = (mouseY - window.innerHeight / 2) * 0.001;
            smoothMouseX += (targetMouseX - smoothMouseX) * 0.05;
            smoothMouseY += (targetMouseY - smoothMouseY) * 0.05;

            // Assemblage dynamique
            for (let i = 0; i < count; i++) {
                // Vague de reconstruction
                const col = Math.floor(i / gridRows);
                const row = i % gridRows;
                const delay = (col / gridCols) * 0.5 + (row / gridRows) * 0.5; 
                
                let t = (scrollProgress * 2) - delay;
                t = Math.max(0, Math.min(1, t));
                
                // Easing pour un impact percutant au collage
                t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

                // Interpolation de la position
                const startP = startPositions[i];
                const endP = endPositions[i];
                dummy.position.lerpVectors(startP, endP, t);

                // Flottement constant dans l'état dispersé
                if (t < 1) {
                    dummy.position.x += Math.cos(elapsedTime * 0.5 + i) * 0.05 * (1-t);
                    dummy.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.05 * (1-t);
                }

                // La souris repousse légèrement les carreaux au survol (Parallaxe 3D)
                dummy.position.x += smoothMouseX * 5 * t;
                dummy.position.y -= smoothMouseY * 5 * t;

                // Interpolation des Rotations
                const qStart = new THREE.Quaternion().setFromEuler(startRotations[i]);
                const qEnd = new THREE.Quaternion().setFromEuler(endRotations[i]);
                dummy.quaternion.slerpQuaternions(qStart, qEnd, t);
                
                if (t < 1) {
                    dummy.rotateX(elapsedTime * 0.2 * (1-t));
                    dummy.rotateY(elapsedTime * 0.3 * (1-t));
                }

                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
            
            // Rotation globale de la scène pour réagir au regard (souris)
            scene.rotation.y = smoothMouseX * 0.5;
            scene.rotation.x = smoothMouseY * 0.5;

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();
    }
}
