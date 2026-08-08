# Project context — read this first

Lets any assistant (Claude, Codex, human) pick project up mid-flight without
losing what was learned building it. Stored **in the repo**, not in one tool's
memory — tool memory does not transfer.

[README.md](README.md) documents *how each section is built*. This file covers
what README can't: brand, conventions, traps, what is unfinished.

---

## 0. Source material — the client's own files are IN this repo

Two folders at repo root. **Read these before asking user to re-explain
anything.**

| Folder | What's in it |
|---|---|
| `Website page document pdf's/` | **14 analyst write-ups**, one per page. Prose: what each version changed and why, section orders, content references, flagged inconsistencies. The *reasoning* lives here. |
| `Website page design pdf's/` | **28 visual designs** — final mobile and desktop artwork for every page, e.g. `Homepage v9.pdf`, `Homepage-desktop v1.pdf`. The *authoritative* look. |

**Which file for which task**

- Homepage build/change: `Homepage-desktop v1.pdf` + `Homepage v9.pdf`
  (design), `American_Hairline_Homepage_Design_Evolution.pdf` (reasoning, incl.
  full 21-section final order).
- Brand-wide copy or tone: any `*_Design_Evolution.pdf`; rules repeat across
  all. §3 below is distilled version.
- Specific other page: match filename.

### ⚠ The design PDFs are the PREVIOUS site, not what we are building

`Homepage-desktop v1.pdf` shows **centred hero with star rating and no 3D
element**. This repo builds a **new 3D direction**, client supplying fresh
screenshots section by section.

Design PDFs authoritative for **content, section order, copy, brand** — **not**
for visual layout. Do not "correct" build to match them.

### Reading these PDFs

**Poppler installed** (`winget install oschwartz10612.Poppler`, v25.07.0), on
user PATH at:

```
C:\Users\ADMIN\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\poppler-25.07.0\Library\bin
```

Caveat: assistant built-in "read a PDF" tool caches PATH at startup, so it may
report poppler missing until tool restarts. Drive `pdftoppm` from shell instead
— prepend bin dir to `$env:Path` and:

```powershell
pdftoppm -png -r 15 -f 1 -l 1 "<file>.pdf" out    # overview
pdftoppm -png -r 60 -x 0 -y 2000 -W 4096 -H 2200 "<file>.pdf" slice   # detail
```

Design PDFs are **one enormous page** (homepage 4917 × 16793 pts), so `-r 15`
gives readable whole-page overview, higher `-r` with `-x/-y/-W/-H` crops region.
Folder names contain **spaces and an apostrophe** — quote paths, and in JS build
file URLs with `pathToFileURL`, not string concat.

### Verification toolchain

`puppeteer-core` **is** a project devDependency, so §6 scripts run from plain
`npm install`. Chrome at
`C:/Program Files/Google/Chrome/Application/chrome.exe`.

Gotcha: run verification scripts from **inside the project tree** — Node
resolves `puppeteer-core` upward from the *script's* location, so a script in a
temp dir outside repo fails with `ERR_MODULE_NOT_FOUND` even though package is
installed.

### Real assets are extractable from the design PDFs

Design PDFs embed the **real photography** the site used. `pdfimages -png
"<file>.pdf" out` dumps it; expect hundreds of files from homepage PDF, so
filter by size. Useful when an asset was not supplied separately. Achievement
images already installed from originals in `Images/` (see work log).

### Homepage section order (from `Homepage-desktop v1.pdf`)

Content spine. Build currently covers 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
14, 15, 16, 17, 18, 20 in new visual style. Only 2 and 19 remain.

1. Hero — "Tired of Hiding Your Hair Loss?"
2. Client testimonial carousel — full-bleed strip of named client cards
3. **The Secret Behind Our Natural Hairline** ✅ built
4. **Our Big Achievements** ✅ built
5. **Why Men Around The World Choose Us** — 12+ Years / 6,770+ / 100% / 12+ Nations ✅ built
6. **Our 21-Point Checklist For A Perfect Hair System** ✅ built
7. **Some Of Our Clients With The Most Natural Hairlines** — video cards ✅ built
8. **Dark trust band — 4.9 Google · 50K+ YouTube** ✅ built as "Backed By
   Thousands Of Confident Men", placed after 7 on the client's instruction
9. **World's Finest Thinnest Hair Systems** — product carousel ✅ built
   - **Uses Advanced 3D Scan Technology** sits directly after this, on the
     client's instruction. Not one of the 21; see the component table in §2.
10. **Real Hair Or Illusion? Watch & Decide** ✅ built
11. **This Might Sound Like Your Story** — pain points + "If yes, we'll guide you" ✅ built
12. **Explore Our Trusted Range Of Hair Services** ✅ built
13. **The Step-By-Step Process To Natural Hair** ✅ built
14. **Our Trusted Methods For A Natural Look** ✅ built
15. **Why Thousands Of Men Choose American Hairline** — 4 pillars ✅ built
16. **Walk Into Any Of Our Premium Salons** ✅ built
17. **Frequently Asked Questions** — tabbed ✅ built
18. **Fill This Form To Get The Right Guidance** ✅ built (no backend yet — §7)
19. Free eBook band
20. **Footer** ✅ built

---

## 1. Run it

```bash
npm install
npm run dev      # http://localhost:5173 — also prints the LAN URL for phones
npm run build    # tsc -b && vite build — typecheck is part of the build
```

Windows, PowerShell or Git Bash. Node installed; Chrome at
`C:/Program Files/Google/Chrome/Application/chrome.exe` (used for verification,
see §6).

`vite.config.ts` sets `server.host = true` and `server.port = 5173`. Vite's
default `localhost` bind resolved to `::1` only on this machine, so
`http://127.0.0.1:5173` was refused and browsers preferring IPv4 saw a dead
localhost. `host: true` binds every interface, which also removes the need for
a `--host` flag when testing on a phone.

---

## 1b. Versions — how to hand back a named version

**This IS a git repository now.** It was not for the first two weeks, and that
cost a real recovery: see the 2026-08-07 entry where a deleted component had to
be reconstructed from a session transcript because there was no history to
check out. Do not let that happen again — commit before large changes.

| Version | Tag | Plain folder | What it is |
|---|---|---|---|
| Homepage v1 | `homepage-v1` | `versions/homepage-v1/` | 18 of the client's 20 spine sections, 2026-08-08 |

**"Give me homepage version 1" — do this:**

```bash
git switch --detach homepage-v1   # look at it
git switch -                      # come back
git diff homepage-v1 -- src       # what changed since
```

Or just read `versions/homepage-v1/`, which is a plain copy needing no git. It
was produced with `git archive` from the tag, so it is the tag byte for byte.

**Cutting the next version:**

```bash
git add -A && git commit -m "feat: homepage version 2"
git tag -a homepage-v2 -m "..."
mkdir -p versions && git archive --format=tar --prefix=homepage-v2/ homepage-v2 \
  | (cd versions && tar -xf -)
```

Two settings that matter and are already configured:

- `core.autocrlf` is **false**. On Windows git's default rewrites every LF to
  CRLF on checkout, which would touch every source file and invites exactly the
  encoding damage recorded in §5. Leave it off.
- `reference/` is **not** tracked — 205 MB of screen recordings that are inputs
  to the work, not part of it. `Images/` and both PDF folders **are** tracked,
  on the client's instruction, which is why the repo is ~580 MB. It has no
  remote; pushing it anywhere would need Git LFS first.
- `versions/` is ignored. Git already holds those bytes at their tags, so
  tracking the folders too would store everything twice.

---

## 2. What this project is — and is not

**From-scratch front-end build** of American Hairline homepage, matched to
reference screenshots client supplies one at a time.

Built so far, in page order:

| | Section | Component |
|---|---|---|
| 1 | Nav | `src/components/Nav.tsx` |
| 2 | Hero — chrome band + 3D video + Find-Your-Match slider | `Hero.tsx`, `Wordmark.tsx`, `MatchSlider.tsx` |
| 3 | "The Secret Behind Our Natural Hairline" | `Secret.tsx` |
| 4 | "Our Big Achievements" — pinned horizontal scroll | `Achievements.tsx` |
| 5 | "Why Men Around The World Choose Us" — TRIONN Key Facts entrance | `KeyFacts.tsx` |
| 6 | "Our 21-Point Checklist" — pinned dark stage, scrubbed list | `Checklist.tsx` |
| 7 | "Some Of Our Clients…" — pinned horizontal client films | `ClientStories.tsx` |
| 8 | "Backed By Thousands Of Confident Men" — dark proof panel, glass cards | `Backed.tsx` |
| 9 | "World's Finest Thinnest Hair Systems" — collection surfer | `Systems.tsx`, `ui/collection-surfer.tsx` |
| 10 | "Real Hair Or Illusion? Watch & Decide" — one tilting video card | `Decide.tsx` |
| 11 | "This Might Sound Like Your Story" — stacking cards | `Story.tsx` |
| 12 | "Explore Our Trusted Range Of Hair Services" — pinned full-width row accordion | `Services.tsx` |
| 13 | "The Step-By-Step Process To Natural Hair" — pinned dark stage, steps arriving one at a time | `Process.tsx` |
| 14 | "Our Trusted Methods For A Natural Look" — accordion beside a tilting photograph | `Methods.tsx` |
| 15 | "Why Thousands Of Men Choose American Hairline" — pinned four-bay grid filling left to right | `Pillars.tsx` |
| — | "Before And After, In Their Own Words" — testimonial deck on the ported CardStack. **Not in the client's 21-section spine**; added on request 2026-08-07 | `Deck.tsx`, `ui/card-stack.tsx` |
| — | "Uses Advanced 3D Scan Technology" — pinned dark stage, inline picture grows out of the headline to full bleed. **Not in the spine either**; added on request 2026-08-07, and placed directly after Systems on the client's instruction | `Scan.tsx` |
| 16 | "Walk Into Any Of Our Premium Salons" — pinned horizontal rail, one card per city | `Salons.tsx` |
| 17 | "Frequently Asked Questions" — tabbed glass accordion on a dark stage | `Faq.tsx` |
| 18 | "Fill This Form To Get The Right Guidance" — validated guidance form | `Form.tsx` |
| 20 | Footer — outlined giant wordmark, looping marquee, link columns | `Footer.tsx` |

**Not** the full site. Brand has ~13 pages (§3); this is one page, built section
by section on request. Do not scaffold pages nobody asked for.

**Stack:** Vite + React 18 + TypeScript + **plain CSS**. All content strings and
image paths in `src/site.ts`. Design tokens in `src/styles/tokens.css`.

---

## 3. Brand knowledge

Distilled from client design-evolution PDFs in the two root source-material
folders. Both PDFs and this summary are source material.

**American Hairline** sells non-surgical hair systems in India (Mumbai, Delhi,
Bangalore). Whole brand rests on one distinction: cheap generic **patch** versus
**custom-designed system**. Founder: **Vinitt Dessai**.

Product lines: **Stick-On** (glued, shaved, monthly servicing, advanced loss) ·
**Clip-On** (clips, no glue, no shaving, daily removal, partial thinning) ·
**Zycon™** (premium medicated sub-range) · **SMP** (pigment, *not a tattoo*,
does not regrow hair) · **Front Hairline Transplant + Hair System** (hybrid) ·
**Consult with Founder** (paid ₹25,000 session).

**The proof numbers** — keep consistent everywhere: 12+ years · 6,770+ men ·
100% natural · 12+ nations · 4.9 Google rating with 300+ reviews · 50K+ YouTube
· Shark Tank India deal · Bharat Innovators Award · Bollywood clients ·
Advanced 3D Scan · 21-Point Checklist.

**The buyer:** self-conscious man who already wasted money on oils and pills,
nervous about surgery, **privacy-conscious** — not a purchase he wants to
announce. Biggest objection: *"will people be able to tell?"*

### Copy rules (settled across every page — do not relitigate)

1. **Consultative CTAs, never transactional.** "Book Now" replaced site-wide
   with "Discuss With a Consultant", "Talk to an Expert", "Need Guidance?".
   Not every section needs a CTA.
2. **Plain beats clever.** Headings moved from marketing lines to literal ones
   ("Discover what suits your lifestyle best" → "Hair Patch vs. Hair System").
   Also "We *End* Your Hair Loss Worries" → "We **Solve**" — "end" over-promises.
3. **Honesty is the persuasion.** SMP page states on a sales page that SMP does
   not regrow hair; transplant page runs a table where brand's own product loses
   six of seven rows. Keep candour — it is a brand asset.

### Visual system (arrived at over 9 homepage rounds, inherited by every page)

Alternating section backgrounds · **eyebrow tags removed** (one heading per
section) · headings left-aligned · copy in cards · body text darkened with key
words bolded · real photography always beats placeholders.

**Overlay pattern ("push becomes pull"):** long or optional content becomes a
short teaser card with **(+)** opening an overlay. Mobile stacks it, desktop
renders wide two-panel layout.

**Process:** mobile-first always; desktop is layout adaptation, not redesign.

### Known content flags — unresolved, do not propagate

- **"Zyron™" is a typo for "Zycon™"** in at least one live CTA.
- Stick-on servicing interval stated three ways: 2–4 weeks / 3–4 weeks / 20–25 days.
  The FAQ answers route around this: neither the servicing interval nor base
  durability is given as a number there. They say what decides the figure and
  leave the figure to the consultant, so nothing ships one of three. Settle the
  numbers and those two answers can state them.
- Clip-on thick-base durability: "1–1.5 years" vs "12 months".
- SMP touch-up: "after 2 years" vs "every 18–30 months".
- Scarcity claims ("limited demo slots") must be genuinely true.

---

## 4. Conventions this project follows

- **Plain CSS, not Tailwind.** No Tailwind, no shadcn, no `@/` alias, no `cn()`.
  When pasting a component that assumes them, port utility classes to plain CSS
  in `global.css`. Adding Tailwind now brings its preflight reset and restyles
  everything already built.
- **Import from `motion/react`, never `framer-motion`.** `framer-motion` is on
  disk only as transitive dep of `motion`; importing it directly leans on an
  undeclared package and ships a second copy of the animation runtime.
- **Colour discipline.** `tokens.css` reserves blue for "the active link, the
  two buttons, the eyebrow, and the slider controls, and nothing else". Only
  sanctioned exception: the 100% badge on the wordmark — claim marker, not
  decoration.
- **Every animation respects `prefers-reduced-motion`**, via
  `usePrefersReducedMotion` / `useReveal` / `useTilt` in `src/hooks.ts`.
- **Content lives in `src/site.ts`**, not inline in components.
- **Assets go in `public/`.** Source originals in `Images/` and `reference/`;
  those are inputs, `public/` ships.

---

## 5. Traps — each cost a real debugging cycle

**Hero video composite.** `.hero__bg` uses `mix-blend-mode: darken` +
`brightness(1.14)` so footage's white studio ground disappears and mannequin
reads *in front of* the chrome letters. **Depends on the page behind it staying
white.** Tinted background breaks the composite.

**`.stage` is scoped to the hero wrapper, not `<main>`.** Video is
`position: absolute; inset: 0` against it. Anything added to `main` while
`.stage` was `main` got covered by the video.

**`textLength` + `lengthAdjust="spacingAndGlyphs"`** distributes whatever text
you give it across the same 1000 units. Adding a word does not widen the band —
it squeezes every glyph. "NATURAL" measures 923 units intrinsically, renders at
~1.083×; beyond roughly 0.85–1.1× type reads distorted.

**SVG viewBox headroom scales with viewport width.** Extending wordmark viewBox
upward added ~83px dead space under nav at 1440px, more on wider screens. Use
`padding` on `.wordmark` for spacing; use `overflow: visible` (already set) if
something must overhang.

**Secret video time owns copy; never map `currentTime` to scroll again.**
Repeated decoder seeks caused visible frame-jump glitches. The film plays once:
it starts when 35% of the section first enters, pauses off-screen, resumes from
the same time, and holds its final frame after ending. Copy phases are `0–3s`,
`3–4.25s`, `4.25–8.65s` and `8.65s–end`. Do not restore panels, background
layers, guide lines, filters, masks or outer model transforms.

**Reduced-motion cascade order.** On phones, normal composition offsets
`.secret__stage` downward. A later combined phone + reduced-motion rule must
reset that offset; otherwise phone media query overrides earlier reduced-motion
settlement.

