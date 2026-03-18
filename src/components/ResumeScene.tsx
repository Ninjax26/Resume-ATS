import { useEffect, useRef } from 'react';
import {
    AdditiveBlending,
    AmbientLight,
    BackSide,
    BufferAttribute,
    BufferGeometry,
    DirectionalLight,
    FrontSide,
    Group,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    Points,
    PointsMaterial,
    Raycaster,
    Scene,
    SRGBColorSpace,
    TextureLoader,
    Vector2,
    WebGLRenderer,
} from 'three';
import { gsap } from 'gsap';

export default function ResumeScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const container = containerRef.current;
        let renderer: WebGLRenderer;

        try {
            renderer = new WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
            });
        } catch (error) {
            console.error('ResumeScene failed to initialize WebGL:', error);
            return;
        }

        // ── Scene Setup ──
        const scene = new Scene();
        const safeHeight = Math.max(container.clientHeight, 1);
        const camera = new PerspectiveCamera(
            45,
            container.clientWidth / safeHeight,
            0.1,
            100
        );
        camera.position.z = 5;

        renderer.setSize(container.clientWidth, safeHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // ── Lighting ──
        const ambientLight = new AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const accentLight = new PointLight(0x00e5ff, 0.6);
        accentLight.position.set(-2, 1, 2);
        scene.add(accentLight);

        // ── Resume Group (receives auto-rotation + float) ──
        const resumeGroup = new Group();
        scene.add(resumeGroup);

        // ── Resume Mesh (receives mouse tilt only) ──
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(`${import.meta.env.BASE_URL}resume.png`);
        texture.colorSpace = SRGBColorSpace;

        const geometry = new PlaneGeometry(2.1, 2.97); // A4 ratio
        const material = new MeshStandardMaterial({
            map: texture,
            roughness: 0.3,
            metalness: 0.1,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.08,
            side: FrontSide,
        });
        const resume = new Mesh(geometry, material);
        resumeGroup.add(resume);

        // ── Glow Plane (behind resume, additive blend) ──
        const glowGeometry = new PlaneGeometry(2.3, 3.15);
        const glowMaterial = new MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.2,
            side: BackSide,
            blending: AdditiveBlending,
        });
        const glowMesh = new Mesh(glowGeometry, glowMaterial);
        glowMesh.position.z = -0.05;
        resume.add(glowMesh);

        // ── Dust Particles — Two Layers for Depth Parallax ──
        const createDustLayer = (count: number, spread: number, size: number, opacity: number) => {
            const geo = new BufferGeometry();
            const positions = new Float32Array(count * 3);
            for (let i = 0; i < count * 3; i++) {
                positions[i] = (Math.random() - 0.5) * spread;
            }
            geo.setAttribute('position', new BufferAttribute(positions, 3));
            const mat = new PointsMaterial({
                size,
                color: 0x00e5ff,
                transparent: true,
                opacity,
                sizeAttenuation: true,
                blending: AdditiveBlending,
                depthWrite: false,
            });
            return { points: new Points(geo, mat), geometry: geo, material: mat };
        };

        const dustNear = createDustLayer(120, 8, 0.025, 0.5);
        const dustFar = createDustLayer(80, 14, 0.015, 0.25);
        scene.add(dustNear.points);
        scene.add(dustFar.points);

        // ── GSAP Animations (applied only to resumeGroup — no duplicates) ──

        // Idle float
        const floatTween = gsap.to(resumeGroup.position, {
            y: '+=0.2',
            duration: 3.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        // Keep the resume facing forward with a subtle sway to avoid mirrored back-face text.
        const rotateTween = gsap.to(resumeGroup.rotation, {
            y: 0.22,
            duration: 4.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        // Breathing glow pulse
        const glowTween = gsap.to(glowMaterial, {
            opacity: 0.35,
            duration: 2.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        // ── Mouse Tracking (damped lerp — smooth, no fighting with GSAP) ──
        const mouse = { x: 0, y: 0 };
        const tiltTarget = { x: 0, y: 0 };
        const tiltCurrent = { x: 0, y: 0 };
        const TILT_STRENGTH_X = 0.2;
        const TILT_STRENGTH_Y = 0.3;
        const LERP_FACTOR = 0.06; // Lower = smoother/slower follow

        const raycaster = new Raycaster();
        const pointer = new Vector2();
        let isHovering = false;

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            tiltTarget.x = mouse.y * TILT_STRENGTH_X;
            tiltTarget.y = mouse.x * TILT_STRENGTH_Y;

            // Raycast for hover glow
            pointer.x = mouse.x;
            pointer.y = mouse.y;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObject(resume);
            const wasHovering = isHovering;
            isHovering = hits.length > 0;

            if (isHovering !== wasHovering) {
                gsap.to(material, {
                    emissiveIntensity: isHovering ? 0.2 : 0.08,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        // ── Animation Loop ──
        let animFrameId: number;

        const animate = () => {
            animFrameId = requestAnimationFrame(animate);

            // Damped tilt interpolation (lerp in the loop for silky smoothness)
            tiltCurrent.x = MathUtils.lerp(tiltCurrent.x, tiltTarget.x, LERP_FACTOR);
            tiltCurrent.y = MathUtils.lerp(tiltCurrent.y, tiltTarget.y, LERP_FACTOR);
            resume.rotation.x = tiltCurrent.x;
            resume.rotation.y = tiltCurrent.y;

            // Dust drift
            dustNear.points.rotation.y += 0.0003;
            dustNear.points.rotation.x += 0.0001;
            dustFar.points.rotation.y -= 0.0002;
            dustFar.points.rotation.z += 0.00015;

            renderer.render(scene, camera);
        };
        animate();

        // ── Responsive Positioning ──
        const handleResize = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = Math.max(container.clientHeight, 1);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);

            // Desktop: push right; mobile: center and push back
            gsap.to(resumeGroup.position, {
                x: width >= 1024 ? 2.5 : 0,
                z: width >= 1024 ? 0 : -1,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);

            floatTween.kill();
            rotateTween.kill();
            glowTween.kill();
            gsap.killTweensOf(material);
            gsap.killTweensOf(resumeGroup.position);

            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }

            geometry.dispose();
            material.dispose();
            glowGeometry.dispose();
            glowMaterial.dispose();
            dustNear.geometry.dispose();
            dustNear.material.dispose();
            dustFar.geometry.dispose();
            dustFar.material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}
