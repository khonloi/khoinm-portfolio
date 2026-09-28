import { writeFileSync } from 'fs';

const BASE_URL = 'https://khoinm.vercel.app';
const today = new Date().toISOString().split('T')[0];

const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/?open=about', changefreq: 'monthly', priority: '0.9' },
  { path: '/?open=projects', changefreq: 'weekly', priority: '0.9' },
  { path: '/?open=certificates', changefreq: 'monthly', priority: '0.8' },
  { path: '/?open=onlineAccounts', changefreq: 'monthly', priority: '0.7' },
  { path: '/?open=message', changefreq: 'monthly', priority: '0.7' },
  { path: '/?open=internet', changefreq: 'daily', priority: '0.8' },
  { path: '/?open=programs', changefreq: 'monthly', priority: '0.7' },
  { path: '/?open=games', changefreq: 'monthly', priority: '0.6' },
  { path: '/?open=welcome', changefreq: 'monthly', priority: '0.6' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
console.log(`✅ Sitemap generated with date: ${today}`);
