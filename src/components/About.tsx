'use client';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function About() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 relative z-20">
      <div className="w-full max-w-5xl rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side*/}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl text-white mb-6 drop-shadow-lg font-bold font-sans">
            About us
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6">
            We build elegant, scalable, and robust digital solutions for
            ambitious businesses like yours.
          </p>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white mb-2 font-sans">
              What sets us apart?
            </h2>
            <p className="text-blue-100">
              Commitment and quality. If you have an idea, we code it. We want
              to be your trusted team for tech projects, big or small.
            </p>
          </div>
        </div>
        {/* Right Side*/}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white/2 border-l border-black/2">
          <div>
            <h2 className="text-2xl md:text-3xl text-white mb-6 font-bold font-sans">
              Our services
            </h2>
            <ul className="text-blue-100 space-y-2 mb-8">
              <li>• Professional websites and online stores</li>
              <li>• Mobile and desktop apps</li>
              <li>• UI/UX design</li>
              <li>
                • Artificial Intelligence integration, virtual assistants,
                chatbots
              </li>
              <li>• Enterprise systems (CRM, CMS, ERP, process automation)</li>
              <li>• Payment gateway integration and e-commerce solutions</li>
              <li>• Custom software development</li>
            </ul>
          </div>
          <div></div>
          <div className="flex justify-center">
            <PrimaryButton
              onClick={() => {
                const contact = document.getElementById('contact');
                if (contact) contact.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {"Let's build your business together"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
