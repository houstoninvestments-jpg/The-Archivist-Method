import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import { AuthProvider } from "@/hooks/useAuth";

import NotFound from "@/pages/not-found";

const Landing = lazy(() => import("@/pages/Landing"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const QuizResult = lazy(() => import("@/pages/QuizResult"));
const Portal = lazy(() => import("@/pages/Portal"));
const PortalLogin = lazy(() => import("@/pages/PortalLogin"));
const Auth = lazy(() => import("@/pages/Auth"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Contact = lazy(() => import("@/pages/Contact"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Checkout = lazy(() => import("@/pages/Checkout"));

function ProtectedPortal() {
  return (
    <RequireAuth>
      <Portal />
    </RequireAuth>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }} />
  );
}

function CrashCourseRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/portal", { replace: true });
  }, [navigate]);
  return <PageLoader />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/results" component={QuizResult} />
      <Route path="/auth" component={Auth} />
      <Route path="/portal/login" component={PortalLogin} />
      <Route path="/portal/crash-course" component={CrashCourseRedirect} />
      <Route path="/portal/dev" component={Portal} />
      <Route path="/portal" component={ProtectedPortal} />
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
  const isAuth = location.startsWith("/auth");
  const hideHeaderFooter = isPortal || isQuiz || isLanding || isResults || isAdmin || isAuth;

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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
