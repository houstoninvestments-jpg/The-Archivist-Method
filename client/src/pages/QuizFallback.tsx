import { useState } from 'react';
import { useLocation } from 'wouter';
import { patternDisplayNames, patternDescriptions, PatternKey } from '@/lib/quizData';
import { ArrowRight, HelpCircle } from 'lucide-react';

const patternKeys: PatternKey[] = [
  'disappearing',
  'apologyLoop', 
  'testing',
  'attractionToHarm',
  'complimentDeflection',
  'drainingBond',
  'successSabotage',
];

export default function QuizFallback() {
  const [, setLocation] = useLocation();
  const [selectedPattern, setSelectedPattern] = useState<PatternKey | null>(null);

  const handleSelect = (pattern: PatternKey) => {
    setSelectedPattern(pattern);
    const resultData = encodeURIComponent(JSON.stringify({
      type: 'fallback',
      primaryPattern: pattern,
      secondaryPatterns: [],
      scores: {},
      totalScore: 0,
    }));
    setLocation(`/quiz/result/${pattern}?data=${resultData}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-pink-500/10"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Pattern Selection Required</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            I Can't Identify Your Primary Pattern
          </h1>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Based on your responses, you selected "none of these" on most questions.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-xl mx-auto">
            <p className="text-gray-400 mb-4">This means either:</p>
            <ul className="text-left text-gray-300 space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">•</span>
                <span>You're highly self-aware and already interrupting patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">•</span>
                <span>Your patterns are more subtle than the quiz captures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">•</span>
                <span>None of the 7 core patterns match your experience</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Let me show you all 7
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Read through them and pick the one that makes your stomach drop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patternKeys.map((pattern) => (
            <button
              key={pattern}
              data-testid={`pattern-card-${pattern}`}
              onClick={() => handleSelect(pattern)}
              className="text-left p-6 bg-white/5 border border-white/10 rounded-xl hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                    {patternDisplayNames[pattern]}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {patternDescriptions[pattern]}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-teal-400 flex-shrink-0 mt-1 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setLocation('/quiz')}
            className="text-gray-500 hover:text-white text-sm underline transition-colors"
          >
            Or retake the quiz with different answers
          </button>
        </div>
      </div>
    </div>
  );
}
