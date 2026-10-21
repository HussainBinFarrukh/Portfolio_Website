# Portfolio website

Personal site for Hussain Bin Farrukh: enterprise integration and agentic AI.

Live: https://hussainbinfarrukh.github.io/Portfolio_Website/

## Structure

Plain static files, no build step.

- `index.html` holds all of the content. Edit text here.
- `styles.css` holds colors, type, and layout. Color tokens are at the top, with a dark-mode set below them.
- `flow.js` draws the animated integration diagram in the hero. Node names and the moving transaction labels are defined at the top of the file.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publish

GitHub Pages serves this site from the `gh-pages` branch. To publish, copy `index.html`, `styles.css`, `flow.js`, `favicon.svg`, and `.nojekyll` to the root of `gh-pages` and push.

The previous React version of the site is preserved in this repository's git history.
