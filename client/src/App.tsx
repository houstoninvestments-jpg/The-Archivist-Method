import { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import NotFound from "@/pages/not-found";

const Landing = lazy(() => import("@/pages/Landing"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const QuizResult = lazy(() => import("@/pages/QuizResult"));
const NewPortal = lazy(() => import("@/pages/NewPortal"));
const CrashCourse = lazy(() => import("@/pages/CrashCourse"));
const PortalLogin = lazy(() => import("@/pages/PortalLogin"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Contact = lazy(() => import("@/pages/Contact"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Checkout = lazy(() => import("@/pages/Checkout"));

function PageLoader() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }} />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/results" component={QuizResult} />
      <Route path="/portal/login" component={PortalLogin} />
      <Route path="/portal/crash-course" component={CrashCourse} />
      <Route path="/portal" component={NewPortal} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();

  const isLanding = location === "/";
  const isPortal = location.startsWith("/portal");
  const isQuiz = location.startsWith("/quiz");
  const isResults = location.startsWith("/results");
  const isAdmin = location.startsWith("/admin");
  const hideHeaderFooter = isPortal || isQuiz || isLanding || isResults || isAdmin;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Router />
        </Suspense>
      </main>
      {!hideHeaderFooter && <Footer />}
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
