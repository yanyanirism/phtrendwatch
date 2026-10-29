// Builds the static site into dist/ from live RSS feeds. Run on a schedule (see .github/workflows/deploy.yml).
import { existsSync } from 'node:fs';
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { CHANNELS, SERVICES } from './channels.mjs';
import { GUIDES, GUIDE_TOPICS } from './guides.mjs';

try { process.loadEnvFile(); } catch { /* no .env file: rely on the real environment */ }

const env = (name) => (process.env[name] ?? '').trim();

const SITE_NAME = env('SITE_NAME') || 'PH Trend Watch';
const SITE_URL = env('SITE_URL').replace(/\/+$/, '');
const CONTACT_EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(env('CONTACT_EMAIL')) ? env('CONTACT_EMAIL') : '';
const TOOLS_URL = (env('TOOLS_URL') || 'https://tools.phtrendwatch.world').replace(/\/+$/, '');
// Search engine ownership checks. The IndexNow key is public by design: it is served at /<key>.txt.
const GOOGLE_VERIFY = env('GOOGLE_SITE_VERIFICATION');
const BING_VERIFY = env('BING_SITE_VERIFICATION');
const GA_ID = /^G-[A-Z0-9]{4,20}$/.test(env('GA_MEASUREMENT_ID')) ? env('GA_MEASUREMENT_ID') : '';
const INDEXNOW_KEY =/^[a-zA-Z0-9-]{8,128}$/.test(env('INDEXNOW_KEY')) ? env('INDEXNOW_KEY') : '';
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
  { id: 'top', title: 'Top Stories', url: `https://news.google.com/rss?${PH}`,
    intro: 'The biggest stories right now from Philippine and international newsrooms.' },
  { id: 'philippines', title: 'Philippines', url: topic('NATION'),
    intro: 'National news: government, weather, transport, public safety and the regions.' },
  { id: 'world', title: 'World', url: topic('WORLD'),
    intro: 'International stories, with a focus on the ones that matter to Filipinos at home and abroad.' },
  { id: 'business', title: 'Business', url: topic('BUSINESS'),
    intro: 'Prices, jobs, the peso and the economy — the news that affects your budget.' },
  { id: 'tech', title: 'Technology', url: topic('TECHNOLOGY'),
    intro: 'Gadgets, apps, telcos and the companies shaping how we connect.' },
  { id: 'entertainment', title: 'Entertainment', url: topic('ENTERTAINMENT'),
    intro: 'Showbiz, music, film and streaming, from local stars to global hits.' },
  { id: 'sports', title: 'Sports', url: topic('SPORTS'),
    intro: 'Basketball, volleyball, boxing and Filipino athletes competing around the world.' },
];
const TRENDS_URL = 'https://trends.google.com/trending/rss?geo=PH';

