import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Guarantee() {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container mx-auto max-w-2xl">
        <Card className="text-center" data-testid="card-guarantee">
          <CardContent className="py-12 space-y-4">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">90-Day Money-Back Guarantee</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              If this doesn't show you something new about yourself, get a full refund. No questions asked.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
