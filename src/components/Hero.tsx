import { ArrowRight } from 'lucide-react'
import { Wordmark } from './Wordmark'
import { MatchSlider } from './MatchSlider'

// The stage is scoped to the hero alone: .hero__bg is absolutely positioned
// against it, so anything outside this wrapper stays clear of the video.
export function Hero() {
  return (
    <div id="home" className="stage">
      <Wordmark />

      {/* Decorative loop; muted + playsInline is what allows it to autoplay.
          It spans the wordmark AND the hero as one stage, painted after the
          wordmark with mix-blend-mode: darken — the footage's white ground
          drops away, so the mannequin reads as standing in front of the
          chrome letters, exactly as in the reference. */}
      <video
        className="hero__bg"
        src="/video/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />

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
