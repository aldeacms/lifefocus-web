# Estándar Life Focus Astro Builder (v3.1.1)

Este documento resume los lineamientos técnicos y de diseño que mejor funcionaron para el proyecto Pataka y que ahora se consideran el estándar para cualquier proyecto nacido del **Lifefocus Builder**.

## 🚀 Arquitectura Técnica

1. **Framework**: Astro 4+ con configuración `devToolbar: { enabled: false }`.
2. **Estilado**:
   - **Capa 1 (Tokens)**: Uso de `lifefocus-tokens.css` con el sistema `light-dark()` de CSS moderno.
   - **Capa 2 (Estructura)**: BEM (Block Element Modifier) como metodología principal.
   - **Capa 3 (Utilidades)**: Tailwind CSS habilitado solo para correcciones puntuales (`padding`, `margin`, `display`), pero **nunca** para reemplazar la semántica BEM en componentes críticos.
3. **Imágenes**: Formatos `webp` por defecto, servidos desde `public/images/`.

## 🎨 Diseño y UX

- **Conectividad Cromática**: Las transiciones entre secciones (waves, shapes) deben usar variables dinámicas como `var(--color-surface-alt)` para asegurar que el modo claro y oscuro no tengan cortes visuales bruscos.
- **Dark Mode**: 
  - Usar `[data-theme="dark"]` como selector de fallback para sincronizar el toggle manual con el sistema.
  - Los estados `hover` en dark mode deben evitar gradientes que terminen en blanco puro (causa falta de contraste con texto claro).
- **Footer**: Patrón minimalista y centrado para sitios personales/profesionales, priorizando branding y contacto sobre menús extensos.

## ✍️ Copywriting y Localización

- **Tono Personal**: Si el cliente es un profesional independiente, usar **primera persona singular ("sobre mí", no "sobre nosotros")** o tercera persona singular ("la especialista").
- **Adaptación Cultural**: 
  - Contexto Chile/Puerto Varas: Usar términos como "retoño", "papitos", "fono", "atenciones".
  - Evitar términos neutros de España o México que suenen ajenos para el cliente local.

## 📁 Estructura del Proyecto

- `src/components/`: Componentes Astro semánticos (Header, Hero, Services, etc.).
- `src/styles/`: 
  - `lifefocus-tokens.css`: Fuente de verdad de colores y escalas.
  - `[nombre]-local.css`: Estilos específicos del proyecto que extienden los tokens.
- `src/layouts/`: BaseLayout con lógica de hidratación de tema (prevenir FOUC).
