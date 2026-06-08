import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Política de Privacidad</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-zinc-600 dark:text-zinc-400">
        <p className="lead text-lg text-zinc-800 dark:text-zinc-200">
          En Irina Ichim Studio, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. 
          Esta política explica cómo recopilamos, usamos y protegemos tu información bajo el Reglamento General de 
          Protección de Datos (RGPD) de la UE.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">1. Responsable del Tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos recopilados en este sitio web es **Irina Ichim Studio**, 
            con domicilio a efectos de notificaciones en España. Puedes contactar con nosotros a través de nuestro 
            correo electrónico de contacto.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">2. Datos que Recopilamos</h2>
          <p>
            Únicamente recopilamos información de contacto cuando te comunicas directamente con nosotros a través de 
            los canales provistos. Estos datos pueden incluir tu nombre, dirección de correo electrónico y cualquier 
            otro detalle que decidas proporcionarnos. No recopilamos datos sensibles ni realizamos perfiles automatizados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">3. Finalidad del Tratamiento</h2>
          <p>
            Tratamos tus datos personales con la única finalidad de responder a tus consultas, proporcionar los 
            servicios solicitados y gestionar la relación profesional. No compartiremos tus datos con terceros, 
            excepto cuando sea legalmente obligatorio o necesario para prestar el servicio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">4. Derechos del Usuario</h2>
          <p>
            De acuerdo con el RGPD, tienes derecho a acceder, rectificar, suprimir o limitar el tratamiento de tus 
            datos, así como a oponerte al mismo y a solicitar la portabilidad de tus datos. Para ejercer estos 
            derechos, puedes enviarnos un correo electrónico indicando tu solicitud.
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
