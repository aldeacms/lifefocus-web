# Casos de Uso y Servicios de Life Focus Agency

Este documento define la matriz de servicios de la agencia, especificando cuándo y cómo aplicar la metodología Era 4 y el stack tecnológico (Astro, Tailwind, Directus, Cloudflare) según la necesidad del cliente.

---

## 1. Landing Page Estática (Pure HTML/Astro)
*   **Caso de Uso:** Campañas rápidas, lanzamiento de productos puntuales, o clientes con presupuesto inicial que no requieren modificar el contenido ellos mismos.
*   **El Framework:**
    *   Se utiliza el **Life Focus Builder** (Astro + Tailwind).
    *   Los textos y datos se alojan en archivos estáticos (Ej. markdown o JSON locales dentro del proyecto), tal como empezamos Pataka.
    *   **NO se conecta a Directus.**
    *   Se aloja gratuitamente en Cloudflare Pages.
*   **Ventaja Agencia:** Entrega ultrarrápida, mantenimiento cero. El cliente paga por cambios futuros si los necesita.

## 2. Landing Page CMS (Autoadministrable)
*   **Caso de Uso:** Profesionales independientes (como Pataka), clínicas pequeñas o negocios locales que desean cambiar sus textos, servicios u ofertas sin depender de la agencia, pero requieren máxima velocidad y diseño premium.
*   **El Framework:**
    *   **Frontend:** Life Focus Builder (Astro) alojado en Cloudflare Pages.
    *   **Backend:** Configurado para conectarse a colecciones específicas en el **VPS (Directus)**.
    *   **Gestión:** Se le crea un Usuario/Rol aislado al cliente en `admin.lifefocus.agency` con acceso exclusivo a sus formularios editables (Hero, Servicios, Contacto).
    *   **TúNEL:** Webhook desde Directus hacia Cloudflare Pages para recompilar el sitio automáticamente al guardar cambios.

## 3. Landing Page en GHL (GoHighLevel)
*   **Caso de Uso:** Funnels complejos de marketing de pago (Meta/Google Ads) donde el cliente ya utiliza el ecosistema GHL para automatizaciones de correo, calendarios estrictos y embudos de venta pesados.
*   **El Framework:**
    *   No utilizamos Astro para el despliegue final.
    *   Se diseña el HTML crudo, limpio y con Tailwind CSS compilado (Estándar Era 4).
    *   Se utiliza el **Skill "ghl-etch-landing"** para inyectar este HTML/CSS puro dentro del constructor visual de GoHighLevel, superando sus limitaciones de diseño y garantizando accesibilidad y tiempos de carga óptimos dentro de su propio sistema.

## 4. Sitio Web Corporativo Dinámico (Con Blog / Taxonomías)
*   **Caso de Uso:** Empresas establecidas, constructoras, ONGs o marcas personales fuertes que publican artículos frecuentemente y necesitan posicionamiento SEO agresivo a largo plazo mediante Marketing de Contenidos.
*   **El Framework:**
    *   **Frontend:** Life Focus Builder (Astro) generando pre-renderizado masivo de hojas dinámicas (SSG).
    *   **Backend:** Directus en el VPS, utilizando potentes relaciones de Muchos-a-Muchos (Colecciones: `Entradas`, `Categorías`, `Etiquetas`, `Autores`).
    *   **SEO:** Astro compila dinámicamente cada categoría como una ruta dedicada (ej. `/blog/categoria/arquitectura-moderna`). El RSS Feed y los sitemaps se generan en base a las respuestas de la API de Directus. Red Edge de Cloudflare garantiza 100/100 Core Web Vitals para todo el blog.

## 5. El SaaS Propio (Comunidades Cristianas / Plataformas Privadas)
*   **Caso de Uso:** Tu visión a escala. Plataformas donde los usuarios pagan una membresía, interactúan, consumen cursos y se almacenan bases de datos complejas.
*   **El Framework:**
    *   **Frontend Híbrido:** Astro configurado en modo **Serverless (On-Demand Rendering)**. Ya no se pre-compilan todas las páginas en HTML estático, porque la interfaz es personal para cada usuario que inicia sesión (Dashboard privado).
    *   **Backend Master:** Directus asume el rol vital. Maneja la Autenticación (JWT Tokens), perfiles de usuarios pagos, permisos restrictivos por nivel de suscripción y sirve las APIs de datos en tiempo real.
    *   **Infraestructura:** Cloudflare Workers (integrados en Pages) se encargan de ejecutar la interfaz web de forma dinámica en el borde, comunicándose constantemente con el VPS de ChemiCloud (Directus) para asegurar que el usuario tenga acceso activo a sus comunidades o cursos.

---

### Resumen de Decisión

| Tipo de Proyecto | ¿Usa Astro? | ¿Usa Directus? (Coste Operativo) | Hosting | Ideal Para |
| :--- | :--- | :--- | :--- | :--- |
| **Landing Estática** | SÍ (Local JSON/MD) | NO | Cloudflare Pages | Campañas rápidas, B2B estático. |
| **Landing Admin** | SÍ (Fetch APIs) | SÍ (Bajo consumo) | Cloudflare Pages | Dentistas, Agencias, Abogados. |
| **Funnel GHL** | HTML/CSS Puro | NO | GoHighLevel | Marketing de respuesta directa agresiva. |
| **Web + Blog** | SÍ (SSG Dinámico) | SÍ (Alto volumen de texto) | Cloudflare Pages | Empresas consolidadas, SEO a largo plazo. |
| **SaaS / Comunidad** | SÍ (Modo Serverless) | SÍ (Autenticación, BD pesada) | Cloudflare/Workers + VPS | Tus propios proyetos nivel "Startup". |
