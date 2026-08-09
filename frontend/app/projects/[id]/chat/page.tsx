"use client";

import { use, useState, useRef, useEffect } from "react";
import { useSendChatMessage, ChatSource } from "@/hooks/useChat";
import { Send, User, Bot, Loader2, Sparkles, FileText } from "lucide-react";
import { clsx } from "clsx";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

const SUGGESTED_QUESTIONS = [
  "Why did you recommend ABC Industries?",
  "What is the total estimated cost?",
  "Did all suppliers pass the ISO constraint?",
];

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello. I am the Procurement Copilot. I've analyzed the supplier quotes and constraints for this project. How can I help you understand the decision?",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  
  const { mutate: sendMessage, isPending } = useSendChatMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSend = (text: string) => {
    if (!text.trim() || isPending) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    sendMessage(
      { projectId, message: text },
      {
        onSuccess: (data) => {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: data.answer,
              sources: data.sources,
            }
          ]);
        },
        onError: () => {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: "I'm sorry, I encountered an error while trying to process your request.",
            }
          ]);
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto w-full pt-8">
      
      <div className="flex items-center gap-4 mb-5 px-4">
        <div className="w-12 h-12 rounded-full bg-sky-pop/10 text-sky-pop flex items-center justify-center shrink-0">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-[30px] font-medium text-ink-black tracking-tight leading-none">
            Procurement Copilot
          </h1>
          <p className="text-[15px] text-stone-gray">
            Ask questions about the decision engine's logic.
          </p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 flex flex-col gap-6 hide-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={clsx(
              "flex flex-col max-w-[85%]",
              msg.role === "user" ? "self-end items-end" : "self-start items-start"
            )}
          >
            <div className="flex items-end gap-3">
              {msg.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-sky-pop text-white flex items-center justify-center shrink-0 mb-1 shadow-sm">
                  <Bot size={20} />
                </div>
              )}
              
              <div 
                className={clsx(
                  "px-6 py-4 rounded-[30px] leading-[var(--leading-body-lg)] text-[18px]",
                  msg.role === "user" 
                    ? "bg-ink-black text-pure-white rounded-br-sm" 
                    : "bg-pure-white text-ink-black rounded-bl-sm border border-hairline-mist shadow-sm"
                )}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-cream-paper text-stone-gray flex items-center justify-center shrink-0 mb-1">
                  <User size={20} />
                </div>
              )}
            </div>

            {/* Citations */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 ml-14">
                {msg.sources.map((src, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-paper rounded-full text-xs font-medium text-ink-black border border-hairline-mist">
                    <FileText size={12} className="text-sky-pop" />
                    <span>{src.title}</span>
                    {src.page && <span className="text-stone-gray">p.{src.page}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isPending && (
          <div className="self-start flex items-end gap-3 max-w-[85%]">
            <div className="w-10 h-10 rounded-full bg-sky-pop text-white flex items-center justify-center shrink-0 mb-1 shadow-sm">
              <Bot size={20} />
            </div>
            <div className="px-6 py-5 rounded-[30px] bg-pure-white border border-hairline-mist rounded-bl-sm shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-pop animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-sky-pop animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-sky-pop animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-10">
        
        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {SUGGESTED_QUESTIONS.map(q => (
              <button 
                key={q}
                onClick={() => handleSend(q)}
                className="px-4 py-2 bg-pure-white hover:bg-sky-pop hover:text-white border border-hairline-mist hover:border-sky-pop rounded-full text-[15px] font-medium text-ink-black transition-colors shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-pure-white rounded-full p-2 flex items-center border border-hairline-mist shadow-lg relative overflow-hidden">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(inputValue);
            }}
            placeholder="Ask a question about the procurement decision..."
            className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-[18px] text-ink-black placeholder-[var(--color-stone-gray)]"
            disabled={isPending}
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isPending}
            className="w-12 h-12 rounded-full bg-sky-pop flex items-center justify-center text-white shrink-0 hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            {isPending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
