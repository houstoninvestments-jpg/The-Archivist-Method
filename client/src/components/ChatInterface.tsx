import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Welcome to The Archivist. I'm here to help you understand and interrupt your trauma patterns. What patterns have you been noticing in your life?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: data.response || "I understand. Let me help you explore that pattern further.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full bg-archivist-dark/50 border-archivist-teal/30">
      <div className="p-4 border-b border-archivist-teal/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-archivist-teal/20 flex items-center justify-center">
            <Bot className="h-5 w-5 text-archivist-teal" />
          </div>
          <div>
            <h3 className="text-white font-semibold">The Archivist</h3>
            <p className="text-gray-400 text-sm">Pattern Recognition AI</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-archivist-teal/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-archivist-teal" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-archivist-pink/20 text-white"
                    : "bg-archivist-teal/10 text-gray-300"
                }`}
                data-testid={`chat-message-${message.role}-${message.id}`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-archivist-pink/20 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-archivist-pink" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-archivist-teal/20 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-archivist-teal" />
              </div>
              <div className="bg-archivist-teal/10 rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-archivist-teal rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-archivist-teal rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-archivist-teal rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t border-archivist-teal/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a pattern you've noticed..."
            className="bg-archivist-dark border-archivist-teal/30 text-white"
            disabled={isLoading}
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-archivist-teal hover:bg-archivist-teal/90"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
