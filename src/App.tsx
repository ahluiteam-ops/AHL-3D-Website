import { useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { HeroSecret } from './components/HeroSecret'
import { Achievements } from './components/Achievements'
import { KeyFacts } from './components/KeyFacts'
import { Checklist } from './components/Checklist'
import { ClientStories } from './components/ClientStories'
import { Backed } from './components/Backed'
import { Systems } from './components/Systems'
import { Story } from './components/Story'
import { Services } from './components/Services'
import { Process } from './components/Process'
import { Pillars } from './components/Pillars'
import { Deck } from './components/Deck'
import { Scan } from './components/Scan'
import { Decide } from './components/Decide'
import { Methods } from './components/Methods'
import { Form } from './components/Form'
import { Salons } from './components/Salons'
import { Faq } from './components/Faq'
import { FounderBooking } from './components/FounderBooking'
import { Footer } from './components/Footer'
import { FloatingContact } from './components/FloatingContact'
import { StickOnClipOn } from './pages/StickOnClipOn'
import { HairPatchVsSystem } from './pages/HairPatchVsSystem'
import { WillMyHairlineLookReal } from './pages/WillMyHairlineLookReal'
import { StickOnLifespan } from './pages/StickOnLifespan'
import { ClipOnLifespan } from './pages/ClipOnLifespan'
import { ClipOnHairSystem } from './pages/ClipOnHairSystem'
import { StickOnHairSystem } from './pages/StickOnHairSystem'
import { Smp } from './pages/Smp'
import { HairTransplant } from './pages/HairTransplant'
import { ConsultFounder } from './pages/ConsultFounder'
import { BookConsultation } from './pages/BookConsultation'
import { AboutUs } from './pages/AboutUs'
import { Team } from './pages/Team'
import { Results } from './pages/Results'
import { ConsultationBooked } from './pages/ConsultationBooked'

/**
 * Routes are hash-based and matched on a **leading slash**, which is the whole
 * reason this works without a router: the nav's own links are bare hash
 * anchors — `#home`, `#guide`, `#solutions` — and a bare anchor has no slash,
 * so it can never be mistaken for a route. `#/stick-on-or-clip-on` is a route;
 * `#guide` scrolls the current page.
 *
 * Hash rather than path also means no dev-server or host rewrite rules: every
 * route is served by the same `index.html`.
 *
 * This is deliberately the smallest thing that makes a second page reachable.
 * When the site grows past a handful of pages — the brand has around thirteen
 * — replace it with a real router rather than extending this.
 */
const routes: Record<string, () => JSX.Element> = {
  '/stick-on-or-clip-on': StickOnClipOn,
  '/hair-patch-vs-hair-system': HairPatchVsSystem,
  '/will-my-hairline-look-real': WillMyHairlineLookReal,
  '/stick-on-lifespan': StickOnLifespan,
  '/clip-on-lifespan': ClipOnLifespan,
  '/clip-on-hair-system': ClipOnHairSystem,
  '/stick-on-hair-system': StickOnHairSystem,
  '/smp': Smp,
  '/hair-transplant': HairTransplant,
  '/consult-with-founder': ConsultFounder,
  '/about-us': AboutUs,
  '/team': Team,
  '/results': Results,
  '/book-consultation': BookConsultation,
  '/consultation-booked': ConsultationBooked,
}

function useHashRoute() {
  const read = () => {
    const raw = window.location.hash.replace(/^#/, '')
    const base = raw.split('#')[0]
    return base.startsWith('/') ? base : '/' + base
  }
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSecret />
        <Achievements />
        <KeyFacts />
        <Checklist />
        <ClientStories />
        <Backed />
        <Systems />
        <Scan />
        <Decide />
        <Story />
        <Services />
        <Process />
        <Methods />
        <Pillars />
        <Deck />
        <Salons />
        <Faq />
        <FounderBooking />
        <Form />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const route = useHashRoute()
  const Page = routes[route]
  return (
    <>
      {Page ? <Page /> : <Home />}
      {/* The booking page is a focused checkout: the floating buttons would sit
          over its form and its bottom action bar. */}
      {route !== '/book-consultation' && <FloatingContact />}
    </>
  )
}
