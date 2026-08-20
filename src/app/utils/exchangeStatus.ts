export type ExchangeStatus =
  | 'Draft'
  | 'Active'
  | 'Approved'
  | 'Revoked'
  | 'Completed'
  | 'Sent'
  | 'Viewed'
  | 'Expired';

const STATUS_CLASSES: Record<ExchangeStatus, string> = {
  Draft: 'bg-neutral-100 text-neutral-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-blue-100 text-blue-700',
  Sent: 'bg-blue-100 text-blue-700',
  Viewed: 'bg-purple-100 text-purple-700',
  Expired: 'bg-neutral-100 text-neutral-600',
  Revoked: 'bg-red-100 text-red-700',
};

/**
 * Tailwind classes for an exchange status badge.
 *
 * Takes a plain string because status values arrive from mock/API data that is
 * not type-checked at the boundary; unknown values fall back to neutral rather
 * than to an alarming red.
 */
export function getExchangeStatusColor(status: string): string {
  return STATUS_CLASSES[status as ExchangeStatus] ?? 'bg-neutral-100 text-neutral-600';
}
