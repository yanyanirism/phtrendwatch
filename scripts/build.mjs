// Builds the static site into dist/ from live RSS feeds. Run on a schedule (see .github/workflows/deploy.yml).
import { mkdir, writeFile } from 'node:fs/promises';

try { process.loadEnvFile(); } catch { /* no .env file: rely on the real environment */ }

const env = (name) => (process.env[name] ?? '').trim();

const SITE_NAME = env('SITE_NAME') || 'PH Trend Watch';
const SITE_URL = env('SITE_URL').replace(/\/+$/, '');
const CONTACT_EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(env('CONTACT_EMAIL')) ? env('CONTACT_EMAIL') : '';
const AD_EVERY = Math.max(2, Number(env('AD_EVERY')) || 6);
const PER_SECTION = 10;

const AD_CLIENT = /^ca-pub-\d{10,20}$/.test(env('ADSENSE_CLIENT')) ? env('ADSENSE_CLIENT') : '';
if (env('ADSENSE_CLIENT') && !AD_CLIENT) console.warn('ADSENSE_CLIENT is not a ca-pub-… id; showing ad placeholders.');
if (!CONTACT_EMAIL) console.warn('CONTACT_EMAIL is not set; the contact page has no address. AdSense expects one.');
const AD_SLOTS = {
  top: env('ADSENSE_SLOT_TOP'),
  infeed: env('ADSENSE_SLOT_INFEED'),
  sidebar: env('ADSENSE_SLOT_SIDEBAR'),
  bottom: env('ADSENSE_SLOT_BOTTOM'),
};

const PH = 'hl=en-PH&gl=PH&ceid=PH:en';
const topic = (name) => `https://news.google.com/rss/headlines/section/topic/${name}?${PH}`;
const SECTIONS = [
  { id: 'top', title: 'Top Stories', url: `https://news.google.com/rss?${PH}` },
  { id: 'philippines', title: 'Philippines', url: topic('NATION') },
  { id: 'world', title: 'World', url: topic('WORLD') },
  { id: 'business', title: 'Business', url: topic('BUSINESS') },
  { id: 'tech', title: 'Technology', url: topic('TECHNOLOGY') },
  { id: 'entertainment', title: 'Entertainment', url: topic('ENTERTAINMENT') },
  { id: 'sports', title: 'Sports', url: topic('SPORTS') },
];
const TRENDS_URL = 'https://trends.google.com/trending/rss?geo=PH';

// --- feed parsing ---------------------------------------------------------

function decode(text) {
  return text
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1].trim()).trim() : '';
}

