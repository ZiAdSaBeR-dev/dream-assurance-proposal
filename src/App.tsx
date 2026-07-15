import { useState, useEffect, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";
import {
  Search,
  Filter,
  Globe,
  Eye,
  Shield,
  Star,
  Mail,
  Send,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Building,
  Zap,
  Clock,
  Users,
  BarChart2,
  Cpu,
  Lock,
  Infinity as InfinityIcon,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   LOCKED BRAND TOKENS — palette unchanged from the source file
   ──────────────────────────────────────────────────────────── */
const C = {
  bg: "#050508",
  surf: "#0D0D18",
  card: "#12121F",
  cardAlt: "#171726",
  border: "#1D1D2F",
  borderBright: "#2C2C46",
  blue: "#2060E8",
  blueLight: "#5B8DFF",
  purple: "#7B3FF2",
  purpleLight: "#A177FF",
  white: "#F8F8FA",
  sec: "#9C9CAC",
  muted: "#5C5C74",
  success: "#22C55E",
  error: "#EF4444",
};

const F = {
  display: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
  body: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

const steps = [
  {
    id: 1,
    icon: Search,
    color: C.blue,
    title: "Search Google for Prospects",
    desc: "Uses the Serper commercial API to perform standard Google searches for local service businesses — identical to any person typing queries into Google. No private or restricted database is accessed at any point.",
  },
  {
    id: 2,
    icon: Filter,
    color: C.purple,
    title: "Filter Out Unsuitable Results",
    desc: "Automatically removes directories (Yelp, Yellow Pages), social platforms, large chain businesses, government sites, and non-business pages. Only genuine independently owned local businesses pass through.",
  },
  {
    id: 3,
    icon: FileText,
    color: C.blue,
    title: "Check for Existing Contacts",
    desc: "Before any further action, the system checks Dream Assurance's private records to confirm the business has never been contacted before. Previously contacted businesses are skipped immediately — no business is ever contacted twice.",
  },
  {
    id: 4,
    icon: Globe,
    color: C.purple,
    title: "Visit the Business Website",
    desc: "Accesses the business's publicly available website exactly as any person would in a standard web browser. Only content visible to any member of the public is read. No login-protected, private, or restricted content is ever accessed.",
  },
  {
    id: 5,
    icon: Eye,
    color: C.blue,
    title: "Verify the Website is Active",
    desc: "If the website does not load or returns an error, the business is skipped immediately and the system moves to the next one. No further processing or contact attempt is made.",
  },
  {
    id: 6,
    icon: Mail,
    color: C.purple,
    title: "Extract Published Contact Email",
    desc: "Reads email addresses the business has voluntarily published on their own public website — contact page, homepage footer, or about page. These are addresses the business has deliberately made public to receive contact from the public.",
  },
  {
    id: 7,
    icon: Cpu,
    color: C.blue,
    title: "AI Viability Assessment",
    desc: "GPT-4o-mini reads the publicly visible website text to confirm this is a genuine independently owned local service business. Large corporations, franchise chains, nonprofits, and government entities are filtered out here.",
  },
  {
    id: 8,
    icon: Building,
    color: C.purple,
    title: "AI Business Research",
    desc: "The AI conducts a deeper analysis of the public website: business type, industry, how they handle client inquiries, estimated team size, and what tools or systems are visible — all from content the business has chosen to publish publicly.",
  },
  {
    id: 9,
    icon: Shield,
    color: C.blue,
    title: "Identify Insurance Needs",
    desc: "Based on the industry, scale, and operational profile observed on the website, the AI identifies the likely insurance needs: general liability, commercial auto, workers' compensation, professional liability, BOP, etc.",
  },
  {
    id: 10,
    icon: Star,
    color: C.purple,
    title: "Qualification Score (1–10)",
    desc: "The AI assigns a qualification score. Only businesses above Dream Assurance's defined minimum threshold are contacted. Lower-scoring businesses are logged in the records but receive no email.",
  },
  {
    id: 11,
    icon: Zap,
    color: C.blue,
    title: "AI Writes a Personalized Email",
    desc: "A unique email is written for each specific business, referencing real observations from their website. Professional, consultative, non-aggressive tone. The sender is clearly and accurately identified as Dream Assurance Group. No templates, no generic blasts.",
  },
  {
    id: 12,
    icon: Send,
    color: C.purple,
    title: "Email Sent from Dream Assurance",
    desc: "The email is sent from one of Dream Assurance Group's own email accounts. Zero Limit automates the research and writing process; Dream Assurance is always the identified sender of every message.",
  },
  {
    id: 13,
    icon: BarChart2,
    color: C.blue,
    title: "Complete Audit Trail Logged",
    desc: "Every action is recorded in a private spreadsheet accessible only to Dream Assurance: businesses found, filtered, scored, contacted, email content sent, account used, and timestamp of every event. Full transparency at all times.",
  },
];

/* Natural macro-phases within the 13-step pipeline — a genuine grouping,
   not decoration: discovery → verification → AI analysis → outreach. */
const phases = [
  {
    key: "discovery",
    label: "Discovery & Filtering",
    range: [1, 3],
    color: C.blue,
  },
  {
    key: "verify",
    label: "Verification & Extraction",
    range: [4, 6],
    color: C.purple,
  },
  {
    key: "analyze",
    label: "AI Analysis & Scoring",
    range: [7, 10],
    color: C.blue,
  },
  {
    key: "outreach",
    label: "Outreach & Reporting",
    range: [11, 13],
    color: C.purple,
  },
];

const legalTabs = [
  {
    id: "canspam",
    label: "CAN-SPAM Act",
    subtitle: "15 U.S.C. § 7701",
    icon: Mail,
    note: "The CAN-SPAM Act fully permits unsolicited commercial email to businesses (B2B) when the sender is accurately identified, subject lines are truthful, and an opt-out mechanism is provided. This system meets every requirement by design.",
    noteColor: C.success,
    items: [
      "Accurate sender — Dream Assurance Group clearly and truthfully identified in every email",
      "No deceptive subject lines — AI generates relevant, non-misleading subjects only",
      "Sender's physical address (9200 Indian Creek Pkwy, Suite 100, Overland Park, KS 66210) included in footer",
      "Opt-out mechanism included in every email — honored immediately",
      "Emails sent to business addresses businesses voluntarily published — B2B cold email fully permitted under CAN-SPAM",
    ],
  },
  {
    id: "cfaa",
    label: "Computer Fraud Act",
    subtitle: "18 U.S.C. § 1030",
    icon: Lock,
    note: "Publicly accessible websites are, by definition, authorized for access by the general public. Visiting a public website to read its content is legally identical to any person visiting that website in their browser.",
    noteColor: C.blue,
    items: [
      "Only publicly accessible websites visited — no authentication, no login, no bypass of any access control",
      "Access method is standard HTTP requests, identical to any web browser used by any person",
      "No private, internal, or restricted systems accessed at any point in the process",
      "No CAPTCHA bypass, no anti-scraping circumvention, no automated login attempts",
      "Every website visited was intentionally made public by its owner for general public access",
    ],
  },
  {
    id: "privacy",
    label: "State Privacy Laws",
    subtitle: "CCPA & Equivalents",
    icon: Shield,
    note: "State consumer privacy laws (CCPA and equivalents) govern the collection of personal information about individual consumers. This system collects publicly published business contact information — a fundamentally different category not regulated by these laws.",
    noteColor: C.purple,
    items: [
      "System collects business contact details, not personal consumer data — state privacy laws not triggered",
      "CCPA and equivalents protect individual consumers, not publicly published business email addresses",
      "No health information, financial account data, or consumer records collected at any stage",
      "No personal consumer profiles created, stored, or processed",
      "Business email addresses voluntarily published by a business are not regulated personal data under any applicable state law",
    ],
  },
];

const notDoes = [
  "Hack, breach, or gain unauthorized access to any computer system or network",
  "Access login-protected, restricted, or private content on any website",
  "Purchase, access, or use any private email database or contact list",
  "Collect personal consumer data of any kind",
  "Send emails to personal consumer email addresses",
  "Misrepresent the sender identity in any email in any way",
  "Contact any business more than once without receiving a response",
  "Access any government database or restricted public record",
  "Bypass any CAPTCHA, authentication system, or access control",
  "Use any deceptive or misleading content in any email",
];

const industries = [
  {
    name: "Construction & Trades",
    coverage:
      "General liability · Workers' comp · Contractor insurance · Commercial auto",
    eg: "HVAC, plumbers, electricians, builders, contractors",
  },
  {
    name: "Transportation",
    coverage: "Commercial trucking · Cargo insurance · Fleet coverage",
    eg: "Independent trucking operators · Small fleets",
  },
  {
    name: "Restaurants & Food",
    coverage:
      "Restaurant insurance · General liability · Business owner's policy",
    eg: "Independent restaurants · Catering companies",
  },
  {
    name: "Professional Services",
    coverage: "Professional liability (E&O) · D&O · General liability",
    eg: "Accountants · Architects · Engineers · Consultants",
  },
  {
    name: "Retail & Specialty",
    coverage:
      "Business owner's policies · General liability · Industry-specific",
    eg: "Beauty salons · Gyms · Pet stores · Auto dealerships",
  },
  {
    name: "Real Estate",
    coverage:
      "Landlord insurance · Rental property · Real estate professional liability",
    eg: "Landlords · Property managers · Real estate agencies",
  },
];

const outcomes = [
  {
    label: "Email Open Rate",
    value: "30–50%",
    note: "vs. 15–20% industry average",
    icon: Mail,
  },
  {
    label: "Reply Rate",
    value: "3–8%",
    note: "of all businesses contacted",
    icon: Users,
  },
  {
    label: "Qualified Prospects/Month",
    value: "100–400",
    note: "across 18 licensed states",
    icon: TrendingUp,
  },
  {
    label: "System Operation",
    value: "24 / 7",
    note: "fully automated, no manual effort",
    icon: Clock,
  },
];

/* ────────────────────────────────────────────────────────────
   PRIMITIVES
   ──────────────────────────────────────────────────────────── */
function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.blue}, ${C.purple})`,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

/* Custom vector mark — replaces the broken raster logo placeholder.
   "Zero Limit" rendered as a continuous loop: literally limitless. */
interface LogomarkProps {
  size?: number;
}

function Logomark({ size = 44 }: LogomarkProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: size * 0.26,
        background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 6px 18px ${C.blue}38, inset 0 1px 0 ${C.white}30`,
        flexShrink: 0,
      }}
    >
      <InfinityIcon
        size={Math.round(size * 0.48)}
        color="#fff"
        strokeWidth={2.4}
      />
    </div>
  );
}

