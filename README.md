# Planecitos 🪁

**Actividades listas para compartir con niños de 2 a 5 años, sin pasar horas buscando ideas.**

> ¿Tienes 15 minutos? Tenemos un planecito.

Planecitos es una plataforma web en español pensada para madres, padres y cuidadores que quieren compartir tiempo de calidad con sus hijos. En lugar de mostrar una lista interminable de ideas, permite indicar la **edad**, el **tiempo disponible** y el **tipo de actividad** para encontrar una propuesta concreta, con materiales y pasos claros.

🌐 **Sitio web:** https://planecitos.netlify.app/  
🛠️ **Estado:** proyecto en desarrollo y evolución continua  
👩‍💻 **Diseño y desarrollo:** Anyely Huelgos

---

## El problema y la solución

Entre el trabajo, la casa y las responsabilidades diarias, muchas familias tienen poco tiempo para preparar actividades. Buscar ideas en internet también puede implicar comparar materiales, edades y tiempos de preparación.

**Planecitos reduce esa fricción:** el usuario responde unas preguntas y recibe una actividad adaptada a su contexto. El objetivo no es añadir más tiempo de pantalla, sino facilitar experiencias que continúen fuera de ella.

## Funcionalidades

- **Selector de planecitos:** recomendaciones por edad, duración, categoría y materiales disponibles.
- **Actividades de 2 a 5 años:** propuestas con instrucciones, preparación y materiales.
- **Planecito SOS:** acceso rápido a una idea sencilla para momentos en los que no se sabe qué hacer.
- **Biblioteca de actividades:** exploración de propuestas gratuitas y premium.
- **Cuentitos mágicos:** historias cortas con personajes y una actividad posterior.
- **Pequeños artistas:** imprimibles en PDF, como dibujos, laberintos y recortables.
- **Cuentas de usuario:** registro e inicio de sesión mediante código enviado por correo.
- **Perfiles y favoritos:** preferencias guardadas en Supabase.
- **Acceso premium:** interfaz de contenidos restringidos y salida al checkout de Hotmart.
- **Medición de eventos:** integración del píxel de Meta en la web.

La comunicación del producto presenta **140 planecitos, cuentos e imprimibles**. La cantidad publicada puede cambiar conforme evolucione el catálogo.

## Tecnologías

| Capa | Tecnología | Función |
| --- | --- | --- |
| Interfaz | React 19 + TypeScript | Componentes y lógica de interacción |
| Aplicación web | TanStack Start + TanStack Router | Rutas, renderizado y navegación |
| Estilos | Tailwind CSS 4 | Sistema visual y diseño adaptable |
| Componentes | Radix UI + Lucide | Elementos accesibles e iconografía |
| Datos y autenticación | Supabase | PostgreSQL, consultas y acceso por correo |
| Estado y consultas | TanStack Query + servicios propios | Gestión de datos y sesión |
| Pagos | Hotmart | Checkout externo del producto |
| Analítica | Meta Pixel | Visitas y eventos relevantes del recorrido |
| Desarrollo | Lovable + GitHub | Iteración, código y control de versiones |
| Despliegue | Netlify | Publicación de la aplicación |

## Arquitectura general

```text
Visitante / familia
        |
        v
Frontend React + TanStack Start
        |
        +---- Selector y biblioteca ----> Supabase (catálogo de actividades)
        |
        +---- Cuenta y favoritos -------> Supabase Auth + tablas de usuario
        |
        +---- Cuentos e imprimibles ----> Servicios de contenido y archivos
        |
        +---- Desbloquear acceso -------> Checkout de Hotmart
        |
        +---- Interacciones -----------> Meta Pixel
        |
        v
      Netlify
```

### Cómo funciona la recomendación

El selector recibe filtros como edad (2, 3, 4 o 5 años), duración (5, 15, 30, 45 o 60 minutos), categoría y materiales.

El servicio `src/services/activities.ts` busca primero coincidencias exactas. Si no las encuentra, flexibiliza progresivamente algunos criterios y prioriza las actividades cuya duración es más cercana a la elegida. Esta decisión evita que el usuario se quede sin una propuesta por haber aplicado demasiados filtros.

### Cómo se organiza la información

La aplicación utiliza Supabase para consultar el catálogo y gestionar los datos de las cuentas. Entre las entidades consultadas desde el código se encuentran:

- `activities`: actividades, edades, duración, materiales, preparación y pasos.
- `profiles`: información de cuenta y estado de acceso premium.
- `children`: perfil infantil asociado a una cuenta.
- `favorites`: actividades guardadas por el usuario.

La función de base de datos `get_catalog()` entrega información resumida para las tarjetas del catálogo. Los detalles de las actividades se consultan por separado. El acceso a contenido premium depende de la configuración de permisos y políticas de la base de datos, que debe comprobarse también en Supabase.

### Registro e inicio de sesión

El flujo usa **Supabase Auth con códigos de un solo uso enviados por correo (OTP)**, sin exigir una contraseña tradicional. Tras verificar el código, la aplicación recupera el perfil, la información del niño y los favoritos.

### Hotmart y acceso premium

El botón de compra dirige al checkout externo de Hotmart. La interfaz reconoce el campo `is_premium` del perfil para mostrar u ocultar contenidos restringidos.

**Importante:** la presencia del checkout y del estado premium en el código no demuestra por sí sola que una compra active automáticamente el acceso. Antes de presentar ese flujo como completamente automatizado, se debe verificar la integración de confirmación de pagos y realizar una compra de prueba de principio a fin.

### Analítica y publicidad

El sitio inicializa el **Meta Pixel**, registra `PageView` y envía eventos estándar o personalizados para interacciones como ver una actividad, completar un registro, usar el selector o hacer clic hacia el checkout.

