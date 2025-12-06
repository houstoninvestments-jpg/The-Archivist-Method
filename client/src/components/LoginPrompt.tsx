import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface LoginPromptProps {
  onLogin?: () => void;
}

export default function LoginPrompt({ onLogin }: LoginPromptProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center" data-testid="card-login-prompt">
        <CardHeader>
          <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Member Access Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Please log in to access your pattern recognition materials and The Archivist AI.
          </p>
          <Button onClick={onLogin} className="w-full" data-testid="button-login">
            Log In with Replit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
