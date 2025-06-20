# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is an Astro-based blog/portfolio site. Uses pnpm as package manager.

- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server (localhost:4321)
- `pnpm run build` - Build production site (runs astro check + astro build)
- `pnpm run preview` - Preview production build locally
- `pnpm run astro` - Run Astro CLI commands

## Architecture

**Framework**: Astro 4.x with TypeScript, TailwindCSS, and MDX support
**Site**: Chinese personal blog "轻舟" (xcanoe.top) - records independent development, product design, AI tools, and digital life

**Key Structure**:
- `/src/content/blog/` - Blog posts in Markdown/MDX format
- `/src/pages/` - Astro pages with file-based routing
- `/src/layouts/BaseLayout.astro` - Main layout with header/footer
- `/src/components/` - Reusable Astro components
- `/src/content/config.ts` - Content collections schema
- `/public/` - Static assets

**Content Management**:
- Blog posts use frontmatter schema: `title`, `description`, `pubDate`, `tags`, `coverImage`
- Chinese tag slugification handled in `utils.ts` with hash-based mapping
- Projects defined in `/src/pages/projects/projects.ts` array

**Special Features**:
- Auto-redirects 404s to homepage via middleware
- External links auto-open in new tabs via rehype plugin
- Dark mode support with Tailwind classes
- Google Analytics integration with Partytown
- RSS feed and sitemap generation
- Chinese content support with proper URL slugification

**Environment**:
- Uses `GTAG_MEASUREMENT_ID` for Google Analytics
- `GITHUB_PERSONAL_ACCESS_TOKEN` for GitHub API calls
- Site domain configured as 'xcanoe.top' in astro.config.mjs

## Content Guidelines

Blog posts are technical and personal content in Chinese. When adding new posts, ensure proper frontmatter and follow existing naming conventions in the blog directory.