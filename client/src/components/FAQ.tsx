import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is this just another self-help course?",
    answer:
      "No. This is pattern archaeology. We don't give you affirmations or motivation. We help you find the Original Room where your destructive pattern started, then teach you how to interrupt it at the source.",
  },
  {
    question: "Do I need to remember my childhood trauma?",
    answer:
      "No. Your body remembers even if your mind doesn't. We work with body signatures and behavioral patterns, not recovered memories. The pattern itself is the evidence.",
  },
  {
    question: "How is this different from therapy?",
    answer:
      'Therapy processes trauma over years. The Archivist Method interrupts the patterns trauma created in 7-90 days. Therapy asks "why did this happen?" We ask "where is the circuit break point?"',
  },
  {
    question: "What if I don't think I have trauma?",
    answer:
      "If you have destructive patterns that repeat despite your best efforts, you have trauma. The patterns ARE the proof. You don't need a dramatic backstory—patterns form from accumulated moments, not just major events.",
  },
  {
    question: "Can I really see results in just 7-90 days?",
    answer:
      "Yes. Once you identify the Original Room and interrupt the pattern at its source, behavioral change happens rapidly. This isn't about willpower or \"trying harder\"—it's about breaking the circuit.",
  },
  {
    question: "What if it doesn't work for me?",
    answer:
      "90-day money-back guarantee. If this doesn't show you something new about yourself, get a full refund. No questions asked.",
  },
  {
    question: "Do I need to talk to anyone or is this self-paced?",
    answer:
      "100% self-paced. Work through the material on your own timeline. No coaching calls, no group sessions. Just you and The Archivist's framework.",
  },
  {
    question: "I've tried everything. Why would this be different?",
    answer:
      "Because you've been trying to fix the behavior. We excavate the pattern's origin point. It's the difference between treating symptoms and removing the source.",
  },
  {
    question: "What's included in each tier?",
    answer:
      "7-Day Crash: Pattern basics, body signatures, first interrupt attempt. Perfect for testing the method.\n\nQuick-Start System ($47): Complete 90-day protocol for ONE pattern. Crisis protocols, tracking templates, relationship scripts.\n\nComplete Archive ($197): All 23 sections, 685 pages. Every pattern, every context. Lifetime access.",
  },
  {
    question: "How long do I have access to the materials?",
    answer:
      "7-Day Crash: Immediate access for 30 days.\n\nQuick-Start System: Lifetime access to all materials.\n\nComplete Archive: Lifetime access + all future updates.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-archivist-dark">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-4 text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Everything you need to know about The Archivist Method
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-archivist-teal/30 rounded-lg overflow-hidden hover:border-archivist-teal/60 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-archivist-dark/50 hover:bg-archivist-dark/70 transition-colors"
              >
                <span className="text-lg font-bold text-white pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-6 w-6 text-archivist-teal shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-5 bg-archivist-dark/30 border-t border-archivist-teal/20">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
