import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Send, UserCheck, CheckCircle2, Activity } from 'lucide-react';

/** The four states every document passes through in Secure Exchange. */
const STAGES = [
  { label: 'Shared', icon: Send, detail: 'Link issued, time-bound' },
  { label: 'Verified', icon: UserCheck, detail: 'One-time code checked' },
  { label: 'Signed', icon: CheckCircle2, detail: 'Signature captured' },
  { label: 'Logged', icon: Activity, detail: 'Evidence recorded' },
] as const;

const STAGE_MS = 1500;

/**
 * Walks a pulse through the document lifecycle on a loop, so the hero reads as
 * something happening rather than a static headline. Doubles as the shortest
 * possible explanation of what the product does.
 */
export function LiveExchangePulse() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? STAGES.length : 0);

  useEffect(() => {
    if (reduce) {
      setStep(STAGES.length);
      return;
    }
    // One extra step holds the completed run for a beat before restarting.
    const id = setInterval(() => setStep(s => (s + 1) % (STAGES.length + 1)), STAGE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="rounded-2xl border border-ink-500 bg-ink-700/80 p-6 backdrop-blur-sm sm:p-8">
      <div className="mb-8 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {!reduce && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/90">
          Every document, end to end
        </span>
      </div>

      <ol className="space-y-1">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const reached = i < step;
          const active = i === step - 1;
          const isLast = i === STAGES.length - 1;

          return (
            <li key={stage.label} className="flex gap-4">
              {/* Rail: node plus the connector running down to the next node */}
              <div className="flex flex-col items-center">
                <motion.span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border"
                  initial={false}
                  animate={{
                    backgroundColor: reached ? 'rgba(52,211,153,0.14)' : 'rgba(21,50,64,1)',
                    borderColor: reached ? 'rgb(52,211,153)' : '#24485C',
                    scale: active ? 1.1 : 1,
                    boxShadow: active
                      ? '0 0 0 6px rgba(52,211,153,0.10)'
                      : '0 0 0 0 rgba(52,211,153,0)',
                  }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors duration-300 ${
                      reached ? 'text-emerald-300' : 'text-neutral-400'
                    }`}
                  />
                </motion.span>

                {!isLast && (
                  <span className="my-1 w-px flex-1 overflow-hidden bg-ink-500">
                    <motion.span
                      className="block h-full w-full bg-emerald-400"
                      initial={false}
                      animate={{ scaleY: i < step - 1 ? 1 : 0 }}
                      style={{ transformOrigin: 'top' }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: 'easeOut' }}
                    />
                  </span>
                )}
              </div>

              <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                <div
                  className={`text-sm font-medium transition-colors duration-300 ${
                    reached ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  {stage.label}
                </div>
                <div className="mt-0.5 text-xs text-neutral-400">{stage.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
