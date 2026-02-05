'use client';

import { useEffect, useState, useRef } from 'react';

export default function ExitIntent() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [displayedMainText, setDisplayedMainText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [firstTypingComplete, setFirstTypingComplete] = useState(false);
  const [secondTypingComplete, setSecondTypingComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const mainMessage =
    "This is your last chance. After this, there is no turning back. You take the blue pill... you leave this site and miss out on top-notch software skills. You take the red pill... we dive into code, and we'll show you how deep our expertise goes.";

  // Generate personalized message based on time and visits
  useEffect(() => {
    const hour = new Date().getHours();
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    localStorage.setItem('visitCount', (visitCount + 1).toString());

    let timeMessage = '';
    if (hour >= 0 && hour < 6) {
      timeMessage = 'Wake up.\nWe know why you stay awake at night.';
    } else if (hour >= 6 && hour < 18) {
      timeMessage = 'Wake up.\nThe simulation has you.';
    } else {
      timeMessage = 'Wake up.\nAnother day wasted in the simulation.';
    }

    if (visitCount >= 1) {
      timeMessage += "\nYou keep coming back.\nYou feel it, don't you?";
    }

    setPersonalizedMessage(timeMessage);
  }, []);

  // Typewriter effect for first message
  useEffect(() => {
    if (!showPopup || !personalizedMessage) return;

    let index = 0;
    const typingSpeed = 20;

    const typeInterval = setInterval(() => {
      if (index < personalizedMessage.length) {
        setDisplayedText(personalizedMessage.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setFirstTypingComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [showPopup, personalizedMessage]);

  // Typewriter effect for second message (starts after first is complete)
  useEffect(() => {
    if (!firstTypingComplete) return;

    let index = 0;
    const typingSpeed = 20;

    const typeInterval = setInterval(() => {
      if (index < mainMessage.length) {
        setDisplayedMainText(mainMessage.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setSecondTypingComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [firstTypingComplete]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Rain animation
  useEffect(() => {
    if (!showPopup || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters =
      'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
    const lettersArray = letters.split('');
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

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

    const interval = setInterval(draw, 40);
    animationRef.current = interval as unknown as number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

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
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
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
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-40"
        style={{ display: 'block' }}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div
          className="relative max-w-xl w-full bg-black border border-[#00FF41]/30 rounded-lg shadow-2xl shadow-[#00FF41]/20 p-6 min-h-[400px] flex flex-col"
          style={{ fontFamily: "'Consolas', 'Monaco', monospace" }}
        >
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

          {/* Text Container - Fixed height */}
          <div className="flex-1 flex flex-col justify-start">
            {/* First Typewriter Text with Cursor - Left aligned */}
            <p className="text-[#00FF41] text-left text-base mb-4 leading-relaxed font-mono px-2 tracking-wide whitespace-pre-line">
              {displayedText}
              {!firstTypingComplete && (
                <span
                  className={`inline-block w-2 h-4 bg-[#00FF41] ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                />
              )}
            </p>

            {/* Second Typewriter Text with Cursor - Left aligned */}
            {firstTypingComplete && (
              <p className="text-[#00FF41] text-left text-base mb-6 leading-relaxed font-mono px-2 tracking-wide whitespace-pre-line">
                {displayedMainText}
                {!secondTypingComplete && (
                  <span
                    className={`inline-block w-2 h-4 bg-[#00FF41] ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                  />
                )}
              </p>
            )}
          </div>

          {/* Pills - styled buttons */}
          {secondTypingComplete && (
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <button
                onClick={handleBluePill}
                className="group relative"
                aria-label="Take the blue pill"
              >
                <div className="w-48 h-16 bg-black border-2 border-[#00FF41] rounded-full shadow-lg shadow-[#00FF41]/30 flex items-center justify-center transform transition-all duration-300 hover:bg-[#00FF41]/10 hover:scale-105 hover:shadow-[#00FF41]/50">
                  <span className="text-[#00FF41] font-bold text-sm tracking-widest font-mono">
                    [ BLUE PILL ]
                  </span>
                </div>
              </button>

              <button
                onClick={handleRedPill}
                className="group relative"
                aria-label="Take the red pill"
              >
                <div className="w-48 h-16 bg-[#00FF41] border-2 border-[#00FF41] rounded-full shadow-lg shadow-[#00FF41]/50 flex items-center justify-center transform transition-all duration-300 hover:bg-[#00FF41]/90 hover:scale-105 hover:shadow-[#00FF41]/70">
                  <span className="text-black font-bold text-sm tracking-widest font-mono">
                    [ RED PILL ]
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
