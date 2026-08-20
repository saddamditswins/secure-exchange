/**
 * Canonical domain types.
 *
 * These were previously redeclared per-component with fields that disagreed
 * (e.g. `name` vs `orgName`), which let mismatched objects flow between screens
 * behind `as any` casts. Import from here instead of re-declaring.
 */

export type OrganizationStatus = 'Active' | 'Inactive' | 'Suspended';

export interface Organization {
  id: string;
  orgName: string;
  region: string;
  status: OrganizationStatus;
  createdDate: string;
  adminEmail: string;
  exchangeCount: number;
  userCount: number;
}

/** Tenant and Organization are the same record; `Tenant` is the legacy name. */
export type Tenant = Organization;
