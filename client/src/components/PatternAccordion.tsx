import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const patterns = [
  {
    id: "1",
    title: "Disappearing",
    hook: "Why you vanish the moment someone gets close",
    description:
      "Pull away when intimacy increases. The moment connection deepens, something in you says 'time to go.' This pattern protected you when closeness meant danger.",
  },
  {
    id: "2",
    title: "Apology Loop",
    hook: "Why you apologize for breathing",
    description:
      "Apologize for existing. You preemptively apologize for taking up space, for having needs, for being present. This pattern emerged when your existence felt like a burden to others.",
  },
  {
    id: "3",
    title: "Testing",
    hook: "Why you push people away to prove they'll leave",
    description:
      "Push people away to see if they stay. You unconsciously create situations to prove that people will leave, confirming the belief that no one truly wants to be close to you.",
  },
  {
    id: "4",
    title: "Attraction to Harm",
    hook: "Why toxic feels like home",
    description:
      "Choose people who hurt you. There's a familiar comfort in pain, a known territory that feels safer than the unknown landscape of genuine care.",
  },
  {
    id: "5",
    title: "Compliment Deflection",
    hook: "Why praise feels like a trap",
    description:
      "Can't accept praise. Positive feedback feels like a trap, something that will be taken away, or worse, something you'll have to live up to.",
  },
  {
    id: "6",
    title: "Draining Bond",
    hook: "Why you stay when you should run",
    description:
      "Stay when you should leave. Relationships that deplete you feel normal. Leaving feels like abandonment, so you stay and shrink.",
  },
  {
    id: "7",
    title: "Success Sabotage",
    hook: "Why you destroy what you build",
    description:
      "Destroy before breakthrough. Just as you're about to succeed, something happens. The pattern ensures you stay in familiar territory of almost-but-not-quite.",
  },
];

export default function PatternAccordion() {
  return (
    <section className="py-20 px-4 bg-archivist-dark">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          The 7 Core Patterns
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Recognize which patterns have been running your life
        </p>
        <Accordion type="single" collapsible className="space-y-4">
          {patterns.map((pattern) => (
            <AccordionItem
              key={pattern.id}
              value={pattern.id}
              className="border-2 border-archivist-teal/30 rounded-lg px-6 py-2 bg-archivist-dark/50 hover:border-archivist-teal/60 transition-colors"
              data-testid={`accordion-pattern-${pattern.id}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-start gap-4 text-left">
                  <span className="text-archivist-teal font-bold text-lg shrink-0">
                    0{pattern.id}
                  </span>
                  <div className="flex-grow">
                    <div className="text-white font-bold text-xl mb-1">
                      {pattern.title}
                    </div>
                    <div className="text-gray-400 text-sm font-normal">
                      {pattern.hook}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4 pl-12">
                {pattern.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
