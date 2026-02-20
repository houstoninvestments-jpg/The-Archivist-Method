const googleFontsUrl = "https://fonts.googleapis.com/css2?" + [
  "Space+Mono:wght@400;700",
  "Cinzel:wght@400;700",
  "Oswald:wght@400;900",
  "Bodoni+Moda:ital,wght@0,400;1,100;1,400",
  "League+Spartan:wght@400;800",
  "La+Belle+Aurore",
].map(f => `family=${f}`).join("&") + "&display=swap";

const pairings = [
  {
    name: "Pairing A",
    fontA: "'Space Mono', monospace",
    fontB: "'Cinzel', serif",
    weightA: 700,
    weightB: 400,
  },
  {
    name: "Pairing B",
    fontA: "'Oswald', sans-serif",
    fontB: "'Bodoni Moda', serif",
    weightA: 900,
    weightB: 100,
  },
  {
    name: "Pairing C",
    fontA: "'League Spartan', sans-serif",
    fontB: "'La Belle Aurore', cursive",
    weightA: 800,
    weightB: 400,
  },
];

export default function TypeTest3() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <link href={googleFontsUrl} rel="stylesheet" />
      <div style={{ padding: "60px 24px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
          TYPOGRAPHY PAIRING SHOWCASE III
        </h1>
      </div>

      {pairings.map((p, i) => (
        <div key={p.name}>
          <section style={{ padding: "100px 24px", position: "relative" }}>
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
              {p.name}
            </p>

            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              color: "rgba(255,255,255,0.2)",
              position: "absolute",
              top: "40px",
              left: "24px",
              margin: 0,
            }}>
              {p.fontA.split("'")[1]} + {p.fontB.split("'")[1]}
            </p>

            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <p style={{
                fontFamily: p.fontA,
                fontWeight: p.weightA,
                fontStyle: "normal",
                color: "#FAFAFA",
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                lineHeight: 1.15,
                margin: "0 0 12px 0",
              }}>
                You know exactly what you're doing.
              </p>

              <p style={{
                fontFamily: p.fontB,
                fontWeight: p.weightB,
                fontStyle: "italic",
                color: "#14B8A6",
                fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
                lineHeight: 1.15,
                margin: 0,
              }}>
                You just can't stop.
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
