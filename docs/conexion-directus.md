# Conexión Directus — Arquitectura Multi-Tenant

> **Última actualización:** Marzo 2026  
> **Estado:** Planificación aprobada / En desarrollo  
> **CMS:** `https://admin.lifefocus.agency`  
> **SDK instalado:** `@directus/sdk ^21.x`

---

## 1. Visión General

Cada sitio web (`pataka-web`, `luam-web`, y futuros) consume contenidos desde **un único Directus** actuando como CMS headless centralizado. Cada cliente tiene sus propias colecciones prefijadas, su propio usuario de Directus y un token de acceso que aisla completamente sus datos.

Daniel como **super admin** tiene acceso total y puede operar en nombre de cualquier cliente a través de un selector de proyecto.

---

## 2. Arquitectura Multi-Tenant

### Principio base: aislamiento por usuario + prefijo de colección

```
Directus (admin.lifefocus.agency)
├── Usuario: pataka@lifefocus.agency   → Token A
│   └── Colecciones: pataka_paginas, pataka_servicios, pataka_testimonios, pataka_blog...
├── Usuario: luam@lifefocus.agency     → Token B
│   └── Colecciones: luam_paginas, luam_servicios, luam_blog...
└── Super Admin (Daniel)              → Token maestro (solo en panel Directus)
```

**Por qué NO usar colecciones compartidas:** El riesgo de filtrar datos entre clientes es alto si se comete un error de permisos. Colecciones separadas + tokens separados es la solución más robusta, simple y auditable.

---

## 3. Configuración en Directus (Paso a Paso)

### 3.1 Por cada nuevo cliente: crear usuario y rol

1. En Directus → **Roles & Permissions** → crear rol `cliente_<nombre>` (ej: `cliente_pataka`).
2. El rol solo tiene **Read** sobre sus propias colecciones (ej: `pataka_*`). Nada más.
3. Crear usuario: `pataka@lifefocus.agency`, asignar el rol.
4. Generar **Static Token** (Settings → Users → Static Token). Este token va al `.env` del sitio Astro.

### 3.2 Convención de nombres de colecciones

```
<slug_cliente>_<nombre_coleccion>
Ejemplos:
  pataka_paginas
  pataka_servicios
  pataka_testimonios
  pataka_configuracion   ← datos globales del sitio (nombre, logo, colores, redes)
  luam_paginas
  luam_blog_posts
```

### 3.3 Colección base recomendada para todos los clientes

| Colección | Campos clave |
|-----------|-------------|
| `<slug>_configuracion` | logo, nombre_sitio, color_primario, redes_sociales (JSON), favicon |
| `<slug>_paginas` | slug, titulo, meta_descripcion, contenido (WYSIWYG o bloques), estado |
| `<slug>_servicios` | nombre, descripcion, icono, precio, orden |
| `<slug>_blog_posts` | titulo, slug, contenido, imagen_destacada, categorias, fecha, estado |
| `<slug>_testimonios` | nombre_cliente, cargo, texto, foto, rating, orden |
| `<slug>_leads` | nombre, email, telefono, mensaje, fuente, fecha, estado_crm |

---

## 4. Integración en los Sitios Astro

### 4.1 Variables de entorno por proyecto

Cada sitio tiene su propio `.env` en la raíz:

```env
# .env (NO commitear a git — ya está en .gitignore)
PUBLIC_DIRECTUS_URL=https://admin.lifefocus.agency
DIRECTUS_TOKEN=el_token_estatico_del_cliente
DIRECTUS_CLIENT_SLUG=pataka
```

> ⚠️ `PUBLIC_` hace la variable accesible en el cliente (browser). El token **NO debe tener el prefijo `PUBLIC_`** — solo se usa en build time o en endpoints server-side de Astro.

### 4.2 Archivo `src/lib/directus.js` — versión actualizada

