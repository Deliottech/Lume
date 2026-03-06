"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Toaster, toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  Wand2,
  Download,
  History,
  X,
  Check,
  Copy,
  Github,
  Zap,
  Workflow,
  MessageSquare,
  Save,
  Plus,
  TrendingUp,
  Flame,
  Coins,
  Rocket,
  Activity,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  TrendingDown,
  DollarSign,
  Clock,
  Bell,
  Settings,
} from "lucide-react";
import { supabase, api, MODELS, PLATFORMS, TEMPLATES, type PlatformId, type GeneratedResult, type User, type Repo } from "../lib/config";
import {
  Sheet,
  RepoSheet,
  CodeSheet,
  PushSheet,
  N8nSheet,
  HistorySheet,
  Inp,
  Sel,
  PBtn,
  GBtn,
  Lbl,
  OkBox,
} from "./ui";

// Icons component
const Icons = {
  GitHub: () => <Github size={20} />,
  Flow: () => <Workflow size={20} />,
  Zap: () => <Zap size={20} />,
  Wand: () => <Wand2 size={18} />,
  Download: () => <Download size={18} />,
  History: () => <History size={18} />,
  Chat: () => <MessageSquare size={18} />,
  Save: () => <Save size={18} />,
  Trending: () => <TrendingUp size={18} />,
  Check: () => <Check size={16} />,
  X: () => <X size={16} />,
  Copy: () => <Copy size={15} />,
  Push: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Binance: () => <span style={{ fontSize: 18 }}>₿</span>,
  PumpFun: () => <Flame size={18} />,
  Meteora: () => <Coins size={18} />,
  Token: () => <Rocket size={18} />,
  Activity: () => <Activity size={18} />,
  ExternalLink: () => <ExternalLink size={14} />,
  Search: () => <Search size={16} />,
  Filter: () => <Filter size={16} />,
  Refresh: () => <RefreshCw size={16} />,
  DollarSign: () => <DollarSign size={14} />,
  Clock: () => <Clock size={14} />,
  Discord: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
};

// Token data interface
interface TokenData {
  id: string;
  name: string;
  symbol: string;
  address: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  createdAt: string;
  platform: "pumpfun" | "meteora" | "raydium";
  imageUrl?: string;
  mintAuthority?: string;
  freezeAuthority?: string;
}

// AI Chat Sheet component
function AIChatSheet({
  open,
  onClose,
  context = "",
}: {
  open: boolean;
  onClose: () => void;
  context?: string;
}) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    try {
      const r = await api.post("/api/chat/groq", { messages: [...messages, userMsg], context });
      setMessages((m) => [...m, { role: "assistant", content: r.reply || "No response" }]);
    } catch (e) {
      toast.error("Groq chat failed");
    }
    setThinking(false);
  }, [input, messages, context]);

  return (
    <Sheet open={open} onClose={onClose} title="AI Research (Groq — Instant)">
      <div style={{ height: "380px", overflowY: "auto", marginBottom: 12 }} className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              borderRadius: 12,
              background: m.role === "user" ? "#1e3a8a" : "#27272a",
              marginLeft: m.role === "user" ? "auto" : 0,
              maxWidth: "85%",
              color: "#fff",
              fontSize: 14,
            }}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Inp
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about code, Solana, Binance..."
        />
        <PBtn onClick={sendMessage} disabled={thinking || !input.trim()}>
          Send
        </PBtn>
      </div>
    </Sheet>
  );
}

