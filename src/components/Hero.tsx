'use client';

import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full px-4">
      <div className="relative top-1/2 -translate-y-1/2 text-white space-y-16 text-center pointer-events-none z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-sans">
          Lateral Thinking
        </h1>
        <div className="text-sm md:text-xl lg:text-xl font-sans space-y-4">
          <p>
            We build custom software. For companies that care about quality,
            security, and scalability.
          </p>
          <p>Websites | Apps | UI/UX design | AI integration</p>
        </div>
      </div>
      <div className="relative mt-[44vh] flex items-center justify-center gap-8 md:gap-16 lg:gap-24 z-10 pointer-events-auto">
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
          See our work
        </SecondaryButton>
      </div>
    </section>
  );
}
