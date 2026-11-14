# Codex account handoff — American Hairline website

Use this file when opening the project with another Codex account. The complete,
canonical project memory remains `PROJECT-CONTEXT.md`; this file is the short
orientation and skill-transfer checklist.

## Fastest transfer

If the other Codex account will use this same computer and this same folder,
there is nothing to reinstall. Open:

`C:\Users\ADMIN\Desktop\Websiet project 2`

The 40 project-local skills under `.agents/skills/` are discovered from the
folder, not from the Codex login.

If the project is moving to another computer, clone
`https://github.com/ahluiteam-ops/AHL-3D-Website.git` and ensure Git LFS is
installed so the source and web assets are fetched. The repository now includes
hidden `.agents/`, `Images/`, both PDF folders, and `public/`. The ignored
`reference/` recordings and `versions/` plain-folder snapshot remain local-only;
copy those separately if they are needed. Do not run `git clean`,
`git reset --hard`, or discard future worktree changes.

## First prompt for the other Codex account

Paste this after opening the folder:

> Continue the American Hairline website in this folder. Read `AGENTS.md` and
> then read `PROJECT-CONTEXT.md` completely before changing anything. Read the
> relevant part of `README.md` and the relevant source files for my task. The
> current filesystem and Git history are authoritative; preserve any existing
> worktree changes. After every
> meaningful task, update `PROJECT-CONTEXT.md` exactly as `AGENTS.md` requires.
> Project-local skills are in `.agents/skills/`; use the relevant skill when it
> matches the task.

## Project in one page

- Product: a from-scratch multi-page American Hairline marketing site for
  non-surgical hair systems in India. It is not yet the brand's full site.
- Stack: Vite 6, React 18, TypeScript, Motion, Lucide, and plain CSS. There is no
  Tailwind, shadcn, router package, CMS, or backend.
- Run: `npm install`, then `npm run dev` at `http://localhost:5173`. Build and
  typecheck with `npm run build`.
- Routing: hash routes in `src/App.tsx`; bare hashes are in-page anchors.
- Implemented routes:
  - `/` — homepage
  - `#/stick-on-or-clip-on`
  - `#/hair-patch-vs-hair-system`
  - `#/will-my-hairline-look-real`
  - `#/stick-on-lifespan`
  - `#/clip-on-lifespan`
  - `#/clip-on-hair-system`
  - `#/stick-on-hair-system`
  - `#/smp`
  - `#/hair-transplant`
- Current state: the version-2 baseline is committed on `master` and published
  to GitHub. The Hair Transplant route and later refinements are intentional
  uncommitted work; preserve every unrelated edit and asset.
- Content: shared strings and asset paths live in `src/site.ts`; design tokens
  are in `src/styles/tokens.css`; most presentation rules are in
  `src/styles/global.css`, with route-scoped rules in `src/styles/smp.css` and
  `src/styles/hair-transplant.css`.
- Source material: client reasoning is in `Website page document pdf's/`; the
  supplied old-site visual designs are in `Website page design pdf's/`; original
  image inputs are in `Images/`; web-delivery assets are in `public/`.
- Important visual direction: the PDFs control content, order, copy, and brand,
  but not the new visual layout. The homepage is intentionally a newer 3D
  direction based on section-by-section references.
- Brand voice: plain, consultative, candid. Prefer “Talk to an Expert” or
  “Discuss With a Consultant” over transactional “Book Now”. Do not invent
  claims, numbers, testimonials, or scarcity.
- Core conventions: plain CSS; import animation from `motion/react`; honor
  `prefers-reduced-motion`; keep content in `src/site.ts`; put shipped assets in
  `public/`; mobile-first; preserve the single shared Hero/Secret film owned by
  `HeroSecret.tsx`.
- Verification: for visual work test 1440x900, 390x844, reduced motion, console
  errors, failed requests, horizontal overflow, and `npm run build`. Existing
  route-specific Puppeteer checks are under `scripts/`.
- Known launch blockers: both lead forms have no backend; salon photos are
  Unsplash stand-ins rather than real premises; several required videos and
  real social URLs are missing; client publication consent needs confirmation;
  most white-on-blue gradient buttons miss AA contrast. Full details and exact
  paths are in `PROJECT-CONTEXT.md` section 7.
