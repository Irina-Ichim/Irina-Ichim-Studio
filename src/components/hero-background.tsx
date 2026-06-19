/* eslint-disable */
"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- GLSL NOISE FUNCTIONS ---
const glslNoise = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  
  vec3 p_x0 = vec3(snoise(p - dx), snoise(p - dx + vec3(12.3)), snoise(p - dx + vec3(23.4)));
  vec3 p_x1 = vec3(snoise(p + dx), snoise(p + dx + vec3(12.3)), snoise(p + dx + vec3(23.4)));
  vec3 p_y0 = vec3(snoise(p - dy), snoise(p - dy + vec3(12.3)), snoise(p - dy + vec3(23.4)));
  vec3 p_y1 = vec3(snoise(p + dy), snoise(p + dy + vec3(12.3)), snoise(p + dy + vec3(23.4)));
  vec3 p_z0 = vec3(snoise(p - dz), snoise(p - dz + vec3(12.3)), snoise(p - dz + vec3(23.4)));
  vec3 p_z1 = vec3(snoise(p + dz), snoise(p + dz + vec3(12.3)), snoise(p + dz + vec3(23.4)));
  
  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
  
  return normalize(vec3(x, y, z)) / (2.0 * e);
}
`;

// --- LAYERS ---

// 1. Base Layer: Deep black with radial gradient
function BaseLayer() {
  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        colorCenter: { value: new THREE.Color('#1f082e') }, // Dark magenta/purple
        colorEdge: { value: new THREE.Color('#050507') },   // Deep dark
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0); // Full screen quad
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 colorCenter;
        uniform vec3 colorEdge;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float t = smoothstep(0.0, 0.8, dist);
          gl_FragColor = vec4(mix(colorCenter, colorEdge, t), 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    };
  }, []);

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial attach="material" {...shaderArgs} />
    </mesh>
  );
}

// 2. Architectural Grid
function GridLayer() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#e0007b') }, // Magenta
        uOpacity: { value: 0.2 }, 
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uOpacity;
        
        ${glslNoise}
        
        void main() {
          vec2 grid = fract(vUv * 30.0);
          
          // Thin lines
          float lineX = step(0.98, grid.x);
          float lineY = step(0.98, grid.y);
          float line = max(lineX, lineY);
          
          // Organic density mask (some zones denser)
          float noiseVal = snoise(vec3(vUv * 5.0, uTime * 0.1)) * 0.5 + 0.5;
          float densityMask = smoothstep(0.3, 0.8, noiseVal);
          
          // Radial fade
          float dist = distance(vUv, vec2(0.5));
          float radialMask = 1.0 - smoothstep(0.2, 0.5, dist);
          
          float alpha = line * densityMask * radialMask * uOpacity;
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -5]} scale={[25, 15, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={materialRef} attach="material" {...shaderArgs} />
    </mesh>
  );
}

// 3. Digital Nebula (Particles)
function NebulaLayer() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const particlesCount = 20000;
  
  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const rnd = new Float32Array(particlesCount);
    for (let i = 0; i < particlesCount; i++) {
      // Sphere distribution concentrated in center
      const r = 8 * Math.pow(Math.random(), 0.5);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta); // x
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5; // y (flattened)
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.3; // z (flattened)
      
      rnd[i] = Math.random();
    }
    return [pos, rnd];
  }, []);

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#ff0055') },
        uColor2: { value: new THREE.Color('#8a00ff') },
      },
      vertexShader: `
        uniform float uTime;
        attribute float aRandom;
        varying float vRandom;
        varying vec3 vPos;
        
        ${glslNoise}
        
        void main() {
          vRandom = aRandom;
          vPos = position;
          
          vec3 pos = position;
          // Organic movement
          float noiseFreq = 0.5;
          float noiseAmp = 0.8;
          vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.1, pos.y * noiseFreq, pos.z * noiseFreq);
          
          pos.x += snoise(noisePos) * noiseAmp;
          pos.y += snoise(noisePos + vec3(10.0)) * noiseAmp;
          pos.z += snoise(noisePos + vec3(20.0)) * noiseAmp;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (20.0 * aRandom + 8.0) * (1.0 / -mvPosition.z); 
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vRandom;
        varying vec3 vPos;
        
        void main() {
          // Soft circular particle
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = (0.5 - dist) * 2.0;
          alpha *= 0.25; // Subtle nebula opacity
          
          // Color mix based on position
          float mixVal = smoothstep(-5.0, 5.0, vPos.x) * 0.5 + vRandom * 0.5;
          vec3 finalColor = mix(uColor1, uColor2, mixVal);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, -2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} attach="material" {...shaderArgs} />
    </points>
  );
}