// Discord Settings Sheet component
function DiscordSheet({
  open,
  onClose,
  webhook,
  onSave,
  sending,
}: {
  open: boolean;
  onClose: () => void;
  webhook: string;
  onSave: (webhook: string) => void;
  sending?: boolean;
}) {
  // Initialize with webhook prop - will be set when sheet opens
  const [inputWebhook, setInputWebhook] = useState(webhook || "");
  const [testing, setTesting] = useState(false);

  const testWebhook = async () => {
    if (!inputWebhook.trim()) {
      toast.error("Please enter a webhook URL");
      return;
    }
    setTesting(true);
    try {
      const response = await fetch(inputWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "🔔 TokenWatch Test",
            description: "Discord notifications are working! You'll receive alerts for token events.",
            color: 0x14F195,
            timestamp: new Date().toISOString(),
          }],
        }),
      });
      
      if (response.ok) {
        toast.success("Test message sent! Check your Discord");
      } else {
        toast.error("Failed to send test. Check webhook URL.");
      }
    } catch (error) {
      toast.error("Invalid webhook URL");
    }
    setTesting(false);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Discord Notifications">
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>
          Configure a Discord webhook to receive notifications when:
        </p>
        <ul style={{ color: "#666", fontSize: 12, paddingLeft: 16, lineHeight: 1.8 }}>
          <li>🎯 New tokens are selected for trading bot creation</li>
          <li>📊 Price alerts are triggered</li>
          <li>💰 Trading opportunities are detected</li>
        </ul>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Lbl>Discord Webhook URL</Lbl>
        <Inp
          value={inputWebhook}
          onChange={(e) => setInputWebhook(e.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
        />
      </div>
      
      <div style={{ display: "flex", gap: 8 }}>
        <PBtn 
          onClick={testWebhook} 
          disabled={testing || !inputWebhook.trim()}
          style={{ background: "#5865F2", color: "#fff" }}
        >
          {testing ? "Sending..." : "Test Webhook"}
        </PBtn>
        <PBtn onClick={() => onSave(inputWebhook)} disabled={sending}>
          Save
        </PBtn>
      </div>
      
      <div style={{ marginTop: 16, padding: 12, background: "#18181b", borderRadius: 8 }}>
        <p style={{ color: "#666", fontSize: 11 }}>
          💡 <strong>How to get a webhook:</strong>
        </p>
        <ol style={{ color: "#555", fontSize: 11, paddingLeft: 16, marginTop: 8, lineHeight: 1.6 }}>
          <li>Go to your Discord server settings</li>
          <li>Navigate to Integrations → Webhooks</li>
          <li>Create a new webhook and copy the URL</li>
        </ol>
      </div>
    </Sheet>
  );
}

// Token Card Component
function TokenCard({ token, onSelect }: { token: TokenData; onSelect?: (token: TokenData) => void }) {
  const isPositive = token.priceChange24h >= 0;
  
  return (
    <div 
      onClick={() => onSelect?.(token)}
      style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
        border: "1px solid #2a2a4a",
        borderRadius: 16,
        padding: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#4a4a6a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#2a2a4a";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            color: "#fff",
          }}>
            {token.symbol.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}>{token.name}</div>
            <div style={{ color: "#888", fontSize: 12 }}>{token.symbol.toUpperCase()}</div>
          </div>
        </div>
        <div style={{
          padding: "4px 8px",
          borderRadius: 6,
          background: token.platform === "pumpfun" ? "#FF6B6B20" : token.platform === "meteora" ? "#00D9FF20" : "#14F19520",
          color: token.platform === "pumpfun" ? "#FF6B6B" : token.platform === "meteora" ? "#00D9FF" : "#14F195",
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
        }}>
          {token.platform}
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ color: "#666", fontSize: 11, marginBottom: 2 }}>Price</div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(4)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#666", fontSize: 11, marginBottom: 2 }}>24h</div>
          <div style={{ 
            color: isPositive ? "#14F195" : "#FF6B6B", 
            fontWeight: 600, 
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}{token.priceChange24h.toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #2a2a4a", display: "flex", gap: 16 }}>
        <div>
          <div style={{ color: "#666", fontSize: 10 }}>Volume 24h</div>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>${(token.volume24h / 1000).toFixed(1)}K</div>
        </div>
        <div>
          <div style={{ color: "#666", fontSize: 10 }}>Market Cap</div>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>${(token.marketCap / 1000).toFixed(1)}K</div>
        </div>
        <div>
          <div style={{ color: "#666", fontSize: 10 }}>Liquidity</div>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>${(token.liquidity / 1000).toFixed(1)}K</div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon, label, value, subValue, color }: { icon: React.ReactNode; label: string; value: string; subValue?: string; color: string }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
      border: "1px solid #2a2a4a",
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ color, }}>{icon}</div>
        <div style={{ color: "#666", fontSize: 12 }}>{label}</div>
      </div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 24 }}>{value}</div>
      {subValue && <div style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{subValue}</div>}
    </div>
  );
}