- Repository facts: branch `master`; tag `homepage-v1`; remote `origin` is
  `https://github.com/ahluiteam-ops/AHL-3D-Website.git`; new PNG, JPG, JPEG,
  WebP, MP4, and PDF assets are tracked with Git LFS.

## Skills: no-install option (recommended)

The exact skill snapshot used by this project is already stored in
`.agents/skills/`: 40 skills, 487 files, about 12.22 MB. Keeping this directory
with the project is more reproducible than downloading newer upstream versions.
`skills-lock.json` records every upstream source, path, and content hash.

Codex system skills such as `skill-installer`, `openai-docs`, `imagegen`, and
`skill-creator` are provided by Codex itself and do not need manual installation.
Account-installed plugins/connectors are separate from these project skills.

## Skills: upstream install links

If `.agents/skills/` was not transferred, ask the new account's
`$skill-installer` to install the following GitHub directories. These five
repositories cover all 40 project skills.

### freshtechbro/claudedesignskills (23)

Repository: <https://github.com/freshtechbro/claudedesignskills>

- [aframe-webxr](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/aframe-webxr)
- [animated-component-libraries](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/animated-component-libraries)
- [animejs](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/animejs)
- [babylonjs-engine](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/babylonjs-engine)
- [barba-js](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/barba-js)
- [blender-web-pipeline](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/blender-web-pipeline)
- [gsap-scrolltrigger](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/gsap-scrolltrigger)
- [lightweight-3d-effects](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/lightweight-3d-effects)
- [locomotive-scroll](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/locomotive-scroll)
- [lottie-animations](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/lottie-animations)
- [modern-web-design](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/modern-web-design)
- [motion-framer](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/motion-framer)
- [pixijs-2d](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/pixijs-2d)
- [playcanvas-engine](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/playcanvas-engine)
- [react-spring-physics](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/react-spring-physics)
- [react-three-fiber](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/react-three-fiber)
- [rive-interactive](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/rive-interactive)
- [scroll-reveal-libraries](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/scroll-reveal-libraries)
- [skill-creator](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/skill-creator)
- [spline-interactive](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/spline-interactive)
- [substance-3d-texturing](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/substance-3d-texturing)
- [threejs-webgl](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/threejs-webgl)
- [web3d-integration-patterns](https://github.com/freshtechbro/claudedesignskills/tree/main/.claude/skills/web3d-integration-patterns)

### nextlevelbuilder/ui-ux-pro-max-skill (7)

Repository: <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>

- [banner-design](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/banner-design)
- [brand](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/brand)
- [design](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/design)
- [design-system](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/design-system)
- [slides](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/slides)
- [ui-styling](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/ui-styling)
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/.claude/skills/ui-ux-pro-max)

### JuliusBrussee/caveman (7)

Repository: <https://github.com/JuliusBrussee/caveman>

- [cavecrew](https://github.com/JuliusBrussee/caveman/tree/main/skills/cavecrew)
- [caveman](https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman)
- [caveman-commit](https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman-commit)
- [caveman-compress](https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman-compress)
- [caveman-help](https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman-help)
- [caveman-review](https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman-review)
- [caveman-stats](https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman-stats)

### HUANGCHIHHUNGLeo/claude-real-video (2)

Repository: <https://github.com/HUANGCHIHHUNGLeo/claude-real-video>

- [claude-real-video](https://github.com/HUANGCHIHHUNGLeo/claude-real-video/tree/main/skills/claude-real-video)
- [claude-real-video-for-agents](https://github.com/HUANGCHIHHUNGLeo/claude-real-video/tree/main/skills/claude-real-video-for-agents)

### anthropics/claude-code (1)

- [frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design/skills/frontend-design)

## Copy-paste install request for the other account

> Use `$skill-installer` to install all 40 skills listed in
> `CODEX-HANDOFF.md` from their exact GitHub directories. Do not replace Codex
> system skills. After installation, reopen this project and confirm that the
> project-local or installed skill catalog includes all names in
> `skills-lock.json`.

Use the local `.agents/skills/` snapshot whenever possible; upstream repositories
may change after this handoff, while the local snapshot is the exact version
that produced the current site.