**Pinned horizontal scroll: section height *is* the mechanism.**
`100vh + trackOverflow`, measured by `ResizeObserver` — fonts and images change
track width after first paint, so first measurement is wrong.

**Dev server bound to IPv6 only.** With Vite's default host, `npm run dev`
listened on `::1` and nothing on `127.0.0.1`, so localhost appeared broken in
any browser or tool that tries IPv4 first — while the server itself was healthy.
Fixed with `server.host = true` in `vite.config.ts` (see §1). If localhost looks
dead again, check `Get-NetTCPConnection -LocalPort 5173` before assuming a build
or code fault.

**`dist/` is wiped by every build.** A reference recording left there would have
been destroyed. Reference material goes in `reference/`.

**Client photo cropping.** Cards use `object-position: center top` so `cover`
spends its crop on chest and shoulders, never the hairline — the one thing those
photos exist to show.

**Type collisions.** React's `onDrag` conflicts with motion's; extend
`HTMLMotionProps<'div'>` rather than `React.HTMLAttributes`. And a JSX comment
cannot be first thing inside `return (` — syntax error.

**A scrubbed list needs a shaped cursor, not a linear one.** Mapping scroll
progress straight onto a list index leaves the list parked half-way between two
rows at almost every scroll position — with a depth-of-field blur marking the
active row, that reads as a broken section rather than a scrubbed one. The
Checklist cursor gives each step a plateau so roughly two thirds of the travel
between two points rests on one of them. Measured before the fix: rows at rest
carried 1.45px of blur at 0.68 opacity. After: exact integers, `filter: none`.

**The base reset covered `ul` but not `ol`.** An ordered list therefore kept
both its markers and its 40px `padding-inline-start`. It went unnoticed because
the earlier sections set `display: grid` on their list items, which suppresses
the marker box while leaving the indent — so Checklist, Story and Client
Stories were all quietly indented 40px. It only became visible when the
Services accordion used plain `li` elements and the numbers appeared on screen.
Fixed at the root: `ul, ol { list-style: none; padding: 0 }`. Re-verified the
other sections afterwards; behaviour unchanged.

**`0fr` does not collapse a grid track on its own.** An `fr` track carries an
automatic min-content minimum, so animating `grid-template-rows: 0fr → 1fr` —
the standard trick for opening an element to its content height with nothing
measured — leaves the closed state standing at the content's min-content
height. In the Story section that was the card's own padding: measured 46px
instead of collapsing to the 18px peek. Write `minmax(0, Xfr)`, not `Xfr`.
Also note `fr` is not valid inside `calc()`, so this is the one value that has
to be composed as a string in JavaScript rather than in the stylesheet.

**Never round-trip a file through PowerShell 5.1's `Get-Content`/`Set-Content`
to edit it.** `Get-Content` decodes using the system ANSI codepage, not UTF-8,
so every non-ASCII character — em dashes, ⚠, ×, →, curly quotes — comes back as
mojibake and is written back that way. It corrupted `README.md` (59 sequences)
and `global.css` (26) in one pass here. The double-encode is reversible with a
cp1252 → UTF-8 inverse, but bytes cp1252 leaves undefined (0x81, 0x8D, 0x8F,
0x90, 0x9D) are lost outright — three em dashes had to be retyped by hand. Use
the Edit tool, or `[System.IO.File]::ReadAllText($p, [Text.Encoding]::UTF8)`
with a matching `WriteAllText`.

**A 3D card that passes the camera plane becomes a giant layer.** In the
collection surfer the track travels toward the viewer, so cards already surfed
past keep approaching the camera. Once nearer than the `perspective` distance
they project enormously — measured 65,982px wide. Zero opacity is not enough;
the compositor still handles a layer that size every frame. Set
`visibility: hidden` past a threshold. Any scroll-driven 3D track without a
loop has this problem, because the loop is what used to recycle those cards.

**`AnimatePresence` glyph swaps get stuck; reels do not.** The checklist
odometer originally swapped one digit element for another inside
`AnimatePresence`, keyed on the glyph. After 20 → 21 the entering digit sat
permanently at its initial state — measured `opacity: 0` and
`translateY(28.97px)`, exactly one row — so the number rendered as a single
digit. Replaced with a 0-9 reel per column translated by whole rows, which has
no mount/unmount bookkeeping to get stuck on and gives roll direction for free.
Screenshots did not catch this; measuring which glyph was centred in each
column did.

**A CSS animation outranks an inline style while it runs.** Anything animated
with `@keyframes` on a property that a motion value also writes will win during
the animation and, with `forwards`/`both` fill, keep winning afterwards. The
Checklist reveal animations are therefore transform-only with `backwards` fill;
opacity on those elements belongs entirely to the scrub.

