import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Hexagon, 
  Search, 
  ChevronRight, 
  Copy, 
  Check, 
  Github, 
  Menu, 
  X,
  Activity,
  Shield,
  Zap,
  Cpu,
  BarChart3,
  Network,
  Bell,
  Clock,
  Layers,
  Code,
  Terminal,
  AlertCircle,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import hljs from 'highlight.js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Types & Mock Content ---

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAVIGATION: NavSection[] = [
  {
    title: 'GETTING STARTED',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'quickstart', label: 'Quickstart (5 min)' },
      { id: 'concepts', label: 'Core Concepts' },
      { id: 'environments', label: 'Environments' },
    ]
  },
  {
    title: 'AUTHENTICATION',
    items: [
      { id: 'authentication', label: 'API Keys' },
      { id: 'oauth', label: 'OAuth 2.0' },
      { id: 'webhook-signatures', label: 'Webhook Signatures' },
      { id: 'scopes', label: 'Scopes & Permissions' },
    ]
  },
  {
    title: 'API REFERENCE',
    items: [
      { id: 'dashboard', label: 'Dashboard APIs', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'incidents', label: 'Incident APIs', icon: <AlertCircle className="w-4 h-4" /> },
      { id: 'revenue', label: 'Revenue APIs', icon: <Shield className="w-4 h-4" /> },
      { id: 'ai', label: 'AI & Prediction APIs', icon: <Cpu className="w-4 h-4" /> },
      { id: 'partners', label: 'Partner APIs', icon: <Network className="w-4 h-4" /> },
      { id: 'webhooks', label: 'Webhooks', icon: <Bell className="w-4 h-4" /> },
      { id: 'realtime', label: 'Real-Time (WebSocket)', icon: <Zap className="w-4 h-4" /> },
      { id: 'flows', label: 'Fintech Flows', icon: <Activity className="w-4 h-4" /> },
    ]
  },
  {
    title: 'PLATFORM',
    items: [
      { id: 'rate-limits', label: 'Rate Limits' },
      { id: 'idempotency', label: 'Idempotency' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'sandbox', label: 'Sandbox & Testing' },
    ]
  },
  {
    title: 'RESOURCES',
    items: [
      { id: 'errors', label: 'Errors & Status Codes' },
      { id: 'models', label: 'Data Models' },
      { id: 'compliance', label: 'Compliance' },
      { id: 'changelog', label: 'Changelog' },
    ]
  }
];

// --- Sub-components ---

