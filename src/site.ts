export type NavSubItem = {
  label: string
  href: string
}

export type NavDropdownItem = {
  label: string
  href: string
  subItems?: NavSubItem[]
}

export type NavItem = {
  label: string
  href: string
  current?: boolean
  items?: NavDropdownItem[]
}

export const nav: NavItem[] = [
  { label: 'Home', href: '#/' },
  {
    label: "Confused? We'll Guide You",
    href: '#guide',
    items: [
      { label: 'Hair patch vs Hair system', href: '#/hair-patch-vs-hair-system' },
      {
        label: 'Clip-On or Stick-On',
        href: '#/stick-on-or-clip-on',
        subItems: [
          /* Each method opens its own complete product page. */
          { label: 'Clip-On Hair system', href: '#/clip-on-hair-system' },
          { label: 'Stick-On Hair system', href: '#/stick-on-hair-system' },
        ],
      },
      { label: 'Will my hairline look real?', href: '#/will-my-hairline-look-real' },
      { label: 'Stick-On System Lifespan', href: '#/stick-on-lifespan' },
      { label: 'Clip-On System Lifespan', href: '#/clip-on-lifespan' },
    ],
  },
  {
    label: 'Solutions',
    href: '#solutions',
    items: [
      { label: 'Hair systems (No Surgery)', href: '#/stick-on-or-clip-on' },
      { label: 'SMP (Scalp Micropigmentation)', href: '#/smp' },
      { label: 'Hair transplant', href: '#/hair-transplant' },
    ],
  },
  { label: 'Results', href: '#/results' },
  { label: 'About us', href: '#/about-us' },
]

/* Front Hairline Transplant + Hair System
 *
 * This solution page explains the hybrid method: transplanted hair at the
 * front, where the hairline is most visible, and a hair system behind it for
 * density. Copy and media stay together here so the page component remains a
 * layout, not a second content source. */
export const hairTransplant = {
  hero: {
    eyebrow: 'Hair Transplant',
    eyebrowIcon: '/hair-transplant/hair-skin-icon.png',
    title: ['Front Hairline Transplant', '+ Hair System'],
    lede: [
      'If you\u2019re serious about looking your ',
      'absolute best',
      ', this is the most ',
      'advanced solution',
      ' available today.',
    ],
    trust: 'Trusted by 6,000+ men around the world',
    avatars: [
      '/hair-transplant/trusted-client-1.png',
      '/hair-transplant/trusted-client-2.png',
      '/hair-transplant/trusted-client-3.png',
      '/hair-transplant/trusted-client-4.png',
      '/hair-transplant/trusted-client-5.png',
    ],
    media: {
      src: '/hair-transplant/hair-transplant-or-system.mp4',
      poster: '/hair-transplant/combination-method.png',
      label: 'Watch the hair transplant comparison',
      alt: 'A transplanted front hairline beside the finished combination method result.',
      width: 3968,
      height: 2232,
    },
  },
  benefits: {
    title: ['Why Combination Method Is', 'The Best Solution'],
    items: [
      {
        title: 'Natural Hairline',
        body: 'A perfectly designed, natural hairline, including the temples.',
        image: '/hair-transplant/natural-hairline.png',
        alt: 'Front view of a client\u2019s finished natural hairline.',
        width: 1408,
        height: 1952,
      },
      {
        title: 'Full Density',
        body: 'Coverage at the back, even if your donor area is weak.',
        image: '/hair-transplant/full-density.png',
        alt: 'Top view showing full hair density across the crown.',
        width: 1408,
        height: 1952,
      },
      {
        title: '360\u00b0 Real Look',
        body: 'Looks like your real hair from every angle.',
        image: '/hair-transplant/real-look.png',
        alt: 'Side view of a client\u2019s finished haircut and natural temple area.',
        width: 1408,
        height: 1952,
      },
    ],
  },
  comparison: {
    title: ['Why Hybrid Wins:', 'Natural Hairline And Good Density'],
    columns: ['Feature', 'Hair Transplant', 'Front Transplant + Hair System'],
    rows: [
      ['Front Hairline', 'Thin, weak', 'Extremely natural hairline'],
      ['Brush Back', 'Gaps visible', 'Full, smooth look'],
      ['Overall Density', 'Thin once hair falls', 'Full, even density'],
      ['Temple Area', 'Often skipped', 'Well-defined temples'],
      ['Weak Graft', 'Limited results', 'Works with limited grafts'],
      ['Donor Need', '5000+ grafts', 'Low, only front needed'],
      ['Self-Belief', 'Often disappointing', 'Boosts confidence'],
    ],
    closeLead: 'If your donor area falls short, this ',
    closeStrong: 'hybrid solution gives you a flawless, natural look.',
  },
  idealFor: {
    title: 'Who Is This For?',
    intro: 'This combination is ideal if:',
    items: [
      'Your **donor area** isn\u2019t enough for complete coverage.',
      'You\u2019re focused on **uniform density** from front to crown.',
      'You\u2019re willing to **invest in the best** long-term solution.',
      'You care about **face aesthetics**, not just hair quantity.',
      'You want a **front hairline** that looks natural, including temples.',
      'You want a **brush-back style** without exposing bald spots.',
      'You know a **full transplant** won\u2019t give side-and-back density.',
      'You\u2019ve had a **failed transplant** that didn\u2019t deliver density.',
      'You want a **complete look**, not just coverage, but proper design.',
      'You want **undetectable blending** even if someone touches your scalp.',
    ],
    closeLead: 'If you want an ',
    closeStrong: 'extremely natural hairline with good density,',
    closeEnd: ' then this method is designed for you.',
  },
  bollywood: {
    title: ['The Secret Behind Most', 'Bollywood Actors\u2019 Hair'],
    intro: 'The Hybrid Method gives you:',
    items: [
      'Extremely natural hairline with good density, including the temples.',
      'Full, camera-ready density.',
      'No thinning from any angle.',
      'Style versatility without the sacrifice.',
      'A flawless, undetectable finish.',
    ],
    action: 'Talk To An Expert',
    media: {
      src: '/hair-transplant/bollywood-hair.png',
      alt: 'Privacy-blurred comparison illustrating natural-looking hairlines used for camera-facing work.',
      width: 2176,
      height: 1632,
    },
  },
  process: {
    title: ['A Step-By-Step Design Process', 'For Your Perfect Look'],
    steps: [
      {
        title: 'Step 1: Expert Consultation',
        body: 'Meet with our core team of hair system designers, transplant surgeons, and specialists.',
        label: 'We assess:',
        items: [
          'Your donor area',
          'Face structure',
          'Hair texture, color, and volume',
          'Desired hairstyle, hairline shape, temple area, and density',
        ],
        close: 'This step provides 100% clarity on what\u2019s possible and what will look best for you.',
      },
      {
        title: 'Step 2: Strategic Planning & Design',
        body: 'The design process begins as our team of surgeons, hair experts, and designers collaborate to map your scalp.',
        label: 'We plan:',
        items: [
          'Transplant areas (using FUE for a minimally invasive, precise extraction process)',
          'Custom hair system coverage',
        ],
        close: 'Every detail is tailored to your needs, from texture to volume and color, ensuring a natural result.',
      },
      {
        title: 'Step 3: Execution & Styling',
        body: 'Your transplant is performed with precision and care, and after 15\u201330 days of healing, we begin the fitting of your hair system.',
        label: 'We blend:',
        items: ['Your new front hairline', 'Full volume at the back'],
        close: 'The final styling is designed to match your face shape and lifestyle, creating a seamless, natural look.',
      },
    ],
    resultTitle: 'The Result:',
    resultBody: 'A natural front hairline and full volume at the back. Want more details?',
    resultVideo: {
      label: 'Watch the video.',
      href: 'https://www.youtube.com/watch?si=-NXdBuo8rl8b6hZT&v=-od3mv_pHHQ&feature=youtu.be',
    },
    action: 'Discuss With a Consultant',
  },
  surgeons: {
    title: ['Meet Our Expert Team Of', 'Transplant Surgeons'],
    items: [
      {
        name: 'Dr. Ashutosh Mishra',
        credential: 'Plastic & Cosmetic Surgeon MCH',
        image: '/hair-transplant/dr-ashutosh-mishra.png',
        alt: 'Dr. Ashutosh Mishra, Plastic and Cosmetic Surgeon MCH.',
        width: 2176,
        height: 1780,
      },
      {
        name: 'Dr. Vinod Sonawane',
        credential: 'MD Hair Transplant Surgeon',
        image: '/hair-transplant/dr-vinod-sonawane.png',
        alt: 'Dr. Vinod Sonawane, MD Hair Transplant Surgeon.',
        width: 2176,
        height: 1780,
      },
    ],
  },
} as const

/* `client` is the caption under the card. `style` never appears on screen —
 * it stays as the image's alt text, so the description of what is actually
 * being shown survives for screen readers and image search. */
export type Client = { client: string; style: string; img: string }

/* Six cards, three visible per page.
 *
 * Each card owns its own file in /public/hair, so swapping one client photo
 * never disturbs another. These are transparent-background cut-outs, which is
 * what lets the card's grey show behind the subject with no overlay.
 *
 * The names are the client's own, supplied 2026-08-08, and replaced the
 * placeholders that stood here. Several of these men appear elsewhere on the
 * page too — Rohan Bera, Rylan Rodrigues and Arun Sharma in `clientStories`,
 * Daljit Singh, Chandan Singh and Advik Sharma in the deck artwork — so a name
 * changed here should be changed there as well.
 *
 * `style` is still a written description of what each photograph shows, which
 * is what `alt` is for; it makes no claim about the man. */
export const clients: Client[] = [
  { client: 'Rohan Bera', style: 'wavy side-swept', img: '/hair/client-1.png' },
  { client: 'Daljit Singh', style: 'short natural', img: '/hair/client-2.png' },
  { client: 'Chandan Singh', style: 'thick jet-black', img: '/hair/client-3.png' },
  { client: 'Rylan Rodrigues', style: 'textured crop', img: '/hair/client-4.png' },
  { client: 'Arun Sharma', style: 'classic side part', img: '/hair/client-5.png' },
  { client: 'Advik Sharma', style: 'full volume', img: '/hair/client-6.png' },
]

/* "The Secret Behind Our Natural Hairline" */
export const secretTitleLines = [
  'The Secret Behind',
  'Our Natural Hairline',
] as const

export const secretBenefits = [
  { title: 'Looks Just Like Your Own Scalp', note: 'Nobody can tell' },
  { title: 'No Harsh or Fake Hairline', note: 'Only natural edges' },
  { title: 'Feels Light, Breathable, Comfortable', note: 'Just like your own' },
] as const

export const secretClosingLines = ['No Line. No Shine.', 'Just Real'] as const

/* Corrected 15-second Higgsfield film shared by Hero and Secret. Only cool,
 * bright studio-background pixels are neutralized; the mannequin and hair
 * retain the original grade. It keeps six-frame bidirectional seek points. */
export const unifiedHairVideo = '/video/hair-system-unified-clean.mp4'

/* "Our Big Achievements" — the shared proof block, presented as a pinned
 * horizontal scroll. The Bollywood image is deliberately face-blurred to
 * protect client privacy.
 *
 * `hidden` keeps a card in the record but off the page. Delete the flag to
 * bring it back; nothing else needs changing, and the track re-measures its
 * own width, so the pin length follows automatically. */
export type Achievement = {
  title: string
  note: string
  img: string
  hidden?: boolean
}

export const achievements: Achievement[] = [
  {
    title: 'Shark Tank India',
    note: 'Offered a deal on national television.',
    img: '/achievements/shark-tank-india.png',
  },
  {
    title: 'Bharat Innovators Award',
    note: 'Won for advancing non-surgical hair replacement in India.',
    img: '/achievements/bharat-innovators-award.png',
  },
  {
    title: 'Designed for Bollywood',
    note: 'Built for people whose hairline is examined frame by frame.',
    img: '/achievements/designed-for-bollywood.png',
  },
  {
    title: 'Advanced 3D Scan',
    note: 'Every base mapped to the scalp before a single strand is knotted.',
    img: '/achievements/advanced-3d-scan.png',
    /* Hidden on request, 2026-08-08. Kept because its photograph is also the
       "Uses Advanced 3D Scan Technology" section's, and because the scan is
       one of the brand's proof points in §3 — this card may well come back. */
    hidden: true,
  },
]

/* "Our 21-Point Checklist For A Perfect Hair System"
 *
 * The section is a pinned, scroll-scrubbed list: one point is in focus at a
 * time while its neighbours sit behind a depth-of-field blur. Order matters —
 * it is the order the studio actually works in, from colour match through to
 * fade compatibility — so do not sort these alphabetically or by length. */
export const checklistTitle = [
  'Our 21-Point Checklist',
  'For A Perfect Hair System',
] as const

export const checklistLede = 'We custom every detail.'

/* Shared by every Checklist instance. The supplied film plays inline while
 * the existing image remains its poster before playback. */
