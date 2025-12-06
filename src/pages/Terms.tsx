import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

const Terms = () => {
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
          Términos y Condiciones
        </h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: 1 de diciembre de 2024
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Aceptación de términos</h2>
            <p>
              Al acceder y utilizar Clovely, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Descripción del servicio</h2>
            <p>
              Clovely proporciona herramientas de desarrollo profesional incluyendo diagnóstico de carrera, creación de CV, simulación de entrevistas y acceso a oportunidades laborales. Nos reservamos el derecho de modificar o discontinuar cualquier aspecto del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Cuentas de usuario</h2>
            <p>
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Uso aceptable</h2>
            <p>
              Te comprometes a utilizar Clovely solo para fines legales y de acuerdo con estos términos. No debes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información falsa o engañosa</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
              <li>Interferir con el funcionamiento normal de la plataforma</li>
              <li>Utilizar el servicio para actividades ilegales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Propiedad intelectual</h2>
            <p>
              Todo el contenido de Clovely, incluyendo textos, gráficos, logos y software, es propiedad de Clovely o sus licenciantes y está protegido por leyes de propiedad intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Limitación de responsabilidad</h2>
            <p>
              Clovely no garantiza resultados específicos del uso de sus servicios. No somos responsables de las decisiones de empleo o contratación que resulten del uso de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contacto</h2>
            <p>
              Para preguntas sobre estos términos, contáctanos en legal@clovely.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
