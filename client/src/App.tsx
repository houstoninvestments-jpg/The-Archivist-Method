import { useEffect, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GodModeBadge from "@/components/GodModeBadge";

import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

const Quiz = lazy(() => import("@/pages/Quiz"));
const QuizResult = lazy(() => import("@/pages/QuizResult"));
const PortalDashboard = lazy(() => import("@/pages/PortalDashboard"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Contact = lazy(() => import("@/pages/Contact"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const TestingPanel = lazy(() => import("@/components/TestingPanel"));
const VaultWorkbench = lazy(() => import("@/pages/VaultWorkbench"));
const VaultArchive = lazy(() => import("@/pages/VaultArchive"));
const ContentReader = lazy(() => import("@/pages/ContentReader"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#14B8A6]"></div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/results" component={QuizResult} />
      <Route path="/portal/reader" component={ContentReader} />
      <Route path="/portal" component={PortalDashboard} />
      <Route path="/vault/workbench" component={VaultWorkbench} />
      <Route path="/vault/archive" component={VaultArchive} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('godmode') === 'true') {
      localStorage.setItem('godMode', 'true');
      params.delete('godmode');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
      window.location.reload();
    } else if (params.get('godmode') === 'false') {
      localStorage.removeItem('godMode');
      params.delete('godmode');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
      window.location.reload();
    }
  }, []);
  
  const isLanding = location === "/";
  const isPortal = location.startsWith("/portal");
  const isVault = location.startsWith("/vault");
  const isQuiz = location.startsWith("/quiz");
  const isResults = location.startsWith("/results");
  const isAdmin = location.startsWith("/admin");
  const hideHeaderFooter = isPortal || isVault || isQuiz || isLanding || isResults || isAdmin;
  const showTestingPanel = isPortal || isVault || isAdmin;
  
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Router />
        </Suspense>
      </main>
      {!hideHeaderFooter && <Footer />}
      <Suspense fallback={null}>
        {showTestingPanel && <TestingPanel />}
      </Suspense>
      <GodModeBadge />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