export const checklistVideo = {
  poster: '/checklist/21-point-checklist.png',
  src: '/checklist/21-point-checklist.mp4',
  alt: 'Vinitt Dessai matching a client’s hair system against the American Hairline colour, wave and density charts.',
  label: 'Watch the 21-point check',
}

export type ChecklistPoint = { title: string; note: string }

export const checklistPoints: ChecklistPoint[] = [
  {
    title: 'Hair Colour Match',
    note: 'Strand-to-strand precision, no visible mismatch',
  },
  {
    title: 'Hair Strand Diameter',
    note: 'Fine / Medium / Coarse, matched to native texture',
  },
  {
    title: 'Wave Type',
    note: 'Straight / Soft wave / Body wave / Defined curls',
  },
  {
    title: 'Hairline Shape',
    note: 'Straight / M-curve / Rounded / Slight recession',
  },
  {
    title: 'Hairline Density',
    note: 'Low / Medium / High (especially front 1 inch)',
  },
  {
    title: 'Hairline Direction',
    note: 'Brush back / Left-right / Natural fall (starting point)',
  },
  {
    title: 'Whorl Area / Crown Design',
    note: 'Clockwise / Anti-clockwise / Flat crown realism',
  },
  {
    title: 'Overall Hair Direction',
    note: 'Forward / Side / Backward, aligned to natural growth',
  },
  {
    title: 'Knotting Technique at Root',
    note: 'V-loop / Injected / Single / Double secure knots',
  },
  {
    title: 'Bleached Knots / No Knot Visibility',
    note: 'Invisible roots / Lightened knots for scalp realism',
  },
  {
    title: 'Base Type',
    note: 'Swiss lace / PU / Hybrid / Mono / Lace front PU back',
  },
  {
    title: 'Base Colour / Scalp Tint',
    note: 'PU tone matched exactly to real scalp shade',
  },
  {
    title: 'Ventilation Technique',
    note: 'Flat / Semi-lift / Elevated, controls lift & volume',
  },
  {
    title: 'Baby Hair Addition',
    note: 'Short / Wispy / Slightly irregular to soften hairline edge',
  },
  {
    title: 'Clip-on / Stick-on Selection',
    note: 'Temporary / Semi-permanent / Lifestyle-fit for daily wear',
  },
  {
    title: 'Scalp Mold Accuracy',
    note: 'POP mold or digital for exact fit (not estimation)',
  },
  {
    title: 'Right Hairstyle',
    note: 'Based on face structure (quiff, pompadour, classic, messy)',
  },
  {
    title: 'Right Haircut',
    note: 'Layering, tapering, fade, texture blend into side/back',
  },
  {
    title: 'Frontal Transition Zone',
    note: 'Gradual / Jagged / Slightly uneven to mimic real hair',
  },
  {
    title: 'Grey Hair Percentage (if any)',
    note: 'Light / Scattered / Blended strands to mimic natural aging',
  },
  {
    title: 'Fade Compatibility',
    note: 'Side/back blending to match skin fade / temple fade',
  },
]

/* "Some Of Our Clients With The Most Natural Hairline"
 *
 * Six client films, presented with the same pinned horizontal scroll as
 * "Our Big Achievements". Every poster is a 1920×1080 before/after split —
 * before on the left, after on the right — so these must stay 16:9. Cropping
 * them to portrait would throw away the half of the frame that carries the
 * whole point of the section.
 *
 * The names and quotes below are the client's own, supplied 2026-08-08. They
 * replaced placeholders that had been written here, so nothing in this block
 * is invented any more — do not "improve" the wording. These are things real,
 * identifiable men said, and the value of a testimonial is that it is theirs.
 * The one thing still worth confirming before launch is that each man agreed
 * to appear here by name.
 *
 * Every supplied 16:9 film is matched to its client by name. Posters remain
 * visible until playback starts and continue to serve as each video's poster. */
export type ClientStory = {
  name: string
  quote: string
  poster: string
  src: string
  alt: string
}

export const clientStoriesTitle = [
  'Some Of Our Clients With',
  'The Most Natural Hairline',
] as const

export const clientStories: ClientStory[] = [
  {
    name: 'Rylan Rodrigues',
    quote: 'I felt that the hair looks very natural, and it feels really good.',
    poster: '/clients/client-story-1.png',
    src: '/clients/client-story-1.mp4',
    alt: 'Client before and after: thinning crown, then a full swept-back system.',
  },
  {
    name: 'Arun Sharma',
    quote: 'I travel a lot, so now people will not recognize me from my passport photo.',
    poster: '/clients/client-story-2.png',
    src: '/clients/client-story-2.mp4',
    alt: 'Client before and after: receded hairline, then a restored natural front.',
  },
  {
    name: 'Rohan Bera',
    quote: 'The hair patch was very comfortable. It gives a very natural look. I really liked it.',
    poster: '/clients/client-story-3.png',
    src: '/clients/client-story-3.mp4',
    alt: 'Client before and after: visible scalp, then dense matched hair.',
  },
  {
    name: 'Sahil Khan',
    quote: 'I really liked the entire process, from start to finish. I feel like a new person.',
    poster: '/clients/client-story-4.png',
    src: '/clients/client-story-4.mp4',
    alt: 'Client before and after: grey thinning front, then a full styled system.',
  },
  {
    name: 'Rohan Deshmukh',
    quote: 'It feels so good to touch my head again. This is amazing. I am very happy with it.',
    poster: '/clients/client-story-5.png',
    src: '/clients/client-story-5.mp4',
    alt: 'Client before and after: bare crown, then a textured natural finish.',
  },
  {
    name: 'Anup Kumar',
    quote: 'The hair system is amazing, and the facilities are amazing.',
    poster: '/clients/client-story-6.png',
    src: '/clients/client-story-6.mp4',
    alt: 'Client before and after: advanced hair loss, then a matched hairline.',
  },
]

/* "World's Finest Thinnest Hair Systems"
 *
 * Thirteen product films. Posters are 1056×1320 (4:5) and are shown whole —
 * these are studio shots of the product, so a crop that clips the hairline or
 * the base edge removes the thing being sold.
 *
 * `src` is empty until the client supplies the films; a card with no source
 * renders as a still figure, the same arrangement as the checklist and client
 * story films. */
export type HairSystem = {
  id: number
  image: string
  title: string
  src: string
}

export const systemsTitle = [
  "World's Finest Thinnest",
  'Hair Systems',
] as const

export const hairSystems: HairSystem[] = [
  { id: 1, image: '/systems/system-01.png', title: 'Styling a finished system', src: '' },
  { id: 2, image: '/systems/system-02.png', title: 'Lace base held in hand', src: '' },
  { id: 3, image: '/systems/system-03.png', title: 'Side profile on the block', src: '' },
  { id: 4, image: '/systems/system-04.png', title: 'Base edge in close detail', src: '' },
  { id: 5, image: '/systems/system-05.png', title: 'Swept-back dark system', src: '' },
  { id: 6, image: '/systems/system-06.png', title: 'Brown volume system', src: '' },
  { id: 7, image: '/systems/system-07.png', title: 'Black quiff system', src: '' },
  { id: 8, image: '/systems/system-08.png', title: 'Medium brown system', src: '' },
  { id: 9, image: '/systems/system-09.png', title: 'Black textured system', src: '' },
  { id: 10, image: '/systems/system-10.png', title: 'Soft brown system', src: '' },
  { id: 11, image: '/systems/system-11.png', title: 'Visible PU base band', src: '' },
  { id: 12, image: '/systems/system-12.png', title: 'Messy textured system', src: '' },
  { id: 13, image: '/systems/system-13.png', title: 'Short dark system', src: '' },
]

/* "This Might Sound Like Your Story"
 *
 * Five recognitions and then the offer. The order matters: it walks from the
 * feeling, through what the reader has already wasted money on, past the fear
 * of surgery, and only then names what they want — so the CTA lands as an
 * answer rather than a pitch. */
export type StoryPoint = { icon: StoryIcon; text: string }

export type StoryIcon = 'frown' | 'eye-off' | 'pill' | 'syringe' | 'shield'

export const storyTitle = [
  'This Might Sound Like',
  'Your Story',
] as const

export const storyPoints: StoryPoint[] = [
  {
    icon: 'frown',
    text: 'If you are tired of feeling self-conscious about your hair.',
  },
  { icon: 'eye-off', text: 'If you avoid photos, mirrors, or social events.' },
  {
    icon: 'pill',
    text: 'If you have tried oils, pills, & shampoos that never worked.',
  },
  {
    icon: 'syringe',
    text: 'If surgery feels too risky, complicated, or overwhelming.',
  },
  { icon: 'shield', text: 'If you want a natural-looking, pain-free solution.' },
]

export const storyCta = {
  title: 'If Yes, we’ll guide you',
  body: 'Need clarity? Our consultant will guide you step by step to find what truly works for you. Zero pressure. All clarity.',
  action: 'Get Guidance Now',
  href: '#book',
}

/* "Explore Our Trusted Range Of Hair Services"
 *
 * Only the first service's copy came with the design; the other two are
 * written to the brand's own candour rule (§3 of PROJECT-CONTEXT): the SMP
 * line says on a sales page that SMP does not regrow hair, because that is
 * what the brand's other pages already say. */
export type ServiceIcon = 'layers' | 'pen' | 'sprout'

export type Service = {
  title: string
  body: string
  icon: ServiceIcon
  image: string
  alt: string
  href: string
}

export const servicesTitle = [
  'Explore Our Trusted Range',
  'Of Hair Services',
] as const

export const services: Service[] = [
  {
    title: 'Non-Surgical Hair Replacement',
    body: 'Natural hair systems, no surgery with perfectly blended and built to restore confidence.',
    icon: 'layers',
    image: '/services/non-surgical-hair-replacement.png',
    alt: 'A hair system being fitted to a client’s crown.',
    href: '#solutions',
  },
  {
    title: 'Scalp Micro Pigmentation',
    body: 'Pigment placed strand by strand to read as real follicles. It is not a tattoo, and it does not regrow hair — it restores the look of density.',
    icon: 'pen',
    image: '/services/scalp-micro-pigmentation.png',
    alt: 'Scalp micro pigmentation being applied along a hairline.',
    href: '#solutions',
  },
  {
    title: 'Hair Transplant',
    body: 'A front hairline transplant paired with a hair system, for men whose own density can carry the front but not the crown.',
    icon: 'sprout',
    image: '/services/hair-transplant.png',
    alt: 'A transplanted front hairline shortly after the procedure.',
    href: '#solutions',
  },
]

export const servicesAction = 'Explore Now'

/* "The Step-By-Step Process To Natural Hair" — copy and supplied 4:3 film. */
export type ProcessStep = { label: string; title: string; body: string }

export const processTitle = [
  'The Step-By-Step Process',
  'To Natural Hair',
] as const

export const processSteps: ProcessStep[] = [
  {
    label: 'Step 1',
    title: 'Consultation',
    body: 'Meet our expert to discuss your hair goals.',
  },
  {
    label: 'Step 2',
    title: 'Customization',
    body: 'Get a solution tailored exactly for you.',
  },
  {
    label: 'Step 3',
    title: 'Transformation',
    body: 'See your new look come alive instantly.',
  },
]

export const processVideo = {
  poster: '/process/steps.png',
  src: '/process/step-by-step.mp4',
  alt: 'A client’s template, hairline mapping and fitting shown beside his finished look.',
  label: 'Watch the process',
}

export const processAction = 'Discuss With A Consultant'

/* "Real Hair Or Illusion? Watch & Decide" with supplied 16:9 film. */
export const decideTitle = ['Real Hair Or Illusion?', 'Watch & Decide'] as const

export const decideVideo = {
  poster: '/decide/from-bald-to-bold.png',
  src: '/decide/client-before-after.mp4',
  alt: 'Before-and-after transformation of a client, from bald to bold, with the hairline marked on both portraits.',
  label: 'Watch and decide',
}

export const decideNote =
  'Same man, same camera, same light. The only thing that changed is the hairline.'

/* "Our Trusted Methods For A Natural Look".
 *
 * The two methods the client's artwork shows. Zycon™ is a third method the
 * brand sells and would slot straight in here; it was left out because the
 * artwork does not show it. */
export type Method = {
  icon: 'sticker' | 'clips'
  title: string
  body: string
  href: string
  /* Both photographs are the same 1632:2133 / 1088:1422 shape, which is the
     panel's own aspect ratio, so neither is cropped to fit. Keep that in mind
     when a third method arrives. */
  image: string
  alt: string
}

export const methodsTitle = ['Our Trusted Methods For', 'A Natural Look'] as const

export const methods: Method[] = [
  {
    icon: 'sticker',
    title: 'Stick-On Hair Systems',
    body: 'No clips, no hassle, just stick, style, and go. Perfect for a natural look all day — the base bonds to the scalp, so nothing moves when you do.',
    href: '#solutions',
    /* Still shared with the Services section. A photograph of its own would be
       better whenever the client has one — see §7. */
    image: '/services/non-surgical-hair-replacement.png',
    alt: 'A hair system base being lifted from a client’s scalp during a fitting.',
  },
  {
    icon: 'clips',
    title: 'Clip-On Hair Systems',
    body: 'Clipped to your own hair rather than bonded, so there is no adhesive and nothing to shave. Take it off whenever you want to; put it back in minutes.',
    href: '#solutions',
    image: '/methods/clip-on.png',
    alt: 'The underside of a clip-on system, its metal clip visible, being lifted away from a client’s own hair.',
  },
]

