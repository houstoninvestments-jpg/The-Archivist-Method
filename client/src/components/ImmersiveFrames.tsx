import React, { useEffect, useRef, useState } from 'react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TEAL = '#00FFD1';
const MAGENTA = '#FF2D9B';
const ROSE = '#EC4899';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type FrameState = 'idle' | 'active' | 'exit';

// ─── HOOK: INTERSECTION OBSERVER ─────────────────────────────────────────────
function useFrameState(ref: React.RefObject<HTMLElement | null>): FrameState {
  const [state, setState] = useState<FrameState>('idle');
  const prevRatio = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const ratio = entry.intersectionRatio;

        if (ratio >= 0.3 && prevRatio.current < 0.3) {
          setState('active');
        } else if (ratio < 0.3 && prevRatio.current >= 0.3) {
          setState('exit');
          const t = setTimeout(() => setState('idle'), 300);
          return () => clearTimeout(t);
        }
        prevRatio.current = ratio;
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return state;
}

// ─── STAGGERED TEXT ELEMENT ───────────────────────────────────────────────────
interface StaggeredElProps {
  delay: number;
  active: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  isMobile?: boolean;
}

function StaggeredEl({ delay, active, children, style, className, isMobile }: StaggeredElProps) {
  const mobileDelay = isMobile ? delay * 0.5 : delay;
  return (
    <div
      className={className}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(-20px)',
        transition: `opacity 600ms cubic-bezier(0.4,0,0.2,1) ${mobileDelay}ms, transform 600ms cubic-bezier(0.4,0,0.2,1) ${mobileDelay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── TEAL SCAN LINE ───────────────────────────────────────────────────────────
function TealLine({ delay, active, isMobile }: { delay: number; active: boolean; isMobile: boolean }) {
  const mobileDelay = isMobile ? delay * 0.5 : delay;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30%',
        left: 0,
        height: '1px',
        background: TEAL,
        width: active ? '100%' : '0%',
        transition: `width 1500ms cubic-bezier(0.4,0,0.2,1) ${mobileDelay}ms`,
        pointerEvents: 'none',
      }}
    />
  );
}

// ─── DIAGNOSTIC LABEL (Frame 02) ─────────────────────────────────────────────
interface DiagLabelProps {
  delay: number;
  active: boolean;
  label: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  isMobile: boolean;
}

function DiagLabel({ delay, active, label, top, left, right, bottom, isMobile }: DiagLabelProps) {
  const mobileDelay = isMobile ? delay * 0.5 : delay;
  return (
    <div
      style={{
        position: isMobile ? 'relative' : 'absolute',
        top: isMobile ? undefined : top,
        left: isMobile ? undefined : left,
        right: isMobile ? undefined : right,
        bottom: isMobile ? undefined : bottom,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: active ? 1 : 0,
        transition: `opacity 600ms cubic-bezier(0.4,0,0.2,1) ${mobileDelay}ms`,
      }}
    >
      <div
        style={{
          width: active ? '60px' : '0px',
          height: '1px',
          background: TEAL,
          transition: `width 400ms cubic-bezier(0.4,0,0.2,1) ${mobileDelay}ms`,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: MAGENTA,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── FRAME 01 — THE HIT ───────────────────────────────────────────────────────
function Frame01({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useFrameState(ref as React.RefObject<HTMLElement>);
  const active = state === 'active';

  return (
    <div
      ref={ref}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/frame-01.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: active ? 0.85 : 0,
          transition: 'opacity 800ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
          pointerEvents: 'none',
        }}
      />

      {/* Text layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '0 1.5rem',
          textAlign: 'center',
          maxWidth: '900px',
        }}
      >
        {/* Element 1 */}
        <StaggeredEl delay={0} active={active} isMobile={isMobile}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: TEAL,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            SIGNAL DETECTED · T+0.0S
          </span>
        </StaggeredEl>

        {/* Element 2 */}
        <StaggeredEl delay={400} active={active} isMobile={isMobile}>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? '12vw' : '8vw',
              color: '#FAFAFA',
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            YOUR BODY ALREADY DECIDED.
          </h2>
        </StaggeredEl>

        {/* Element 3 */}
        <StaggeredEl delay={800} active={active} isMobile={isMobile}>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: '1.4rem',
              color: MAGENTA,
              margin: 0,
              maxWidth: '600px',
            }}
          >
            Before you heard it. Before you saw it. Before you had a choice.
          </p>
        </StaggeredEl>
      </div>

      {/* Element 4 — bottom right */}
      <StaggeredEl
        delay={1400}
        active={active}
        isMobile={isMobile}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: TEAL,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          SUBCORTICAL REFLEX · WILLPOWER ARRIVES 2.3S LATER
        </span>
      </StaggeredEl>
    </div>
  );
}

// ─── FRAME 02 — THE BROADCAST ─────────────────────────────────────────────────
function Frame02({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useFrameState(ref as React.RefObject<HTMLElement>);
  const active = state === 'active';

  return (
    <div
      ref={ref}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/frame-02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: active ? 0.85 : 0,
          transition: 'opacity 800ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'none',
        }}
      />

      {/* Element 1 — top left */}
      <StaggeredEl
        delay={0}
        active={active}
        isMobile={isMobile}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: TEAL,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          SIGNAL_TYPE: INTEROCEPTIVE
        </span>
      </StaggeredEl>

      {/* Diagnostic labels — hotspot positions */}
      {!isMobile ? (
        <>
          <DiagLabel
            delay={300}
            active={active}
            label="THROAT CLOSES"
            top="25%"
            left="52%"
            isMobile={false}
          />
          <DiagLabel
            delay={600}
            active={active}
            label="CHEST DROPS"
            top="42%"
            left="52%"
            isMobile={false}
          />
          <DiagLabel
            delay={900}
            active={active}
            label="HANDS GO COLD"
            top="62%"
            left="52%"
            isMobile={false}
          />
        </>
      ) : (
        /* Mobile: center stacked */
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 2,
          }}
        >
          <DiagLabel delay={300} active={active} label="THROAT CLOSES" isMobile={true} />
          <DiagLabel delay={600} active={active} label="CHEST DROPS" isMobile={true} />
          <DiagLabel delay={900} active={active} label="HANDS GO COLD" isMobile={true} />
        </div>
      )}

      {/* Center text */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '800px',
          marginTop: isMobile ? '8rem' : '0',
        }}
      >
        {/* Element 5 */}
        <StaggeredEl delay={1400} active={active} isMobile={isMobile}>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? '12vw' : '7vw',
              color: '#FAFAFA',
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            THIS IS NOT ANXIETY.
          </h2>
        </StaggeredEl>

        {/* Element 6 */}
        <StaggeredEl delay={1900} active={active} isMobile={isMobile}>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: '1.3rem',
              color: MAGENTA,
              margin: 0,
              maxWidth: '560px',
            }}
          >
            This is your pattern loading. 3 seconds before you act.
          </p>
        </StaggeredEl>
      </div>
    </div>
  );
}

// ─── FRAME 03 — THE WINDOW ────────────────────────────────────────────────────
function Frame03({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useFrameState(ref as React.RefObject<HTMLElement>);
  const active = state === 'active';

  return (
    <div
      ref={ref}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/frame-03.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: active ? 0.85 : 0,
          transition: 'opacity 800ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {/* Lighter teal-tinted overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}
      />

      {/* Teal scan line — Element 3 */}
      <TealLine delay={isMobile ? 600 : 1200} active={active} isMobile={isMobile} />

      {/* Text layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '900px',
        }}
      >
        {/* Element 1 */}
        <StaggeredEl delay={0} active={active} isMobile={isMobile}>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? '18vw' : '12vw',
              color: '#FAFAFA',
              lineHeight: 0.85,
              margin: 0,
              transform: active ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1) 0ms, opacity 600ms cubic-bezier(0.4,0,0.2,1) 0ms',
            }}
          >
            3 TO 7 SECONDS.
          </h2>
        </StaggeredEl>

        {/* Element 2 */}
        <StaggeredEl delay={600} active={active} isMobile={isMobile}>
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? '6vw' : '3.5vw',
              color: '#FAFAFA',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            THE ONLY MOMENT THAT HAS EVER MATTERED.
          </h3>
        </StaggeredEl>

        {/* Element 4 — after line completes */}
        <StaggeredEl delay={isMobile ? 1400 : 2800} active={active} isMobile={isMobile}>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: '1.3rem',
              color: TEAL,
              margin: 0,
              maxWidth: '560px',
            }}
          >
            Your body found it. Now you know where to look.
          </p>
        </StaggeredEl>
      </div>
    </div>
  );
}

// ─── FRAME 04 — THE SPLIT ─────────────────────────────────────────────────────
function Frame04({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useFrameState(ref as React.RefObject<HTMLElement>);
  const active = state === 'active';

  return (
    <div
      ref={ref}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/frame-04.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: active ? 0.85 : 0,
          transition: 'opacity 800ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}
      />

      {/* Element 1 — far left */}
      {!isMobile && (
        <StaggeredEl
          delay={0}
          active={active}
          isMobile={isMobile}
          style={{
            position: 'absolute',
            left: '4%',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: MAGENTA,
              opacity: 0.6,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              lineHeight: 1.8,
            }}
          >
            <div>DEFAULT ROUTE</div>
            <div>PATTERN EXECUTED</div>
          </div>
        </StaggeredEl>
      )}

      {/* Element 2 — far right */}
      {!isMobile && (
        <StaggeredEl
          delay={0}
          active={active}
          isMobile={isMobile}
          style={{
            position: 'absolute',
            right: '4%',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: TEAL,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              lineHeight: 1.8,
              textAlign: 'right',
            }}
          >
            <div>NEW ROUTE</div>
            <div>INTERRUPT DEPLOYED</div>
          </div>
        </StaggeredEl>
      )}

      {/* Center text layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '700px',
        }}
      >
        {/* Element 3 */}
        <StaggeredEl delay={800} active={active} isMobile={isMobile}>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? '12vw' : '7vw',
              color: '#FAFAFA',
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            YOU ARE NOT<br />THAT CHILD<br />ANYMORE.
          </h2>
        </StaggeredEl>

        {/* Element 4 */}
        <StaggeredEl delay={1600} active={active} isMobile={isMobile}>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: '1.2rem',
              color: '#FAFAFA',
              margin: 0,
              maxWidth: '480px',
            }}
          >
            One trained response. That's all it takes.
          </p>
        </StaggeredEl>

        {/* Element 5 */}
        <StaggeredEl delay={isMobile ? 1200 : 2400} active={active} isMobile={isMobile}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              color: TEAL,
              letterSpacing: '0.3em',
              border: `1px solid ${TEAL}`,
              padding: '8px 24px',
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

// ─── BLACK GAP ────────────────────────────────────────────────────────────────
function BlackGap() {
  return (
    <div
      style={{
        height: '500px',
        background: '#000000',
        position: 'relative',
        zIndex: 1,
      }}
    />
  );
}

// ─── FRAME WRAPPER (sticky scroll container) ──────────────────────────────────
function FrameWrapper({ children, isMobile }: { children: React.ReactNode; isMobile: boolean }) {
  return (
    <div
      style={{
        height: isMobile ? '100vh' : '200vh',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function ImmersiveFrames() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section
      aria-label="Immersive Frames — Pattern Archaeology"
      style={{ background: '#0a0a0a' }}
    >
      {/* Section header */}
      <div
        style={{
          borderBottom: '1px solid #1E293B',
          padding: '4rem 2rem',
        }}
      >
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

      {/* Frame 01 */}
      <FrameWrapper isMobile={isMobile}>
        <Frame01 isMobile={isMobile} />
      </FrameWrapper>

      <BlackGap />

      {/* Frame 02 */}
      <FrameWrapper isMobile={isMobile}>
        <Frame02 isMobile={isMobile} />
      </FrameWrapper>

      <BlackGap />

      {/* Frame 03 */}
      <FrameWrapper isMobile={isMobile}>
        <Frame03 isMobile={isMobile} />
      </FrameWrapper>

      <BlackGap />

      {/* Frame 04 */}
      <FrameWrapper isMobile={isMobile}>
        <Frame04 isMobile={isMobile} />
      </FrameWrapper>
    </section>
  );
}
