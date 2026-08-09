import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../store/useAppStore';
import { chatService } from '../../services/chatService';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Trash2,
  FileText,
  ExternalLink,
  Loader2,
  Check,
} from 'lucide-react';

export const CopilotChat: React.FC = () => {
  const { chatMessages, addChatMessage, clearChatHistory, openEvidence } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Add User Message
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    addChatMessage(userMsg);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(query, chatMessages);
      addChatMessage(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeSuggested = chatMessages[chatMessages.length - 1]?.suggestedQuestions || [
    'Why was Vertex Manufacturing selected?',
    'Which supplier has the lowest MOQ?',
    'Why was Nova Components rejected?',
    'Compare Vertex Manufacturing and Apex Industrial.',
  ];

  return (
    <Card className="flex flex-col h-[650px] p-0 overflow-hidden border border-hairline-mist card-shadow">
      {/* Header Bar */}
      <div className="p-5 bg-sandstone/30 border-b border-hairline-mist flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-fresh-grass flex items-center justify-center font-bold text-ink-black shrink-0">
            <Bot className="w-5 h-5 text-ink-black" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-ink-black leading-tight flex items-center gap-2">
              Procurement Intelligence Copilot
              <Badge status="PASS">RAG Active</Badge>
            </h3>
            <p className="text-[12px] text-stone-gray font-medium">
              Grounded in 4 uploaded project specification and quote PDF files.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearChatHistory}
          className="text-stone-gray hover:text-coral-pop gap-1.5 text-[13px]"
          title="Clear History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-cream-paper/20">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-2 text-[12px] text-stone-gray font-medium px-1">
              {msg.role === 'user' ? (
                <>
                  <span>You</span>
                  <User className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-fresh-grass" />
                  <span>Procurement Copilot</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-5 rounded-[22px] text-[15px] leading-relaxed relative group ${
                msg.role === 'user'
                  ? 'bg-ink-black text-pure-white rounded-tr-none'
                  : 'bg-pure-white text-ink-black border border-hairline-mist rounded-tl-none card-shadow'
              }`}
            >
              <div className="whitespace-pre-wrap font-normal">{msg.text}</div>

              {/* Citations Cards */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-hairline-mist/50 space-y-2">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-stone-gray flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-pop" />
                    Verified Source Citations ({msg.citations.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cite) => (
                      <button
                        key={cite.id}
                        onClick={() => openEvidence(cite)}
                        className="px-3 py-1.5 rounded-[10px] bg-sandstone/40 hover:bg-sandstone/80 text-[12px] font-semibold text-ink-black border border-sandstone flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-pop" />
                        <span>{cite.docName.split('_')[0]} (p.{cite.pageNumber})</span>
                        <ExternalLink className="w-3 h-3 text-stone-gray" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy Action Button */}
              <button
                onClick={() => handleCopyText(msg.id, msg.text)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-sandstone/30 hover:bg-sandstone transition-all text-stone-gray hover:text-ink-black"
                title="Copy Answer"
              >
                {copiedId === msg.id ? (
                  <Check className="w-3.5 h-3.5 text-fresh-grass" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 text-stone-gray font-medium text-[14px]">
            <div className="w-8 h-8 rounded-full bg-fresh-grass/30 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-ink-black animate-spin" />
            </div>
            <span>Copilot is inspecting PDF source documents...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions & Input Bar */}
      <div className="p-4 border-t border-hairline-mist bg-pure-white shrink-0 space-y-3">
        {/* Suggested Queries Chips */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-[12px] font-bold text-stone-gray shrink-0 uppercase tracking-wider">
            Suggested:
          </span>
          {activeSuggested.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-sandstone/40 hover:bg-sandstone/80 text-[13px] font-medium text-ink-black border border-hairline-mist transition-colors shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about vendor prices, lead times, or constraint exceptions..."
            className="flex-grow h-12 px-5 rounded-full border border-hairline-mist bg-cream-paper/40 text-[15px] text-ink-black focus:outline-none focus:ring-2 focus:ring-ink-black/20 focus:border-ink-black transition-all"
          />
          <Button
            type="submit"
            variant="action"
            disabled={!inputText.trim() || isTyping}
            className="rounded-full w-12 h-12 p-0 shrink-0"
            aria-label="Send Message"
          >
            <Send className="w-5 h-5 text-pure-white" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
