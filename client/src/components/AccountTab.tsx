import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AccountTabProps {
  email?: string;
  hasPatternSession?: boolean;
  hasCompleteArchive?: boolean;
  onUpgrade?: () => void;
}

export default function AccountTab({
  email = "user@example.com",
  hasPatternSession = true,
  hasCompleteArchive = false,
  onUpgrade,
}: AccountTabProps) {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold" data-testid="text-account-title">Account</h2>
      
      <Card data-testid="card-account-info">
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium" data-testid="text-account-email">{email}</p>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-purchases">
        <CardHeader>
          <CardTitle className="text-lg">Your Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPatternSession && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">Pattern Recognition Session</p>
                <p className="text-sm text-muted-foreground">30-day AI access</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                Active
              </Badge>
            </div>
          )}
          
          {hasCompleteArchive ? (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">Complete Pattern Archive</p>
                <p className="text-sm text-muted-foreground">Lifetime AI access</p>
              </div>
              <Badge variant="destructive">
                Active
              </Badge>
            </div>
          ) : (
            <div className="border-t border-border pt-4">
              <p className="font-medium mb-2">Upgrade to Complete Archive</p>
              <p className="text-sm text-muted-foreground mb-4">
                Get lifetime AI access and the full 250+ page pattern manual
              </p>
              <Button variant="destructive" onClick={onUpgrade} data-testid="button-upgrade-account">
                Upgrade for $50
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
