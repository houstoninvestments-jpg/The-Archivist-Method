import { useEffect, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GodModeBadge from "@/components/GodModeBadge";

// Eagerly loaded - Landing page for fast initial load
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

// Lazy loaded pages for code splitting
const Quiz = lazy(() => import("@/pages/Quiz"));
const QuizResult = lazy(() => import("@/pages/QuizResult"));
const QuizFallback = lazy(() => import("@/pages/QuizFallback"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const ThankYouQuickStart = lazy(() => import("@/pages/ThankYouQuickStart"));
const ThankYouComplete = lazy(() => import("@/pages/ThankYouComplete"));
const Portal = lazy(() => import("@/pages/Portal"));
const PortalLogin = lazy(() => import("@/pages/PortalLogin"));
const PortalDashboard = lazy(() => import("@/pages/PortalDashboard"));
const PortalDashboardPreview = lazy(() => import("@/pages/PortalDashboardPreview"));
const PortalReader = lazy(() => import("@/pages/PortalReader"));
const PortalDownloads = lazy(() => import("@/pages/PortalDownloads"));
const PortalWorkbook = lazy(() => import("@/pages/PortalWorkbook"));
const FreeDownload = lazy(() => import("@/pages/FreeDownload"));
const QuickStart = lazy(() => import("@/pages/QuickStart"));
const CompleteArchive = lazy(() => import("@/pages/CompleteArchive"));
const Members47 = lazy(() => import("@/pages/Members47"));
const Members197 = lazy(() => import("@/pages/Members197"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Contact = lazy(() => import("@/pages/Contact"));
const FourDoors = lazy(() => import("@/pages/FourDoors"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const ArchivistChatbot = lazy(() => import("@/components/ArchivistChatbot"));
const TestingPanel = lazy(() => import("@/components/TestingPanel"));

// Loading fallback component
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
      <Route path="/four-doors" component={FourDoors} />
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
        <Suspense fallback={<PageLoader />}>
          <Router />
        </Suspense>
      </main>
      {!hideHeaderFooter && <Footer />}
      <Suspense fallback={null}>
        {showPremiumChatbot && <ArchivistChatbot />}
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
