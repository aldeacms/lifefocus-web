# Guía de Instalación y Configuración: Directus + Cloudflare Pages

Esta guía detalla los pasos técnicos exactos para configurar "El Cerebro" (ChemiCloud) y "El Músculo" (Cloudflare Pages) del ecosistema Life Focus.

---

## FASE 1: Instalación de Directus en ChemiCloud (VPS)

Asumiremos que tienes acceso root/SSH a tu VPS de ChemiCloud y que corre Ubuntu/Debian o un SO basado en Linux.

### 1. Preparación del Entorno
Directus es una aplicación Node.js, por lo que necesitas:
1.  **Node.js (LTS):** Asegúrate de tener Node.js instalado (v18 o v20 recomendado).
2.  **Base de Datos:** Crear una base de datos en MySQL, MariaDB o PostgreSQL.
    *   Ejemplo en MySQL: `CREATE DATABASE directus_lifefocus;`
3.  **Gestor de Procesos (PM2) o Docker:** Recomendamos **Docker** por su facilidad de aislamiento, aunque con PM2 (nativo) corre ligeramente más rápido en VPS pequeños. En esta guía asumiremos una instalación nativa vía `npx` por simplicidad, usando PM2.

### 2. Instalación Limpia de Directus
Navega a la carpeta pública de tu servidor (ej. `/var/www/admin.lifefocus.agency`):

```bash
# Iniciar asistente de instalación
npx create-directus-project my-project

# Responde a las preguntas:
# 1. Elige tu Base de Datos (ej. MySQL)
# 2. Credenciales (host, nombre, usuario, contraseña)
# 3. Elige el correo/contraseña de tu Usuario Administrador (TU acceso maestro)
```

### 3. Ejecutar Directus en Segundo Plano (PM2)
Directus levanta un servidor interno. Necesitamos que funcione 24/7.
```bash
npm install -g pm2
cd my-project
pm2 start npx --name "directus-lifefocus" -- directus start
pm2 save
pm2 startup
```

### 4. Configurar el Dominio (Proxy Inverso con Nginx)
Para que tus clientes entren a `admin.lifefocus.agency` de forma segura (HTTPS):
1.  Apunta tu dominio `admin.lifefocus.agency` a la IP de tu VPS.
2.  Configura Nginx para que todo el tráfico entrante al puerto 80/443 se redirija al puerto local de Directus (por defecto `8055`).
3.  Instala un certificado SSL gratuito usando **Certbot** (Let's Encrypt).

---

## FASE 2: Configuración "Multi-Tenant" (Aislamiento por Cliente)

Como agencia, tendrás a Pataka y Fierros en la misma base de datos. Debemos aislarlos.

### 1. Sistema de Nombres (Naming Convention)
Para mantener orden en Directus, crea colecciones siempre empezando con el prefijo del cliente:
*   `pataka_servicios`
*   `pataka_hero`
*   `fierros_productos`

### 2. Creación de Roles por Cliente
Ve a **Settings > Roles y Permisos**:
1.  Crea un Rol llamado `Cliente: Pataka`.
2.  Desactiva (Deny) el permiso de "App Access" general innecesario, pero mantenle acceso a la aplicación.
3.  En la tabla de permisos de Colecciones, busca todas las que digan `pataka_` y dales permiso completo (Create, Read, Update, Delete). Para el resto, dales acceso Denegado (Cruce rojo).
4.  **Crea un Usuario:** (Ej. `ana@pataka.cl`) y asígnale el Rol `Cliente: Pataka`.
5.  *Resultado:* Cuando Ana inicie sesión, su panel de control solo mostrará sus propias colecciones. Las colecciones de otros clientes serán invisibles e inaccesibles.

---

## FASE 3: Conexión con Astro y Cloudflare Pages

Tu código Astro vive en GitHub. La conexión se hace en el momento del "deploy" (Build Time).

### 1. Modificar Astro para Leer de Directus
En el repositorio de Astro, instalarás el SDK:
```bash
npm install @directus/sdk
```
Tu script de Astro se conectará al cargar la página en la consola:
```js
import { createDirectus, rest, readItems } from '@directus/sdk';

const directus = createDirectus('https://admin.lifefocus.agency').with(rest());
// Obtener los datos del héroe de Pataka
const heroData = await directus.request(readItems('pataka_hero'));
```

### 2. Despliegue en Cloudflare Pages
1.  Inicia sesión en **Cloudflare Dashboard > Workers & Pages**.
2.  Da clic en **Create application > Pages > Connect to Git**.
3.  Selecciona el repositorio de GitHub de Pataka.
4.  **Configuración de Build:**
    *   Framework: `Astro`
    *   Build command: `npm run build`
    *   Build directory: `dist`
5.  *Importante:* En las variables de entorno de Cloudflare, podrías añadir `DIRECTUS_URL=https://admin.lifefocus.agency` para no tener la URL quemada en tu código.
6.  Haz clic en **Save and Deploy**. Cloudflare bajará el código de GitHub, ejecutará Node.js, Astro se conectará a Directus vía API, descargará los textos de Ana, y Cloudflare guardará todo como archivos HTML estáticos en su red global.

---

## FASE 4: Automatización (Los Webhooks)

Si Ana cambia un texto en Directus, ¡Cloudflare no lo sabe! Cloudflare solo compila cuando tú subes código a GitHub. Para arreglar esto:

1.  En Cloudflare Pages, ve a los "Settings" de tu proyecto (Ej. Pataka).
2.  Busca la sección **Deploy Hooks** (Ganchos de despliegue).
3.  Crea uno (Ej. "Actualización desde Directus"). Cloudflare te dará una URL secreta (Ej. `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/XXXX`).
4.  Vuelve a **Directus > Settings > Webhooks**.
5.  Crea un nuevo Webhook:
    *   Name: "Trigger Deploy Pataka"
    *   Method: `POST`
    *   URL: *Pega la URL del paso 3.*
    *   Status: Active.
    *   Triggers (Eventos): `item.create`, `item.update`, `item.delete`.
    *   Collections: Selecciona `pataka_hero`, `pataka_servicios`, etc.
6.  *Resultado:* Si Ana edita el título "Comienza el aprendizaje", Directus dispara un ping a Cloudflare. Cloudflare dice "¡Un webhook, a compilar!", descarga los nuevos textos, renderiza en 5 segundos y el sitio cambia mágicamente para el público entero, completamente gratis.
