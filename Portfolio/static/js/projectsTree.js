(function () {
    document.addEventListener('DOMContentLoaded', () => {
        initializeProjectsTree();
    });

    function initializeProjectsTree() {
        const container = document.getElementById('projects-tree-canvas');
        const fallbackList = document.getElementById('projects-tree-fallback');
        const label = document.getElementById('projects-tree-label');
        const hud = document.querySelector('[data-hud-projects]');

        if (!container || !fallbackList || !hud) {
            return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.innerWidth < 768;

        if (isMobile || prefersReducedMotion || !isWebGLAvailable() || typeof THREE === 'undefined') {
            hud.classList.remove('hud-projects--three-d');
            fallbackList.querySelectorAll('[data-project-node]').forEach(node => node.classList.remove('is-active'));
            return;
        }

        hud.classList.add('hud-projects--three-d');

        const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0, 6.5);

        const ambientLight = new THREE.AmbientLight(0x66ffee, 0.4);
        const fillLight = new THREE.PointLight(0x88ffee, 1.35, 25);
        fillLight.position.set(0, 3.5, 6);
        scene.add(ambientLight, fillLight);

        const rootGroup = new THREE.Group();
        scene.add(rootGroup);

        const rootOrb = createOrb(0.6, 0x162828, 0x45f9d6, 0.9);
        rootOrb.userData = { label: 'Projects', isRoot: true };
        rootGroup.add(rootOrb);

        const projectNodes = Array.from(fallbackList.querySelectorAll('[data-project-node]')).map((node, index) => {
            const link = node.querySelector('[data-project-target]');
            return {
                element: node,
                index,
                label: node.dataset.projectLabel || (link ? link.textContent.trim() : ''),
                url: link ? link.getAttribute('href') : null,
                link,
            };
        }).filter(item => Boolean(item.url));

        const orbitRadius = 2.45;
        const orbitVerticalScale = 0.75;
        const projectMeshes = [];
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x2affe2,
            transparent: true,
            opacity: 0.55,
            linewidth: 2
        });

        projectNodes.forEach((project, idx) => {
            const angle = (idx / projectNodes.length) * Math.PI * 2;
            const x = Math.cos(angle) * orbitRadius;
            const y = Math.sin(angle) * orbitRadius * orbitVerticalScale;
            const orb = createOrb(0.42, 0x0b1f1f, 0x48ffdf, 0.96);
            orb.position.set(x, y, 0);
            orb.userData = {
                label: project.label,
                url: project.url,
                element: project.element,
            };

            const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
                rootOrb.position.clone(),
                orb.position.clone()
            ]);
            const connection = new THREE.Line(connectionGeometry, connectionMaterial.clone());
            connection.userData = { pulsing: Math.random() * Math.PI * 2 };
            rootGroup.add(connection);

            rootGroup.add(orb);
            projectMeshes.push(orb);
        });

        const particles = createParticleField(160, 3.2, 1.2);
        rootGroup.add(particles);

        let hoverTarget = null;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(2, 2);

        function updatePointerFromEvent(event) {
            const bounds = container.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            pointer.x = x * 2 - 1;
            pointer.y = -(y * 2 - 1);
        }

        function handleHover(intersection) {
            if (hoverTarget === intersection) {
                return;
            }

            if (hoverTarget) {
                setOrbActive(hoverTarget, false);
            }

            hoverTarget = intersection;

            if (hoverTarget) {
                setOrbActive(hoverTarget, true);
            } else if (label) {
                label.classList.remove('is-visible');
            }
        }

        function setOrbActive(mesh, isActive) {
            if (!mesh) {
                return;
            }

            const { element, label: nodeLabel } = mesh.userData;
            mesh.scale.setScalar(isActive ? 1.18 : 1);
            mesh.material.emissiveIntensity = isActive ? 1.35 : 0.95;

            if (label && nodeLabel) {
                if (isActive) {
                    label.textContent = nodeLabel;
                    label.classList.add('is-visible');
                } else {
                    label.classList.remove('is-visible');
                }
            }

            if (element) {
                element.classList.toggle('is-active', isActive);
            }
        }

        container.addEventListener('mousemove', event => {
            updatePointerFromEvent(event);
        });

        container.addEventListener('mouseleave', () => {
            pointer.x = 2;
            pointer.y = 2;
            if (hoverTarget) {
                setOrbActive(hoverTarget, false);
                hoverTarget = null;
            }
        });

        container.addEventListener('click', event => {
            updatePointerFromEvent(event);
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(projectMeshes, false);
            if (intersects.length > 0) {
                const mesh = intersects[0].object;
                const url = mesh.userData.url;
                if (url) {
                    window.location.href = url;
                }
            }
        });

        const touchHandler = event => {
            if (!event.touches || event.touches.length === 0) {
                return;
            }
            const touch = event.touches[0];
            updatePointerFromEvent(touch);
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(projectMeshes, false);
            if (intersects.length > 0) {
                const mesh = intersects[0].object;
                const url = mesh.userData.url;
                if (url) {
                    window.location.href = url;
                }
            }
        };

        container.addEventListener('touchstart', touchHandler, { passive: true });

        function resizeRenderer() {
            const { clientWidth, clientHeight } = container;
            if (clientWidth === 0 || clientHeight === 0) {
                return;
            }
            renderer.setSize(clientWidth, clientHeight, false);
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
        }

        resizeRenderer();
        window.addEventListener('resize', resizeRenderer);

        const prefersReduced = prefersReducedMotion;
        const rotationSpeed = prefersReduced ? 0.12 : 0.45; // radians per second
        const particleSpeed = prefersReduced ? 0.08 : 0.3;
        let previousTime = performance.now();

        function animate(time) {
            requestAnimationFrame(animate);

            const delta = time - previousTime;
            previousTime = time;
            const deltaSeconds = Math.min(Math.max(delta / 1000, 0.016), 0.12);

            if (!prefersReduced) {
                rootGroup.rotation.y += rotationSpeed * deltaSeconds;
                rootGroup.rotation.x = Math.sin(time * 0.0002) * 0.18;
                particles.rotation.y -= particleSpeed * deltaSeconds;
                particles.rotation.x = Math.sin(time * 0.00015) * 0.12;
            }

            raycaster.setFromCamera(pointer, camera);
            const intersections = raycaster.intersectObjects(projectMeshes, false);
            handleHover(intersections.length > 0 ? intersections[0].object : null);

            renderer.render(scene, camera);
        }

        animate(0);
    }

    function createOrb(radius, color, emissiveColor, opacity) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color,
            emissive: emissiveColor,
            emissiveIntensity: 0.95,
            transparent: true,
            opacity,
            shininess: 60
        });
        const mesh = new THREE.Mesh(geometry, material);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: emissiveColor,
            transparent: true,
            opacity: 0.25,
            side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.8, 32, 32), glowMaterial);
        mesh.add(glowMesh);
        return mesh;
    }

    function createParticleField(count, radius, thickness) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radial = radius * (0.65 + Math.random() * 0.35);
            const height = (Math.random() - 0.5) * thickness;
            positions[i * 3] = Math.cos(angle) * radial;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radial;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0x48ffdf,
            size: 0.035,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });
        return new THREE.Points(geometry, material);
    }

    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!window.WebGLRenderingContext && (
                canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            );
        } catch (error) {
            return false;
        }
    }
})();
