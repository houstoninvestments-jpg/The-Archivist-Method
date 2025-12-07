import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import ThankYou from "@/pages/ThankYou";
import Portal from "@/pages/Portal";
import FreeDownload from "@/pages/FreeDownload";
import QuickStart from "@/pages/QuickStart";
import CompleteArchive from "@/pages/CompleteArchive";
import Members47 from "@/pages/Members47";
import Members197 from "@/pages/Members197";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/free-download" component={FreeDownload} />
      <Route path="/quick-start" component={QuickStart} />
      <Route path="/complete-archive" component={CompleteArchive} />
      <Route path="/members-47" component={Members47} />
      <Route path="/members-197" component={Members197} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/portal" component={Portal} />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
