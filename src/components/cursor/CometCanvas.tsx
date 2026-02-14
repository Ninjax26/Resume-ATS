"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { CometTrail } from "./CometTrail";

export default function CometCanvas() {
    // Disable on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return null;

    return (
        <Canvas
            orthographic
            camera={{ zoom: 1, position: [0, 0, 10] }}
            gl={{
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
            }}
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 5, // above bg, below UI
            }}
        >
            <Suspense fallback={null}>
                <CometTrail />
            </Suspense>
        </Canvas>
    );
}
