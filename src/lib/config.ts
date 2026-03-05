"use client";

import { createClient } from "@supabase/supabase-js";

// Create Supabase client - using environment variables or placeholder
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API helpers (for backend communication)
export const api = {
  get: async (path: string) => {
    const response = await fetch(path, { credentials: "include" });
    return response.json();
  },
  post: async (path: string, body: unknown) => {
    const response = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  },
};

// Models configuration
export const MODELS = [
  { id: "llama3-70b-8192", name: "Llama 3 70B (Groq — FAST)", provider: "groq", color: "#FF9900" },
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", provider: "anthropic", color: "#D97757" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", color: "#10A37F" },
  { id: "mixtral-8x7b-32768", name: "Mixtral (Groq)", provider: "groq", color: "#FF9900" },
];

// Platforms configuration
export const PLATFORMS = {
  github: {
    id: "github",
    label: "Code",
    fullLabel: "GitHub Push",
    color: "#58a6ff",
    mode: "code",
    lang: true,
    fw: true,
    placeholder: "e.g. React dashboard with sidebar, charts and dark mode…",
  },
  n8n: {
    id: "n8n",
    label: "n8n",
    fullLabel: "n8n Workflow",
    color: "#ea4b71",
    mode: "n8n",
    lang: false,
    fw: false,
    placeholder: "e.g. When Stripe payment received → send Slack + log to Google Sheets…",
  },
  zapier: {
    id: "zapier",
    label: "Zapier",
    fullLabel: "Zapier CLI App",
    color: "#ff6b35",
    mode: "zapier",
    lang: false,
    fw: true,
    placeholder: "e.g. Zapier app for HubSpot with new contact trigger…",
  },
  solana: {
    id: "solana",
    label: "Solana",
    fullLabel: "Solana Launches",
    color: "#14F195",
    mode: "solana",
    lang: false,
    fw: false,
    placeholder: "Monitor new Solana tokens on pump.fun / Raydium — alert on volume >$10k, send to Telegram…",
  },
  binance: {
    id: "binance",
    label: "Binance",
    fullLabel: "Binance Webhook",
    color: "#F0B90B",
    mode: "binance",
    lang: false,
    fw: false,
    placeholder: "Free Binance price alert webhook — BTCUSDT > 65000 → send Telegram + log to Supabase…",
  },
} as const;

export type PlatformId = keyof typeof PLATFORMS;

// Prompt templates
export const TEMPLATES = {
  github: [
    "Modern Next.js 15 SaaS dashboard with sidebar, charts and dark mode",
    "FastAPI + React fullstack todo app with authentication",
  ],
  n8n: [
    "Daily Twitter digest → Slack",
    "New Stripe payment → send Slack + log to Google Sheets",
  ],
  zapier: [
    "HubSpot contact → Pipedrive deal sync",
  ],
  solana: [
    "Monitor pump.fun new launches — volume > $5k + 100 holders → Telegram alert",
    "Raydium new pair sniper — buy if liquidity > $10k and send to Supabase",
  ],
  binance: [
    "BTCUSDT crosses 65000 → Telegram + Supabase log",
    "ETHUSDT 5% pump in 5min → Discord alert + Binance order",
  ],
} as const;

// Type definitions
export interface GeneratedResult {
  id: string;
  summary: string;
  prompt: string;
  files: Array<{ path: string; content: string }>;
  platform: string;
  webhookUrl?: string;
  created_at?: string;
}

export interface User {
  id: string;
  login: string;
  avatar_url: string;
  email?: string;
}

export interface Repo {
  name: string;
  full_name: string;
  description?: string;
  private: boolean;
}
