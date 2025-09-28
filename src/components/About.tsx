'use client';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function About() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 relative z-20">
      <div className="w-full max-w-5xl rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side*/}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-br from-blue-900/80 to-blue-800/70">
          <h1 className="text-4xl md:text-5xl text-white mb-6 drop-shadow-lg font-bold font-sans">
            Sobre nosotros
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6">
            Creamos soluciones digitales elegantes, escalables y robustas para
            negocios ambiciosos como el tuyo.
          </p>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white mb-2 font-sans">
              ¿Qué nos diferencia?
            </h2>
            <p className="text-blue-100">
              Compromiso y calidad. Si tienes una idea, nosotros la programamos.
              Queremos ser tu equipo de confianza para proyectos tecnológicos,
              grandes o pequeños.
            </p>
          </div>
        </div>
        {/* Right Side*/}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white/2 border-l border-black/2">
          <div>
            <h2 className="text-2xl md:text-3xl text-white mb-6 font-bold font-sans">
              Nuestros servicios
            </h2>
            <ul className="text-blue-100 space-y-2 mb-8">
              <li>• Páginas web profesionales y tiendas virtuales</li>
              <li>• Aplicaciones móviles y de escritorio</li>
              <li>• Diseño UI/UX</li>
              <li>
                • Integración de Inteligencia Artificial, asistentes virtuales,
                chatbots
              </li>
              <li>
                • Sistemas empresariales (CRM, CMS, ERP, POS, automatización de
                procesos)
              </li>
              <li>
                • Integración de pasarelas de pago y soluciones de comercio
                electrónico
              </li>
              <li>• Desarrollo de software personalizado</li>
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
              Construyamos tu negocio juntos
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
