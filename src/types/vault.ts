// ============================================================
// THE ARCHIVIST VAULT — Type Definitions
// ============================================================

// --- Patterns ---

export type PatternId =
  | 'disappearing'
  | 'apology-loop'
  | 'testing'
  | 'attraction-to-harm'
  | 'draining-bond'
  | 'compliment-deflection'
  | 'perfectionism'
  | 'success-sabotage'
  | 'rage';

export interface Pattern {
  id: PatternId;
  number: number;
  name: string;
  shortName: string;
  description: string;
  bodySignal: string;
  gapLength: string;
}

// --- Interrupt Scripts ---

export interface InterruptScript {
  circuitBreak: string;
  shortCircuitBreak: string;
  nextTenMinutes: string[];
  bodySignal: string;
  gapDescription: string;
}

export type InterruptScripts = Record<PatternId, InterruptScript>;

// --- Activation Flow ---

export type ActivationStep = 'pattern-select' | 'intensity' | 'context' | 'interrupt';

export interface ActivationState {
  step: ActivationStep;
  patternId: PatternId | null;
  intensity: number;
  context: string;
}

// --- Database Records ---

export interface ActivationLog {
  id: string;
  user_id: string;
  pattern_id: number;
  intensity: number;
  context: string | null;
  interrupted: boolean;
  timestamp: string;
}

export interface BrainDumpRecord {
  id: string;
  user_id: string;
  content: string;
  suggested_pattern: number | null;
  converted_to_log: boolean;
  timestamp: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  artifact_id: string;
  action: 'opened' | 'completed' | 'bookmarked';
  timestamp: string;
}

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_interrupt_date: string | null;
}

// --- Workbench Stats ---

export interface WorkbenchStatsData {
  activationsThisWeek: number;
  activationsLastWeek: number;
  interruptSuccessRate: number;
  currentStreak: number;
  longestStreak: number;
}

// --- Archive / Artifacts ---

export type ContentType = 'framework' | 'script' | 'tool' | 'example';

export interface Artifact {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  isLocked: boolean;
  price?: number;
  product: 'quick-start' | 'complete-archive';
  contentType: ContentType;
  collection: string;
  pdfUrl?: string;
  pageCount?: number;
}

export interface ThreadLink {
  conceptId: string;
  conceptName: string;
  appearsIn: { artifactId: string; artifactTitle: string; page?: number }[];
  relatedThreads: { conceptId: string; conceptName: string }[];
}

export interface SearchResult {
  artifactId: string;
  title: string;
  snippet: string;
  collection: string;
  contentType: ContentType;
  relevance: number;
}

// --- Component Props ---

export interface ArtifactCardProps {
  title: string;
  description: string;
  coverImage?: string;
  isLocked: boolean;
  price?: number;
  onOpen: () => void;
  onPurchase?: () => void;
}

export interface WorkbenchHomeProps {
  userId: string;
}

export interface ActivationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  primaryPattern?: PatternId;
}

export interface BrainDumpProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onLogAndInterrupt: (suggestedPattern: PatternId) => void;
}
