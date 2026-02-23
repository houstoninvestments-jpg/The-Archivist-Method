import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import type { TestUser } from "@shared/schema";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";

const BG = "#0A0A0A";
const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const TL = "#14B8A6";
const PK = "#EC4899";
const TEXT = "#F5F5F5";
const MUTED = "#999999";
const FONT_DISPLAY = "'Playfair Display', serif";
const FONT_BODY = "'Source Sans 3', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

interface Stats {
  total: number;
  crashCourse: number;
  quickStart: number;
  archive: number;
}

interface ContentGroup {
  group: string;
  groupTitle: string;
  sections: {
    id: string;
    title: string;
    filePath: string;
    exists: boolean;
    wordCount: number;
    lastModified: string | null;
  }[];
}

interface EnvVar {
  key: string;
  set: boolean;
}

type Tab = "overview" | "users" | "content" | "settings";

function adminFetch(path: string, opts?: RequestInit) {
  const token = localStorage.getItem("adminToken");
  return fetch(`/api/admin${path}`, {
    ...opts,
    headers: {
      ...opts?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: "4px",
        padding: "24px",
      }}
    >
      <div
        style={{ fontFamily: FONT_DISPLAY, fontSize: "2.5rem", color: TL }}
        data-testid={`text-stat-${label.toLowerCase().replace(/[^a-z]/g, "-")}`}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: "0.875rem",
          color: "#999",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    "crash-course": { bg: "rgba(115,115,115,0.15)", text: MUTED, label: "Free" },
    "quick-start": { bg: "rgba(20,184,166,0.1)", text: TL, label: "Field Guide" },
    archive: { bg: "rgba(236,72,153,0.1)", text: PK, label: "Archive" },
  };
  const c = config[tier] || config["crash-course"];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "2px",
        background: c.bg,
        color: c.text,
        fontFamily: FONT_MONO,
        fontSize: "0.7rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
      data-testid={`badge-tier-${tier}`}
    >
      {c.label}
    </span>
  );
}

