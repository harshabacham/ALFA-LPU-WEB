import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://alfa-lpu.web.app';
const APP_TSX_PATH = path.resolve(__dirname, '../App.tsx');
const SITEMAP_OUTPUT_PATH = path.resolve(__dirname, '../public/sitemap.xml');

// Routes that should be excluded from search engine index sitemap
const EXCLUDE_ROUTES = new Set(['*', '/login', '/profile', '/bookmarks']);

// Priorities and change frequencies per route pattern
function getRouteMetadata(routePath) {
  if (routePath === '/') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  if (['/clubs', '/events', '/deals', '/notes', '/pg-rooms'].includes(routePath)) {
    return { priority: '0.9', changefreq: 'daily' };
  }
  if (['/gpa', '/emergency', '/duty-leaves', '/courses', '/ai-tools', '/youtube', '/guides'].includes(routePath)) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (['/about', '/contact', '/notifications', '/deals/add'].includes(routePath)) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  if (['/privacy', '/terms', '/disclaimer'].includes(routePath)) {
    return { priority: '0.3', changefreq: 'yearly' };
  }
  return { priority: '0.6', changefreq: 'monthly' };
}

function extractRoutesFromAppTsx() {
  const content = fs.readFileSync(APP_TSX_PATH, 'utf-8');
  // Match <Route path="..."
  const routeRegex = /<Route\s+[^>]*path=["']([^"']+)["']/g;
  const routes = [];
  let match;

  while ((match = routeRegex.exec(content)) !== null) {
    const routePath = match[1];
    
    // Skip excluded routes and wildcard
    if (EXCLUDE_ROUTES.has(routePath) || routePath.includes('*')) {
      continue;
    }

    // Skip dynamic params like :id or :subjectName for clean indexing
    if (routePath.includes(':')) {
      continue;
    }

    routes.push(routePath);
  }

  // Remove duplicates
  return Array.from(new Set(routes));
}

function generateSitemapXml() {
  const routes = extractRoutesFromAppTsx();
  const today = new Date().toISOString().split('T')[0];

  const xmlEntries = routes.map((route) => {
    const { priority, changefreq } = getRouteMetadata(route);
    const loc = `${DOMAIN}${route === '/' ? '/' : route}`;

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Automatically generated from App.tsx routes on ${today} -->
${xmlEntries.join('\n\n')}
</urlset>
`;

  fs.writeFileSync(SITEMAP_OUTPUT_PATH, sitemapXml, 'utf-8');
  console.log(`[Sitemap Generator] Successfully generated sitemap with ${routes.length} routes at ${SITEMAP_OUTPUT_PATH}`);
}

generateSitemapXml();