const items = (xml) => [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

const safeUrl = (url) => (/^https?:\/\//i.test(url) ? url : '');

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; TrendingNewsBuilder/1.0)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

async function loadSection(section) {
  const xml = await fetchText(section.url);
  return items(xml).map((item) => {
    const source = tag(item, 'source');
    let title = tag(item, 'title');
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
    return { title, source, link: safeUrl(tag(item, 'link')), date: new Date(tag(item, 'pubDate')) };
  }).filter((a) => a.title && a.link);
}

async function loadTrends() {
  const xml = await fetchText(TRENDS_URL);
  return items(xml).map((item) => {
    const term = tag(item, 'title');
    return {
      term,
      traffic: tag(item, 'ht:approx_traffic'),
      link: safeUrl(tag(item, 'ht:news_item_url')) || `https://www.google.com/search?q=${encodeURIComponent(term)}`,
    };
  }).filter((t) => t.term).slice(0, 20);
}

// --- rendering ------------------------------------------------------------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function ad(kind) {
  const slot = AD_SLOTS[kind];
  if (!AD_CLIENT || !slot) return `<div class="ad ad-${kind} ad-placeholder"><span class="ad-label">Advertisement</span></div>`;
  return `<div class="ad ad-${kind}"><span class="ad-label">Advertisement</span>`
    + `<ins class="adsbygoogle" style="display:block" data-ad-client="${esc(AD_CLIENT)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>`
    + `<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
}

function timeTag(date) {
  return Number.isNaN(date.getTime()) ? '' : `<time datetime="${date.toISOString()}">${esc(date.toUTCString())}</time>`;
}

function card(article, lead) {
  return `<article class="card${lead ? ' lead' : ''}">
  <a href="${esc(article.link)}" target="_blank" rel="noopener nofollow">${esc(article.title)}</a>
  <p class="meta"><span>${esc(article.source)}</span>${timeTag(article.date)}</p>
</article>`;
}

function section(sec, articles) {
  const parts = [];
  articles.forEach((a, i) => {
    parts.push(card(a, i === 0));
    if ((i + 1) % AD_EVERY === 0 && i < articles.length - 1) parts.push(ad('infeed'));
  });
  return `<section id="${sec.id}"><h2>${esc(sec.title)}</h2><div class="cards">${parts.join('\n')}</div></section>\n${ad('infeed')}`;
}

const STYLE = `
:root{--bg:#f4f5f7;--surface:#fff;--text:#14171c;--muted:#5d6673;--line:#e1e4e8;--accent:#c8102e;--accent-2:#0038a8;--chip:#eef1f6}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--surface:#181b21;--text:#e8eaee;--muted:#9aa3ae;--line:#2a2f37;--accent:#ff4d64;--accent-2:#6d9bff;--chip:#222730}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:inherit}
header{background:var(--surface);border-bottom:3px solid var(--accent);position:sticky;top:0;z-index:10}
.bar{max-width:1240px;margin:auto;padding:12px 16px;display:flex;align-items:baseline;gap:16px;flex-wrap:wrap}
.brand{font-weight:800;font-size:1.4rem;text-decoration:none;letter-spacing:-.02em}
.brand span{color:var(--accent)}
.updated{color:var(--muted);font-size:.85rem}
nav{max-width:1240px;margin:auto;padding:0 16px 10px;display:flex;gap:18px;overflow-x:auto;font-size:.9rem;font-weight:600}
nav a{text-decoration:none;color:var(--muted);white-space:nowrap}
nav a:hover{color:var(--accent-2)}
.wrap{max-width:1240px;margin:auto;padding:16px}
.trending{display:flex;gap:8px;overflow-x:auto;padding:4px 0 12px;align-items:center}
.trending b{white-space:nowrap;color:var(--accent);font-size:.85rem;text-transform:uppercase;letter-spacing:.05em}
.chip{background:var(--chip);border-radius:999px;padding:6px 12px;text-decoration:none;white-space:nowrap;font-size:.9rem}
.chip small{color:var(--muted)}
.layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
aside{position:sticky;top:110px;display:grid;gap:16px}
section h2{font-size:1.15rem;margin:24px 0 12px;padding-left:10px;border-left:4px solid var(--accent-2)}
.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px}
.card a{text-decoration:none;font-weight:600}
.card a:hover{color:var(--accent-2);text-decoration:underline}
.card.lead{grid-column:1/-1;padding:20px}
.card.lead a{font-size:1.35rem;line-height:1.3}
.meta{margin:8px 0 0;color:var(--muted);font-size:.8rem;display:flex;gap:10px;flex-wrap:wrap}
.ad{position:relative;display:flex;align-items:center;justify-content:center;min-height:100px;margin:16px 0}
.cards .ad{grid-column:1/-1;margin:0}
.ad ins{width:100%}
.ad-label{position:absolute;top:2px;left:8px;font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.ad-placeholder{background:repeating-linear-gradient(45deg,var(--chip),var(--chip) 10px,var(--surface) 10px,var(--surface) 20px);border:1px dashed var(--line);border-radius:10px}
.ad-top,.ad-bottom{min-height:110px}
.ad-sidebar{min-height:600px;margin:0}
.prose{max-width:760px;margin:8px auto 0;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:8px 24px 24px}
.prose a{color:var(--accent-2)}
footer{color:var(--muted);font-size:.8rem;text-align:center;padding:24px 16px 80px}
footer nav{justify-content:center;padding:8px 0 0}
@media (max-width:900px){.layout{grid-template-columns:1fr}aside{display:none}}
@media (max-width:560px){.cards{grid-template-columns:1fr}.card.lead a{font-size:1.15rem}.prose{padding:4px 16px 16px}}
`;

const DESCRIPTION = 'The latest trending news in the Philippines and around the world, updated every 30 minutes.';
const PAGES = [
  { file: 'about.html', label: 'About' },
  { file: 'contact.html', label: 'Contact' },
  { file: 'privacy.html', label: 'Privacy Policy' },
];

function shell({ file, title, nav, body }) {
  const adScript = AD_CLIENT
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(AD_CLIENT)}" crossorigin="anonymous"></script>`
    : '';
  const canonical = SITE_URL ? `<link rel="canonical" href="${esc(`${SITE_URL}/${file === 'index.html' ? '' : file}`)}">` : '';
  const pageLinks = PAGES.map((p) => `<a href="${p.file}">${p.label}</a>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(DESCRIPTION)}">
${canonical}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(DESCRIPTION)}">
<meta property="og:type" content="website">
${adScript}
<style>${STYLE}</style>
</head>
<body>
<header>
  <div class="bar"><a class="brand" href="./">${esc(SITE_NAME).replace(/ (\S+)$/, ' <span>$1</span>')}</a>${nav.updated ?? ''}</div>
  <nav>${nav.links}</nav>
</header>
<div class="wrap">
${body}
</div>
<footer>
  <div>Headlines link to their original publishers via Google News. ${esc(SITE_NAME)} does not host article content.</div>
  <nav>${pageLinks}</nav>
  <div>© ${new Date().getFullYear()} ${esc(SITE_NAME)}</div>
</footer>
</body>
</html>
`;
}

function home({ sections, trends, builtAt }) {
  const manila = builtAt.toLocaleString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' });
  const chips = trends.map((t) => `<a class="chip" href="${esc(t.link)}" target="_blank" rel="noopener nofollow">${esc(t.term)}${t.traffic ? ` <small>${esc(t.traffic)}</small>` : ''}</a>`).join('');
  const body = `  ${ad('top')}
  ${chips ? `<div class="trending"><b>Trending in PH</b>${chips}</div>` : ''}
  <div class="layout">
    <main>
${sections.map(({ sec, articles }) => section(sec, articles)).join('\n')}
    </main>
    <aside>${ad('sidebar')}${ad('sidebar')}</aside>
  </div>
  ${ad('bottom')}
<script>
for (const t of document.querySelectorAll('time')) {
  const mins = Math.round((Date.now() - new Date(t.dateTime)) / 60000);
  t.textContent = mins < 1 ? 'just now' : mins < 60 ? mins + 'm ago' : mins < 1440 ? Math.round(mins / 60) + 'h ago' : Math.round(mins / 1440) + 'd ago';
}
</script>`;
  return shell({
    file: 'index.html',
    title: `${SITE_NAME} — Philippines & World News`,
    nav: {
      updated: `<span class="updated">Updated ${esc(manila)} (Manila time)</span>`,
      links: sections.map(({ sec }) => `<a href="#${sec.id}">${esc(sec.title)}</a>`).join(''),
    },
    body,
  });
}

function infoPage(file, heading, content) {
  return shell({
    file,
    title: `${heading} — ${SITE_NAME}`,
    nav: { links: `<a href="./">← Back to headlines</a>` },
    body: `<article class="prose"><h1>${esc(heading)}</h1>\n${content}\n</article>`,
  });
}

function infoPages(builtAt) {
  const name = esc(SITE_NAME);
  const updated = builtAt.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'long' });
  const email = CONTACT_EMAIL ? `<a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a>` : 'our email address (coming soon)';

  return {
    'about.html': infoPage('about.html', 'About', `
<p>${name} brings together the stories people in the Philippines are reading and searching for right now, in one fast page.</p>
<h2>What you'll find here</h2>
<ul>
  <li><b>Top headlines</b> from Philippine and international publishers, grouped into Philippines, World, Business, Technology, Entertainment and Sports.</li>
  <li><b>Trending searches</b> in the Philippines, so you can see what everyone is talking about today.</li>
</ul>
<h2>How it works</h2>
<p>The page refreshes about every 30 minutes. Headlines come from Google News and trending searches from Google Trends. Every headline links straight to the publisher's own website, where you can read the full story. ${name} does not copy or rewrite articles.</p>
<p>${name} is independent and is not affiliated with any of the publishers it links to.</p>
<h2>Get in touch</h2>
<p>Questions, corrections or suggestions? See the <a href="contact.html">Contact</a> page.</p>`),

    'contact.html': infoPage('contact.html', 'Contact', `
<p>We'd like to hear from you. Email us at ${email}.</p>
<ul>
  <li><b>Corrections:</b> if a headline links to the wrong story, send us the link.</li>
  <li><b>Publishers:</b> to have your stories removed or changed, include the page address.</li>
  <li><b>Advertising and other questions:</b> email us any time.</li>
</ul>
<p>We usually reply within a few working days.</p>`),

    'privacy.html': infoPage('privacy.html', 'Privacy Policy', `
<p><i>Last updated: ${esc(updated)}</i></p>
<p>This policy explains what information ${name} and its partners collect when you visit this website, and the choices you have.</p>
<h2>Information we collect</h2>
<p>${name} has no accounts, sign-up forms or comments, and we do not ask for personal information. If you email us, we use your address only to reply.</p>
<p>Our website host may keep standard server logs, such as IP address, browser type and the pages visited, to keep the site secure and running.</p>
<h2>Advertising and cookies</h2>
<p>This site shows ads from Google AdSense.</p>
<ul>
  <li>Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this website or other websites.</li>
  <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet.</li>
  <li>You can opt out of personalised advertising in <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>. You can also opt out of some third-party vendors' use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">www.aboutads.info</a>.</li>
</ul>
<p>To learn more, read <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">how Google uses information from sites that use its services</a>. You can also block or delete cookies in your browser settings.</p>
<h2>Links to other websites</h2>
<p>Headlines link to other publishers' websites. Their own privacy policies apply when you visit them.</p>
<h2>Children</h2>
<p>This site is meant for a general audience and does not knowingly collect information from children under 13.</p>
<h2>Your rights</h2>
<p>Under the Philippine Data Privacy Act of 2012, you may ask what personal information we hold about you and ask us to correct or delete it.</p>
<h2>Changes to this policy</h2>
<p>We may update this policy from time to time. The date at the top shows when it last changed.</p>
<h2>Contact</h2>
<p>For privacy questions, email ${email}.</p>`),
  };
}

