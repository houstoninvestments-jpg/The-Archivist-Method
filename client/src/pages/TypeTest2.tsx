const googleFontsUrl = "https://fonts.googleapis.com/css2?" + [
  "Anton",
  "Libre+Baskerville:ital,wght@0,400;0,700;1,400",
  "Syncopate:wght@400;700",
  "Cormorant+Infant:ital,wght@0,300;1,300",
  "Schibsted+Grotesk:wght@400;900",
  "Pinyon+Script",
  "Barlow+Condensed:ital,wght@0,400;0,800;1,800",
  "Spectral:wght@200;400",
  "Public+Sans:wght@100;900",
  "BioRhyme:wght@400;700",
  "JetBrains+Mono:wght@300;400",
  "Playfair+Display:ital,wght@0,400;0,900;1,900",
  "Outfit:wght@100;900",
  "Instrument+Serif:ital,wght@0,400;1,400",
  "Space+Grotesk:wght@400;700",
  "Lora:ital,wght@0,400;0,500;1,400;1,500",
  "Rubik+Mono+One",
  "Bodoni+Moda:ital,wght@0,400;0,900;1,400",
  "League+Spartan:wght@400;800",
  "Nanum+Myeongjo:wght@400;700",
  "Special+Elite",
  "EB+Garamond:wght@400;600",
  "Nanum+Pen+Script",
  "Bebas+Neue",
  "Major+Mono+Display",
  "Antonio:wght@400;700",
  "La+Belle+Aurore",
  "Cormorant+Garamond:ital,wght@0,400;1,300;1,400",
  "Inter:wght@200;400",
  "Fraunces:wght@400;900",
].map(f => `family=${f}`).join("&") + "&display=swap";

