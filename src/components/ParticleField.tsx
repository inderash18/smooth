"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/providers/ThemeProvider";

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL availability to prevent Three.js context creation errors and console spam in environments where it is disabled.
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch {
        return false;
      }
    };

    if (!isWebGLAvailable()) {
      console.warn("WebGL is not supported or disabled in this browser. ParticleField background disabled.");
      return;
    }

    const container = containerRef.current;
    let renderer: THREE.WebGLRenderer | null = null;
    let particlesGeometry: THREE.BufferGeometry | null = null;
    let particlesMaterial: THREE.PointsMaterial | null = null;
    let animationId: number | null = null;
    let hasHover = false;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    let camera: THREE.PerspectiveCamera | null = null;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    const onWindowResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    try {
      const scene = new THREE.Scene();
      
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 100;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Particles
      const isMobile = window.innerWidth < 768;
      const particlesCount = isMobile ? 600 : 2000;
      particlesGeometry = new THREE.BufferGeometry();
      
      const posArray = new Float32Array(particlesCount * 3);
      
      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 300;
      }
      
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      );
      
      const particleColor = theme === "dark" ? 0xaaaaaa : 0x333333;
      
      particlesMaterial = new THREE.PointsMaterial({
        size: 0.8,
        color: particleColor,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });

      const currentMaterial = particlesMaterial;

      currentMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.vertexShader = `
          uniform float uTime;
          ${shader.vertexShader}
        `.replace(
          "#include <begin_vertex>",
          `
          #include <begin_vertex>
          transformed.y += sin(uTime + transformed.x) * 2.0;
          `
        );
        currentMaterial.userData.shader = shader;
      };
      
      const particlesMesh = new THREE.Points(particlesGeometry, currentMaterial);
      scene.add(particlesMesh);

      hasHover = window.matchMedia("(hover: hover)").matches;
      if (hasHover) {
        window.addEventListener("mousemove", onMouseMove);
      }

      window.addEventListener("resize", onWindowResize);

      // Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        targetX = mouseX * 0.05;
        targetY = mouseY * 0.05;
        
        // Smooth camera movement based on mouse
        if (camera) {
          camera.position.x += (targetX - camera.position.x) * 0.02;
          camera.position.y += (-targetY - camera.position.y) * 0.02;
          camera.lookAt(scene.position);
        }

        // Subtle particle floating
        particlesMesh.rotation.y = elapsedTime * 0.02;
        particlesMesh.rotation.x = elapsedTime * 0.01;

        // Update shader uniform
        if (currentMaterial.userData.shader) {
          currentMaterial.userData.shader.uniforms.uTime.value = elapsedTime;
        }

        if (renderer && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();
    } catch (e) {
      console.warn("WebGL not supported or failed to initialize in ParticleField:", e);
    }

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      if (hasHover) {
        window.removeEventListener("mousemove", onMouseMove);
      }
      window.removeEventListener("resize", onWindowResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (particlesGeometry) {
        particlesGeometry.dispose();
      }
      if (particlesMaterial) {
        particlesMaterial.dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
    />
  );
}
