import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Package, ArrowUpRight } from "lucide-react";

interface AccountTabProps {
  email: string;
  hasPatternSession: boolean;
  hasCompleteArchive: boolean;
  onUpgrade: () => void;
}

export default function AccountTab({ email, hasPatternSession, hasCompleteArchive, onUpgrade }: AccountTabProps) {
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Account</h1>
        <p className="text-muted-foreground">Manage your account and purchases</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{email || "No email provided"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Your Products
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">7-Day Crash Course</p>
              <p className="text-sm text-muted-foreground">Free introduction to pattern recognition</p>
            </div>
            <Badge variant="secondary">Free</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Quick-Start System</p>
              <p className="text-sm text-muted-foreground">90-day pattern interruption protocol</p>
            </div>
            {hasPatternSession ? (
              <Badge className="bg-[#00FFC8] text-black">Owned</Badge>
            ) : (
              <Badge variant="outline">$47</Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Complete Pattern Archive</p>
              <p className="text-sm text-muted-foreground">Full methodology and advanced applications</p>
            </div>
            {hasCompleteArchive ? (
              <Badge className="bg-[#00FFC8] text-black">Owned</Badge>
            ) : (
              <Badge variant="outline">$197</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {!hasCompleteArchive && (
        <Card className="border-[#FF0094]/30 bg-[#FF0094]/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Unlock the Complete Archive</p>
                <p className="text-sm text-muted-foreground">Get lifetime access to all patterns and advanced techniques</p>
              </div>
              <Button onClick={onUpgrade} className="bg-[#FF0094] hover:bg-[#FF0094]/80" data-testid="button-upgrade">
                Upgrade
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
