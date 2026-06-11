"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Meow! 🐾 I am Inderash's AI Companion. Ask me anything about his projects, skills, experience, or how to contact him!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("sup") || q.includes("yo")) {
      return "Hello human! I'm Inderash's interactive cat companion. How can I help you explore his portfolio today?";
    }
    
    if (q.includes("project") || q.includes("work") || q.includes("blockchain") || q.includes("netflix") || q.includes("jarvis") || q.includes("portfolio")) {
      return "Inderash has shipped some major projects recently:\n\n• **Netflix AI Portfolio** - An immersive 3D developer experience with neural layers.\n• **Blockchain Network** - A trustless, decentralized platform utilizing smart contracts.\n• **Jarvis AI** - A voice-enabled conversational assistant powered by LLMs.\n\nWhich one would you like to hear more about?";
    }

    if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language") || q.includes("database") || q.includes("frontend") || q.includes("backend")) {
      return "Here is Inderash's core skillset:\n\n• **AI / ML:** Python, LLMs, RAG Pipelines, LangChain, TensorFlow, OpenAI API.\n• **Frontend:** React, Next.js, TypeScript, Tailwind CSS, Framer Motion.\n• **Backend:** Node.js, FastAPI, PostgreSQL, MongoDB, Redis.\n• **DevOps & Cloud:** Docker, AWS, GitHub Actions, Vercel.";
    }

    if (q.includes("experience") || q.includes("history") || q.includes("career") || q.includes("education") || q.includes("timeline")) {
      return "Inderash's journey includes:\n\n• **2025:** Building autonomous agents and LLM orchestration tools. Shipping enterprise-level Next.js codebases and microservices.\n• **2024:** Developing foundational CS skills, algorithms, full-stack basics, and contributing to open-source.";
    }

    if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("freelance") || q.includes("resume") || q.includes("job")) {
      return "Inderash is open to freelance and full-time engineering roles! You can email him directly at **inderash18@gmail.com** or click the 'Connect' button in the navbar. He'll get back to you immediately!";
    }

    if (q.includes("github") || q.includes("social") || q.includes("reddit")) {
      return "You can check out his source code on GitHub: **github.com/inderash18** or follow him on Reddit!";
    }

    if (q.includes("cat") || q.includes("who are you") || q.includes("name") || q.includes("mascot")) {
      return "I'm the cyber-cat companion! I keep an eye on his portfolio, react to your cursor, and help answer questions. I run on 60 FPS GPU power!";
    }

    if (q.includes("sleep") || q.includes("nap") || q.includes("idle")) {
      return "If you leave me alone for 15 seconds, I'll curl up and take a nap! Zzz...";
    }

    return "I'm still training my neural networks, but I can tell you all about Inderash's AI engineering work, full stack projects, tech stack, and contact information. Feel free to ask!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = input.trim();
    setInput("");
    setIsTyping(true);

    // Simulate thinking and typing delay
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: getBotResponse(userQuery),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000 + Math.random() * 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-24 z-[98] w-[350px] sm:w-[380px] h-[450px] rounded-3xl border border-border bg-bg/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform translate-y-0 opacity-100 font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-bg-card/50">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
          </span>
          <span className="text-sm font-black tracking-wider uppercase text-text">AI Companion</span>
        </div>
        <button 
          onClick={onClose}
          className="w-7 h-7 rounded-full hover:bg-border/50 text-secondary hover:text-text flex items-center justify-center transition-colors text-lg"
          aria-label="Close panel"
        >
          ×
        </button>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 scroll-smooth"
      >
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === "user" 
                  ? "bg-accent text-white rounded-tr-none shadow-sm" 
                  : "bg-bg-card text-text border border-border rounded-tl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-bg-card text-text border border-border rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-border/80 bg-bg-card/50 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2.5 rounded-full border border-border bg-bg text-text text-sm focus:outline-none focus:border-accent transition-colors"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-text hover:bg-accent text-bg hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-text disabled:hover:text-bg font-bold cursor-pointer"
        >
          ➔
        </button>
      </div>
    </div>
  );
}
