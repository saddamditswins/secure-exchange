import type { Tenant, OrganizationStatus } from '../types';
import { useState } from 'react';

interface SuperAdminTenantListProps {
  onViewTenant: (tenant: Tenant) => void;
  onCreateTenant: () => void;
}

export function SuperAdminTenantList({ onViewTenant, onCreateTenant }: SuperAdminTenantListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const mockTenants: Tenant[] = [
    {
      id: 'ORG-2024-0012',
      orgName: 'Acme Financial Services',
      region: 'US-East',
      status: 'Active',
      createdDate: '2024-01-15',
      adminEmail: 'sarah.mitchell@acmefinancial.com',
      exchangeCount: 145,
      userCount: 12,
    },
    {
      id: 'ORG-2024-0089',
      orgName: 'Global Investment Partners',
      region: 'EU-West',
      status: 'Active',
      createdDate: '2024-03-22',
      adminEmail: 'admin@globalinvest.eu',
      exchangeCount: 203,
      userCount: 28,
    },
    {
      id: 'ORG-2024-0134',
      orgName: 'TechCorp Industries',
      region: 'US-West',
      status: 'Active',
      createdDate: '2024-08-10',
      adminEmail: 'ops@techcorp.com',
      exchangeCount: 67,
      userCount: 8,
    },
    {
      id: 'ORG-2024-0098',
      orgName: 'Pacific Trade Group',
      region: 'APAC',
      status: 'Active',
      createdDate: '2024-05-18',
      adminEmail: 'admin@pacifictrade.com.au',
      exchangeCount: 112,
      userCount: 15,
    },
    {
      id: 'ORG-2023-0456',
      orgName: 'Legacy Systems LLC',
      region: 'US-Central',
      status: 'Inactive',
      createdDate: '2023-11-05',
      adminEmail: 'contact@legacysystems.com',
      exchangeCount: 0,
      userCount: 3,
    },
    {
      id: 'ORG-2024-0167',
      orgName: 'Nordic Healthcare AB',
      region: 'EU-North',
      status: 'Active',
      createdDate: '2024-10-12',
      adminEmail: 'admin@nordichealthcare.se',
      exchangeCount: 34,
      userCount: 6,
    },
  ];

  const statuses = ['All', 'Active', 'Inactive'];

  const filteredTenants = filterStatus === 'All' 
    ? mockTenants 
    : mockTenants.filter(tenant => tenant.status === filterStatus);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-neutral-900 mb-2">Tenant Organizations</h2>
            <p className="text-neutral-600">Platform-level tenant management and monitoring</p>
          </div>
          <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded text-sm text-purple-700">
            Super Admin View
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-emerald-500 text-neutral-900'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <button 
          onClick={onCreateTenant}
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
        >
          Create Tenant
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Org ID</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Organization Name</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Region</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Status</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Users</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Exchanges</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Created Date</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => (
              <tr
                key={tenant.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-neutral-900">{tenant.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{tenant.orgName}</div>
                  <div className="text-xs text-neutral-500">{tenant.adminEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <RegionBadge region={tenant.region} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={tenant.status} />
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">{tenant.userCount}</td>
                <td className="px-6 py-4 text-sm text-neutral-700">{tenant.exchangeCount}</td>
                <td className="px-6 py-4 text-sm text-neutral-700">{tenant.createdDate}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewTenant(tenant)}
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <div className="text-sm text-blue-900">Super Admin Access Scope</div>
            <p className="text-sm text-blue-700 mt-1">
              You have platform-level access to manage tenant organizations. You cannot view tenant documents or exchanges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrganizationStatus }) {
  const styles: Record<OrganizationStatus, string> = {
    Active: 'bg-green-50 text-green-700',
    Inactive: 'bg-neutral-100 text-neutral-600',
    Suspended: 'bg-amber-50 text-amber-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}

function RegionBadge({ region }: { region: string }) {
  return (
    <span className="inline-flex px-2.5 py-1 rounded text-xs bg-neutral-100 text-neutral-700">
      {region}
    </span>
  );
}
