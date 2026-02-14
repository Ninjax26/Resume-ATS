import { AdditiveBlending, Color, ShaderMaterial } from "three";

export const CometMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
        uColor: { value: new Color("#3fffe0") },
        uOpacity: { value: 0.6 },
    },
    vertexShader: `
    varying float vProgress;

    void main() {
      vProgress = position.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vProgress;

    void main() {
      float alpha = smoothstep(1.0, 0.0, vProgress);
      alpha = pow(alpha, 2.2); // cinematic falloff

      gl_FragColor = vec4(uColor, alpha * uOpacity);
    }
  `,
});
