import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Shovel, Zap, FileEdit } from "lucide-react";

const methods = [
  {
    icon: Eye,
    title: "FOCUS",
    description: "Observe pattern without judgment",
  },
  {
    icon: Shovel,
    title: "EXCAVATION",
    description: "Find the Original Room (childhood origin)",
  },
  {
    icon: Zap,
    title: "INTERRUPTION",
    description: "Identify circuit break point",
  },
  {
    icon: FileEdit,
    title: "REWRITE",
    description: "Install new behavioral responses",
  },
];

export default function MethodSection() {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-4" data-testid="text-method-title">
          The Method
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Four steps to excavate and rewrite your psychological patterns
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map((method, index) => (
            <Card key={index} data-testid={`card-method-${index + 1}`}>
              <CardHeader className="pb-2">
                <method.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{method.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
