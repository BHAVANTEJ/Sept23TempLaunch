export function Hero() {
  const explore = () => document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="pill reveal reveal-one hero-eyebrow"><span className="pill-dot" />The platform engineers are talking about</p>
        <h1 className="reveal reveal-two">
          Learn What
          <br />
          Actually
          {' '}
          <br />
          Gets You <span className="ink-highlight">Hired</span>
        </h1>
        <p className="hero-text reveal reveal-three">
          Not designed in a classroom. Built from the industry's perspective — the skills, tools, and systems companies are hiring for right now.
        </p>
      </div>

      <div className="hero-visual reveal reveal-image">
        <div className="hero-photo-card">
          <img src="/hero-photo.jpg" alt="A learner working through a GritSkool lesson" />
        </div>
        <div className="hero-photo-caption">
          <span className="caption-line" />
          <span>Built for what comes next</span>
          <span className="caption-line" />
        </div>
      </div>

      <button className="scroll-cue" onClick={explore} aria-label="Scroll down to the countdown">
        <span>Scroll down</span>
        <span className="scroll-arrow-circle"><span className="scroll-arrow">↓</span></span>
      </button>
    </section>
  );
}