// Markets and scores. All free, keyless feeds; any that fail are simply left off the page.
const FOREX_URL = 'https://open.er-api.com/v6/latest/USD';
const CURRENCIES = [
  ['USD', 'US dollar'], ['EUR', 'Euro'], ['JPY', 'Japanese yen'], ['GBP', 'British pound'], ['SGD', 'Singapore dollar'],
  ['HKD', 'Hong Kong dollar'], ['AUD', 'Australian dollar'], ['CAD', 'Canadian dollar'], ['CNY', 'Chinese yuan'],
  ['KRW', 'Korean won'], ['SAR', 'Saudi riyal'], ['AED', 'UAE dirham'], ['QAR', 'Qatari riyal'], ['KWD', 'Kuwaiti dinar'],
];
const quote = (symbol) => `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
// Yahoo carries the PSEi index but not individual PSE stocks; those come from the community PSE feed below.
const PSE_URL = 'https://phisix-api3.appspot.com/stocks.json';
const PSE_STOCKS = [
  ['SM', 'SM Investments'], ['BDO', 'BDO Unibank'], ['BPI', 'Bank of the Phil. Islands'], ['ALI', 'Ayala Land'],
  ['AC', 'Ayala Corp.'], ['ICT', 'ICTSI'], ['JFC', 'Jollibee Foods'], ['TEL', 'PLDT'], ['MER', 'Meralco'],
  ['URC', 'Universal Robina'],
];
// Fuel: there is no free feed of Philippine pump prices (the DOE publishes weekly PDFs), so the section shows this
// week's announced adjustments from the news, world crude benchmarks, and a link to the DOE's own price monitor.
const FUEL_NEWS = {
  title: 'Pump price updates',
  query: '("oil price" OR "fuel price" OR "pump price") (rollback OR increase OR hike OR adjustment) Philippines',
  days: 10,
  must: [/gasoline|diesel|kerosene|pump price|fuel price|oil price/i,
    /rollback|roll back|increase|hike|\bup\b|\bdown\b|adjust|watch|\bcut\b|fall|climb|rise|drop/i],
  not: /china|yuan|india|rupee|malaysia|ringgit|indonesia|vietnam|storage|opec|futures/i,
  // Social media reposts are dropped; the news outlets carry the same announcements.
  sourceNot: /facebook|instagram|tiktok|youtube|x\.com|twitter/i,
};
const CRUDE = [['BZ=F', 'Brent crude'], ['CL=F', 'WTI crude']];
const DOE_OIL_MONITOR = 'https://doe.gov.ph/oil-monitor';
const WORLD_INDICES = [
  ['PSEI.PS', 'PSEi'],
  ['^GSPC', 'S&P 500'], ['^DJI', 'Dow Jones'], ['^IXIC', 'Nasdaq'], ['^N225', 'Nikkei 225'], ['^HSI', 'Hang Seng'],
];
// Weather: MET Norway's free forecast API (CC BY 4.0, commercial use allowed with credit). It requires a
// User-Agent that identifies the site, and at most 4 decimals in coordinates.
const WEATHER_UA = 'PHTrendWatch/1.0 https://phtrendwatch.world';
const weatherUrl = ([lat, lon]) => `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
const MANILA_TZ = 'Asia/Manila';
const WEATHER_GROUPS = [
  { title: 'Philippines', cities: [
    ['Manila', [14.5995, 120.9842], MANILA_TZ], ['Pampanga (San Fernando)', [15.0286, 120.6898], MANILA_TZ],
    ['Visayas (Cebu City)', [10.3157, 123.8854], MANILA_TZ], ['Davao City', [7.1907, 125.4553], MANILA_TZ],
  ] },
  { title: 'Around the world', cities: [
    ['Sydney, Australia', [-33.8688, 151.2093], 'Australia/Sydney'], ['New York, USA', [40.7128, -74.006], 'America/New_York'],
    ['Barstow, California, USA', [34.8958, -117.0173], 'America/Los_Angeles'],
    ['Toronto, Canada', [43.6532, -79.3832], 'America/Toronto'], ['London, UK', [51.5074, -0.1278], 'Europe/London'],
    ['Berlin, Germany', [52.52, 13.405], 'Europe/Berlin'],
  ] },
];
const CITIES = WEATHER_GROUPS.flatMap((g) => g.cities.map((c) => [...c, g.title]));
// Gaming news: Google News searches per game. Titles must mention the game, because some names are common words
// ("CrossFire" also means boxing events and graphics cards); a group with nothing relevant is left off the page.
const newsSearch = (query, days) => `https://news.google.com/rss/search?q=${encodeURIComponent(`${query} when:${days}d`)}&${PH}`;
// `priority` games (the ones played most at the shop) come first and get their own side-menu links; the rest follow.
// `links` are official pages (checked to exist) for updates and rules. A game with no recent news and no links is
// left off the page.
const GAMING = [
  { title: 'Roblox', priority: true, query: 'Roblox', days: 14, must: [/roblox/i],
    links: [['Official newsroom', 'https://about.roblox.com/newsroom'],
      ['Parental controls', 'https://about.roblox.com/parental-controls']] },
  { title: 'CrossFire', priority: true, query: '"CrossFire" (Smilegate OR "CrossFire: Legends" OR esports OR codes OR update)', days: 60,
    must: [/cross\s?fire/i, /smilegate|legends|codes|update|patch|tournament|esports|season|league|\bcf\b/i],
    not: /steel crossfire|killed|shot|shooting|gunman|gunfire|police|soldier|military|war\b|attack/i },
  { title: 'Rules of Survival', priority: true, query: '"Rules of Survival" (NetEase OR game OR "battle royale")', days: 60,
    must: [/rules of survival/i, /netease|\bgame\b|battle royale|update|season|mobile/i] },
  { title: 'Valorant', priority: true, query: 'Valorant', days: 14, must: [/valorant|\bvct\b/i],
    links: [['Patch notes', 'https://playvalorant.com/en-us/news/tags/patch-notes/'],
      ['Official news', 'https://playvalorant.com/en-us/news/']] },
  { title: 'Dota 2', priority: true, query: '"Dota 2"', days: 14, must: [/dota\s?2/i],
    links: [['Patch notes', 'https://www.dota2.com/patches'], ['Official news', 'https://www.dota2.com/news']] },
  { title: 'Mobile Legends', query: '"Mobile Legends" OR MLBB OR "MPL Philippines"', days: 14,
    must: [/mobile legends|mlbb|\bmpl\b/i], links: [['Official news', 'https://www.mobilelegends.com/news']] },
  { title: 'Minecraft', query: 'Minecraft', days: 14, must: [/minecraft/i],
    links: [['Official articles', 'https://www.minecraft.net/en-us/articles']] },
  { title: 'Call of Duty: Mobile', query: '"Call of Duty: Mobile" OR CODM', days: 14,
    must: [/call of duty:? mobile|\bcodm\b/i] },
  { title: 'Genshin Impact', query: '"Genshin Impact"', days: 14, must: [/genshin/i],
    links: [['Official news', 'https://genshin.hoyoverse.com/en/news']] },
  { title: 'Free Fire', query: '"Free Fire" Garena', days: 14, must: [/free fire/i],
    links: [['Official news', 'https://ff.garena.com/en/news/']] },
];
// Tech Trends: same approach as the games, one Google News search per topic.
const TECH_TOPICS = [
  { title: 'AI', query: '"artificial intelligence" OR OpenAI OR Anthropic OR "Google Gemini" OR "AI model"', days: 7,
    must: [/\bAI\b|artificial intelligence|openai|anthropic|gemini|chatgpt|claude|\bllm/i] },
  { title: 'Automation & robotics', query: 'automation OR robotics OR robots', days: 7, must: [/automat|robot/i] },
  { title: 'Software development', query: '"software development" OR developers OR programming OR GitHub OR "open source"',
    days: 7, must: [/develop|programm|github|open.source|coding|software/i],
    not: /condo|housing|real estate|property|residential|subdivision|township/i },
  { title: 'Philippine tech', query: 'Philippines technology OR DICT OR "tech startup" Philippines', days: 7,
    must: [/philippine|\bph\b|\bdict\b|manila|pinoy|filipino/i] },
];
const gameId = (title) => `game-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
const PER_GAME = 5;
// Young players read the Game Zone, so headlines about betting or sexual abuse are left out of it entirely.
const GAMING_EXCLUDE = /\bbet(s|ting)?\b|gambl|casino|\bodds\b|sportsbook|sexual|abuse|predator|grooming|porn|nsfw/i;
const espn = (path) => `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard`;
const LEAGUES = [
  { title: 'NBA', url: espn('basketball/nba') },
  { title: 'Premier League', url: espn('soccer/eng.1') },
  { title: 'Champions League', url: espn('soccer/uefa.champions') },
  { title: 'La Liga', url: espn('soccer/esp.1') },
];

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
    const sourceUrl = safeUrl(decode((item.match(/<source\s+url="([^"]+)"/) ?? [])[1] ?? ''));
    return { title, source, sourceHost: sourceUrl ? new URL(sourceUrl).hostname : '', link: safeUrl(tag(item, 'link')),
      date: new Date(tag(item, 'pubDate')) };
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

async function loadForex() {
  const data = JSON.parse(await fetchText(FOREX_URL));
  if (data.result !== 'success' || !data.rates?.PHP) throw new Error('unexpected forex response');
  const rows = CURRENCIES.filter(([code]) => data.rates[code])
    .map(([code, name]) => ({ code, name, php: data.rates.PHP / data.rates[code] }));
  return { rows, updated: new Date(data.time_last_update_utc) };
}

async function loadQuote([symbol, name]) {
  const meta = JSON.parse(await fetchText(quote(symbol))).chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice;
  const prev = meta?.chartPreviousClose ?? meta?.previousClose;
  if (typeof price !== 'number') throw new Error(`no price for ${symbol}`);
  return { name, price, change: typeof prev === 'number' && prev ? (price - prev) / prev * 100 : null,
    time: new Date(meta.regularMarketTime * 1000) };
}

// A forecast time as the city's own calendar day (YYYY-MM-DD) and hour, so each city's outlook follows its local days.
const localDay = (iso, tz) => new Date(iso).toLocaleDateString('en-CA', { timeZone: tz });
const localHour = (iso, tz) => Number(new Date(iso).toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false })) % 24;

async function loadWeather([name, coords, tz, group]) {
  const res = await fetch(weatherUrl(coords), { headers: { 'user-agent': WEATHER_UA }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const series = (await res.json()).properties?.timeseries ?? [];
  if (!series.length) throw new Error(`no forecast for ${name}`);
  const now = series[0];
  const days = new Map();
  for (const point of series) {
    const day = localDay(point.time, tz);
    const temp = point.data.instant.details.air_temperature;
    const entry = days.get(day) ?? { day, min: temp, max: temp, symbol: null };
    entry.min = Math.min(entry.min, temp);
    entry.max = Math.max(entry.max, temp);
    // Describe the day by the 6-hour forecast starting around local midday (later points are 6-hourly).
    const sixHour = point.data.next_6_hours?.summary?.symbol_code;
    const hour = localHour(point.time, tz);
    if (sixHour && (!entry.symbol || (hour >= 10 && hour <= 13))) entry.symbol = sixHour;
    days.set(day, entry);
  }
  return {
    name,
    tz,
    group,
    temp: now.data.instant.details.air_temperature,
    humidity: now.data.instant.details.relative_humidity,
    symbol: now.data.next_1_hours?.summary?.symbol_code ?? now.data.next_6_hours?.summary?.symbol_code,
    rain6h: now.data.next_6_hours?.details?.precipitation_amount ?? null,
    days: [...days.values()].slice(0, 4),
  };
}

async function loadPseStocks() {
  const { stocks } = JSON.parse(await fetchText(PSE_URL));
  const bySymbol = new Map(stocks.map((s) => [s.symbol, s]));
  return PSE_STOCKS.map(([symbol, name]) => bySymbol.get(symbol) && { name, price: bySymbol.get(symbol).price?.amount,
    change: bySymbol.get(symbol).percentChange ?? null })
    .filter((s) => typeof s?.price === 'number');
}

async function loadNewsGroup(game) {
  const articles = (await loadSection({ url: newsSearch(game.query, game.days) }))
    .filter((a) => game.must.every((re) => re.test(a.title)) && !game.not?.test(a.title) && !GAMING_EXCLUDE.test(a.title)
      && !game.sourceNot?.test(a.source))
    .sort((a, b) => b.date - a.date);
  const seenTitles = new Set();
  return { title: game.title, priority: Boolean(game.priority), links: game.links ?? [],
    articles: articles.filter((a) => !seenTitles.has(a.title) && seenTitles.add(a.title)).slice(0, PER_GAME) };
}

const settledValues = async (promises) => (await Promise.allSettled(promises))
  .filter((r) => r.status === 'fulfilled').map((r) => r.value);

async function loadScores(league) {
  const data = JSON.parse(await fetchText(league.url));
  const games = (data.events ?? []).map((event) => {
    const comp = event.competitions?.[0];
    const side = (where) => comp?.competitors?.find((c) => c.homeAway === where);
    const away = side('away'), home = side('home');
    if (!away || !home) return null;
    return {
      away: away.team?.shortDisplayName ?? away.team?.abbreviation, home: home.team?.shortDisplayName ?? home.team?.abbreviation,
      awayScore: away.score, homeScore: home.score, state: event.status?.type?.state,
      detail: event.status?.type?.shortDetail ?? '', date: new Date(event.date),
    };
  }).filter(Boolean).slice(0, 12);
  return { title: league.title, games };
}

// --- rendering ------------------------------------------------------------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function ad(kind) {
  const slot = AD_SLOTS[kind];
  // No placeholder boxes: empty "Advertisement" slots look unfinished to AdSense reviewers.
  if (!AD_CLIENT || !slot) return '';
  return `<div class="ad ad-${kind}"><span class="ad-label">Advertisement</span>`
    + `<ins class="adsbygoogle" style="display:block" data-ad-client="${esc(AD_CLIENT)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>`
    + `<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
}

function timeTag(date) {
  return Number.isNaN(date.getTime()) ? '' : `<time datetime="${date.toISOString()}">${esc(date.toUTCString())}</time>`;
}

// The feeds carry no article photos (and publishers' photos aren't ours to reuse), so each card shows the
// publisher's logo from Google's favicon service instead.
const logo = (host, size) => (host
  ? `<img class="thumb" src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&amp;sz=64" alt="" width="${size}" height="${size}" loading="lazy">`
  : '');

