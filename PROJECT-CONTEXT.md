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
| 2 | Hero — chrome band + unified scroll-controlled 3D film + Find-Your-Match slider | `HeroSecret.tsx`, `Hero.tsx`, `Wordmark.tsx`, `MatchSlider.tsx` |
| 3 | "The Secret Behind Our Natural Hairline" | `Secret.tsx` |
| 4 | "Our Big Achievements" — pinned horizontal scroll | `Achievements.tsx` |
| 5 | "Why Men Around The World Choose Us" — TRIONN Key Facts entrance | `KeyFacts.tsx` |
| 6 | "Our 21-Point Checklist" — pinned dark stage, scrubbed list | `Checklist.tsx` |
| 7 | "Some Of Our Clients…" — pinned horizontal client films | `ClientStories.tsx` |
| 8 | "Backed By Thousands Of Confident Men" — dark proof panel, glass cards | `Backed.tsx` |
| 9 | "World's Finest Thinnest Hair Systems" — circular gallery, ring turns as the section scrolls | `Systems.tsx`, `ui/circular-gallery.tsx` |
| 10 | "Real Hair Or Illusion? Watch & Decide" — one tilting 16:9 video card | `Decide.tsx` |
| 11 | "This Might Sound Like Your Story" — stacking cards; phone fallback reveals the open cards once on entry | `Story.tsx` |
| 12 | "Explore Our Trusted Range Of Hair Services" — pinned full-width row accordion; phones show all three rows open | `Services.tsx` |
| 13 | "The Step-By-Step Process To Natural Hair" — pinned dark stage, steps arriving one at a time | `Process.tsx` |
| 14 | "Our Trusted Methods For A Natural Look" — accordion beside a tilting photograph | `Methods.tsx` |
| 15 | "Why Thousands Of Men Choose American Hairline" — pinned four-bay grid filling left to right | `Pillars.tsx` |
| — | "Before And After, In Their Own Words" — testimonial deck on the ported CardStack; phones show a small swipe cue under the fan. **Not in the client's 21-section spine**; added on request 2026-08-07 | `Deck.tsx`, `ui/card-stack.tsx` |
| — | "Uses Advanced 3D Scan Technology" — pinned dark stage, inline picture grows out of the headline; phones use a short reveal and one scan-light pass. **Not in the spine either**; added on request 2026-08-07, and placed directly after Systems on the client's instruction | `Scan.tsx` |
| 16 | "Walk Into Any Of Our Premium Salons" — pinned horizontal rail, one card per city | `Salons.tsx` |
| 17 | "Frequently Asked Questions" — tabbed glass accordion on a dark stage | `Faq.tsx` |
| 18 | "Fill This Form To Get The Right Guidance" — validated guidance form | `Form.tsx` |
| 20 | Footer — outlined giant wordmark, looping marquee, link columns | `Footer.tsx` |

**Page 2 — "Stick-On or Clip-On"** (`#/stick-on-or-clip-on`). The site is no
longer one page. Routing is a hash switch in `App.tsx` matching on a leading
slash, so the nav's bare anchors (`#guide`, `#solutions`) can never be read as
routes — see the 2026-08-18 routing entry in §9.

| | Section | Component |
|---|---|---|
| — | Page shell | `pages/StickOnClipOn.tsx` |
| 1 | Hero — "Stick-On or Clip-On: Which One Fits Your Lifestyle?" | `ChoiceHero.tsx` |
| 2 | "Which Option Feels More Like You?" — dark theme interactive choice card (matching homepage FAQ theme) | `WhichOption.tsx` |
| 3 | "World's Finest Thinnest Hair Systems" — the homepage's circular gallery, reused | `Systems.tsx` |
| 4 | "Clip-On Vs. Stick-On Hair Systems" — clean minimal comparison table | `Comparison.tsx` |
| 5 | "Two Easy Methods To Get Your Hair Back" — two blue-gradient cards with scroll-driven image scaling | `TwoMethods.tsx` |
| 6 | "Real Results That Showcase True Transformations" — pinned horizontal track, the client-stories mechanism | `Transformations.tsx` |
| 7 | "Still Confused? Not Sure What Best For You?" — scroll-illuminated dark stage, word-by-word scrub | `StillConfused.tsx` |

**Page 3 — "Hair Patch vs Hair System"**
(`#/hair-patch-vs-hair-system`). This page is being built section by section.

| | Section | Component |
|---|---|---|
| — | Page shell | `pages/HairPatchVsSystem.tsx` |
| 1 | Hero — "Hair Patch vs Hair System: What’s the Difference?" | `PatchSystemHero.tsx` |
| 2 | "Hair Patch Vs. Hair System" — clean responsive comparison table | `PatchSystemComparison.tsx` |
| 3 | "Our 21-Point Checklist for a Perfect Hair System" — homepage section reused unchanged | `Checklist.tsx` |
| 4 | "The Simplest Way to Understand It:" — clothing analogy in a Backed-style dark panel | `SimplestWay.tsx` |

**Page 5 — "Stick-On System Lifespan"** (`#/stick-on-lifespan`). This page is
being built section by section.

| | Section | Component |
|---|---|---|
| — | Page shell | `pages/StickOnLifespan.tsx` |
| 1 | Hero — "How Long Does a Stick-On Hair System Last?" | `StickOnLifespanHero.tsx` |
| 2 | "Choose Your Perfect Balance: Look, Comfort, Or Lifespan?" — dark glass trade-off stage | `BalanceChoice.tsx` |
| 3 | "Two Base Options For Your Stick-On Hair System" — two cards with accessible detail overlays | `BaseOptions.tsx` |
| 4 | "Car Example: Think Of It Like This Before Choosing" — sports-car-versus-SUV analogy | `CarExample.tsx` |
| 5 | "Thin Base Vs. Thick Base" — responsive rating table | `BaseComparison.tsx` |
| 6 | "Still Confused Between Bases?" — two static self-assessment cards | `BaseChoice.tsx` |
| 7 | "World's Finest Thinnest Hair Systems" — shared circular gallery | `Systems.tsx` |
| 8 | Guidance form — homepage form reused unchanged | `Form.tsx` |

**Page 7 — "Clip-On Hair System"** (`#/clip-on-hair-system`). The supplied
fourteen-section design is complete, including the premium Zycon teaser and
overlay.

| | Section | Component |
|---|---|---|
| — | Page shell | `pages/ClipOnHairSystem.tsx` |
| 1 | Clip-On guide hero | `ClipOnHero.tsx` |
| 2 | "The Real Fears Men Have" | `ClipFears.tsx` |
| 3 | "Three Things Every Man Wants" | `ClipPillars.tsx` |
| 4 | "Clip-On Is Perfect For Men Who…" | `ClipPerfectFor.tsx` |
| 5 | "Premium Clip-On With Medicated Hygiene" | `ClipZyconRange.tsx` |
| 6 | "Don't Just Hide Hair Loss." | `ClipZyconCta.tsx` |
| 7 | "Learn How The Stick-On Hair System Works" | `ClipLearnStickOn.tsx` |

**Page 8 — "Stick-On Hair System"** (`#/stick-on-hair-system`). The supplied
sixteen-section design is complete and all currently supplied photography is
installed under `public/stick-on-system/`.

| | Section | Component |
|---|---|---|
| — | Page shell and product-specific sections | `pages/StickOnHairSystem.tsx` |
| 1 | "The Closest Thing to a Hair Transplant" hero | page-local `StickHero` |
| 2 | "Why Most Local Hair Systems Fail" | page-local `LocalFail` |
| 3 | Four-step consultation card rail | page-local `Consultation` |
| 4 | Ultra-signature natural hairline proof | page-local `NaturalHairline` |
| 5 | "Stick-On Is Perfect For Men Who…" | page-local `StickPerfectFor` + `ScrollStack.tsx` |
| 6–9 | Achievements, Checklist, Backed, and HairlineTruth | shared components |
| 10 | Premium Stick-On Zycon teaser and accessible detail dialog | shared `ClipZyconRange.tsx`, content prop |
| 11–16 | Local comparison, ClientStories, scalp safety, FAQ, booking close, and Clip-On cross-link | page-local components plus shared `ClientStories.tsx` |

**SMP solution page** (`#/smp`). Complete from the supplied section references;
all supplied SMP photography is installed as web-sized derivatives under
`public/smp/`.

| | Section | Component |
|---|---|---|
| — | Page shell and ten SMP sections | `pages/Smp.tsx` |
| 1–2 | SMP hero and seven-card 4:5 results rail: pinned vertical-to-horizontal scroll above 900px, native swipe below, no arrows | shared `GuideHero` via page-local `SmpHero`; page-local `SmpResults` |
| 3 | About SMP teaser and accessible detail dialog | page-local `AboutSmp` |
| 4–5 | Suitability cards and six-situation checklist | page-local `PerfectFor`, `Situations` |
| 6 | Four-step process rail with full-width, source-ratio cut-outs; native swipe/keyboard browsing, no arrows | page-local `SmpProcess` |
| 7 | Five-tab concern/treatment finder | page-local `TreatmentFinder` |
| 8–10 | Why choose, dark FAQ, and guidance form | page-local components |

**Not** the full site. Brand has ~13 pages (§3); the requested pages are being
built section by section. Do not scaffold pages nobody asked for.

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

On the page the nations figure is worded **"12+ Countries / Clients Served"**,
not "12+ Nations / Client Base". Readers told the client they did not
understand the old wording; do not "correct" it back. The number is the same
proof point either way.

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

**Unified Hero/Secret video composite.** `HeroSecret.tsx` owns the only film
element, `.heroSecret__film`, which stays sticky across both sections and maps
Hero scroll to 0–7 seconds and Secret scroll to 7 seconds through the final
frame. Its background-isolated `hair-system-unified-clean.mp4` encode, the
transparent film frame's
`mix-blend-mode: darken`, and a small video brightness lift depend on the page
behind both sections staying white. Tinted backgrounds reveal the video
rectangle. Do not add a second video, handoff clone or crossfade.

**The shared film frame must stay transparent.** The layer order is chrome
wordmark (`z-index: 0`) → blended film frame (`z-index: 1`) → Hero copy and the
entire Secret section (`z-index: 2`). An opaque white background on the film
frame hides the wordmark before `darken` can composite it, and putting a white
edge-light pseudo-element above the video washes the same letters out. Likewise,
leaving `.secret` without its own foreground stacking context lets the shared
sticky film cover copy that is locally `z-index: 2` inside Secret. Keep blending
on `.heroSecret__filmFrame`, not only its child video, and keep `.secret`
transparent at `z-index: 2`.

**`.stage` is only the Hero semantic/layout wrapper.** The sticky film is its
sibling inside `.heroSecret`, not its child. Keep `.stage` scoped to Hero and
keep the persistent film inside `HeroSecret`; moving either to `<main>` would
cover unrelated sections.

**`textLength` + `lengthAdjust="spacingAndGlyphs"`** distributes whatever text
you give it across the same 1000 units. Adding a word does not widen the band —
it squeezes every glyph. "NATURAL" measures 923 units intrinsically, renders at
~1.083×; beyond roughly 0.85–1.1× type reads distorted.

**SVG viewBox headroom scales with viewport width.** Extending wordmark viewBox
upward added ~83px dead space under nav at 1440px, more on wider screens. Use
`padding` on `.wordmark` for spacing; use `overflow: visible` (already set) if
something must overhang.

**Unified scroll seeking requires the scrub encode and serialized writes.**
`hair-system-unified-clean.mp4` has a keyframe every six frames. The shared
controller never starts a second seek while the first is active; only the
newest target is kept. Do not point `unifiedHairVideo` at raw `reference/v3.mp4`
or replace the serialized seek queue with per-frame `currentTime` writes.

**Final film centering has separate transform ownership.** The source's last
profile is left-biased. `.heroSecret__filmMotion` shifts only during Secret's
final 18%, while `.heroSecret__film` keeps its scale and mobile centering
transform. Do not merge those transforms; one CSS transform would overwrite
the other. Mobile film width is intentionally 158.4% (132% × 1.2).

**Secret title reveal is per word, but exit belongs to the heading.** Each
`.secret__titleWord` maps its own opening scroll window to opacity, 12px blur
and a 16px rise; the parent `.secret__title` owns only the later whole-title
fade. Keeping those transforms separate prevents the exit from overwriting the
word motion. The visual lines are `aria-hidden` and the `h2` carries one joined
`aria-label`, so the split markup does not fragment the spoken heading. Reduced
motion must leave every word sharp and static.

**Reduced motion uses the same film once.** `.heroSecret--still` makes its frame
absolute over Hero and holds time zero; Secret drops its pin and renders all
copy in normal order. Do not add a second contained Secret video for this mode.

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

**Stroked text draws contours a fill was hiding.** The footer's giant outlined
wordmark rendered `A` with a rectangle through it and `e` with a rectangle and
a tail, while every other letter looked right. Nothing was wrong with the CSS:
Inter builds those two glyphs from separate contours that overlap the rest of
the letter, which is invisible when filled and traced in full when stroked. It
reproduces at every weight from 400 to 800, so it is the glyph construction and
not the weight — changing weight, size or colour will not fix it. The fix is
`paint-order: stroke fill` with the glyph filled in the ground colour, so the
fill covers the internal lines and the inner half of the stroke; double the
stroke width to keep the same visible outline. Expect this on any stroked type,
in any font, and check the whole alphabet rather than the first word.

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

- ~~The rejected Hero-to-Secret crossfade awaited a unified film~~ **— resolved
  2026-08-13.** `reference/v3.mp4` is now integrated through the locally graded,
  seek-optimized `public/video/hair-system-unified-scrub.mp4`. One paused video
  element spans Hero and Secret; no crossfade, clone or bridge remains. The
  source's box-room shading is substantially flattened in the served asset and
  finished by white-page compositing. Keep the original source untouched.

- ~~`clientStories` names and quotes are invented~~ **— resolved 2026-08-08.**
  The client supplied all six real names and, in a second pass, all six real
  quotes for "Some Of Our Clients With The Most Natural Hairline". Nothing in
  that block is written by an assistant any more. Do not edit the wording for
  style: these are things real, identifiable men said, and a testimonial's
  worth is that it is theirs. One lighter item remains — confirm each man
  agreed to appear by name, since the photographs identify them.
- ~~The `Client` slider names are placeholders~~ **— resolved 2026-08-08.** The
  client supplied all six real names for the hero slider: Rohan Bera, Daljit
  Singh, Chandan Singh, Rylan Rodrigues, Arun Sharma, Advik Sharma. No invented
  names remain anywhere on the page. Several of these men now appear in more
  than one section, so a name changed in one place has to be changed in the
  others — `clients`, `clientStories`, and the deck artwork where the names are
  baked into the PNGs.
- **Consent to appear is the one thing still unconfirmed.** Every photograph in
  the hero slider, the client stories and the deck identifies a real man by
  name. Confirm each of them agreed to appear on the site before launch. This
  is the last item left from what used to be the placeholder-names problem.
- **The six client films are not supplied.** Every `clientStories[].src` is
  empty, so each card renders as a still figure. Set a path per card and it
  becomes a real play control, same arrangement as the checklist film.
- **The thirteen hair-system films are not supplied either.** Every
  `hairSystems[].src` is empty, so the play mark on each surfer card is a mark
  rather than a control.
- ~~The 100% badge is ~17px across at 390px~~ **— resolved 2026-08-14.** The
  full SVG badge group scales to about 33px on phones, keeping the circle,
  label and shadow locked together.
- **"Trusted by 6k+ men"** in slider heading is a factual claim — confirm it
  matches the real number (brand's own figure is 6,770+).
- **The 21-Point Checklist film is not supplied.** `checklistVideo.src` in
  `src/site.ts` is empty, so the block renders as a still figure carrying the
  client's poster. Set a path there — nothing else needs changing — and it
  becomes a real play control with an inline `<video>`.
- **The guidance forms have no backend, and this is a launch blocker.**
  Homepage `Form.tsx` validates and shows a success state, while the SMP page's
  local form explicitly says online lead delivery is not connected. Neither
  sends data anywhere. Wire both to whatever the brand already uses for leads
  before launch.
- **The "Real Hair Or Illusion?" film is not supplied.** `decideVideo.src` in
  `src/site.ts` is empty, so the block is a still figure carrying the client's
  own before/after photograph. Same fix as the other two films: set a path.
- **Stick-On still borrows the Services photograph.** The client supplied a
  clip-on photograph on 2026-08-08, so Clip-On now has its own and the panel
  cross-fades between them; Stick-On is the remaining one pointing at
  `/services/non-surgical-hair-replacement.png`. Any photograph added here
  should be the panel's 0.765 aspect ratio, as both current files are, or it
  will be cropped to fit.
- **The footer's four social links are placeholders.** Every
  `footerSocials[].href` in `src/site.ts` is `'#'`, because the brand's real
  Facebook, Instagram, X and YouTube handles have not been supplied. Four dead
  links on a live page.
- **The client-stories section has two dead links, now on two pages.** In
  `src/components/ClientStories.tsx`, "See more client stories" points at
  `#results` and "Discuss with a consultant" at `#book`. Neither anchor exists
  anywhere in `src/`, so both do nothing. This predates the Page 3 reuse — the
  reuse only doubled where the reader can meet them. Left alone deliberately
  (confirmed 2026-08-20) so the shared component stays byte-identical across
  both pages; fixing it means either creating those anchors or repointing the
  hrefs, and either way it changes the homepage too. Routing is unaffected:
  `useHashRoute` matches on a leading slash, so a bare `#results` cannot be
  mistaken for a route.
- **Every button on the site except one fails AA on the light half of its
  gradient.** `--grad` runs `#4686fe -> #1769ff`; white type measures 3.44:1 on
  the `#4686fe` stop, and most CTA labels here are around 16px at 600-650
  weight, which is not large text. `tokens.css` already documents the
  blue-on-white side of this problem and routes blue *type* to `--accent-ink`;
  the white-on-blue side is not recorded anywhere and was found by measuring on
  2026-08-20. `.bookCall__btn` was moved to `--grad-ink` (`#1769ff -> #0f55d8`,
  4.67:1 and 6.34:1) and is currently the only one that passes. Fixing the rest
  is a one-token swap per button, but it is a visible darkening across every
  page, so it wants the client's eye before it ships rather than being done
  quietly.
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

### 2026-08-08 - Add the reference's liquid distortion to the footer wordmark

- Request: inspect `reference/Recording 2026-08-08 171038.mp4` and apply its
  animation effect to the footer. The user named the local video-analysis
  skills; `ui-ux-pro-max` and `gsap-scrolltrigger` were requested too but are
  not installed in this workspace, so the effect was implemented directly in
  the existing React + plain-CSS stack without adding a dependency.
- Video analysis: `claude-real-video`/`crv` extracted 13 scene-aware frames and
  two contact sheets from the silent 12.1-second, 1902x888 recording. A denser
  4fps timing pass identified the move: a narrow liquid lens crosses the giant
  wordmark left-to-right, rests, then returns right-to-left. Inside the lens,
  broad horizontal slices bend sideways and small cyan/rose fringes appear on
  the displaced edges.
- `Footer.tsx` now draws three effect copies over the original outlined
  wordmark. An inline SVG turbulence/displacement filter bends horizontally
  only; CSS uses one soft travelling mask for the blue centre copy and the two
  refracted colour copies. The settled footer treatment, marquee, content and
  wordmark dimensions are unchanged.
- An `IntersectionObserver` pauses the expensive filter while the footer is
  off-screen and starts the 12-second two-pass sequence when the footer enters.
  `prefers-reduced-motion` removes all three filtered copies and leaves the
  original static outline. The existing marquee still stops there too.
- Updated `scripts/verify-footer.mjs` to measure the ripple layers, SVG filter,
  animation state, mask travel and reduced-motion fallback; it now accepts a
  `VERIFY_URL` for checking a production preview and captures a second frame
  during the wave.
- Files changed: `src/components/Footer.tsx`, `src/styles/global.css`,
  `scripts/verify-footer.mjs`, `README.md`, `PROJECT-CONTEXT.md`. No shipped
  asset was added; local extraction and screenshots are under ignored
  `.tmp-crv-footer-171038/` and `.tmp-footer-ripple-final/`.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS 77.01 kB).
  Headless Chrome at 1440x900 and 390x844 measured three filtered layers, the
  12-second animation running only while the footer was active, and the mask
  moving from about -21% to 66-69% over 1.6 seconds. Under reduced motion the
  layers were `display: none`, the filter and animation were `none`, and both
  the ripple and marquee stayed fixed. The wordmark retained its measured
  1540px desktop / 527px mobile widths; both viewports had zero horizontal
  overflow, zero console errors, zero page errors and zero failed requests.

### 2026-08-08 - Remove the footer liquid distortion

- Request: remove the animation effect added in the previous task.
- Removed all SVG turbulence/displacement markup, refracted wordmark copies,
  travelling-mask CSS, intersection observer state and effect-specific
  reduced-motion rules. Restored the original static outlined giant wordmark.
- Restored `scripts/verify-footer.mjs` and the footer README section to their
  pre-effect behavior. Existing looping marquee, footer content, hover states,
  responsive layout and reduced-motion marquee fallback remain unchanged.
- Files restored: `src/components/Footer.tsx`, `src/styles/global.css`,
  `scripts/verify-footer.mjs`, `README.md`. Kept one accurate comment correction
  in `Footer.tsx`: the marquee contains five phrases, not six.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS returned to
  75.47 kB). Headless Chrome passed at 1440x900, 390x844 and 1440x900 reduced
  motion. Static wordmark remained 1540px desktop / 527px mobile; marquee moved
  normally and stopped under reduced motion; back-to-top worked; zero page
  overflow, console errors or failed requests.

### 2026-08-08 - Fix the A and e in the footer wordmark

- Request: in the footer's giant outlined "American Hairline", the `A` and the
  `e` carry an unusual pattern the other letters do not. Make them match.
- Diagnosis, by rendering rather than guessing. A throwaway page drew the same
  word stroked at weights 400, 600, 700 and 800, plus filled, plus with
  `paint-order`. The artifacts appear at **every** weight and vanish entirely
  when filled: Inter builds the A's crossbar and the e's bar as separate
  contours that overlap the rest of the letter. A fill hides that — it is how
  the font is meant to be drawn — but `-webkit-text-stroke` traces every
  contour, so the A got a full rectangle through it and the e a rectangle with
  a tail. Confirmed Inter was genuinely loaded (`document.fonts.check` true),
  so this was not a fallback-font problem.
- Fix: `paint-order: stroke fill` with the glyph filled in the footer's own
  ground colour. The fill covers the internal contour lines and the inner half
  of the stroke, so the stroke went from 1.5px to 3px to leave the same visible
  outline. Added `--foot-bg` on `.foot` so the fill and the section background
  cannot drift apart.
- Consequence recorded in the CSS: the letters are now opaque, so nothing can
  show through them. Nothing sits behind the wordmark today. Where
  `paint-order` is unsupported this degrades to the old behaviour rather than
  to something worse.
- Added the general form to §5 — stroked text draws contours a fill was hiding,
  it is glyph construction rather than weight, and the whole alphabet needs
  checking rather than the first word.
- `scripts/verify-footer.mjs` now also reports `paint-order` and the footer's
  background colour alongside the stroke width, so the fill and the ground can
  be seen to match.
- Files changed: `src/styles/global.css`, `scripts/verify-footer.mjs`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS 75.52 kB).
  Headless Chrome at 1440x900, 390x844 and under reduced motion all report the
  wordmark as `rgb(238, 242, 251)` fill, 3px stroke, `paint-order: stroke`, on
  a footer background of the same `rgb(238, 242, 251)`. Screenshots confirm the
  A and the e now match every other letter. Marquee, columns, socials, contact
  links, logo, legal line and the back-to-top button are unchanged; zero
  console errors, zero failed requests, zero horizontal overflow in every mode.
- Not committed. This is the first change after the `homepage-v1` tag, so it
  belongs to the eventual version 2.

### 2026-08-08 - Hide the Advanced 3D Scan card without deleting it

- Request: hide the Advanced 3D Scan card in "Our Big Achievements", but keep
  it.
- Added an optional `hidden` flag to a new `Achievement` type in `src/site.ts`
  and set it on that one card; `Achievements.tsx` filters on it before
  rendering. The record, its copy and its image path all stay exactly where
  they were, and deleting the one word brings the card back.
- The array needed an explicit type: adding a property to one object literal in
  an untyped array widens the inferred element type into a union, and
  `item.hidden` then does not exist on the other three.
- Filtering happens in the component rather than in the data, so the reason a
  card is absent stays written next to the card itself.
- Kept rather than deleted for two reasons recorded in the comment: the
  photograph is also the "Uses Advanced 3D Scan Technology" section's, and the
  scan is one of §3's proof points, so the card is a plausible return.
- The pin needed no adjustment. The section's height is measured from the
  track's own width by a `ResizeObserver`, so removing a card shortened the pin
  by itself — 2,661px against 3,410px before, with the track at 3,201px and the
  travel ending at -1,761px.
- Files changed: `src/site.ts`, `src/components/Achievements.tsx`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900 reports three cards — Shark Tank India, Bharat Innovators Award,
  Designed for Bollywood — and three images, with no `advanced-3d-scan.png`
  request among them; the track travels 0 to -1,761px and the closing panel
  lands at 919-1,379px inside a 1,440px viewport, so nothing is clipped and no
  dead scroll was left behind. At 390x844 and under reduced motion the rail
  fallback reports the same three cards. Zero console errors, zero horizontal
  overflow in every mode. The "Uses Advanced 3D Scan Technology" section still
  loads the same photograph and is unaffected.
- Not committed; belongs to the eventual version 2 alongside the footer
  wordmark fix.

### 2026-08-08 - Set the real client names on the client-stories cards

- Request: replace the names in "Some Of Our Clients With The Most Natural
  Hairline" with six real ones.
- Three already matched what was supplied — Rylan Rodrigues, Arun Sharma and
  Rohan Bera were carried over from the client's own design artwork when the
  section was built. Three changed: Imran Qureshi to Sahil Khan, Nikhil Raut to
  Rohan Deshmukh, Sameer Joshi to Anup Kumar.
- "SAHIL KHAN" was supplied in capitals; it is set as "Sahil Khan" to match the
  other five, since `.voices__name` applies no `text-transform` and the name
  renders exactly as written. Trivial to change if the capitals were meant.
- **This makes the outstanding quote problem sharper, not smaller, and both
  §7 and the comment above `clientStories` now say so.** The names are real and
  set against real faces; the quotes are still written here. Each card
  therefore shows a named, identifiable man saying something he never said.
  Before launch: get the real words, clear the quotes, or confirm each man is
  content to be quoted that way. The section renders fine without a quote, so
  clearing is one line per card.
- Split the §7 entry in two, because the two cases are no longer the same
  thing: `clientStories` (real names, invented quotes) and the `Client` slider
  elsewhere (still placeholder names). Noted that "Advik Sharma" appears both
  as a slider placeholder and baked into the deck artwork, so the two may or
  may not be the same man.
- Files changed: `src/site.ts`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900 reads the six names in order as Rylan Rodrigues, Arun Sharma, Rohan
  Bera, Sahil Khan, Rohan Deshmukh, Anup Kumar, with six quotes and the six
  posters `client-story-1..6.png` unchanged and in the same order, so no name
  landed on the wrong face. Zero console errors, zero horizontal overflow.
- Not committed; belongs to the eventual version 2 with the footer wordmark fix
  and the hidden achievements card.

### 2026-08-08 - Set the real client quotes, closing a launch blocker

- Request: replace the six quotes in "Some Of Our Clients With The Most Natural
  Hairline" with the client's real ones.
- Five changed. The first, Rylan Rodrigues', already matched — it came from the
  client's own design artwork when the section was built, which is why it was
  the one quote in the block that was never invented.
- **This closes the oldest outstanding item in §7.** Since 2026-08-06 that
  section had carried assistant-written testimonials on photographs of
  identifiable real people, and yesterday's name update made it sharper by
  attaching real names to invented words. Both halves are now the client's own,
  so nothing in `clientStories` is written here any more.
- The comment above `clientStories` now says the opposite of what it said
  yesterday: **do not edit this wording for style.** These are things real men
  said and a testimonial's worth is that it is theirs. Worth guarding, because
  the natural instinct on reading "The hair system is amazing, and the
  facilities are amazing" is to tighten it, and tightening it would make it a
  fabrication again.
- One lighter item left in §7: confirm each man agreed to appear by name, since
  the photographs identify them.
- Files changed: `src/site.ts`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900 read each card's poster, name and quote together, so the pairing
  could be checked rather than assumed: `client-story-1` to Rylan Rodrigues,
  `-2` to Arun Sharma, `-3` to Rohan Bera, `-4` to Sahil Khan, `-5` to Rohan
  Deshmukh, `-6` to Anup Kumar, each with the quote supplied for that client.
  Zero console errors, zero horizontal overflow.
- Not committed; belongs to the eventual version 2 with the footer wordmark
  fix, the hidden achievements card and the name update.

### 2026-08-08 - Give Clip-On its own photograph in the methods section

- Request: add `Images/clip3 on hair system changes.png` to the Clip-On Hair
  Systems method in "Our Trusted Methods For A Natural Look".
- The section had one shared photograph for both methods, so this became a
  per-method change rather than a swap: `image` and `alt` moved onto the
  `Method` type, `methodsMedia` is gone, and the panel now cross-fades to
  whichever row is open.
- Installed as `public/methods/clip-on.png` (1632x2133, 3,483,037 bytes). It is
  0.765 wide-to-tall, exactly the panel's ratio and exactly the Stick-On
  photograph's, so neither image is cropped to fit. Recorded in the type's
  comment and in §7, because the next method added here needs the same shape.
- The picture it shows is the right one for the method: the underside of a
  clip-on base with its metal clip visible, being lifted away from the client's
  own hair. That is the thing that distinguishes clip-on from stick-on, so the
  photograph is doing work rather than decorating.
- Detail worth keeping: closing every row is a legal state in this accordion,
  so the panel holds the **last method that was open** rather than blanking.
  `shownMedia` is separate state from `open` for that reason. An empty panel
  would leave the right column as a grey rectangle, which reads as a broken
  image rather than as a closed accordion.
- Only the visible photograph carries `alt`; the hidden one is `aria-hidden`
  with an empty `alt`, so nobody is read a description of a picture that is not
  on screen.
- §7 narrowed: Clip-On now has its own photograph, Stick-On is the one still
  borrowing the Services section's.
- Files changed: `src/site.ts`, `src/components/Methods.tsx`,
  `src/styles/global.css`, `README.md`, `PROJECT-CONTEXT.md`. New asset:
  `public/methods/clip-on.png`.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS 75.60 kB).
  Headless Chrome at 1440x900, 390x844 and under reduced motion, in all three:
  with Stick-On open the first image is `data-current` at opacity 1 with a
  71-character alt and the clip-on image at opacity 0, `aria-hidden`, empty
  alt; clicking Clip-On reverses both, with the clip-on image at opacity 1 and
  a 102-character alt; closing that row leaves the clip-on image still showing,
  as intended. Both files load at their true sizes, 1088x1422 and 1632x2133.
  Panel 528x690 desktop, 350x457 mobile. Zero console errors, zero failed
  requests, zero horizontal overflow.
- Not committed; belongs to the eventual version 2 with the footer wordmark
  fix, the hidden achievements card, and the client names and quotes.

### 2026-08-08 - Inset the grown panel in the 3D Scan section

- Request: in "Uses Advanced 3D Scan Technology" the picture grows to cover the
  whole screen; give it padding on all sides.
- The panel was interpolating toward the pin's full rect, `{0, 0, width,
  height}`, so it finished exactly flush with the viewport. It now interpolates
  toward the pin's **padding box** instead.
- The inset lives in the stylesheet as `.scan__pin`'s own
  `padding: clamp(14px, 3.2vh, 44px) clamp(16px, 3.4vw, 64px)`, and
  `measure()` reads it back with `getComputedStyle`. One number, in CSS with
  the rest of the system, and nothing in the JavaScript to keep in step with
  it — change the padding and the animation's end state follows.
- Worth knowing for anyone touching this: adding padding to the pin does not
  shift the panel's coordinate space. An absolutely positioned element resolves
  against its containing block's padding box, and with no border on the pin the
  padding box and the border box are the same rectangle, so the slot rect
  measured from `getBoundingClientRect` and the panel's `left`/`top` are still
  in the same space.
- The corner radius now grows 12px to 20px rather than running to 0. Running to
  0 made sense while the panel finished flush with the viewport and its corners
  were cut off by the edge anyway; inset, a squared-off rectangle just looks
  unfinished.
- `scripts/verify-scan.mjs` now reports the four gaps between panel and pin
  alongside the pin's stated padding, so the inset is checked against its own
  source rather than against a number typed into the test.
- Files changed: `src/components/Scan.tsx`, `src/styles/global.css`,
  `scripts/verify-scan.mjs`, `README.md`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS 75.65 kB). At
  1440x900 the panel runs 163x103 at the slot to 1,342x842 at the end, with
  gaps of 49px left, 49px right, 29px top and 29px bottom against a stated
  padding of 48.96px / 28.8px — symmetric and matching its source. Radius ran
  12px to 20px across the pin. The heading held at top 343px and dimmed 1.00 to
  0.28 as before. At 390x844 and under reduced motion the section reported
  unpinned with the picture below the heading and no horizontal overflow. Zero
  console errors, zero failed requests in every mode.
- Not committed; belongs to the eventual version 2.

### 2026-08-08 - Set the real names on the hero's Find Your Match slider

- Request: replace the six names in the hero's "Trusted by 6k+ men around the
  world" slider with real ones.
- All six changed: Advik Sharma, Rajesh Malhotra, Karan Deshpande, Aarav Nair,
  Michael Brennan and Rohan Kapoor became Rohan Bera, Daljit Singh, Chandan
  Singh, Rylan Rodrigues, Arun Sharma and Advik Sharma, in card order. "Advik
  sharma" was supplied lower-case and is set as "Advik Sharma" to match the
  other five, the same call made for "Sahil Khan".
- **This removes the last invented names from the page.** Between this, the
  client-story names and their quotes, nothing user-facing is written by an
  assistant about a real person any more.
- Worth knowing, and now written above `clients` in `src/site.ts`: several of
  these men appear in more than one section — Rohan Bera, Rylan Rodrigues and
  Arun Sharma also in `clientStories`, and Daljit Singh, Chandan Singh and
  Advik Sharma in the deck artwork, where the names are baked into the PNGs. A
  name corrected in one place has to be corrected in the others, and the deck's
  would need new artwork rather than a code change.
- It also resolves an old §7 uncertainty. "Advik Sharma" had been both a
  placeholder here and a name baked into the deck artwork, and it was unclear
  whether they were the same man; he is a real client, so they are.
- `style` is untouched. It is a written description of what each photograph
  shows, which is what `alt` is for, and it makes no claim about the man.
- §7 updated: the placeholder-names item is struck through and replaced by the
  one thing still open on this front — confirming each man agreed to appear.
- Files changed: `src/site.ts`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900 and 390x844 read each visible `.match__label` together with the
  image in its own card, so the pairing was checked rather than assumed:
  `client-1` to Rohan Bera, `-2` to Daljit Singh, `-3` to Chandan Singh, `-4`
  to Rylan Rodrigues, `-5` to Arun Sharma, `-6` to Advik Sharma. Each `alt`
  reads "<name>, wearing a <style> hair system" with the same pairing. Zero
  console errors, zero horizontal overflow at both widths.
- Not committed; belongs to the eventual version 2.

### 2026-08-08 - Make the hair system, not the word, the hero's subject

- Request: the eye lands on NATURAL rather than on the 3D hair system; do
  something about it.
- Diagnosed by measuring rather than by looking. At 1440x900 the wordmark band
  is 1440x240 — about four times the width of the head in front of it — and its
  chrome gradient ran through mid-greys (`#a7b0b8`, `#8d959d`). It also sits
  above the copy, so it is the first thing a reader meets. Sampling mean ink
  across the band, excluding the column the head occupies, gave 17.59 against
  the hair mass's 113.64: a 6.5:1 ratio in the subject's favour that was
  nowhere near enough to overcome four times the area at the top of the page.
- Two changes, both aimed at the ratio rather than at either element alone:
  - **The chrome gradient's dark stops were lifted** out of mid-grey into the
    `#d3d9de`–`#c6ced5` range, and the bevel underneath went from `#9aa2aa` at
    0.5 opacity to `#b8c0c7` at 0.32. The banding is kept, so it still reads as
    chrome; it just stops competing. Contrast, not size, is what wins the first
    fixation, and this is the cheaper half of the fix.
  - **The footage is scaled 1.14 about a 50%/38% origin**, so the head is
    bigger and the growth pushes the hairline up into the band rather than
    driving the podium off the bottom.
- Measured after: band ink 17.59 -> 9.10 (down 48%), hair 113.64 -> 119.16 (up
  5%), and the subject-to-word ratio 6.46:1 -> **13.09:1**. The word is now
  half as present and the head is the only thing in the upper half with real
  contrast.
- The composite survives, which was the thing to be careful about. `mix-blend-mode:
  darken` is per-pixel, so a transform on the element does not affect it —
  checked at 1440x900, 1024x800, 390x844, 1920x1080 and under reduced motion:
  blend still `darken`, filter still `brightness(1.14)`, and the scaled frame
  still covers the stage on all four sides at every width, so no edge of the
  video rectangle is exposed.
- **Mobile is left alone, deliberately.** At 390px the head was already almost
  entirely off-frame before this change — `object-position: 18% center` pushes
  it right so it does not sit under the left-aligned copy, which has no overlay
  to rescue it. Tried 30% and 40%: both bring the hair across the body copy and
  trade legibility for presence, which is the trade that rule exists to avoid.
  The scale does not make it worse, so it stays. Fixing mobile properly means
  giving the head its own band under the copy rather than moving a crop, which
  is a layout decision for the client rather than a tweak.
- Files changed: `src/components/Wordmark.tsx`, `src/styles/global.css`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS 75.70 kB). The
  before/after ink comparison above was measured by loading both screenshots
  into a canvas and averaging luminance over the two regions. Zero console
  errors, zero failed requests, zero horizontal overflow at 1440x900,
  1024x800, 390x844, 1920x1080 and under reduced motion.
- Not committed; belongs to the eventual version 2.

### 2026-08-08 - Reword the nations card after reader feedback

- Request: readers reported not understanding the "12+ Nations / Client Base"
  card in "Why Men Around The World Choose Us". Make it simple.
- Two separate problems, worth separating because only one of them is obvious:
  - **"Client base" is trade language.** It names a business concept — a
    group of customers — and sits in a caption slot where every sibling card
    is plain: "Experience", "Men Helped", "Natural Looking". A reader parsing
    those three and then meeting "Client Base" has to switch registers.
  - **"Nations" is the formal word** where "countries" is the everyday one.
    On its own that is minor; stacked on the first problem it is what turned a
    slightly odd caption into an unreadable one.
- Now `12+ Countries` / `Where Clients Live`. The number is untouched — this is
  the same §3 proof point said plainly, per the brand's own "plain beats
  clever" rule.
- Three words rather than four. "Where Our Clients Live" measured 143px and
  wrapped to two lines inside the 169px card on a phone, which left this card
  carrying four lines of type against its siblings' two. "Where Clients Live"
  measures 124px and holds one line at every width. Dropping "Our" costs
  nothing: the card is on the brand's own page, so whose clients they are is
  not in question.
- Recorded in §3 next to the proof numbers so nobody edits it back to the old
  wording on the grounds that "12+ nations" is the canonical phrasing. The
  figure is canonical; that phrasing was not.
- Files changed: `src/site.ts`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900, 1024x900 and 390x844 read every card's value and label with their
  wrapped line counts: all four labels hold one line at all three widths. The
  value wraps to two lines only on the phone, where "12+ Countries" cannot fit
  a 169px card on one line and its sibling "12+ Years" does — accepted, since
  the alternative is dropping the unit from the number, which is the part
  carrying the meaning. Zero console errors, zero horizontal overflow.
- Not committed; belongs to the eventual version 2.

### 2026-08-08 - Settle the nations card wording from measured options

- Request: options for the "12+ Nations / Client Base" card, after the earlier
  pass in this session had already changed it to "12+ Countries / Where Clients
  Live".
- Four options were presented, each measured at 390px against the 169px card
  rather than estimated, so the layout consequence of each was known before
  choosing:
  - `12+ Countries / Where Clients Live` — label 124px, one line
  - `12+ / Countries Served` — the only option where the value also holds one
    line on a phone, since a bare "12+" measures 45px
  - `12+ Countries / Clients Come From` — label 126px, one line
  - `12+ Countries / Clients Served` — label 96px, the shortest of the four
- Two findings worth keeping from that measuring pass: **"12+ Nations" wraps on
  mobile exactly as "12+ Countries" does** (both 143px), so reverting that word
  would have bought nothing on layout; and **only a bare "12+" keeps the value
  on one line**, so a fully single-line card is only possible if the unit moves
  down into the label.
- Client chose `12+ Countries / Clients Served`. Applied as a one-line change
  in `src/site.ts`, with the comment above the entry rewritten: the part
  explaining why "Client Base" and "Nations" were dropped is the durable bit
  and stays; the sizing note now cites the new label rather than the old.
- **Recorded caveat, raised before the choice and accepted:** "served" can be
  read as "we operate in those countries", which is wider than the claim the
  brand makes elsewhere. The client picked it with that flagged, so it stands.
  The figure itself is untouched and remains the §3 proof point.
- §3's note beside the proof numbers updated to the chosen wording, so nobody
  edits it back to "12+ Nations / Client Base" on the grounds that the old
  phrasing was canonical. The figure is canonical; the phrasing was not.
- Files changed: `src/site.ts`, `PROJECT-CONTEXT.md`. No component, CSS or
  asset changes — `KeyFacts.tsx` renders `value` and `label` straight from the
  array.
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900, 1024x900 and 390x844 read every card's value and label with their
  wrapped line counts. All four labels hold one line at all three widths, and
  "Clients Served" measures 99/96/96px — the shortest label on the row except
  "Experience", so the card carries the most air. The value wraps to two lines
  on the phone only, which is accepted: the alternative is dropping "Countries"
  from the number, and that word carries the meaning. Zero console errors, zero
  failed requests, zero horizontal overflow in every mode.
- Not committed; belongs to the eventual version 2.

### 2026-08-08 - Rebuild the hair-systems section on the supplied circular gallery

- Request: use the supplied `circular-gallery` component in "World's Finest
  Thinnest Hair Systems".
- Flagged before starting, because the record says to: this section was rebuilt
  as a motion arc on 2026-08-07, the client asked for the collection surfer
  back, and §2's note says the arc is "not to be rebuilt without being asked".
  This is a third direction and was explicitly asked for, so it proceeded.
- Ported rather than pasted, the same route as `card-stack` and the parallax
  component: this project is Vite + plain CSS with `motion/react`, no Tailwind,
  no shadcn, no `@/` alias. Tailwind utilities became the `.cgal` block in
  `global.css` with the original class-to-rule mapping recorded in its comment,
  `cn()` went, and `NodeJS.Timeout` became `ReturnType<typeof setTimeout>` —
  the original type is Node's and this builds with `tsc -b` in a browser.
- **Three substantive changes to the component, each fixing something that
  would have been wrong on this page:**
  1. *The scroll listener is gone; rotation is a prop.* The original read
     `window.scrollY` against the whole document, which is correct on its demo
     page where the gallery is the page. This document is around 30,000px
     tall, so the ring would have arrived part-rotated and a full scroll
     through its own section would have turned it a fraction of a revolution.
     `Systems.tsx` owns the scroll with `useScroll` against the section and
     passes `progress`, matching every other scrubbed section here.
  2. *Rotation is a motion value, not React state.* The original called
     `setRotation` inside a `requestAnimationFrame` loop, re-rendering the
     whole gallery every frame for the life of the page whether on screen or
     not. The angle and each card's opacity are motion values now, written
     straight to the DOM.
  3. *`still` renders a snap rail* for reduced motion and below 901px. A
     permanent 3D rotation is close to the centre of what that setting asks you
     not to run, and a phone should not be asked to spin a carousel.
- **Backfaces hidden — worth keeping.** Every card faces outward from the axis,
  so the far half of the ring showed card *backs*, and a poster seen from
  behind is mirrored: the brand wordmark rendered in reverse, which reads as a
  bug rather than as depth. `backface-visibility: hidden` drops the far half;
  the near half always faces the camera so the ring is never empty. It also
  removed the edge-on slivers, measured 5px wide at half a turn.
- Geometry: radius 700 against a 2,200px perspective, so the front card is
  magnified about 1.47x. Keeping radius well under perspective is what stops a
  card reaching the camera plane — the §5 trap this very section hit in its
  surfer incarnation.
- **The previous implementation was left on disk, not deleted.**
  `ui/collection-surfer.tsx` and its `.surf` CSS block are now dead weight
  (roughly 2 kB of CSS shipping unused). Deleting was out of scope for a
  request to use a new component, and the section has been reverted once
  before. `git checkout homepage-v1 -- src/components/ui/collection-surfer.tsx`
  restores the surfer if this direction is not wanted.
- Files changed: `src/components/ui/circular-gallery.tsx` (new),
  `src/components/Systems.tsx` (rewritten), `src/styles/global.css`,
  `README.md`, `PROJECT-CONTEXT.md`. No assets, no new dependencies, and
  `src/site.ts` untouched — `hairSystems` maps straight onto the gallery's
  item shape.
- Verification: `npm.cmd run build` passed (2,007 modules; CSS 78.32 kB). At
  1440x900 the section measures 1,710px (`100vh + 90vh`) and the ring turns a
  full revolution across it — 1.7 degrees at the start, 93.5 at a quarter,
  -175 at a half, 8.4 at the end — with thirteen cards mounted, the front card
  440px across, and all thirteen posters loaded at 1056x1320. At 390x844 and
  under reduced motion the section reported `systems--still` with the rail and
  no ring transform. Zero console errors, zero page errors, zero failed
  requests, zero horizontal overflow in every mode.
- Not committed; belongs to the eventual version 2.

### 2026-08-12 - Update the Bangalore salon address

- Request: replace the Bangalore address in "Walk Into Any Of Our Premium
  Salons" with the supplied Golden Hive Luxury Unisex Salon location.
- Updated the Bangalore card address in `src/site.ts` to: Golden hive Luxury
  Unisex salon, 484, 2nd Floor, Signature Square, Circle, Chinmaya mission
  Hospital Rd, Near KFC, next to all the plus size store, Indira Nagar 1st
  stage, Bengaluru, Karnataka - 560038.
- Updated the card's `Get Direction` Google Maps query to use the new business
  name, street address and 560038 postcode. Mumbai and Delhi were untouched.
- Files changed: `src/site.ts`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Confirmed the new
  560038 address and matching Golden Hive Google Maps query are present only
  on the Bangalore salon record.

### 2026-08-12 - Shorten the Bangalore salon address

- Request: remove "Near KFC, next to all the plus size store," from the
  Bangalore address in "Walk Into Any Of Our Premium Salons".
- Removed only that phrase from the displayed address in `src/site.ts`. The
  business name, street details, locality and 560038 postcode remain.
- The Google Maps query needed no change because it already omitted those two
  landmark descriptions.
- Files changed: `src/site.ts`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Confirmed removed
  phrase no longer appears in `src/site.ts`.

### 2026-08-12 - Fit the Bangalore salon address on two lines

- Request: use the supplied screenshot to make the unchanged Bangalore salon
  address render in two lines instead of three on desktop.
- Added a city-specific modifier class to each salon card and removed the
  shared `46ch` address-width cap only for Bangalore. Its address can now use
  the full card width; Mumbai and Delhi retain their existing text measure.
- Address wording and Google Maps link were not changed.
- Extended `scripts/verify-salons.mjs` to report rendered address line counts,
  so this layout requirement is measured rather than inferred from text width.
- Files changed: `src/components/Salons.tsx`, `src/styles/global.css`,
  `scripts/verify-salons.mjs`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900 measured rendered address line counts as Mumbai 2, Delhi 2 and
  Bangalore 2 throughout the pinned scroll; Bangalore was 3 lines before this
  CSS change. At 390x844 it remains naturally responsive at 4 lines rather
  than shrinking text. Zero horizontal overflow. The existing missing
  `/video/secret-hair-system.mp4` request remains unrelated to this section.

### 2026-08-12 - Make the Secret film scroll-controlled again

- Request: remove autoplay from "The Secret Behind Our Natural Hairline",
  return the film to scroll control, and make the motion and text presentation
  aesthetic and readable.
- Used the requested `claude-real-video` workflow on the local 10.04-second
  film. Eleven one-second keyframes confirmed three useful compositions: wide
  mannequin view from 0–3 seconds, macro hairline detail from 4–8 seconds, and
  a final left-facing profile from 9–10 seconds. The macro and final phases both
  leave the most stable copy space on the right.
- FFprobe found the original H.264 had only one keyframe for all 241 frames.
  That verified the earlier decoder glitch rather than treating it as a Motion
  bug: every scroll seek had to decode from frame zero. Added
  `public/video/secret-hair-system-scrub.mp4`, the same 1940x1068 frames encoded
  at 24fps with a keyframe every six frames, no audio, fast-start metadata, and
  a 7,030,570-byte file size versus the 14,532,001-byte source. The source file
  remains untouched.
- `Secret.tsx` now keeps the film paused and maps damped `useScroll` progress to
  `currentTime` in both directions. Seeks are serialized: while a seek is
  active, progress updates replace one queued target instead of starting more
  decoder work; `seeked` then applies the newest target. Updates smaller than
  one 24fps frame are skipped, and seeking stops while the section is offscreen.
- Reworked copy as three scroll scenes aligned to the analyzed film: large
  left-aligned title, one near-opaque right-side editorial proof panel whose
  three rows arrive in sequence, then a right-side closing claim. A two-pixel
  progress rail communicates remaining pin distance. Desktop keeps the film
  full-bleed; phones give the film the middle 50% of the viewport with the copy
  surface below, avoiding copy over the hair detail.
- Reduced motion drops the pin and all seeking. The title, first static frame,
  benefits and closing claim render in normal reading order and the progress
  rail is hidden.
- Replaced obsolete `scripts/verify-secret-autoplay.mjs` with
  `scripts/verify-secret-scroll.mjs`. Updated the README and the §5 Secret trap
  so future work preserves the scrub encode and serialized seek queue.
- The named Figma motion skills informed use of the existing `motion/react`
  stack and reduced-motion behavior; no Figma URL, node or SwiftUI target was
  supplied, so no Figma/SwiftUI API action was applicable. The named Sites
  skill selected its existing-project path; this Vite repository has no
  `.openai/hosting.json`, and publishing was outside the requested change.
- Files changed: `src/components/Secret.tsx`, `src/site.ts`,
  `src/styles/global.css`, `README.md`, `PROJECT-CONTEXT.md`,
  `scripts/verify-secret-autoplay.mjs` (removed),
  `scripts/verify-secret-scroll.mjs` (added), and
  `public/video/secret-hair-system-scrub.mp4` (added).
- Verification: `npm.cmd run build` passed (2,007 modules). Headless Chrome at
  1440x900 and 390x844 sampled progress 0, 0.18, 0.4, 0.52, 0.7, 0.88 and 1:
  video time tracked 0 to 9.94 seconds, remained paused and non-looping, scene
  opacity followed the intended title/proof/closing sequence, and reverse
  scroll moved time from 8.56 to 2.76 seconds desktop and 8.57 to 2.80 seconds
  mobile. Screenshots confirmed copy surfaces stayed separate from the product
  detail. Reduced motion held time at zero with all copy at opacity 1 and no
  progress rail. Zero console errors, failed requests or horizontal overflow.

### 2026-08-13 - Assess a continuous Hero-to-Secret 3D transition

- Request: confirm whether the existing Hero and "The Secret Behind Our
  Natural Hairline" section can feel like one continuous sequence, with the
  hero's 3D hair system carrying into the next section and then continuing
  under the Secret section's scroll-controlled motion.
- Outcome: confirmed feasible. The robust implementation is one shared outer
  scroll stage containing both semantic sections and one persistent sticky
  visual layer; the hero wordmark, pitch and match slider leave during a short
  handoff interval while the Secret title and proof scenes enter.
- Important constraint: the current Hero and Secret visuals are different
  files with different playback models: `hero-bg.mp4` autoplays and loops,
  while `secret-hair-system-scrub.mp4` remains paused and is seeked from scroll.
  A carefully aligned crossfade can make the existing assets feel continuous,
  but mathematically frame-perfect object motion would require one continuous
  source render (or a newly rendered bridge clip) whose end and start poses
  match.
- Recommended behavior: preserve the existing hero's initial appearance; use
  roughly the final 15-20% of the hero scroll as the handoff; crossfade and
  reconcile scale/crop between the two videos there; then map the remaining
  combined-stage progress to the existing serialized Secret seek pipeline.
  Keep the sections separate in document semantics (`h1` then `h2`) even
  though they share a visual stage. Mobile should use a shorter/static handoff,
  and reduced motion should keep the present normal-flow fallback.
- Files changed: `PROJECT-CONTEXT.md` only. No application code or media was
  changed; this was a feasibility assessment.
- Verification: inspected `App.tsx`, `Hero.tsx`, `Secret.tsx`, the relevant
  Hero/Secret CSS, and both served video assets. No build was needed because no
  application source changed.

### 2026-08-13 - Build the continuous Hero-to-Secret 3D transition

- Request: implement the approved transition using the existing Hero and
  Secret films only, with no unified render and no bridge clip. The user also
  explicitly requested the local video-analysis, Figma motion/SwiftUI, Sites,
  and Caveman skills.
- Video analysis: ran `claude-real-video`/`crv` on both served files with
  adaptive scene extraction, no transcription, and contact sheets. Both are
  10.041667 seconds at 24fps with 241 frames; `hero-bg.mp4` is 1928x1072 and
  the Secret scrub file is 1940x1068. Their opening front-facing mannequin
  frames are effectively the same composition. Hero then rotates around the
  mannequin; Secret pushes into the hairline and finishes in profile. This made
  frame zero the reliable ownership-transfer point.
- Added `HeroSecret.tsx` as the shared visual coordinator while preserving
  document semantics: Hero still owns the only `h1`, and Secret still owns its
  `h2`. `App.tsx` now renders this coordinator where the two sibling components
  used to be.
- The Hero film is now a viewport-height sticky layer inside `.stage`, with a
  negative bottom margin so the initial Hero layout and height remain intact.
  The following handoff stage clones the same file, synchronizes it with the
  live Hero film while visible, and keeps measured drift below 0.09 seconds.
  That makes the last Hero pixel and the first handoff pixel use the same crop,
  transform and playback moment in both directions.
- Scroll then performs a focus-pull transition, not a raw double exposure:
  the rotating Hero view softens under a restrained white studio-light wash,
  the Secret file appears paused at frame zero, and its wrapper settles from
  1.14 scale to 1. The Secret title arrives last. At handoff end, the video
  rectangle, title rectangle, title opacity and time match the real Secret
  section's start exactly, so the sticky layer can change ownership without a
  layout cut.
- Mobile keeps the existing Hero crop at 18% while copy is on screen. Only
  after the Hero content has left does the handoff move that crop toward centre,
  bringing the same rotating mannequin fully into view before it resolves into
  Secret's existing middle 50% film band. Handoff travel is shorter on phones.
- Reverse scroll runs every opacity, blur, crop and scale in reverse. Reduced
  motion omits the handoff entirely and keeps Secret's existing static reading
  order; no content is withheld.
- Figma skills: no Figma URL, node, motion payload, SwiftUI codebase or iOS
  target was supplied, so no Figma/SwiftUI API call was applicable. Their
  guidance was applied where relevant: existing `motion/react` stack retained,
  static video transforms separated from animated wrapper transforms, motion
  factored into one component, and reduced motion preserved. Sites used the
  existing-site capability path; this Vite project has no
  `.openai/hosting.json`, and publishing was not authorized. Caveman affected
  conversation only, never project prose.
- Files changed: `src/components/HeroSecret.tsx` (new),
  `src/components/Hero.tsx`, `src/App.tsx`, `src/styles/global.css`,
  `scripts/verify-hero-secret-transition.mjs` (new), `README.md`, and
  `PROJECT-CONTEXT.md`. No media file was created or modified. Analysis output
  and screenshots are in ignored `.tmp-crv-hero-handoff/`,
  `.tmp-crv-secret-handoff/` and `.tmp-hero-secret-transition/`.
- Verification: `npm.cmd run build` passed (2,008 modules). The new headless
  Chrome verifier passed at 1440x900 and 390x844: Hero/clone drift stayed at or
  below 0.084/0.045 seconds; handoff end and Secret start matched at 1440x900
  and 390x422 video geometry respectively, with matching title rectangles and
  time zero; forward and reverse samples had zero console errors, failed
  requests or horizontal overflow. Reduced motion rendered no handoff, kept
  Secret static and paused, and had zero overflow. The existing
  `verify-secret-scroll.mjs` also passed after integration: Secret still mapped
  0 to 9.94 seconds, reversed to 2.75 seconds, stayed paused/non-looping, and
  preserved all copy phases at desktop, mobile and reduced motion.

### 2026-08-13 - Specify the unified Higgsfield Hero-to-Secret film

- Request: after reviewing the implemented crossfade, the client rejected its
  appearance and chose to spend Higgsfield credits on one unified 3D film. They
  supplied the Higgsfield Kling 3.0 interface screenshot and the clean
  front-facing mannequin/hair-system reference, and needed a prompt that
  describes the intended combined-section motion without assuming Higgsfield
  knows the website structure.
- Outcome: prepared one 15-second, single-take camera choreography rather than
  referring to web sections: a stable wide product opening, restrained orbit,
  seamless dolly into the natural hairline and top detail, then a pullback to
  a left three-quarter/profile composition with clear right-side copy space.
  The prompt locks hair colour, density, style, mannequin, lighting and studio
  background, and bans cuts, morphing, shake, focus hunting, extra objects,
  text and fades so every frame remains usable for scroll scrubbing.
- Recommended generation mapping: use the supplied clean image as Start frame,
  leave End frame empty, select Kling 3.0, 15 seconds, 16:9 and 1080p, turn
  Multi-shot and Audio off, and start with Enhance off so its rewrite does not
  weaken the timeline and continuity constraints. Keep the podium because it
  is present in the input; removing it reliably requires a retouched source
  image rather than asking the video model to alter major geometry.
- Evidence: reused the existing `claude-real-video` analyses for both local
  films after rereading their manifests and contact sheets. Hero supplies the
  wide rotating product language; Secret supplies the wide-to-macro hairline
  push and left-facing ending. This directly informed the unified camera path.
- Files changed: `PROJECT-CONTEXT.md` only. Application code and media remain
  unchanged while the unified MP4 is pending.
- Verification: prompt and settings were checked against the supplied
  Higgsfield UI and the analyzed source-film sequences. No build was required
  because no application source changed.

### 2026-08-13 - Review Higgsfield v3 and specify its background edit

- Request: inspect `reference/v3.mp4`, confirm the client's observation that
  its white environment resembles a square box, and provide a Higgsfield Edit
  Video prompt plus the best model choice for a premium white background.
- Analysis: used `claude-real-video` with adaptive one-second extraction and
  two contact sheets. The file is 15.042 seconds, 1940x1068, H.264 at 24fps.
  All 16 sampled frames show a floor-to-wall horizon; the wider orbit frames
  also reveal vertical shaded boundaries and a bright rectangular central wall
  plane. Long directional floor shadows strengthen the impression of a small
  three-sided room. The product orbit, close hairline push and final pullback
  are otherwise suitable for the intended unified scroll sequence.
- Recommendation: use Kling 3.0 Omni Edit for the first background-only pass,
  because it is the newer prompt-driven edit model shown in the supplied UI.
  Preserve all subject geometry and original camera motion; replace only the
  environment with a high-key seamless white cyclorama, no corners, panels,
  horizon or side bands, plus one restrained contact shadow. Use Seedance 2.5
  Edit only as fallback if Kling 3.0 Omni Edit rejects the full-duration file
  or changes the hair/mannequin.
- Duration constraint: `v3.mp4` exceeds Kling O1 Video Edit's displayed
  3-10-second upload range, so do not select Kling O1 for the full file. Check
  the upload limit again after selecting Kling 3.0 Omni Edit; avoid splitting
  the film unless every available edit model refuses 15 seconds, because two
  independent edits can produce a visible background seam.
- Files changed: `PROJECT-CONTEXT.md` only. Analysis artifacts live in ignored
  `.tmp-crv-v3-background/` and `.tmp-v3-analysis/`; the source MP4 is untouched.
- Verification: read the CRV manifest and both chronological contact sheets;
  independently confirmed duration, resolution, frame rate and codec with
  FFprobe. No site build was needed because application source was unchanged.

### 2026-08-13 - Integrate the unified film and correct its white background

- Request: proceed with `reference/v3.mp4` because a second Higgsfield edit was
  too expensive, improve its box-like white background locally if possible,
  and use it for the continuous Hero-to-Secret product journey.
- Video work: preserved `reference/v3.mp4` untouched. Tested several high-key
  grades on representative frames, chose the curve that removed the wall/floor
  horizon and vertical studio panels without materially changing the dark hair,
  and created `public/video/hair-system-unified-scrub.mp4`. The served copy is
  H.264, 1940x1068, 24fps, 361 frames, 15.041667 seconds, 8,893,541 bytes, no
  audio, fast-started, and has 61 keyframes (one every six frames). CSS darken
  compositing, a 1.5% brightness lift and soft white edge light finish the
  seamless white-page blend and suppress remaining side-wall shading.
- Motion architecture: removed the rejected clone/crossfade/wash handoff.
  `HeroSecret.tsx` now owns exactly one paused video element and one serialized
  seek queue. Hero scroll maps to 0–7 seconds (the full orbit); Secret scroll
  continues from 7 seconds through the last full frame (dolly-in, macro
  hairline and pullback). Reverse scroll runs the same element backward. Mobile
  transitions its crop from the Hero's 18% copy-clearing position to centre at
  Secret start. Reduced motion holds frame zero over Hero and renders Secret
  copy in normal flow.
- Component changes: `Hero.tsx` is now semantic/layout content only and accepts
  its root ref. `Secret.tsx` receives the shared motion value and owns only its
  title, benefits, closing claim and progress rail. `src/site.ts` exports
  `unifiedHairVideo`. Updated CSS, README and both Hero/Secret verification
  scripts for the one-film model.
- Skill routing: `claude-real-video` analyzed both source and corrected copies
  with chronological contact sheets. Named Figma motion/SwiftUI skills were
  checked, but no Figma file, motion payload, SwiftUI codebase or iOS target was
  supplied, so no Figma API or Swift translation was applicable; the existing
  `motion/react` stack and reduced-motion behavior were preserved. Sites used
  its existing-project path; this Vite project has no `.openai/hosting.json`,
  and no deployment was requested.
- Files changed: `src/components/HeroSecret.tsx`, `src/components/Hero.tsx`,
  `src/components/Secret.tsx`, `src/site.ts`, `src/styles/global.css`,
  `public/video/hair-system-unified-scrub.mp4`,
  `scripts/verify-hero-secret-transition.mjs`,
  `scripts/verify-secret-scroll.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
  Analysis files live in ignored `.tmp-crv-v3-background/`,
  `.tmp-v3-grade-tests/`, `.tmp-crv-v3-corrected/`, and `.tmp-v3-analysis/`.
- Verification: two final `npm.cmd run build` passes succeeded with 2,008
  modules. FFprobe confirmed final media metadata and 61 seek points; CRV
  confirmed all 16 one-second motion phases remained present after grading.
  `git diff --check` passed. Per the requested Sites guidance, no browser DOM or
  screenshot QA was run without an explicit browser-testing request.

### 2026-08-13 - Restore Hero and Secret content above the unified film

- Request: fix the missing chrome `100% NATURAL` Hero wordmark and all content
  in "The Secret Behind Our Natural Hairline" after the unified film was
  integrated; the client correctly suspected that the elements had moved
  behind the video.
- Cause: `.heroSecret__filmFrame` was an opaque white stacking layer at
  `z-index: 1`. Its child video used `mix-blend-mode: darken`, but the opaque
  parent prevented the blend from reaching the chrome wordmark beneath it. A
  white edge-light pseudo-element painted above the film compounded the washout.
  Secret copy had local z-indices but its section did not form a foreground
  stacking layer above the shared sticky film.
- Fix: made the film frame transparent, moved `mix-blend-mode: darken` to that
  frame so the whole video layer composites with the wordmark backdrop, removed
  the white edge-light overlay, and placed the transparent `.secret` section at
  `z-index: 2`. The intended order is now chrome wordmark, blended product film,
  then Hero/Secret copy. No video, copy, timing, layout, or seek logic changed.
- Requested skill routing: reread the corrected film's
  `claude-real-video` manifest and both chronological contact sheets. The named
  Figma motion skills informed preservation of the existing `motion/react`
  stack and reduced-motion behavior; no Figma URL, node, or motion payload was
  supplied, so no Figma API action was applicable. Caveman affected conversation
  brevity only.
- Files changed: `src/styles/global.css`,
  `scripts/verify-hero-secret-transition.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`. The video asset and React components are unchanged.
- Verification: `npm.cmd run build` passed (2,008 modules) and `git diff
  --check` passed. The enhanced Hero/Secret verifier passed at 1440x900 and
  390x844: the film frame is transparent with `darken`, the chrome wordmark is
  visible, the Secret title/benefits/closing appear in their intended phases,
  the one film remains paused and scroll-controlled in both directions, and
  there are zero console errors, failed requests, or horizontal overflow.
  Screenshots in ignored `.tmp-hero-secret-layers/` visually confirm all four
  states. `verify-secret-scroll.mjs` also passed at desktop, mobile, and reduced
  motion with the existing timing and copy geometry intact. No remaining issue
  from this regression.

### 2026-08-13 - Add a blur reveal to the Secret title

- Request: make "The Secret Behind Our Natural Hairline" feel less static with
  a text blur-reveal animation.
- Added a reusable `SecretTitleWord` motion component. Six words reveal in a
  short scroll stagger during the opening 16% of Secret: each moves from 12px
  blur, zero opacity and 16px down to sharp, opaque and settled. The complete
  title holds briefly, then the existing scene transition fades the parent from
  22–30%. Scroll reversal naturally reverses the same values.
- Preserved layout and accessibility: existing two-line desktop and responsive
  mobile wrapping remain; the split visual words are hidden from assistive tech
  and the `h2` exposes one joined accessible label. Reduced motion renders all
  words sharp and static with no stagger.
- Requested Figma motion guidance selected the existing `motion/react`
  `useScroll`/`useTransform` stack and reinforced separate transform ownership
  plus reduced-motion behavior. No Figma URL, node or motion payload was
  supplied, so no Figma MCP call or export warning applied. Caveman affected
  conversation brevity only.
- Files changed: `src/components/Secret.tsx`, `src/styles/global.css`,
  `scripts/verify-secret-scroll.mjs`,
  `scripts/verify-hero-secret-transition.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,008 modules). Headless Chrome at
  1440x900 and 390x844 measured all words at blur(12px), opacity 0 and y=16px
  at progress 0; a staggered mix at 0.08; all words at blur(0), opacity 1 and
  y=0 by 0.16; and the parent title exiting afterwards. Screenshots in ignored
  `.tmp-secret-blur-reveal/` confirm the visual sequence. Existing benefits,
  closing copy, unified-film seeking, reverse playback and zero-overflow checks
  remain intact with no console or request errors. Reduced-motion verification
  confirms all words render sharp and static.

### 2026-08-14 - Verify the mobile LAN development link

- Request: provide a phone-accessible link because the `localhost` URL does
  not work on mobile.
- Outcome: the Vite development server was already listening on every interface
  at port 5173. The computer's active Ethernet IPv4 address is
  `192.168.5.138`, so the current phone URL is
  `http://192.168.5.138:5173/`.
- Verification: `netstat` showed listeners on `0.0.0.0:5173` and `[::]:5173`;
  an HTTP request to the LAN URL returned status 200.
- Files changed: `PROJECT-CONTEXT.md` only. No application code or server
  configuration changed.
- Remaining condition: the phone must use the same local network. If another
  device still cannot connect, allow the Node/Vite process through Windows
  Firewall for private networks. The LAN IP can change after reconnecting.

### 2026-08-14 - Repair the mobile Hero, Secret and Key Facts presentation

- Request: inspect `reference/Screen_Recording_20260814_125226_Chrome.mp4`,
  find the visible mobile problems, and fix the Hero and "Why Men Around The
  World Choose Us" sections rather than only the two reported symptoms.
- Video analysis: `claude-real-video`/CRV extracted 34 adaptive frames into
  ignored `.tmp-crv-mobile-20260814/`. The recording showed the landscape
  unified film rendered with `cover` in a portrait viewport: the mannequin was
  absent at Hero start, clipped through the client cards later, became an
  oversized hair texture in Secret, and remained visible behind Achievements
  and Key Facts. It also showed a roughly 17px 100% badge and long unstructured
  white travel after the Hero cards.
- Mobile film fix: kept one paused, scroll-controlled video and the existing
  `motion/react` seek timeline. On phones the film is now a softly feathered
  132%-wide 16:9 window (515×283 at 390px) instead of a full-height `cover`
  crop. It stays hidden while Hero copy and client cards occupy the viewport,
  fades in over the cleared lower Hero stage, and remains centred through
  Secret. The smaller presentation turns the former dead white travel into a
  deliberate product beat and keeps the macro and final profile clear of the
  title, proof list and closing panel. Reduced-motion phones omit the
  decorative film.
- Containment fix: `.heroSecret` now clips its paint and owns z-index 0;
  Achievements and Key Facts own opaque isolated stacking contexts above it.
  The shared film can no longer paint into either following section.
- Readability: the full 100% SVG group now scales to about 33px on phones;
  Hero client labels and Secret benefit copy were raised to 14px minimum.
- Requested skill routing: local video skills supplied the chronological visual
  evidence. Figma motion guidance kept layout transforms separate from animated
  opacity, reused the existing `motion/react` stack, and preserved reduced
  motion. No Figma file or node was supplied, so no Figma API action applied.
  Sites used its existing-project path; this Vite repo has no
  `.openai/hosting.json`, and the user asked for local mobile repair, not
  publishing. Caveman affected conversation only.
- Files changed: `src/components/HeroSecret.tsx`,
  `src/components/Wordmark.tsx`, `src/styles/global.css`,
  `scripts/verify-hero-secret-transition.mjs`, `scripts/audit-mobile.mjs`,
  `README.md`, and `PROJECT-CONTEXT.md`. No media asset changed.
- Verification: `npm.cmd run build` passed with 2,008 modules. Headless Chrome
  at 390×844 confirmed the phone film at 515×283, Hero opacity 0 through its
  copy/card phase and 1 in the cleared product phase, the badge at 34×34px,
  one video element, working forward/reverse seek,
  and zero horizontal page overflow, console errors or failed requests.
  Achievements and Key Facts both measured `paintedFilmArea: 0`; screenshots
  show clean white/grey grounds with no hair texture. Full mobile audits at
  390×844 and 360×780 both reported zero page overflow and zero console errors;
  the final 390px pass also reported zero elements painting outside their
  intended clipping or scrolling containers.

### 2026-08-14 - Recompose the combined Hero for mobile

- Request: inspect `reference/Recording 2026-08-14 165915.mp4` and improve the
  already-repaired combined mobile Hero, especially by putting the 3D product
  above the "Trusted by 6k+ men around the world" block.
- Video analysis: CRV extracted 16 adaptive, scene-aware frames across two
  contact sheets. They showed a copy-plus-testimonials first screen, followed
  by a long gap before the product appeared. The Secret sequence itself was
  already substantially improved, so the work stayed focused on Hero hierarchy
  and the handoff.
- Outcome: mobile Hero now reads as pitch -> reserved 3D product beat -> trust
  carousel. A 270-320px `.hero__filmSlot` holds the product's place, and the
  carousel has a subtle top rule so it reads as the section's closing proof
  block. At 390x844 the film stage measures 515x283 and aligns at y=390-673;
  the trust block starts at y=685.
- Motion: introduced `.heroSecret__filmStage` so mobile position/opacity no
  longer compete with video presentation or frame seeking. The product is
  visible at Hero start, fades fully before testimonials overlap, stays hidden
  while the cards pass, returns near Hero end, then moves from 63% to 50% of the
  viewport during Secret's opening 14%. Desktop stays at y=0 with opacity 1.
  Reduced-motion phones hide both film and reserved slot.
- Requested skill routing: video skills supplied the chronological evidence;
  Figma motion guidance led to separate transform ownership and preserved the
  existing `motion/react` and reduced-motion architecture. Sites followed its
  existing-project path; no hosting action was appropriate for this local-only
  request. Caveman affected conversation only.
- Files changed: `src/components/Hero.tsx`,
  `src/components/HeroSecret.tsx`, `src/styles/global.css`,
  `scripts/verify-hero-secret-transition.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`. No media asset changed.
- Verification: production build passed with 2,008 modules. The full
  Hero/Secret verifier passed at 1440x900 and 390x844 with one paused video,
  correct forward/reverse states, desktop film y=0, clean testimonial frames,
  zero painted film area in Achievements/Key Facts, reduced-motion fallback,
  and no console errors, failed requests, or overflow. Full page audits at
  390x844 and 360x780 both reported zero horizontal page overflow, zero
  elements painting outside the right edge, and zero console errors.

### 2026-08-14 - Revert the mobile Hero recomposition

- Request: undo the immediately preceding mobile Hero reordering because the
  new pitch-product-trust composition did not look good.
- Outcome: restored the prior combined Hero exactly. Removed the reserved
  `.hero__filmSlot`, trust-block divider, dedicated film-stage wrapper, lower
  mobile product position, and new fade windows. Mobile again shows pitch and
  client cards first; the contained 132%-wide film stays hidden through that
  phase, fades in after they clear, and remains centred into Secret.
- Preserved: all earlier mobile repairs remain, including contained 16:9 film,
  enlarged 100% badge, Secret readability, film containment outside the
  Hero/Secret journey, reduced-motion behavior, and mobile audit fixes.
- Files changed: `src/components/Hero.tsx`,
  `src/components/HeroSecret.tsx`, `src/styles/global.css`,
  `scripts/verify-hero-secret-transition.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed with 2,008 modules and
  `git diff --check` passed. The transition verifier restored mobile Hero film
  opacity to 0 at progress 0, 0.25 and 0.5, then 1 at 0.75 and 1; desktop stays
  at opacity 1. Achievements and Key Facts both measured zero painted film area,
  with no console errors, failed requests, or overflow. The 390x844 full-page
  audit reported zero horizontal overflow, zero right-edge paint escapes, and
  zero console errors.

### 2026-08-14 - Remove film backdrop artifact, enlarge mobile model and centre ending

- Request: remove the dark square/studio-panel artifact visible behind the 3D
  hair system on desktop and mobile, enlarge the mobile product by 20%, and
  centre the final profile instead of letting it finish on the left.
- Diagnosis: CRV sampled all 15 seconds into 16 scene-aware frames. The dark
  panels remained in the served video from roughly 7-15 seconds, proving the
  box was baked into the pixels rather than created by a CSS container. The
  final source frame placed the mannequin near 30% of frame width. The former
  mobile edge mask also became a visible horizontal band once the film grew.
- Asset fix: created `public/video/hair-system-unified-clean.mp4` from the
  existing scrub encode with a stronger high-key curve that maps the generated
  near-white studio panels to white. The 1940x1068, 24fps H.264 output is
  fast-started, silent, and retains a keyframe every six frames. The previous
  asset remains untouched as a fallback; `src/site.ts` serves the clean copy.
- Layout and motion: mobile width changed from 132% to 158.4%, an exact 20%
  scale increase, producing a 618x340 film box at 390px. Removed the obsolete
  mobile edge mask. Added `.heroSecret__filmMotion` as a separate transform
  owner; it holds at x=0 through 82% of Secret, then shifts 20vw on desktop and
  32vw on mobile so the left-biased final profile finishes centred. Reduced
  motion receives no shift.
- Requested skill routing: video skills identified artifact timing and final
  source framing. Figma motion guidance kept wrapper movement separate from
  video scale/centering. Sites followed its existing-project path; this was a
  local repair, so no hosting action applied. Caveman affected conversation
  only.
- Files/assets changed: `public/video/hair-system-unified-clean.mp4`,
  `src/site.ts`, `src/components/HeroSecret.tsx`, `src/styles/global.css`,
  `scripts/verify-hero-secret-transition.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Verification: transition screenshots at 1440x900 and 390x844 show clean
  white backgrounds with no square or mask band, a centred final profile, and
  the larger mobile product. `npm.cmd run build` passed with 2,008 modules;
  `git diff --check` passed. `ffprobe` confirmed H.264, 1940x1068, 24fps,
  15.041667 seconds, 4,295,966 bytes, and 60 keyframes spaced exactly 0.25
  seconds apart. Transition verification reported one video, working
  forward/reverse states, zero overflow, no console errors or failed requests,
  and zero film paint in Achievements/Key Facts. Full-page audits at 390x844
  and 360x780 both reported zero horizontal overflow, zero right-edge paint
  escapes, and zero console errors. Reduced-motion fallback remained intact.

### 2026-08-14 - Restore original model shade while retaining square cleanup

- Request: inspect `reference/Recording 2026-08-14 175517.mp4`; keep the new
  centred ending, but undo the noticeably different 3D model shade and change
  only the square-edge background artifact.
- Diagnosis: CRV extracted 13 scene-aware frames from the nine-second mobile
  recording. They confirmed that the global high-key curve made hair nearly
  black, removed brown strand highlights, and overexposed the mannequin. The
  centering motion itself remained correct.
- Outcome: regenerated `hair-system-unified-clean.mp4` from the prior
  `hair-system-unified-scrub.mp4` grade. Instead of changing the full tonal
  curve, the correction now targets only cool, bright pixels in the upper
  studio background; warm mannequin tones, dark/brown hair detail, and the
  lower pedestal keep their previous values. The dark panel edge remains gone.
- Preserved unchanged: 158.4% mobile width, 20% size increase, final 20vw/32vw
  centering motion, one-video seek controller, section containment, and
  reduced-motion behavior.
- Requested skill routing: video skills supplied chronological evidence and
  shade comparison. Figma motion guidance confirmed no motion change was
  needed. Sites used its existing-project path; no hosting action applied.
  Caveman affected conversation only.
- Files/assets changed: `public/video/hair-system-unified-clean.mp4`,
  `src/site.ts`, `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: transition screenshots at 1440x900 and 390x844 show restored
  strand highlights and mannequin shading, no dark square, unchanged 618x340
  mobile sizing, and the same centred ending. The transition verifier reported
  zero overflow, no console errors or failed requests, and zero film paint in
  Achievements/Key Facts. `npm.cmd run build` passed with 2,008 modules. The
  390x844 full-page audit reported zero overflow, right-edge paint escapes, or
  console errors. `ffprobe` confirmed H.264, 1940x1068, 24fps, 15.041667
  seconds, 6,618,929 bytes, and 61 keyframes spaced exactly 0.25 seconds apart.

### 2026-08-14 - Add mobile transformation swipe cue

- Request: make the mobile “Before And After, In Their Own Words” interaction
  more discoverable by placing a swipe instruction with double arrows below
  the transformation images.
- Outcome: added a mobile-only, centred pill reading “Swipe to see more
  transformations” beneath the card fan. A `ChevronsLeftRight` icon gently
  travels from -2px to 3px and back on a 1.6-second loop; reduced-motion users
  get the same cue with no movement. Desktop remains unchanged.
- Design decision: kept the cue visually subordinate with 13px type, a faint
  border, translucent white ground and small shadow. It explains the existing
  horizontal drag gesture without restoring the previously removed dots,
  follow-up copy or social links.
- Requested skill routing: Sites used its existing-project workflow; the repo
  has no `.openai/hosting.json` and publishing was not requested. Figma motion
  guidance led to a single low-amplitude transform and a static reduced-motion
  fallback; no Figma file or node was supplied, so no Figma API action applied.
  Caveman affected conversation only.
- Files changed: `src/components/Deck.tsx`, `src/styles/global.css`,
  `scripts/verify-deck.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed with 2,008 modules. Headless Chrome
  at 390x844 measured the cue at 280x40px, centred below the three-card fan,
  with zero horizontal overflow, console errors or failed requests. The same
  audit confirmed the cue is hidden at 1440x900, the deck still centres clicked
  cards, and the removed dots/follow content remain absent. Visual screenshot
  review confirmed clear spacing and hierarchy.

### 2026-08-14 - Add motion to the remaining static mobile sections

- Request: audit the mobile homepage and add animation or micro-interaction to
  sections that had none, without touching sections that already moved or
  responded to the user.
- Audit result: only two mobile fallbacks were genuinely static. Story rendered
  every card already open with no entrance; Advanced 3D Scan rendered a plain
  heading and image. Hero/Secret, Key Facts and Checklist retain scroll motion;
  Backed, Decide, Process, Pillars, Deck, FAQ, Form and Methods already have
  reveals, counts, drag, accordion or field interactions; Achievements, Client
  Stories, Systems and Salons already use touch-driven snap rails; Services is
  a touch accordion; Footer retains its marquee. Those sections were untouched.
- Story outcome: reused `useReveal` for one mobile-only entrance. The heading
  resolves from 9px blur and an 18px rise; the five recognition cards and CTA
  rise 20px on a 70ms stagger. The CTA scales to 0.97 while pressed. Desktop
  keeps the existing scroll-built stack exactly as before.
- Scan outcome: reused `useReveal` for a phone-only echo of the desktop growth.
  The heading resolves from 10px blur, the image rises 24px while its inset crop
  opens, and one decorative white scan beam crosses the photograph after it
  settles. Desktop keeps its measured panel interpolation unchanged.
- Accessibility and ownership: both additions exist only inside
  `max-width: 900px` plus `prefers-reduced-motion: no-preference`. Reduced-motion
  users receive settled content and no scan beam. Layout and animated transforms
  remain on separate elements, with no new dependency or persistent animation.
- Requested skill routing: Sites used its existing-project workflow; this repo
  has no `.openai/hosting.json`, and publishing was not requested. Figma motion
  guidance kept motion factored, mobile-only and reduced-motion safe; no Figma
  file, node or motion payload was supplied, so no Figma API action applied.
  Caveman affected conversation only.
- Files changed: `src/components/Story.tsx`, `src/components/Scan.tsx`,
  `src/styles/global.css`, `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed with 2,008 modules. Source-level
  checks confirmed both additions are gated to phone widths and no-preference
  motion, the scan beam is hidden by default, and the only component changes
  are Story and Scan. Per Sites preview rules, no browser DOM or screenshot
  inspection was run because browser testing was not explicitly requested.

### 2026-08-14 - Revise Decide, desktop footer and mobile services

- Request: make the “Real Hair Or Illusion? Watch & Decide” card 16:9 and use
  `Images/image png 2.png`; restore the formerly large desktop footer wordmark
  without changing mobile; and show all three Hair Services rows open on
  mobile without changing desktop.
- Decide: copied the supplied 992×558 PNG unchanged to
  `public/decide/from-bald-to-bold.png`, updated `decideVideo.poster` and its
  descriptive alt, and changed the card from 4:3 to 16:9. The same data and
  aspect-ratio rule serve desktop and mobile.
- Footer: removed the accidental inline `3.1rem` font size so desktop again
  uses the original `clamp(4rem, 13vw, 15rem)` oversized treatment. Added a
  `max-width: 900px` rule fixing phone/tablet type at the existing 3.1rem and
  retained the small-phone two-line wrap; mobile composition is unchanged.
- Services: added a mobile media-query state. At 900px and below every row has
  `data-open=true`, all bodies are visible, and heading buttons are disabled
  because no collapsed state remains. Desktop scroll/click selection and
  reduced-motion desktop accordion behavior are unchanged.
- Requested skill routing: Sites used its existing-project workflow; the repo
  has no `.openai/hosting.json`, and publishing was not requested. Caveman
  affected conversation only.
- Files/assets changed: `src/site.ts`, `src/components/Footer.tsx`,
  `src/components/Services.tsx`, `src/styles/global.css`, `README.md`,
  `PROJECT-CONTEXT.md`, and new
  `public/decide/from-bald-to-bold.png`. Existing Decide poster remains on disk.
- Verification: `npm.cmd run build` passed with 2,008 modules. Source checks
  confirmed the shipped thumbnail is byte-identical to the supplied image and
  is exactly 992×558, the Decide card is 16:9, footer mobile size stays 3.1rem,
  and only mobile Services forces all rows open. `git diff --check` passed. Per
  Sites preview rules, no browser DOM or screenshot inspection was run because
  browser testing was not explicitly requested.

### 2026-08-18 - Install claude-real-video and Antigravity skills

- Request: install `claude-real-video[whisper]` and add `HUANGCHIHHUNGLeo/claude-real-video` skills for Antigravity.
- Executed `python -m pip install "claude-real-video[whisper]"` (dependencies satisfied) followed by `npx.cmd skills@latest add HUANGCHIHHUNGLeo/claude-real-video -a antigravity -y`.
- Successfully installed `claude-real-video` and `claude-real-video-for-agents` skills into `.agents/skills/`.
- Verification: skills installer finished with exit code 0 and confirmed installation of both skills into `.agents/skills/claude-real-video` and `.agents/skills/claude-real-video-for-agents`.

### 2026-08-18 - Install nextlevelbuilder/ui-ux-pro-max-skill bundle globally and locally

- Request: install `nextlevelbuilder/ui-ux-pro-max-skill` and make it work across every project (`claude plugin add nextlevelbuilder/ui-ux-pro-max-skill`).
- Claude Code plugin verification: `ui-ux-pro-max@ui-ux-pro-max-skill` (v2.11.0) enabled at user scope with all 7 component skills (`banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`, `ui-ux-pro-max`).
- Global agent installation: Executed `npx.cmd skills@latest add nextlevelbuilder/ui-ux-pro-max-skill --skill * -g -a * -y` installing all 7 skills globally in `~/.agents/skills/` for Antigravity, Claude Code, Codex, and 50+ other agents across any project on the machine.
- Workspace installation: Executed `npx.cmd skills@latest add nextlevelbuilder/ui-ux-pro-max-skill --skill * -a * -y` placing the 7 skills into `.agents/skills/` for direct local discovery and immediate pair-programming capability in this workspace.
- Verification: `npx skills list -g` and `claude plugin list` confirm all 7 skills are installed and enabled globally.

### 2026-08-18 - Install freshtechbro/claudedesignskills marketplace & skills globally and locally

- Request: `claude plugin marketplace add freshtechbro/claudedesignskills` and ensure it works on every project.
- Claude Code marketplace & plugins: Added marketplace `freshtechbro/claudedesignskills` (registered as `claude-design-skillstack` in user configuration). All 22 component plugins enabled at user (global) scope in Claude Code (`aframe-webxr`, `animated-component-libraries`, `animejs`, `babylonjs-engine`, `barba-js`, `blender-web-pipeline`, `gsap-scrolltrigger`, `lightweight-3d-effects`, `locomotive-scroll`, `lottie-animations`, `modern-web-design`, `motion-framer`, `pixijs-2d`, `playcanvas-engine`, `react-spring-physics`, `react-three-fiber`, `rive-interactive`, `scroll-reveal-libraries`, `skill-creator`, `spline-interactive`, `substance-3d-texturing`, `threejs-webgl`, `web3d-integration-patterns`).
- Global agent installation: Ran `npx.cmd skills@latest add freshtechbro/claudedesignskills --skill * -g -a * -y` to install all skills globally into `~/.agents/skills/` across all supported AI coding agents (Antigravity, Codex, Claude Code, Amp, Cline, etc.) so that they are active on every project.
- Workspace installation: Ran `npx.cmd skills@latest add freshtechbro/claudedesignskills --skill * -a * -y` to link/add the skills to the current workspace's `.agents/skills/`.
- Verification: `claude plugin marketplace list`, `claude plugin list`, and `npx skills list -g` confirmed the marketplace and all skills are active globally.

### 2026-08-18 - Build Stick-On or Clip-On hero section and navigation dropdowns

- Request: build "Stick-On or Clip-On" page hero section matching reference video (`reference/svc_r.mp4`) and supplied image (`Images/svc.png`), responsive and mobile friendly with the homepage theme; implement desktop dropdowns and mobile accordions for "Confused? We'll Guide You" (including nested "Clip-On or Stick-On" sub-items) and "Solutions" per the previous AHL website navigation designs.
- Navigation outcome:
  - Updated `nav` structure in `src/site.ts` with typed submenus for "Confused? We'll Guide You" and "Solutions".
  - Updated `src/components/Nav.tsx` with desktop hover/focus flyouts, nested submenus with chevrons, seamless hover bridges, and an interactive mobile drawer accordion.
  - Active route detection highlights current page and section links.
  - `src/App.tsx` routes `#/stick-on-or-clip-on` to `StickOnClipOn` page while preserving hash anchors.
- Hero section outcome:
  - Copied `Images/svc.png` (4480×2520) to `public/choice/svc.png`.
  - Added `choiceHeroEyebrow` (`🧩 Our Methods`) and updated `choiceHeroMedia` in `src/site.ts`.
  - Rebuilt `src/components/ChoiceHero.tsx` in the light homepage theme with spring-scrubbed pinned scroll animation (`useSpring`, `useTransform`). At rest, the card sits centered in view matching Image 3; as the user scrolls, the card smoothly expands across the viewport while the header copy translates upward and fades out.
  - Mobile (≤900px) and reduced-motion modes use clean unpinned vertical flow with entrance reveals and 0 horizontal overflow.
- Files/assets changed: `public/choice/svc.png`, `src/site.ts`, `src/components/Nav.tsx`, `src/components/ChoiceHero.tsx`, `src/App.tsx`, `src/styles/global.css`, `scripts/verify-choice-and-nav.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (`tsc -b && vite build`, 2,010 modules transformed). Headless Chrome Puppeteer verification at 1440×900 and 390×844 confirmed working dropdowns, flyout submenus, smooth scroll growth, zero horizontal overflow (`scrollWidth === clientWidth`), zero console errors, and verified visual screenshots.

### 2026-08-18 - Refine Stick-On or Clip-On hero: natural scroll flow & primary color pill

- Request: inspect `reference/svc hero section.mp4` recording where sticky header text faded awkwardly over the growing card; match `reference/svc_r.mp4` where header text scrolls away naturally with the page, card smoothly scales up into full view on scroll, and the "Our Methods" pill badge uses the brand primary color.
- Outcome:
  - Updated `src/components/ChoiceHero.tsx` so the header (`.choice__header`) sits in natural document scroll flow rather than being fixed/sticky or fading over the card.
  - Placed the card (`.choice__card`) below the copy with Framer Motion `useScroll` + `useSpring`, smoothly scaling from `0.91` to `1.0` (and `borderRadius` from 28px to 18px) as the user scrolls into view, matching `reference/svc_r.mp4`.
  - Updated `src/styles/global.css` for `.choice__eyebrow` to use the primary brand gradient (`var(--grad)`) with white text (`#ffffff`), glowing elevation shadow, and hover micro-interaction.
  - Fully responsive and mobile/reduced-motion friendly with zero horizontal overflow.
- Files changed: `src/components/ChoiceHero.tsx`, `src/styles/global.css`, `scripts/verify-choice-and-nav.mjs`, `PROJECT-CONTEXT.md`, and `walkthrough.md`.
- Verification: `npm.cmd run build` passed (0 errors, 2,010 modules). Headless Chrome Puppeteer tests at 1440×900 and 390×844 verified natural scroll flow, primary pill badge, card scaling, zero overflow, and zero console errors.

### 2026-08-18 - Use exact uploaded puzzle icon in primary color

- Request: use the exact uploaded diagonal puzzle piece image (`media_1787052590898.png`) in primary color.
- Outcome:
  - Saved exact asset to `public/choice/puzzle-piece.png`.
  - Configured CSS mask in `src/styles/global.css` (`-webkit-mask` / `mask: url('/choice/puzzle-piece.png')`) on `.choice__eyebrowIcon` with `background-color: #1769ff` (primary blue).
  - Updated `src/components/ChoiceHero.tsx` to render the masked icon element inside `.choice__eyebrow`.
- Files changed: `public/choice/puzzle-piece.png`, `src/components/ChoiceHero.tsx`, `src/styles/global.css`, `scripts/verify-choice-and-nav.mjs`, `PROJECT-CONTEXT.md`, and `walkthrough.md`.
- Verification: `npm.cmd run build` passed (0 errors, 2,010 modules). Headless Chrome Puppeteer verification confirmed exact puzzle icon silhouette rendered in primary blue, zero overflow, and zero console errors.

### 2026-08-18 - Increase ChoiceHero scroll-scale expansion range

- Request: increase scroll interaction so the card expands more as the user scrolls down.
- Outcome:
  - Updated `src/components/ChoiceHero.tsx` scroll-scale transform from `[0.91, 1]` to `[0.82, 1.04]` and corner radius from `[32, 18]` to `[36, 16]` across an extended scroll track `['start 92%', 'center 38%']`.
  - Updated `src/styles/global.css` for `.choice__cardWrap` to `max-width: 1320px` with deeper elevation drop-shadows.
- Files changed: `src/components/ChoiceHero.tsx`, `src/styles/global.css`, `PROJECT-CONTEXT.md`, and `walkthrough.md`.
- Verification: `npm.cmd run build` passed (0 errors, 2,010 modules). Headless Chrome Puppeteer tests confirmed pronounced scroll growth, zero horizontal overflow, and zero console errors.

### 2026-08-18 - Add Transformations ("Real Results That Showcase True Transformations") section

- Request: add "Real Results That Showcase True Transformations" section with 8 client cards, each containing name, quote, before/after image, and alternating "Stick-On Hair System" vs "Clip-On Hair System" CTA buttons in the expanding card accordion pattern.
- Outcome:
  - Copied 8 client transformation assets to `public/transformations/` (`chandan.png`, `rahil.png`, `azhar.png`, `rylan.png`, `daljit.png`, `advik.png`, `saurabh.png`, `sahil.png`).
  - Added `transformationsTitle` and `transformationsClients` array in `src/site.ts`.
  - Built `src/components/Transformations.tsx` featuring an interactive expanding card deck on desktop (active card with before/after artwork, name badge pill, quote, and primary blue CTA button; collapsed strips with client faces and hover expansion) and a horizontal touch snap rail on mobile.
  - Added CSS styling in `src/styles/global.css` for `.transforms`, `.transforms__deck`, `.transforms__card`, `.transforms__overlay`, and `.transforms__rail`.
  - Included `<Transformations />` on `src/pages/StickOnClipOn.tsx`.
- Files changed: `public/transformations/*`, `src/site.ts`, `src/components/Transformations.tsx`, `src/pages/StickOnClipOn.tsx`, `src/styles/global.css`, `scripts/verify-choice-and-nav.mjs`, `PROJECT-CONTEXT.md`, and `walkthrough.md`.
- Verification: `npm.cmd run build` passed (0 errors, 2,011 modules). Headless Chrome Puppeteer tests at 1440×900 and 390×844 confirmed card expansion, click/hover switching, alternating CTAs, 0 horizontal overflow, and 0 console errors.

### 2026-08-18 - Add Systems ("World's Finest Thinnest Hair Systems") to Stick-On or Clip-On page

- Request: add "World's Finest Thinnest Hair Systems" section to the Stick-On or Clip-On page like on homepage.
- Outcome:
  - Imported and rendered `<Systems />` below `<ChoiceHero />` in `src/pages/StickOnClipOn.tsx`.
  - The interactive 3D circular gallery (13 hair system cards, rotation on scroll, product video modals, mobile snap rail) is active on `#/stick-on-or-clip-on`.
- Files changed: `src/pages/StickOnClipOn.tsx`, `scripts/verify-choice-and-nav.mjs`, `PROJECT-CONTEXT.md`, and `walkthrough.md`.
- Verification: `npm.cmd run build` passed (0 errors, 2,010 modules). Headless Chrome Puppeteer verified 3D circular gallery rendering, smooth navigation, zero overflow, and zero console errors.

### 2026-08-12 - Mobile pass across every section

- Request: make the whole homepage mobile friendly and responsive, without
  changing desktop.
- Built `scripts/audit-mobile.mjs` first, because "make it mobile friendly" is
  not actionable until it is measured. It walks the page at a phone size and
  reports, per element: horizontal overflow, tap targets under 44x44, text
  under 14px, sections over three viewports, and console errors. It scrolls the
  whole page before measuring so lazy content and scroll-driven sections have
  settled.
- **Baseline at 390x844:** page overflow 0 — nothing broke the layout
  horizontally, which is the one thing that would have been urgent. What was
  wrong instead: **43 tap targets under 44x44**, **20 text runs under 14px**
  (down to 9.9px), and two sections running very long — checklist 4,220px
  (5 viewports) and the Hero-to-Secret film 3,022px (3.6).
- Client chose to shorten both long sections.
- **Everything in this pass is inside `@media (max-width: 900px)`**, so desktop
  is untouched by construction rather than by inspection. Verified anyway: at
  1440x900 `--secret-step` is still 92vh, `--checklist-step` still 26vh, the
  slider arrows still 34x34, the dots 32x4, the services header 31px tall, and
  the small type still at 12px / 11px / 9.92px / 11.52px — every value exactly
  as before.
- Scroll length, phone only: `--secret-step` 86svh -> 56svh and
  `--checklist-step` 20vh -> 12vh. Mechanism, row pitch and plateau shaping are
  all unchanged; only the distance the thumb has to travel. Checklist 4,220 ->
  2,870px, Secret 3,022 -> 2,262px, whole document 20,804 -> 19,060px.
- **Tap targets, 43 -> 4.** Two techniques, and the distinction matters:
  - Where the control's drawn size *is* the design — the 4px slider dots — an
    `::after` gives a 44px touchable box centred on it without changing what is
    painted. The audit still reports these as 4px because
    `getBoundingClientRect` cannot see pseudo-elements; the target measures
    44px when queried directly, which is recorded here so nobody "fixes" it
    twice.
  - Everywhere else the box was the line box, so the fix is `inline-flex` plus
    `min-height`. Accordion headers went from 23px to 52px — a 23px primary
    control is a hazard, not a target.
- **Text under 14px, 20 -> 0.** Anything a visitor reads is at least 14px;
  eyebrows, counters and tags sit at 12px, where they stop straining.
- The four remaining sub-44px reports are the three slider dots (real target is
  44px, see above) and the footer's "Blog" link, which is 29px *wide* and 44px
  tall — the height is what matters for a link in a vertical list.
- Also checked 360x640: page overflow still 0. The elements the audit lists as
  painting past the right edge there are the match slider's off-screen pages
  and the hero film's 1.08 scale, both deliberate and both inside a clipping
  parent.
- **Not touched, deliberately:** the Hero-to-Secret section was rebuilt by
  someone else between sessions — it is now a shared film controller
  (`HeroSecret.tsx`, `hair-system-unified-scrub.mp4`) and `App.tsx`, `site.ts`
  and the README moved with it. My own earlier Secret rebuild is gone,
  superseded. Only its phone scroll length was changed here; its mechanism was
  left alone.
- Files changed: `src/styles/global.css`, `scripts/audit-mobile.mjs` (new),
  `README.md`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (CSS 73.37 kB). Audit re-run at
  390x844 and 360x640: page overflow 0, zero text under 14px, four sub-44px
  reports all explained above, zero console errors. Desktop re-measured at
  1440x900 with every changed property back to its original value, document
  height 38,784px and overflow 0. Mobile screenshots of the hero, services,
  methods, FAQ, salons, form and footer confirm no layout distortion from the
  new minimum heights.
- Not committed; belongs to the eventual version 2.

### 2026-08-12 - Fix the footer wordmark being cut off on phones

- Request: the giant "American Hairline" in the footer is cut off on mobile.
- The band is *meant* to bleed off both edges — that is the reference's effect
  and it is right on a desktop, where 1,540px of type in a 1,440px viewport
  reads as full-bleed. Below about 560px it stops being that and starts looking
  broken.
- **The cause was the clamp's floor, not the vw term.**
  `font-size: clamp(4rem, 13vw, 15rem)` holds at 64px once 13vw drops under it,
  so the line stayed 527px wide however narrow the phone got. Measured at 390px:
  68px lost off each edge, 74% of the name visible; at 360px, 68%. Changing the
  vw term would have done nothing — the floor was the binding constraint.
- Fix: below 560px the name wraps to one word per line at
  `clamp(2.75rem, 20vw, 5.5rem)`, sized to clear the gutter at every phone
  width. The oversized outlined treatment survives and the whole name is
  legible. 560px is where the single line stops bleeding and starts truncating.
- Verified across seven widths: 360/390/430/560px all wrap to two lines with
  **zero** cut on either side (widest line 325/352/388/397px); 561px and above
  keep the single cropped line exactly as before, and 1440px still measures the
  same 1,540px it always did. Page overflow 0 at every width.
- Files changed: `src/styles/global.css` only.
- Note for whoever reads this next: two mistakes of mine are worth not
  repeating. A backtick inside a bash heredoc triggered command substitution and
  silently swallowed the `clamp(...)` text from a CSS comment — use a quoted
  delimiter. And puppeteer's `screenshot({ clip })` is **document**-relative,
  not viewport-relative, so clipping after a scroll captures the top of the page
  instead of what is on screen.

### 2026-08-18 - Second page: hash routing for Stick-On or Clip-On

- The site had been one page. "Stick-On or Clip-On" is the second, and it needed
  to be reachable without adding a router dependency.
- `src/App.tsx` now switches on `location.hash` and renders either `Home()` or a
  page from a `routes` map. `src/pages/StickOnClipOn.tsx` is the page shell.
- **Routes match on a leading slash, and that is the whole reason this works.**
  The nav's own links are bare hash anchors — `#home`, `#guide`, `#solutions` —
  and a bare anchor has no slash, so it can never be mistaken for a route.
  `#/stick-on-or-clip-on` is a route; `#guide` scrolls the current page.
- Hash rather than path also means no dev-server or host rewrite rules: every
  route is served by the same `index.html`.
- This is deliberately the smallest thing that makes a second page reachable.
  The brand has around thirteen pages; when the site passes a handful, replace
  it with a real router rather than extending this map.
- The page's hero (`ChoiceHero.tsx`) was subsequently reworked by another
  assistant — light theme, eyebrow pill restored, scale-on-scroll rather than
  the rect interpolation it started with. Its own entries are dated 2026-08-18
  above; that version is the current one.

### 2026-08-18 - Rebuild Real Results on the homepage's client-stories mechanism

- Request: make "Real Results That Showcase True Transformations" on the
  Stick-On or Clip-On page work like the homepage's "Some Of Our Clients With
  The Most Natural Hairline".
- The section already existed, built on a different mechanism: a hover-to-expand
  accordion deck with prev/next buttons and — the part that mattered — **a
  second, duplicated markup tree for mobile**. So this was a simplification, not
  a restyle: one set of cards now serves both modes, with CSS making the pin the
  scroll container when unpinned. The `.transforms__rail` tree is gone.
- Now the same pattern as `ClientStories.tsx`: the section pins, vertical scroll
  drives a horizontal track through intro panel, eight client cards, closing
  panel, and the section's height is `100vh + trackOverflow` measured after
  paint by a `ResizeObserver`. Below 901px and for reduced motion the pin is
  dropped for a snap rail.
- The artwork suited it exactly: all eight files are 1921x1080 before/after
  splits with no labels — the same shape and the same problem as the homepage's
  posters, so the `Before` / `After` tags carry over for the reason already
  recorded there. Without them the frame reads as one photograph of two
  different men.
- Two decisions taken with the client:
  - **The per-client CTA stays.** Each card keeps its "Stick-On Hair System" or
    "Clip-On Hair System" link. This is the one place the card differs from the
    homepage's, and it is deliberate: on a page about choosing between the two
    methods, which one a man actually wore is part of the evidence. The homepage
    has no such choice to make, which is why its cards carry no CTA.
  - **The images were converted.** The supplied PNGs were about 2 MB each,
    16.0 MB for the eight, on a page that has to work on phones. Converted with
    `ffmpeg -q:v 4` to a 1920px `.jpg` plus a 1200px `-small.jpg`: **1.86 MB for
    all sixteen, an 88% reduction.** `TransformationClient` gained a `small`
    field and the card uses `srcSet`/`sizes`, the way `ChoiceHero` does. The
    PNGs are still in `public/transformations/` beside them, so it is
    reversible.
- The distance-measuring block is a deliberate near-copy of the one in
  `ClientStories.tsx`. Extracting a shared hook would mean editing the homepage
  component, which this project has repeatedly asked to leave alone. Worth
  extracting the moment a third section needs the mechanism — there are now two.
- Files changed: `src/components/Transformations.tsx` (rebuilt),
  `src/styles/global.css` (the `.transforms` block replaced, 300 lines out and
  219 in), `src/site.ts` (type plus eight image paths).
  `src/pages/StickOnClipOn.tsx` needed no change.
- Verification: `npm.cmd run build` passed (CSS 86.66 kB, JS 376.98 kB).
  Headless Chrome at 1440x900 across the pin: section 6,984px, track 7,524px,
  travel 0 -> -3,042 -> -6,084, and the closing panel finishing at 832-1,380px
  inside a 1,440px viewport, so nothing is clipped and no dead scroll is left.
  All eight CTAs measured exactly 44px tall, clearing the tap-target floor the
  mobile pass set. `overflowX` on the pin reported `hidden` when pinned and
  `auto` at 390x844 and under reduced motion, where the section also reported
  not pinned. Zero duplicate rail trees, zero page overflow, zero console
  errors in every mode. The browser resolved `-small.jpg` rather than the 1920px
  file at both 1440px and 390px, which is the point of the `srcSet`.
- Not committed; belongs to the eventual version 2.

### 2026-08-19 - Build "Two Easy Methods To Get Your Hair Back" section

- Request: add the "Two Easy Methods" section to the Stick-On or Clip-On page,
  matching a reference video (`reference/2easyRecording 2026-08-19 152355.mp4`)
  that shows a single card with an image that scales from small to large as the
  user scrolls. The same animation needed to be applied to two cards — Stick-On
  and Clip-On — using supplied images.
- Watched the reference video using `crv` (claude-real-video) to understand the
  scroll-driven image scaling animation. The reference has a single card with a
  purple gradient background and an image that grows from compact to full-size
  as the user scrolls through the section.
- Created `src/components/TwoMethods.tsx`: two side-by-side blue-gradient cards
  with badge pills (frosted glass, icon + label), description text, "Know more"
  CTA, and a full-height client photograph. Each card's image is independently
  scroll-animated using `useScroll` + `useSpring` from `motion/react`:
  - Image scales from 0.72 to 1.0 with spring physics
  - Image shifts upward 40px as it grows, creating the "emerging" effect
  - Card itself fades and rises on entry
  - Border radius subtly changes during the animation
- Images (`stick onn 1.png`, `new clip  on 2.png`) copied to
  `public/two-methods/stick-on.png` and `public/two-methods/clip-on.png`.
  Both have white backgrounds; `mix-blend-mode: multiply` removes the white
  against the blue gradient.
- Added content data to `src/site.ts`: `twoMethodsTitle`, `twoMethodsCards`
  (type `TwoMethodCard`), with badge, description, CTA, image path, alt text.
- Added CSS block to `src/styles/global.css` (158 lines): blue gradient cards,
  responsive grid (2-column → 1-column at 768px), reduced-motion fallback.
- Placed in `pages/StickOnClipOn.tsx` between ChoiceHero and Transformations.
  Section table in §2 updated, sections renumbered.
- Files changed: `src/components/TwoMethods.tsx` (new),
  `src/pages/StickOnClipOn.tsx` (import + placement),
  `src/site.ts` (content data), `src/styles/global.css` (CSS block).
  Assets: `public/two-methods/stick-on.png`, `public/two-methods/clip-on.png`.
- Verification: `npm.cmd run build` passed (2,012 modules, CSS 88.87 kB,
  JS 380.49 kB). Visual verification via browser: section renders correctly
  with both cards, badges, text, CTAs, and scroll-driven image scaling animation
  working as intended.

### 2026-08-19 - Make Two Methods heading static & compact card height

- Request: in "Two Easy Methods To Get Your Hair Back" section on Stick-On or Clip-On page,
  make the section heading static (no scroll fade/translate/overlap) and make the card size
  compact instead of overly long.
- Updated `src/components/TwoMethods.tsx`:
  - Removed heading animation; rendered static `h2`.
  - Removed negative grid margins and card translation.
  - Kept smooth spring-driven image zoom/scale (`0.75` -> `1.0`) on scroll inside cards.
- Updated `src/styles/global.css`:
  - Adjusted card height from `clamp(480px, 56vw, 720px)` to a compact `clamp(380px, 38vw, 500px)`.
  - Balanced image container height and padding to eliminate the large empty blue space.
  - Set static heading styling with standard margin-bottom.
- Verification: `npm.cmd run build` passed (2,012 modules, CSS 89.15 kB, JS 380.39 kB). Browser subagent verified at 1440x900: heading is static and cleanly positioned above cards, cards have balanced proportions without empty blue void, and images scale smoothly on scroll.

### 2026-08-19 - Build "Still Confused?" section above Footer

- Request: build the "Still Confused?" section matching the supplied image and reference video (`reference/still confuse section refrence.mp4`), and place it above the footer on the Stick-On or Clip-On page.
- Analyzed reference video via `crv`:
  - Dark ambient room stage with subtle central vertical pill capsule and glowing marker.
  - Large bold centered typography scrubbed word-by-word into radiant white as the user scrolls.
- Created `src/components/StillConfused.tsx`:
  - Blue pill eyebrow badge (`Still Confused?`) with chat bubble icon.
  - Headline split into individual words: `Not Sure What Best For You? Let’s Find The Perfect Fit`.
  - Sequential scroll illumination scrub across all words using `useScroll` + `useSpring` + `useTransform`.
  - Subtext ("Get in touch with our expert...") and primary CTA button ("Speak To An Expert ↗") reveal smoothly toward end of scrub.
  - Ambient vertical capsule silhouette with radial blue glow in the background.
  - Reduced motion and mobile fallbacks included.
- Exported `stillConfusedData` in `src/site.ts`.
- Added CSS styling in `src/styles/global.css` (256 lines).
- Placed `<StillConfused />` right above `<Footer />` in `src/pages/StickOnClipOn.tsx`.
- Updated section table in §2 of `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,013 modules, CSS 93.01 kB, JS 383.03 kB). Browser subagent verified at 1440x900: section is pinned, words illuminate sequentially on scroll, eyebrow/subtext/CTA display clearly, and ambient capsule is centered.

### 2026-08-19 - Build "Clip-On Vs. Stick-On Hair Systems" comparison section

- Request: build the "Clip-On Vs. Stick-On Hair Systems" section matching the supplied table image, making it user-friendly, interactive, and responsive, and place it above the "Two Easy Methods To Get Your Hair Back" section on the Stick-On or Clip-On page.
- Created `src/components/Comparison.tsx`:
  - Desktop 3-column table with dark luxury header (`#111317`), interactive column focus/hover states (`is-highlight`), alternating row styling, and contextual category icons.
  - Informative value chips (`24/7 Wear`, `Daily Detach`, `Studio Care`, `Zero Visits`, `Scalp Shave`, `No Shaving`, `100% Secure`, `Casual Use`, `Stylist Fit`, `DIY Ready`).
  - Mobile segmented view switcher tabs (`Side-by-Side`, `Stick-On Focus`, `Clip-On Focus`) with spring-animated layout pill for effortless mobile reading without awkward horizontal table overflow.
  - Two quick decision takeaway summary cards below the table for Stick-On vs Clip-On.
- Exported `comparisonTitle`, `comparisonSubtitle`, `comparisonRows`, and `ComparisonRow` type in `src/site.ts`.
- Added CSS styling in `src/styles/global.css` (459 lines).
- Placed `<Comparison />` directly above `<TwoMethods />` in `src/pages/StickOnClipOn.tsx`.
- Updated section table in §2 of `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,014 modules, CSS 99.79 kB, JS 391.62 kB). Browser subagent verified at 1440x900 (desktop) and 390x844 (mobile): clean table layout, column highlighting, interactive mobile filter tabs, and responsive takeaway cards.

### 2026-08-19 - Simplify Comparison section to exact clean visual match

- Request: simplify the "Clip-On Vs. Stick-On Hair Systems" section to eliminate clutter and match the exact reference image 1:1.
- Updated `src/components/Comparison.tsx`:
  - Removed extra eyebrow badge, subtitle text, mobile tab switcher, icons, and summary takeaway cards.
  - Rendered clean table matching reference: centered 2-line title (`Clip-On Vs. Stick-On \n Hair Systems`), black header row (`Feature`, `Stick-On System`, `Clip-On System`), and white content rows with centered text and subtle dividing borders.
- Updated `src/site.ts`: simplified `comparisonTitle` and `comparisonRows`.
- Updated `src/styles/global.css`: streamlined `.compare` styles to ~140 lines of clean card and table rules.
- Verification: `npm.cmd run build` passed (2,014 modules, CSS 94.91 kB, JS 385.06 kB). Browser subagent verified at 1440x900: table matches the reference image exactly, clean and uncluttered.

### 2026-08-19 - Build "Which Option Feels More Like You?" section in FAQ dark theme

- Request: build the "Which Option Feels More Like You?" interactive toggle section matching images 1 and 2, styled with the dark theme of the homepage FAQ section (image 3), and place it directly below the Hero section on the Stick-On or Clip-On page.
- Created `src/components/WhichOption.tsx`:
  - Ambient dark stage backdrop with soft diagonal light sheen matching the homepage FAQ section.
  - Interactive frosted segmented pill switcher (`Stick-On` vs `Clip-On`) with spring-animated sliding blue pill (`motion.div` layoutId).
  - Translucent glassmorphic decision card (`backdrop-filter: blur(16px)`).
  - Clean checklist with square check badges and high-contrast bold criteria text.
  - Animated transition between Stick-On and Clip-On content using `AnimatePresence`.
  - Blue gradient CTA button: `Explore Stick-On System ↗` / `Explore Clip-On System ↗`.
- Exported `whichOptionTitle`, `whichOptionChoices`, and types in `src/site.ts`.
- Added CSS styling in `src/styles/global.css` (~275 lines).
- Placed `<WhichOption />` directly below `<ChoiceHero />` in `src/pages/StickOnClipOn.tsx`.
- Updated section table in §2 of `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules, CSS 99.10 kB, JS 389.03 kB). Browser subagent verified at 1440x900 (desktop) and 390x844 (mobile): section is placed right below Hero, dark FAQ theme renders cleanly, tab toggling dynamically switches between Stick-On and Clip-On criteria, and CTA buttons are fully responsive.

### 2026-08-19 - Move "World's Finest Thinnest Hair Systems" below "Which Option Feels More Like You?"

- Request: in the Stick-On or Clip-On page, place the "World's Finest Thinnest Hair Systems" (`<Systems />`) section below the "Which option feels more like you?" (`<WhichOption />`) section.
- Updated `src/pages/StickOnClipOn.tsx`: moved `<Systems />` to position 3 directly below `<WhichOption />`.
- Updated section table in §2 of `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules, CSS 99.10 kB, JS 389.03 kB).







### 2026-08-18 - Two Easy Methods: image to the right of each card, and larger

- Request: in "Two Easy Methods To Get Your Hair Back" put each card's image on
  the right-hand side of the card and increase both images' size.
- The measurement made the case: at 1440x900 each card was **644x500** and the
  photograph rendered at **233x210** — about 15% of the card's area, floating in
  a large field of blue. The cap doing it was
  `max-width: clamp(230px, 23vw, 310px)` on `.twoMethods__imageInner`.
- `.twoMethods__card` went from `flex-direction: column` to a row: copy left at
  45%, photograph right at 55%, anchored to the card's bottom-right and flush to
  both edges. Card height rose from `clamp(380px, 38vw, 500px)` to
  `clamp(380px, 42vw, 560px)` so the enlarged cut-out has height to fill.
- Result at 1440x900: **331x333** and **331x378** against the old 233x210 — about
  1.4x wider, 1.6-1.8x taller, roughly 2.3x the area.
- The two files have different aspect ratios, 1088x1096 and 1088x1244, so
  clip-on lands taller than stick-on. That is correct for cut-outs of two
  different men and is deliberately not forced equal.
- **`mix-blend-mode: multiply` was kept, and its comment corrected.** The old
  comment said it "blends out white background onto card gradient". There is no
  white background: sampled on a canvas, 51% of `stick-on.png` and 57% of
  `clip-on.png` is fully transparent and both top corners are alpha 0. What the
  blend actually does is dissolve the shoulders into the card — the bottom of
  each cut-out is opaque right across its width (stick-on measures 100% opaque
  at its bottom edge and still 90% at 80% height), so without it they end in a
  hard rectangle against the blue. Anyone deleting it as redundant will get that
  rectangle back.
- Two follow-on fixes the enlargement itself created:
  - `object-position: right bottom`, not `center bottom`. `contain` letterboxes
    inside the column, so a centred position left a gap against the card's right
    edge and the cut-out read as floating rather than anchored. Now 11px from
    the card edge instead of ~30.
  - A bottom mask, `linear-gradient(to bottom, #000 78%, transparent 99%)`. At
    210px tall the opaque shoulder edge was barely on screen; at 330-380px it
    meets the card's bottom edge as a visible hard line, most obviously on
    stick-on's pale shirt. The mask fades it so the subject dissolves into the
    card instead of being sliced by it.
- Responsive: the image keeps the right-hand side at every width, as asked.
  Below 768px each card is one per row and therefore wider, so the split holds.
  Below 480px the card is ~350px and a 45/55 split would leave the copy ~155px,
  narrow enough that the badge alone would wrap to three lines — so there the
  split tips to 52/48 in the copy's favour and the badge is allowed to wrap to
  two lines rather than overflow.
- Also corrected: `TwoMethods.tsx` hardcoded `width={600} height={700}` on both
  images, matching neither file, so the aspect-ratio box the browser reserved
  before load was wrong for each. `TwoMethodCard` now carries the real `width`
  and `height` per card.
- Files changed: `src/styles/global.css` (the `.twoMethods` block and both media
  queries), `src/components/TwoMethods.tsx`, `src/site.ts`.
- Verification: `npm.cmd run build` passed (CSS 99.26 kB). Measured at 1440x900,
  768x1024, 390x844 and under reduced motion: in every case the image's left
  edge is at or past the copy column's right edge, `flex-direction` is `row`,
  and page overflow is 0. The existing scroll-scale still runs — the inner
  transform moves `0.75 -> 0.946` as the section enters — and stays pinned at
  `1` under `prefers-reduced-motion`. Zero console errors in every mode.
- Not committed; belongs to the eventual version 2.

### 2026-08-20 - Replace Two Methods Stick-On card image

- Request: replace the image in the "Stick-on Hair System" card of "Two Easy
  Methods To Get Your Hair Back" because the previous subject appeared cut off.
- Replaced `public/two-methods/stick-on.png` with the supplied
  `Images/Two Easy Methods To Get Your Hair Back/stick onn 2.png`.
- Updated the image's intrinsic dimensions in `src/site.ts` from 1088x1096 to
  the new file's verified 1216x1160 dimensions, keeping layout space accurate
  before the image loads.
- Updated stale image-dimension notes in `src/styles/global.css` for the new
  asset while keeping the existing contain/right-bottom framing and fade mask.
- Files changed: `public/two-methods/stick-on.png`, `src/site.ts`,
  `src/styles/global.css`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 99.26 kB, JS
  389.09 kB). SHA-256 for source, served public copy, and built `dist` copy is
  identical: `0CD2464F97965368B565F834FB86B0225B7584583571A814A47FDA8DB9BC2F85`.

### 2026-08-20 - Restore localhost development server

- Request: check the localhost link because it was not working.
- Cause: no Vite development server was running on port 5173; configuration
  already correctly binds all interfaces through `server.host = true`.
- Started `npm.cmd run dev` as a hidden background process. No application
  source or configuration changes were needed.
- Verification: `http://127.0.0.1:5173/#/stick-on-or-clip-on` returned HTTP 200
  with the React root document. Vite reports `http://localhost:5173/` locally
  and `http://192.168.5.155:5173/` on the LAN.

### 2026-08-20 - Keep updated Stick-On card image fully visible on right

- Request: the updated Stick-On subject looked cut off at the card's right
  edge; keep the full image positioned on the right side.
- Added a stable card modifier from each card's content id in
  `src/components/TwoMethods.tsx`.
- Added Stick-On-only framing in `src/styles/global.css`: the image remains
  right-aligned but gains a responsive 10-18px inner edge, preventing the
  source artwork's shoulder from meeting the card clip. Clip-On is unchanged.
- Files changed: `src/components/TwoMethods.tsx`, `src/styles/global.css`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 99.41 kB, JS
  389.11 kB). Headless Chrome at 1440x900 measured the Stick-On image's right
  edge at 675.5px inside the card's 704px right edge, leaving 28.5px visible
  breathing room during the scroll animation; visual screenshot confirmed the
  complete right shoulder remains inside the rounded card.

### 2026-08-20 - Replace Stick-On card artwork with stick onn 3

- Request: replace the current image in the "Stick-on Hair System" card with
  `Images/Two Easy Methods To Get Your Hair Back/stick onn 3.png`.
- Replaced `public/two-methods/stick-on.png`; the served path stays stable so no
  component markup changed.
- Updated intrinsic width in `src/site.ts` from 1216 to the new file's verified
  1388 pixels (height remains 1160), preserving correct pre-load layout space.
  Updated the matching dimension note in `src/styles/global.css`.
- Kept the existing Stick-On-only right framing because the new transparent
  cut-out also reaches its shoulder edges; Clip-On remains unchanged.
- UI/UX Pro Max's searchable guidance could not run because neither `python`
  nor `py` is installed. Applied its built-in performance/CLS and responsive
  framing rules instead.
- Files changed: `public/two-methods/stick-on.png`, `src/site.ts`,
  `src/styles/global.css`, `PROJECT-CONTEXT.md`.
- Verification: source and public file SHA-256 match at
  `C0599DE5F4EB23BB823C88BF6794DF9EC3266DDC16E4D5DB921E853B44D7FC9C`;
  `npm.cmd run build` passed (2,015 modules; CSS 99.41 kB, JS 389.11 kB).
  Headless Chrome loaded the new asset at its natural 1388x1160 size and left
  28.7px between its rendered right edge and the card edge at 1440x900.

### 2026-08-20 - Match Stick-On and Clip-On subject heights

- Request: the new Stick-On subject looked shorter than the Clip-On subject in
  the two cards.
- Cause: `stick onn 3.png` has a much wider 1388:1160 canvas than the 1088:1244
  Clip-On asset, so equal column widths produced unequal rendered heights.
- Added a Stick-On-only `scale(1.44)` on the image itself, anchored at
  `right bottom`. This preserves the shared parent scroll-scale animation and
  right alignment while balancing the two subjects optically.
- Files changed: `src/styles/global.css`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 99.51 kB, JS
  389.11 kB). Headless Chrome at 1440x900 measured Stick-On at 377.72px tall
  and Clip-On at 377.30px tall, a 0.42px difference; both image tops align
  within 0.43px. Stick-On retains 28.66px right-edge breathing room.

### 2026-08-20 - Give both Two Methods images identical framing and animation

- Request: the enlarged Stick-On image still looked cut out; make its size and
  animation match the Clip-On card.
- Cause: the previous correction used a Stick-On-only `scale(1.44)` inside the
  shared scroll-scaled wrapper. That matched bounding-box height but zoomed the
  wide source inside a narrow 55% image column, producing a visibly cropped
  left shoulder and a different effective scale curve.
- Removed all Stick-On-only width, margin, and child-scale overrides.
- Both images now share one structural rule: fixed equal image height (400px
  desktop, 280px through 768px, 180px through 480px), automatic intrinsic
  width, and one common `motion.div` parent. The image layout column allows the
  full transparent cut-out to extend left, while the rounded card remains the
  outer clip boundary. Both files remain entirely inside their cards.
- Kept existing `useScroll` + `useSpring` animation unchanged: both cards use
  the same 0.75-to-1 scale, 35px-to-0 rise, spring values, reduced-motion
  fallback, and independent card-relative scroll timing.
- UI/UX guidance favored full-subject visibility, equal reserved dimensions,
  and no overflow. Animated Component Libraries guidance supported retaining
  the existing lightweight Motion wrapper instead of adding a second animation
  component or dependency for an effect already implemented correctly.
- Files changed: `src/styles/global.css`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 99.21 kB, JS
  389.11 kB). Headless Chrome at 1440x900 measured both images at about
  383-386px during equivalent centred-card scroll states; both were fully
  inside their card boundaries. Visual checks at 1440x900 and 390x844 confirmed
  the Stick-On subject is fully visible, both subjects share the same size, and
  phone copy remains readable without image overlap.

### 2026-08-20 - Increase both Two Methods images by 10 percent

- Request: increase both card images by exactly 10%.
- Updated the shared image heights in `src/styles/global.css`: 400px to 440px
  on desktop, 280px to 308px through 768px, and 180px to 198px through 480px.
  Both images still use the same shared scroll animation and framing rules.
- Files changed: `src/styles/global.css`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 99.21 kB, JS
  389.11 kB).

### 2026-08-20 - Synchronize Two Methods images on phones only

- Request: on the mobile version, both card images looked short and unequal;
  match their size and settings without touching desktop.
- Root cause: each stacked phone card used its own scroll trigger. In one
  viewport the first card was near scale 1 while the second remained near the
  0.75 starting scale, even though both shared the same CSS height.
- Added a section-level phone-only motion source in `TwoMethods.tsx`, selected
  through the existing `useMediaQuery('(max-width: 480px)')`. Both phone images
  now receive the exact same scale and vertical offset at every scroll frame.
  Desktop still selects each card's original independent `useScroll` spring.
- Increased phone-only card height from `clamp(300px, 78vw, 360px)` to
  `clamp(340px, 92vw, 380px)` and phone image height from 198px to
  `min(240px, 68vw)`, giving both subjects more presence without text overlap
  or horizontal clipping. No desktop CSS value changed.
- GSAP ScrollTrigger guidance influenced the breakpoint-specific shared trigger
  and transform-only animation. The project does not depend on GSAP, so the
  existing declared `motion/react` stack implements that pattern without adding
  a second animation runtime.
- Files changed: `src/components/TwoMethods.tsx`, `src/styles/global.css`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 99.22 kB, JS
  389.45 kB). At 390x844, both card image wrappers reported the identical
  transform matrix and identical 229.35px rendered height in the same frame;
  both stayed horizontally inside their cards. Full-section visual capture
  confirmed readable copy and balanced subjects. At 1440x900, card height
  remained 560px, image base height remained 440px, and original per-card
  desktop motion remained selected.

### 2026-08-20 - Make Comparison section phone-friendly only

- Request: fix the mobile "Clip-On Vs. Stick-On Hair Systems" section without
  touching desktop.
- Root cause: the phone table retained a 600px minimum width inside a 350px
  scroller. Only Feature and Stick-On were visible initially; Clip-On sat 252px
  off-screen, with no obvious affordance that the table could be swiped.
- Added `data-label` attributes to the existing cells and mobile-only CSS at
  `max-width: 640px`. Each feature now renders as a compact card: a dark feature
  header over side-by-side Stick-On and Clip-On values. Native table semantics
  and the visually hidden column headers remain available to assistive
  technology.
- Removed phone horizontal scrolling and the 600px minimum width only inside
  that breakpoint. Added safe wrapping for long values such as "Needs
  professional" and "Easy to wear yourself".
- Desktop selectors and values were not changed. At 1440x900 the element still
  computes as a 918px native table with native table rows and the original
  three-column artwork.
- Files changed: `src/components/Comparison.tsx`, `src/styles/global.css`,
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 100.61 kB, JS
  389.52 kB). Headless Chrome at 390x844 measured five 350px-wide grid cards,
  `scrollWidth === clientWidth === 350`, and zero page overflow. Visual checks
  at 390x844 and 1440x900 confirmed phone readability and unchanged desktop
  presentation.

### 2026-08-20 - Match attached compact mobile Comparison table

- Request: replace the phone feature-card treatment with the attached compact
  three-column table, without a slider and without touching desktop.
- Reworked only the existing `max-width: 640px` CSS. Mobile now restores the
  native table/header/row display, uses fixed column widths of 29% / 35.5% /
  35.5%, compact type and padding, a dark header, light grid lines, and one
  rounded white table card matching the supplied reference.
- Mobile `min-width` remains zero and the scroller is hidden rather than
  scrollable, so all three columns always fit the phone viewport. Long values
  wrap inside their own cells.
- Desktop selectors and values were not changed. `data-label` attributes remain
  harmless metadata but no pseudo-label is rendered in the compact table.
- Files changed: `src/components/Comparison.tsx` (documentation only),
  `src/styles/global.css`, `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,015 modules; CSS 100.66 kB, JS
  389.52 kB). At 390x844 the table, client area, and scroll area all measured
  348px; header columns measured 101/124/124px, page overflow was zero, and the
  visual capture closely matched the supplied artwork. At 1440x900 the table
  remained 918px with its original 275/321/321px columns and native desktop
  row layout.

### 2026-08-20 - Start Hair Patch vs Hair System page with hero

- Request: start the "Hair Patch vs Hair System" page, match the supplied hero
  reference to the existing Stick-On / Clip-On page language, and use
  `Images/Patchvsystem.png` as the video thumbnail.
- Added the hash route `#/hair-patch-vs-hair-system`, its isolated page shell,
  and a responsive centered hero with the "Myth Busted" badge, reference copy,
  one H1, supplied 2240x1260 thumbnail, rounded media frame, and centered play
  mark.
- Reused the existing `motion/react` scroll/spring pattern from `ChoiceHero`:
  the desktop media scales from 0.88 to 1.02 and its radius settles from 30px
  to 16px. Phones use a stable full-width frame. Reduced-motion renders the
  settled layout immediately. GSAP guidance informed the scroll-linked,
  transform-only treatment, but no GSAP dependency was added because Motion is
  already the project's animation runtime.
- No video source was supplied. Following the established `Decide` behavior,
  the play mark is decorative inside a semantic figure rather than a dead
  button. The component is ready for a real video control when a source exists.
- Files/assets changed: `src/App.tsx`, `src/pages/HairPatchVsSystem.tsx`,
  `src/components/PatchSystemHero.tsx`, `src/site.ts`,
  `src/styles/global.css`, `public/patch-vs-system/thumbnail.png`, `README.md`,
  and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,017 modules; CSS 103.25 kB, JS
  391.44 kB). Headless Chrome at 1440x1000 and 390x844 confirmed one H1, the
  2240x1260 asset, 16:9 media, centered play mark, zero horizontal overflow,
  and readable mobile wrapping. Reduced-motion computed opacity 1 and no
  transform.

### 2026-08-20 - Replace Myth Busted badge icon with supplied Burst asset

- Request: replace the current icon in the Hair Patch vs Hair System hero's
  "Myth Busted" eyebrow with
  `Icons/Burst--Streamline-Font-Awesome.svg`, using the brand primary color.
- Removed the Lucide `Sparkles` import and rendered the supplied Burst SVG as a
  16x16 CSS mask. `background: var(--accent-b)` applies the exact primary blue
  `#1769ff` without modifying the source SVG.
- Copied the unchanged source asset to `public/icons/burst.svg`; SHA-256 hashes
  of source and public copies match.
- Files/assets changed: `src/components/PatchSystemHero.tsx`,
  `src/styles/global.css`, `public/icons/burst.svg`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,017 modules; CSS 103.46 kB, JS
  391.46 kB). Headless Chrome at 390x844 measured a 16x16 icon, loaded the
  public mask, computed its color as `rgb(23, 105, 255)`, and found zero page
  overflow.

### 2026-08-20 - Build Hair Patch vs Hair System comparison section

- Request: build page 3's second section from the attached comparison artwork,
  using the visual language of page 2's Clip-On vs Stick-On comparison.
- Added `PatchSystemComparison.tsx` directly below the hero. It renders a
  semantic three-column table with eight supplied rows: Sizing, Hairline, Look
  & Feel, Lifestyle Fit, Comfort, Styles, Design Process, and Realism.
- Reused the existing `.compare` table system so desktop matches page 2's
  centered 920px card, dark header, white rows, dividers, type, spacing, and
  shadow. Page-specific row height follows the taller attached reference.
- Mobile keeps the established compact three-column layout with no slider or
  horizontal scroll. UI/UX guidance favored semantic table markup, legible
  wrapping, and complete content visibility. Its optional local search script
  could not run because no Python executable is installed, so the skill's
  built-in responsive/accessibility rules were used.
- Files changed: `src/components/PatchSystemComparison.tsx`,
  `src/pages/HairPatchVsSystem.tsx`, `src/site.ts`, `src/styles/global.css`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,018 modules; CSS 103.65 kB, JS
  393.22 kB). Headless Chrome measured the desktop card/table at 920/918px with
  275/321/321px columns and the mobile card/table at 350/348px with
  101/124/124px columns. Both render all eight rows with zero horizontal page
  overflow. Visual checks at 1440x1000 and 390x844 matched the attached layout.

### 2026-08-20 - Reuse homepage 21-Point Checklist on page 3

- Request: add "Our 21-Point Checklist for a Perfect Hair System" after the
  comparison section, exactly like the homepage.
- Imported and rendered the existing shared `Checklist` component as section 3
  in `HairPatchVsSystem.tsx`. No checklist content, CSS, scroll behavior,
  responsive behavior, media fallback, or homepage placement changed.
- Reuse keeps the same dark pinned stage, 21 scrubbed focus rows, odometer,
  progress rail, supplied poster, and reduced-motion static-list fallback.
- Files changed: `src/pages/HairPatchVsSystem.tsx`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,018 modules; CSS 103.65 kB, JS
  393.23 kB). Headless Chrome confirmed section order Hero, Comparison,
  Checklist; all 21 rows, the shared poster, `01 / 21` initial tally, and zero
  horizontal overflow at 1440x900 and 390x844. Desktop and phone captures match
  the homepage Checklist. Reduced-motion rendered `checklist--still` with all
  21 rows in normal document flow.

### 2026-08-20 - Build Simplest Way analogy in Backed visual style

- Request: build the supplied "The Simplest Way to Understand It:" section and
  restyle it like the homepage "Backed By Thousands Of Confident Men"
  reference.
- Added `SimplestWay.tsx` after the shared Checklist on page 3. It preserves the
  supplied clothing analogy, muted/bright closing statement, "Still confused?"
  badge, and one "Talk To An Expert" CTA.
- Matched Backed's contained 1012px dark gradient panel, broad diagonal sheen,
  900px inner cap, two translucent glass cards, rounded corners, spotlight
  hover, white ground, and soft panel shadow. Shirt and suit icons distinguish
  ready-made from tailored; decorative icons are hidden from the accessibility
  tree.
- The CTA is a real `tel:9222666111` link, not a dead control. It is at least
  48px high and has hover/press/focus feedback.
- Motion uses the project's existing `motion/react` runtime: transform/opacity
  entrance, 80ms card stagger, and subtle hover lift. GSAP guidance informed
  transform-only motion and reduced-motion behavior; no second animation
  runtime was added. Animated Component Libraries guidance influenced the
  reusable spotlight-card pattern and progressive enhancement.
- Mobile stacks both cards and expands the CTA to full width. Reduced-motion
  renders every element settled immediately.
- Files changed: `src/components/SimplestWay.tsx`,
  `src/pages/HairPatchVsSystem.tsx`, `src/site.ts`, `src/styles/global.css`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,019 modules; CSS 107.75 kB, JS
  396.67 kB). Headless Chrome found zero overflow at 1440x900, 390x844,
  375x812, and 844x390. Desktop panel measured 1012x509px with equal 433x124px
  cards; mobile panel measured 350x599px with equal 314x112px cards and a
  314x50px CTA. Section order is Hero, Comparison, Checklist, Simplest Way.
  Reduced-motion computed no transforms on panel or cards.

### 2026-08-20 - Replace Hair System scissors with suit icon

- Request: remove the scissors icon from the Hair System analogy card and use
  a suit icon.
- Removed the Lucide `Scissors` import and added a compact inline suit-jacket
  SVG with lapels and tie. It inherits `currentColor`, stays inside the existing
  44x44 icon area, and remains decorative through the parent `aria-hidden`.
- Hair Patch shirt icon, card layout, motion, copy, and all spacing remain
  unchanged.
- Files changed: `src/components/SimplestWay.tsx` and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,019 modules; CSS 107.75 kB, JS
  396.65 kB). Headless Chrome confirmed the Hair System SVG is 44x44 with
  three suit paths, no scissors content remains, and page overflow is zero.
  Visual capture confirmed the filled jacket-and-tie mark reads clearly beside
  the outline shirt icon.

### 2026-08-20 - Use supplied Hair Patch and Hair System card icons

- Request: replace both icons in "The Simplest Way to Understand It" with the
  two exact PNG assets supplied by the user.
- Copied `Shirt--Streamline-Ionic-Filled 1.png` unchanged to
  `public/patch-vs-system/shirt-icon.png` for the Hair Patch card and copied
  `Frame 2085665247.png` unchanged to
  `public/patch-vs-system/suit-icon.png` for the Hair System card.
- Added each icon path to `simplestWayItems`, replaced the Lucide shirt and
  inline suit SVG branches with one data-driven decorative `<img>`, and kept
  both icons at the existing 44x44 rendered size inside the existing icon
  tiles. Card copy, layout, pointer spotlight, entrance motion, responsive
  behavior, and CTA are unchanged.
- Files/assets changed: `src/components/SimplestWay.tsx`, `src/site.ts`,
  `src/styles/global.css`, `public/patch-vs-system/shirt-icon.png`,
  `public/patch-vs-system/suit-icon.png`, and `PROJECT-CONTEXT.md`.
- Verification: both public copies are byte-identical to the corresponding
  supplied 2040x2040 transparent PNGs (matching SHA-256 hashes). `npm.cmd run
  build` passed (2,019 modules; CSS 107.83 kB, JS 395.92 kB), and the production
  bundle contains both new public paths.

### 2026-08-20 - "Some Of Our Clients With The Most Natural Hairline" added to Page 3

- Request: add that section to the Hair Patch vs Hair System page, "just like in
  Homepage".
- Because the heading is word-for-word the homepage's, this is a **reuse, not a
  rebuild** — `ClientStories` is rendered directly, unchanged. Note the contrast
  with Page 2, where "Real Results That Showcase True Transformations" got its
  own component (`Transformations.tsx`) because its heading and content
  differed. Same six men, same quotes, same posters here.
- Reuse cost two lines because `ClientStories` takes no props, reads
  `clientStories`/`clientStoriesTitle` from `site.ts`, measures its own track
  with a `ResizeObserver`, and its CSS is scoped entirely under `.voices` with
  no parent-dependent selectors. `Checklist` was already shared between the
  homepage and this page, so cross-page reuse was established.
- **Placed between `Checklist` and `SimplestWay`**, not at the very bottom.
  `SimplestWay` is this page's closing CTA — its eyebrow is literally "Still
  confused?" — so the proof now lands immediately before the ask. That matches
  the `hero-testimonials-cta` landing pattern ("social proof before CTA") and
  matches Page 2's own order, which runs `Transformations` then `StillConfused`
  for the same reason. Page order is now: hero, comparison, 21-point checklist,
  client stories, simplest way.
- **The two CTA links inside the section are dead, and were deliberately left
  that way.** "See more client stories" points at `#results` and "Discuss with a
  consultant" at `#book`; neither anchor exists anywhere in `src/`. They were
  already inert on the homepage — this change only makes them visible on a
  second page. Confirmed with the user to leave them rather than edit a homepage
  component. Neither breaks routing: `useHashRoute` matches on a leading slash,
  so a bare `#results` can never be read as a route. Added to the outstanding
  list below.
- Two pinned sections now sit back to back on this page (`Checklist`, then
  `ClientStories`), which was the one real risk in this placement. Measured: the
  hand-off is exact — checklist 2451..8031, voices 8031..13449, simplest
  13449..14188, so gaps of 0 on both sides with no overlap.
- Files changed: `src/pages/HairPatchVsSystem.tsx` (import, render, and a doc
  comment that still said "First section of the…"), `src/components/
  ClientStories.tsx` (doc comment only — it now records that both pages share
  it), `README.md`, and a new `scripts/verify-page3-clients.mjs`.
- Verification: `npm.cmd run build` passed (CSS 107.83 kB, JS 395.93 kB). The
  new script checks all three modes. Desktop 1440x900: section order
  `patchHero > compare > checklist > voices > simplest`, pinned, six cards,
  track travels `0 -> -2259 -> -4518`, closing panel fully on screen (right edge
  1379 against a 1440 viewport). Mobile 390x844 and reduced motion at 1440: pin
  correctly dropped, rail scrolls inside itself, track transform stays 0. Page
  overflow 0 and zero console errors in every mode.
- Not committed; belongs to the eventual version 2.

### 2026-08-20 - "Book Your 1:1 Consultation" built for Page 3 (glass + word reveal)

- Request: take the attached "Book Your 1:1 Consultation Online Or In Person"
  card, make it glassmorphic, and give it the text-reveal effect from the
  Stick-On or Clip-On page.
- **The section did not exist.** Grepped every `.tsx`, `.ts`, `.css` and `.html`
  in the tree for "Only takes 1 minute", "Countries Served" and "Book Your
  Consultation Now" — no hit anywhere. The attachment was a mockup, so this was
  a new build rather than a restyle. Said so before starting.
- Confirmed with the user: it closes the **Hair Patch vs Hair System** page,
  below `SimplestWay`. Page order is now hero, comparison, 21-point checklist,
  client stories, simplest way, booking.
- **The mockup's three emoji were replaced with lucide icons** (`MapPin`,
  `Globe2`, `ShieldCheck`), confirmed with the user. Emoji render differently on
  every OS, cannot take the brand colour, and nothing else on this site uses
  them.
- **The ambient background is load-bearing, not decoration.** Glass is only
  visible when there is something behind it worth blurring, and both the mockup
  and this page sit on a flat near-white. A `backdrop-filter` over that is an
  invisible effect that still costs a blur pass every frame. So `.bookCall`
  paints its own field — a blue-violet wash plus three large blurred orbs that
  drift against the scroll — and the panel frosts that. Anyone tidying the orbs
  away will leave the cost and lose the effect; noted in `README.md` too.
- `@supports not (backdrop-filter)` raises the panel from 55% to 93% white.
  Where the blur is unavailable the honest fallback is to stop being glass, not
  to keep a translucency that costs the type its contrast floor.
- **The reveal reuses the `StillConfused` idiom, inverted.** `LitWord` in
  `BookConsultation.tsx` mirrors `IlluminatedWord`: that section is white type
  on a near-black stage and lifts from transparent white, this one is dark type
  on light glass and lifts from `rgba(12,13,16,0.18)`. Kept separate rather than
  shared — the only thing in common is the shape of the transform, and either
  way the palette would have to be passed in.
- **The scrub is entry-driven, not a pinned stage.** `StillConfused` reserves
  220vh, right for a full-viewport immersive close; this is a compact card
  directly above the footer, where two extra viewports of scroll would cost more
  than the effect is worth. `offset: ['start 88%', 'center 40%']` instead.
- **`/gsap-scrolltrigger` and `/animejs` were invoked but neither library was
  added.** Neither is in this project, and the effect asked for — "like in
  stick-on or clip-on page" — is already written in `motion/react`, which is the
  project's idiom throughout. Adding a dependency to duplicate working code was
  not worth it. Flagged to the user rather than done silently.
- **A real contrast defect was found and fixed.** White on `--grad`'s lighter
  stop (`#4686fe`) measures **3.44:1**, and this CTA label is 16px at 650
  weight, which is not large text — so it missed AA. Switched to the existing
  `--grad-ink` token (`#1769ff -> #0f55d8`): 4.67:1 and 6.34:1, clears AA across
  the whole sweep, still brand blue. See the new §7 item — the rest of the site
  still has this.
- CTA points at `tel:9222666111`, the same number `simplestWayAction` dials.
  This page has no form on it, and after the `#results`/`#book` finding above, a
  live `tel:` link was worth more than another anchor that goes nowhere.
- Files changed: new `src/components/BookConsultation.tsx`, new
  `scripts/verify-bookcall.mjs`, `src/site.ts` (`bookConsultationData` +
  `BookPoint`; `icon` is a key not a component, so `site.ts` stays import-free),
  `src/styles/global.css` (`.bookCall` block), `src/pages/HairPatchVsSystem.tsx`,
  `README.md`.
- Verification: `npm.cmd run build` passed (CSS 111.91 kB, JS 400.36 kB).
  `scripts/verify-bookcall.mjs` walks 1440x900, 768x1024, 390x844 and reduced
  motion. Word sweep staggers correctly across the eight words as the section
  enters — `0.18 x8`, then `0.91 0.52 0.18...`, then
  `1.00 1.00 1.00 0.83 0.45 0.18...`, then `...1.00 0.76 0.37`, then `1.00 x8`;
  under reduced motion all eight sit at 1.00 throughout and nothing transforms.
  `backdrop-filter: blur(22px) saturate(1.8)` applied in every mode. Contrast
  sampled from rendered pixels inside the panel (which ranges from `#cde5ff`
  under the strongest orb to `#f9f4f0` over the amber): headline and point
  titles 15.03:1 worst case, dim notes 4.76:1, eyebrow 4.91:1 — all clear AA.
  CTA 303x52, over the 44px floor. Points grid 3 columns at 1440, 2 at 768,
  1 at 390. Page overflow 0 at every width; zero console errors in all four
  modes.
- Not committed; belongs to the eventual version 2.

### 2026-08-20 - Booking section moved to the dark "Backed" treatment, orbs removed

- Request: make "Book Your 1:1 Consultation" dark like the homepage's "Backed by
  Thousands of Confident Men", and remove the colourful background circles.
- Rebuilt on `Backed`'s exact structure: a white section holding one dark panel
  (`linear-gradient(152deg, #17191d, #0c0d10, #08090b)` plus two soft white
  radial highlights), lit by a single wide blurred band through `::before`, with
  the glassmorphism moved inward to translucent white cards
  (`rgb(255 255 255 / 0.07)`, `blur(14px)`, `1px` white border at 12%).
- **The orbs came out entirely rather than being recoloured, and the section is
  better for it.** They existed only because glass needs something behind it
  worth blurring and this page's ground is a flat near-white. A near-black panel
  makes white translucency read as glass on its own, so the whole ambient-field
  apparatus became unnecessary. Confirmed 0 `.bookCall__orb` nodes in every
  mode, and the section is now shorter and cheaper — no large blurred elements
  to paint.
- The word reveal is now literally the same direction as `StillConfused`, not
  just the same idiom: both lift white type out of a faint white on near-black.
  `LitWord` runs `rgba(255,255,255,0.22)` to full white.
- **Reveal timing was retuned, and the reason is worth keeping.** The scrub uses
  `offset: ['start 88%', 'center 40%']`, so progress only reaches 1 once the
  panel's centre passes 40% of the viewport — slightly *past* where the panel
  sits nicely in frame. With the CTA finishing at 0.94 it was measured at 0.75
  opacity at the moment the panel was centred, which is exactly when someone is
  looking at it. Points now finish at 0.68 and the CTA at 0.8; both measure 1.00
  when the panel is in frame at 1440 and at 390.
- **Two contrast findings, both measured rather than assumed.** First attempt at
  the dark CTA set near-black type on `--grad` to exploit the brighter blue;
  that measures 4.17:1 on the `#1769ff` stop and **fails AA**, so the comment
  claiming 5.55:1 was wrong and was corrected. Neither ink clears AA across the
  full `--grad` sweep at 16px/650 — white is 3.44:1 on `#4686fe`, near-black is
  4.17:1 on `#1769ff` — so the button stayed on `--grad-ink` (`#1769ff ->
  #0f55d8`, white at 4.67:1 and 6.34:1).
- The light version's pastel tile fills went to mud on near-black, so the tiles
  became translucent white and the hue moved to the icon itself at a lightness
  that carries: `#ff9ec4`, `#8fb6ff`, `#ffc978`.
- **`npx prettier` was run once without flags and reformatted the component to
  its own defaults — semicolons and double quotes — which is not this project's
  style.** Reverted with `--no-semi --single-quote`. There is no prettier config
  in the repo, so a bare `npx prettier --write` on any file here will do the
  same thing. Worth adding a `.prettierrc` at some point, or not reaching for
  prettier at all.
- `/gsap-scrolltrigger` was invoked again; GSAP is still not in this project and
  still was not added, for the same reason as before.
- Files changed: `src/components/BookConsultation.tsx` (orb markup and motion
  values deleted, `__in` wrapper added, word colours inverted, timings retuned),
  `src/styles/global.css` (`.bookCall` block replaced wholesale),
  `scripts/verify-bookcall.mjs` (now asserts 0 orbs and reports the point cards'
  glass instead of orb bounds), `README.md`.
- Verification: `npm.cmd run build` passed (CSS 111.67 kB, JS 400.02 kB).
  Across 1440x900, 768x1024, 390x844 and reduced motion: 0 orbs, point cards
  measure `blur(14px)` over `rgba(255,255,255,0.07)` with a 12% white border,
  word sweep staggers `0.22 x8` -> `0.91 0.55 0.22...` ->
  `1.00 1.00 1.00 0.85 0.48 0.22...` -> `1.00 x8` (all 1.00 throughout under
  reduced motion), grid 3/2/1 columns, CTA 303x52, page overflow 0, zero console
  errors. Contrast sampled from rendered pixels against the lightest ground
  inside the panel (`#323335`): titles 12.65:1, card notes 6.79:1, CTA note
  5.64:1, eyebrow 9.77:1.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - "Hair System Benefits" built as an Apple-style expanding card

- Request: build the "Hair System Benefits" card and its overlay (both supplied
  as mockups) in the manner of `reference/Recording 2026-08-21 125404.mp4`.
- The reference is Apple's **"Get to know Mac"** rail. Extracted at 3fps: a row
  of tall cards, each with a `+` bottom-right; clicking one expands it in place
  into a sheet while the page behind blurs; an `x` top-right collapses it back.
  Three properties carry that effect and all three are implemented.
- Confirmed with the user before building: **one card, not a rail** (the
  reference has five, the mockup has one, and only one card's copy and
  photography exist), and the two missing photographs are to be **added by the
  client later**, with the section built around labelled empty slots.
- **The card grows into the sheet rather than being replaced by one.** Card and
  sheet share `layoutId="benefits-surface"`, so motion interpolates real
  geometry between them. A fade-in modal reads as a different object arriving;
  this reads as the same object opening, which is the entire reference.
- **The blur is on the scrim**, via `backdrop-filter`, so the page behind blurs
  without any other section needing to know this component exists. Measured
  `blur(26px) saturate(1.4)` in all four modes.
- **A real bug was found and fixed by measuring.** The scroll lock originally
  set `document.body.style.overflow = 'hidden'`, which is the usual idiom and
  did nothing here: `body` already carries `overflow: hidden auto` from the
  site's CSS, but `document.scrollingElement` on this page is `html`. The lock
  looked correct in devtools while the page scrolled freely behind the sheet.
  Now locks `document.documentElement`.
  - Worth keeping: the first test of this was also wrong. Checking the lock with
    `window.scrollBy()` reports success either way, because `overflow: hidden`
    blocks *user* scrolling and not scripted scrolling. Only a real wheel event
    (`page.mouse.wheel`) tells the truth. Measured properly: 600px of wheel
    moves the page 600px when closed and **0px** while the sheet is open.
- **The missing photographs render as labelled empty frames, not stand-ins.**
  `Photo` always renders the real `<img>` and only falls back to the frame on
  `onError`, so dropping the file in at the declared path removes the frame with
  no code change. A borrowed face from `public/hair` under a heading about this
  man's result would be a claim the brand cannot make - see the candour rule in
  section 3. `public/hair-benefits/README.md` names all three files, their sizes,
  and which one has to be a transparent cut-out.
- The dashed hairline ring and the arrow are drawn, not shipped as artwork - the
  ring in CSS, the arrow as a small inline SVG, both positioned in percentages
  tied to `.benefits__cardPhoto`. One SVG scaled to a card whose aspect ratio
  changes three times across the breakpoints would not stay on the hairline.
- Placed **between `PatchSystemComparison` and `Checklist`**: the page draws the
  distinction, then shows what choosing the system actually buys, then how it is
  built, then who it worked for, then asks.
- `/gsap-scrolltrigger` and `/animejs` were invoked again. Neither library is in
  this project and neither was added - `motion`'s `layoutId` is the shared-element
  morph this reference needs, and it was already a dependency.
- Files changed: new `src/components/HairBenefits.tsx`, new
  `scripts/verify-benefits.mjs`, new `public/hair-benefits/README.md`,
  `src/site.ts` (`hairBenefitsData`), `src/styles/global.css` (`.benefits`
  block), `src/pages/HairPatchVsSystem.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 118.49 kB, JS 406.82 kB). At
  1440x900, 768x1024, 390x844 and reduced motion: card opens, sheet reports
  `role="dialog"`, `aria-modal="true"` and a resolving `aria-labelledby`; focus
  moves to the close button on open and back to the card on close;
  `aria-expanded` tracks; Escape and a scrim click both close and both restore
  the inline overflow to empty; four benefit points render; CTA is
  `tel:9222666111`; `+` and close are both 44x44; page overflow 0 and zero
  console errors in every mode. Sheet is two columns at 1440 and one from 900
  down, with the photograph ordered first on a phone.
- Outstanding: the three photographs. Until they arrive the card and sheet show
  dashed labelled frames.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - Both "Hair System Benefits" photographs installed

- Request: put `Images/Hair System Benefits.png` in the card and
  `Images/Hair System Benefits overlay.png` in the overlay.
- **The card image arrived with its annotation already baked in** - the dashed
  hairline ellipse, the curved arrow and the circular scalp inset with its white
  ring are all part of the picture. The component had been drawing all three
  itself (a CSS ring, an inline SVG arrow, a separate masked inset element),
  because the photograph did not exist when the section was built. Those were
  deleted rather than kept: leaving them would have drawn a second ellipse over
  the first. Recorded in `public/hair-benefits/README.md` so that a future plain
  portrait brings the marks back with it.
- **The card file's left third is transparent by design**, which is where the
  headline sits. That is why the CSS lets the picture bleed edge to edge instead
  of reserving a column for the copy. The file is 1600x832 and the card's
  `aspect-ratio` was changed from `16 / 8.2` to `1600 / 832` to match it, so a
  full-bleed `cover` crops nothing.
- Both were resized on install: 2240x1166 (2.20 MB) to 1600x832 (1.19 MB), and
  1962x1944 (1.96 MB) to 1100x1090 (0.82 MB). Alpha preserved on both - they are
  cut-outs, so PNG rather than JPEG. 4.2 MB supplied, 2.0 MB shipped.
- **Three sizing problems, all found by looking at renders rather than assuming.**
  - The sheet's right column: the overlay file is near square and the column is
    tall and narrow, so `contain` bottom-anchored left 246px of dead grey above
    his head, and `cover` cropped the side of his head off. Top-anchored
    `contain` plus a bottom mask fade is the one that costs nothing, and the
    fade also hides the file's own hard bottom edge through his shirt.
  - The mobile card kept a `max-width: 88%; height: 62%` override written for
    the old centred-cut-out layout, which fought the full-bleed cover and left
    the photograph as a band with dead blue beneath it.
  - Replacing that with `inset: 34% 0 0; height: auto` did not fix it either.
    On a replaced element `height: auto` means the intrinsic height, not
    "stretch between top and bottom", so it still rendered a 182px band. It
    needs an explicit `height: 66%`.
- Mobile framing: the photograph now occupies the lower two thirds so the
  headline has clear blue above it, and `object-position` slides to `88%`
  because centring the crop on a file whose left third is empty frames nothing
  and clips the scalp inset off the right edge.
- The card gradient's end stop was lightened from `#0f4fcc` to `#1a60e6`; the
  darker one read as a navy corner behind the subject's shoulder rather than as
  one blue card.
- Files changed: `src/site.ts` (media block rewritten - `inset` slot removed,
  real dimensions in), `src/components/HairBenefits.tsx` (`CardMarks` deleted,
  inset element deleted), `src/styles/global.css` (ring, arrow and inset rules
  deleted; card photo full bleed; sheet art and mobile framing retuned),
  `public/hair-benefits/README.md` rewritten, `README.md`.
- Verification: `npm run build` passes (CSS 117.76 kB, JS 406.19 kB).
  `scripts/verify-benefits.mjs` across 1440x900, 768x1024, 390x844 and reduced
  motion: **empty photo slots 0** in every mode, so both files resolve; dialog
  contract, focus return, Escape and scrim close all still hold; page overflow 0
  and zero console errors throughout.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - Benefits card and overlay cut to one screen; the morph removed

- Request, three parts: the card is too tall to fit a screen, the overlay is too
  long to fit a screen, and "I want a separate overlay on this section when
  clicking on card" rather than the card turning into the overlay.
- **The morph is gone.** Card and sheet shared a `layoutId`, so motion
  interpolated real geometry between them and the card read as *becoming* the
  sheet - the shared-element move from the Apple reference. The card was also
  `visibility: hidden` while the sheet was up, which left a hole behind the blur
  where the card had been; that is very likely what made the two read as one
  object. Both `layoutId`s and the visibility toggle are removed. The card now
  stays put and visible behind the blur, and the sheet has its own
  scale-and-fade entrance. Verified `card behind: true` in every mode.
  - The inner content cross-fade went too. It existed only to hide the morph;
    without a morph it was a second delay in front of the content the reader
    asked for.
  - How to restore the Apple behaviour is recorded in the component doc comment
    and in `README.md` - it is those two `layoutId`s and hiding the card again.
- **Card capped.** Its `aspect-ratio` alone made it 686px tall at 1440 and the
  section 859px, against a 900px viewport with a nav above it.
  `max-height: min(520px, 56vh)` plus reduced section padding brings the section
  to 616px. `object-position` moved from `center bottom` to `center top`,
  because once the cap crops 182px, anchoring to the bottom took the crop off
  the *top* of the frame - which is where the dashed hairline, the arrow and the
  scalp inset are, the entire point of that photograph. Cropping his chest costs
  nothing.
- **Sheet cut to one screen.** `max-height: min(880px, 92vh)`, with the copy
  column's padding, list gaps, item padding and callout padding all retuned to
  land under it. Measured before and after at 1440x900: 964px of content in an
  831px sheet, now 789/789.
- **The laptop fix is height-keyed, not width-keyed.** At 1280x720 the sheet was
  still 82px over. A `@media (min-width: 901px) and (max-height: 820px)` block
  tightens the vertical rhythm once more; doing it by width would have shrunk
  the layout on a tall monitor for no reason. Type sizes are untouched there -
  only the space between things moves.
- **A regression caught by measuring, not by looking.** The first pass at
  compressing the sheet took two rules to `clamp(0.83rem, ...)`, which renders
  13.28px - five elements under the 14px body-text floor this site has held
  since the mobile pass. Restored to `clamp(0.875rem, 0.95vw, 0.925rem)`, a
  14px floor exactly, and re-measured: min font 14.00px everywhere.
- `.benefits__sheetTitle span` gained `white-space: nowrap` so the line breaks
  before "Hair System" rather than through it; the tighter title was splitting
  the blue phrase across two lines.
- **Also found and fixed: the dev server had been serving stale CSS.** Two
  rounds of measurements reported `max-height: none` and the old padding while
  the source file plainly had the new values - the vite watcher had stopped
  picking up `global.css`. Restarted it. Worth knowing, because it briefly
  looked like a CSS specificity bug that did not exist.
- **On a phone the sheet still scrolls, by about 180px, and that is deliberate.**
  Closing it would mean dropping content or taking body copy under 14px. Fits at
  1920x1080, 1440x900, 1366x768, 1280x720 and 768x1024; scrolls at 390x844.
- Files changed: `src/components/HairBenefits.tsx`, `src/styles/global.css`,
  `README.md`.
- Verification: `npm run build` passes (JS 405.99 kB). `scripts/verify-benefits.mjs`
  across all four modes: dialog contract, focus move and return, Escape and
  scrim close, scroll lock, `empty photo slots 0`, page overflow 0, zero console
  errors. Fit measured separately across six viewports.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - Benefits card lengthened; the crop line moved onto the ratio

- Request: the client's face is cut off in the card - make the card longer, down
  to about his neck.
- **The cause was using `max-height` to frame a `cover` image.** `object-fit:
  cover` scales the photograph to the card's *width*, so a fixed pixel cap shows
  a different amount of the subject at every viewport. `min(520px, 56vh)` was
  cutting him at the chin on a 1920 screen while clearing his collar on a 1366 -
  the same CSS, two different crops. The screenshot in the request was a wide
  screen, which is why it looked worse there.
- Fixed by moving the crop line onto the aspect ratio: `aspect-ratio: 1600 / 790`
  keeps rows 0-790 of the 832-tall file, ending just below the collar, and holds
  that line at any width. Measured 95.0% of the photograph shown at 1920, 1600,
  1440, 1366 and 1280 alike, against the previous mix of 85% and 94.5%.
- **The guard needed loosening too, and this is the part worth remembering.**
  With the ratio set, `max-height: 72vh` was still low enough to clamp on 1920,
  1366 and 1280 - so the guard was doing the framing and the inconsistent crop
  survived the fix. Raised to 82vh, where the ratio wins on every normal screen
  and the guard only bites below roughly 640px of viewport height. Anyone
  tightening it again should re-check the percentage of the photo shown, not
  just the card's height.
- Card heights now: 868px at 1920x1080, 724 at 1600x900, 651 at 1440x900, 618 at
  1366x768, 579 at 1280x720. Every section still fits its viewport - the tallest
  case is 980px of section in a 1080px screen.
- Files changed: `src/styles/global.css` (the `.benefits__card` ratio and
  guard), `README.md`.
- Verification: `npm run build` passes. `scripts/verify-benefits.mjs` across all
  four modes is unchanged - dialog contract, focus move and return, Escape and
  scrim close, `empty photo slots 0`, page overflow 0, zero console errors. Fit
  and crop percentage measured separately across five widths.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - New section: "Why Hair Patches Often Fail The Confidence Test"

- Request: build the attached section, research a reference for it first, and
  make sure it merges with the sections around it.
- Research settled the placement rather than the styling. The landing patterns
  `hero-testimonials-cta` and `funnel-3-step` both order problem before
  solution, and this page already had the solution - `HairBenefits`. So the new
  section sits directly before it. Page order is now hero, comparison table,
  why patches fail, benefits, 21-point checklist, client stories, simplest way,
  booking.
- **Merging meant reusing the site's own construction, not copying the mockup
  literally.** The supplied design puts a photographic sky behind the closing
  panel; this uses the gradient-plus-two-soft-white-radials recipe that
  `.backed__panel` and `.simplest__panel` already use, which reads as the same
  family as every other panel on the page and needs no new asset. Entrance is
  `useReveal`, the idiom every section here uses. Emphasis is marked with `**`
  in `site.ts`, the convention `choiceHeroLede` established.
- **The orange breaks the one-blue rule, deliberately and with precedent.**
  `tokens.css` states the page "carries no colour of its own, so the single blue
  gradient does all the pointing". `.faq__stars` and `.backed__stars` already
  break it for amber, on the grounds that a rating that is not gold reads as
  decoration; a warning in the brand blue fails the same way. Colour is never
  the only signal here - the heading, the label and the exclamation each say it
  independently, which is what the `color-only` guideline asks for.
- **Two contrast findings, both from measuring rather than assuming.**
  - The comment first written for the warning mark claimed `#ea580c` measures
    4.21:1 on white. It measures **3.56:1**. Still past the 3:1 a meaningful
    graphic owes, but the comment was wrong and is corrected, with a note to
    darken rather than lighten if the orange is ever retuned.
  - The closing panel first used the same `#4a86fe` start as the other card
    gradients on this page. White on that measures **3.42:1**, so the small note
    under the lead - 15px, normal weight, not large text - **missed AA**. The
    gradient was deepened to `#1f6bfb -> #1a63f2 -> #1457dc`, where white
    measures 4.61, 5.11 and 6.13 across the sweep.
- The warning diamond is drawn rather than taken from lucide, whose alert icons
  are triangles and octagons - close is worse than correct at that size. The
  exclamation is two shapes in the same viewBox rather than a counter-rotated
  child, so it cannot drift as the diamond scales.
- `/animejs` was invoked; anime.js is still not a dependency and still was not
  added. `useReveal` already does this entrance and is reduced-motion aware.
- Files changed: new `src/components/PatchFail.tsx`, new
  `scripts/verify-patchfail.mjs`, `src/site.ts` (`patchFailData`),
  `src/styles/global.css` (`.patchFail` block),
  `src/pages/HairPatchVsSystem.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 120.77 kB, JS 408.02 kB).
  `scripts/verify-patchfail.mjs` across 1440x900, 768x1024, 390x844 and reduced
  motion: section order correct, reveal fires `false -> true` and starts `true`
  under reduced motion, both emphasis spans resolve, CTA 48px tall pointing at
  `tel:9222666111`, min font 14.00px, section fits its viewport in every case,
  page overflow 0, zero console errors.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - Page 3 section order changed; PatchFail moved late

- Request: a specific section sequence for the Hair Patch vs Hair System page.
- Only one section actually moved. `PatchFail` went from third to
  second-to-last, between `SimplestWay` and `BookConsultation`; everything else
  was already in the requested order. Final order:
  hero, comparison, hair system benefits, 21-point checklist, client stories,
  simplest way, why patches fail, booking, footer.
- **This inverts the reasoning the section was built on, and the docs were
  corrected rather than left standing.** `PatchFail` was placed directly before
  `HairBenefits` because problem-then-solution is what the page's own argument
  wants and what the `hero-testimonials-cta` and `funnel-3-step` landing
  patterns order. Late instead, it reads as a closing argument before the ask -
  the reader meets the case against patches after already seeing what a system
  does, so it reinforces rather than sets up. That is a legitimate shape; it is
  simply a different one, and three doc comments claimed the old adjacency.
  Updated: the page shell, the component, and `README.md`, each now recording
  where it was designed to sit and that moving it back is one line.
- Nothing else changed - no CSS, no content, no component internals.
- Verification: `npm run build` passes. `scripts/verify-patchfail.mjs` across
  1440x900, 768x1024, 390x844 and reduced motion confirms the new DOM order
  `patchHero > compare > benefits > checklist > voices > simplest > patchFail >
  bookCall`, the reveal still firing `false -> true` (and starting `true` under
  reduced motion), section fitting its viewport, page overflow 0 and zero
  console errors. `scripts/verify-benefits.mjs` re-run to confirm the benefits
  card and its overlay were undisturbed by the move - all twelve checks pass.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - PatchFail put on the comparison section's grey ground

- Request: give "Why Hair Patches Often Fail The Confidence Test" the same
  background colour as "Hair Patch vs. Hair System".
- `.compare` uses `background: #f4f5f8`; `.patchFail` was on `var(--page)`
  (white) and now matches. The two argument sections on the page share a ground,
  and because `SimplestWay` and `BookConsultation` on either side of it are both
  white, the grey now reads as a distinct band rather than as a wash.
- **Re-measured on the darker ground before shipping it**, since every contrast
  figure in that section had been calculated against white: title 19.43 to
  17.82:1, body copy 6.15 to 5.64:1, warning mark 3.56 to 3.27:1. All still
  clear their thresholds, but the mark now has the least head room of anything
  on the page against the 3:1 a meaningful graphic owes. Both the CSS comment
  and `README.md` quoted the old white-ground figure for it; both corrected, and
  both now say to darken rather than lighten if that orange is retuned.
- Nothing else changed - no layout, no content, no component.
- Verification: `npm run build` passes. `scripts/verify-patchfail.mjs` across
  1440x900, 768x1024, 390x844 and reduced motion: section fits its viewport in
  every case, min font 14.00px, page overflow 0, zero console errors.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - Benefits card headline and overlay photograph fixed on mobile

- Request: the card headline is far too large on a phone, and the overlay's
  photograph is cut off. Desktop must not change.
- **The headline was an inline style, not a CSS bug.**
  `src/components/HairBenefits.tsx` carried `style={{ fontSize: '4rem' }}` on
  `.benefits__cardTitle`. It was not written here - it appeared on disk between
  sessions, so Codex or a manual edit. An inline declaration beats every media
  query, which is exactly why the headline could not be sized down on a phone:
  it rendered 64px at 390px wide as well as at 1440, three lines 234px tall,
  straight over the subject's face.
  - Diagnosing it took a detour worth recording. The computed size was 64px
    while the only matching CSS rule was `clamp(1.15rem, 2.5vw, 2.2rem)`, which
    resolves to 18.4px at that width - and the element's `line-height` *was*
    coming from that rule. CDP's matched-rules list showed nothing else, and
    both the dev server and the built bundle were serving the correct clamp, so
    stale CSS was ruled out. Reading `element.style.fontSize` directly is what
    found it.
- **Desktop was measured before and after and is unchanged.** 4rem is correct
  there - the title is 486x234 inside a 486-wide copy column, no overflow - so
  it was kept exactly, just moved from the inline attribute into
  `.benefits__cardTitle` where a breakpoint can reach it. Verified identical at
  1440x900 and 1280x720: font 64px, title 486x234, copy column 486x284/280.
  Below 901px it becomes `clamp(1.3rem, 5.2vw, 1.85rem)` - 20.8px at 390.
- **The overlay photograph was being cropped, not fitted.** In one column the
  image resolved to 366x363 inside a 170px-tall box: `contain` was sizing it to
  the box's *width*, and `overflow: hidden` cut 193px - everything below his
  sunglasses. Fixed with `height: 100%` so `contain` sizes to the box's height
  instead, plus a taller box (`clamp(232px, 60vw, 290px)`, up from
  `clamp(170px, 34vw, 262px)`), because a box that cannot hold a head will crop
  one however the image is fitted. Measured clipped = 0px at 390, 360 and 768.
- Both changes live inside existing `max-width` blocks, so desktop is untouched
  by construction as well as by measurement.
- Files changed: `src/components/HairBenefits.tsx` (inline style removed),
  `src/styles/global.css`, `README.md`.
- Verification: `npm run build` passes. Measured at 1440x900, 1280x720,
  768x1024, 390x844 and 360x780. `scripts/verify-benefits.mjs` across its four
  modes: all twelve checks pass - dialog contract, focus, Escape, scroll lock,
  photo slots, page overflow 0, zero console errors.
- Not committed; belongs to the eventual version 2.

### 2026-08-21 - PatchFail mobile: CTA centred, and a run-on headline found

- Request: centre the "Talk To An Expert" label and its icon on mobile. Desktop
  untouched.
- The mobile CTA was `width: 100%` with `justify-content: space-between`, which
  parked the label hard left and the icon hard right - two controls rather than
  one button. Now `justify-content: center` with symmetric `padding-inline: 16px`;
  the old 22px/8px split only made sense while the icon was anchored to an edge.
  Measured gaps: 74/74 at 390, 59/59 at 360. Desktop unchanged at `normal`,
  193x48, 22/8.
- **A second bug was visible in the same screenshot and is now fixed.** The
  heading read "Why Hair Patches Often Fail**The** Confidence Test". Below 620px
  `.patchFail__title span` goes `display: inline` so the two supplied lines
  reflow as one paragraph, but they are separate elements with no whitespace
  between them, so inline ran them together. Introduced when the section was
  built; not reported, but it is the same heading in the same picture.
- **Fixed in the markup rather than in CSS, and the first attempt was wrong.**
  A `span + span::before { content: ' ' }` fixes the look and nothing else -
  generated content never reaches `textContent`, which is what a screen reader
  reads, so the headline would still have been announced "Often FailThe". The
  space is now a real text node in `PatchFail.tsx`. Verified: `textContent`
  reads "Why Hair Patches Often Fail The Confidence Test". On desktop the spans
  are blocks, so the trailing space collapses and nothing changes.
- Both changes are inside the existing `max-width: 620px` block or in markup
  that is inert at desktop widths, so desktop is untouched by construction and
  by measurement.
- Files changed: `src/components/PatchFail.tsx`, `src/styles/global.css`,
  `README.md`.
- Verification: `npm run build` passes. Measured at 1440x900, 768x1024, 390x844
  and 360x780. `scripts/verify-patchfail.mjs` across its four modes: section
  fits its viewport, CTA 48px tall on `tel:9222666111`, min font 14.00px, page
  overflow 0, zero console errors.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - New page 4 "Will My Hairline Look Real?" - hero built

- Request: start the new page, build its hero like the earlier guide hero, using
  the supplied thumbnail and the Streamline hair/skin icon for the eyebrow badge.
- **The hero was extracted rather than duplicated.** The design is the same shape
  as the Hair Patch vs Hair System hero - eyebrow badge, headline, lede, one wide
  rounded still with a play mark - and that markup carried 188 lines of CSS.
  Copying it would have meant every later fix had to be made twice. New shared
  `src/components/GuideHero.tsx` takes props; `PatchSystemHero` and the new
  `HairlineRealHero` are now thin wrappers that bind page content to it. The CSS
  block was renamed `.patchHero` -> `.guideHero` (24 occurrences) for the same
  reason - it serves two pages now and the old name was misleading.
- **The eyebrow mark needed no asset editing.** The badge icon is applied as a
  CSS mask, so only the SVG's shape is used and the black `fill` it ships with is
  discarded; the brand blue is painted through it. The mask URL became a
  `--guideHero-icon` custom property set per page, with `burst.svg` kept as the
  fallback so a page that forgets still renders a mark. Verified the two pages
  resolve different masks.
- Assets installed: `Images/Frame 2085665634.png` (4480x2520, 5.35 MB) resized to
  `public/hairline-real/thumbnail.png` at 2240x1260, 2.71 MB - matching the
  dimensions Page 3's hero still already uses. `Icons/Hair-Skin--Streamline-Ultimate.svg`
  copied to `public/icons/hair-skin.svg` unmodified.
- Route `/will-my-hairline-look-real` added to `src/App.tsx`. The nav has linked
  to it since the site was built; until now it went nowhere.
- Page shell renders the hero only. The design supplied so far covers a
  "Hairline Insights & Benefits" popup, which will be built on the same
  card-and-overlay pattern as `HairBenefits`. The "Free eBook" section is
  excluded by request. The rest of the page's sections have not been supplied.
- **Pre-existing item, not introduced here:** the guide hero's eyebrow badge text
  renders at 12.48px, under the 14px body floor this site holds elsewhere. It
  measures the same on Page 3 and predates this work, so it was left alone rather
  than changed silently - fixing it would alter Page 3's hero.
- Files changed: new `src/components/GuideHero.tsx`, new
  `src/components/HairlineRealHero.tsx`, new
  `src/pages/WillMyHairlineLookReal.tsx`, new
  `scripts/verify-hairline-hero.mjs`, rewritten
  `src/components/PatchSystemHero.tsx`, `src/site.ts` (`hairlineRealHero*`),
  `src/styles/global.css` (rename + masked icon), `src/App.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 120.95 kB, JS 408.93 kB).
  `scripts/verify-hairline-hero.mjs` across 1440x900, 768x1024, 390x844 and
  reduced motion: hero present and labelled by its own `<h1>`, poster loads at
  2240x1260, emphasis resolves, play mark present, page overflow 0, zero console
  errors and zero failed requests. The same script re-probes the Page 3 hero to
  prove the extraction changed nothing there - h1 62.64px, `burst.svg` mask,
  `/patch-vs-system/thumbnail.png`, all as before.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4: "World's Finest Thinnest Hair Systems" reused

- Request: add the section to the new page.
- One line. `Systems` is the Stick-On or Clip-On page's own component, fully
  self-contained - no props, reads `hairSystems` and `systemsTitle` from
  `site.ts`, CSS scoped to `.systems`. Same reuse pattern as `ClientStories` and
  `Checklist` on Page 3.
- Placed straight after the hero: the hero claims the hairline is undetectable,
  and the range is the evidence - thirteen systems the claim has to hold across.
- **Checked the pin actually works on this page rather than assuming.** `Systems`
  pins and drives a rotating ring off its own scroll, and it sits directly under
  a hero that runs its own spring-scrubbed entrance, so the two could have
  fought. Measured: the ring passes through seven distinct angles across the pin
  at 1440x900, and correctly falls back to a static snap rail at 768x1024,
  390x844 and under reduced motion. Thirteen posters render in every mode. Page
  overflow 0, zero console errors throughout.
- Section heights: 1710px pinned at desktop, 612/573/752 for the rail cases.
- Files changed: `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Verification: `npm run build` passes (JS 408.94 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4: "How We Design The World's Most Natural Hairline"

- Request: build the attached section like the 21-point checklist, using
  `Images/nh.png` for the video block. Seven points of copy supplied.
- Built on `Checklist`'s mechanism, not its appearance. Shared deliberately: the
  plateaued cursor (a linear map parks the list between rows, so nothing is ever
  in focus - two thirds of the scroll between points is spent on a point), and
  `--cursor` as the only travelling value so the row pitch stays a responsive
  `clamp()` in CSS. Mirrored and lightened to the supplied design: list left on a
  pale card, film right, title centred above both.
- **No blur, unlike the checklist.** Depth-of-field works on the checklist's dark
  stage where a blurred row still reads as a row; on a pale card, blurred dark
  text reads as a rendering fault. Opacity carries the focus and the checkboxes
  carry the rest.
- Seven points rather than twenty-one, so a progress rail and no odometer - a
  two-digit reel counting to 07 is machinery for its own sake.
- **Two defects found by measuring, both fixed.**
  - The checkboxes were not accumulating. Only the focused row went blue, while
    the CSS comment claimed the list ticks off as it is read and the design shows
    every reached item checked. Added `data-reached` alongside `data-active`.
    Verified: the blue count climbs monotonically 1 through 7 across the scrub
    and never decreases.
  - **The caption rendered twice.** `Images/nh.png` has the quote, its dark scrim
    and the card's rounded corners painted into the picture, so the text overlay
    duplicated it - and only one caption element existed in the DOM, which is
    what made it confusing until the source image was opened and looked at. The
    still is now cropped above that band (`crop=2176:1090:0:0`, 1500x752, 1.02 MB
    from 2176x1632, 2.64 MB) and the quote is set as real text: selectable,
    scales with the reader's type size, reaches a screen reader, and rewordable
    without re-exporting an image. Recorded in `site.ts` next to the poster path
    so a future re-crop does not reintroduce it.
- Contrast measured on the card's pale ground: row titles 17.66:1, notes 5.59:1,
  white check on brand blue 4.67:1. Min font 14.00px in every mode.
- Film block is a `<figure>`, not a button - no film supplied. Same convention as
  `ChecklistMedia`; setting `hairlineDesignVideo.src` turns it into a real
  trigger with no code change.
- `/gsap-scrolltrigger` and `/animated-component-libraries` were invoked. Neither
  library is in this project and neither was added; the scrub is `motion`'s
  `useScroll`, which is what `Checklist` already uses.
- Files changed: new `src/components/HairlineDesign.tsx`, new
  `scripts/verify-hairline-design.mjs`, new
  `public/hairline-real/design-film.png`, `src/site.ts`,
  `src/styles/global.css` (`.hlDesign` block),
  `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 125.63 kB, JS 412.81 kB).
  `scripts/verify-hairline-design.mjs` across 1440x900, 768x1024, 390x844 and
  reduced motion: order `guideHero > systems > hlDesign`, seven rows, pinned at
  the three normal sizes and fully static under reduced motion, poster loads,
  media renders as a figure, min font 14.00px, page overflow 0, zero console
  errors and zero failed requests. A finer walk confirmed all seven focus states
  are reachable - the coarse 0.42vh probe step only sampled five because the
  point pitch is 30vh.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - HairlineDesign became Checklist; Checklist made data-driven

- Request: make "How We Design The World's Most Natural Hairline" look like the
  homepage's 21-point checklist section.
- The section had been built the day before as its own light-themed card with a
  `.hlDesign` block, borrowing only the checklist's scrub mechanism. Asked to
  look like the checklist as well, it stopped being a section that borrows the
  mechanism and simply became the checklist.
- **So `Checklist` was made data-driven instead of restyling 348 lines of CSS.**
  It now takes optional `titleId`, `title`, `lede`, `points` and `video`, all
  defaulting to the homepage's own module data - so the existing bare
  `<Checklist />` call sites on the homepage and Page 3 needed no edit at all.
  `HairlineDesign` is a nine-line wrapper passing page-4 content. The whole
  `.hlDesign` CSS block was deleted: CSS fell 125.64 to 120.95 kB and JS 412.81
  to 410.43 kB.
  - `LAST` moved from module scope into the component, and `--checklist-count`
    is now set inline from `points.length`; the progress rail divides by it and
    would otherwise have stayed at 21.
- **Two defects found in the shared component, both pre-existing on the homepage
  and Page 3, both fixed there too.**
  - The tally printed `01 / 7` for a seven-point list because only the numerator
    was padded. Now `01 / 07`.
  - The title's two lines concatenated in `textContent` - a screen reader heard
    "Our 21-Point ChecklistFor A Perfect Hair System". The spans are blocks, so a
    real trailing space collapses visually and fixes the announced text. Same bug
    class as the one fixed in `PatchFail` yesterday.
- **A long detour worth recording: the dev server was serving a dead module.**
  The page rendered nothing and the console read "does not provide an export
  named 'HairlineDesign'" while the export plainly existed, `tsc --noEmit` was
  clean and `npm run build` passed. Restarting vite did not help, nor did
  clearing `node_modules/.vite`. The cause: `pkill -f vite` matches nothing on
  Windows, so every "restart" spawned a server that failed to bind while two
  stale processes from 12:22 kept holding port 5173 and serving the old module
  graph. `netstat -ano | grep :5173` found them; killing by PID fixed it. This
  is the second time this session that a stale dev server has produced a
  convincing but fictitious bug - check the serving process before believing a
  browser symptom that the build does not reproduce.
- Files changed: `src/components/Checklist.tsx` (props + both fixes),
  `src/components/HairlineDesign.tsx` (rewritten as a wrapper),
  `src/styles/global.css` (`.hlDesign` block removed), `src/site.ts` (comment),
  `scripts/verify-hairline-design.mjs` (rewritten), `README.md`.
- Verification: `npm run build` passes. `scripts/verify-hairline-design.mjs`
  across 1440x900, 768x1024, 390x844 and reduced motion on page 4: count 7,
  seven rows, tally `01 / 07`, all seven focus states reachable at tablet and
  mobile step sizes, static under reduced motion, media renders as a figure,
  page overflow 0, zero console errors. The same script re-probes the homepage
  and Page 3: count 21, twenty-one rows, tally `01 / 21`, title id
  `checklist-title`, unchanged.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4: "Some Of Our Clients With The Most Natural Hairline"

- Request: add the section to the new page.
- One line. `ClientStories` is the homepage's own component, fully
  self-contained - no props, reads its own data, CSS scoped to `.voices`. Third
  page using it now, after the homepage and Page 3.
- Placed last of the four: the hero claims the hairline is undetectable,
  `Systems` shows the range, `HairlineDesign` shows the craft, and this shows men
  it worked for. Page 3 orders its equivalent run the same way. Page order is now
  hero, systems gallery, hairline-design scrub, client stories.
- **Checked the pin rather than assuming it**, since this is now the third
  pinned section on the page and they sit consecutively. Measured: the rail
  scrubs through twelve distinct track positions at 1440x900 with
  `position: sticky` engaged, and correctly falls back to a static swipe rail at
  768x1024, 390x844 and under reduced motion. Six client items, no broken
  images, page overflow 0, zero console errors and zero failed requests in every
  mode.
- **The same run-on title defect turned up a third time and is fixed at source.**
  `.voices__title` read "Some Of Our Clients WithThe Most Natural Hairline" in
  `textContent` - the two supplied lines are separate spans with no whitespace
  between them. The spans are blocks so it collapsed visually and only a screen
  reader would have heard it. Fixed in `ClientStories.tsx`, which fixes the
  homepage and Page 3 at the same time; verified all three now read "Some Of Our
  Clients With The Most Natural Hairline".
  - That is three components with the identical bug this week - `PatchFail`,
    `Checklist`, `ClientStories`. The shape is always the same: a `titleLines`
    array mapped to sibling `<span>`s. Any future component doing that needs the
    trailing space from the start.
- **Still outstanding, now on a third page:** the section's "See more client
  stories" link points at `#results`, which does not exist. Recorded in section 7
  and deliberately left alone; it was already dead on the homepage and Page 3,
  and changing the shared component's link is a content decision.
- Files changed: `src/pages/WillMyHairlineLookReal.tsx`,
  `src/components/ClientStories.tsx`, `README.md`.
- Verification: `npm run build` passes (JS 410.45 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4: "Benefits of a Natural Looking Hairline" card and overlay

- Request: build the supplied card and overlay like the Hair System Benefits
  section on Page 3, using `Images/Object.png` for the card and
  `Images/Object2.png` for the overlay.
- **`HairBenefits` was made data-driven rather than cloned.** Cloning it would
  have meant cloning a modal - focus trap, scroll lock, Escape handling, scrim
  blur - so it took an optional `data` prop defaulting to Page 3's own object.
  Page 3's bare `<HairBenefits />` call site needed no edit. `HairlineBenefits`
  is a three-line wrapper. Third consolidation this week, after `GuideHero` and
  `Checklist`.
- Three differences the component now carries, all data-driven:
  - **No philosophy callout**, so the CTA stands full width under the list. It
    uses `--grad-ink` rather than `--grad`: white on the lighter `#4686fe` stop
    measures 3.44:1 and misses AA, the same trap the booking button hit.
  - **The intro ends in a link.** No film supplied, so "Watch the video" renders
    as a dotted-underlined `<span>`, not an anchor that goes nowhere. Adding
    `introLink.href` makes it a real link with no code change.
  - **`cardArt: 'right'`.** Page 3's card file is a wide annotated scene at
    nearly the card's own ratio and bleeds full width. This is a portrait
    cut-out, and the inherited `cover` scaled a 1400x1152 file into a 2.03-ratio
    card and cropped it to a face filling the frame - caught on the first
    screenshot. `'right'` stands it on the card's floor at `contain`, anchored
    bottom right, at 56% of the card's width.
- **A typing trap worth recording.** The prop was first typed as
  `typeof hairBenefitsData`. Both data objects are `as const`, so that makes
  every string a literal type and the page-4 object fails to assign - the build
  complained that `'/hairline-benefits/card.png'` is not
  `'/hair-benefits/card.png'`. The shape is now declared structurally as an
  exported `BenefitsData`.
- **The run-on title bug turned up a fourth time** and is fixed at source in
  `HairBenefits`, which fixes Page 3 too. `.benefits__cardTitle` read "Benefits
  of a NaturalLooking Hairline" in the button's accessible name. Four components
  now: `PatchFail`, `Checklist`, `ClientStories`, `HairBenefits` - always a
  title-lines array mapped to sibling spans.
- Assets: `Images/Object.png` (2756x2268, 2.98 MB) to
  `public/hairline-benefits/card.png` at 1400x1152, 1.03 MB;
  `Images/Object2.png` (2392x3484, 3.94 MB) to `sheet.png` at 1100x1602,
  1.19 MB. Both transparent cut-outs, so PNG. 6.9 MB supplied, 2.2 MB shipped.
- Files changed: `src/components/HairBenefits.tsx` (props, variants, title fix),
  new `src/components/HairlineBenefits.tsx`, `src/site.ts`
  (`hairlineBenefitsData`), `src/styles/global.css` (three small variant
  blocks), `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 120.95 kB, JS 412.27 kB). Across
  1440x900, 768x1024, 390x844 and reduced motion on page 4: card opens, sheet
  reports `role="dialog"`, `aria-modal="true"` and a resolving
  `aria-labelledby`; Escape closes and returns focus to the card; four points
  render; CTA is `tel:9222666111` and 50px tall; no empty photo slots; page
  overflow 0; zero console errors. Page 3 re-probed and unchanged - philosophy
  callout present, narrow CTA, full-bleed card art.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4 closing block: "We Understand This Is Not A Small Decision."

- Request: build the supplied section exactly like the Stick-On or Clip-On page's
  "Still Confused?" block - same animation and overall treatment - with page 4's
  copy.
- **`StillConfused` was made data-driven rather than cloned.** Optional `data`
  and `titleId` props, defaulting to page 2's own object, so page 2's bare
  `<StillConfused />` call site needed no edit. `HairlineConfused` is a
  seven-line wrapper. Fourth consolidation this week, after `GuideHero`,
  `Checklist` and `HairBenefits`.
- Two things had to leave module scope:
  - **`totalWords`**, which the illumination sweep divides by, was computed once
    from page 2's eleven-word headline. Page 4's has eight, so a fixed total
    would have left the last words unlit. Now derived per instance and passed to
    `IlluminatedWord`.
  - **`titleId`**, because both headings would otherwise claim
    `still-confused-title`.
- **The run-on accessible-name bug turned up a fifth and sixth time, and these
  two were the worst.** `.stillConfused__word` and `.bookCall__word` are one span
  per *word*, spaced by a flex `column-gap` and a `margin-right` respectively -
  no whitespace anywhere - so the headings announced as
  "WeUnderstandThisIsNotASmallDecision." and
  "BookYour1:1ConsultationOnlineOrInPerson".
  - **Text nodes are not the fix here**, unlike the four earlier cases. Inside a
    flex row a space becomes an anonymous flex item and gains its own gap, which
    would have doubled the word spacing. Both headings now carry an `aria-label`
    built from `headlineLines.join(' ')`, which names the heading correctly and
    leaves the layout untouched. Verified all three affected headings announce
    their real sentences.
  - Running tally of this bug class: `PatchFail`, `Checklist`, `ClientStories`,
    `HairBenefits` (fixed with real text nodes - those are block spans), then
    `StillConfused` and `BookConsultation` (fixed with `aria-label` - these are
    per-word spans in flex/margin layouts). Any future split-headline needs one
    of the two treatments from the start.
- **A verification bug worth noting:** the check script asserted `textContent`,
  which is still deliberately run-on now that the label carries the name. It was
  reporting a failure that no longer existed. The script now asserts the
  `aria-label` and keeps `textContent` as a separate field.
- `href` is `#consult`, matching page 2 and equally dead. Left alone - pointing
  the two pages at different targets is a content decision. Logged in section 7.
- Files changed: `src/components/StillConfused.tsx` (props, per-instance word
  count, `aria-label`), `src/components/BookConsultation.tsx` (`aria-label`), new
  `src/components/HairlineConfused.tsx`, new
  `scripts/verify-hairline-confused.mjs`, `src/site.ts`
  (`hairlineConfusedData`), `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Verification: `npm run build` passes (JS 412.64 kB).
  `scripts/verify-hairline-confused.mjs` across 1440x900, 768x1024, 390x844 and
  reduced motion: eight words on page 4 lighting monotonically 0 to 8, static
  under reduced motion, capsule present, CTA rendered, heading labelled by its
  own id, page overflow 0, zero console errors. Page 2 re-probed: eleven words,
  0 to 11 monotonic, `still-confused-title`, unchanged.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4 benefits card: cut-out flushed into the corner

- Request: the card photograph looks cut off; place it in the right corner.
- **The file is itself a crop** - `Images/Object.png` has the subject's
  shoulders running off its left and right edges and his chest off the bottom,
  with transparent space only on the left. Confirmed by opening the shipped
  `public/hairline-benefits/card.png` rather than inferring it from the render.
- The variant had been written with `inset: auto 2% 0 auto`. That 2% is what made
  it look wrong: it floats the file's own cut edges in the middle of the blue,
  which reads as a clipped rectangle. Now `inset: auto 0 0 auto`, so the cut
  edges sit on the card's edges and the same crop reads as the card cropping
  him. Width allowance nudged 56% to 58%.
- **The mobile rule had the same fault for the same reason** and was not part of
  the request, but it is the same defect: below 620px the photograph was centred
  at 93% of the card's width, leaving a 23px gap on one side with a cut edge in
  it. Now sized to the full card width, flush left, right and bottom.
- Measured after: gaps right/bottom are 0 at 1440x900, 768x1024, 390x844 and
  360x780; left/right/bottom all 0 on the two phone widths. Title clearance
  above the photograph is 18px at 390 and 7px at 360 - tight but not overlapping.
- Page 3's card re-probed and unchanged: `rightArt` false, photograph still 100%
  of the card. Dialog contract intact on both pages - `role="dialog"`, four
  points, focus returns to the card on Escape, zero console errors.
- Files changed: `src/styles/global.css` (the two `--rightArt` rules),
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4: "The Truth Behind Ultra Natural Hairline"

- Request: build the attached section, make it mobile friendly and attractive,
  use a text-revealing effect, and place it above the Hairline Benefits card.
- Five short claims in the 2-2-1 grid the design draws. The fifth has no partner,
  so it spans both columns and centres at one column's width - measured 481px
  against a 481px sibling at 1440, 346 against 346 at 768.
- **The reveal is a word-by-word wipe out of a mask**, not a fade: each word sits
  in an `overflow: hidden` span and rises into it. Entry-driven rather than
  scroll-driven - this is a compact band, and a scrub needs a tall pinned stage
  to be legible, which is more scroll than five one-line claims are worth. The
  cards then stagger in behind the heading.
  - The masks need `padding-block` with matching negative margins, or
    `overflow: hidden` shaves the tails off g, y and p.
  - `useReveal` already handles reduced motion; the transitions are also
    cancelled under it so nothing can be caught mid-rise. Verified `data-shown`
    is already `true` on load in that mode.
- **The run-on accessible-name bug turned up a seventh time, in the section I
  was writing to avoid it.** The words within a line carried real spaces from the
  start, but the two `.truth__line` blocks had none between them, so the heading
  announced as "The Truth Behind UltraNatural Hairline". Fixed with a space at
  the end of each line.
  - Running tally and the two fixes: real text nodes where the words are inline
    (`PatchFail`, `Checklist`, `ClientStories`, `HairBenefits`, `HairlineTruth`),
    `aria-label` where they sit in a flex row (`StillConfused`,
    `BookConsultation`). **Check `textContent`, not the render** - every one of
    these looked correct on screen.
- `/animejs` was invoked again. anime.js is still not a dependency and still was
  not added; the wipe is a CSS transform transition keyed off `useReveal`, which
  is what every other entrance on this site uses.
- Contrast on the white card: bold half 19.43:1, light half 6.15:1, white check
  on brand blue 4.67:1.
- Files changed: new `src/components/HairlineTruth.tsx`, new
  `scripts/verify-hairline-truth.mjs`, `src/site.ts` (`hairlineTruthTitle`,
  `hairlineTruthPoints`), `src/styles/global.css` (`.truth` block),
  `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 123.68 kB, JS 414.12 kB).
  `scripts/verify-hairline-truth.mjs` at 1440x900, 768x1024, 390x844, 360x780
  and reduced motion: two columns down to 760px and one below, all five cards
  reaching full opacity, all six heading words finishing their rise, reveal
  firing `false -> true` and starting `true` under reduced motion, five bold
  spans resolving, min font 15.00px, page overflow 0, zero console errors.
- Page order is now hero, systems, hairline-design checklist, client stories,
  truth claims, hairline benefits, closing scrub.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4: brush-back decision tree

- Request: build the supplied flowchart from the desktop and mobile designs,
  well responsive, with text-reveal and arrow-line-reveal effects, placed below
  the closing scrub block.
- **The connectors are CSS, not SVG, and that was the load-bearing decision.**
  Each line is a positioned bar and each arrowhead two rotated borders, laid out
  on the same two-column grid as the nodes. An SVG overlay would have needed
  measured coordinates at every breakpoint and this diagram reflows continuously
  between 360px and 1440px; grid-placed bars follow the layout for free. It also
  makes the requested line reveal cheap - a bar draws itself with `scaleY(0)` to
  `scaleY(1)` from its top edge, which is compositor-only.
- Reveal ordering is encoded in transition delays rather than left to chance:
  the split bar finishes before the legs hanging off it begin, or a leg appears
  in mid-air, and every head fades in behind the line that carries it.
  `will-change` is deliberately absent - these animate once on entry and never
  again, so pinning a layer for the page's life costs more than it saves.
- Heading uses the same word-wipe-out-of-a-mask as `HairlineTruth`, with real
  spaces between words and between the two lines from the start.
- **Two defects caught by comparing the render against the design:**
  - The branch pills were stretching to the full column width, because a rule
    sized branch nodes and pills together. They are chips; only the nodes fill
    their column.
  - There was no arrow between each pill and its node. The design runs the split
    legs *into* the pills and puts the arrow on the step after, pointing at the
    node. Added a legs row; the split legs lost their heads.
- **A verification bug of my own:** after adding the two new legs the script
  still reported 9 lines because its selector list had not been extended. It was
  reporting a pass over elements it was not looking at. Selector updated; now 11.
- **The design's branch pill colours miss AA** - `#16a34a` measures 3.00:1 on its
  own tint and `#dc2626` measures 3.95:1. Shipped as `#15803d` (4.57:1) and
  `#b91c1c` (5.30:1), the nearest shades that clear it.
- Pills also first rendered at 13px, under the 14px body floor; raised to a
  0.875rem minimum.
- `/gsap-scrolltrigger`, `/animated-component-libraries`,
  `/lightweight-3d-effects` and `/web3d-integration-patterns` were all invoked.
  None of those libraries are in this project and none were added - a flowchart
  of six boxes needs no 3D pipeline, and the reveal is CSS transforms keyed off
  `useReveal`.
- Files changed: new `src/components/BrushBackFlow.tsx`, new
  `scripts/verify-brushback.mjs`, `src/site.ts` (`brushBackTitle`,
  `brushBackFlow`, `FlowNode`), `src/styles/global.css` (`.flow` block),
  `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 128.06 kB, JS 417.75 kB).
  `scripts/verify-brushback.mjs` at 1440x900, 768x1024, 390x844, 360x780 and
  reduced motion: six nodes at full opacity, all eleven lines drawn, five heads
  visible, eleven heading words risen, reveal firing `false -> true` and starting
  `true` under reduced motion, the two branch nodes sharing a row at every width,
  six bold spans, min font 14.00px, page overflow 0, zero console errors.
- Page order is now hero, systems, hairline-design checklist, client stories,
  truth claims, hairline benefits, closing scrub, brush-back tree.
- Not committed; belongs to the eventual version 2.

### 2026-08-22 - Page 4: "HD Exposed Hairline — Brush Back Hairstyle" card rail

- Request: build the attached section to top-notch UI/UX practice, responsive
  and user friendly.
- Placed immediately before `BrushBackFlow`: this section describes the
  brush-back style, the decision tree then asks whether the reader's own front
  hair qualifies for it. The two are a pair and only make sense in that order.
- **Built as a native scrolling rail rather than a transform carousel.**
  `overflow-x: auto` plus `scroll-snap` gives touch momentum, trackpad gestures,
  a real scrollbar, keyboard arrow scrolling and the browser's own overscroll
  behaviour for free; a `translateX` carousel has to reimplement all of it. The
  buttons are a convenience that call `scrollBy`, and the rail works if they are
  never touched.
- The accessibility bookkeeping that choice requires, all deliberate:
  - `tabindex="0"` and an `aria-label` on the rail. Browsers only make an
    overflow container keyboard-scrollable automatically when it has no
    focusable children, and a keyboard user who cannot reach the rail cannot
    read cards two to four.
  - Buttons disable from real scroll position, not from an index, because a
    touch drag moves the rail without them knowing.
  - A polite live region announcing "Card n of 4".
  - 44x44 buttons, not the 36px the design draws.
- **Four defects found and fixed during verification:**
  - The controls sat permanently disabled at 1440, where all four cards fit.
    They now hide when the rail does not overflow - no buttons reads as "nothing
    to page through" where two dead buttons read as broken.
  - **`hidden` alone did not hide them.** The UA stylesheet sets `display: none`
    for `[hidden]`, but the author `display: flex` on the same element wins, so
    the attribute left them on screen. Needed an explicit
    `.hd__controls[hidden] { display: none }`.
  - The edge threshold was 1px, but the rail's padding and
    `scroll-snap-align: start` settle it a few pixels in, so Prev was live while
    the reader was still on card one. Now 8px.
  - The title's `max-width: 18ch` rewrapped the supplied line break and dropped
    "Brush" onto a line of its own. Now 30ch.
- **Two verification traps worth recording, both of which I hit:**
  - `Home` and `End` do not scroll a horizontal container - only arrows do. My
    first check pressed `Home`, saw no movement and wrongly reported the rail as
    keyboard-unreachable. Confirmed with a direct probe that ArrowRight moves it
    0 to 254 to 508 to 652.
  - Asserting `element.hidden` rather than computed `display` reported the
    controls as hidden while they were still rendered. The check now reads
    `getComputedStyle(...).display`.
- Marks: white measures 3.30:1 on `#16a34a` and 4.83:1 on `#dc2626`, both past
  the 3:1 a meaningful graphic owes. Colour is never the only signal - each
  card's heading says which list it is and the glyphs differ, which is what the
  `color-only` guideline asks.
- `/gsap-scrolltrigger`, `/web3d-integration-patterns`,
  `/lightweight-3d-effects:setup_vanta` and
  `/substance-3d-texturing:web_optimizer` were invoked. None of those libraries
  are in this project and none were added; a four-card rail needs no 3D
  pipeline, no Vanta background and no texture optimiser.
- Files changed: new `src/components/HdExposed.tsx`, new
  `scripts/verify-hd-exposed.mjs`, `src/site.ts` (`hdExposedTitle`,
  `hdExposedCards`, `HdCard`, `HdCardTone`), `src/styles/global.css` (`.hd`
  block), `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Verification: `npm run build` passes (CSS 130.95 kB, JS 421.79 kB).
  `scripts/verify-hd-exposed.mjs` at 1440x900, 768x1024, 390x844, 360x780 and
  reduced motion: four cards reaching full opacity everywhere; rail focusable
  and ArrowRight moving it at every width where it overflows; controls hidden at
  1440 and shown below it; Prev disabled at the start and Next at the end; 44x44
  buttons; live region reading "Card 1 of 4"; min font 14.00px; page overflow 0;
  zero console errors.
- Page order is now hero, systems, hairline-design checklist, client stories,
  truth claims, hairline benefits, closing scrub, HD-exposed rail, brush-back
  tree.
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - HD-exposed section: desktop becomes a grid

- Request: the desktop layout carried too much white space with four cards on
  one row. Change it, using the supplied reference, to three cards on the first
  row and the fourth on a second row.
- Above 900px `.hd__rail` now sets `grid-auto-flow: row` with three equal
  columns and drops its overflow and snap, so it stops being a rail and becomes
  a grid. Below 900px it is unchanged - four cards cannot share a phone row and
  a scroll rail beats a four-storey stack.
- **The fourth card spans the full width rather than sitting in column one.**
  Parking it at a third would have reinstated exactly the dead space the request
  was about, one row lower. Its own points list splits into two columns at that
  width so the lines do not run the width of the section.
- **The component needed one real change and it was an accessibility fix, not a
  layout one.** The rail carried `tabindex="0"`, `role="group"` and a label
  reading "scrollable" unconditionally. Above 900px there is nothing to scroll,
  so that was a tab stop that did nothing and a label that lied. Those three
  attributes are now applied only while the already-computed `scrollable` state
  is true. No new state was needed - the component reads overflow from the
  element, so the stylesheet changing the layout is enough for it to drop the
  controls and the tab stop on its own.
- Measured at 1440, 1100, 900, 768 and 390: three columns and rows of 3+1 above
  900px with the last card 1311px against a 424px sibling at 1440 and its list
  at two columns; four columns on one scrolling row at 900 and below with
  `tabindex="0"` and the controls shown. Page overflow 0 and zero console errors
  at every width.
- `/spline-interactive` was invoked. Spline is not in this project and was not
  added; this was a CSS grid change.
- Files changed: `src/styles/global.css` (`.hd` responsive block),
  `src/components/HdExposed.tsx` (conditional rail attributes), `README.md`.
- Verification: `npm run build` passes (CSS 131.35 kB, JS 421.80 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - HD-exposed: centred last card, neutral hairline, moved after the tree

- Request: centre the "May Not Be the Right Choice If:" card's content with the
  heading in the middle and the four points in two lines; move the section below
  the brush-back decision tree; remove the blue stroke on all four cards.
- **Centring.** The last card now centres its heading and its two-by-two points
  block at grid width; measured symmetric padding, 206px each side at 1440 and
  50px at 1100. The points were already two columns by two rows from the
  previous change, so "two lines" needed no structural change.
  - **The text inside each point stays left-aligned against its mark**, and that
    is deliberate rather than an oversight: centring a line that begins with an
    icon leaves the icon floating away from its text and puts the ragged edge
    down the middle of the card. The card reads as centred because the heading
    and the block are; centring the sentences too would cost legibility.
- **The blue stroke.** Two rules in this section were blue and they are not the
  same thing:
  - `.hd__card:hover` set `border-color: rgb(23 105 255 / 0.24)`. That is the one
    removed - it tinted the hairline brand blue on hover, which read as a
    selected state on a card that cannot be selected. Hover now deepens the
    existing neutral hairline instead. Verified all four cards report a single
    border colour, `rgba(15, 23, 42, 0.08)`.
  - `.hd__rail:focus-visible` draws a 3px `--accent-ink` ring around the rail.
    **Kept deliberately** - it is the keyboard focus indicator, appears only on
    keyboard focus, and only on the narrow layout where the rail is focusable at
    all. Removing it would leave a keyboard user unable to see where they are.
    Flagged to the user rather than removed silently.
- **Order.** `HdExposed` now sits after `BrushBackFlow`. The two were built as a
  pair in the opposite order - style first, then the qualifying question - and
  now read as: decide whether a brush-back is open to you, then read what living
  with one involves. Page order confirmed `... stillConfused > flow > hd`.
- Measured at 1440, 1100 and 390: heading `center` at grid widths and `start` on
  the phone rail; points two rows by two columns above 900px and four by one
  below; block centred at every width; page overflow 0 and zero console errors.
- Files changed: `src/styles/global.css` (`.hd` hover and last-card rules),
  `src/pages/WillMyHairlineLookReal.tsx` (order and doc comment), `README.md`.
- Verification: `npm run build` passes (JS 421.80 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - HD-exposed last card: one line per point across the desktop range

- Request: in the "May Not Be the Right Choice If:" card each pointer wrapped to
  two lines; put each on one line.
- **Cause was mine from the previous change.** The points block had been capped
  at `max-width: 900px` to centre it, which inside a 1311px card left each column
  about 430px and wrapped every point. The width to avoid it was already there.
  The cap is gone and the block now uses the full card width.
- That alone fixed 1280px and up. Measured the longest point at 68 characters,
  needing roughly 520px of measure; two columns clear that from 1280px (538px per
  column) but not below, so **below 1280px the list drops to a single full-width
  column** rather than wrapping. Four rows instead of two is the cost of keeping
  every point on one line, which is what was asked for.
- Measured line counts per point at 1920, 1600, 1440, 1280, 1279, 1100, 950 and
  901: `1,1,1,1` at every one. Two columns at and above 1280, one below. Page
  overflow 0 and zero console errors throughout. The phone rail is unchanged and
  still wraps, which is correct at a 240px card.
- Files changed: `src/styles/global.css` (`.hd` last-card points rules),
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - HD-exposed last card: points block centred

- Request: centre the four pointers in the "May Not Be the Right Choice If:"
  card.
- The block had been full card width, so the items sat hard against the card's
  padding on both sides. Full width is not centred, it is merely full width.
- Columns are now `minmax(0, max-content)` with `justify-content: center`, so the
  grid measures its own content and centres as a block.
  - **`max-content` is doing two jobs**, which is why it was the right tool
    rather than a fixed `max-width`: a column that measures its longest item can
    never wrap it, so the one-line-per-point requirement from the previous change
    survives centring for free.
  - `minmax(0, max-content)` rather than bare `max-content` so that if the copy
    ever outgrows the card the column shrinks and wraps rather than overflowing
    the card and the page.
- Measured at 1920, 1600, 1440, 1280, 1279, 1100, 950 and 901: left and right
  gaps identical at every width (359/359 at 1920 down to 161/161 at 901), and
  every point still on one line. Two columns at and above 1280, one below. Page
  overflow 0 and zero console errors throughout.
- Files changed: `src/styles/global.css` (`.hd` last-card points rules),
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - HD-exposed section: design review and three fixes

- Request: analyse the section as a designer and improve it. Open-ended, so the
  findings are recorded here with what was and was not changed.
- **Finding 1, the substantive one: card two's mark contradicted its content.**
  "What You Should Know" carried green ticks, but all three of its points are
  maintenance costs - "Requires weekly gluing", "Only liquid glue works; tapes
  will be visible", "Glue attracts dust over time and may darken if not
  cleaned". A green tick beside "glue attracts dust" asserts that dust is a
  benefit. The card's own heading already said otherwise, so the mark was the
  part that was wrong.
  - `HdCardTone` gained `'care'`; card two uses it. The four cards now read as a
    traffic light - two yes, one be-aware, one no.
  - Amber is `#b45309`, deliberately not the site's existing warning `#ea580c`:
    white on that measures 3.56:1 and this glyph is 11px, where the 3:1 floor is
    a bare minimum rather than a comfortable target. `#b45309` measures 5.02:1.
  - The glyph changes as well as the colour - tick, info, cross - so a reader who
    cannot separate the hues still gets the distinction, and every heading states
    its tone in words regardless.
  - This is a design opinion about the client's own content, not a bug fix.
    Reverting is one line: card two's `tone` back to `'yes'`.
- **Finding 2: the card heading barely outranked its body text.** 16px/700
  against 15px/400 - one pixel apart is not a hierarchy. Heading is now
  `clamp(1rem, 1.15vw, 1.125rem)`, measured 16.56px against 14px body at 1440.
- **Finding 3: the fourth card read as a wrapped fourth item rather than a
  separate verdict.** It now carries a small top margin, so the three
  "consider it" cards group as one row and the "not for you" card sits apart.
- **Considered and deliberately not changed:** card two is visibly shorter than
  its neighbours, leaving empty space at its foot. That is three points against
  four, not a layout fault; equal-height cards in a row are the tidier of the two
  options and letting them size to content would give a ragged bottom edge for no
  gain.
- Measured at 1440, 1100 and 390: tones `yes/care/yes/no`, marks
  `rgb(22,163,74)`, `rgb(180,83,9)`, `rgb(22,163,74)`, `rgb(220,38,38)`, glyphs
  `check/info/check/x`, heading 16.56px against 14px body, the last card still
  one line per point at desktop widths, page overflow 0, zero console errors.
- Files changed: `src/site.ts` (`HdCardTone`, card two's tone),
  `src/components/HdExposed.tsx` (third glyph), `src/styles/global.css` (caution
  mark, heading scale, group spacing), `README.md`.
- Verification: `npm run build` passes (JS 422.18 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - HD-exposed section: three further improvements, own judgment

- Request: open mandate on this section. Three changes made, all scoped to it.
- **The section head now wipes word by word out of a mask**, the idiom
  `HairlineTruth` and `BrushBackFlow` already use. It was the one section head on
  this page that simply appeared with its container, which read as an omission
  next to its two neighbours. Real spaces between the words and between the two
  lines from the start, so the accessible name stays "HD Exposed Hairline — Brush
  Back Hairstyle" - verified, not assumed.
- **Heading scale raised to `clamp(1.5rem, 3vw, 2.4rem)`, matching
  `.truth__title`.** It was `clamp(1.35rem, 2.4vw, 1.9rem)`. Measured 38.4px at
  1440, up from 30.4px.
  - **Site-wide finding worth recording:** three section heads on this one page
    sat at three different scales - `.truth` 2.4rem, `.hd` 1.9rem, `.flow`
    1.75rem - with nothing to justify the difference. Sibling sections should
    rank the same. `.hd` was in scope and is fixed; **`.flow__title` is still the
    outlier** and should be brought to 2.4rem when someone is next in that file.
- **The card hover state is gone, deliberately.** The cards are not links,
  buttons or anything else actionable, and a surface that lights up under the
  cursor is a false affordance - it invites a click that does nothing. The border
  and shadow transitions came off the card with it, so the only transitions left
  are the entrance `opacity` and `transform`; verified by reading
  `transitionProperty` off a rendered card.
- Measured at 1440, 1100, 390 and reduced motion: seven heading words, none
  risen before entry and all seven after; under reduced motion all seven are
  already in place with no transition; heading 38.4/33/24px; card transitions
  `opacity, transform` only; page overflow 0; zero console errors.
- Files changed: `src/components/HdExposed.tsx` (word masks),
  `src/styles/global.css` (word wipe, heading scale, hover removal, reduced
  motion), `README.md`.
- Verification: `npm run build` passes (JS 422.41 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - HD-exposed card two: green tick restored by request

- Request: keep the old green checkmark on the "What You Should Know:" card.
- Reverted `tone` from `'care'` back to `'yes'`. One line, as flagged when the
  amber tone was introduced.
- The reasoning for the amber is recorded in the previous entry and still holds
  as an opinion - the card's three points are maintenance costs, and a green tick
  beside "glue attracts dust over time and may darken" reads as an endorsement of
  the dust. It is the client's copy and their call; the card's heading, "What You
  Should Know", is what carries the framing now.
- **The `'care'` tone was left wired up rather than stripped out.** The enum
  member, the `Info` glyph branch in `HdExposed.tsx` and the
  `[data-tone='care']` rule with its measured `#b45309` all remain, so
  reinstating it is a one-word change in `site.ts` and no rebuild of the
  machinery. That is a deliberate call to keep dead-but-documented code rather
  than delete and re-derive it later.
- Verified at 1440: tones `yes/yes/yes/no`, marks
  `rgb(22,163,74)` on the first three and `rgb(220,38,38)` on the last, glyphs
  `check/check/check/x`, page overflow 0, zero console errors.
- Files changed: `src/site.ts` (card two's tone and its comment), `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - Page 4: "If You Want To Use Your Natural Hair In The Front..."

- Request: build the supplied section using the homepage "This Might Sound Like
  Your Story" card-reveal effect, place it above the footer, and research the
  reference section first.
- **Researched `Story` before building, as asked**, and the research is what
  decided the approach. Its move is two overlapping ramps: `open` runs a row from
  its peek to full height over one step of scroll, `peek` starts a step earlier
  so the next card is already on screen as a narrow slab. The row opens by
  animating `grid-template-rows` from `minmax(0, 0fr)` to `minmax(0, 1fr)`, which
  is how it reaches exactly its content height with nothing measured.
- **The mechanism was extracted rather than copied.** New
  `src/components/ScrollStack.tsx` holds `useScrollStack` (pin, spring, the
  `still` breakpoint) and `StackRow` (the two ramps, the `fr` string, the
  `scaleX`). `Story` was refactored onto it and `NaturalFront` built on it, so
  the move exists once. Fifth consolidation on this project.
  - What is shared is the mechanism, not the appearance: `ScrollStack` publishes
    `--open` and `--peek-amt` and each section's stylesheet decides what a row
    looks like. Hence generic custom-property names and per-section class names.
- **One real bug caught during the extraction.** `StackRow` first derived the
  inner wrapper's class as `` `${className}In` ``. `Story`'s closing row carries
  `"story__row story__row--cta"`, so that produced `story__row--ctaIn` instead of
  `story__rowIn` and the CTA card would have lost every inner style. Fixed by
  taking `innerClassName` as its own prop; verified six `.story__rowIn` elements
  still render on the homepage.
- **The step needed to be longer than `Story`'s.** Three rows means only two
  steps of scroll after the first card lands, and at `Story`'s 30vh the whole
  stack built in barely half a screen - measured as the section opening 2 cards
  before the first probe sample. `--nfront-step` is 48vh, which gives each card
  the dwell a six-row stack gets. After the change, from the section's top the
  rows measure 105px open, 18px peeking and 0px collapsed, then build 1, 2, 3.
- The design's blue cap rides `--open` rather than sitting on the closed slab: a
  bright edge on a grey sliver reads as a seam rather than as a design.
- Placed last on the page, directly above the footer. Order is now
  `guideHero > systems > checklist > voices > truth > benefits > stillConfused >
  flow > hd > nfront`.
- `/gsap-scrolltrigger` and `/animated-component-libraries` were invoked. Neither
  library is in this project and neither was added; the stack is `motion`'s
  `useScroll` with a spring, which is what `Story` already used.
- Verification: `npm run build` passes (CSS 135.02 kB, JS 424.64 kB).
  `scripts/verify-natural-front.mjs` at 1440x900, 1100x900, 390x844 and reduced
  motion: three rows and three inner wrappers, `position: sticky` on the two
  desktop widths and the static fallback on the phone and under reduced motion,
  cards opening monotonically, heading labelled by its own id, page overflow 0,
  zero console errors and zero failed requests. The same script re-probes the
  homepage `Story`: six rows, six inner wrappers, sticky pin, opening 1 through
  6 monotonically, unchanged.
- Files changed: new `src/components/ScrollStack.tsx`, new
  `scripts/verify-natural-front.mjs`, rewritten
  `src/components/NaturalFront.tsx`, refactored `src/components/Story.tsx`,
  `src/styles/global.css` (`.nfront` block),
  `src/pages/WillMyHairlineLookReal.tsx`, `README.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - NaturalFront: the gap above the footer

- Request: too much space between the new section and the footer.
- **Measured before changing anything, and the first two attempts were wrong**,
  which is worth recording because the geometry is counter-intuitive.
  - The gap is not padding. While a pinned section's sticky element is stuck,
    its content is fixed in it, so the blank a reader sees as the footer arrives
    is `viewport height - content height`. Measured 304px at 900px tall and
    462px at 1080, because three short cards only filled about 600px.
  - **Shrinking the pin does not help and makes it worse.** A pin shorter than
    the viewport releases *later*, not sooner - release happens at
    `sectionBottom - pinHeight`, so a smaller pin means more scrolling before it
    lets go. Tried `clamp(560px, 74vh, 700px)` and then a content-sized pin; the
    worst gap went 358 to 355 to 550. Only a pin taller than the viewport would
    release before the footer enters, which is not something a sticky element
    can usefully be.
- **What actually worked, in two parts:**
  - `align-items: center` on the pin. It does not remove the slack, it splits it
    above and below, so it reads as breathing room rather than as a hole. Costs
    a measured ~150px of heading drift across the pinned stage. `.story` stays
    top-aligned because its six rows nearly fill the viewport and it has no
    slack to split.
    - An earlier drift figure of 963px was my own measurement error - it sampled
      the heading while the section was still scrolling normally, before the pin
      engaged. Filtered to the pinned range it is ~150px.
  - Larger cards, since every pixel the stack does not fill is slack the pin has
    to absorb: `--nfront-gap` 12 to 20px, row padding up to
    `clamp(22px, 2.2vw, 32px)`, point gaps and type up a step. Content 596px to
    708px at a 900px window, and the cards read less cramped besides.
- Result: worst gap 358px to about 155px at 1440x900, which is ordinary section
  padding rather than a void. Min font 15.00px.
- Re-verified across 1440x900, 1100x900 and reduced motion, plus the homepage
  `Story` (six rows, sticky, opening 1 through 6, unchanged): three rows and
  three inner wrappers, static fallback on phone and reduced motion, page
  overflow 0, zero console errors.
- Files changed: `src/styles/global.css` (`.nfront` pin, gaps, padding, type),
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - NaturalFront: section padding matched to its neighbours

- Request: the section's top padding was larger than other sections'; match top
  and bottom to the rest.
- **Measured against the neighbours rather than guessing.** Distance from a
  section's top edge to its heading: `.truth`, `.hd` and `.flow` all 94px at
  1440, `.nfront` 366px.
- **The cause was the centred pin from the previous entry**, and it was a worse
  idea than it measured. At rest the stack is still collapsed, so the content is
  short and centring pushes it far down the pin - 366px - and then slides it
  upward as the cards open. Centring fixed the footer gap by creating a top gap.
- Reverted to `align-items: start` and gave the pin `height: auto` so it takes
  its height from the built stack. Together those fix both ends: the heading
  sits at the section's own padding, and the blank above the footer settles to
  that same padding once the pin releases, because there is no pin left over
  below the content.
- `.nfront__in` padding is now the site standard `clamp(44px, 6.5vw, 96px)`, and
  the sticky heading's `top` matches it.
- **The static fallback had its own larger padding and was missed on the first
  pass.** `.nfront--still` carried `clamp(56px, 8vw, 120px)`, which measured
  56px against the siblings' 44px on a phone and 115px against their 94px under
  reduced motion - so the desktop matched while the phone and reduced-motion
  cases did not. Now the same standard value.
- Verified identical to `.truth`, `.hd` and `.flow` at 1440x900, 1600x900,
  1280x900, 1100x900, 390x844, 360x780 and under reduced motion: top 94/96/83/
  72/44/44/94 and bottom settling to the same figure in every case, zero console
  errors.
- Re-ran `scripts/verify-natural-front.mjs`: three rows and three inner wrappers,
  sticky pin on the two desktop widths, static fallback on phone and reduced
  motion, cards opening monotonically, page overflow 0, zero console errors. The
  homepage `Story` re-probed and unchanged - six rows, sticky, opening 1 through
  6.
- Files changed: `src/styles/global.css` (`.nfront` pin, padding, sticky heading
  offset, `--still` padding), `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - Hairline Benefits overlay: separate photograph for narrow screens

- Request: the overlay photograph is cut off on mobile; use `Images/Object3.png`
  instead and leave the desktop alone.
- **Done as art direction, not as a straight file swap**, because the two
  requirements pull against each other: replacing the file outright would have
  changed the desktop too. `Slot` gained an optional `mobileSrc`, and `Photo`
  renders a `<picture>` with a `<source media="(max-width: 900px)">` when one is
  present.
  - `<picture>` rather than two images toggled by CSS: the browser resolves the
    source and downloads only the one it picks, where a CSS toggle fetches both
    and discards one.
  - The breakpoint is 900px to match the stylesheet's own, where
    `.benefits__sheetArt` changes layout.
- Why the old file failed on a phone: it is framed for a tall column, and the
  phone layout gives the art a box about 366x234. `Object3.png` carries margin
  on every side, so `contain` fits the whole man - head, glasses and torso all
  visible.
- Asset: `Images/Object3.png` (2800x3576, 6.50 MB) to
  `public/hairline-benefits/sheet-mobile.png` at 820x1048, 0.89 MB. Transparent
  cut-out, so PNG.
- Verified the swap boundary exactly: at 901px the browser serves `sheet.png`
  (1100x1602) and at 900px and below `sheet-mobile.png` (820x1048), with nothing
  clipped at 900, 390 or 360. Desktop at 1440 is byte-identical in behaviour -
  same file, same box, same intentional 146px bottom crop that was already by
  design.
- **Page 3 is untouched and that was checked, not assumed:** its slot has no
  `mobileSrc`, so `Photo` returns a plain `<img>` with no `<picture>` wrapper -
  confirmed `picture false` at both 1440 and 390, still serving its own
  `sheet.png`.
- Zero console errors and zero failed requests at every width probed.
- Files changed: `src/components/HairBenefits.tsx` (`Slot.mobileSrc`, the
  `<picture>` branch), `src/site.ts` (`hairlineBenefitsData.media.sheet`), new
  `public/hairline-benefits/sheet-mobile.png`, `README.md`.
- Verification: `npm run build` passes (JS 424.82 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-24 - NaturalFront mobile: could not reproduce "only one card"

- Report: on mobile only one of the three cards is visible while scrolling.
- **Could not reproduce, and said so rather than changing things blindly.**
  Tested the production build (not just dev) on iPhone 13, iPhone SE, Pixel 5
  and Galaxy S8 device profiles, plus raw viewports at 390x844, 390x667,
  360x780, 414x896, 768x1024 and 820x1180. Every case: `still` true, all three
  rows present at opacity 1 with heights 149/299/230, all three reachable by
  scrolling, and on an iPhone 13 frame all three are visible at once.
- **The most likely explanation is a tablet, not a phone.** The static fallback
  is bounded at `(min-width: 901px)`. Measured: 820, 880 and 900px wide all show
  three cards at once; 901, 1024 and 1180 run the pinned stack, which opens
  **one card on arrival** and reveals the rest on scroll - by design on desktop,
  but an iPad in portrait is 1024px and reads as "mobile" to a user. A phone in
  landscape can also clear 901px. Raising the breakpoint would fix that case and
  is a one-line change, but it alters the desktop threshold, so it was left for
  the user to confirm rather than done unasked.
- **One real fragility was found and removed while looking.** The phone entrance
  was written as `opacity: 0` on the row, lifted by
  `.nfront__in[data-shown='true']`. That makes the cards invisible in every case
  where the reveal never fires, and content that needs JavaScript to become
  visible is content that can be lost. It is now a keyframe applied *on* reveal,
  so the row's resting state is visible and the worst case is that the cards
  appear without animating. This is a genuine improvement but is not known to be
  the reported bug.
- Files changed: `src/styles/global.css` (phone entrance rewritten as
  `@keyframes nfrontRowIn`).
- Verification: `npm run build` passes; three device profiles re-checked after
  the change, all three rows seen.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - New page: "Stick-On System Lifespan" hero

- Request: start the "Stick-On System Lifespan" page, building its hero like the
  other guide heroes, with the supplied thumbnail and the Calendar icon in the
  primary colour.
- **The route was not a free choice.** `site.ts` has linked
  `#/stick-on-lifespan` from the "Confused? We'll Guide You" menu since the
  navigation was written, so the page had to answer that exact path - inventing
  one would have left the menu item pointing at nothing. Checked before creating
  the file rather than after. `#/clip-on-lifespan` sits beside it in the same
  menu and still has no page behind it.
- `StickOnLifespanHero` is a third thin wrapper around `GuideHero`, alongside
  `PatchSystemHero` and `HairlineRealHero`. No new hero markup or CSS - the
  extraction done for page 4 paid off again here.
- **The icon needed no recolouring.** `GuideHero` paints the eyebrow mark as a
  CSS mask, so the supplied file's own fill is discarded and the brand blue is
  painted through its shape. Verified `rgb(23, 105, 255)` masked by
  `calendar.svg`, which is what "in our primary colour" asked for.
- Assets: `Images/Frame 2085666354.png` (4480x2520, 7.03 MB) to
  `public/stick-on-lifespan/thumbnail.png` at 2240x1260, 2.43 MB - the same
  treatment page 4's thumbnail got. `Icons/Calendar--Streamline-Solar.svg`
  copied unchanged to `public/icons/calendar.svg`.
- **Pre-existing item found, not introduced and not changed:** the guide hero's
  eyebrow badge renders at 12.48px, under the 14px body floor the rest of the
  site holds. Confirmed identical on all three guide pages, so it is shared
  `.guideHero` styling rather than anything this page added. Fixing it would
  change pages 3 and 4 as well, so it is logged here for a decision rather than
  altered unasked.
- Verification: `npm run build` passes (JS 425.60 kB). Probed at 1440x900,
  768x1024, 390x844, 360x780 and reduced motion: `<h1>` reading "How Long Does a
  Stick-On Hair System Last?" and labelling its own section by a unique id,
  eyebrow "Stick-On System Lifespan", mark `rgb(23, 105, 255)` masked by
  `calendar.svg`, five bold spans in the lede, the poster loading at 2240x1260,
  page overflow 0, zero console errors and zero failed requests at every width.
- Files changed: new `src/components/StickOnLifespanHero.tsx`, new
  `src/pages/StickOnLifespan.tsx`, new `public/stick-on-lifespan/thumbnail.png`,
  new `public/icons/calendar.svg`, `src/site.ts` (four hero exports),
  `src/App.tsx` (route), `README.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Add hair-systems gallery to Stick-On System Lifespan

- Request: add "World's Finest Thinnest Hair Systems" to the Stick-On System
  Lifespan page.
- Reused the `Systems` component directly after `StickOnLifespanHero`. This keeps
  the same thirteen products, desktop scroll-controlled circular gallery,
  phone snap rail, and reduced-motion fallback already used on the homepage
  and other guide pages; no duplicate component, content, CSS, or asset was
  created.
- Fixed the shared split heading's accessible text while integrating it: a real
  trailing space between its two block spans changes the spoken/textContent
  form from "FinestThinnest" to "Finest Thinnest" without changing layout.
- UI/UX Pro Max's React search returned no relevant verified component match
  after one retry, so the change follows the skill's built-in accessibility,
  responsive-layout, reduced-motion, and performance defaults plus the
  repository's established cross-page reuse pattern.
- Files changed: `src/pages/StickOnLifespan.tsx`, `src/components/Systems.tsx`,
  `scripts/verify-stick-on-lifespan.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,035 modules; CSS 135.03 kB, JS
  425.62 kB). Headless Chrome against the production preview passed at
  1440x900, 390x844, 844x390, and 1440x900 with reduced motion: section order
  is hero then systems, one H1, two-line accessible Systems heading, thirteen
  cards/images, desktop ring rotation, snap-rail fallbacks for phone/landscape/
  reduced motion, zero horizontal overflow, zero console errors, and zero
  failed requests.

### 2026-08-25 - Page 5: "Thin Base Vs. Thick Base" rating table

- Request: build the supplied comparison section like the one on the other guide
  page and place it below the hero on Stick-On System Lifespan.
- **Built as a variant of `.compare`, not a second table.** Page 3's comparison
  already supplies the card, the dark `#14161a` header row, the scroller and the
  breakpoints; only the cell contents differ, so `rateCompare` adds the star
  cells and nothing else. Verified the header colour is identical on both pages
  and that page 3's table still renders its eight rows.
- **Each rating is one labelled image rather than five decorative ones.** The
  star row is the only thing carrying the score, so the group takes `role="img"`
  with an `aria-label` of "n out of 5" and the individual stars are
  `aria-hidden`. Without that a screen reader gets either silence for the cell or
  five meaningless graphics. The design draws only the earned stars rather than
  five with some greyed, which is why the name has to state the denominator.
  Verified all eight cells announce correctly.
- **The stars needed a stroke, and that is a real finding rather than styling.**
  The site's star gold `#f5b638` measures 1.67:1 against the white card, far
  under the 3:1 a meaningful graphic owes, so at low vision the shapes dissolve.
  Rather than change the fill - which would have made these stars a different
  colour from `.faq__stars` and `.backed__stars` - they carry a `#b45309`
  outline at 5.02:1, which makes the shape readable while the fill stays on
  brand. The design's own `#fbbf24` measures the same 1.67:1 class of failure.
- Column heads are two elements with a real trailing space, so "Thin Base +" and
  "Low Density" do not concatenate in the header's accessible name. Eighth
  component in this codebase to need that.
- **The page had gained a `Systems` section outside this work**, between writing
  the file and verifying it. Left in place as deliberate; the table sits between
  the hero and it, which is where the request put it. The page's doc comment
  claimed `Systems` "follows the hero", which stopped being true - corrected
  rather than left to mislead.
- Verification: `npm run build` passes (JS 427.38 kB).
  `scripts/verify-base-compare.mjs` at 1440x900, 768x1024, 390x844 and 360x780:
  four rows, star counts 5/2, 5/2, 5/3 and 2/5 exactly as drawn, every cell
  announcing "n out of 5", heads reading "Thin Base + Low Density" and "Thick
  Base + High Density" with the space intact, star fill `rgb(245, 182, 56)` and
  stroke `rgb(180, 83, 9)`, header `rgb(20, 22, 26)`, page overflow 0, zero
  console errors and zero failed requests. Page 3's comparison re-probed at 1440
  and 390 and unchanged.
- Files changed: new `src/components/BaseComparison.tsx`, new
  `scripts/verify-base-compare.mjs`, `src/site.ts` (`RatingRow`,
  `baseComparisonTitle`, `baseComparisonMax`, `baseComparisonHeads`,
  `baseComparisonRows`), `src/styles/global.css` (`.rateCompare` block),
  `src/pages/StickOnLifespan.tsx`, `README.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Rating stars: outline removed, size raised

- Request: remove the stroke on the stars and make them a more natural size.
- Stroke removed, `size` prop dropped from the component so the stylesheet's
  `clamp()` is the single source of the dimension, and the range raised from
  `clamp(17px, 1.6vw, 21px)` to `clamp(15px, 2.1vw, 28px)` - 28px at desktop
  against the previous 21px.
- **What removing the outline costs, recorded rather than glossed over:** the
  gold measures 1.67:1 against the white card, under the 3:1 a graphic owes when
  it alone carries information. It does not alone carry it here - each rating is
  a `role="img"` named "n out of 5" - so a screen reader is unaffected. The
  reader who loses out is the low-vision one who can see the cell but cannot
  separate gold from white. The `#b45309` outline solved that at 5.02:1 and is
  one line to reinstate. Flagged to the user; their call on their own design.
- **A real defect appeared with the larger size and was fixed.** Five stars plus
  gaps do not fit the rating column on a phone, and the flex row shrank them on
  the width axis only - measured 18x22 at 390px and 16x22 at 360px, so they
  rendered visibly squashed rather than merely smaller. `flex: 0 0 auto` plus a
  floor five stars can sit in. Verified square at 1920, 1440, 1100, 768, 390 and
  360, with no rating group exceeding its cell at any width.
- Verification: `npm run build` passes. Star counts still 5/2, 5/2, 5/3 and 2/5
  and every cell still announces "n out of 5" at every width; fill
  `rgb(245, 182, 56)`, stroke `none`; page overflow 0; zero console errors.
- Files changed: `src/styles/global.css` (`.rateCompare__star`),
  `src/components/BaseComparison.tsx` (dropped the `size` prop), `README.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Page 5: form section, and the heading moved to the top

- Request: add the homepage form section above the footer on Stick-On System
  Lifespan, with the heading at the top left rather than vertically centred as
  it is on the homepage, and fix the homepage too.
- `Form` reused unchanged - self-contained, takes no props - so the page gained
  an import and a line. Nothing was parameterised.
- **The centring was one declaration, and it was `.form__in`'s
  `align-items: center`.** Now `start`. Because both pages render the same
  component through the same rule, that single change moved the heading on the
  homepage and placed it correctly on page 5 at once, which is what "fix them
  too" asked for. Measured: the title's top offset within the grid is now 0 on
  both pages, matching the card's own top at desktop.
  - Worth stating why it was wrong rather than merely different: centring ties
    the heading's position to the card's height, so the taller the card grows
    the further the heading drifts down. Nothing about the design intends that.
- **The form's behaviour was re-tested on the new page, not assumed from the
  homepage.** Empty submit marks all three fields `aria-invalid` with every
  `aria-describedby` resolving to a real element and the three expected
  messages; a valid submit reaches the `role="status"` success panel. Zero
  console errors.
- Verified at 1440x900, 768x1024 and 390x844 on page 5 and 1440x900 and 390x844
  on the homepage: `align-items: start` throughout, two columns at desktop and
  one below, labels "Name", "Phone Number", "City", submit reading "Submit",
  reveal firing, page overflow 0, zero console errors and zero failed requests.
- Still no backend behind the form on either page - §7 stands unchanged.
- Files changed: `src/styles/global.css` (`.form__in`),
  `src/pages/StickOnLifespan.tsx`, `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Page 5: "Still Confused Between Bases?"

- Request: build the supplied section above the range gallery, engaging,
  interactive and user friendly, with any effect that makes it more useful.
- **The interaction is the content, not an effect added to it.** The copy says
  "Ask yourself:" and then lists five questions - so they are real checkboxes and
  each card keeps score, rather than bullets with an animation on top. The
  verdict lights once a majority is ticked. That is the most useful thing this
  section can do and it needed no library.
- Built on the platform's own control rather than divs with click handlers, which
  is what makes keyboard operation, the space key, focus, the checked state in
  the accessible tree and label-to-input association free and impossible to drift
  from the visuals. Two consequences worth recording:
  - The input is **visually hidden, not `display: none`** - a hidden input is not
    focusable and would take the keyboard with it.
  - The focus ring is on the **label**, because the input is the hidden element.
    Without that the entire set is invisible to a keyboard user.
- **The lit state is never colour alone.** A polite live region reads "3 of 5 —
  this sounds like you", so the threshold is stated in words and the card's glow
  is reinforcement. Verified the tally goes "0 of 5" to "3 of 5 — this sounds
  like you" and that only the ticked card flips to `data-met="true"`.
- **Two defects found in verification:**
  - The one-column breakpoint was 760px, so at 768 two cards still sat side by
    side with five questions each in about 330px, wrapping most to three lines.
    Now 900px.
  - The tally rendered at 13px, under the 14px body floor. Raised to a 0.875rem
    minimum.
- `/gsap-scrolltrigger`, `/animated-component-libraries` and
  `/web3d-integration-patterns` were invoked. None of those libraries are in this
  project and none were added; the entrance is `useReveal` with a stagger and the
  tick is a CSS scale transition.
- Verification: `npm run build` passes (JS 430.34 kB).
  `scripts/verify-base-choice.mjs` at 1440x900, 1100x900, 768x1024, 390x844,
  360x780 and reduced motion: two cards at full opacity, two columns above 900px
  and one below, ten checkboxes with every label resolving to its input, ticking
  three flipping only the first card, keyboard focus landing on an input and
  Space toggling it, a solid focus ring on the label, both legends reading "Ask
  yourself:", min font 14.00px, page overflow 0, zero console errors and zero
  failed requests.
- Files changed: new `src/components/BaseChoice.tsx`, new
  `scripts/verify-base-choice.mjs`, `src/site.ts` (`BaseOption`,
  `baseChoiceTitle`, `baseChoicePrompt`, `baseChoiceOptions`),
  `src/styles/global.css` (`.baseChoice` block),
  `src/pages/StickOnLifespan.tsx`, `README.md`.
- Page 5 order is now hero, rating table, base chooser, systems, form.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Base chooser: interaction removed, bullets, rounded cap

- Request: remove the "0 of 5" tally, replace the checkboxes with bullet points,
  and curve both ends of the cards' blue top stroke so it merges with the card.
- Interaction removed. **What mattered was removing all of it rather than just
  the visible parts:** the `fieldset`, the `legend` and the polite live region
  existed only to serve form controls, and left behind they would be markup
  describing nothing - a legend with no fields, a live region that never
  updates. The prompt is now an ordinary paragraph and the questions an ordinary
  `<ul>`. The `data-met` state, its glow and the focus-ring rules went too.
  Verified zero inputs, zero legends, zero live regions and zero tally elements
  survive at every width.
- Bullets are drawn `<span>`s rather than `list-style`, so they can be sized and
  coloured against the text; the list is still a real `<ul>` announced as five
  items. Ten items and ten dots across the two cards.
- **The cap needed clipping, not only rounding.** Rounded ends alone still left
  the bar's corners proud of the card's own radius, reading as something laid on
  top. It now carries a `999px` radius on its lower corners *and* the card
  carries `overflow: hidden`, so the bar meets the corner curve. Measured cap
  radius `0px 0px 999px 999px`, inset 14.4px at desktop and 10px on a phone,
  card `overflow: hidden` with a matching 14.4px radius.
- **A verification-script bug of my own, fixed:** the script still asserted the
  removed interaction and crashed on `base.met.join` after the component lost
  that state. It now asserts the static structure and, more usefully, that none
  of the interactive scaffolding is left behind.
- Verified at 1440x900, 1100x900, 768x1024, 390x844, 360x780 and reduced motion:
  two cards at full opacity, two columns above 900px and one below, two lists of
  five with ten dots, both prompts reading "Ask yourself:", min font 14.00px,
  page overflow 0, zero console errors and zero failed requests.
- The data in `site.ts` is unchanged, so reinstating the interaction is a
  component-and-CSS job only.
- Files changed: `src/components/BaseChoice.tsx` (rewritten static),
  `src/styles/global.css` (`.baseChoice` block rewritten),
  `scripts/verify-base-choice.mjs`, `README.md`.
- Verification: `npm run build` passes (JS 429.73 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Base chooser: blue top cap removed

- Request: remove the blue stroke at the top of each card.
- `.baseChoice__card::before` deleted.
- **The card's `overflow: hidden` was deleted with it**, which is the part worth
  recording. That rule existed for one reason - clipping the cap to the corner
  radius - and left behind it is a clip with nothing to clip: invisible now, and
  a trap for whatever gets added to this card next, since it would silently cut
  off any shadow, ring or overflowing child.
- The verification script now asserts the cap stays gone rather than measuring
  its radius, and reports it alongside the other removed scaffolding, so a
  future reinstatement has to be deliberate.
- Verified at 1440x900, 1100x900, 768x1024, 390x844, 360x780 and reduced motion:
  no `::before` on either card, `overflow: visible`, card radius intact at
  14.4px desktop and 12px phone, two lists of five with ten dots, no inputs,
  legends, live regions or tally elements, min font 14.00px, page overflow 0,
  zero console errors.
- Files changed: `src/styles/global.css` (`.baseChoice` card rules),
  `scripts/verify-base-choice.mjs`, `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Page 5: "Choose Your Perfect Balance" dark glass stage

- Request: build the supplied section below the hero as a dark glassmorphism
  stage with the text-reveal effect used elsewhere, having first understood what
  the section is saying.
- **What it says, since it drove the build:** three qualities are on offer and no
  system gives all of them. Option A carries two - ultra-natural look, extreme
  comfort - and Option B the remaining one, long lifespan. The line "You can get
  only 1 out of 2" is about the *options*, not the qualities. Placed directly
  under the hero because it frames every section beneath it, the rating table
  included.
- **The orbs are load-bearing, not decoration.** `backdrop-filter` over a flat
  ground is an invisible effect at a real paint cost - with one colour behind the
  panel there is nothing for a blur to blur. Three blurred colour orbs sit behind
  the panels and the glass frosts those. Same reasoning as `BookConsultation`'s
  ambient field on page 3; recorded in the component and the stylesheet so nobody
  deletes them and leaves an invisible filter behind.
- An `@supports not (backdrop-filter)` fallback drops the panels to a solid dark
  ground, so where the filter is unavailable they stop being glass rather than
  losing the measured contrast.
- Headline scrubbed word by word, the dark-stage idiom from `StillConfused`, with
  the sweep spanning this headline's own word count. Verified none lit before
  entry, all eight lit after, and all eight already lit under reduced motion.
- **The run-on accessible-name bug appeared for the ninth time**, and this was
  the flex-row variety: the heading announced as
  "ChooseYourPerfectBalance:Look,Comfort,OrLifespan?". Fixed with an
  `aria-label`, since text nodes inside a flex row become anonymous flex items
  and gain their own gaps. The verification script now asserts the label and
  keeps `textContent` as a separate field, because the run-on there is deliberate.
- **Two defects found by comparing the render with the design:**
  - The title's `max-width: 24ch` rewrapped the supplied break and dropped
    "Look," onto a line of its own, making three lines instead of two. Now 38ch;
    measured one visual line per supplied line at 1440, 1100 and 768.
  - Panels sized to content, so Option B floated shorter than A - which reads as
    a mistake rather than as less content. `align-items: stretch`; measured equal
    at 181/181, 164/164 and 149/149. On a phone they are one per row, so equal
    heights would only pad the shorter one and are correctly not applied.
- Emoji replaced with lucide marks as every other section does, keeping `site.ts`
  import-free by storing icon keys. Contrast on the dark ground: headline and
  panel titles 19.43:1, trait text 10.19:1, the note's dim half 7.57:1. CTA uses
  `--grad-ink` rather than `--grad` - white on the latter's lighter stop measures
  3.44:1 and this label is not large text.
- `/gsap-scrolltrigger` and `/animated-component-libraries` were invoked. Neither
  library is in this project and neither was added; the scrub is `motion`'s
  `useScroll` with a spring, as `StillConfused` already used.
- CTA points at `#consult`, which does not resolve - the same dead anchor pages 2
  and 4 carry. Listed in section 7.
- Verification: `npm run build` passes (JS 433.64 kB). `scripts/verify-balance.mjs`
  at 1440x900, 1100x900, 768x1024, 390x844, 360x780 and reduced motion: two
  panels at full opacity, three orbs, `backdrop-filter: blur(22px) saturate(1.6)`
  applied, three traits with three lucide marks, eight headline words going 0 to
  8 lit, CTA 204x50 over the 44px floor, min font 15.00px, page overflow 0, zero
  console errors and zero failed requests.
- Files changed: new `src/components/BalanceChoice.tsx`, new
  `scripts/verify-balance.mjs`, `src/site.ts` (`BalanceTrait`, `balanceTitle`,
  `balanceOptions`, `balanceNote`, `balanceCta`), `src/styles/global.css`
  (`.balance` block), `src/pages/StickOnLifespan.tsx`, `README.md`.
- Page 5 order is now hero, balance stage, rating table, base chooser, systems,
  form.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Balance stage: wider panels, no icon disc, new icon, pointer tilt

- Request: widen both cards to match the reference, remove the background circle
  behind the trait icons, use a related icon for "Ultra-natural look", and add a
  tilt effect to both cards.
- **Width.** `max-width` raised 860px to 1060px - but the first attempt measured
  670px, because `.balance__in` is a centred flex column and the grid shrank to
  its content, so the `max-width` never applied. `width: 100%` on the grid. Cards
  went 323px to 518px each at 1440.
- **The disc behind each icon is gone**, and the trait column narrowed from 28px
  to 18px to match. The three glyphs already differ from one another, so the
  container was adding weight without adding meaning.
- **Icon swapped from `Clover` to `Sparkles`.** `Clover` was the literal match
  for the design's emoji but rendered as an unrecognisable knot at that size and
  says nothing about *looking* natural. The trio now reads apart at a glance:
  sparkles, heart, timer.
- **The tilt needed entrance and tilt to share one owner, which was the whole
  difficulty.** The entrance was a CSS `transform`; adding a pointer-driven
  rotation would have put two rules on `transform`, and the inline one always
  wins - the card would have snapped to its final position the moment the pointer
  arrived. Both now run through motion, which composes individual transform
  properties rather than overwriting a shorthand. The CSS `opacity`/`transform`
  and the reduced-motion override were removed as a consequence, not left to rot.
  - `transformPerspective` is set per card rather than as a shared `perspective`
    on the grid: shared perspective makes the card furthest from centre look
    sheared instead of tilted.
  - **Tilt is not armed without a hover-capable pointer**, rather than merely
    unused. On a touchscreen `pointermove` fires during a scroll-drag, so a card
    would tip as the reader scrolls past it and stay tipped.
  - `will-change: transform` added here specifically, unlike the entrance-only
    animations elsewhere in this stylesheet, because this element rotates on
    every pointer move.
- **A verification trap worth recording:** `transformPerspective` produces a
  `matrix3d` even at zero rotation, so my first check - "is the transform 3D" -
  reported tilt as working on mobile and under reduced motion, where it is
  deliberately off. The check now compares the matrix at rest against the matrix
  while hovering, and also asserts it returns to rest.
- Verified at 1440x900, 1100x900, 390x844 and reduced motion: grid 1060px at
  desktop with 518px cards, icon marks with transparent background and no
  border, icons `sparkles,heart,timer`, tilt moving on hover at 1440 and 1100
  and not moving at 390 or under reduced motion, returning to rest in every
  case, page overflow 0, zero console errors.
- Files changed: `src/components/BalanceChoice.tsx` (new `TiltCard`, icon map),
  `src/styles/global.css` (`.balance` grid, card, mark, trait rules),
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Balance stage bottom-right orb changed to primary blue

- Request: replace the purple circle at the bottom right of "Choose Your
  Perfect Balance: Look, Comfort, Or Lifespan?" with the brand primary colour.
- Changed only `.balance__orb--b`: purple `rgb(124 58 237 / 0.42)` became the
  primary-blue channels from `--accent-b` (`#1769ff`) at the same 42% alpha.
  Its shared 50% orb opacity, size, blur, position, and glass effect are
  unchanged, so the edit changes hue without making that corner heavier.
- Extended `scripts/verify-balance.mjs` to assert the computed bottom-right orb
  colour and accept `VERIFY_URL` for production-preview checks. README now
  records that both large corner orbs use the brand primary, with the lower one
  intentionally softer.
- UI/UX Pro Max's colour search returned generic palettes that did not match the
  established brand. Used the verified project token instead of importing an
  unrelated palette. `caveman-compress` was not run because no memory-file path
  or compression task was supplied.
- Files changed: `src/styles/global.css`, `scripts/verify-balance.mjs`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,038 modules; CSS 140.64 kB, JS
  433.75 kB). Headless Chrome verified the computed primary-blue orb at
  1440x900, 1100x900, 768x1024, and 390x844 with two visible panels, three
  orbs, working glass blur, 15px minimum text, zero overflow, zero console
  errors, and zero failed requests. Desktop screenshot inspection confirmed
  the bottom-right glow is blue rather than purple.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Page 5 car analogy above the base rating table

- Request: reproduce the supplied sports-car-versus-Fortuner comparison section
  on "Stick-On System Lifespan", place it directly above "Thin Base Vs. Thick
  Base", use `Images/sport car.png` and `Images/suv.png`, and add restrained
  micro-interactions.
- Added `CarExample`: a labelled section with a two-line heading and two semantic
  comparison articles. Each card has its supplied studio image, title/formula,
  real pros and cons lists with lucide check/X marks, and a separated closing
  recommendation with the supplied emphasis.
- Placement is now hero, balance stage, **car analogy**, rating table, base
  chooser, systems gallery, form. The automated check asserts the analogy is
  the rating table's immediate previous sibling.
- Kept the reference's flat, separate image-and-panel construction. Wide screens
  use two equal columns; below 760px the cards stack. The image crop remains
  1.65:1 at every checked width and the cards are 506px each at 1440px.
- Micro-interactions are progressive: Motion owns the title/card one-shot
  entrance; a nested surface owns a 4px fine-pointer lift; its child image owns a
  2.5% zoom. Separate transform owners avoid conflicts. Touch layouts do not
  hover, and reduced motion settles immediately with hover transforms disabled.
- The two supplied 2K PNGs were inspected and converted to quality-90 JPEG web
  derivatives without resizing: `public/car-example/sports-car.jpg` (314,079
  bytes) and `fortuner-suv.jpg` (305,725 bytes), down from about 4 MB each.
- Named skill guidance: UI/UX Pro Max informed responsive hierarchy and semantic
  list treatment; Animated Component Libraries informed the progressive Motion
  reveal; GSAP ScrollTrigger and Web3D Integration Patterns informed transform
  ownership and the decision not to add duplicate GSAP/3D runtimes for a flat
  explanatory section. The UI/UX search helper could not run because no Python
  executable is available in the environment; established project tokens and
  patterns were used instead. Caveman kept user-facing updates compressed.
- Files changed: new `src/components/CarExample.tsx`, new
  `scripts/verify-car-example.mjs`, new `public/car-example/*.jpg`,
  `src/pages/StickOnLifespan.tsx`, `src/site.ts`, `src/styles/global.css`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `npm.cmd run build` passed (2,039 modules; CSS 143.91 kB, JS
  436.81 kB). Production-preview Chrome checks passed at 1440x900, 1100x900,
  768x1024, 390x844, 360x780, and 1440x900 reduced motion: two loaded 2K images,
  correct 2/2 pros/cons counts, expected two-to-one column switch, hover motion
  only on fine pointers, minimum text 14px, zero horizontal overflow, zero
  console errors, and zero failed requests. Desktop and mobile screenshots were
  visually inspected against the supplied reference.
- Not committed; belongs to the eventual version 2.

### 2026-08-26 - Align the Sports Car recommendation divider

- Request: move the Sports Car card's lower grey divider to the same vertical
  position as the Fortuner SUV divider in "Car Example: Think Of It Like This
  Before Choosing".
- The recommendation footer now reserves a shared 68px minimum block, uses
  border-box sizing, and vertically centres its copy with 11px block padding.
  This keeps the longer Sports Car sentence inside the same footer height when
  it wraps instead of letting that footer grow upward and raise its divider.
- Extended `scripts/verify-car-example.mjs` to measure each recommendation
  border at rest and fail when two-column dividers differ by more than 1px. The
  check moves the pointer away before measurement so the Sports Car card's
  intentional 4px hover lift cannot create a false alignment failure.
- UI/UX Pro Max's targeted layout search could not run because `py`, `python`,
  and `python3` are unavailable. Used the skill's layout-consistency fallback
  and the existing project pattern. Caveman kept user-facing output compressed.
- Files changed: `src/styles/global.css`, `scripts/verify-car-example.mjs`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: `scripts/verify-car-example.mjs` passed at 1440x900, 1100x900,
  768x1024, 390x844, 360x780, and 1440x900 reduced motion. Two-column divider
  positions matched exactly at 809/809px, 771/771px, and 775/775px; hover and
  reduced-motion checks, loaded assets, minimum 14px text, zero overflow, zero
  console errors, and zero failed requests also passed. `npm.cmd run build`
  passed (2,039 modules; CSS 143.96 kB, JS 436.81 kB). Desktop screenshot was
  visually inspected after the fix.
- Not committed; belongs to the eventual version 2.

### 2026-08-26 - Restore reference-style two-line recommendation footers

- Request: revise both lower card sentences after the compact 68px treatment
  looked worse than the supplied reference.
- Replaced browser-dependent wrapping with the reference's exact two visual
  lines per card. Each footer now has a muted lead-in followed by bold copy:
  Sports Car breaks before "every 3–4 months"; Fortuner SUV breaks before
  "compromising on realism". Both use matching 81px blocks with 18px vertical
  padding, so divider, copy baseline, and card bottom remain level.
- `carExampleCards[].note` is now structured as `lead` plus a two-item emphasis
  tuple in `site.ts`. `CarExample` renders the visual lines explicitly and gives
  the paragraph one unsplit `aria-label`, so the forced visual wrap does not
  fragment the sentence for assistive technology.
- Extended `scripts/verify-car-example.mjs` to assert two visual lines per card,
  exact accessible sentence names, equal divider positions, and equal footer
  heights. UI/UX Pro Max used its layout-consistency fallback because the local
  search helper still has no Python runtime. Caveman kept user-facing output
  compressed.
- Files changed: `src/site.ts`, `src/components/CarExample.tsx`,
  `src/styles/global.css`, `scripts/verify-car-example.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Verification: Chrome checks passed at 1440x900, 1100x900, 768x1024, 390x844,
  360x780, and 1440x900 reduced motion. Two-column divider positions matched at
  796/796px, 763/763px, and 762/762px; every footer measured 81px at all six
  sizes. Hover/reduced-motion behavior, minimum 14px text, zero overflow, zero
  console errors, and zero failed requests also passed. Desktop and mobile
  screenshots were visually checked against the supplied reference.
- `npm.cmd run build` passed (2,039 modules; CSS 143.99 kB, JS 437.01 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-26 - Increase car-card recommendation type

- Request: enlarge both closing recommendation sentences to match the supplied
  reference more closely.
- Raised `.carExample__note` from its former 14–15px range to a responsive
  14–16px range: 16px at 1440, 15.1px at 1100, 14.2px at 768, and 14px on
  phones. This strengthens the footer hierarchy on desktop without making the
  explicit reference line breaks overflow narrower cards.
- Tightened line-height from 1.5 to 1.45 and vertical padding from 18px to 17px,
  keeping both reference-style two-line footers at the same 81px height and
  preserving their aligned divider and card bottom.
- Extended `scripts/verify-car-example.mjs` to record both note font sizes and
  require 16px at the 1440px desktop check. UI/UX Pro Max used its documented
  typography/layout fallback because the local search helper still lacks a
  Python runtime. Caveman kept user-facing output compressed.
- Files changed: `src/styles/global.css`, `scripts/verify-car-example.mjs`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- Verification: Chrome checks passed at 1440x900, 1100x900, 768x1024, 390x844,
  360x780, and 1440x900 reduced motion. Both notes measured 16/16px on desktop;
  footer heights remained 81/81px and dividers 795/795px. Minimum text stayed
  14px, with zero overflow, zero console errors, and zero failed requests.
  Desktop screenshot was visually checked against the reference.
- `npm.cmd run build` passed (2,039 modules; CSS 144.00 kB, JS 437.01 kB).
- Not committed; belongs to the eventual version 2.

### 2026-08-26 - Page 5 two base-option cards and detail overlays

- Request: build the supplied "Two Base Options For Your Stick-On Hair System"
  section like page 4's `HairlineBenefits`, use the four supplied first/second
  option card and overlay images, and place it immediately above the car
  analogy on `#/stick-on-lifespan`.
- Added `BaseOptions`: two equal, full-button cards with the supplied copy and
  black 44px plus controls. The section is two columns above 760px and one below
  it. Each card opens its own large detail sheet with the specified title,
  benefit list, conclusion, and separate overlay artwork.
- The sheets reuse the established `HairBenefits` interaction contract: a
  dimmed/blurred scrim, focus moved to Close, trapped Tab navigation, Escape and
  scrim dismissal, scroll locking without layout shift, and focus returned to
  the exact opener. Card reveals and sheet transitions use the project's
  existing `motion` dependency; reduced motion settles immediately. No package
  was added.
- Mapped the supplied images to web-sized transparent PNG derivatives in
  `public/base-options/`: `first-option.png` (1088x944, 1,282,345 bytes),
  `second-option.png` (1088x944, 1,081,543 bytes),
  `first-option-overlay.png` (1077x1032, 1,482,005 bytes), and
  `second-option-overlay.png` (1077x1032, 1,288,406 bytes). Originals remain in
  `Images/`.
- Added `scripts/verify-base-options.mjs` for exact order/copy/assets, 2-to-1
  responsive columns, 44px controls, loaded images, both dialogs, focus trap
  and return, Escape/scrim closing, root scroll restoration, hover behavior,
  reduced motion, overflow, console errors, and failed requests. Updated the
  aggregate page verifier to assert the current eight-section order and use the
  same reliable headless-Chrome launch mode as the other page checks.
- UI Styling's dialog accessibility references guided the keyboard, focus, and
  scroll-lock behavior. Animated Component Libraries guided reuse of the
  installed Motion runtime and reduced-motion fallback. UI/UX Pro Max's search
  helper could not run because `py`, `python`, and `python3` are unavailable, so
  its documented layout-consistency fallback and the project's established
  `HairBenefits` pattern were used. Caveman kept user-facing output compressed.
- Files changed: new `src/components/BaseOptions.tsx`, new
  `scripts/verify-base-options.mjs`, new `public/base-options/*.png`,
  `src/pages/StickOnLifespan.tsx`, `src/site.ts`, `src/styles/global.css`,
  `scripts/verify-stick-on-lifespan.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Verification: targeted Chrome checks passed at 1440x900, 1100x900, 768x1024,
  390x844, 360x780, and 1440x900 reduced motion. Expected columns were 2/2/2/1/1/2;
  card widths matched within every row; both overlays opened with 3/2 benefit
  rows; hover ran only on fine pointers; scroll/focus behavior passed; and all
  cases had zero overflow, console errors, or failed requests. Desktop and
  mobile closed/first-overlay/second-overlay screenshots were visually checked
  against the three references. The aggregate page check passed at desktop,
  mobile, landscape, and reduced motion, including the exact new section order.
  `scripts/verify-car-example.mjs` also passed unchanged at all six sizes.
- `npm.cmd run build` passed (2,040 modules; CSS 149.58 kB, JS 443.68 kB).
- No remaining issue. Not committed; belongs to the eventual version 2.

### 2026-08-25 - Balance orb recoloured; rating table background white

- Two small requests, both scoped so nothing else moved.
- **The balance stage's bottom-right orb is brand blue.** It was violet
  (`rgb(124 58 237 / 0.42)`), the one hue on the page outside the palette; now
  `rgb(23 105 255 / 0.42)`, kept softer than the upper-left orb so the two still
  read as separate lights rather than one wash. The orbs remain load-bearing -
  they are what the glass panels frost.
- **"Thin Base Vs. Thick Base" now sits on white.** Scoped to `.rateCompare`, not
  `.compare`, so page 3's `.patchCompare` is untouched - verified page 5 reports
  `rgb(255, 255, 255)` and page 3 still `rgb(244, 245, 248)` at both 1440 and
  390.
  - Worth checking rather than assuming: the table card is itself white, so on a
    white section it could have disappeared. It does not - the card keeps its
    `rgba(15, 23, 42, 0.08)` border and its `#14161a` header row, which is what
    actually defines its edge. Confirmed visually.
- Verified page 3's table still renders its eight rows and page 5's its four,
  page overflow 0 and zero console errors on both pages at both widths.
- Files changed: `src/styles/global.css` (`.balance__orb--b`, `.rateCompare`),
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Page 5 mobile audit

- Request: check whether the page is mobile friendly, and supply a phone link.
- Audited the **production build** at 320, 360, 390 and 414, plus iPhone SE,
  iPhone 13 and Pixel 5 device profiles: horizontal overflow, any element wider
  than the viewport, tap targets under 44px, text under 14px, console errors and
  failed requests.
- **One real break found and fixed: the car-example card spilled off screen at
  320px.** `.carExample__surface` is `display: grid` with no
  `grid-template-columns`, so its implicit column was `auto` - max-content sized
  - and `.carExample__media` carries a grid item's default `min-width: auto`.
  The photograph's 2192px intrinsic width pushed the column to 334px inside a
  280px parent, and the section's own `overflow-x: hidden` hid the damage rather
  than preventing it, so the page reported zero overflow while a third of the
  card sat off screen. Fixed with `grid-template-columns: minmax(0, 1fr)`.
  - The `min-width: 0` already on `.carExample__card, .carExample__surface`
    fixes those elements as grid *items* of their parents; it does nothing for
    their children. That distinction is why the existing guard did not catch it.
  - Re-measured at 320, 360, 390 and 414: nothing wider than the viewport.
- **Three sub-14px text findings, reported rather than changed**, because two of
  them are shared components and changing them moves other pages:
  - `.guideHero__eyebrow` at 12.48px - the badge on all three guide heroes,
    already logged on 2026-08-25 when page 5's hero was built.
  - `.baseOptions__tag` at 11.52px - page 5 only, the "1st Option"/"2nd Option"
    chips.
  - `.form__row label` at 13.76px - the Name/Phone/City labels, which appear on
    the homepage as well as page 5.
- Everything else clean at every width: tap targets all at or above 44px, zero
  console errors, zero failed requests, no horizontal page scroll.
- Note: page 5 has gained `baseOptions` and `carExample` sections outside this
  work. Order is now hero, balance, baseOptions, carExample, compare, baseChoice,
  systems, form.
- Files changed: `src/styles/global.css` (`.carExample__surface`).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Balance heading: three lines on mobile, two on desktop

- Request: on mobile break the heading as "Choose Your Perfect Balance:" /
  "Look, Comfort," / "Or Lifespan?", leaving the desktop alone.
- **The two groupings do not nest**, which is what shaped the solution: the
  phone puts "Look," and "Comfort," on one line and those sit either side of the
  desktop break. The heading had been one element per supplied line, so those two
  words were in different flex containers and could not share a visual line at
  all. Rendering a second line array would have meant two copies of every word in
  the DOM.
  - `balanceTitle` is now one flat string and `balanceTitleBreaks` holds the
    break indices per breakpoint, written next to the numbered copy so they get
    renumbered if the wording changes. The heading is a single wrapping flex row.
- **The break is a zero-height full-width flex item placed before the word**, not
  a `flex-basis: 100%` on the word. The first attempt did the latter and it gives
  the flagged word the whole row to itself - measured five lines on a phone where
  three were wanted, and the desktop unchanged only by luck.
  `display: none` outside its breakpoint, so an inactive break is not a flex item
  and contributes no gap.
- **A second fix was needed for the grouping to actually hold.** At 360 and 320
  the first line wrapped anyway, giving four lines: "Choose Your Perfect
  Balance:" needs about 18px of this weight to sit in a 320px screen's 280px of
  content and the existing floor is 22.4px. A `max-width: 420px` ramp
  (`clamp(1.05rem, 5.7vw, 1.4rem)`) holds three lines down to 320.
- Kept the copy's "Or" rather than the lowercase "or" in the request, since the
  other two lines matched the existing capitalisation exactly.
- Verified at 1440, 1100, 761, 760, 430, 414, 390, 375, 360 and 320: two lines at
  761 and above with the wording unchanged from before, three lines at 760 and
  below reading exactly as requested, all eight words lit, the `aria-label`
  unchanged at every width, page overflow 0 and zero console errors.
- Files changed: `src/site.ts` (`balanceTitle`, `balanceTitleBreaks`),
  `src/components/BalanceChoice.tsx` (flat word list, break elements),
  `src/styles/global.css` (`.balance__break`, narrow-screen type ramp),
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Balance heading: mobile back to two lines

- Request: on mobile make the heading "Choose Your Perfect Balance:" / "Look,
  Comfort, Or Lifespan?" - two lines rather than the three set an hour earlier.
- One-word change: `balanceTitleBreaks.narrow` from `[4, 6]` to `[4]`, dropping
  the break before "Or". The structure built for the three-line version - flat
  word list, breaks as indices, zero-height break elements - carried this with no
  other edit, which is what it was for.
- The `max-width: 420px` type ramp added for the three-line version is still
  earning its place: at the 22.4px floor "Look, Comfort, Or Lifespan?" would wrap
  on a narrow phone and give three lines again. Verified two lines down to 320px.
- **Desktop deliberately untouched**, per the standing instruction from the
  previous request. It is still two lines split at a different point -
  "Choose Your Perfect Balance: Look," / "Comfort, Or Lifespan?" - so the two
  breakpoints now show the same heading grouped differently. Flagged to the user
  in case they want the wide layout to match; it is a one-word change to
  `breaks.wide`.
- Kept the copy's "Or" rather than the lowercase "or" written in the request, for
  the second time: changing it would alter the string on every breakpoint,
  including the desktop the user asked not to touch.
- Verified at 1440, 1100, 761, 760, 430, 414, 390, 375, 360 and 320: two lines
  everywhere, the wide grouping unchanged at 761 and above, the requested
  grouping at 760 and below, all eight words lit, `aria-label` unchanged, page
  overflow 0, zero console errors.
- Files changed: `src/site.ts` (`balanceTitleBreaks.narrow`), `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - New page: "Clip-On System Lifespan"

- Request: start the Clip-On page, which is similar to the Stick-On page, with
  image fields left blank until the assets arrive.
- Route `#/clip-on-lifespan` was already linked from the nav, as `/stick-on-
  lifespan` had been - checked before creating the file rather than after.
  Both "Confused? We'll Guide You" entries now resolve.
- **Almost no new code.** `BaseComparison` and `BaseChoice` carry identical
  content on both pages and are rendered bare. `BaseOptions` gained optional
  `title`/`options` props defaulting to the Stick-On data, so its existing bare
  call site needed no edit - the sixth consolidation of this kind, after
  `GuideHero`, `Checklist`, `HairBenefits`, `StillConfused` and `ScrollStack`.
  Only the hero is a new file and it is a `GuideHero` wrapper.
- `BalanceChoice` and `CarExample` are deliberately absent: they are not in this
  page's designs.
- **"Blank image fields" was implemented as a visible placeholder, not an empty
  `src`.** An unsupplied `src` renders a broken-image glyph, which looks like a
  fault rather than a gap. `Photo` was extracted from `HairBenefits` into
  `src/components/Photo.tsx` and now backs `GuideHero` and `BaseOptions` as
  well; it falls back to a labelled frame carrying the expected filename and
  dimensions.
  - The swap costs nothing later: the real `<img>` is always rendered and only
    falls back when the file is genuinely not served, so dropping files in at
    the declared paths removes the frames with no code change and no flag to
    remember.
  - Awaiting, with the dimensions declared for each:
    `/clip-on-lifespan/thumbnail.png` 2240x1260,
    `/clip-on-base-options/first-option.png` 1088x944,
    `/clip-on-base-options/first-option-overlay.png` 1077x1032,
    `/clip-on-base-options/second-option.png` 1088x944,
    `/clip-on-base-options/second-option-overlay.png` 1077x1032. Sizes are the
    Stick-On equivalents and should be corrected if the real files differ.
- Verification: `npm run build` passes (JS 447.28 kB). Probed at 1440x900,
  768x1024, 390x844 and 320x568: order `guideHero > compare > baseOptions >
  baseChoice > systems > form`, `<h1>` reading "How Long Does a Clip-On Hair
  System Last?", eyebrow "Clip-On System Lifespan", three bold spans in the
  lede, the base-options heading announcing "Two Base Options For Your Clip-On
  Hair System", two option cards, four table rows, two choice cards, three
  placeholder frames, **zero broken images**, page overflow 0, nothing wider
  than the viewport, zero console errors.
  - Both overlays opened and checked: `role="dialog"`, `aria-modal="true"`,
    correct clip-on titles and points, focus moving to the close button and
    returning to the exact card that opened it on Escape.
- Files changed: new `src/components/Photo.tsx`, new
  `src/components/ClipOnLifespanHero.tsx`, new `src/pages/ClipOnLifespan.tsx`,
  `src/components/BaseOptions.tsx` (props, `Photo`),
  `src/components/GuideHero.tsx` (`Photo`), `src/site.ts` (clip-on hero and
  base-option content), `src/styles/global.css` (`.photoSlot`), `src/App.tsx`
  (route), `README.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-25 - Clip-On page: photography installed

- Request: install the five supplied images on the Clip-On page.
- All five resized from the originals and placed at the paths the page already
  declared, so no code beyond the dimensions had to change:
  - hero `Group - 2 of 38.png` 4480x2520, 3.32 MB to
    `/clip-on-lifespan/thumbnail.png` 2240x1260, 2.03 MB
  - `Cthinbase.png` 2164x1884, 3.52 MB to
    `/clip-on-base-options/first-option.png` 1088x948, 0.94 MB
  - `Cthickbase.png` 2176x1884, 3.14 MB to
    `/clip-on-base-options/second-option.png` 1088x942, 0.86 MB
  - `COthinbase.png` 2832x2588, 6.03 MB to
    `/clip-on-base-options/first-option-overlay.png` 1077x984, 1.01 MB
  - `COthickbase.png` 2832x2516, 5.46 MB to
    `/clip-on-base-options/second-option-overlay.png` 1077x956, 0.94 MB
  - All are transparent cut-outs, so all stay PNG. Total 20.47 MB down to
    5.78 MB.
- **The declared dimensions had to be corrected, and that was the one real trap.**
  The placeholders carried the Stick-On page's sizes (1088x944 and 1077x1032) and
  the supplied files do not share those aspect ratios. Left as they were, every
  image would have reserved the wrong space and shifted the layout as it loaded.
  Each `width`/`height` is now measured from the shipped file: 948, 942, 984 and
  956 respectively.
- The two card images differ from each other by 6px in height (948 against 942).
  The grid equalises the cards regardless - measured equal at 1440, 768, 390 and
  320 - so nothing further was needed, but it is worth knowing the sources are
  not identical.
- Verification: `npm run build` passes. Probed at 1440x900, 768x1024, 390x844 and
  320x568: **zero placeholder frames and zero broken images**, all files loading
  at their declared natural sizes, option cards equal height at every width, page
  overflow 0, nothing wider than the viewport, zero console errors and zero
  failed requests. Both overlays opened: correct file in each, drawn 649x621 with
  nothing clipped top or bottom.
- Files changed: `src/site.ts` (dimensions and the block's comment), five new
  files under `public/clip-on-lifespan/` and `public/clip-on-base-options/`,
  `README.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Clip-On base options: three images replaced with updated versions

- Request: upload updated versions of the two option card images and the
  thick-base overlay.
- **Confirmed the sources had actually changed before touching anything**, since
  the paths were the same three installed on 2026-08-26. All three carried
  today's mtimes (09:33-09:34 against yesterday's 14:43) and different byte
  sizes: 3.52 to 3.49 MB, 3.14 to 2.82 MB and 5.46 to 4.88 MB. Same pixel
  dimensions, so re-exports rather than recrops.
- Re-ran the same resize pipeline. Outputs:
  - `first-option.png` 1088x948, 0.94 MB
  - `second-option.png` 1088x942, 0.79 MB (was 0.86 MB)
  - `second-option-overlay.png` 1077x956, 0.85 MB (was 0.94 MB)
- **`site.ts` needed no edit**, and that was worth checking rather than assuming:
  the output dimensions are identical to the previous versions, so the declared
  `width`/`height` still match the files and nothing reserves the wrong space.
- The thin-base overlay and the hero thumbnail were not in the request and were
  deliberately left alone; `first-option-overlay.png` is still 1077x984, 1.01 MB.
- Verification: `npm run build` passes. Probed at 1440x900 and 390x844: zero
  placeholder frames, zero broken images, both cards equal height (558/558 and
  413/413), page overflow 0, zero console errors, zero failed requests. Both
  overlays opened and re-checked - correct file in each, drawn 649x621, nothing
  clipped.
- Files changed: three files under `public/clip-on-base-options/`.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Base-options overlay: scrollbar on the thick-base sheet

- Report: the "Thick Base + High Density" overlay showed a scrollbar; the user
  suggested moving the overlay image up.
- **Measured before changing anything, and the suggested cause was not the
  cause.** The sheet is sized by its copy column, not the photograph - 629px of
  copy against a 621px image, with the art column merely stretching to match. So
  moving or shrinking the image would have changed nothing.
- What the 629px was: about 101px of the copy column's own vertical padding,
  plus title 64, intro 43, the three point cards 299, and the conclusion 50.
- **Why only the second card.** Card one measured exactly 589/589 at 1440x640 -
  fitting to the pixel - while card two measured 629 against the same 589. Its
  notes wrap to two lines more often, and that costs precisely 40px. That is why
  the thin-base sheet never showed a scrollbar and the thick-base one did.
- Fixed with three viewport-height steps that reclaim space from padding and
  gaps as the window shortens: at 780px, 680px and 600px of height. Nothing was
  taken from type size or line height - min font stays 14.00px at every step -
  because those are content, where padding is breathing room.
- **`overflow-y: auto` was deliberately left on the sheet.** Below the point
  where even the tightest step is not enough the sheet must still scroll:
  clipping a dialog's content is worse than a scrollbar. The scrollbar simply no
  longer appears at any realistic window height.
- Verified both cards on both pages: no scrolling from 560px of viewport height
  upward, tested at 1440x900, 1366x768, 1216x677 (the reported size), 1440x640,
  1440x600 and 1280x560, with the closing line in view in every case. At 540 the
  thick sheet scrolls again, which is correct and intended.
- The Stick-On page shares this sheet and was re-probed at three sizes: both
  cards fit, `role="dialog"` intact, focus moving to the close button and
  returning to the card that opened it. Zero console errors throughout.
- Files changed: `src/styles/global.css` (three `max-height` blocks before
  `.baseOptions__item`).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Stick-On base options: three images replaced

- Request: updated versions of the two option card images and the thick-base
  overlay on the Stick-On System Lifespan page.
- Confirmed all three sources were newer than the installed files before
  touching anything, as with the Clip-On set.
- Installed:
  - `Sthinbase.png` 2176x1888, 3.46 MB to `/base-options/first-option.png`
    1088x944, 1.04 MB
  - `Sthickbase.png` 2176x1888, 2.53 MB to `/base-options/second-option.png`
    1088x944, 0.78 MB
  - `SOthickbase.png` 2744x2580, 4.18 MB to
    `/base-options/second-option-overlay.png` 1077x1012, 0.86 MB
- **One declared dimension needed correcting and it was not obvious.** Both cards
  are exactly twice the target width, so they land on 1088x944 and the declared
  values still hold. The overlay does not: 2744x2580 scales to 1077x**1012**,
  where `site.ts` declared 1032. Left alone it would have reserved 20px of space
  the file does not fill and shifted the sheet as the image loaded. Corrected for
  that entry only - the first overlay was not replaced and keeps its 1032.
- The thin-base overlay and the hero were not in the request and were left alone.
- Verified at 1440x900, 1216x677 and 390x844: zero placeholder frames, zero
  broken images, both cards equal height, both sheets still fitting without a
  scrollbar after the swap (the short-viewport work from earlier today holds
  with the new taller-content images), nothing clipped, zero console errors and
  zero failed requests.
- **Observation for the user, not a defect:** the new Stick-On card images are
  the mannequin alone, where the Clip-On cards carry a circular base inset. The
  two sibling pages now differ in that respect. It is what the supplied files
  contain, so it has been left as supplied.
- Files changed: three files under `public/base-options/`, `src/site.ts` (the
  second overlay's height).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Clip-On rating table: tinted ground

- Request: give "Thin Base Vs. Thick Base" on the Clip-On page the same
  background as "Still Confused Between Bases?".
- **Could not be a global change.** Both pages render the same `BaseComparison`,
  and the Stick-On page's white ground was asked for explicitly on 2026-08-25 -
  editing `.rateCompare` directly would have undone that request while granting
  this one.
- `BaseComparison` gained an optional `ground` prop (`'white' | 'tint'`,
  defaulting to `'white'`) which sets a `data-ground` attribute; the stylesheet
  keys off that. The Clip-On page passes `'tint'`; the Stick-On page's bare call
  site needed no edit.
- Verified the tint is the same value rather than merely similar: the Clip-On
  table and `.baseChoice` both report `rgb(244, 245, 248)` at 1440x900 and
  390x844. The Stick-On table still reports `rgb(255, 255, 255)` at both.
- Four rows on both pages, table card still white against either ground, page
  overflow 0, zero console errors.
- Files changed: `src/components/BaseComparison.tsx` (the prop),
  `src/styles/global.css` (`[data-ground]` rules),
  `src/pages/ClipOnLifespan.tsx`, `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Clip-On page content audit

- Request: audit the Clip-On System Lifespan page's content for clarity, apply
  recommended wording, keep the design identical.
- **One factual contradiction found, and it was the page arguing with itself.**
  The shared "Still Confused Between Bases?" questions carry stick-on lifespans:
  "changing the system every 3 to 4 months" and "lasts 6 to 8 months". This
  page's own overlays say clip-on thin lasts 6-8 months and thick 12. So the
  reader was told 6-8 in one section and asked about 3-4 for the same option two
  sections later - and the "6 to 8" question pitched for thick actually
  described thin on this page. The hero's whole claim is that clip-ons outlast
  stick-ons, so shared numbers could never be right on both pages.
  - `BaseChoice` gained an `options` prop defaulting to the stick-on set (bare
    call site untouched); `clipOnBaseChoiceOptions` differs in exactly the two
    figures, sourced from this page's own overlay conclusions.
- Three clarity edits, kept at like-for-like length so the layout cannot move:
  - Hero lede: "It depends on the density you choose" now "the base and density
    you choose" - the page's own table shows lifespan tracks the base as much as
    the density. Also "**less wear** and tear" no longer bolds half an idiom:
    "**less wear and tear**".
  - Thin overlay, "Gradual Thinning" note: "keeping it realistic" said why it is
    tolerable, not what happens - now "Hair reduces slowly over time, just like
    natural hair."
  - Thick overlay, "Long-Lasting Fullness" note: "for a much longer period of
    time" named no comparison - now "far longer than a thin base."
- **Audited and deliberately unchanged:** the rating table (relative stars work
  on both pages), option card titles/descriptions/tags, overlay titles and
  intros, both verdicts, the hero title and eyebrow, and the "Durable with Care"
  12-month note (already the source of truth the choice questions now agree
  with).
- Design verified identical: lede still 3 lines at 1440, choice cards 358/358 on
  both pages, overlays still fit at 1440x640 - overlay 2's content in fact
  dropped 629 to 589px because the reworded note un-wrapped a line, restoring
  the slack the 2026-08-27 scrollbar fix was protecting. Stick-on page re-probed:
  its questions still read 3-4 and 6-8, its lede untouched, zero console errors
  on both pages.
- Files changed: `src/components/BaseChoice.tsx` (options prop), `src/site.ts`
  (`clipOnBaseChoiceOptions`, lede, two notes), `src/pages/ClipOnLifespan.tsx`,
  `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Stick-On page content audit

- Request: audit the Stick-On System Lifespan page and apply recommended
  content, leaving the "Two Base Options" section untouched.
- **No factual contradictions found** - the counterpart of the Clip-On defect
  does not exist here. Checked specifically: the "Still Confused Between Bases?"
  questions state 3-4 and 6-8 months, which match this page's own overlays, and
  the car metaphor's "changing it every 3-4 months" agrees with both. The
  numbers on this page were always the stick-on numbers; the Clip-On page was
  the one borrowing them wrongly.
- Three clarity edits, all in the balance stage:
  - **The constraint line, the weakest sentence on the page.** The title names
    three qualities, the cards show two options, and then "You can get only 1
    out of 2." arrives with no noun - the reader must work out that it counts
    options, not qualities. Now "**You can choose only 1 of these 2 options.**"
    A/B-measured the wrap before shipping: 2 lines at 1440 and 390 as before,
    and at 320 the old text was already 3 lines, so the layout moved nowhere.
  - Two trait labels paired a noun with an adjective: "Extreme comfort and
    lightweight" is now "Extremely comfortable and lightweight", and "Long
    lifespan and durable" is now "Long-lasting and durable".
- **Audited and deliberately unchanged:** the hero (title, lede, eyebrow - the
  lede answers "how long?" with "it depends what you value", which is the page's
  honest thesis, and the sections below supply the numbers), the car-example
  cards (metaphor consistent, lifespans right), the rating table, the choice
  questions and verdicts, "Option (A):"/"Option (B):" titles, and - per the
  instruction - the whole "Two Base Options" section. `Systems` and `Form` are
  site-wide shared components and out of scope for a page audit.
- Verified at 1440, 760, 390 and 320: title 2 lines, note 2 lines (3 at 320,
  same as before the edit), desktop cards equal at 168/168, all eight headline
  words lighting, page overflow 0, zero console errors. The longer trait label
  fits its card at every width.
- Files changed: `src/site.ts` (`balanceNote`, two trait labels), `README.md`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - New page: "Clip-On Hair System"

- Request: build the Clip-On Hair System page from fourteen supplied section
  designs, quickly, with imagery to follow.
- Route `#/clip-on-hair-system`. **The nav does not point here** - its "Clip-On
  Hair system" entry goes to `#/stick-on-or-clip-on#clip-on`, an anchor on the
  older page. Repointing it is one line in `site.ts`, left for the user since it
  changes an existing menu destination.
- **Eight of the thirteen sections are shared components; five are new.**
  - Bare, unchanged: `Checklist`, `Achievements`, `Backed`, `ClientStories`,
    `Faq`.
  - Parameterised here rather than copied: `HairlineTruth` (title/points) for
    "Why Thousands Of Men Choose American Hairline", and `Comparison` (title)
    for "Stick-On Vs. Clip-On Hair Systems".
  - **`Comparison` already held this exact table** - the same five rows, Stick-On
    column first. Only the heading differs between the two pages using it, so
    only the heading is a prop.
  - New: `ClipOnHero` (fifth `GuideHero` wrapper), `ClipFears`, `ClipPillars`,
    `ClipPerfectFor`, `ClipZyconCta`, `ClipLearnStickOn`.
- `ClipPerfectFor` is the third use of `ScrollStack`, after `Story` and
  `NaturalFront`. Six rows, so `Story`'s own 30vh step rather than the longer one
  three rows needed.
- Page order runs objection-first, which is why the sections sit as they do:
  `ClipFears` states what men are afraid of, `ClipPillars` answers those three
  fears in the same order (invisible, safe, secure), then `ClipPerfectFor` says
  who it suits.
- **Two run-on accessible names found and fixed - instances ten and eleven.**
  Both pre-existing in shared components, surfaced by probing this page:
  - `Comparison` mapped title lines to sibling spans with no separator:
    "Stick-On Vs. Clip-OnHair Systems".
  - `Achievements` used a bare `<br />`, which produces no text node:
    "Our BigAchievements".
  Both now carry real spaces. Verified on the homepage and the Stick-On or
  Clip-On page as well, which share those components.
  - A JSX slip while fixing the first: the explanatory comment landed inside the
    arrow function's return position, giving two expressions and a TS1109. Moved
    above the `.map`.
- **No photography yet.** Six `Photo` frames name the files they expect:
  `/clip-on-system/hero.png` 2240x1260, `fears.png` 1320x1000, three
  `pillar-*.png` 860x900, `learn-stick-on.png` 1120x1180. Sizes reserve space
  and should be corrected when the real files land.
- The "Premium Clip-On With Medicated Hygiene" Zycon teaser and its overlay
  (designs 9 and 10) are **not built yet** - they need the gradient card and a
  second dialog, and the page is otherwise complete. Flagged to the user.
- Verification: `npm run build` passes (JS 461.38 kB). Probed at 1440x900,
  900x900, 390x844 and 320x568: thirteen sections rendering, `<h1>` correct,
  twelve `<h2>`s all reading cleanly, six placeholder frames, zero broken
  images, page overflow 0 at every width, zero console errors and zero failed
  requests.
- Files changed: new `src/components/ClipOnHero.tsx`, `ClipFears.tsx`,
  `ClipPillars.tsx`, `ClipPerfectFor.tsx`, `ClipZyconCta.tsx`,
  `ClipLearnStickOn.tsx`, new `src/pages/ClipOnHairSystem.tsx`, new
  `public/icons/layers.svg`, `src/components/HairlineTruth.tsx` and
  `Comparison.tsx` (props + run-on fix), `src/components/Achievements.tsx`
  (run-on fix), `src/site.ts` (the page's content), `src/styles/global.css`
  (`.fears`, `.pillars3`, `.perfect`, `.zyconCta`, `.learnSo`), `src/App.tsx`.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Nav: "Clip-On Hair system" repointed to its own page

- Request: the nav's Clip-On Hair system entry did not reach the new page.
- Repointed that sub-item from `#/stick-on-or-clip-on#clip-on` - an anchor on
  the older combined page - to `#/clip-on-hair-system`.
- **The sibling "Stick-On Hair system" entry was deliberately left alone.** It
  still scrolls the older page's anchor, because no standalone Stick-On Hair
  System page exists yet. Repointing it would send readers to a route with
  nothing behind it.
- Verified by clicking through rather than by reading the href: from the
  homepage the entry now lands on `#/clip-on-hair-system` with its thirteen
  sections and the right `<h1>`, and the Stick-On entry still lands on the older
  page's stick-on anchor. Zero console errors.
- **Six other links still point at the old clip-on anchor** and were not
  changed, being outside the request: `whichOption`'s "Explore Clip-On System"
  CTA and five "Know more"-style cards across other pages. A reader clicking
  those now lands somewhere different from the nav, which is worth resolving -
  flagged to the user rather than changed unasked.
- Files changed: `src/site.ts` (one nav href).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Clip-On Hair System: six images installed

- Request: install the hero, fears, three pillar and learn-stick-on images, with
  the hero showing no play icon since it is a photograph rather than a video
  still.
- Installed at the paths the page already declared, so nothing but the
  dimensions changed:
  - hero 4480x2520, 3.08 MB to `/clip-on-system/hero.png` 2240x1260, 1.86 MB
  - fears 2176x1632, 2.96 MB to `fears.png` 1320x990, 1.41 MB
  - three pillars 1408x1392, 1.82/1.71/1.00 MB to `pillar-invisible.png`,
    `pillar-safe.png`, `pillar-secure.png` 880x870, 0.85/0.82/0.49 MB
  - learn 2444x2332, 3.27 MB to `learn-stick-on.png` 1120x1068, 0.97 MB
  - All transparent cut-outs, so all stay PNG. 13.84 MB down to 6.40 MB.
- **Five declared dimensions were wrong and were corrected**, which matters more
  than it sounds: the placeholders were guesses and none of the supplied files
  share those aspect ratios. Left alone, each would have reserved the wrong space
  and shifted its section as the image loaded. Now measured from the shipped
  files - 990 not 1000, 880x870 not 860x900, 1068 not 1180.
- **The play mark is now a `GuideHero` prop rather than always drawn.**
  `showPlay` defaults to `true`, so the three guide heroes that are video stills
  keep it with no edit; the Clip-On Hair System hero passes `false`. A play mark
  over a photograph promises a film that does not exist. Verified: zero play
  marks on this page, one each still on the Stick-On Lifespan and Will My
  Hairline Look Real heroes.
- **Two patch attempts failed before landing**, both from assumed indentation:
  `clipFearsMedia` is a top-level const at two-space indent, not six, and the
  play-mark markup differed from the pattern I wrote. Nothing was written on
  either failed run, so no half-applied state - re-read the files and matched
  the real text.
- Verified at 1440x900, 900x900, 390x844 and 320x568: zero placeholder frames,
  zero broken images, all six loading at their declared natural sizes, pillar
  cards equal height at the three larger widths, page overflow 0, zero console
  errors and zero failed requests.
  - At 320px the pillar cards measure 461/440/440 rather than equal. They are one
    per row there, so equal heights would only pad the shorter two - correct, not
    a defect.
- Files changed: six new files under `public/clip-on-system/`, `src/site.ts`
  (five dimensions and the block comment), `src/components/GuideHero.tsx`
  (`showPlay`), `src/components/ClipOnHero.tsx`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - "The Real Fears Men Have": photograph sized, bullets

- Request: the photograph was too large and the card carried a block of white
  space; match the shorter reference. Replace the pointer icons with bullets.
- **The white space and the oversized photograph were one fault, not two.** The
  grid was `align-items: stretch` and the photograph had no ratio, so its own
  1320x990 decided the row's height at whatever the column measured - and the
  card stretched to match, leaving empty white under five short lines. Fixed by
  giving the art a pinned `aspect-ratio: 4 / 3` with a height cap and switching
  the grid to `align-items: start`, so each column takes its own height and
  `cover` crops to the box rather than the box growing to the file.
  - Measured at 1440: card 267px tall against roughly 590 before, with the only
    remaining space under the list being the card's own 30px padding. Section
    height 651px.
- **A second defect appeared from the first fix and was caught before shipping.**
  With a ratio set, the stacked layout's `max-height` capped the *width* too,
  since the ratio derives one from the other - measured 295px of photograph in a
  350px column. The stacked block now clears `max-height` and lets the ratio
  work from the width. Verified the photograph fills its column exactly at 820,
  390 and 320.
- Icons replaced with drawn bullets. Five different glyphs beside five sentences
  of the same kind was decoration competing with the copy, and the sentences
  already carry all the meaning. Still a real `<ul>`; the bullet is a `<span>`
  rather than `list-style` so its size and colour sit with the text. Verified
  five bullets and zero leftover icon marks.
- Verified at 1440, 1100, 900, 820, 390 and 320: two columns above 820 and one
  below, photograph filling its column when stacked, card sized to its content
  at every width, page overflow 0, zero console errors.
- Files changed: `src/components/ClipFears.tsx` (bullets, icon map removed),
  `src/styles/global.css` (`.fears__grid`, `.fears__art`, `.fears__dot`,
  `.fears__item`, the stacked block).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - "The Real Fears Men Have": layout rebalanced

- Report: the section still had a space problem and read poorly.
- **Measured before changing anything, and there were two faults, not one:**
  - The photograph filled only 507px of its 596px column, because the
    `max-height` added in the previous fix capped the *width* as well - a ratio
    derives one from the other. That left 89px of empty column, which with the
    30px gutter read as a 119px hole between the two halves.
  - The row was the full 1319px wrap. Five short sentences sat in a 693px card
    with their line ends nowhere near it, and the centred heading floated over
    the hole rather than over a composition.
- Fixed by capping the grid to 1060px and centring it, rebalancing the columns
  to 0.88/1.12, and dropping the `max-height` so the column's own width bounds
  the photograph.
- Result at 1440: grid 1060 wide, columns 454/578, photograph filling its column
  exactly, the only space between them the 28px gutter, and the two columns
  ending within **1px** of each other - the photograph's bottom edge and the
  CTA's now line up, which is what the reference does and what the section was
  missing.
- Verified at 1600, 1440, 1100, 900 and 390: photograph fills its column at
  every width, baseline difference 10px or less on the two-column layouts, page
  overflow 0, zero console errors. Below 820 it stacks, where a baseline
  comparison does not apply.
- Files changed: `src/styles/global.css` (`.fears__grid`, `.fears__art`).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Clip-On Hair System: cross-link card rebalanced

- Request: reduce empty space in the desktop "Learn How The Stick-On Hair
  System Works" panel, enlarge its paragraph slightly, replace the photograph
  with `Images/Clip-on page/stick onn 1.png`, and enlarge the photograph.
- Replaced `public/clip-on-system/learn-stick-on.png` byte-for-byte with the
  supplied 2808×2332 transparent PNG and updated its declared dimensions in
  `src/site.ts`, preventing an incorrect reserved aspect ratio while loading.
- Increased the card's desktop cap from 360px to 390px, the artwork cap from
  330px to 380px, and the paragraph from a 24px/22ch cap to 28px/29ch. The
  wider source crop plus larger art fills more of the right side; the wider,
  larger paragraph gives the left side more weight. The existing stacked phone
  layout remains unchanged apart from its 18px paragraph floor.
- Added `scripts/verify-clip-learn.mjs` and documented the section in
  `README.md`.
- Verification: exact source/public SHA-256 hashes match. Headless Chrome at
  1440×900 measured a 390px card, 360px artwork, 24.48px paragraph, loaded
  2808×2332 image, and zero horizontal overflow; 390×844 measured a 393px card,
  190px artwork, 18px paragraph, and zero overflow. Both passes had zero console
  errors and failed requests. Desktop and phone screenshots were inspected.
  `npm.cmd run build` passed with 2,050 modules transformed.
- Files changed: `public/clip-on-system/learn-stick-on.png`, `src/site.ts`,
  `src/styles/global.css`, `scripts/verify-clip-learn.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Clip-On Hair System: Zycon range card and overlay

- Request: build the supplied "Zycon Range • Pro Series" card and its overlay,
  make both responsive, and place them immediately above "Stick-On Vs. Clip-On
  Hair Systems".
- Added `ClipZyconRange.tsx` between `HairlineTruth` and `Comparison`. The
  full-card button carries a 48px plus affordance and opens a responsive dialog
  matching the supplied desktop compositions: gradient teaser with white-edge
  portrait, then a light two-column detail sheet with the gradient-edge portrait.
- Centralized tag, titles, body, CTA, alt text, and asset dimensions in
  `src/site.ts`. "Know more" uses the site's existing `#consult` placeholder.
- Preserved the established dialog contract: focus moves to Close, Tab wraps
  between Close and "Know more", Escape and scrim close, focus returns to the
  full-card opener, the document locks without a scrollbar jump, and reduced
  motion removes the entrance spring while leaving all content available.
- Produced web-sized transparent derivatives from the three supplied PNGs:
  `/clip-on-system/zycon-gradient.png` 1800×973 (0.56 MB), `zycon-card.png`
  1200×1233 (1.94 MB), and `zycon-overlay.png` 1400×1517 (1.91 MB). The source
  files remain unchanged under `Images/Clip-on page/`.
- Added `scripts/verify-clip-zycon.mjs`. At 1440×900 it measured the centered
  card at 1120×583 with a 48px plus; at 390×844 it measured 350×438 with a 46px
  plus. Both loaded all declared image sizes, rendered directly between
  `.truth` and `.compare`, opened a labelled modal, trapped and returned focus,
  closed through Escape and scrim, locked/unlocked scrolling, had zero
  horizontal overflow, console errors, or failed requests. Desktop and phone
  card/overlay screenshots were inspected.
- Verification: `npm.cmd run build` passed with 2,051 modules transformed.
- Files changed: new `src/components/ClipZyconRange.tsx`,
  `scripts/verify-clip-zycon.mjs`, and three PNGs under
  `public/clip-on-system/`; updated `src/pages/ClipOnHairSystem.tsx`,
  `src/site.ts`, `src/styles/global.css`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Clip-On Zycon card gradient and portrait framing corrected

- Request: remove the coloured glitch/strip at the teaser card's right edge,
  lower its portrait slightly, and match the overlay portrait placement to the
  earlier supplied reference.
- Root cause: the first `zycon-gradient.png` derivative retained the source
  PNG's transparent outer shadow frame. CSS enlarged that image beyond the
  card, but its transparent right edge could still expose the solid fallback
  colour as a vertical strip.
- Rebuilt `public/clip-on-system/zycon-gradient.png` from the source artwork's
  fully opaque inner field (source crop `120,120,4432,2260`) and resized it to
  1800×918. All four output corners are alpha 255. The background now fills the
  card exactly, with no oversize workaround or fallback seam.
- Lowered the desktop teaser portrait by changing its bottom-anchored height
  from 104% to 98%. Mobile keeps its existing 100% stacked composition.
- Positioned the desktop overlay portrait against the entire dialog sheet at
  60% width/110% height with right/bottom anchoring and a 5% downward crop.
  This lets the shoulders overlap the column boundary and restores the head
  gap/scale from the earlier reference. Mobile keeps a contained, stacked
  portrait.
- Updated the declared background dimensions in `src/site.ts` and the Zycon
  implementation notes in `README.md`.
- Verification: `scripts/verify-clip-zycon.mjs` passed at 1440×900 and 390×844:
  correct section order; 1800×918 background, 1200×1233 card portrait, and
  1400×1517 overlay loaded; full-card opener; 44px+ controls; labelled dialog;
  focus trap/return; Escape and scrim closing; scroll lock; zero horizontal
  overflow, console errors, or failed requests. Desktop card/overlay and phone
  screenshots were inspected. `npm.cmd run build` passed with 2,051 modules.
- Files changed: `public/clip-on-system/zycon-gradient.png`, `src/site.ts`,
  `src/styles/global.css`, `README.md`, and `PROJECT-CONTEXT.md`.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Three-pillars cards: photograph band bounded

- Request: the three card images look too big on desktop and mobile.
- **Third instance of the same root cause on this page**, after the fears
  photograph and the learn-stick-on card: the art carried `min-height` with no
  cap, so the files' own 880x870 decided the crop. At card width the images came
  out near-square and about 370px tall, which is why the cards read as mostly
  photograph.
- `min-height: clamp(150px, 17vw, 230px)` replaced with a bounded
  `height: clamp(130px, 14vw, 200px)`, so the band is pinned and `cover` crops
  into it rather than the band growing to the file.
- Measured at 1440: cards 603px tall down to 386px, the photograph now 52% of the
  card rather than dominating it. 47% at 1100 and 900, 44% at 390, 41% at 320.
- **A second fault appeared once the band was short, and was caught before
  shipping.** `object-position: center top` had been fine in a tall band but in a
  200px one it crops from the top and loses the subject - the hairline became
  hair, the scalp illustration lost its face, the clips lost the palm. Changed to
  `center`; all three subjects now sit in frame.
- Verified at 1440, 1100, 900, 390 and 320: all three cards equal height at every
  width, page overflow 0, zero console errors.
- Files changed: `src/styles/global.css` (`.pillars3__art`, `.pillars3__photo`).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Clip-On three pillars restored to portrait-card proportions

- Request: the three cards under "A Hair System Gives You Three Things Every
  Man Wants:" looked cropped and too wide; match the supplied portrait-card
  reference so all three images are visible.
- **This intentionally supersedes the 2026-08-27 shallow photograph-band
  treatment immediately above.** That treatment solved an earlier size report
  by pinning each image to 130-200px and using `cover`, but the newer reference
  establishes that the whole section should be narrower and the photographs
  should keep their original near-square shape.
- Capped `.pillars3__in` at 832px and centered it. At 1440 the three cards now
  measure 261.33x478px with 24px gaps, matching the supplied design's desktop
  geometry instead of stretching across the site's full wrap.
- The image floor now preserves the files' 880:870 ratio and uses
  `object-fit: contain` with bottom anchoring. The full hairline, scalp-safety
  illustration, and hand with clips are visible; none is cropped into a banner.
- Kept three columns at 768px (222.47x440px cards), then switches below 720px
  to one centered column capped at 420px. At 390px the cards are 350px wide,
  equal at 515.22px tall, and all artwork remains complete.
- Added the subtle border and lighter shadow visible in the reference, while
  preserving the existing icons, copy, reveal motion, semantic list, and clean
  accessible heading.
- Added `scripts/verify-clip-pillars.mjs` and documented the block in `README.md`.
  Headless Chrome passed at 1440x900, 768x900, and 390x844: correct 3/3/1
  columns, all three source dimensions 880x870, `contain` fitting, exact image
  ratios, equal card sizes, zero horizontal overflow, console errors, or failed
  requests. All three screenshots were inspected. `npm.cmd run build` passed
  with 2,051 modules transformed.
- Files changed: `src/components/ClipPillars.tsx`, `src/styles/global.css`, new
  `scripts/verify-clip-pillars.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining issue in this section.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Clip-On pillar cards widened; phone artwork shortened

- Request: use more desktop width without enlarging the already-approved card
  images, and make all three stacked mobile images slightly shorter.
- Increased the centered `.pillars3__in` cap from 832px to 1000px. At 1440 the
  cards grow from 261.33px to 317.33px wide while staying 478px tall, reducing
  the empty page margins and preserving the three-card composition.
- Decoupled artwork height from card width. Desktop artwork now uses
  `height: clamp(218px, 18vw, 260px)` plus the existing `object-fit: contain`,
  so widening the cards does not scale up or crop the subjects. At 1440 each
  art floor is 259.19px tall, essentially the approved previous 256.38px size.
- Below 720px, artwork uses `height: clamp(220px, 68vw, 270px)`. At 390px it is
  265.19px rather than 344.03px, reducing each card from 515.22px to 436.38px.
  All three sources remain completely visible and bottom anchored.
- Updated `scripts/verify-clip-pillars.mjs` and `README.md` for the new width and
  breakpoint-specific height rules. Headless Chrome passed at 1440x900,
  768x900, and 390x844: card widths/heights correct, 3/3/1 columns, all images
  still `contain`, zero horizontal overflow, console errors, or failed requests.
  Desktop and phone screenshots were inspected.
- `npm.cmd run build` passed with 2,051 modules transformed.
- Files changed: `src/styles/global.css`, `scripts/verify-clip-pillars.mjs`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining issue in this section.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Invisible and Secure pillar images replaced

- Request: replace the Invisible and Secure card images with the two supplied
  Gemini PNGs on both desktop and mobile, ensuring neither appears cropped or
  cut off.
- Replaced `public/clip-on-system/pillar-invisible.png` byte-for-byte with
  `Images/Clip-on page/Gemini_Generated_Image_tmuq42tmuq42tmuq 12.png`
  (2232x1396, 2.46 MB), and `pillar-secure.png` with
  `Gemini_Generated_Image_m0n1eem0n1eem0n1 11.png` (1604x1396, 1.13 MB).
  Source/public SHA-256 hashes match for both files.
- Updated their declared dimensions in `src/site.ts`; the Safe image remains
  unchanged at 880x870. Accurate declarations preserve layout space during
  image loading and avoid CLS.
- Kept `object-fit: contain` and bottom anchoring. The new wider Invisible image
  now fits fully inside the card instead of being forced into the old square
  crop; the complete Secure hand and both clips also remain visible at every
  tested breakpoint.
- Updated `README.md` and `scripts/verify-clip-pillars.mjs` for the three actual
  source sizes. Headless Chrome passed at 1440x900, 768x900, and 390x844:
  2232x1396 / 880x870 / 1604x1396 loaded in order, all three use `contain`,
  card dimensions remain unchanged, and there are zero horizontal-overflow,
  console-error, or failed-request issues. Desktop and phone screenshots were
  inspected; both replacement images are fully visible.
- `npm.cmd run build` passed with 2,051 modules transformed.
- Files changed: `public/clip-on-system/pillar-invisible.png`,
  `public/clip-on-system/pillar-secure.png`, `src/site.ts`,
  `scripts/verify-clip-pillars.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining issue in this section.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Secure pillar image aligned to extreme right

- Request: the Secure image still read as cut off; move only that image to the
  extreme right on desktop and mobile and leave everything else untouched.
- Added one scoped selector,
  `.pillars3__card:nth-child(3) .pillars3__photo`, changing only its
  `object-position` from the shared `center bottom` to `right bottom`.
  Image size, `contain` fitting, card geometry, other two images, copy, and
  breakpoints are unchanged.
- Headless Chrome passed at 1440x900, 768x900, and 390x844. Secure reports
  `object-position: 100% 100%` at all three widths while Invisible and Safe stay
  at `50% 100%`; zero horizontal overflow, console errors, or failed requests.
  Desktop and phone screenshots were inspected.
- `npm.cmd run build` passed with 2,051 modules transformed.
- Files changed: `src/styles/global.css` and this required handoff entry in
  `PROJECT-CONTEXT.md`.
- No remaining issue in this section.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Zycon mobile overlay reordered to match supplied reference

- Request: make the "Zycon Range • Pro Series" overlay element placement match
  the second supplied phone reference.
- The change is intentionally mobile-only at 760px and below. Desktop remains
  the verified 1100x640 two-column sheet with its existing portrait framing.
- Mobile is now a full-viewport, square-cornered white sheet: 44px Close target
  at the top right with a 24px visible black circle, then title/body/CTA at 20px
  side padding, then the portrait in the remaining lower area. This reverses the
  former image-first stack that produced the first supplied screenshot.
- Reduced the mobile title/body/CTA type to the reference scale and moved the
  copy top to 72-80px. At 390x844 the copy occupies y=0..293, with the visible
  text beginning near y=82 and the CTA ending at y=293.
- Enlarged and art-directed the portrait only on mobile: its box is 132% wide,
  120% high, horizontally centred at 44%, bottom anchored, and unclamped by the
  global image max-width. At 390x844 it spans x=-86..429 and y=182..844; the
  art wrapper clips that to the lower y=293..844 area, producing the large head
  and full-width shoulders shown in the reference.
- Full-sheet mobile has no exposed scrim to click, so the second-dismissal test
  now uses Close there; desktop still tests scrim dismissal. Escape, focus trap,
  focus return, scroll lock, 44px controls, and reduced-motion behavior remain.
- Updated `scripts/verify-clip-zycon.mjs` with sheet/copy/art/image geometry
  checks. Headless Chrome passed at 1440x900 and 390x844: desktop geometry is
  unchanged; mobile sheet is exactly 390x844 at 0,0, copy precedes art, portrait
  ends at the viewport bottom, border radius is 0, and horizontal overflow,
  console errors, and failed requests are all zero. Desktop and phone overlay
  screenshots were inspected.
- `npm.cmd run build` passed with 2,051 modules transformed.
- Files changed: `src/styles/global.css`, `scripts/verify-clip-zycon.mjs`,
  `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining issue in this overlay placement.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Stick-On System Lifespan hero: tape eyebrow mark

- Request: use the supplied tape icon in the primary colour on the Stick-On hair
  system page's hero eyebrow, replacing the current one.
- **Page choice, stated because the request was ambiguous.** There is no page
  named "Stick-On Hair System" - the nav entry of that name still points at
  `#/stick-on-or-clip-on#stick-on`, an anchor on the combined page whose hero is
  `ChoiceHero` and covers both methods. The only standalone stick-on page with a
  `GuideHero` eyebrow is Stick-On System Lifespan, and a tape mark reads as
  adhesive, so that is the one changed. One line to move if it was meant
  elsewhere.
- `Icons/tape-svgrepo-com (3).svg` copied unchanged to `public/icons/tape.svg`;
  `StickOnLifespanHero` now passes it instead of `calendar.svg`.
- **No recolouring needed.** The mark is a CSS mask on
  `.guideHero__eyebrowIcon`, so the file's own `fill="#000000"` is discarded and
  `--accent-b` is painted through the shape. Verified `rgb(23, 105, 255)` at
  16x16.
- The Clip-On Lifespan page keeps the calendar, so the two sibling lifespan pages
  no longer share a mark - worth knowing, since they were deliberately identical
  before.
- **A probing slip worth recording:** the first two checks queried
  `.guideHero__mark` and then the eyebrow's `::before`, and both returned nothing
  - the icon is its own element, `.guideHero__eyebrowIcon`. Empty results were
  reported as empty rather than read as a pass; the third probe found the right
  element.
- Verified all five guide heroes: `tape.svg` on Stick-On Lifespan, and
  `calendar.svg`, `hair-skin.svg`, `burst.svg` and `layers.svg` unchanged on the
  other four, every one at `rgb(23, 105, 255)`. Zero console errors, zero failed
  requests.
- Files changed: new `public/icons/tape.svg`,
  `src/components/StickOnLifespanHero.tsx`.
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Standalone Stick-On Hair System page built and supplied imagery installed

- Request: build the complete responsive “Stick-On Hair system” page from the
  sixteen supplied section references, following the established Clip-On page;
  then install the eleven supplied hero, objection, consultation, natural
  hairline, Zycon, overlay, and Clip-On cross-link images.
- Added `#/stick-on-hair-system` in `src/App.tsx`. Repointed both the nav's
  “Stick-On Hair system” entry and the Clip-On page's final cross-link from the
  older combined-page anchor to this standalone route.
- Added `src/pages/StickOnHairSystem.tsx` with the complete reference order:
  hero; local-system objections; four-card consultation rail; natural-hairline
  before/after; suitability ScrollStack; shared Achievements, Checklist,
  Backed, and HairlineTruth; Zycon teaser/dialog; local-vs-our table; shared
  ClientStories; scalp-safety panel; compact accessible FAQ; consultation close;
  and Clip-On cross-link. The page has one `h1`, semantic tables/lists, native
  touch scrolling, labelled controls, and 44px-plus interactive targets.
- Generalized `ClipZyconRange` with a typed `content` prop while preserving its
  Clip-On defaults and focus trap, focus return, Escape/scrim dismissal, scroll
  locking, and reduced-motion behavior. Stick-On supplies its own copy and
  images through the same verified component.
- Made the shared `.perfect` stack height data-driven with
  `--perfect-steps`; the six-row Clip-On stack remains five scroll steps, while
  the five-row Stick-On version uses four.
- Installed eleven resized PNG derivatives in `public/stick-on-system/`:
  `hero.png` 2240x1260; `local-fail.png` 1320x990; four consultation cut-outs at
  880x1010; `natural-hairline-before-after.png` 1320x990;
  `zycon-gradient.png` 1800x934; `zycon-card.png` 1200x1206;
  `zycon-overlay.png` 1400x1486; and `learn-clip-on.png` 1200x1247. Source files
  remain under `Images/STICK ON PAGE/`.
- **Important Zycon mapping:** the supplied gradient export contains a black
  textured field outside the rounded colour card. Cropped source rectangle
  x=95, y=63, 4482x2325 before resizing, yielding the clean 1.92:1 colour field
  and preventing the right-edge/background glitch already seen on Clip-On.
- Added the responsive rules in `src/styles/global.css` and
  `scripts/verify-stick-on-system.mjs`. The browser check passed at 1440x900 and
  390x844: all sixteen sections rendered, all supplied assets loaded at declared
  dimensions, minimum visible target 46px desktop / 69.125px mobile, one `h1`,
  zero horizontal overflow, FAQ expansion passed, Zycon dialog focus and scroll
  lock passed, and there were zero console errors or failed requests. Desktop
  and mobile consultation, Zycon card, and overlay screenshots were inspected.
- `npm.cmd run build` passed with 2,052 modules transformed.
- Files changed: `src/App.tsx`, `src/site.ts`, `src/pages/StickOnHairSystem.tsx`,
  `src/components/ClipZyconRange.tsx`, `src/components/ClipLearnStickOn.tsx`,
  `src/styles/global.css`, new `public/stick-on-system/*`, new
  `scripts/verify-stick-on-system.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining implementation issue in the supplied page. Future image swaps
  should preserve the declared dimensions or update them with the files.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Tape mark moved to the Stick-On Hair System hero

- Request: the previous change put the tape mark on the wrong page. Restore the
  calendar on Stick-On System Lifespan and put tape on the Stick-On Hair System
  page's hero eyebrow.
- **The page existed and I had not known it.** `src/pages/StickOnHairSystem.tsx`
  is registered at `/stick-on-hair-system` and was added outside this session's
  work - the earlier note that "no standalone Stick-On Hair System page exists"
  was true when written and had gone stale. Checked the route table rather than
  assuming again.
- Calendar restored on `StickOnLifespanHero`, so the two lifespan pages share it
  again. That sharing is deliberate: both answer "how long does it last?".
- **The Stick-On Hair System hero is its own inline component, not `GuideHero`**,
  and its eyebrow used a lucide `Boxes` glyph rather than a masked icon. Replaced
  with a `.stickHero__tagIcon` span masked by `tape.svg`, matching
  `.guideHero__eyebrowIcon` - so the supplied file's `fill="#000000"` is
  discarded and `--accent-ink` paints through the shape, and no asset editing
  was needed.
- `Boxes` stays imported: the same page's clip-on cross-link card still uses it.
  Checked rather than removed on sight.
- Verified: `tape.svg` at `rgb(15, 85, 216)`, 15x15, with zero leftover `<svg>`
  inside the tag; and all five `GuideHero` eyebrows unchanged - `calendar.svg` on
  both lifespan pages, `layers.svg`, `hair-skin.svg` and `burst.svg` on the other
  three, every one at `rgb(23, 105, 255)`. Zero console errors, zero failed
  requests.
- Files changed: `src/components/StickOnLifespanHero.tsx` (calendar restored),
  `src/pages/StickOnHairSystem.tsx` (eyebrow markup),
  `src/styles/global.css` (`.stickHero__tagIcon`).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - "Why Most Local Hair Systems Fail": scaled to match the Clip-On section

- Request: the section reads too large and carries too much white space; match
  the Clip-On page's "The Real Fears Men Have" for element size, spacing and
  padding.
- **The white space had the same cause as that section's did before it was
  fixed**, which is why the two now match structurally as well as in scale: the
  grid was `align-items: stretch`, the photograph carried `min-height: 420px`
  with no cap, and `.stickLocal__content` used `grid-template-rows: 1fr auto`.
  So the image set the row height and both the content column and the card
  stretched to it, leaving empty white under five short lines.
  - The photograph now carries `aspect-ratio: 4 / 3`, the grid is
    `align-items: start`, and the content rows are `auto auto`.
- Also capped the grid to 1060px and centred it, matching `.fears`. The row had
  run the full 1319px wrap, so the copy sat at a measure far wider than it reads
  at.
- Scale brought to the Clip-On section's: section padding, heading size, card
  padding, card heading, list gap and body size all matched.
- **Every rule is scoped to `.stickLocal` alone, and that was the constraint
  worth respecting.** The heading, grid, card, list and card-heading rules on
  this page are shared selectors covering `.stickNatural` and `.stickDerm` too;
  editing them in place would have rescaled two sections nobody asked about.
  Verified after: `.stickNatural` and `.stickDerm` still report 48px headings,
  36px card padding and the full 1319px grid, while `.stickLocal` reports 38.4px,
  30px and 1060px.
- Measured at 1440: section 666px, photograph filling its column exactly, card
  287px with the only space under the list being its own 31px padding, and the
  photograph and the content column ending on the **same baseline** - a 0px
  difference at 1440, 1100 and 900.
- The stacked block's `min-height: 280px` was replaced with a ratio for the same
  reason as `.fears`: a floor there leaves the photograph either shorter than its
  column or taller than it needs.
- Verified at 1440, 1100, 900 and 390: page overflow 0, zero console errors.
- Files changed: `src/styles/global.css` (a `.stickLocal`-scoped block, and the
  stacked photograph rule).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Stick-On local-system photograph restored to full frame

- Request: the photograph in “Why Most Local Hair Systems Fail” looked cropped
  or too narrow; show the complete supplied image and change nothing outside
  that section.
- Cause: the shared photograph rule imposed `height: 100%` and
  `object-fit: cover`. The section's later 4:3 ratio could not win against that
  explicit stretched height, so grid-row height produced a crop. Mobile also
  forced a 16:10 box around a 4:3 source, guaranteeing another crop.
- Scoped fix: `.stickLocal__photo` now resets to `height: auto`, preserves 4:3,
  and uses `object-fit: contain`; the mobile override keeps the same 4:3 ratio.
  Desktop columns changed from 0.88/1.12 to equal halves, growing the image from
  about 454px to 516px without changing section width or adjacent sections.
- Extended `scripts/verify-stick-on-system.mjs` to require the natural and
  rendered 4:3 ratios plus `contain`, and save focused section screenshots.
  Passed at 1440x900 and 390x844: photograph 516x387 desktop and 350x262.5
  mobile, natural asset 1320x990, zero horizontal overflow, and no console or
  request failures. Both screenshots were inspected; full image is visible.
- `npm.cmd run build` passed with 2,052 modules transformed.
- Files changed: `src/styles/global.css`,
  `scripts/verify-stick-on-system.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- No remaining issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Consultation card image backgrounds removed

- Request: remove the visible backgrounds behind all four images in “At
  American Hairline, We Don’t Do One-Size-Fits-All” and match the clean white
  image treatment shown in the Clip-On pillar-card reference.
- Changed only `.stickConsult__photo`: removed its `#edf0f4` grey floor and set
  the image background transparent. The supplied PNGs already contain alpha, so
  each cut-out now sits directly on the card's white surface while card border,
  copy, dimensions, rail behavior, and responsive layout remain unchanged.
- UI/UX Pro Max's local search script could not run because Python, Python 3,
  and the Windows `py` launcher are unavailable. Used its built-in consistency
  and responsive defaults instead; no design-system change was needed for this
  one-property correction.
- Extended `scripts/verify-stick-on-system.mjs` to require four transparent
  computed image backgrounds. Passed at 1440x900 and 390x844: all four report
  `rgba(0, 0, 0, 0)`, zero horizontal overflow, no console errors, and no failed
  requests. Desktop and mobile screenshots were inspected.
- `npm.cmd run build` passed with 2,052 modules transformed.
- Files changed: `src/styles/global.css`,
  `scripts/verify-stick-on-system.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- No remaining issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Natural Hairline section scaled to match Local Systems section

- Request: “Our Ultra-Signature Natural Hairline, Just For You” looked too big
  and had excess white space; match every scale and spacing decision from the
  already-approved “Why Most Local Hair Systems Fail” section.
- Added a `.stickNatural`-scoped override block. It now shares the Local section's
  44–96px responsive section padding, 24–38.4px heading, 24–40px heading gap,
  centred 1060px equal-column grid, 16–28px column gap, 20–30px card padding,
  compact heading/list type, 10–15px list gaps, and 12–18px copy-to-CTA gap.
- Removed the card's 310px minimum height and changed the copy rows from
  `1fr auto` to `auto auto`, eliminating forced empty space below its four
  checklist points.
- Natural-hairline image now matches the Local image exactly: `height: auto`,
  no minimum height, complete 4:3 ratio, and `object-fit: contain` on desktop
  and mobile. Its supplied 1320x990 frame is not cropped.
- UI/UX Pro Max search remained unavailable because no Python executable or
  launcher exists; applied its built-in layout-consistency and no-overflow
  defaults, using the approved sibling section as the source of truth.
- Extended `scripts/verify-stick-on-system.mjs` to compare both sections'
  computed padding, heading size/gap, grid width/gap/columns, card padding, and
  image fitting. Desktop values match exactly at 1060px grid / 516x387 image;
  mobile values match at 350px grid / 350x262.5 image. Zero overflow, console
  errors, or failed requests. Both screenshots were inspected.
- `npm.cmd run build` passed with 2,052 modules transformed.
- Files changed: `src/styles/global.css`,
  `scripts/verify-stick-on-system.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- No remaining issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Product-page section backgrounds reassigned

- Request: on the Stick-On Hair System page, give “Our Big Achievements” and
  “Why Thousands Of Men Choose American Hairline” grey backgrounds; on the
  Clip-On Hair System page, give “Backed By Thousands Of Confident Men” and
  “Zycon Range • Pro Series” grey backgrounds; remove the grey background from
  “Stick-On Vs. Clip-On Hair Systems” on the Clip-On page.
- Added `clipSystemPage` to the Clip-On route's `<main>` and used direct-child,
  page-scoped selectors. This is important because `Achievements`, `Backed`,
  `HairlineTruth`, `ClipZyconRange`, and `Comparison` are shared components;
  their surfaces on the homepage and other routes remain unchanged.
- Requested grey is `#f4f5f8`; the Clip-On comparison now uses `var(--page)`
  (`#fff`). The rules apply identically at desktop and mobile breakpoints.
- Added `scripts/verify-product-section-backgrounds.mjs`. Headless Chrome passed
  at 1440x900 and 390x844 on both routes: all four requested sections computed
  to `rgb(244, 245, 248)`, the Clip-On comparison computed to
  `rgb(255, 255, 255)`, horizontal overflow was zero, and there were no console
  errors or failed requests.
- `npm.cmd run build` passed with 2,052 modules transformed.
- Files changed: `src/pages/ClipOnHairSystem.tsx`, `src/styles/global.css`,
  `scripts/verify-product-section-backgrounds.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- No remaining issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-28 - Natural Hairline desktop alignment and mobile image order

- Request: align the desktop image with the full left content-and-CTA column,
  and place the image directly below the section heading on mobile.
- Desktop `.stickNatural__grid` now stretches both columns, while the copy uses
  `1fr auto` rows. The content card absorbs the available height and the CTA
  stays at the bottom, so both columns share exact top and bottom edges.
- At the existing 800px stack breakpoint, `.stickNatural__photo` receives
  `order: -1`. Mobile order is now heading, full before/after image, content
  card, CTA. The source remains fully visible at 4:3 with `object-fit: contain`.
- Extended `scripts/verify-stick-on-system.mjs` with geometry assertions for
  desktop edge alignment and mobile image order. Passed at 1440x900 and
  390x844: desktop copy and image are both 387px high with 0px top/bottom
  difference; mobile image is 350x262.5 directly beneath the heading; zero
  overflow, console errors, or failed requests. Both screenshots inspected.
- `npm.cmd run build` passed with 2,052 modules transformed.
- Files changed: `src/styles/global.css`,
  `scripts/verify-stick-on-system.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- No remaining issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - "Local Patches Vs Our Patches": slider replaced with the shared table

- Request: the Stick-On Hair System page's comparison rendered as a slider;
  match the reference, which is the site's `.compare` table format.
- **The markup was already a semantic `<table>`; the slider was its CSS.** The
  bespoke `.stickCompare` block set `min-width: 620px` inside an
  `overflow-x: auto` scroller, so any viewport under about 660px got a
  horizontal drag instead of a fitting table.
- Rewritten onto the shared `.compare` class language, exactly as `rateCompare`
  and `patchCompare` ride it: `compare__header/__title/__tableCard/
  __tableScroller/__table` with the dark `#14161a` header row. The section
  keeps two rules of its own - `var(--page)` ground and an 850px card, its
  previous width. Roughly seventy lines of duplicate table CSS deleted.
- Verified at 1440, 768, 390 and 320: seven rows, heads "Feature | Local
  Patches | Our Patches", **no scrolling at any width** - the columns share the
  width and the copy wraps, matching the reference's phone rendering. Page
  overflow 0, zero console errors.
- The other three `.compare` tables re-probed and unchanged: page 2's five rows,
  page 3's eight, page 5's four, all with the same header colour.
- Files changed: `src/pages/StickOnHairSystem.tsx` (`LocalComparison` markup),
  `src/styles/global.css` (bespoke block deleted, two-rule variant added).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - Content audit: Clip-On and Stick-On Hair System pages

- Request: audit both pages' content, apply clearer wording, keep the design
  identical on desktop and mobile.
- **Three defects found, all on the Stick-On page. The Clip-On page's copy came
  through clean** apart from one shared label.
  1. **A run-on accessible name, the twelfth of its kind here.** The
     "Our Ultra-Signature Natural Hairline" heading was
     `...fail here.<br />At American Hairline...`, and a bare `<br>` produces no
     text node, so it announced as "fail here.At American Hairline". Fixed with a
     real space before the break - the same fix `Achievements` needed.
  2. **A grammar break under "Stick-On Is Perfect For Men Who…".** The first row
     read "Doesn't want the hassle…", so the heading and row together said
     "Men Who… Doesn't want". The other three rows continue the heading in the
     plural, and all five of the Clip-On page's rows do too. Now "Don't want the
     hassle of daily clip-on wear and removal."
  3. **The same CTA label in two different cases on one page.** "Talk To An
     Expert" appeared twice and "Talk to an Expert" twice on the Stick-On page,
     and the Clip-On page used the sentence-case form. Title case is what the
     rest of the site uses, so all four were brought to it. Verified each page
     now renders exactly one variant of the label.
- **Checked and found consistent, so left alone:** the 20-25 day servicing
  interval, which appears twice on the Stick-On page and agrees with itself; the
  Clip-On hero's bolding, which matches the supplied design; and both pages'
  pillar, fear and checklist copy.
- **Out of scope and left:** `hairBenefitsData.cta` in `site.ts` also reads
  "Talk to an Expert" in sentence case, but it belongs to page 3's benefits
  overlay, not to either page audited. Flagged rather than changed.
- Design verified unchanged at 1440 and 390 on both pages: sixteen sections on
  Stick-On and fourteen on Clip-On, the edited heading still two lines at desktop
  and three on mobile, all five "Perfect For" rows still one line at desktop and
  two on mobile, page overflow 0 and zero console errors throughout. The shorter
  first row did not rewrap anything.
- **One layout defect reported rather than fixed, being outside a content
  audit:** `.stickNatural` has the same stretched-card white space that
  `.stickLocal` and `.fears` both had - the photograph drives the row height and
  the card grows to match, leaving roughly 100px of empty white under four short
  lines. The fix is the one already applied twice: a ratio on the photograph,
  `align-items: start`, and `auto auto` content rows.
- Files changed: `src/pages/StickOnHairSystem.tsx` (space, grammar, two labels),
  `src/site.ts` (`clipPerfectCta.action` casing).
- Verification: `npm run build` passes.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Complete SMP solution page

- Request: build the complete SMP page from the supplied desktop section
  references, use every mapped asset, keep it consistent with the existing
  site, make it responsive/mobile-friendly, reuse the homepage dark FAQ
  treatment, and expose a phone-test URL.
- Added `#/smp` to the existing hash route map. The Solutions navigation entry
  already pointed to that exact route and now receives its active state.
- Built ten page sections in `src/pages/Smp.tsx`: hero; seven-image results
  rail; About teaser and modal; suitability cards; situations checklist;
  four-step process rail; five-tab treatment finder; ten-point proof grid;
  ten-question dark FAQ; and the local guidance form. Nav and Footer are shared.
- Installed all 19 supplied SMP assets as web-sized derivatives under
  `public/smp/`: hero and photographic cards use compressed JPEGs, while the
  supplied transparent about/process cut-outs stay PNG. The supplied syringe
  SVG is used in the eyebrow badge.
- About modal follows the established dialog contract: named dialog, 48px
  close control, initial focus, trapped Tab, Escape and scrim close, focus
  return, and body scroll lock. Rails retain native scrolling and visible arrow
  alternatives. Treatment tabs and FAQ use semantic tab/accordion states.
- The SMP form is front-end only and says lead delivery is not connected after
  validation; this extends the existing launch-blocker note rather than
  implying a submission reached the consultation team.
- Requested `ui-ux-pro-max`, `modern-web-design`, and `caveman` skills were
  applied. UI/UX Pro Max's Python search helper was unavailable because this
  machine has no `py` or `python`; used the skill's verified accessibility,
  responsive, performance, and consistency defaults plus existing site tokens.
- Added `src/styles/smp.css` and `scripts/verify-smp.mjs`. Headless Chrome passed
  at 1440x900, 390x844, 844x390 landscape, and 390x844 reduced motion: one h1,
  ten sections, active SMP nav, all 19 supplied images loaded, seven results,
  four process cards, five treatment tabs, ten FAQ rows, minimum interactive
  height 45.59px, zero horizontal overflow, working modal/tab/FAQ behavior,
  zero console errors, and zero failed requests. Desktop/mobile hero,
  treatment, FAQ, and About-modal screenshots were inspected.
- `npm.cmd run build` passed with 2,054 modules transformed. Existing Vite
  warning remains: the main minified JS chunk is 504.20 kB (149.29 kB gzip).
- Files changed: `src/App.tsx`, `src/main.tsx`, `src/pages/Smp.tsx`,
  `src/styles/smp.css`, `scripts/verify-smp.mjs`, `public/smp/*`, `README.md`,
  and `PROJECT-CONTEXT.md`.
- Remaining issue: connect both guidance forms to the real lead backend before
  launch. SMP imagery identifies real clients; confirm publication consent.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Rebuild SMP hero on the shared guide-page format

- Request: replace the first SMP hero treatment, which was visually oversized
  and too loose, with the supplied reference's compact structure and the same
  hero format used by the other guide pages.
- Replaced the bespoke SMP hero markup with shared `GuideHero`: supplied syringe
  mark rendered through the existing blue mask treatment, controlled two-line
  desktop title, emphasized lede, 16:9 supplied image, shared reveal, and
  reduced-motion behavior. `GuideHero.title` now accepts `ReactNode`; all older
  string callers remain unchanged.
- Added SMP-only vertical-rhythm overrides matching the reference: 12–18px hero
  top padding, 12–16px header gaps, and 30–40px image gap. At 1024px, badge,
  title, lede, and image now align closely to the reference; image begins at
  exactly 316px. Mobile hides the forced desktop break, keeps
  “Natural-Looking” together, and resolves to three balanced heading lines.
- Removed the obsolete bespoke hero CSS. UI/UX Pro Max's Python search helper
  remained unavailable, so the verified shared guide system and the supplied
  reference were the source of truth.
- Extended `scripts/verify-smp.mjs` with a 1024x900 reference-size pass. Headless
  Chrome passed at 1440x900, 1024x900, 390x844, 844x390 landscape, and reduced
  motion: one h1, all assets loaded, active nav, minimum control height 45.59px,
  zero horizontal overflow, zero console errors, and zero failed requests.
  Reference-size and mobile hero screenshots were inspected.
- `npm.cmd run build` passed with 2,054 modules transformed. Existing bundle
  warning remains: main minified JS is 504.03 kB (149.31 kB gzip).
- Files changed: `src/components/GuideHero.tsx`, `src/pages/Smp.tsx`,
  `src/styles/smp.css`, `scripts/verify-smp.mjs`, `README.md`, and
  `PROJECT-CONTEXT.md`.
- No remaining hero issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Repair SMP results transformation rail

- Request: correct the visually glitched “Real Results That Showcase True
  Transformations” section against the supplied reference and make it
  responsive.
- Root causes: the image elements retained their declared 920×1150 intrinsic
  height because the card rule changed width without resetting height; left
  padding inside the snap container was consumed as an initial snap offset; and
  the earlier split light/dark section ground contradicted the latest reference.
- Rebuilt the rail presentation on one `#f2f4f7` surface, reset images to a
  stable 4:5 ratio, moved the leading gutter outside the scrollable snap area,
  widened the desktop heading measure, and added live disabled states to the
  previous/next buttons at the rail edges. Native horizontal swipe and snap
  behavior remain available on phones.
- Extended `scripts/verify-smp.mjs` to capture this section and assert its solid
  background, zero initial scroll offset, and 4:5 card/image geometry. Headless
  Chrome passed at 1440×900, 1024×900, 390×844, 844×390 landscape, and 390×844
  reduced motion. Measured cards were 259.19×323.98, 220×275, and 280×350 at
  the principal desktop, reference, and phone widths. All runs had zero page
  overflow, zero console errors, and zero failed requests; reference-size and
  phone screenshots were inspected.
- Requested `ui-ux-pro-max` and `caveman` skills were followed. UI/UX Pro Max's
  Python helper was unavailable in this environment, so the supplied reference,
  existing site tokens, and measured browser output were the source of truth.
- `npm.cmd run build` passed with 2,054 modules transformed. Existing bundle
  warning remains: main minified JS is 504.47 kB (149.47 kB gzip).
- Files changed: `src/pages/Smp.tsx`, `src/styles/smp.css`,
  `scripts/verify-smp.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining results-section issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Convert SMP results rail to desktop scroll scrub

- Request: remove the results-section arrows at every size, make desktop
  vertical page scroll move the result cards horizontally, and correct phone
  bottom padding.
- Reworked `SmpResults` on the site's established pinned-rail mechanism. Above
  900px, measured track overflow extends the section height; a sticky viewport
  maps section scroll progress to a transform-only horizontal translation.
  ResizeObserver keeps the travel distance correct after images and viewport
  changes.
- Below 901px, and under `prefers-reduced-motion`, the pin is dropped. The same
  markup becomes a focusable native snap/swipe region with an accessible label,
  preserving touch and keyboard access without arrow buttons. Phone portrait
  and landscape space after the rail is exactly 48px.
- Results-only arrow state code and markup were removed. The separate process
  rail keeps its existing buttons.
- Extended `scripts/verify-smp.mjs` to assert zero results arrows, correct
  pinned/static mode at every breakpoint, native overflow and focusability in
  fallback mode, 48px phone bottom spacing, and actual horizontal track movement
  at the middle and end of desktop vertical scroll.
- Headless Chrome passed at 1440x900, 1024x900, 390x844, 844x390 landscape, and
  390x844 reduced motion: seven 4:5 cards, correct pin/fallback behavior, zero
  page overflow, zero console errors, and zero failed requests. Desktop and
  phone results screenshots were inspected.
- Requested `ui-ux-pro-max` and `caveman` skills were followed. The existing
  verified project pin pattern and UI/UX Pro Max's reduced-motion, transform,
  gesture, and keyboard-access rules guided the implementation.
- `npm.cmd run build` passed with 2,054 modules transformed. Existing bundle
  warning remains: main minified JS is 504.82 kB (149.66 kB gzip).
- Files changed: `src/pages/Smp.tsx`, `src/styles/smp.css`,
  `scripts/verify-smp.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining issue in the results-section scroll behavior or spacing.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Remove SMP results desktop blank tail

- Request: remove the excessive desktop blank space below the results rail and
  close the transition into the following About section.
- Root causes: the pinned stage reserved a full `100vh` despite its content
  being substantially shorter, and `overflow: hidden` on the section created a
  scroll container that prevented the sticky child from holding through the
  horizontal scrub. At the rail end, the content scrolled away while an empty
  grey viewport remained.
- The pin now uses its measured natural content height. Section height is that
  pin height plus the exact horizontal track travel, and a requestAnimationFrame-
  throttled scroll mapping moves only the track transform. The section now uses
  `overflow-x: clip`, which clips horizontal artwork without breaking sticky
  positioning. Short desktop viewports fall back to the native rail rather than
  pinning content taller than the viewport.
- Desktop space after the cards now measures 58px. At the final horizontal
  position, the heading and cards remain visible while the next section enters
  directly beneath the 633.95px pin at 1440x900; the former empty viewport tail
  is gone. The 1024x900 pin measures 526.56px. Phone spacing remains 48px.
- Extended `scripts/verify-smp.mjs` to assert content-height pin travel equals
  track overflow, sticky top remains zero at the final scroll position, and to
  save end-state desktop screenshots.
- Headless Chrome passed at 1440x900, 1024x900, 390x844, 844x390 landscape, and
  390x844 reduced motion with zero page overflow, zero console errors, and zero
  failed requests. Desktop start/end screenshots were inspected.
- `npm.cmd run build` passed with 2,054 modules transformed. Existing bundle
  warning remains: main minified JS is 505.31 kB (149.83 kB gzip).
- Files changed: `src/pages/Smp.tsx`, `src/styles/smp.css`,
  `scripts/verify-smp.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining blank-tail issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Fit SMP process images to both card edges

- Request: enlarge all four images in “The Step-By-Step Process To Fuller Look”
  on desktop and mobile so they fill the cards from left edge to right edge
  without appearing side-cropped.
- Root cause: each portrait source is about 600x704, but CSS forced it into a
  shorter fixed-height box with `object-fit: contain`. The contained artwork was
  therefore only about 247px wide inside a 281.5px desktop card, leaving white
  strips at both sides.
- Removed the fixed 290px desktop and 320px phone heights. Images now keep their
  native ratio with `height: auto`, retain the existing full-bleed negative
  margins, and render exactly as wide as each card. Corrected the second image's
  declared source height from 704 to its actual 702px to preserve its load-time
  aspect ratio.
- Extended `scripts/verify-smp.mjs` to measure every process card and assert
  image width equals card width within 1px and rendered ratio matches each
  source. It also saves process-section screenshots.
- Headless Chrome passed at 1440x900, 1024x900, 390x844, 844x390 landscape, and
  390x844 reduced motion. Measured image/card widths were 281.5px desktop,
  221px reference size, 319.8px phone, and 255px landscape. Desktop and phone
  screenshots were inspected; all four images meet both card edges.
- `npm.cmd run build` passed with 2,054 modules transformed. Existing bundle
  warning remains: main minified JS is 505.36 kB (149.84 kB gzip).
- Files changed: `src/pages/Smp.tsx`, `src/styles/smp.css`,
  `scripts/verify-smp.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining process-image fitting issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Remove SMP process rail arrows

- Request: remove the previous/next arrow buttons from “The Step-By-Step
  Process To Fuller Look” on desktop and mobile.
- Removed both process controls, their now-unused `RailControls` component,
  Chevron imports, and all dead `.smpRailControls` CSS. No results or process
  arrow markup remains on the SMP page.
- Kept the process container as the same native horizontal snap rail at narrow
  widths. It is now a named, focusable region, so touch users can swipe and
  keyboard users can scroll with arrow keys without separate buttons. At wide
  desktop widths all four cards remain visible together.
- Extended `scripts/verify-smp.mjs` to assert zero results arrows, zero process
  arrows, and `tabIndex=0` on the process rail. Headless Chrome passed at
  1440x900, 1024x900, 390x844, 844x390 landscape, and 390x844 reduced motion
  with zero page overflow, zero console errors, and zero failed requests.
  Desktop and phone process screenshots were inspected.
- `npm.cmd run build` passed with 2,054 modules transformed. Existing bundle
  warning remains: main minified JS is 504.90 kB (149.73 kB gzip).
- Files changed: `src/pages/Smp.tsx`, `src/styles/smp.css`,
  `scripts/verify-smp.mjs`, `README.md`, and `PROJECT-CONTEXT.md`.
- No remaining process-arrow issue.
- Not committed; belongs to the eventual version 2.

### 2026-08-27 - SMP page: two sections to white, and a broken build found

- Request: white grounds on "Find The SMP Treatment For Your Concern" and
  "Fill This Form To Get The Right Guidance".
- Both sat in a grouped rule with three others
  (`.smpPerfect, .smpProcess, .smpTreatments, .smpWhy, .smpForm { background:
  #f3f5f7 }`). Split out of that group rather than overridden after it, so each
  section carries one declaration and no rule is immediately undone. Verified at
  1440 and 390: both `rgb(255, 255, 255)`, the other three still
  `rgb(243, 245, 247)`, page overflow 0, zero console errors.
- **`npm run build` was already failing before this change, and had been.** The
  SMP page's FAQ array is `as const` with one member carrying only `q`, so
  inference produced a union in which `item.a` did not exist -
  `TS2339` from `tsc -b`. My CSS edit did not cause it, but every "build passes"
  line in this log since the SMP page landed was wrong for that file. Vite's dev
  server does not typecheck, which is why the page rendered fine throughout.
- **Nine of the ten SMP FAQ questions have no answer** - only "Is scalp
  micropigmentation painful?" does. That is the underlying content gap.
- Fixed by typing the array `{ q: string; a?: string }[]` and rendering the
  answer paragraph only when present. **Every question still renders.** A first
  attempt filtered unanswered entries out and was reverted immediately on
  measuring: it removed nine rows of the client's own design, which is far worse
  than the empty panel it was avoiding. Verified ten questions render with one
  answer.
- Files changed: `src/styles/smp.css` (background split),
  `src/pages/Smp.tsx` (FAQ type and conditional answer).
- Verification: `npm run build` now passes for the first time since the SMP page
  was added.
- Not committed; belongs to the eventual version 2.

### 2026-08-29 - Prepare Codex account-transfer handoff and skill links

- Request: prepare all skill-install links and enough project context for a
  second Codex account to continue without losing history.
- Added `CODEX-HANDOFF.md` with a copy-paste first prompt, current routes,
  architecture and conventions, source-material map, verification contract,
  launch blockers, repository state, and transfer warnings.
- Inventoried 40 project-local skills (487 files, about 12.22 MB) under
  `.agents/skills/`. `skills-lock.json` maps them to five verified public
  GitHub sources: `freshtechbro/claudedesignskills` (23),
  `nextlevelbuilder/ui-ux-pro-max-skill` (7), `JuliusBrussee/caveman` (7),
  `HUANGCHIHHUNGLeo/claude-real-video` (2), and the Anthropic
  `frontend-design` skill (1). The handoff includes direct links to every skill
  directory.
- Important transfer decision: another Codex login on the same machine needs no
  reinstall because project-local skills belong to the folder. A different
  machine must receive the whole folder including hidden `.agents/`; a Git-only
  transfer is incomplete because there is no remote and the version-2 work plus
  skill directories are uncommitted/untracked.
- No application code, dependencies, or assets changed. Verification was a
  read-only inventory of routes, Git state, skill count, lockfile sources, and
  upstream repository availability; no build was necessary for documentation-
  only changes.
