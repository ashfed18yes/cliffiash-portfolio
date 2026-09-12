import React, { useState } from 'react';
import type { PortfolioSection } from '../../hooks/useScrollChoreography';
import '../../styles/contact.css';

interface ContactSectionProps {
  scrollProgress: number;
  onNavigate?: (section: PortfolioSection) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  scrollProgress,
  onNavigate,
}) => {
  // Contact section emerges as user scrolls past projects (4.15 -> 4.5)
  const isVisible = scrollProgress >= 4.15;
  const progress = Math.max(0, Math.min(1, (scrollProgress - 4.15) / 0.35));

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!validateForm()) return;

    setStatus('submitting');
    try {
      const response = await fetch('https://formspree.io/f/mwlkzybz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
        setTimeout(() => {
          setStatus('idle');
        }, 6000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!isVisible) return null;

  return (
    <section
      className="contact-overlay-container"
      aria-label="Section 06 / Contact"
      style={{
        opacity: progress,
        pointerEvents: progress > 0.65 ? 'auto' : 'none',
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Left Column: Editorial Headline, Sub-copy & Social Connectors */}
      <div className="contact-left-content">
        <span className="contact-section-num">06</span>
        <h2 className="contact-title">
          <span>LET'S BUILD</span>
          <span>SOMETHING.</span>
        </h2>
        <div className="contact-subtitle">
          IDEAS TO PRODUCTS. / CONVERSATIONS TO OPPORTUNITIES. / YOU TO ME.
        </div>
        <div className="contact-divider" />
        <p className="contact-body">
          I'm always open to discussing new projects, creative ideas, internships or just
          having a good conversation about technology, design or the future.
        </p>

        {/* Real Contacts & Social Connectors */}
        <div className="contact-social-row">
          {/* GitHub Profile */}
          <a
            href="https://github.com/ashfed18yes"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-item"
            aria-label="GitHub Profile — See My Code"
          >
            <div className="contact-social-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </div>
            <div className="contact-social-meta">
              <span className="contact-social-label">GITHUB</span>
              <span className="contact-social-sub">See My Code</span>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/ankit-sharma-89371a250"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-item"
            aria-label="LinkedIn — Connect Professionally"
          >
            <div className="contact-social-circle">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div className="contact-social-meta">
              <span className="contact-social-label">LINKEDIN</span>
              <span className="contact-social-sub">Let's Connect</span>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/ashcliff_18"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-item"
            aria-label="Instagram — Follow My Journey"
          >
            <div className="contact-social-circle">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div className="contact-social-meta">
              <span className="contact-social-label">INSTAGRAM</span>
              <span className="contact-social-sub">Follow Journey</span>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919784508927"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-item"
            aria-label="WhatsApp — Chat Directly"
          >
            <div className="contact-social-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.528 5.845L.057 23.619a.75.75 0 00.92.921l5.932-1.477A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.95-1.354l-.356-.212-3.688.918.979-3.58-.232-.368A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
              </svg>
            </div>
            <div className="contact-social-meta">
              <span className="contact-social-label">WHATSAPP</span>
              <span className="contact-social-sub">Chat Directly</span>
            </div>
          </a>

          {/* Phone Call */}
          <a
            href="tel:+919784508927"
            className="contact-social-item"
            aria-label="Call — +91 95090 98408"
          >
            <div className="contact-social-circle">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.07 4a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <div className="contact-social-meta">
              <span className="contact-social-label">CALL</span>
              <span className="contact-social-sub">+91 97845 08927</span>
            </div>
          </a>

          {/* Email Direct Link */}
          <a
            href="mailto:ankitproff18@gmail.com"
            className="contact-social-item"
            aria-label="Direct Email — ankitproff18@gmail.com"
          >
            <div className="contact-social-circle">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="contact-social-meta">
              <span className="contact-social-label">EMAIL</span>
              <span className="contact-social-sub">ankitproff18@gmail.com</span>
            </div>
          </a>
        </div>
      </div>

      {/* Right Column: Physical Glassmorphic Form Container */}
      <div className="contact-form-container">
        <div className="contact-form-header-row">
          <h3 className="contact-form-heading">SEND A MESSAGE</h3>
          <div className="contact-status-badge">
            <span className="contact-status-dot" />
            <span>I'LL GET BACK TO YOU SOON</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="contact-form-grid">
            <div className="contact-input-wrap">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`contact-input ${errors.name ? 'input-error' : ''}`}
                disabled={status === 'submitting'}
                aria-label="Your Name"
              />
              {errors.name && <span className="contact-error-msg">{errors.name}</span>}
            </div>

            <div className="contact-input-wrap">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className={`contact-input ${errors.email ? 'input-error' : ''}`}
                disabled={status === 'submitting'}
                aria-label="Your Email"
              />
              {errors.email && <span className="contact-error-msg">{errors.email}</span>}
            </div>
          </div>

          <div className="contact-textarea-wrap" style={{ marginTop: '0.85rem' }}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project or idea..."
              className={`contact-textarea ${errors.message ? 'input-error' : ''}`}
              disabled={status === 'submitting'}
              aria-label="Your Message"
            />
            {errors.message && <span className="contact-error-msg">{errors.message}</span>}
          </div>

          <div className="contact-form-actions-row">
            {status === 'success' ? (
              <div className="contact-success-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Message sent! Thank you.</span>
              </div>
            ) : status === 'error' ? (
              <div className="contact-error-banner">
                <span>Failed to send. Please email directly.</span>
              </div>
            ) : (
              <button
                type="submit"
                className="contact-submit-btn"
                disabled={status === 'submitting'}
              >
                <span>{status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}</span>
                <span className="arrow-icon">↗</span>
              </button>
            )}

            <span className="contact-form-subtext">
              Let's create something amazing together.
            </span>
          </div>
        </form>
      </div>

      {/* Lower Left: Scroll To Top Control */}
      <div
        className="contact-scroll-top-control"
        role="button"
        tabIndex={0}
        aria-label="Scroll to top of page"
        onClick={() => onNavigate?.('hero')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNavigate?.('hero');
          }
        }}
      >
        <div className="contact-scroll-circle">
          <span className="dot" />
        </div>
        <div className="contact-scroll-text">
          <span>SCROLL</span>
          <span>TO TOP</span>
        </div>
      </div>

      {/* Bottom Timeline Bar */}
      <footer className="contact-bottom-bar" aria-label="Contact Section Footer">
        <div className="contact-timeline-track">
          <div className="contact-timeline-line">
            <span className="contact-timeline-active-dot" />
          </div>
          <div className="contact-timeline-labels-row">
            <div className="contact-timeline-labels">
              <div
                className="contact-timeline-item"
                role="link"
                tabIndex={0}
                onClick={() => onNavigate?.('hero')}
              >
                <span className="num">01</span>
                <span className="name">HOME</span>
              </div>
              <div
                className="contact-timeline-item"
                role="link"
                tabIndex={0}
                onClick={() => onNavigate?.('skills')}
              >
                <span className="num">02</span>
                <span className="name">SKILLS</span>
              </div>
              <div
                className="contact-timeline-item"
                role="link"
                tabIndex={0}
                onClick={() => onNavigate?.('projects')}
              >
                <span className="num">03</span>
                <span className="name">PROJECTS</span>
              </div>
              <div className="contact-timeline-item">
                <span className="num">04</span>
                <span className="name">EXPERIENCE</span>
              </div>
              <div className="contact-timeline-item">
                <span className="num">05</span>
                <span className="name">CREATIVE</span>
              </div>
              <div className="contact-timeline-item active">
                <span className="num">06</span>
                <span className="name">CONTACT</span>
              </div>
            </div>

            <div className="contact-footer-meta">
              <span>THINK → BUILD → IMPACT</span>
              <span className="contact-footer-copy">
                © {new Date().getFullYear()} ANKIT SHARMA. ALL RIGHTS RESERVED.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};