```js
// src/lib/directus.js
import { createDirectus, rest, staticToken, readItems, readItem } from '@directus/sdk';

const DIRECTUS_URL = import.meta.env.PUBLIC_DIRECTUS_URL || 'https://admin.lifefocus.agency';
const TOKEN = import.meta.env.DIRECTUS_TOKEN;
export const CLIENT_SLUG = import.meta.env.DIRECTUS_CLIENT_SLUG || '';

// Cliente autenticado con static token (solo server-side / build time)
const directus = createDirectus(DIRECTUS_URL)
  .with(staticToken(TOKEN))
  .with(rest());

/**
 * Fetch de colección prefijada por cliente.
 * Uso: getItems('servicios', { sort: ['orden'] })
 * Se convierte en: pataka_servicios
 */
export const getItems = async (coleccion, query = {}) => {
  const nombreCompleto = `${CLIENT_SLUG}_${coleccion}`;
  try {
    return await directus.request(readItems(nombreCompleto, query));
  } catch (err) {
    console.error(`[Directus] Error en ${nombreCompleto}:`, err.message);
    return [];
  }
};

export const getItem = async (coleccion, id, query = {}) => {
  const nombreCompleto = `${CLIENT_SLUG}_${coleccion}`;
  try {
    return await directus.request(readItem(nombreCompleto, id, query));
  } catch (err) {
    console.error(`[Directus] Error en ${nombreCompleto}/${id}:`, err.message);
    return null;
  }
};

/**
 * Helper para URLs de assets de Directus (imágenes, archivos).
 * Uso: assetUrl('uuid-de-imagen')
 */
export const assetUrl = (id, params = '') =>
  id ? `${DIRECTUS_URL}/assets/${id}${params}` : '';

export default directus;
```

### 4.3 Uso en componentes Astro

```astro
---
// src/pages/index.astro
import { getItems, assetUrl } from '../lib/directus.js';

const servicios = await getItems('servicios', { 
  filter: { estado: { _eq: 'published' } },
  sort: ['orden']
});
const config = await getItems('configuracion');
const siteConfig = config[0] ?? {};
---

<h1>{siteConfig.nombre_sitio}</h1>
{servicios.map(s => (
  <article>
    <img src={assetUrl(s.icono)} alt={s.nombre} />
    <h2>{s.nombre}</h2>
    <p>{s.descripcion}</p>
  </article>
))}
```

### 4.4 Variables de entorno en Cloudflare Pages

En cada proyecto de Cloudflare Pages (Settings → Environment Variables):

| Variable | Valor |
|----------|-------|
| `PUBLIC_DIRECTUS_URL` | `https://admin.lifefocus.agency` |
| `DIRECTUS_TOKEN` | Token estático del cliente |
| `DIRECTUS_CLIENT_SLUG` | `pataka` o `luam` etc. |

---

## 5. Panel Super Admin (Daniel)

Para gestionar todos los clientes desde Directus:

- Ingresar directamente a `https://admin.lifefocus.agency` con la cuenta super admin.
- Usar el buscador de colecciones para navegar entre `pataka_*`, `luam_*`, etc.
- **Selector de proyecto (futuro):** Se puede construir un pequeño dashboard en Astro (o Next.js) que use el token maestro y permita seleccionar cliente desde un dropdown, mostrando sus colecciones. Esto es una herramienta interna, no parte del sitio del cliente.

---

## 6. Workflow para Enchufar un Nuevo Cliente

```
1. [ ] Crear colecciones en Directus: <slug>_configuracion, _paginas, _servicios, etc.
2. [ ] Crear rol y usuario en Directus con permisos solo sobre esas colecciones.
3. [ ] Generar Static Token para el usuario.
4. [ ] Clonar el builder base: git clone <repo_builder> <nombre-web>
5. [ ] Crear .env con URL, TOKEN y CLIENT_SLUG.
6. [ ] Configurar variables en Cloudflare Pages.
7. [ ] Conectar repo a Cloudflare Pages (o reutilizar el proyecto existente).
8. [ ] Poblar contenido inicial en Directus.
9. [ ] Deploy y verificar.
```

---

## 7. Factibilidad: Chatbot y Mini CRM en Directus

### 7.1 Mini CRM de Leads ✅ Altamente factible

Directus es excelente para esto:

- Colección `<slug>_leads` con campos: nombre, email, teléfono, mensaje, fuente, estado (nuevo / contactado / cerrado / descartado), notas internas, fecha.
- Desde el panel de Directus se puede gestionar directamente (filtros, búsqueda, estado).
- En el sitio Astro se envía el formulario a un **endpoint server-side** (`/api/lead.js`) que usa el SDK con el token del cliente para hacer `createItem()`.
- Los flujos de Directus (Flows) pueden enviar notificaciones por email al nuevo lead o a Daniel.

