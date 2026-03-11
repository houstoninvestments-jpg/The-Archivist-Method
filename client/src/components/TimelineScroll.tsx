import React, { useEffect, useRef, useState } from 'react';

const TEAL = '#00FFD1';
const MAGENTA = '#FF2D9B';
const ROSE = '#EC4899'; // for "NOT" in section header

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// ─── MOBILE STATEMENT BLOCK ───────────────────────────────────────────────────

interface BlockPart {
  text: string;
  highlight?: boolean;
}

interface MobileBlockProps {
  parts: BlockPart[];
  subtext: string;
  stamp?: string;
}

function MobileBlock({ parts, subtext, stamp }: MobileBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ padding: '72px 24px', borderTop: '1px solid #111' }}>
      <h2
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(2.2rem, 8vw, 4.5rem)',
          lineHeight: 1.05,
          color: '#FAFAFA',
          marginBottom: '28px',
          letterSpacing: '0.02em',
        }}
      >
        {parts.map((p, i) =>
          p.highlight
            ? <span key={i} style={{ color: MAGENTA }}>{p.text}</span>
            : <span key={i}>{p.text}</span>
        )}
      </h2>
      {/* Teal line that draws on scroll enter */}
      <div
        style={{
          height: '2px',
          background: TEAL,
          boxShadow: inView ? `0 0 12px ${TEAL}88` : 'none',
          width: inView ? '100%' : '0%',
          transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.9s ease',
          marginBottom: '28px',
        }}
      />
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.85rem',
          color: '#666',
          lineHeight: 1.7,
        }}
      >
        {subtext}
      </p>
      {stamp && (
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.95rem',
            color: TEAL,
            marginTop: '24px',
            letterSpacing: '0.1em',
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.6s ease 0.8s',
          }}
        >
          {stamp}
        </p>
      )}
    </div>
  );
}

// ─── SVG TIMELINE VISUALIZATION ───────────────────────────────────────────────