function card(article, lead) {
  return `<article class="card${lead ? ' lead' : ''}">${logo(article.sourceHost, lead ? 48 : 36)}<div class="card-body">
  <a href="${esc(article.link)}" target="_blank" rel="noopener nofollow">${esc(article.title)}</a>
  <p class="meta"><span>${esc(article.source)}</span>${timeTag(article.date)}</p>
</div></article>`;
}

function section(sec, articles) {
  const parts = [];
  articles.forEach((a, i) => {
    parts.push(card(a, i === 0));
    if ((i + 1) % AD_EVERY === 0 && i < articles.length - 1) parts.push(ad('infeed'));
  });
  return `<section id="${sec.id}"><h2>${esc(sec.title)}</h2><p class="intro">${esc(sec.intro)}</p><div class="cards">${parts.join('\n')}</div></section>\n${ad('infeed')}`;
}

const manilaTime = (date, opts) => date.toLocaleString('en-PH', { timeZone: 'Asia/Manila', ...opts });
const num = (n, digits) => n.toLocaleString('en-PH', { minimumFractionDigits: digits, maximumFractionDigits: digits });

function marketsBlock({ forex, stocks, indices }) {
  if (!forex && !stocks.length && !indices.length) return '';
  const change = (c) => (c == null ? '' : `<span class="${c >= 0 ? 'up' : 'down'}">${c >= 0 ? '▲' : '▼'} ${num(Math.abs(c), 2)}%</span>`);
  const quotes = (title, rows) => (rows.length ? `<div><h3>${title}</h3><table><thead><tr><th>Name</th><th>Price</th><th>Change</th></tr></thead><tbody>${
    rows.map((q) => `<tr><td>${esc(q.name)}</td><td>${num(q.price, 2)}</td><td>${change(q.change)}</td></tr>`).join('')}</tbody></table></div>` : '');
  const fx = forex ? `<div><h3>Peso exchange rates</h3><table><thead><tr><th>Currency</th><th>In pesos</th></tr></thead><tbody>${
    forex.rows.map((r) => `<tr><td>1 ${r.code} <small>${esc(r.name)}</small></td><td>₱${num(r.php, r.php < 1 ? 4 : 2)}</td></tr>`).join('')}</tbody></table>
<p class="source">Reference rates as of ${esc(manilaTime(forex.updated, { dateStyle: 'medium' }))} from <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Rates By Exchange Rate API</a>. Banks and remittance centers use their own buy and sell rates.</p></div>` : '';
  const sources = [stocks.length && 'PSE stocks: closing prices via the Phisix PSE feed', indices.length && 'indices: Yahoo Finance']
    .filter(Boolean).join('; ');
  return `<section id="markets"><h2>Markets</h2><p class="intro">The peso against major and OFW-destination currencies, plus the Philippine Stock Exchange and world indices.</p>
<div class="data-grid">${fx}<div>${quotes('Philippine blue chips', stocks)}${quotes('Indices', indices)}
${sources ? `<p class="source">Delayed prices for information only, not investment advice (${sources}).</p>` : ''}</div></div></section>`;
}

const WEATHER_ICONS = [
  ['thunder', '⛈️', 'Thunderstorms'], ['heavyrain', '🌧️', 'Heavy rain'], ['rainshowers', '🌦️', 'Rain showers'],
  ['lightrain', '🌦️', 'Light rain'], ['rain', '🌧️', 'Rain'], ['fog', '🌫️', 'Fog'], ['clearsky', '☀️', 'Clear'],
  ['fair', '🌤️', 'Fair'], ['partlycloudy', '⛅', 'Partly cloudy'], ['cloudy', '☁️', 'Cloudy'],
];
function weatherIcon(symbol) {
  const base = (symbol ?? '').replace(/_(day|night|polartwilight)$/, '');
  const [, icon, label] = WEATHER_ICONS.find(([key]) => base.includes(key)) ?? ['', '🌡️', 'Forecast'];
  return { icon, label };
}

const clockText = (date, tz) => date.toLocaleString('en-PH', { timeZone: tz, weekday: 'short', hour: 'numeric', minute: '2-digit' });

