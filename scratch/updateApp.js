import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add router imports
content = content.replace(
  "import React, { useState, useEffect, useRef } from 'react';",
  "import React, { useState, useEffect, useRef } from 'react';\nimport { useNavigate, useLocation } from 'react-router-dom';"
);

// 2. Add missing sections before ACTIVE_CONTENT_MAP
const newSections = `
const EnvironmentsSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Environments</h1>
      <p className="text-text-secondary leading-relaxed">
        Conduit provides separate environments for testing and production to ensure safe integration.
      </p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 rounded-2xl bg-navy-900 border border-white/5">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-accent"></div> Sandbox</h4>
        <p className="text-sm text-text-secondary mb-4">Use the sandbox environment to test your integration without affecting real data.</p>
        <CodeBlock code="https://sandbox.api.conduit.fin/v1" />
      </div>
      <div className="p-6 rounded-2xl bg-navy-900 border border-white/5">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-mint-success"></div> Production</h4>
        <p className="text-sm text-text-secondary mb-4">The live environment where real transactions and monitoring occur.</p>
        <CodeBlock code="https://api.conduit.fin/v1" />
      </div>
    </div>
  </section>
);

const WebhookSignaturesSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Webhook Signatures</h1>
      <p className="text-text-secondary leading-relaxed">
        Secure your webhook endpoints by verifying the cryptographic signatures included in every Conduit request.
      </p>
    </header>
    <div className="space-y-6">
      <p className="text-text-secondary">Conduit includes a <code className="text-indigo-accent">Conduit-Signature</code> header in every webhook request. You should use your webhook secret to compute an HMAC with the SHA256 hash function and compare it to the signature in the header.</p>
      <CodeBlock language="javascript" code={\`const crypto = require('crypto');

function verifySignature(payload, signatureHeader, secret) {
  const hash = crypto.createHmac('sha256', secret)
                     .update(payload)
                     .digest('hex');
  return hash === signatureHeader;
}\`} />
    </div>
  </section>
);

const PaginationSection = () => (
  <section className="space-y-12">
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Pagination</h1>
      <p className="text-text-secondary leading-relaxed">
        List endpoints in the Conduit API use cursor-based pagination for performance and consistency.
      </p>
    </header>
    <div className="space-y-6">
      <p className="text-text-secondary">When a list response exceeds the default limit, a <code className="text-indigo-accent">next_cursor</code> is provided in the <code className="text-white">metadata</code> object.</p>
      <CodeBlock code={\`{
  "data": [ ... ],
  "metadata": {
    "has_more": true,
    "next_cursor": "cXdlcnR5dWlvcGFzZGZnaGprbA=="
  }
}\`} />
      <p className="text-text-secondary">To fetch the next page, pass this cursor as a query parameter:</p>
      <CodeBlock code="GET /v1/incidents/active?cursor=cXdlcnR5dWlvcGFzZGZnaGprbA==" />
    </div>
  </section>
);

const ACTIVE_CONTENT_MAP: Record<string, (props: any) => React.ReactNode> = {`;

content = content.replace('const ACTIVE_CONTENT_MAP: Record<string, (props: any) => React.ReactNode> = {', newSections);

// 3. Add to ACTIVE_CONTENT_MAP
content = content.replace(
  "  changelog: () => <ChangelogSection />,\n};",
  "  changelog: () => <ChangelogSection />,\n  environments: () => <EnvironmentsSection />,\n  'webhook-signatures': () => <WebhookSignaturesSection />,\n  pagination: () => <PaginationSection />,\n};"
);

// 4. Update App component definition
const oldAppDef = `export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);`;

const newAppDef = `export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract section from URL or default to 'overview'
  const currentPath = location.pathname.replace('/', '');
  const activeSection = currentPath || 'overview';

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleNavigate = (id: string) => {
    navigate(\`/\${id}\`);
    setMobileMenuOpen(false);
  };`;

content = content.replace(oldAppDef, newAppDef);

// 5. Replace setActiveSection calls with handleNavigate
content = content.replace(/setActiveSection\(item\.id\)/g, 'handleNavigate(item.id)');
content = content.replace(/onNavigate=\{setActiveSection\}/g, 'onNavigate={handleNavigate}');

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('App.tsx updated successfully');
