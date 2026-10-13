import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { LEGAL } from "@/config/legal";

function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-[68ch] px-5 py-14 md:py-20">
        <h1 className="text-[36px] md:text-[48px]">{title}</h1>
        <p className="mt-3 text-ink/70">Última actualización: {LEGAL.actualizado}</p>
        <div className="mt-10 space-y-8 text-lg leading-relaxed [&_h2]:text-[24px] [&_h2]:mb-3 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2 [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
        <p className="mt-14"><Link to="/" className="font-bold underline underline-offset-4">Volver a Planecitos</Link></p>
      </main>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout title="Política de privacidad">
      <section>
        <p>
          En Planecitos cuidamos tus datos y los de tu familia. Esta política explica qué datos recogemos, para qué los usamos y
          cómo puedes ejercer tus derechos, según la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.
        </p>
      </section>
      <section>
        <h2>Quién es responsable de tus datos</h2>
        <p>{LEGAL.responsable}, con domicilio en {LEGAL.ciudad}. Puedes escribirnos a <a href={`mailto:${LEGAL.correo}`}>{LEGAL.correo}</a>.</p>
      </section>
      <section>
        <h2>Qué datos recogemos</h2>
        <ul>
          <li>Tu nombre, correo y contraseña, para crear y proteger tu cuenta. La contraseña se guarda cifrada.</li>
          <li>El apodo y la edad de tu hijo, solo para recomendarte planecitos adecuados. El apodo es opcional y no pedimos su nombre completo, foto ni otros datos.</li>
          <li>Los planecitos que guardas y los que abres, para mejorar las recomendaciones.</li>
          <li>Los datos de tu compra que nos envía Hotmart (correo, nombre y número de transacción), para activar tu acceso. No recibimos ni guardamos los datos de tu tarjeta.</li>
        </ul>
      </section>
      <section>
        <h2>Para qué los usamos</h2>
        <ul>
          <li>Darte acceso a tu cuenta y a los planecitos que compraste.</li>
          <li>Recomendarte actividades según la edad de tu hijo y el tiempo que tienes.</li>
          <li>Enviarte correos sobre tu cuenta, como la recuperación de contraseña.</li>
          <li>Entender cómo se usa Planecitos para mejorarlo, con datos agregados.</li>
        </ul>
        <p className="mt-3">No vendemos ni compartimos tus datos con terceros para publicidad.</p>
      </section>
      <section>
        <h2>Con quién se comparten</h2>
        <p>
          Usamos proveedores que guardan o procesan datos por nosotros: Supabase (base de datos y cuentas), Netlify (alojamiento de la web)
          y Hotmart (pagos). Si usamos herramientas de medición de anuncios, como el píxel de Meta, lo indicaremos en esta página.
        </p>
      </section>
      <section>
        <h2>Datos de niños</h2>
        <p>
          Planecitos está hecho para adultos. Solo guardamos el apodo opcional y la edad del niño que tú registras, con tu autorización
          como padre, madre o cuidador, y únicamente para recomendarte actividades.
        </p>
      </section>
      <section>
        <h2>Tus derechos</h2>
        <p>
          Puedes conocer, actualizar, rectificar o pedir que eliminemos tus datos, y revocar esta autorización, escribiendo a{" "}
          <a href={`mailto:${LEGAL.correo}`}>{LEGAL.correo}</a>. Respondemos en máximo 15 días hábiles. También puedes acudir a la
          Superintendencia de Industria y Comercio.
        </p>
      </section>
      <section>
        <h2>Cuánto tiempo los guardamos</h2>
        <p>Mientras tengas tu cuenta activa. Si pides eliminarla, borramos tus datos, salvo los que la ley nos obligue a conservar.</p>
      </section>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Términos y condiciones">
      <section>
        <h2>Qué es Planecitos</h2>
        <p>Planecitos es una web que recomienda actividades para hacer con niños de 2 a 5 años en casa. Al crear una cuenta o comprar el acceso, aceptas estos términos.</p>
      </section>
      <section>
        <h2>Tu cuenta</h2>
        <ul>
          <li>Debes ser mayor de edad para crear una cuenta.</li>
          <li>Eres responsable de mantener tu contraseña en secreto.</li>
          <li>El acceso es personal y para uso de tu familia.</li>
        </ul>
      </section>
      <section>
        <h2>Compra y acceso</h2>
        <ul>
          <li>El acceso completo se compra con un pago único a través de Hotmart, que procesa el pago.</li>
          <li>Para activarlo, crea tu cuenta con el mismo correo que usaste al comprar.</li>
          <li>Tienes 7 días desde la compra para pedir el reembolso desde Hotmart. Si se reembolsa, el acceso completo se desactiva.</li>
        </ul>
      </section>
      <section>
        <h2>Seguridad de las actividades</h2>
        <p>
          Las actividades requieren el acompañamiento y el criterio de un adulto. Tú decides si una actividad es adecuada para tu hijo y
          su entorno. Usa materiales seguros, evita objetos pequeños con menores de 3 años y supervisa siempre las actividades con agua.
          Planecitos no reemplaza la orientación de profesionales de salud o educación.
        </p>
      </section>
      <section>
        <h2>Contenido</h2>
        <p>Las actividades, textos, ilustraciones y personajes de Planecitos son de su autoría. No está permitido copiarlos o venderlos sin autorización.</p>
      </section>
      <section>
        <h2>Cambios</h2>
        <p>Podemos actualizar estos términos. Si el cambio es importante, te avisaremos por correo o en la web.</p>
      </section>
      <section>
        <h2>Contacto</h2>
        <p>Escríbenos a <a href={`mailto:${LEGAL.correo}`}>{LEGAL.correo}</a>.</p>
      </section>
    </LegalLayout>
  );
}