**A rotated card is taller than the card, and it costs twice.** A card turned
θ has a bounding box of `h·cosθ + w·sinθ`, so a fan always overflows the box
its cards nominally fit in. It bit the testimonial deck twice, in both of its
implementations. The scroll-scrubbed version reserved one card height and the
fan opened straight through the line beneath it — card bottoms measured at
780px against a container ending at 660px; that needed about 1.5 card heights.
The CardStack version stands its cards on the stage floor, so the same overhang
(~55px at 30°, plus the outer pair's 20px down the arc) landed on the dots;
that one is fixed by lifting `.cstack__field` 70px off the floor rather than by
growing the stage. Whenever a fan sits above anything, measure the turned
corner, not the card.

**Key Facts transform ownership.** Scroll entrance transforms belong to each
`motion.article`; hover parallax transforms belong only to the nested
`.parallax-img`. Applying both to the card would make one transform overwrite
the other. Touch and reduced-motion modes must flatten the nested image.

---

## 6. How to verify a change — do not trust screenshots alone

Chrome driven headlessly via `puppeteer-core` for every visual change. Scripts
live in session scratchpad, but method matters more than files: **measure the
thing, don't eyeball it.** Examples that caught real bugs:

- Comparing two `getBBox()` rects caught the `%` colliding with the `N` — the
  screenshot looked fine at a glance.
- `getComputedTextLength()` against target width gave true glyph scale; hand
  estimate was off by 10%.
- Sampling `DOMMatrix.m41` at five scroll positions proved the pinned track
  travels full distance and lands closing panel on screen.
- Checking `document.documentElement.scrollWidth === clientWidth` catches
  horizontal overflow invisible in a clipped screenshot.

Always check: **1440×900 and 390×844**, `prefers-reduced-motion`, console
errors, failed requests, `npm run build`.

---

## 7. Outstanding — known gaps, none of them bugs

- **Client names are placeholders** (Advik Sharma, Rajesh Malhotra, …) on
  photographs of **identifiable real people**. Real names, with consent, before
  launch. This now also covers `clientStories` in `src/site.ts`, where **both
  the names and the testimonial quotes are invented**. Three names come from the
  client's own design artwork but are not matched to those faces, and no client
  said any of those quotes. A fabricated quote attributed to a real, recognisable
  person is a bigger problem than a placeholder name — replace every name/quote
  pair, with that client's permission, before launch.
- **The six client films are not supplied.** Every `clientStories[].src` is
  empty, so each card renders as a still figure. Set a path per card and it
  becomes a real play control, same arrangement as the checklist film.
- **The thirteen hair-system films are not supplied either.** Every
  `hairSystems[].src` is empty, so the play mark on each surfer card is a mark
  rather than a control.
- **The 100% badge is ~17px across at 390px**; its label measures marginally
  wider than the circle (`fitsInCircle` 1.01 vs 0.91 on desktop). Cosmetic; a
  media query bumping radius on narrow screens would fix it.
- **"Trusted by 6k+ men"** in slider heading is a factual claim — confirm it
  matches the real number (brand's own figure is 6,770+).
- **The 21-Point Checklist film is not supplied.** `checklistVideo.src` in
  `src/site.ts` is empty, so the block renders as a still figure carrying the
  client's poster. Set a path there — nothing else needs changing — and it
  becomes a real play control with an inline `<video>`.
- **The guidance form has no backend, and this is a launch blocker.**
  `Form.tsx` validates, shows errors and shows a success state, but nothing is
  sent anywhere — a visitor who fills it in is told a consultant will call and
  no one will. Wire it to whatever the brand already uses for leads before this
  page goes live, or take the section down until it is wired.
- **The "Real Hair Or Illusion?" film is not supplied.** `decideVideo.src` in
  `src/site.ts` is empty, so the block is a still figure carrying the client's
  own before/after photograph. Same fix as the other two films: set a path.
- **The methods section shares the Services photograph.** Both use
  `/services/non-surgical-hair-replacement.png`. A photograph per method would
  be better whenever the client has one.
- **The footer's four social links are placeholders.** Every
  `footerSocials[].href` in `src/site.ts` is `'#'`, because the brand's real
  Facebook, Instagram, X and YouTube handles have not been supplied. Four dead
  links on a live page.
- **The three salon photographs are stand-ins, and this one is a launch
  blocker.** `public/salons/mumbai.jpg`, `delhi.jpg` and `bangalore.jpg` are
  Unsplash interiors (photo IDs `1560066984-138dadb4c035`,
  `1585747860715-2ba37e788b70`, `1600948836101-f9ffda59d250`; Unsplash License,
  free for commercial use). They are somebody else's salons. Under a heading
  that says "Walk Into Any Of Our Premium Salons", beside the brand's real
  addresses, they read as a claim about premises the brand does not have —
  which is exactly the kind of thing §3's candour rule exists to prevent.
  Replace all three with real photography of the Khar, Hudson Lane and
  Indiranagar studios; only the three file paths change.
- **The deck's names and quotes are baked into the client's artwork**, not into
  our copy — the five PNGs in `public/social/` carry the name chip and the
  testimonial as pixels. One of them, *Advik Sharma*, is also a placeholder
  name used elsewhere in `src/site.ts`, so it is unclear whether the artwork's
  names are real and consented or the same placeholders. Settle this with the
  client before launch; the same consent question as the note above applies,
  and here it cannot be fixed by editing a string.
- **The step-by-step process film is not supplied either.** `processVideo.src`
  in `src/site.ts` is empty, so that block is also a still figure carrying the
  client's `steps.png` poster; same fix, set a path.
- Wordmark band reads `NATURAL`, slider heading reads "Trusted by 6k+…"; an
  earlier round considered `TRUSTED` for the band and rejected it for that
  collision. Know this before proposing it again.

---

## 8. Shared Claude/Codex continuity protocol

`PROJECT-CONTEXT.md` is canonical, repository-local memory shared by both
assistants. Root `AGENTS.md` instructs Codex to read and maintain it; root
`CLAUDE.md` does the same for Claude.

After every meaningful task, the acting assistant must:

1. Update stale current-state and outstanding-work notes instead of leaving
   contradictions behind.
2. Append a dated work-log entry with request, outcome, changed files and
   assets, decisions or content mappings, verification, remaining work.
3. Preserve accumulated history so the next assistant can resume without asking
   the user to repeat prior work.
4. Keep secrets, credentials, and hidden model reasoning out of project files.

This records all project-relevant work and decisions. Raw private reasoning and
tool-internal transcripts are intentionally not stored.

---

## 9. Work log

### 2026-08-01 to 2026-08-05 - Initial homepage implementation

- Built Vite + React 18 + TypeScript + plain-CSS foundation.
- Implemented navigation, chrome `100% NATURAL` wordmark, 3D-video hero, Find
  Your Match client slider, Secret Behind Our Natural Hairline section, pinned
  horizontal Our Big Achievements section.
- Centralized content and asset paths in `src/site.ts`, design tokens in
  `src/styles/tokens.css`, shared styling in `src/styles/global.css`.
- Added responsive behavior, reduced-motion fallbacks, reveal/tilt hooks,
  headless Chrome verification guidance. Architectural decisions, measured
  behavior, and debugging traps from this phase are retained in sections 0-7 and
  in `README.md`.

### 2026-08-05 - Install four Our Big Achievements images

- Request: replace four achievement placeholders with images newly added to root
  `Images/` folder.
- Matched and copied uploads to semantic public asset names:
  - `Frame 2085665336.png` -> `public/achievements/shark-tank-india.png`
  - `Frame 2085665337.png` -> `public/achievements/bharat-innovators-award.png`
  - `Frame 2085665338.png` -> `public/achievements/designed-for-bollywood.png`
  - `Frame 2085665039.png` -> `public/achievements/advanced-3d-scan.png`
- Updated all four `achievements[].img` values in `src/site.ts`. Existing titles
  and notes retained. Bollywood upload already has face blurred, satisfying the
  privacy requirement.
- Verification: `npm.cmd run build` succeeded; TypeScript and Vite production
  compilation passed (1,989 modules transformed).

### 2026-08-05 - Establish persistent Claude/Codex project memory

- Request: retain full project history and all future work across both Claude
  and Codex.
- Kept this existing detailed context as canonical handoff rather than starting a
  competing summary file.
- Added root `AGENTS.md` for Codex and root `CLAUDE.md` for Claude. Both require
  reading this file before work and updating it after every meaningful task.
- Updated stale achievement-placeholder notes in this file and `README.md`, then
  created this chronological work log for future entries.

### 2026-08-05 - Complete Claude's Secret-section redesign

- Request: resume last task after Claude's usage credit ended, concerning "The
  Secret Behind Our Natural Hairline".
- Found Claude's unlogged partial redesign in `src/components/Secret.tsx` and the
  Secret block of `src/styles/global.css`, based on
  `reference/Recording 2026-08-05 161655.mp4`. It replaces former before/after
  poster, claims cards, banner, and disabled play control with a pinned
  full-viewport "Elegant Contours" studio composition.
- Preserved intended scroll behavior: section spans `260vh`; heading fades and
  rises during opening 42%, reused hero model slowly scales from 1.12 to 0.97 and
  moves from -4% to 4%.
- Completed integration by moving heading lines and lede into `src/site.ts`
  (`secretTitleLines`, `secretLede`) and removing obsolete `secretVideo` and
  claim-card content.
- Fixed combined phone + reduced-motion cascade so phone offset cannot override
  static settled composition.
- Replaced obsolete Secret-section explanation in `README.md` and removed stale
  context references to old card/poster implementation.
- Verification: TypeScript and Vite production build passed (1,987 modules
  transformed). In-app browser backend was unavailable this session, so
  interactive screenshot comparison was not available; source, CSS cascade, and
  production compilation were verified.

### 2026-08-05 - Expand Secret into the full three-scene reference sequence

- Request: use all three supplied watch-reference states, not only the first:
  title + model; three natural-hairline benefits + subtext + model; and "No Line.
  No Shine. Just Real" + model. Match the animation in
  `reference/Recording 2026-08-05 161655.mp4` and live reference
  `https://thewatch.60fps.fr/`.
- Inspected live page and its public bundles. Reference uses Lenis smooth
  scrolling with GSAP/ScrollTrigger scrubbed timelines, keeping one 3D object
  continuous while content and camera framing transition around it.
- Rebuilt `src/components/Secret.tsx` as a `430vh` three-scene pinned sequence:
  - Scene 1 (`0–32%`): two-line Secret title and centred model.
  - Scene 2 (`29–71%`): exact benefit/subtext pairs at left, smaller
    right-shifted model on desktop.
  - Scene 3 (`68–100%`): closing claim and larger centred model.
- Added damped `useSpring` over scroll progress to reproduce reference's smooth
  scrub feel. Secret-section copy crossfades; one persistent model scales and
  moves between poses.
- Model render (`public/video/hero-bg.mp4`) is now reversible and scroll-scrubbed
  by mapping progress to `video.currentTime`, rather than autoplaying
  independently from user scroll.
- Added `useMediaQuery` in `src/hooks.ts` so mobile motion values keep model
  centred while its scale/vertical framing adapt. Reduced-motion mode removes the
  pin and renders all content plus one static model as a vertical sequence.
- Replaced `secretLede` with `secretBenefits` and `secretClosingLines` in
  `src/site.ts`; all exact user-facing copy remains centralized.
- Updated `src/styles/global.css` and `README.md` for three-scene layout, timing,
  responsive behavior, scroll-controlled model.
- Verification: `npm.cmd run build` passed; TypeScript and Vite transformed 1,987
  modules successfully. In-app browser backend was unavailable, so a live
  interactive screenshot pass could not be run this session.

### 2026-08-05 - Install Caveman skills for Codex

- Request: install Caveman from `https://github.com/JuliusBrussee/caveman` by
  following the repository's `INSTALL.md`.
- Read `INSTALL.md` and reviewed the Windows `install.ps1` shim before running
  anything. Ran official installer in `--dry-run --all` mode first; it detected
  Codex CLI and Qwen Code but not Claude Code, and would also have written
  repo-wide initialization rules.
- Kept the install scoped to Codex to avoid silently modifying Qwen or adding
  always-on repository rules. Ran documented Codex path:
  `npx -y skills add JuliusBrussee/caveman --skill * -a codex --yes`.
- Installed seven workspace-local skills under `.agents/skills/`: `cavecrew`,
  `caveman`, `caveman-commit`, `caveman-compress`, `caveman-help`,
  `caveman-review`, `caveman-stats`.
- Verified every installed directory contains a non-empty `SKILL.md`; main
  Caveman manifest present and declares expected `/caveman` activation.
- Installer security summary marked most skills safe/low risk, while Snyk marked
  `caveman-review` medium risk and `caveman-compress` high risk. Review those
  skills before invoking them. Installer itself reported zero Socket alerts for
  all seven.
- New skills become discoverable by Codex from the next turn/session.

### 2026-08-05 - Install Caveman plugin for Claude Code

- Request: install the same Caveman package for Claude.
- `claude` was not on shell PATH, but the installed VS Code extension contained
  Claude Code 2.1.222 at
  `C:/Users/ADMIN/.vscode/extensions/anthropic.claude-code-2.1.222-win32-x64/resources/native-binary/claude.exe`.
- Ran Caveman's official installer in `--dry-run --only claude` mode, then
  temporarily added that embedded binary directory to PATH and ran the official
  `--only claude` installation.
- Installer added the `JuliusBrussee/caveman` marketplace and installed
  `caveman@caveman` at Claude's user scope. Its plugin manifest supplies the
  `SessionStart` and `UserPromptSubmit` hooks, so standalone duplicate hooks were
  intentionally not added to `settings.json`.
- Verified with `claude plugin list`: `caveman@caveman`, version `ec83e5bace4c`,
  enabled at user scope. Plugin cache exists beneath
  `C:/Users/ADMIN/.claude/plugins/cache/caveman/`.
- Restart/open a new Claude Code session before invoking `/caveman`; plugin
  activation hooks run at session start.

### 2026-08-05 - Build Why Men Choose Us / Key Facts section

- Request: build the attached "Why Men Around The World Choose Us" section using
  motion from `reference/Recording 2026-08-05 185207.mp4` and
  `https://trionn.com/`. Reference uses three cards; this site needs four, with
  two cards in the middle.
- Used Caveman mode for conversation only. Project files and documentation remain
  normal prose, per the skill boundary.
- Interactive browser backend was unavailable. Extracted representative frames
  from the supplied nine-second, 1900×866 recording using Windows Media
  Foundation and inspected frames near 0.5, 2, 4, 6, 8 seconds. Cards rise from
  below as steeply foreshortened planes, enter on a stagger, slightly overshoot,
  settle flat; outer cards begin with opposite lateral tilts.
- Added reusable `scripts/extract-video-frames.ps1` for future local reference
  recordings. It writes requested PNG frames to a caller-supplied directory.
- Added `src/components/KeyFacts.tsx` after `Achievements` in `src/App.tsx`.
  Motion is scroll-scrubbed with `useScroll` and a damped `useSpring`:
  - copy rises from 110px and settles after a small overshoot;
  - cards start at 260px, `rotateX: 64deg`, `scale: 0.82`;
  - card starts staggered at progress 0.08, 0.16, 0.23, 0.30;
  - outer cards use opposite `rotateY`/`rotateZ` values before flattening.
- Desktop layout uses three visual columns: tall `12+ Years` card left, compact
  `6,770+` and `100%` cards stacked middle, tall `12+ Nations` card right. Below
  1080px copy stacks above the deck; below 700px cards become a 2×2 grid.
  Reduced-motion users receive the final static layout with no entrance
  transforms.
- Centralized `keyFactsTitle` and all four facts in `src/site.ts`. Added the
  attached blue `Talk To An Expert` CTA and preserved established factual values:
  12+ years, 6,770+ men, 100% natural-looking, 12+ nations.
- Added full styling in `src/styles/global.css` and documentation in `README.md`.
- Verification: two final `npm.cmd run build` passes succeeded; TypeScript and
  Vite transformed 1,988 modules. Interactive local browser screenshots were
  unavailable because no browser backend was connected.

### 2026-08-05 - Center Key Facts layout and remove CTA

- Request: revise Key Facts to follow the TRIONN reference layout, heading and
  cards centered, and remove the `Talk To An Expert` CTA.
- Changed section from left-copy/right-cards split into a centered, single-column
  composition. Heading now sits above a centered card deck constrained to
  1,160px, matching the reference's visual hierarchy.
- Preserved the requested three-column/four-card arrangement and existing
  scroll-scrubbed staggered 3D entrance animation.
- Removed CTA markup, its `ArrowUpRight` dependency, and all Key Facts CTA styles
  and responsive overrides.
- Updated `README.md` to describe the current centered, CTA-free layout.
- Verification: `npm.cmd run build` passed; TypeScript and Vite transformed 1,988
  modules successfully.

### 2026-08-06 - Compress this context file and fix the dead localhost

- Request: run `/caveman-compress` on this file, then diagnose localhost.
- Compression: the skill's own CLI could not run. Only the Microsoft Store
  `python.exe`/`python3.exe` aliases exist on this machine, so `python -m
  scripts` exits with code 49 and installs nothing. Applied the skill's
  compression rules by hand instead, leaving code blocks, tables, commands,
  paths, section lists, numbers, and proper nouns untouched and rewriting only
  prose. Result: 27,086 -> 25,790 bytes, about 4.8 percent. The modest ratio is
  expected here, because most of the file is structure and specifics the rules
  protect.
- Backup of the pre-compression file, per the skill's out-of-tree convention:
  `%LOCALAPPDATA%\caveman-compress\backups\Websiet project 2\PROJECT-CONTEXT.original.md`.
- Localhost: the dev server was healthy but bound only to `::1`. `http://
  localhost:5173` returned HTTP 200 over IPv6 while `http://127.0.0.1:5173`
  refused the connection, which is what a browser preferring IPv4 hits.
- Fix: added `server: { host: true, port: 5173 }` to `vite.config.ts`, with a
  comment recording why. Documented in §1 and as a new trap in §5.
- Verification: restarted `npm run dev`; the listener is now `::` (all
  interfaces) and `127.0.0.1:5173`, `localhost:5173`, and the LAN URL
  `192.168.5.138:5173` each return HTTP 200. `/src/main.tsx` also transformed
  and served correctly (HTTP 200).
- Files changed: `PROJECT-CONTEXT.md`, `vite.config.ts`.
- Unfinished: `npm run build` was not re-run this session, since no application
  source changed — only Vite dev-server config. If Python is installed later,
  the skill's real CLI can replace the manual compression pass.

### 2026-08-06 - Install claude-real-video, compress README, install Python toolchain

- Request: run
  `npx skills add HUANGCHIHHUNGLeo/claude-real-video -g -a codex -y`, then
  compress `README.md`, and install Python so the video skill and the
  caveman-compress CLI can actually run.
- Skill install: the command installed two skills at global user scope for
  Codex, `~\.agents\skills\claude-real-video\SKILL.md` and
  `~\.agents\skills\claude-real-video-for-agents\SKILL.md`. Both files are
  present and non-empty. Socket reported zero alerts; the generic scanner and
  Snyk both rated the pair medium risk, and the installer's own closing note is
  that skills run with full agent permissions. Read
  `claude-real-video-for-agents` before first use.
- What the skill does: it shells out to a local `crv` CLI that extracts
  scene-aware keyframes and a Whisper transcript from a video, then has the
  agent read those artifacts. Processing is local; nothing is uploaded by the
  tool itself.
- README compression: applied the same manual pass as the previous entry,
  because the compression is a prose rewrite and the file's tables, code block,
  markdown links, file paths, CSS values, and measured numbers are all
  protected. Result: 13,415 -> 12,831 bytes, about 4.4 percent. Backup at
  `%LOCALAPPDATA%\caveman-compress\backups\Websiet project 2\README.original.md`.
  One near-duplicate paragraph about the colour rule was merged into a single
  sentence; every measurement, geometry value, and breakpoint is unchanged.
- Python: installed 3.12.10 via
  `winget install --id Python.Python.3.12`. It lands at
  `%LOCALAPPDATA%\Programs\Python\Python312\python.exe`. Note that the
  pre-existing `python.exe` and `python3.exe` on PATH are Microsoft Store
  aliases that only open the Store, so call the full path until a new shell
  picks up the real interpreter.
- With the real interpreter, the caveman-compress CLI now loads and prints its
  usage line, so future compressions can use the skill's own script instead of a
  manual pass.
- FFmpeg 9.0 (`Gyan.FFmpeg`) and the base `claude-real-video==0.8.1` package are
  installed and usable through their full `%LOCALAPPDATA%` paths. The optional
  Whisper/PyTorch extras are not installed; use `--no-transcribe` for silent or
  motion-only references, and install the extras only when speech matters.
- Files changed: `README.md`, `PROJECT-CONTEXT.md`. No application source or
  build configuration was touched, so no rebuild was required.

### 2026-08-06 - Add Key Facts outer-card background images

- Request: install the new background images from `Images/` in the `12+ Years`
  and `12+ Nations` cards, and change their text to white.
- Copied `Images/12 Years Experience.png` to
  `public/key-facts/12-years-experience.png` and `Images/12 Nations.png` to
  `public/key-facts/12-nations.png`. Both originals are 1,122×1,402 PNGs.
- Added optional `image` paths to matching `keyFacts` entries in `src/site.ts`,
  then rendered them as lazy-loaded decorative backgrounds in
  `src/components/KeyFacts.tsx`.
- Added full-bleed image styling, lower contrast gradient, bottom-aligned
  labels, and white metric/label text. Middle cards and entrance animation stay
  unchanged.
- Updated `README.md` for new card treatment.
- Verification: `npm.cmd run build` passed; TypeScript and Vite transformed
  1,988 modules. Desktop/mobile screenshot automation was interrupted by next
  user request before its temporary script was created.

### 2026-08-06 - Complete all four Key Facts image cards

- Request: install the new `6,770+ Men Helped` and `100% Natural Looking`
  backgrounds, make their text white, and move their centered labels lower to
  match the two outer image cards.
- Copied `Images/6770 Men Helped.png` to
  `public/key-facts/6770-men-helped.png` and
  `Images/100 Natural Looking.png` to
  `public/key-facts/100-natural-looking.png`. Both originals are 1,484×1,060
  PNGs sized for the compact horizontal cards.
- Added the two image paths to their `keyFacts` records in `src/site.ts`.
  Existing shared `.facts__card--visual` styling now gives every card white
  text, lower alignment, a contrast gradient, and full-bleed photography.
- Updated `README.md` to document all four image-backed cards.
- Verification: `npm.cmd run build` passed with 1,988 modules. Headless Chrome
  checks at 1,440×900 and 390×844 confirmed all four images loaded at source
  resolution, every value and label computed to white, and all cards used the
  same label bottom inset: 44px desktop and 21px mobile. Visual screenshots
  confirmed correct crops and layout. Key Facts stayed clipped to its section;
  the full page still reports 49px mobile scroll width from unrelated existing
  content.

### 2026-08-06 - Move compact Key Facts labels visibly lower

- Request: correct the two compact middle cards because their text still read
  as vertically centered rather than near the bottom like the tall cards.
- Cause: all four cards shared the same 44px desktop bottom inset. That inset
  looked low on 480px-tall outer cards but close to center on 227px-tall middle
  cards.
- Added a compact-card override in `src/styles/global.css`: `6,770+ Men Helped`
  and `100% Natural Looking` now use a 14-20px desktop bottom padding. Mobile
  keeps all four cards aligned at 20px because all cards have equal height there.
- Updated `README.md` with the compact-card inset rule.
- Verification: `npm.cmd run build` passed with 1,988 modules. Headless Chrome
  at 1,440×900 measured 20px bottom insets on both middle labels versus 44px on
  outer labels; at 390×844 all four measured 21px. Screenshot inspection
  confirmed both middle text blocks now sit clearly near their card bottoms.

### 2026-08-06 - Add 3D image parallax to Key Facts cards

- Request: integrate the supplied `3d-parallax-effect-on-hover` React component
  into all Key Facts cards without deleting or replacing their current scroll
  animation or motion behavior.
- Confirmed this is a Vite + React + TypeScript + plain-CSS project, not a
  Tailwind/shadcn project. `src/components/ui` already exists, so no folder or
  alias setup was needed. Tailwind and shadcn were intentionally not installed;
  their reset would conflict with the established site styling.
- Added `src/components/ui/3d-parallax-effect-on-hover.tsx` as a prop-driven
  version of the supplied component. It accepts local image data plus `f`, `r`,
  and reduced-motion state; no new runtime dependency was required.
- Replaced each raw Key Facts `<img>` with the new component while keeping the
  existing `motion.article`, `useScroll`, `useSpring`, stagger, tilt, overshoot,
  and settle transforms unchanged. Hover transforms apply only to the nested
  `.parallax-img`, preventing transform collisions.
- Ported the original `--f`/`--r`, clip-path, perspective, and side-fold hover
  math to `src/styles/global.css`. Images are widened by the parallax factor so
  the moving clip never exposes an empty card edge. Touch and reduced-motion
  modes flatten the image.
- Updated `README.md` and the transform-ownership trap in this file.
- Verification: final `npm.cmd run build` passed with 1,989 modules. Headless
  Chrome at 1,440×900 confirmed the existing card transform changed from its
  260px/3D entry pose to settled state, hover changed only the nested image
  transform and clip path, card transform stayed unchanged, and section
  overflow remained 0. At 390×844 with reduced motion, card and image transforms
  were both `none`, all images rendered, and section overflow remained 0. No
  console errors occurred; one aborted hero-video request during mobile page
  teardown was unrelated to this section.

### 2026-08-06 - Analyze watch reference for hair-system Higgsfield prompt

- Request: use the `claude-real-video` workflow to understand
  `reference/Recording 2026-08-05 175223.mp4`, inspect
  `Images/Screenshot 2026-08-05 180801.png`, and produce an image-to-video
  prompt that transfers the reference motion to the hair-system product while
  excluding its podium and all text.
- Verified source: silent 28.967-second H.264 screen recording at 1,898 x 898
  and 30 fps. The reference begins with a small, centered front product view,
  performs a slow dolly-in and mild three-quarter tilt, holds a larger frontal
  hero view, then orbits/tilts downward to a low side profile and finishes in an
  extreme macro push where the product exits through the bottom edge.
- Inspected the supplied 1,903 x 1,047 image: dark swept-back hair system on a
  glossy white featureless mannequin, pale seamless studio, with a white round
  podium that must be removed. The prompt keeps the mannequin as a neutral form
  but makes the hair, natural frontal edge, density, and strand texture the
  visual subject.
- Tooling: installed base `claude-real-video==0.8.1` without Whisper because
  the source has no audio. Its extractor is not yet FFmpeg 9-compatible because
  it calls the removed `-vsync`; used the same scene-aware selection with the
  FFmpeg 9 replacement `-fps_mode vfr`, generating 63 keyframes, seven 3 x 3
  chronological grids, and an additional two-second timing grid. No external
  upload or web service was used.
- Outcome: prepared a scalable 10-second Higgsfield prompt with a front hero
  reveal, controlled dolly-in, smooth three-quarter orbit, side-profile finish,
  strict identity/hairstyle preservation, and explicit exclusions for podium,
  text, logos, deformation, camera shake, and excessive hair movement.
- Files changed: `PROJECT-CONTEXT.md` only. Temporary local analysis artifacts
  were written under `.tmp-crv-recording-175223`; no application source or
  user-owned media changed, so no build was required.

### 2026-08-06 - Build the 21-Point Checklist section

- Request: build "Our 21-Point Checklist For A Perfect Hair System" in the style
  of `reference/Recording 2026-08-06 123824.mp4`, replacing the reference's
  left-hand 3D object with a video block carrying
  `Images/EN → nhDwBJxIUyrzPv0hXPx2uTtYag.webp.png` as its poster, keeping the
  reference's text-reveal animation, number micro-interaction and dark
  background, but the project's own font. User supplied all 21 point titles and
  notes verbatim.
- Reference analysis: silent 19.7-second, 1918×896, 30fps screen recording of a
  dark "What We Offer" section. Extracted 20 frames at 1fps with FFmpeg 9 and
  read them as two contact sheets plus full-resolution stills. The pattern: a
  vertical list scrubbed past a fixed focus line, all rows set at the same size,
  the row in focus sharp and white and the neighbours grey behind a
  progressively stronger blur; a two-digit index at the far right changing with
  the focus; a static object at the left; row pitch constant, with the active
  row's description occupying the gap beneath it so nothing reflows.
- Added `src/components/Checklist.tsx` after `KeyFacts` in `src/App.tsx`, plus a
  Checklist block in `src/styles/global.css`. Content — `checklistTitle`,
  `checklistLede`, `checklistVideo`, and all 21 `checklistPoints` — is in
  `src/site.ts`, verbatim as supplied and in the studio working order given.
- Copied the poster to `public/checklist/21-point-checklist.png` (2176×1632).
- Mechanism: `--cursor`, a bare number naming the point in focus, is the only
  value written per frame. CSS derives the track translation
  (`-(cursor + 0.5) × row-pitch`), the progress-rail width, and each row's
  signed distance from it. Keeping it a bare number lets the row pitch stay a
  responsive `clamp()` in CSS, so this section needs no `ResizeObserver` and no
  measured inline height, unlike the pinned horizontal Achievements section.
- Section height is `100svh + 20 × 26vh` in pure CSS, with a `100svh` sticky
  child. Step drops to 20vh below 901px.
- The cursor is shaped rather than linear — see the new trap in §5. Each step
  gets a plateau so roughly two thirds of the travel between points rests on one
  of them.
- Micro-interactions: per-word mask reveal on the row taking focus, and a
  two-digit odometer whose columns key on their own glyph so 09 → 10 rolls both
  digits and 12 → 13 rolls only the second. Both are transform-only with
  `backwards` fill, because opacity on those elements belongs to the scrub.
- Colour discipline held: the single blue is the scrub rail's fill, which is the
  same role the slider controls play elsewhere. Everything else is white at
  varying opacity on `#08090b`.
- `prefers-reduced-motion` drops the pin and renders all 21 points as a static
  list with the index restored as a CSS counter, the scrub rail hidden, and the
  poster capped at 760px so the 4:3 image is not cropped to a letterbox strip.
- The film itself was not supplied. `checklistVideo.src` is empty and the block
  renders as a `<figure>` rather than a dead button; setting a path there turns
  it into a real play control with an inline `<video>`. Recorded in §7.
- Added `scripts/verify-checklist.mjs`, a reusable headless-Chrome check for
  this section.
- Verification: `npm.cmd run build` passed (1,990 modules). Headless Chrome at
  1440×900 and 390×844 sampled six scroll positions each: the cursor rests on
  exact integers with `filter: none` at four of six, worst case 0.36px blur at
  0.92 opacity; neighbours measured 3.4px blur; track translation, odometer,
  tally and rail width all tracked the cursor; poster loaded at 2176×1632; zero
  console errors and zero horizontal overflow in every mode. Reduced motion at
  1440×900 reported `checklist--still`, no pinned height, no active row and no
  odometer, as intended. The one failed request in all runs,
  `/video/hero-bg.mp4`, is the pre-existing hero-video abort on page teardown
  and is unrelated to this section.

### 2026-08-06 - Replace Secret section with dedicated hair-system video

- Request: analyze
  `reference/hf_20260806_071254_7fdf9059-b012-43b6-a96f-247a92aec984.mp4`,
  replace the current Secret-section video with it, and reposition the section
  copy wherever needed so every scene remains clean throughout the new model
  motion.
- Video analysis: 10.042-second H.264 at 1,940 x 1,068 and 24 fps, with an AAC
  stream that remains muted in the background treatment. Scene-aware extraction
  kept 21 frames; one-second timing grids confirmed the model begins small and
  centred above its podium, pushes into a frontal and then extreme hair-detail
  close-up, rotates toward profile, and finishes pulled back on the left.
- Copied the source unchanged to
  `public/video/secret-hair-system.mp4` (14,532,001 bytes; SHA-256 matches the
  reference) and centralized its public path as `secretVideo` in `src/site.ts`.
  `Secret.tsx` now uses this asset; `public/video/hero-bg.mp4` remains because
  the Hero still needs it.
- Motion/layout decisions: opening title is left-aligned while the model is
  shifted right; benefits remain left through the close-up; the closing claim
  is delayed from 77% to 89%, moved to the right, and enters only after the
  extreme macro moment while the profile model settles left. Model transforms
  are milder because the new footage already contains a strong push-in. Mobile
  keeps copy centred near the top and the model low, preventing overlap.
- Updated the stage aspect ratio to the actual source, reduced brightness from
  1.13 to 1.04 to retain white-mannequin detail, kept the radial edge mask and
  bidirectional scroll scrubbing, and retained the existing static
  reduced-motion sequence.
- Files/assets changed: `src/components/Secret.tsx`, `src/site.ts`,
  `src/styles/global.css`, `public/video/secret-hair-system.mp4`, `README.md`,
  and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed with 1,990 modules. The installed
  in-app browser runtime reported no available browser backend, so no live
  viewport screenshots were possible in this session; placement was validated
  against all extracted scene/timing grids plus source geometry. Temporary
  local analysis artifacts are under `.tmp-crv-higgsfield-secret`.

### 2026-08-06 - Simplify Secret into a cohesive full-bleed video section

- Request: fix the Secret section because its line treatment and the visual
  connection between the new background video and content were not aesthetic.
- Removed the centre plumb line, horizon line, registration cross, benefit
  separator lines, CSS gradient room, white radial core, brightness filter and
  radial video mask. Their markup and styling are gone; a border-zero safeguard
  keeps separators absent in every responsive and reduced-motion mode.
- The supplied hair-system film now fills the pinned viewport directly with
  `object-fit: cover`. Removed the outer scale/X/Y transforms because the film
  already contains its own strong dolly and rotation; only its timeline remains
  bidirectionally scroll-scrubbed.
- Added a responsive video crop: desktop stays centred; on narrow screens the
  crop moves from centre to the left during the final 28% so the closing profile
  is not lost outside the tall viewport.
- Unified all three copy scenes as borderless translucent surfaces with soft
  blur, radius and shadow. Opening stays left, benefits sit lower-left during
  the macro hair view, and the delayed closing surface stays right as the head
  settles left. Mobile surfaces use the established gutter; reduced motion
  keeps a contained 1,940:1,068 video between the static copy blocks.
- Files changed: `src/components/Secret.tsx`, `src/styles/global.css`,
  `README.md`, and `PROJECT-CONTEXT.md`. No media asset changed.
- Verification: `npm.cmd run build` passed with 1,990 modules. The browser
  backend remains unavailable, so interactive screenshots could not be taken;
  the responsive crop and copy positions were checked against the previously
  extracted one-second timeline and scene grids.

### 2026-08-06 - Build the client stories section, fix the checklist odometer

- Request: build "Some Of Our Clients With The Most Natural Hairline" using the
  same mechanism as "Our Big Achievements", with the six thumbnails supplied as
  `Images/V1 IMAGE.png` … `V6 IMAGE.png`, and placeholder names and
  testimonials until the real ones arrive.
- Added `src/components/ClientStories.tsx` after `Checklist` in `src/App.tsx`,
  plus a `.voices` block in `src/styles/global.css`. Content is in `src/site.ts`
  as `clientStoriesTitle` and `clientStories`.
- Mechanism is a deliberate copy of `Achievements.tsx`: inline
  `100vh + trackOverflow` height, `ResizeObserver` remeasure, `useScroll` driving
  the track's `x`, and a scroll-snapped swipe rail below 901px and for reduced
  motion. Kept as a separate component rather than generalised — the two
  sections share a mechanism but not a card, and one shared component taking a
  card renderer would have been harder to read than two flat ones.
- Copied the six posters to `public/clients/client-story-1…6.png`.
- Cards are 16:9 and stay 16:9. Every supplied poster is a 1920×1080
  before/after split, before left and after right. The client's design artwork
  shows portrait cards; cropping to portrait would discard the half of the frame
  the section exists to show. Added `BEFORE` / `AFTER` labels, because the split
  is otherwise unmarked and reads as one photograph of two different men.
- Quote sits on the poster over a gradient as in the design, with the gradient
  on the quote element rather than the card so it leaves with the poster when a
  film plays. Films are not supplied: every `src` is empty and each card renders
  as a `<figure>` rather than a dead button.
- Names and quotes are invented placeholders on photographs of identifiable real
  people. Flagged in §7, in `README.md`, and in a comment above the data itself.
- Panel width is `clamp(260px, 38vw, 560px)`, wider than the Achievements panel,
  because "Some Of Our Clients With" breaks again at 440px and the heading stops
  reading as the two lines it is written as. Mobile drops the title to
  `clamp(1.45rem, 6vw, 2.1rem)` for the same reason at 84vw.
- Fixed a real bug in the checklist odometer found while verifying this section:
  see the new `AnimatePresence` trap in §5. Digits are now 0-9 reels.
- Added `scripts/verify-client-stories.mjs`.
- Verification: `npm.cmd run build` passed (1,991 modules). Headless Chrome at
  1440×900 reported the section pinned at 5418px with a 5958px track and 4518px
  of travel; the track moved 0 → −2259 → −4518 linearly and left the closing
  panel's right edge at 1379px, fully inside the 1440px viewport. All six
  posters loaded at 1920×1080 as they scrolled in. At 390×844 and under reduced
  motion the section reported unpinned with the rail fallback, as intended.
  Zero console errors, zero failed requests, zero horizontal overflow in every
  mode. The odometer was re-measured by which glyph sits centred in each column:
  01, 08, 15, 21, 11, 01 across a scroll down and back up at both viewports,
  matching the tally every time.

### 2026-08-06 - Replace Secret scroll scrubbing with timed autoplay

- Request: fix the glitching Secret background film and replace the awkward
  layout with a timed composition: title at the top for the first three
  seconds, then at 7.5 seconds reveal the three benefits on the left and
  "No Line. No Shine. Just Real" on the right.
- Re-analyzed the dedicated 10.04-second film using the `claude-real-video`
  workflow and exact frames at 0, 1, 2, 3, 7.5, 8.5 and 9.5 seconds. The hair
  system fills the centre at 7.5 seconds and moves left near the end, so a
  single fixed crop cannot keep both copy groups clean at every phase.
- Rebuilt `src/components/Secret.tsx` around video time instead of scroll.
  Removed all `motion/react` scroll progress, springs and repeated
  `currentTime` writes. The muted film now autoplays and loops, pauses while
  off-screen, and resets to zero when an `IntersectionObserver` reports at
  least 35% visibility.
- Phase timing is `0–3s` title, `3–7.5s` model only, `7.5–9.25s` benefits left
  plus closing claim upper-right, and `9.25s–loop` closing claim only. Hiding
  the benefits for the late profile prevents text/model collision.
- Updated `src/styles/global.css` to keep all copy directly in the film's white
  space with no panels or lines. Proof-phase video uses source-left alignment,
  shifting the model right. Desktop returns to centre for closing; mobile uses
  25% horizontal alignment for the closing profile. Reduced motion renders a
  static stacked layout and does not autoplay.
- Added `scripts/verify-secret-autoplay.mjs` for deterministic browser checks
  and screenshots at 0.5, 3.5, 7.6 and 9.5 seconds on desktop and mobile.
- Files changed: `src/components/Secret.tsx`, `src/styles/global.css`,
  `scripts/verify-secret-autoplay.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`. No video asset changed.
- Verification: `npm.cmd run build` passed with 1,991 modules. Headless Chrome
  at 1440×900 and 390×844 confirmed the intended copy visibility and responsive
  crops at all four sample times, zero horizontal overflow, zero console errors
  and zero failed requests. Reduced-motion mode kept the video paused and all
  copy readable in the static layout.

### 2026-08-06 - Build World's Finest Thinnest Hair Systems (collection surfer)

- Request: build the section from the supplied `collection-surfer` component
  using the thirteen thumbnails in
  `Images/World's Finest Thinnest Hair Systems/`, with the component's loop
  removed — the ribbon must stop on the last card, while scrolling back up
  still runs it in reverse to the first.
- The task text assumed a shadcn/Tailwind project. This one is Vite + React +
  TypeScript + plain CSS and already has `src/components/ui`, so the component
  was ported rather than the project converted: Tailwind's preflight reset would
  restyle everything already built. No dependency was installed — `motion` is
  already here, and `framer-motion` exists only as its transitive dependency, so
  the import is `motion/react` per the project convention.
- Added `src/components/ui/collection-surfer.tsx` (the reusable mechanism) and
  `src/components/Systems.tsx` (content, heading panel, arrows), plus a `.surf`
  block in `src/styles/global.css`. Content is `systemsTitle` and `hairSystems`
  in `src/site.ts`. Posters copied to `public/systems/system-01…13.png`, all
  1056×1320.
- Four deliberate departures from the supplied component:
  - **No loop.** Dropped the duplicated item list and the modulo on scroll
    position; progress is clamped to `[0, 1]` instead.
  - **Pinned, not fixed.** The original was `position: fixed` over a 50,000px
    spacer and would have covered every other section on the page. It is now a
    sticky child of a `100vh + travel` section, the established pin here.
  - **Plain CSS** rather than Tailwind utility classes.
  - **Light ground** rather than black, matching the client's artwork and the
    light studio posters; depth is carried by aerial perspective instead.
- Two problems found by measuring, both recorded in §5 or fixed in place:
  - A card past the camera plane projected 65,982px wide. Zero opacity does not
    help; it is now `visibility: hidden` past a threshold.
  - The card one step behind the front stayed fully opaque, filled the lower
    left and clipped against the bottom edge. It now dissolves within about one
    step.
- The heading sits on its own light panel, as in the client's artwork, which
  also keeps it readable when cards pass behind that corner.
- Arrows step page scroll by exactly one card, so they drive the same scroll the
  ribbon reads rather than a competing position. Below 901px and for reduced
  motion the 3D scene becomes a scroll-snapped rail and the arrows are dropped
  with it, since there is no page scroll for them to step.
- The thirteen films are not supplied; every `hairSystems[].src` is empty and
  the play mark is a mark, not a control. Recorded in §7.
- Added `scripts/verify-systems.mjs`.
- Verification: `npm.cmd run build` passed (1,993 modules). Headless Chrome at
  1440×900 measured the section at 5940px with the counted card sitting within
  10px of the viewport centre at every sampled scroll position (727,461 /
  727,461 / 698,488 / 730,459 / 727,461 / 754,438 against a 720,450 centre).
  The track travelled 0 → −720 → −1724 → −2880 and **stayed at −2880 when
  scrolled 400px past the section's end**, then returned to −1158 scrolling back
  up: no wrap in either direction. The widest drawn card never exceeded 263px.
  All thirteen posters loaded. Prev is disabled at the first card and next at
  the last. At 390×844 and under reduced motion the section reported the rail
  fallback with the arrows hidden. Zero console errors, zero failed requests,
  zero horizontal overflow in every mode.

### 2026-08-06 - Make Secret one-shot and integrate copy with the film

- Request: stop the Secret film from looping and redesign every post-title copy
  state because the separate left benefits and right closing claim did not feel
  integrated with the footage.
- Changed playback to a true one-shot. The film starts only on its first 35%
  viewport entry, pauses when the section leaves, resumes from the same time on
  return, never restarts after ending, and holds its final frame. Removed the
  `loop` and mount-time `autoPlay` attributes; muted programmatic playback still
  meets browser autoplay policy.
- Recut the content sequence around the source film's composition: title at
  `0–3s`, clean model-only beat at `3–4.25s`, benefits at `4.25–8.65s`, and the
  closing claim from `8.65s` through the held last frame. Benefits and closing
  claim no longer compete simultaneously.
- Desktop benefits now form one quiet three-column editorial row in the film's
  unused upper white space, with a subtle stagger. During closing, the crop
  moves the model left and places the claim in the right-side white space.
  Mobile uses a compact left benefits stack while the hair stays right, then
  moves the claim above the right-side profile. No cards, borders or guide lines
  were added.
- Expanded `scripts/verify-secret-autoplay.mjs` to sample 0.5, 3.5, 4.4, 8.8
  and 10 seconds, assert `loop === false`, drive playback to its natural end,
  and verify the ended state survives leaving and re-entering the section.
- Files changed: `src/components/Secret.tsx`, `src/styles/global.css`,
  `scripts/verify-secret-autoplay.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`. No media asset changed.
- Verification: `npm.cmd run build` passed with 1,993 modules. Headless Chrome
  at 1440×900 and 390×844 confirmed every timed phase, final-frame hold, and
  persistent ended state after leaving and re-entering. Both viewports reported
  `loop: false`, zero horizontal overflow, zero console errors, and zero failed
  requests. Reduced-motion mode kept the film paused and all copy readable.

### 2026-08-06 - Revise the hair-systems surfer after review

- Request: heading on two lines with no card panel behind it; remove the arrows
  and the counter; posters fully visible rather than semi-transparent; larger
  cards; and the scroll animation should start from the far right edge of the
  screen.
- Heading is now plain two-line type at the top left. The white panel and the
  whole arrow/counter control group are gone from `Systems.tsx` and from the
  `.surf` CSS, along with `SCROLL_PER_ITEM`'s only consumer. `onStateChange` is
  still exposed by the surfer but is now inert unless a host passes it, so no
  host re-renders for state nobody reads.
- Transparency was the aerial-perspective fade on cards still to come. Removed:
  upcoming cards are fully opaque and depth comes from scale and perspective
  alone. These are product shots and a washed-out one misrepresents the product.
  The fast dissolve on cards already surfed past is kept — that one exists to
  stop a passing card filling and clipping the frame.
- Cards grew from 300×375 to 364×455, still 4:5 to match the 1056×1320 posters.
  The rail fallback's cards grew to `clamp(190px, 58vw, 320px)`.
- Starting position: the track's origin is now parked against the right of the
  viewport (`justify-content: flex-end` plus roughly half a card of padding)
  instead of centred, and the step vector was reversed to run left, down and
  back — `(-300, 46, -300)`. Running it up instead puts the small far cards
  directly behind the heading.
- Trap found while doing it, and worth knowing for any similar 3D ribbon: the
  card turn direction is not cosmetic. The cards sit to the right of the
  perspective origin, so turning the right edge toward the viewer throws it
  further right and the card reads wide; turning the left edge forward throws
  that edge right as well and folds the card up. At `rotateY(+50deg)` the front
  card measured 116px across instead of its 364px width, which looked like a
  sizing bug and was actually a sign error. The angle is now `-42deg`, and
  `perspective-origin` moved to `18% 58%`.
- Verification: `npm.cmd run build` passed (1,993 modules). Headless Chrome at
  1440×900: front card 378px wide centred at x = 1227 on both the first and the
  last card, every upcoming card at opacity 1.00, heading two lines, track 0 →
  3600 and still 3600 when scrolled 400px past the section end. At 390×844 and
  under reduced motion the rail fallback still reports correctly. Zero console
  errors, zero failed requests, zero horizontal overflow in every mode.

### 2026-08-06 - Build This Might Sound Like Your Story

- Request: build the attached section using TRIONN's "Our values" pattern from
  `reference/Recording 2026-08-06 182025.mp4`.
- Reference analysis: silent 11.93-second, 1362×664, 30fps screen recording.
  Extracted 24 frames at 2fps with FFmpeg and read them as two contact sheets
  plus full-resolution stills. The pattern: the heading holds still on the left
  while rows stack in on the right one at a time; each row is preceded by a
  narrower grey slab of itself peeking out from under the row above; the stack
  grows downward from a fixed top rather than being vertically centred.
- Added `src/components/Story.tsx` after `Systems` in `src/App.tsx`, plus a
  `.story` block in `src/styles/global.css`. Content is `storyTitle`,
  `storyPoints` and `storyCta` in `src/site.ts`, verbatim from the attached
  design. Icons come from `lucide-react`, already a dependency.
- Kept the client's card treatment — five separate white cards with blue icon
  tiles and a blue closing card — rather than the reference's single white
  block of rows. The reference supplies the motion, the client's artwork
  supplies the look, which is the same split used for Key Facts.
- The CTA copy is already consultative ("Get Guidance Now", "Zero pressure. All
  clarity."), so it needed no change under the §3 copy rules.
- Mechanism: two overlapping ramps per row, published to CSS as bare numbers.
  `--open` runs a row from its peek to full height over one step of scroll;
  `--peek-amt` starts a step earlier and is what puts the next card on screen
  as a slab. The peek height, the inter-card gap and the grey wash are all
  expressed in the stylesheet against those two numbers, so they stay
  responsive `clamp()` values.
- Rows open to their own content height with nothing measured, via a one-track
  grid animating `grid-template-rows` from `0fr` to `1fr`. See the new
  `minmax(0, …)` trap in §5 — the first attempt left every closed row standing
  at 46px instead of collapsing.
- The pinned stage is top-aligned rather than centred. Centred, the heading slid
  up the screen as the stack grew; the reference holds it still.
- Section height is `100vh + 5 × 30vh` in pure CSS. Below 901px and for reduced
  motion the pin is dropped and every card is simply open.
- Added `scripts/verify-story.mjs`.
- Verification: `npm.cmd run build` passed (1,994 modules). Headless Chrome at
  1440×900 measured the section at 2250px, the heading fixed at y = 54 through
  the entire pin, row heights `[92, 18, 0, 0, 0, 0]` at the start and
  `[92, 92, 92, 92, 92, 249]` at the end, copy opacity ramping in step with
  each row, and the stack finishing at y = 823 inside a 900px viewport.
  Scrolling back up closed the rows again. At 390×844 and under reduced motion
  the section reported unpinned with every card open. Zero console errors, zero
  failed requests, zero horizontal overflow in every mode.

### 2026-08-06 - Build Explore Our Trusted Range Of Hair Services

- Request: build the attached section "like Our Big Achievements", with the
  three photographs from `Images/Hair Services/`.
- Interpretation, stated to the user at the time: the attached artwork is an
  accordion with a photograph beside it, and only three services with one image
  each were supplied. A horizontal rail of three cards would have discarded the
  accordion, so "like Our Big Achievements" was read as *the pin* — the section
  sticks to the viewport and vertical scroll drives it — with the scroll driving
  the accordion rather than a horizontal track. Offered to pivot to a rail if
  that was the intent.
- Added `src/components/Services.tsx` after `Story` in `src/App.tsx`, plus a
  `.services` block in `src/styles/global.css`. Content is `servicesTitle`,
  `services` and `servicesAction` in `src/site.ts`. Photographs copied to
  `public/services/` under semantic names; all three are 1088×1422.
- Only the first service's copy came with the design. The other two were written
  to the §3 candour rule — the SMP line states on a sales page that SMP does not
  regrow hair, matching what the brand's other pages already say.
- Cursor uses the checklist's plateau shaping so the accordion rests on one
  service for most of the scroll between two.
- Panels open with a CSS `grid-template-rows: 0fr → 1fr` transition rather than
  a motion value: it opens to the copy's own height with nothing measured, and
  the one rule serves both the scroll-driven and the click-driven mode.
- Headings are real buttons. In pinned mode a click moves page scroll to that
  service's position instead of setting a second piece of state that would then
  disagree with the scroll position. `aria-expanded` tracks the open panel in
  both modes.
- Layout note worth keeping: the right column is `0.6fr` on purpose. The
  photograph carries its own 1088×1422 proportions and the row height follows
  from them, which is what lets the left column stretch to match and sit
  heading-top / accordion-bottom as in the artwork. At the first attempt's
  `0.86fr` the media measured 583×435 — a landscape crop of a portrait image.
  After the fix, 473×618.
- Found and fixed a pre-existing root bug while doing this: the base reset
  covered `ul` but not `ol`. See the new trap in §5. Checklist, Story and Client
  Stories had all been carrying a stray 40px indent. Re-ran
  `verify-story.mjs` and `verify-checklist.mjs` after the fix; both unchanged
  and still at zero overflow.
- Added `scripts/verify-services.mjs`.
- Verification: `npm.cmd run build` passed (1,995 modules). Headless Chrome at
  1440×900 measured the section at 1512px (`100vh + 2 × 34vh`); scrolling
  0 → 0.5 → 1 → 0.5 opened services 1, 2, 3, 2 in turn with exactly one panel
  open at each stop, `aria-expanded` matching, body heights `110/131/131` when
  open and 0 when closed, and image opacity following the open panel. Clicking
  the third heading opened the third service in every mode. All three
  photographs loaded at 1088×1422. At 390×844 and under reduced motion the pin
  was dropped and the accordion answered clicks. Zero console errors, zero
  failed requests, zero horizontal overflow in every mode.

### 2026-08-07 - Rebuild the hair-systems section as a motion arc

- Request: rebuild "World's Finest Thinnest Hair Systems" in the style of
  TRIONN's "Design in Motion" section, per
  `reference/Recording 2026-08-07 112815.mp4`.
- Reference analysis: silent 18.57-second, 1900x900, 30fps recording. Extracted
  28 frames at 1.5fps with FFmpeg and read them as two contact sheets plus
  full-resolution stills. The pattern: cards ride a wheel whose centre sits far
  below the viewport, so only the top of the circle is on screen and the row
  reads as a shallow arc; scroll rotates the wheel; the whole thing swells
  through the middle of the section and shrinks at both ends; a huge grey
  wordmark sits behind, its two lines drifting in opposite directions; small
  caption bottom-left and a link bottom-right.
- Replaced `src/components/ui/collection-surfer.tsx` with
  `src/components/ui/motion-arc.tsx` and deleted the old file. The straight 3D
  ribbon is gone; the geometry is now a wheel. `Systems.tsx` was rewritten to
  match, and the `.surf` CSS block replaced by `.arc`. Added `systemsCaption`
  and `systemsLink` to `src/site.ts`.
- The apparent zoom is one value, not two: scaling the wheel about the arc's
  apex enlarges the cards and flattens the visible arc at the same time,
  because the radius scales with everything else. That is exactly what the
  reference does.
- The guide circle under the band is drawn in CSS as the wheel itself, so the
  radius is the single number `motion-arc.tsx` and `global.css` must agree on.
  It is commented in both places.
- Wordmark drift is expressed in pixels. A percentage resolves against the
  span's own width — the full container — and threw the long first line off the
  left edge.
- Carried over unchanged from the previous version: no loop (progress clamped),
  pinned rather than fixed, plain CSS with `motion/react`, and the rail
  fallback below 901px and for reduced motion. The rail now also carries the
  heading as ordinary visible type, since there is no grey wordmark there.
- Noted for the client: the supplied posters have small printed numbers in
  their top-right corners, baked into the image files. Flagged in README.
- **Corrupted two files mid-task and repaired them.** See the new PowerShell
  encoding trap in §5. `README.md` and `src/styles/global.css` were round-
  tripped through `Get-Content`/`Set-Content` and came back as mojibake;
  reversed with a cp1252 inverse, with three unrecoverable em dashes retyped.
  Both files verified clean afterwards (0 U+FFFD, 0 mojibake) and the build
  still passes.
- Verification: `npm.cmd run build` passed (1,995 modules). Headless Chrome at
  1440x900 measured the section at 4140px; wheel rotation ran +23.85 deg -> 0
  -> -23.85 deg, zoom 0.55 -> 1.42 -> 0.72, and the card at the apex was index
  0, 3, 6, 9, 12 at scroll 0, 0.25, 0.5, 0.75, 1 — sitting at the viewport
  centre (720, 450) every time with its width growing 110px -> 284px -> 144px.
  Scrolling 500px past the section end left rotation and zoom unchanged: no
  wrap. All 13 posters loaded. At 390x844 and under reduced motion the rail
  fallback reported correctly with the heading present. Zero console errors,
  zero page errors, zero failed requests, zero horizontal overflow in every
  mode.

### 2026-08-07 - Revert the hair-systems section to the collection surfer

- Request: "I like the old version of this section, so please reset it" — the
  straight 3D ribbon that preceded the same day's motion-arc rebuild.
- Reverted `src/components/Systems.tsx`, restored
  `src/components/ui/collection-surfer.tsx`, deleted
  `src/components/ui/motion-arc.tsx`, swapped the `.arc` CSS block back for
  `.surf`, and removed `systemsCaption` / `systemsLink` from `src/site.ts`
  (they existed only for the arc's overlay).
- **The surfer file had been deleted and this is not a git repository**, so it
  was reconstructed from the session transcript rather than restored. Two
  independent checks confirm the reconstruction is faithful: the production
  bundle came back byte-identical to the last pre-arc build (317.40 kB JS /
  102.87 kB gzip, against 44.67 kB CSS for the arc versus 43.70 kB now), and
  every number recorded for that version reproduced exactly — section 5940px,
  front card 378px wide centred at x = 1227 at both the first and the last
  card, track 0 -> 3600 and still 3600 when scrolled 400px past the section
  end, 474px mobile and 732px reduced-motion section heights.
- The arc work is documented in the previous entry and summarised as a note at
  the end of the README's Section 7, so the geometry and its two traps are not
  lost — but it is not to be rebuilt without being asked.
- Verification: `npm.cmd run build` passed (1,995 modules). Headless Chrome at
  1440x900, 390x844 and 1440x900 reduced motion: all values as above, thirteen
  posters loaded, heading two lines in every mode, zero console errors, zero
  page errors, zero failed requests, zero horizontal overflow.

### 2026-08-07 - Rebuild the hair-services section as full-width photo rows

- Request: rebuild "Explore Our Trusted Range Of Hair Services" in the style of
  `reference/Recording 2026-08-07 122845.mp4`, keeping the site's own colours.
- Reference analysis: silent 14-second screen recording of a "What we do"
  section on a studio site. Extracted nine scene-deduplicated keyframes with
  `crv` (the claude-real-video CLI, `--no-transcribe`, one contact sheet). The
  pattern: three full-width rows, each with its own photograph flush against
  the row's left edge and its name plus a two-digit index on the right; the
  section pins and scroll opens one row at a time; the open row grows to about
  2.5x its closed height, so its photograph pans down and reveals more of
  itself while the description fades in under the name; names stay on the same
  line as the row grows; the heading holds still above the stack, indented to
  start on the same vertical as the names.
- Rewrote `src/components/Services.tsx` and replaced the `.services` block in
  `src/styles/global.css`. The previous layout — a two-column split with the
  accordion on the left and one shared cross-fading photograph on the right —
  is gone, along with the lucide service icons and the chevron. Content in
  `src/site.ts` is unchanged; `Service.icon` is now unused but left in place.
- Kept from the previous version: the pin, the checklist plateau cursor, the
  `grid-template-rows: 0fr -> 1fr` copy transition, headings as real buttons
  that move page scroll in pinned mode, `aria-expanded` in both modes, and the
  unpinned fallback below 901px and for reduced motion.
- Mechanism worth keeping: the row animates its own `height` between
  `--row-closed` and `--row-open`, and the photograph is `object-fit: cover`
  inside it, so growing the row is what pans the picture. The copy still uses
  the `fr` trick, so the two open on their own clocks and neither measures
  anything.
- The name sits at a fixed `--row-pad` offset from the row's top edge rather
  than being centred; only a fixed offset keeps it on one line as the row
  grows. The heading's indent is
  `calc(var(--services-media) + var(--services-gap))`, so the media column
  width and the gap are the single source of the alignment.
- Colour: rows use `#f1f3f6`, the open row `#eceff1`, on the section's white
  `--page` — the established grey ladder, keeping alternation against Story's
  `--page-2` above. The row CTA became an `--accent-ink` text link instead of
  the gradient button, because a filled button inside a row this size
  out-shouts the photograph beside it. Colour discipline is unaffected.
- Reduced motion at desktop widths keeps the two-column row and takes its
  height from the photograph (`aspect-ratio: 4 / 3`); only below 901px does the
  row stack photograph-above-copy. An earlier pass stacked in both cases and
  produced 1319x824 photographs at 1440px, which is why the two are separated.
- Updated `scripts/verify-services.mjs` for the new markup: it now measures row
  heights, the name's offset from the row top, body height and opacity, every
  media box, and the heading/name left edges.
- Files changed: `src/components/Services.tsx`, `src/styles/global.css`,
  `scripts/verify-services.mjs`, `README.md`, `PROJECT-CONTEXT.md`. No assets
  changed.
- Verification: `npm.cmd run build` passed (1,995 modules; CSS 44.05 kB).
  Headless Chrome at 1440x900 scrolling 0 -> 0.5 -> 1 -> 0.5 opened rows 1, 2,
  3, 2 with exactly one open at each stop and `aria-expanded` matching; row
  heights 297px open against 117px closed, media boxes 409x297 and 409x117,
  body heights 96/119 open and 0 closed with opacity 1 and 0; the name measured
  29px from the row top in every row at every stop; heading and first name both
  at left 504px. Clicking the third heading opened the third row in all three
  modes. At 390x844 the section reported unpinned, rows stacked at 350x219
  media, and clicks worked; at 1440x900 with reduced motion the rows stayed
  two-column at 409x307. All three photographs loaded at 1088x1422. Zero
  console errors, zero failed requests, zero horizontal overflow in every mode.

### 2026-08-07 - Build The Step-By-Step Process To Natural Hair

- Request: build the section shown in the client's artwork (heading, three
  steps, video card, `Discuss With A Consultant` CTA) but in the style of
  `reference/Recording 2026-08-07 124928.mp4` — its background colour and
  animation — using the site's own font. The reference has no video block, so
  placing the film well was left to judgement. Poster supplied at
  `Images/steps.png`.
- Reference analysis: silent screen recording of TRIONN's "How we work"
  section. Extracted eight scene-deduplicated keyframes with `crv`
  (`--no-transcribe`, one contact sheet). The pattern: a near-black stage that
  pins, a large left-aligned heading that holds still while the steps below it
  arrive one at a time; each step is a column with a small uppercase step
  label, a title, dim body copy, a `+` at the left of a thin rule, and the rule
  draws left-to-right toward the next step. Three separate frames share the
  same heading position with different step states, which is what identifies
  the section as pinned rather than a plain entrance reveal.
- Added `src/components/Process.tsx` after `Services` in `src/App.tsx`, a
  `.process` block in `src/styles/global.css`, and `processTitle`,
  `processSteps`, `processVideo`, `processAction` in `src/site.ts`. Step copy is
  verbatim from the client's artwork.
- Film placement decision: the top of the stage is a two-column masthead —
  heading and CTA left, film right. It fills the upper right the reference
  leaves empty, keeps the heading on the same left edge as the steps beneath
  it, and puts the film above the row instead of inside it, where a
  1632x1224 poster would out-shout three short pieces of copy. The play pill
  sits bottom-left of the poster rather than centred, because a centred control
  lands straight across the client's face — the finished hairline is the whole
  point of that image.
- Poster copied to `public/process/steps.png` (1632x1224, 2,413,446 bytes). The
  film itself was not supplied: `processVideo.src` is empty, so the block
  renders as a `<figure>` carrying the poster rather than a dead button, the
  same convention as `checklistVideo`. Recorded in §7.
- Stage colour is `#08090b`, the same ground as the 21-Point Checklist, so the
  page has one dark surface rather than two nearly-identical ones. Colour
  discipline held: the only blue is the CTA button.
- No eyebrow tag, unlike the reference's "OUR PROCESS" rail — §3's visual
  system removed eyebrows site-wide and the heading already names the process.
- Reveal windows are `START = [0.1, 0.36, 0.62]` with a 0.16 copy window and a
  0.22 rule window, as fractions of the pinned scroll. The component never
  needs the pin's length, because `useScroll` reports it as 0 to 1 whatever
  `--process-step` (32vh) measures.
- Still mode (below 901px, and reduced motion) drops the pin and stacks
  everything with all rules drawn. Those overrides carry `!important` because
  the values they replace are inline styles written by motion values; nothing
  weaker beats an inline style.
- Added `scripts/verify-process.mjs`.
- Files changed: `src/components/Process.tsx` (new), `src/App.tsx`,
  `src/site.ts`, `src/styles/global.css`, `scripts/verify-process.mjs` (new),
  `public/process/steps.png` (new), `README.md`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (1,996 modules; CSS 47.47 kB).
  Headless Chrome at 1440x900 sampled five scroll positions: copy opacity ran
  0/0/0 -> 0.94/0/0 -> 1/0.88/0 -> 1/1/0.81 -> 1/1/1 and the three rule scales
  0/0/0 -> 0.5/0/0 -> 1/0.45/0 -> 1/1/0.41 -> 1/1/1, with the four `+` markers
  lighting in turn and the fourth only at the end; the heading stayed at
  top 264px at every position, confirming the pin; stage 1440x900, film
  568x426, poster loaded at 1632x1224, background `rgb(8, 9, 11)`. At 390x844
  and at 1440x900 with reduced motion the section reported unpinned with all
  copy at opacity 1 and all rules at scale 1. Zero console errors, zero page
  errors, zero failed requests, zero horizontal overflow in every mode.

### 2026-08-07 - Build Why Thousands Of Men Choose American Hairline

- Request: build the section shown in the client's artwork — heading plus the
  four pillars — in the manner of `reference/Recording 2026-08-07 142837.mp4`.
- Reference analysis: silent screen recording of a light marketing section.
  Extracted nine scene-deduplicated keyframes with `crv` (`--no-transcribe`,
  one contact sheet). The pattern: the section pins, a large left-aligned
  two-line heading holds still, and beneath it a four-bay grid divided by
  hairline rules fills one bay at a time, left to right — icon first, then
  title and body. One frame catches the grid standing empty with its rules
  already drawn, which is the detail that makes the sequence read as a grid
  filling rather than four cards fading in.
- Added `src/components/Pillars.tsx` after `Process` in `src/App.tsx`, a
  `.pillars` block in `src/styles/global.css`, and `pillarsTitle`, `pillars`
  plus the `Pillar`/`PillarIcon` types in `src/site.ts`. Copy is verbatim from
  the artwork.
- Two deliberate departures from the artwork, both because the reference
  governs presentation here:
  - The artwork is a card carousel with prev/next round buttons. Those became
    the reference's open columns; the controls went with them, so all four
    pillars are on screen at once and scroll is the only control.
  - The artwork's icons sit in blue tiles. They are monochrome here —
    `tokens.css` reserves blue for the active link, the two buttons, the
    eyebrow and the slider controls, and four decorative tiles are none of
    those. Icons are lucide `Medal`, `Cpu`, `Sparkles`, `ShieldCheck`.
- Heading is left-aligned rather than centred as in the artwork, which is both
  what the reference does and what §3's visual system already settled for this
  site.
- The artwork's bold survives as `**` markers inside the strings in
  `src/site.ts`, so the copy stays readable there; an `Emphasised` helper in
  the component splits on `**` and renders `<strong>`. Thirteen bold runs
  across the four pillars.
- Mechanism: pinned `100vh + 4 x 26vh`, reveal starts `START = [0.08, 0.28,
  0.48, 0.68]` with a 0.17 copy window and a 0.07 icon window, so the icon
  leads its own bay. The rules belong to the `ol` and its `li` borders, never
  to the animated contents, which is what keeps the empty grid standing.
- Responsive: at 1080px the grid folds to two columns and the border rules are
  re-expressed with `nth-child`, because "every column after the first" puts a
  stray rule on row two's left edge and none on its top. Below 720px it is one
  column with a rule above each. Still mode (below 901px, reduced motion)
  drops the pin and overrules the scrubbed values with `!important`, the same
  reason as the Process section.
- Section background is white `--page`, following the dark Process section
  above it.
- Added `scripts/verify-pillars.mjs`.
- Files changed: `src/components/Pillars.tsx` (new), `src/App.tsx`,
  `src/site.ts`, `src/styles/global.css`, `scripts/verify-pillars.mjs` (new),
  `README.md`, `PROJECT-CONTEXT.md`. No assets were added.
- Verification: `npm.cmd run build` passed (1,997 modules; CSS 49.88 kB).
  Headless Chrome at 1440x900 sampled five scroll positions: copy opacity ran
  0/0/0/0 -> 1/0/0/0 -> 1/1/0.12/0 -> 1/1/1/0.41 -> 1/1/1/1, strictly left to
  right; icon opacity led it each time. Column left edges stayed
  60/390/720/1050 and rule widths 0/1/1/1px at every position, with the grid's
  top rule at 1px throughout — the grid does not move while the bays fill. The
  heading stayed at top 227px, confirming the pin. Thirteen `<strong>` runs
  rendered and zero `**` markers survived into the copy. At 390x844 and at
  1440x900 with reduced motion the section reported unpinned with all four
  columns at opacity 1 and the rules folded to the stacked arrangement. Zero
  console errors, zero page errors, zero failed requests, zero horizontal
  overflow in every mode.

### 2026-08-07 - Build the before/after testimonial deck

- Request: build a wholly new section in the manner of
  `reference/Recording 2026-08-07 165502.mp4`, from the five images in
  `Images/new section/`.
- Reference analysis: silent screen recording of the Lando Norris site's
  "What's up on socials". Extracted seventeen scene-deduplicated keyframes with
  `crv` (`--no-transcribe`, two contact sheets). The pattern: the section pins,
  a centred two-line heading holds still, and a stack of portrait cards held
  like a hand opens into a wide fan as the scroll advances, then closes again
  on the way back. A short "follow" line and a row of social links sit under
  the deck, arriving after the fan is open.
- The supplied images turned out to be finished testimonial artwork, not raw
  photographs: each 1472x1840 RGBA PNG carries a before/after split portrait, a
  name chip and a quote, with its own rounded corners on transparency. That
  decided the section's subject — client transformations in the clients' own
  words — so the heading is "Before And After, In Their Own Words", written to
  §3's plain-over-clever rule.
- Added `src/components/Deck.tsx` after `Pillars` in `src/App.tsx`, a `.deck`
  block in `src/styles/global.css`, and `deckTitle`, `deckCards`, `deckFollow`,
  `deckLinks` in `src/site.ts`. Artwork copied to `public/social/` under the
  five client names.
- Mechanism worth keeping: the whole fan is one angle. Every card rotates about
  a pivot far below the deck (`transform-origin: 50% 260%`), so a single degree
  value per card produces the sideways spread, the arc drop and the tilt at
  once. The value runs 1.6 degrees between neighbours when closed to 13 when
  open; the middle card never turns and the end pair reach 26. Closed is not
  zero on purpose — a square stack reads as one thick card rather than a deck
  waiting to open. Card z-order is the order a hand is held in: middle in
  front, each neighbour a layer back.
- New trap, recorded in §5: a rotated card is taller than the card, so the hand
  has to reserve about 1.5 card heights. At the card's own height the fan
  opened straight through the follow line beneath it — measured card bottoms at
  780px against a container ending at 660px.
- Two consequences of the artwork being finished. The shadow is a `drop-shadow`
  filter rather than `box-shadow`, so it follows the alpha instead of drawing
  the rectangle the picture is not. And the name and quote exist only as pixels
  inside each file, so every card's `alt` names the client and quotes him in
  full — that is the only route a screen reader has to those words.
- The heading is centred here, against the site's usual left alignment: the
  deck is a symmetrical object and a left-aligned heading over a centred fan
  reads as a mistake rather than a choice. Background is `--page-2`, following
  the white Pillars section above it.
- Still mode (below 901px, reduced motion) drops the pin and turns the hand
  into a horizontal snap rail, the same fallback the hair-systems surfer uses.
- Two things left open and recorded in §7: the three social links are `'#'`
  placeholders because the real handles were not supplied, and the artwork's
  names and quotes are baked into the images — one of them, *Advik Sharma*, is
  also a placeholder name used elsewhere in `src/site.ts`, so whether these are
  real consented clients needs settling with the client, and here it cannot be
  fixed by editing a string.
- Added `scripts/verify-deck.mjs`.
- Files changed: `src/components/Deck.tsx` (new), `src/App.tsx`, `src/site.ts`,
  `src/styles/global.css`, `scripts/verify-deck.mjs` (new),
  `public/social/*.png` (five new assets), `README.md`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (1,998 modules; CSS 52.44 kB).
  Headless Chrome at 1440x900 sampled five scroll positions: card angles ran
  -3.2/-1.6/0/1.6/3.2 degrees closed to -26/-13/0/13/26 open, symmetric about a
  middle card that stayed at 0 throughout; the painted span grew 328px -> 1026px
  and card centres spread 685..755 -> 405..1035, all inside a 1440px viewport;
  z-order stayed 3/4/5/4/3; the follow line held opacity 0 until the fan was
  open and reached 1 at the end. Scrolling 400px past the section end left
  angles and span unchanged: the fan is clamped. Heading stayed at top 89px,
  confirming the pin. All five PNGs loaded at 1472x1840 and every `alt`
  measured 138-159 characters, so no card is announced without its words. At
  390x844 and at 1440x900 with reduced motion the section reported unpinned
  with all angles 0 and the rail scrolling inside itself. Zero console errors,
  zero page errors, zero failed requests, zero horizontal page overflow in
  every mode.

### 2026-08-07 - Rebuild the testimonial deck on the supplied CardStack

- Request: make the deck's cards bigger, closer to the reference screenshot,
  and drive the section with the supplied `card-stack.tsx` component instead of
  the scroll-scrubbed fan built earlier the same day.
- The component arrived written for Next + Tailwind + shadcn with a
  `framer-motion` import. This project is Vite + React + plain CSS with no
  Tailwind, no shadcn, no `@/` alias and no router, so it was ported rather
  than pasted, the same route taken for `3d-parallax-effect-on-hover`:
  - `next/link` became a plain `<a>`.
  - Every Tailwind utility became a rule in a new `.cstack` block in
    `src/styles/global.css`, with the original class-to-rule mapping recorded
    in that block's comment. Installing Tailwind would bring its preflight
    reset and restyle every section already built.
  - `framer-motion` became `motion/react`, per §4.
  - `cn()` was dropped; with plain CSS the class lists are short enough to join
    inline.
  - The geometry, props and behaviour are the original's: fan spread, overlap,
    perspective, depth, tilt, active lift/scale, spring, loop, autoplay,
    pause-on-hover, drag-to-swipe on the active card, arrow keys, dots,
    `onChangeIndex`, `renderCard`.
  - One prop added: `variant="bare"`, which drops the component's border,
    radius and shadow. Our cards are finished artwork with their own rounded
    corners on transparency, and a bordered box would draw the rectangle the
    picture is not.
  - `any` in the original's `onDragEnd` became `unknown`; the project builds
    with `tsc -b`.
- `src/components/Deck.tsx` was rewritten around it. The section is **no longer
  pinned**: the component's animation answers to which card is active, not to
  scroll, so a pin buys nothing. The previous scroll-scrubbed fan, its
  `transform-origin: 50% 260%` pivot geometry and the `--still` snap rail are
  gone; the component's own responsive parameters replace the rail.
- Card size: the component takes pixels, not lengths, so the responsive step
  moved into `Deck.tsx`. Height leads at 58vh capped at 540px and width follows
  from the artwork's 1472:1840, unless the viewport is too narrow to carry it.
  The active card measures 435x543 at 1440x900, against 374x468 before — the
  requested increase.
- Two fixes found by measuring, both recorded:
  - The fan hangs below its own cards. A card turned 30 degrees reaches about
    55px past its own bottom edge and the outer pair fall a further 20px down
    the arc, so standing the fan on the stage floor put those corners straight
    through the dots. `.cstack__field` is lifted 70px off the floor, which
    fixes it without changing the stage height. Added to the §5 trap.
  - On a phone the fan is deliberately wider than the screen, which produced
    57px of horizontal page overflow. `.deck` now carries `overflow-x: clip`;
    `hidden` would force `overflow-y: auto` alongside it and turn the section
    into a scroll container.
- Mobile shows three cards instead of five with a tighter overlap; the outer
  pair bleed past both edges by design.
- Files changed: `src/components/ui/card-stack.tsx` (new),
  `src/components/Deck.tsx` (rewritten), `src/styles/global.css` (the `.deck`
  block replaced, `.cstack` block added), `scripts/verify-deck.mjs` (rewritten
  for the new mechanism), `README.md`, `PROJECT-CONTEXT.md`. No assets changed;
  `src/site.ts` is untouched.
- Still open, unchanged from the previous entry: the three social links are
  `'#'` placeholders, and the names and quotes are baked into the artwork with
  their consent status unsettled. Both are in §7.
- Verification: `npm.cmd run build` passed (1,999 modules; CSS 53.30 kB, JS
  334.26 kB). Headless Chrome at 1440x900: five cards mounted at
  -29.8/-14.9/0/14.9/29.8 degrees with the active card unturned, active card
  435x543, stage 602px, fan span 1302px inside a 1440px viewport, five dots
  with the third lit on load. Clicking the fifth dot moved the active card to
  the fifth and re-fanned the rest around it; ArrowLeft then moved it to the
  fourth. At 390x844 three cards mounted at -15.9/0/15.9, active card 292x365,
  and the dots and arrow keys worked the same way. Horizontal page overflow is
  0 in every mode, down from 57px before the clip. All five PNGs loaded at
  1472x1840 and every `alt` measured 138-159 characters. Zero console errors,
  zero page errors, zero failed requests.

### 2026-08-07 - Combine the deck's two animations, strip its footer

- Request, three parts: put padding between the section heading and the cards;
  remove the dots, the "See more of these transformations on social" line and
  the social links, leaving only the heading and the cards; and bring back the
  reference recording's scroll-opened fan while keeping the component's
  click-a-card-to-centre-it.
- The third part is the substantive one. The two behaviours are not in
  conflict once the spread and the selection are treated as separate things, so
  `ui/card-stack.tsx` gained one prop: `openness`, 0..1, which scales
  `cardSpacing`, `stepDeg` and the arc drop. At 1 it is the component's own
  geometry; at 0 the cards collapse onto each other. The active index goes on
  doing what it did.
- `src/components/Deck.tsx` pins the section again — `100vh + 2 x 34vh` — and
  maps scroll 0.05..0.62 onto openness 0.08..1. Closed is 0.08 rather than 0
  because a perfectly square stack reads as one thick card rather than a deck
  waiting to open.
- `openness` is passed as React state, not as a motion value, because the stack
  animates toward it on a spring rather than being written every frame. The
  scroll is quantised to 40 steps so the re-render count stays sane; the spring
  makes the steps invisible.
- Bug found and fixed during verification: `useMotionValueEvent` only fires on
  a *change*, so with the state initialised to the open value the deck rendered
  fully fanned at scroll 0 and then closed as you scrolled in — backwards.
  Initialised to the closed value and added a mount-time `openness.get()` read,
  which also covers a page loaded with the section already in view.
- Removed: `showDots`, the `.deck__follow` block and its markup, and
  `deckFollow`/`deckLinks` from `src/site.ts`. Autoplay is off too — with
  scroll opening the hand and clicks moving it, a third thing moving the deck
  on a timer was noise. The §7 note about placeholder social links is gone with
  the links; the note about the artwork's baked-in names and quotes stands.
- Padding: `.deck__in` gap raised to `clamp(30px, 5.5vh, 72px)`, measured 61px
  between the heading's baseline box and the nearest card at 1440x900. The
  field lift dropped from 70px to 40px now that there are no dots to clear.
- Files changed: `src/components/ui/card-stack.tsx`, `src/components/Deck.tsx`,
  `src/styles/global.css`, `src/site.ts`, `scripts/verify-deck.mjs`,
  `README.md`, `PROJECT-CONTEXT.md`. No assets changed.
- Verification: `npm.cmd run build` passed (1,999 modules; CSS 53.07 kB).
  Headless Chrome at 1440x900 across the pin: card angles ran
  ±2.2/±1.1/0 at scroll 0, ±17.1/±8.5/0 at 0.35, and ±29.8/±14.9/0 at 0.7 and
  1, with the painted span growing 453px -> 921px -> 1302px and staying there —
  the fan opens with scroll and clamps. The active card held 435x543 centred on
  x = 720 at every position, and the heading stayed at top 79px. Clicking the
  leftmost card moved the active card from Advik Sharma to Sameer Warma and it
  arrived centred at x = 720. Dots and follow both count 0. At 390x844 and at
  1440x900 with reduced motion the section reported unpinned with the hand open
  and clicks still centring a card. All five PNGs loaded at 1472x1840, every
  `alt` 138-159 characters, horizontal page overflow 0, zero console errors,
  zero page errors, zero failed requests in every mode.

### 2026-08-07 - Build Uses Advanced 3D Scan Technology

- Request: a new section built like the "Flowty on your wrist" part of
  `reference/Recording 2026-08-07 180443.mp4` — a headline with a picture set
  inline in it that grows as you scroll. Copy specified: "Uses Advanced 3D" on
  the first line and "Scan Technology" on the second, with
  `Images/Frame 2085665039.png` sitting between "Uses Advanced" and "3D".
- Reference analysis: silent screen recording. Extracted ten scene-deduplicated
  keyframes with `crv` (`--no-transcribe`, two contact sheets). The move: a
  near-black stage, a large light-grey two-line headline, and a small rounded
  chip set inline in the first line between two words. Scroll grows the chip
  out of its slot until it fills the viewport; the type never moves and dims as
  the panel passes in front of it; the corner radius stays a plausible radius
  the whole way and reaches zero at full bleed.
- Added `src/components/Scan.tsx` after `Deck` in `src/App.tsx`, a `.scan`
  block in `src/styles/global.css`, and `scanTitle`/`scanImage` in
  `src/site.ts`.
- The supplied file is byte-identical to the one already installed as
  `public/achievements/advanced-3d-scan.png` for the Big Achievements card
  (2960x1672, 4,392,951 bytes), so the section references that path instead of
  shipping a second 4.4 MB copy.
- Mechanism worth keeping: **the picture is not scaled.** It is an absolutely
  positioned panel whose `left/top/width/height` are interpolated between two
  measured rects, the slot's and the stage's. A scale transform cannot do this
  job — the panel has to change aspect as it grows so `object-fit: cover`
  re-crops the photograph, and a scaled radius would be magnified by the same
  factor as everything else, so a 14px corner would read as a 120px one by the
  time it filled the screen.
- The slot is an empty inline-block that is never painted. It reserves the
  picture's place in the sentence, and measuring it is how the panel knows
  where that place is at any type size and in any wrap. It is re-measured by a
  `ResizeObserver` on both the pin and the slot, and again after
  `document.fonts.ready`, because the line reflows when the webfont lands.
- Accessibility detail found by measuring rather than looking: the spaces
  around the slot have to be real characters. The slot is `aria-hidden`, so
  with the gap coming only from its margin the heading was announced as "Uses
  Advanced3D Scan Technology". Fixed with literal spaces and the slot's margin
  cut to 0.02em.
- Colour discipline held: `#08090b` stage with `#d5d7dc` type, no blue.
- Still mode (below 901px, reduced motion) drops the pin, collapses the slot so
  the heading reads as two plain lines, and puts the picture under it as an
  ordinary block. The unpinned stage carries the gutter itself, since the panel
  is a sibling of the wrap rather than a child of it.
- Added `scripts/verify-scan.mjs`.
- Files changed: `src/components/Scan.tsx` (new), `src/App.tsx`, `src/site.ts`,
  `src/styles/global.css`, `scripts/verify-scan.mjs` (new), `README.md`,
  `PROJECT-CONTEXT.md`. No assets added.
- Verification: `npm.cmd run build` passed (2,000 modules; CSS 54.32 kB).
  Headless Chrome at 1440x900 across the pin: the panel ran
  `163x103` at the slot -> `565x353` -> `1112x695` -> `1440x900` exactly
  covering the stage, its origin moving 930,344 -> 0,0; the radius ran 14px ->
  8.9 -> 1.9 -> 0; the title held at top 343px at every position while its
  opacity ran 1.00 -> 0.77 -> 0.28. The heading's two lines read "Uses Advanced
  3D" and "Scan Technology" with the spaces present. The image loaded at
  2960x1672 with a 109-character alt. At 390x844 and at 1440x900 with reduced
  motion the section reported unpinned, the slot measured 0x0, and the picture
  sat below the heading at 350x198 and 1319x745. Zero console errors, zero page
  errors, zero failed requests, zero horizontal overflow in every mode.

### 2026-08-07 - Move the 3D Scan section up behind Systems

- Request: place the newly built "Uses Advanced 3D Scan Technology" section
  directly below "World's Finest Thinnest Hair Systems".
- Moved `<Scan />` in `src/App.tsx` from the end of `<main>` to between
  `<Systems />` and `<Story />`. Nothing else changed; the section carries its
  own pin height and background, so its behaviour does not depend on what
  precedes it.
- Background alternation still reads: Systems ends on its light gradient, the
  dark `#08090b` scan stage cuts against it, and Story resumes on `--page-2`
  afterwards.
- Files changed: `src/App.tsx`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,000 modules). Headless Chrome at
  1440x900 reports the section order as secret, work, facts, checklist, voices,
  surf, scan, story, services, process, pillars, deck — scan now immediately
  after surf. Re-ran `scripts/verify-scan.mjs`: the panel still runs 163x103 at
  the slot to 1440x900 covering the stage, radius 14px to 0, title held at top
  343px, unchanged from its previous position. At 390x844 and under reduced
  motion the section reported unpinned with the picture below the heading. Zero
  console errors, zero failed requests, zero horizontal overflow in every mode.

### 2026-08-07 - Build the Frequently Asked Questions section

- Request: build the FAQ from two supplied artworks — a Consultation set and a
  Hair System set behind a pill toggle — but in the visual theme of a third
  reference image, a dark stage with translucent glass cards that the user
  liked for its colour, layout and overall feel.
- Added `src/components/Faq.tsx` after `Deck` in `src/App.tsx`, a `.faq` block
  in `src/styles/global.css`, and `faqTitle`, `faqRating`, `faqGroups`,
  `faqCta` plus the `FaqItem`/`FaqGroup` types in `src/site.ts`. This is item
  17 of the client's 21-section spine, now marked built.
- The dark ground is CSS, not a photograph: one broad diagonal sheen over two
  blurred pools on a `#17191d -> #08090b` gradient, the same construction as
  the Secret section's room. The reference's look comes from the light falloff
  and the glass, not from the fabric it was shot on, so there was no reason to
  add a megabyte for a backdrop that is mostly out of focus.
- Two deliberate departures from the client's artwork, both recorded in the
  README:
  - The artwork fills the closing "Still have questions?" panel with brand
    blue. On a dark stage that reads as a second background rather than as a
    call to action, so the panel is glass like the rows above it and the blue
    stays where `tokens.css` puts it — on the button.
  - The rating stars are amber, against the site's one-blue rule, for the same
    reason the 100% badge on the wordmark gets its own colour: a rating that is
    not gold reads as decoration rather than as a rating. The numbers are the
    brand's own, 4.9 and 300+ Google reviews.
- Each tab keeps its own open row, so returning to a tab returns it as you left
  it rather than resetting to the first answer. Closing the open row is a legal
  state — nothing open is allowed.
- Copy: only the first answer in each tab came with the artwork; the rest were
  written to §3's candour rule. **Two answers deliberately give no number**,
  because those numbers are unresolved in the client's own material — the
  servicing interval is stated three ways and so is base durability. They say
  what decides the figure and leave the figure to the consultant, so nothing
  ships one of three. Noted against the flag in §3.
- One question was corrected for agreement: the artwork's "How long does hair
  replacement systems last?" reads "How long does a hair replacement system
  last?".
- Added `scripts/verify-faq.mjs`.
- Files changed: `src/components/Faq.tsx` (new), `src/App.tsx`, `src/site.ts`,
  `src/styles/global.css`, `scripts/verify-faq.mjs` (new), `README.md`,
  `PROJECT-CONTEXT.md`. No assets added.
- Verification: `npm.cmd run build` passed (2,001 modules; CSS 58.13 kB).
  Headless Chrome at 1440x900: six rows per tab with the first open and
  `aria-expanded` agreeing; clicking the fourth question opened it and closed
  the first, answer heights moving 61/0/0/0/0/0 to 0/0/0/83/0/0; clicking it
  again closed everything; switching to Hair System swapped all six questions
  and moved `aria-labelledby` to `faq-tab-hair-system`; switching back returned
  the Consultation tab in the state it was left in, closed. Rows measured
  `rgba(255,255,255,0.07)` with `blur(14px)`, rising to 0.11 when open; stars
  measured `rgb(245,182,56)`. Same behaviour at 390x844 and under reduced
  motion at 1440x900. Zero console errors, zero page errors, zero failed
  requests, zero horizontal overflow in every mode.

### 2026-08-07 - Build Walk Into Any Of Our Premium Salons

- Request: build the salons section in the manner of the "Selected work and
  explorations" section in `reference/selected-work-reference.mp4`, using the
  three supplied addresses, with a stand-in salon photograph per branch.
- Reference analysis: extracted nineteen scene-deduplicated keyframes with
  `crv` (`--no-transcribe`, three contact sheets). The pattern turned out to be
  the one this project already has: a pinned section whose vertical scroll
  drives a horizontal track through an intro panel, a run of project cards
  each with type set over its own image and a caption beneath, and a closing
  statement panel. That is "Our Big Achievements" exactly, so
  `src/components/Salons.tsx` is a sibling of `Achievements.tsx` and reuses its
  measured-distance approach rather than inventing a second one.
- Added `Salons.tsx` between `Deck` and `Faq` in `src/App.tsx` — spine position
  16, immediately before the FAQ — plus a `.salons` block in
  `src/styles/global.css` and `salonsTitle`, `salons`, `salonsAction`,
  `salonsOutro` in `src/site.ts`. Addresses are the client's, verbatim.
- Each card sets the city over the photograph and the address underneath, with
  the artwork's `Get Direction` button opening Google Maps in a new tab
  (`target="_blank" rel="noreferrer"`). The city is the card's `<h3>`
  positioned over the image rather than repeated below it; the first pass had
  both and it was announced twice and read as a duplicate on screen.
- Section is white `--page`: the deck above sits on `--page-2` and the dark FAQ
  follows, so this is the light beat between them.
- **The three photographs are stand-ins and this is a launch blocker.** They
  are Unsplash salon interiors (IDs `1560066984-138dadb4c035`,
  `1585747860715-2ba37e788b70`, `1600948836101-f9ffda59d250`; Unsplash License,
  free for commercial use), fetched and cropped to 1600x1200 into
  `public/salons/`. Under a heading that says "Walk Into Any Of Our Premium
  Salons", beside the brand's real addresses, somebody else's salon reads as a
  claim about premises the brand does not have. Recorded in §7; only the three
  file paths need to change once real photography arrives. The `alt` text says
  "Placeholder interior" so nothing in the markup asserts otherwise either.
- Added `scripts/verify-salons.mjs`.
- Files changed: `src/components/Salons.tsx` (new), `src/App.tsx`,
  `src/site.ts`, `src/styles/global.css`, `scripts/verify-salons.mjs` (new),
  `public/salons/mumbai.jpg`, `delhi.jpg`, `bangalore.jpg` (new), `README.md`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,002 modules; CSS 61.01 kB).
  Headless Chrome at 1440x900 measured the section at 2,431px with the track
  2,971px wide; scrolling 0 -> 0.5 -> 1 moved the track 0 -> -765 -> -1,531px
  and the three cards' left edges 529/1183/1837 -> -1002/-348/306, so the
  travel is real and complete. The closing panel finished at 960-1,380px inside
  a 1,440px viewport — on screen, not scrolled past. All three photographs
  loaded at 1600x1200; the three addresses measured 100, 73 and 81 characters
  against the client's originals; all three `Get Direction` links carry
  `_blank`, `noreferrer` and a `maps.google.com` href. At 390x844 and under
  reduced motion the section reported unpinned with the snap rail active. Zero
  console errors, zero page errors, zero failed requests, zero horizontal page
  overflow in every mode.

### 2026-08-08 - Build the footer

- Request: build the footer in the manner of
  `reference/Recording 2026-08-08 112654.mp4`, using the client's own footer
  content from the supplied artwork, keeping the reference's oversized site
  name and its looping text marquee but carrying more content in the loop.
- Reference analysis: extracted four scene-deduplicated keyframes with `crv`
  (`--no-transcribe`, one contact sheet). The treatment: the site's name set
  enormous as outlined type across the top, wide enough to run off both edges
  and be cropped by the viewport; a looping marquee of one repeated phrase
  directly beneath it, separated by an asterisk; centred contact details; and a
  thin legal row at the bottom.
- Added `src/components/Footer.tsx`, rendered after `<main>` in `src/App.tsx`
  (the page had no footer at all before this), a `.foot` block in
  `src/styles/global.css`, and `footerWordmark`, `footerBlurb`,
  `footerMarquee`, `footerColumns`, `footerSocials`, `footerContact`,
  `footerLegal` in `src/site.ts`. This is item 20 of the spine, now built.
- Mechanism worth keeping: **the loop is two identical copies translated by
  exactly -50%.** At -50% the second copy sits precisely where the first began,
  so the restart is invisible, nothing is measured and no JavaScript runs. The
  second copy is `aria-hidden` so the phrases are not announced twice. It
  pauses on hover and `prefers-reduced-motion` stops it outright.
- The reference loops one phrase; this loops six, alternating consultative
  invitations with §3's proof numbers — "Talk to an expert", "12+ years",
  "6,770+ men", "100% natural-looking", "12+ nations", "Discuss with a
  consultant". Nothing invented.
- The giant wordmark is `color: transparent` with a `-webkit-text-stroke` in
  the brand blue at 28% opacity. It is `aria-hidden`: the same words are
  already the logo, the legal line and the page title, so announcing them a
  fourth time is noise. Its overflow is contained by the footer rather than the
  page — page overflow measured 0 at every width.
- The X glyph is drawn inline. lucide has no X (Twitter) icon and substituting
  one that means something else would be worse than eight lines of path data.
- Content is the client's, verbatim: blurb, six Quick Links, three Solution
  links, phone and email as real `tel:`/`mailto:` links, and the legal line.
  The back-to-top button honours reduced motion, jumping rather than smooth
  scrolling.
- Ground is `#eef2fb`, the pale blue of the client's artwork, which also gives
  the dark FAQ above it something to close against.
- Open item recorded in §7: all four social links are `'#'` placeholders,
  because the real handles have not been supplied.
- Added `scripts/verify-footer.mjs`.
- Files changed: `src/components/Footer.tsx` (new), `src/App.tsx`,
  `src/site.ts`, `src/styles/global.css`, `scripts/verify-footer.mjs` (new),
  `README.md`, `PROJECT-CONTEXT.md`. No assets added; the footer reuses
  `public/brand/logo.png`.
- Verification: `npm.cmd run build` passed (2,003 modules; CSS 64.09 kB).
  Headless Chrome at 1440x900: the wordmark measured 1,540px wide inside a
  1,440px viewport with `rgba(0, 0, 0, 0)` fill and a 1.5px stroke — outlined
  and cropped as intended; two marquee tracks of identical length with the
  second `aria-hidden="true"`; the animation running and the track moving
  -124px to -220px over 1.6s; all six phrases present; three link columns with
  6, 3 and 2 links; four social labels; `tel:9222666111` and
  `mailto:info@americanhairline.com`; the logo loaded at 416x164; the legal
  line exact; and the back-to-top button returning `scrollY` to 0. At 390x844
  the wordmark measured 527px against a 390px viewport and the columns stacked.
  Under reduced motion the marquee reported `animation-name: none` and did not
  move at all across 1.6s. Zero console errors, zero page errors, zero failed
  requests, zero horizontal page overflow in every mode.
- Note for the next session: the dev server had exited before this run and was
  restarted with `npm run dev` before the verification script could connect.

### 2026-08-08 - Replace the footer marquee's phrases

- Request: swap the footer loop's wording for five supplied phrases and drop
  everything that was there.
- `footerMarquee` in `src/site.ts` is now `100% natural-looking`, `India's #1
  Top Experts`, `Tailored with Technology`, `Celebrity-Trusted`, `Genuine
  Advice`. The previous six — the consultative invitations and the proof
  numbers — are gone.
- Worth knowing: four of the five are the Pillars section's own headings, so
  the loop now echoes that section rather than carrying wording of its own.
  Changing a pillar's title should change the matching line here. The comment
  above `footerMarquee` says so.
- Nothing else moved. The loop is still two identical copies translated -50%,
  so a different number of phrases needs no other adjustment.
- Files changed: `src/site.ts`, `README.md`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,003 modules). Headless Chrome
  read the five phrases in order at 1440x900, 390x844 and under reduced motion,
  with both marquee copies at equal length (102 characters) and the second
  still `aria-hidden="true"`. The track moved -124px to -218px over 1.6s under
  normal motion and did not move at all under reduced motion. Wordmark, link
  columns, socials, contact links, logo, legal line and the back-to-top button
  all unchanged. Zero console errors, zero failed requests, zero horizontal
  overflow in every mode.