const CodeBlock = ({ code, language = 'json' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const highlightedCode = React.useMemo(() => {
    try {
      const result = hljs.highlight(code.trim(), { language: language === 'json' ? 'json' : language });
      return result.value;
    } catch (e) {
      return code.trim();
    }
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-4">
      <div className="absolute top-0 right-0 p-2 z-10">
        <button 
          onClick={copyToClipboard}
          className="p-1.5 rounded-md bg-text-primary/5 border border-text-primary/10 text-text-primary/50 hover:text-text-primary hover:bg-text-primary/10 transition-all font-sans"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-mint-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="!bg-navy-900 border border-text-primary/5 rounded-xl p-4 overflow-x-auto text-sm font-mono scrollbar-thin scrollbar-thumb-white/10">
        <code 
          className={cn("hljs", language)}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
};

const EndpointModule = ({ 
  method, 
  path, 
  description, 
  request, 
  response, 
  example 
}: { 
  method: 'GET' | 'POST'; 
  path: string; 
  description: string; 
  request?: string; 
  response?: string; 
  example?: string;
}) => (
  <div className="py-8 border-b border-text-primary/5 last:border-0">
    <div className="flex items-center gap-3 mb-4">
      <span className={cn(
        "endpoint-badge",
        method === 'GET' ? "badge-get" : "badge-post"
      )}>
        {method}
      </span>
      <code className="text-text-primary font-mono text-sm font-semibold tracking-tight">{path}</code>
    </div>
    
    <p className="text-text-secondary mb-6 leading-relaxed">
      {description}
    </p>

    {request && (
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 mb-3 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" /> Request Body
        </h4>
        <CodeBlock code={request} />
      </div>
    )}

    {response && (
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 mb-3 flex items-center gap-2">
          <Code className="w-3.5 h-3.5" /> Response Body
        </h4>
        <CodeBlock code={response} />
      </div>
    )}

    {example && (
      <div className="pl-4 border-l-2 border-indigo-accent/30 italic text-text-secondary/80 text-sm">
        {example}
      </div>
    )}
  </div>
);

const Callout = ({ type, children, title }: { type: 'info' | 'warning' | 'danger'; children: React.ReactNode; title?: string }) => (
  <div className={cn("callout", `callout-${type}`)}>
    {title && <div className="font-bold text-xs uppercase tracking-widest mb-1">{title}</div>}
    <div className="text-sm leading-relaxed">{children}</div>
  </div>
);

// --- Page Sections ---

const OverviewSection = ({ onNavigate }: { onNavigate: (id: string) => void }) => (
  <section className="space-y-12">
    <header className="space-y-4">
      <div className="text-[10px] font-bold text-indigo-accent uppercase tracking-[0.2em] mb-2">Introduction</div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-2 leading-tight">
        Financial Infrastructure Observability.<br />
        <span className="text-indigo-accent">Built for India.</span>
      </h1>
      <p className="text-xl text-text-secondary max-w-3xl leading-relaxed">
        Conduit monitors your UPI, SIP, and AA payment rails in real time — detects failures before users notice them, quantifies revenue at risk in rupees, and triggers safe auto-remediation playbooks automatically.
      </p>
      
      <div className="flex border-y border-text-primary/5 py-8 mt-8">
        {[
          { label: 'Avg Detection Latency', val: '< 800ms' },
          { label: 'Revenue Protected (Q2)', val: '₹2.4B+' },
          { label: 'Platform Uptime SLA', val: '99.97%' },
        ].map((stat, i) => (
          <div key={i} className="flex-1 text-center border-r last:border-0 border-text-primary/5">
            <div className="text-2xl font-mono font-bold text-text-primary mb-1">{stat.val}</div>
            <div className="text-[10px] uppercase tracking-widest text-text-secondary/50">{stat.label}</div>
          </div>
        ))}
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { title: 'Real-Time Health', desc: 'Monitor all payment rails in one health score.', icon: <Zap />, id: 'dashboard' },
        { title: 'Incident Detection', desc: 'P1/P2 incident lifecycle with auto-fix playbooks.', icon: <AlertCircle />, id: 'incidents' },
        { title: 'Revenue Shield', desc: 'Quantify money at risk and revenue recovered.', icon: <Shield />, id: 'revenue' },
        { title: 'AI Predictions', desc: 'LSTM-powered forecasts 12–30 min ahead.', icon: <Cpu />, id: 'ai' },
      ].map((card, i) => (
        <button 
          key={i}
          onClick={() => onNavigate(card.id)}
          className="text-left p-6 rounded-2xl bg-navy-900 border border-text-primary/5 hover:border-indigo-accent/50 hover:bg-navy-800 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-accent/10 flex items-center justify-center text-indigo-accent mb-4 group-hover:scale-110 transition-transform">
            {card.icon}
          </div>
          <h3 className="text-text-primary font-bold mb-1 flex items-center gap-2">
            {card.title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-accent" />
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">{card.desc}</p>
        </button>
      ))}
    </div>

    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-text-primary border-b border-text-primary/5 pb-4">Key Concepts</h2>
      
      <div className="space-y-10">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-accent" /> Health Score
          </h3>
          <p className="text-text-secondary leading-relaxed">
            A single 0–100 composite metric derived from weighted combination of: UPI success rate (35% weight), AA consent conversion (25%), SIP mandate execution rate (20%), latency percentiles across all rails (15%), and partner availability (5%). Score is recalculated every 30 seconds from a rolling 5-minute window. Score ≥ 90 = green (healthy), 70–89 = yellow (degraded), &lt; 70 = red (critical).
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-accent" /> Revenue Shield
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Conduit's proprietary mechanism for tracking money protected vs lost in real time. Every transaction that fails is tagged with an error class, partner, rail, and estimated rupee impact. When auto-fix triggers a reroute or rate limit, Conduit tracks which subsequent transactions succeed that would have failed — the delta is "protected revenue."
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-accent" /> LSTMWatch
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Conduit's machine learning subsystem using Long Short-Term Memory (LSTM) neural networks trained on 18 months of payment telemetry across 40+ fintech clients. Predicts failures 12–30 minutes ahead with confidence scores.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const ConceptsSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <div className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-[0.2em]">Essentials</div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Core Concepts</h1>
      <p className="text-lg text-text-secondary">A deep dive into the Conduit data model and architecture.</p>
    </header>

    <div className="space-y-10">
      <div className="p-8 rounded-2xl bg-navy-900 border border-text-primary/5">
        <h3 className="text-xl font-bold text-text-primary mb-4">1. The Conduit Data Model</h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          Everything in Conduit flows from raw transaction events to outcome tracking. Our architecture ensures that every rupee at risk is categorized and monitored.
        </p>
        <div className="bg-text-inverse/40 p-4 rounded-xl border border-text-primary/5 font-mono text-xs text-indigo-accent/80 leading-relaxed overflow-x-auto whitespace-pre">
{`TRANSACTION EVENTS (Push/Pull)
       ↓
    METRICS (Scrape & Aggregate)
       ↓
ANOMALY DETECTION (Thresholds & ML)
       ↓
INCIDENTS (Lifecycle Management)
       ↓
  AUTO-FIX (Remediation Actions)
       ↓
OUTCOME TRACKING (Protected Revenue)`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5">
          <h4 className="text-text-primary font-bold mb-3">Metric Collection</h4>
          <p className="text-sm text-text-secondary leading-relaxed">
            Conduit uses a push model via <code className="text-indigo-accent">/v1/flows</code> and a pull model for infrastructure metrics. 30-second scrape interval with 90-day retention.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5 border-l-4 border-l-red-danger">
          <h4 className="text-text-primary font-bold mb-3">Severity: P1 vs P2</h4>
          <p className="text-sm text-text-secondary leading-relaxed">
            P1 = Customer Impacting (e.g. Failure rate &gt; 3%).<br />
            P2 = Elevated Risk (e.g. p95 latency &gt; 800ms).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary">Partner Graph & Blast Radius</h3>
        <p className="text-text-secondary leading-relaxed">
          Directed dependency map: <span className="text-text-primary italic">Rail → Aggregator → Bank → Merchant</span>. Nodes turn red when health drops, showing immediate downstream blast radius calculated as sum of AUM_at_risk.
        </p>
      </div>
    </div>
  </section>
);

const QuickstartSection = () => (
  <section className="space-y-12">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Quickstart</h1>
      <p className="text-text-secondary">Get up and running with Conduit in under 5 minutes.</p>
    </div>

    <div className="space-y-12">
      {[
        { 
          step: 1, 
          title: 'Get API keys', 
          desc: 'Generate your `sk_live_...` keys from the Conduit developer dashboard.',
          code: 'Authorization: Bearer sk_live_51P8yU8... '
        },
        { 
          step: 2, 
          title: 'Create workspace', 
          desc: 'Initialize a project context for your production environment.',
          code: 'POST /v1/workspaces\n{\n  "name": "Production Main",\n  "environment": "production"\n}'
        },
        { 
          step: 3, 
          title: 'Fetch dashboard summary', 
          desc: 'Get an overview of your current health state.',
          code: 'GET /v1/dashboard/summary\n\n{\n  "health_score": 98,\n  "active_incidents": 0\n}'
        },
        { 
          step: 4, 
          title: 'Register Webhooks', 
          desc: 'Stay informed about critical rail failures.',
          code: 'POST /v1/webhooks\n{\n  "url": "https://hooks.myapp.com/conduit",\n  "events": ["incident.triggered"]\n}'
        },
        { 
          step: 5, 
          title: 'Real-time WebSocket', 
          desc: 'Establish a streaming connection for sub-second updates.',
          code: 'wss://api.conduit.fin/v1/realtime'
        },
        { 
          step: 6, 
          title: 'Trigger your first Auto-fix', 
          desc: 'Remediate a test rail failure to verify connectivity.',
          code: 'POST /v1/incidents/inc_test_123/auto-fix'
        }
      ].map((step, i) => (
        <div key={i} className="relative pl-12 group">
          <div className="absolute left-0 top-0 w-8 h-8 rounded-full border border-indigo-accent/30 flex items-center justify-center text-xs font-bold text-indigo-accent bg-indigo-accent/5 group-hover:bg-indigo-accent group-hover:text-text-primary transition-all">
            {step.step}
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">{step.title}</h3>
          <p className="text-text-secondary mb-4">{step.desc}</p>
          <CodeBlock code={step.code} />
        </div>
      ))}
    </div>
  </section>
);

const AuthSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Authentication</h1>
      <p className="text-text-secondary">Conduit uses API keys and OAuth2 to authenticate requests.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Secret API Key', desc: 'Used for server-to-server communication.' },
        { title: 'OAuth (Partners)', desc: 'Grant delegated access to service providers.' },
        { title: 'Webhook HMAC', desc: 'Securely verify event payloads from Conduit.' },
      ].map((box, i) => (
        <div key={i} className="p-5 rounded-xl bg-navy-900 border border-text-primary/5">
          <h4 className="text-text-primary font-bold mb-2">{box.title}</h4>
          <p className="text-text-secondary text-sm leading-relaxed">{box.desc}</p>
        </div>
      ))}
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-text-primary/10 text-text-secondary uppercase text-[10px] tracking-widest">
            <th className="py-4 font-bold">Header</th>
            <th className="py-4 font-bold">Required</th>
            <th className="py-4 font-bold">Example</th>
          </tr>
        </thead>
        <tbody className="text-text-primary/90">
          <tr className="border-b border-text-primary/5 bg-text-primary/0 hover:bg-text-primary/[0.02] transition-colors">
            <td className="py-4 pr-4 font-mono">Authorization</td>
            <td className="py-4 pr-4">Yes</td>
            <td className="py-4">Bearer sk_live_...</td>
          </tr>
          <tr className="border-b border-text-primary/5 bg-text-primary/0 hover:bg-text-primary/[0.02] transition-colors">
            <td className="py-4 pr-4 font-mono">Idempotency-Key</td>
            <td className="py-4 pr-4">POSTs</td>
            <td className="py-4">uuid-v4</td>
          </tr>
          <tr className="border-b border-text-primary/5 bg-text-primary/0 hover:bg-text-primary/[0.02] transition-colors">
            <td className="py-4 pr-4 font-mono">Conduit-Request-Id</td>
            <td className="py-4 pr-4">Optional</td>
            <td className="py-4">client-req-id</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 mb-4">Supported Scopes</h3>
      <div className="flex flex-wrap gap-2">
        {['incidents:read', 'autofix:execute', 'revenue:read', 'partners:read'].map(scope => (
          <code key={scope} className="px-2 py-1 bg-text-primary/5 border border-text-primary/10 rounded text-xs text-indigo-accent">
            {scope}
          </code>
        ))}
      </div>
    </div>
  </section>
);

const DashboardSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Dashboard APIs</h1>
      <p className="text-text-secondary">Aggregation endpoints for quick high-level health analysis.</p>
    </div>

    <EndpointModule 
      method="GET"
      path="/v1/dashboard/summary"
      description="Returns a single-call vital signs snapshot of your entire payment infrastructure. Aggregates data from all configured rails and returns a composite health score, total AUM at risk, active incident count, and key metric snapshots per rail."
      response={`{
  "request_id": "req_01HZXKAM2C9T7YB3",
  "data": {
    "health_score": 91,
    "health_status": "healthy",
    "aum_at_risk": 820000000,
    "active_incidents": 1,
    "active_incidents_p1": 0,
    "active_incidents_p2": 1,
    "rails": {
      "upi": {
        "health": 93,
        "status": "healthy",
        "p95_latency_ms": 420,
        "failure_rate": 0.0089,
        "tx_per_minute": 18400
      },
      "aa": {
        "health": 88,
        "status": "degraded",
        "consent_success_rate": 0.941,
        "fetch_success_rate": 0.962,
        "p95_latency_ms": 1240
      }
    },
    "timestamp": "2026-05-01T02:20:10Z"
  }
}`}
      example="Health score logic: ≥90 green (healthy), 70-89 yellow (degraded), <70 red (critical)."
    />
  </section>
);

const IncidentSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Incident APIs</h1>
      <p className="text-text-secondary">Detect, query, and remediate financial rail anomalies. Conduit provides a structured P1/P2 severity model with automated escalation.</p>
    </div>

    <EndpointModule 
      method="GET"
      path="/v1/incidents/active"
      description="Retrieve all currently unresolved incidents. Designed to be polled by NOC dashboards and alerting systems."
      response={`{
  "request_id": "req_01HZXL02TQ",
  "data": [{
    "id": "inc_7F3k2",
    "severity": "P1",
    "status": "ACTIVE",
    "title": "UPI p95 latency spike (HDFC Bank)",
    "rail": "upi",
    "started_at": "2026-05-01T01:58:10Z",
    "aum_at_risk": 410000000,
    "revenue_impact": {
      "rupees_lost_estimate": 125000,
      "rupees_protected": 350000
    }
  }]
}`}
    />

    <EndpointModule 
      method="POST"
      path="/v1/incidents/{id}/auto-fix"
      description="Trigger a machine-driven remediation strategy. Strategies include rate_limit_partner, preemptive_reroute, and circuit_break."
      request={`{
  "strategy": "rate_limit_partner",
  "parameters": { "partner_id": "bank_hdfc", "max_rps": 120 },
  "reason": "Elevated P95 latency (>1800ms) causing timeout spikes"
}`}
      response={`{
  "data": {
    "auto_fix_id": "fix_8pQ1",
    "status": "TRIGGERED",
    "eta_minutes": 5
  }
}`}
    />
    
    <Callout type="danger" title="Approval required">
      P1 incidents require an explicit <code className="text-text-primary">autofix:approve</code> scope for non-dry-run executions.
    </Callout>
  </section>
);

const RevenueSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Revenue APIs</h1>
      <p className="text-text-secondary">Monetize your observability by identifying leaks and calculating protection value.</p>
    </div>

    <EndpointModule 
      method="GET"
      path="/v1/revenue/shield"
      description="Aggregated view of protected vs lost revenue due to successful/failed auto-remediation."
      response={`{
  "request_id": "req_01HZXL8R7A",
  "data": {
    "rupees_protected": 2450000,
    "rupees_lost": 610000,
    "rupees_at_risk": 1840000,
    "time_window": "last_24h",
    "protection_rate": 0.8006,
    "top_drivers": [
      {
        "driver": "UPI latency spike (HDFC)",
        "rail": "upi",
        "partner": "bank_hdfc",
        "rupees_lost": 320000,
        "incidents": ["inc_7F3k2"],
        "auto_fix_saved": 180000
      }
    ]
  }
}`}
    />

    <EndpointModule 
      method="GET"
      path="/v1/revenue/leakage-table"
      description="Granular breakdown of revenue loss per rail, partner, and error class."
      response={`{
  "data": {
    "rows": [
      {
        "rail": "upi",
        "partner": "bank_hdfc",
        "error_class": "TIMEOUT",
        "failure_rate": 0.0342,
        "rupees_lost_estimate": 210000
      }
    ]
  }
}`}
    />
  </section>
);

const AISection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">AI & Prediction APIs</h1>
      <p className="text-text-secondary">LSTM-based anomaly prediction and root-cause analysis.</p>
    </div>

    <EndpointModule 
      method="GET"
      path="/v1/ai/lstmwatch/feed"
      description="Streaming feed of predictive indicators for potential upcoming rail failures."
      response={`{
  "anomaly_detected": true,
  "confidence": 0.92,
  "predicted_failure": "Bank HDFC UPI timeout spree in 5-10min",
  "recommended_action": "Early fail-over to ICICI"
}`}
    />

    <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5 space-y-4">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-secondary/50">
        <span>Confidence Meter</span>
        <span className="text-indigo-accent">92%</span>
      </div>
      <div className="h-3 w-full bg-text-primary/5 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-accent rounded-full w-[92%]"></div>
      </div>
      <p className="text-sm text-text-secondary">The LSTM engine is 92% confident that a failure event is imminent based on current p99 trends.</p>
    </div>
  </section>
);

const PartnersSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Partner APIs</h1>
      <p className="text-text-secondary">Analyze the graph of entities facilitating your financial transactions.</p>
    </div>

    <EndpointModule 
      method="GET"
      path="/v1/partners/graph"
      description="Returns a node-edge representation of your fintech ecosystem health. Nodes have health status (green/yellow/red), and edges show traffic flow and relationships."
      response={`{
  "data": {
    "nodes": [
      { "id": "rail_upi", "type": "Rail", "status": "yellow", "health_score": 78 },
      { "id": "bank_hdfc", "type": "Bank", "status": "red", "health_score": 42 }
    ],
    "edges": [
      { "from": "rail_upi", "to": "bank_hdfc", "relationship": "routes_to", "traffic_share": 0.38 }
    ],
    "blast_radius": {
      "bank_hdfc_failure_impact": {
        "rails_affected": ["upi", "aa"],
        "aum_at_risk": 820000000
      }
    }
  }
}`}
    />
  </section>
);

const WebhookSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Webhooks</h1>
      <p className="text-text-secondary">Push notifications for incident events.</p>
    </div>

    <EndpointModule 
      method="POST"
      path="/v1/webhooks/incidents"
      description="Register a new webhook listener."
      request={`{
  "url": "https://myapp.com/api/conduit-hook",
  "secret": "whsec_..."
}`}
    />

    <div className="space-y-6">
      <h3 className="text-lg font-bold text-text-primary">Event Examples</h3>
      <CodeBlock language="json" code={`// incident_triggered
{
  "type": "incident.triggered",
  "data": { "id": "inc_7F3k2", "severity": "P1" }
}`} />
      <CodeBlock language="json" code={`// auto_fix_triggered
{
  "type": "autofix.triggered",
  "data": { "id": "fix_8pQ1", "strategy": "rate_limit" }
}`} />
      <CodeBlock language="json" code={`// incident_resolved
{
  "type": "incident.resolved",
  "data": { "id": "inc_7F3k2", "resolution_time": "12m" }
}`} />
    </div>

    <Callout type="warning" title="Security Requirement">
      You MUST verify the <code className="text-amber-warning font-mono">Conduit-Signature</code> header using your webhook secret to ensure authenticity.
    </Callout>
  </section>
);

const RealtimeSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Real-Time (WebSocket)</h1>
      <p className="text-text-secondary">Subscribe to sub-second updates for metrics and incidents.</p>
    </div>

    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 mb-4">Connection URL</h3>
      <CodeBlock code="wss://api.conduit.fin/v1/realtime" />
    </div>

    <EndpointModule 
      method="POST"
      path="WS SUBSCRIBE"
      description="Subscription message to join a feed topic."
      request={`{
  "action": "subscribe",
  "topic": "metrics.latency.upi",
  "auth_token": "bearer_..."
}`}
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['latency_update', 'prediction_update', 'incident_triggered'].map(type => (
        <div key={type} className="p-4 bg-navy-900 border border-text-primary/5 rounded-xl">
          <div className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">Event Type</div>
          <div className="text-text-primary font-mono text-sm">{type}</div>
        </div>
      ))}
    </div>

    <Callout type="info" title="Frontend Tips">
      <ul className="list-disc list-inside space-y-2 mt-2">
        <li>Use a persistent worker or SharedWorker to manage the WS connection.</li>
        <li>Implement exponential backoff for reconnection logic.</li>
        <li>Buffer updates for 250ms to prevent UI re-render jitters during spikes.</li>
      </ul>
    </Callout>
  </section>
);