// Main App component
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [platform, setPlatform] = useState<PlatformId>("github");
  const [model, setModel] = useState(MODELS[0].id);
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("auto");
  const [framework, setFramework] = useState("");
  const [generated, setGenerated] = useState<GeneratedResult | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; summary: string; prompt: string; platform: string; created_at?: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRepo, setShowRepo] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showPush, setShowPush] = useState(false);
  const [showN8n, setShowN8n] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<{ name: string; full_name: string } | null>(null);
  const [commitMsg, setCommitMsg] = useState("");
  const [generating, setGenerating] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  
  // Token tracking state
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<"all" | "pumpfun" | "meteora">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Discord notification state
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [showDiscordSettings, setShowDiscordSettings] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);

  const pc = PLATFORMS[platform];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock data for pump.fun and meteora tokens (simulating real data)
  const fetchTokens = useCallback(async () => {
    setLoadingTokens(true);
    try {
      // Simulating API call - in production this would fetch from actual APIs
      const mockTokens: TokenData[] = [
        {
          id: "1",
          name: "PEPE",
          symbol: "pepe",
          address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
          price: 0.000001234,
          priceChange24h: 12.45,
          volume24h: 1250000,
          marketCap: 5200000,
          liquidity: 89000,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          platform: "pumpfun",
        },
        {
          id: "2",
          name: "WIF",
          symbol: "wif",
          address: "85VBFQZC9TZkfaptBWqv14ALD9fJNUKtWA41kh69teRP",
          price: 1.234,
          priceChange24h: 5.67,
          volume24h: 8900000,
          marketCap: 520000000,
          liquidity: 450000,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          platform: "raydium",
        },
        {
          id: "3",
          name: "SOL",
          symbol: "sol",
          address: "So11111111111111111111111111111111111111112",
          price: 98.45,
          priceChange24h: -2.34,
          volume24h: 15000000,
          marketCap: 42000000000,
          liquidity: 1200000000,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          platform: "raydium",
        },
        {
          id: "4",
          name: "BONK",
          symbol: "bonk",
          address: "DezXAZ8z7PnrnzjzKi20uac8R4PNhPxWSzwPq7LS223",
          price: 0.0000234,
          priceChange24h: 8.92,
          volume24h: 3400000,
          marketCap: 180000000,
          liquidity: 1200000,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          platform: "meteora",
        },
        {
          id: "5",
          name: "MYRO",
          symbol: "myro",
          address: "MEKE1rCGaBLGYKZtVNgXFYuS2TTqJJKaYLVq3GpmGfU",
          price: 0.123,
          priceChange24h: 15.67,
          volume24h: 2100000,
          marketCap: 12000000,
          liquidity: 340000,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          platform: "pumpfun",
        },
        {
          id: "6",
          name: "BOME",
          symbol: "bome",
          address: "6sw5nTCTJ9wKQCwtNqV3k7Y2H7m2s5rQ9vK8xLnmNPU",
          price: 0.0089,
          priceChange24h: -4.56,
          volume24h: 5600000,
          marketCap: 89000000,
          liquidity: 2100000,
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          platform: "pumpfun",
        },
        {
          id: "7",
          name: "JUP",
          symbol: "jup",
          address: "JUPyiwrYJFskUPiHa7hkeR8VUtkqjberbSOWd91pbT2",
          price: 0.78,
          priceChange24h: 3.21,
          volume24h: 12000000,
          marketCap: 780000000,
          liquidity: 34000000,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          platform: "raydium",
        },
        {
          id: "8",
          name: "ARIA",
          symbol: "aria",
          address: "ARIA12TrbJxVGKzW3Kq3W4YvD3QwYzKqZxYzKqZxYzKq",
          price: 0.045,
          priceChange24h: 22.34,
          volume24h: 890000,
          marketCap: 4500000,
          liquidity: 120000,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          platform: "meteora",
        },
      ];
      setTokens(mockTokens);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setLoadingTokens(false);
    }
  }, []);

  // Initial token fetch
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Filter tokens
  const filteredTokens = tokens.filter(token => {
    const matchesPlatform = filterPlatform === "all" || token.platform === filterPlatform;
    const matchesSearch = searchQuery === "" || 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  // Send Discord notification
  const sendDiscordNotification = useCallback(async (title: string, message: string, color: number = 0x667eea) => {
    if (!discordWebhook.trim()) return false;
    
    setSendingNotification(true);
    try {
      const response = await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title,
            description: message,
            color,
            timestamp: new Date().toISOString(),
            footer: { text: 'TokenWatch Notifications' },
          }],
        }),
      });
      
      if (response.ok) {
        toast.success("Discord notification sent!");
        return true;
      } else {
        toast.error("Failed to send Discord notification");
        return false;
      }
    } catch (error) {
      console.error("Discord notification error:", error);
      toast.error("Failed to send Discord notification");
      return false;
    } finally {
      setSendingNotification(false);
    }
  }, [discordWebhook]);

  // Save Discord webhook to localStorage
  const saveDiscordWebhook = useCallback((webhook: string) => {
    setDiscordWebhook(webhook);
    localStorage.setItem("discord_webhook", webhook);
    toast.success("Discord webhook saved!");
    setShowDiscordSettings(false);
  }, []);

  // Calculate stats
  const totalVolume24h = tokens.reduce((sum, t) => sum + t.volume24h, 0);
  const avgPriceChange = tokens.length > 0 ? tokens.reduce((sum, t) => sum + t.priceChange24h, 0) / tokens.length : 0;
  const newTokensToday = tokens.filter(t => {
    const created = new Date(t.createdAt).getTime();
    const now = Date.now();
    return now - created < 24 * 60 * 60 * 1000;
  }).length;

  // Auth and initialization
  useEffect(() => {
    api.get("/auth/me").then((d: { authenticated: boolean; user: User }) => {
      if (d.authenticated) setUser(d.user);
    }).catch(() => {});
    
    const savedHistory = localStorage.getItem("codepush_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    // Load Discord webhook from localStorage
    const savedDiscord = localStorage.getItem("discord_webhook");
    if (savedDiscord) {
      setDiscordWebhook(savedDiscord);
    }
  }, []);

  // Load repos
  useEffect(() => {
    if (user) {
      api.get("/api/repos?per_page=50")
        .then((d: Repo[]) => {
          if (Array.isArray(d)) setRepos(d);
        })
        .catch(() => {});
    }
  }, [user]);

  // Save to Supabase
  const saveToSupabase = async (data: GeneratedResult) => {
    if (!user) return;
    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      platform,
      prompt: data.prompt || prompt,
      summary: data.summary,
      files: data.files,
      github_repo: selectedRepo?.name,
      solana_monitored: platform === "solana" ? true : null,
      binance_webhook: platform === "binance" ? data.webhookUrl : null,
      created_at: new Date().toISOString(),
    });
    if (!error) toast.success("Saved to Supabase");
  };

  // Generate handler
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      const r = await api.post("/api/generate", {
        prompt,
        language: pc.lang ? language : null,
        framework: pc.fw ? framework : null,
        mode: pc.mode,
        model,
      }) as GeneratedResult;
      
      setGenerated(r);
      const newHistory = [r, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("codepush_history", JSON.stringify(newHistory));
      await saveToSupabase(r);
      confetti({ particleCount: 80, spread: 60 });
      toast.success("Generated!");
      if (platform === "github") setShowPush(true);
      if (platform === "n8n") setShowN8n(true);
    } catch (e) {
      toast.error((e as Error).message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  // Push to GitHub
  const handlePush = async () => {
    if (!selectedRepo || !generated) return;
    try {
      await api.post("/api/push", {
        repo: selectedRepo.name,
        files: generated.files,
        commitMessage: commitMsg || `feat: ${prompt.slice(0, 60)}`,
      });
      await saveToSupabase({ ...generated, prompt } as GeneratedResult);
      toast.success("Pushed to GitHub + saved to Supabase!");
      setShowPush(false);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  // Download ZIP
  const downloadZip = async () => {
    if (!generated?.files) return;
    const zip = new JSZip();
    generated.files.forEach((f) => zip.file(f.path, f.content));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${(generated.summary || "codepush").replace(/[^a-z0-9]/gi, "_")}.zip`);
    toast.success("ZIP downloaded");
  };

  // Select from history
  const handleHistorySelect = (item: { summary: string; prompt: string }) => {
    setPrompt(item.prompt);
    setGenerated((g) => (g ? { ...g, summary: item.summary } : null));
  };

  const pcColor = pc.color;

  return (
    <>
      <Toaster position="top-center" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow: "hidden",
          background: "#0a0a0f",
          color: "#fff",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            padding: "0 16px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #27272a",
            paddingTop: "env(safe-area-inset-top)",
            background: "linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user?.avatar_url && (
              <Image
                src={user.avatar_url}
                width={28}
                height={28}
                alt=""
                style={{ borderRadius: "50%" }}
              />
            )}
            <span style={{ fontWeight: 700, fontSize: 18, background: "linear-gradient(90deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              TokenWatch
            </span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => fetchTokens()}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
              title="Refresh"
            >
              <Icons.Refresh />
            </button>
            <button
              onClick={() => setShowDiscordSettings(true)}
              style={{ 
                background: "none", 
                border: "none", 
                color: discordWebhook ? "#14F195" : "#fff", 
                cursor: "pointer",
                position: "relative",
              }}
              title="Discord Notifications"
            >
              <Icons.Discord />
              {discordWebhook && (
                <span style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  background: "#14F195",
                  borderRadius: "50%",
                }} />
              )}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
            >
              <Icons.History />
            </button>
            <button
              onClick={() => setShowChat(true)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
            >
              <Icons.Chat />
            </button>
          </div>
        </header>

        {/* MAIN SCROLL */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingBottom: "calc(60px + env(safe-area-inset-bottom))",
            padding: "16px",
          }}
        >
          {/* STATS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            <StatsCard 
              icon={<Activity size={18} />} 
              label="Total Volume" 
              value={`$${(totalVolume24h / 1000000).toFixed(2)}M`}
              subValue="Last 24h"
              color="#667eea"
            />
            <StatsCard 
              icon={<TrendingUp size={18} />} 
              label="Avg Change" 
              value={`${avgPriceChange >= 0 ? "+" : ""}${avgPriceChange.toFixed(2)}%`}
              color={avgPriceChange >= 0 ? "#14F195" : "#FF6B6B"}
            />
            <StatsCard 
              icon={<Rocket size={18} />} 
              label="New Tokens" 
              value={newTokensToday.toString()}
              subValue="Last 24h"
              color="#FF6B6B"
            />
          </div>

          {/* FILTER BAR */}
          <div style={{ 
            display: "flex", 
            gap: 12, 
            marginBottom: 16,
            background: "#1a1a2e",
            borderRadius: 12,
            padding: 12,
            border: "1px solid #2a2a4a",
          }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tokens..."
                style={{
                  width: "100%",
                  background: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                  padding: "10px 14px 10px 38px",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
            <button
              onClick={() => setFilterPlatform("all")}
              style={{
                padding: "10px 16px",
                background: filterPlatform === "all" ? "#667eea" : "#27272a",
                border: "1px solid #3f3f46",
                borderRadius: 8,
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilterPlatform("pumpfun")}
              style={{
                padding: "10px 16px",
                background: filterPlatform === "pumpfun" ? "#FF6B6B" : "#27272a",
                border: "1px solid #3f3f46",
                borderRadius: 8,
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Flame size={14} /> Pump.fun
            </button>
            <button
              onClick={() => setFilterPlatform("meteora")}
              style={{
                padding: "10px 16px",
                background: filterPlatform === "meteora" ? "#00D9FF" : "#27272a",
                border: "1px solid #3f3f46",
                borderRadius: 8,
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Coins size={14} /> Meteora
            </button>
          </div>

          {/* TOKENS GRID */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: 16,
            marginBottom: 24,
          }}>
            {loadingTokens ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#666" }}>
                Loading tokens...
              </div>
            ) : filteredTokens.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#666" }}>
                No tokens found
              </div>
            ) : (
              filteredTokens.map(token => (
                <TokenCard 
                  key={token.id} 
                  token={token}
                  onSelect={(t) => {
                    setPrompt(`Create a trading bot for ${t.name} (${t.symbol}) on Solana with buy/sell alerts based on price movements`);
                    setPlatform("solana");
                    toast.success(`Selected ${t.name} for trading bot creation`);
                    
                    // Send Discord notification
                    sendDiscordNotification(
                      `🎯 Token Selected: ${t.name}`,
                      `**${t.symbol.toUpperCase()}** on ${t.platform}\n\n💰 Price: ${t.price < 0.01 ? t.price.toFixed(6) : t.price.toFixed(4)}
📊 24h Change: ${t.priceChange24h >= 0 ? "+" : ""}${t.priceChange24h.toFixed(2)}%\n🔥 Volume: ${(t.volume24h / 1000).toFixed(1)}K\n\nA trading bot is being created...`,
                      t.priceChange24h >= 0 ? 0x14F195 : 0xFF6B6B
                    );
                  }}
                />
              ))
            )}
          </div>

          {/* PLATFORM BANNER */}
          <div
            style={{
              padding: 12,
              background: "linear-gradient(90deg, #1a1a2e 0%, #16162a 100%)",
              borderBottom: "1px solid #2a2a4a",
              borderTop: "1px solid #2a2a4a",
              color: pcColor,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {pc.fullLabel} — AI Code Generator
          </div>

          {/* PROMPT CARD */}
          <div
            style={{
              background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
              border: "1px solid #2a2a4a",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={pc.placeholder}
              rows={5}
              style={{
                width: "100%",
                background: "#27272a",
                border: "none",
                borderRadius: 12,
                padding: 14,
                color: "#fff",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                resize: "none",
                fontSize: 14,
              }}
            />

            {(pc.lang || pc.fw) && (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {pc.lang && (
                  <Sel value={language} onChange={(e) => setLanguage(e.target.value)} style={{ flex: 1 }}>
                    <option value="auto">Auto</option>
                    <option value="TypeScript">TS</option>
                    <option value="Python">Python</option>
                  </Sel>
                )}
                {pc.fw && (
                  <Inp
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    placeholder="Framework / Integrations"
                    style={{ flex: 1 }}
                  />
                )}
              </div>
            )}

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TEMPLATES[platform]?.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(t)}
                  style={{
                    fontSize: 12,
                    padding: "6px 12px",
                    background: "#27272a",
                    borderRadius: 999,
                    border: "1px solid #3f3f46",
                    color: "#a1a1aa",
                    cursor: "pointer",
                  }}
                >
                  {t.slice(0, 45)}…
                </button>
              ))}
            </div>

            <PBtn
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              style={{ width: "100%", marginTop: 16, background: pcColor, color: "#000" }}
            >
              {generating ? (
                "Generating with Groq/Claude…"
              ) : (
                <>
                  <Icons.Wand /> Generate
                </>
              )}
            </PBtn>
          </div>

          {/* OUTPUT */}
          {generated && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: pcColor }}>{generated.summary}</div>
                <button
                  onClick={downloadZip}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: pcColor,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Icons.Download /> ZIP
                </button>
              </div>

              {platform === "solana" && (
                <div style={{ marginTop: 12, padding: 12, background: "#18181b", borderRadius: 12 }}>
                  Monitoring new Solana launches via Dexscreener + Birdeye (free)
                </div>
              )}
              {platform === "binance" && (
                <div style={{ marginTop: 12, padding: 12, background: "#18181b", borderRadius: 12 }}>
                  Webhook ready — copy URL below and paste in TradingView / Binance alerts
                </div>
              )}

              <button
                onClick={() => setShowCode(true)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: 16,
                  background: "#27272a",
                  borderRadius: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View {generated.files?.length || 0} files <Icons.Copy />
              </button>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => setShowRepo(true)}
                  style={{
                    flex: 1,
                    padding: 14,
                    background: "#27272a",
                    borderRadius: 12,
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Choose Repo
                </button>
                {platform === "github" ? (
                  <PBtn onClick={() => setShowPush(true)} style={{ flex: 1 }}>
                    Push to GitHub
                  </PBtn>
                ) : (
                  <PBtn onClick={() => setShowN8n(true)} style={{ flex: 1, background: pcColor }}>
                    Deploy / Activate
                  </PBtn>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAV */}
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "#0a0a0f",
            borderTop: "1px solid #27272a",
            display: "flex",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {Object.values(PLATFORMS).map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id as PlatformId)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: platform === p.id ? p.color : "#71717a",
                fontSize: 11,
                gap: 2,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {p.id === "github" && <Icons.GitHub />}
              {p.id === "n8n" && <Icons.Flow />}
              {p.id === "zapier" && <Icons.Zap />}
              {p.id === "solana" && <Icons.Trending />}
              {p.id === "binance" && <Icons.Binance />}
              {p.label}
            </button>
          ))}
        </nav>
      </div>

      {/* SHEETS */}
      <RepoSheet
        open={showRepo}
        onClose={() => setShowRepo(false)}
        repos={repos}
        selected={selectedRepo}
        onSelect={setSelectedRepo}
        user={user}
      />
      <CodeSheet
        open={showCode}
        onClose={() => setShowCode(false)}
        files={generated?.files}
        summary={generated?.summary}
      />
      <PushSheet
        open={showPush}
        onClose={() => setShowPush(false)}
        repo={selectedRepo}
        files={generated?.files}
        commitMsg={commitMsg}
        setCommitMsg={setCommitMsg}
        onPush={handlePush}
      />
      <N8nSheet open={showN8n} onClose={() => setShowN8n(false)} />
      <AIChatSheet
        open={showChat}
        onClose={() => setShowChat(false)}
        context={`You are helping with ${platform} — current prompt: ${prompt}`}
      />
      <DiscordSheet
        open={showDiscordSettings}
        onClose={() => setShowDiscordSettings(false)}
        webhook={discordWebhook}
        onSave={saveDiscordWebhook}
        sending={sendingNotification}
      />
      <HistorySheet
        open={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelect={handleHistorySelect}
      />
    </>
  );
}
