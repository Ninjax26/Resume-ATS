import { MutableRefObject, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    PointsMaterial,
    Vector3,
} from 'three';

interface SparksProps {
    positionRef: MutableRefObject<Vector3>;
    speedRef: MutableRefObject<number>;
}

export function Sparks({ positionRef, speedRef }: SparksProps) {
    const count = 20;
    const geometry = useMemo(() => new BufferGeometry(), []);
    const material = useMemo(() => new PointsMaterial({
        color: 0x6ffff0,
        size: 1.8,
        transparent: true,
        opacity: 0.75,
        blending: AdditiveBlending,
        depthWrite: false,
    }), []);

    const particles = useMemo(() => {
        const data: { position: Vector3; velocity: Vector3; life: number; maxLife: number }[] = [];
        for (let i = 0; i < count; i++) {
            data.push({
                position: new Vector3(),
                velocity: new Vector3(),
                life: 0,
                maxLife: 0
            });
        }
        return data;
    }, []);

    const positions = useMemo(() => new Float32Array(count * 3), []);
    const bufferAttribute = useMemo(() => new BufferAttribute(positions, 3), [positions]);

    useEffect(() => {
        geometry.setAttribute('position', bufferAttribute);
    }, [geometry, bufferAttribute]);

    useFrame(() => {
        const speed = speedRef.current;

        if (speed > 0.25) {
            let spawnCount = 0;
            const spawnLimit = Math.min(3, Math.max(1, Math.floor(speed * 4)));
            for (let i = 0; i < count; i++) {
                if (particles[i].life <= 0 && spawnCount < spawnLimit) {
                    particles[i].life = Math.random() * 18 + 8;
                    particles[i].maxLife = particles[i].life;
                    particles[i].position.copy(positionRef.current);
                    particles[i].position.x += (Math.random() - 0.5) * 0.12;
                    particles[i].position.y += (Math.random() - 0.5) * 0.12;

                    particles[i].velocity.set(
                        (Math.random() - 0.5) * 0.06,
                        (Math.random() - 0.5) * 0.06,
                        (Math.random() - 0.5) * 0.04
                    );
                    spawnCount++;
                }
            }
        }

        // Update
        for (let i = 0; i < count; i++) {
            const p = particles[i];
            if (p.life > 0) {
                p.life--;
                p.position.add(p.velocity);
                p.velocity.multiplyScalar(0.97);
                p.velocity.y -= 0.002;

                positions[i * 3] = p.position.x;
                positions[i * 3 + 1] = p.position.y;
                positions[i * 3 + 2] = p.position.z;
            } else {
                positions[i * 3] = 9999;
                positions[i * 3 + 1] = 9999;
                positions[i * 3 + 2] = 9999;
            }
        }

        geometry.attributes.position.needsUpdate = true;
    });

    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    return (
        <points geometry={geometry} material={material} />
    );
}
