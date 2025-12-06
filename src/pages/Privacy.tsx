import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-8">
          Política de Privacidad
        </h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: 1 de diciembre de 2024
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Información que recopilamos</h2>
            <p>
              Recopilamos información que nos proporcionas directamente, incluyendo tu nombre, correo electrónico, información de perfil profesional, y datos de tu CV cuando utilizas nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Cómo usamos tu información</h2>
            <p>
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Personalizar tu experiencia en la plataforma</li>
              <li>Generar recomendaciones de carrera y oportunidades</li>
              <li>Comunicarnos contigo sobre actualizaciones y novedades</li>
              <li>Analizar el uso de la plataforma para mejoras continuas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Protección de datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra acceso no autorizado, pérdida o alteración. Utilizamos encriptación SSL y almacenamiento seguro en la nube.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Compartir información</h2>
            <p>
              No vendemos ni compartimos tu información personal con terceros para fines de marketing. Solo compartimos datos cuando es necesario para proporcionar nuestros servicios o cuando lo exige la ley.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Tus derechos</h2>
            <p>
              Tienes derecho a acceder, corregir o eliminar tu información personal. Puedes ejercer estos derechos contactándonos en privacidad@clovely.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad, contáctanos en privacidad@clovely.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
