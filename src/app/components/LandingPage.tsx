import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  FileQuestion,
  Lock,
  MailWarning,
  Menu,
  Server,
  ShieldCheck,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import { Card, Eyebrow, Reveal, Section, SectionHeading } from './landing/primitives';
import { LiveExchangePulse } from './landing/LiveExchangePulse';
import { DemoRequestModal } from './landing/DemoRequestModal';

interface LandingPageProps {
  onLoginClick: () => void;
}

const RISKS = [
  {
    icon: MailWarning,
    tone: 'text-rose-400',
    title: 'Lost Control',
    desc: "Links stay open and files get forwarded. Once shared, access can't be reliably contained.",
  },
  {
    icon: Eye,
    tone: 'text-amber-400',
    title: 'Zero Visibility',
    desc: "You can't prove who accessed documents, when they did, or from where.",
  },
  {
    icon: FileQuestion,
    tone: 'text-purple-400',
    title: 'Indefensible',
    desc: 'When disputes or audits arise, evidence is fragmented, delayed, or missing.',
  },
] as const;

const GOVERNANCE_POINTS = [
  {
    title: 'Controlled Sharing',
    desc: 'Time-bound, revocable access with identity verification',
  },
  {
    title: 'Audit-Ready',
    desc: 'Retrieve complete, decision-grade document evidence during audits or disputes',
  },
  {
    title: 'Seamless Workflow',
    desc: 'Pull finalized PDFs directly from Dealertrack without disrupting dealership operations',
  },
] as const;

const OUTCOMES = [
  'Fewer document-related disputes and chargebacks',
  'Faster audit response with defensible proof',
  'Reduced compliance overhead and manual investigations',
  'Lower risk exposure after deals are finalized',
] as const;

const AUDIENCE = [
  {
    role: 'Dealer Principal',
    icon: Building2,
    accent: 'bg-emerald-400',
    desc: 'Owns regulatory exposure and chargeback liability — needs defensible proof',
  },
  {
    role: 'Compliance Head',
    icon: ShieldCheck,
    accent: 'bg-blue-400',
    desc: 'Responsible for audit readiness without manual file hunting or gaps',
  },
  {
    role: 'Operations Leader',
    icon: Activity,
    accent: 'bg-purple-400',
    desc: 'Manages document workflow efficiency while maintaining governance standards',
  },
] as const;

const COMPARISON = [
  {
    them: 'Focus only on signature capture and completion',
    us: 'Governs the full document lifecycle before, during, and after signing',
  },
  {
    them: 'No ongoing access control after sending',
    us: 'Time-bound, revocable, continuously monitored access',
  },
  {
    them: 'Limited or fragmented audit evidence',
    us: 'Decision Replay: Reconstruct the exact approved exposure state years later',
  },
] as const;