interface EyebrowProps {
  children: ReactNode;
  color?: string;
}

function Eyebrow({ children, color }: EyebrowProps) {
  return (
    <div
      style={{
        fontFamily: F.mono,
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.14em",
        color: color || C.muted,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  num: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  tag?: string;
}

function Section({ num, title, subtitle, children, tag }: SectionProps) {
  return (
    <div style={{ marginTop: 64 }}>
      <div style={{ marginBottom: 26 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 11.5,
              fontWeight: 700,
              color: C.blueLight,
              letterSpacing: "0.06em",
            }}
          >
            § {num}
          </span>
          {tag && (
            <>
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: C.muted,
                  display: "inline-block",
                }}
              />
              <Eyebrow>{tag}</Eyebrow>
            </>
          )}
        </div>
        <h2
          style={{
            fontFamily: F.display,
            fontSize: 25,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.015em",
            color: C.white,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <div
            style={{
              fontFamily: F.body,
              fontSize: 13.5,
              color: C.muted,
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </div>
        )}
        <div
          style={{
            height: 2,
            width: 44,
            background: `linear-gradient(90deg, ${C.blue}, ${C.purple})`,
            borderRadius: 2,
            marginTop: 16,
          }}
        />
      </div>
      {children}
    </div>
  );
}

interface Card3DProps {
  id: string;
  hovered: string | null;
  onEnter: (id: string) => void;
  onLeave: (id: string | null) => void;
  style?: CSSProperties;
  children: ReactNode;
}

function Card3D({
  id,
  hovered,
  onEnter,
  onLeave,
  style = {},
  children,
}: Card3DProps) {
  const isHov = hovered === id;
  return (
    <div
      onMouseEnter={() => onEnter(id)}
      onMouseLeave={() => onLeave(null)}
      style={{
        background: C.card,
        border: `1px solid ${isHov ? C.borderBright : C.border}`,
        borderRadius: 12,
        transition: "all 0.28s ease",
        transform: isHov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHov
          ? `0 14px 36px rgba(32,96,232,0.16), 0 0 0 1px ${C.blue}22`
          : "none",
        cursor: "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────────────── */
export default function LeadGenProposal() {
  const [activeTab, setActiveTab] = useState<string>("canspam");
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    refs.current.forEach((r, i) => {
      if (!r) return;
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setVisible((p) => new Set(p).add(i));
        },
        { threshold: 0.15 }
      );
      o.observe(r);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const activeTabData = legalTabs.find((t) => t.id === activeTab);

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: F.body,
        color: C.white,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
        @keyframes slideUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroIn   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .vis { animation: slideUp 0.5s ease forwards; }
        .hid { opacity: 0; }
        .hero-item { opacity: 0; animation: heroIn 0.6s ease forwards; }
        ::selection { background: ${C.blue}55; color: #fff; }
        button { font-family: inherit; }
        button:hover { opacity: 0.9; }
        button:focus-visible { outline: 2px solid ${C.blueLight}; outline-offset: 2px; }
        a:focus-visible { outline: 2px solid ${C.blueLight}; outline-offset: 2px; }
        a { transition: color 0.2s ease, border-color 0.2s ease; }
        a:hover { color: ${C.white} !important; border-color: ${C.muted} !important; }
        @media (max-width: 640px) {
          .hero-wrap { padding: 44px 20px 36px !important; }
          .qa-row { flex-direction: column !important; gap: 5px !important; }
          .phase-head { flex-wrap: wrap !important; row-gap: 6px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <ProgressBar />

      {/* ── DOCUMENT META BAR ──────────────────────────── */}
      <div
        style={{
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          padding: "9px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            color: C.muted,
            letterSpacing: "0.1em",
          }}
        >
          REF ZL–DAG–0726–LG
        </span>
        <span
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: C.border,
          }}
        />
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            color: C.muted,
            letterSpacing: "0.1em",
          }}
        >
          PREPARED JULY 2026
        </span>
        <span
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: C.border,
          }}
        />
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            color: C.error,
            letterSpacing: "0.1em",
            fontWeight: 700,
          }}
        >
          CONFIDENTIAL
        </span>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div
        className="hero-wrap"
        style={{
          background: C.surf,
          borderBottom: `1px solid ${C.border}`,
          padding: "60px 40px 52px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle, ${C.white}09 1px, transparent 1px)`,
            backgroundSize: "26px 26px",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${C.blue}1C 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 45% 40% at 88% 4%, ${C.purple}16 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div
          className="hero-item"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 34,
            position: "relative",
            animationDelay: "0.05s",
          }}
        >
          <Logomark size={46} />
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: F.display,
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              ZERO · LIMIT
            </div>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 9.5,
                color: C.muted,
                letterSpacing: "0.15em",
              }}
            >
              AI AUTOMATION AGENCY
            </div>
          </div>
        </div>

        <div
          className="hero-item"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: `${C.blue}15`,
            border: `1px solid ${C.blue}40`,
            borderRadius: 999,
            padding: "6px 16px 6px 13px",
            fontFamily: F.mono,
            fontSize: 10,
            color: C.blueLight,
            letterSpacing: "0.12em",
            marginBottom: 24,
            position: "relative",
            animationDelay: "0.15s",
          }}
        >
          <Lock size={11} />
          CONFIDENTIAL · LEGAL REVIEW DOCUMENT
        </div>

        <h1
          className="hero-item"
          style={{
            fontFamily: F.display,
            fontSize: "clamp(28px,4.6vw,50px)",
            fontWeight: 700,
            margin: "0 0 14px",
            letterSpacing: "-0.025em",
            lineHeight: 1.12,
            position: "relative",
            animationDelay: "0.25s",
          }}
        >
          AI-Powered Lead Generation System
        </h1>
        <h2
          className="hero-item"
          style={{
            fontFamily: F.body,
            fontSize: 16.5,
            fontWeight: 400,
            color: C.sec,
            margin: "0 0 34px",
            position: "relative",
            animationDelay: "0.35s",
          }}
        >
          Prepared for{" "}
          <span style={{ color: C.white, fontWeight: 600 }}>
            Dream Assurance Group
          </span>{" "}
          · by Zero Limit Agency · July 2026
        </h2>

        <div
          className="hero-item"
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
            animationDelay: "0.45s",
          }}
        >
          {[
            { l: "Document Type", v: "Legal Review" },
            { l: "Prepared For", v: "Dream Assurance Group" },
            { l: "Licensed States", v: "18 U.S. States" },
            { l: "Date", v: "July 2026" },
          ].map(({ l, v }) => (
            <div
              key={l}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 9,
                padding: "10px 17px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 9,
                  color: C.muted,
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                {l}
              </div>
              <div
                style={{ fontFamily: F.body, fontSize: 12.5, fontWeight: 600 }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px 90px" }}>
        {/* ── EXECUTIVE SUMMARY ──────────────────────────── */}
        <Section
          num="01"
          title="Executive Summary"
          subtitle="Plain-language overview of the system and its legal foundation"
        >
          <p
            style={{
              fontFamily: F.body,
              color: C.sec,
              lineHeight: 1.85,
              margin: "0 0 16px",
              fontSize: 14.5,
            }}
          >
            Zero Limit Agency has built an automated business development engine
            for Dream Assurance Group. The system finds local businesses that
            need insurance, researches them entirely from their publicly
            available websites, determines whether they are a qualified
            prospect, and sends a professionally written, personalized email on
            behalf of Dream Assurance — without any manual effort from Dream
            Assurance's team.
          </p>
          <p
            style={{
              fontFamily: F.body,
              color: C.sec,
              lineHeight: 1.85,
              margin: "0 0 22px",
              fontSize: 14.5,
            }}
          >
            <strong style={{ color: C.white }}>Legal conclusion:</strong> The
            system collects only information businesses have voluntarily
            published on their own public websites, and sends outreach emails to
            business contacts in full compliance with United States federal law.
            It does not access private data, does not breach any system, and
            does not collect personal consumer information.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                icon: Shield,
                color: C.success,
                t: "100% Legal",
                d: "CAN-SPAM, CFAA, and state privacy laws fully satisfied",
              },
              {
                icon: Globe,
                color: C.blue,
                t: "Public Data Only",
                d: "Exclusively information businesses have chosen to publish",
              },
              {
                icon: Zap,
                color: C.purple,
                t: "Fully Automated",
                d: "Operates 24/7 without any manual effort from Dream Assurance",
              },
            ].map(({ icon: Icon, color, t, d }) => (
              <Card3D
                key={t}
                id={t}
                hovered={hovered}
                onEnter={setHovered}
                onLeave={setHovered}
                style={{ padding: "20px 20px" }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: `${color}18`,
                    border: `1px solid ${color}38`,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Icon size={17} color={color} />
                </div>
                <div
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: 14.5,
                    marginBottom: 5,
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 12.5,
                    color: C.sec,
                    lineHeight: 1.55,
                  }}
                >
                  {d}
                </div>
              </Card3D>
            ))}
          </div>
        </Section>

        {/* ── HOW IT WORKS ───────────────────────────────── */}
        <Section
          num="02"
          title="How It Works — Step by Step"
          subtitle="Every step described precisely as the system operates, in plain business language"
          tag="13 Stages · 4 Phases"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            {phases.map((phase, pIdx) => {
              const phaseSteps = steps.filter(
                (s) => s.id >= phase.range[0] && s.id <= phase.range[1]
              );
              return (
                <div key={phase.key}>
                  <div
                    className="phase-head"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.mono,
                        fontSize: 10,
                        fontWeight: 700,
                        color: phase.color,
                        background: `${phase.color}16`,
                        border: `1px solid ${phase.color}40`,
                        borderRadius: 6,
                        padding: "3px 9px",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      PHASE {pIdx + 1}
                    </div>
                    <div
                      style={{
                        fontFamily: F.display,
                        fontSize: 14.5,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {phase.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: C.border,
                        minWidth: 20,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: F.mono,
                        fontSize: 10,
                        color: C.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      STEPS {String(phase.range[0]).padStart(2, "0")}–
                      {String(phase.range[1]).padStart(2, "0")}
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 19,
                        top: 4,
                        bottom: 4,
                        width: 2,
                        background: `${phase.color}40`,
                        borderRadius: 2,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {phaseSteps.map((step, localIdx) => {
                        const idx = step.id - 1;
                        const Icon = step.icon;
                        const isVis = visible.has(idx);
                        return (
                          <div
                            key={step.id}
                            ref={(el: HTMLDivElement | null) => {
                              refs.current[idx] = el;
                            }}
                            className={isVis ? "vis" : "hid"}
                            style={{
                              display: "flex",
                              gap: 14,
                              alignItems: "flex-start",
                              padding: "6px 0",
                              animationDelay: `${localIdx * 0.05}s`,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                minWidth: 40,
                                background: `${step.color}16`,
                                border: `1px solid ${step.color}45`,
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              <Icon size={16} color={step.color} />
                            </div>
                            <div
                              style={{
                                flex: 1,
                                background: C.card,
                                border: `1px solid ${C.border}`,
                                borderRadius: 10,
                                padding: "12px 16px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  marginBottom: 5,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: F.mono,
                                    fontSize: 9.5,
                                    color: step.color,
                                    fontWeight: 700,
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  STEP {String(step.id).padStart(2, "0")}
                                </span>
                                <span
                                  style={{
                                    fontFamily: F.display,
                                    fontWeight: 600,
                                    fontSize: 13.5,
                                  }}
                                >
                                  {step.title}
                                </span>
                              </div>
                              <p
                                style={{
                                  fontFamily: F.body,
                                  fontSize: 12.5,
                                  color: C.sec,
                                  margin: 0,
                                  lineHeight: 1.65,
                                }}
                              >
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── LEGAL COMPLIANCE ───────────────────────────── */}
        <Section
          num="03"
          title="Legal Framework & Compliance"
          subtitle="Full analysis under United States federal and state law — organized by legal area"
          tag="Counsel Reference"
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 4,
              background: C.card,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {legalTabs.map((tab) => {
              const active = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: "1 1 140px",
                    padding: "10px 8px",
                    borderRadius: 7,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: active ? C.blue : "transparent",
                    color: active ? "#FFFFFF" : C.sec,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <TabIcon size={14} style={{ opacity: active ? 1 : 0.65 }} />
                  <div style={{ fontWeight: active ? 600 : 500, fontSize: 12 }}>
                    {tab.label}
                  </div>
                  <div
                    style={{ fontFamily: F.mono, fontSize: 9, opacity: 0.7 }}
                  >
                    {tab.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {activeTabData && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {activeTabData.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 9,
                    padding: "11px 15px",
                  }}
                >
                  <CheckCircle
                    size={16}
                    color={C.success}
                    style={{ minWidth: 16, marginTop: 1 }}
                  />
                  <span
                    style={{
                      fontFamily: F.body,
                      fontSize: 13.5,
                      color: C.sec,
                      lineHeight: 1.65,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
              <div
                style={{
                  background: `${activeTabData.noteColor}0D`,
                  border: `1px solid ${activeTabData.noteColor}30`,
                  borderRadius: 9,
                  padding: "12px 16px",
                  marginTop: 4,
                }}
              >
                <p
                  style={{
                    fontFamily: F.body,
                    fontSize: 12.5,
                    color: activeTabData.noteColor,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  <strong>Legal note:</strong> {activeTabData.note}
                </p>
              </div>
            </div>
          )}
        </Section>

        {/* ── DOES NOT ───────────────────────────────────── */}
        <Section
          num="04"
          title="What the System Explicitly Does NOT Do"
          subtitle="Confirmed by design — for the avoidance of any doubt"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 7,
            }}
          >
            {notDoes.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  background: `${C.error}08`,
                  border: `1px solid ${C.error}20`,
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                <XCircle
                  size={15}
                  color={C.error}
                  style={{ minWidth: 15, marginTop: 2 }}
                />
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: 12.5,
                    color: C.sec,
                    lineHeight: 1.55,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── DREAM ASSURANCE SPECIFIC ───────────────────── */}
        <Section
          num="05"
          title="How This Works for Dream Assurance Group"
          subtitle="Configured specifically for your states, your industries, and your client profile"
        >
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.borderBright}`,
              borderRadius: 12,
              padding: "19px 22px",
              marginBottom: 20,
            }}
          >
            <Eyebrow>Business Profile</Eyebrow>
            <p
              style={{
                fontFamily: F.body,
                fontSize: 13.5,
                color: C.sec,
                lineHeight: 1.8,
                margin: "10px 0 0",
              }}
            >
              Dream Assurance Group is an independent insurance agency licensed
              in <strong style={{ color: C.white }}>18 U.S. states</strong> (IL,
              KS, MO, KY, TN, AL, GA, TX, MI, WI, IN, NV, PA, OH, OK, MD, IA,
              MN), working with{" "}
              <strong style={{ color: C.white }}>30+ top carriers</strong>{" "}
              including Chubb, CNA, Nationwide, Travelers, and Philadelphia
              Insurance. The system searches across all 18 licensed states,
              targeting the exact industry categories Dream Assurance already
              serves — bringing a continuous, automated outbound prospecting
              capability that currently does not exist.
            </p>
          </div>

          <div style={{ marginBottom: 10 }}>
            <Eyebrow>Targeted Industries &amp; Coverage Types</Eyebrow>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              marginBottom: 28,
            }}
          >
            {industries.map((ind, i) => (
              <Card3D
                key={i}
                id={`i${i}`}
                hovered={hovered}
                onEnter={setHovered}
                onLeave={setHovered}
                style={{ padding: "13px 18px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: F.display,
                        fontWeight: 600,
                        fontSize: 13.5,
                        marginBottom: 3,
                      }}
                    >
                      {ind.name}
                    </div>
                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: 11.5,
                        color: C.blueLight,
                      }}
                    >
                      {ind.coverage}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: 11,
                      color: C.muted,
                      textAlign: "right",
                      maxWidth: 220,
                    }}
                  >
                    {ind.eg}
                  </div>
                </div>
              </Card3D>
            ))}
          </div>

          <div style={{ marginBottom: 10 }}>
            <Eyebrow>
              Example Email the System Might Send — Plumbing Contractor
            </Eyebrow>
          </div>
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.borderBright}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: C.cardAlt,
                borderBottom: `1px solid ${C.border}`,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={13} color={C.muted} />
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: "0.06em",
                  }}
                >
                  DRAFT PREVIEW
                </span>
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 9.5,
                  color: C.purpleLight,
                  background: `${C.purple}18`,
                  border: `1px solid ${C.purple}38`,
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                AI-GENERATED · PER-BUSINESS
              </div>
            </div>
            <div style={{ padding: "16px 18px 18px" }}>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  color: C.white,
                  fontWeight: 600,
                  marginBottom: 14,
                  paddingBottom: 12,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                Subject: Coverage question for your plumbing team in [County]
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 12.5,
                  color: C.sec,
                  lineHeight: 1.8,
                }}
              >
                <p style={{ margin: "0 0 10px" }}>Hi [First Name],</p>
                <p style={{ margin: "0 0 10px" }}>
                  I was reviewing [Business Name]'s website and noticed you
                  operate across three counties with a team of six technicians.
                  Businesses at that scale often have gaps in workers'
                  compensation coverage when they bring on subcontractors —
                  particularly in states with strict classification requirements
                  around licensed vs. unlicensed trade work.
                </p>
                <p style={{ margin: "0 0 10px" }}>
                  Dream Assurance Group works with 30+ carriers and specializes
                  in helping contractors find coverage that actually matches how
                  they operate — rather than a generic policy that leaves
                  exposure.
                </p>
                <p style={{ margin: "0 0 10px" }}>
                  Worth a 10-minute comparison of what you're currently
                  carrying?
                </p>
                <p style={{ margin: 0, color: C.white }}>
                  Dream Assurance Group
                  <br />
                  9200 Indian Creek Pkwy, Suite 100, Overland Park, KS 66210
                  <br />
                  <span style={{ color: C.muted }}>
                    618-657-7525 · info@dreamassurancegroup.com
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── OUTCOMES ───────────────────────────────────── */}
        <Section
          num="06"
          title="Expected Business Outcomes"
          subtitle="Conservative estimates based on AI-personalized B2B outreach benchmarks in the insurance sector"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {outcomes.map(({ label, value, note, icon: Icon }) => (
              <div
                key={label}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "20px 16px",
                  textAlign: "center",
                  transition: "all 0.28s ease",
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    transform: "translateY(-5px)",
                    borderColor: C.blue,
                    boxShadow: `0 10px 32px ${C.blue}22`,
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, {
                    transform: "translateY(0)",
                    borderColor: C.border,
                    boxShadow: "none",
                  });
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: `${C.blue}16`,
                    border: `1px solid ${C.blue}35`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <Icon size={17} color={C.blue} />
                </div>
                <div
                  style={{
                    fontFamily: F.display,
                    fontSize: 29,
                    fontWeight: 700,
                    color: C.blue,
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{ fontFamily: F.body, fontSize: 11, color: C.muted }}
                >
                  {note}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: `${C.purple}0F`,
              border: `1px solid ${C.purple}30`,
              borderRadius: 10,
              padding: "14px 18px",
            }}
          >
            <p
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.purpleLight,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              <strong>Revenue impact:</strong> Each new insurance client carries
              recurring annual premium value. Acquiring just 5 new commercial
              clients per month through this channel adds meaningful compounding
              revenue to Dream Assurance's book of business — across 18 states,
              serving multiple industry verticals — with zero additional
              headcount required.
            </p>
          </div>
        </Section>

        {/* ── SCALE & CAPACITY ───────────────────────────── */}
        <Section
          num="07"
          title="Scale & Capacity"
          subtitle="Fully configurable to Dream Assurance's comfortable sending volume"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {[
              {
                metric: "10–50",
                label: "Businesses Found per Run",
                note: "Each automated search cycle",
              },
              {
                metric: "2×",
                label: "Runs Per Day",
                note: "Fully configurable",
              },
              {
                metric: "5–20",
                label: "Qualified Emails Sent/Day",
                note: "Only scored prospects",
              },
              {
                metric: "100–400",
                label: "Prospects Reached/Month",
                note: "Across all 18 licensed states",
              },
              {
                metric: "Unlimited",
                label: "Prospect Pool",
                note: "18 states · 6 industry verticals",
              },
              {
                metric: "0",
                label: "Manual Hours Required",
                note: "From Dream Assurance's team",
              },
            ].map(({ metric, label, note }) => (
              <div
                key={label}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: F.display,
                    fontSize: 21,
                    fontWeight: 700,
                    color: C.white,
                    marginBottom: 4,
                  }}
                >
                  {metric}
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{ fontFamily: F.body, fontSize: 10.5, color: C.muted }}
                >
                  {note}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SUMMARY FOR LEGAL ──────────────────────────── */}
        <Section
          num="08"
          title="Summary for Legal Review"
          subtitle="Plain-language reference — key points for counsel"
          tag="8 Questions, Plain Answers"
        >
          {[
            {
              q: "What data is collected?",
              a: "Business name, business website URL, and email addresses voluntarily published by businesses on their own public websites.",
            },
            {
              q: "How are websites accessed?",
              a: "Via standard HTTP requests — the same method used by any web browser. Only publicly accessible pages. No authentication, no bypass of any access control, no private or restricted content.",
            },
            {
              q: "What searches are performed?",
              a: "Standard Google searches via a licensed commercial API (Serper). Identical results visible to any person performing the same search.",
            },
            {
              q: "Who receives the emails?",
              a: "Business email addresses that the businesses themselves have chosen to publish publicly on their websites — not personal consumer accounts.",
            },
            {
              q: "Who sends the emails?",
              a: "Dream Assurance Group, from their own email accounts. Zero Limit automates the research and writing; Dream Assurance is the identified sender.",
            },
            {
              q: "Federal law applicable?",
              a: "CAN-SPAM Act (15 U.S.C. § 7701). The system is designed for full compliance with every requirement of the Act.",
            },
            {
              q: "CFAA applicability?",
              a: "Not implicated. The system accesses only publicly available websites in the same manner as any standard web browser — authorized public access by definition.",
            },
            {
              q: "State privacy law applicability?",
              a: "Not triggered. State consumer privacy laws (CCPA etc.) govern personal consumer data. This system collects publicly published business contact information — a different category.",
            },
          ].map(({ q, a }, i) => (
            <div
              key={i}
              className="qa-row"
              style={{
                display: "flex",
                gap: 0,
                borderBottom: `1px solid ${C.border}`,
                padding: "16px 0",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  minWidth: 230,
                  fontFamily: F.display,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.white,
                  paddingRight: 20,
                  display: "flex",
                  gap: 9,
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontWeight: 700,
                    color: C.blueLight,
                    fontSize: 11.5,
                  }}
                >
                  Q{i + 1}
                </span>
                <span>{q}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 240,
                  fontFamily: F.body,
                  fontSize: 13,
                  color: C.sec,
                  lineHeight: 1.65,
                }}
              >
                {a}
              </div>
            </div>
          ))}
        </Section>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "40px 34px",
            textAlign: "center",
            marginTop: 64,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 60% 70% at 50% 0%, ${C.blue}10 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <Eyebrow>Contact</Eyebrow>
            <h3
              style={{
                fontFamily: F.display,
                fontSize: 19,
                fontWeight: 700,
                margin: "10px 0 24px",
              }}
            >
              Questions or Clarifications?
            </h3>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 11,
                background: C.surf,
                border: `1px solid ${C.borderBright}`,
                borderRadius: 14,
                padding: "22px 36px",
                marginBottom: 26,
                minWidth: 260,
              }}
            >
              <Logomark size={36} />
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 10.5,
                  color: C.blueLight,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                ZERO LIMIT AGENCY
              </div>
              <a
                href="https://zero-limit-rouge.vercel.app/"
                style={{
                  color: C.sec,
                  fontFamily: F.body,
                  fontSize: 13.5,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.border}`,
                  paddingBottom: 2,
                }}
              >
                zero-limit-rouge.vercel.app
              </a>
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 11,
                color: C.muted,
                lineHeight: 1.75,
                maxWidth: 620,
                margin: "0 auto",
              }}
            >
              This document was prepared by Zero Limit Agency to provide Dream
              Assurance Group and their legal counsel with a complete and
              accurate understanding of the AI Lead Generation System. All
              technical descriptions reflect the actual operation of the system
              as built and deployed.
            </div>
            <div
              style={{
                marginTop: 26,
                paddingTop: 20,
                borderTop: `1px solid ${C.border}`,
                fontFamily: F.mono,
                fontSize: 9.5,
                color: C.muted,
                letterSpacing: "0.1em",
              }}
            >
              END OF DOCUMENT · REF ZL–DAG–0726–LG
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
