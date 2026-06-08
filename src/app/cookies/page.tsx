import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Política de Cookies</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-zinc-600 dark:text-zinc-400">
        <p className="lead text-lg text-zinc-800 dark:text-zinc-200">
          En Irina Ichim Studio, respetamos tus preferencias de privacidad. Esta política detalla cómo 
          utilizamos las cookies y tecnologías similares en nuestro sitio web.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">1. ¿Qué son las Cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para 
            recordar información sobre tu visita, mejorar tu experiencia y habilitar ciertas funcionalidades.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">2. Cookies que Utilizamos</h2>
          <p>
            Este sitio web está diseñado con un enfoque minimalista y de máxima privacidad. Únicamente utilizamos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cookies Técnicas / Esenciales:</strong> Necesarias para el funcionamiento del sitio, como 
              almacenar tu preferencia de tema visual (claro u oscuro) en `localStorage`. Estas cookies no 
              recopilan información personal ni se utilizan para rastreo.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">3. Control de Cookies</h2>
          <p>
            Dado que no utilizamos cookies de publicidad o análisis de terceros, no requerimos un banner de consentimiento 
            invasivo. Puedes controlar o deshabilitar las cookies a través de la configuración de tu propio navegador. 
            Ten en cuenta que deshabilitar cookies técnicas puede impedir que el sitio recuerde tu preferencia de tema.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="text-sm font-semibold hover:underline">
          &larr; Volver al inicio
        </Link>
      </div>
    </div>
  );
}
