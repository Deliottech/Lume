"use client";

import React from "react";
import { X, Copy, Check } from "lucide-react";

// Spinner component
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        opacity="0.3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

// Input component
export function Inp({
  value,
  onChange,
  placeholder,
  style,
  disabled,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        background: "#27272a",
        border: "1px solid #3f3f46",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        width: "100%",
        ...style,
      }}
    />
  );
}

// Select component
export function Sel({
  value,
  onChange,
  style,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        background: "#27272a",
        border: "1px solid #3f3f46",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        width: "100%",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </select>
  );
}

// Label component
export function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 6, display: "block" }}>
      {children}
    </label>
  );
}

// Primary Button component
export function PBtn({
  onClick,
  disabled,
  style,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "#3b82f6",
        border: "none",
        borderRadius: 10,
        padding: "12px 20px",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Ghost Button component
export function GBtn({
  onClick,
  style,
  children,
}: {
  onClick: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "1px solid #3f3f46",
        borderRadius: 10,
        padding: "12px 20px",
        color: "#fff",
        fontSize: 14,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Error Box component
export function ErrBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#450a0a",
        border: "1px solid #7f1d1d",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#fca5a5",
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}

// OK Box component
export function OkBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#052e16",
        border: "1px solid #14532d",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#86efac",
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}

// Sheet component (bottom sheet/modal)
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#18181b",
          borderTop: "1px solid #27272a",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          maxHeight: "85vh",
          overflowY: "auto",
          zIndex: 51,
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

// Repository Sheet component
export function RepoSheet({
  open,
  onClose,
  repos,
  selected,
  onSelect,
  user,
}: {
  open: boolean;
  onClose: () => void;
  repos: Array<{ name: string; full_name: string; description?: string; private: boolean }>;
  selected: { name: string; full_name: string } | null;
  onSelect: (repo: { name: string; full_name: string }) => void;
  user: { login: string; avatar_url: string } | null;
}) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#18181b",
          borderTop: "1px solid #27272a",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          maxHeight: "75vh",
          overflowY: "auto",
          zIndex: 51,
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Choose Repository</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}
          >
            <X size={24} />
          </button>
        </div>
        
        {(!user || repos.length === 0) ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#71717a" }}>
            <p>{!user ? "Please sign in to see repositories" : "No repositories found"}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {repos.map((repo) => (
              <button
                key={repo.full_name}
                onClick={() => {
                  onSelect({ name: repo.name, full_name: repo.full_name });
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  background: selected?.full_name === repo.full_name ? "#27272a" : "transparent",
                  border: selected?.full_name === repo.full_name ? "1px solid #3b82f6" : "1px solid #27272a",
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{repo.name}</span>
                    {repo.private && (
                      <span style={{ fontSize: 10, color: "#fbbf24", background: "#451a03", padding: "2px 6px", borderRadius: 4 }}>
                        Private
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p style={{ color: "#71717a", fontSize: 12, marginTop: 4 }}>{repo.description}</p>
                  )}
                </div>
                {selected?.full_name === repo.full_name && (
                  <Check size={18} color="#3b82f6" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Code Viewer Sheet component
export function CodeSheet({
  open,
  onClose,
  files,
  summary,
}: {
  open: boolean;
  onClose: () => void;
  files: Array<{ path: string; content: string }> | undefined;
  summary: string | undefined;
}) {
  const [selectedFile, setSelectedFile] = React.useState<number>(0);
  const [copied, setCopied] = React.useState(false);

  if (!open || !files) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(files[selectedFile]?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#18181b",
          borderTop: "1px solid #27272a",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 51,
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{summary || "Generated Code"}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}
          >
            <X size={24} />
          </button>
        </div>

        {/* File tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 8 }}>
          {files.map((file, i) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(i)}
              style={{
                padding: "8px 14px",
                background: selectedFile === i ? "#27272a" : "transparent",
                border: selectedFile === i ? "1px solid #3f3f46" : "1px solid transparent",
                borderRadius: 8,
                color: selectedFile === i ? "#fff" : "#71717a",
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {file.path}
            </button>
          ))}
        </div>

        {/* Code content */}
        <div style={{ position: "relative", background: "#0a0a0a", borderRadius: 12, overflow: "hidden" }}>
          <button
            onClick={copyCode}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#27272a",
              border: "none",
              borderRadius: 6,
              padding: "6px 10px",
              color: "#71717a",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              zIndex: 10,
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <pre
            style={{
              margin: 0,
              padding: 16,
              paddingTop: 40,
              overflow: "auto",
              maxHeight: "50vh",
              fontSize: 12,
              lineHeight: 1.6,
              color: "#e5e5e5",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
            }}
          >
            <code>{files[selectedFile]?.content}</code>
          </pre>
        </div>
      </div>
    </>
  );
}

// Push Sheet component
export function PushSheet({
  open,
  onClose,
  repo,
  files,
  commitMsg,
  setCommitMsg,
  onPush,
}: {
  open: boolean;
  onClose: () => void;
  repo: { name: string; full_name: string } | null;
  files: Array<{ path: string; content: string }> | undefined;
  commitMsg: string;
  setCommitMsg: (msg: string) => void;
  onPush: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#18181b",
          borderTop: "1px solid #27272a",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          zIndex: 51,
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Push to GitHub</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Lbl>Repository</Lbl>
          <div style={{ padding: "12px 14px", background: "#27272a", borderRadius: 8, color: "#fff", fontSize: 14 }}>
            {repo?.full_name || "No repository selected"}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Lbl>Files to push</Lbl>
          <div style={{ padding: "12px 14px", background: "#27272a", borderRadius: 8, color: "#fff", fontSize: 14 }}>
            {files?.length || 0} files
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Lbl>Commit message</Lbl>
          <Inp
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
            placeholder="feat: generated code"
          />
        </div>

        <PBtn onClick={onPush} disabled={!repo} style={{ width: "100%" }}>
          Push to GitHub
        </PBtn>
      </div>
    </>
  );
}

// n8n Sheet component
export function N8nSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#18181b",
          borderTop: "1px solid #27272a",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          zIndex: 51,
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Deploy n8n Workflow</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}
          >
            <X size={24} />
          </button>
        </div>

        <p style={{ color: "#71717a", fontSize: 14, marginBottom: 16 }}>
          Your n8n workflow has been generated. Download the JSON file and import it into your n8n instance.
        </p>

        <OkBox>
          Workflow ready! Click download to get the JSON file.
        </OkBox>
      </div>
    </>
  );
}

// History Sheet component
export function HistorySheet({
  open,
  onClose,
  history,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  history: Array<{ id: string; summary: string; platform: string; prompt: string; created_at?: string }>;
  onSelect: (item: { summary: string; prompt: string }) => void;
}) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#18181b",
          borderTop: "1px solid #27272a",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          maxHeight: "75vh",
          overflowY: "auto",
          zIndex: 51,
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>History</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}
          >
            <X size={24} />
          </button>
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#71717a" }}>
            <p>No history yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect({ summary: item.summary, prompt: item.prompt });
                  onClose();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 6,
                  padding: "14px 16px",
                  background: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 14, flex: 1 }}>
                    {item.summary || "Untitled"}
                  </span>
                  <span style={{ fontSize: 10, color: "#71717a", background: "#18181b", padding: "2px 8px", borderRadius: 4 }}>
                    {item.platform}
                  </span>
                </div>
                <p style={{ color: "#71717a", fontSize: 12, margin: 0 }}>
                  {item.prompt?.slice(0, 60)}...
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
