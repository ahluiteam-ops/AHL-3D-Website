export type NavItem = { label: string; href: string; current?: boolean }

export const nav: NavItem[] = [
  { label: 'Home', href: '#home', current: true },
  { label: "Confused? We'll Guide You", href: '#guide' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Results', href: '#results' },
  { label: 'About us', href: '#about' },
]

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
 * NOTE: the names below are placeholders. Replace them with the real names
 * before launch, and only with each client's permission — these are
 * photographs of identifiable people. */
export const clients: Client[] = [
  { client: 'Advik Sharma', style: 'wavy side-swept', img: '/hair/client-1.png' },
  { client: 'Rajesh Malhotra', style: 'short natural', img: '/hair/client-2.png' },
  { client: 'Karan Deshpande', style: 'thick jet-black', img: '/hair/client-3.png' },
  { client: 'Aarav Nair', style: 'textured crop', img: '/hair/client-4.png' },
  { client: 'Michael Brennan', style: 'classic side part', img: '/hair/client-5.png' },
  { client: 'Rohan Kapoor', style: 'full volume', img: '/hair/client-6.png' },
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

export const secretVideo = '/video/secret-hair-system.mp4'

/* "Our Big Achievements" — the shared proof block, presented as a pinned
 * horizontal scroll. The Bollywood image is deliberately face-blurred to
 * protect client privacy. */
export const achievements = [
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

/* `src` is intentionally empty until the client supplies the film. With no
 * source the block renders as a still figure; the moment a path is set here it
 * becomes a real play control with an inline <video>. */
export const checklistVideo = {
  poster: '/checklist/21-point-checklist.png',
  src: '',
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
 * ⚠ NAMES AND QUOTES ARE PLACEHOLDERS on photographs of identifiable real
 * people. Three of the names come from the client's own design artwork, but
 * they are not matched to these particular faces, and none of the quotes is
 * something a real client said. Replace every name/quote pair with the real
 * one, with that client's permission, before launch.
 *
 * `src` is empty until the client supplies the films; with no source a card
 * renders as a still figure. Set a path and it becomes a real play control
 * with an inline <video>, the same arrangement as the checklist film. */
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
    src: '',
    alt: 'Client before and after: thinning crown, then a full swept-back system.',
  },
  {
    name: 'Arun Sharma',
    quote: 'Nobody at work asked a single question. That was the whole test for me.',
    poster: '/clients/client-story-2.png',
    src: '',
    alt: 'Client before and after: receded hairline, then a restored natural front.',
  },
  {
    name: 'Rohan Bera',
    quote: 'I stopped checking mirrors. I just get ready and leave the house now.',
    poster: '/clients/client-story-3.png',
    src: '',
    alt: 'Client before and after: visible scalp, then dense matched hair.',
  },
  {
    name: 'Imran Qureshi',
    quote: 'The front edge is the part I was worried about. Up close it still reads real.',
    poster: '/clients/client-story-4.png',
    src: '',
    alt: 'Client before and after: grey thinning front, then a full styled system.',
  },
  {
    name: 'Nikhil Raut',
    quote: 'I had tried oils and tablets for four years. This took one appointment.',
    poster: '/clients/client-story-5.png',
    src: '',
    alt: 'Client before and after: bare crown, then a textured natural finish.',
  },
  {
    name: 'Sameer Joshi',
    quote: 'My barber blends the sides now and even he cannot find the edge.',
    poster: '/clients/client-story-6.png',
    src: '',
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

/* "The Step-By-Step Process To Natural Hair" — copy exactly as supplied in the
 * client's artwork. The film itself has not been supplied: `processVideo.src`
 * is empty, so the block renders as a still figure carrying the poster. Set a
 * path there and nothing else needs changing. */
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
  src: '',
  alt: 'A client’s template, hairline mapping and fitting shown beside his finished look.',
  label: 'Watch the process',
}

export const processAction = 'Discuss With A Consultant'

/* "Real Hair Or Illusion? Watch & Decide".
 *
 * The film has not been supplied: `decideVideo.src` is empty, so the block
 * renders as a still figure carrying the poster. Set a path and nothing else
 * needs changing — the same convention as `checklistVideo` and
 * `processVideo`. */
export const decideTitle = ['Real Hair Or Illusion?', 'Watch & Decide'] as const

export const decideVideo = {
  poster: '/decide/before-after.png',
  src: '',
  alt: 'A client photographed before and after his hair system, the hairline marked on both.',
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
}

export const methodsTitle = ['Our Trusted Methods For', 'A Natural Look'] as const

export const methods: Method[] = [
  {
    icon: 'sticker',
    title: 'Stick-On Hair Systems',
    body: 'No clips, no hassle, just stick, style, and go. Perfect for a natural look all day — the base bonds to the scalp, so nothing moves when you do.',
    href: '#solutions',
  },
  {
    icon: 'clips',
    title: 'Clip-On Hair Systems',
    body: 'Clipped to your own hair rather than bonded, so there is no adhesive and nothing to shave. Take it off whenever you want to; put it back in minutes.',
    href: '#solutions',
  },
]

export const methodsMedia = {
  image: '/services/non-surgical-hair-replacement.png',
  alt: 'A hair system base being lifted from a client’s scalp during a fitting.',
}

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
      { label: 'About us', href: '#about' },
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
      { label: 'Non-Surgical Hair Replacement', href: '#solutions' },
      { label: 'Scalp Micro Pigmentation', href: '#solutions' },
      { label: 'Hair Transplant', href: '#solutions' },
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

export const footerLegal = 'American Hairline © 2025 – All Rights Reserved.'

/* "Walk Into Any Of Our Premium Salons".
 *
 * Addresses are the client's, verbatim.
 *
 * ⚠ The three photographs are STAND-INS — Unsplash salon interiors, not
 * American Hairline's own studios. They are here so the section can be built
 * and reviewed; shipping them live would be showing someone else's salon as
 * ours. Replace all three with real photography before launch. See §7 of
 * PROJECT-CONTEXT. */
export type Salon = {
  city: string
  address: string
  image: string
  alt: string
  href: string
}

export const salonsTitle = ['Walk Into Any Of', 'Our Premium Salons'] as const

export const salons: Salon[] = [
  {
    city: 'Mumbai',
    address:
      '4th floor Empressa Building, 2nd Rd, Khar, Ram Krishna Nagar, Khar West, Mumbai, Maharashtra 400052.',
    image: '/salons/mumbai.jpg',
    alt: 'Placeholder interior for the Mumbai studio.',
    href: 'https://maps.google.com/?q=Empressa+Building+2nd+Rd+Khar+West+Mumbai+400052',
  },
  {
    city: 'Delhi',
    address:
      'Plot No. 2, 2nd Floor, Main Road, Hudson Lane, GTB Nagar, Delhi - 110009.',
    image: '/salons/delhi.jpg',
    alt: 'Placeholder interior for the Delhi studio.',
    href: 'https://maps.google.com/?q=Plot+No+2+Hudson+Lane+GTB+Nagar+Delhi+110009',
  },
  {
    city: 'Bangalore',
    address:
      '2nd Floor, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560008.',
    image: '/salons/bangalore.jpg',
    alt: 'Placeholder interior for the Bangalore studio.',
    href: 'https://maps.google.com/?q=12th+Main+Rd+HAL+2nd+Stage+Indiranagar+Bengaluru+560008',
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
export type FaqItem = { q: string; a: string }
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
        a: 'We look at your stage of hair loss, run the Advanced 3D Scan, and talk through your routine — your work, your travel, how much upkeep you actually want. Then we show you what suits you, and what does not.',
      },
      {
        q: 'Is it an in-person or online consultation?',
        a: 'Either. In person at our Mumbai, Delhi or Bangalore studios, or online if you are travelling or based abroad. The scan and the samples are the parts worth coming in for, so we will tell you honestly if a visit would serve you better.',
      },
      {
        q: 'Will I get to see real samples or demos?',
        a: 'Yes. You can hold the bases and the hair, see the density and the hairline up close, and try a system on so you are deciding from something real rather than a photograph.',
      },
      {
        q: 'Will I be pressured to buy during the consultation?',
        a: 'No. There is no upselling and nothing is decided on the day. If a hair system is not the right answer for you, we will say so — we have turned people away before.',
      },
      {
        q: 'Will I know the total cost after the consultation?',
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
        a: 'No, it looks just like your real hair — even stylists cannot tell. The giveaway is always the front, which is why the hairline is custom-designed to your face and goes through the 21-point check before it reaches you.',
      },
      {
        q: 'Will it damage my hair?',
        a: 'No. The system sits on the area where hair has already gone, and your remaining hair keeps its own growth cycle. Damage comes from a badly fitted patch pulling on live hair, which is what a custom-designed system is built to avoid.',
      },
      {
        q: 'Will people notice?',
        a: 'Not if the hairline is right. That is the whole job: a natural front edge, density that matches your age and face, and a base thin enough to disappear against the scalp up close.',
      },
      {
        q: 'Will I need to shave my head?',
        a: 'Only for a stick-on system, and only the area it attaches to. A clip-on needs no shaving at all and comes off whenever you want it to.',
      },
      {
        q: 'How long does a hair replacement system last?',
        a: 'It depends on the base you choose — a thinner base looks more invisible and wears faster, a thicker one lasts longer. Your consultant will give you the life expectancy of the exact base you pick, along with the servicing it needs to reach it.',
      },
      {
        q: 'Are your hair systems itchy to the scalp?',
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
    value: '12+ Nations',
    label: 'Client Base',
    slot: 'right',
    image: '/key-facts/12-nations.png',
  },
]
