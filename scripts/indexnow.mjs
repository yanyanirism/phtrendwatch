// Tells Bing and other IndexNow search engines that the pages in the live sitemap changed.
// Runs after a deploy triggered by a push (see .github/workflows/deploy.yml); never fails the job.
const key = (process.env.INDEXNOW_KEY ?? '').trim();
const site = (process.env.SITE_URL ?? '').trim().replace(/\/+$/, '');
if (!key || !site) {
  console.log('IndexNow skipped: INDEXNOW_KEY or SITE_URL is not set.');
  process.exit(0);
}

try {
  const sitemap = await (await fetch(`${site}/sitemap.xml`, { signal: AbortSignal.timeout(30000) })).text();
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) throw new Error('the live sitemap has no URLs');
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
    signal: AbortSignal.timeout(30000),
  });
  console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
} catch (err) {
  console.warn(`IndexNow: not sent (${err.message})`);
}
