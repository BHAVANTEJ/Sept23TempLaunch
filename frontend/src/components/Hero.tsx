export function Hero() {
  const explore = () => document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="pill reveal reveal-one"><span className="pill-dot" />The platform engineers are talking about</p>
        <h1 className="reveal reveal-two">Skip the Hype.<br /><em>Learn What Works.</em></h1>
        <p className="hero-text reveal reveal-three">
          Not designed in a classroom. Built from the industry's perspective — the skills, tools, and systems companies are hiring for right now.
        </p>
        <p className="hero-text hero-text-tag reveal reveal-three">
          Learn What Actually Gets You <span className="ink-highlight">Hired</span>.
        </p>
        <div className="hero-actions reveal reveal-four">
          <button className="button button-primary" onClick={explore}>Get Early Access <span>↗</span></button>
        </div>
        <div className="hero-meta reveal reveal-four"><span className="meta-dot" />A new way to learn, connect, and grow</div>
      </div>

      <div className="hero-visual reveal reveal-image">
        <div className="dashboard-mock">
          <div className="dashboard-mock-header">
            <span className="dashboard-dot dashboard-dot-red" />
            <span className="dashboard-dot dashboard-dot-amber" />
            <span className="dashboard-dot dashboard-dot-green" />
            <span className="dashboard-path">&gt;_ gritskool/mastery.ts</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-icon">◆</span>
            <div>
              <strong>Full-Stack Engineering</strong>
              <span>React, Node.js, Cloud &amp; DevOps</span>
            </div>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-icon">◆</span>
            <div>
              <strong>AI &amp; Systems Design</strong>
              <span>LLMs, Architecture, Scalable Systems</span>
            </div>
          </div>
        </div>
      </div>

      <button className="scroll-cue" onClick={explore} aria-label="Scroll down to the countdown">
        <span className="scroll-arrow">↓</span>
        <span>Scroll down</span>
      </button>
    </section>
  );
}
