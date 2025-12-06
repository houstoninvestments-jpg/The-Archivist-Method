import { Video, FileDown, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Video,
    number: "01",
    title: "Watch Your Pattern Recognition Video",
    description: "Discover the hidden patterns running your life through our guided video session",
  },
  {
    icon: FileDown,
    number: "02",
    title: "Download Your Workbook",
    description: "Apply the methods with our comprehensive pattern recognition workbook",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Talk to The Archivist AI",
    description: "Get personalized guidance from our AI trained in pattern archaeology",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-how-it-works-title">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center space-y-4"
              data-testid={`step-${index + 1}`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card border border-border">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-primary">{step.number}</p>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
