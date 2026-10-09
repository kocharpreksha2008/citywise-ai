import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  User, 
  Info,
  Compass,
  Landmark,
  UtensilsCrossed,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  disclaimer?: string;
}

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 👋 Namaskar! I'm CityWise AI
Your intelligent exploration, safety, and cultural guide for **Pune, India**.

I can assist you with:
- **Budget Planning**: Student-friendly 1 or 2-day itineraries under ₹500 - ₹1,500.
- **Deep Heritage**: Historical context for Shaniwar Wada, Peshwas, and Sinhagad Fort.
- **Local Food Trails**: Iconic Misal Pav, Irani Bakeries, and Pithla Bhakri spots.
- **Safety Advisories**: Well-lit routes, women safety tips, and metro transit hours.

Ask me anything or click a suggestion below to get started!`,
      timestamp: 'Just now',
      source: 'citywise_engine',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQueries = [
    { text: 'Plan a 1-day budget student trip under ₹600', icon: Compass },
    { text: 'Top Maratha historical sites & heritage walk', icon: Landmark },
    { text: 'Best authentic Misal Pav & Irani breakfast spots', icon: UtensilsCrossed },
    { text: 'Safe night walking areas & metro travel tips', icon: ShieldCheck },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend.trim(),
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Sorry, I could not generate an answer right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        disclaimer: data.disclaimer,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error contacting assistant API:', error);
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: `### 🧭 CityWise Quick Tips for Pune
- **Budget Sightseeing**: Visit Pataleshwar Caves (Free), Saras Baug (Free), and Shaniwar Wada (₹25).
- **Iconic Meals**: Try Goodluck Cafe (Bun Maska & Chai ~ ₹120) and Vaishali (SPDP & Coffee ~ ₹220).
- **Transit**: Take the Pune Metro Aqua/Purple lines (₹10–₹35) or daily bus pass (₹50).
- **Safety**: Keep to active areas like FC Road, Viman Nagar, and KP after dark. Dial **112** for emergency assistance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local_offline_guide',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `### 👋 Chat Cleared!
Ask any question about Pune travel, budget estimates, heritage sites, or safety guidelines.`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Helper to render markdown-like text cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-extrabold text-sm sm:text-base text-slate-900 mt-2 mb-1">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-black text-base text-slate-900 mt-2 mb-1">
                {line.replace('## ', '')}
              </h2>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const itemText = line.replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 my-0.5">
                <span className="text-teal-600 font-bold mt-1">•</span>
                <span dangerouslySetInnerHTML={{ __html: parseBold(itemText) }} />
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 my-0.5">
                <span className="font-bold text-teal-700 min-w-[16px]">{line.match(/^\d+\./)?.[0]}</span>
                <span dangerouslySetInnerHTML={{ __html: parseBold(line.replace(/^\d+\.\s+/, '')) }} />
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
          );
        })}
      </div>
    );
  };

  const parseBold = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-slate-900 text-white flex items-center justify-center shadow-md shadow-teal-900/10">
            <Bot className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">CityWise AI Assistant</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Gemini 3.8 Flash Powered
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Instant recommendations on budget trips, Maratha history, safe corridors, and local food.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
          title="Clear chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {suggestedQueries.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.text)}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-semibold text-slate-700 transition-all shadow-2xs"
            >
              <Icon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div>{renderFormattedContent(msg.content)}</div>
                  )}

                  {/* Metadata and actions */}
                  <div className={`mt-2 pt-1 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-slate-400 border-t border-slate-800' : 'text-slate-400 border-t border-slate-200/60'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-2">
                        {msg.source && (
                          <span className="font-semibold text-teal-700">
                            {msg.source.includes('gemini') ? 'AI Verified' : 'Curated Knowledge'}
                          </span>
                        )}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-slate-700 p-0.5 rounded transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.disclaimer && (
                    <p className="text-[10px] text-amber-700 mt-1 italic">
                      Note: {msg.disclaimer}
                    </p>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <span>Thinking with Pune city intelligence & safety index...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Field */}
        <div className="pt-3 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about student budgets, historical timings, safe routes, or Misal Pav..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs sm:text-sm p-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400 font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className={`p-3 rounded-2xl text-white font-bold transition-all shadow-sm ${
                !inputQuery.trim() || isLoading
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Send className="w-4 h-4 text-teal-400" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            CityWise AI combines Google Gemini reasoning with curated Pune heritage & civic safety benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
};