function weatherBlock(cities) {
  if (!cities.length) return '';
  const weekday = (day) => new Date(`${day}T12:00:00Z`).toLocaleDateString('en-PH', { weekday: 'short', timeZone: 'UTC' });
  const card = (c) => {
    const now = weatherIcon(c.symbol);
    const today = c.days[0];
    const outlook = c.days.slice(1, 4).map((d) => {
      const w = weatherIcon(d.symbol);
      return `<li><span>${esc(weekday(d.day))}</span><span title="${esc(w.label)}">${w.icon}</span><span>${Math.round(d.max)}° / ${Math.round(d.min)}°</span></li>`;
    }).join('');
    return `<div class="wx"><div class="wx-now"><span class="wx-icon" aria-hidden="true">${now.icon}</span><div><h3>${esc(c.name)}</h3>
<p><b>${Math.round(c.temp)}°C</b> ${esc(now.label)}</p></div></div>
<p class="wx-time">Local time: <span class="clock" data-tz="${esc(c.tz)}">${esc(clockText(new Date(), c.tz))}</span></p>
<p class="wx-meta">Rest of today ${Math.round(today.max)}° / ${Math.round(today.min)}° · Humidity ${Math.round(c.humidity)}%${c.rain6h != null ? ` · Rain next 6h: ${num(c.rain6h, 1)} mm` : ''}</p>
<ul class="wx-days">${outlook}</ul></div>`;
  };
  const groups = WEATHER_GROUPS.map((g) => [g.title, cities.filter((c) => c.group === g.title)])
    .filter(([, list]) => list.length)
    .map(([title, list]) => `<h3 class="wx-group">${esc(title)}</h3><div class="wx-grid">${list.map(card).join('')}</div>`).join('');
  // Clocks are filled in by the visitor's browser so they stay current between the 30-minute rebuilds.
  const clocks = `<script>(function(){function tick(){document.querySelectorAll('.clock').forEach(function(t){`
    + `t.textContent=new Date().toLocaleString('en-PH',{timeZone:t.dataset.tz,weekday:'short',hour:'numeric',minute:'2-digit'})})}`
    + `tick();setInterval(tick,30000)})();</script>`;
  return `<section id="weather"><h2>Weather &amp; world time</h2><p class="intro">Current conditions, local time and the 3-day outlook in the Philippines and the countries where many Filipinos live and work. For typhoon signals and warnings, always follow <a href="https://www.pagasa.dost.gov.ph" target="_blank" rel="noopener">PAGASA</a> — see our <a href="typhoon-signals-preparedness.html">typhoon signals guide</a>.</p>
${groups}
<p class="source">Forecast data from <a href="https://www.met.no/en" target="_blank" rel="noopener">MET Norway</a> (CC BY 4.0), updated about every 30 minutes. Days follow each city's local calendar.</p>${clocks}</section>`;
}

