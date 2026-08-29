import type { RefObject } from 'react'
import { ArrowRight } from 'lucide-react'
import { Wordmark } from './Wordmark'
import { MatchSlider } from './MatchSlider'

type HeroProps = {
  rootRef?: RefObject<HTMLDivElement>
}

export function Hero({ rootRef }: HeroProps) {
  return (
    <div id="home" className="stage" ref={rootRef}>
      <Wordmark />

      <section className="hero">
        <div className="wrap hero__in">
          <div className="hero__pitch">
            <span className="hero__eyebrow">India's #1 Hair System Experts</span>

            <h1 className="hero__title">
              Tired of Hiding
              <br />
              Your Hair Loss?
            </h1>

            <p className="hero__copy">
              Get a natural-looking hair system trusted by Bollywood celebrities, without surgery,
              side effects, or regret.
            </p>

            <a className="btn btn--lg hero__cta" href="#book">
              Discuss With A Consultant
              <ArrowRight className="btn__arrow" size={18} strokeWidth={2.5} />
            </a>
          </div>

          <MatchSlider />
        </div>
      </section>
    </div>
  )
}
