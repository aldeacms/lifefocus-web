/**
 * Interfaces TypeScript del CMS — Web Machine / lifefocus-web
 *
 * Cada tipo de contenido del CMS tiene su interface aquí.
 * Los campos siguen el Patrón Eyebrow SEO Aldea:
 *   - `keyword`    → va en <hX class="eyebrow"> (peso SEO)
 *   - `headline`   → va en <p class="hX"> (impacto visual)
 *   - `description`→ va en <p> (soporte, nunca heading)
 */

// ── SEO & Metadata ─────────────────────────────────────────

export interface PageMeta {
  /** Título de la página — va en <title> y og:title */
  title: string;
  /** Descripción — va en <meta name="description"> y og:description */
  description: string;
  /** URL canónica (opcional: si no se especifica, se usa Astro.url.href) */
  canonicalUrl?: string;
  /** Imagen Open Graph */
  ogImage?: string;
  /** Tipo Open Graph (default: 'website') */
  ogType?: 'website' | 'article';
  /** Idioma de la página (default: 'es') */
  lang?: string;
}

// ── Secciones ──────────────────────────────────────────────

/**
 * Base reutilizable para cualquier sección con titular.
 * Sigue el Patrón Eyebrow SEO Aldea obligatoriamente.
 */
export interface SectionBase {
  /** Va en <hX class="eyebrow"> — DEBE ser una keyword SEO */
  keyword: string;
  /** Va en <p class="hX"> — titular de impacto visual */
  headline: string;
  /** Va en <p> — texto descriptivo de soporte (opcional) */
  description?: string;
}

/** Hero section (usa <h1>) */
export interface HeroSection extends SectionBase {
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
}

/** Sección genérica secundaria (usa <h2>) */
export interface ContentSection extends SectionBase {
  /** Identificador único de la sección para anclar y analytics */
  id?: string;
}

// ── Componentes Reutilizables ───────────────────────────────

/** Card genérica (usa <h3> para el eyebrow) */
export interface CardItem extends SectionBase {
  /** Icono SVG o nombre de icono del sistema */
  icon?: string;
  /** Enlace opcional */
  link?: string;
  /** Texto del enlace (default: 'Ver más') */
  linkText?: string;
  /** Imagen de la card */
  image?: string;
  imageAlt?: string;
}

/** Botón de llamada a la acción */
export interface CtaButton {
  text: string;
  url: string;
  variant?: 'primary' | 'secondary';
  /** Abrir en nueva pestaña */
  external?: boolean;
}

// ── Navegación ─────────────────────────────────────────────

export interface NavItem {
  label: string;
  url: string;
  /** Ítem activo */
  active?: boolean;
  /** Subnav */
  children?: NavItem[];
}

export interface SiteNav {
  /** Logo */
  logoText?: string;
  logoUrl?: string;
  items: NavItem[];
  cta?: CtaButton;
}