/** A card of headlines for one news group (a game or a tech topic), with optional official links. */
function newsCard(g) {
  const news = g.articles.length ? `<ul class="headlines">${g.articles.map((a) => `<li>
<a href="${esc(a.link)}" target="_blank" rel="noopener nofollow">${esc(a.title)}</a>
<span class="meta"><span>${esc(a.source)}</span>${timeTag(a.date)}</span></li>`).join('')}</ul>` : '<p class="source">No new headlines this week.</p>';
  const official = g.links.length ? `<p class="official">Official: ${g.links.map(([label, url]) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`).join(' · ')}</p>` : '';
  return `<div id="${gameId(g.title)}"><h3>${esc(g.title)}</h3>${news}${official}</div>`;
}

// Each game is a full-width row of headline cards, laid out like the news sections.
function gameRow(g) {
  const official = g.links.length ? `<span class="official">Official: ${g.links.map(([label, url]) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`).join(' · ')}</span>` : '';
  const cards = g.articles.length ? `<div class="cards">${g.articles.map((a) => card(a, false)).join('\n')}</div>`
    : '<p class="source">No new headlines this week.</p>';
  return `<div class="game-row" id="${gameId(g.title)}"><div class="game-head"><h3>${esc(g.title)}</h3>${official}</div>${cards}</div>`;
}

function gamingBlock(games) {
  const shown = games.filter((g) => g.articles.length || g.links.length);
  if (!shown.length) return '';
  const top = shown.filter((g) => g.priority).map(gameRow).join('');
  const more = shown.filter((g) => !g.priority).map(gameRow).join('');
  return `<section id="gaming"><h2>Game Zone</h2><p class="intro">The latest news, updates and patch notes for Roblox, CrossFire, Rules of Survival, Valorant, Dota 2 and more. Play safe: read our guides to <a href="gaming-scams-free-robux.html">"free Robux" and other scams</a> and <a href="protect-gaming-accounts.html">protecting your gaming accounts</a>.</p>
${top}
${more ? `${ad('infeed')}<h3 class="wx-group">More games</h3>${more}` : ''}<p class="source">Headlines link to their original publishers via Google News; official links go to each game's own website. ${esc(SITE_NAME)} is not affiliated with any game publisher.</p></section>`;
}

function fuelBlock({ news, crude }) {
  const articles = news?.articles ?? [];
  if (!articles.length && !crude.length) return '';
  const change = (c) => (c == null ? '' : `<span class="${c >= 0 ? 'up' : 'down'}">${c >= 0 ? '▲' : '▼'} ${num(Math.abs(c), 2)}%</span>`);
  const crudeTable = crude.length ? `<div><h3>World oil prices</h3><table><thead><tr><th>Benchmark</th><th>US$ / barrel</th><th>Change</th></tr></thead><tbody>${
    crude.map((q) => `<tr><td>${esc(q.name)}</td><td>${num(q.price, 2)}</td><td>${change(q.change)}</td></tr>`).join('')}</tbody></table>
<p class="source">Crude prices drive local pump prices with a delay of about a week. Delayed prices from Yahoo Finance.</p></div>` : '';
  const updates = articles.length ? `<div><h3>This week at the pump</h3><ul class="headlines">${articles.map((a) => `<li>
<a href="${esc(a.link)}" target="_blank" rel="noopener nofollow">${esc(a.title)}</a>
<span class="meta"><span>${esc(a.source)}</span>${timeTag(a.date)}</span></li>`).join('')}</ul></div>` : '';
  return `<section id="fuel"><h2>Fuel prices</h2><p class="intro">Gasoline, diesel and kerosene price adjustments in the Philippines are usually announced on Monday and take effect on Tuesday. For official pump prices by area, see the <a href="${DOE_OIL_MONITOR}" target="_blank" rel="noopener">DOE Oil Monitor</a>.</p>
<div class="data-grid">${updates}${crudeTable}</div><p class="source">Pump price headlines link to their original publishers via Google News.</p></section>`;
}

function techBlock(topics) {
  const shown = topics.filter((t) => t.articles.length);
  if (!shown.length) return '';
  return `<section id="tech-trends"><h2>Tech Trends</h2><p class="intro">What's new in AI, automation, software development and Philippine tech. New to AI tools? Start with our guides to <a href="ai-chatbots-for-school-and-work.html">using AI chatbots</a> and <a href="ai-prompt-writing-tips.html">writing better prompts</a>.</p>
<div class="data-grid">${shown.map(newsCard).join('')}</div><p class="source">Headlines link to their original publishers via Google News.</p></section>`;
}

function scoresBlock(leagues) {
  const withGames = leagues.filter((l) => l.games.length);
  if (!withGames.length) return '';
  const score = (g) => (g.state === 'pre'
    ? `<span class="when">${esc(manilaTime(g.date, { weekday: 'short', hour: 'numeric', minute: '2-digit' }))}</span>`
    : `<b>${esc(g.awayScore ?? '')}–${esc(g.homeScore ?? '')}</b> <span class="when">${esc(g.detail)}</span>`);
  const lists = withGames.map((l) => `<div><h3>${esc(l.title)}</h3><ul class="games">${
    l.games.map((g) => `<li><span>${esc(g.away)} <small>at</small> ${esc(g.home)}</span>${score(g)}</li>`).join('')}</ul></div>`).join('');
  return `<section id="scores"><h2>Scores &amp; schedule</h2><p class="intro">Latest NBA and football results and upcoming games. Upcoming times are in Manila time; scores refresh about every 30 minutes.</p>
<div class="data-grid">${lists}</div><p class="source">Scores and schedules from ESPN.</p></section>`;
}

const STYLE = `
:root{--bg:#f4f5f7;--surface:#fff;--text:#14171c;--muted:#5d6673;--line:#e1e4e8;--accent:#c8102e;--accent-2:#0038a8;--chip:#eef1f6}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0f1115;--surface:#181b21;--text:#e8eaee;--muted:#9aa3ae;--line:#2a2f37;--accent:#ff4d64;--accent-2:#6d9bff;--chip:#222730;color-scheme:dark}}
:root[data-theme=dark]{--bg:#0f1115;--surface:#181b21;--text:#e8eaee;--muted:#9aa3ae;--line:#2a2f37;--accent:#ff4d64;--accent-2:#6d9bff;--chip:#222730;color-scheme:dark}
.theme-toggle{margin-left:auto;align-self:center;flex:none;width:38px;height:38px;border:1px solid var(--line);border-radius:50%;background:var(--bg);color:var(--text);font-size:1.1rem;line-height:1;cursor:pointer}
.theme-toggle:hover{border-color:var(--accent-2)}
.theme-toggle .sun,:root[data-theme=dark] .theme-toggle .moon{display:none}
:root[data-theme=dark] .theme-toggle .sun{display:inline}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .theme-toggle .sun{display:inline}:root:not([data-theme=light]) .theme-toggle .moon{display:none}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:inherit}
header{background:var(--surface);border-bottom:3px solid var(--accent);position:sticky;top:0;z-index:10}
.bar{max-width:1240px;margin:auto;padding:12px 16px;display:flex;align-items:center;gap:10px 16px;flex-wrap:wrap}
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
.intro{margin:-6px 0 12px;color:var(--muted);font-size:.92rem}
.promo{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:24px 0}
.promo h2{margin:0 0 10px;font-size:1.1rem;border:0;padding:0}
.promo ul{margin:0;padding-left:18px;display:grid;gap:6px}
.promo a,.source a{color:var(--accent-2);font-weight:600}
.data-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.data-grid>div{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px 14px;min-width:0}
.data-grid h3{margin:4px 0 8px;font-size:1rem}
.data-grid table{width:100%;border-collapse:collapse;font-size:.9rem;margin-bottom:10px}
.data-grid th,.data-grid td{padding:5px 4px;border-bottom:1px solid var(--line);text-align:right}
.data-grid th:first-child,.data-grid td:first-child{text-align:left}
.data-grid small{color:var(--muted)}
.up{color:#178a3e}.down{color:var(--accent)}
.wx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.wx{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.wx-now{display:flex;gap:10px;align-items:center}
.wx-icon{font-size:2rem;line-height:1}
.wx h3{margin:0;font-size:1rem}
.wx-now p{margin:2px 0 0}
.wx-now b{font-size:1.25rem}
.wx-meta{margin:4px 0 8px;color:var(--muted);font-size:.8rem}
.wx-time{margin:8px 0 0;font-size:.85rem;font-weight:600}
.wx-group{margin:16px 0 8px;font-size:.95rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.wx-days{list-style:none;margin:0;padding:8px 0 0;border-top:1px solid var(--line);display:grid;gap:4px;font-size:.88rem}
.wx-days li{display:grid;grid-template-columns:3em 1.8em 1fr;align-items:center}
.wx-days li span:last-child{text-align:right}
.game-row{margin:0 0 20px}
.game-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin:18px 0 10px}
.game-head h3{margin:0;font-size:1.05rem}
.game-head .official{font-size:.82rem;color:var(--muted)}
.game-head .official a{color:var(--accent-2)}
.card{display:flex;gap:12px;align-items:flex-start}
.card-body{min-width:0;flex:1}
.thumb{flex:none;border-radius:8px;background:var(--chip);padding:4px;border:1px solid var(--line)}
.search{display:flex;gap:6px;flex:1 1 260px;max-width:420px;margin-left:auto}
.search input{flex:1;min-width:0;padding:8px 12px;border:1px solid var(--line);border-radius:999px;background:var(--bg);color:var(--text);font:inherit;font-size:.9rem}
.search button{padding:8px 14px;border:0;border-radius:999px;background:var(--accent-2);color:#fff;font:inherit;font-size:.9rem;font-weight:600;cursor:pointer}
.search+.theme-toggle{margin-left:0}
@media (max-width:640px){.search{order:3;flex-basis:100%;max-width:none;margin-left:0}}
.channel-list li{display:flex;gap:14px;align-items:center}
.avatar{flex:none;border-radius:50%;border:1px solid var(--line);object-fit:cover}
.guide-list{list-style:none;padding:0;margin:0 0 8px}
.guide-list li{padding:10px 0;border-bottom:1px solid var(--line)}
.guide-list li a{font-weight:700}
.guide-list li span{display:block;color:var(--muted);font-size:.9rem;margin-top:2px}
.headlines{list-style:none;margin:0;padding:0}
.headlines li{padding:8px 0;border-bottom:1px solid var(--line)}
.headlines li:last-child{border-bottom:0}
.headlines a{text-decoration:none;font-weight:600;font-size:.92rem}
.headlines a:hover{color:var(--accent-2);text-decoration:underline}
.headlines .meta{margin-top:4px}
.games{list-style:none;margin:0;padding:0;font-size:.9rem}
.games li{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line)}
.when{color:var(--muted);font-size:.8rem;white-space:nowrap}
.games b{white-space:nowrap}
.source{color:var(--muted);font-size:.78rem;margin:8px 0 0}
.cta{display:inline-block;margin:8px 0 4px;padding:10px 16px;border-radius:8px;background:var(--accent-2);color:#fff!important;text-decoration:none;font-weight:700}
.note{color:var(--muted);font-size:.9rem;border-top:1px solid var(--line);padding-top:12px}
.byline{color:var(--muted);font-size:.9rem;margin-top:-8px}
.layout.single{grid-template-columns:minmax(0,1fr)}
.prose{max-width:760px;margin:8px auto 0;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:8px 24px 24px}
.prose a{color:var(--accent-2)}
footer{color:var(--muted);font-size:.8rem;text-align:center;padding:24px 16px 80px}
footer nav{justify-content:center;padding:8px 0 0}
.with-side{display:grid;grid-template-columns:210px minmax(0,1fr);gap:28px;align-items:start}
.side{position:sticky;top:110px;max-height:calc(100vh - 120px);overflow-y:auto;padding-bottom:16px}
.side-list h2{margin:16px 0 4px;padding:0 10px;font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);border:0}
.side-list h2:first-child{margin-top:4px}
.side .side-list{display:block;max-width:none;margin:0;padding:0;overflow:visible;font-weight:400}
.side-list a{display:block;padding:5px 10px;border-radius:8px;text-decoration:none;font-size:.9rem;color:var(--text);white-space:normal}
.side-list a:hover{background:var(--chip);color:var(--accent-2)}
.side-list a[aria-current=page]{background:var(--chip);color:var(--accent);font-weight:700}
.side-list .all{color:var(--accent-2);font-weight:600}
.side-toggle{display:none}
@media (max-width:900px){.layout{grid-template-columns:1fr}aside{display:none}
.with-side{grid-template-columns:minmax(0,1fr);gap:0}
.side{position:static;max-height:none;overflow:visible;padding:0 0 4px}
.side-toggle{display:flex;justify-content:space-between;width:100%;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--text);font:inherit;font-weight:600;cursor:pointer}
.side .side-list{display:none;margin-top:8px;padding:4px 8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--surface)}
.side.open .side-list{display:block}
.side.open .side-toggle span{display:inline-block;transform:rotate(180deg)}}
@media (max-width:560px){.cards{grid-template-columns:1fr}.card.lead a{font-size:1.15rem}.prose{padding:4px 16px 16px}}
`;

const DESCRIPTION = 'The latest trending news in the Philippines and around the world, updated every 30 minutes.';
const PAGES = [
  { file: 'about.html', label: 'About Us' },
  { file: 'affiliates.html', label: 'Our affiliates & other content' },
  { file: 'editorial-policy.html', label: 'Editorial Policy' },
  { file: 'contact.html', label: 'Contact' },
  { file: 'privacy.html', label: 'Privacy Policy' },
];
const FAVICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#c8102e"/>'
  + '<path d="M7 22l6-7 5 4 7-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// Light/dark switch: the saved choice is applied in <head> so the page never flashes the wrong theme; with no saved
// choice the device setting wins. Storage can be unavailable (private mode), hence the try/catch.
const THEME_INIT = "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";
const THEME_TOGGLE = "document.getElementById('theme-toggle').addEventListener('click',function(){"
  + "var root=document.documentElement,dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;"
  + "root.dataset.theme=dark?'light':'dark';try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}});"
  + "document.getElementById('side-toggle').addEventListener('click',function(){"
  + "var open=this.parentNode.classList.toggle('open');this.setAttribute('aria-expanded',open)});";
const SITE_LINKS = `<a href="guides.html">Guides</a><a href="${TOOLS_URL}/internet-speed-test/">Speed test</a>`
  + `<a href="${TOOLS_URL}/">Free tools</a>`;

function shell({ file, title, nav, body, description = DESCRIPTION, schema }) {
  const adScript = AD_CLIENT
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(AD_CLIENT)}" crossorigin="anonymous"></script>`
    : '';
  const canonical = SITE_URL ? `<link rel="canonical" href="${esc(`${SITE_URL}/${file === 'index.html' ? '' : file}`)}">` : '';
  const pageLinks = SITE_LINKS + PAGES.map((p) => `<a href="${p.file}">${esc(p.label)}</a>`).join('');
  const adAccount = (AD_CLIENT ? `<meta name="google-adsense-account" content="${esc(AD_CLIENT)}">` : '')
    + (GOOGLE_VERIFY ? `<meta name="google-site-verification" content="${esc(GOOGLE_VERIFY)}">` : '')
    + (BING_VERIFY ? `<meta name="msvalidate.01" content="${esc(BING_VERIFY)}">` : '');
  const analytics = GA_ID ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(GA_ID)}"></script>`
    + `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(GA_ID)}');</script>` : '';
  const ld = schema ?`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>` : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${canonical}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="${schema?.['@type'] === 'Article' ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta name="theme-color" content="#c8102e">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