const FlowsSection = () => {
  const [activeFlow, setActiveFlow] = useState<'upi' | 'sip' | 'aa'>('upi');

  return (
    <section className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Fintech Flows</h1>
          <p className="text-text-secondary max-w-xl">Observability tailored to the unique failure profiles of Asian financial rails.</p>
        </div>
        
        <div className="flex bg-navy-900/50 p-1 rounded-xl border border-text-primary/5 self-start">
          {(['upi', 'sip', 'aa'] as const).map((flow) => (
            <button
              key={flow}
              onClick={() => setActiveFlow(flow)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all",
                activeFlow === flow 
                  ? "bg-indigo-accent text-text-primary shadow-lg shadow-indigo-accent/20" 
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {flow}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeFlow}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-16"
      >
        {activeFlow === 'upi' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-indigo-accent/10 border border-indigo-accent/20 text-indigo-accent text-[10px] font-bold rounded uppercase">Critical Path</div>
                  <h2 className="text-3xl font-bold text-text-primary">UPI Payment Flow</h2>
                </div>
                <p className="text-text-secondary leading-relaxed max-w-2xl">
                  Monitor the end-to-end lifecycle of a UPI transaction, from VPA validation to PSP response and NPCI settlement status.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">SLA Goal</div>
                  <div className="text-text-primary font-mono text-lg">99.95%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">Avg Latency</div>
                  <div className="text-mint-success font-mono text-lg">840ms</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 pb-2 border-b border-text-primary/5">Sequence Visualizer</h4>
                <div className="relative space-y-8 pl-8">
                  {/* Vertical Line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-accent via-indigo-accent/20 to-transparent" />
                  
                  {[
                    { s: 'Initialize', d: 'SDK initiates intent or collect request.', status: 'success' },
                    { s: 'Switching', d: 'PSP routes request to NPCI common switch.', status: 'warning' },
                    { s: 'Authorization', d: 'Issuer bank validates MPIN and balance.', status: 'pending' },
                    { s: 'Settlement', d: 'Real-time fund transfer across bank ledgers.', status: 'pending' }
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <div className={cn(
                        "absolute -left-[28px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-navy-950 z-10 transition-colors",
                        step.status === 'success' ? "border-mint-success bg-mint-success/20" :
                        step.status === 'warning' ? "border-amber-warning bg-amber-warning/20" :
                        "border-text-primary/20"
                      )} />
                      <div className="space-y-1">
                        <div className="text-text-primary font-bold text-sm">{step.s}</div>
                        <div className="text-text-secondary text-xs leading-relaxed">{step.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 pb-2 border-b border-text-primary/5">Failure Analysis (U67)</h4>
                <CodeBlock code={`{
  "rail": "upi",
  "status": "FAILED",
  "error": {
    "code": "U67",
    "message": "NPCI switch timeout",
    "impact": "₹45,000 leakage",
    "repro_step": "High concurrency at Issuer Bank"
  }
}`} />
                <div className="p-4 rounded-xl bg-red-danger/5 border border-red-danger/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-danger shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed text-red-danger/80 italic">
                      "U67 failures typically spike when P99 latency exceeds 1800ms. Immediate action recommended: Route to secondary PSP switch."
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Callout type="danger" title="Revenue Impact">
              UPI timeouts at the switch level account for 64% of total revenue leakage. Conduit detects these spikes within 800ms of occurrence.
            </Callout>
          </div>
        )}

        {activeFlow === 'sip' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-text-primary">SIP Mandate Flow</h2>
              <p className="text-text-secondary leading-relaxed max-w-2xl">
                Observability for recurring mandates, specifically focusing on debit success rates and e-mandate authentication failures.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 pb-2 border-b border-text-primary/5">Critical Data Gaps</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Aadhaar Auth', val: 'High Drop-off', color: 'text-red-danger', bg: 'bg-red-danger/5', border: 'border-red-danger/20' },
                    { label: 'Bank Notified', val: 'Mandate Pending', color: 'text-amber-warning', bg: 'bg-amber-warning/5', border: 'border-amber-warning/20' },
                    { label: 'First Debit', val: 'Insuff. Funds', color: 'text-indigo-accent', bg: 'bg-indigo-accent/5', border: 'border-indigo-accent/20' }
                  ].map((item, i) => (
                    <div key={i} className={cn("p-4 rounded-xl border flex items-center justify-between", item.bg, item.border)}>
                      <span className="text-text-primary font-medium text-sm">{item.label}</span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-text-primary/5 rounded", item.color)}>
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary/50 pb-2 border-b border-text-primary/5">Mandate Failure Event</h4>
                <CodeBlock code={`{
  "rail": "sip_mandate",
  "type": "e_mandate_auth",
  "result": "DROPPED",
  "latency": "14200ms",
  "abandoned": true
}`} />
                <p className="text-xs text-text-secondary italic">
                  E-mandate drop-offs usually peak during 10:00 AM - 12:00 PM due to bank maintenance windows.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeFlow === 'aa' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-text-primary">Account Aggregator (AA) Flow</h2>
              <p className="text-text-secondary leading-relaxed max-w-2xl">
                Monitor consent management, data fetch latency, and FIU parsing compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-8 rounded-2xl bg-text-primary/5 border border-text-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Layers className="w-48 h-48 -rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-mint-success/10 rounded-xl text-mint-success border border-mint-success/20">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-text-primary">Compliance Guard</h4>
                      <p className="text-sm text-text-secondary">Conduit monitors data residency compliance for every AA fetch in real-time.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">Active Consent Feed</h5>
                      <div className="space-y-3">
                        {[
                          { id: 'cons_7721', status: 'Healthy', score: 1.0 },
                          { id: 'cons_8842', status: 'Delayed', score: 0.8 },
                          { id: 'cons_9913', status: 'Healthy', score: 1.0 }
                        ].map((cons, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-text-inverse/20 rounded-lg border border-text-primary/5">
                            <code className="text-xs text-indigo-accent">{cons.id}</code>
                            <div className="flex items-center gap-3">
                              <span className={cn("text-[9px] font-bold text-text-primary px-1.5 py-0.5 rounded", cons.status === 'Healthy' ? "bg-mint-success/20" : "bg-amber-warning/20")}>{cons.status}</span>
                              <span className="text-[10px] font-mono text-text-secondary/50">{cons.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">AA Fetch Log</h5>
                      <CodeBlock code={`{
  "aa_partner": "sahamati_fiu_12",
  "consent_id": "cons_7721_ak8",
  "fetch_status": "DATA_READY",
  "pii_filtered": true,
  "compliance_score": 1.0
}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5 border-l-4 border-l-indigo-accent">
                  <h4 className="text-text-primary font-bold mb-2">Consent Conversion</h4>
                  <div className="text-3xl font-extrabold text-text-primary mb-4">78.4%</div>
                  <div className="h-1.5 w-full bg-text-primary/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-accent rounded-full w-[78%]" />
                  </div>
                  <p className="mt-4 text-[10px] text-text-secondary leading-relaxed">
                    A drop below 70% typically signals issues with the FIU redirect flow or mobile-OTP latency.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5">
                  <h4 className="text-text-primary font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-warning" /> Quick Stats
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Avg Fetch Time</span>
                      <span className="text-xs font-mono text-text-primary">4.2s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">GUM Error Rate</span>
                      <span className="text-xs font-mono text-pink-400">0.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

const ErrorsSection = () => (
  <section className="space-y-12">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Errors & Status Codes</h1>
      <p className="text-text-secondary">Consistent error envelope for all failures.</p>
    </div>

    <CodeBlock language="json" code={`{
  "error": {
    "code": "autofix_not_allowed",
    "message": "User lacks 'autofix:execute' scope for this resource",
    "request_id": "req_01HZXK...",
    "documentation_url": "https://docs.conduit.fin/errors#autofix_not_allowed"
  }
}`} />

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-text-primary/10 text-text-secondary uppercase text-[10px] tracking-widest">
            <th className="py-4 font-bold">Code</th>
            <th className="py-4 font-bold">HTTP</th>
            <th className="py-4 font-bold">Retryable</th>
          </tr>
        </thead>
        <tbody className="text-text-primary/90">
          {[
            { code: 'authentication_failed', http: 401, retry: 'No' },
            { code: 'rate_limited', http: 429, retry: 'Yes' },
            { code: 'autofix_not_allowed', http: 422, retry: 'No' },
            { code: 'internal_error', http: 500, retry: 'Yes' },
            { code: 'bad_request', http: 400, retry: 'No' },
            { code: 'resource_not_found', http: 404, retry: 'No' },
            { code: 'partner_error', http: 502, retry: 'Maybe' },
            { code: 'upstream_timeout', http: 504, retry: 'Yes' },
          ].map((row, i) => (
            <tr key={i} className="border-b border-text-primary/5 bg-text-primary/0 hover:bg-text-primary/[0.02] transition-colors">
              <td className="py-4 pr-4 font-mono text-pink-400">{row.code}</td>
              <td className="py-4 pr-4">{row.http}</td>
              <td className="py-4">{row.retry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Callout type="info" title="Retry Policy">
      We recommend an exponential backoff strategy with jitter, capped at a maximum delay of 30 seconds.
    </Callout>
  </section>
);

const ModelsSection = () => (
  <section className="space-y-12">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Data Models</h1>
      <p className="text-text-secondary">Core objects used across the Conduit API platform.</p>
    </div>

    {[
      { title: 'Incident', code: '{\n  "id": "string",\n  "severity": "P1 | P2 | P3",\n  "status": "ACTIVE | RESOLVED",\n  "rail": "string",\n  "started_at": "ISO8601"\n}' },
      { title: 'Metric', code: '{\n  "name": "string",\n  "value": "number",\n  "unit": "ms | rps | percentage",\n  "timestamp": "ISO8601"\n}' },
      { title: 'Partner Node', code: '{\n  "id": "string",\n  "type": "bank | processor | aggregator",\n  "health": "0-1"\n}' },
      { title: 'Transaction Event', code: '{\n  "txn_id": "string",\n  "source": "string",\n  "destination": "string",\n  "amount": "number",\n  "currency": "INR"\n}' },
      { title: 'AI Prediction', code: '{\n  "id": "string",\n  "model": "lstm_v4",\n  "confidence": "0-1",\n  "outcome": "string"\n}' }
    ].map((model, i) => (
      <div key={i}>
        <h3 className="text-lg font-bold text-text-primary mb-4 lowercase tracking-tight"><span className="text-indigo-accent opacity-50">type</span> {model.title}</h3>
        <CodeBlock language="json" code={model.code} />
      </div>
    ))}
  </section>
);

// --- New Sections ---

const ConventionsSection = () => (
  <section className="space-y-12">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Conventions</h1>
      <p className="text-text-secondary">Standard patterns used throughout the Conduit API.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary">Base URL</h3>
        <CodeBlock code="https://api.conduit.fin/v1" />
        <p className="text-sm text-text-secondary">All production requests should be routed to our global edge. Use <code className="text-indigo-accent">sandbox.api.conduit.fin</code> for testing.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary">Idempotency</h3>
        <p className="text-sm text-text-secondary">Conduit supports idempotency for all <code className="text-text-primary">POST</code> requests. Pass a unique UUID in the <code className="text-indigo-accent">Idempotency-Key</code> header.</p>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-lg font-bold text-text-primary">Unified Response Envelope</h3>
      <CodeBlock code={`{
  "request_id": "req_01HZXK...",
  "data": { ... },
  "metadata": { "timestamp": "2026-05-01T02:00:00Z" }
}`} />
    </div>
  </section>
);

const ComplianceSection = () => (
  <section className="space-y-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Compliance APIs</h1>
      <p className="text-text-secondary">Track regulatory adherence and SLA breaches across your ecosystem.</p>
    </div>

    <EndpointModule 
      method="GET"
      path="/v1/compliance/summary"
      description="Returns the aggregated audit score, SLA breach counts, and AA consent success rates."
      response={`{
  "request_id": "req_318LKN",
  "data": {
    "audit_score": 94,
    "sla_breaches": 2,
    "consent_success": 0.89
  }
}`}
    />

    <Callout type="info" title="What drives the score?">
      The compliance score is a weighted average of consent gaps, partner SLA downtime, and data residency adherence in the AA flow.
    </Callout>
  </section>
);

const ChangelogSection = () => (
  <section className="space-y-12">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Changelog</h1>
      <p className="text-text-secondary">Keep up with the latest updates to the Conduit platform.</p>
    </div>

    <div className="space-y-12">
      {[
        { date: 'May 1, 2026', title: 'LSTMWatch v4 release', desc: 'Introduced p99 drift detection for UPI rails with 92% confidence scores.' },
        { date: 'April 15, 2026', title: 'AA Consent Tracking', desc: 'New endpoints for monitoring Account Aggregator consent success rates and drop-off analysis.' },
        { date: 'March 22, 2026', title: 'Revenue Shielding', desc: 'Unified view of rupee-impact for all active incidents.' }
      ].map((entry, i) => (
        <div key={i} className="relative pl-8 border-l border-text-primary/5">
          <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-indigo-accent" />
          <div className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest mb-1">{entry.date}</div>
          <h3 className="text-lg font-bold text-text-primary mb-2">{entry.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{entry.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const OAuthSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <div className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-[0.2em]">Auth</div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">OAuth 2.0</h1>
      <p className="text-lg text-text-secondary">Conduit uses standard OAuth 2.0 flows for partner-delegated access.</p>
    </header>

    <div className="space-y-8">
      <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5">
        <h3 className="text-lg font-bold text-text-primary mb-4">Authorization Code Flow</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          Used by partners to grant your application access to their payment telemetry. All tokens are scoped and have a 1-hour expiration period.
        </p>
        <CodeBlock code={`POST /v1/oauth/token
{
  "grant_type": "authorization_code",
  "code": "auth_code_7721",
  "client_id": "cid_412",
  "client_secret": "csec_984"
}`} />
      </div>

      <Callout type="info" title="Token Expiration">
        Refresh tokens are valid for 30 days. Access tokens must be refreshed every 60 minutes.
      </Callout>
    </div>
  </section>
);

const ScopesSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <div className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-[0.2em]">Security</div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Scopes & Permissions</h1>
      <p className="text-lg text-text-secondary">Granular access control for your API keys.</p>
    </header>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-text-primary/10 text-text-secondary uppercase text-[10px] tracking-widest">
            <th className="py-4 font-bold">Scope</th>
            <th className="py-4 font-bold">Description</th>
          </tr>
        </thead>
        <tbody className="text-text-primary/90">
          {[
            { s: 'dashboard:read', d: 'Read health summary and vital metrics.' },
            { s: 'incidents:write', d: 'Manually trigger or escalate incidents.' },
            { s: 'autofix:execute', d: 'Required to trigger remediation playbooks.' },
            { s: 'revenue:read', d: 'View sensitive rupee-impact data.' },
            { s: 'partners:read', d: 'Access the Partner Graph and bank health.' }
          ].map((row, i) => (
            <tr key={i} className="border-b border-text-primary/5 bg-text-primary/0 hover:bg-text-primary/[0.02] transition-colors">
              <td className="py-4 pr-4 font-mono text-indigo-accent">{row.s}</td>
              <td className="py-4 text-text-secondary">{row.d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const RateLimitsSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Rate Limits</h1>
      <p className="text-text-secondary leading-relaxed">
        Conduit enforces rate limits to ensure platform stability. Limits are applied based on your plan tier and are communicated via standard HTTP headers.
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5">
        <h4 className="text-text-primary font-bold mb-4">Response Headers</h4>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-text-primary/5 pb-2">
            <span className="text-xs font-mono text-indigo-accent">X-RateLimit-Limit</span>
            <span className="text-xs text-text-primary">600</span>
          </div>
          <div className="flex justify-between border-b border-text-primary/5 pb-2">
            <span className="text-xs font-mono text-indigo-accent">X-RateLimit-Remaining</span>
            <span className="text-xs text-text-primary">598</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-mono text-pink-400">Retry-After</span>
            <span className="text-xs text-text-primary">45s</span>
          </div>
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5">
        <h4 className="text-text-primary font-bold mb-4">Default Quotas</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>• <strong className="text-text-primary">Sandbox:</strong> 100 requests / min</li>
          <li>• <strong className="text-text-primary">Production:</strong> 5,000 requests / min</li>
          <li>• <strong className="text-text-primary">Webhook Delivery:</strong> Concurrent delivery up to 50</li>
        </ul>
      </div>
    </div>
  </section>
);

const IdempotencySection = () => (
  <section className="space-y-12">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Idempotency</h1>
      <p className="text-text-secondary">Safely retry requests without creating duplicate actions.</p>
    </div>

    <p className="text-text-secondary leading-relaxed">
      Conduit supports idempotency for all <code className="text-text-primary">POST</code> requests. This is particularly critical for financial flows and auto-fix executions where a duplicate call could lead to incorrect remediation.
    </p>

    <div className="p-6 border-l-4 border-indigo-accent bg-indigo-accent/5 rounded-r-2xl">
      <div className="text-sm font-bold text-text-primary mb-2 uppercase tracking-widest">Usage</div>
      <p className="text-sm text-text-secondary leading-relaxed">
        Pass a unique string (we recommend a UUID v4) in the <code className="text-text-primary">Idempotency-Key</code> header. Conduit stores these keys for 24 hours.
      </p>
    </div>

    <CodeBlock code={`POST /v1/incidents/inc_7F3k2/auto-fix
Headers:
  Authorization: Bearer sk_live_...
  Idempotency-Key: a1b2c3d4-e5f6-7890-abcd-ef1234567890`} />
  </section>
);

const SandboxSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Sandbox & Testing</h1>
      <p className="text-text-secondary">Iterate quickly without affecting production telemetry.</p>
    </header>

    <div className="space-y-10">
      <p className="text-text-secondary leading-relaxed">
        Conduit's sandbox is a mirrors-of-truth environment. It generates synthetic transaction logs and allows you to test auto-fix playbooks against mock bank failures.
      </p>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary">Triggering Synthetic Alerts</h3>
        <p className="text-sm text-text-secondary">Use our sandbox trigger endpoint to simulate a rail failure for testing your webhook listeners.</p>
        <CodeBlock code={`POST /v1/sandbox/trigger-event
{
  "event_type": "incident.triggered",
  "severity": "P1",
  "rail": "upi"
}`} />
      </div>

      <Callout type="warning">
        Sandbox data is flushed every 24 hours. Do not use sandbox for long-term auditing tests.
      </Callout>
    </div>
  </section>
);


const EnvironmentsSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Environments</h1>
      <p className="text-text-secondary leading-relaxed">
        Conduit provides separate environments for testing and production to ensure safe integration.
      </p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5">
        <h4 className="text-text-primary font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-accent"></div> Sandbox</h4>
        <p className="text-sm text-text-secondary mb-4">Use the sandbox environment to test your integration without affecting real data.</p>
        <CodeBlock code="https://sandbox.api.conduit.fin/v1" />
      </div>
      <div className="p-6 rounded-2xl bg-navy-900 border border-text-primary/5">
        <h4 className="text-text-primary font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-mint-success"></div> Production</h4>
        <p className="text-sm text-text-secondary mb-4">The live environment where real transactions and monitoring occur.</p>
        <CodeBlock code="https://api.conduit.fin/v1" />
      </div>
    </div>
  </section>
);

const WebhookSignaturesSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Webhook Signatures</h1>
      <p className="text-text-secondary leading-relaxed">
        Secure your webhook endpoints by verifying the cryptographic signatures included in every Conduit request.
      </p>
    </header>
    <div className="space-y-6">
      <p className="text-text-secondary">Conduit includes a <code className="text-indigo-accent">Conduit-Signature</code> header in every webhook request. You should use your webhook secret to compute an HMAC with the SHA256 hash function and compare it to the signature in the header.</p>
      <CodeBlock language="javascript" code={`const crypto = require('crypto');

function verifySignature(payload, signatureHeader, secret) {
  const hash = crypto.createHmac('sha256', secret)
                     .update(payload)
                     .digest('hex');
  return hash === signatureHeader;
}`} />
    </div>
  </section>
);

const PaginationSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">Pagination</h1>
      <p className="text-text-secondary leading-relaxed">
        List endpoints in the Conduit API use cursor-based pagination for performance and consistency.
      </p>
    </header>
    <div className="space-y-6">
      <p className="text-text-secondary">When a list response exceeds the default limit, a <code className="text-indigo-accent">next_cursor</code> is provided in the <code className="text-text-primary">metadata</code> object.</p>
      <CodeBlock code={`{
  "data": [ ... ],
  "metadata": {
    "has_more": true,
    "next_cursor": "cXdlcnR5dWlvcGFzZGZnaGprbA=="
  }
}`} />
      <p className="text-text-secondary">To fetch the next page, pass this cursor as a query parameter:</p>
      <CodeBlock code="GET /v1/incidents/active?cursor=cXdlcnR5dWlvcGFzZGZnaGprbA==" />
    </div>
  </section>
);

const ACTIVE_CONTENT_MAP: Record<string, (props: any) => React.ReactNode> = {
  overview: (props) => <OverviewSection {...props} />,
  quickstart: () => <QuickstartSection />,
  concepts: () => <ConceptsSection />,
  authentication: () => <AuthSection />,
  oauth: () => <OAuthSection />,
  scopes: () => <ScopesSection />,
  dashboard: () => <DashboardSection />,
  incidents: () => <IncidentSection />,
  revenue: () => <RevenueSection />,
  compliance: () => <ComplianceSection />,
  ai: () => <AISection />,
  partners: () => <PartnersSection />,
  webhooks: () => <WebhookSection />,
  realtime: () => <RealtimeSection />,
  flows: () => <FlowsSection />,
  'rate-limits': () => <RateLimitsSection />,
  idempotency: () => <IdempotencySection />,
  sandbox: () => <SandboxSection />,
  errors: () => <ErrorsSection />,
  models: () => <ModelsSection />,
  changelog: () => <ChangelogSection />,
  environments: () => <EnvironmentsSection />,
  'webhook-signatures': () => <WebhookSignaturesSection />,
  pagination: () => <PaginationSection />,
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const cleanPath = location.pathname.replace(/^\/+/, '');
  const activeSection = ACTIVE_CONTENT_MAP[cleanPath] ? cleanPath : 'overview';

  useEffect(() => {
    // If route is completely invalid, or has malformed slashes (e.g. //revenue), fix it in the URL
    if (!cleanPath || !ACTIVE_CONTENT_MAP[cleanPath]) {
      navigate('/overview', { replace: true });
    } else if (location.pathname !== `/${cleanPath}`) {
      navigate(`/${cleanPath}`, { replace: true });
    }
  }, [location.pathname, cleanPath, navigate]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('conduit-theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('conduit-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('conduit-theme', 'light');
    }
    // Force a re-render to update the button text
    setSearchOpen(s => s);
  };

  const handleNavigate = (id: string) => {
    navigate(`/${id}`);
    setMobileMenuOpen(false);
  };
  
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const recentSearches = ['/v1/incidents/active', 'Revenue Shield', 'Auth Headers'];
  
  const RenderedContent = ACTIVE_CONTENT_MAP[activeSection] || ACTIVE_CONTENT_MAP.overview;

  useEffect(() => {
    if (searchOpen) {
      setSelectedIndex(-1);
      // Wait for animation frame to ensure modal is in DOM
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    } else {
      // Restore focus to trigger when closing
      searchTriggerRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    // Scroll to top on section change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [activeSection]);

  useEffect(() => {
    // Keyboard listener for Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen selection:bg-indigo-accent/30 selection:text-text-primary">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-[280px] fixed top-0 bottom-0 border-r border-text-primary/5 bg-navy-950/50 backdrop-blur-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-accent flex items-center justify-center text-navy-950">
            <Hexagon className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">Conduit</span>
        </div>

        <div className="px-6 mb-8">
          <button 
            ref={searchTriggerRef}
            onClick={() => setSearchOpen(true)}
            aria-label="Search documentation"
            aria-keyshortcuts="Control+K"
            className="w-full h-10 px-3 rounded-lg bg-text-primary/5 border border-text-primary/10 flex items-center justify-between text-text-secondary hover:bg-text-primary/10 hover:text-text-primary transition-all group"
          >
            <div className="flex items-center gap-2 text-sm">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Search...</span>
            </div>
            <div className="text-[10px] font-bold border border-text-primary/10 px-1.5 py-0.5 rounded bg-text-primary/5" aria-hidden="true">⌘K</div>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-10">
          {NAVIGATION.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h5 className="px-4 text-[10px] font-bold text-text-secondary/40 uppercase tracking-[0.2em] mb-3">
                {section.title}
              </h5>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all group relative",
                        activeSection === item.id 
                          ? "bg-indigo-accent/10 text-indigo-accent" 
                          : "text-text-secondary hover:text-text-primary hover:bg-text-primary/5"
                      )}
                    >
                      {activeSection === item.id && (
                        <motion.div 
                          layoutId="active-nav"
                          className="absolute left-0 w-1 h-4 bg-indigo-accent rounded-r-full"
                        />
                      )}
                      {item.icon && <span className={cn(activeSection === item.id ? "text-indigo-accent" : "text-text-secondary group-hover:text-text-primary")}>{item.icon}</span>}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px]">
        {/* Sticky Header */}
        <header className="sticky top-0 h-16 border-b border-text-primary/5 bg-navy-950/80 backdrop-blur-md z-10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
              <span>Docs</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className="text-text-primary capitalize">{activeSection.replace('-', ' ')}</span>
            </div>
            <div className="ml-4 px-2 py-0.5 rounded-full bg-indigo-accent/10 border border-indigo-accent/20 text-[10px] font-bold text-indigo-accent tracking-wider uppercase">
              API Reference
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg bg-text-primary/5 hover:bg-text-primary/10 border border-text-primary/10 text-xs font-medium text-text-secondary hover:text-text-primary transition-all"
            >
              {document.documentElement.getAttribute('data-theme') === 'light' ? '☀ Light' : '◐ Dark'}
            </button>
            <a href="#" className="p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* Dynamic Content */}
        <article className="max-w-4xl mx-auto px-6 md:px-12 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <RenderedContent onNavigate={handleNavigate} />
              
              <footer className="mt-24 pt-12 border-t border-text-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start text-xs text-text-secondary/50 gap-2">
                  <div className="flex items-center gap-2">
                    <Hexagon className="w-3 h-3" />
                    <span>© 2026 Conduit Fintech Inc.</span>
                  </div>
                  <span>Last updated: May 1, 2026 · 02:12 UTC</span>
                </div>
                <div className="flex gap-4">
                  {['Privacy', 'Status', 'Twitter', 'Support'].map(link => (
                    <a key={link} href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest font-bold">
                      {link}
                    </a>
                  ))}
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </article>

        {/* On this page - Floating list for desktop */}
        <aside className="hidden xl:block fixed right-8 top-32 w-64 p-6 border-l border-text-primary/5">
          <h6 className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-[0.2em] mb-4">On this page</h6>
          <ul className="space-y-3">
            {['Overview', 'Parameters', 'Endpoints', 'Examples'].map(anchor => (
              <li key={anchor}>
                <a href={`#${anchor.toLowerCase()}`} className="text-xs text-text-secondary hover:text-text-primary transition-all border-l border-transparent hover:border-indigo-accent pl-2 block">
                  {anchor}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-[10vh] px-4"
            onClick={() => setSearchOpen(false)}
            role="presentation"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-navy-900 border border-text-primary/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-modal-title"
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                  if (focusableElements) {
                    const first = focusableElements[0] as HTMLElement;
                    const last = focusableElements[focusableElements.length - 1] as HTMLElement;
                    if (e.shiftKey && document.activeElement === first) {
                      e.preventDefault();
                      last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                      e.preventDefault();
                      first.focus();
                    }
                  }
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSelectedIndex(prev => (prev + 1) % recentSearches.length);
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSelectedIndex(prev => (prev === -1 ? recentSearches.length - 1 : (prev - 1 + recentSearches.length) % recentSearches.length));
                }
                if (e.key === 'Enter' && selectedIndex !== -1) {
                  // In a real app we'd navigate to the selected result
                  // For now we just close the modal
                  setSearchOpen(false);
                }
              }}
            >
              <div className="p-4 border-b border-text-primary/5 flex items-center gap-3">
                <Search className="w-5 h-5 text-indigo-accent" aria-hidden="true" />
                <h2 id="search-modal-title" className="sr-only">Search documentation</h2>
                <input 
                  ref={searchInputRef}
                  placeholder="Search endpoints, events, objects..."
                  className="bg-transparent border-none outline-none text-text-primary w-full placeholder:text-text-secondary/30"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded bg-text-primary/5 text-[10px] uppercase font-bold text-text-secondary"
                  aria-label="Close search"
                >
                  Esc
                </button>
              </div>
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto" id="search-results" role="listbox">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest px-3">Recent Searches</div>
                  {recentSearches.map((res, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-3 rounded-lg border border-transparent flex items-center justify-between group cursor-pointer transition-all",
                        selectedIndex === i ? "bg-text-primary/10 border-text-primary/10" : "hover:bg-text-primary/5 hover:border-text-primary/5"
                      )}
                      role="option"
                      aria-selected={selectedIndex === i}
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={cn("w-4 h-4 transition-colors", selectedIndex === i ? "text-indigo-accent" : "text-text-secondary/50 group-hover:text-indigo-accent")} />
                        <span className={cn("text-sm transition-colors", selectedIndex === i ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary")}>{res}</span>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-opacity", selectedIndex === i ? "opacity-50" : "opacity-0 group-hover:opacity-50 text-text-secondary")} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-text-inverse/20 border-t border-text-primary/5 flex items-center gap-6" aria-hidden="true">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary/30">
                  <span className="p-1 bg-text-primary/5 border border-text-primary/10 rounded text-text-secondary">↵</span>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary/30">
                  <span className="p-1 bg-text-primary/5 border border-text-primary/10 rounded text-text-secondary">↑↓</span>
                  <span>Navigate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-[40]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-[280px] bg-navy-950 border-r border-text-primary/5 z-[50] flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-accent flex items-center justify-center text-navy-950">
                    <Hexagon className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-text-primary">Conduit</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-text-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 pb-10">
                {NAVIGATION.map((section, idx) => (
                  <div key={idx} className="mb-8">
                    <h5 className="px-4 text-[10px] font-bold text-text-secondary/40 uppercase tracking-[0.2em] mb-3">
                      {section.title}
                    </h5>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleNavigate(item.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all group",
                              activeSection === item.id 
                                ? "bg-indigo-accent/10 text-indigo-accent" 
                                : "text-text-secondary hover:text-text-primary"
                            )}
                          >
                            {item.icon && <span>{item.icon}</span>}
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
