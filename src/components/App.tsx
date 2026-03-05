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
};

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

  const pc = PLATFORMS[platform];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            <span style={{ fontWeight: 700 }}>CodePush</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
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

        {/* PLATFORM BANNER */}
        <div
          style={{
            padding: 12,
            background: "#111",
            borderBottom: "1px solid #27272a",
            color: pcColor,
            fontSize: 13,
          }}
        >
          {pc.fullLabel}
        </div>

        {/* MAIN SCROLL */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingBottom: "calc(60px + env(safe-area-inset-bottom))",
            padding: "16px",
          }}
        >
          {/* PROMPT CARD */}
          <div
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
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
      <HistorySheet
        open={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelect={handleHistorySelect}
      />
    </>
  );
}
