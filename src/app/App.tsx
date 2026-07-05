import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, FolderOpen, Zap, GitBranch, FlaskConical,
  Bot, ShoppingBag, BarChart3, FileText, Users, Plug, Settings,
  Search, Command, Bell, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, Activity, TrendingUp, TrendingDown, DollarSign,
  Shield, Cpu, Database, Server, Globe, AlertTriangle,
  CheckCircle, Circle, Play, RotateCcw, Download, ArrowUpRight,
  ArrowRight, Terminal, Brain, Layers, Target, Clock,
  MessageSquare, Send, X, Star, Package, Eye, RefreshCw,
  Filter, MoreHorizontal, Sparkles, Maximize2, Info, Plus,
  HardDrive, Gauge, Award, Lock, User, SlidersHorizontal,
  Rocket, Hash, BarChart2, Cog, AlertCircle, Workflow,
  Code, Boxes, GitMerge
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Colour & typography tokens ─────────────────────────────────────────────
const C = {
  bg: "#09090c",
  surface: "#111318",
  elevated: "#1a1d24",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.12)",
  blue: "#3b82f6",
  blueDim: "rgba(59,130,246,0.12)",
  blueGlow: "rgba(59,130,246,0.25)",
  emerald: "#10b981",
  emeraldDim: "rgba(16,185,129,0.12)",
  amber: "#f59e0b",
  amberDim: "rgba(245,158,11,0.12)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.12)",
  purple: "#a855f7",
  purpleDim: "rgba(168,85,247,0.12)",
  text: "#f1f5f9",
  textSub: "#94a3b8",
  textMuted: "#475569",
};

// ─── Mock data ───────────────────────────────────────────────────────────────
const mkSparkline = (base: number, variance: number, n = 18) =>
  Array.from({ length: n }, () => ({
    v: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance * 2)),
  }));

const systems = [
  { name: "prod-k8s-cluster-01", type: "Kubernetes", health: 98, status: "Optimizing", cost: "$12,480", savings: "$2,240", latency: "12 ms", reliability: "99.98%", statusKey: "blue" },
  { name: "payment-svc-us-east", type: "Microservice", health: 87, status: "Alert", cost: "$3,200", savings: "$580", latency: "28 ms", reliability: "99.91%", statusKey: "amber" },
  { name: "data-warehouse-v2", type: "Database", health: 95, status: "Optimized", cost: "$8,640", savings: "$1,560", latency: "4 ms", reliability: "99.99%", statusKey: "green" },
  { name: "ml-training-infra", type: "ML Infra", health: 72, status: "Critical", cost: "$24,100", savings: "$4,320", latency: "142 ms", reliability: "98.40%", statusKey: "red" },
  { name: "cdn-global-mesh", type: "Network", health: 99, status: "Optimized", cost: "$5,880", savings: "$890", latency: "6 ms", reliability: "99.99%", statusKey: "green" },
  { name: "auth-service-v3", type: "Microservice", health: 96, status: "Monitoring", cost: "$1,440", savings: "$210", latency: "9 ms", reliability: "99.97%", statusKey: "blue" },
];

const insights = [
  { id: 1, title: "Reduce cloud compute cost by 18%", desc: "Right-sizing 23 over-provisioned EC2 instances in us-east-1 and eu-west-2 regions.", priority: "HIGH", confidence: 94, impact: "+$2,240/mo savings", savings: "$26,880/yr", cat: "Cost", catColor: C.emerald, catDim: C.emeraldDim },
  { id: 2, title: "Increase API throughput by 21%", desc: "Connection pool exhaustion detected. Increase max_connections from 100 → 250.", priority: "HIGH", confidence: 89, impact: "+2,400 req/s capacity", savings: "Prevents $8K/mo in scaling", cat: "Performance", catColor: C.blue, catDim: C.blueDim },
  { id: 3, title: "Memory bottleneck in payment-svc", desc: "Heap usage avg 87% over 72 hrs. GC pressure causing 28 ms latency spikes.", priority: "CRITICAL", confidence: 97, impact: "Latency −16 ms avg", savings: "Risk: $48K/hr SLA breach", cat: "Risk", catColor: C.red, catDim: C.redDim },
  { id: 4, title: "Database index recommendation", desc: "3 missing indexes in orders table causing full-table scans on 40% of queries.", priority: "MEDIUM", confidence: 91, impact: "Query time −68%", savings: "$1,200/mo compute savings", cat: "Database", catColor: C.purple, catDim: C.purpleDim },
];

const dtNodes = [
  { id: "cdn",   label: "CDN Edge",       type: "network",  x: 660, y: 55,  health: 99, cpu: 8,  mem: 12 },
  { id: "lb",    label: "Load Balancer",  type: "network",  x: 390, y: 55,  health: 99, cpu: 18, mem: 24 },
  { id: "ws1",   label: "Web Server 01",  type: "server",   x: 160, y: 155, health: 96, cpu: 62, mem: 71 },
  { id: "ws2",   label: "Web Server 02",  type: "server",   x: 390, y: 155, health: 94, cpu: 58, mem: 68 },
  { id: "ws3",   label: "Web Server 03",  type: "server",   x: 630, y: 155, health: 98, cpu: 44, mem: 55 },
  { id: "api",   label: "API Gateway",    type: "service",  x: 390, y: 265, health: 92, cpu: 76, mem: 82 },
  { id: "auth",  label: "Auth Service",   type: "service",  x: 130, y: 365, health: 99, cpu: 22, mem: 34 },
  { id: "pay",   label: "Payment Svc",    type: "service",  x: 350, y: 385, health: 87, cpu: 88, mem: 87 },
  { id: "srch",  label: "Search Engine",  type: "service",  x: 570, y: 365, health: 95, cpu: 54, mem: 64 },
  { id: "mq",    label: "Message Queue",  type: "service",  x: 730, y: 280, health: 98, cpu: 32, mem: 48 },
  { id: "db1",   label: "Primary DB",     type: "database", x: 210, y: 475, health: 97, cpu: 44, mem: 72 },
  { id: "redis", label: "Redis Cache",    type: "database", x: 440, y: 490, health: 99, cpu: 18, mem: 84 },
  { id: "db2",   label: "Analytics DB",   type: "database", x: 670, y: 465, health: 93, cpu: 66, mem: 78 },
];

