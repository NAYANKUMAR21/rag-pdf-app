import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IMessage {
  role: "assistant" | "user";
  content?: string;
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typingContent, setTypingContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");
    setIsTyping(true);

    const res = await fetch(`http://localhost:8080/chat?message=${message}`);
    const data = await res.json();

    // Typing effect
    const fullText = data?.message || "";
    let index = 0;

    setTypingContent("..."); // reset
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypingContent((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullText },
        ]);
        setTypingContent("");
      }
    }, 20); // adjust speed here
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white rounded-lg shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xl px-4 py-2 rounded-xl whitespace-pre-wrap",
                message.role === "user"
                  ? "bg-blue-100 text-blue-900 text-right"
                  : "bg-gray-200 text-gray-800 font-mono"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* Typing assistant message */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xl px-4 py-2 rounded-xl bg-gray-200 text-gray-800 font-mono whitespace-pre-wrap">
              {typingContent}
              <span className="animate-pulse">|</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 bg-white p-3 rounded-xl shadow-md fixed bottom-4 left-4 right-4 max-w-4xl mx-auto">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow"
        />
        <Button
          onClick={handleSendChatMessage}
          disabled={!message.trim() || isTyping}
          className="px-4 py-2"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