// --- main -----------------------------------------------------------------

const results = await Promise.allSettled(SECTIONS.map(loadSection));
const seen = new Set();
const sections = [];
results.forEach((result, i) => {
  const sec = SECTIONS[i];
  if (result.status === 'rejected') return console.warn(`Skipping ${sec.title}: ${result.reason.message}`);
  const articles = result.value.filter((a) => !seen.has(a.title) && seen.add(a.title)).slice(0, PER_SECTION);
  if (articles.length) sections.push({ sec, articles });
});

if (!sections.length) {
  console.error('Every news feed failed; keeping the previously deployed page.');
  process.exit(1);
}

const trends = await loadTrends().catch((err) => (console.warn(`Skipping trends: ${err.message}`), []));
const builtAt = new Date();

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', home({ sections, trends, builtAt }));
for (const [file, html] of Object.entries(infoPages(builtAt))) await writeFile(`dist/${file}`, html);
if (AD_CLIENT) await writeFile('dist/ads.txt', `google.com, ${AD_CLIENT.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);
if (SITE_URL) {
  const urls = ['', ...PAGES.map((p) => p.file)].map((f) => `<url><loc>${esc(`${SITE_URL}/${f}`)}</loc></url>`).join('');
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

console.log(`Built dist/: ${sections.reduce((n, s) => n + s.articles.length, 0)} headlines, ${trends.length} trends, ${PAGES.length} info pages.`);
