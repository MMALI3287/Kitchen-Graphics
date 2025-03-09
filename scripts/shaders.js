export const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    void main() {
        vec3 color = mix(color1, color2, vUv.y);
        gl_FragColor = vec4(color, 1.0);
    }
`;

export const steamVertexShader = `
    uniform float time;
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        
        vec3 newPosition = position;
        newPosition.y += sin(time * 2.0 + position.x * 10.0) * 0.02;
        newPosition.x += cos(time * 2.0 + position.y * 10.0) * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;

export const steamFragmentShader = `
    uniform vec3 color;
    uniform float time;
    uniform float opacity;
    
    varying vec2 vUv;
    
    void main() {
        
        float dist = length(vUv - vec2(0.5));
        float alpha = smoothstep(0.5, 0.2, dist);
        
        
        alpha *= opacity * (1.0 - abs(sin(time * 0.5)));
        
        gl_FragColor = vec4(color, alpha);
    }
`;

export const reflectiveVertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const reflectiveFragmentShader = `
    uniform vec3 baseColor;
    uniform float roughness;
    uniform float metalness;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        
        float specular = pow(max(0.0, dot(reflect(-viewDir, normal), viewDir)), 30.0 / roughness);
        specular = mix(0.0, specular, metalness);
        
        
        vec3 finalColor = baseColor + vec3(specular);
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;