### 2026-08-08 - Build Backed By Thousands Of Confident Men

- Request: build the section from the supplied artwork — a dark panel with a
  Google rating card and a YouTube card — in the theme of the same reference
  image the FAQ was built to, and place it below "Some Of Our Clients With The
  Most Natural Hairline". Two icon PNGs supplied.
- This is item 8 of the client's spine, the "dark trust band — 4.9 Google ·
  50K+ YouTube", now built and sitting exactly where the spine puts it: after
  item 7.
- Added `src/components/Backed.tsx` after `ClientStories` in `src/App.tsx`, a
  `.backed` block in `src/styles/global.css`, and `backedTitle`, `backedProof`,
  `backedFoot` in `src/site.ts`. Icons copied to `public/backed/google.png` and
  `youtube.png` (both 168x168).
- Treatment reuses the FAQ's construction — a dark ground with one broad
  diagonal sheen over two blurred pools, and translucent glass cards on top —
  because both sections were built to the same reference image and the page
  should not carry two different dark looks that were meant to be the same one.
  Unlike the FAQ this is a contained rounded panel on the white ground, which
  is what the artwork shows and what stops it reading as a second FAQ.
- **4.9 renders as four whole stars and a half, never five.** `Stars` takes the
  rating and derives the glyphs from it rather than being handed a count, so
  rounding a rating up is not a thing this component can do. The amber is the
  same sanctioned exception as the FAQ's.
