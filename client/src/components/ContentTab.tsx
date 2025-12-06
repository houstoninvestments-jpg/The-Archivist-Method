import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Play } from "lucide-react";

interface ContentTabProps {
  hasCompleteArchive?: boolean;
  videoUrl?: string;
}

export default function ContentTab({
  hasCompleteArchive = false,
  videoUrl = "https://www.youtube.com/embed/vQRSALJ5hgc",
}: ContentTabProps) {
  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4" data-testid="text-video-section-title">
          Your Pattern Recognition Session
        </h2>
        <Card data-testid="card-video">
          <CardContent className="p-0">
            <div className="aspect-video bg-card rounded-md overflow-hidden">
              <iframe
                src={videoUrl}
                title="Pattern Recognition Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" data-testid="text-downloads-section-title">
          Downloads
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card data-testid="card-download-workbook">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Pattern Recognition Workbook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The complete workbook to help you identify and excavate your patterns
              </p>
              <Button className="w-full gap-2" data-testid="button-download-workbook">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          {hasCompleteArchive && (
            <Card data-testid="card-download-archive">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-destructive" />
                  Complete Pattern Archive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  250+ pages covering all 7 core patterns with the 90-day protocol
                </p>
                <Button variant="destructive" className="w-full gap-2" data-testid="button-download-archive">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