export const methodsAction = 'Explore Now'

/* "Fill This Form To Get The Right Guidance".
 *
 * ⚠ The form has no backend. `Form.tsx` validates and shows a success state,
 * but nothing is sent anywhere. Wire it before launch. See §7 of
 * PROJECT-CONTEXT. */
export const formTitle = ['Fill This Form To Get The', 'Right Guidance'] as const

export const formCities = ['Mumbai', 'Delhi', 'Bangalore', 'Somewhere else']

export const formAction = 'Submit'

export const formDone = {
  title: 'Thank you — we have your details.',
  body: 'A consultant will call you to arrange your session. Nothing is booked until you say so.',
}

/* "Backed By Thousands Of Confident Men".
 *
 * Both figures are §3 proof numbers, not new claims: 4.9 on Google across 300+
 * reviews, and 50K+ on YouTube. The icons are the client's own PNGs. */
export const backedTitle = 'Backed By Thousands Of Confident Men'

/* `value` is what a screen reader is given and what ships if the count-up
 * never runs; `count`, `decimals` and `suffix` are only how the same figure is
 * animated on screen. Keep the two in step. */
export const backedProof = [
  {
    icon: '/backed/google.png',
    alt: 'Google',
    value: '4.9',
    count: 4.9,
    decimals: 1,
    label: 'Google Rating',
    note: '300+ reviews',
    stars: 4.5,
  },
  {
    icon: '/backed/youtube.png',
    alt: 'YouTube',
    value: '50K+',
    count: 50,
    suffix: 'K+',
    unit: 'Subscribers',
    label: 'on YouTube',
    note: 'Growing community',
  },
]

export const backedFoot = 'Join our community of satisfied customers'

/* The footer.
 *
 * `footerMarquee` is the looping line under the giant wordmark. The reference
 * repeats one phrase; these are the five the client asked for — the proof
 * claim plus the four pillars, so the loop echoes the pillars section rather
 * than introducing wording of its own. */
export const footerWordmark = 'American Hairline'

export const footerBlurb =
  'Regain your confidence with India’s most natural-looking, non-surgical hair replacement solutions. Designed for those who value aesthetics, privacy, and premium results.'

export const footerMarquee = [
  '100% natural-looking',
  'India’s #1 Top Experts',
  'Tailored with Technology',
  'Celebrity-Trusted',
  'Genuine Advice',
]

export type FooterLink = { label: string; href: string }

export const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'About us', href: '#/about-us' },
      { label: 'Consult with Founder', href: '#/consult-with-founder' },
      { label: 'Customer Support', href: '#support' },
      { label: 'Terms of Services', href: '#terms' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Disclaimer Policy', href: '#disclaimer' },
      { label: 'Blog', href: '#blog' },
    ],
  },
  {
    title: 'Solution',
    links: [
      { label: 'Non-Surgical Hair Replacement', href: '#/stick-on-or-clip-on' },
      { label: 'Scalp Micro Pigmentation', href: '#/smp' },
      { label: 'Hair Transplant', href: '#/hair-transplant' },
    ],
  },
]

export type SocialIcon = 'facebook' | 'instagram' | 'x' | 'youtube'

/* Placeholders: the brand's real handles have not been supplied. See §7 of
 * PROJECT-CONTEXT. */
export const footerSocials: { icon: SocialIcon; label: string; href: string }[] = [
  { icon: 'facebook', label: 'Facebook', href: '#' },
  { icon: 'instagram', label: 'Instagram', href: '#' },
  { icon: 'x', label: 'X', href: '#' },
  { icon: 'youtube', label: 'YouTube', href: '#' },
]

export const footerContact = {
  title: 'Contact Us',
  phone: '9222666111',
  email: 'info@americanhairline.com',
}

export const footerLegal = 'American Hairline © 2026 – All Rights Reserved.'

/* "Walk Into Any Of Our Premium Salons".
 *
 * Addresses are the client's, verbatim.
 *
 * Each branch uses the supplied American Hairline photography. Multiple images
 * per city power the in-card carousel used on Homepage and About Us. */
export type Salon = {
  city: string
  address: string
  images: string[]
  alt: string
  href: string
}

export const salonsTitle = ['Walk Into Any Of', 'Our Premium Salons'] as const

export const salons: Salon[] = [
  {
    city: 'Mumbai',
    address:
      '4th floor Empressa Building, 2nd Rd, Khar, Ram Krishna Nagar, Khar West, Mumbai, Maharashtra 400052.',
    images: [
      '/salons/mumbai/salon-1.png',
      '/salons/mumbai/salon-2.png',
      '/salons/mumbai/salon-3.png',
    ],
    alt: 'Inside the American Hairline Mumbai salon.',
    href: 'https://maps.google.com/?q=Empressa+Building+2nd+Rd+Khar+West+Mumbai+400052',
  },
  {
    city: 'Delhi',
    address:
      'Plot No. 2, 2nd Floor, Main Road, Hudson Lane, GTB Nagar, Delhi - 110009.',
    images: ['/salons/delhi/salon-1.jpg', '/salons/delhi/salon-2.jpg'],
    alt: 'Inside the American Hairline Delhi salon.',
    href: 'https://maps.google.com/?q=Plot+No+2+Hudson+Lane+GTB+Nagar+Delhi+110009',
  },
  {
    city: 'Bangalore',
    address:
      'Golden hive Luxury Unisex salon, 484, 2nd Floor, Signature Square, Circle, Chinmaya mission Hospital Rd, Indira Nagar 1st stage, Bengaluru, Karnataka - 560038',
    images: ['/salons/bangalore/salon-1.png', '/salons/bangalore/salon-2.png'],
    alt: 'Inside the American Hairline Bangalore salon.',
    href: 'https://maps.google.com/?q=Golden+Hive+Luxury+Unisex+Salon+484+2nd+Floor+Signature+Square+Circle+Chinmaya+Mission+Hospital+Rd+Indira+Nagar+1st+Stage+Bengaluru+Karnataka+560038',
  },
]

export const salonsAction = 'Get Direction'

export const salonsOutro = {
  copy: 'Three studios, one standard. Come in, see the systems, and decide with your own eyes.',
  action: 'Discuss With A Consultant',
  href: '#consult',
}

/* "Frequently Asked Questions" — two tabbed sets.
 *
 * The questions are the client's, verbatim from the artwork, with one
 * correction: "How long does hair replacement systems last?" did not agree, so
 * it reads "How long does a hair replacement system last?".
 *
 * Only the first answer in each tab came with the artwork; the rest are
 * written to the brand's candour rule (§3 of PROJECT-CONTEXT). Two of them
 * deliberately give no number, because the numbers are still unresolved: the
 * servicing interval is stated three ways across the client's own pages, and
 * so is base durability. Those answers say what decides the figure and leave
 * the figure to the consultant rather than shipping one of three. */
export type FaqItem = { q: string; a: string; question?: string; answer?: string; hidden?: boolean }
export type FaqGroup = { id: string; label: string; items: FaqItem[] }

export const faqTitle = 'Frequently Asked Questions'

export const faqRating = { score: '4.9', label: '300+ Google reviews' }

export const faqGroups: FaqGroup[] = [
  {
    id: 'consultation',
    label: 'Consultation',
    items: [
      {
        q: 'How long does the consultation take?',
        a: 'Usually 30 to 45 minutes. We take time to understand you and answer all your questions properly.',
      },
      {
        q: 'What happens in the consultation?',
        answer: 'We assess your hair loss condition, discuss your lifestyle needs, and recommend the best hair system options for you.',
        a: 'We look at your stage of hair loss, run the Advanced 3D Scan, and talk through your routine — your work, your travel, how much upkeep you actually want. Then we show you what suits you, and what does not.',
      },
      {
        q: 'Is it an in-person or online consultation?',
        answer: 'We offer both! You can visit our clinic for a physical assessment or book a video call for a virtual consultation.',
        a: 'Either. In person at our Mumbai, Delhi or Bangalore studios, or online if you are travelling or based abroad. The scan and the samples are the parts worth coming in for, so we will tell you honestly if a visit would serve you better.',
      },
      {
        q: 'Will I get to see real samples or demos?',
        answer: 'Yes, during an in-person consultation, you can see and feel the hair systems. For online consultations, we show high-quality videos and close-ups.',
        a: 'Yes. You can hold the bases and the hair, see the density and the hairline up close, and try a system on so you are deciding from something real rather than a photograph.',
      },
      {
        q: 'Will I be pressured to buy during the consultation?',
        answer: 'Absolutely not. Our goal is to educate you so you can make an informed decision when you are ready.',
        a: 'No. There is no upselling and nothing is decided on the day. If a hair system is not the right answer for you, we will say so — we have turned people away before.',
      },
      {
        q: 'Will I know the total cost after the consultation?',
        answer: 'Yes, we provide a transparent cost breakdown including the hair system, fitting, and maintenance.',
        a: 'Yes. You leave knowing the price of the system you chose and what its servicing costs, in writing. No hidden charges appear later.',
      },
    ],
  },
  {
    id: 'hair-system',
    label: 'Hair System',
    items: [
      {
        q: 'Will it look fake?',
        question: 'How long does a hair system last?',
        answer: 'Depending on the base type and care, a hair system typically lasts between 3 to 6 months.',
        a: 'No, it looks just like your real hair — even stylists cannot tell. The giveaway is always the front, which is why the hairline is custom-designed to your face and goes through the 21-point check before it reaches you.',
      },
      {
        q: 'Will it damage my hair?',
        question: 'Can I swim and shower with it?',
        answer: 'Yes! Our hair systems are securely bonded, allowing you to swim, shower, and exercise without worry.',
        a: 'No. The system sits on the area where hair has already gone, and your remaining hair keeps its own growth cycle. Damage comes from a badly fitted patch pulling on live hair, which is what a custom-designed system is built to avoid.',
      },
      {
        q: 'Will people notice?',
        question: 'Does it look natural?',
        answer: 'Our systems are designed to be undetectable, with a natural hairline and density that matches your existing hair.',
        a: 'Not if the hairline is right. That is the whole job: a natural front edge, density that matches your age and face, and a base thin enough to disappear against the scalp up close.',
      },
      {
        q: 'Will I need to shave my head?',
        question: 'How often do I need maintenance?',
        answer: 'We recommend a maintenance session every 3-4 weeks for cleaning and re-bonding.',
        a: 'Only for a stick-on system, and only the area it attaches to. A clip-on needs no shaving at all and comes off whenever you want it to.',
      },
      {
        q: 'How long does a hair replacement system last?',
        question: 'Can I style it like my own hair?',
        answer: 'Yes, you can cut, style, and use products just like you would with your natural hair.',
        a: 'It depends on the base you choose — a thinner base looks more invisible and wears faster, a thicker one lasts longer. Your consultant will give you the life expectancy of the exact base you pick, along with the servicing it needs to reach it.',
      },
      {
        q: 'Are your hair systems itchy to the scalp?',
        question: 'Is it comfortable to wear?',
        answer: 'Modern hair systems are lightweight and breathable, ensuring comfort even during extended wear.',
        a: 'They should not be. The bases are breathable and the adhesives are skin-safe. Persistent itching almost always means servicing is overdue rather than that the system does not suit you — tell us and we will look at it.',
      },
    ],
  },
]

export const faqCta = {
  title: 'Still have questions?',
  body: 'No worries, we are here to guide you. Talk to us, we will explain everything.',
  action: 'Need Guidance',
  href: '#consult',
}

export const clipOnFaqGroup: FaqGroup = {
  id: 'clip-on',
  label: 'Clip-On Hair System',
  items: [
    { q: 'What is Zycon range?', a: 'The Zycon range is a clip-on hair system that supports scalp health by using antibacterial protection and controlling odor. It is designed to help you stay comfortable, confident, and unrestricted in your active lifestyle.' },
    { q: 'Will my partner notice?', a: 'No, the system is designed to be undetectable, even up close. The materials used mimic the natural scalp and hair growth patterns.' },
    { q: 'Can I swim?', a: 'Yes, you can swim with our secure clip-on systems. We recommend using a swimming cap for extra security during vigorous activities.' },
    { q: 'What if I have little hair left?', a: 'We have solutions tailored for various stages of hair loss. The clip-on system can be adapted to work with your existing hair.' },
    { q: 'Does it feel hot or heavy?', a: 'No, the base is breathable and lightweight for maximum comfort, even in warm climates.' },
    { q: 'Will it fall off?', a: 'The clips are medical-grade and secure, ensuring it stays in place throughout your daily activities.' },
    { q: 'Is it visible?', a: 'The hairline is ultra-natural and blends seamlessly with your existing hair, making it virtually invisible.' },
    { q: 'Will it damage scalp?', a: 'No, the Zycon range is antibacterial and safe for your scalp. It promotes hygiene and prevents irritation.' },
    { q: 'Can I wear in gym?', a: 'Absolutely, it is designed for active lifestyles including gym sessions. It handles sweat and movement well.' },
    { q: 'Can I remove it?', a: 'Yes, the clip-on system allows for easy daily removal, giving you full control and flexibility.' },
    { q: 'What about sweat & odor?', a: 'The antibacterial base helps control odor and manages sweat effectively, keeping you fresh all day.' },
  ],
}