- The artwork's "HAPPY CLIENTS" pill above the heading is deliberately absent:
  §3's visual system removed eyebrow tags site-wide in favour of one heading
  per section, the same call made in the Pillars section. Flagged in the README
  as one line to restore if the client wants it.
- Both figures are §3 proof numbers, not new claims.
- Below 760px the two cards stack and each card's right-hand aside drops under
  its figure, since at that width it has nothing left to be right-aligned
  against.
- Added `scripts/verify-backed.mjs`.
- Files changed: `src/components/Backed.tsx` (new), `src/App.tsx`,
  `src/site.ts`, `src/styles/global.css`, `scripts/verify-backed.mjs` (new),
  `public/backed/google.png` and `youtube.png` (new), `README.md`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,004 modules; CSS 66.54 kB).
  Headless Chrome at 1440x900: panel 1,319x391 with a 23px radius, two glass
  cards at `rgba(255,255,255,0.07)` with `blur(14px)` sharing a top edge at
  394px; values "4.9" and "50K+ Subscribers"; labels "Google Rating" and "on
  YouTube"; asides "300+ reviews" and "Growing community"; stars read
  `full, full, full, full, half` in `rgb(245,182,56)`; both icons loaded at
  168x168; the closing line exact; zero eyebrow elements. At 390x844 the panel
  measured 350x449 and the cards stacked at 309 and 432. Same values under
  reduced motion. Zero console errors, zero page errors, zero failed requests,
  zero horizontal overflow in every mode.