const NOT_THIS = [
  'Not a file storage system',
  'Not a generic e-signature tool',
  'Not an automated decision engine',
  'Not AI making compliance decisions',
] as const;

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const reduce = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openDemo = () => {
    setDemoOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink-700 font-sans text-neutral-900 selection:bg-emerald-500/30">
      {/* Ambient ground. Fixed so it drifts under the whole page. */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="hero-halo absolute -left-[10%] -top-[10%] aspect-square w-[55vw] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div
          className="hero-halo absolute -right-[5%] top-[40%] aspect-square w-[45vw] rounded-full bg-cyan-500/[0.07] blur-[130px]"
          style={{ animationDelay: '-5s' }}
        />
      </div>

      {/* NAVIGATION */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? 'border-b border-ink-500 bg-ink-700/85 backdrop-blur-md' : ''
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500">
              <ShieldCheck className="h-4.5 w-4.5 text-ink-700" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Secure Exchange</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={onLoginClick}
              className="cursor-pointer text-sm text-neutral-400 transition-colors hover:text-neutral-900"
            >
              Login
            </button>
            <button
              type="button"
              onClick={openDemo}
              className="cursor-pointer rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-emerald-400"
            >
              Request a demo
            </button>
          </div>

          <button
            type="button"
            className="cursor-pointer p-1 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(o => !o)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="space-y-2 border-b border-ink-500 bg-ink-700 px-6 pb-5 md:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="w-full cursor-pointer py-2.5 text-left text-neutral-400"
            >
              Login
            </button>
            <button
              type="button"
              onClick={openDemo}
              className="w-full cursor-pointer rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-ink-700"
            >
              Request a demo
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative z-10 px-6 pb-24 pt-36 md:pb-32 md:pt-44"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Eyebrow icon={Lock}>External document decision layer</Eyebrow>

              <h1 className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Secure documents.
                <br />
                <span className="hero-gradient-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Secure exchange.
                </span>
                <br />
                Confident signing.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-400">
                Secure Exchange is the external document decision layer that governs how
                automotive dealerships share and sign sensitive documents — without losing
                control, visibility, or proof.
              </p>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-400">
                Built for dealership principals, compliance leaders, and operations heads
                who own document risk.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={openDemo}
                  className="group flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-500 px-7 py-3.5 font-semibold text-ink-700 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400"
                >
                  Request a demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-sm text-neutral-400">
                  Pilot on real dealership documents.
                  <br className="hidden sm:block" /> No workflow replacement required.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <LiveExchangePulse />
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section tone="raised">
        <SectionHeading
          eyebrow={<Eyebrow tone="muted">The exposure</Eyebrow>}
          title={'Most organizations think their risk ends when they hit "Send."'}
          sub="In reality, that's where exposure begins — during audits, disputes, and regulatory review, when proof matters most."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {RISKS.map((risk, i) => (
            <Reveal key={risk.title} delay={i * 0.08}>
              <Card interactive className="h-full p-7">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-ink-600">
                  <risk.icon className={`h-6 w-6 ${risk.tone}`} />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{risk.title}</h3>
                <p className="mt-2.5 leading-relaxed text-neutral-400">{risk.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* GOVERNANCE POSITIONING */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Card className="p-8">
              <div className="flex items-center justify-between gap-4">
                <Node icon={Server} label="Dealertrack" />
                <Connector />
                <Node icon={ShieldCheck} label="Decision layer" highlighted />
                <Connector />
                <Node icon={UserCheck} label="External" />
              </div>
              <p className="mt-8 border-t border-ink-500 pt-6 text-center text-xs text-neutral-400">
                Dealertrack stays the system of record. Secure Exchange governs what leaves it.
              </p>
            </Card>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow={<Eyebrow icon={ShieldCheck}>Decision layer</Eyebrow>}
              title="Governance Beyond the Boundary"
              sub="Secure Exchange governs how finalized documents originating from Dealertrack are shared and signed externally — while Dealertrack remains your system of record."
            />

            <ul className="mt-9 space-y-6">
              {GOVERNANCE_POINTS.map((point, i) => (
                <Reveal as="li" key={point.title} delay={0.1 + i * 0.08}>
                  <div className="flex gap-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                      <h4 className="font-semibold">{point.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* OUTCOMES — deliberately not cards, to break the rhythm */}
      <Section tone="raised" width="narrow">
        <SectionHeading
          eyebrow={<Eyebrow tone="muted">Business impact</Eyebrow>}
          title="What This Changes for Your Business"
        />
        <ul className="mt-14 divide-y divide-ink-500 border-y border-ink-500">
          {OUTCOMES.map((outcome, i) => (
            <Reveal as="li" key={outcome} delay={i * 0.06}>
              <div className="flex items-center gap-5 py-5">
                <span className="w-6 shrink-0 text-sm tabular-nums text-emerald-400/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-lg leading-relaxed text-neutral-400">{outcome}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ANCHOR DECISION */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow={<Eyebrow icon={Lock}>Governance core</Eyebrow>}
              title={'The "Anchor Decision"'}
              sub="Ensure every external document exchange is safe, compliant, and explicitly approved to continue."
            />
            <div className="mt-9 space-y-6 border-l-2 border-ink-500 pl-6">
              <Reveal delay={0.1}>
                <h4 className="font-semibold">Immutable Records</h4>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                  Every approval creates a permanent, replayable decision record
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <h4 className="font-semibold">Revoke Anytime</h4>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                  Pause or revoke external access at any time after approval
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1}>
            <Card className="p-6">
              <div className="flex items-center justify-between border-b border-ink-500 pb-3">
                <span className="font-semibold">Decision Record</span>
                <span className="rounded border border-amber-600/40 bg-amber-500/10 px-2 py-1 text-[11px] font-medium tracking-wide text-amber-400">
                  PENDING REVIEW
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <ReadOnlyField label="External recipient" value="michael.thompson@customer.com" />
                <div className="grid grid-cols-2 gap-4">
                  <ReadOnlyField label="Access expiry" value="72 hours" />
                  <ReadOnlyField label="Permissions" value="View + Sign" />
                </div>
              </div>

              <button
                type="button"
                onClick={openDemo}
                className="mt-6 w-full cursor-pointer rounded-lg border border-emerald-500/50 bg-emerald-500/15 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25"
              >
                Commit External Access
              </button>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* AI RISK — reversed column order */}
      <Section tone="raised">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="lg:order-2">
            <Card className="flex flex-col items-center p-10">
              <RiskGauge />
              <div className="mt-8 w-full rounded-lg border border-ink-500 bg-ink-800 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
                  <Activity className="h-3 w-3" />
                  Advisory signal
                </div>
                <p className="mt-2 text-sm">No unusual patterns. Verified access location.</p>
              </div>
            </Card>
          </Reveal>

          <div className="lg:order-1">
            <SectionHeading
              align="left"
              eyebrow={
                <Eyebrow icon={Activity} tone="purple">
                  AI advisory
                </Eyebrow>
              }
              title="AI Risk Intelligence"
              sub="AI that reduces the cost of paying attention — without replacing judgment."
            />
            <div className="mt-9 space-y-6 border-l-2 border-ink-500 pl-6">
              <Reveal delay={0.1}>
                <h4 className="font-semibold">Always-On Monitoring</h4>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                  Flags unusual access patterns, stalled signatures, or high-risk data
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <h4 className="font-semibold">Human Control</h4>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                  AI provides advisory risk signals (Low / Medium / High). Final decisions
                  are always human-owned.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* AUDIENCE */}
      <Section>
        <SectionHeading
          eyebrow={<Eyebrow tone="muted">Who it's for</Eyebrow>}
          title="Built for Mid-Market Dealership Groups"
          sub="Designed for multi-location dealership groups with real compliance accountability."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((person, i) => (
            <Reveal key={person.role} delay={i * 0.08}>
              <Card interactive className="h-full overflow-hidden">
                <span className={`block h-0.5 w-full ${person.accent}`} />
                <div className="p-7">
                  <person.icon className="h-6 w-6 text-neutral-400" />
                  <h3 className="mt-5 text-lg font-semibold">{person.role}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">
                    {person.desc}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* COMPARISON */}
      <Section tone="raised">
        <SectionHeading
          eyebrow={<Eyebrow tone="muted">Why we win</Eyebrow>}
          title="Governance advantage, not feature comparison"
        />

        <Reveal className="mt-14">
          <div className="overflow-x-auto rounded-xl border border-ink-500">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="bg-ink-800">
                  <th
                    scope="col"
                    className="w-1/2 p-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400"
                  >
                    Generic e-signature tools
                  </th>
                  <th
                    scope="col"
                    className="w-1/2 border-l border-ink-500 bg-emerald-500/[0.06] p-5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-400"
                  >
                    Secure Exchange
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(row => (
                  <tr key={row.them} className="border-t border-ink-500">
                    <td className="p-5 align-top text-sm leading-relaxed text-neutral-400">
                      {row.them}
                    </td>
                    <td className="border-l border-ink-500 bg-emerald-500/[0.04] p-5 align-top text-sm font-medium leading-relaxed">
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* TRUST FILTER */}
      <Section width="narrow">
        <SectionHeading
          eyebrow={<Eyebrow tone="muted">Scope</Eyebrow>}
          title="What Secure Exchange Is Not"
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {NOT_THIS.map((item, i) => (
            <Reveal key={item} delay={i * 0.06}>
              <div className="flex items-center gap-3 rounded-lg border border-ink-500 px-5 py-4">
                <XCircle className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
                <p className="text-sm text-neutral-400">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-lg leading-relaxed text-neutral-400">
            Secure Exchange exists to{' '}
            <span className="font-semibold text-emerald-400">support human judgment</span> —
            not replace it.
          </p>
        </Reveal>
      </Section>

      {/* FINAL CTA */}
      <Section width="narrow" className="text-center md:!pt-10" >
        <Reveal>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500">
            <ShieldCheck className="h-7 w-7 text-ink-700" />
          </span>
          <h2 className="mt-8 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Stop Guessing. Start Governing.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-400">
            Don't wait for an audit or dispute to find out you lack proof.
          </p>
          <button
            type="button"
            onClick={openDemo}
            className="group mt-9 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-500 px-8 py-4 font-semibold text-ink-700 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400"
          >
            Request a demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </Reveal>
      </Section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-ink-500 bg-ink-800 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500">
              <ShieldCheck className="h-4 w-4 text-ink-700" />
            </span>
            <span className="font-semibold">Secure Exchange</span>
          </div>
          <p className="text-sm text-neutral-400">
            © 2026 Secure Exchange. External Document Decision Layer.
          </p>
        </div>
      </footer>

      <DemoRequestModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

/* ---------- small pieces used only by this page ---------- */

function Node({
  icon: Icon,
  label,
  highlighted = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <span
        className={`grid h-14 w-14 place-items-center rounded-xl border ${
          highlighted
            ? 'border-emerald-500/60 bg-emerald-500/10'
            : 'border-ink-500 bg-ink-600'
        }`}
      >
        <Icon className={`h-6 w-6 ${highlighted ? 'text-emerald-400' : 'text-neutral-400'}`} />
      </span>
      <span
        className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
          highlighted ? 'text-emerald-400' : 'text-neutral-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Connector() {
  return <span className="mb-8 h-px flex-1 bg-ink-500" aria-hidden="true" />;
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-neutral-400">{label}</span>
      <div className="mt-1.5 truncate rounded-md border border-ink-500 bg-ink-800 px-3 py-2 text-sm">
        {value}
      </div>
    </div>
  );
}

/** Advisory risk dial. Static by design — it illustrates, it doesn't measure. */
function RiskGauge() {
  const reduce = useReducedMotion();

  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#24485C" strokeWidth="6" />
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#34d399"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="276"
          initial={reduce ? { strokeDashoffset: 200 } : { strokeDashoffset: 276 }}
          whileInView={{ strokeDashoffset: 200 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="text-center">
        <span className="block text-2xl font-semibold">LOW</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Risk</span>
      </div>
    </div>
  );
}
