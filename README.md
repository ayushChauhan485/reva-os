# REVA.EXE — version 21.0 (V2)

A small operating system, built by Ruru 🐡 for Reva. Boot screen, desktop, draggable windows, a dock, eight apps, a photo library, a few secrets.

See also: [`V2-CHANGELOG.md`](V2-CHANGELOG.md) · [`FACT-AUDIT.md`](FACT-AUDIT.md) · [`PHOTO-INVENTORY.md`](PHOTO-INVENTORY.md) · `docs/contact-sheet.jpg` (private).

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run preview      # serve the production build locally
```

**Before deploying, all four must pass:**

```bash
npm run verify-quotes
npm run verify-facts
npm run lint
npm run build
```

| Script | What it does |
|---|---|
| `npm run assets` | Rebuilds web copies of the photos from `../../Birthday` into `public/assets/photos` (originals only read, metadata stripped, edits kept separate) |
| `npm run verify-quotes` | Every curated message vs the WhatsApp export: date, time, sender, exact text |
| `npm run verify-facts` | Facts, evidence, photo associations, P15 rule, allow-list, pufferfish recount (see `FACT-AUDIT.md`) |
| `npm run count-pufferfish` | Recounts 🐡 from the export into `src/data/generated/pufferfishStats.json` |
| `npm run photo-inventory` | Regenerates `PHOTO-INVENTORY.md` from the registry |
| `npm run contact-sheet` | Renders `docs/contact-sheet.jpg` of every original, used and excluded |
| `npm run check-content` | Lists placeholders still waiting for you (also runs before every build) |

The scripts look for the export at `../../Birthday/WhatsApp Chat with Revaa.txt`. Pass another path after `--` if it moves.

## What's inside

| Icon | App | Core interaction |
|---|---|---|
| `our_archive.exe` | The Museum of Us | File explorer by date, search, random memory, favourites, sealed 27.04 note, a film strip for memories with photos, a link to their album |
| `photos.exe` | Reva Photo Library | Home with stats and album covers, 8 albums, grid / masonry / filmstrip / timeline views, search and filters, favourites, random photo, slideshow, the Wall of Reva, memory-strip maker, set as wallpaper |
| `flower.exe` | The Flower Department | Botanical plates (labelled illustrations), White Memoir placeholder, bouquet studio |
| `reva_isms.exe` | The Reva Dictionary | Searchable entries with original messages, filters, random (+ optional photo), “this is SO Reva” |
| `the_27th.exe` | The 27th Club | Calendar with marked 27ths, confirmed photos per event, empty-photo cards elsewhere, the club’s origin quote |
| `reva_awards.exe` | The 21st Annual Reva Awards | Full ceremony with a photo per award, People’s Choice gallery, Hall of Fame, closing, hidden category |
| `ruru.exe` | Ruru Terminal | `help`, `/why-reva`, `/first-date`, `/goodnight`, `/pufferfish`, `/photo`, `/random-memory`, `/open <app>`, … |
| `classified.exe` | The secret folder | A small puzzle, then the letter (with Ruru’s real handwriting) |
| `lost+found` | Mini-game | Find five things in a pixel room; unlocks a hidden award |

The shared photo viewer is used everywhere. It offers zoom and pan, fit, full screen, favourite, an info panel, original/edited, memory connections, set as wallpaper, a filmstrip, swipe and keys.

On the desktop: Photo of the Day, a random polaroid, recently viewed photos, and photo wallpapers (fit / centre / plain; never cropped). The screensaver is photographic (polaroid / filmstrip / drift), and you choose its source in Settings.

## The photo rule

Photos are always shown complete: resized, never cropped, zoomed or stretched. Fixed frames letterbox the photo on a neutral mat (`--photo-mat`). Use the shared `Img` component, or give a raw `<img>` the `photo` class. `npm run verify-facts` fails if a stylesheet or component reintroduces cropping.

## Editing content

Everything personal lives in `src/data/`:

| File | Holds |
|---|---|
| `verifiedFacts.ts` | **Source of truth**: every fact with source and status. Not shipped |
| `curatedContent.ts` | The only chat excerpts on the site (verbatim) and friend testimony |
| `photoLibrary.ts` | **The photo registry**: one record per photo (dates by kind, association, albums, tags, related memory, facts) and the albums |
| `memories.ts`, `calendar.ts`, `flowers.ts`, `quotes.ts`, `awards.ts` | App content; photos referenced by registry id |
| `letter.ts` | Your letter and the puzzle |
| `../config.ts` | Wallpaper defaults, timings, `showPrivateAlbums` |

**To add a photo:**
1. Add it to `scripts/asset-sources.json` (and a `derivative` if it needs a recorded edit).
2. Run `npm run assets`.
3. Add a record to `photoLibrary.ts`. Keep it `unassigned` / `unknown` unless the date or event is proven by a confirmed fact.
4. Run `npm run verify-facts`, then `npm run photo-inventory`.

**To add a quote:**
1. Copy it exactly into `curatedContent.ts`.
2. Run `npm run verify-quotes`.
3. Reference it by id.

## Still waiting for you

1. **White Memoir photo**: there is none in the project; it shows a placeholder.
2. **Optional**: P06 and P21 are allow-listed but flagged “check with Ayush”. The Wishes shortlist (62 photos) hasn’t been reviewed for this site.

Done: the letter (`src/data/letter.ts`) and Ruru’s Special Recognition dedication (`src/data/awards.ts`, photo `specialRecognition.image`, currently P19).

## Privacy and deployment

- The raw chat export is never copied into the project or the build. The verify scripts read it in place, and `verifiedFacts.ts` isn’t bundled.
- Photos are re-encoded with **no EXIF/GPS metadata** and semantic file names; no source file names ship.
- No analytics, trackers, third-party fonts or calls. `noindex` and `robots.txt` are set.
- `config.showPrivateAlbums = false` hides **The Two of Us** and every couple photo, for any version others might see.
- **The classified.exe lock is a game, not security.** Deploy behind real access control: Cloudflare Pages + Cloudflare Access restricted to Reva’s email (recommended), or Netlify/Vercel password protection. Or keep it local (`npm run preview`).
- Settings, favourites and progress live only in the visitor’s browser.

## Tech

Vite · React 19 · TypeScript · Zustand · Motion · Lucide · @fontsource. Sounds are synthesised with Web Audio. Apps are code-split and photos lazy-load: the desktop loads thumbnails only, and full-size images load in the viewer.

## Known limitations

- Window resizing works only on screens ≥1024px with a mouse.
- The screensaver starts only when no window, viewer or slideshow is open and the tab is visible.
- Progress (trophies, votes, favourites) is per browser.
- `npm run lint` passes with 12 style warnings from the React-compiler rules (setState in effects, a memo deps hint). None are errors.
