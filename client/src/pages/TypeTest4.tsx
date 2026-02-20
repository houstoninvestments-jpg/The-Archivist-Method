const googleFontsUrl = "https://fonts.googleapis.com/css2?" + [
  "Barlow+Condensed:wght@800",
  "Oswald:wght@700",
  "Anton",
  "Bebas+Neue",
  "Fjalla+One",
  "Roboto+Condensed:wght@900",
  "Archivo+Narrow:wght@900",
  "League+Spartan:wght@900",
  "Cormorant+Garamond:ital,wght@1,400",
].map(f => `family=${f}`).join("&") + "&display=swap";

const fonts = [
  { name: "Barlow Condensed", family: "'Barlow Condensed', sans-serif", weight: 800 },
  { name: "Oswald", family: "'Oswald', sans-serif", weight: 700 },
  { name: "Anton", family: "'Anton', sans-serif", weight: 400 },
  { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", weight: 400 },
  { name: "Fjalla One", family: "'Fjalla One', sans-serif", weight: 400 },
  { name: "Roboto Condensed", family: "'Roboto Condensed', sans-serif", weight: 900 },
  { name: "Archivo Narrow", family: "'Archivo Narrow', sans-serif", weight: 900 },
  { name: "League Spartan", family: "'League Spartan', sans-serif", weight: 900 },
];

export default function TypeTest4() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <link href={googleFontsUrl} rel="stylesheet" />
      <div style={{ padding: "60px 24px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
          HEAVY CONDENSED SANS-SERIF TEST
        </h1>
      </div>

      {fonts.map((f, i) => (
        <div key={f.name}>
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
              {i + 1}. {f.name}
            </p>

            <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
              <p style={{
                fontFamily: f.family,
                fontWeight: f.weight,
                color: "#FAFAFA",
                fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
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
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
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
