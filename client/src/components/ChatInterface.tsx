import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Send, Loader2, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatInterfaceProps {
  isMobile?: boolean;
}

// todo: remove mock functionality
const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Disappearing pattern",
    messages: [
      { id: "1", role: "assistant", content: "Welcome. I'm The Archivist. Tell me about a pattern you've noticed in your life.", timestamp: new Date() },
      { id: "2", role: "user", content: "I tend to pull away when relationships get serious.", timestamp: new Date() },
      { id: "3", role: "assistant", content: "The Disappearing pattern. This is one of the core seven. Tell me - when you feel the urge to pull away, what sensation do you notice in your body first?", timestamp: new Date() },
    ],
  },
  {
    id: "2",
    title: "Success sabotage",
    messages: [
      { id: "1", role: "assistant", content: "Welcome. I'm The Archivist. Tell me about a pattern you've noticed in your life.", timestamp: new Date() },
      { id: "2", role: "user", content: "Every time I'm about to succeed, something goes wrong.", timestamp: new Date() },
    ],
  },
];

export default function ChatInterface({ isMobile = false }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0] || null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Welcome. I'm The Archivist. Tell me about a pattern you've noticed in your life.",
          timestamp: new Date(),
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setActiveConversation(newConv);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setSidebarOpen(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const updatedConv = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
    };
    
    setActiveConversation(updatedConv);
    setConversations(conversations.map(c => c.id === updatedConv.id ? updatedConv : c));
    setInputValue("");
    setIsTyping(true);

    // todo: remove mock functionality - simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I hear you. Let's excavate this pattern together. Can you tell me about the earliest memory you have of this behavior? What was happening around you when this pattern first emerged?",
        timestamp: new Date(),
      };
      
      const finalConv = {
        ...updatedConv,
        messages: [...updatedConv.messages, aiMessage],
      };
      
      setActiveConversation(finalConv);
      setConversations(prev => prev.map(c => c.id === finalConv.id ? finalConv : c));
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const conversationsList = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleNewConversation}
          data-testid="button-new-conversation"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 space-y-1">
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={activeConversation?.id === conv.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left truncate"
              onClick={() => handleSelectConversation(conv)}
              data-testid={`button-conversation-${conv.id}`}
            >
              {conv.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className={`flex ${isMobile ? "flex-col h-[calc(100vh-60px)]" : "h-[calc(100vh-4rem)]"} max-h-[800px]`}>
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="flex-1 flex flex-col">
            <header className="border-b border-border p-3 flex items-center gap-3">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-chat-history">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <div>
                <h2 className="text-sm font-semibold">The Archivist</h2>
                <p className="text-xs text-muted-foreground">Pattern excavation guide</p>
              </div>
            </header>

            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {activeConversation?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-md px-3 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                      data-testid={`message-${message.role}-${message.id}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-md px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe a pattern..."
                  className="min-h-[50px] resize-none text-sm"
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-[50px] w-[50px] shrink-0"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <SheetContent side="left" className="p-0 w-64">
            {conversationsList}
          </SheetContent>
        </Sheet>
      ) : (
        <>
          <aside className="w-64 border-r border-border bg-card/50">
            {conversationsList}
          </aside>

          <div className="flex-1 flex flex-col">
            <header className="border-b border-border p-4">
              <h2 className="text-lg font-semibold" data-testid="text-archivist-header">
                The Archivist
              </h2>
              <p className="text-sm text-muted-foreground">Pattern excavation guide</p>
            </header>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {activeConversation?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-md px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                      data-testid={`message-${message.role}-${message.id}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-md px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border p-4">
              <div className="flex gap-2 max-w-3xl mx-auto">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe a pattern you've noticed..."
                  className="min-h-[60px] resize-none"
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-[60px] w-[60px]"
                  data-testid="button-send-message"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
