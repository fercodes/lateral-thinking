'use client';

import { useEffect, useState, useRef } from 'react';

export default function ExitIntent() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Rain animation
  useEffect(() => {
    if (!showPopup || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Letters
    const letters =
      'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
    const lettersArray = letters.split('');

    // Setup columns
    const fontSize = 10;
    const columns = canvas.width / fontSize;

    // Setup drops
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Draw function
    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text =
          lettersArray[Math.floor(Math.random() * lettersArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
    }

    // Start animation loop
    const interval = setInterval(draw, 40);
    animationRef.current = interval as unknown as number;

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [showPopup]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleRedPill = () => {
    setShowPopup(false);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBluePill = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Rain Canvas - Full screen background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-40"
        style={{ display: 'block' }}
      />

      {/* Popup overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative max-w-xl w-full bg-black border border-[#00FF41]/30 rounded-lg shadow-2xl shadow-[#00FF41]/20 p-6">
          {/* Close button */}
          <button
            onClick={handleBluePill}
            className="absolute top-4 right-4 text-[#00FF41] hover:text-[#00FF41]/80 transition-colors z-10"
            aria-label="Close popup"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Text */}
          <p className="text-[#00FF41] text-center text-base mb-6 leading-relaxed font-mono px-2">
            This is your last chance. After this, there is no turning back. You
            take the blue pill... you leave this site and miss out on top-notch
            software skills. You take the red pill... we dive into code, and
            we&apos;ll show you how deep our expertise goes.
          </p>

          {/* Pills */}
          <div className="flex gap-4 justify-center items-center flex-wrap">
            {/* Blue Pill */}
            <button
              onClick={handleBluePill}
              className="group relative"
              aria-label="Take the blue pill"
            >
              <div className="w-48 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-blue-500/70 border-2 border-blue-400/50">
                <span className="text-white font-bold text-sm tracking-wider">
                  BLUE PILL
                </span>
              </div>
            </button>

            {/* Red Pill */}
            <button
              onClick={handleRedPill}
              className="group relative"
              aria-label="Take the red pill"
            >
              <div className="w-48 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg shadow-red-500/50 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-red-500/70 border-2 border-red-400/50">
                <span className="text-white font-bold text-sm tracking-wider">
                  RED PILL
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