El código distingue los eventos que ocurren dentro de Planecitos de los eventos de compra que se espera recibir desde Hotmart. La recepción correcta de `Purchase` y la atribución deben validarse en el Administrador de eventos de Meta; no se asumen como verificadas únicamente por la configuración del frontend.

## Diseño y experiencia de usuario

El producto se diseñó con enfoque **mobile-first**, porque gran parte de las consultas se realizan desde el teléfono y en momentos de poco tiempo disponible.

**Decisiones principales:**

1. **Una acción clara desde el inicio:** seleccionar la edad, en lugar de navegar primero por un catálogo extenso.
2. **Pocos pasos para recomendar:** reducir la carga de decisión.
3. **Personajes y colores por edad:** ayudar a identificar contenidos y construir una marca reconocible.
4. **Instrucciones concretas:** materiales, preparación y pasos para pasar rápidamente de la pantalla a la actividad.
5. **Demostración antes de comprar:** permitir probar el selector sin registrarse.
6. **Contenido gratuito y premium:** facilitar la exploración del producto antes del pago.

### Sistema visual

| Elemento | Valor |
| --- | --- |
| Tinta / texto principal | `#16161D` |
| Fondo | `#FFFFFF` |
| Superficie secundaria | `#F4F4F6` |
| Edad 2 | Amarillo `#FFDB7A` |
| Edad 3 | Durazno `#FFAE94` |
| Edad 4 | Menta `#8FDDB8` |
| Edad 5 | Azul `#9DBEFF` |
| Títulos | Bricolage Grotesque |
| Interfaz y párrafos | Figtree |

Los colores por edad no sustituyen las etiquetas de texto: las tarjetas también muestran la edad, duración y categoría.

## Estructura del código

```text
src/
├── components/       # Tarjetas, selector, navegación y elementos reutilizables
├── config/           # Configuración de checkout, píxel y etiquetas
├── hooks/            # Hooks de sesión y estado
├── layouts/          # Estructuras compartidas de las páginas
├── lib/              # Cliente Supabase y utilidades
├── pages/            # Pantallas de la aplicación
├── routes/           # Rutas de TanStack Router
├── services/         # Catálogo, actividades, autenticación y analítica
├── types/            # Modelos de datos TypeScript
└── styles.css        # Tokens y estilos globales

netlify.toml           # Configuración de compilación y despliegue
vite.config.ts         # Configuración de Vite y TanStack Start
package.json           # Dependencias y scripts
```

## Ejecutar el proyecto localmente

**Requisitos:** Node.js y npm instalados.

```bash
git clone https://github.com/AnyelyHuelgos/planecitos.git
cd planecitos
npm install
npm run dev
```

Abre la dirección local que indique la terminal.

**Nota:** para que las funciones dependientes de Supabase y los pagos funcionen correctamente, necesitas acceso y configuración de los servicios correspondientes. No publiques claves privadas ni tokens secretos en el repositorio.

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Compilación de producción
npm run preview   # Vista previa de la compilación
npm run lint      # Revisión estática
npm run test      # Pruebas con Vitest
npm run format    # Formato con Prettier
```

El despliegue de Netlify está configurado para compilar con `bun run build` y el preset `netlify` de Nitro.

## Retos técnicos y decisiones

| Reto | Decisión |
| --- | --- |
| Evitar búsquedas interminables | Selector con filtros y estrategia gradual de coincidencias |
| Mostrar el catálogo sin exponer instrucciones premium | Separar tarjetas resumidas y consultas de detalle |
| Mantener la sesión entre visitas | Supabase Auth con persistencia de sesión |
| Guardar favoritos sin esperar cada respuesta | Actualización optimista con reversión ante errores |
| Evitar imágenes únicas para cada actividad | Ilustraciones reutilizables por categoría y edad |
| Medir navegación sin recargas completas | Registrar cambios de ruta en Meta Pixel |
| Diferenciar contenidos gratuitos y pagos | Estado premium y componentes de bloqueo |

## Seguridad y privacidad

- El frontend utiliza la **clave pública/publishable** de Supabase; nunca debe contener una clave `service_role` o secreta.
- Las reglas **Row Level Security (RLS)** y los permisos de las funciones SQL son esenciales para impedir accesos no autorizados.
- La analítica de actividades evita enviar nombres o información personal de los niños.
- Los datos de perfil y favoritos se almacenan en Supabase; el estado temporal de la interfaz se mantiene en memoria.

Estas son decisiones observables en el código. **No equivalen a una auditoría de seguridad completa** ni certifican por sí mismas que todas las políticas RLS estén correctamente desplegadas.

## Próximas mejoras y validaciones

- [ ] Verificar de extremo a extremo la confirmación de pago y activación automática del acceso premium.
- [ ] Comprobar las políticas RLS y los permisos de lectura de contenido restringido.
- [ ] Validar eventos `InitiateCheckout` y `Purchase` en Meta Events Manager.
- [ ] Ampliar las pruebas automatizadas de los recorridos principales.
- [ ] Medir rendimiento y accesibilidad con herramientas de auditoría.
- [ ] Seguir ampliando y revisando el contenido para edades de 2 a 5 años.

## Sobre el proyecto

Planecitos es un proyecto de producto digital desarrollado para resolver una necesidad cotidiana de las familias y, al mismo tiempo, documentar un proceso completo de diseño, desarrollo web, integración de servicios y comercialización digital.

El repositorio sirve como muestra técnica del trabajo realizado. La disponibilidad de contenidos y funcionalidades puede cambiar a medida que evoluciona la plataforma.

**Sitio:** https://planecitos.netlify.app/  
**Autora:** Anyely Huelgos

---

*Hecho con intención: menos tiempo buscando, más tiempo compartiendo.*
