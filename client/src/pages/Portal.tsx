import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortalSidebar from "@/components/PortalSidebar";
import ContentTab from "@/components/ContentTab";
import AccountTab from "@/components/AccountTab";

export default function Portal() {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="min-h-screen bg-archivist-dark">
      <div className="flex">
        <PortalSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">
              Member Portal
            </h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <ContentTab />
              </TabsContent>

              <TabsContent value="account">
                <AccountTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