function OverviewTab({ stats, users }: { stats: Stats; users: TestUser[] }) {
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 10);

  return (
    <div>
      <h2
        style={{ fontFamily: FONT_DISPLAY, fontSize: "1.5rem", color: TEXT, marginBottom: "24px" }}
      >
        Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <StatCard value={stats.total} label="Total Users" />
        <StatCard value={stats.crashCourse} label="Free Tier" />
        <StatCard value={stats.quickStart} label="Field Guide ($47)" />
        <StatCard value={stats.archive} label="Complete Archive ($197)" />
      </div>

      <h3
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.75rem",
          color: MUTED,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}
      >
        Recent Signups
      </h3>

      {recentUsers.length === 0 ? (
        <p style={{ color: MUTED, fontFamily: FONT_BODY }}>No users yet</p>
      ) : (
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                {["Email", "Tier", "Signup Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      fontFamily: FONT_MONO,
                      fontSize: "0.7rem",
                      color: MUTED,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: `1px solid ${CARD_BORDER}` }}
                  data-testid={`row-recent-${u.id}`}
                >
                  <td style={{ padding: "10px 16px", color: TEXT, fontFamily: FONT_BODY, fontSize: "0.875rem" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <TierBadge tier={u.accessLevel} />
                  </td>
                  <td style={{ padding: "10px 16px", color: MUTED, fontFamily: FONT_MONO, fontSize: "0.75rem" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UsersTab({
  users,
  onReload,
}: {
  users: TestUser[];
  onReload: () => void;
}) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addTier, setAddTier] = useState("crash-course");
  const [addLoading, setAddLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!addEmail) return;
    setAddLoading(true);
    try {
      const res = await adminFetch("/add-test-user", {
        method: "POST",
        body: JSON.stringify({ email: addEmail, accessLevel: addTier }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast({ title: "Error", description: d.error, variant: "destructive" });
        return;
      }
      toast({ title: "User added" });
      setAddEmail("");
      setShowAdd(false);
      onReload();
    } catch {
      toast({ title: "Error", description: "Failed to add user", variant: "destructive" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/test-user/${id}`, { method: "DELETE" });
      toast({ title: "User deleted" });
      setDeleteId(null);
      onReload();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleToggleGodMode = async (id: string, current: boolean) => {
    try {
      const res = await adminFetch(`/test-user/${id}/god-mode`, {
        method: "PATCH",
        body: JSON.stringify({ godMode: !current }),
      });
      if (!res.ok) throw new Error();
      onReload();
    } catch {
      toast({ title: "Error", description: "Failed to toggle", variant: "destructive" });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "12px", flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "1.5rem", color: TEXT }}>Users</h2>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            background: "transparent",
            border: `1px solid rgba(255,255,255,0.2)`,
            borderRadius: "2px",
            color: TEXT,
            fontFamily: FONT_MONO,
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
          data-testid="button-add-user"
        >
          <Plus className="w-3.5 h-3.5" />
          Add User
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: "16px" }}>
        <Search
          className="w-4 h-4"
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: MUTED }}
        />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: "2px",
            color: TEXT,
            fontFamily: FONT_BODY,
            fontSize: "0.875rem",
            outline: "none",
          }}
          data-testid="input-search-users"
        />
      </div>

      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
              {["Email", "Tier", "Signup Date", "God Mode", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: h === "" ? "right" : "left",
                    padding: "12px 16px",
                    fontFamily: FONT_MONO,
                    fontSize: "0.7rem",
                    color: MUTED,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: MUTED, fontFamily: FONT_BODY }}>
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: `1px solid ${CARD_BORDER}` }}
                  data-testid={`row-user-${u.id}`}
                >
                  <td style={{ padding: "10px 16px", color: TEXT, fontFamily: FONT_BODY, fontSize: "0.875rem" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <TierBadge tier={u.accessLevel} />
                  </td>
                  <td style={{ padding: "10px 16px", color: MUTED, fontFamily: FONT_MONO, fontSize: "0.75rem" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <Switch
                      checked={u.godMode || false}
                      onCheckedChange={() => handleToggleGodMode(u.id, u.godMode || false)}
                      data-testid={`switch-god-mode-${u.id}`}
                    />
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    <button
                      onClick={() => setDeleteId(u.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: "4px" }}
                      data-testid={`button-delete-${u.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: "#111",
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: "4px",
              padding: "32px",
              width: "100%",
              maxWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.8rem",
                color: TL,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Add Test User
            </h3>
            <input
              type="email"
              placeholder="Email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: "12px",
                background: CARD_BG,
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: "2px",
                color: TEXT,
                fontFamily: FONT_BODY,
                fontSize: "0.875rem",
                outline: "none",
              }}
              data-testid="input-add-email"
            />
            <select
              value={addTier}
              onChange={(e) => setAddTier(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: "20px",
                background: "#111",
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: "2px",
                color: TEXT,
                fontFamily: FONT_MONO,
                fontSize: "0.8rem",
                outline: "none",
              }}
              data-testid="select-add-tier"
            >
              <option value="crash-course">Free (Crash Course)</option>
              <option value="quick-start">Field Guide ($47)</option>
              <option value="archive">Complete Archive ($197)</option>
            </select>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: "2px",
                  color: MUTED,
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleAdd}
                disabled={addLoading || !addEmail}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: `1px solid rgba(255,255,255,0.2)`,
                  borderRadius: "2px",
                  color: TEXT,
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  cursor: addLoading || !addEmail ? "not-allowed" : "pointer",
                  opacity: addLoading || !addEmail ? 0.4 : 1,
                }}
                data-testid="button-create-user"
              >
                {addLoading ? "..." : "CREATE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setDeleteId(null)}
        >
          <div
            style={{
              background: "#111",
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: "4px",
              padding: "32px",
              width: "100%",
              maxWidth: "380px",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AlertTriangle className="w-8 h-8 mx-auto mb-4" style={{ color: PK }} />
            <p style={{ color: TEXT, fontFamily: FONT_BODY, marginBottom: "20px" }}>
              Delete this user?
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: "2px",
                  color: MUTED,
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(236,72,153,0.1)",
                  border: `1px solid rgba(236,72,153,0.3)`,
                  borderRadius: "2px",
                  color: PK,
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                data-testid="button-confirm-delete"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentTab() {
  const [content, setContent] = useState<ContentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    adminFetch("/content-audit")
      .then((r) => r.json())
      .then((d) => setContent(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div style={{ color: MUTED, fontFamily: FONT_BODY, padding: "40px 0", textAlign: "center" }}>
        Loading content...
      </div>
    );
  }

  const totalSections = content.reduce((acc, g) => acc + g.sections.length, 0);
  const existingSections = content.reduce(
    (acc, g) => acc + g.sections.filter((s) => s.exists).length,
    0
  );
  const totalWords = content.reduce(
    (acc, g) => acc + g.sections.reduce((a, s) => a + s.wordCount, 0),
    0
  );

  return (
    <div>
      <h2
        style={{ fontFamily: FONT_DISPLAY, fontSize: "1.5rem", color: TEXT, marginBottom: "8px" }}
      >
        Content
      </h2>
      <p style={{ fontFamily: FONT_MONO, fontSize: "0.75rem", color: MUTED, marginBottom: "24px" }}>
        {existingSections}/{totalSections} files found &middot; {totalWords.toLocaleString()} total words
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {content.map((group) => {
          const isOpen = expanded.has(group.group);
          const fileCount = group.sections.length;
          const existCount = group.sections.filter((s) => s.exists).length;
          const allExist = existCount === fileCount;

          return (
            <div
              key={group.group}
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => toggle(group.group)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "14px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: TEXT,
                  textAlign: "left",
                }}
                data-testid={`button-expand-${group.group}`}
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" style={{ color: MUTED }} />
                ) : (
                  <ChevronRight className="w-4 h-4" style={{ color: MUTED }} />
                )}
                <span style={{ fontFamily: FONT_BODY, fontSize: "0.9rem", flex: 1 }}>
                  {group.groupTitle}
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.7rem",
                    color: allExist ? TL : PK,
                  }}
                >
                  {existCount}/{fileCount}
                </span>
              </button>

              {isOpen && (
                <div style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                  {group.sections.map((sec) => (
                    <div
                      key={sec.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 16px 10px 42px",
                        borderBottom: `1px solid ${CARD_BORDER}`,
                      }}
                      data-testid={`row-content-${sec.id}`}
                    >
                      {sec.exists ? (
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TL }} />
                      ) : (
                        <X className="w-3.5 h-3.5 flex-shrink-0" style={{ color: PK }} />
                      )}
                      <span
                        style={{
                          flex: 1,
                          fontFamily: FONT_BODY,
                          fontSize: "0.85rem",
                          color: sec.exists ? TEXT : MUTED,
                        }}
                      >
                        {sec.title}
                      </span>
                      {sec.exists && (
                        <>
                          <span
                            style={{ fontFamily: FONT_MONO, fontSize: "0.7rem", color: MUTED }}
                          >
                            {sec.wordCount.toLocaleString()} words
                          </span>
                          <span
                            style={{ fontFamily: FONT_MONO, fontSize: "0.65rem", color: "rgba(115,115,115,0.6)" }}
                          >
                            {sec.lastModified
                              ? new Date(sec.lastModified).toLocaleDateString()
                              : ""}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsTab({ onReload }: { onReload: () => void }) {
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    adminFetch("/env-check")
      .then((r) => r.json())
      .then((d) => setEnvVars(d))
      .catch(() => {});
  }, []);

  const handleClearAll = async () => {
    setClearing(true);
    try {
      const res = await adminFetch("/test-users/all", { method: "DELETE" });
      const d = await res.json();
      toast({ title: "Done", description: d.message });
      setConfirmClear(false);
      onReload();
    } catch {
      toast({ title: "Error", description: "Failed to clear users", variant: "destructive" });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div>
      <h2
        style={{ fontFamily: FONT_DISPLAY, fontSize: "1.5rem", color: TEXT, marginBottom: "24px" }}
      >
        Settings
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: "4px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.75rem",
              color: MUTED,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Environment
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {envVars.map((v) => (
              <div
                key={v.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 0",
                }}
                data-testid={`env-${v.key}`}
              >
                {v.set ? (
                  <Check className="w-3.5 h-3.5" style={{ color: TL }} />
                ) : (
                  <X className="w-3.5 h-3.5" style={{ color: PK }} />
                )}
                <span
                  style={{ fontFamily: FONT_MONO, fontSize: "0.8rem", color: v.set ? TEXT : MUTED }}
                >
                  {v.key}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "rgba(236,72,153,0.03)",
            border: `1px solid rgba(236,72,153,0.1)`,
            borderRadius: "4px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.75rem",
              color: PK,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Danger Zone
          </h3>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.85rem",
              color: MUTED,
              marginBottom: "16px",
            }}
          >
            Remove all test users from the database. This cannot be undone.
          </p>

          {confirmClear ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setConfirmClear(false)}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: "2px",
                  color: MUTED,
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                style={{
                  padding: "8px 16px",
                  background: "rgba(236,72,153,0.1)",
                  border: `1px solid rgba(236,72,153,0.3)`,
                  borderRadius: "2px",
                  color: PK,
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                data-testid="button-confirm-clear-all"
              >
                {clearing ? "..." : "YES, DELETE ALL"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: `1px solid rgba(236,72,153,0.2)`,
                borderRadius: "2px",
                color: PK,
                fontFamily: FONT_MONO,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
              data-testid="button-clear-all-users"
            >
              CLEAR ALL TEST USERS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<TestUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, crashCourse: 0, quickStart: 0, archive: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  const token = localStorage.getItem("adminToken");

  const loadData = useCallback(async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminFetch("/test-users"),
        adminFetch("/stats"),
      ]);

      if (usersRes.status === 401 || statsRes.status === 401) {
        localStorage.removeItem("adminToken");
        setLocation("/admin");
        return;
      }

      const [usersData, statsData] = await Promise.all([usersRes.json(), statsRes.json()]);
      setUsers(usersData);
      setStats(statsData);
    } catch {} finally {
      setIsLoading(false);
    }
  }, [setLocation]);

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
      return;
    }
    loadData();
  }, [token, setLocation, loadData]);

  const handleLogout = async () => {
    await adminFetch("/logout", { method: "POST" });
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#14B8A6]" />
      </div>
    );
  }

  const navItems: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { key: "users", label: "USERS", icon: Users },
    { key: "content", label: "CONTENT", icon: FileText },
    { key: "settings", label: "SETTINGS", icon: Settings },
  ];

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            color: TL,
          }}
          data-testid="text-admin-header"
        >
          THE ARCHIVIST METHOD &mdash; ADMIN
        </span>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: MUTED,
            fontFamily: FONT_MONO,
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
          data-testid="button-admin-logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 53px)" }}>
        <nav
          style={{
            width: "200px",
            flexShrink: 0,
            borderRight: `1px solid ${CARD_BORDER}`,
            padding: "16px 0",
          }}
          className="hidden md:block"
        >
          {navItems.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 20px",
                  background: "none",
                  border: "none",
                  borderLeft: active ? `2px solid ${TL}` : "2px solid transparent",
                  color: active ? TL : MUTED,
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                data-testid={`nav-${key}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </nav>

        <div
          className="md:hidden"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            borderTop: `1px solid ${CARD_BORDER}`,
            background: BG,
          }}
        >
          {navItems.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "10px 4px",
                  background: "none",
                  border: "none",
                  color: active ? TL : MUTED,
                  fontFamily: FONT_MONO,
                  fontSize: "0.55rem",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        <main style={{ flex: 1, padding: "32px", maxWidth: "960px", paddingBottom: "80px" }}>
          {tab === "overview" && <OverviewTab stats={stats} users={users} />}
          {tab === "users" && <UsersTab users={users} onReload={loadData} />}
          {tab === "content" && <ContentTab />}
          {tab === "settings" && <SettingsTab onReload={loadData} />}
        </main>
      </div>
    </div>
  );
}