const dtEdges = [
  ["cdn","lb"],["lb","ws1"],["lb","ws2"],["lb","ws3"],
  ["ws1","api"],["ws2","api"],["ws3","api"],
  ["api","auth"],["api","pay"],["api","srch"],["api","mq"],
  ["auth","db1"],["pay","db1"],["pay","redis"],
  ["srch","redis"],["srch","db2"],["mq","db2"],
];

const rewardData = Array.from({ length: 50 }, (_, i) => ({
  ep: i * 20, reward: Math.min(850, 100 + i * 15.8 + Math.sin(i * 0.4) * 28 + Math.random() * 18),
}));
const lossData = Array.from({ length: 50 }, (_, i) => ({
  ep: i * 20, loss: Math.max(0.018, 2.6 - i * 0.051 + Math.sin(i * 0.7) * 0.08 + Math.random() * 0.06),
}));

const analyticsData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  savings: Math.round(800 + i * 88 + Math.random() * 180),
  latency: Math.max(7, 44 - i * 1.2 + Math.random() * 4),
  efficiency: Math.round(62 + i * 1.1 + Math.random() * 4),
}));

const radarData = [
  { subject: "Performance", v: 88 },
  { subject: "Cost Eff.", v: 74 },
  { subject: "Reliability", v: 96 },
  { subject: "Security", v: 82 },
  { subject: "Scalability", v: 79 },
  { subject: "Compliance", v: 91 },
];

const plugins = [
  { name: "Cloud Cost Optimizer", cat: "Cloud", ver: "3.2.1", dl: "48.2K", rating: 4.9, author: "OptiVerse Labs", verified: true, desc: "ML-powered right-sizing for AWS, GCP & Azure workloads." },
  { name: "Warehouse Flow AI", cat: "Manufacturing", ver: "2.1.0", dl: "12.8K", rating: 4.7, author: "LogisticAI", verified: true, desc: "Real-time warehouse robotics path optimization engine." },
  { name: "Traffic Signal RL", cat: "Traffic", ver: "1.8.3", dl: "8.4K", rating: 4.6, author: "UrbanOS", verified: false, desc: "Adaptive traffic signal timing using deep reinforcement learning." },
  { name: "EHR Scheduling", cat: "Healthcare", ver: "2.4.0", dl: "6.1K", rating: 4.8, author: "MedOptim", verified: true, desc: "Hospital bed and staff scheduling with constraint-based AI." },
  { name: "Power Grid Balancer", cat: "Energy", ver: "1.5.2", dl: "3.9K", rating: 4.5, author: "GridAI", verified: true, desc: "Demand-aware smart grid load balancing & prediction." },
  { name: "FinOps Intelligence", cat: "Finance", ver: "4.0.1", dl: "22.7K", rating: 4.9, author: "FinOptix", verified: true, desc: "Budget anomaly detection and multi-cloud cost forecasting." },
];

const chatHistory = [
  { role: "user", text: "Why is latency increasing on payment-svc?" },
  { role: "ai", text: "I've identified the root cause of your latency spike on payment-svc. The primary driver is heap memory saturation (87% avg) triggering frequent GC cycles, causing P99 latency to reach 142 ms — 5× above baseline.", chart: true },
  { role: "user", text: "What should I do to fix it immediately?" },
  { role: "ai", text: "Here's your prioritized action plan:\n\n1. **Immediate (< 1hr):** Increase JVM heap from 2 GB → 4 GB. Expected impact: GC frequency −74%, latency back to ~12 ms.\n2. **Short-term (< 1 week):** Audit object allocation in PaymentProcessor.java lines 247–312. Fix 3 identified memory leaks.\n3. **Structural:** Enable G1GC region-based collection. Reduce allocation rate by ~40%.\n\nApplying fix #1 now would prevent the current $48K/hr SLA breach risk.", chart: false },
];

// ─── Utility Components ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Optimized:  { bg: C.emeraldDim, text: C.emerald, dot: C.emerald },
    Optimizing: { bg: C.blueDim,    text: C.blue,    dot: C.blue },
    Monitoring: { bg: C.blueDim,    text: C.blue,    dot: C.blue },
    Alert:      { bg: C.amberDim,   text: C.amber,   dot: C.amber },
    Critical:   { bg: C.redDim,     text: C.red,     dot: C.red },
  };
  const s = map[status] ?? { bg: C.elevated, text: C.textSub, dot: C.textSub };
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide"
      style={{ background: s.bg, color: s.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot,
        boxShadow: status === "Optimizing" || status === "Monitoring" ? `0 0 6px ${s.dot}` : undefined }} />
      {status}
    </span>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, string> = { CRITICAL: C.red, HIGH: C.amber, MEDIUM: C.blue, LOW: C.emerald };
  return (
    <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded"
      style={{ color: map[p] ?? C.textSub, background: map[p] ? map[p] + "20" : C.elevated,
        fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {p}
    </span>
  );
}

function HealthBar({ value }: { value: number }) {
  const color = value >= 95 ? C.emerald : value >= 85 ? C.amber : C.red;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: C.elevated }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-mono" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>{value}%</span>
    </div>
  );
}

