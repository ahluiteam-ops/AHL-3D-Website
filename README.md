# American Hairline — homepage build

> **Picking this project up (new session, or a different assistant)?**
> Read **[PROJECT-CONTEXT.md](PROJECT-CONTEXT.md)** first — it carries brand
> knowledge, conventions, traps, and what is unfinished. This README covers how
> each section is built.


White-background hero built to the reference layout: chrome `100% NATURAL` band,
headline column left, "Find Your Match" style carousel right.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle into dist/
```

## Stack

Vite + React + TypeScript, plain CSS (no framework),
[lucide-react](https://lucide.dev) for interface icons, and GSAP with
ScrollTrigger for the founder-consultation page's staged entrance effects.

## Where things live

| Piece | File |
| --- | --- |
| Colour, type, and spacing tokens | [src/styles/tokens.css](src/styles/tokens.css) |
| All layout and component CSS | [src/styles/global.css](src/styles/global.css) |
| Nav bar + menu drawer | [src/components/Nav.tsx](src/components/Nav.tsx) |
| The chrome `100% NATURAL` band | [src/components/Wordmark.tsx](src/components/Wordmark.tsx) |
| Headline column | [src/components/Hero.tsx](src/components/Hero.tsx) |
| Unified Hero-to-Secret film controller | [src/components/HeroSecret.tsx](src/components/HeroSecret.tsx) |
| Style carousel | [src/components/MatchSlider.tsx](src/components/MatchSlider.tsx) |
| Site content and asset paths | [src/site.ts](src/site.ts) |
| Unified Hero + Secret video | `public/video/hair-system-unified-clean.mp4` |
| Section 2 — "The Secret…" | [src/components/Secret.tsx](src/components/Secret.tsx) |
| Unified Higgsfield source | `reference/v3.mp4` (source; not shipped) |
| Section 3 — Achievements | [src/components/Achievements.tsx](src/components/Achievements.tsx) |
| Section 4 — Why Men Choose Us / Key Facts | [src/components/KeyFacts.tsx](src/components/KeyFacts.tsx) |
| Section 5 — 21-Point Checklist | [src/components/Checklist.tsx](src/components/Checklist.tsx) |
| Checklist film poster | `public/checklist/21-point-checklist.png` |
| Checklist film | `public/checklist/21-point-checklist.mp4` |
| Section 6 — Client stories | [src/components/ClientStories.tsx](src/components/ClientStories.tsx) |
| Client film posters | `public/clients/client-story-1…6.png` |
| Client films | `public/clients/client-story-1…6.mp4` |
| Section 6b — Backed by thousands | [src/components/Backed.tsx](src/components/Backed.tsx) |
| Proof icons | `public/backed/*.png` |
| Section 6c — Real hair or illusion? | [src/components/Decide.tsx](src/components/Decide.tsx) |
| Real hair or illusion film | `public/decide/client-before-after.mp4` |
| Section 6d — Our trusted methods | [src/components/Methods.tsx](src/components/Methods.tsx) |
| Homepage founder booking | [src/components/FounderBooking.tsx](src/components/FounderBooking.tsx), [src/styles/founder-booking.css](src/styles/founder-booking.css) |
| Section 6e — Guidance form | [src/components/Form.tsx](src/components/Form.tsx) |
| Section 7 — Hair systems | [src/components/Systems.tsx](src/components/Systems.tsx) |
| The circular gallery | [src/components/ui/circular-gallery.tsx](src/components/ui/circular-gallery.tsx) |
| The collection surfer (previous, unused) | [src/components/ui/collection-surfer.tsx](src/components/ui/collection-surfer.tsx) |
| System film posters | `public/systems/system-01…13.png` |
| Section 8 — This Might Sound Like Your Story | [src/components/Story.tsx](src/components/Story.tsx) |
| Section 9 — Hair services | [src/components/Services.tsx](src/components/Services.tsx) |
| Service photographs | `public/services/*.png` |
| Section 10 — Step-by-step process | [src/components/Process.tsx](src/components/Process.tsx) |
| Process film poster | `public/process/steps.png` |
| Process film | `public/process/step-by-step.mp4` |
| Section 11 — Why thousands of men choose us | [src/components/Pillars.tsx](src/components/Pillars.tsx) |
| Section 12 — Before and after deck | [src/components/Deck.tsx](src/components/Deck.tsx) |
| The card stack | [src/components/ui/card-stack.tsx](src/components/ui/card-stack.tsx) |
| Testimonial card artwork | `public/social/*.png` |
| Section 13 — Advanced 3D Scan | [src/components/Scan.tsx](src/components/Scan.tsx) |
| Section 14 — Premium salons | [src/components/Salons.tsx](src/components/Salons.tsx) |
| Salon photo carousels | `public/salons/mumbai/`, `public/salons/delhi/`, `public/salons/bangalore/` |
| Section 15 — Frequently Asked Questions | [src/components/Faq.tsx](src/components/Faq.tsx) |
| Footer | [src/components/Footer.tsx](src/components/Footer.tsx) |
| Floating call + WhatsApp controls | [src/components/FloatingContact.tsx](src/components/FloatingContact.tsx), `public/contact/` |
| Story reels — circular client videos that open into a 9:16 reel | [src/components/StoryReels.tsx](src/components/StoryReels.tsx), [src/styles/story-reels.css](src/styles/story-reels.css), `storyReels` in `src/site.ts`, `public/story-reels/` (placeholders) |
| Shared responsive and motion hooks | [src/hooks.ts](src/hooks.ts) |
| **Page 2** — Stick-On or Clip-On shell | [src/pages/StickOnClipOn.tsx](src/pages/StickOnClipOn.tsx) |
| Page 2 hero | [src/components/ChoiceHero.tsx](src/components/ChoiceHero.tsx) |
| Page 2 hero image | `public/choice/stick-on-clip-on.jpg` |
| Page 2 — Real Results | [src/components/Transformations.tsx](src/components/Transformations.tsx) |
| Real Results artwork | `public/transformations/*.jpg` |
| Shared guide-page hero | [src/components/GuideHero.tsx](src/components/GuideHero.tsx) |
| **Page 3** — Hair Patch vs Hair System shell | [src/pages/HairPatchVsSystem.tsx](src/pages/HairPatchVsSystem.tsx) |
| Page 3 hero | [src/components/PatchSystemHero.tsx](src/components/PatchSystemHero.tsx) |
| Page 3 hero film | `public/patch-vs-system/patch-vs-system.mp4` |
| Page 3 comparison table | [src/components/PatchSystemComparison.tsx](src/components/PatchSystemComparison.tsx) |
| Page 3 why patches fail | [src/components/PatchFail.tsx](src/components/PatchFail.tsx) |
| Patch-fail check | [scripts/verify-patchfail.mjs](scripts/verify-patchfail.mjs) |
| Page 3 hair-system benefits | [src/components/HairBenefits.tsx](src/components/HairBenefits.tsx) |
| Benefits photographs | `public/hair-benefits/` — see its README |
| Benefits check | [scripts/verify-benefits.mjs](scripts/verify-benefits.mjs) |
| Page 3 checklist | Reuses [src/components/Checklist.tsx](src/components/Checklist.tsx) |
| Page 3 client stories | Reuses [src/components/ClientStories.tsx](src/components/ClientStories.tsx) |
| Page 3 clothing analogy panel | [src/components/SimplestWay.tsx](src/components/SimplestWay.tsx) |
| Page 3 booking close | [src/components/BookConsultation.tsx](src/components/BookConsultation.tsx) |
| Page 3 booking check | [scripts/verify-bookcall.mjs](scripts/verify-bookcall.mjs) |
| **Page 4** — Will My Hairline Look Real? shell | [src/pages/WillMyHairlineLookReal.tsx](src/pages/WillMyHairlineLookReal.tsx) |
| Page 4 hero | [src/components/HairlineRealHero.tsx](src/components/HairlineRealHero.tsx) |
| Page 4 hero still | `public/hairline-real/thumbnail.png` |
| Page 4 hero film | `public/hairline-real/natural-hairline.mp4` |
| Page 4 hero check | [scripts/verify-hairline-hero.mjs](scripts/verify-hairline-hero.mjs) |
| Page 4 systems gallery | Reuses [src/components/Systems.tsx](src/components/Systems.tsx) |
| Page 4 hairline-design scrub | [src/components/HairlineDesign.tsx](src/components/HairlineDesign.tsx) |
| Page 4 client stories | Reuses [src/components/ClientStories.tsx](src/components/ClientStories.tsx) |
| Missing-photo frame | [src/components/Photo.tsx](src/components/Photo.tsx) |
| Page 6 (Clip-On) shell | [src/pages/ClipOnLifespan.tsx](src/pages/ClipOnLifespan.tsx) |
| Page 6 hero | [src/components/ClipOnLifespanHero.tsx](src/components/ClipOnLifespanHero.tsx) |
| Lifespan hero film (shared with Page 5) | `public/guide-media/stick-on-vs-clip-on.mp4` |
| Page 5 balance stage | [src/components/BalanceChoice.tsx](src/components/BalanceChoice.tsx) |
| Its check | [scripts/verify-balance.mjs](scripts/verify-balance.mjs) |
| Page 5 base-option cards and overlays | [src/components/BaseOptions.tsx](src/components/BaseOptions.tsx) |
| Its check | [scripts/verify-base-options.mjs](scripts/verify-base-options.mjs) |
| Page 5 car analogy | [src/components/CarExample.tsx](src/components/CarExample.tsx) |
| Its check | [scripts/verify-car-example.mjs](scripts/verify-car-example.mjs) |
| Page 5 base chooser | [src/components/BaseChoice.tsx](src/components/BaseChoice.tsx) |
| Its check | [scripts/verify-base-choice.mjs](scripts/verify-base-choice.mjs) |
| Page 5 form | reuses [src/components/Form.tsx](src/components/Form.tsx) |
| Page 5 rating table | [src/components/BaseComparison.tsx](src/components/BaseComparison.tsx) |
| Its check | [scripts/verify-base-compare.mjs](scripts/verify-base-compare.mjs) |
| Page 5 hero | [src/components/StickOnLifespanHero.tsx](src/components/StickOnLifespanHero.tsx) |
| Page 5 shell | [src/pages/StickOnLifespan.tsx](src/pages/StickOnLifespan.tsx) |
| Page 5 systems gallery | Reuses [src/components/Systems.tsx](src/components/Systems.tsx) |
| Page 5 check | [scripts/verify-stick-on-lifespan.mjs](scripts/verify-stick-on-lifespan.mjs) |
| **Page 8** — Stick-On Hair System shell | [src/pages/StickOnHairSystem.tsx](src/pages/StickOnHairSystem.tsx) |
| Page 8 supplied imagery | `public/stick-on-system/` |
| Page 8 responsive check | [scripts/verify-stick-on-system.mjs](scripts/verify-stick-on-system.mjs) |
| Page 4 truth claims | [src/components/HairlineTruth.tsx](src/components/HairlineTruth.tsx) |
| Its check | [scripts/verify-hairline-truth.mjs](scripts/verify-hairline-truth.mjs) |
| Page 4 hairline benefits | [src/components/HairlineBenefits.tsx](src/components/HairlineBenefits.tsx) |
| Page 4 closing scrub | [src/components/HairlineConfused.tsx](src/components/HairlineConfused.tsx) |
| Scroll-built card stack | [src/components/ScrollStack.tsx](src/components/ScrollStack.tsx) |
| Page 4 natural-hair stack | [src/components/NaturalFront.tsx](src/components/NaturalFront.tsx) |
| Its check | [scripts/verify-natural-front.mjs](scripts/verify-natural-front.mjs) |
| Page 4 HD-exposed card rail | [src/components/HdExposed.tsx](src/components/HdExposed.tsx) |
| Its check | [scripts/verify-hd-exposed.mjs](scripts/verify-hd-exposed.mjs) |
| Page 4 brush-back decision tree | [src/components/BrushBackFlow.tsx](src/components/BrushBackFlow.tsx) |
| Its check | [scripts/verify-brushback.mjs](scripts/verify-brushback.mjs) |
| Its check | [scripts/verify-hairline-confused.mjs](scripts/verify-hairline-confused.mjs) |
| Its photographs | `public/hairline-benefits/` |
| Its film still | `public/hairline-real/design-film.png` |
| Its 4:3 film | `public/hairline-real/design-film.mp4` |
| Its check | [scripts/verify-hairline-design.mjs](scripts/verify-hairline-design.mjs) |
| Hash routing | [src/App.tsx](src/App.tsx) |

## Section 3 — "Our Big Achievements" (pinned horizontal scroll)

Matches the TRIONN "Selected work & explorations" pattern (reference recording
at `reference/selected-work-reference.mp4`). Section sticks to the viewport;
vertical scroll drives the track sideways through: intro panel, four achievement
cards, closing CTA panel.

**The height is the mechanism.** Section inline height is
`100vh + trackOverflow`, set from JS after measuring. That creates the scroll
distance for the pin — too little clips the last card, too much leaves dead
scrolling at the end. Verified: at 1440×900 the section measures 3366px
(900 + 2466 travel) and the track moves 0 → −2466 linearly, landing the closing
panel fully on screen.

Track is remeasured by `ResizeObserver`, not only on `resize` — fonts and images
change its width after first paint, so the initial number is wrong.

**Below 901px, and for `prefers-reduced-motion`, the pin is dropped entirely**
for a scroll-snapped swipe rail. Hijacking vertical scroll on a phone fights the
gesture the user already has. Same markup serves both: when the component
measures a distance of 0 it never sets `x`, and CSS makes `.work__pin` the
scroll container instead.

**The four production images are installed.** Source originals stay in
`Images/`; semantic copies in `public/achievements/` are referenced from
[src/site.ts](src/site.ts). The Bollywood image is deliberately face-blurred,
preserving the privacy requirement from the brand's design documentation.

## Section 4 — "Why Men Around The World Choose Us" (Key Facts)

Built from `reference/Recording 2026-08-05 185207.mp4`, which records TRIONN's
Key Facts entrance. The attached American Hairline layout supplies heading, four
proof numbers, brand colour, and card treatment; the recording supplies the
motion language.

Heading and card deck are centered like the reference, with no section CTA. The
reference has three cards; this adaptation keeps three visual columns but fits
four facts as requested: `12+ Years` fills the left column, `6,770+` and `100%`
stack in the middle, `12+ Nations` fills the right column. All four cards use
supplied photography as full-bleed backgrounds. Metrics are white, anchored over
the images' dark lower gradients for contrast. The two compact middle cards use
`6770 Men Helped.png` and `100 Natural Looking.png`; their labels share the same
lower alignment as the tall outer cards. Being shorter, they use a smaller
14-20px bottom inset so text reads near the bottom instead of near the visual
center.

Each image renders through
`src/components/ui/3d-parallax-effect-on-hover.tsx`. On hover-capable devices it
uses the supplied `--f`/`--r` clip-path and perspective formula to fold the image
from one side to the other. The image transform nests inside the existing
`motion.article`, so the original scroll-scrubbed card rise, tilt, stagger, and
settle animation is unchanged. Touch devices and `prefers-reduced-motion` render
the images flat.

This project already uses TypeScript and already has `src/components/ui`, but
intentionally does not use Tailwind or shadcn. The supplied utility layout was
ported to plain CSS in `src/styles/global.css`; no new dependency or CSS reset
was added.

As the section enters the viewport, `useScroll` plus a damped `useSpring` scrubs
the entrance. Cards start below the viewport as foreshortened 3D planes, enter on
a short stagger, overshoot upward, then flatten into the final grid. Outer cards
begin with opposite `rotateY`/`rotateZ` values; middle cards stay front-facing.
Copy rises and settles on the same timeline. A perspective wrapper is the cards'
direct parent so rotation retains visible depth.

Below 700px, cards become a 2×2 grid with shorter heights.
`prefers-reduced-motion` removes every entrance transform and renders the final
layout immediately. The section also owns an opaque isolated stacking context.
That containment matters because the shared Hero/Secret film is sticky: it now
stops at the Hero/Secret boundary and cannot paint behind this heading or its
cards.

## Section 5 — "Our 21-Point Checklist For A Perfect Hair System"

Built from `reference/Recording 2026-08-06 123824.mp4`. The reference is a dark
pinned stage with a 3D object held still on the left and a list scrubbed past a
fixed focus line on the right: the point in focus is sharp and white, its
neighbours grey behind an increasing depth-of-field blur, and an index number
sits at the far right and changes as the focus moves. **Sharpness, not size,
marks the active row** — every row is set at the same size, exactly as the
reference does it.

The 3D object is replaced by a video block carrying the supplied poster. The
list is the client's 21 points, in studio working order, from
[src/site.ts](src/site.ts).

**One motion value drives everything.** `--cursor` — a bare number naming the
point currently in focus — is written to `.checklist__in` each frame. The track
translates by `-(cursor + 0.5) × row-pitch`, the progress rail takes its width
from it, and each row derives its own signed distance from it for opacity and
blur. Because it is a plain number, the row pitch stays a responsive `clamp()`
in CSS instead of a pixel constant measured in JavaScript, so this section needs
no `ResizeObserver`.

**The cursor is shaped, not linear.** A linear cursor leaves the list parked
half-way between two rows at almost every scroll position, so nothing is ever
properly in focus. Each step is given a plateau: about two thirds of the scroll
between two points is spent resting on one of them, and the travel happens
quickly in the middle. Verified at 1440×900 — sampled scroll positions rest on
exact integers with `filter: none`, worst measured case 0.36px of blur.

Section height is `100svh + 20 × 26vh` (5580px at 1440×900), with a `100svh`
sticky child. There is no measured inline height, so nothing to get wrong on
first paint.

Micro-interactions: each word of the row taking focus rides up out of its own
mask, and the index is a two-digit odometer. Each odometer column is a full 0-9
reel translated to the digit it should show, so 09 → 10 rolls both columns while
12 → 13 rolls only the second, and the roll direction falls out of the
arithmetic. The word reveal is transform-only; opacity on those elements belongs
to the scrub, and a CSS animation would outrank the inline value while it ran.

The odometer was first built as a glyph swap inside `AnimatePresence`, and it
measured wrong: after 20 → 21 the entering digit stayed permanently at its
initial state — `opacity: 0`, translated a full row down — so the number read as
a single digit. A reel has no mount/unmount bookkeeping to get stuck on.
Verified at 1440×900 and 390×844: the glyph centred in each column reads 01, 08,
15, 21, 11, 01 across a scroll down and back up, matching the tally every time.

`prefers-reduced-motion` drops the pin entirely and renders all 21 points as a
plain static list, with the index restored as a CSS counter and the scrub rail
hidden.

The supplied 4:3 checklist film is installed. The original image remains its
poster and the inline controlled video appears only after Play is selected.

## Section 6 — "Some Of Our Clients With The Most Natural Hairline"

The Achievements mechanism reused, as requested: the section pins and vertical
scroll drives a horizontal track through intro panel → six client films →
closing panel, with the same `100vh + trackOverflow` inline height, the same
`ResizeObserver` remeasure, and the same swipe-rail fallback below 901px and for
`prefers-reduced-motion`. Verified at 1440×900: track 5958px, travel 4518px, and
at the end of the pin the closing panel's right edge sits at 1379px — fully on
screen inside a 1440px viewport.

**Cards are 16:9 and stay 16:9.** Every supplied poster is a 1920×1080
before/after split, before on the left and after on the right. The client's
design artwork shows portrait cards, but cropping these to portrait would throw
away the half of the frame the section exists to show. Each half is labelled
`BEFORE` / `AFTER`; without the labels the frame reads as one photograph of two
different men.

The quote sits on the poster over a gradient, matching the design. The gradient
belongs to the quote element rather than the card, so it leaves with the poster
when a film starts playing.

All six supplied client films are installed and mapped by client name. Each
1920×1080 video plays inside the existing 16:9 card, while its original image
remains the poster until playback begins. Names and quotes are client-supplied;
consent to publish identifiable clients still needs confirmation before launch.

## Pages and routing

The site was one page until 2026-08-18. It now uses a small hash-route switch in
[src/App.tsx](src/App.tsx) — no router dependency.

| Route | Page |
| --- | --- |
| `#/` (or anything unmatched) | The homepage |
| `#/stick-on-or-clip-on` | [Stick-On or Clip-On](src/pages/StickOnClipOn.tsx) |
| `#/hair-patch-vs-hair-system` | [Hair Patch vs Hair System](src/pages/HairPatchVsSystem.tsx) |
| `#/will-my-hairline-look-real` | [Will My Hairline Look Real?](src/pages/WillMyHairlineLookReal.tsx) |
| `#/stick-on-lifespan` | [Stick-On System Lifespan](src/pages/StickOnLifespan.tsx) |
| `#/clip-on-lifespan` | [Clip-On System Lifespan](src/pages/ClipOnLifespan.tsx) |
| `#/clip-on-hair-system` | [Clip-On Hair System](src/pages/ClipOnHairSystem.tsx) |
| `#/stick-on-hair-system` | [Stick-On Hair System](src/pages/StickOnHairSystem.tsx) |
| `#/smp` | [Scalp Micropigmentation](src/pages/Smp.tsx) |
| `#/hair-transplant` | [Front Hairline Transplant + Hair System](src/pages/HairTransplant.tsx) |
| `#/consult-with-founder` | [Consult with Founder](src/pages/ConsultFounder.tsx) |
| `#/about-us` | [About Us](src/pages/AboutUs.tsx) |
| `#/team` | [Team](src/pages/Team.tsx) |

**Routes match on a leading slash, and that is the whole reason this works.**
The nav's own links are bare hash anchors — `#home`, `#guide`, `#solutions` — and
a bare anchor has no slash, so it can never be mistaken for a route.
`#/stick-on-or-clip-on` is a route; `#guide` scrolls the current page. Hash
rather than path also means no dev-server or host rewrite rules: every route is
served by the same `index.html`.

This is deliberately the smallest thing that makes a second page reachable. The
brand has around thirteen pages; when the site passes a handful, replace this
with a real router rather than extending the map.

## Consult with Founder page

`#/consult-with-founder` is the complete eight-section paid-consultation page
from the supplied references. It covers the hero, decision risks, audience
qualification, consultation outcomes, founder introduction, value comparison,
four-step process, and closing CTA. Both booking CTAs are working telephone
links to the shared American Hairline number.

The page uses its own stylesheet at
[src/styles/consult-founder.css](src/styles/consult-founder.css). GSAP and
ScrollTrigger provide one-time reveal/stagger motion and the process-line draw;
hover, focus, and press states provide smaller card and CTA interactions.
`prefers-reduced-motion` removes the animated transitions while keeping all
  content visible. The “Why This Consultation Is Different” media panel uses
  the supplied founder portrait via the optimized `public/consult-founder.png`
  asset. Its baked-in name treatment remains visible without duplicate HTML text.

Run `node scripts/verify-consult-founder.mjs` while the Vite server is running
to check section structure, CTA targets, image integrity, animation completion,
responsive grids/timeline, reduced motion, and horizontal overflow at desktop,
tablet, phone, and landscape-phone widths.

## About Us page

`#/about-us` is the eleven-section company page built from the supplied
references. Its page-local sections are the team hero, proof-stat grid, Our
Story card and long-form dialog, mission, founder, blue journey CTA, and careers
close. Existing `Achievements`, `Backed`, `Services`, and `Salons` components
are reused for the repeated sections, so their content and behavior stay in
sync with the homepage.

Supplied About PNGs are preserved under `Images/About us/`; lightweight WebP
derivatives live under `public/about/`. Run
`node scripts/optimize-about-assets.mjs` to recreate them, or pass one output
filename to rebuild only that asset. The Our Story derivative crops the source's
baked outer frame so artwork fills its card edge to edge. Page styling is in
`src/styles/about.css`. GSAP provides restrained hero and section reveals;
CSS adds button shimmer, card lift, and press feedback. Reduced motion keeps
all content static and visible. The Story overlay uses the native dialog API,
supports Escape, restores page scroll when closed, and provides a 44px+ close
control. Explicit fixed positioning plus auto margins keeps it centered in both
axes at desktop, tablet, portrait-phone, and landscape-phone sizes.

Mission and Founder use responsive `<picture>` sources. At `700px` and below,
Mission swaps to the portrait 900x1124 `public/about/mission-mobile.webp` and
Founder swaps to the portrait 900x1858 `public/about/founder-mobile.webp`, made
from the supplied `Frame 2085665212.png` and `Frame 20856651921.png`. Above that
breakpoint the original desktop `mission.webp` and `founder.webp` remain in use.

The About-only surfaces behind Our Big Achievements, Backed By Thousands Of
Confident Men, and Transform Your Life With Hair Again use the shared soft-grey
page tone. Careers reuses the existing dark `StillConfused` stage with Careers
copy: pinned word-by-word illumination, ambient capsule, delayed supporting copy
and a `#/team` route CTA, responsive wrapping, plus a fully visible
reduced-motion state.

Run `node scripts/verify-about.mjs` while Vite is running to validate routes,
section/card counts, assets, working phone/email CTAs, dialog behavior,
responsive layout, animation completion, reduced motion, failed requests, and
horizontal overflow at desktop, tablet, phone, and landscape-phone widths.

## Team page

`#/team` is reached from the Careers “Join The Team” CTA on `#/about-us`. It
keeps the shared Header and Footer and currently carries four sections: the
supplied “Life At American Hairline” hero, “Why You Will Love Working Here”,
“P.S. - Check Out Our Office”, and “Apply Now”. The hero uses the supplied Join Us and
Instagram icons and links both the primary CTA and all four exact 9:16 reel
cards to the supplied Instagram URL in a new tab. On phones (below 700px),
the hero reels become a larger 77vw swipeable, center-snapping rail with
neighbouring cards peeking into view; desktop keeps the four-column grid.

The office section uses four supplied 2960×1672 team photographs. Desktop pins
a compact white stage while GSAP ScrollTrigger maps vertical page scroll to the
horizontal photo track. The track moves only with transforms and holds the title
in place. At 900px and below it becomes a two-column grid; at 620px it becomes
one column. Reduced motion also uses a static two-column grid, so every
photograph remains available without scrubbed movement or a nested horizontal
gesture.

All ten Team assets are optimized WebPs under `public/team/`, have declared
dimensions, and are reproducible with `node scripts/optimize-team-assets.mjs`.
Run `node scripts/verify-team.mjs [outDir]` while Vite is running to check the
hero, exact office image order and dimensions, desktop pin/track travel,
responsive grids, reduced motion, failed requests, and horizontal overflow.

“Apply Now” contains six open-role cards matching the supplied reference:
Social Media Executive (three cards), Senior Video Editor, AI Developer Intern,
and Talent Acquisition Executive. Each card shows Mumbai / Full-Time metadata
and a 44px+ `mailto:info@americanhairline.com` CTA with the role in the subject.
The grid is two columns on desktop and one column below 700px; cards reveal with
a staggered ScrollTrigger entrance and remain visible under reduced motion.

`#/results` is linked from the header Results item. Its responsive hero uses
the supplied camera eyebrow icon and bald-to-bold transformation artwork, with
accessible copy and a centered play affordance. After the Results filter rail,
it reuses the homepage Backed, client-video, and achievements sections in that
order. It then adds responsive common-mistakes versus approach cards, a
problem/typical-solution/American-Hairline comparison, and a consultation CTA
linked to `#/consult-with-founder`.

The Results client rail uses the supplied wide desktop images at 701px and
above and supplied portrait mobile images below 701px, while preserving the
same category filters, testimonials, and product links.

On `#/clip-on-hair-system`, the FAQ uses an eleven-item Zycon/Clip-On question
set with no Consultation/Hair System topic tabs. The shared “Still have
questions?” card remains below it.

On `#/stick-on-hair-system`, the supplied six-item Zycon/Stick-On FAQ also
uses the shared dark glass FAQ treatment and keeps the same closing questions
card.

## Page 2 — "Real Results That Showcase True Transformations"

The homepage's client-stories mechanism, reused: the section pins, vertical
scroll drives a horizontal track through intro panel → eight client cards →
closing panel, and the section's height is `100vh + trackOverflow` measured
after paint by a `ResizeObserver`. Below 901px and for reduced motion the pin is
dropped for a snap rail — **the same markup**, with CSS making the pin the
scroll container.

It replaced a hover-to-expand deck that kept a *second, duplicated markup tree*
for mobile, so this was a simplification rather than a restyle.

The artwork is 1921×1080 before/after splits with no labels — the same shape and
the same problem as the homepage's posters, so the `Before` / `After` tags carry
over for the same reason: without them the frame reads as one photograph of two
different men.

**The one way the card differs from the homepage's** is the per-client method
link — "Stick-On Hair System" or "Clip-On Hair System". On a page about choosing
between the two, which one a man actually wore is part of the evidence. The
homepage has no such choice to make, which is why its cards carry no CTA.

**The images were converted.** The supplied PNGs were ~2 MB each, 16.0 MB for
the eight. At a 1920px `.jpg` plus a 1200px `-small.jpg` they come to **1.86 MB
for all sixteen, an 88% reduction**, served through `srcSet`/`sizes`. The PNGs
remain beside them in `public/transformations/`, so it is reversible.

Measured at 1440×900: section 6,984px, track 7,524px, travel `0 → −6,084`, and
the closing panel finishes at 832–1,380px inside the viewport. All eight CTAs
are 44px tall, clearing the tap-target floor the mobile pass set.

## Section 7 — "World's Finest Thinnest Hair Systems" (circular gallery)

Built from the supplied `circular-gallery` component, ported into
[src/components/ui/circular-gallery.tsx](src/components/ui/circular-gallery.tsx).
The thirteen product posters stand on a circle and the ring turns about its
axis as the section scrolls, so the range reads as one object being walked
around rather than as a row being pushed past.
[src/components/Systems.tsx](src/components/Systems.tsx) supplies the content,
the heading and the scroll.

### What the port changed, and why

The component arrived as Next + Tailwind + shadcn. Beyond the usual translation
— Tailwind utilities became rules in the `.cgal` block of `global.css`, `cn()`
went, and `NodeJS.Timeout` became `ReturnType<typeof setTimeout>` because this
runs in a browser and the project builds with `tsc -b` — three changes were
substantive:

1. **The scroll listener is gone; rotation is a prop.** The original read
   `window.scrollY` against the whole document. That works on its demo page,
   where the gallery *is* the page. Here the document is around 30,000px tall,
   so the gallery would already have been part-rotated before it came into view
   and a full scroll through its own section would have turned it only a
   fraction of a revolution. `Systems.tsx` now owns the scroll with `useScroll`
   against the section — the same as every other scrubbed section here — and
   hands the gallery `progress`.
2. **Rotation is a motion value, not React state.** The original called
   `setRotation` inside a `requestAnimationFrame` loop, re-rendering the whole
   gallery every frame for the life of the page, on screen or not. The angle
   and each card's opacity are motion values now, which motion writes straight
   to the DOM — no re-render at all.
3. **`still` renders a snap rail.** Every animation in this project respects
   `prefers-reduced-motion`, and a 3D carousel is not something a phone should
   be asked to spin.

### Two things worth knowing about the geometry

**Backfaces are hidden.** Every card faces outward from the axis, so the far
half of the ring shows card *backs* — and a poster seen from behind is
mirrored, which rendered the brand wordmark in reverse and read as a bug rather
than as depth. Hiding backfaces drops the far half; the near half always faces
the camera, so the ring is never empty, it just shows a different set as it
turns. It also removes the edge-on slivers, which measured 5px wide at half a
turn.

**Radius stays well under perspective** — 700 against 2,200. The front card
sits at `translateZ(radius)`, so it is that much nearer the camera and is
magnified by `perspective / (perspective − radius)`, about 1.47× here. At
parity the card would be *on* the camera plane and project infinitely, which is
the trap the previous implementation of this same section hit; it is recorded
in [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) §5.

Measured at 1440×900: the section is 1,710px (`100vh + 90vh`), the ring turns a
full revolution across it — 1.7° at the start, 93.5° at a quarter, −175° at a
half, back to 8.4° at the end — and the front card measures 440px across.

### The previous implementation is still on disk

This section was a **collection surfer** until 2026-08-08 — a diagonal ribbon
receding into depth — and before that, briefly, a motion arc. Neither
`ui/collection-surfer.tsx` nor its `.surf` CSS block has been deleted, so both
are dead weight in the bundle until someone decides this direction is final.
Say the word and they go; `git checkout homepage-v1 -- src/components/ui/collection-surfer.tsx`
brings the surfer back if this one is not wanted.


## Section 8 — "This Might Sound Like Your Story"

Built on TRIONN's "Our values" pattern from
`reference/Recording 2026-08-06 182025.mp4`. The heading holds still on the
left while the cards stack in on the right one at a time, each one preceded by
a narrower grey slab of itself peeking out from under the card above — the
thing that tells you more is coming. Content is the client's five recognitions
and the closing offer, from [src/site.ts](src/site.ts).

Two overlapping ramps per row drive it. `--open` runs a row from its peek to
its full height over one step of scroll; `--peek-amt` starts a step earlier and
is what puts the next card on screen as a slab. Both are published as bare
numbers, so the peek height, the gap and the grey wash are all expressed in the
stylesheet against them.

**Rows open to their own content height with nothing measured.** Each row is a
one-track grid whose `grid-template-rows` runs `0fr` → `1fr`, which resolves to
the row's content height. Only that one value is written from JavaScript, since
`fr` cannot appear inside `calc()`.

**`minmax(0, …)` around it is load-bearing.** A bare `fr` track carries an
automatic min-content minimum, so `0fr` alone left every closed row standing at
the height of its own padding — measured 46px instead of collapsing to the
18px peek.

The pinned stage is top-aligned, not centred: the stack grows downward, and
centring it would slide the heading up the screen as the stack grew. The
reference holds the heading still and lets the empty space below fill in.

Verified at 1440×900: section 2250px (`100vh + 5 × 30vh`), heading fixed at
y = 54 through the whole pin, row heights `[92, 18, 0, 0, 0, 0]` at the start
and `[92, 92, 92, 92, 92, 249]` at the end, copy opacity ramping in step, and
the stack finishing at y = 823 inside a 900px viewport. Scrolling back up
closes the rows again.

Below 901px the pin is dropped and every card stays open, but the section no
longer lands as a static block: the heading resolves from a short blur and the
six cards rise in on a 70ms stagger. The CTA compresses slightly on touch so
its press is acknowledged. This phone-only entrance runs once when the stack
enters the viewport. For `prefers-reduced-motion`, all content renders already
settled with no stagger or press transform.

## Section 9 — "Explore Our Trusted Range Of Hair Services"

Built to the pattern in `reference/Recording 2026-08-07 122845.mp4`: the
services are **full-width rows**, not a list beside one shared photograph. Each
row carries its own photograph flush against its left edge, and **the row
itself is what opens** — it grows from a strip to a tall band, so the
photograph pans down and reveals more of itself while the copy fades in beside
it. One row is open at a time.

The section still pins like "Our Big Achievements": it sticks to the viewport
and vertical scroll drives which row is open, while the heading holds still
above the stack. The cursor uses the same plateau shaping as the checklist, so
each step rests on one service for most of the scroll between two rather than
sitting half-open almost everywhere.

**Two transitions do the opening, and they are deliberately separate.** The row
animates its own `height` between `--row-closed` and `--row-open` — that is
what moves the photographs, because the image is `object-fit: cover` inside it.
The copy animates `grid-template-rows: 0fr → 1fr`, so it opens to exactly the
height its own text needs with nothing measured. `minmax(0, …)` is required
around the `fr` — see the trap in [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) §5.

The name sits at a **fixed offset from the row's top edge** (`--row-pad`), not
centred: only a fixed offset keeps it on the same line as the row grows.
Measured 29px from the row top in all three rows, open or closed.

The heading is indented by `calc(var(--services-media) + var(--services-gap))`
so it starts on the same vertical as the service names below it. Media column
and gap are single custom properties precisely so the rows and the heading
cannot drift apart. Measured left edge 504px for both at 1440px.

**The headings are real buttons.** In pinned mode a click moves page scroll to
that service's position rather than setting a second piece of state that would
then disagree with the scroll position — one click target, one source of truth.
`aria-expanded` tracks the open panel in both modes.

The row CTA is a text link in `--accent-ink`, not the gradient button used
elsewhere: inside a row this size a filled button out-shouts the photograph
beside it.

Only the first service's copy came with the design. The other two are written
to the brand's candour rule: the SMP line says on a sales page that SMP does
not regrow hair, because that is what the brand's other pages already say.

For `prefers-reduced-motion` at desktop widths the pin is dropped and the rows
take their height from the photograph (`aspect-ratio: 4 / 3`) while keeping the
two-column click accordion. Below 901px every service stays open and each row
stacks photograph above copy. The headings remain visible but are disabled as
controls because there is nothing left to expand or collapse.

## Section 10 — "The Step-By-Step Process To Natural Hair"

Built to TRIONN's "How we work" pattern from
`reference/Recording 2026-08-07 124928.mp4`: a **dark stage** (`#08090b`, the
same ground as the 21-Point Checklist) that pins, a heading that holds still,
and the three steps arriving **one at a time** across the bottom as the scroll
advances. Each step is preceded by a `+` and followed by a rule that draws
toward the next; the marker at the far right only lights once the last rule has
arrived. That drawing line is the section's spine — it is what carries the eye
from step to step.

**The reference has no film; the client's artwork does.** The top of the stage
is therefore a two-column masthead — heading and the `Discuss With A
Consultant` CTA at the left, the process film at the right. It fills the empty
upper right the reference leaves, keeps the heading on the same left edge as
the steps beneath it, and puts the film above the row rather than inside it,
where it would out-shout three short pieces of copy.

The play pill sits **bottom-left of the poster, not centred**: the poster's
whole point is the finished hairline, and a centred control lands across the
client's face.

Reveal windows live in `START = [0.1, 0.36, 0.62]` with a 0.16 copy window and
a 0.22 rule window, all as fractions of the pinned scroll. Nothing in the
component knows the pin's length — `useScroll` reports it as 0 → 1 whatever
`--process-step` (32vh) measures.

The supplied 4:3 film plays inline after the poster control is selected. The
existing `steps.png` remains the pre-play poster and the video uses
`object-fit: contain` so no frame content is cropped.

Below 901px and for `prefers-reduced-motion` the pin is dropped and masthead,
film and all three steps stack as a plain list with every rule already drawn.
Because motion writes those values as inline styles, the still-mode overrides
have to carry `!important` — an inline style loses to nothing else.

## Section 11 — "Why Thousands Of Men Choose American Hairline"

Built to the pattern in `reference/Recording 2026-08-07 142837.mp4`: a light
stage that pins, a left-aligned heading that holds still, and **four columns
divided by hairline rules that fill one bay at a time, left to right** as the
scroll advances.

**The grid is drawn before anything lands in it.** The rule above the row and
the rules between the bays belong to the list, never to the columns' animated
contents, so the empty bays stand from the first frame and the filling reads as
one sequence rather than four separate fades. Verified by measuring: column
left edges 60/390/720/1050 and rule widths 0/1/1/1px, unchanged at every scroll
position while the copy opacities climb.

The icon leads its own column by a hair (0.07 of the pinned scroll against the
copy's 0.17), so a bay reads as filling rather than switching on. Reveal starts
live in `START = [0.08, 0.28, 0.48, 0.68]`.

**Two departures from the client's artwork, both deliberate:**

- The artwork carried these four pillars as a card carousel with prev/next
  controls. The reference governs the presentation here, so the cards became
  the reference's open columns and the controls went with them — every pillar
  is on screen at once and scroll is the only control.
- The artwork tinted the icons blue. They are monochrome here, because
  `tokens.css` reserves blue for the active link, the two buttons, the eyebrow
  and the slider controls, and four decorative tiles are none of those.

Copy is verbatim from the artwork, including its bold. `**` marks the emphasis
in [src/site.ts](src/site.ts) so the strings stay readable there; `Emphasised`
in the component splits on it and renders `<strong>`. Thirteen bold runs across
the four pillars, and no `**` survives into the rendered text.

At 1080px the grid folds to two columns and the rules move with it — "every
column after the first" is the wrong rule once the row wraps, since row two's
left edge would carry a stray rule and its top would carry none. Below 720px it
is one column with a rule above each. Below 901px and for reduced motion the
pin is dropped and every column is present at once; those overrides carry
`!important`, because the values they replace are inline styles from motion.

## Section 12 — "Before And After, In Their Own Words"

The deck is
[src/components/ui/card-stack.tsx](src/components/ui/card-stack.tsx) — the
supplied fanned-stack component, **ported** to this project's stack. One card
is active and held upright at the front; its neighbours fan out behind it on a
spring, tilted back in perspective.

**Two mechanisms, deliberately separate.** Scroll opens the hand: the section
pins and vertical scroll runs the fan from a near-closed stack to full spread,
which is the reference recording's move — measured ±2.2° at the start against
±29.8° once open, and a painted span of 453px against 1302px. Clicking a card
centres it, which is the component's own behaviour, and it keeps working at
every stage of the opening. They stay independent because the spread and the
active index are different things: the `openness` prop added to the component
scales the whole geometry, while the index goes on choosing which card is at
the front.

`openness` is React state rather than a motion value, because the stack
animates *toward* it on a spring instead of being written every frame. The
scroll is quantised to 40 steps to keep the re-render count sane, and the
spring makes the steps invisible. Note the mount read: `useMotionValueEvent`
only fires on a change, so a page that loads with the section already in view
would otherwise never hear one — the deck opened flat on first paint until the
value was read once directly.

There are no dots, follow line or social links under the deck. Phones instead
get one compact, centred gesture cue immediately below the fan: “Swipe to see
more transformations” with a double horizontal chevron. The icon drifts gently
left and right so the interaction is discoverable without competing with the
cards; it stays still when reduced motion is requested. Desktop hides the cue.

**What the port changed, and why.** The component arrived as Next + Tailwind +
shadcn; this project is Vite + plain CSS. `next/link` became a plain `<a>`
(there is no router); every Tailwind utility became a rule in the `.cstack`
block of `global.css`, mapped one-for-one and listed in that block's comment
(adding Tailwind now would bring its preflight reset and restyle everything
already built); `framer-motion` became `motion/react`; `cn()` went, because
with plain CSS the class lists are short enough to join inline. The geometry,
the props and the behaviour are the original's. Two props were added:
`variant="bare"`, which drops the card chrome, and `openness`, which is what
lets scroll open the fan.

The five PNGs are **finished artwork**: the before/after portraits, the name
chip and the quote are all baked into each file, and the files carry their own
rounded corners on transparency. Three consequences. `renderCard` draws the
picture and nothing else, so the component's default caption never covers the
artwork's own. The card runs `variant="bare"` and takes its shadow from a
`drop-shadow` filter rather than `box-shadow`, so the shadow follows the alpha
instead of drawing the rectangle the picture is not. And the words that exist
only inside the picture are carried by `alt` — that is the only route a screen
reader has to them, so each card's `alt` names the client and quotes him in
full.

**The fan hangs below its own cards.** A card turned 30° reaches about 55px
past its own bottom edge, and the outer pair are pushed a further 20px down the
arc, so the hand overflows the stage its cards nominally fit in.
`.cstack__field` is lifted 40px off the stage floor to keep those corners
inside the section, without changing the stage's height.

The gap between the heading and the fan is the composition, not slack: with the
default it read as the top cards hanging off the type. It measures 61px.

Card sizes are pixels, not lengths, because that is what the component takes —
so the responsive step happens in `Deck.tsx`. Height leads (58vh, capped at
540px) and width follows from the artwork's 1472:1840, unless the viewport is
too narrow to carry it. On a phone the fan shows three cards instead of five
and is deliberately wider than the screen: the outer cards bleed past both
edges rather than shrinking to fit, and `.deck` carries `overflow-x: clip` to
cut the bleed — `hidden` would force `overflow-y: auto` alongside it and make
the section a scroll container.

## Section 13 — "Uses Advanced 3D Scan Technology"

Built to the move in `reference/Recording 2026-08-07 180443.mp4`: a dark stage
that pins, a headline that holds still, and the picture set **inline within the
headline** growing out of its own slot until it fills the stage, dimming the
type it passes over. The heading breaks as `Uses Advanced [picture] 3D` /
`Scan Technology`.

**The picture is not scaled.** It is an absolutely positioned panel whose
`left/top/width/height` are interpolated between two measured rects — the
slot's and the pin's padding box. That is what a scale transform cannot give:
the panel changes aspect as it grows, so `object-fit: cover` re-crops the
photograph on the way out, and the corner radius stays a real radius instead of
being magnified by the same factor as everything else.

**It stops short of the edges.** The grown panel keeps air on all four sides
rather than running full-bleed, and the inset is `.scan__pin`'s own padding,
read back by the component — one number, living in the stylesheet, with nothing
in the JavaScript to keep in step with it. Measured at 1440×900: the panel runs
`163×103` at the slot to `1342×842`, leaving 49px left and right and 29px top
and bottom, against a stated padding of `48.96px / 28.8px`. The radius grows
12px → 20px rather than running to 0; a squared-off rectangle made sense when
the panel finished flush with the viewport and its corners were cut off anyway,
but inset it would just look unfinished.

**The slot is an empty inline-block that is never painted.** It reserves the
picture's place in the sentence, and measuring it is how the panel knows where
that place is at any type size and in any wrap. It is re-measured by a
`ResizeObserver` and after `document.fonts.ready`, because the line reflows
when the webfont lands and the slot moves with it.

The spaces around the slot are **real characters**, not the slot's margin: the
slot is `aria-hidden`, so without them the heading is announced as "Uses
Advanced3D Scan Technology".

The type dims to 0.28 rather than disappearing — the panel is passing in front
of it, not deleting it — and the heading's top stays at the same pixel through
the whole growth.

The photograph is the file already installed for the Big Achievements card, so
it is referenced at `/achievements/advanced-3d-scan.png` rather than copied a
second time.

Below 901px the pin is dropped and the slot collapses so the heading reads as
two plain lines. The formerly static fallback now echoes the desktop idea once:
the title resolves from a short blur, the picture rises and opens from a soft
inset crop, then one restrained white scan beam crosses it. For reduced motion,
the picture sits under the heading as an ordinary settled block and the beam
is never rendered.

## Section 14 — "Walk Into Any Of Our Premium Salons"

Built to TRIONN's "Selected work & explorations" from
`reference/selected-work-reference.mp4`, which turns out to be the **same
mechanism as Our Big Achievements**: the section pins and vertical scroll
drives a horizontal track through intro panel → city cards → closing panel. The
component is a sibling of `Achievements.tsx` and shares its measured-distance
approach rather than inventing a second one.

The section's height is `100vh + trackOverflow`, measured by a
`ResizeObserver` because fonts and images change the track's width after first
paint. Measured at 1440×900: track 2,971px, travel 0 → −1,531px, and the
closing panel lands at 960–1,380px inside a 1,440px viewport — on screen, not
scrolled past.

Each card sets the **city over the photograph** and its address underneath,
with the artwork's `Get Direction` button opening Google Maps in a new tab.
The city is the card's `<h3>`, positioned over the image rather than repeated
below it, so it is announced once.

Below 901px and for reduced motion the pin is dropped for a plain swipeable
snap rail — the same fallback, and for the same reason: hijacking vertical
scroll on a phone fights the gesture the user already has.

Each city card uses supplied branch photography. Mumbai has three slides;
Delhi and Bangalore have two each. They advance every five seconds, with dot
selection and pause/play controls; auto-rotation pauses for focus/hover and is
disabled for reduced-motion users.

## Section 15 — "Frequently Asked Questions"

Structure from the client's two artworks: a pill toggle between
**Consultation** and **Hair System**, an accordion with one answer open at a
time, and a "Still have questions?" card at the end. Treatment from the third
reference image instead — a dark stage with translucent glass cards, white
type, and a rating badge under the heading.

**The ground is CSS, not a photograph.** One broad diagonal sheen over two
blurred pools on a `#17191d → #08090b` gradient, the same construction as the
Secret section's room. It carries the reference's look without adding a
megabyte for a backdrop that is mostly out of focus anyway.

Two departures from the client's artwork:

- The artwork fills the closing panel with brand blue. On a dark stage that
  reads as a second background rather than as a call to action, so the panel is
  glass like the rows above it and the blue stays where `tokens.css` puts it —
  on the button.
- The stars are amber, against the site's one-blue rule, for the same reason
  the 100% badge on the wordmark gets its own colour: a rating that is not gold
  reads as decoration rather than as a rating. The numbers are the brand's own
  — 4.9, 300+ Google reviews.

**Each tab keeps its own open row**, so switching back to a tab returns it as
you left it rather than resetting to the first answer. Closing the open row is
a legal state: nothing open is allowed.

Answers open with the `grid-template-rows: 0fr → 1fr` transition used
elsewhere; `minmax(0, …)` is required around it — see the trap in
[PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) §5.

Only the first answer in each tab came with the artwork. The rest are written
to the brand's candour rule, and **two of them deliberately give no number**,
because those numbers are still unresolved in the client's own material: the
servicing interval is stated three ways and so is base durability. Those
answers say what decides the figure and leave the figure to the consultant
rather than shipping one of three. One question was also corrected for
agreement — "How long does hair replacement systems last?" now reads "How long
does a hair replacement system last?".

## The footer

Built to the treatment in `reference/Recording 2026-08-08 112654.mp4`: the
site's name set enormous across the top as **outlined type** — `color:
transparent` with a `-webkit-text-stroke` — wide enough to run off both edges
and be cropped by the section's `overflow: hidden`. The crop is the effect, not
an accident: measured 1,540px of wordmark inside a 1,440px viewport, and 527px
inside 390px. The outline is what keeps it a watermark rather than a heading
competing with the page, so it is `aria-hidden` — the same words are already
the logo, the legal line and the page title.

Desktop uses the original `clamp(4rem, 13vw, 15rem)` scale. A later inline
`3.1rem` override had shortened it; that override is removed. Widths through
900px deliberately keep `3.1rem`, so restoring the desktop wordmark does not
change the current phone composition.

Directly beneath it runs the **looping marquee**. The reference loops one
phrase; this loops five, separated by an asterisk — the 100% claim plus the
four pillars, so the line echoes the pillars section rather than introducing
wording of its own.

**The loop is two identical copies translated by exactly −50%.** That is the
whole trick: at −50% the second copy sits precisely where the first began, so
the restart is invisible, nothing is measured and no JavaScript runs. The
second copy is `aria-hidden`, so the phrases are not announced twice. It pauses
on hover, and `prefers-reduced-motion` stops it outright — a permanent
horizontal crawl is one of the clearest things that setting is asking you not
to do. Verified: the track moves under normal motion (−124 → −220px in 1.6s)
and does not move at all under reduced motion.

Under that arrangement sits the client's own footer content — blurb and
socials, Quick Links, Solution, Contact Us, then the legal line — because "the
same, with more content" is what was asked for. Phone and email are real `tel:`
and `mailto:` links. The back-to-top button honours reduced motion too, jumping
instead of smooth-scrolling.

Quick Links places “Consult with Founder” directly below “About us”, matching
the supplied footer reference. It opens the dedicated
`#/consult-with-founder` consultation page.

> **The four social links are placeholders.** Every `footerSocials[].href` in
> [src/site.ts](src/site.ts) is `'#'` — the brand's real handles have not been
> supplied.

## Section 6b — "Backed By Thousands Of Confident Men"

The client's artwork is a dark rounded panel carrying two proof cards. The
treatment is the **FAQ's**, because both were built to the same reference
image: a dark ground with one broad diagonal sheen over two blurred pools, and
translucent glass cards on top of it. Reusing that construction is deliberate —
the page should not carry two different dark looks that were meant to be the
same one.

Unlike the FAQ this is a **contained panel** on the white ground rather than a
full-bleed stage, which is what the artwork shows and what keeps it from
reading as a second FAQ.

### What the first version got wrong, and what fixed it

The first build let two short cards span the whole container. At 1440px that
made each card a **790×110 letterbox** with its qualifier — "300+ reviews" —
stranded ~450px from the figure it qualifies, which is far enough that the eye
stops binding the two. The panel was 1,320px wide around 900px of content, so
roughly 210px of empty black sat on each side. Nothing on the card was
dominant, and nothing responded to the pointer.

Four changes:

1. **Cap the panel** at 1,012px — the content's 900px plus its padding — so the
   dark area hugs what is in it. Measured 1,012×456 against 1,320×391 before.
2. **Stack the card** instead of running it as one row. Cards are now 439×197
   rather than 790×110, and the icon, qualifier, figure and label each get
   their own place.
3. **Move the qualifier up beside the icon** as a chip, where it reads as
   metadata about the figure below rather than as an unrelated fragment at the
   far end of a bar.
4. **Make the figure the largest thing on the card** — 46px against the label's
   16px. It is the proof; it should not be the same size as its own caption.

### What it does now

The figures **count up** when the panel arrives, on `requestAnimationFrame`,
because the thing being animated is the text itself rather than a style. The
stars **light in sequence** behind the count, so the rating assembles instead
of appearing finished. A soft **spotlight follows the pointer** across each
card — the panel's own light, made to track the cursor — written as `--mx` /
`--my` custom properties so the card's transform stays free for its hover lift,
the same split `useTilt` makes elsewhere.

All three are dropped under `prefers-reduced-motion`: the settled values are
simply present, the spotlight is `display: none`, and the count-up is skipped
in the component rather than run invisibly. The animated figure is
`aria-hidden` with the settled value in a `sr-only` span beside it, so nobody
is read a number mid-count.

**4.9 renders as four whole stars and a half, never five.** Rounding a rating
up is the one thing a rating must not do; `Stars` takes the number and derives
the glyphs from it rather than being handed a count. Verified as
`full, full, full, full, half`. The amber is the same sanctioned exception as
the FAQ's — a rating that is not gold reads as decoration.

Both figures are the brand's own: 4.9 across 300+ Google reviews, 50K+ on
YouTube. Icons are the client's own PNGs at `public/backed/`.

**The artwork's "HAPPY CLIENTS" pill is not here.** The visual system in
[PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) §3 removed eyebrow tags site-wide in
favour of one heading per section — the same call already made in the Pillars
section. It is one line to restore if the client wants it back.

Below 760px the two cards stack and each card's right-hand aside drops under
its figure, because at that width it has nothing left to be right-aligned
against.

## Three sections built together — and where the depth goes

These three were built in one pass, so the rule they share is worth stating
once. The 3D work that holds up on a real site is fairly consistent about one
thing: **perspective earns its place on a single object the visitor is meant to
inspect, and stops earning it the moment it is applied to everything.** So the
tilt is on the video card and on the methods photograph, it is small (5° and
4°), it is pointer-driven rather than scroll-driven, and it is nowhere near any
type or any input.

All three use `useTilt`, which writes `--rx` / `--ry` rather than setting a
transform. That is what lets an element carry both the tilt and its own hover
change without one overwriting the other, and it is the hook that refuses
coarse pointers and reduced motion — so the phone never pays for a scene it
cannot use. Below 900px the `perspective` is dropped outright for the same
reason.

## Section 6c — "Real Hair Or Illusion? Watch & Decide"

One 16:9 card, given depth rather than decoration. The poster is oversized
inside its frame and moves against it, so the card reads as having a front and
a back instead of a flat plane being rotated. The card is 980×551 at its
desktop maximum and keeps the same 16:9 frame on phones.

The supplied 16:9 film plays inline after the poster control is selected. The
existing thumbnail remains visible before play and as the video poster.
The poster is the supplied 992×558 `image png 2.png`, installed as
`public/decide/from-bald-to-bold.png` without resizing.

## Section 6d — "Our Trusted Methods For A Natural Look"

The client's artwork: heading top-left, accordion bottom-left, a photograph
filling the right column. **Each method has its own photograph** and the panel
cross-fades to whichever row is open. Depth is on the photograph only — type
that rotates is type that is harder to read.

Closing every row is a legal state, so the picture **holds on the last method
that was open** rather than blanking. An empty panel would leave the right-hand
column as a grey rectangle, which reads as a broken image rather than as a
closed accordion. Only the visible photograph carries `alt`; the hidden one is
`aria-hidden` with an empty `alt`, so nobody is read a description of a picture
that is not on screen.

Both files are the panel's own aspect ratio — 1088:1422 and 1632:2133 both
resolve to 0.765 — so neither is cropped to fit. Worth keeping to when a third
method arrives.

**The photograph's proportions set the row's height.** `.methods__media`
carries `aspect-ratio: 1088 / 1422` and `align-self: start`, which is what lets
the left column stretch to match it and sit heading-top / accordion-bottom as
in the artwork. Left to stretch instead, the row was only as tall as the copy
and the portrait became a 528×392 landscape crop — measured before the fix,
528×690 after.

Two methods, because two is what the artwork shows. Zycon™ is a third method
the brand sells and would slot straight in — it would need a photograph of its
own.

Clip-On has its own photograph. Stick-On still borrows the Services section's,
and would be better with one of its own.

## Homepage — "Looking for Expert Advice from the Founder?"

The paid founder-consultation block sits directly before the homepage guidance
form, after FAQ. That is the page's highest-intent decision point: visitors can
first resolve common objections, then choose the private paid route or continue
to the general guidance form. The section is intentionally one focused,
single-column message; the redundant four-step preview was removed.

The section is mounted on four pages: the homepage (`App.tsx`), **Stick-On or
Clip-On** (before `StillConfused`), **Will My Hairline Look Real?** (before
`HairlineConfused`) and **Front Hairline Transplant + Hair System** (before the
free form). On the transplant page it sits outside the `.hairTransplantPage`
wrapper, because that wrapper zeroes heading and paragraph margins and squashed
the section. The section itself is only the dark teaser panel: its button is a
link to the full-page booking below. The page-level check is
`node scripts/verify-founder-booking-pages.mjs`.

### Book a consultation — `#/book-consultation`

[src/pages/BookConsultation.tsx](src/pages/BookConsultation.tsx),
[src/styles/book-consultation.css](src/styles/book-consultation.css),
[src/bookingPayment.ts](src/bookingPayment.ts) (fee, Razorpay loader, validators)
and [src/bookingDraft.ts](src/bookingDraft.ts). "Consult with the Founder" is a
link to this full page; it used to open a popup. The page has a slim top bar
(logo and Close, no site nav or footer, and the floating WhatsApp/call buttons
are hidden on this route), then three steps: online/in-person plus a tentative
date and time, visitor details, then a review and Razorpay handoff. From 900px a
sticky summary card (founder photo, format, date, time, fee) fills in as the
visitor chooses; on phones the main button is pinned to the bottom edge and
clears the home-indicator area.

Each step is its own history entry, so the browser and phone Back buttons walk
Step 3, Step 2, Step 1 and then leave. Choices and details are kept in
`sessionStorage` (`ah-booking-draft`), so a refresh or a return keeps them; the
draft is cleared once a booking is handed over. **Close** steps back onto the page
the CTA was clicked on (the flow leaves a one-shot flag, and the history entry
records how deep the visitor is); a direct visit falls back to the homepage.

The date is a month calendar (Sunday-first, previous/next month
arrows) covering the next 30 days from tomorrow; open days are pale blue discs,
Mondays (closed) and out-of-range days are grey and cannot be pressed, and a line
under it reads "Open 11 AM – 8 PM · Closed on Mondays". Beside it (below on
phones) the time list shows hourly slots 12 PM–7 PM after a date is picked.
Dates and times come from [src/bookingSlots.ts](src/bookingSlots.ts): 12 PM, 6 PM
and 7 PM are always shown as **Booked** (greyed, struck through, disabled), and
each date also holds back up to two of the 1–5 PM slots, so 3–5 stay open. The
booked state is presentational only; there is no calendar behind it. Replace
`isSlotBooked` when real availability exists. The step carries the copy "These
are tentative dates. One of our team will call you back and give you a final
confirmation." The selected date and time are described as tentative throughout; the
verified-payment state says that a team member will call to confirm the final
appointment.

The browser never creates or verifies a payment by itself. Live payment requires
two server endpoints supplied through Vite environment variables:

```text
VITE_RAZORPAY_CREATE_ORDER_URL=https://example.com/api/razorpay/order
VITE_RAZORPAY_VERIFY_PAYMENT_URL=https://example.com/api/razorpay/verify
```

The order endpoint receives `{ mode, date (YYYY-MM-DD), slot, name, phone, email }` and returns
`{ keyId, orderId, amount, currency }`. The verification endpoint receives the
Razorpay payment IDs/signature plus the booking details and must return
`{ verified: true, bookingReference? }` only after server-side signature
verification. Until both endpoints are configured, **Pay ₹5,000 securely**
does not open checkout: it takes the visitor to the thank-you page below as a
visual preview, and that page carries a "Preview only — no payment was taken"
banner. A verified payment goes to the same page without the banner.

### Consultation booked — `#/consultation-booked`

[src/pages/ConsultationBooked.tsx](src/pages/ConsultationBooked.tsx),
[src/styles/consultation-booked.css](src/styles/consultation-booked.css) and
[src/bookingConfirmation.ts](src/bookingConfirmation.ts). The thank-you page for
the founder booking only; the general guidance form's own success state is
separate. It shows "Thank you, {first name}.", a ticket-style **booking pass**
(online/in-person, the preferred time, name, phone, email, fee, and a booking
reference once the server issues one), a three-step "What happens next"
(booking received → team calls to confirm → session with Vinitt), a
"keep photos ready" tip, and Back to home / Call / WhatsApp actions. The time is
always called a *preferred* time, matching the booking page.

The booking page hands the booking over through `sessionStorage` key
`ah-booking-confirmation` (not the URL, so a phone number never reaches history
or referrers). Opened directly, with nothing stored, the page drops the pass and
the banner and shows generic wording.

Run `node scripts/verify-founder-booking.mjs` against the Vite server to check
the teaser, the full-page flow (no dialog, no site nav, no floating buttons, all
three steps, every open day's slots, closed Mondays, tentative wording, the
pinned mobile bar, the browser Back and Forward buttons, refresh, Close, kept
draft), the Pay → thank-you hand-off (route, content, banner, zero overflow) and
overflow. Run
`node scripts/verify-consultation-booked.mjs [baseUrl]` for the direct-visit
case at 1440, 390 and 320 px.

## Section 6e — "Fill This Form To Get The Right Guidance"

**Deliberately the one section with no perspective on it.** A form is the only
place a visitor has to be accurate, and tilting the surface someone is typing
into moves the target under the pointer — depth here costs more than it buys.
What it gets instead is the interaction that matters in a form: a lit field on
focus, validation that waits until a field is finished rather than scolding
while you type, errors tied to their input by `aria-describedby`, and a settled
success state with `role="status"`.

Fields validate on blur once and on every change afterwards, so an error clears
as soon as it is fixed rather than at the next submit. The phone check accepts
the spaces, dashes and `+91` people actually type and counts what is left —
`+91 98765 43210` passes, `9876` does not.

> **There is no backend.** Submitting shows the success state and nothing is
> sent anywhere. Wire it before launch.

## Section 2 — "The Secret Behind Our Natural Hairline"

Hero and Secret now use one 1940×1068, 15.04-second Higgsfield film. The served
file is `public/video/hair-system-unified-clean.mp4`, a locally graded and
seek-optimized copy of `reference/v3.mp4`. Its background-selective correction
neutralizes only cool, bright studio-panel pixels; mannequin and hair keep the
previous grade. A keyframe every six frames keeps seeking responsive.

`HeroSecret.tsx` owns the only video element. It remains paused while two damped
scroll ranges map Hero to 0–7 seconds and Secret to 7 seconds through the last
complete frame. Seeking is serialized, so a scroll burst retains only the
newest target while a previous seek is active. Scrolling upward runs the same
film backward without a source switch.

Copy follows the film's verified composition:

1. `0–16%` — title reveals word by word from a 12px blur and 16px rise, holds
   sharp, then fades during `22–30%` over the wide mannequin view.
2. `30–82%` — one near-opaque editorial panel enters in the right-side negative
   space while the film moves through the macro hairline detail; its three rows
   arrive in sequence and then remain readable together.
3. `79–100%` — the proof panel crossfades to "No Line. No Shine. Just Real"
   beside the final profile.

A two-pixel progress rail gives the long pin a quiet sense of distance. Phones
do not use desktop's full-height `cover` crop: a landscape film in a portrait
viewport magnified the product roughly four times and reduced it to a narrow
slice. Mobile now renders one 158.4%-wide 16:9 window (618×340 at 390px), exactly
20% larger than the former 132%-wide treatment. It fades in only after the Hero
copy and client cards have cleared. During the final 18% of Secret, a dedicated
motion wrapper moves the source's left-biased final profile back to centre on
both desktop and mobile without overwriting the video's scale transform. The
100% badge scales as one SVG group to about 33px instead of the former 17px.
With `prefers-reduced-motion`, seeking and the Secret pin are removed; on phones
the decorative film is hidden and all Secret copy renders sharp in normal
reading order.

Content stays centralized in [src/site.ts](src/site.ts), shared seeking lives
in [src/components/HeroSecret.tsx](src/components/HeroSecret.tsx), copy motion
lives in [src/components/Secret.tsx](src/components/Secret.tsx), and
`scripts/verify-secret-scroll.mjs` checks forward/reverse timeline tracking,
scene visibility, mobile layout, reduced motion and page overflow.

### Continuous handoff from the Hero

`HeroSecret.tsx` groups both semantic sections around one persistent sticky
film. Hero keeps the page's `h1`; Secret keeps its own `h2`. The opening orbit
runs through Hero, then the same decoder continues into the close hairline move
and pullback while Secret copy enters. There is no clone, crossfade, wash,
matched-frame trick or ownership change.

`scripts/verify-hero-secret-transition.mjs` checks that one paused film spans
both ranges, progresses forward and backward, starts Secret near 7 seconds,
retains copy phases, respects reduced motion and causes no overflow.

## The unified Hero-to-Secret product film

`public/video/hair-system-unified-clean.mp4` is the single served film. It is
silent, fast-started and encoded at 24fps with a seek point every six frames.
The original Higgsfield file remains untouched in `reference/v3.mp4`.

The source's white set contained visible vertical room panels and a wall-floor
horizon. The served copy keys only cool, bright upper-background pixels to
white; warm mannequin tones, dark hair and the lower pedestal remain on the
previous grade. The transparent `.heroSecret__filmFrame` uses
`mix-blend-mode: darken` while the video receives a small brightness lift. Dark
hair stays solid and still reads in front of the chrome wordmark. Hero copy and
the entire Secret scene stack sit above that film layer; the chrome wordmark
stays beneath it so white pixels reveal the letters instead of covering them.

If you swap the file, keep it landscape and dark-free on the left third, or the
copy will fight it.

## The client photos

The carousel has **six cards, three visible per page**. Each card owns its file —
`public/hair/client-1.png` through `client-6.png`, in card order — so replacing
one photo never disturbs another. Originals live in `Images/` at project root;
`public/hair` holds the copies the site serves.

They are transparent-background cut-outs, which lets the card's grey (`--card`)
show behind each subject. No overlay or tint over them.

**Framing.** Portraits range 0.67 to 0.97 aspect against a 5:6 card, so
`object-fit: cover` must always crop something. `object-position: center top`
spends that crop on chest and shoulders, never the hairline. If you swap in a
photo with unusual headroom, check it against that rule.

## Notes on the two design decisions worth knowing

**The `100% NATURAL` band is SVG, not styled text.** It uses `textLength` with
`lengthAdjust="spacingAndGlyphs"`, pinning the word to exactly the viewBox width.
So it runs true full-bleed at every viewport and never reflows or overflows while
Playfair Display is still loading.

`NATURAL` runs the full 1000 units. Measured, its intrinsic width at
`font-size: 200` is **923 units**, so full-bleed stretches it to **~1.083×** — a
mild widening of the stems, the deliberate trade for running edge to edge.
Anything beyond roughly 0.85–1.1× starts to read as distorted, so measure before
swapping in a word of different length.

**The 100% badge is inside the SVG, not an HTML element on top.** That locks it
to the `N` at every viewport for free — the band scales as one picture, so the
badge cannot drift off the letter the way an absolutely positioned `div` would.
It is drawn *last* in document order so it paints over the word.

Geometry, if you resize it: circle is `cx=25 cy=25 r=23`, text centred by an
explicit `y` offset (`30`) rather than `dominant-baseline`. Keep glyphs under ~40
units wide or they touch the circle's inner edge — at `font-size: 14` they
measure 38, sitting at 91% of the radius. Rendered, the badge is 64px across —
~33% of cap height, 4.4% of viewport width, the proportion the reference uses.

The label sits on a **-25° tilt**, rotated about the circle's own centre
(`rotate(-25 25 25)`). That pivot matters: `y` is already offset from `cy` so the
text sits optically centred, so rotating about the same point keeps it centred
rather than swinging it off. Verified — the rotated text's on-screen centre lands
exactly on the circle's.

**The nav-to-band gap is `.wordmark`'s `padding-top`** (`clamp(14px, 2.1vw,
38px)`, ~30px at 1440). Set it there, not by growing the SVG viewBox — viewBox
headroom scales with viewport width, so on wide screens it balloons into a much
larger gap than intended.

**Keep the badge wholly inside the viewBox (`0 0 1000 150`).** An earlier version
let it overhang above the caps, requiring a viewBox of `0 -58 1000 208`. That
negative-y headroom is dead space above the letters and showed up as an **83px
gap between nav and word** — the band is `height: auto`, so any viewBox growth
scales straight into page height.

**The badge is the one sanctioned exception to the colour rule.** `tokens.css`
reserves the blue for the active link, the buttons, the eyebrow and the slider
controls "and nothing else"; the badge gets it because it is a claim marker, not
decoration. The band itself stays chrome.

The tag is chrome-grey rather than accent blue on purpose — same `tokens.css`
reservation, and this band is decoration.

**Blue type is a shade darker than the brand gradient.** The gradient
(`#4686FE → #1769FF`) is the fill behind white text on buttons and slider
controls, exactly as specified. But `#1769FF` as *text on white* measures 4.06:1,
failing WCAG AA, so the eyebrow and active nav link use `--accent-ink`
(`#0F55D8`, 6.3:1) instead. Visually near-identical, legible for everyone.

## Responsive behaviour

- **≥1081px** — two columns, three cards per page, arrows flanking the track.
- **≤1080px** — columns stack, nav links collapse into the grid-button drawer,
  card row capped at 560px so thumbnails stay thumbnails.
- **≤640px** — arrows move below the track, next to the page dots.
- **≤520px** — two cards per page instead of three.

## Page 3 — "Book Your 1:1 Consultation Online Or In Person"

The closing block of the Hair Patch vs Hair System page: a dark panel carrying
an eyebrow, a headline lit word by word on scroll, three proof cards, and the
booking CTA.

**It is built on `Backed`'s structure**, on request — a white section holding
one dark panel (`linear-gradient(152deg, #17191d, #0c0d10, #08090b)` plus two
soft white radial highlights), lit by a single wide blurred band via
`::before`, with the glassmorphism moved inward to translucent white cards
(`rgb(255 255 255 / 0.07)`, `blur(14px)`, `1px` white border at 12%).

**There are deliberately no background orbs.** The first version of this section
was light, and floated the glass over three blurred colour circles — glass needs
something behind it worth blurring, and the page ground is a flat near-white.
The dark panel solves that problem better: white translucency over a near-black
gradient reads as glass on its own. So when the section went dark the orbs were
removed outright rather than recoloured.

**The word reveal is the same idiom as `StillConfused`** on the Stick-On or
Clip-On page — now literally the same direction too, both lifting white type out
of a faint white on a near-black ground. `LitWord` runs each word from
`rgba(255,255,255,0.22)` to full white over an overlapping scrub window, so the
line reads as a sweep rather than as separate words switching on. Measured
across the eight words as the section enters: `0.22 ×8` → `0.91 0.55 0.22…` →
`1.00 1.00 1.00 0.85 0.48 0.22…` → `1.00 ×8`.

The scrub is driven by the section entering the viewport
(`offset: ['start 88%', 'center 40%']`), **not** by a tall pinned stage.
`StillConfused` reserves 220vh for its reveal, which suits a full-viewport
immersive close; this is a compact panel directly above the footer, where two
extra viewports of scroll would cost more than the effect is worth.

One consequence of that offset is worth knowing before retuning the timings:
progress only reaches 1 once the panel's centre passes 40% of the viewport,
which is slightly *past* where the panel sits nicely in frame. The points and
CTA therefore finish at 0.68 and 0.8 rather than at 0.94 — at 0.94 the CTA was
still half-faded at exactly the moment someone was looking at it.

Contrast was sampled from rendered pixels. Against the lightest ground measured
inside the panel (`#323335`): headline and card titles 12.65:1, card notes
6.79:1, the CTA note 5.64:1, the eyebrow 9.77:1.

The CTA uses `--grad-ink`, not `--grad`. Neither ink colour clears AA on the
full `--grad` sweep at this size — white measures 3.44:1 on the `#4686fe` stop
and near-black measures 4.17:1 on the `#1769ff` stop, and a 16px/650 label is
not large text either way. `--grad-ink` runs `#1769ff → #0f55d8`, where white
measures 4.67:1 and 6.34:1.

Under `prefers-reduced-motion` the section renders static and fully lit: no word
sweep, no panel arrival, nothing showing up late.

Check it with `node scripts/verify-bookcall.mjs [outDir]`.

## Page 3 — "Benefits of a Natural Looking Hair System"

A teaser card, and a separate overlay that opens above it. Built to
`reference/Recording 2026-08-21 125404.mp4` — Apple's "Get to know Mac" rail —
and then deliberately diverged from it on one point.

**The card does not morph into the sheet, by request.** It used to: card and
sheet shared a `layoutId`, so motion interpolated the real geometry between them
and the card read as opening into the sheet. The card was also hidden while the
sheet was up, which left a hole behind the blur where it had been. What was
asked for instead is a distinct panel arriving over a card that stays put, so
the `layoutId` is gone and the sheet has its own scale-and-fade entrance. If the
Apple morph is ever wanted back, it is those two `layoutId`s plus hiding the
card again — nothing else depends on it.

What is kept from the reference: **the page behind blurs**, via `backdrop-filter`
on the scrim, so no other section has to know this component exists.

**The card's crop line is set by its `aspect-ratio`, never by a `max-height`.**
`object-fit: cover` scales the photograph to the card's *width*, so a pixel cap
shows a different amount of the man at every viewport — the first attempt,
`max-height: min(520px, 56vh)`, cut him at the chin on a 1920 screen while
clearing his collar on a 1366. `aspect-ratio: 1600 / 790` keeps rows 0–790 of
the 832-tall file at every width, which ends just below the collar. Measured:
95.0% of the photograph shown at 1920, 1600, 1440, 1366 and 1280 alike.

`max-height: 82vh` remains only as a guard for genuinely short screens. It was
72vh briefly, which was low enough to clamp on 1920, 1366 and 1280 and take the
framing back over — if you tighten it, check the percentage again rather than
just the height.

The photograph is anchored `center top`, so what the ratio crops is his chest,
not the top of the frame where the dashed hairline, the arrow and the scalp
inset live.

**The sheet is sized to fit one screen too.** It is `max-height: min(880px, 92vh)`
with every vertical measure inside tuned to land under that, plus a
**height-keyed** media query at `max-height: 820px` for laptops — a 1366×768 or
1280×720 screen is a vertical-space problem, and solving it with a width query
would shrink the layout on a tall monitor for no reason. Measured: section and
sheet both fit at 1920×1080, 1440×900, 1366×768, 1280×720 and 768×1024.

On a phone the sheet still scrolls, by about 180px. Fitting it would mean either
dropping content or taking body copy under 14px, and the 14px floor holds across
this site.

**Lock `document.documentElement`, not `document.body`.** The usual
`body.style.overflow = 'hidden'` idiom does nothing on this site: `body` already
carries `overflow: hidden auto` from `global.css`, but `document.scrollingElement`
here is `html`. The lock looks right in devtools while the page scrolls freely
behind the sheet. Note also that `window.scrollBy()` will report a lock as
working either way — `overflow: hidden` blocks user scrolling, not scripted
scrolling — so test it with a real wheel event. Measured: 600px of wheel moves
the page 600px closed and 0px open.

**Never put the card headline's size back as an inline `style`.** It lived
there as `fontSize: '4rem'`, which is why the headline could not be made smaller
on a phone — an inline declaration beats every media query, so the card rendered
at 64px at 390px wide as well as at 1440, three lines tall and straight over the
subject's face. The 4rem is right on a desktop and is kept exactly; it now lives
in `.benefits__cardTitle` where the `max-width: 900px` block can override it to
`clamp(1.3rem, 5.2vw, 1.85rem)`.

**Both photographs are installed, and `card.png` carries its own annotation.**
The dashed hairline ellipse, the curved arrow and the circular scalp inset are
baked into the picture, so the component draws none of them. An earlier version
drew all three in CSS and SVG while the photograph was outstanding; they were
deleted when it arrived, because keeping them would have put a second ellipse on
top of the first.

The card image's **left third is transparent on purpose** — that is where the
headline sits, which is why the CSS lets the picture bleed edge to edge instead
of reserving a column for the copy. The file is 1600×832 and the card is set to
the same ratio, so a full-bleed `cover` crops nothing.

`Photo` still falls back to a labelled dashed frame on `onError`, so a renamed
or missing file shows something readable rather than a broken-image glyph.
`public/hair-benefits/README.md` has both filenames, their sizes, and the two
constraints above.

In one column — below 901px — the sheet's photograph needs `contain` sized to
its box's **height**, not its width. Sized to width it resolved to 366x363
inside a 170px-tall box and clipped 193px, everything below the sunglasses. The
box is also taller there now, because a box that cannot hold a head will crop
one however the image is fitted.

**Neither `contain` nor `cover` is free in the sheet's right column.** The
overlay file is near square (1100×1090) and the column is tall and narrow:
`contain` bottom-anchored left 246px of dead grey above his head, and `cover`
cropped the side of his head off. Top-anchored `contain` costs nothing — the
whole face is intact and the leftover space falls below him, where a mask fade
turns it into deliberate whitespace and also hides the file's own hard bottom
edge through his shirt.

Keyboard contract: `Escape` closes, focus moves to the close button on open and
returns to the card on close, `Tab` cycles inside the sheet, and the page behind
cannot scroll. Under `prefers-reduced-motion` the sheet still opens — it is the
content, not decoration — but without the morph.

Check it with `node scripts/verify-benefits.mjs [outDir]`.

## Page 3 — "Why Hair Patches Often Fail The Confidence Test"

The case against patches. **It sits second-to-last, by request** — between
`SimplestWay` and `BookConsultation` — where it reads as a closing argument
before the ask rather than as the problem the page is solving.

It was built to sit immediately before `HairBenefits`: problem stated, then
answered, which is what the page's own logic wants and what the
`hero-testimonials-cta` and `funnel-3-step` landing patterns both order. Nothing
in the component depends on its neighbours either way, so moving it back is one
line in `HairPatchVsSystem.tsx`.

**The orange breaks the one-blue rule on purpose.** `tokens.css` says the page
"carries no colour of its own, so the single blue gradient does all the
pointing" — and this section adds `#ea580c`. It earns it the same way
`.faq__stars` and `.backed__stars` earn their amber: a warning rendered in the
brand blue reads as decoration rather than as a warning. Colour is never the
only signal, so nothing is lost to a reader who cannot separate the hues — the
heading, the label and the exclamation mark all say it independently.

The section sits on `#f4f5f8`, the same recessed grey `.compare` uses, so the
two argument sections on this page share a ground. Everything was re-measured
against it: title 17.82:1, body copy 5.64:1, warning mark 3.27:1. That mark
clears the 3:1 a meaningful graphic owes but has the least head room of anything
on the page — darken it rather than lighten it if the orange is ever retuned.

**The closing panel's blue is deeper than the other card gradients on this page,
and has to be.** White on `#4a86fe` measures 3.42:1, so "That's the standard we
live by" — 15px, normal weight — missed AA. `#1f6bfb` is the lightest stop that
clears 4.5:1 for white, at 4.61:1. Don't brighten it without re-measuring.

The panel itself is built from the site's own recipe — a gradient with two soft
white radial highlights over it, the same construction `.backed__panel` and
`.simplest__panel` use. The supplied design has a photographic sky there; this
reads as the same family as every other panel on the page and needs no new
asset.

The warning diamond is drawn rather than taken from lucide, whose alert icons
are triangles and octagons. The exclamation is two shapes inside the same
viewBox rather than a counter-rotated child, so it cannot drift as the diamond
scales.

Entrance is `useReveal`, the idiom every other section here uses, already
reduced-motion aware. Emphasis in the body copy is marked with `**` in
`site.ts`, the same convention `choiceHeroLede` uses.

**The trailing space after each headline line is load-bearing.** Below 620px
the two `<span>`s go inline so the lines reflow as one paragraph, and without a
separator they render — and are announced — as "Often FailThe Confidence Test".
It is a real text node in `PatchFail.tsx`, deliberately not a CSS `::before`:
generated content never reaches `textContent`, so the visual would have looked
fixed while a screen reader still heard the run-on. On desktop the spans are
blocks and the space collapses away.

The mobile CTA is full-width and **centred**, not `space-between`. Pushed to the
two ends it read as two controls rather than one button.

Check it with `node scripts/verify-patchfail.mjs [outDir]`.

## Page 4 — "Will My Hairline Look Real?"

At `#/will-my-hairline-look-real`. **Hero and the systems gallery so far** — the
rest of the page is still to come. The "Free eBook" section in the supplied design is excluded by
request.

**The hero is shared, not copied.** Both guide pages open the same way — eyebrow
badge, headline, lede, one wide rounded still with a play mark — so they are one
component, [GuideHero](src/components/GuideHero.tsx), with a thin per-page
wrapper binding its content. That extraction happened when this page was built:
before it, the markup and its 188 lines of CSS existed only as
`PatchSystemHero`, and duplicating them would have meant every later fix had to
be made twice. The CSS block was renamed `.patchHero` → `.guideHero` at the same
time and for the same reason.

**The eyebrow mark is a CSS mask, so the supplied SVG needed no editing.** Only
its shape is used; the black `fill` it ships with is discarded and the brand blue
is painted through it. Each page sets its own file via the `--guideHero-icon`
custom property, with `burst.svg` as the fallback so a page that forgets still
renders something.

`ClientStories` is the homepage's own component, reused unchanged — self-contained,
no props. It closes the argument the page makes: the hero claims the hairline is
undetectable, `Systems` shows the range, `HairlineDesign` shows the craft, and
this shows men it worked for. Page 3 orders its equivalent run the same way. Its
pin scrubs the rail sideways above 900px and falls back to a swipe rail below
that and under reduced motion.

`Systems` is the Stick-On or Clip-On page's own component, reused unchanged — it
is self-contained and takes no props. It follows the hero because the hero claims
the hairline is undetectable and the range is the evidence: thirteen systems the
claim has to hold across. Its pin drives a rotating ring above 900px and falls
back to a snap rail below that and under reduced motion; measured on this page,
the ring passes through seven distinct angles across the pin and the rail is
static in all three fallback cases.

The play mark is decorative — no film has been supplied for either guide page,
and a button that does nothing is worse than a picture of one. It becomes a real
trigger the day a file lands, the same convention `checklistVideo` and
`processVideo` already use.

Check it with `node scripts/verify-hairline-hero.mjs [outDir]` — it probes the
new page *and* re-probes the Page 3 hero, since the two now share a component.

### "How We Design The World's Most Natural Hairline"

**This is `Checklist`, with different content.** It was first built as its own
light-themed card to match a supplied design, then asked to look like the
homepage's 21-point checklist instead — at which point it stopped being a
section that borrowed the checklist's mechanism and simply *was* the checklist.
Rather than restyle 348 lines of CSS to converge on `.checklist`, `Checklist`
gained optional props defaulting to the homepage's own data, so both sections
are literally the same component and every bare `<Checklist />` call site works
untouched. The `.hlDesign` block was deleted.

Seven points instead of twenty-one. `--checklist-count` is now set inline from
`points.length` rather than left at the 21 the stylesheet defaults to — the
progress rail divides by it.

**The supplied `Images/nh.png` had the quote, its scrim and rounded corners
painted into the picture.** The still shipped here is cropped above that band —
`crop=2176:1090:0:0` if you re-cut it from the original — so nothing is drawn
twice.

Two defects fixed in the shared component while doing this, both of which also
affected the homepage and Page 3:

- The tally printed `01 / 7` for a seven-point list. The denominator is now
  padded like the numerator: `01 / 07`.
- The title's two lines concatenated in `textContent` — a screen reader heard
  "Our 21-Point ChecklistFor A Perfect Hair System". The spans are blocks, so a
  real trailing space collapses visually and fixes the announced text.

Check it with `node scripts/verify-hairline-design.mjs [outDir]` — it probes the
new section *and* re-probes the homepage and Page 3 instances.

### "Benefits of a Natural Looking Hairline"

**This is `HairBenefits`, with different content.** Cloning it would have meant
cloning a modal — the focus trap, the scroll lock, the Escape handling, the
scrim blur — so instead it gained an optional `data` prop defaulting to Page 3's
own, and Page 3's bare `<HairBenefits />` call site is untouched.

Three things the component now allows for, each driven by the data rather than
by a second copy of the markup:

- **No philosophy callout.** Without it the CTA has nothing to sit inside, so it
  stands full width under the list. It uses `--grad-ink`, not `--grad`: white on
  the lighter `#4686fe` stop measures 3.44:1 and misses AA — the same trap the
  booking button hit.
- **An intro that ends in a link.** No film is supplied, so "Watch the video"
  renders as a dotted-underlined `<span>` rather than an anchor that goes
  nowhere. Give `introLink` an `href` and it becomes a real link with no other
  change.
- **`cardArt: 'right'`.** Page 3's card photograph is a wide annotated scene at
  nearly the card's own ratio, so it bleeds full width. This one is a portrait
  cut-out — `cover` scaled a 1400×1152 file into a 2.03-ratio card and cropped
  it to a face filling the frame. `'right'` stands it on the card's floor at
  `contain`, anchored bottom right, keeping its own proportions.

  **Its `right` and `bottom` are `0`, and that matters.** The supplied file is
  itself a crop: the subject's shoulders run off its left and right edges and
  his chest off the bottom. Inset even 2% and those cut edges float in the
  middle of the blue, which reads as a clipped rectangle rather than as framing.
  Sitting them on the card's own edges makes the same crop read as the card
  cropping him. Below 620px the photograph is sized to the card's full width for
  the same reason — centred at 93% it sat 23px short on one side, putting a cut
  edge back in open blue.

**The overlay photograph is art-directed, not resolution-switched.** The desktop
cut-out is framed for a tall column and its head and shoulders ran off the short
box the phone layout gives it. A `mobileSrc` on the slot renders a `<picture>`
with a `<source media="(max-width: 900px)">`, so narrow screens get a different
crop of the same man — one with margin on every side, which `contain` can fit
whole. `<picture>` rather than two images toggled by CSS: the browser downloads
only the source it picks. The breakpoint matches the stylesheet's own 900px,
where the sheet's layout changes. Page 3's slot has no `mobileSrc`, so it
renders a plain `<img>` and is untouched.

Declare the data shape with the exported `BenefitsData` type, not
`typeof hairBenefitsData`: both objects are `as const`, so deriving from one
makes every string a literal and the other fails to assign.

### "We Understand This Is Not A Small Decision."

**This is `StillConfused`, with a different headline** — the same dark stage,
capsule, glow and word-by-word illumination scrub the Stick-On or Clip-On page
closes with. It gained an optional `data` prop defaulting to page 2's own, so
page 2's bare `<StillConfused />` call site is untouched.

Two things had to move out of module scope for that to work:

- **`totalWords`.** The sweep divides by it, and it was computed once from page
  2's headline. Page 4's is shorter, so a fixed total would have left the last
  words unlit. It is now derived per instance and passed down.
- **`titleId`.** Both headings would otherwise claim `still-confused-title`, and
  nothing guarantees the two sections never share a page.

**The headings carry an `aria-label`, and it is load-bearing.** Each word is its
own span so it can be lit individually, and they are spaced by a flex
`column-gap` (`StillConfused`) or a `margin-right` (`BookConsultation`) rather
than by whitespace — so the accessible name came out as
`"WeUnderstandThisIsNotASmallDecision."` and
`"BookYour1:1ConsultationOnlineOrInPerson"`. Text nodes are not the fix inside a
flex row: they become anonymous flex items and gain their own gaps. Naming the
heading is, and it leaves the layout alone. If you add a word-lit headline
anywhere else, label it the same way.

The CTA points at `#consult`, which does not resolve — it is already dead on
page 2 and is listed with the other dead anchors in PROJECT-CONTEXT §7.

### "The Truth Behind Ultra Natural Hairline"

Five short claims in the 2-2-1 grid the design draws, directly above the
benefits card: the claims state the position, the card expands on it.

**The heading wipes word by word out of a mask** rather than fading — each word
sits in an `overflow: hidden` span and rises into it. Driven by entry, not
scroll: this is a compact band, and a scrub would need a tall pinned stage to be
legible, which is more scroll than five one-line claims are worth. The cards
stagger in behind it. `useReveal` already handles reduced motion, and the
transitions are cancelled there too so nothing can be caught mid-rise.

The word masks carry `padding-block` with matching negative margins. Without it
`overflow: hidden` shaves the tails off g, y and p.

**The spaces are real text nodes — between the words *and* between the two
lines.** Seven components in this codebase have now shipped a split headline
that announced as one run-on word. Two fixes apply: a real space where the words
are inline (this one, `Checklist`, `PatchFail`, `ClientStories`, `HairBenefits`)
or an `aria-label` where they sit in a flex row (`StillConfused`,
`BookConsultation`). Check `textContent`, not the render — every one of these
looked correct on screen.

Measured on the white card: bold half 19.43:1, light half 6.15:1, white check on
brand blue 4.67:1. Two columns down to 760px, then one — two columns of a
one-line claim at phone width wraps every card to three lines and the grid stops
reading as a list.

Check it with `node scripts/verify-hairline-truth.mjs [outDir]`.

### "Can You Use Your Own Front Hair For A Brush-Back Style?"

A six-node decision tree with one branch, below the closing scrub.

**Every connector is CSS, not SVG.** Each line is a positioned bar and each
arrowhead two rotated borders, laid out on the same two-column grid as the
nodes. An SVG overlay would need measured coordinates at every breakpoint, and
this diagram reflows continuously between 360px and 1440px — grid-placed bars
follow the layout for free.

That choice is also what makes the reveal cheap: a line draws itself by going
`scaleY(0)` to `scaleY(1)` from its top edge, which is compositor-only. Ordering
matters and is encoded in the delays — the split bar finishes before the legs
hanging off it start, or a leg appears in mid-air, and each head fades in behind
the line that carries it so a head never arrives before its line. `will-change`
is deliberately absent: these animate once on entry and never again, so pinning
a layer for the life of the page costs more than it saves.

**The design's branch pill colours miss AA.** `#16a34a` on its own tint measures
3.00:1 and `#dc2626` measures 3.95:1. Shipped as `#15803d` (4.57:1) and
`#b91c1c` (5.30:1) — the nearest shades that clear it.

The structure does not change between breakpoints: the design keeps the two
branches side by side on a phone, so only the measurements move. Verified
side-by-side at 1440, 768, 390 and 360.

Check it with `node scripts/verify-brushback.mjs [outDir]` — it asserts all
eleven lines drawn, five heads visible, eleven heading words risen, six nodes at
full opacity, and the branch pair sharing a row.

### "HD Exposed Hairline — Brush Back Hairstyle"

Four cards on a rail, immediately before the brush-back decision tree: this
describes the style, the tree then asks whether the reader qualifies for it.

**Above 900px it is not a rail at all — it is a three-column grid**, with the
three positive cards on the first row and the fourth spanning the full width
underneath. Four cards on one desktop row left most of the section empty to the
right. The fourth spans rather than sitting in column one, which would put the
same dead space back a row lower, and its own list splits into two columns so
the lines do not run the width of the section. The component needs no flag for
any of this: it reads overflow from the element, finds none, and drops the
controls and the tab stop by itself.

Below 900px it is a rail — four cards cannot share a phone row, and a scroll
rail beats a four-storey stack.

That fourth card centres its heading and its points block at grid width, and
every point sits on one line across the whole desktop range. The block is sized
to its content with `max-content` columns and centred with `justify-content`,
not stretched across the card — a block spanning edge to edge is not centred,
it is merely full width — and `max-content` is also what keeps the one-line
promise, since a column that measures its longest item never wraps it. It is
`minmax(0, max-content)` rather than bare `max-content` so that if the copy ever
outgrows the card the column shrinks and wraps instead of overflowing. The longest is 68
characters and needs about 520px of measure: two columns clear that from 1280px
up (538px per column, measured), and below it a single full-width column does.
Four rows is the cost of the one-line promise, and it is worth paying — the
alternative is every point wrapping. The text *inside* each point stays left-aligned against its mark:
centring a line that begins with an icon leaves the icon floating and puts the
ragged edge down the middle of the card, which is harder to read rather than
easier.

**The rail is a native scrolling element, not a transform carousel.** That is
the whole design of the component. `overflow-x: auto` with `scroll-snap` gives
touch momentum, trackpad gestures, a real scrollbar, keyboard arrow scrolling
and the browser's own overscroll behaviour — none of which a `translateX`
carousel gets without reimplementing them, usually badly. The buttons only call
`scrollBy`; the rail is fully usable if they are never touched.

What that costs is bookkeeping, and all of it is deliberate:

- **The rail takes `tabindex="0"` and a label, but only while it scrolls.**
  Browsers only make an overflow container keyboard-scrollable automatically
  when it has no focusable children, and a keyboard user who cannot reach the
  rail cannot read cards two to four. Above 900px there is nothing to scroll, so
  the attributes come off — a focus stop that scrolls nothing is worse than no
  focus stop.
- **The buttons disable from real scroll position**, not from an index — a touch
  drag moves the rail without the buttons knowing. The edge threshold is 8px,
  not 1: the rail carries padding and `scroll-snap-align: start` settles a few
  pixels in, which left Prev live while the reader was still on card one.
- **A polite live region announces "Card *n* of 4"**, since scrolling gives a
  screen-reader user no other signal that the content changed.
- **The controls hide when nothing overflows.** At 1440 all four cards fit; two
  permanently disabled buttons read as broken where no buttons reads as "nothing
  to page through".

**`[hidden]` needs spelling out here.** The UA stylesheet sets `display: none`
for it, but the author `display: flex` on the same element wins — the attribute
alone left the controls on screen.

Two things a checker gets wrong if it is not careful, both of which happened
while building this: **`Home` and `End` do not scroll a horizontal container**
(arrows do), so testing them reports the rail as keyboard-unreachable; and
asserting `element.hidden` rather than computed `display` reports controls as
hidden while they are still visible.

Cards carry one neutral hairline and deepen it on hover. They used to tint it
brand blue, which read as a selected state on a card that cannot be selected.
The one blue outline still in this section is the rail's `:focus-visible` ring —
that is a keyboard indicator, not decoration, and it only ever appears on the
narrow layout where the rail is focusable at all.

The section head wipes word by word out of a mask, the same idiom
`HairlineTruth` and `BrushBackFlow` use — it was the one head on this page that
simply appeared — and it sits at `clamp(1.5rem, 3vw, 2.4rem)`, matching
`.truth__title`. Three section heads on this page were at three different scales
with nothing to justify it. **`.flow__title` is still the outlier at 1.75rem**
and should be brought to the same rank.

**The cards have no hover state, deliberately.** They are not links or buttons,
and a surface that lights up under the cursor invites a click that does nothing.

Three tick cards and one cross card. Card two was briefly `care` — an amber info
mark — on the grounds that its three points are maintenance costs rather than
benefits, and a green tick beside "glue attracts dust over time" reads as an
endorsement of the dust. The client prefers the green tick, which is their call
about their own copy; the heading, "What You Should Know", carries the framing
instead.

**The `care` tone is still wired up** in the component and the stylesheet — an
amber `#b45309` info glyph, chosen over the site's warning `#ea580c` because
white on that measures 3.56:1 and an 11px glyph wants more headroom than the
3:1 floor (`#b45309` measures 5.02:1). Setting card two's `tone` back to `care`
in `site.ts` is the only change needed to reinstate it.

Tone is never colour alone: the glyphs differ and every card's heading states
which list it is.

Marks: white measures 3.30:1 on the green and 4.83:1 on the red, both past the
3:1 a meaningful graphic owes — the green not by much, so darken rather than
lighten it if retuned. Colour is never the only signal: each card's heading says
which list it is, and the glyphs differ.

Check it with `node scripts/verify-hd-exposed.mjs [outDir]`.

### "If You Want To Use Your Natural Hair In The Front…"

The last section before the footer, and the companion to `BrushBackFlow` — the
tree answers yes or no, this grades the middle ground into three density
scenarios.

**It is the homepage `Story` stack.** The heading holds still on the left while
cards stack in on the right one at a time, each preceded by a narrower slab of
itself peeking from under the card above. That mechanism now lives in
[ScrollStack.tsx](src/components/ScrollStack.tsx), extracted from `Story` when
this section needed it, so the move exists once rather than twice.

**What is shared is the mechanism, not the appearance.** `ScrollStack` publishes
two ramps as CSS custom properties — `--open` and `--peek-amt` — and each
section's own stylesheet decides what a row looks like. That is why those
properties are generically named while the class names are not. `StackRow` takes
`className` and `innerClassName` separately rather than deriving the second from
the first: `Story`'s CTA row carries a modifier, so a derived inner class would
have been built from the modifier instead of the base.

**Three rows, so the step is 48vh against `Story`'s 30vh.** Three rows means
only two steps of scroll after the first card lands; at 30vh the whole stack
built in barely half a screen and was over before it read as a move. A longer
step gives each card the dwell a six-row stack gets for free.

The blue cap on each card rides `--open`, so it arrives with the card rather
than sitting on the closed slab — a bright edge on a grey sliver reads as a
seam, not as a design.

**The pin is top-aligned and takes its height from the stack, not the
viewport.** Both matter:

- *Top-aligned*, like `.story`. Centring was tried, to soak up the slack a short
  stack leaves, and rejected: at rest the stack is still collapsed, so centring
  put the heading 366px below the section's top edge where every neighbouring
  section puts it at 94px, and slid it upward as the cards opened.
- *Height from the content.* A pin taller than its content leaves the difference
  as blank between the last card and the footer for as long as it stays stuck.
  Letting the stack decide means that blank settles to nothing once the pin
  releases, leaving only the section's own padding.

Section padding is the site standard, `clamp(44px, 6.5vw, 96px)`, in the pinned
layout *and* in the static fallback — the fallback had its own larger value,
which measured 56px against the siblings' 44px on a phone and 115px against
their 94px under reduced motion. Verified identical to `.truth`, `.hd` and
`.flow` at 1440, 1600, 1280, 1100, 390, 360 and under reduced motion.

The cards are roomier than `.story`'s (20px gaps, larger padding and type):
every pixel the stack does not fill becomes slack, and three cards read less
cramped for it. Content went from 596px to 708px at a 900px window.

Below 901px and under reduced motion the pin is dropped and every card is simply
open. Check both this and the homepage with
`node scripts/verify-natural-front.mjs [outDir]`.

### "Stick-On System Lifespan" — `#/stick-on-lifespan`

The third guide page. Current order: shared guide hero, dark balance stage,
two base-option cards and their detail overlays, car analogy,
thin-versus-thick rating table, base chooser, the shared "World's Finest
Thinnest Hair Systems" gallery, and guidance form. The gallery is reused through
`Systems`, so its thirteen products, desktop scroll rotation, phone snap rail,
and reduced-motion fallback stay consistent everywhere.

**The route was already in the nav before the page existed.** `site.ts` has
linked `#/stick-on-lifespan` since the navigation was written, so the path is
fixed by that link — picking a different one would have left a menu item
pointing at nothing. `#/clip-on-lifespan` is still in the same position and
still has no page behind it.

`StickOnLifespanHero` is the third wrapper around `GuideHero`, alongside
`PatchSystemHero` and `HairlineRealHero` — content and eyebrow mark only. **The
eyebrow icon needed no recolouring:** the mark is painted as a CSS mask, so the
supplied file's own fill is discarded and the brand blue is painted through its
shape. Verified as `rgb(23, 105, 255)` masked by `calendar.svg`.

### "Two Base Options For Your Stick-On Hair System"

`BaseOptions` sits between the dark balance stage and the car analogy. It uses
the supplied first- and second-option artwork for two equal white cards, with a
full-card button and a 44px black plus control. The layout follows the page 4
`HairlineBenefits` pattern: two columns above 760px, one column below it, then a
large detail sheet over a dimmed, blurred page when either card is opened.

The card and overlay artwork is served from `public/base-options/`. The four
files are web-sized PNG derivatives of the supplied transparent sources, so the
hair-system cutouts remain clean while the page avoids decoding the original
multi-megapixel files. Card and sheet copy, artwork dimensions, and accessible
labels live centrally in `site.ts`.

The sheet follows the same accessible dialog contract as `HairBenefits`: focus
moves to Close, Tab stays inside the dialog, Escape and the scrim close it,
focus returns to the exact card that opened it, and document scrolling locks
without a scrollbar jump. The existing `motion` runtime supplies the one-shot
card reveal and sheet transition; reduced motion settles both immediately.

Check it with `node scripts/verify-base-options.mjs [outDir]` (set `VERIFY_URL`
for another server). It verifies section order, copy, loaded images, responsive
columns, 44px controls, both dialogs, focus trap and return, Escape and scrim
closing, scroll lock, fine-pointer hover behavior, reduced motion, overflow,
console errors, and failed requests.

### "Car Example: Think Of It Like This Before Choosing"

The two-card analogy sits immediately before "Thin Base Vs. Thick Base": a
sports car represents thin base + low density, while a Fortuner SUV represents
thick base + high density. Copy lives in `site.ts`; the supplied 2K PNGs are
served as quality-90 JPEG derivatives at about 305–314 KB each from
`public/car-example/`.

The visual follows the supplied reference: rounded studio image, separate white
information panel, semantic pros/cons lists, and a divided recommendation
footer. Both recommendations use two deliberate visual lines inside matching
81px footer blocks, reproducing the reference's muted lead-in, bold conclusion,
and aligned divider. Their responsive type scales from 14px on phones to 16px
on desktop, giving the closing recommendation the stronger rank shown in the
reference. The whole sentence remains one accessible name. On wide
screens the cards share one row; below 760px they stack. Motion
uses the existing `motion` runtime for the one-shot stagger, while nested CSS
transforms provide a 4px surface lift and 2.5% image zoom on fine pointers. That
nesting is intentional: entrance, lift, and zoom have separate transform owners.
Reduced motion settles immediately and disables both hover transforms.

Check it with `node scripts/verify-car-example.mjs [outDir]` (set `VERIFY_URL`
when testing a production preview). It verifies the insertion order, copy,
assets, list counts, responsive columns, aligned desktop/tablet recommendation
dividers, hover/reduced-motion behavior, overflow, console errors, and failed
requests.

### "Thin Base Vs. Thick Base"

The rating table below page 5's hero.

**It is the `.compare` table page 3 uses**, with a `rateCompare` variant for the
cells — same card, same dark header row, same scroller and breakpoints. **The section's ground is a prop**, because both the Stick-On and Clip-On pages
render this one component and each asked for a different one: Stick-On is white,
Clip-On is the `#f4f5f8` its neighbouring sections carry. A global change would
have moved whichever page was not asking. On white the card still reads on its
border and dark header row rather than on a colour difference. Only the
contents differ: a rating out of five instead of a sentence. The two comparison
sections stay one piece of table CSS rather than two that drift apart.

**Each rating is one labelled image, not five decorative ones.** A row of shapes
is the only thing carrying the score, so the group takes `role="img"` with the
score written out (`"5 out of 5"`) and the individual stars are hidden from the
accessible tree. Without that a screen reader announces either nothing for the
cell or five meaningless graphics. The design draws only the earned stars rather
than five with some greyed out, which is why the name has to state the
denominator.

**The stars are solid gold with no outline, by request, and it is worth knowing
what that trades.** This gold measures **1.67:1** against the white card, under
the 3:1 a graphic owes when it is the only thing carrying information. It is not
the only thing here — each rating is a `role="img"` named "n out of 5" — so the
score survives for a screen reader either way. What is lost is the low-vision
reader who can see the cell but cannot separate the gold from the white behind
it. An earlier `#b45309` outline solved that at 5.02:1; reinstating it is one
line.

**`flex: 0 0 auto` on the star is load-bearing.** Five stars plus their gaps do
not fit the rating column on a phone, and without it the flex row shrank them on
the width axis only — measured 18×22 at 390px and 16×22 at 360px, visibly
squashed. The size floor is set to something five of them can actually sit in.

Check it with `node scripts/verify-base-compare.mjs [outDir]` — it asserts the
star counts per row, what each cell announces, the header colour, and re-probes
page 3's table.

### The form heading is top-aligned

`.form__in` was `align-items: center`, which floated the heading against the
middle of the card. That reads as an accident of the card's height rather than a
decision — and the taller the card grows, the further down the heading drifts.
It is `start` now, on the homepage and on the Stick-On System Lifespan page,
which are the same component and the same rule.

`Form` is reused unchanged on page 5. It is self-contained and takes no props,
so nothing was parameterised to place it there.

⚠ Still no backend — see §7 of PROJECT-CONTEXT. Submitting shows the success
state and sends nothing, on both pages.

### "Still Confused Between Bases?"

Two option cards above the range gallery. The rating table higher up shows the
trade-off in the abstract; this states which reader each side of it suits.

**The questions are a plain bulleted list.** They were briefly real checkboxes
with a running tally, so the reader could answer the five things the copy tells
them to ask themselves and the card would say whether that option was theirs.
That was removed by request in favour of the static list the design draws.

What went with it is worth knowing rather than rediscovering: the `fieldset`,
the `legend` and the polite live region all existed to serve form controls, and
without controls they would be markup describing nothing — so the prompt is an
ordinary paragraph and the questions an ordinary `<ul>`. Reinstating the
interaction means bringing all of that back together, not just the inputs.

The bullet is a drawn `<span>` rather than `list-style`, so it can be sized and
coloured against the text beside it; the list is still a real `<ul>` and is
still announced as a list of five.

**The card has no blue top cap.** It had one, matching the supplied design, and
it was removed by request. The card's `overflow: hidden` went with it — that
rule existed only to clip the cap to the corner radius, and a clip with nothing
left to clip is a trap for whatever gets added here next.

One column below 900px: two cards side by side on a tablet put five questions
each into about 330px and wrapped most of them to three lines.

Check it with `node scripts/verify-base-choice.mjs [outDir]` — it asserts the
list structure, the cap's radius and clipping, and that no inputs, legends, live
regions or tally elements survive from the interactive version.

### "Choose Your Perfect Balance: Look, Comfort, Or Lifespan?"

The dark stage directly below page 5's hero. The constraint line reads "You can
choose only 1 of these 2 options": the title names three qualities and the cards
show two options, and the design's original "1 out of 2" arrived with no noun —
the reader had to work out it counted options, not qualities. It frames everything under it:
three things are on offer, no system delivers all of them, and the reader has to
pick a side. Option A carries two of the three and Option B the remaining one —
which is why the closing line reads "only 1 out of 2": one *option*, not one
quality.

**The orbs are not decoration — delete them and the glass stops being glass.**
`backdrop-filter` over a flat ground is an invisible effect at a real paint
cost: with one colour behind the panel there is nothing for a blur to blur. The
three drifting colour orbs are what the panels frost. Same reasoning as
`BookConsultation`'s ambient field on page 3.

Both large corner orbs use the brand primary `#1769ff`; the bottom-right one is
held at 42% alpha so it stays softer than the upper-left light source.

An `@supports` fallback drops the panels to a solid dark ground where
`backdrop-filter` is unavailable, so they stop being glass rather than losing
their contrast floor.

**The headline is two lines at both breakpoints but broken in different places,
and the two groupings do not nest** — the phone keeps "Look," with "Comfort,"
while the wide layout splits them. So the words are one flat list in `site.ts`
with the break positions declared per breakpoint beside them, and the heading is
a single wrapping flex row.

The break itself is a zero-height, full-width flex item placed *before* the
word, `display: none` outside its breakpoint. Flagging the word with
`flex-basis: 100%` instead gives it the whole row to itself, which produces one
line per word rather than a break.

Below 420px the type steps down as well: the grouping only holds if the longest
line fits, and these lines need about 18px of this weight inside a 320px screen.
At the 22.4px floor the heading wrapped to an extra line at 360 and 320.

The headline is scrubbed word by word — the dark-stage idiom `StillConfused`
uses. **Its accessible name comes from an `aria-label`**, because the words are
flex items spaced by a `column-gap`: text nodes are not the fix inside a flex
row, since they become anonymous flex items and gain their own gaps. Ninth
component here to need one of the two fixes for that; check `textContent`, not
the render.

Panels are equal height. Option B carries one trait against A's two, and letting
them size to content left the shorter one floating against the taller, which
reads as a mistake rather than as less content.

**The panels tilt toward the pointer, and entrance and tilt share one owner.**
The entrance used to be a CSS `transform`; adding a pointer rotation would have
meant two rules writing `transform`, and an inline one always wins — the card
would have snapped to its final position the moment the pointer arrived. Both now
run through motion, which composes individual transform properties instead of
overwriting a shorthand. `transformPerspective` is per-card rather than a shared
`perspective` on the grid, or the card furthest from centre looks sheared rather
than tilted.

**Tilt is not armed at all without a hover-capable pointer**, rather than merely
going unused: on a touchscreen `pointermove` fires during a scroll-drag, so a
card would tip as the reader scrolls past and stay tipped. Verified it moves on
hover at 1440 and 1100, does not at 390 or under reduced motion, and returns to
rest in every case.

Note for anyone testing this: `transformPerspective` produces a `matrix3d` even
at zero rotation, so "is the transform 3D" proves nothing. Compare the matrix at
rest against the matrix while hovering.

Measured on the dark ground: headline and panel titles 19.43:1, trait text
10.19:1, the note's dim half 7.57:1. The CTA uses `--grad-ink`, not `--grad` —
white on the lighter stop measures 3.44:1 and this label is not large text.

### "Clip-On System Lifespan" — `#/clip-on-lifespan`

The sibling of the Stick-On page, and the fourth entry under "Confused? We'll
Guide You". The nav has linked this route since the navigation was written, so
the path was fixed before the page existed.

**Almost none of this page is new code.** `BaseComparison` and `BaseChoice`
carry identical content on both pages and are rendered bare. `BaseOptions` was
given optional `title`/`options` props defaulting to the Stick-On page's own, so
the two pages are one component with different copy rather than two modals to
keep in step — the same consolidation `Checklist`, `HairBenefits`,
`StillConfused` and `GuideHero` have already had. Only the hero is a new file,
and it is a wrapper.

The Stick-On page's `BalanceChoice` and `CarExample` are deliberately absent —
they are not in this page's designs.

**`BaseChoice` takes its questions as a prop here.** Two of the questions state
lifespans in months, and the honest numbers differ by attachment: stick-on thin
lasts 3–4 months and thick 6–8, clip-on thin 6–8 and thick 12. The shared set
carried the stick-on figures, so this page told the reader "6–8 months" in the
thin-base overlay and asked "am I okay changing it every 3 to 4 months?" two
sections later. `clipOnBaseChoiceOptions` differs from the shared set in exactly
those two figures, taken from this page's own overlays.

The photography is installed. **Each declared `width`/`height` is the shipped
file's own, measured after resizing** rather than carried over from the Stick-On
page: the supplied cut-outs do not share its aspect ratios, and a declared size
that disagrees with the file reserves the wrong space and shifts the layout as
the image loads. The two card images are even 6px apart in height (948 and 942),
which the grid equalises — verified equal at every width.

| file | shipped |
| --- | --- |
| `/clip-on-lifespan/thumbnail.png` | 2240×1260 |
| `/clip-on-base-options/first-option.png` | 1088×948 |
| `/clip-on-base-options/first-option-overlay.png` | 1077×984 |
| `/clip-on-base-options/second-option.png` | 1088×942 |
| `/clip-on-base-options/second-option-overlay.png` | 1077×956 |

[Photo](src/components/Photo.tsx) — extracted from `HairBenefits`, which had
carried it alone — still backs `GuideHero` and `BaseOptions`. It renders a
labelled frame naming any file that is not served, so a future missing asset
reads as a gap rather than as a broken page.

### Clip-On Hair System: Stick-On cross-link card

The Clip-On product page carries page-scoped section surfaces: “Backed By
Thousands Of Confident Men” and “Zycon Range • Pro Series” use the soft grey
ground, while “Stick-On Vs. Clip-On Hair Systems” uses the white page ground.
The shared components keep their original surfaces on every other route.

The final section on `#/clip-on-hair-system` is a real full-card link to the
Stick-On comparison route. Desktop keeps copy and a transparent cut-out in one
blue panel; below 820px they stack.

The supplied `Images/Clip-on page/stick onn 1.png` is shipped unchanged as
`public/clip-on-system/learn-stick-on.png` at 2808×2332. Its wider crop replaces
the former 1120×1068 derivative. The card tops out at 390px, the artwork at
380px, and the paragraph at 28px on wide desktop so both sides occupy more of
the panel without changing phone composition.

Check it with `node scripts/verify-clip-learn.mjs [outDir]`. It verifies the
replacement image's natural dimensions, responsive card/art/text sizing,
horizontal overflow, console errors, and failed requests, and saves desktop
and phone screenshots.

### Clip-On Hair System: three things cards

`ClipPillars` follows "The Real Fears Men Have" on
`#/clip-on-hair-system`. Its desktop row is capped at 1000px so the three cards
use more of a wide screen without stretching across the site's full wrap.

The transparent images use `object-fit: contain`; the hairline, anti-bacterial
scalp illustration, and hand-held clips therefore remain fully visible. Their
shipped dimensions are 2232x1396, 880x870, and 1604x1396 respectively. The
desktop floor is capped at 260px so widening the cards does not also enlarge
the approved image scale. The row stays three columns through tablet widths and
becomes a centred, maximum-420px single column below 720px, where the image
floor is capped at 270px to keep the stacked cards shorter.

Check it with `node scripts/verify-clip-pillars.mjs [outDir]`. It verifies the
desktop card proportions, full-image fitting, responsive column count, source
dimensions, accessible heading, horizontal overflow, console errors, and
failed requests, and saves desktop, tablet, and phone screenshots.

### Clip-On Hair System: Zycon range card and overlay

`ClipZyconRange` sits directly between `HairlineTruth` and `Comparison` on
`#/clip-on-hair-system`. Its full surface is one button; the blue plus is a
48px desktop/46px phone affordance rather than the only hit target. Desktop
uses the supplied wide gradient and right-side portrait; below 760px the card
becomes a portrait composition with copy above the photograph.

The desktop card portrait is bottom-anchored at 98% of the card height to keep
the small top gap shown in the reference. The gradient derivative is cropped
to the source artwork's fully opaque colour field, avoiding a fallback-colour
strip at the rounded right edge.

The detail view is a real modal dialog. It uses the site's established focus
contract: Close receives focus, Tab stays inside, Escape and the scrim close,
focus returns to the card, and document scrolling locks without a horizontal
jump. Reduced-motion users receive the same content without spring movement.
The desktop sheet uses two columns, while the portrait is positioned against
the full sheet so its shoulders overlap the column boundary like the supplied
reference. Phone becomes a full-viewport white sheet: close stays in the top
right, copy and CTA lead at the top, and the enlarged gradient-outline portrait
fills the remaining lower area in that reading order.

Three web-sized transparent PNG derivatives ship under
`public/clip-on-system/`: `zycon-gradient.png` at 1800×918, `zycon-card.png` at
1200×1233, and `zycon-overlay.png` at 1400×1517. Their source originals remain
under `Images/Clip-on page/`.

Check it with `node scripts/verify-clip-zycon.mjs [outDir]`. It checks section
order, natural image sizes, full-card button geometry, 44px minimum controls,
dialog labelling, focus trap/return, Escape and scrim closing, scroll lock,
overflow, console errors, and failed requests, then saves desktop and phone
card/overlay screenshots.

### Stick-On Hair System — `#/stick-on-hair-system`

The standalone Stick-On product page follows the supplied sixteen-section
design and mirrors the Clip-On page's reuse strategy. `Achievements`,
`Checklist`, `Backed`, `HairlineTruth`, `ClientStories`, and the accessible
Zycon dialog are shared; the remaining product-specific sections live together
in the page shell. On this route only, “Our Big Achievements” and “Why
Thousands Of Men Choose American Hairline” use the soft grey section ground.

The nav's “Stick-On Hair system” entry and the Clip-On page's final cross-link
both point directly to this route. Consultation cards use a desktop arrow rail
and native scroll snapping on touch screens. The FAQ uses real buttons with
`aria-expanded`; the local-patch comparison remains a semantic table and gains
horizontal scrolling rather than compressing unreadably on phones.
The four transparent consultation cut-outs render directly on each card's white
surface; no separate grey image floor is painted behind them.

The “Why Most Local Hair Systems Fail” photograph preserves its source 4:3
frame with `height: auto` and `object-fit: contain`. Its desktop column is equal
to the copy column, and the same full-frame ratio remains after mobile stacking.
“Our Ultra-Signature Natural Hairline” deliberately reuses that section's
1060px grid, heading scale, section padding, card padding, gaps, type scale, and
complete 4:3 image treatment so the two proof sections carry equal visual weight.
On desktop, its left content card plus CTA stretch to the same top and bottom
edges as the right image. Below 800px, the image moves directly beneath the
section heading, followed by the content card and CTA.

Eleven web-sized PNGs ship under `public/stick-on-system/`. The Zycon gradient
is cropped to the inner 1.92:1 colour card before resizing, so the black texture
outside the supplied export cannot appear as a right-edge seam. The shipped
sizes are 2240×1260 hero, 1320×990 local-patch, four 880×1010 consultation
cut-outs, 1320×990 before/after, 1800×934 gradient, 1200×1206 card portrait,
1400×1486 overlay portrait, and 1200×1247 Clip-On cross-link portrait.

Run `node scripts/verify-stick-on-system.mjs [outDir]`. It checks the complete
sixteen-section route at 1440×900 and 390×844, all supplied image dimensions,
one semantic `h1`, 44px controls, zero horizontal overflow, FAQ expansion,
Zycon focus/scroll-lock behavior, console errors, and failed requests, and
saves desktop/mobile screenshots.

Run `node scripts/verify-product-section-backgrounds.mjs` to check the requested
grey/white page-scoped section surfaces on both product routes at desktop and
mobile sizes.

### Front Hairline Transplant + Hair System — `#/hair-transplant`

The Hair Transplant solution route is a complete eight-chapter page in
`src/pages/HairTransplant.tsx`: contained dark hero, three-card Combination
Method benefit rail, semantic comparison, suitability checklist, privacy-blurred
Bollywood proof, three-step design process, surgeon team, and the shared guidance
form. It uses the shared Nav and Footer. All route copy and asset paths live in
`src/site.ts`; supplied web assets are installed under `public/hair-transplant/`.
The hero trust proof uses five dedicated 98x98 client portraits, rendered at
38x38 with an overlapping white-ring treatment, and reads "Trusted by 6,000+
men around the world."

Desktop keeps benefits, process steps, and surgeon profiles side by side. The
benefit wrapper caps at 1200px so its three portrait cards remain narrow enough
for the complete `object-fit: contain` images to read cleanly. On phones the
benefits become a native snap/swipe rail capped at 290px per card. At 700px and
below, the comparison becomes one compact bordered three-column table with its
visible dark header, matching the supplied mobile reference. Remaining layouts
stack without page overflow. Viewport-entry motion uses `motion/react`, animates only opacity
and transform, and renders settled immediately under `prefers-reduced-motion`.
Below 900px only, benefit cards narrow responsively from 290px to a 250px floor
using `clamp(250px, 72vw, 290px)`. Card height follows its copy plus the
portrait's natural height instead of squeezing the image into a fixed frame.
Each portrait fills the card's inner width edge to edge at its native ratio,
eliminating mismatched side space and distortion. Desktop stays unchanged.
The Bollywood proof image keeps its native 4:3 ratio with `height: auto` and
`object-fit: contain` at every breakpoint, so its faces and embedded caption are
never cropped. Above 900px the complete left content-plus-action column uses the
same 4:3 footprint, giving both sides identical top and bottom edges. At 900px
and below, the image and copy stack at equal width instead of forcing dense copy
into a short side-by-side card.
The Process result band keeps its summary in the first line and renders
"Watch the video." as a separate underlined 44px-high text link to the supplied
YouTube video. It opens in a new tab with `noopener noreferrer`; the existing
consultation button still scrolls to the on-page form.

Run `node scripts/verify-hair-transplant.mjs [outDir]`. It checks 1440×900,
1024×900, 820×900, 390×844, and 1440×900 reduced motion; asserts active navigation,
content counts, 44px targets, image loading, exact hero trust copy and five
portrait sources, benefit card width/image fitting, responsive benefit behavior,
uncropped 4:3 Bollywood media, matched side-by-side heights and stacked widths,
the exact external Process video link and its second-line/underline treatment,
form CTA scrolling, zero horizontal overflow, console errors, and failed
requests; and saves full-page plus focused section inspection screenshots.

### Scalp Micropigmentation — `#/smp`

The SMP route is a complete ten-section page in `src/pages/Smp.tsx`. It uses
the shared Nav, Footer, and `GuideHero`, plus the supplied syringe eyebrow icon, hero photograph,
seven transformation cards, two About cut-outs, four process cut-outs, and five
concern photographs. Web-sized derivatives live in `public/smp/`.

Above 900px, the results section pins while vertical page scroll moves its 4:5
card track horizontally. Below that breakpoint, and under reduced motion, it
becomes a native snap/swipe rail. Results arrows are intentionally absent at
every size. Process arrows are also absent; its rail stays natively swipeable
and keyboard-scrollable. The desktop results pin uses its measured content
height rather than a full viewport, leaving 58px after the cards and allowing
the following section to enter without a blank viewport tail.
Each process image renders at its native aspect ratio across the full card
width, so the transparent cut-outs meet both card edges without side cropping.
The About card opens a keyboard-contained modal with Escape/scrim close, scroll
lock, and focus return. The treatment finder is a semantic five-tab panel; the
FAQ uses the homepage's dark ambient/glass language with real accordion state.
The page-local guidance form includes Name, Phone, City, and Treatment Area,
but has no lead backend and says so after validation.

Run `node scripts/verify-smp.mjs [outDir]`. It checks 1440×900 desktop, the
1024×900 supplied-reference size, 390×844 phone, 844×390 phone landscape, and
reduced motion. It asserts content counts, active navigation, image loading,
results-card ratio/alignment/background, desktop scroll-to-horizontal mapping,
absent results/process arrows, process-image width/source ratio, focusable
process rail, 48px phone bottom gap, 44px control height, zero page overflow,
modal focus/scroll-lock behavior, tab and FAQ interaction, console errors, and
failed requests; it also saves desktop/mobile inspection images.

### Story reels — circular client videos on eight pages

`StoryReels` renders one row of up to four circular video thumbnails, each
titled with the visitor's own question ("Wind test", "Is it a tattoo?"), and
opens a native modal `<dialog>` reel viewer on tap. It is modelled on the
circles beside Add to Cart on 1hairstop.in product pages and, like those, sits
directly **below** each page's consultation CTA (button block or form), so a
visitor who hesitates at the CTA meets proof straight away:

| Page | Set | Placed directly after | Ground |
|---|---|---|---|
| Will My Hairline Look Real | `storyReels.hairline` | `HairlineConfused` ("Need Guidance") | white |
| Stick-On Hair System | `storyReels.stickOn` | `ReadyCta` ("Discuss With A Consultant") | white |
| Clip-On Hair System | `storyReels.clipOn` | `ClipZyconCta` ("Discuss With A Consultant") | white |
| Consult with Founder | `storyReels.founder` | `.cfFinal` ("Book Consultation With Founder") | white |
| SMP | `storyReels.smp` (3 circles) | `SmpForm` | tint |
| Hair Transplant | `storyReels.transplant` | the page form | white |
| Stick-On Lifespan | `storyReels.stickOnLifespan` | `Form` | tint |
| Clip-On Lifespan | `storyReels.clipOnLifespan` | `Form` | tint |

Homepage, Results, Team and the other guide pages deliberately have none.

Viewer behaviour: full screen on phones (video `contain`, so burned-in captions
are never cropped), a centred 9:16 frame on desktop with arrows outside it;
segmented progress bars; sound on with a muted fallback; tap to pause, swipe
sideways to change clip, swipe down / Esc / backdrop click / phone back button
to close (the viewer owns one history entry); arrow keys; a WhatsApp
"Discuss With a Consultant" CTA on every clip and an end card after the last.
Opened circles turn their ring grey (localStorage, per browser). Posters are
~10 KB WebP; a clip is fetched only on tap.

**Placeholder media.** The six `public/story-reels/placeholder-N.mp4` clips are
540×960 cuts of `public/clients/client-story-N.mp4` (whose real content is a
4:5 panel at x=528 inside a 1920×1080 frame), set on a blurred fill. Titles
describe what each page *should* show; replace each item's `src`, `poster` and
`name` in `storyReels` when real vertical clips arrive.

Run `node scripts/verify-story-reels.mjs [baseUrl] [outDir]` (default base
`http://127.0.0.1:5173/`). At 1440×900 and 390×844 on all eight routes it
checks circle count and size, zero overflow, the viewer opening and playing,
wheel scroll lock, ArrowRight advance, Esc close, watched rings, back-button
close without leaving the route, and console errors.