/* "Uses Advanced 3D Scan Technology".
 *
 * The headline is split around the picture: it sits inline between "Uses
 * Advanced" and "3D", and scroll grows it from that slot to full bleed.
 *
 * The image is the one already installed for the Big Achievements card — the
 * same file, so it is referenced rather than copied a second time. */
export const scanTitle = {
  before: 'Uses Advanced',
  after: '3D',
  second: 'Scan Technology',
} as const

export const scanImage = {
  src: '/achievements/advanced-3d-scan.png',
  alt: 'A client’s scalp being measured with the Advanced 3D Scan, the density map building on the laptop beside him.',
}

/* "Before And After, In Their Own Words" — the fanned testimonial deck.
 *
 * The five cards are finished artwork: the before/after portraits, the name
 * chip and the quote are all baked into each PNG. Nothing here is drawn over
 * them, so the words that only exist inside the picture have to be carried by
 * `alt` — that is the only route a screen reader has to them. Quotes below are
 * transcribed from the artwork exactly. */
export type DeckCard = { name: string; quote: string; image: string }

export const deckTitle = ['Before And After,', 'In Their Own Words'] as const

export const deckCards: DeckCard[] = [
  {
    name: 'Sameer Warma',
    quote:
      'I was amazed at how comfortable and natural the system feels. It’s exactly what I needed.',
    image: '/social/sameer-warma.png',
  },
  {
    name: 'Daljit Singh',
    quote:
      'From consultation to final result, the team at American Hairline was incredible. I love my new look!',
    image: '/social/daljit-singh.png',
  },
  {
    name: 'Advik Sharma',
    quote:
      'The hair system fits perfectly and looks completely natural. I feel so confident every day!',
    image: '/social/advik-sharma.png',
  },
  {
    name: 'Fuzail Khan',
    quote:
      'It blends seamlessly with my natural hair. I feel like myself again, but better!',
    image: '/social/fuzail-khan.png',
  },
  {
    name: 'Chandan Singh',
    quote:
      'The hair system feels like my own hair. It’s comfortable, natural, and gives me the perfect look.',
    image: '/social/chandan-singh.png',
  },
]

/* "Why Thousands Of Men Choose American Hairline" — the four pillars, copy
 * exactly as supplied in the client's artwork. `**` marks the words the
 * artwork sets in bold; `Pillars.tsx` is what turns them into <strong>. */
export type PillarIcon = 'medal' | 'cpu' | 'sparkles' | 'shield'

export type Pillar = { icon: PillarIcon; title: string; body: string }

export const pillarsTitle = [
  'Why Thousands Of Men',
  'Choose American Hairline',
] as const

export const pillars: Pillar[] = [
  {
    icon: 'medal',
    title: 'India’s #1 Top Experts',
    body: 'Trusted by thousands and featured in national media, we specialize in **non-surgical hair systems** tailored to Indian men — blending perfectly with your face shape, hair texture, and lifestyle. Our systems use **100% human hair** and are **ISO certified** for safety and quality.',
  },
  {
    icon: 'cpu',
    title: 'Tailored with Technology',
    body: 'From **Invisible Hairline Sculpting™** to **Nano Fusion Technology**, every system is crafted with advanced design and precision engineering for a seamless, natural look. Our **Single-strand Implantation** technique customizes your hairline with unmatched detail.',
  },
  {
    icon: 'sparkles',
    title: 'Celebrity-Trusted',
    body: 'Our systems are trusted by **Bollywood actors** and public figures, designed for high-definition cameras — yet discreet in daily life. Lightweight, breathable, and **virtually invisible** even up close. **USA-manufactured** and **doctor approved**.',
  },
  {
    icon: 'shield',
    title: 'Genuine Advice',
    body: 'No pressure, no upselling. Just expert advice from professionals who care. We guide you to the right solution, with **durability, comfort**, and **natural results** as our priority. We specialize in **ultra-natural looking hairlines** that restore confidence and look truly undetectable.',
  },
]

/* "Why Men Around The World Choose Us" */
export type KeyFactSlot = 'left' | 'middle-top' | 'middle-bottom' | 'right'

export type KeyFact = {
  value: string
  label: string
  slot: KeyFactSlot
  image?: string
}

export const keyFactsTitle = ['Why Men Around The', 'World Choose Us'] as const

export const keyFacts: KeyFact[] = [
  {
    value: '12+ Years',
    label: 'Experience',
    slot: 'left',
    image: '/key-facts/12-years-experience.png',
  },
  {
    value: '6,770+',
    label: 'Men Helped',
    slot: 'middle-top',
    image: '/key-facts/6770-men-helped.png',
  },
  {
    value: '100%',
    label: 'Natural Looking',
    slot: 'middle-bottom',
    image: '/key-facts/100-natural-looking.png',
  },
  {
    /* Was "12+ Nations / Client Base", which readers reported not
       understanding. Two things were wrong with it: "client base" is trade
       language for a group of customers, sitting in a slot where every sibling
       card is plain ("Experience", "Men Helped", "Natural Looking"), and
       "nations" is the formal word where "countries" is the everyday one. The
       number is unchanged — this is the same §3 proof point, said plainly.

       Chosen from four measured options. At 96px it is the shortest label of
       the four cards, so this one carries the most air; it holds one line at
       every width. Noted at the time and accepted: "served" can be read as "we
       operate in those countries", which is wider than the claim the brand
       makes elsewhere. */
    value: '12+ Countries',
    label: 'Clients Served',
    slot: 'right',
    image: '/key-facts/12-nations.png',
  },
]

/* ==========================================================================
   "Stick-On or Clip-On" — the second page of the site.
   ========================================================================== */

/* Hero of the Stick-On or Clip-On page. Copy is the client's, from the page
 * artwork. `**` marks the words it sets in bold, the same convention the
 * pillars use; `ChoiceHero` splits on it.
 *
 * The artwork carries an "Our Methods" eyebrow pill above the heading. It is
 * not used, for the same reason the Pillars and Backed sections dropped
 * theirs: §3's visual system removed eyebrow tags site-wide in favour of one
 * heading per section, and the brief for this page was "same theme as the
 * homepage". One line to restore if the client wants it. */
export const choiceHeroEyebrow = {
  icon: '🧩',
  label: 'Our Methods',
} as const

export const choiceHeroTitle = [
  'Stick-On or Clip-On:',
  'Which One Fits Your Lifestyle?',
] as const

export const choiceHeroLede =
  'The right hair system should not only look good. It should also suit your lifestyle, **feel comfortable**, and make you **feel confident**.'

export const choiceHeroMedia = {
  src: '/choice/svc.png',
  alt: 'Comparison of Stick-On Hair System with adhesive fitting on the left, and Clip-On Hair System with secure clips on the right.',
}

/* ========================================================================== 
   "Hair Patch vs Hair System" — page 3 hero.
   ========================================================================== */

export const patchSystemHeroEyebrow = 'Myth Busted'

export const patchSystemHeroTitle =
  'Hair Patch vs Hair System: What’s the Difference?'

export const patchSystemHeroLede =
  'Most people think **wigs, patches,** and **hair systems** are the same but they’re not. Knowing the **difference** can change how **natural** you look and how confident you feel.'

export const patchSystemHeroMedia = {
  poster: '/patch-vs-system/thumbnail.png',
  src: '/patch-vs-system/patch-vs-system.mp4',
  label: 'Watch Hair Patch vs Hair System',
  alt: 'A side-by-side comparison of a man wearing a basic hair patch and a man wearing a styled hair system.',
} as const

export type PatchSystemComparisonRow = {
  feature: string
  patch: string
  system: string
}

export const patchSystemComparisonTitle = 'Hair Patch Vs. Hair System'

export const patchSystemComparisonRows: PatchSystemComparisonRow[] = [
  { feature: 'Sizing', patch: 'Limited sizes', system: 'Custom fit' },
  { feature: 'Hairline', patch: 'Fake looking', system: 'Natural, seamless' },
  { feature: 'Look & Feel', patch: 'Artificial / dense', system: 'Looks real, soft' },
  { feature: 'Lifestyle Fit', patch: 'Weak hold', system: 'Active lifestyle ready' },
  { feature: 'Comfort', patch: 'Medium comfort', system: 'Light & breathable' },
  { feature: 'Styles', patch: 'Standard designs', system: 'Fully customized' },
  { feature: 'Design Process', patch: 'Glue & wear', system: 'Consult & custom design' },
  { feature: 'Realism', patch: 'Looks artificial', system: 'Real & undetectable' },
]

export type SimplestWayItem = {
  kind: 'readymade' | 'tailored'
  title: string
  body: string
  icon: string
}

export const simplestWayEyebrow = 'Still confused?'

export const simplestWayTitle = 'The Simplest Way to Understand It:'

export const simplestWayItems: SimplestWayItem[] = [
  {
    kind: 'readymade',
    title: 'Hair Patch',
    body: 'Like buying readymade clothes',
    icon: '/patch-vs-system/shirt-icon.png',
  },
  {
    kind: 'tailored',
    title: 'Hair System',
    body: 'Like a suit tailored by a designer',
    icon: '/patch-vs-system/suit-icon.png',
  },
]

export const simplestWayStatement = {
  lead: 'One is general patch.',
  emphasis: 'The other one is made for you.',
} as const

export const simplestWayAction = {
  label: 'Talk To An Expert',
  href: 'tel:9222666111',
} as const

/* "Which Option Feels More Like You?"
 *
 * Interactive toggle section placed below Hero on Stick-On or Clip-On page.
 * Styled with the dark stage theme matching the homepage FAQ section.
 */
export type OptionChoiceKey = 'stick-on' | 'clip-on'

export type OptionCriterion = {
  prefix?: string
  bold: string
  suffix?: string
}

export type OptionChoice = {
  id: OptionChoiceKey
  label: string
  intro: string
  criteria: OptionCriterion[]
  cta: string
  href: string
}

export const whichOptionTitle = 'Which Option Feels More Like You?'

export const whichOptionChoices: Record<OptionChoiceKey, OptionChoice> = {
  'stick-on': {
    id: 'stick-on',
    label: 'Stick-On',
    intro: 'Is perfect if you:',
    criteria: [
      { bold: 'Enjoy all-day wear', suffix: 'without taking it off.' },
      { bold: 'Prefer monthly care', suffix: 'for best results.' },
      { prefix: 'Love a natural,', bold: 'secure hairline look.' },
      { prefix: 'Want the ease of', bold: 'no daily removal.' },
      { prefix: 'Like a snug and', bold: 'seamless fit', suffix: 'every day.' },
      { bold: 'Wake up ready to go,', suffix: 'no styling needed.' },
      { prefix: 'Value', bold: 'steady confidence', suffix: 'with no shifting.' },
      { prefix: 'Prefer', bold: 'long-term commitment.' },
    ],
    cta: 'Explore Stick-On System',
    href: '#/stick-on-or-clip-on#stick-on',
  },
  'clip-on': {
    id: 'clip-on',
    label: 'Clip-On',
    intro: 'Is perfect if you:',
    criteria: [
      { prefix: 'Want to keep your', bold: 'natural hair', suffix: 'unshaved.' },
      { bold: 'Hope for regrowth', suffix: 'while in treatment.' },
      { prefix: 'Like', bold: 'easy wear', suffix: 'and removal by yourself.' },
      { bold: 'Prefer removing', suffix: 'before sleep or shower.' },
      { prefix: 'Need a', bold: 'quick fix', suffix: 'for short-term use.' },
      { bold: 'Enjoy freedom', suffix: 'to wear anytime.' },
      { prefix: 'Travel often and', bold: 'want portability.' },
      { prefix: 'Prefer a', bold: 'no-glue, scalp-friendly', suffix: 'option.' },
    ],
    cta: 'Explore Clip-On System',
    href: '#/stick-on-or-clip-on#clip-on',
  },
}

/* "Clip-On Vs. Stick-On Hair Systems" Comparison
 *
 * Clean comparison table placed above "Two Easy Methods".
 */
export type ComparisonRow = {
  feature: string
  stickOn: {
    primary: string
    sub?: string
  }
  clipOn: {
    primary: string
    sub?: string
  }
}

export const comparisonTitle = [
  'Clip-On Vs. Stick-On',
  'Hair Systems',
] as const

