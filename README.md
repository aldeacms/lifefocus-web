# lifefocus-web

Sitio web de LifeFocus. Construido con el stack Web Machine.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Astro](https://astro.build) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com) — config en `global.css` vía `@theme` |
| Tipado | TypeScript strict |
| Deploy | [Cloudflare Pages](https://pages.cloudflare.com) |
| Repositorio | GitHub |

## Estándares de desarrollo

Este proyecto sigue estrictamente:

- **Era 4** — HTML semántico, container queries first, BEM, tokens descriptivos
- **Patrón Eyebrow SEO Aldea** — headings semánticos cargan keywords, `<p>` carga el titular visual
- **Tailwind v4** — sin `tailwind.config.ts`, configuración 100% en `src/styles/global.css` vía `@theme {}`

Ver [`contextos/reglas-obligatorias.md`](../contextos/reglas-obligatorias.md) para las reglas completas.

## Estructura

```
src/
├── components/
│   ├── ui/          # Átomos: Button, Icon, Badge…
│   ├── sections/    # Organismos: Hero, Services, Features…
│   └── layout/      # Header, Footer, Nav
├── layouts/
│   └── BaseLayout.astro   # Layout base con meta SEO completo
├── pages/
│   └── index.astro
├── types/
│   └── cms.ts             # Interfaces TypeScript del CMS
├── lib/
│   └── cms.ts             # Cliente del CMS (crear al conectar)
└── styles/
    └── global.css         # Design system: tokens @theme + clases globales Era 4
```

## Comandos

```bash
npm run dev       # Dev server → http://localhost:4321
npm run build     # Build estático → /dist
npm run preview   # Preview del build
```

## Variables de entorno

Copiar `.env.example` → `.env` y completar con los valores del CMS.

## Deploy

Push a `main` → Cloudflare Pages build automático.

- Build command: `npm run build`
- Output directory: `dist`
- Variables de entorno: Cloudflare Pages → Settings → Environment Variables
