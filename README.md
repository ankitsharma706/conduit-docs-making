# ⚡ Conduit Documentation Portal

A hyper-modern, developer-first documentation portal for **Conduit** — the premier observability layer for India's fintech infrastructure (UPI, SIP, Account Aggregator).

Built strictly as a **Frontend-Only** application, this project acts as the definitive showcase of a seamless, instantaneous, and ultra-premium documentation experience. It features complete local routing, zero-latency search, and interactive data visualization.

---

## 🎨 Design Philosophy & Approach

The UI architecture was designed around a **Premium Glassmorphism & Dark Mode** aesthetic. It moves away from standard "boring" documentation into an engaging platform that wows the user immediately.

### Core Visual Principles
1. **Depth & Hierarchy**: Uses semi-transparent layers (`bg-navy-950` backdrops with `bg-white/5` borders) to create depth without relying on heavy shadows.
2. **Dynamic Interaction**: Every interactive element (buttons, code blocks, navigation links) has micro-interactions—from opacity shifts to scaling effects (`group-hover:scale-110`). 
3. **Data Clarity**: API parameters and endpoints are highlighted with distinct colors (`indigo-accent` for GET requests, `mint-success` for POST) and syntax-highlighted code blocks to maximize developer productivity.
4. **Focused Routing**: Instead of relying on full-page reloads, we leverage client-side routing (`HashRouter`) to instantly swap out views, preserving state (like sidebar navigation and search history).

---

## 🛠️ Technical Stack

This project is a 100% frontend implementation, ensuring it can be deployed anywhere (Vercel, Netlify, GitHub Pages, or a static S3 bucket).

- **React 19 & Vite**: Ultra-fast build times and component rendering.
- **Tailwind CSS v4**: For utility-first styling and managing our custom design tokens (Navy, Indigo, Mint).
- **React Router v7 (`HashRouter`)**: Enables seamless URL updating and history management without requiring server-side routing logic. 
- **Framer Motion**: Powers the buttery-smooth page transitions, mobile menu sliding, and search modal animations.
- **Highlight.js**: For rich, accurate code syntax highlighting inside the dark-themed `<pre>` blocks.
- **Lucide React**: Crisp, modern SVG iconography.

---

## 🚀 Deep Dive: Features & Architecture

### 1. Unified Navigation & Routing
We implemented `react-router-dom` using `HashRouter` to manage deep-links (e.g., `/#/incidents`, `/#/webhooks`). 
- **Why HashRouter?** It allows the static site to be deployed to *any* static file server without needing wildcard route configurations.
- **State Synchronization**: The active section dynamically reflects the URL, ensuring that users can bookmark and share specific API documentation pages.

### 2. Zero-Latency Search (Cmd+K)
The documentation includes a global search modal triggered via a keyboard shortcut (`Cmd+K` or `Ctrl+K`) or the UI.
- It operates entirely on the client side.
- Features keyboard navigation (`ArrowUp`/`ArrowDown`) and quick escaping.

### 3. Fintech-Specific Flows (UPI, SIP, AA)
Instead of just listing endpoints, the portal explains **Context**. The "Fintech Flows" section provides interactive sequences and data breakdowns for complex Indian financial primitives:
- **UPI Sequences**: Visualizing the Switch vs Issuer latency.
- **Account Aggregator**: Showing consent conversion rates and data residency compliance.
- **SIP Mandates**: Real-time visualization of e-mandate drop-offs.

### 4. Interactive Code Blocks
Developers expect to copy-paste. Every API payload, request structure, and error response is encapsulated in a custom `<CodeBlock />` component that features:
- Dynamic syntax highlighting.
- 1-click "Copy to Clipboard" functionality with immediate visual feedback.

---

## 🏁 Getting Started (Local Development)

Since this is purely a frontend application, spinning it up takes seconds.

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Build for Production
npm run build
```

## 📈 Deployment
The output in the `/dist` folder can be served natively anywhere. There is zero backend coupling here, meaning maximum scalability and minimal infrastructure costs.