export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Daily Wear',
    stickOn: {
      primary: 'No',
      sub: '(continuously wear)',
    },
    clipOn: {
      primary: 'Yes',
      sub: '(daily removal)',
    },
  },
  {
    feature: 'Monthly Servicing',
    stickOn: {
      primary: 'Required',
    },
    clipOn: {
      primary: 'Not required',
    },
  },
  {
    feature: 'Shaving Needed',
    stickOn: {
      primary: 'Yes',
    },
    clipOn: {
      primary: 'No',
    },
  },
  {
    feature: 'Active Lifestyle',
    stickOn: {
      primary: 'Perfect fit',
    },
    clipOn: {
      primary: 'Not recommended',
    },
  },
  {
    feature: 'Application Type',
    stickOn: {
      primary: 'Needs professional',
    },
    clipOn: {
      primary: 'Easy to wear yourself',
    },
  },
]

/* "Two Easy Methods To Get Your Hair Back"
 *
 * Two cards — Stick-On and Clip-On — each with a branded badge, one-line
 * description, a "Know more" link, and a full-height client photograph.
 * The images scroll-scale from compact to expanded as the reference video
 * demonstrates.
 */
export type TwoMethodCard = {
  id: string
  badge: string
  badgeIcon: 'puzzle' | 'clip'
  description: string
  cta: string
  href: string
  image: string
  /* The real pixel size of the file. The component previously hardcoded
     600x700 for both, which matches neither, so the aspect-ratio hint the
     browser reserves before load was wrong for each. */
  width: number
  height: number
  alt: string
}

export const twoMethodsTitle = 'Two Easy Methods To Get Your Hair Back'

export const twoMethodsCards: TwoMethodCard[] = [
  {
    id: 'stick-on',
    badge: 'Stick-on Hair System',
    badgeIcon: 'puzzle',
    description:
      'Natural look with a secure fit you can trust. Swim, shower, workout, and live freely.',
    cta: 'Know more',
    href: '#/stick-on-or-clip-on#stick-on',
    image: '/two-methods/stick-on.png',
    width: 1388,
    height: 1160,
    alt: 'Man wearing a Stick-On Hair System — natural-looking, securely bonded hair replacement.',
  },
  {
    id: 'clip-on',
    badge: 'Clip-on Hair System',
    badgeIcon: 'clip',
    description:
      'No shaving, no glue, just clip, wear, and go. Perfect for easy volume without commitment.',
    cta: 'Know more',
    href: '#/stick-on-or-clip-on#clip-on',
    image: '/two-methods/clip-on.png',
    width: 1088,
    height: 1244,
    alt: 'Man wearing a Clip-On Hair System — clip-in, no-glue hair replacement for easy daily use.',
  },
]

/* "Real Results That Showcase True Transformations"
 *
 * 8 client transformations with before/after artwork, name badges,
 * testimonials, and alternating Stick-On vs Clip-On CTAs.
 */
export type TransformationClient = {
  id: string
  name: string
  testimonial: string
  cta: 'Stick-On Hair System' | 'Clip-On Hair System'
  href: string
  /* The supplied artwork is 1921x1080 PNG at about 2 MB each — 16 MB for the
     eight. These are the converted 1920px and 1200px JPEGs, 1.86 MB for all
     sixteen. The PNGs are still in `public/transformations/` beside them, so
     the conversion is reversible. */
  image: string
  small: string
}

export const transformationsTitle = [
  'Real Results That Showcase',
  'True Transformations',
]

export const transformationsClients: TransformationClient[] = [
  {
    id: 'chandan',
    name: 'CHANDAN SINGH',
    testimonial: '“I didn’t expect it to look this real. It blends perfectly with my natural hair.”',
    cta: 'Stick-On Hair System',
    href: '#/stick-on-or-clip-on#stick-on',
    image: '/transformations/chandan.jpg',
    small: '/transformations/chandan-small.jpg',
  },
  {
    id: 'rahil',
    name: 'Rahil KHAN',
    testimonial: '“The transformation is amazing. It feels light, comfortable, and completely natural.”',
    cta: 'Clip-On Hair System',
    href: '#/stick-on-or-clip-on#clip-on',
    image: '/transformations/rahil.jpg',
    small: '/transformations/rahil-small.jpg',
  },
  {
    id: 'azhar',
    name: 'Azhar SHAIKH',
    testimonial: '“No one could tell I’ve done anything. That’s how seamless it looks.”',
    cta: 'Stick-On Hair System',
    href: '#/stick-on-or-clip-on#stick-on',
    image: '/transformations/azhar.jpg',
    small: '/transformations/azhar-small.jpg',
  },
  {
    id: 'rylan',
    name: 'Rylan Rodrigues',
    testimonial: '“The volume looks so natural, not overdone at all. Exactly what I wanted.”',
    cta: 'Clip-On Hair System',
    href: '#/stick-on-or-clip-on#clip-on',
    image: '/transformations/rylan.jpg',
    small: '/transformations/rylan-small.jpg',
  },
  {
    id: 'daljit',
    name: 'DALJIT SINGH',
    testimonial: '“The finish is so smooth and natural. I’m really happy with the result.”',
    cta: 'Stick-On Hair System',
    href: '#/stick-on-or-clip-on#stick-on',
    image: '/transformations/daljit.jpg',
    small: '/transformations/daljit-small.jpg',
  },
  {
    id: 'advik',
    name: 'advik sharma',
    testimonial: '“My hair finally looks fuller without looking fake. That’s the best part.”',
    cta: 'Clip-On Hair System',
    href: '#/stick-on-or-clip-on#clip-on',
    image: '/transformations/advik.jpg',
    small: '/transformations/advik-small.jpg',
  },
  {
    id: 'saurabh',
    name: 'Saurabh Mishra',
    testimonial: '“Exactly the kind of natural look I was hoping for. Loved the result.”',
    cta: 'Stick-On Hair System',
    href: '#/stick-on-or-clip-on#stick-on',
    image: '/transformations/saurabh.jpg',
    small: '/transformations/saurabh-small.jpg',
  },
  {
    id: 'sahil',
    name: 'SAHIL KHAN',
    testimonial: '“It feels so light and looks completely natural. I’m very satisfied.”',
    cta: 'Clip-On Hair System',
    href: '#/stick-on-or-clip-on#clip-on',
    image: '/transformations/sahil.jpg',
    small: '/transformations/sahil-small.jpg',
  },
]

/* "Still Confused? Not Sure What Best For You?"
 *
 * Section placed right above the footer on the Stick-On or Clip-On page.
 * Dark interactive stage featuring a central capsule silhouette and
 * word-by-word scroll-driven text illumination matching the reference video.
 */
export const stillConfusedData = {
  eyebrow: 'Still Confused?',
  headlineLines: [
    'Not Sure What Best For You?',
    'Let’s Find The Perfect Fit',
  ],
  subtext: 'Get in touch with our expert. We’re here to provide the guidance you need.',
  cta: 'Speak To An Expert',
  href: '#consult',
}


/* "Book Your 1:1 Consultation Online Or In Person"
 *
 * Closing booking block on the Hair Patch vs Hair System page, below the
 * "Simplest Way" analogy. Rendered as a frosted-glass panel over an ambient
 * colour field, with the headline lit word by word on scroll — the same
 * illumination idiom as `stillConfusedData` on the Stick-On or Clip-On page,
 * inverted for a light surface.
 *
 * `icon` is a key, not a component, so this file stays free of imports; the
 * component maps it to a lucide icon. The three proof points restate numbers
 * that already appear in `keyFacts` — keep them in step if those change.
 */
export type BookPoint = {
  icon: 'cities' | 'countries' | 'confidential'
  title: string
  note: string
}

export const bookConsultationData = {
  eyebrow: 'Get Started',
  headlineLines: ['Book Your 1:1 Consultation', 'Online Or In Person'],
  points: [
    {
      icon: 'cities',
      title: 'Mumbai | Delhi | Bangalore',
      note: 'Pick your city or choose online video consultation',
    },
    {
      icon: 'countries',
      title: '12+ Countries Served',
      note: 'Trusted by 6,700+ clients globally',
    },
    {
      icon: 'confidential',
      title: '100% Confidential',
      note: 'Honest advice from experts',
    },
  ] as BookPoint[],
  cta: 'Book Your Consultation Now',
  ctaNote: 'Only takes 1 minute',
  /* The same number `simplestWayAction` dials. This page has no form on it, so
     a real `tel:` link is worth more than another anchor that goes nowhere. */
  href: 'tel:9222666111',
} as const

/* "Benefits of a Natural Looking Hair System"
 *
 * A single teaser card on the Hair Patch vs Hair System page that expands into
 * a full sheet, in the manner of Apple's "Get to know Mac" rail: the card grows
 * in place, the page behind it blurs, and a close button collapses it back.
 *
 * `titleTail` is split out of the headline because the overlay sets it in the
 * brand blue while the rest stays ink — one string with markup in it would put
 * presentation into the content file.
 *
 * **Both photographs are transparent cut-outs that already carry their own
 * annotation.** `card.png` includes the dashed hairline ellipse, the arrow, and
 * the circular scalp inset with its white ring, all baked in — so the component
 * must not draw its own. It did, before these arrived; the CSS ring, the SVG
 * arrow, and the separate inset element were removed when they turned up,
 * because keeping them would have drawn a second ellipse over the first.
 */
export type BenefitPoint = { title: string; note: string }

export const hairBenefitsData = {
  tag: 'Hair System Benefits',
  titleLead: 'Benefits of a Natural Looking ',
  titleTail: 'Hair System',
  cardTitleLines: ['Benefits of a', 'Natural Looking', 'Hair System'],
  intro:
    'At American Hairline, we don’t do “patches.” We design hair systems that are:',
  points: [
    {
      title: 'Custom to your scalp',
      note: 'Each system is shaped around your scalp for a perfect fit.',
    },
    {
      title: 'Matches Every Detail',
      note: 'Texture, color, density, and even grey percentage, all blended seamlessly.',
    },
    {
      title: 'Made for your lifestyle',
      note: 'Choose from base options designed for your activity level.',
    },
    {
      title: 'Blends Naturally',
      note: 'Integrates with your temples, sideburns, and natural hairlines.',
    },
  ] as BenefitPoint[],
  philosophy: {
    label: 'Design Philosophy:',
    body: 'It’s not just about “adding hair.” It’s about aesthetic design, the way a stylist creates a custom look, not a haircut.',
  },
  cta: { label: 'Talk to an Expert', href: 'tel:9222666111' },
  media: {
    card: {
      src: '/hair-benefits/card.png',
      alt: 'A client wearing an American Hairline system, his hairline ringed by a dashed marker, beside an inset of a stylist fitting a base to a bare scalp.',
      width: 1600,
      height: 832,
    },
    sheet: {
      src: '/hair-benefits/sheet.png',
      alt: 'The same client photographed close up, the hairline visible at conversation distance.',
      width: 1100,
      height: 1090,
    },
  },
} as const

/* "Why Hair Patches Often Fail The Confidence Test"
 *
 * The problem half of the Hair Patch vs Hair System argument. It sits directly
 * before `hairBenefitsData`, which is the answer to it — problem stated, then
 * solution, which is the order the landing patterns and the page's own logic
 * both want.
 *
 * `**` marks bold inside the body copy, the same convention `choiceHeroLede`
 * uses, so the emphasis stays legible here as text rather than as markup.
 */
export const patchFailData = {
  titleLines: ['Why Hair Patches Often Fail', 'The Confidence Test'],
  issue: {
    label: 'The Real Issue with Patches',
    body: 'Hair patches are designed to save costs, often **sacrificing natural appearance**. With limited styles and **poor blending**, they may cover baldness but don’t align with your unique personality or facial structure.',
  },
  promise: {
    lead: 'A good hair system works when no one knows you’re wearing it.',
    note: 'That’s the standard we live by.',
  },
  cta: { label: 'Talk To An Expert', href: 'tel:9222666111' },
} as const

/* "Will My Hairline Look Real?" — the third guide page, at
 * `#/will-my-hairline-look-real`, under "Confused? We'll Guide You".
 *
 * Shares `GuideHero` with the Hair Patch vs Hair System page, so the shape of
 * this data matches `patchSystemHero*` above deliberately.
 */
export const hairlineRealHeroEyebrow = 'Natural Hairline'

export const hairlineRealHeroTitle = 'Will My Hairline Look Real?'

export const hairlineRealHeroLede =
  'At American Hairline, we specialize in creating **natural hairlines** that no one can detect. It is our craft and we are proud to say we have cracked it.'

export const hairlineRealHeroMedia = {
  poster: '/hairline-real/thumbnail.png',
  src: '/hairline-real/natural-hairline.mp4',
  label: 'Watch the natural hairline transformation',
  alt: 'The same man before and after: a receding hairline traced with a dashed line on the left, and a full styled hairline on the right.',
  width: 2240,
  height: 1260,
} as const

/* "How We Design The World's Most Natural Hairline"
 *
 * Page 4's craft section. It feeds `Checklist` directly — same component, same
 * dark pinned stage, seven points instead of twenty-one.
 */
export type HairlineDesignPoint = { title: string; note: string }

export const hairlineDesignTitle = [
  'How We Design The World’s',
  'Most Natural Hairline',
] as const

export const hairlineDesignLede = 'Here’s what makes it real:'

