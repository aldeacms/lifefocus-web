# Life Focus Builder: Visión y Plan de Acción

Este documento define la base arquitectónica y filosófica para la agencia Life Focus, marcando la transición hacia un modelo escalable, extremadamente rentable y técnicamente superior.

## 1. La Filosofía: Era 4 & Web Standards

La **Era 4** del desarrollo web no trata de abandonar los frameworks modernos (como Tailwind), sino de **disciplinarlos**. El objetivo es crear sitios que los motores de búsqueda (Google) entiendan perfectamente, que sean accesibles (WCAG) y que los desarrolladores puedan mantener sin volverse locos.

### Principios Básicos:
*   **HTML Semántico y Limpio:** El documento es el rey. Usamos etiquetas reales (`<article>`, `<section>`, `<nav>`, `<aside>`) en lugar de infinitos `<div>`. Jerarquía de encabezados estricta (un solo `<h1>`, sin saltos `<h2>` a `<h4>`).
*   **Adiós a la Sopa de Clases (Class Soup):** Aunque usamos Tailwind CSS, no permitimos componentes con 30 clases en línea que ensucian el DOM. Usamos Tailwind para crear utilidades estructuradas, pero consolidamos estilos repetitivos en clases BEM (`.c-card`, `.c-button`) o funciones como `@apply` en CSS, manteniendo el HTML inmaculado.
*   **Sistema de Tokens y Variables:** Todo color, espaciado y tipografía debe provenir de variables CSS globales (Tokens). No se permiten valores mágicos (ej. `text-[#123456]`) en producción; todo debe apuntar al sistema de diseño de la marca.
*   **Responsividad Moderna (Fluid Typography & Container Queries):** Los diseños no se rompen por el tamaño de la pantalla (breakpoints rígidos), sino que fluyen basados en el tamaño de su contenedor (Container Queries) y cálculos tipográficos fluidos (`clamp()`).
*   **SEO Técnico Impecable:** Orden del `<head>` estricto (meta charset -> title -> description -> preloads -> estilos), optimización extrema de Core Web Vitals, y JSON-LD Schema estructurado siempre presente.

---

## 2. El Stack Tecnológico "Jamstack Multi-Tenant"

Esta arquitectura domina la rentabilidad de las agencias modernas: separa la "Cabeza" (El sitio) del "Cuerpo" (La base de datos), usando los mejores servidores gratuitos del mundo para entregar el contenido.

*   **Frontend (La Cara): Astro + Tailwind CSS**
    *   **Astro:** Sirve HTML estático puro (Cero JavaScript por defecto). Velocidad de 100/100 en PageSpeed. Soporta Modo Híbrido (Serverless) para escalar si se requieren miles de páginas a futuro.
    *   **Tailwind:** Adaptado bajo las normas Era 4 para diseñar rápido y estructurado.
*   **Backend & CMS (El Cerebro): Directus + MySQL**
    *   **Directus:** Headless CMS relacional alojado en un VPS propio. Capacidad brutal para roles y aislamientos de clientes. Sirve como administrador (`admin.lifefocus.agency`) y como Base de Datos/Mini CRM para todos los clientes a la vez.
*   **Alojamiento (El Músculo Glogal): Cloudflare Pages**
    *   Absorbe todo el tráfico web del mundo de forma **gratuita**. Compila el sitio obteniendo los textos directamente desde la API de Directus. Red Edge ultrarrápida (CDN).

---

## 3. Plan de Acción (Para el Nuevo Workspace)

Este plan detalla cómo inicializaremos el nuevo framework en el próximo entorno de trabajo limpio.

### Fase 1: Creación del Base Builder (Semana 1)
1.  **Inicializar Astro:** Instalar el núcleo de Astro optimizado con Tailwind.
2.  **Integrar Sistema de Diseño Era 4:** Importar y configurar los tokens globales (`lifefocus-tokens.css`, animaciones, colores) que creaste previamente.
3.  **Configurar cliente HTTP:** Instalar el SDK de Directus (`@directus/sdk`) para preparar Astro para conectarse al CMS.
4.  **Desarrollar Componentes Core:** Construir los bloques base según la Era 4 (Header, Hero, Texto/Imagen, Galería, Testimonios, Formularios, Footer). Todos los componentes deben estar preparados para recibir "Props" (datos inyectados desde Directus).
5.  **Plantillas Dinámicas:** Configurar el sistema de enrutamiento dinámico (ej. `/blog/[slug]` o `/servicios/[slug]`) utilizando `getStaticPaths()` para pre-renderizar todo el contenido de SEO en masa.

### Fase 2: Configuración del VPS e Infraestructura (En paralelo)
1.  Levantar el VPS (ChemiCloud).
2.  Instalar y asegurar Directus (SSL, dominio central).
3.  Definir la arquitectura de base de datos multi-cliente (roles, prefijos y permisos). *Ver la Guía de Instalación adjunta.*

### Fase 3: La Prueba de Fuego (Migración de Pataka)
1.  Conectar el nuevo Builder al proyecto Directus en el VPS.
2.  Crear los modelos de datos en Directus (Colecciones: `pataka_hero`, `pataka_servicios`, `pataka_testimonios`).
3.  Pegar la información de Ana en el administrador de Directus.
4.  Generar el Build de Astro, conectar GitHub a Cloudflare Pages y verificar que todo compile y logre el 100/100 en velocidad.

### Fase 4: Creación de Módulos Premium (Agencia)
1.  Desarrollar la conexión de formularios Astro hacia Directus (Colección `pataka_leads`).
2.  Probar integraciones posteriores en Directus (Webhooks para Chatbots IA, envíos de correo automático).
