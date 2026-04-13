import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls, Html, Text, MeshReflectorMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { MoveRight } from 'lucide-react';

function FloatingTablet({ onEnter }: { onEnter: () => void }) {
  return (
    <Float rotationIntensity={0.4} floatIntensity={2} speed={1.5}>
      <group position={[0, 0, 0]}>
        {/* Tablet Body - Completely transparent glass with rounded corners */}
        <RoundedBox args={[3.2, 2.2, 0.1]} radius={0.15} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={1} 
            opacity={1} 
            transparent
            metalness={0.2} 
            roughness={0.02} 
            ior={1.5} 
            thickness={0.5} 
            clearcoat={1} 
          />
        </RoundedBox>
        
        {/* Screen - Completely transparent glass with rounded corners */}
        <RoundedBox args={[3.1, 2.1, 0.02]} radius={0.12} smoothness={4} position={[0, 0, 0.05]}>
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={1} 
            opacity={1} 
            transparent 
            roughness={0.02} 
            ior={1.5}
            thickness={0.1}
          />
        </RoundedBox>

        {/* HTML Content on Screen */}
        <Html
          transform
          wrapperClass="htmlScreen"
          distanceFactor={1.17}
          position={[0, 0, 0.07]}
          style={{
            width: '800px',
            height: '540px',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            borderRadius: '38px', // Match the 3D rounded corners
          }}
        >
          <div className="text-center space-y-8">
            <h1 className="text-6xl font-serif italic text-white mb-4">
              ACM EDUCATION PROJECT
            </h1>
            <p className="text-2xl font-mono text-white/70 uppercase tracking-widest">
              Empowering Through Science
            </p>
            <button 
              onClick={onEnter}
              className="mt-12 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-4 mx-auto"
            >
              Enter Hub <MoveRight />
            </button>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function GlowingRing() {
  const ringRef = useRef<THREE.Group>(null);
  const time = useRef(0);
  
  useFrame((state, delta) => {
    time.current += delta;
    if (ringRef.current) {
      ringRef.current.rotation.z = time.current * 0.2;
      ringRef.current.rotation.x = Math.sin(time.current * 0.5) * 0.1;
      ringRef.current.rotation.y = Math.cos(time.current * 0.3) * 0.1;
    }
  });

  return (
    <group ref={ringRef} position={[0, 0, -2]}>
      {/* Core */}
      <mesh>
        <torusGeometry args={[3, 0.02, 16, 64]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Inner Glow */}
      <mesh>
        <torusGeometry args={[3, 0.08, 16, 64]} />
        <meshBasicMaterial color="#FFFDD0" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Outer Glow */}
      <mesh>
        <torusGeometry args={[3, 0.25, 16, 64]} />
        <meshBasicMaterial color="#800020" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Massive subtle glow */}
      <mesh>
        <torusGeometry args={[3, 0.8, 16, 64]} />
        <meshBasicMaterial color="#800020" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight color="#FFFDD0" intensity={3} distance={15} />
    </group>
  );
}

function Particles() {
  const count = 300;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    time.current += delta;
    const t = time.current;
    for (let i = 0; i < count; i++) {
      const x = (Math.sin(i * 0.1 + t * 0.2) * 8);
      const y = (Math.cos(i * 0.2 + t * 0.1) * 6);
      const z = (Math.sin(i * 0.3 + t * 0.15) * 8);
      
      dummy.position.set(
        (i % 20) * 0.8 - 8 + x * 0.2,
        Math.floor(i / 20) * 0.8 - 6 + y * 0.2,
        (Math.sin(i) * 4) - 4 + z * 0.2
      );
      dummy.rotation.x = t * 0.2;
      dummy.rotation.y = t * 0.3;
      
      const scale = (Math.sin(i + t) + 1) * 0.5 + 0.5;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null as any, null as any, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="#800020" roughness={0.4} metalness={0.6} emissive="#800020" emissiveIntensity={0.2} />
    </instancedMesh>
  );
}

export function Hero3D({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="w-full h-screen absolute inset-0 z-0 overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, #FFFDD0 0%, #800020 100%)',
            'radial-gradient(circle at 80% 70%, #FFFDD0 0%, #800020 100%)',
            'radial-gradient(circle at 50% 50%, #FFFDD0 0%, #800020 100%)',
            'radial-gradient(circle at 20% 30%, #FFFDD0 0%, #800020 100%)',
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={1} performance={{ min: 0.5 }} style={{ position: 'relative', zIndex: 1 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-0.4, 0.4]}
        >
          <FloatingTablet onEnter={onEnter} />
        </PresentationControls>

        <GlowingRing />
        <Particles />
        
        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[100, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
            mirror={1}
            transparent
            opacity={0.5}
          />
        </mesh>
        
        <Environment preset="city" />
      </Canvas>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-white/50 font-mono text-xs uppercase tracking-[0.3em] pointer-events-none flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
        Drag to interact
      </div>
    </div>
  );
}
