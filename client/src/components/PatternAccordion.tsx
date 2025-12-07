import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import fogOverlay from "@assets/generated_images/teal_pink_fog_overlay.png";

const patterns = [
  {
    id: "1",
    title: "Disappearing",
    description: "Pull away when intimacy increases. The moment connection deepens, something in you says 'time to go.' This pattern protected you when closeness meant danger.",
  },
  {
    id: "2",
    title: "Apology Loop",
    description: "Apologize for existing. You preemptively apologize for taking up space, for having needs, for being present. This pattern emerged when your existence felt like a burden to others.",
  },
  {
    id: "3",
    title: "Testing",
    description: "Push people away to see if they stay. You unconsciously create situations to prove that people will leave, confirming the belief that no one truly wants to be close to you.",
  },
  {
    id: "4",
    title: "Attraction to Harm",
    description: "Choose people who hurt you. There's a familiar comfort in pain, a known territory that feels safer than the unknown landscape of genuine care.",
  },
  {
    id: "5",
    title: "Compliment Deflection",
    description: "Can't accept praise. Positive feedback feels like a trap, something that will be taken away, or worse, something you'll have to live up to.",
  },
  {
    id: "6",
    title: "Draining Bond",
    description: "Stay when you should leave. Relationships that deplete you feel normal. Leaving feels like abandonment, so you stay and shrink.",
  },
  {
    id: "7",
    title: "Success Sabotage",
    description: "Destroy before breakthrough. Just as you're about to succeed, something happens. The pattern ensures you stay in familiar territory of almost-but-not-quite.",
  },
];

export default function PatternAccordion() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          backgroundImage: `url(${fogOverlay})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)'
        }}
      />
      <div className="container mx-auto max-w-3xl relative z-10">
        <h2 className="text-3xl font-bold text-center mb-4" data-testid="text-patterns-title">
          The 7 Core Patterns
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Recognize which patterns have been running your life
        </p>
        <Accordion type="single" collapsible className="space-y-2">
          {patterns.map((pattern) => (
            <AccordionItem
              key={pattern.id}
              value={pattern.id}
              className="border border-border rounded-md px-4"
              data-testid={`accordion-pattern-${pattern.id}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">0{pattern.id}</span>
                  <span className="font-semibold">{pattern.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {pattern.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