${adAccount}
${ld}
${analytics}
${adScript}
<style>${STYLE}</style>
<script>${THEME_INIT}</script>
</head>
<body>
<header>
  <div class="bar"><a class="brand" href="./">${esc(SITE_NAME).replace(/ (\S+)$/, ' <span>$1</span>')}</a>${nav.updated ?? ''}
    <form class="search" role="search" action="https://www.google.com/search" method="get" target="_blank"><input type="search" name="q" placeholder="Search Google" aria-label="Search Google" required><button type="submit">Search</button></form>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch light or dark theme"><span class="moon" aria-hidden="true">☾</span><span class="sun" aria-hidden="true">☀</span></button></div>
  <nav>${nav.links}</nav>
</header>
<div class="wrap with-side">
${sideMenu(file)}
<div class="content">
${body}
</div>
</div>
<footer>
  <div>Headlines link to their original publishers via Google News. Guides are written by the ${esc(SITE_NAME)} team.</div>
  <nav>${pageLinks}</nav>
  <div>© ${new Date().getFullYear()} ${esc(SITE_NAME)}</div>
</footer>
<script>${THEME_TOGGLE}</script>
</body>
</html>
`;
}

function home({ sections, trends, builtAt, markets, scores, weather, gaming, tech, fuel }) {
  const marketsHtml = marketsBlock(markets);
  const scoresHtml = scoresBlock(scores);
  const weatherHtml = weatherBlock(weather);
  const gamingHtml = gamingBlock(gaming);
  const techHtml = techBlock(tech);
  const fuelHtml = fuelBlock(fuel);
  // Page order: weather and world time first, then Top Stories, Philippines and World, then the Game Zone, then the
  // other sections, each followed by its data blocks (Business → markets and fuel prices, Technology → tech trends,
  // Sports → scores). A block whose section failed to load goes at the end.
  const after = { world: gamingHtml && gamingHtml + ad('infeed'), business: marketsHtml + fuelHtml, tech: techHtml,
    sports: scoresHtml };
  const afterNav = { world: [['gaming', 'Game Zone', gamingHtml]],
    business: [['markets', 'Markets', marketsHtml], ['fuel', 'Fuel prices', fuelHtml]],
    tech: [['tech-trends', 'Tech Trends', techHtml]], sports: [['scores', 'Scores', scoresHtml]] };
  const placed = new Set(sections.map(({ sec }) => sec.id).filter((id) => after[id]));
  const extras = Object.entries(after).filter(([id]) => !placed.has(id)).map(([, html]) => html).join('\n');
  const mainHtml = (weatherHtml && weatherHtml + ad('infeed')) + sections.map(({ sec, articles }) => section(sec, articles) + (after[sec.id] ?? '')
    + (sec.id === 'world' ? promoBlocks() : '')).join('\n') + extras;
  const navLinks = (weatherHtml ? '<a href="#weather">Weather &amp; time</a>' : '')
    + sections.map(({ sec }) => `<a href="#${sec.id}">${esc(sec.title)}</a>` + (afterNav[sec.id] ?? [])
      .filter(([, , html]) => html).map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')).join('');
  const manila = builtAt.toLocaleString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' });
  const chips = trends.map((t) => `<a class="chip" href="${esc(t.link)}" target="_blank" rel="noopener nofollow">${esc(t.term)}${t.traffic ? ` <small>${esc(t.traffic)}</small>` : ''}</a>`).join('');
  const sidebar = ad('sidebar') + ad('sidebar');
  const body = `  ${ad('top')}
  ${chips ? `<div class="trending"><b>Trending in PH</b>${chips}</div>` : ''}
  <div class="layout${sidebar ? '' : ' single'}">
    <main>
${mainHtml}
    </main>
    ${sidebar ? `<aside>${sidebar}</aside>` : ''}
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
      links: navLinks + SITE_LINKS,
    },
    body,
    schema: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, description: DESCRIPTION,
      ...(SITE_URL && { url: `${SITE_URL}/` }) },
  });
}

const TOOL_LINKS = [
  ['internet-speed-test/', 'Internet speed test'],
  ['take-home-pay-calculator/', 'Take-home pay calculator (SSS, PhilHealth, tax)'],
  ['13th-month-pay-calculator/', '13th month pay calculator'],
  ['loan-calculator/', 'Loan calculator'],
  ['savings-goal-calculator/', 'Savings goal calculator'],
  ['percentage-calculator/', 'Percentage calculator'],
  ['date-difference-calculator/', 'Days between dates'],
];

