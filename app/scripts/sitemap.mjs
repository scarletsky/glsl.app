import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import { dirname, isAbsolute, join, resolve } from "path";
import { fileURLToPath } from "url";

const languages = ["", "ru", "es", "de", "zh"];
const pages = languages.map(lang => ({
  url: lang ? `/?lang=${lang}` : "/",
  changefreq: "daily",
  priority: "1.0",
}));

const appBaseUrl = process.env.APP_BASE_URL?.replace(/\/$/, "");

if (!appBaseUrl) {
  throw new Error("APP_BASE_URL must be defined");
}

const xmlEntries = pages
  .map(
    page => `  <url>
    <loc>${appBaseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
${xmlEntries}
</urlset>
`;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");

const destinations = process.argv.slice(2);
const targetDirs = destinations.length ? destinations : ["public"];

for (const targetDir of targetDirs) {
  const baseDir = isAbsolute(targetDir) ? targetDir : resolve(appRoot, targetDir);
  const outputPath = join(baseDir, "sitemap.xml");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, xml);
  console.log(`Sitemap written to ${outputPath}`);
}