### 2026-08-08 - Rework the Backed section after review

- Request: the section did not look good; diagnose it properly and make it
  aesthetic, engaging and interactive.
- Diagnosis, measured rather than eyeballed. At 1440x900 the two cards spanned
  the full container at **790x110 each** — letterboxes — inside a 1,320x391
  panel wrapped around 900px of content, so about 210px of empty black sat on
  each side. Each card's qualifier ("300+ reviews", "Growing community") sat at
  the far right, roughly 450px from the figure it qualifies, which is past the
  distance at which the eye binds a label to its number. Nothing on the card
  was dominant: the figure was set at the same weight and near the same size as
  its own caption. And nothing on the panel responded to the pointer at all.
  Mobile was fine throughout — this was a desktop-width failure.
- Four layout fixes:
  1. Panel capped at 1,012px (the content's 900px plus its padding) so the dark
     area hugs its content. Now 1,012x456.
  2. Cards stacked rather than single-row: 439x197 instead of 790x110.
  3. The qualifier moved up beside the icon as a chip, so it reads as metadata
     about the figure below it.
  4. The figure became the largest thing on the card — 46px against the label's
     16px.
- Three interactions added, all reduced-motion aware:
  - The figures count up when the panel arrives, driven by
    `requestAnimationFrame` in a small `useCount` hook, because what is being
    animated is the text itself rather than a style. `backedProof` now carries
    `count`, `decimals` and `suffix` alongside `value`; `value` is what a
    screen reader gets and what ships if the count never runs, so the two have
    to be kept in step.
  - The stars light in sequence behind the count, so the rating assembles
    rather than appearing finished. The half star still cannot become a whole
    one — the glyphs are derived from the rating, not handed over as a count.
  - A soft spotlight follows the pointer across each card, written as
    `--mx`/`--my` custom properties so the card's own transform stays free for
    its hover lift. That is the same split `useTilt` makes elsewhere, and the
    same reason.
- Accessibility detail: the animated figure is `aria-hidden` with the settled
  value in an `sr-only` span beside it, so nobody is announced a number
  mid-count.
- Under `prefers-reduced-motion` the count-up is skipped in the component, the
  spotlight is `display: none`, the stars are lit and unscaled, and the hover
  lift is removed.
- Files changed: `src/components/Backed.tsx`, `src/site.ts`,
  `src/styles/global.css`, `scripts/verify-backed.mjs`, `README.md`,
  `PROJECT-CONTEXT.md`. No assets changed.
- Verification: `npm.cmd run build` passed (2,004 modules; CSS 67.52 kB).
  Headless Chrome at 1440x900: panel 1,012x456 (was 1,320x391), cards 439x197
  each (was 790x110), inner content 900px, figure 46.08px, stars still
  `full, full, full, full, half` in `rgb(245,182,56)`, both icons 168x168, zero
  eyebrow elements. At 390x844 the panel measured 350x535 with the cards
  stacked at 259 and 431 and the figure at 30.4px. Reduced motion reported the
  same geometry with the animations off. Zero console errors, zero page errors,
  zero failed requests, zero horizontal overflow in every mode.

### 2026-08-08 - Build the last three page sections

- Request: research and build three sections from supplied artwork — "Real Hair
  Or Illusion? Watch & Decide", "Our Trusted Methods For A Natural Look" and
  "Fill This Form To Get The Right Guidance" — engaging, interactive,
  responsive, placed wherever they belong. No reference recording this time;
  the treatment was left open.
- All three are spine items: 10, 14 and 18. They now sit exactly where the
  client's own order puts them — Decide after Systems/Scan, Methods between
  Process and Pillars, Form after the FAQ and before the footer. That leaves
  only items 2 and 19 unbuilt.
- **The rule the three share, and the research behind it.** Perspective earns
  its place on a single object the visitor is meant to inspect and stops
  earning it the moment it is applied to everything. So the tilt is on the
  video card (5 degrees) and on the methods photograph (4 degrees), it is
  pointer-driven rather than scroll-driven, and it is nowhere near any type or
  any input. All three use the existing `useTilt`, which writes `--rx`/`--ry`
  rather than a transform — that is what lets an element carry both the tilt
  and its own hover change without one overwriting the other, and the hook
  already refuses coarse pointers and reduced motion. Below 901px the
  `perspective` is dropped outright so the phone does not pay for a scene it
  cannot use.
- `Decide.tsx`: one card with the poster oversized inside its frame, moving
  against it, so the card has a front and a back rather than being a flat plane
  rotated. Film not supplied, so it is a `<figure>` rather than a dead button;
  the poster is the client's own before/after photograph, installed as
  `public/decide/before-after.png` from `Images/image.png` (1088x816).
- `Methods.tsx`: the artwork's arrangement — heading top-left, accordion
  bottom-left, one photograph filling the right column. Worth keeping: the
  photograph's own 1088x1422 proportions set the row's height
  (`aspect-ratio` plus `align-self: start`), which is what lets the left column
  stretch to match it. Left to stretch instead, the row was only as tall as the
  copy and the portrait rendered as a 528x392 landscape crop; 528x690 after.
  This is the same trap the Services section hit in August 2026 and the same
  fix. Two methods, because two is what the artwork shows — Zycon™ would slot
  straight in. The photograph is shared with Services; per-method photography
  is in §7.
- `Form.tsx`: deliberately the one section with no perspective. A form is the
  only place a visitor has to be accurate, and tilting the surface someone is
  typing into moves the target under the pointer. It gets the interaction that
  matters in a form instead: a lit field on focus, validation that waits until
  a field is finished and only then re-checks on every change, errors bound to
  their input with `aria-describedby`, and a success state with `role="status"`.
  The phone check accepts the spaces, dashes and `+91` people actually type and
  counts what is left.
- **The form has no backend and that is now the sharpest item in §7.** It tells
  a visitor a consultant will call and nothing is sent anywhere. Wire it or
  take the section down before launch.
- Added `scripts/verify-three.mjs`, which drives all three in one pass.
- Files changed: `src/components/Decide.tsx`, `Methods.tsx`, `Form.tsx` (all
  new), `src/App.tsx`, `src/site.ts`, `src/styles/global.css`,
  `scripts/verify-three.mjs` (new), `public/decide/before-after.png` (new),
  `README.md`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS 75.47 kB).
  Headless Chrome at 1440x900: the decide card measured 980x735 with no
  transform at rest and `2.5deg / -3deg` under the pointer, poster loaded at
  1088x816; the methods media measured 528x690 with both accordion rows
  answering clicks and exactly one open at a time; the form rejected an empty
  submit with all three errors bound to their own inputs, rejected "9876",
  cleared the name and city errors as soon as they were fixed, accepted
  "+91 98765 43210" and rendered the success state with `role="status"`. At
  390x844 the perspective reported `none`, the methods media took the
  photograph's own proportions at 350x457, and the form behaved identically.
  Under reduced motion the card transform stayed `none` through a hover. Zero
  console errors, zero page errors, zero failed requests, zero horizontal
  overflow in every mode.

