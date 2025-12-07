import { Card, CardContent } from "@/components/ui/card";

export default function ComparisonTable() {
  const comparisons = [
    {
      therapy: "Processes trauma",
      archivist: "Interrupts patterns trauma created"
    },
    {
      therapy: "Takes years",
      archivist: "7-90 days to see results"
    },
    {
      therapy: "Talk about childhood",
      archivist: "Find Original Room, then interrupt"
    },
    {
      therapy: "Insight-focused",
      archivist: "Behavior-focused"
    },
    {
      therapy: "$200/session ongoing",
      archivist: "$47-$197 one-time"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-archivist-teal mb-4" data-testid="text-comparison-title">
          Pattern Archaeology, Not Therapy
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          What makes The Archivist Method™ different
        </p>

        <Card className="glow-card glow-card-gradient overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-2">
              {/* Headers */}
              <div className="p-4 bg-muted/50 border-b border-r border-muted font-semibold text-center">
                Therapy
              </div>
              <div className="p-4 bg-archivist-teal/10 border-b border-muted font-semibold text-center text-archivist-teal">
                The Archivist Method™
              </div>

              {/* Rows */}
              {comparisons.map((row, index) => (
                <>
                  <div
                    key={`therapy-${index}`}
                    className="p-4 border-r border-muted text-muted-foreground text-center"
                    style={{ borderBottom: index < comparisons.length - 1 ? '1px solid hsl(var(--muted))' : 'none' }}
                  >
                    {row.therapy}
                  </div>
                  <div
                    key={`archivist-${index}`}
                    className="p-4 text-center"
                    style={{ borderBottom: index < comparisons.length - 1 ? '1px solid hsl(var(--muted))' : 'none' }}
                  >
                    <span className="text-archivist-pink font-medium">{row.archivist}</span>
                  </div>
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
