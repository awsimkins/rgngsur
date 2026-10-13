# Rg Ng Sur — Official Site

Source for [rgngsur.com](https://rgngsur.com): a single-page static site (GitHub Pages, custom domain via `CNAME`).

## Files

| File | Purpose |
|------|---------|
| `index.html` | All page content (About, Featured Video, Music, Social, Contact) |
| `styles.css` | All styles (no framework) |
| `script.js` | Mobile menu and optional scroll-reveal animation |
| `images/` | Album art (`camera_rolling_image.jpg`, also used as the social share image) |
| `sitemap.xml`, `robots.txt` | Search engine files |

## Editing

- No build step. Edit the files and push to `main`; GitHub Pages publishes automatically.
- Content is visible without JavaScript. The reveal animation is added only when JS runs and is skipped for visitors who prefer reduced motion.
- To swap the featured video, change the YouTube embed `src` and title in the Videos section.
- Update `lastmod` in `sitemap.xml` after significant content changes.
