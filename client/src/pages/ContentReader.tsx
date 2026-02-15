import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import ReactMarkdown from "react-markdown";
import {
  ChevronRight, ChevronDown, ChevronLeft,
  Lock, Check, Loader2,
  PanelRightClose, PanelRightOpen,
  X, Copy, Bookmark, Share2,
  ArrowLeft, ArrowRight, Keyboard,
  Trash2, Plus, Send,
} from "lucide-react";

const FP = "'Playfair Display', serif";
const FB = "'Source Sans 3', sans-serif";
const FM = "'JetBrains Mono', monospace";
const BG = "#0A0A0A";
const TX = "#F5F5F5";
const MU = "#737373";
const TL = "#14B8A6";
const PK = "#EC4899";
const CB = "rgba(255,255,255,0.03)";
const CBR = "rgba(255,255,255,0.06)";

interface TocSection {
  id: string;
  title: string;
  locked: boolean;
}

interface TocGroup {
  id: string;
  title: string;
  sections: TocSection[];
}

interface SectionData {
  sectionId: string;
  title: string;
  content: string;
  readMinutes: number;
  locked: boolean;
  prev: string | null;
  next: string | null;
}

interface Note {
  id: string;
  sectionId: string;
  content: string | null;
  highlightText: string | null;
  createdAt: string;
}

interface TocData {
  tier: string;
  primaryPattern: string | null;
  groups: TocGroup[];
  progress: Record<string, { completed: boolean; lastPosition: number }>;
  stats: { completedSections: number; totalSections: number; percentComplete: number };
  firstSectionId: string;
}

const TOOLTIP_MAP: Record<string, string> = {
  "body signature": "The physical sensation your body produces 3-7 seconds before a pattern runs. Learning yours is how you catch it.",
  "circuit break": "A specific statement you say out loud or internally to interrupt a pattern mid-activation.",
  "the interrupt": "The moment you catch the pattern and choose not to let it finish running.",
  "pattern archaeology": "The process of excavating the original room, people, and conditions that installed your pattern.",
  "four doors": "Recognition, Excavation, Interruption, Override. The four-step protocol for pattern interruption.",
  "override": "A replacement behavior that meets the same survival need without the destruction.",
};