function Sparkline({ data, color }: { data: { v: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          fill={`url(#sg-${color.replace("#", "")})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MetricCard({ icon: Icon, label, value, sub, trend, trendUp, spark, color }:
  { icon: any; label: string; value: string; sub: string; trend: string; trendUp: boolean;
    spark: { v: number }[]; color: string }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 hover:translate-y-[-2px]"
      style={{ background: C.surface, border: `1px solid ${C.border}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: color + "20" }}>
            <Icon size={15} style={{ color }} />
          </div>
          <div>
            <div className="text-[11px] font-medium tracking-wide uppercase"
              style={{ color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</div>
            <div className="text-xl font-bold mt-0.5"
              style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium"
          style={{ color: trendUp ? C.emerald : C.red }}>
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trend}
        </div>
      </div>
      <Sparkline data={spark} color={color} />
      <div className="text-[11px]" style={{ color: C.textMuted }}>{sub}</div>
    </div>
  );
}

// ─── Page: Dashboard ─────────────────────────────────────────────────────────

function PageDashboard() {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const metrics = [
    { icon: Gauge,       label: "Optimization Score", value: "94.2",    sub: "↑ 2.1 pts vs last week",   trend: "+2.1%",  trendUp: true,  spark: mkSparkline(88, 12), color: C.blue },
    { icon: Activity,    label: "System Health",       value: "98.7%",   sub: "6 systems actively monitored", trend: "+0.4%", trendUp: true, spark: mkSparkline(95, 6),  color: C.emerald },
    { icon: DollarSign,  label: "Est. Cost Savings",   value: "$9,790",  sub: "Monthly across all systems",  trend: "+18%",  trendUp: true,  spark: mkSparkline(70, 20), color: C.amber },
    { icon: Brain,       label: "AI Confidence",       value: "91.4%",   sub: "Based on 2.4M training eps",  trend: "+3.2%", trendUp: true,  spark: mkSparkline(85, 10), color: C.purple },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Hero */}
      <div className="rounded-xl p-6 relative overflow-hidden"
        style={{ background: C.surface, border: `1px solid ${C.border}`,
          boxShadow: "0 0 0 1px rgba(59,130,246,0.1), 0 24px 64px rgba(0,0,0,0.4)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-widest"
                style={{ color: C.blue, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                OPTIVERSE OS · v4.2.1
              </span>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.emerald }} />
              <span className="text-[11px]" style={{ color: C.emerald }}>All systems nominal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1"
              style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Welcome to OptiVerse OS
            </h1>
            <p style={{ color: C.textSub }} className="text-sm max-w-xl">
              Autonomous AI Platform for Continuous System Optimization — 6 active systems, 94.2% optimization score, $9,790/mo in identified savings.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: C.blue, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Rocket size={14} /> Run Optimization
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ background: C.elevated, color: C.textSub, border: `1px solid ${C.border}` }}>
              <Eye size={14} /> View Report
            </button>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(m => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-5 gap-6">
        {/* Active Systems */}
        <div className="col-span-3 rounded-xl overflow-hidden"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2">
              <Activity size={14} style={{ color: C.blue }} />
              <span className="font-semibold text-sm" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Active Systems
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full"
                style={{ background: C.blueDim, color: C.blue }}>6</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
                <Filter size={13} style={{ color: C.textMuted }} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
                <RefreshCw size={13} style={{ color: C.textMuted }} />
              </button>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["System", "Type", "Health", "Status", "Cost/mo", "Savings", "Latency"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium uppercase tracking-wide"
                    style={{ color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systems.map((s, i) => (
                <tr key={s.name} className="transition-colors hover:bg-white/[0.02] cursor-pointer"
                  style={{ borderBottom: i < systems.length - 1 ? `1px solid ${C.border}` : undefined }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Server size={12} style={{ color: C.textMuted }} />
                      <span className="font-mono text-[11px]" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: C.textSub }}>{s.type}</span>
                  </td>
                  <td className="px-4 py-3"><HealthBar value={s.health} /></td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 font-mono" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.cost}
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.savings}
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: C.textSub, fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Insights */}
        <div className="col-span-2 rounded-xl flex flex-col overflow-hidden"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: C.amber }} />
              <span className="font-semibold text-sm" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                AI Insights
              </span>
            </div>
            <span className="text-[11px]" style={{ color: C.textMuted }}>4 recommendations</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: C.border }}>
            {insights.map(ins => (
              <div key={ins.id} className="px-4 py-3.5 cursor-pointer transition-colors hover:bg-white/[0.02]"
                onClick={() => setExpandedInsight(expandedInsight === ins.id ? null : ins.id)}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <PriorityBadge p={ins.priority} />
                    <span className="text-xs font-semibold truncate"
                      style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{ins.title}</span>
                  </div>
                  <ChevronDown size={12} style={{ color: C.textMuted, flexShrink: 0,
                    transform: expandedInsight === ins.id ? "rotate(180deg)" : undefined, transition: "transform .2s" }} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full"
                    style={{ background: ins.catDim, color: ins.catColor }}>{ins.cat}</span>
                  <span className="text-[11px]" style={{ color: C.textMuted }}>
                    Confidence: <span style={{ color: ins.catColor }} className="font-mono">{ins.confidence}%</span>
                  </span>
                </div>
                {expandedInsight === ins.id && (
                  <div className="mt-2 space-y-2">
                    <p className="text-[11px] leading-relaxed" style={{ color: C.textSub }}>{ins.desc}</p>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span style={{ color: C.textMuted }}>Impact:</span>
                      <span style={{ color: ins.catColor }} className="font-medium">{ins.impact}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110"
                        style={{ background: ins.catColor, color: "#fff" }}>Apply</button>
                      <button className="flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                        style={{ background: C.elevated, color: C.textSub, border: `1px solid ${C.border}` }}>Explain</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Digital Twin ───────────────────────────────────────────────────────

function PageDigitalTwin() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [selectedNode, setSelectedNode] = useState<typeof dtNodes[0] | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  const nodeById = (id: string) => dtNodes.find(n => n.id === id)!;

  const typeIcon: Record<string, any> = {
    network: Globe, server: Server, service: Boxes, database: Database,
  };
  const typeColor: Record<string, string> = {
    network: C.blue, server: "#64748b", service: C.purple, database: C.emerald,
  };

  const healthColor = (h: number) => h >= 95 ? C.emerald : h >= 85 ? C.amber : C.red;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Digital Twin · prod-k8s-cluster-01
          </span>
          <StatusBadge status="Optimizing" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full"
          style={{ background: C.emeraldDim, color: C.emerald }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.emerald }} />
          Live — 342 events/s
        </div>
        <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
          <RefreshCw size={13} style={{ color: C.textMuted }} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
          <Maximize2 size={13} style={{ color: C.textMuted }} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SVG Graph */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#0a0b0e" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <style>{`
            @keyframes dash-flow { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }
            @keyframes pulse-ring { 0%,100%{r:10;opacity:0.8} 50%{r:16;opacity:0} }
          `}</style>
          <svg width="100%" height="100%" viewBox="0 0 860 570" className="w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {dtEdges.map(([fid, tid], i) => {
              const f = nodeById(fid), t = nodeById(tid);
              const isActive = hoveredNode === fid || hoveredNode === tid;
              return (
                <g key={i}>
                  <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                    stroke={isActive ? C.blue : "rgba(255,255,255,0.08)"} strokeWidth={isActive ? 1.5 : 1}
                    strokeDasharray="5 5" style={{ animation: `dash-flow 1.${i % 3}s linear infinite` }} />
                </g>
              );
            })}

            {/* Nodes */}
            {dtNodes.map(node => {
              const isHover = hoveredNode === node.id;
              const isSelected = selectedNode?.id === node.id;
              const color = typeColor[node.type];
              const hColor = healthColor(node.health);
              return (
                <g key={node.id} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(isSelected ? null : node)}>
                  {/* Pulse ring */}
                  {(isHover || isSelected) && (
                    <circle cx={node.x} cy={node.y} r={22} fill="none"
                      stroke={color} strokeWidth={1} opacity={0.4}
                      style={{ animation: "pulse-ring 2s ease-in-out infinite" }} />
                  )}
                  {/* Health ring */}
                  <circle cx={node.x} cy={node.y} r={18} fill="none"
                    stroke={hColor} strokeWidth={isSelected ? 2 : 1.5} opacity={0.6} />
                  {/* Node bg */}
                  <circle cx={node.x} cy={node.y} r={14}
                    fill={isHover || isSelected ? color + "30" : C.surface}
                    stroke={color} strokeWidth={isSelected ? 1.5 : 1}
                    filter={isHover ? "url(#glow)" : undefined} />
                  {/* Label */}
                  <text x={node.x} y={node.y + 30} textAnchor="middle"
                    fill={isHover ? C.text : C.textSub} fontSize={9}
                    fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={600}>
                    {node.label}
                  </text>
                  {/* Health dot */}
                  <circle cx={node.x + 10} cy={node.y - 10} r={3.5}
                    fill={hColor} opacity={0.9} />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 px-3 py-2 rounded-lg"
            style={{ background: "rgba(17,19,24,0.9)", border: `1px solid ${C.border}`, backdropFilter: "blur(8px)" }}>
            {Object.entries(typeColor).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="capitalize" style={{ color: C.textSub }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Detail Panel */}
        {selectedNode && (
          <div className="w-72 flex flex-col overflow-y-auto" style={{ background: C.surface, borderLeft: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="font-semibold text-sm" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selectedNode.label}
              </span>
              <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-white/5">
                <X size={13} style={{ color: C.textMuted }} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedNode.health >= 95 ? "Optimized" : selectedNode.health >= 85 ? "Alert" : "Critical"} />
                <span className="text-[11px] capitalize px-1.5 py-0.5 rounded"
                  style={{ background: typeColor[selectedNode.type] + "20", color: typeColor[selectedNode.type] }}>
                  {selectedNode.type}
                </span>
              </div>
              {[
                { label: "CPU Usage", value: `${selectedNode.cpu}%`, color: selectedNode.cpu > 80 ? C.red : selectedNode.cpu > 60 ? C.amber : C.emerald },
                { label: "Memory", value: `${selectedNode.mem}%`, color: selectedNode.mem > 80 ? C.red : selectedNode.mem > 60 ? C.amber : C.emerald },
                { label: "Health Score", value: `${selectedNode.health}%`, color: healthColor(selectedNode.health) },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px]" style={{ color: C.textMuted }}>{m.label}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: C.elevated }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: m.value, background: m.color }} />
                  </div>
                </div>
              ))}
              <div className="pt-2 space-y-2">
                <button className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
                  style={{ background: C.blue, color: "#fff" }}>Optimize Node</button>
                <button className="w-full py-2 rounded-lg text-xs transition-all"
                  style={{ background: C.elevated, color: C.textSub, border: `1px solid ${C.border}` }}>View Logs</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page: Optimization Studio ───────────────────────────────────────────────

const studioSteps = [
  { id: 1, label: "Import System",         icon: Download,    status: "done",    desc: "System schema loaded — 13 nodes, 17 edges." },
  { id: 2, label: "AI Analysis",           icon: Brain,       status: "done",    desc: "Pattern recognition complete. 4 bottlenecks found." },
  { id: 3, label: "Digital Twin",          icon: Layers,      status: "done",    desc: "Live replica created. Fidelity: 99.7%." },
  { id: 4, label: "Bottleneck Detection",  icon: Target,      status: "done",    desc: "3 critical, 2 medium severity bottlenecks flagged." },
  { id: 5, label: "Optimization Strategy", icon: Sparkles,    status: "active",  desc: "Evaluating 12 candidate strategies via MCTS..." },
  { id: 6, label: "RL Training",           icon: Rocket,      status: "pending", desc: "PPO agent training — 2,400 episodes planned." },
  { id: 7, label: "Simulation",            icon: FlaskConical,status: "pending", desc: "Monte Carlo simulation across 500 scenarios." },
  { id: 8, label: "Deployment",            icon: Zap,         status: "pending", desc: "Staged rollout with auto-rollback policy." },
];

function PageStudio() {
  const [activeStep, setActiveStep] = useState(5);
  const [progress, setProgress] = useState(62);

  useEffect(() => {
    const id = setInterval(() => setProgress(p => p < 99 ? p + 0.3 : p), 200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Optimization Studio
        </h2>
        <p className="text-sm" style={{ color: C.textSub }}>prod-k8s-cluster-01 · Session #2847 · Started 14 min ago</p>
      </div>

      {/* Pipeline Timeline */}
      <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-0">
          {studioSteps.map((step, i) => {
            const Icon = step.icon;
            const isDone = step.status === "done";
            const isActive = step.status === "active";
            const isPending = step.status === "pending";
            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
                  onClick={() => setActiveStep(step.id)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300`}
                    style={{
                      background: isDone ? C.emeraldDim : isActive ? C.blueDim : C.elevated,
                      borderColor: isDone ? C.emerald : isActive ? C.blue : C.border,
                      boxShadow: isActive ? `0 0 16px ${C.blueGlow}` : undefined,
                    }}>
                    {isDone
                      ? <CheckCircle size={16} style={{ color: C.emerald }} />
                      : <Icon size={15} style={{ color: isActive ? C.blue : C.textMuted }} />}
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight max-w-[70px]"
                    style={{ color: isActive ? C.text : isDone ? C.textSub : C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {step.label}
                  </span>
                </div>
                {i < studioSteps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-1 mb-5"
                    style={{ background: isDone ? C.emerald : C.border }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active step detail */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.blueDim }}>
              <Sparkles size={13} style={{ color: C.blue }} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Step 5 — Optimization Strategy
              </div>
              <div className="text-[11px]" style={{ color: C.textMuted }}>Evaluating candidate strategies</div>
            </div>
            <div className="ml-auto">
              <StatusBadge status="Optimizing" />
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-[11px] mb-1">
              <span style={{ color: C.textMuted }}>Analysis progress</span>
              <span style={{ color: C.blue }} className="font-mono">{progress.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.elevated }}>
              <div className="h-full rounded-full transition-all duration-200"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${C.blue}, #60a5fa)` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Strategies Evaluated", value: "8 / 12", color: C.blue },
              { label: "Best Score", value: "94.2%", color: C.emerald },
              { label: "Est. Savings", value: "$2,240/mo", color: C.amber },
            ].map(m => (
              <div key={m.label} className="rounded-lg p-3" style={{ background: C.elevated }}>
                <div className="text-[10px] mb-1" style={{ color: C.textMuted }}>{m.label}</div>
                <div className="text-base font-bold" style={{ color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="text-sm font-semibold mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            RL Training Preview
          </div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rewardData.slice(0, 25)}>
                <XAxis dataKey="ep" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Line type="monotone" dataKey="reward" stroke={C.blue} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px]" style={{ color: C.textMuted }}>Reward curve · PPO algorithm</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Simulation Lab ─────────────────────────────────────────────────────

const scenarios = [
  { id: "server-fail", label: "Server Failure",  icon: Server,        color: C.red },
  { id: "traffic",     label: "Traffic Spike",   icon: TrendingUp,    color: C.amber },
  { id: "power",       label: "Power Outage",    icon: Zap,           color: C.amber },
  { id: "machine",     label: "Machine Failure", icon: Cog,           color: C.red },
  { id: "cyber",       label: "Cyber Attack",    icon: Shield,        color: C.purple },
  { id: "holiday",     label: "Holiday Rush",    icon: TrendingUp,    color: C.emerald },
];

function PageSimulation() {
  const [active, setActive] = useState("traffic");
  const [running, setRunning] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, [running]);

  const compData = ["Cost", "Latency", "Energy", "Reliability", "Throughput"].map(m => {
    const vals: Record<string, [number, number]> = {
      Cost: [12480, 10240], Latency: [28, 12], Energy: [340, 248], Reliability: [984, 999], Throughput: [8200, 11400],
    };
    const [before, after] = vals[m];
    return { name: m, before, after };
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Simulation Lab
          </h2>
          <p className="text-sm" style={{ color: C.textSub }}>Monte Carlo adversarial scenario simulation</p>
        </div>
        <button onClick={() => setRunning(r => !r)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: running ? C.redDim : C.blueDim, color: running ? C.red : C.blue, border: `1px solid ${running ? C.red : C.blue}22` }}>
          {running ? <><RotateCcw size={13} /> Pause</> : <><Play size={13} /> Resume</>}
        </button>
      </div>

      {/* Scenario selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {scenarios.map(s => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button key={s.id} onClick={() => setActive(s.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
              style={{
                background: isActive ? s.color + "20" : C.elevated,
                color: isActive ? s.color : C.textSub,
                border: `1px solid ${isActive ? s.color + "40" : C.border}`,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
              <Icon size={12} />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Visualization */}
      <div className="rounded-xl overflow-hidden"
        style={{ background: C.surface, border: `1px solid ${C.border}`, height: 220 }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <span className="text-xs font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            System Response Simulation
          </span>
          {running && (
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: C.amber }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.amber }} />
              Simulating...
            </span>
          )}
        </div>
        <div style={{ height: 170, padding: "0 8px 8px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.slice(0, 20).map((d, i) => ({
              t: i, normal: d.efficiency,
              stressed: Math.max(20, d.efficiency - (running ? Math.sin(tick * 0.05 + i * 0.3) * 25 : 20)),
            }))}>
              <defs>
                <linearGradient id="sim-normal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.blue} stopOpacity={0.3} /><stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sim-stressed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.red} stopOpacity={0.3} /><stop offset="100%" stopColor={C.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis hide domain={[0, 110]} />
              <Tooltip contentStyle={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: C.textMuted }} itemStyle={{ color: C.text }} />
              <Area type="monotone" dataKey="normal" stroke={C.blue} strokeWidth={1.5} fill="url(#sim-normal)" name="Baseline" />
              <Area type="monotone" dataKey="stressed" stroke={C.red} strokeWidth={1.5} fill="url(#sim-stressed)" name="Under stress" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Before / After */}
      <div className="rounded-xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <span className="text-xs font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Before vs After Optimization
          </span>
        </div>
        <div className="p-4" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compData} barCategoryGap="35%">
              <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: C.textMuted }} />
              <Bar dataKey="before" fill={C.textMuted} radius={[4, 4, 0, 0]} name="Before" opacity={0.5} />
              <Bar dataKey="after" fill={C.blue} radius={[4, 4, 0, 0]} name="After" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Page: AI Copilot ─────────────────────────────────────────────────────────

