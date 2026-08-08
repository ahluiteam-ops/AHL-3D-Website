import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Secret } from './components/Secret'
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
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Secret />
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
        <Form />
      </main>
      <Footer />
    </>
  )
}
