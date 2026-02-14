"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
    BufferAttribute,
    BufferGeometry,
    Line,
    MathUtils,
    Vector2,
    Vector3,
} from "three";
import { CometMaterial } from "./cometShader";
import { Sparks } from "./Sparks";

const MAX_POINTS = 36;

export function CometTrail() {
    const { viewport } = useThree();

    const mouse = useRef(new Vector2(0, 0));
    const target = useRef(new Vector2(0, 0));
    const scrollVelocity = useRef(0);
    const lastScroll = useRef(0);
    const speedRef = useRef(0);
    const cursorPositionRef = useRef(new Vector3(0, 0, 0));
    const points = useRef<Vector3[]>([]);

    const geometry = useMemo(() => {
        const g = new BufferGeometry();
        g.setAttribute(
            "position",
            new BufferAttribute(new Float32Array(MAX_POINTS * 3), 3)
        );
        return g;
    }, []);

    const trailLine = useMemo(() => new Line(geometry, CometMaterial), [geometry]);

    useEffect(() => {
        lastScroll.current = window.scrollY;

        const onMouseMove = (e: MouseEvent) => {
            target.current.set(
                (e.clientX / window.innerWidth) * viewport.width - viewport.width / 2,
                -(e.clientY / window.innerHeight) * viewport.height + viewport.height / 2
            );
        };

        const onScroll = () => {
            const currentY = window.scrollY;
            scrollVelocity.current = currentY - lastScroll.current;
            lastScroll.current = currentY;
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
        };
    }, [viewport.height, viewport.width]);

    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);

    useFrame(() => {
        const pixelToViewport = viewport.height / window.innerHeight;
        const scrollInfluence = scrollVelocity.current * pixelToViewport * 0.01;
        target.current.y += scrollInfluence;
        scrollVelocity.current *= 0.86;

        const previous = mouse.current.clone();
        mouse.current.lerp(target.current, 0.16);
        const frameSpeed = previous.distanceTo(mouse.current);
        speedRef.current = MathUtils.lerp(speedRef.current, frameSpeed, 0.3);

        const tailLength = MathUtils.clamp(
            Math.floor(speedRef.current * 65),
            8,
            MAX_POINTS
        );

        cursorPositionRef.current.set(mouse.current.x, mouse.current.y, 0);
        points.current.unshift(new Vector3(mouse.current.x, mouse.current.y, 1));
        points.current = points.current.slice(0, tailLength);

        const pos = geometry.attributes.position.array as Float32Array;
        const lastValidPoint = points.current.length > 0
            ? points.current[points.current.length - 1]
            : new Vector3(mouse.current.x, mouse.current.y, 1);

        for (let i = 0; i < MAX_POINTS; i++) {
            const p = points.current[i] ?? lastValidPoint;
            const i3 = i * 3;
            pos[i3] = p.x;
            pos[i3 + 1] = p.y;
            pos[i3 + 2] = i / MAX_POINTS;
        }
        geometry.attributes.position.needsUpdate = true;

        CometMaterial.uniforms.uOpacity.value = MathUtils.lerp(
            CometMaterial.uniforms.uOpacity.value,
            speedRef.current < 0.001 ? 0.04 : 0.62,
            0.12
        );
    });

    return (
        <>
            <primitive object={trailLine} />
            <Sparks positionRef={cursorPositionRef} speedRef={speedRef} />
        </>
    );
}
