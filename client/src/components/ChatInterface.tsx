import ArchivistChatbot from "./ArchivistChatbot";

interface ChatInterfaceProps {
  isMobile: boolean;
}

export default function ChatInterface({ isMobile }: ChatInterfaceProps) {
  return (
    <div className={`h-full ${isMobile ? "" : "p-4"}`}>
      <div className={`h-full ${isMobile ? "" : "max-w-4xl mx-auto"}`}>
        <ArchivistChatbot />
      </div>
    </div>
  );
}