const suggestions = [
  "Why is latency increasing on payment-svc?",
  "How can I reduce cloud costs by 20%?",
  "What happens if traffic doubles tomorrow?",
  "Explain today's optimization decision.",
  "Show me the ML training progress.",
];

function PageCopilot() {
  const [messages, setMessages] = useState(chatHistory);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text, chart: false }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages(m => [...m, {
        role: "ai",
        text: "I've analyzed your query using the current system state and optimization knowledge graph. Based on 94% confidence inference from 2.4M training episodes and live telemetry from 6 monitored systems, here's my assessment:\n\n**Root cause identified:** The current pattern matches a known bottleneck archetype (Class 3 — Memory-CPU feedback loop). Recommended action will yield ~18% improvement with 91% estimated confidence.",
        chart: false,
      }]);
      setThinking(false);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1800);
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.blueDim }}>
          <Bot size={14} style={{ color: C.blue }} />
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            OptiVerse AI Copilot
          </div>
          <div className="text-[11px]" style={{ color: C.emerald }}>Online · GPT-4o + RL Policy Engine</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-1.5 rounded-md hover:bg-white/5"><RefreshCw size={13} style={{ color: C.textMuted }} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed`}
              style={{
                background: m.role === "user" ? C.blue : C.surface,
                color: C.text,
                border: m.role === "ai" ? `1px solid ${C.border}` : undefined,
                fontFamily: "'Inter', sans-serif",
              }}>
              {m.role === "ai" && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={11} style={{ color: C.blue }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: C.blue, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Copilot</span>
                </div>
              )}
              <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>
              {m.chart && (
                <div className="mt-3 rounded-lg overflow-hidden" style={{ background: C.elevated }}>
                  <div className="px-3 py-2 text-[10px]" style={{ color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>
                    payment-svc · Latency over 72h
                  </div>
                  <div style={{ height: 100 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.slice(0, 20)}>
                        <Line type="monotone" dataKey="latency" stroke={C.red} strokeWidth={2} dot={false} />
                        <XAxis hide /><YAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-xl px-4 py-3 flex items-center gap-2"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <span className="text-[11px]" style={{ color: C.textMuted }}>Analyzing...</span>
              <span className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1 h-1 rounded-full animate-bounce"
                    style={{ background: C.blue, animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto" style={{ borderTop: `1px solid ${C.border}` }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => send(s)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] transition-all hover:brightness-110"
            style={{ background: C.elevated, color: C.textSub, border: `1px solid ${C.border}`, fontFamily: "'Inter', sans-serif" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: C.elevated, border: `1px solid ${C.borderHover}` }}>
          <Terminal size={14} style={{ color: C.textMuted }} />
          <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600"
            style={{ color: C.text }} placeholder="Ask anything about your systems..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)} />
          <button onClick={() => send(input)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:brightness-110"
            style={{ background: input.trim() ? C.blue : C.border }}>
            <Send size={12} style={{ color: input.trim() ? "#fff" : C.textMuted }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Analytics ─────────────────────────────────────────────────────────

function PageAnalytics() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Analytics</h2>
        <p className="text-sm" style={{ color: C.textSub }}>30-day performance intelligence · All systems</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Savings trend */}
        <div className="col-span-2 rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="text-xs font-semibold mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Monthly Cost Savings Trend
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="savings-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.emerald} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="savings" stroke={C.emerald} strokeWidth={2} fill="url(#savings-grad)" name="Savings ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="text-xs font-semibold mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            System Health Radar
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: C.textMuted, fontSize: 10 }} />
                <Radar dataKey="v" stroke={C.blue} fill={C.blue} fillOpacity={0.2} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latency + Efficiency */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "P99 Latency (ms)", key: "latency", color: C.amber },
          { label: "System Efficiency (%)", key: "efficiency", color: C.blue },
        ].map(c => (
          <div key={c.key} className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="text-xs font-semibold mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.label}</div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={2} dot={false} name={c.label} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* RL Training charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="text-xs font-semibold mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            RL Reward Curve · PPO Agent
          </div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rewardData}>
                <defs>
                  <linearGradient id="reward-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="ep" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="reward" stroke={C.blue} strokeWidth={2} fill="url(#reward-grad)" name="Reward" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="text-xs font-semibold mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Policy Loss Curve
          </div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossData}>
                <XAxis dataKey="ep" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="loss" stroke={C.amber} strokeWidth={2} dot={false} name="Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Marketplace ────────────────────────────────────────────────────────

const catColors: Record<string, string> = {
  Cloud: C.blue, Manufacturing: C.amber, Traffic: C.emerald,
  Healthcare: C.red, Energy: C.amber, Finance: C.purple, IoT: C.blue, Robotics: C.purple,
};

function PageMarketplace() {
  const [search, setSearch] = useState("");
  const filtered = plugins.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.cat.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Optimization Marketplace
          </h2>
          <p className="text-sm" style={{ color: C.textSub }}>Deploy pre-trained optimization agents for any domain</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
          <Search size={13} style={{ color: C.textMuted }} />
          <input className="bg-transparent text-xs outline-none w-48 placeholder:text-gray-600"
            style={{ color: C.text }} placeholder="Search plugins..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(p => {
          const color = catColors[p.cat] ?? C.blue;
          return (
            <div key={p.name} className="rounded-xl p-4 flex flex-col gap-3 transition-all hover:translate-y-[-2px] cursor-pointer"
              style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: color + "18", border: `1px solid ${color}30` }}>
                    <Package size={16} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1"
                      style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {p.name}
                      {p.verified && <CheckCircle size={11} style={{ color: C.blue }} />}
                    </div>
                    <div className="text-[10px]" style={{ color: C.textMuted }}>by {p.author}</div>
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: color + "18", color }}>
                  {p.cat}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: C.textSub }}>{p.desc}</p>
              <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1" style={{ color: C.amber }}>
                    <Star size={10} fill={C.amber} /> {p.rating}
                  </span>
                  <span style={{ color: C.textMuted }}>{p.dl} installs</span>
                  <span style={{ color: C.textMuted }}>v{p.ver}</span>
                </div>
                <button className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110"
                  style={{ background: C.blue, color: "#fff" }}>Install</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page: Reports ────────────────────────────────────────────────────────────

function PageReports() {
  const reports = [
    { title: "Executive Summary", sub: "High-level KPIs and ROI for stakeholders", icon: BarChart2, date: "Jul 5, 2026", status: "Ready" },
    { title: "Technical Report", sub: "Detailed system analysis with bottleneck breakdown", icon: Code, date: "Jul 5, 2026", status: "Ready" },
    { title: "Optimization Timeline", sub: "Chronological optimization history with impact", icon: GitMerge, date: "Jul 4, 2026", status: "Ready" },
    { title: "Cost Savings Report", sub: "Detailed financial impact across all systems", icon: DollarSign, date: "Jul 3, 2026", status: "Ready" },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reports</h2>
          <p className="text-sm" style={{ color: C.textSub }}>Enterprise-grade report generation and export</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: C.blue, color: "#fff" }}>
          <Plus size={14} /> New Report
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {reports.map(r => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.blueDim }}>
                  <Icon size={16} style={{ color: C.blue }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.title}</div>
                  <div className="text-[11px]" style={{ color: C.textMuted }}>{r.sub}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: C.textMuted }}>{r.date}</span>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all hover:brightness-110"
                    style={{ background: C.blueDim, color: C.blue }}>
                    <Eye size={11} /> Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all"
                    style={{ background: C.elevated, color: C.textSub, border: `1px solid ${C.border}` }}>
                    <Download size={11} /> Export
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page: Settings ───────────────────────────────────────────────────────────