// Every calculator on the tools site, grouped as in its own side menu.
const ALL_TOOLS = [
  ['Internet', [['internet-speed-test/', 'Speed test']]],
  ['Pay & taxes', [['take-home-pay-calculator/', 'Take-home pay'], ['13th-month-pay-calculator/', '13th month pay']]],
  ['Money', [['loan-calculator/', 'Loan'], ['compound-interest-calculator/', 'Compound interest'],
    ['savings-goal-calculator/', 'Savings goal'], ['discount-calculator/', 'Discount'], ['tip-calculator/', 'Tip'],
    ['percentage-calculator/', 'Percentage']]],
  ['Dates, health & units', [['age-calculator/', 'Age'], ['date-difference-calculator/', 'Days between dates'],
    ['bmi-calculator/', 'BMI'], ['unit-converter/', 'Unit converter']]],
];

/** Left menu on every page: news sections, markets and scores, every calculator, and guides. */
function sideMenu(file) {
  const home = file === 'index.html' ? '' : './'; // section anchors live on the home page
  const link = (href, label, current) => `<a href="${esc(href)}"${current ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  const sectionLink = (id) => link(`${home}#${id}`, SECTIONS.find((s) => s.id === id).title);
  // Same order as the home page.
  const weatherLinks = link(`${home}#weather`, 'Weather & world time');
  const news = ['top', 'philippines', 'world'].map(sectionLink).join('');
  const games = GAMING.filter((g) => g.priority).map((g) => link(`${home}#${gameId(g.title)}`, g.title)).join('')
    + link(`${home}#gaming`, 'More games')
    + link('gaming-scams-free-robux.html', 'Avoid gaming scams', file === 'gaming-scams-free-robux.html');
  const moreNews = sectionLink('business') + link(`${home}#markets`, 'Markets: peso & stocks')
    + link(`${home}#fuel`, 'Fuel prices: gas & diesel')
    + sectionLink('tech') + link(`${home}#tech-trends`, 'Tech Trends: AI & automation')
    + sectionLink('entertainment') + sectionLink('sports') + link(`${home}#scores`, 'Scores: NBA & football');
  const tools = ALL_TOOLS.map(([group, items]) => `<h2>Tools: ${esc(group)}</h2>`
    + items.map(([path, label]) => link(`${TOOLS_URL}/${path}`, label)).join('')).join('')
    + `<a class="all" href="${esc(TOOLS_URL)}/">All free tools →</a>`;
  const guides = link('guides.html', 'All guides', file === 'guides.html')
    + GUIDES.slice(0, 3).map((g) => link(`${g.slug}.html`, g.title.split(':')[0], file === `${g.slug}.html`)).join('');
  return `<div class="side"><button type="button" class="side-toggle" id="side-toggle" aria-expanded="false" aria-controls="side-list">`
    + `Menu: news, games, tools &amp; guides <span aria-hidden="true">▾</span></button>`
    + `<nav class="side-list" id="side-list" aria-label="Site menu"><h2>Weather</h2>${weatherLinks}<h2>News</h2>${news}`
    + `<h2>Game Zone</h2>${games}<h2>More news</h2>${moreNews}`
    + `${tools}<h2>Guides</h2>${guides}</nav></div>`;
}

function promoBlocks() {
  const guides = GUIDES.slice(0, 6).map((g) => `<li><a href="${g.slug}.html">${esc(g.title)}</a></li>`).join('')
    + '<li><a href="guides.html">All guides →</a></li>';
  const tools = TOOL_LINKS.map(([path, label]) => `<li><a href="${TOOLS_URL}/${path}">${esc(label)}</a></li>`).join('');
  return `<div class="promo"><h2>Guides from ${esc(SITE_NAME)}</h2><ul>${guides}</ul></div>
<div class="promo"><h2>Free tools</h2><ul>${tools}</ul></div>`;
}

function infoPage(file, heading, content, { description, schema } = {}) {
  return shell({
    file,
    title: `${heading} — ${SITE_NAME}`,
    nav: { links: `<a href="./">← Headlines</a>${SITE_LINKS}` },
    body: `<article class="prose"><h1>${esc(heading)}</h1>\n${content}\n</article>`,
    description,
    schema,
  });
}

function guidePages() {
  const pages = {};
  const longDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-PH', { dateStyle: 'long', timeZone: 'UTC' });
  for (const g of GUIDES) {
    const cta = g.tool ? `<p><a class="cta" href="${TOOLS_URL}/${g.tool.path}">${esc(g.tool.label)} →</a></p>` : '';
    const others = GUIDES.filter((o) => o !== g).map((o) => `<li><a href="${o.slug}.html">${esc(o.title)}</a></li>`).join('');
    pages[`${g.slug}.html`] = infoPage(`${g.slug}.html`, g.title, `<p class="byline">By the ${esc(SITE_NAME)} team · Updated ${esc(longDate(g.updated))}</p>
${g.body}
${cta}
<h2>More guides</h2><ul>${others}</ul>`, {
      description: g.description,
      schema: { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description,
        dateModified: g.updated, author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME },
        ...(SITE_URL && { mainEntityOfPage: `${SITE_URL}/${g.slug}.html` }) },
    });
  }
  const bySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  const grouped = new Set(GUIDE_TOPICS.flatMap(([, slugs]) => slugs));
  const topics = [...GUIDE_TOPICS, ['More guides', GUIDES.filter((g) => !grouped.has(g.slug)).map((g) => g.slug)]];
  const list = topics.map(([topic, slugs]) => {
    const items = slugs.map((s) => bySlug.get(s)).filter(Boolean);
    if (!items.length) return '';
    const id = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `<h2 id="${id}">${esc(topic)}</h2><ul class="guide-list">${items.map((g) =>
      `<li><a href="${g.slug}.html">${esc(g.title)}</a><span>${esc(g.description)}</span></li>`).join('')}</ul>`;
  }).join('\n');
  pages['guides.html'] = infoPage('guides.html', 'Guides', `<p>Practical, plain-English guides on money, work, gaming, online safety and technology in the Philippines.</p>
${list}
<h2>Free calculators</h2>
<p>Work out the numbers with our <a href="${TOOLS_URL}/">free online calculators</a> — loans, savings, 13th month pay and more.</p>`,
  { description: `Practical guides from ${SITE_NAME} on money, work and staying informed in the Philippines.` });
  return pages;
}

function infoPages(builtAt) {
  const name = esc(SITE_NAME);
  const updated = builtAt.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'long' });
  const email = CONTACT_EMAIL ? `<a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a>` : 'our email address (coming soon)';
  const channelLinks = (c) => c.links.map(([platform, url]) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(platform)}</a>`).join(' · ');
  // Profile pictures live in assets/channels/<name-as-slug>.jpg; a channel without one just shows its name.
  const channelIcon = (c) => {
    const file = `assets/channels/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`;
    return existsSync(file) ? `<img class="avatar" src="${file}" alt="${esc(c.name)} profile picture" width="56" height="56" loading="lazy">` : '';
  };
  const channelList = `<ul class="guide-list channel-list">${CHANNELS.map((c) => `<li>${channelIcon(c)}<div><b>${esc(c.name)}</b>`
    + `${c.about ? `<span>${esc(c.about)}</span>` : ''}<span>${channelLinks(c)}</span></div></li>`).join('')}</ul>`;
  const services = `<h2 id="work-with-us">Work with us</h2>