### 7.2 Chatbot por cliente ⚠️ Factible pero Directus es solo el backend de datos

Directus puede almacenar y servir:
- Colección `<slug>_chatbot_config`: nombre del bot, saludo, tono, FAQ base, prompt del sistema.
- Colección `<slug>_conversaciones`: historial de chats (opcional, para auditoría).

**El chatbot en sí** requiere integración con un proveedor de IA (OpenAI, Anthropic, etc.). La arquitectura recomendada:

```
Usuario → Widget de chat (JS embebido en el sitio)
       → Endpoint server-side en Astro (o Edge Function en Cloudflare)
       → Lee config del chatbot desde Directus
       → Llama a OpenAI API con el prompt base del cliente
       → Retorna respuesta al usuario
```

Directus actúa como fuente de verdad de la configuración del bot, pero no ejecuta el chatbot. Esto es correcto y escalable.

### 7.3 Alternativas a Directus evaluadas

| CMS | Multi-tenant nativo | CRM | Chatbot config | Veredicto |
|-----|---------------------|-----|----------------|-----------|
| **Directus** | ✅ (manual, por permisos) | ✅ excelente | ✅ como config | **Recomendado — ya instalado** |
| Strapi | ⚠️ complejo | ✅ | ✅ | Sin ventaja, más pesado |
| Payload CMS | ✅ nativo (v2+) | ⚠️ básico | ✅ | Alternativa si se escala mucho |
| Sanity | ✅ nativo (datasets) | ❌ | ✅ | Bueno para contenido, no para CRM |
| Airtable/NocoDB | ✅ | ✅ | ❌ | Solo datos, no CMS |

**Conclusión:** Directus es la opción correcta. Ya está instalado, el SDK está integrado en los proyectos y soporta todos los casos de uso: CMS, CRM de leads y configuración de chatbot.

---

## 8. Roadmap de Implementación

### Fase 1 — Estructura base (inmediata)
- [ ] Definir colecciones estándar para todos los clientes
- [ ] Crear roles/usuarios para pataka y luam en Directus
- [ ] Actualizar `src/lib/directus.js` en pataka-web y luam-web
- [ ] Crear `.env` locales y variables en Cloudflare Pages
- [ ] Verificar fetch de datos básicos en producción

### Fase 2 — Contenido real (1-2 semanas)
- [ ] Poblar contenido de pataka-web desde Directus
- [ ] Poblar contenido de luam-web desde Directus
- [ ] Migrar textos y assets que están hardcodeados en HTML
- [ ] Configurar assets/imágenes usando `assetUrl()`

### Fase 3 — Mini CRM (2-4 semanas)
- [ ] Colección `<slug>_leads` para cada cliente
- [ ] Endpoint `/api/lead` en cada sitio Astro
- [ ] Formulario de contacto que guarda en Directus
- [ ] Flow en Directus para notificación por email
- [ ] Vista simple de gestión de leads en el panel

### Fase 4 — Chatbot (4-8 semanas)
- [ ] Colección `<slug>_chatbot_config` en Directus
- [ ] Widget de chat embebible (JS puro o Astro island)
- [ ] Edge Function en Cloudflare Workers para el proxy con OpenAI
- [ ] Integración con OpenAI (GPT-4o o similar)
- [ ] Panel de configuración del bot para cada cliente

---

## 9. Seguridad y Buenas Prácticas

- **Nunca** exponer el `DIRECTUS_TOKEN` en código cliente. Usarlo siempre en build-time o endpoints server-side.
- El token de cada cliente tiene permisos **solo lectura** sobre sus propias colecciones, excepto `leads` donde se necesita escritura.
- El token de leads debería ser un **segundo token** con solo permiso `createItem` en `<slug>_leads`.
- Rotar tokens si hay sospecha de filtración.
- Activar CORS en Directus solo para los dominios permitidos (`pataka.cl`, `luam.cl`, etc.).

---

## 10. Referencias Técnicas

- [Directus SDK Docs](https://docs.directus.io/guides/sdk/getting-started.html)
- [Astro + Directus Tutorial](https://docs.directus.io/blog/getting-started-with-directus-and-astro.html)
- [Directus Flows (automatizaciones)](https://docs.directus.io/app/flows.html)
- [Cloudflare Pages — Environment Variables](https://developers.cloudflare.com/pages/configuration/build-configuration/)
