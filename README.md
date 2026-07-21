# ash.exe has received a tiny apology gift

A self-contained, single-page interactive apology/gift experience. No backend,
no build step, no tracking beyond one optional local-only feedback choice.

## Files

- `index.html` — all six screens (intro → apology → trust HUD → loot cards →
  gallery → final message + candy rain)
- `style.css` — the whole design system (cute-pink-cat + scrap-metal palette)
- `script.js` — scrolling nav, card flips, the falling-candy celebration, the
  optional feedback buttons
- `assets/` — put the six images here (see `assets/README-ASSETS.txt` for the
  exact filenames expected)

## Before you deploy

1. Save the six images from our chat into `assets/` using the exact filenames
   listed in `assets/README-ASSETS.txt`.
2. Open `index.html` locally in a browser to check everything looks right.
3. That's it — no npm install, no build command.

## Deploying to GitHub Pages

1. Create a new repo (can be private or public).
2. Add these files (`index.html`, `style.css`, `script.js`, `assets/`) to the
   repo root — commit and push.
3. In the repo: **Settings → Pages → Source: Deploy from a branch → Branch:
   main / (root)** → Save.
4. GitHub gives you a URL like `https://yourusername.github.io/repo-name/`
   within a minute or two.

Any other static host (Netlify, Vercel, Cloudflare Pages) works the same way —
just drag the folder in, no configuration needed.

## Notes

- Respects `prefers-reduced-motion`: the heart-assembly animation and candy
  rain both fall back to calmer/static versions.
- The "trust progress" bar and quest HUD are intentionally decorative — nothing
  on the page tracks or scores her response.
- The feedback buttons at the end write one small choice to `localStorage`
  (your browser only, nothing sent anywhere). Delete the `localStorage.setItem`
  line in `script.js` if you'd rather it do nothing at all.