<p>The team behind ${name} also builds websites, apps and AI solutions for businesses and creators:</p>
<ul class="guide-list">${SERVICES.map(([title, text]) => `<li><b>${esc(title)}</b><span>${esc(text)}</span></li>`).join('')}</ul>
<p>To discuss a project, email ${email} or see our <a href="contact.html">Contact</a> page.</p>`;

  return {
    'affiliates.html': infoPage('affiliates.html', 'Our Affiliates & Other Content', `
<p>${name} is part of a small family of channels and pages. Follow us for learning videos, quotes, stories and more.</p>
${channelList}
${services}`,
    { description: `Channels and pages from the team behind ${SITE_NAME}: The Pebble Minds, Echoes and Obsidian, Yanyanirism and more.` }),

    'about.html': infoPage('about.html', 'About Us', `
<p>${name} brings together the stories people in the Philippines are reading and searching for right now, in one fast page.</p>
<h2>What you'll find here</h2>
<ul>
  <li><b>Top headlines</b> from Philippine and international publishers, grouped into Philippines, World, Business, Technology, Entertainment and Sports.</li>
  <li><b>Trending searches</b> in the Philippines, so you can see what everyone is talking about today.</li>
</ul>
<h2>How it works</h2>
<p>The page refreshes about every 30 minutes. Headlines come from Google News and trending searches from Google Trends. Every headline links straight to the publisher's own website, where you can read the full story. ${name} does not copy or rewrite other publishers' articles.</p>
<p>The Weather, Markets, Scores and Gaming sections show city forecasts, peso exchange rates, Philippine and world stock prices, NBA and football games, and gaming and esports headlines, from the sources named under each one.</p>
<h2>Our own guides and tools</h2>
<p>Alongside the headlines, we publish <a href="guides.html">practical guides</a> on money and work in the Philippines — such as how to compute your 13th month pay and how to compare loan interest rates — and a set of <a href="${TOOLS_URL}/">free calculators</a> that run right in your browser.</p>
<p>${name} is independent and is not affiliated with any of the publishers it links to.</p>
<h2>Our other content</h2>
<p>The team behind ${name} also creates content on these channels — see <a href="affiliates.html">our affiliates and other content</a>.</p>
${channelList}
${services}
<h2>Get in touch</h2>
<p>Questions, corrections or suggestions? See the <a href="contact.html">Contact</a> page.</p>`),

    'editorial-policy.html': infoPage('editorial-policy.html', 'Editorial Policy', `
<p>This page explains how ${name} chooses what appears on the site and how we handle corrections.</p>
<h2>Headlines</h2>
<ul>
  <li>Headlines are selected automatically from Google News for the Philippines, grouped by topic, with duplicates removed. The page refreshes about every 30 minutes.</li>
  <li>We show each headline as published, with the publisher's name, and link to the original article. We do not edit headlines to change their meaning, and we do not host or rewrite other publishers' articles.</li>
  <li>Trending searches come from Google Trends for the Philippines and show what people are searching for, not what we endorse.</li>
</ul>
<h2>Markets and scores</h2>
<p>Exchange rates, stock prices and game results come from the third-party sources named on the page. They may be delayed and are for information only — not financial or betting advice.</p>
<h2>Guides</h2>
<ul>
  <li>Our guides are written and reviewed by the ${name} team. Each shows the date it was last updated.</li>
  <li>We explain the rules in plain language and point to the official source — such as DOLE, BIR, BSP or SEC — so readers can check the details.</li>
  <li>Guides are general information, not legal, tax or financial advice.</li>
</ul>
<h2>Independence and advertising</h2>
<p>${name} is independent and is not affiliated with the publishers we link to. Ads are clearly labelled and are served by Google; advertisers have no say over which headlines or guides appear.</p>
<h2>Corrections</h2>
<p>If something on the site is wrong — a broken link, an outdated figure in a guide, or a headline that links to the wrong story — please tell us on our <a href="contact.html">Contact</a> page. We review every report and update the page when a correction is needed.</p>`,
    { description: `How ${SITE_NAME} selects headlines, writes its guides and handles corrections.` }),

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
${GA_ID ? `<h2>Analytics</h2>
<p>We use Google Analytics to understand how visitors use the site, such as which pages are read most. It uses cookies to collect information like pages visited, time on site, device and approximate location (country or city). This information is aggregated and does not identify you personally. You can opt out with the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics opt-out browser add-on</a>.</p>` : ''}
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

const skip = (what) => (err) => (console.warn(`Skipping ${what}: ${err.message}`), null);
const [trends, forex, stocks, indices, scores, weather, gaming, tech, fuelNews, crude] = await Promise.all([
  loadTrends().catch((err) => (console.warn(`Skipping trends: ${err.message}`), [])),
  loadForex().catch(skip('forex')),
  loadPseStocks().catch((err) => (console.warn(`Skipping PSE stocks: ${err.message}`), [])),
  settledValues(WORLD_INDICES.map(loadQuote)),
  settledValues(LEAGUES.map(loadScores)),
  settledValues(CITIES.map(loadWeather)),
  settledValues(GAMING.map(loadNewsGroup)),
  settledValues(TECH_TOPICS.map(loadNewsGroup)),
  loadNewsGroup(FUEL_NEWS).catch(skip('fuel news')),
  settledValues(CRUDE.map(loadQuote)),
]);
const builtAt = new Date();
const lastmod = builtAt.toISOString().slice(0, 10);

await mkdir('dist', { recursive: true });
await cp('assets', 'dist/assets', { recursive: true });
await writeFile('dist/index.html', home({ sections, trends, builtAt, markets: { forex, stocks, indices }, scores, weather, gaming, tech,
  fuel: { news: fuelNews, crude } }));
for (const [file, html] of Object.entries({ ...infoPages(builtAt), ...guidePages() })) await writeFile(`dist/${file}`, html);
await writeFile('dist/favicon.svg', FAVICON);
if (INDEXNOW_KEY) await writeFile(`dist/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
if (AD_CLIENT) await writeFile('dist/ads.txt', `google.com, ${AD_CLIENT.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);
if (SITE_URL) {
  const pages = [['', lastmod], ['guides.html', lastmod], ...GUIDES.map((g) => [`${g.slug}.html`, g.updated]),
    ...PAGES.map((p) => [p.file, lastmod])];
  const urls = pages.map(([f, mod]) => `<url><loc>${esc(`${SITE_URL}/${f}`)}</loc><lastmod>${mod}</lastmod></url>`).join('');
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

console.log(`Built dist/: ${sections.reduce((n, s) => n + s.articles.length, 0)} headlines, ${trends.length} trends, `
  + `${forex ? forex.rows.length : 0} rates, ${stocks.length + indices.length} quotes, `
  + `${scores.reduce((n, l) => n + l.games.length, 0)} games, ${weather.length} weather cities, `
  + `${gaming.reduce((n, g) => n + g.articles.length, 0)} gaming headlines, `
  + `${tech.reduce((n, g) => n + g.articles.length, 0)} tech trend headlines, `
  + `${fuelNews?.articles.length ?? 0} fuel updates, ${crude.length} crude prices, `
  + `${PAGES.length} info pages, ${GUIDES.length} guides.`);
