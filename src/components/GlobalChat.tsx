import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/server/ChatContext";
import { X, MessageCircle, Users } from "lucide-react";
import { useAuth } from "@/server/AuthContext";

export const GlobalChat = () => {
  const { session } = useAuth();
  const { messages, sendMessage, connected, onlineUsers } = useChat();

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(input.trim());
      setInput("");
      setError(null); // wyczyść błąd po udanym wysłaniu
    } catch (err) {
      // Załóżmy, że err.message zawiera komunikat z serwera
      setError((err as Error).message || "Failed to send message");
    }
  };

  // Automatyczne ukrycie błędu po 5 sekundach
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [messages]);

  if (!session) return null;

  return (
    <>
      {/* Ikona do otwierania */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed md:bottom-4 bottom-20 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Okno czatu */}
      {isOpen && (
        <div className="fixed md:bottom-4 bottom-20 right-4 w-80 bg-card rounded-lg shadow-xl border border-border z-50 animate-in slide-in-from-bottom-8">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Global Chat</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{onlineUsers.length} online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="h-64 overflow-y-auto mb-2">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-2 text-sm">
                  <span className="font-medium text-primary">
                    {msg.username}:
                  </span>
                  <span className="ml-2 text-foreground">{msg.content}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Komunikat błędu */}
            {error && (
              <div className="mb-2 p-2 bg-red-600 text-white rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                disabled={!connected}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={connected ? "Write a message..." : "Connecting..."}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-background rounded-md px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!connected || !input.trim()}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
