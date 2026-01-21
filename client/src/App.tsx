import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ArchivistChatbot from "@/components/ArchivistChatbot";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Landing from "@/pages/Landing";
import ThankYou from "@/pages/ThankYou";
import ThankYouQuickStart from "@/pages/ThankYouQuickStart";
import ThankYouComplete from "@/pages/ThankYouComplete";
import Portal from "@/pages/Portal";
import PortalLogin from "@/pages/PortalLogin";
import PortalDashboard from "@/pages/PortalDashboard";
import PortalDashboardPreview from "@/pages/PortalDashboardPreview";
import FreeDownload from "@/pages/FreeDownload";
import QuickStart from "@/pages/QuickStart";
import CompleteArchive from "@/pages/CompleteArchive";
import Members47 from "@/pages/Members47";
import Members197 from "@/pages/Members197";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Contact from "@/pages/Contact";
import Quiz from "@/pages/Quiz";
import QuizResult from "@/pages/QuizResult";
import QuizFallback from "@/pages/QuizFallback";
import PortalReader from "@/pages/PortalReader";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import PortalDownloads from "@/pages/PortalDownloads";
import PortalWorkbook from "@/pages/PortalWorkbook";
import NotFound from "@/pages/not-found";
import TestingPanel from "@/components/TestingPanel";
import GodModeBadge from "@/components/GodModeBadge";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/quiz/result/select" component={QuizFallback} />
      <Route path="/quiz/result/:pattern" component={QuizResult} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/thank-you-quick-start" component={ThankYouQuickStart} />
      <Route path="/thank-you-complete" component={ThankYouComplete} />
      <Route path="/portal/login" component={PortalLogin} />
      <Route path="/portal/dashboard" component={PortalDashboard} />
      <Route path="/portal/preview" component={PortalDashboardPreview} />
      <Route path="/portal/reader/:documentId" component={PortalReader} />
      <Route path="/portal/downloads" component={PortalDownloads} />
      <Route path="/portal/workbook/:slug" component={PortalWorkbook} />
      <Route path="/portal" component={Portal} />
      <Route path="/free" component={FreeDownload} />
      <Route path="/quick-start" component={QuickStart} />
      <Route path="/complete-archive" component={CompleteArchive} />
      <Route path="/members-47" component={Members47} />
      <Route path="/members-197" component={Members197} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  
  // Check for godmode URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('godmode') === 'true') {
      localStorage.setItem('godMode', 'true');
      // Clean up URL
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
  const isPortalDashboard = location.startsWith("/portal/dashboard") || location.startsWith("/members");
  const isPortalReader = location.startsWith("/portal/reader");
  const isPortalDownloads = location.startsWith("/portal/downloads");
  const isPortalWorkbook = location.startsWith("/portal/workbook");
  const isQuiz = location.startsWith("/quiz");
  const isAdmin = location.startsWith("/admin");
  const hideHeaderFooter = isPortalDashboard || isQuiz || isLanding || isPortalReader || isAdmin || isPortalDownloads || isPortalWorkbook;
  const showPremiumChatbot = isPortalDashboard;
  const showTestingPanel = isPortalDashboard || isPortalDownloads || isPortalWorkbook || isAdmin;
  
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <Router />
      </main>
      {!hideHeaderFooter && <Footer />}
      {showPremiumChatbot && <ArchivistChatbot />}
      {showTestingPanel && <TestingPanel />}
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
