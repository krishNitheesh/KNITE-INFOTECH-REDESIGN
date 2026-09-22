import fs from 'fs';
import path from 'path';

const appFilePath = path.resolve('src/App.jsx');
const appContent = fs.readFileSync(appFilePath, 'utf-8');

const routeRegex = /<Route[^>]*path=["']([^"']+)["']/g;
let match;
const routes = [];

while ((match = routeRegex.exec(appContent)) !== null) {
  const route = match[1];
  // Exclude admin routes and dynamic parameterized routes
  if (route.includes('admin') || route.includes(':')) {
    continue;
  }
  routes.push(route);
}

const currentDate = new Date().toISOString();

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  const loc = `https://kniteinfotech.in${route === '/' ? '' : route}`;
  let priority = '0.8';
  let changefreq = 'monthly';
  
  if (route === '/') {
    priority = '1.0';
    changefreq = 'weekly';
  } else if (route.includes('portal') || route.includes('meet')) {
    priority = '0.5';
  }

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

const sitemapPath = path.resolve('public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');

console.log(`Generated sitemap.xml with ${routes.length} public routes.`);
