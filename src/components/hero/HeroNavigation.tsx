import type { PortfolioSection } from '../../hooks/useScrollChoreography';

interface HeroNavigationProps {
  scrollProgress?: number;
  onNavigate?: (section: PortfolioSection) => void;
}

export const HeroNavigation: React.FC<HeroNavigationProps> = ({
  scrollProgress = 0,
  onNavigate,
}) => {
  const activeBadge =
    scrollProgress < 0.75
      ? '01 / HOME'
      : scrollProgress < 2.65
      ? '02 / SKILLS'
      : scrollProgress < 4.25
      ? '03 / PROJECTS'
      : '06 / CONTACT';

  return (
    <header className="hero-header" role="banner">
      <div
        className="hero-header-left"
        onClick={() => onNavigate?.('hero')}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Return to top"
      >
        <div className="hero-monogram" aria-label="Ankit Sharma Initials">
          <span className="hero-monogram-text">AS</span>
        </div>
        <div className="hero-brand-meta">
          <span className="hero-brand-name">ANKIT SHARMA</span>
          <span className="hero-brand-tagline">BUILDING WHAT'S NEXT</span>
        </div>
      </div>

      {/* Dynamic Center Section Indicator */}
      <div className="hero-header-center" aria-live="polite">
        <span className="hero-center-dot">•</span>
        <span className="hero-center-badge">{activeBadge}</span>
      </div>

      <nav className="hero-header-right" aria-label="Main Navigation">
        <ul className="hero-nav-links">
          <li className="hero-nav-item">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('projects');
              }}
            >
              WORK
            </a>
          </li>
          <li className="hero-nav-item">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('hero');
              }}
            >
              ABOUT
            </a>
          </li>
          <li className="hero-nav-item">
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('skills');
              }}
            >
              EXPERIENCE
            </a>
          </li>
          <li className="hero-nav-item">
            <a
              href="#creative"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('skills');
              }}
            >
              CREATIVE
            </a>
          </li>
          <li className="hero-nav-item">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('contact');
              }}
            >
              CONTACT
            </a>
          </li>
        </ul>

        <button className="hero-nav-dots-btn" aria-label="Quick Actions Menu">
          <span className="hero-dot-icon" />
          <span className="hero-dot-icon" />
        </button>
      </nav>
    </header>
  );
};