// 4 & 5. Atmospheric Particles & Data Flows
function AtmosphereLayer() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const particlesCount = 3000;
  
  const [positions, randoms, seeds] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const rnd = new Float32Array(particlesCount);
    const sds = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 20; // x spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // y spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z spread
      
      rnd[i] = Math.random();
      
      sds[i * 3 + 0] = Math.random() * 100;
      sds[i * 3 + 1] = Math.random() * 100;
      sds[i * 3 + 2] = Math.random() * 100;
    }
    return [pos, rnd, sds];
  }, []);

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffd1ff') },
      },
      vertexShader: `
        uniform float uTime;
        attribute float aRandom;
        attribute vec3 aSeed;
        varying float vAlpha;
        
        ${glslNoise}
        
        void main() {
          vec3 pos = position;
          
          // Curl noise for fluid data flows
          float flowSpeed = 0.15;
          vec3 flowOffset = curlNoise(pos * 0.2 + uTime * flowSpeed) * 0.5;
          pos += flowOffset;
          
          // Parallax / subtle global drift
          pos.y += sin(uTime * 0.2 + aSeed.y) * 0.5;
          pos.x += cos(uTime * 0.1 + aSeed.x) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size variation based on depth and random
          gl_PointSize = (16.0 * aRandom + 4.0) * (1.0 / -mvPosition.z);
          
          // Fade in/out
          vAlpha = (sin(uTime * 0.5 + aSeed.z) * 0.5 + 0.5) * aRandom;
          
          // Fade near camera
          vAlpha *= smoothstep(0.0, 5.0, -mvPosition.z);
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          // Diamond glare (4-point star cross)
          float circle = pow(1.0 - (dist * 2.0), 1.5);
          float cross = max(0.0, 1.0 - abs(coord.x) * 8.0) * max(0.0, 1.0 - abs(coord.y) * 1.5) + 
                        max(0.0, 1.0 - abs(coord.y) * 8.0) * max(0.0, 1.0 - abs(coord.x) * 1.5);
                        
          float glow = circle * 0.5 + cross * 0.5;
          
          gl_FragColor = vec4(uColor, glow * vAlpha * 1.2);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} attach="material" {...shaderArgs} />
    </points>
  );
}

// 6. Nodes & Connections (Plexus Effect on CPU/Instanced)
function PlexusLayer() {
  const nodesCount = 60;
  const maxDistance = 3.5;
  
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  
  // Node data
  const [nodes] = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodesCount; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8 - 2
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return [arr];
  }, []);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0xff007b,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update node positions
    for (let i = 0; i < nodesCount; i++) {
      const node = nodes[i];
      node.position.add(node.velocity);
      
      // Gentle boundaries (bounce)
      if (Math.abs(node.position.x) > 10) node.velocity.x *= -1;
      if (Math.abs(node.position.y) > 7) node.velocity.y *= -1;
      if (node.position.z > 2 || node.position.z < -10) node.velocity.z *= -1;
      
      // Subtle float
      const floatY = Math.sin(time + node.phase) * 0.005;
      node.position.y += floatY;
      
      dummy.position.copy(node.position);
      
      // Node pulsating size
      const scale = 0.5 + Math.sin(time * 2 + node.phase) * 0.2;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      if (nodesRef.current) {
        nodesRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    
    if (nodesRef.current) nodesRef.current.instanceMatrix.needsUpdate = true;
    
    // Calculate lines
    const positions = [];
    const colors = [];
    let lineCount = 0;
    
    for (let i = 0; i < nodesCount; i++) {
      for (let j = i + 1; j < nodesCount; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < maxDistance) {
          positions.push(
            nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
            nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
          );
          
          // Alpha based on distance
          const alpha = (1.0 - (dist / maxDistance)) * 0.8; // Increased line opacity
          colors.push(
            alpha, alpha, alpha,
            alpha, alpha, alpha
          );
          lineCount++;
        }
      }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    lineMaterial.vertexColors = true;
  });

  return (
    <group>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodesCount]}>
        <icosahedronGeometry args={[0.04, 0]} />
        <meshPhysicalMaterial 
          color="#ff6aa0" 
          transparent 
          opacity={0.8} 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1.0} 
          clearcoatRoughness={0.1}
          blending={THREE.AdditiveBlending} 
        />
      </instancedMesh>
      <lineSegments geometry={lineGeometry} material={lineMaterial} />
    </group>
  );
}


// 7. Gemini Constellation
function GeminiConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const { stars, edges } = useMemo(() => {
    const s = [
      new THREE.Vector3(1.5, 2.5, 0),    // 0 Castor
      new THREE.Vector3(-1.5, 2.3, 0),   // 1 Pollux
      new THREE.Vector3(1.2, 0.5, 0),    // 2 Mebsuta
      new THREE.Vector3(1.0, -1.0, 0),   // 3 Tejat
      new THREE.Vector3(1.2, -1.5, 0),   // 4 Propus
      new THREE.Vector3(2.5, -0.2, 0),   // 5 Castor leg 2
      new THREE.Vector3(-1.0, 0.8, 0),   // 6 Wasat
      new THREE.Vector3(-1.5, -1.5, 0),  // 7 Alhena
      new THREE.Vector3(-2.2, -1.8, 0),  // 8 Alzizr
      new THREE.Vector3(-2.5, 0.0, 0),   // 9 Pollux leg 2
      new THREE.Vector3(0.0, 1.0, 0),    // 10 Center/Arms joined
    ];
    
    const scale = 1.8;
    s.forEach(star => star.multiplyScalar(scale));
    
    const lines = [
      [0, 2], [2, 3], [3, 4],
      [2, 5],
      [1, 6], [6, 7], [7, 8],
      [6, 9],
      [2, 10], [6, 10]
    ];
    
    const linePositions: number[] = [];
    lines.forEach(([start, end]) => {
      linePositions.push(
        s[start].x, s[start].y, s[start].z,
        s[end].x, s[end].y, s[end].z
      );
    });
    
    return { 
      stars: s,
      edges: new Float32Array(linePositions)
    };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.2;
      groupRef.current.position.x = Math.cos(time * 0.3) * 0.1;
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
      groupRef.current.rotation.z = Math.cos(time * 0.15) * 0.02;
    }
    
    if (meshRef.current) {
      stars.forEach((star, i) => {
        dummy.position.copy(star);
        // Make Castor and Pollux (index 0, 1) slightly larger and pulsating
        const baseScale = (i === 0 || i === 1) ? 1.5 : 0.8;
        const pulse = (i === 0 || i === 1) ? Math.sin(time * 2 + i) * 0.3 : Math.sin(time * 1.5 + i) * 0.2;
        const s = baseScale + pulse;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -3.5]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, stars.length]}>
        <icosahedronGeometry args={[0.06, 0]} />
        <meshPhysicalMaterial 
          color="#bc8d43" 
          transparent 
          opacity={0.5} 
          metalness={1.0} 
          roughness={0.15} 
          clearcoat={1.0} 
        />
      </instancedMesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#bc8d43" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}


// --- LIGHTING ---
function SceneLighting() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.elapsedTime;
      // Orbit the light around the scene to create glints on the facets
      lightRef.current.position.x = Math.sin(time * 0.5) * 5;
      lightRef.current.position.y = Math.cos(time * 0.3) * 5;
      lightRef.current.position.z = Math.sin(time * 0.2) * 5 + 2;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} color="#4a154b" />
      <directionalLight ref={lightRef} color="#ffffff" intensity={2.5} position={[0, 0, 5]} />
      <directionalLight color="#ff6aa0" intensity={1.5} position={[-5, 5, -2]} />
      <directionalLight color="#bc8d43" intensity={1.0} position={[5, -5, 2]} />
    </group>
  );
}

// --- MAIN COMPONENT ---

export function HeroBackground() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#050507] overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]} // Optimize pixel ratio
        gl={{ alpha: true, antialias: true }}
      >
        <SceneLighting />
        <BaseLayer />
        <GridLayer />
        <NebulaLayer />
        <AtmosphereLayer />
        <PlexusLayer />
        <GeminiConstellation />
      </Canvas>
    </div>
  );
}
