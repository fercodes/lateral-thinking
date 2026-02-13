'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WaterCanvas({ text = 'Lateral Thinking' }: { text?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (!canvasRef.current) return;

    const simulationVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const simulationFragmentShader = `
      uniform sampler2D textureA;
      uniform vec2 mouse;
      uniform vec2 resolution;
      uniform float time;
      uniform int frame;
      varying vec2 vUv;

      const float delta = 1.4;

      void main() {
        vec2 uv = vUv;
        if (frame == 0) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec4 data = texture2D(textureA, uv);
        float pressure = data.x;
        float pVel = data.y;

        vec2 texelSize = 1.0 / resolution;
        float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
        float p_left = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
        float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
        float p_down = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;

        if (uv.x <= texelSize.x) p_left = p_right;
        if (uv.x >= 1.0 - texelSize.x) p_right = p_left;
        if (uv.y <= texelSize.y) p_down = p_up;
        if (uv.y >= 1.0 - texelSize.y) p_up = p_down;

        pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
        pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

        pressure += delta * pVel;

        pVel -= 0.005 * delta * pressure;

        pVel *= 1.0 - 0.002 * delta;
        pressure *= 0.999;

        vec2 mouseUV = mouse / resolution;
        if(mouse.x > 0.0) {
          float dist = distance(uv, mouseUV);
          if(dist <= 0.02) {
            pressure += 2.0 * (1.0 - dist / 0.02);
          }
        }

        gl_FragColor = vec4(pressure, pVel,
          (p_right - p_left) / 2.0,
          (p_up - p_down) / 2.0);
      }
    `;

    const renderVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const renderFragmentShader = `
      uniform sampler2D textureA;
      uniform sampler2D textureB;
      varying vec2 vUv;

      void main() {
        vec4 data = texture2D(textureA, vUv);

        vec2 distortion = 0.3 * data.zw;
        vec4 color = texture2D(textureB, vUv + distortion);

        vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
        vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
        float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;

        gl_FragColor = color + vec4(specular);
      }
    `;

    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const mouse = new THREE.Vector2();
    let frame = 0;

    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);

    simScene.add(simQuad);
    scene.add(renderQuad);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: true });

    const drawText = (w: number, h: number) => {
      if (!ctx) return;
      ctx.fillStyle = '#2783fb';
      ctx.fillRect(0, 0, w, h);
      const fontSize = Math.round(Math.min(100, window.innerWidth * 0.12) * window.devicePixelRatio);
      ctx.fillStyle = '#fef4b8';
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textRef.current, w / 2, h / 2);
    };

    drawText(width, height);

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.format = THREE.RGBAFormat;

    const handleResize = () => {
      const newWidth = window.innerWidth * window.devicePixelRatio;
      const newHeight = window.innerHeight * window.devicePixelRatio;

      renderer.setSize(window.innerWidth, window.innerHeight);
      rtA.setSize(newWidth, newHeight);
      rtB.setSize(newWidth, newHeight);
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

      canvas.width = newWidth;
      canvas.height = newHeight;
      drawText(newWidth, newHeight);
      textTexture.needsUpdate = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    };

    const handleMouseLeave = () => {
      mouse.set(0, 0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      mouse.x = touch.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - touch.clientY) * window.devicePixelRatio;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      mouse.x = touch.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - touch.clientY) * window.devicePixelRatio;
    };

    const handleTouchEnd = () => {
      mouse.set(0, 0);
    };

    window.addEventListener('resize', handleResize);
    const canvasElement = canvasRef.current;
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mouseleave', handleMouseLeave);
    canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasElement.addEventListener('touchend', handleTouchEnd);

    let animId: number;
    const animate = () => {
      simMaterial.uniforms.frame.value = frame++;
      simMaterial.uniforms.time.value = performance.now() / 1000;

      simMaterial.uniforms.textureA.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);

      renderMaterial.uniforms.textureA.value = rtB.texture;
      renderMaterial.uniforms.textureB.value = textTexture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      const temp = rtA;
      rtA = rtB;
      rtB = temp;

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mouseleave', handleMouseLeave);
      canvasElement.removeEventListener('touchmove', handleTouchMove);
      canvasElement.removeEventListener('touchstart', handleTouchStart);
      canvasElement.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
      rtA.dispose();
      rtB.dispose();
      simMaterial.dispose();
      renderMaterial.dispose();
      plane.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-screen h-screen z-[1]"
    />
  );
}
