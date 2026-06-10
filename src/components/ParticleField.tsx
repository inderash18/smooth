"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/providers/ThemeProvider";

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const initialPosArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      const val = (Math.random() - 0.5) * 300;
      posArray[i] = val;
      initialPosArray[i] = val;
    }
    
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    
    const particleColor = theme === "dark" ? 0xaaaaaa : 0x333333;
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.8,
      color: particleColor,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };
    
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Animation Loop
    let animationId: number;
    let time = 0;
    
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      targetX = mouseX * 0.05;
      targetY = mouseY * 0.05;
      
      // Smooth camera movement based on mouse
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Subtle particle floating
      particlesMesh.rotation.y = elapsedTime * 0.02;
      particlesMesh.rotation.x = elapsedTime * 0.01;

      // Make particles react to cursor slightly
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Base sine wave movement
        const ix = initialPosArray[i3];
        const iy = initialPosArray[i3 + 1];
        const iz = initialPosArray[i3 + 2];
        
        positions[i3 + 1] = iy + Math.sin(elapsedTime + ix) * 2;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
      container.removeChild(renderer.domElement);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
    />
  );
}