function TimelineViz({ progress }: { progress: number }) {
  // Per-zone progress values (each 0→1)
  const z1 = clamp(progress / 0.33, 0, 1);
  const z2 = clamp((progress - 0.33) / 0.33, 0, 1);
  const z3 = clamp((progress - 0.66) / 0.34, 0, 1);

  // Zone 1 — spike
  const spikeScale   = clamp(z1 / 0.3, 0, 1);
  const spikeOpacity = clamp(z1 / 0.2, 0, 1);

  // Zone 2 — corridor
  const corridorOpacity = clamp(z2 / 0.35, 0, 1) * clamp(1 - (z3 - 0.1) / 0.4, 0, 1);

  // Zone 3 — split
  const splitDraw       = clamp(z3 / 0.65, 0, 1);
  const magentaOpacity  = clamp(z3 / 0.2, 0, 1) * clamp(1 - (z3 - 0.45) / 0.35, 0, 1);
  const tealPathOpacity = clamp(z3 / 0.2, 0, 1);
  const tealExtOpacity  = tealPathOpacity * clamp((z3 - 0.5) / 0.3, 0, 1);
  const particlesVisible = z3 > 0.3;

  const MAGENTA_DASH = 700;
  const TEAL_DASH    = 750;

  return (
    <svg
      viewBox="0 0 1000 380"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: 'visible', display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        {/* Teal glow filter */}
        <filter id="ts-tealGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Magenta glow filter */}
        <filter id="ts-magentaGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Corridor vertical gradient */}
        <linearGradient id="ts-corridorFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={TEAL} stopOpacity="0" />
          <stop offset="20%"  stopColor={TEAL} stopOpacity="0.12" />
          <stop offset="50%"  stopColor={TEAL} stopOpacity="0.07" />
          <stop offset="80%"  stopColor={TEAL} stopOpacity="0.12" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
        {/* Magenta path fade (dissolves before right edge) */}
        <linearGradient
          id="ts-magentaFadeGrad"
          x1="500" y1="0" x2="1000" y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="35%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="ts-magentaMask">
          <rect x="0" y="0" width="1200" height="380" fill="url(#ts-magentaFadeGrad)" />
        </mask>
        {/* Teal motion path for particles */}
        <path
          id="ts-tealMotionPath"
          d="M 500,190 C 620,190 780,155 1050,105"
          fill="none"
          stroke="none"
        />
      </defs>

      {/* ── Resting baseline ── */}
      <line x1="0" y1="190" x2="1000" y2="190" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* ── ZONE 1: Magenta spike ── */}
      {/*
        SVG transform sequence (applied right→left):
          1. translate(0,-190) — move baseline to y=0
          2. scale(1, spikeScale) — compress spike to 0 height
          3. translate(0,190) — restore baseline to y=190
        At spikeScale=0 everything flattens to y=190 (baseline).
      */}
      <g
        transform={`translate(0,190) scale(1,${spikeScale}) translate(0,-190)`}
        opacity={spikeOpacity}
      >
        {/* Ambient fill — very subtle */}
        <path
          d="M 80,190 L 140,190 L 158,196 L 173,20 L 185,248 L 195,185 L 208,196 L 220,190 L 330,190 Z"
          stroke="none"
          fill={MAGENTA}
          fillOpacity="0.06"
        />
        {/* Spike stroke — cardiac-monitor style */}
        <path
          d="M 0,190 L 140,190 L 158,196 L 173,20 L 185,248 L 195,185 L 208,196 L 220,190 L 500,190"
          stroke={MAGENTA}
          strokeWidth="2"
          fill="none"
          filter="url(#ts-magentaGlow)"
        />
      </g>

      {/* ── ZONE 2: Teal corridor ── */}
      <g opacity={corridorOpacity}>
        {/* Interior fill */}
        <rect x="484" y="15" width="32" height="350" fill="url(#ts-corridorFill)" />
        {/* Left glowing edge — pulsing */}
        <line x1="484" y1="15" x2="484" y2="365" stroke={TEAL} strokeWidth="1" opacity="0.85" filter="url(#ts-tealGlow)">
          <animate attributeName="opacity" values="0.85;0.4;0.85" dur="2.2s" repeatCount="indefinite" />
        </line>
        {/* Right glowing edge — pulsing, offset */}
        <line x1="516" y1="15" x2="516" y2="365" stroke={TEAL} strokeWidth="1" opacity="0.85" filter="url(#ts-tealGlow)">
          <animate attributeName="opacity" values="0.85;0.4;0.85" dur="2.2s" begin="0.55s" repeatCount="indefinite" />
        </line>
        {/* 3–7S etched label */}
        <text
          x="500"
          y="196"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={TEAL}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="18"
          fontWeight="bold"
          letterSpacing="2"
        >
          3–7S
        </text>
      </g>

      {/* ── ZONE 3: Diverging paths ── */}

      {/* Magenta path — curves downward, dissolves before right edge */}
      <path
        d="M 500,190 C 620,190 780,240 1050,300"
        stroke={MAGENTA}
        strokeWidth="2"
        fill="none"
        mask="url(#ts-magentaMask)"
        opacity={magentaOpacity}
        strokeDasharray={MAGENTA_DASH}
        strokeDashoffset={MAGENTA_DASH * (1 - splitDraw)}
      />

      {/* Teal path — curves upward toward right edge */}
      <path
        d="M 500,190 C 620,190 780,155 1050,105"
        stroke={TEAL}
        strokeWidth="2"
        fill="none"
        filter="url(#ts-tealGlow)"
        opacity={tealPathOpacity}
        strokeDasharray={TEAL_DASH}
        strokeDashoffset={TEAL_DASH * (1 - splitDraw)}
      />

      {/* Teal extension — continues off-screen right, implying forever */}
      <path
        d="M 1050,105 L 1250,72"
        stroke={TEAL}
        strokeWidth="2"
        fill="none"
        filter="url(#ts-tealGlow)"
        opacity={tealExtOpacity}
      />

      {/* Neuron particles animating along teal path */}
      {particlesVisible && [0, 0.5, 1.0, 1.5, 2.0].map((begin, i) => (
        <circle key={i} r="3" fill={TEAL} opacity={0.85} filter="url(#ts-tealGlow)">
          <animateMotion dur="2.5s" begin={`${begin}s`} repeatCount="indefinite">
            <mpath href="#ts-tealMotionPath" />
          </animateMotion>
        </circle>
      ))}
    </svg>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function TimelineScroll() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  // Responsive breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Desktop scroll progress (0→1 through the 400vh sticky section)
  useEffect(() => {
    if (isMobile) return;
    const el = outerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const totalDist = el.offsetHeight - window.innerHeight; // 300vh
      setScrollProgress(clamp(-rect.top / totalDist, 0, 1));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // seed on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  // Per-zone progress
  const z1 = clamp(scrollProgress / 0.33, 0, 1);
  const z2 = clamp((scrollProgress - 0.33) / 0.33, 0, 1);
  const z3 = clamp((scrollProgress - 0.66) / 0.34, 0, 1);

  // Zone text opacity — crossfade between zones
  const text1Alpha = Math.min(z1 / 0.2, 1) * Math.max(1 - z2 / 0.35, 0);
  const text2Alpha = Math.min(z2 / 0.2, 1) * Math.max(1 - z3 / 0.35, 0);
  const text3Alpha = Math.min(z3 / 0.2, 1);
  const learnableAlpha = clamp((z3 - 0.7) / 0.3, 0, 1);

  const textLayerStyle = (alpha: number): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 8%',
    opacity: alpha,
    pointerEvents: 'none',
  });

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)',
    color: '#FAFAFA',
    lineHeight: 1.05,
    marginBottom: '14px',
    letterSpacing: '0.03em',
  };

  const subtextStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.78rem',
    color: '#555',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };

  return (
    <section style={{ background: '#0a0a0a' }} aria-label="The Window Science — Timeline">

      {/* ── SECTION HEADER (normal flow, above sticky area) ── */}
      <div style={{ borderBottom: '1px solid #111', padding: '80px 32px 64px' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          {/* Teal spaced-caps label */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            justifyContent: 'center',
          }}>
            <div style={{ height: '1px', flex: 1, background: `${TEAL}44` }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              color: TEAL,
              textTransform: 'uppercase',
              padding: '0 12px',
            }}>
              The Window Science
            </span>
            <div style={{ height: '1px', flex: 1, background: `${TEAL}44` }} />
          </div>
          {/* Main heading */}
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: '#FAFAFA',
            lineHeight: 1.05,
            marginBottom: '20px',
            letterSpacing: '0.02em',
          }}>
            Pattern Archaeology,{' '}
            <span style={{ color: ROSE }}>NOT</span>
            {' '}Therapy.
          </h2>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.85rem',
            color: '#666',
            lineHeight: 1.7,
            maxWidth: '36rem',
            margin: '0 auto',
          }}>
            Three demonstrations. Each one proves the same thing: the window exists,
            it's measurable, and learning to find it is a skill — not a personality trait.
          </p>
        </div>
      </div>

      {/* ── DESKTOP: STICKY SCROLL (400vh outer, 100vh inner) ── */}
      {!isMobile && (
        <div ref={outerRef} style={{ position: 'relative', height: '400vh' }}>
          <div style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0a0a',
          }}>

            {/* Zone text — top 40% of viewport */}
            <div style={{ flex: '0 0 40%', position: 'relative' }}>

              {/* Zone 1 text */}
              <div style={textLayerStyle(text1Alpha)}>
                <h2 style={headingStyle}>
                  WILLPOWER ARRIVES{' '}
                  <span style={{ color: MAGENTA }}>2.3 SECONDS</span>
                  {' '}TOO LATE.
                </h2>
                <p style={subtextStyle}>The reflex fired. The decision was already made.</p>
              </div>

              {/* Zone 2 text */}
              <div style={textLayerStyle(text2Alpha)}>
                <h2 style={headingStyle}>3 TO 7 SECONDS.</h2>
                <p style={subtextStyle}>The only moment that has ever mattered.</p>
              </div>

              {/* Zone 3 text */}
              <div style={textLayerStyle(text3Alpha)}>
                <h2 style={headingStyle}>YOU CAN ONLY MOVE THE SWITCH.</h2>
                <p style={subtextStyle}>One trained response. The pattern breaks.</p>
                {/* Closing stamp — fades in as scroll reaches 1.0 */}
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.95rem',
                  color: TEAL,
                  marginTop: '20px',
                  letterSpacing: '0.1em',
                  opacity: learnableAlpha,
                }}>
                  [ THIS IS LEARNABLE ]
                </p>
              </div>
            </div>

            {/* SVG visualization — bottom 60% of viewport */}
            <div style={{ flex: '1 1 60%', position: 'relative', overflow: 'visible' }}>
              <TimelineViz progress={scrollProgress} />
            </div>

          </div>
        </div>
      )}

      {/* ── MOBILE: STACKED STATEMENT BLOCKS ── */}
      {isMobile && (
        <div>
          <MobileBlock
            parts={[
              { text: 'WILLPOWER ARRIVES ' },
              { text: '2.3 SECONDS', highlight: true },
              { text: ' TOO LATE.' },
            ]}
            subtext="The reflex fired. The decision was already made."
          />
          <MobileBlock
            parts={[
              { text: 'THE WINDOW IS ' },
              { text: '3 TO 7 SECONDS.', highlight: true },
            ]}
            subtext="The only moment that has ever mattered."
          />
          <MobileBlock
            parts={[
              { text: 'YOU CAN ONLY ' },
              { text: 'MOVE THE SWITCH.', highlight: true },
            ]}
            subtext="One trained response. The pattern breaks."
            stamp="[ THIS IS LEARNABLE ]"
          />
        </div>
      )}

    </section>
  );
}
