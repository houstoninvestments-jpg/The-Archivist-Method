import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Trash2, LogOut, Plus, BookOpen, Zap, Archive } from "lucide-react";
import type { TestUser } from "@shared/schema";

interface Stats {
  total: number;
  crashCourse: number;
  quickStart: number;
  archive: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<TestUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, crashCourse: 0, quickStart: 0, archive: 0 });
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const token = localStorage.getItem("adminToken");

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      setLocation("/admin");
      return;
    }
    loadData();
  }, [token]);

  // Client-side inactivity timeout (60 minutes)
  useEffect(() => {
    if (!token) return;

    const TIMEOUT_DURATION = 60 * 60 * 1000; // 60 minutes
    let lastActivity = Date.now();
    
    const updateActivity = () => {
      lastActivity = Date.now();
    };
    
    const checkTimeout = setInterval(() => {
      if (Date.now() - lastActivity > TIMEOUT_DURATION) {
        // Auto logout due to inactivity
        fetch('/api/admin/logout', { 
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('adminToken');
        setLocation('/admin?reason=timeout');
      }
    }, 60000); // Check every minute
    
    // Track user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);
    
    return () => {
      clearInterval(checkTimeout);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [token, setLocation]);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch("/api/admin/test-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (usersRes.status === 401 || statsRes.status === 401) {
        localStorage.removeItem("adminToken");
        setLocation("/admin");
        return;
      }

      const [usersData, statsData] = await Promise.all([usersRes.json(), statsRes.json()]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !accessLevel) return;

    setIsAdding(true);
    try {
      const response = await fetch("/api/admin/add-test-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, accessLevel, note: note || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: "User added successfully" });
      setEmail("");
      setAccessLevel("");
      setNote("");
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add user", variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await fetch(`/api/admin/test-user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Success", description: "User deleted" });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const accessLevelLabels: Record<string, string> = {
    "crash-course": "Crash Course",
    "quick-start": "Quick-Start",
    "archive": "Complete Archive",
  };

  const accessLevelColors: Record<string, string> = {
    "crash-course": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "quick-start": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "archive": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#14B8A6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['Inter']">
      <header className="border-b border-[#333333] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#14B8A6]" />
            <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-[#333333] text-[#9ca3af] hover:text-white"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1a1a1a] border-[#333333]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-[#14B8A6]/10">
                  <Users className="w-6 h-6 text-[#14B8A6]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white" data-testid="text-stat-total">{stats.total}</p>
                  <p className="text-sm text-[#9ca3af]">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333333]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white" data-testid="text-stat-crash-course">{stats.crashCourse}</p>
                  <p className="text-sm text-[#9ca3af]">Crash Course</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333333]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white" data-testid="text-stat-quick-start">{stats.quickStart}</p>
                  <p className="text-sm text-[#9ca3af]">Quick-Start</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333333]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <Archive className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white" data-testid="text-stat-archive">{stats.archive}</p>
                  <p className="text-sm text-[#9ca3af]">Archive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1a1a1a] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#14B8A6]" />
              Add Test User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border-[#333333] text-white"
                data-testid="input-add-user-email"
              />
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger
                  className="w-full sm:w-48 bg-[#0a0a0a] border-[#333333] text-white"
                  data-testid="select-access-level"
                >
                  <SelectValue placeholder="Access Level" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333333]">
                  <SelectItem value="crash-course">Crash Course</SelectItem>
                  <SelectItem value="quick-start">Quick-Start</SelectItem>
                  <SelectItem value="archive">Complete Archive</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border-[#333333] text-white"
                data-testid="input-add-user-note"
              />
              <Button
                type="submit"
                disabled={isAdding || !email || !accessLevel}
                className="bg-[#14B8A6] hover:bg-[#0d9488] text-white"
                data-testid="button-add-user"
              >
                {isAdding ? "Adding..." : "Add User"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#14B8A6]" />
              Test Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-[#9ca3af] text-center py-8">No test users yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333333]">
                      <th className="text-left py-3 px-4 text-[#9ca3af] font-medium text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-[#9ca3af] font-medium text-sm">Access</th>
                      <th className="text-left py-3 px-4 text-[#9ca3af] font-medium text-sm">Note</th>
                      <th className="text-left py-3 px-4 text-[#9ca3af] font-medium text-sm">Added</th>
                      <th className="text-right py-3 px-4 text-[#9ca3af] font-medium text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#333333]/50 hover:bg-[#0a0a0a]/50 transition-colors"
                        data-testid={`row-user-${user.id}`}
                      >
                        <td className="py-3 px-4">
                          <span className="text-white" data-testid={`text-email-${user.id}`}>{user.email}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs border ${accessLevelColors[user.accessLevel] || "bg-gray-500/20 text-gray-400"}`}
                            data-testid={`badge-access-${user.id}`}
                          >
                            {accessLevelLabels[user.accessLevel] || user.accessLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#9ca3af]">{user.note || "-"}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#9ca3af] text-sm">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            data-testid={`button-delete-${user.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
