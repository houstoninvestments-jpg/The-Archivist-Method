const googleFontsUrl = "https://fonts.googleapis.com/css2?" + [
  "Barlow+Condensed:wght@800",
  "Oswald:wght@700",
  "Anton",
  "Bebas+Neue",
  "Fjalla+One",
  "Roboto+Condensed:wght@900",
  "Archivo+Narrow:wght@900",
  "League+Spartan:wght@900",
  "Squada+One",
  "Yanone+Kaffeesatz:wght@700",
  "Changa:wght@800",
  "Exo+2:wght@900",
  "Rajdhani:wght@700",
  "Saira+Condensed:wght@900",
  "Kanit:wght@800",
  "Teko:wght@700",
  "Big+Shoulders+Display:wght@900",
  "Passion+One:wght@900",
  "Russo+One",
  "Sintony:wght@700",
  "Fira+Sans+Condensed:wght@900",
  "Source+Sans+3:wght@900",
  "Barlow+Semi+Condensed:wght@800",
  "Heebo:wght@900",
  "Pathway+Gothic+One",
  "Stint+Ultra+Condensed",
  "Michroma",
  "Syncopate:wght@700",
  "Syne:wght@800",
  "Staatliches",
  "Krona+One",
  "Unbounded:wght@900",
  "Orbitron:wght@900",
  "Chakra+Petch:wght@700",
  "Oxanium:wght@800",
  "Audiowide",
  "Quantico:wght@700",
  "Jura:wght@700",
  "Share+Tech+Mono",
  "Saira+Extra+Condensed:wght@900",
  "Encode+Sans+Condensed:wght@900",
  "Titillium+Web:wght@900",
  "Montserrat:wght@900",
  "Raleway:wght@900",
  "Cabin+Condensed:wght@700",
  "Nunito+Sans:wght@900",
  "Public+Sans:wght@900",
  "Arimo:wght@700",
  "Manrope:wght@800",
  "Schibsted+Grotesk:wght@900",
  "Cormorant+Garamond:ital,wght@1,400",
].map(f => `family=${f}`).join("&") + "&display=swap";

