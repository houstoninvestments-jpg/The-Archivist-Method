const googleFontsUrl = "https://fonts.googleapis.com/css2?" + [
  "Bebas+Neue",
  "Cormorant+Garamond:ital,wght@0,400;0,700;1,400;1,700",
  "Source+Sans+3:wght@300;400;600",
  "Playfair+Display:ital,wght@0,400;0,900;1,400;1,700",
  "Inter:wght@300;400;600",
  "Inknut+Antiqua:wght@400;700",
  "Spectral:ital,wght@0,300;0,400;1,400",
  "Libre+Baskerville:ital,wght@0,400;0,700;1,400",
  "JetBrains+Mono:wght@300;400",
  "Yeseva+One",
  "Rufina:ital,wght@0,400;0,700;1,400",
  "Lato:wght@300;400;700",
  "Fraunces:ital,wght@0,400;0,900;1,400",
  "DM+Sans:wght@300;400;600",
  "Bodoni+Moda:ital,wght@0,400;0,900;1,400",
  "Italiana",
  "IM+Fell+English:ital,wght@0,400;1,400",
  "Crimson+Text:wght@400;600;700",
  "Space+Grotesk:wght@400;700",
  "Plus+Jakarta+Sans:wght@300;400;600",
  "Syne:wght@400;800",
  "Instrument+Serif:ital,wght@0,400;1,400",
  "Archivo:wght@400;500;600",
].map(f => `family=${f}`).join("&") + "&display=swap";

const pairings = [
  {
    name: "Power + Elegance",
    headline: "'Bebas Neue', sans-serif",
    subheadline: "'Cormorant Garamond', serif",
    body: "'Source Sans 3', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 400,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Editorial Authority",
    headline: "'Playfair Display', serif",
    subheadline: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 900,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Gothic Manuscript",
    headline: "'Inknut Antiqua', serif",
    subheadline: "'Spectral', serif",
    body: "'Source Sans 3', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 700,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Classified Document",
    headline: "'Libre Baskerville', serif",
    subheadline: "'Libre Baskerville', serif",
    body: "'JetBrains Mono', monospace",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 700,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Vintage Broadsheet",
    headline: "'Yeseva One', serif",
    subheadline: "'Rufina', serif",
    body: "'Lato', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 400,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Modern Gothic",
    headline: "'Fraunces', serif",
    subheadline: "'Fraunces', serif",
    body: "'DM Sans', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 900,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Razor Sharp",
    headline: "'Bodoni Moda', serif",
    subheadline: "'Italiana', serif",
    body: "'Source Sans 3', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 900,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Dark Academia",
    headline: "'IM Fell English', serif",
    subheadline: "'IM Fell English', serif",
    body: "'Crimson Text', serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 400,
    subWeight: 400,
    bodyWeight: 400,
  },
  {
    name: "Precision Lab",
    headline: "'Space Grotesk', sans-serif",
    subheadline: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 700,
    subWeight: 400,
    bodyWeight: 400,
  },
  {
    name: "Somatic Narrative",
    headline: "'Fraunces', serif",
    subheadline: "'Fraunces', serif",
    body: "'Plus Jakarta Sans', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 900,
    subWeight: 400,
    bodyWeight: 300,
  },
  {
    name: "Archivist Terminal",
    headline: "'Syne', sans-serif",
    subheadline: "'Syne', sans-serif",
    body: "'JetBrains Mono', monospace",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 800,
    subWeight: 400,
    bodyWeight: 400,
  },
  {
    name: "Biological High-End",
    headline: "'Instrument Serif', serif",
    subheadline: "'Instrument Serif', serif",
    body: "'Archivo', sans-serif",
    label: "'JetBrains Mono', monospace",
    headlineWeight: 400,
    subWeight: 400,
    bodyWeight: 400,
  },
];

export default function TypeTest() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <link href={googleFontsUrl} rel="stylesheet" />
      <div style={{ padding: "60px 24px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
          TYPOGRAPHY PAIRING SHOWCASE
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
              color: "rgba(255,255,255,0.25)",
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
                fontFamily: p.label,
                fontSize: "9px",
                color: "#EC4899",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                marginBottom: "32px",
              }}>
                PATTERN ARCHAEOLOGY, NOT THERAPY.
              </p>

              <p style={{
                fontFamily: p.headline,
                fontWeight: p.headlineWeight,
                fontStyle: "normal",
                color: "#FAFAFA",
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                lineHeight: 1.15,
                margin: "0 0 8px 0",
              }}>
                You know exactly what you're doing.
              </p>

              <p style={{
                fontFamily: p.subheadline,
                fontWeight: p.subWeight,
                fontStyle: "italic",
                color: "#14B8A6",
                fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
                lineHeight: 1.15,
                margin: "0 0 32px 0",
              }}>
                You just can't stop.
              </p>

              <p style={{
                fontFamily: p.body,
                fontWeight: p.bodyWeight,
                color: "#999999",
                fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                lineHeight: 1.7,
                maxWidth: "540px",
                margin: "0 auto",
              }}>
                The first pattern interruption system that works in real-time — not in retrospect.
              </p>
            </div>
          </section>

          {i < pairings.length - 1 && (
            <div style={{ maxWidth: "120px", margin: "0 auto", height: "1px", background: "rgba(20,184,166,0.3)" }} />
          )}
        </div>
      ))}
    </div>
  );
}
