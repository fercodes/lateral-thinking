'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    if (ctx) {
      ctx.fillStyle = '#2783fb';
      ctx.fillRect(0, 0, width, height);

      const fontSize = Math.round(Math.min(100, window.innerWidth * 0.12) * window.devicePixelRatio);
      ctx.fillStyle = '#fef4b8';
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Lateral Thinking', width / 2, height / 2);
    }

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
      if (ctx) {
        ctx.fillStyle = '#2783fb';
        ctx.fillRect(0, 0, newWidth, newHeight);

        const newFontSize = Math.round(Math.min(100, window.innerWidth * 0.12) * window.devicePixelRatio);
        ctx.fillStyle = '#fef4b8';
        ctx.font = `bold ${newFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Lateral Thinking', newWidth / 2, newHeight / 2);
      }

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
    canvasElement.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    canvasElement.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    canvasElement.addEventListener('touchend', handleTouchEnd);

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

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
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
    <>
      <style jsx global>{`
        :root {
          --coilSize: 14px;
          --delayCount: 40ms;
          --scaleMe: 1;
          --scaleFlip: 1;
          --posFlip: 0;
        }

        .seaLevel {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        }

        .fish {
          position: absolute;
          top: -35%;
          left: 0;
          width: 100%;
          height: 100%;
          filter: drop-shadow(
            calc(var(--coilSize) * 4) calc(var(--coilSize) / 3) 5px
              rgba(0, 0, 0, 0.3)
          );
          z-index: 2;
          pointer-events: none;
        }

        .fish .koiCoil {
          position: absolute;
          width: var(--coilSize);
          height: var(--coilSize);
          background-color: orangered;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          margin-left: calc(var(--coilSize) / -2);
          margin-top: calc(var(--coilSize) / -2);
          transform: scale(var(--scaleMe), var(--scaleMe));
          filter: contrast(200%);
          offset-path: path(
            'M11.7692 229.5C14.552 200.052 7.51901 171.858 -42.8757 170.644C-105.869 169.128 -131.294 76.612 -101.695 51.5872C-72.0955 26.5625 -24.6607 -50.7867 70.5883 51.5872C165.837 153.961 27.7073 131.211 33.0199 183.157C38.3326 235.102 90.3211 195.669 139.274 223.727C188.226 251.785 207.959 299.56 139.274 316.243C70.5883 332.926 41.3685 398.9 81.9726 419.754C122.577 440.608 222 478.524 222 419.754C222 372.738 222 242.432 222 183.157C219.091 129.948 175.78 30.8091 25.8099 59.9288C-161.652 96.3284 -30.3529 119.837 25.8099 141.07C81.9726 162.303 171.529 204.769 126.751 260.506C81.9726 316.243 101.326 362.501 139.274 373.496C177.222 384.492 170.012 464.495 70.5883 462.979C-28.835 461.462 -42.8757 393.015 -42.8757 373.496C-42.8757 238.288 11.7692 293 11.7692 240.506C11.7692 208.05 11.7692 237.336 11.7692 229.5Z'
          );
          animation: fishAnim 20000ms linear infinite;
          box-shadow: calc(var(--coilSize) / -2) calc(var(--coilSize) / -10) 0
            white inset;
        }

        .fish:nth-of-type(2) {
          transform-origin: top center;
          transform: scale(-1, 1);
          filter: drop-shadow(
            calc(var(--coilSize) * -4) calc(var(--coilSize) / 3) 5px
              rgba(0, 0, 0, 0.3)
          );
        }

        .fish:nth-of-type(2) .koiCoil {
          background-color: white;
          box-shadow: calc(var(--coilSize) / -2) calc(var(--coilSize) / -10) 0
            orangered inset;
        }

        .fish .koiCoil:nth-of-type(15),
        .fish .koiCoil:nth-of-type(14) {
          background-color: orangered;
        }

        .fish:nth-of-type(2) .koiCoil:nth-of-type(15),
        .fish:nth-of-type(2) .koiCoil:nth-of-type(14) {
          background-color: white;
        }

        .fish .koiCoil:nth-of-type(15)::after {
          content: ':';
          position: absolute;
          color: black;
          font-weight: 800;
          text-align: center;
          line-height: 60%;
          font-size: calc(var(--coilSize) * 1.2);
        }

        .fish .koiCoil:nth-of-type(1)::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 50%;
          top: 25%;
          left: -100%;
          border-radius: var(--coilSize);
          background-color: white;
          transform-origin: center right;
          animation: backFlip 200ms ease-in-out alternate infinite;
        }

        .fish .koiCoil:nth-of-type(14) {
          --scaleMe: 1.2;
          animation-delay: calc(var(--delayCount) * 1);
        }

        .fish .koiCoil:nth-of-type(13) {
          --scaleMe: 1.35;
          animation-delay: calc(var(--delayCount) * 2);
        }

        .fish .koiCoil:nth-of-type(12) {
          --scaleMe: 1.55;
          animation-delay: calc(var(--delayCount) * 3);
        }

        .fish .koiCoil:nth-of-type(11) {
          --scaleMe: 1.75;
          animation-delay: calc(var(--delayCount) * 4);
        }

        .fish .koiCoil:nth-of-type(10) {
          --scaleMe: 1.9;
          animation-delay: calc(var(--delayCount) * 5);
        }

        .fish .koiCoil:nth-of-type(9) {
          --scaleMe: 2;
          animation-delay: calc(var(--delayCount) * 6);
        }

        .fish .koiCoil:nth-of-type(8) {
          --scaleMe: 2;
          animation-delay: calc(var(--delayCount) * 7);
        }

        .fish .koiCoil:nth-of-type(7) {
          --scaleMe: 2;
          animation-delay: calc(var(--delayCount) * 8);
        }

        .fish .koiCoil:nth-of-type(6) {
          --scaleMe: 1.9;
          animation-delay: calc(var(--delayCount) * 9);
        }

        .fish .koiCoil:nth-of-type(5) {
          --scaleMe: 1.75;
          animation-delay: calc(var(--delayCount) * 10);
        }

        .fish .koiCoil:nth-of-type(4) {
          --scaleMe: 1.55;
          animation-delay: calc(var(--delayCount) * 11);
        }

        .fish .koiCoil:nth-of-type(3) {
          --scaleMe: 1.35;
          animation-delay: calc(var(--delayCount) * 12);
        }

        .fish .koiCoil:nth-of-type(2) {
          --scaleMe: 1.2;
          animation-delay: calc(var(--delayCount) * 13);
        }

        .fish .koiCoil:nth-of-type(1) {
          animation-delay: calc(var(--delayCount) * 14);
        }

        .fish .koiCoil:nth-of-type(12)::before,
        .fish .koiCoil:nth-of-type(12)::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 20%;
          top: -10%;
          left: -100%;
          border-radius: var(--coilSize);
          background-color: white;
          transform-origin: center right;
          animation: sideFlip 500ms ease-in-out alternate infinite;
        }

        .fish .koiCoil:nth-of-type(12)::after {
          --scaleFlip: -1;
          --posFlip: calc(var(--coilSize) * -1);
        }

        @keyframes fishAnim {
          0% {
            offset-distance: 0%;
          }

          100% {
            offset-distance: 100%;
          }
        }

        @keyframes backFlip {
          0% {
            transform: rotate(45deg);
          }

          100% {
            transform: rotate(-45deg);
          }
        }

        @keyframes sideFlip {
          0% {
            transform: scale(1, var(--scaleFlip)) translateY(var(--posFlip))
              rotate(80deg);
          }

          100% {
            transform: scale(1, var(--scaleFlip)) translateY(var(--posFlip))
              rotate(20deg);
          }
        }
      `}</style>

      <section className="relative w-full h-screen overflow-hidden bg-[#2783fb]">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-screen h-screen z-[1]"
        />

        {/* Koi fish */}
        <div className="fish">
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
        </div>
        <div className="fish">
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
          <div className="koiCoil"></div>
        </div>
        <div className="seaLevel"></div>

        <div className="absolute bottom-20 left-0 w-full flex flex-col items-center gap-6 z-10">
          <div className="text-white text-center text-sm md:text-xl font-sans space-y-2 pointer-events-none">
            <p>We create custom software that your team and clients will love.</p>
            <p>Websites | Apps | UI/UX design | Automation</p>
          </div>
          <div className="flex flex-row gap-8 md:gap-16 lg:gap-22">
            <PrimaryButton
              onClick={() => {
                const contact = document.getElementById('contact');
                if (contact) contact.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact us
            </PrimaryButton>
            <SecondaryButton
              onClick={() => {
                const projects = document.getElementById('projects');
                if (projects) projects.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Mira nuestro trabajo
            </SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
