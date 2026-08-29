/**
 * The oversized chrome "NATURAL" band with the 100% badge sitting over its N.
 *
 * Drawn as SVG rather than styled text for one reason: `textLength` +
 * `lengthAdjust="spacingAndGlyphs"` pins the word to exactly the viewBox
 * width, so it spans the full bleed at any viewport and never reflows if
 * Playfair Display is slow to arrive or unavailable.
 *
 * Measured: NATURAL's intrinsic width at font-size 200 is 923 units, so running
 * it full-bleed stretches it to ~1.083×. That is a mild widening of the stems
 * and is the deliberate trade for edge-to-edge. If a future word measures much
 * wider or narrower than ~923, check it before assuming full-bleed still works
 * — anything beyond roughly 0.85–1.1× starts to read as distorted.
 *
 * The badge lives INSIDE the SVG, not as an HTML element on top. That keeps it
 * locked to the N at every viewport for free: the whole band scales as one
 * picture, so the badge can never drift off the letter the way an absolutely
 * positioned div would. It is drawn last so it paints over the word.
 *
 * The viewBox is the original `0 0 1000 150` — no headroom. The badge is sized
 * and placed to sit wholly INSIDE the band, over the N, precisely so none is
 * needed: any negative-y headroom is dead space above the caps and shows up as
 * a gap between the nav and the word (58 units cost ~83px at 1440px).
 *
 * This badge is the one place the brand blue is allowed onto the band. It is a
 * deliberate exception to the tokens.css rule ("the active link, the two
 * buttons, the eyebrow, and the slider controls, and nothing else") because it
 * is a claim marker, not decoration.
 */
export function Wordmark() {
  return (
    <div className="wordmark" aria-hidden="true">
      <svg viewBox="0 0 1000 150" role="presentation">
        <defs>
          {/* Deliberately low contrast. This band is 1440×240 at desktop —
              roughly four times the width of the hair system in front of it —
              so whatever contrast it carries, it wins the first look on area
              alone. The banding is kept so it still reads as chrome; the dark
              stops are lifted out of mid-grey (#a7b0b8, #8d959d) into the
              #d3d9de–#c6ced5 range so the word reads as a surface behind the
              subject rather than as the headline. Darken these again and the
              eye goes straight back to the word. */}
          <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="10%" stopColor="#f2f4f6" />
            <stop offset="28%" stopColor="#d3d9de" />
            <stop offset="44%" stopColor="#fafbfc" />
            <stop offset="52%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#c6ced5" />
            <stop offset="74%" stopColor="#e2e7ea" />
            <stop offset="90%" stopColor="#f4f6f8" />
            <stop offset="100%" stopColor="#dce1e5" />
          </linearGradient>

          {/* The brand gradient, matched to --grad's 135deg direction. */}
          <linearGradient id="badgeFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4686fe" />
            <stop offset="100%" stopColor="#1769ff" />
          </linearGradient>

          {/* Lifts the badge off the letterform so it reads as sitting on top
              rather than punched into it. Tinted blue to match --shadow-btn. */}
          <filter id="badgeLift" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="2.5"
              floodColor="#1769ff"
              floodOpacity="0.38"
            />
          </filter>
        </defs>

        {/* Bevelled underside, sitting a few units low so the face above it
            reads as a lit edge rather than flat fill. */}
        <text
          className="wordmark__glyphs"
          x="500"
          y="147"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          textAnchor="middle"
          fill="#b8c0c7"
          opacity="0.32"
        >
          NATURAL
        </text>

        <text
          className="wordmark__glyphs"
          x="500"
          y="144"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          textAnchor="middle"
          fill="url(#chrome)"
        >
          NATURAL
        </text>

        {/* The 100% badge, drawn last so it sits over the N. Sat on the N's
            top-left corner with the label on a -25° tilt, per the reference.

            It deliberately overhangs the viewBox (top edge -8, left edge -5).
            That works because `.wordmark svg` sets `overflow: visible`, so the
            corner is NOT clipped — and it costs no layout height, unlike
            growing the viewBox, which would scale into a gap under the nav.

            The text rotates about the circle's own centre (25, 25) — the y is
            already offset from cy to sit optically centred, so rotating about
            that same point keeps it centred instead of swinging it off. */}
        <g className="wordmark__badgeMark" filter="url(#badgeLift)">
          <circle cx="18" cy="15" r="23" fill="url(#badgeFill)" />
          <text
            className="wordmark__badge"
            x="18"
            y="20"
            textAnchor="middle"
            transform="rotate(-25 18 15)"
            fill="#ffffff"
          >
            100%
          </text>
        </g>
      </svg>
    </div>
  )
}