export const hairlineDesignPoints: HairlineDesignPoint[] = [
  {
    title: 'Uneven Hairline Placement',
    note: 'Prevents the artificial border look for a natural hairline.',
  },
  {
    title: 'Lower Density at the Front',
    note: 'Gradual transition mimicking natural hair growth patterns.',
  },
  {
    title: 'Ultra-Thin HD Swiss Lace Base',
    note: 'Melts into your scalp for an ultra-realistic appearance.',
  },
  {
    title: 'Lighter Hair Color for the Front',
    note: 'Dyed over to effectively conceal knots and seams.',
  },
  {
    title: 'Bleached Knots',
    note: 'No visible black dots, even under harsh lighting.',
  },
  {
    title: 'Single-Strand Implantation',
    note: 'Mimics real hair growth direction for a flawless look.',
  },
  {
    title: 'Base Color Matched to Skin Tone',
    note: 'Seamlessly blends with Indian skin tones for a perfect match.',
  },
]

/* Supplied 4:3 craft film; the existing still remains its poster. */
/* The supplied `Images/nh.png` had the quote, its scrim and the card's rounded
 * corners all painted into the picture. The still shipped here is cropped above
 * that band and the quote is set as real text instead, so it is selectable,
 * scales with the reader's type size, reaches a screen reader, and can be
 * changed without re-exporting an image. Re-cropping from the original means
 * `crop=2176:1090:0:0` — anything taller brings the baked caption back and it
 * will render twice. */
export const hairlineDesignVideo = {
  src: '/hairline-real/design-film.mp4',
  poster: '/hairline-real/design-film.png',
  alt: 'A stylist lifting the front of a hair system to show the hairline blending into the scalp.',
  label: 'Watch how it is built',
  caption:
    'We don’t sell the hair patches, we design hairlines, just like a cosmetic surgeon.',
} as const

/* "Benefits of a Natural Looking Hairline" — page 4's card and overlay.
 *
 * Feeds `HairBenefits`, the same component Page 3 uses. Two differences the
 * component allows for: there is no `philosophy` callout here, so the CTA
 * stands full width under the list, and the intro ends in a link.
 *
 * `introLink.href` is omitted because no film has been supplied. While it is
 * absent the label renders as text rather than as a link that goes nowhere;
 * add an `href` and it becomes a real link with no code change.
 */
export const hairlineBenefitsData = {
  tag: 'Hairline Benefits',
  titleLead: 'Hairline Insights & ',
  titleTail: 'Benefits',
  cardTitleLines: ['Benefits of a Natural', 'Looking Hairline'],
  intro:
    'The unique advantages that give you a natural-looking hairline. In the video, discover exactly what makes a hairline look real and what doesn’t. It’s perfect for anyone unsure after researching.',
  introLink: { label: 'Watch the video' },
  points: [
    {
      title: 'Looks Extremely Natural',
      note: 'Even at close range, the hairline blends seamlessly, giving a real look.',
    },
    {
      title: 'Style with Confidence',
      note: 'You can confidently wear a brush-back hairstyle without worry.',
    },
    {
      title: 'Feels Like Your Own Hair',
      note: 'No difference in texture when someone touches it. It feels just like natural hair.',
    },
    {
      title: 'Zero Social Awkwardness',
      note: 'Feel comfortable in any social situation, without any self-consciousness.',
    },
  ] as BenefitPoint[],
  cta: { label: 'Talk To An Expert', href: 'tel:9222666111' },
  cardArt: 'right' as const,
  media: {
    card: {
      src: '/hairline-benefits/card.png',
      alt: 'A client wearing an American Hairline system, photographed head-on in sunglasses.',
      width: 1400,
      height: 1152,
    },
    sheet: {
      src: '/hairline-benefits/sheet.png',
      /* A different crop for narrow screens, not a smaller copy. The desktop
         file is framed for a tall column and its head and shoulders run off the
         short box the phone layout gives it; this one carries margin on every
         side so `contain` fits the whole man. */
      mobileSrc: '/hairline-benefits/sheet-mobile.png',
      alt: 'The same client photographed from the waist up, the hairline visible at conversation distance.',
      width: 1100,
      height: 1602,
    },
  },
} as const

/* "Still Confused? We Understand This Is Not A Small Decision."
 *
 * Page 4's closing block above the footer. Feeds `StillConfused` — the same
 * dark scrub stage the Stick-On or Clip-On page uses, with its own headline.
 *
 * `href` matches page 2's `#consult`, which does not resolve to anything yet.
 * Left as-is deliberately: it is already dead on page 2, and pointing the two
 * pages at different targets would be a content decision, not a fix. Recorded
 * in PROJECT-CONTEXT section 7 with the other dead anchors.
 */
export const hairlineConfusedData = {
  eyebrow: 'Still Confused?',
  headlineLines: ['We Understand This Is Not A', 'Small Decision.'],
  subtext:
    'Get in touch with our expert. We’re here to provide the guidance you need.',
  cta: 'Speak To An Expert',
  href: '#consult',
}

/* "The Truth Behind Ultra Natural Hairline"
 *
 * Page 4, immediately above the benefits card. Five short claims in a 2-2-1
 * grid, each half bold. `**` marks the bold, the same convention
 * `choiceHeroLede` and `patchFailData` use, so the emphasis stays readable here
 * as text rather than as markup.
 *
 * The claims are deliberately short — they are read at a glance as the heading
 * lands, not studied. Any longer and the reveal would outrun the reading.
 */
export const hairlineTruthTitle = [
  'The Truth Behind Ultra',
  'Natural Hairline',
]

export const hairlineTruthPoints = [
  '**Hair so real**, your barber won’t know',
  'This is not a patch. **This is design**',
  '**Real hairlines**, crafted with precision',
  'It’s not magic. **It’s science**, design & detail',
  '**Natural hairlines** are built, strand by strand',
]

/* "Can You Use Your Own Front Hair For A Brush-Back Style?"
 *
 * Page 4's decision tree, below the closing scrub block. Six nodes and one
 * branch: density decides whether a brush-back works at all, and the yes path
 * carries on to the fibre question.
 *
 * `**` marks the bold, the same convention the rest of the page uses. `note` is
 * the parenthetical second line some nodes carry.
 */
export type FlowNode = { text: string; note?: string }

export const brushBackTitle = [
  'Can You Use Your Own Front Hair',
  'For A Brush-Back Style?',
]

export const brushBackFlow = {
  start: {
    text: 'Do you have **1½ inch to 1 inch** of natural hair in the front?',
  } as FlowNode,
  density: {
    text: 'Is the **density good**?',
    note: '(no gaps, no scalp showing)',
  } as FlowNode,
  yes: {
    label: 'Yes',
    node: { text: 'You can **use your own hair** in front' } as FlowNode,
  },
  no: {
    label: 'No',
    node: { text: 'Brush-back style **not recommended**' } as FlowNode,
  },
  fibre: {
    text: 'Willing to use **fiber powder**',
    note: '(e.g., Toppik)?',
  } as FlowNode,
  outcome: {
    text: 'Use **fiber + system** behind for natural hairline',
  } as FlowNode,
}

/* "HD Exposed Hairline — Brush Back Hairstyle"
 *
 * Page 4, immediately before the brush-back decision tree: this describes the
 * style, the tree then asks whether the reader's own hair qualifies for it.
 *
 * Four cards: three tick lists and one cross list. `tone` drives the mark.
 *
 * **Card two is `'yes'` by request.** It was briefly `'care'` — an amber info
 * mark — because its three points are maintenance costs rather than benefits,
 * and a green tick beside "glue attracts dust over time" reads as an
 * endorsement of the dust. The client prefers the green tick, which is their
 * call to make about their own copy; the card's heading, "What You Should
 * Know", is what carries the framing instead.
 *
 * The `'care'` tone and its amber info mark are still wired up in
 * `HdExposed.tsx` and the stylesheet. Setting this back to `'care'` is the only
 * change needed to reinstate it.
 *
 * Tone is never carried by colour alone — each card's heading states which it
 * is, and the glyphs differ.
 */
export type HdCardTone = 'yes' | 'care' | 'no'

export type HdCard = {
  title: string
  tone: HdCardTone
  points: string[]
}

export const hdExposedTitle = [
  'HD Exposed Hairline — Brush',
  'Back Hairstyle',
]

export const hdExposedCards: HdCard[] = [
  {
    title: 'Why People Choose This Style:',
    tone: 'yes',
    points: [
      'Clean, **groomed appearance**.',
      'Hairline **extremely natural** and sharp.',
      'Perfect for styling hair **fully backward**.',
      'Ideal for **photos, videos**, and high visibility events.',
    ],
  },
  {
    title: 'What You Should Know:',
    tone: 'yes',
    points: [
      'Requires **weekly gluing** of the front hairline.',
      'Only **liquid glue works;** tapes will be visible.',
      '**Glue attracts dust** over time and may darken if not cleaned.',
    ],
  },
  {
    title: 'Ideal For Men Who:',
    tone: 'yes',
    points: [
      'Prioritize a natural, **visible hairline**.',
      'Want a polished, **professional appearance.**',
      'Are **active in high-visibility** settings, such as events, or public speaking.',
      'Don’t mind **regular maintenance** to keep their look fresh and sharp.',
    ],
  },
  {
    title: 'May Not Be the Right Choice If:',
    tone: 'no',
    points: [
      'You **prefer low-maintenance** options.',
      '**Travel frequently** and need a more hassle-free hair solution.',
      'Are **sensitive** to frequent touch-ups or hairline adjustments.',
      'Don’t want the added commitment of **maintaining the glued** front area.',
    ],
  },
]

/* "If You Want To Use Your Natural Hair In The Front…"
 *
 * Page 4, straight after the brush-back decision tree. The tree answers yes or
 * no; this grades the middle ground — three density scenarios and what each one
 * means. The A/B/C labels are part of the heading text rather than a rendered
 * counter, because they are how the copy refers to them.
 *
 * `**` marks the bold, as everywhere else on this page.
 */
export type NaturalFrontCard = {
  label: string
  title: string
  points: string[]
}

export const naturalFrontTitle = [
  'If You Want To Use',
  'Your Natural Hair In',
  'The Front…',
]

export const naturalFrontCards: NaturalFrontCard[] = [
  {
    label: 'A.',
    title: 'Check Is the density in the first 1/2 to 1 inch good?',
    points: ['**If yes:** You can use your natural hair in the front'],
  },
  {
    label: 'B.',
    title: 'If the density is low (some hair, but scalp shows):',
    points: [
      '1st Apply **fiber powder** (e.g., Toppik)',
      '2nd Do **Scalp Micropigmentation** (SMP)',
      'If you’re **okay with either**, you can go ahead with a brush-back.',
      'If not, an **exposed hairline** is not advisable.',
    ],
  },
  {
    label: 'C.',
    title: 'If the density is very low (nearly bald or too thin):',
    points: [
      '**Not advisable** to use your own hair in the front.',
      'Consider a more **complete hair solution** such as a **hair system**, or discuss with a stylist for alternative options.',
    ],
  },
]

/* "How Long Does a Stick-On Hair System Last?"
 *
 * Hero for the guide page at `#/stick-on-lifespan`, the third page under
 * "Confused? We'll Guide You". The nav already linked this route before the
 * page existed, so the path is fixed by that link rather than chosen here.
 */
export const stickOnLifespanHeroEyebrow = 'Stick-On System Lifespan'

export const stickOnLifespanHeroTitle =
  'How Long Does a Stick-On Hair System Last?'

export const stickOnLifespanHeroLede =
  "It ultimately depends on what matters most to you, whether it's an **ultra-natural look** or **longer system life**. At American Hairline, we help you find the perfect choice for your **lifestyle**, **budget**, and **expectations**."

export const stickOnLifespanHeroMedia = {
  poster: '/stick-on-lifespan/thumbnail.png',
  src: '/guide-media/stick-on-vs-clip-on.mp4',
  label: 'Watch Stick-On vs Clip-On',
  alt: 'A stick-on hair system lifted at the front to show the adhesive strip along the base and the scalp beneath.',
  width: 2240,
  height: 1260,
} as const

/* "Two Base Options For Your Stick-On Hair System"
 *
 * Page 5, directly above the car analogy. Each option is a compact teaser card
 * with its own accessible detail dialog, using the same push-becomes-pull
 * pattern as `HairBenefits` on the hairline guide.
 */
export type StickOnBaseOption = {
  tag: string
  title: string
  description: string
  cardMedia: { src: string; alt: string; width: number; height: number }
  sheetMedia: { src: string; alt: string; width: number; height: number }
  sheetTitleLead: string
  sheetTitleTail: string
  intro: string
  points: BenefitPoint[]
  conclusion: { lead: string; strong: string }
}

export const baseOptionsTitle = [
  'Two Base Options For Your',
  'Stick-On Hair System',
]

