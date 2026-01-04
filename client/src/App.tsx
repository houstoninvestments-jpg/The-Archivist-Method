import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ArchivistChatbot from "@/components/ArchivistChatbot";
import Landing from "@/pages/Landing";
import ThankYou from "@/pages/ThankYou";
import ThankYouQuickStart from "@/pages/ThankYouQuickStart";
import ThankYouComplete from "@/pages/ThankYouComplete";
import Portal from "@/pages/Portal";
import FreeDownload from "@/pages/FreeDownload";
import QuickStart from "@/pages/QuickStart";
import CompleteArchive from "@/pages/CompleteArchive";
import Members47 from "@/pages/Members47";
import Members197 from "@/pages/Members197";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/thank-you-quick-start" component={ThankYouQuickStart} />
      <Route path="/thank-you-complete" component={ThankYouComplete} />
      <Route path="/portal" component={Portal} />
      <Route path="/free" component={FreeDownload} />
      <Route path="/quick-start" component={QuickStart} />
      <Route path="/complete-archive" component={CompleteArchive} />
      <Route path="/members-47" component={Members47} />
      <Route path="/members-197" component={Members197} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ArchivistChatbot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
