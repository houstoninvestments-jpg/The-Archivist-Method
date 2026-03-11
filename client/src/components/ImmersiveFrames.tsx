import React, { useEffect, useRef, useState } from 'react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TEAL = '#00FFD1';
const MAGENTA = '#FF2D9B';
const ROSE = '#FF2D9B';

// ─── HOOK: FIRES ONCE WHEN VISIBLE, NEVER RESETS ─────────────────────────────
function useOnceVisible(ref: React.RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.intersectionRatio >= 0.3) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, visible]);

  return visible;
}

// ─── STAGGERED TEXT ELEMENT ───────────────────────────────────────────────────
interface StaggeredElProps {
  delay: number;
  active: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

function StaggeredEl({ delay, active, children, style, className }: StaggeredElProps) {
  return (
    <div
      className={className}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(-20px)',
        transition: `opacity 600ms cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 600ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── SHARED IMAGE + OVERLAY ───────────────────────────────────────────────────
function FrameBg({ src }: { src: string }) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 15%',
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

// ─── FRAME WRAPPER STYLE ──────────────────────────────────────────────────────
function frameWrapStyle(justifyContent: string): React.CSSProperties {
  return {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent,
    textAlign: 'center',
    paddingLeft: '24px',
    paddingRight: '24px',
  };
}

// ─── FRAME 01 — THE HIT ───────────────────────────────────────────────────────
function Frame01() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOnceVisible(ref as React.RefObject<HTMLElement>);

  useEffect(() => {
    console.log('[Frame01] image path:', '/images/frame-01.png');
  }, []);

  return (
    <div ref={ref} style={{ ...frameWrapStyle('flex-start'), paddingTop: '15vh' }}>
      <FrameBg src="/images/frame-01.png" />

      {/* Text layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Line 1 — monospace teal label */}
        <StaggeredEl delay={0} active={active}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: TEAL,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            SIGNAL DETECTED · T+0.0S
          </div>
        </StaggeredEl>

        {/* Line 2 — Bebas Neue headline */}
        <StaggeredEl delay={400} active={active}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              color: '#FAFAFA',
              lineHeight: 0.95,
              marginBottom: '1.5rem',
            }}
          >
            <div>YOUR BODY DECIDED</div>
            <div>BEFORE YOU DID.</div>
          </div>
        </StaggeredEl>

        {/* Line 3 — EB Garamond italic */}
        <StaggeredEl delay={800} active={active} style={{ marginTop: '2rem' }}>
          <div
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: '#FAFAFA',
            }}
          >
            <div>That's not weakness.</div>
            <div>That's wiring.</div>
          </div>
        </StaggeredEl>
      </div>
    </div>
  );
}

// ─── FRAME 02 — THE BROADCAST ─────────────────────────────────────────────────
function Frame02() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOnceVisible(ref as React.RefObject<HTMLElement>);
  const [labelActive, setLabelActive] = useState([false, false, false]);

  useEffect(() => {
    console.log('[Frame02] image path:', '/images/frame-02.png');
  }, []);

  // Scroll-progress based label triggers
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const frameHeight = ref.current.offsetHeight;
      // progress = how far frame top has scrolled past viewport top
      const progress = -rect.top / frameHeight;
      setLabelActive([
        progress >= 0.20,
        progress >= 0.45,
        progress >= 0.70,
      ]);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check on mount in case already scrolled
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const symptoms = [
    { label: 'THROAT CLOSES', top: '22%' },
    { label: 'CHEST DROPS', top: '42%' },
    { label: 'HANDS GO COLD', top: '62%' },
  ];

  return (
    <div
      ref={ref}
      style={{
        ...frameWrapStyle('flex-end'),
        paddingBottom: '10vh',
      }}
    >
      <FrameBg src="/images/frame-02.png" />

      {/* Absolutely positioned diagnostic labels */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        {symptoms.map(({ label, top }, index) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              top,
              right: '22%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              opacity: labelActive[index] ? 1 : 0,
              transition: 'opacity 600ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {/* Teal line points LEFT toward the body — transformOrigin: left */}
            <div
              style={{
                width: '50px',
                height: '1px',
                background: TEAL,
                flexShrink: 0,
                transform: labelActive[index] ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                color: MAGENTA,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom zone — big Bebas statement, unchanged */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <StaggeredEl delay={1200} active={active}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              color: '#FAFAFA',
              lineHeight: 1,
            }}
          >
            THAT'S THE SIGNAL.
          </div>
        </StaggeredEl>

        <StaggeredEl delay={1400} active={active}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(1.5rem, 5vw, 4rem)',
              color: TEAL,
              lineHeight: 1,
            }}
          >
            THAT'S YOUR WINDOW.
          </div>
        </StaggeredEl>
      </div>
    </div>
  );
}

// ─── FRAME 03 — THE WINDOW ────────────────────────────────────────────────────
function Frame03() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOnceVisible(ref as React.RefObject<HTMLElement>);

  useEffect(() => {
    console.log('[Frame03] image path:', '/images/frame-03.png');
  }, []);

  const windowLines = [
    { text: 'THE WINDOW IS REAL.', delay: 1800 },
    { text: 'IT IS MEASURABLE.', delay: 2100 },
    { text: 'IT IS YOURS.', delay: 2400 },
  ];

  return (
    <div ref={ref} style={frameWrapStyle('center')}>
      <FrameBg src="/images/frame-03.png" />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* "3 TO 7 SECONDS." */}
        <StaggeredEl delay={0} active={active}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(4rem, 14vw, 10rem)',
              color: '#FAFAFA',
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
          >
            <div>3 TO 7</div>
            <div>SECONDS.</div>
          </div>
        </StaggeredEl>

        {/* Teal divider line draws left to right */}
        <div
          style={{
            width: active ? '50vw' : '0',
            height: '1px',
            background: TEAL,
            margin: '2rem auto',
            transition: 'width 1200ms ease-in-out 600ms',
          }}
        />

        {/* Three staggered lines */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {windowLines.map(({ text, delay }) => (
            <StaggeredEl key={text} delay={delay} active={active}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1rem, 3.5vw, 2.5rem)',
                  color: '#FAFAFA',
                  letterSpacing: '0.05em',
                }}
              >
                {text}
              </div>
            </StaggeredEl>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FRAME 04 — THE SPLIT ─────────────────────────────────────────────────────
function Frame04() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOnceVisible(ref as React.RefObject<HTMLElement>);

  useEffect(() => {
    console.log('[Frame04] image path:', '/images/frame-04.png');
  }, []);

  return (
    <div ref={ref} style={frameWrapStyle('center')}>
      <FrameBg src="/images/frame-04.png" />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* "YOU ARE NOT THAT CHILD ANYMORE." */}
        <StaggeredEl delay={0} active={active}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 11vw, 8rem)',
              color: '#FAFAFA',
              lineHeight: 0.9,
            }}
          >
            <div>YOU ARE NOT</div>
            <div>THAT CHILD</div>
            <div>ANYMORE.</div>
          </div>
        </StaggeredEl>

        {/* Gap */}
        <div style={{ height: '2.5rem' }} />

        {/* "[ THIS IS LEARNABLE ]" */}
        <StaggeredEl delay={1200} active={active}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
              color: TEAL,
              letterSpacing: '0.3em',
              border: `1px solid ${TEAL}`,
              padding: '10px 28px',
              display: 'inline-block',
              textTransform: 'uppercase',
            }}
          >
            [ THIS IS LEARNABLE ]
          </div>
        </StaggeredEl>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function ImmersiveFrames() {
  return (
    <section
      aria-label="Immersive Frames — Pattern Archaeology"
      style={{ background: '#0a0a0a' }}
    >
      {/* Section header */}
      <div style={{ borderBottom: '1px solid #1E293B', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ height: '1px', flex: 1, background: TEAL, opacity: 0.3 }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 700,
                padding: '0 0.75rem',
              }}
            >
              THE WINDOW SCIENCE
            </span>
            <div style={{ height: '1px', flex: 1, background: TEAL, opacity: 0.3 }} />
          </div>

          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#FAFAFA',
              textAlign: 'center',
              margin: '0 0 1rem 0',
              lineHeight: 1.1,
            }}
          >
            Pattern Archaeology,{' '}
            <span style={{ color: ROSE }}>NOT</span> Therapy.
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
              color: '#94A3B8',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Four moments. Each one lives in your nervous system right now.
          </p>
        </div>
      </div>

      {/* Frames — 100vh each, stacked vertically */}
      <Frame01 />
      <Frame02 />
      <Frame03 />
      <Frame04 />
    </section>
  );
}
