# REVA.EXE — version 21.0

A small operating system, built by Ruru 🐡 for Reva. Boot screen, desktop, draggable windows, a dock, seven apps, a few secrets.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run preview      # serve the production build locally
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run assets` | Rebuilds web copies of the photos from `../../Birthday` into `public/assets/` (originals are only read) |
| `npm run verify-quotes` | Checks every curated message against the WhatsApp export: date, time, sender, exact text. Pass the chat path if it moved. |
| `npm run check-content` | Lists placeholders still waiting for you (also runs before every build) |

## What's inside

| Icon | App | Core interaction |
|---|---|---|
| `our_archive.exe` | The Museum of Us | File explorer by date, search, random memory, favourites, last opened, hover previews, photo viewer, a quiet sealed note on 27.04 |
| `flower.exe` | The Flower Department | Botanical plates (white lily, petrol-pump specimen, tiger lily, poppy, the handmade one, White Memoir) and a bouquet studio (tap to add, drag or tap to arrange, turn, remove, change vase, finish) |
| `reva_isms.exe` | The Reva Dictionary | Searchable entries with original messages, category filters, random entry, “this is SO Reva” counter |
| `the_27th.exe` | The 27th Club | Calendar Apr 2026 → Apr 2027. 27ths are marked; past ones without a memory say *unrecorded*, future ones are locked |
| `reva_awards.exe` | The 21st Annual Reva Awards | Marquee → programme → nomination → citation → envelope → drumroll → winner → acceptance speech. People's Choice voting, Hall of Fame, closing ceremony, a hidden category |
| `ruru.exe` | Ruru Terminal | `help`, `/why-reva`, `/first-date`, `/goodnight`, `/pufferfish`, `/random-memory`, `/flowers`, `/about-ruru`, `/lake`, `/stats`, `/open <app>`, `/play`… History with ↑/↓, Tab to complete |
| `classified.exe` | The secret folder | A small puzzle (answer: 27.04.2026, other formats accepted, hints after misses), then the letter |
| `lost+found` | Mini-game | Find five things in a pixel room. Unlocks the hidden award |

OS-level features: boot sequence with skip, menu bar with clock, mute and notification centre, dock with open/minimised dots (and a LIVE badge during the awards), right-click / long-press desktop menu, occasional notifications, a wandering pufferfish, five pufferfish hidden inside apps, an idle screensaver, and Settings (sound, volume, motion, wallpaper, notifications, screensaver, pufferfish, reset progress).

On phones: icons in a grid, apps open full screen, no dragging needed, compact dock.

## Editing personal content

All personal content lives in `src/data/`. Components never hold any.

| File | Holds |
|---|---|
| `curatedContent.ts` | **The only chat excerpts on the site**, verbatim with date, time and sender. Friend testimony. Measured pufferfish stats |
| `memories.ts` | Archive folders: titles, your short intro lines, which messages and photos belong where |
| `flowers.ts` | Flower plates and bouquet studio stems |
| `quotes.ts` | Dictionary entries (each points at a real message; the definition is your editor's note) |
| `calendar.ts` | 27th Club events |
| `awards.ts` | Every award category, evidence, jury notes, acceptance replies, polls, ceremony copy, and Ruru's Special Recognition |
| `terminalCommands.ts` | Terminal commands |
| `easterEggs.ts` | Boot lines, notifications, pufferfish lines, screensaver lines |
| `letter.ts` | **Your letter**, signature, optional photo, the puzzle |
| `assets.ts` | Which photo ID fills which slot, alt text and captions |
| `../config.ts` | Default wallpaper, timings, a "today" override for testing the calendar |

To add a quote: add it to `curatedContent.ts` exactly as it appears in the export, run `npm run verify-quotes`, then reference its id.

## Photos

Selected photos are resolved through `scripts/asset-sources.json`, which maps each media-index ID to the original file in `../../Birthday`:

| Slot | ID | Notes |
|---|---|---|
| Archive hero, desktop polaroid | P20 | |
| Bowling, main | P12 | Rotated upright; cropped to remove the person behind her and the wrong camera date stamp |
| Bowling, alternate | P13 | Date stamp cropped |
| Bowling lanes | P14 | Date stamp cropped |
| Lake day (archive + calendar) | P15 | |
| Portraits (awards, wallpaper, screensaver) | P19, P04, P08, P03 | |
| The handmade bouquet | `incoming/IMG20261006183639.heic` | |

To swap or add a photo: add an entry to `asset-sources.json`, add a slot in `src/data/assets.ts`, run `npm run assets`. Web copies are WebP (2000px full, 560px thumbnails), lazy-loaded. A missing file shows a labelled placeholder, never a substitute.

Wallpaper: change `config.wallpaper` in `src/config.ts`, or add a photo wallpaper to the `wallpapers` list there.

## Still waiting for you

1. **The letter** — `src/data/letter.ts` → `paragraphs` (one string per paragraph). Until then the letter shows a marked placeholder.
2. **Ruru's Special Recognition dedication** — `src/data/awards.ts` → `specialRecognition.dedication`. While it's empty, the award is hidden in production builds. Dev builds show a placeholder.
3. **White Memoir photo** — no white-rose bouquet photo exists in the project, so it's an illustration with a placeholder note.
4. Optional: a photo for the letter (`letter.photo`).

## Content decisions to check

- **P15** shows Reva on a pickleball court, not the lake. The media index links it to the morning of 27 June (“plausible”). It's captioned *“Lake day, the morning edition.”*
- **P20** is marked “removed in V2” in the film's allowlist. That note was about the film; it's used here because you selected it.
- **The handmade bouquet photo** (pipe-cleaner lilies and poppies, 12–23 Sep) is in the Flower Department as “The Handmade One”, since the brief allowed flower-making material. To remove it, delete the `handmade` entry in `flowers.ts`.
- **19 September context:** besides Reva's two curated messages, the exchange shows the surrounding lines so “It was about me😛” isn't misread: “Flower ni pasand aaya”, “Flower to yu hi hai”, “It was not about the flower thoo”, “Not exactly tooo”, and your tiger-lily line from 16:10. **28 July** also includes “Petrol pump pe thi”.
- **15 October** (her birthday) is on the calendar as a milestone, from the production notes.
- **Pufferfish stats** (146 total, 133 in goodnights, 0 from Ruru) were measured from the export of 2 Oct 2026. The newer zip in Downloads couldn't be read (its central directory is damaged), so it wasn't used.
- Friend lines come from the reviewed transcripts. Uncertain words were left out, “…” marks omissions, and Mystery Friends 1 and 2 stay anonymous. Aryaman's “second to me” is quoted exactly.

## Privacy and deployment

- The raw chat export is **never** copied into this project or the build. `verify-quotes` reads it in place.
- No analytics, trackers, third-party fonts or API calls. Fonts are bundled. `noindex` plus `robots.txt` ask search engines to stay away.
- **The classified.exe lock is a game, not security.** The answer and the letter ship in the JavaScript, so anyone with the link can read them.
- The site contains private photos and messages, so **don't publish it on an open URL.** Options:
  - **Cloudflare Pages + Cloudflare Access** (free): restrict to Reva's email with a one-time code. Recommended.
  - **Netlify** with site-wide password protection, or **Vercel** with password protection (both on paid plans).
  - Or don't deploy at all: run `npm run build`, then `npm run preview` on your laptop, or serve `dist/` on your home network.
- Settings and progress are saved only in the visitor's browser (localStorage).

## Sounds

All sounds are synthesised in the browser with Web Audio (`src/lib/sound.ts`), so there are no audio files or licences involved. Nothing plays until the first click on the boot screen. Global mute is in the menu bar, and volume is in Settings.

## Tech

Vite · React 19 · TypeScript · Zustand · Motion · Lucide · @fontsource (Fraunces, DM Sans, IBM Plex Mono, Caveat, Silkscreen). Apps are code-split and load on first open.

## Known limitations

- Window resizing is enabled only on screens ≥1024px with a mouse; phones and tablets get full-screen or fixed windows.
- The screensaver only starts when no window is open and the tab is visible.
- Progress (trophies, votes, favourites) is per browser. A different device starts fresh.
