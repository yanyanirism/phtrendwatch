# Trending PH

One static page of trending Philippine and world headlines, with ad slots. It rebuilds itself every 30 minutes on GitHub Actions and is published to GitHub Pages. There is no server and nothing to install.

- **News:** Google News RSS (Top Stories, Philippines, World, Business, Technology, Entertainment, Sports), with duplicates removed. Each headline links to its publisher.
- **Trending bar:** Google Trends daily searches for the Philippines.
- **Ads:** a top leaderboard, an in-feed ad every `AD_EVERY` headlines plus one after each section, two sticky sidebar ads (desktop only), and a bottom ad. Until AdSense is configured, the slots show striped placeholders.

## Run locally

```sh
cp .env.example .env   # optional
npm run build          # writes dist/index.html
```

Open `dist/index.html` in a browser.

## Deploy

1. Push this folder to a GitHub repository whose default branch is `main`.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Under **Settings → Secrets and variables → Actions → Variables**, add the values from `.env.example`.
4. Run the **Build and deploy** workflow once from the Actions tab. After that, it runs on its own.
5. Custom domain: under **Settings → Pages → Custom domain**, enter `phtrendwatch.world` and turn on **Enforce HTTPS** once it is offered. At the DNS provider, add these records for the apex: `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and a `CNAME` record for `www` pointing to `<username>.github.io`.

The build also writes `about.html`, `contact.html` and `privacy.html`, which AdSense expects to see. When `SITE_URL` is set, it writes `sitemap.xml` and `robots.txt` too.

If every feed fails during a build, the job fails and the last good page stays live.

## AdSense notes

- When `ADSENSE_CLIENT` is set, the build also writes `ads.txt`, which AdSense requires.
- To get anchor and vignette ads without changing code, turn on **Auto ads** for the site in AdSense.
- AdSense rejects sites with more ads than content and sites that only aggregate others' content. Approval usually needs a custom domain, a privacy policy, and some original content. Use `AD_EVERY` to adjust ad density.
- GitHub pauses scheduled workflows after 60 days without repository activity. If that happens, re-enable the workflow from the Actions tab.