export const baseOptions: StickOnBaseOption[] = [
  {
    tag: '1st Option',
    title: 'Thin Base + Low Density',
    description:
      'This means the base is very thin, and the hair density is low.',
    cardMedia: {
      src: '/base-options/first-option.png',
      alt: 'A thin-base, low-density hair system displayed on a mannequin head.',
      width: 1088,
      height: 944,
    },
    sheetMedia: {
      src: '/base-options/first-option-overlay.png',
      alt: 'Close view of the thin-base, low-density hair system on its mannequin head.',
      width: 1077,
      height: 1032,
    },
    sheetTitleLead: 'Stick-On Hair System with ',
    sheetTitleTail: 'Thin Base and Low Density',
    intro:
      'This means the base is very thin, and the hair density is low. Here’s what it gives you:',
    points: [
      {
        title: 'Super natural hairline',
        note: 'Seamlessly blends with your skin for a flawless look.',
      },
      {
        title: 'Feels ultra-light and breathable',
        note: 'So you can wear it all day without any discomfort.',
      },
      {
        title: 'Stay Undetectable',
        note: 'No one will notice, even if they touch your scalp.',
      },
    ],
    conclusion: {
      lead: 'It’s designed to provide',
      strong: 'lasting results for 3–4 months.',
    },
  },
  {
    tag: '2nd Option',
    title: 'Thick Base + High Density',
    description:
      'This means the base is thicker, and the hair density is high.',
    cardMedia: {
      src: '/base-options/second-option.png',
      alt: 'A thick-base, high-density hair system displayed on a mannequin head.',
      width: 1088,
      height: 944,
    },
    sheetMedia: {
      src: '/base-options/second-option-overlay.png',
      alt: 'Close view of the thick-base, high-density hair system on its mannequin head.',
      width: 1077,
      /* 1012, not the 1032 the first overlay carries: the replacement file
         supplied on 2026-08-27 has a different aspect ratio. A declared height
         that disagrees with the file reserves the wrong space and shifts the
         sheet as the image loads. */
      height: 1012,
    },
    sheetTitleLead: 'Stick-On Hair System with ',
    sheetTitleTail: 'Thick Base and High Density',
    intro:
      'This means the base is thicker, and the hair density is high. Here’s what it gives you:',
    points: [
      {
        title: 'Durable & long-lasting',
        note: 'It remains durable and intact for a period of 6 to 8 months.',
      },
      {
        title: 'Ideal for low maintenance',
        note: 'Perfect for those who prefer fewer system changes.',
      },
    ],
    conclusion: {
      lead: 'It’s slightly heavier and more',
      strong: 'noticeable when touched.',
    },
  },
]

/* "Car Example: Think Of It Like This Before Choosing"
 *
 * Page 5, immediately above "Thin Base Vs. Thick Base". The analogy introduces
 * the same trade-off in familiar terms before the rating table formalises it.
 * Closing notes are split into the two visual lines supplied in the reference.
 */
export type CarExampleCard = {
  title: string
  formula: string
  image: { src: string; alt: string; width: number; height: number }
  pros: string[]
  cons: string[]
  note: {
    lead: string
    emphasis: [string, string]
  }
}

export const carExampleTitle = [
  'Car Example: Think Of It Like This',
  'Before Choosing',
]

export const carExampleCards: CarExampleCard[] = [
  {
    title: 'Sports Car',
    formula: '(Thin Base + Low Density = Less Life)',
    image: {
      src: '/car-example/sports-car.jpg',
      alt: 'A sleek red sports car in a concrete studio.',
      width: 2192,
      height: 1460,
    },
    pros: ['Looks stunning', 'Feels amazing'],
    cons: ['High maintenance', "Can’t handle rough roads"],
    note: {
      lead: 'Ideal for men who',
      emphasis: ['are okay with changing it', 'every 3–4 months.'],
    },
  },
  {
    title: 'Fortuner SUV',
    formula: '(Thick Base + High Density = More Life)',
    image: {
      src: '/car-example/fortuner-suv.jpg',
      alt: 'A rugged white Fortuner SUV in a concrete studio.',
      width: 2196,
      height: 1464,
    },
    pros: ['Low maintenance', 'Strong, rugged, long-lasting'],
    cons: ['Heavier', 'Doesn’t look as sleek'],
    note: {
      lead: 'Perfect for men who',
      emphasis: ['are okay with', 'compromising on realism.'],
    },
  },
]

/* "Thin Base Vs. Thick Base"
 *
 * Page 5, below the hero. The same comparison table page 3 uses, but the cells
 * carry a rating out of five rather than a sentence — which is the whole reason
 * the two boards trade off against each other: the thin base wins on realism,
 * comfort and look, and loses on how long it lasts.
 *
 * `max` is stated rather than assumed so the accessible name can read "5 out of
 * 5" without the component inventing a denominator.
 */
export type RatingRow = {
  feature: string
  thin: number
  thick: number
}

export const baseComparisonTitle = 'Thin Base Vs. Thick Base'

export const baseComparisonMax = 5

export const baseComparisonHeads = {
  thin: ['Thin Base +', 'Low Density'],
  thick: ['Thick Base +', 'High Density'],
} as const

export const baseComparisonRows: RatingRow[] = [
  { feature: 'Hairline Realism', thin: 5, thick: 2 },
  { feature: 'Comfort', thin: 5, thick: 2 },
  { feature: 'Overall Look', thin: 5, thick: 3 },
  { feature: 'System Life', thin: 2, thick: 5 },
]

/* "Still Confused Between Bases?"
 *
 * Page 5, above the range gallery. Two option cards, each a short
 * self-assessment: the reader ticks the questions that describe them and the
 * card tells them whether that option is theirs.
 *
 * The questions are written to be answered yes or no about oneself, which is
 * why they are checkboxes in the build rather than bullets — the copy already
 * asks the reader to do something, and a bullet cannot be done.
 *
 * `**` marks the bold in the verdict, as everywhere else on these pages.
 */
export type BaseOption = {
  title: string
  questions: string[]
  verdict: string
}

export const baseChoiceTitle = 'Still Confused Between Bases?'

export const baseChoicePrompt = 'Ask yourself:'

export const baseChoiceOptions: BaseOption[] = [
  {
    title: 'Option 1 (Thin Base + Low Density)',
    questions: [
      'Is appearance my top priority?',
      'Do I want extreme comfort for daily wear?',
      'Do I want the most invisible-looking hairline possible?',
      'Am I okay changing the system every 3 to 4 months?',
      'Do I want it to feel like nothing’s there, even if someone touches my head?',
    ],
    verdict:
      'If this sounds like you, then go for a **thin base, low density**.',
  },
  {
    title: 'Option 2 (Thick Base + High Density)',
    questions: [
      'Am I okay if it looks slightly heavier or fuller?',
      'Do I prefer something that lasts 6 to 8 months?',
      'Do I want a more economical option with fewer replacements?',
      'Am I okay compromising a bit on comfort if it means I don’t have to worry for months?',
      'Do I want something that handles rougher use and travel?',
    ],
    verdict:
      'If this sounds like you, then go for a **thick base, high density**.',
  },
]

/* "Choose Your Perfect Balance: Look, Comfort, Or Lifespan?"
 *
 * Page 5, directly below the hero. The section states the trade-off the rest of
 * the page then details: three things are on offer and no system delivers all
 * of them, so the reader picks a side.
 *
 * Option A carries two of the three, Option B the remaining one — which is why
 * the closing line reads "only 1 out of 2": it is one *option*, not one
 * quality. The wording is the client's; the icons replace the design's emoji
 * with lucide keys, as every other section on this site does, so `site.ts`
 * stays import-free.
 */
export type BalanceTrait = { icon: 'look' | 'comfort' | 'lifespan'; label: string }

/* One flat word list, with the line breaks declared separately per breakpoint.
 *
 * Two lines at each breakpoint, but broken in different places, and the two
 * groupings do not nest — the phone keeps "Look," with "Comfort," while the wide
 * layout splits them. Rendering two separate line arrays would mean two copies
 * of every word in the DOM, so the words are one list and the breaks are indices
 * into it.
 *
 * A break index is the word that *starts* a new line. Keep these next to the
 * copy: renumber them if the wording changes.
 *
 *   0 Choose  1 Your  2 Perfect  3 Balance:  4 Look,  5 Comfort,  6 Or  7 Lifespan?
 */
export const balanceTitle =
  'Choose Your Perfect Balance: Look, Comfort, Or Lifespan?'

export const balanceTitleBreaks = {
  /* Choose Your Perfect Balance: Look, / Comfort, Or Lifespan? */
  wide: [5],
  /* Choose Your Perfect Balance: / Look, Comfort, Or Lifespan? */
  narrow: [4],
}

export const balanceOptions: { title: string; traits: BalanceTrait[] }[] = [
  {
    title: 'Option (A):',
    traits: [
      { icon: 'look', label: 'Ultra-natural look' },
      { icon: 'comfort', label: 'Extremely comfortable and lightweight' },
    ],
  },
  {
    title: 'Option (B):',
    traits: [{ icon: 'lifespan', label: 'Long-lasting and durable' }],
  },
]

/* `**` marks the bold half, which is the part that states the constraint. */
export const balanceNote =
  '**You can choose only 1 of these 2 options.** That’s why we design based on what YOU value most.'

export const balanceCta = { label: 'Talk To An Expert', href: '#consult' }

/* ── Clip-On System Lifespan ─────────────────────────────────────────────────
 *
 * The guide page at `#/clip-on-lifespan`, the sibling of the Stick-On page and
 * the fourth entry under "Confused? We'll Guide You". The nav has linked this
 * route since the navigation was written, so the path was fixed before the page
 * existed.
 *
 * The photography is installed. Each `width`/`height` below is the shipped
 * file's own, measured after resizing rather than carried over from the Stick-On
 * page — the supplied cut-outs do not share its aspect ratios, and a declared
 * size that disagrees with the file reserves the wrong space and shifts the
 * layout as the image loads.
 */

/* The Clip-On page's own copy of the "Still Confused Between Bases?"
 * questions. Identical to the Stick-On set except the two lifespan figures,
 * which are taken from this page's own overlays: thin 6-8 months, thick 12.
 * The shared set stated 3-4 and 6-8 - the stick-on numbers - so the page
 * contradicted itself two sections apart. */
export const clipOnBaseChoiceOptions: BaseOption[] = [
  {
    title: 'Option 1 (Thin Base + Low Density)',
    questions: [
      'Is appearance my top priority?',
      'Do I want extreme comfort for daily wear?',
      'Do I want the most invisible-looking hairline possible?',
      'Am I okay changing the system every 6 to 8 months?',
      'Do I want it to feel like nothing’s there, even if someone touches my head?',
    ],
    verdict:
      'If this sounds like you, then go for a **thin base, low density**.',
  },
  {
    title: 'Option 2 (Thick Base + High Density)',
    questions: [
      'Am I okay if it looks slightly heavier or fuller?',
      'Do I prefer something that lasts up to 12 months?',
      'Do I want a more economical option with fewer replacements?',
      'Am I okay compromising a bit on comfort if it means I don’t have to worry for months?',
      'Do I want something that handles rougher use and travel?',
    ],
    verdict:
      'If this sounds like you, then go for a **thick base, high density**.',
  },
]

export const clipOnLifespanHeroEyebrow = 'Clip-On System Lifespan'

export const clipOnLifespanHeroTitle =
  'How Long Does a Clip-On Hair System Last?'

export const clipOnLifespanHeroLede =
  'It depends on the base and density you choose. Since **clip-ons are not glued** or taped to your scalp daily, they face **less wear and tear**, which means a **longer lifespan** compared to stick-ons.'

export const clipOnLifespanHeroMedia = {
  poster: '/clip-on-lifespan/thumbnail.png',
  src: '/guide-media/stick-on-vs-clip-on.mp4',
  label: 'Watch Stick-On vs Clip-On',
  alt: 'A clip-on hair system being lowered onto a client’s head, the base visible from above.',
  width: 2240,
  height: 1260,
} as const

export const clipOnBaseOptionsTitle = [
  'Two Base Options For Your',
  'Clip-On Hair System',
]

export const clipOnBaseOptions: StickOnBaseOption[] = [
  {
    tag: '1st Option',
    title: 'Thin Base + Low Density',
    description:
      'This means the base is very thin, and the hair density is low.',
    cardMedia: {
      src: '/clip-on-base-options/first-option.png',
      alt: 'A thin-base, low-density clip-on hair system displayed on a mannequin head.',
      width: 1088,
      height: 948,
    },
    sheetMedia: {
      src: '/clip-on-base-options/first-option-overlay.png',
      alt: 'Close view of the thin-base, low-density clip-on system and the clips along its base.',
      width: 1077,
      height: 984,
    },
    sheetTitleLead: 'Clip-On Hair System with ',
    sheetTitleTail: 'Thin Base and Low Density',
    intro:
      'This means the base is very thin, and the hair density is low. Here’s what it gives you:',
    points: [
      {
        title: 'Lightweight & Natural Look',
        note: 'Blends easily and feels more natural with everyday use.',
      },
      {
        title: 'Gradual Thinning',
        note: 'Hair reduces slowly over time, just like natural hair.',
      },
      {
        title: 'Perfect for Daily Wear',
        note: 'Flexible for styling and comfortable for regular use.',
      },
    ],
    conclusion: {
      lead: 'It’s designed to provide',
      strong: 'lasting results for 6–8 months.',
    },
  },
  {
    tag: '2nd Option',
    title: 'Thick Base + High Density',
    description: 'This means the base is thicker, and the hair density is high.',
    cardMedia: {
      src: '/clip-on-base-options/second-option.png',
      alt: 'A thick-base, high-density clip-on hair system displayed on a mannequin head.',
      width: 1088,
      height: 942,
    },
    sheetMedia: {
      src: '/clip-on-base-options/second-option-overlay.png',
      alt: 'Close view of the thick-base, high-density clip-on system and the clips along its base.',
      width: 1077,
      height: 956,
    },
    sheetTitleLead: 'Clip-On Hair System with ',
    sheetTitleTail: 'Thick Base and High Density',
    intro:
      'This means the base is thicker, and the hair density is high. Here’s what it gives you:',
    points: [
      {
        title: 'Maximum Volume',
        note: 'Packed with more hair per square inch for a naturally fuller look.',
      },
      {
        title: 'Long-Lasting Fullness',
        note: 'Stays dense and full far longer than a thin base.',
      },
      {
        title: 'Durable with Care',
        note: 'With basic cleaning and regular care, it can last for 12 months.',
      },
    ],
    conclusion: {
      lead: 'It’s slightly heavier but',
      strong: 'designed to give maximum volume.',
    },
  },
]

