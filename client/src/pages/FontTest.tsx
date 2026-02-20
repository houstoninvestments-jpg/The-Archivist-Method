const fonts = [
  "Cormorant Garamond",
  "DM Serif Display",
  "Libre Baskerville",
  "Fraunces",
  "Bodoni Moda",
  "Rufina",
  "Yeseva One",
  "Inknut Antiqua",
  "Italiana",
  "Spectral",
];

const googleFontsUrl = "https://fonts.googleapis.com/css2?" + fonts.map(f => `family=${f.replace(/ /g, "+")}:ital,wght@0,400;0,700;1,400;1,700`).join("&") + "&display=swap";

export default function FontTest() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", padding: "60px 24px" }}>
      <link href={googleFontsUrl} rel="stylesheet" />
      <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", textAlign: "center", marginBottom: "60px" }}>
        FONT COMPARISON // HERO HEADLINE
      </h1>
      {fonts.map((font, i) => (
        <div key={font} style={{ maxWidth: "800px", margin: "0 auto 80px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "60px" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "24px" }}>
            {i + 1}. {font}
          </p>
          <p style={{ fontFamily: `'${font}', serif`, fontWeight: 700, fontStyle: "normal", color: "#FAFAFA", fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.2, margin: "0 0 8px 0" }}>
            You know exactly what you're doing.
          </p>
          <p style={{ fontFamily: `'${font}', serif`, fontWeight: 400, fontStyle: "italic", color: "#14B8A6", fontSize: "clamp(2rem, 4.5vw, 3.4rem)", lineHeight: 1.2, margin: 0 }}>
            You just can't stop.
          </p>
        </div>
      ))}
    </div>
  );
}