function PageSettings() {
  const tabs = ["Workspace", "Security", "AI Preferences", "Integrations", "Billing"];
  const [tab, setTab] = useState("Workspace");
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <h2 className="text-xl font-bold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Settings</h2>
      <div className="flex items-center gap-1" style={{ borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 text-xs font-medium transition-all"
            style={{
              color: tab === t ? C.blue : C.textMuted,
              borderBottom: tab === t ? `2px solid ${C.blue}` : "2px solid transparent",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>{t}</button>
        ))}
      </div>
      <div className="rounded-xl p-5 space-y-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        {[
          { label: "Workspace Name", value: "ACME Corp — Production", type: "text" },
          { label: "Organization ID", value: "org_9f3k2m1a", type: "mono" },
          { label: "Region", value: "us-east-1", type: "text" },
          { label: "AI Model Version", value: "OptiVerse-4.2.1 (Latest)", type: "text" },
        ].map(f => (
          <div key={f.label} className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div className="text-xs font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.label}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: C.elevated, color: f.type === "mono" ? C.blue : C.textSub,
                  fontFamily: f.type === "mono" ? "'JetBrains Mono', monospace" : "'Inter', sans-serif" }}>
                {f.value}
              </span>
              <button className="text-[11px] px-2.5 py-1.5 rounded-lg transition-all"
                style={{ background: C.elevated, color: C.textMuted, border: `1px solid ${C.border}` }}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page: Projects ───────────────────────────────────────────────────────────

function PageProjects() {
  const projects = [
    { name: "K8s Cost Reduction Q3", status: "Optimizing", progress: 74, systems: 3, savings: "$8.2K/mo", updated: "2 min ago" },
    { name: "Payment Latency Fix", status: "Critical", progress: 18, systems: 1, savings: "$480/mo", updated: "12 min ago" },
    { name: "ML Infra Right-sizing", status: "Optimized", progress: 100, systems: 2, savings: "$4.3K/mo", updated: "1 hr ago" },
    { name: "CDN Global Optimization", status: "Optimized", progress: 100, systems: 1, savings: "$890/mo", updated: "3 hr ago" },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Projects</h2>
          <p className="text-sm" style={{ color: C.textSub }}>Active optimization projects across all environments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: C.blue, color: "#fff" }}>
          <Plus size={14} /> New Project
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.name} className="rounded-xl p-4 space-y-3 cursor-pointer transition-all hover:translate-y-[-2px]"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</div>
                <div className="text-[11px]" style={{ color: C.textMuted }}>{p.systems} system{p.systems > 1 ? "s" : ""} · {p.updated}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px]" style={{ color: C.textMuted }}>Progress</span>
                <span className="text-xs font-mono" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{p.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.elevated }}>
                <div className="h-full rounded-full"
                  style={{ width: `${p.progress}%`, background: p.progress === 100 ? C.emerald : C.blue }} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold" style={{ color: C.emerald }}>↑ {p.savings}</span>
              <button className="text-[11px] flex items-center gap-1" style={{ color: C.blue }}>
                View <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard",   label: "Dashboard",            icon: LayoutDashboard },
  { id: "projects",    label: "Projects",             icon: FolderOpen },
  { id: "studio",      label: "Optimization Studio",  icon: Zap },
  { id: "twin",        label: "Digital Twin",         icon: Layers },
  { id: "simulation",  label: "Simulation Lab",       icon: FlaskConical },
  { id: "copilot",     label: "AI Copilot",           icon: Bot },
  { id: "marketplace", label: "Marketplace",          icon: ShoppingBag },
  { id: "reports",     label: "Reports",              icon: FileText },
  { id: "analytics",   label: "Analytics",            icon: BarChart3 },
  { id: "settings",    label: "Settings",             icon: Settings, bottom: true },
];