export default function ContentReader() {
  const [, setLocation] = useLocation();
  const [tocData, setTocData] = useState<TocData | null>(null);
  const [section, setSection] = useState<SectionData | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [notesOpen, setNotesOpen] = useState(true);
  const [tocOpen, setTocOpen] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [selToolbar, setSelToolbar] = useState<{ text: string; x: number; y: number } | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [shareModal, setShareModal] = useState<string | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const fetchToc = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/reader/toc", { credentials: "include" });
      if (!res.ok) { setLocation("/quiz"); return; }
      const data: TocData = await res.json();
      setTocData(data);
      const expanded = new Set<string>();
      data.groups.forEach((g) => {
        if (g.sections.some((s) => !s.locked)) expanded.add(g.id);
      });
      setExpandedGroups(expanded);
      return data;
    } catch { setLocation("/quiz"); }
  }, [setLocation]);

  const fetchSection = useCallback(async (id: string) => {
    setSectionLoading(true);
    try {
      const res = await fetch(`/api/portal/reader/section/${id}`, { credentials: "include" });
      if (!res.ok) return;
      const data: SectionData = await res.json();
      setSection(data);
      setActiveSectionId(id);
      if (readerRef.current) readerRef.current.scrollTop = 0;
    } catch {}
    setSectionLoading(false);
  }, []);

  const fetchNotes = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/portal/reader/notes/${id}`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setNotes(data.notes || []);
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      const data = await fetchToc();
      if (data) {
        const params = new URLSearchParams(window.location.search);
        const docId = params.get("doc") || data.firstSectionId;
        await fetchSection(docId);
        await fetchNotes(docId);
      }
      setLoading(false);
    })();
  }, [fetchToc, fetchSection, fetchNotes]);

  const navigateTo = useCallback(async (id: string) => {
    window.history.replaceState({}, "", `/portal/reader?doc=${id}`);
    await Promise.all([fetchSection(id), fetchNotes(id)]);
  }, [fetchSection, fetchNotes]);

  const saveProgress = useCallback(async (sectionId: string, completed: boolean, lastPosition: number) => {
    try {
      await fetch("/api/portal/reader/progress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, completed, lastPosition }),
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (!readerRef.current || !activeSectionId) return;
    const el = readerRef.current;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollPct = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${Math.min(100, scrollPct * 100)}%`;
        }
        if (scrollPct > 0.8 && activeSectionId) {
          saveProgress(activeSectionId, true, scrollPct);
        }
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeSectionId, saveProgress]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" && section?.next) { navigateTo(section.next); }
      if (e.key === "ArrowLeft" && section?.prev) { navigateTo(section.prev); }
      if (e.key === "n" || e.key === "N") { setNotesOpen((v) => !v); }
      if (e.key === "Escape") { setShowShortcuts(false); setShareModal(null); setSelToolbar(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, navigateTo]);

  const handleTextSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelToolbar(null);
      return;
    }
    const text = sel.toString().trim();
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelToolbar({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, [handleTextSelection]);

  const handleSaveToNotes = async (text: string) => {
    if (!activeSectionId) return;
    try {
      const res = await fetch("/api/portal/reader/notes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId: activeSectionId, highlightText: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [data.note, ...prev]);
        setNotesOpen(true);
      }
    } catch {}
    setSelToolbar(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch {}
    setSelToolbar(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !activeSectionId) return;
    try {
      const res = await fetch("/api/portal/reader/notes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId: activeSectionId, content: newNote.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [data.note, ...prev]);
        setNewNote("");
      }
    } catch {}
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/portal/reader/notes/${noteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch {}
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: BG }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: TL }} />
      </div>
    );
  }

  if (!tocData) return null;

  const completedSet = new Set(
    Object.entries(tocData.progress)
      .filter(([, v]) => v.completed)
      .map(([k]) => k)
  );

  return (
    <>
      <style>{`
        @keyframes reader-fade { from { opacity:0; } to { opacity:1; } }
        .reader-fade { animation: reader-fade 0.3s ease-out; }
        .reader-md h1 { font-family: ${FP}; font-size: 1.75rem; font-weight: 700; color: ${TX}; margin-bottom: 1rem; line-height: 1.3; }
        .reader-md h2 { font-family: ${FP}; font-size: 1.35rem; font-weight: 700; color: ${TX}; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.3; }
        .reader-md h3 { font-family: ${FP}; font-size: 1.15rem; font-weight: 600; color: ${TX}; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .reader-md p { font-family: ${FB}; font-size: 17px; line-height: 1.7; color: #A3A3A3; margin-bottom: 1rem; }
        .reader-md strong { color: ${TX}; font-weight: 600; }
        .reader-md em { font-style: italic; }
        .reader-md ul, .reader-md ol { margin-bottom: 1rem; padding-left: 1.5rem; }
        .reader-md li { font-family: ${FB}; font-size: 17px; line-height: 1.7; color: #A3A3A3; margin-bottom: 0.25rem; }
        .reader-md hr { border: none; border-top: 1px solid ${CBR}; margin: 2rem 0; }
        .reader-md blockquote { border-left: 3px solid ${TL}; padding-left: 1rem; margin: 1.5rem 0; }
        .reader-md blockquote p { font-size: 18px; font-style: italic; color: ${TX}; line-height: 1.6; }
        .reader-md code { font-family: ${FM}; font-size: 14px; background: rgba(20,184,166,0.1); color: ${TL}; padding: 2px 6px; border-radius: 3px; }
        .reader-md pre { background: rgba(255,255,255,0.04); border: 1px solid ${CBR}; border-radius: 4px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
        .reader-md pre code { background: none; padding: 0; }
        .reader-locked { filter: blur(4px); pointer-events: none; user-select: none; }
        .sel-toolbar { position: fixed; z-index: 60; }
        .reader-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 70; }
      `}</style>

      <div className="h-screen flex flex-col" style={{ background: BG, fontFamily: FB }}>
        <header className="flex items-center justify-between px-4 h-12 flex-shrink-0" style={{ borderBottom: `1px solid ${CBR}`, background: BG }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/portal")}
              className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              style={{ color: MU, fontFamily: FM }}
              data-testid="button-back-portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Portal
            </button>
            <span style={{ color: CBR }}>|</span>
            <button
              onClick={() => setTocOpen((v) => !v)}
              className="p-1 transition-colors cursor-pointer md:hidden"
              style={{ color: MU }}
              data-testid="button-toggle-toc-mobile"
            >
              {tocOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <h1 className="text-xs font-bold tracking-wider uppercase truncate" style={{ fontFamily: FM, color: TX }} data-testid="text-reader-title">
              {section?.title || "Reader"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {section && (
              <span className="text-[10px] uppercase tracking-wider" style={{ color: MU, fontFamily: FM }} data-testid="text-read-time">
                {section.readMinutes} min read
              </span>
            )}
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className="p-1.5 transition-colors cursor-pointer"
              style={{ color: notesOpen ? TL : MU }}
              data-testid="button-toggle-notes"
            >
              {notesOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <div className="relative h-0.5 flex-shrink-0" style={{ background: CBR }}>
          <div ref={progressBarRef} className="h-full transition-all" style={{ background: TL, width: "0%" }} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {tocOpen && (
            <div className="w-[250px] flex-shrink-0 overflow-y-auto border-r hidden md:block" style={{ borderColor: CBR, background: BG }}>
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] mb-3 px-2" style={{ color: MU, fontFamily: FM }}>
                  Contents — {tocData.stats.percentComplete}% complete
                </p>
                {tocData.groups.map((group) => (
                  <div key={group.id} className="mb-1">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-sm transition-colors cursor-pointer"
                      style={{ color: TX, fontFamily: FB }}
                      data-testid={`toc-group-${group.id}`}
                    >
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: MU }} />
                      ) : (
                        <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: MU }} />
                      )}
                      <span className="text-xs font-medium truncate">{group.title}</span>
                    </button>
                    {expandedGroups.has(group.id) && (
                      <div className="ml-5 space-y-0.5 mt-0.5">
                        {group.sections.map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => !sec.locked && navigateTo(sec.id)}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left rounded-sm transition-colors text-xs"
                            style={{
                              color: sec.locked ? "rgba(115,115,115,0.5)" : activeSectionId === sec.id ? TL : "#A3A3A3",
                              background: activeSectionId === sec.id ? "rgba(20,184,166,0.08)" : "transparent",
                              borderLeft: activeSectionId === sec.id ? `2px solid ${TL}` : "2px solid transparent",
                              cursor: sec.locked ? "not-allowed" : "pointer",
                            }}
                            data-testid={`toc-section-${sec.id}`}
                          >
                            {sec.locked ? (
                              <Lock className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(115,115,115,0.4)" }} />
                            ) : completedSet.has(sec.id) ? (
                              <Check className="w-3 h-3 flex-shrink-0" style={{ color: TL }} />
                            ) : (
                              <div className="w-3 h-3 flex-shrink-0 rounded-full" style={{ border: `1px solid rgba(115,115,115,0.3)` }} />
                            )}
                            <span className="truncate">{sec.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tocOpen && (
            <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setTocOpen(false)}>
              <div className="w-[280px] h-full overflow-y-auto" style={{ background: BG, borderRight: `1px solid ${CBR}` }} onClick={(e) => e.stopPropagation()}>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MU, fontFamily: FM }}>
                      Contents — {tocData.stats.percentComplete}%
                    </p>
                    <button onClick={() => setTocOpen(false)} className="p-1 cursor-pointer" style={{ color: MU }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {tocData.groups.map((group) => (
                    <div key={group.id} className="mb-1">
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-left cursor-pointer"
                        style={{ color: TX }}
                      >
                        {expandedGroups.has(group.id) ? <ChevronDown className="w-3 h-3" style={{ color: MU }} /> : <ChevronRight className="w-3 h-3" style={{ color: MU }} />}
                        <span className="text-xs font-medium">{group.title}</span>
                      </button>
                      {expandedGroups.has(group.id) && (
                        <div className="ml-5 space-y-0.5 mt-0.5">
                          {group.sections.map((sec) => (
                            <button
                              key={sec.id}
                              onClick={() => { if (!sec.locked) { navigateTo(sec.id); setTocOpen(false); } }}
                              className="w-full flex items-center gap-2 px-2 py-1 text-left text-xs"
                              style={{
                                color: sec.locked ? "rgba(115,115,115,0.5)" : activeSectionId === sec.id ? TL : "#A3A3A3",
                                background: activeSectionId === sec.id ? "rgba(20,184,166,0.08)" : "transparent",
                                cursor: sec.locked ? "not-allowed" : "pointer",
                              }}
                            >
                              {sec.locked ? <Lock className="w-3 h-3" style={{ color: "rgba(115,115,115,0.4)" }} /> : completedSet.has(sec.id) ? <Check className="w-3 h-3" style={{ color: TL }} /> : <div className="w-3 h-3 rounded-full" style={{ border: `1px solid rgba(115,115,115,0.3)` }} />}
                              <span className="truncate">{sec.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={readerRef} className="flex-1 overflow-y-auto" style={{ background: BG }}>
            {sectionLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: TL }} />
              </div>
            ) : section ? (
              <div className="reader-fade">
                <div className="max-w-[680px] mx-auto px-6 py-8">
                  {section.locked ? (
                    <>
                      <div className="reader-md reader-locked">
                        <ReactMarkdown>{section.content}</ReactMarkdown>
                      </div>
                      <div className="relative -mt-20 pt-16 pb-8 text-center" style={{ background: `linear-gradient(to bottom, transparent, ${BG} 40%)` }}>
                        <Lock className="w-8 h-8 mx-auto mb-3" style={{ color: MU }} />
                        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: FP, color: TX }}>Upgrade to Unlock</h3>
                        <p className="text-sm mb-4" style={{ color: MU }}>This section requires a higher access tier.</p>
                        <button
                          onClick={() => setLocation("/portal")}
                          className="px-6 py-2.5 rounded-md text-sm font-medium tracking-wider uppercase cursor-pointer"
                          style={{ background: TL, color: BG, fontFamily: FM }}
                          data-testid="button-upgrade-cta"
                        >
                          View Upgrade Options
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="reader-md">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  )}

                  {!section.locked && (
                    <div className="flex items-center justify-between mt-12 pt-6" style={{ borderTop: `1px solid ${CBR}` }}>
                      {section.prev ? (
                        <button
                          onClick={() => navigateTo(section.prev!)}
                          className="flex items-center gap-2 text-sm transition-colors cursor-pointer"
                          style={{ color: MU, fontFamily: FM }}
                          data-testid="button-prev-section"
                        >
                          <ArrowLeft className="w-4 h-4" /> Previous
                        </button>
                      ) : <div />}
                      {section.next ? (
                        <button
                          onClick={() => navigateTo(section.next!)}
                          className="flex items-center gap-2 text-sm transition-colors cursor-pointer"
                          style={{ color: TL, fontFamily: FM }}
                          data-testid="button-next-section"
                        >
                          Next <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs" style={{ color: MU, fontFamily: FM }}>End of content</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm" style={{ color: MU }}>Select a section from the table of contents</p>
              </div>
            )}
          </div>

          {notesOpen && (
            <div className="w-[280px] flex-shrink-0 overflow-hidden border-l hidden md:flex flex-col" style={{ borderColor: CBR, background: BG }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${CBR}` }}>
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: FM, color: TX }}>My Notes</h3>
                <span className="text-[10px]" style={{ color: MU, fontFamily: FM }}>{notes.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {notes.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: MU }}>
                    Highlight text to save notes, or type below.
                  </p>
                )}
                {notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-md group" style={{ background: CB, border: `1px solid ${CBR}` }}>
                    {note.highlightText && (
                      <p className="text-xs italic mb-1.5" style={{ color: TL, fontFamily: FB, borderLeft: `2px solid ${TL}`, paddingLeft: "8px" }}>
                        "{note.highlightText}"
                      </p>
                    )}
                    {note.content && (
                      <p className="text-xs" style={{ color: "#A3A3A3", fontFamily: FB }}>{note.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px]" style={{ color: MU, fontFamily: FM }}>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                        style={{ color: MU }}
                        data-testid={`button-delete-note-${note.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3" style={{ borderTop: `1px solid ${CBR}` }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(); }}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 rounded-md text-xs focus:outline-none"
                    style={{ background: CB, border: `1px solid ${CBR}`, color: TX, fontFamily: FB }}
                    data-testid="input-new-note"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="p-2 rounded-md disabled:opacity-30 cursor-pointer"
                    style={{ background: TL, color: BG }}
                    data-testid="button-add-note"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {selToolbar && (
          <div
            className="sel-toolbar reader-fade"
            style={{ top: selToolbar.y - 44, left: Math.max(10, Math.min(selToolbar.x - 100, window.innerWidth - 210)) }}
          >
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-md" style={{ background: "#1a1a1a", border: `1px solid ${TL}`, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
              <button
                onClick={() => handleSaveToNotes(selToolbar.text)}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-colors"
                style={{ color: TX, fontFamily: FB }}
                data-testid="button-sel-save"
              >
                <Bookmark className="w-3 h-3" style={{ color: TL }} />
                Save
              </button>
              <div className="w-px h-4" style={{ background: CBR }} />
              <button
                onClick={() => handleCopyText(selToolbar.text)}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-colors"
                style={{ color: TX, fontFamily: FB }}
                data-testid="button-sel-copy"
              >
                <Copy className="w-3 h-3" style={{ color: MU }} />
                Copy
              </button>
              <div className="w-px h-4" style={{ background: CBR }} />
              <button
                onClick={() => { setShareModal(selToolbar.text); setSelToolbar(null); window.getSelection()?.removeAllRanges(); }}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-colors"
                style={{ color: TX, fontFamily: FB }}
                data-testid="button-sel-share"
              >
                <Share2 className="w-3 h-3" style={{ color: MU }} />
                Share
              </button>
            </div>
          </div>
        )}

        {copyToast && (
          <div className="reader-toast">
            <div className="px-4 py-2 rounded-md text-xs" style={{ background: TL, color: BG, fontFamily: FM }}>
              Copied!
            </div>
          </div>
        )}

        {shareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setShareModal(null)}>
            <div className="max-w-lg w-full rounded-md overflow-hidden" style={{ background: BG, border: `1px solid ${CBR}` }} onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: FM, color: TX }}>Share Quote</h3>
                  <button onClick={() => setShareModal(null)} className="p-1 cursor-pointer" style={{ color: MU }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-8 rounded-md mb-4" style={{ background: "#111", border: `1px solid ${CBR}` }}>
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: TL, fontFamily: FM }}>The Archivist Method</p>
                  <blockquote className="mb-6" style={{ borderLeft: `3px solid ${TL}`, paddingLeft: "16px" }}>
                    <p className="text-lg leading-relaxed italic" style={{ fontFamily: FP, color: TX }}>
                      "{shareModal}"
                    </p>
                  </blockquote>
                  <p className="text-xs" style={{ color: MU, fontFamily: FM }}>thearchivistmethod.com</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      handleCopyText(shareModal);
                      setShareModal(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-xs cursor-pointer"
                    style={{ border: `1px solid ${CBR}`, color: TX, fontFamily: FM }}
                    data-testid="button-share-copy-text"
                  >
                    <Copy className="w-3 h-3" /> Copy Text
                  </button>
                  <button
                    onClick={() => {
                      const tweetText = encodeURIComponent(`"${shareModal}" — The Archivist Method\n\nthearchivistmethod.com`);
                      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
                      setShareModal(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-xs cursor-pointer"
                    style={{ border: `1px solid ${CBR}`, color: TX, fontFamily: FM }}
                    data-testid="button-share-twitter"
                  >
                    Share to X
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-4 right-4 z-30 portal-tooltip-trigger">
          <button
            onClick={() => setShowShortcuts((v) => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: CB, border: `1px solid ${CBR}`, color: MU }}
            data-testid="button-shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          {showShortcuts && (
            <div
              className="absolute bottom-10 right-0 p-4 rounded-md reader-fade"
              style={{ background: "#1a1a1a", border: `1px solid ${CBR}`, minWidth: "200px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ fontFamily: FM, color: TX }}>Keyboard Shortcuts</h4>
              {[
                ["←", "Previous section"],
                ["→", "Next section"],
                ["N", "Toggle notes"],
                ["Esc", "Close modal"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: "#A3A3A3", fontFamily: FB }}>{desc}</span>
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: CB, border: `1px solid ${CBR}`, color: TL, fontFamily: FM }}>{key}</kbd>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