const pairings: { name: string; fontA: string; fontB: string; weightA: number; weightB: number; styleA: string; line1: string; line2: string }[] = [
  {
    name: "Basal Ganglia Lockup",
    fontA: "'Anton', sans-serif", fontB: "'Libre Baskerville', serif",
    weightA: 400, weightB: 400, styleA: "normal",
    line1: "HARDWARE, NOT SOFTWARE.",
    line2: "The program was installed to protect you.",
  },
  {
    name: "80,000x Velocity",
    fontA: "'Syncopate', sans-serif", fontB: "'Cormorant Infant', serif",
    weightA: 700, weightB: 300, styleA: "normal",
    line1: "80,000X FASTER.",
    line2: "You said the thing before you knew you were going to say it.",
  },
  {
    name: "Body Signature Heat",
    fontA: "'Schibsted Grotesk', sans-serif", fontB: "'Pinyon Script', cursive",
    weightA: 900, weightB: 400, styleA: "normal",
    line1: "BODY SIGNATURE DETECTED.",
    line2: "A micro-surge of heat up the neck.",
  },
  {
    name: "Veto Window",
    fontA: "'Barlow Condensed', sans-serif", fontB: "'Spectral', serif",
    weightA: 800, weightB: 200, styleA: "italic",
    line1: "INTERRUPT AT THE SIGNAL.",
    line2: "Because the behavior has not happened yet.",
  },
  {
    name: "Childhood Adaptation",
    fontA: "'Public Sans', sans-serif", fontB: "'BioRhyme', serif",
    weightA: 100, weightB: 700, styleA: "normal",
    line1: "THE SECURITY GUARD FIRES.",
    line2: "While the CEO is still loading.",
  },
  {
    name: "Hardware vs Software",
    fontA: "'JetBrains Mono', monospace", fontB: "'Playfair Display', serif",
    weightA: 400, weightB: 900, styleA: "normal",
    line1: "READINESS POTENTIAL: 300MS.",
    line2: "The body announces the pattern before it executes.",
  },
  {
    name: "Circuit Break",
    fontA: "'Outfit', sans-serif", fontB: "'Instrument Serif', serif",
    weightA: 900, weightB: 400, styleA: "normal",
    line1: "CALM CHEST. OPEN ATTENTION.",
    line2: "The earliest available indicator.",
  },
  {
    name: "Polyvagal Shift",
    fontA: "'Space Grotesk', sans-serif", fontB: "'Lora', serif",
    weightA: 700, weightB: 400, styleA: "normal",
    line1: "THE BASAL GANGLIA PROBLEM.",
    line2: "You are bringing a spreadsheet to a knife fight.",
  },
  {
    name: "CEO and Security Guard",
    fontA: "'Rubik Mono One', monospace", fontB: "'Bodoni Moda', serif",
    weightA: 400, weightB: 400, styleA: "normal",
    line1: "MYELINATED NEURAL HIGHWAY.",
    line2: "The gap is where everything changes.",
  },
  {
    name: "Readiness Potential",
    fontA: "'League Spartan', sans-serif", fontB: "'Nanum Myeongjo', serif",
    weightA: 800, weightB: 400, styleA: "normal",
    line1: "300 MILLISECONDS.",
    line2: "You cannot stop the initiation. But you can veto the completion.",
  },
  {
    name: "Declassified Document",
    fontA: "'Special Elite', cursive", fontB: "'Pinyon Script', cursive",
    weightA: 400, weightB: 400, styleA: "normal",
    line1: "HARDWARE, NOT SOFTWARE.",
    line2: "The program was installed to protect you.",
  },
  {
    name: "Anatomical Atlas",
    fontA: "'Space Grotesk', sans-serif", fontB: "'Instrument Serif', serif",
    weightA: 700, weightB: 400, styleA: "normal",
    line1: "80,000X FASTER.",
    line2: "You said the thing before you knew you were going to say it.",
  },
  {
    name: "Library Index Card",
    fontA: "'JetBrains Mono', monospace", fontB: "'EB Garamond', serif",
    weightA: 400, weightB: 600, styleA: "normal",
    line1: "READINESS POTENTIAL: 300MS.",
    line2: "The body announces the pattern before it executes.",
  },
  {
    name: "Somatic Field Notes",
    fontA: "'Syncopate', sans-serif", fontB: "'Nanum Pen Script', cursive",
    weightA: 400, weightB: 400, styleA: "normal",
    line1: "BODY SIGNATURE DETECTED.",
    line2: "A micro-surge of heat up the neck.",
  },
  {
    name: "Veto Protocol",
    fontA: "'Bebas Neue', sans-serif", fontB: "'Playfair Display', serif",
    weightA: 400, weightB: 900, styleA: "normal",
    line1: "INTERRUPT AT THE SIGNAL.",
    line2: "Because the behavior has not happened yet.",
  },
  {
    name: "Neural Blueprint",
    fontA: "'Major Mono Display', monospace", fontB: "'Bodoni Moda', serif",
    weightA: 400, weightB: 400, styleA: "normal",
    line1: "THE BASAL GANGLIA PROBLEM.",
    line2: "You are bringing a spreadsheet to a knife fight.",
  },
  {
    name: "Ventral Vagal",
    fontA: "'Outfit', sans-serif", fontB: "'Lora', serif",
    weightA: 100, weightB: 500, styleA: "normal",
    line1: "CALM CHEST. OPEN ATTENTION.",
    line2: "The earliest available indicator.",
  },
  {
    name: "Archive Spine",
    fontA: "'Antonio', sans-serif", fontB: "'La Belle Aurore', cursive",
    weightA: 700, weightB: 400, styleA: "normal",
    line1: "MYELINATED NEURAL HIGHWAY.",
    line2: "The gap is where everything changes.",
  },
  {
    name: "CEO vs Security Guard",
    fontA: "'Public Sans', sans-serif", fontB: "'Cormorant Garamond', serif",
    weightA: 900, weightB: 300, styleA: "normal",
    line1: "THE SECURITY GUARD FIRES.",
    line2: "While the CEO is still loading.",
  },
  {
    name: "Readiness Potential II",
    fontA: "'Inter', sans-serif", fontB: "'Fraunces', serif",
    weightA: 200, weightB: 900, styleA: "normal",
    line1: "300 MILLISECONDS.",
    line2: "You cannot stop the initiation. But you can veto the completion.",
  },
];

export default function TypeTest2() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <link href={googleFontsUrl} rel="stylesheet" />
      <div style={{ padding: "60px 24px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
          TYPOGRAPHY PAIRING SHOWCASE II
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "8px" }}>
          {pairings.length} SYSTEMS // SCROLL TO COMPARE
        </p>
      </div>

      {pairings.map((p, i) => (
        <div key={p.name + i}>
          <section style={{ padding: "80px 24px", position: "relative" }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "#14B8A6",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              position: "absolute",
              top: "24px",
              left: "24px",
              margin: 0,
            }}>
              {i + 1}. {p.name}
            </p>

            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <p style={{
                fontFamily: p.fontA,
                fontWeight: p.weightA,
                fontStyle: p.styleA,
                color: "#FAFAFA",
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                lineHeight: 1.15,
                margin: "0 0 12px 0",
              }}>
                {p.line1}
              </p>

              <p style={{
                fontFamily: p.fontB,
                fontWeight: p.weightB,
                fontStyle: "italic",
                color: "#14B8A6",
                fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
                lineHeight: 1.3,
                margin: 0,
              }}>
                {p.line2}
              </p>
            </div>
          </section>

          {i < pairings.length - 1 && (
            <div style={{ maxWidth: "80px", margin: "0 auto", height: "1px", background: "rgba(236,72,153,0.4)" }} />
          )}
        </div>
      ))}
    </div>
  );
}
