import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

const ROLES = [
  'Dealer Principal',
  'Compliance / Risk',
  'Operations',
  'IT / Systems',
  'Other',
] as const;

type Field = 'fullName' | 'workEmail' | 'organization' | 'role' | 'customRole' | 'message';
type Errors = Partial<Record<Field, string>>;

const EMPTY = {
  fullName: '',
  workEmail: '',
  organization: '',
  role: '',
  customRole: '',
  message: '',
};

interface DemoRequestModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Demo request dialog.
 *
 * Extracted from LandingPage, where it accounted for roughly a fifth of the
 * file. Inputs are now properly labelled and the dialog closes on Escape --
 * the previous version put tabIndex on a div and left every field unlabelled.
 */
export function DemoRequestModal({ open, onClose }: DemoRequestModalProps) {
  const reduce = useReducedMotion();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset only after the exit animation, so fields don't blank out mid-close.
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      return;
    }
    const id = setTimeout(() => {
      setValues(EMPTY);
      setErrors({});
      setSubmitted(false);
    }, 250);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Stop the page scrolling behind the dialog.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  const set = (field: Field, value: string) => {
    setValues(v => ({ ...v, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.fullName.trim()) next.fullName = 'Full name is required';
    if (!values.workEmail.trim()) next.workEmail = 'Work email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.workEmail))
      next.workEmail = 'Enter a valid email address';
    if (!values.organization.trim()) next.organization = 'Organization is required';
    if (!values.role) next.role = 'Select your role';
    if (values.role === 'Other' && !values.customRole.trim())
      next.customRole = 'Enter your role';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const fieldClass = (invalid?: string) =>
    `w-full rounded-lg border bg-ink-600 p-2.5 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
      invalid ? 'border-red-500' : 'border-ink-500'
    }`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            className="my-8 w-full max-w-2xl rounded-2xl border border-ink-500 bg-ink-700 shadow-2xl"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink-500 p-6">
              <div>
                <h2
                  id="demo-modal-title"
                  className="text-xl font-semibold text-neutral-900"
                >
                  Request a Demo
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Fill out the form below to schedule a demo and learn how Secure Exchange
                  can help your dealership group.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close demo request"
                className="shrink-0 cursor-pointer rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-ink-600 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-semibold text-neutral-900">Request received</h3>
                <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
                  Thanks {values.fullName.split(' ')[0] || 'there'} — we'll be in touch at{' '}
                  <span className="text-neutral-900">{values.workEmail}</span> within one
                  business day.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 cursor-pointer rounded-lg border border-ink-500 px-5 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-ink-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    id="demo-name"
                    label="Full name"
                    required
                    error={errors.fullName}
                  >
                    <input
                      ref={firstFieldRef}
                      id="demo-name"
                      type="text"
                      value={values.fullName}
                      onChange={e => set('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      aria-invalid={Boolean(errors.fullName)}
                      className={fieldClass(errors.fullName)}
                    />
                  </Field>

                  <Field
                    id="demo-email"
                    label="Work email"
                    required
                    error={errors.workEmail}
                  >
                    <input
                      id="demo-email"
                      type="email"
                      value={values.workEmail}
                      onChange={e => set('workEmail', e.target.value)}
                      placeholder="you@dealergroup.com"
                      aria-invalid={Boolean(errors.workEmail)}
                      className={fieldClass(errors.workEmail)}
                    />
                  </Field>

                  <Field
                    id="demo-org"
                    label="Organization / dealership group"
                    required
                    error={errors.organization}
                  >
                    <input
                      id="demo-org"
                      type="text"
                      value={values.organization}
                      onChange={e => set('organization', e.target.value)}
                      placeholder="Enter your organization"
                      aria-invalid={Boolean(errors.organization)}
                      className={fieldClass(errors.organization)}
                    />
                  </Field>

                  <Field id="demo-role" label="Role" required error={errors.role}>
                    <select
                      id="demo-role"
                      value={values.role}
                      onChange={e => {
                        set('role', e.target.value);
                        if (e.target.value !== 'Other') set('customRole', '');
                      }}
                      aria-invalid={Boolean(errors.role)}
                      className={`${fieldClass(errors.role)} cursor-pointer`}
                    >
                      <option value="">Select your role</option>
                      {ROLES.map(role => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {values.role === 'Other' && (
                  <Field
                    id="demo-custom-role"
                    label="Enter your role"
                    required
                    error={errors.customRole}
                  >
                    <input
                      id="demo-custom-role"
                      type="text"
                      value={values.customRole}
                      onChange={e => set('customRole', e.target.value)}
                      placeholder="e.g. Finance Director"
                      aria-invalid={Boolean(errors.customRole)}
                      className={fieldClass(errors.customRole)}
                    />
                  </Field>
                )}

                <Field id="demo-message" label="Message" optional>
                  <textarea
                    id="demo-message"
                    rows={3}
                    value={values.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Anything we should know before the call?"
                    className={`${fieldClass()} resize-none`}
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-ink-700 transition-colors hover:bg-emerald-400"
                >
                  Request a demo
                </button>
                <p className="text-center text-xs text-neutral-400">
                  We'll only use these details to arrange your demo.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-neutral-400">
        {label}
        {required && <span className="ml-0.5 text-emerald-400">*</span>}
        {optional && <span className="ml-1 text-neutral-400">(optional)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