/* ── Clip-On Hair System ─────────────────────────────────────────────────────
 *
 * The product page at `#/clip-on-hair-system`. Distinct from
 * `#/clip-on-lifespan`, which answers how long one lasts: this one argues the
 * case for the method itself.
 *
 * The photography is installed. Every `width`/`height` below is the shipped
 * file's own, measured after resizing rather than guessed — a declared size that
 * disagrees with the file reserves the wrong space and shifts the layout as the
 * image loads.
 */

export const clipOnHeroEyebrow = 'Clip-On Method'

export const clipOnHeroTitle = 'Get Hair Loss Coverage Without Shaving Your Head'

export const clipOnHeroLede =
  'Invisible. **Secure**. Scalp-safe. Looks just like **natural hair**. No glue. No shaving. Clip it on and it stays firm, **feels light**, and styles naturally.'

export const clipOnHeroMedia = {
  poster: '/clip-on-system/hero.png',
  alt: 'A clip-on hair system being fitted onto a client’s head.',
  width: 2240,
  height: 1260,
} as const

/* "The Real Fears Men Have" — the objections, said plainly before the pitch. */
export const clipFearsTitle = 'The Real Fears Men Have'

export const clipFearsLede = 'Every man we meet shares the same fears:'

export type ClipFear = { icon: 'razor' | 'hair' | 'lock' | 'touch' | 'mirror'; text: string }

export const clipFears: ClipFear[] = [
  { icon: 'razor', text: 'I don’t want to shave my head.' },
  { icon: 'hair', text: 'I want to keep my natural hair.' },
  { icon: 'lock', text: 'It must never fall off. It has to feel super secure.' },
  { icon: 'touch', text: 'Even if someone touches my head, they shouldn’t know.' },
  { icon: 'mirror', text: 'It should look exactly like my hair before hair loss.' },
]

export const clipFearsMedia = {
  src: '/clip-on-system/fears.png',
  alt: 'A man with visible hair loss looking directly at the camera.',
  width: 1320,
  height: 990,
}

export const clipFearsCta = { label: 'Discuss With A Consultant', href: '#consult' }

/* "A Hair System Gives You Three Things Every Man Wants:" */
export const clipThreeTitle = [
  'A Hair System Gives You Three',
  'Things Every Man Wants:',
]

export type ClipPillar = {
  icon: 'invisible' | 'safe' | 'secure'
  title: string
  note: string
  media: { src: string; alt: string; width: number; height: number }
}

export const clipThreePillars: ClipPillar[] = [
  {
    icon: 'invisible',
    title: 'Invisible',
    note: 'Ultra-thin breathable base, undetectable even if someone touches your head.',
    media: {
      src: '/clip-on-system/pillar-invisible.png',
      alt: 'A close view of a hairline where the system meets the scalp, with no visible edge.',
      width: 2232,
      height: 1396,
    },
  },
  {
    icon: 'safe',
    title: 'Safe',
    note: 'Anti-bacterial base that protects your scalp from irritation & bacteria.',
    media: {
      src: '/clip-on-system/pillar-safe.png',
      alt: 'An illustration of the anti-bacterial layer over a client’s scalp.',
      width: 880,
      height: 870,
    },
  },
  {
    icon: 'secure',
    title: 'Secure',
    note: 'Medical-grade silicon clips engineered for all-day wear.',
    media: {
      src: '/clip-on-system/pillar-secure.png',
      alt: 'Two medical-grade silicon clips held in an open palm.',
      width: 1604,
      height: 1396,
    },
  },
]

/* "Clip-On Is Perfect For Men Who…" — the `ScrollStack` card stack. */
export const clipPerfectTitle = ['Clip-On Is Perfect For', 'Men Who…']

export type ClipPerfectRow = {
  icon: 'crown' | 'freedom' | 'razor' | 'treatment' | 'confidence'
  text: string
}

export const clipPerfectRows: ClipPerfectRow[] = [
  { icon: 'crown', text: 'Have thinning hair at the crown or top.' },
  { icon: 'freedom', text: 'Want the freedom to wear or remove it anytime.' },
  { icon: 'razor', text: 'Are not ready to shave their head for a stick-on system.' },
  { icon: 'treatment', text: 'Are still continuing a treatment and need coverage.' },
  { icon: 'confidence', text: 'Just want to look younger and feel confident again.' },
]

export const clipPerfectCta = {
  title: 'If this sounds like YOU, Clip-On is made for YOU.',
  body: 'It’s light, secure, and looks just like your real hair.',
  /* Title case, matching every other CTA of this label on the site. */
  action: 'Talk To An Expert',
  href: '#consult',
}

/* "Why Thousands Of Men Choose American Hairline" — the `.truth` claim grid. */
export const clipWhyTitle = [
  'Why Thousands Of Men',
  'Choose American Hairline',
]

export const clipWhyPoints = [
  'Specialists in **ultra-natural** blending',
  '**Exclusive creators** of Zycon™ range',
  '**Custom-made** for every client',
  'Clients from **12+ countries**',
  '**Antibacterial, odor-free, breathable** base built with medical-grade technology',
]

/* "Stick-On Vs. Clip-On Hair Systems" — the existing `Comparison` table with
 * its heading the other way round, matching this page's design. */
/* "Premium Clip-On With Medicated Hygiene" — Zycon teaser and dialog. */
export const clipZyconRange = {
  tag: 'Zycon Range • Pro Series',
  cardTitle: ['Premium Clip-On', 'With Medicated Hygiene'],
  sheetTitleLead: 'Premium Clip-On With Medicated Hygiene —',
  sheetTitleAccent: 'Zycon Range • Pro Series',
  body: [
    {
      text: 'The Zycon range is a clip-on hair system that supports scalp health by using ',
    },
    { text: 'antibacterial protection', strong: true },
    { text: ' and ' },
    { text: 'controlling odor', strong: true },
    {
      text: '. It is designed to help you stay comfortable, confident, and unrestricted in your active lifestyle.',
    },
  ],
  action: { label: 'Know more', href: '#consult' },
  media: {
    background: {
      src: '/clip-on-system/zycon-gradient.png',
      alt: '',
      width: 1800,
      height: 918,
    },
    card: {
      src: '/clip-on-system/zycon-card.png',
      alt: 'A man wearing a premium clip-on hair system, with its seamless hairline outlined in white.',
      width: 1200,
      height: 1233,
    },
    overlay: {
      src: '/clip-on-system/zycon-overlay.png',
      alt: 'A man wearing the Zycon Pro Series clip-on hair system, with a coloured outline following its natural hairline.',
      width: 1400,
      height: 1517,
    },
  },
} as const

export const clipComparisonTitle = ['Stick-On Vs. Clip-On', 'Hair Systems'] as const

/* "Don't Just Hide Hair Loss. Reverse It Instantly." — the Zycon close. */
export const clipZyconCtaTitle = [
  'Don’t Just Hide Hair Loss.',
  'Reverse It Instantly.',
]

export const clipZyconCtaLede =
  'Zycon™ India’s first medical-grade clip-on hair system.'

export const clipZyconChips = [
  'Invisible',
  'Secure',
  'Scalp-Safe',
  '99.9% Antibacterial',
  '100% Odor-Free',
  'All-Day Comfort',
]

export const clipZyconCtaKicker = 'Try it once, and you’ll never look back'

export const clipZyconCtaAction = {
  label: 'Discuss With A Consultant',
  href: '#consult',
}

export const clipZyconCtaFoot =
  'Only limited Zycon demo slots available every month.'

/* "Learn How The Stick-On Hair System Works" — the cross-link out. */
export const clipLearnTitle = [
  'Learn How The Stick-On Hair',
  'System Works',
]

export const clipLearnCard = {
  tag: 'Stick-on Hair System',
  body: 'Natural look with a secure fit you can trust. Swim, shower, workout, and live freely.',
  action: 'Know more',
  href: '#/stick-on-hair-system',
  media: {
    src: '/clip-on-system/learn-stick-on.png',
    alt: 'A man wearing a stick-on hair system, styled and photographed from the front.',
    width: 2808,
    height: 2332,
  },
}

/* "Story reels" — a row of circular client videos that opens into a 9:16 reel
 * viewer, modelled on the circles under Add to Cart on 1hairstop.in product
 * pages. One row per page, four circles at most, each titled with the visitor's
 * own question for that page, and placed directly below the page's
 * consultation CTA or form, where the visitor is deciding.
 *
 * ⚠ PLACEHOLDER MEDIA. Every clip below is one of six 9:16 cuts made from the
 * homepage client-story films (`public/clients/client-story-N.mp4`, whose real
 * content is a vertical reel pillarboxed into 1920×1080 with blurred sides).
 * The titles describe the video each page *should* carry; the clips do not
 * show those topics yet. Replace `src`/`poster` per item when the real vertical
 * clips arrive, and keep `name` in step with whoever is in the new clip. */
export type StoryReel = {
  id: string
  title: string
  name: string
  poster: string
  src: string
}

export type StoryReelSet = {
  title: string
  intro: string
  reels: StoryReel[]
}

const placeholderClients = [
  'Rylan Rodrigues',
  'Arun Sharma',
  'Rohan Bera',
  'Sahil Khan',
  'Rohan Deshmukh',
  'Anup Kumar',
] as const

function placeholderReels(page: string, titles: readonly string[], start: number): StoryReel[] {
  return titles.map((title, index) => {
    const n = ((start + index) % placeholderClients.length) + 1
    return {
      id: `${page}-${index + 1}`,
      title,
      name: placeholderClients[n - 1],
      poster: `/story-reels/placeholder-${n}.webp`,
      src: `/story-reels/placeholder-${n}.mp4`,
    }
  })
}

export const storyReels = {
  hairline: {
    title: 'See The Hairline Up Close',
    intro: 'Real clients, filmed close enough to judge for yourself.',
    reels: placeholderReels('hairline', ['Close-up hairline', 'Wind test', 'Touch test', 'In daylight'], 0),
  },
  stickOn: {
    title: 'Watch Life With A Stick-On System',
    intro: 'Short videos from men who wear one every day.',
    reels: placeholderReels('stick-on', ['Gym & swimming', 'Monthly service', 'First week', '1 year later'], 2),
  },
  clipOn: {
    title: 'See How A Clip-On Fits Your Day',
    intro: 'Short videos from men who put one on every morning.',
    reels: placeholderReels('clip-on', ['On in 60 seconds', 'Daily removal', 'No shaving', 'Weekend use'], 4),
  },
  founder: {
    title: 'Hear From Men Who Met Vinitt',
    intro: 'Clients who took the one-on-one session, in their own words.',
    reels: placeholderReels('founder', ['Why I booked', 'What he told me', 'Worth ₹5,000?', 'My plan after'], 1),
  },
  smp: {
    title: 'Watch SMP Up Close',
    intro: 'Short videos that answer the questions men ask most.',
    reels: placeholderReels('smp', ['Is it a tattoo?', 'Healing, days 1–7', 'Close-up'], 3),
  },
  transplant: {
    title: 'See The Hybrid Approach Explained',
    intro: 'Short videos from clients who combined both.',
    reels: placeholderReels('transplant', ['Hybrid explained', 'Why not transplant only?', 'Recovery', '6 months later'], 5),
  },
  stickOnLifespan: {
    title: 'See How A Base Ages',
    intro: 'Short videos comparing thin and thick bases over time.',
    reels: placeholderReels('stick-lifespan', ['Thin base, 6 months', 'Thick base, 6 months', 'Side by side', 'When to replace'], 0),
  },
  clipOnLifespan: {
    title: 'See How A Base Ages',
    intro: 'Short videos comparing thin and thick bases over time.',
    reels: placeholderReels('clip-lifespan', ['Thin base, 6 months', 'Thick base, 6 months', 'Side by side', 'When to replace'], 3),
  },
} satisfies Record<string, StoryReelSet>
