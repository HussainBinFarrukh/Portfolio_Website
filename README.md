# Portfolio website

Personal site for Hussain Bin Farrukh: enterprise integration and agentic AI.

Live: https://hussainbinfarrukh.github.io/Portfolio_Website/

## Structure

Plain static files, no build step. Libraries load from the jsDelivr CDN.

- `index.html` holds all of the content. Edit text here, including the agent run's log lines.
- `styles.css` holds colors, type, and layout. Color tokens are at the top: teal is data flow, blue is agents, amber is human review and production.
- `js/hero.js` draws the 3D routing mesh in the hero (three.js).
- `js/flow.js` builds the integration diagram. Node names and transaction labels are at the top of the file.
- `js/main.js` runs all scroll and page animation (GSAP with ScrollTrigger, SplitText, ScrambleText, DrawSVG, MotionPath; Lenis smooth scroll).

## Libraries

| Library | Version | License |
| --- | --- | --- |
| GSAP and plugins | 3.15.0 | GSAP standard no-charge license (free, including commercial use) |
| Lenis | 1.3.27 | MIT |
| three.js | 0.186.1 | MIT |

## Accessibility and fallbacks

- With reduced motion enabled, the page shows every section in its finished state: no pinning, smooth scroll, or animation.
- If the CDN scripts fail to load, all content still renders as a normal static page.
- The agent run is decorative; a screen-reader description of each step sits in the markup.

## Preview locally

Run `python3 -m http.server` in this folder and visit http://localhost:8000. Opening `index.html` directly also works, but the hero mesh needs a local server because it is an ES module.

## Publish

GitHub Pages serves this site from the `gh-pages` branch. To publish, copy `index.html`, `styles.css`, `favicon.svg`, `service-worker.js`, `.nojekyll`, and the `js/` folder to the root of `gh-pages` and push. `service-worker.js` only retires the worker left behind by the old React build; keep it in place.

The previous React version of the site is preserved in this repository's git history.