### 2026-08-08 - Wrap the homepage as version 1, and put the project under git

- Request: freeze the current homepage as version 1 so that future work is
  version 2 and "give me homepage version 1" can be answered later. The user
  asked whether that is a problem.
- It was a problem, and the reason is worth keeping: **this was not a git
  repository.** A `.gitignore` existed but no `.git`, so "version 1" lived only
  in the current files and would have been destroyed by the next edit. The
  project had already paid for this once — the collection surfer had to be
  reconstructed from a session transcript in the 2026-08-07 revert, because
  there was no history to check out. Assistant memory does not survive a
  session; only files do.
- User chose both snapshot methods, and to track everything except
  `reference/`.
- `.gitignore` extended: `reference/` (205 MB of recordings — inputs to the
  work, not part of it), `versions/` (git already holds those bytes at their
  tags), `.tmp-*` and `.vframes.mjs`. `Images/` and both PDF folders are
  tracked on the client's instruction, which puts the repo at about 580 MB. It
  has no remote; pushing it anywhere would need Git LFS first.
- **`core.autocrlf` set to false before the first commit.** Git's Windows
  default was about to rewrite LF to CRLF in all 70-odd source files on the
  next checkout. That would have touched every file on disk and invited exactly
  the encoding damage recorded in §5. The index was cleared and re-added after
  the setting changed, so the first commit stores the true bytes: the second
  `git add` produced zero conversion warnings against 70 on the first.
- Commit `1f4d0b0`, 234 files, 20,314 insertions, tagged `homepage-v1`. The
  message records what is built, what remains (spine items 2 and 19), and the
  three launch blockers, so the tag explains itself without this file.
- Plain-folder copy at `versions/homepage-v1/` — 234 files, 579.5 MB, produced
  with `git archive` from the tag, so it is the tag byte for byte and needs no
  git to read.
- Added §1b to this file: the version table, the exact commands to hand back a
  named version, the recipe for cutting the next one, and why the three git
  settings above are what they are.
- Files changed: `.gitignore`, `PROJECT-CONTEXT.md`. New: `.git/`,
  `versions/homepage-v1/`. No application source was touched, so no rebuild was
  needed — the tag is the same tree the last build passed on (2,007 modules).
- Verification: `git ls-tree -r homepage-v1` returns 234 files; the top level
  contains `src`, `public`, `Images`, both PDF folders, `scripts` and the
  config, and does not contain `reference`, `node_modules`, `dist` or
  `versions`. `git status` is clean, which also confirms `versions/` is being
  ignored rather than tracked.