function Sidebar({ active, onNav, collapsed }: { active: string; onNav: (id: string) => void; collapsed: boolean }) {
  const mainItems = navItems.filter(n => !n.bottom);
  const bottomItems = navItems.filter(n => n.bottom);

  return (
    <div className="flex flex-col h-full" style={{ background: C.surface, borderRight: `1px solid ${C.border}`, width: collapsed ? 52 : 216, transition: "width .25s ease", flexShrink: 0 }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4" style={{ borderBottom: `1px solid ${C.border}`, minHeight: 52 }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${C.blue}, #6366f1)`, boxShadow: `0 0 12px ${C.blueGlow}` }}>
          <Zap size={14} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-xs font-extrabold tracking-tight leading-none"
              style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              OptiVerse
            </div>
            <div className="text-[9px] uppercase tracking-widest" style={{ color: C.textMuted }}>OS v4.2</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-1.5">
        {mainItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all group"
              style={{
                background: isActive ? C.blueDim : "transparent",
                color: isActive ? C.blue : C.textSub,
                borderLeft: isActive ? `2px solid ${C.blue}` : "2px solid transparent",
              }}>
              <Icon size={14} style={{ flexShrink: 0, color: isActive ? C.blue : C.textMuted }} className="transition-colors group-hover:text-slate-300" />
              {!collapsed && (
                <span className="text-xs font-medium truncate"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="px-1.5 py-2 space-y-0.5" style={{ borderTop: `1px solid ${C.border}` }}>
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all"
              style={{
                background: isActive ? C.blueDim : "transparent",
                color: isActive ? C.blue : C.textSub,
              }}>
              <Icon size={14} style={{ flexShrink: 0, color: isActive ? C.blue : C.textMuted }} />
              {!collapsed && <span className="text-xs font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.label}</span>}
            </button>
          );
        })}
        {/* User */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-all">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
            style={{ background: `linear-gradient(135deg, ${C.blue}, #6366f1)`, color: "#fff" }}>
            AK
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alex Kim</div>
              <div className="text-[10px] truncate" style={{ color: C.textMuted }}>Admin · ACME Corp</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({ onToggleSidebar, onToggleAI, aiOpen }: {
  onToggleSidebar: () => void; onToggleAI: () => void; aiOpen: boolean;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const notifications = [
    { text: "AI completed optimization on prod-k8s-cluster-01", time: "2m ago", color: C.emerald },
    { text: "High CPU detected on ml-training-infra (88%)", time: "14m ago", color: C.amber },
    { text: "New plugin available: IoT Edge Optimizer v2.0", time: "1h ago", color: C.blue },
    { text: "Simulation finished: Traffic Spike scenario", time: "2h ago", color: C.purple },
  ];

  return (
    <div className="h-12 flex items-center gap-3 px-4 relative flex-shrink-0"
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
      <button onClick={onToggleSidebar} className="p-1.5 rounded-md hover:bg-white/5 transition-colors flex-shrink-0">
        <ChevronLeft size={14} style={{ color: C.textMuted }} />
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-xs"
        style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
        <Search size={12} style={{ color: C.textMuted }} />
        <span className="text-xs" style={{ color: C.textMuted }}>Search systems, insights...</span>
        <span className="ml-auto flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: C.border, color: C.textMuted }}>
          <Command size={9} /> K
        </span>
      </div>

      <div className="flex-1" />

      {/* Status */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
        style={{ background: C.emeraldDim }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.emerald }} />
        <span style={{ color: C.emerald, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>All Systems Optimal</span>
      </div>

      <div className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg"
        style={{ background: C.elevated, color: C.textSub, border: `1px solid ${C.border}` }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
        Health: 98.7%
      </div>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => setNotifOpen(o => !o)}
          className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell size={14} style={{ color: notifOpen ? C.blue : C.textMuted }} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full border-2"
            style={{ background: C.red, borderColor: C.surface }} />
        </button>
        {notifOpen && (
          <div className="absolute top-full right-0 mt-1 w-80 rounded-xl overflow-hidden z-50"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="text-xs font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Notifications
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: C.redDim, color: C.red }}>4 new</span>
            </div>
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] cursor-pointer"
                style={{ borderBottom: i < notifications.length - 1 ? `1px solid ${C.border}` : undefined }}>
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />
                <div>
                  <div className="text-[11px] leading-relaxed" style={{ color: C.text }}>{n.text}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Panel toggle */}
      <button onClick={onToggleAI}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: aiOpen ? C.blueDim : C.elevated,
          color: aiOpen ? C.blue : C.textSub,
          border: `1px solid ${aiOpen ? C.blue + "30" : C.border}`,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
        <Sparkles size={12} />
        {aiOpen ? "Hide AI" : "AI Panel"}
      </button>
    </div>
  );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────

function StatusBar() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { label: "CPU", value: "34%", color: C.emerald },
    { label: "MEM", value: "61%", color: C.blue },
    { label: "NET", value: "2.4 Gb/s", color: C.purple },
    { label: "Latency", value: "12 ms", color: C.emerald },
    { label: "Events/s", value: "342", color: C.amber },
  ];

  return (
    <div className="h-7 flex items-center gap-4 px-4 flex-shrink-0 text-[11px]"
      style={{ background: "#0a0b0e", borderTop: `1px solid ${C.border}` }}>
      <span className="flex items-center gap-1.5" style={{ color: C.emerald }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.emerald }} />
        NOMINAL
      </span>
      <span style={{ color: C.border }}>|</span>
      {stats.map(s => (
        <span key={s.label} className="flex items-center gap-1">
          <span style={{ color: C.textMuted }}>{s.label}:</span>
          <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</span>
        </span>
      ))}
      <div className="flex-1" />
      <span style={{ color: C.textMuted }}>prod-k8s-cluster-01</span>
      <span style={{ color: C.border }}>|</span>
      <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
    </div>
  );
}

// ─── Right AI Panel ───────────────────────────────────────────────────────────

function RightAIPanel() {
  const items = [
    { title: "Cost optimization ready", sub: "18% reduction available — 3 instances to right-size", color: C.emerald, icon: DollarSign },
    { title: "Anomaly detected", sub: "payment-svc memory leak pattern — 97% confidence", color: C.red, icon: AlertCircle },
    { title: "Training complete", sub: "PPO agent reached 850 reward. Ready for deployment.", color: C.blue, icon: Brain },
    { title: "Simulation finished", sub: "Traffic spike scenario: 99.91% reliability achieved", color: C.purple, icon: FlaskConical },
  ];
  return (
    <div className="w-64 flex flex-col overflow-hidden flex-shrink-0" style={{ background: C.surface, borderLeft: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <Sparkles size={13} style={{ color: C.blue }} />
        <span className="text-xs font-semibold" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          AI Assistant
        </span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.emerald }} />
      </div>
      <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: C.border }}>
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="px-4 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: item.color + "18" }}>
                  <Icon size={11} style={{ color: item.color }} />
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5"
                    style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: C.textSub }}>{item.sub}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: C.elevated, border: `1px solid ${C.border}` }}>
          <MessageSquare size={12} style={{ color: C.textMuted }} />
          <span className="text-[11px]" style={{ color: C.textMuted }}>Ask AI anything...</span>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

const pageMap: Record<string, React.FC> = {
  dashboard:   PageDashboard,
  projects:    PageProjects,
  studio:      PageStudio,
  twin:        PageDigitalTwin,
  simulation:  PageSimulation,
  copilot:     PageCopilot,
  marketplace: PageMarketplace,
  reports:     PageReports,
  analytics:   PageAnalytics,
  settings:    PageSettings,
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);

  const PageComponent = pageMap[page] ?? PageDashboard;

  return (
    <div className="size-full flex flex-col overflow-hidden" style={{ background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <TopBar
        onToggleSidebar={() => setCollapsed(c => !c)}
        onToggleAI={() => setAiOpen(o => !o)}
        aiOpen={aiOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={page} onNav={setPage} collapsed={collapsed} />
        <div className="flex-1 flex overflow-hidden">
          <PageComponent />
        </div>
        {aiOpen && <RightAIPanel />}
      </div>
      <StatusBar />
    </div>
  );
}