const fonts: { name: string; family: string; weight: number }[] = [
  { name: "Barlow Condensed", family: "'Barlow Condensed', sans-serif", weight: 800 },
  { name: "Oswald", family: "'Oswald', sans-serif", weight: 700 },
  { name: "Anton", family: "'Anton', sans-serif", weight: 400 },
  { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", weight: 400 },
  { name: "Fjalla One", family: "'Fjalla One', sans-serif", weight: 400 },
  { name: "Roboto Condensed", family: "'Roboto Condensed', sans-serif", weight: 900 },
  { name: "Archivo Narrow", family: "'Archivo Narrow', sans-serif", weight: 900 },
  { name: "League Spartan", family: "'League Spartan', sans-serif", weight: 900 },
  { name: "Squada One", family: "'Squada One', sans-serif", weight: 400 },
  { name: "Yanone Kaffeesatz", family: "'Yanone Kaffeesatz', sans-serif", weight: 700 },
  { name: "Changa", family: "'Changa', sans-serif", weight: 800 },
  { name: "Exo 2", family: "'Exo 2', sans-serif", weight: 900 },
  { name: "Rajdhani", family: "'Rajdhani', sans-serif", weight: 700 },
  { name: "Saira Condensed", family: "'Saira Condensed', sans-serif", weight: 900 },
  { name: "Kanit", family: "'Kanit', sans-serif", weight: 800 },
  { name: "Teko", family: "'Teko', sans-serif", weight: 700 },
  { name: "Big Shoulders Display", family: "'Big Shoulders Display', sans-serif", weight: 900 },
  { name: "Passion One", family: "'Passion One', sans-serif", weight: 900 },
  { name: "Russo One", family: "'Russo One', sans-serif", weight: 400 },
  { name: "Sintony", family: "'Sintony', sans-serif", weight: 700 },
  { name: "Fira Sans Condensed", family: "'Fira Sans Condensed', sans-serif", weight: 900 },
  { name: "Source Sans 3", family: "'Source Sans 3', sans-serif", weight: 900 },
  { name: "Barlow Semi Condensed", family: "'Barlow Semi Condensed', sans-serif", weight: 800 },
  { name: "Heebo", family: "'Heebo', sans-serif", weight: 900 },
  { name: "Pathway Gothic One", family: "'Pathway Gothic One', sans-serif", weight: 400 },
  { name: "Stint Ultra Condensed", family: "'Stint Ultra Condensed', serif", weight: 400 },
  { name: "Michroma", family: "'Michroma', sans-serif", weight: 400 },
  { name: "Syncopate", family: "'Syncopate', sans-serif", weight: 700 },
  { name: "Syne", family: "'Syne', sans-serif", weight: 800 },
  { name: "Staatliches", family: "'Staatliches', sans-serif", weight: 400 },
  { name: "Krona One", family: "'Krona One', sans-serif", weight: 400 },
  { name: "Unbounded", family: "'Unbounded', sans-serif", weight: 900 },
  { name: "Orbitron", family: "'Orbitron', sans-serif", weight: 900 },
  { name: "Chakra Petch", family: "'Chakra Petch', sans-serif", weight: 700 },
  { name: "Oxanium", family: "'Oxanium', sans-serif", weight: 800 },
  { name: "Audiowide", family: "'Audiowide', sans-serif", weight: 400 },
  { name: "Quantico", family: "'Quantico', sans-serif", weight: 700 },
  { name: "Jura", family: "'Jura', sans-serif", weight: 700 },
  { name: "Share Tech Mono", family: "'Share Tech Mono', monospace", weight: 400 },
  { name: "Saira Extra Condensed", family: "'Saira Extra Condensed', sans-serif", weight: 900 },
  { name: "Encode Sans Condensed", family: "'Encode Sans Condensed', sans-serif", weight: 900 },
  { name: "Titillium Web", family: "'Titillium Web', sans-serif", weight: 900 },
  { name: "Montserrat", family: "'Montserrat', sans-serif", weight: 900 },
  { name: "Raleway", family: "'Raleway', sans-serif", weight: 900 },
  { name: "Cabin Condensed", family: "'Cabin Condensed', sans-serif", weight: 700 },
  { name: "Nunito Sans", family: "'Nunito Sans', sans-serif", weight: 900 },
  { name: "Public Sans", family: "'Public Sans', sans-serif", weight: 900 },
  { name: "Arimo", family: "'Arimo', sans-serif", weight: 700 },
  { name: "Manrope", family: "'Manrope', sans-serif", weight: 800 },
  { name: "Schibsted Grotesk", family: "'Schibsted Grotesk', sans-serif", weight: 900 },
];

export default function TypeTest5() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <link href={googleFontsUrl} rel="stylesheet" />
      <div style={{ padding: "60px 24px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
          HEAVY DISPLAY FONT TEST
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "8px" }}>
          50 FONTS // SCROLL TO COMPARE
        </p>
      </div>

      {fonts.map((f, i) => (
        <div key={f.name}>
          <section style={{ padding: "70px 24px", position: "relative" }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "#14B8A6",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              position: "absolute",
              top: "20px",
              left: "24px",
              margin: 0,
            }}>
              {i + 1}. {f.name}
            </p>

            <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
              <p style={{
                fontFamily: f.family,
                fontWeight: f.weight,
                color: "#FAFAFA",
                fontSize: "clamp(2rem, 5.5vw, 4rem)",
                lineHeight: 1.1,
                textTransform: "uppercase",
                margin: "0 0 12px 0",
              }}>
                YOU KNOW EXACTLY WHAT YOU'RE DOING.
              </p>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#14B8A6",
                fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                lineHeight: 1.2,
                margin: 0,
              }}>
                You just can't stop.
              </p>
            </div>
          </section>

          {i < fonts.length - 1 && (
            <div style={{ maxWidth: "80px", margin: "0 auto", height: "1px", background: "rgba(236,72,153,0.4)" }} />
          )}
        </div>
      ))}
    </div>
  );
}
