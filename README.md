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

Vite + React + TypeScript, plain CSS (no framework), and
[lucide-react](https://lucide.dev) for chevron, arrow, grid, and close icons.

## Where things live

| Piece | File |
| --- | --- |
| Colour, type, and spacing tokens | [src/styles/tokens.css](src/styles/tokens.css) |
| All layout and component CSS | [src/styles/global.css](src/styles/global.css) |
| Nav bar + menu drawer | [src/components/Nav.tsx](src/components/Nav.tsx) |
| The chrome `100% NATURAL` band | [src/components/Wordmark.tsx](src/components/Wordmark.tsx) |
| Headline column | [src/components/Hero.tsx](src/components/Hero.tsx) |
| Style carousel | [src/components/MatchSlider.tsx](src/components/MatchSlider.tsx) |
| Site content and asset paths | [src/site.ts](src/site.ts) |
| Hero background video | `public/video/hero-bg.mp4` |
| Section 2 — "The Secret…" | [src/components/Secret.tsx](src/components/Secret.tsx) |
| Section 2 hair-system video | `public/video/secret-hair-system.mp4` |
| Section 3 — Achievements | [src/components/Achievements.tsx](src/components/Achievements.tsx) |
| Section 4 — Why Men Choose Us / Key Facts | [src/components/KeyFacts.tsx](src/components/KeyFacts.tsx) |
| Section 5 — 21-Point Checklist | [src/components/Checklist.tsx](src/components/Checklist.tsx) |
| Checklist film poster | `public/checklist/21-point-checklist.png` |
| Section 6 — Client stories | [src/components/ClientStories.tsx](src/components/ClientStories.tsx) |
| Client film posters | `public/clients/client-story-1…6.png` |
| Section 6b — Backed by thousands | [src/components/Backed.tsx](src/components/Backed.tsx) |
| Proof icons | `public/backed/*.png` |
| Section 6c — Real hair or illusion? | [src/components/Decide.tsx](src/components/Decide.tsx) |
| Section 6d — Our trusted methods | [src/components/Methods.tsx](src/components/Methods.tsx) |
| Section 6e — Guidance form | [src/components/Form.tsx](src/components/Form.tsx) |
| Section 7 — Hair systems | [src/components/Systems.tsx](src/components/Systems.tsx) |
| The collection surfer | [src/components/ui/collection-surfer.tsx](src/components/ui/collection-surfer.tsx) |
| System film posters | `public/systems/system-01…13.png` |
| Section 8 — This Might Sound Like Your Story | [src/components/Story.tsx](src/components/Story.tsx) |
| Section 9 — Hair services | [src/components/Services.tsx](src/components/Services.tsx) |
| Service photographs | `public/services/*.png` |
| Section 10 — Step-by-step process | [src/components/Process.tsx](src/components/Process.tsx) |
| Process film poster | `public/process/steps.png` |
| Section 11 — Why thousands of men choose us | [src/components/Pillars.tsx](src/components/Pillars.tsx) |
| Section 12 — Before and after deck | [src/components/Deck.tsx](src/components/Deck.tsx) |
| The card stack | [src/components/ui/card-stack.tsx](src/components/ui/card-stack.tsx) |
| Testimonial card artwork | `public/social/*.png` |
| Section 13 — Advanced 3D Scan | [src/components/Scan.tsx](src/components/Scan.tsx) |
| Section 14 — Premium salons | [src/components/Salons.tsx](src/components/Salons.tsx) |
| Salon photographs (stand-ins) | `public/salons/*.jpg` |
| Section 15 — Frequently Asked Questions | [src/components/Faq.tsx](src/components/Faq.tsx) |
| Footer | [src/components/Footer.tsx](src/components/Footer.tsx) |
| Shared responsive and motion hooks | [src/hooks.ts](src/hooks.ts) |

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
layout immediately.

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

**The film itself is not supplied yet.** `checklistVideo.src` in
[src/site.ts](src/site.ts) is deliberately empty, so the block renders as a
still figure. Set a path there and it becomes a real play control with an
inline `<video>`; no other change is needed.

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

**The films are not supplied yet.** Every `clientStories[].src` in
[src/site.ts](src/site.ts) is empty, so each card renders as a `<figure>` with a
decorative play mark rather than a dead button. Set a path and that card becomes
a real play control with an inline `<video>` — the same arrangement as the
checklist film.

⚠ **Names and quotes are placeholders on photographs of identifiable real
people.** Three names come from the client's own design artwork but are not
matched to these faces, and no client said any of these quotes. Every
name/quote pair needs replacing with the real one, with that client's
permission, before launch.

## Section 7 — "World's Finest Thinnest Hair Systems" (collection surfer)

Built from the supplied `collection-surfer` component, ported into
[src/components/ui/collection-surfer.tsx](src/components/ui/collection-surfer.tsx).
Thirteen product films form one diagonal ribbon receding into depth; scroll
brings each in turn to the front and the pointer pulls whichever card it is
nearest. [src/components/Systems.tsx](src/components/Systems.tsx) supplies the
content and the heading.

Four things changed from the original, all deliberate:

1. **No loop, as requested.** The original duplicated the list and took scroll
   position modulo one set's length, so the ribbon ran forever. Progress is now
   clamped to `[0, 1]`: the track stops on the last card and will not wrap, and
   scrolling back up runs it in reverse to the first. Verified at 1440×900 —
   the track travels 0 → 3600 and stays at 3600 when scrolled 400px past the
   section's end, then unwinds on the way back up.
2. **Pinned, not fixed.** The original was `position: fixed` over a 50,000px
   spacer, which would have covered every other section on this page. It is now
   a sticky child of a section measuring `100vh + travel` (5940px at 1440×900),
   the same pin the Achievements and Checklist sections use.
3. **Plain CSS, not Tailwind.** This project has no Tailwind and no shadcn, and
   `src/components/ui` already exists. The utility classes are rules in
   `global.css`. No new dependency was installed: `framer-motion` is already on
   disk as a transitive dependency of `motion`, and importing it directly would
   ship a second copy of the animation runtime — the import is `motion/react`.
4. **Light ground, not black,** matching the client's artwork and the light
   studio posters.

**The ribbon starts at the right edge.** The track's origin — where the card in
front sits — is parked against the right of the viewport rather than the middle,
so the chain fills the frame from that corner toward the lower left and scroll
surfs it across. The step vector runs left, down and back (`-300, 46, -300`).
Running it up instead would put the small far cards directly behind the heading.
Verified: the front card measures 378px across, centred at x = 1227 in a 1440px
viewport, at both the first card and the last.

**Card turn direction is not cosmetic.** The cards sit to the right of the
perspective origin, so turning the *right* edge toward the viewer throws it
further right and the card reads wide. Turning the left edge forward throws that
edge right as well, which folds the card up — at `+50deg` the front card
measured 116px across instead of its 364px width. The angle is `-42deg`.

Posters are shown at full opacity. An earlier version faded cards with distance
for aerial perspective; these are product shots, and a washed-out one
misrepresents the product, so depth is carried by scale and perspective alone.

One behaviour worth knowing: a card that has been surfed past keeps travelling
toward the camera. It dissolves within roughly one step, and once past the
camera plane it projects to tens of thousands of pixels wide — measured 65,982px
before the fix — so it is set to `visibility: hidden` rather than left as a
zero-opacity layer the compositor still handles every frame.

The heading is two lines set straight onto the ground at the top left, with no
card behind it; the ribbon recedes toward the lower left, so that corner stays
clear. There are no arrows and no counter: scroll is the only control.

Below 901px and for `prefers-reduced-motion` the 3D scene is dropped for a
scroll-snapped rail.

**The films are not supplied yet.** Every `hairSystems[].src` in
[src/site.ts](src/site.ts) is empty, so the play mark is a mark rather than a
control.

⚠ **The supplied posters carry small printed numbers** in their top-right
corners (visible as 1–9 on the mannequin shots). They are baked into the
client's image files, not added by the markup, and will need removing at source
if they are not wanted on the live site.

> A "motion arc" variant of this section was built on 2026-08-07 from TRIONN's
> "Design in Motion" (`reference/Recording 2026-08-07 112815.mp4`), replacing
> the ribbon with a wheel. The client preferred this ribbon version, so it was
> restored the same day and the arc removed. Do not rebuild the arc without
> being asked.

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

Below 901px and for `prefers-reduced-motion` the pin is dropped and every card
is simply open — five short lines and an offer, none of which depends on the
animation to make sense.

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

For `prefers-reduced-motion` the pin is dropped and the rows take their height
from the photograph (`aspect-ratio: 4 / 3`) while keeping the two-column
layout; it answers clicks instead of scroll. Below 901px the row stacks as
well — photograph above, copy below — because a 31% media column leaves the
name nowhere to sit on a phone.

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

The film itself has not been supplied. `processVideo.src` in
[src/site.ts](src/site.ts) is empty, so the block renders as a `<figure>`
carrying the client's poster rather than a dead button; set a path there and
nothing else needs changing.

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

There are no dots, no follow line and no social links under the deck: the
section is the heading and the cards.

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
headline** growing out of its own slot until it covers the viewport, dimming
the type it passes over. The heading breaks as `Uses Advanced [picture] 3D` /
`Scan Technology`.

**The picture is not scaled.** It is an absolutely positioned panel whose
`left/top/width/height` are interpolated between two measured rects — the
slot's and the stage's. That is what a scale transform cannot give: the panel
changes aspect as it grows, so `object-fit: cover` re-crops the photograph on
the way out, and the corner radius stays a real radius instead of being
magnified by the same factor as everything else. Measured at 1440×900, the
panel runs `163×103` at the slot to `1440×900` covering the stage, radius 14px
to 0.

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

Below 901px and for reduced motion the pin is dropped, the slot collapses so
the heading reads as two plain lines, and the picture sits under it as an
ordinary block.

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

> **The three photographs are stand-ins.** They are Unsplash salon interiors,
> not American Hairline's studios, and shipping them live would be showing
> someone else's salon as ours. Replace all three in `public/salons/` before
> launch — the paths are the only thing that needs to change.

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

One card, given depth rather than decoration. The poster is oversized inside
its frame and moves against it, so the card reads as having a front and a back
instead of a flat plane being rotated. Measured at 1440×900: the card sits at
980×735 at rest with no transform, and at `2.5deg / -3deg` under the pointer.

The film has not been supplied. `decideVideo.src` in
[src/site.ts](src/site.ts) is empty, so this is a `<figure>` rather than a dead
button; set a path and it becomes a real play control with an inline `<video>`.
The poster is the client's own before/after photograph.

## Section 6d — "Our Trusted Methods For A Natural Look"

The client's artwork: heading top-left, accordion bottom-left, one photograph
filling the right column. Depth is on the photograph only — type that rotates
is type that is harder to read.

**The photograph's proportions set the row's height.** `.methods__media`
carries `aspect-ratio: 1088 / 1422` and `align-self: start`, which is what lets
the left column stretch to match it and sit heading-top / accordion-bottom as
in the artwork. Left to stretch instead, the row was only as tall as the copy
and the portrait became a 528×392 landscape crop — measured before the fix,
528×690 after.

Two methods, because two is what the artwork shows. Zycon™ is a third method
the brand sells and would slot straight in.

The photograph is shared with the Services section. A photograph per method
would be better when the client has one.

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

Uses `public/video/secret-hair-system.mp4` (1940×1068, 10.04s, ~13.9 MB) as a
full-bleed muted one-shot film. The section is one viewport tall, not pinned and
not scroll-scrubbed. An `IntersectionObserver` starts playback when at least 35%
of the section first enters, pauses it off-screen, and resumes from the same
time if the user returns. It never restarts after ending and holds the final
frame. Removing repeated `currentTime` seeks fixes the decoder/frame-jump
glitch.

Copy follows video time:

1. `0–3s` — title centred at the top.
2. `3–4.25s` — no copy; model-only close-up.
3. `4.25–8.65s` — three benefit pairs form one restrained editorial row in the
   clean upper white space.
4. `8.65s–end` — benefits leave and the closing claim enters beside the final
   profile, then remains with the held last frame.

Copy sits directly in the source film's white space. There are no cards, glass
surfaces, guide lines, separators, extra background layers, masks, filters or
outer model transforms. Desktop benefits use three equal columns over the
macro-detail sequence; the closing crop shifts the model left to reserve the
right side for the final claim. Mobile changes the benefits to one compact left
stack, keeps the hair system on the right, then places the final claim above the
profile in the source film's open space.

Content stays centralized in [src/site.ts](src/site.ts), while
[src/components/Secret.tsx](src/components/Secret.tsx) owns playback and phase
logic. With `prefers-reduced-motion`, automatic playback stops; the section
renders the title, a contained static film, benefits and closing claim in a
readable vertical sequence.

## The hero background video

`public/video/hero-bg.mp4` (1928×1072, 10s, ~8.7 MB) loops behind the whole stage
— wordmark *and* hero — with the mannequin rising up into the letters. It
autoplays because it is `muted` + `playsInline`, which browsers require for
unattended playback. **There is no overlay over it**, by request — the headline
column relies on its own contrast against the footage.

Two tricks make the composite work, both on `.hero__bg` itself:

- `mix-blend-mode: darken` keeps whichever pixel is darker, video or page. The
  footage's white ground disappears into the page, while dark hair stays solid
  and reads as standing *in front of* the chrome wordmark.
- `filter: brightness(1.14)` lifts the footage's grey studio ground to pure white
  so the video rectangle has no visible edges.

Because of the darken blend, this composite depends on the page behind the stage
staying white. Below 1080px the tall crop is also nudged to
`object-position: 18% center` so the mannequin clears the left-aligned copy
instead of sitting behind it.

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
