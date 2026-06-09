# Oliver Health

Personal health protocol reference — a Progressive Web App hosted on GitHub Pages. Installable on iPhone as a home screen app with offline support.

## What's in it

Six tabs covering the full protocol:

| Tab | Contents |
|-----|----------|
| 🥗 Food | What to eat by time of day — pre-workout through pre-bed |
| 💊 Drug | Injection protocol, dose schedule, GI trigger management |
| ⚡ Supps | Daily supplement schedule and rescue meds |
| 📍 Out | Restaurant ordering framework, work dinners, travel pack |
| 🥘 Prep | Sunday batch cook timeline and storage guide |
| 🛒 Shop | Interactive grocery list — mark days you eat out, travel, or have date night and the list adjusts quantities automatically |

## First-time setup

**1. Enable GitHub Pages**
- Go to **Settings → Pages** in this repo
- Source: **Deploy from branch**
- Branch: **main** → **/ (root)**
- Save

Your app will be live at:
```
https://YOUR_USERNAME.github.io/oliver-health/
```

**2. Install on iPhone**
- Open the URL above in **Safari** (not Chrome)
- Tap the **Share** button (box with arrow)
- Tap **Add to Home Screen**
- Name it "Oliver Health" → Add

The app opens full-screen with no browser chrome. Works offline once loaded.

---

## Updating content

```bash
# Make your edits to index.html, then:
git add .
git commit -m "Add new dinner recipes"
git push
```

GitHub Pages rebuilds in ~30 seconds. Your home screen app picks up changes on next open (when online).

**After significant updates:** increment the cache version in `sw.js`:
```js
const CACHE = 'oliver-health-v2'; // was v1
```

---

## File structure

```
oliver-health/
├── index.html       Main app — all content lives here
├── manifest.json    PWA config (name, icon, display mode)
├── sw.js           Service worker (offline caching)
├── icon.svg        App icon (green heart)
└── README.md       This file
```

Everything runs as a single self-contained `index.html`. No build step, no dependencies, no npm.

---

## Enhancement roadmap

- [ ] **Meal randomizer** — spin button for a random Zepbound-friendly dinner
- [ ] **Injection countdown** — tap to log injection date, shows next dose in X days
- [ ] **Daily protein tracker** — tap-to-add counter toward 150g target, resets at midnight
- [ ] **Weekly check-in log** — weight + GI score trend chart over time
- [ ] **AI recipe suggestions** — Claude API integration (needs Anthropic API key)

---

## Working with Claude

Built collaboratively with Claude (Anthropic). To add a feature:
1. Open Claude and describe what you want
2. Claude writes the updated code
3. Replace the relevant section in `index.html`
4. `git commit && git push`

---

## iOS icon note

For the sharpest home screen icon on iPhone, convert `icon.svg` to a 180×180 PNG:
1. Go to [cloudconvert.com](https://cloudconvert.com) or [svgtopng.com](https://svgtopng.com)
2. Convert `icon.svg` → `icon-180.png`
3. Add to repo and update `index.html`:
```html
<link rel="apple-touch-icon" href="./icon-180.png">
```
