import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Organization {
  id: string;
  name: string;
  region: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdDate: string;
  adminEmail: string;
  userCount: number;
}

interface SuperAdminOrganizationsProps {
  onViewOrganization: (org: Organization) => void;
  onCreateOrganization: () => void;
}

export function SuperAdminOrganizations({ onViewOrganization, onCreateOrganization }: SuperAdminOrganizationsProps) {
  const allOrganizations: Organization[] = [
    { id: 'ORG-001', name: 'Acme Financial Services', region: 'US-East', status: 'Active', createdDate: 'Jan 15, 2024', adminEmail: 'admin@acmefinancial.com', userCount: 124 },
    { id: 'ORG-002', name: 'Apex Financial Group', region: 'US-West', status: 'Active', createdDate: 'Jan 18, 2024', adminEmail: 'admin@apexfinancial.com', userCount: 89 },
    { id: 'ORG-003', name: 'Meridian Capital', region: 'EU-West', status: 'Active', createdDate: 'Jan 20, 2024', adminEmail: 'admin@meridiancap.com', userCount: 156 },
    { id: 'ORG-004', name: 'Sterling Investments', region: 'US-West', status: 'Active', createdDate: 'Jan 22, 2024', adminEmail: 'admin@sterlinginv.com', userCount: 73 },
    { id: 'ORG-005', name: 'Quantum Securities', region: 'APAC', status: 'Active', createdDate: 'Jan 25, 2024', adminEmail: 'admin@quantumsec.com', userCount: 45 },
    { id: 'ORG-006', name: 'Pinnacle Holdings', region: 'US-East', status: 'Inactive', createdDate: 'Dec 10, 2023', adminEmail: 'admin@pinnacle.com', userCount: 12 },
    { id: 'ORG-007', name: 'Horizon Investments', region: 'EU-West', status: 'Active', createdDate: 'Jan 2, 2024', adminEmail: 'admin@horizon.com', userCount: 98 },
    { id: 'ORG-008', name: 'Zenith Capital Partners', region: 'APAC', status: 'Suspended', createdDate: 'Dec 15, 2023', adminEmail: 'admin@zenith.com', userCount: 34 },
    { id: 'ORG-009', name: 'Global Finance Corp', region: 'US-East', status: 'Active', createdDate: 'Jan 28, 2024', adminEmail: 'admin@globalfinance.com', userCount: 201 },
    { id: 'ORG-010', name: 'Venture Capital LLC', region: 'US-West', status: 'Suspended', createdDate: 'Dec 5, 2023', adminEmail: 'admin@venturecap.com', userCount: 56 },
  ];

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Apply Filters
  const filteredOrganizations = allOrganizations.filter(org => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = regionFilter === 'All Regions' || org.region === regionFilter;
    const matchesStatus = statusFilter === 'All Status' || org.status === statusFilter;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, regionFilter, statusFilter]);

  const handleToggleStatus = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Toggle status for ${org.name}`);
    setOpenMenuId(null);
  };

  const handleImpersonate = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Impersonate ${org.name} (read-only)`);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrganizationToDelete(org);
    setShowDeleteConfirm(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    console.log(`Delete ${organizationToDelete?.name}`);
    setShowDeleteConfirm(false);
    setOrganizationToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setOrganizationToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate stats from all organizations
  const totalActive = allOrganizations.filter(o => o.status === 'Active').length;
  const totalInactive = allOrganizations.filter(o => o.status === 'Inactive').length;
  const totalSuspended = allOrganizations.filter(o => o.status === 'Suspended').length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-1">Organizations</h1>
          <p className="text-sm text-neutral-600">Manage platform organizations and settings</p>
        </div>
        <button
          onClick={onCreateOrganization}
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Organization
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-sm text-neutral-600 mb-1">Total Organizations</div>
          <div className="text-2xl text-neutral-900">{allOrganizations.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-sm text-neutral-600 mb-1">Active</div>
          <div className="text-2xl text-green-600">{totalActive}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-sm text-neutral-600 mb-1">Inactive</div>
          <div className="text-2xl text-neutral-500">{totalInactive}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-sm text-neutral-600 mb-1">Suspended</div>
          <div className="text-2xl text-red-600">{totalSuspended}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or organization ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
            />
          </div>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Regions">All Regions</SelectItem>
              <SelectItem value="US-East">US-East</SelectItem>
              <SelectItem value="US-West">US-West</SelectItem>
              <SelectItem value="EU-West">EU-West</SelectItem>
              <SelectItem value="APAC">APAC</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Status">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Users</th>
              <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs text-neutral-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {paginatedOrganizations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-neutral-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-sm">No organizations found matching your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedOrganizations.map((org) => (
                <tr 
                  key={org.id}
                  onClick={() => onViewOrganization(org)}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-neutral-900">{org.name}</div>
                      <div className="text-sm text-neutral-500">{org.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-900">{org.region}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${
                      org.status === 'Active' ? 'bg-green-50' :
                      org.status === 'Suspended' ? 'bg-red-50' : 'bg-neutral-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        org.status === 'Active' ? 'bg-green-500' :
                        org.status === 'Suspended' ? 'bg-red-500' : 'bg-neutral-400'
                      }`}></div>
                      <span className={`text-xs ${
                        org.status === 'Active' ? 'text-green-700' :
                        org.status === 'Suspended' ? 'text-red-700' : 'text-neutral-600'
                      }`}>{org.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-900">{org.userCount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-900">{org.createdDate}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === org.id ? null : org.id);
                        }}
                        className="p-1 text-neutral-400 hover:text-neutral-600 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {openMenuId === org.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                            }}
                          ></div>
                          <div className="absolute right-0 mt-1 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewOrganization(org);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                            
                            <button
                              onClick={(e) => handleToggleStatus(org, e)}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Mark {org.status === 'Active' ? 'Inactive' : 'Active'}
                            </button>
                            
                            <button
                              onClick={(e) => handleImpersonate(org, e)}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Impersonate (read-only)
                            </button>

                            <div className="my-1 border-t border-neutral-200"></div>

                            <button
                              onClick={(e) => handleDeleteClick(org, e)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Organization
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          Showing {filteredOrganizations.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 border border-neutral-200 rounded-lg text-sm transition-colors ${
              currentPage === 1
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-600 hover:bg-neutral-50 cursor-pointer'
            }`}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-neutral-900 text-neutral-50'
                    : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1.5 border border-neutral-200 rounded-lg text-sm transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-600 hover:bg-neutral-50 cursor-pointer'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && organizationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-neutral-900 mb-2">Delete Organization</h3>
                <p className="text-sm text-neutral-600 mb-1">
                  Are you sure you want to delete <span className="font-medium text-neutral-900">{organizationToDelete.name}</span>?
                </p>
                <p className="text-sm text-neutral-600">
                  This action cannot be undone. All data, users, and configurations will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-neutral-50 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
