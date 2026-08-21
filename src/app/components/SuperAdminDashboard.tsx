import { useState } from 'react';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
  onClick?: () => void;
}

function KPICard({ title, value, subtitle, color, onClick }: KPICardProps) {
  const colorClasses = {
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    purple: 'text-purple-500',
  };

  return (
    <button
      onClick={onClick}
      className={`bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-6 text-left transition-all hover:bg-[#243F4D] hover:border-[#2A4A5D] ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="text-sm text-neutral-400 mb-2">{title}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]} mb-1`}>{value}</div>
      {subtitle && <div className="text-xs text-neutral-500">{subtitle}</div>}
    </button>
  );
}

interface GovernanceAction {
  id: string;
  organization: string;
  workspace: string;
  exchangeId: string;
  action: 'Approved' | 'Revoked' | 'Expired';
  actor: string;
  timestamp: string;
}

export function SuperAdminDashboard() {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  // Platform Health KPIs
  const platformKPIs = {
    activeOrganizations: 24,
    activeWorkspaces: 156,
    activeExternalAccess: 89,
    revokedAccessLast30Days: 12,
    auditReadyPercentage: 94,
  };

  // Security & Trust Data
  const otpData = [
    { name: 'OTP Protected', value: 73, percentage: 82 },
    { name: 'Non-OTP', value: 16, percentage: 18 },
  ];

  const failedOTPTrend = [
    { date: '01/01', attempts: 3 },
    { date: '01/02', attempts: 5 },
    { date: '01/03', attempts: 2 },
    { date: '01/04', attempts: 7 },
    { date: '01/05', attempts: 4 },
    { date: '01/06', attempts: 6 },
    { date: '01/07', attempts: 3 },
  ];

  // Recent Governance Actions
  const recentActions: GovernanceAction[] = [
    { id: 'AL-9901', organization: 'Acme Financial Services', workspace: 'WS-1004', exchangeId: 'EX-2012', action: 'Approved', actor: 'Sarah Mitchell', timestamp: '01/07/2026 10:45 AM' },
    { id: 'AL-9902', organization: 'Meridian Capital', workspace: 'WS-1006', exchangeId: 'EX-2014', action: 'Expired', actor: 'System', timestamp: '01/07/2026 07:00 AM' },
    { id: 'AL-9903', organization: 'Sterling Investments', workspace: 'WS-1003', exchangeId: 'EX-2009', action: 'Revoked', actor: 'Platform Admin', timestamp: '01/06/2026 02:10 PM' },
    { id: 'AL-9904', organization: 'Apex Financial Group', workspace: 'WS-1005', exchangeId: 'EX-2015', action: 'Approved', actor: 'Emily Chen', timestamp: '01/06/2026 11:30 AM' },
    { id: 'AL-9905', organization: 'Quantum Securities', workspace: 'WS-1007', exchangeId: 'EX-2018', action: 'Revoked', actor: 'Platform Admin', timestamp: '01/05/2026 09:00 AM' },
    { id: 'AL-9906', organization: 'Nova Holdings', workspace: 'WS-1008', exchangeId: 'EX-2021', action: 'Approved', actor: 'Robert Garcia', timestamp: '01/05/2026 08:30 AM' },
    { id: 'AL-9907', organization: 'Acme Financial Services', workspace: 'WS-1004', exchangeId: 'EX-2012', action: 'Approved', actor: 'Sarah Mitchell', timestamp: '01/04/2026 04:15 PM' },
    { id: 'AL-9908', organization: 'Meridian Capital', workspace: 'WS-1006', exchangeId: 'EX-2014', action: 'Approved', actor: 'Michael Torres', timestamp: '01/04/2026 02:30 PM' },
    { id: 'AL-9909', organization: 'Sterling Investments', workspace: 'WS-1003', exchangeId: 'EX-2009', action: 'Approved', actor: 'Lisa Anderson', timestamp: '01/03/2026 11:15 AM' },
    { id: 'AL-9910', organization: 'Apex Financial Group', workspace: 'WS-1005', exchangeId: 'EX-2015', action: 'Expired', actor: 'System', timestamp: '01/02/2026 08:00 AM' },
  ];

  // Evidence & Compliance Readiness
  const evidenceMetrics = {
    packagesGenerated: 47,
    avgGenerationTime: '2.3 min',
    oldestActiveAccess: '89 days',
  };

  // AI Risk Advisory
  const aiAdvisory = {
    unusualActivity: 3,
    highValueMonitored: 12,
    patternAccuracy: '91.2%',
  };

  const handleKPIClick = (kpiName: string) => {
    setSelectedKPI(kpiName);
    toast.info(`${kpiName} breakdown`, {
      description: 'Platform admins see tenant data read-only. Opens a drill-down here.',
    });
  };

  const handleGovernanceRowClick = (action: GovernanceAction) => {
    toast.info(`${action.exchangeId} — ${action.action.toLowerCase()} by ${action.actor}`, {
      description: `${action.organization} · ${action.workspace} · ${action.timestamp}`,
    });
  };

  return (
    <div className="p-6 space-y-6 w-full min-w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-[#FFFFFF] mb-1">Platform Overview</h1>
        <p className="text-sm text-neutral-400">System health, governance oversight, and operational integrity</p>
      </div>

      {/* Section 1: Platform Health KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard
          title="Active Organizations"
          value={platformKPIs.activeOrganizations}
          subtitle="Enabled tenants"
          color="emerald"
          onClick={() => handleKPIClick('Active Organizations')}
        />
        <KPICard
          title="Active Workspaces"
          value={platformKPIs.activeWorkspaces}
          subtitle="Across all organizations"
          color="blue"
          onClick={() => handleKPIClick('Active Workspaces')}
        />
        <KPICard
          title="Active External Access"
          value={platformKPIs.activeExternalAccess}
          subtitle="Live exchanges platform-wide"
          color="emerald"
          onClick={() => handleKPIClick('Active External Access')}
        />
        <KPICard
          title="Revoked Access"
          value={platformKPIs.revokedAccessLast30Days}
          subtitle="Last 30 days"
          color="amber"
          onClick={() => handleKPIClick('Revoked Access')}
        />
        <KPICard
          title="Audit-Ready Exchanges"
          value={`${platformKPIs.auditReadyPercentage}%`}
          subtitle="Evidence completeness"
          color="emerald"
          onClick={() => handleKPIClick('Audit-Ready Exchanges')}
        />
      </div>

      {/* Section 2: Security & Trust Overview */}
      <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-6">
        <h2 className="text-lg text-[#FFFFFF] mb-4">Security & Trust Overview</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* OTP Usage Bar Chart */}
          <div>
            <h3 className="text-sm text-neutral-400 mb-4">Authentication Method Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={otpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243F4D" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E3A4A', border: '1px solid #243F4D', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-3">
                <div className="text-xs text-neutral-400">OTP Protected</div>
                <div className="text-xl text-emerald-500 font-bold">82%</div>
              </div>
              <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-3">
                <div className="text-xs text-neutral-400">Non-OTP</div>
                <div className="text-xl text-blue-500 font-bold">18%</div>
              </div>
            </div>
          </div>

          {/* Failed OTP Attempts Line Chart */}
          <div>
            <h3 className="text-sm text-neutral-400 mb-4">Failed OTP Attempts (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={failedOTPTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243F4D" />
                <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E3A4A', border: '1px solid #243F4D', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
                <Line type="monotone" dataKey="attempts" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-[#153240] border border-[#243F4D] rounded-lg p-3">
              <div className="text-xs text-neutral-400">Total Failed Attempts (7 days)</div>
              <div className="text-xl text-red-500 font-bold">30</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: System Governance Activity */}
      <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#243F4D]">
          <h2 className="text-lg text-[#FFFFFF]">Recent Governance Actions</h2>
          <p className="text-sm text-neutral-400 mt-1">Platform-wide access control decisions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-[#153240] border-b border-[#243F4D]">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Log ID</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Workspace</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Exchange ID</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Actor</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243F4D]">
              {recentActions.map((action) => (
                <tr
                  key={action.id}
                  onClick={() => handleGovernanceRowClick(action)}
                  className="hover:bg-[#243F4D] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-neutral-400">{action.id}</td>
                  <td className="px-6 py-4 text-sm text-[#FFFFFF]">{action.organization}</td>
                  <td className="px-6 py-4 text-sm text-blue-400">{action.workspace}</td>
                  <td className="px-6 py-4 text-sm text-emerald-400">{action.exchangeId}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs ${
                        action.action === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : action.action === 'Revoked'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          action.action === 'Approved'
                            ? 'bg-emerald-500'
                            : action.action === 'Revoked'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                        }`}
                      ></span>
                      {action.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-300">{action.actor}</td>
                  <td className="px-6 py-4 text-sm text-neutral-400">{action.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Section 4: Evidence & Compliance Readiness */}
        <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-6">
          <h2 className="text-lg text-[#FFFFFF] mb-4">Evidence & Compliance Readiness</h2>
          
          <div className="space-y-4">
            <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-4">
              <div className="text-xs text-neutral-400 mb-1">Evidence Packages Generated</div>
              <div className="text-2xl text-emerald-500 font-bold">{evidenceMetrics.packagesGenerated}</div>
              <div className="text-xs text-neutral-500 mt-1">Last 30 days</div>
            </div>
            
            <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-4">
              <div className="text-xs text-neutral-400 mb-1">Avg Evidence Generation Time</div>
              <div className="text-2xl text-blue-500 font-bold">{evidenceMetrics.avgGenerationTime}</div>
              <div className="text-xs text-neutral-500 mt-1">Platform average</div>
            </div>
            
            <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-4">
              <div className="text-xs text-neutral-400 mb-1">Oldest Active External Access</div>
              <div className="text-2xl text-amber-500 font-bold">{evidenceMetrics.oldestActiveAccess}</div>
              <div className="text-xs text-neutral-500 mt-1">Platform-wide maximum</div>
            </div>
          </div>
        </div>

        {/* Section 5: AI Risk Advisory */}
        <div className="bg-[#1E3A4A] border-l-4 border-l-purple-500 border-y border-r border-[#243F4D] rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg text-[#FFFFFF]">AI Risk Advisory</h2>
              <p className="text-sm text-neutral-400 mt-1">Pattern detection and monitoring insights</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Advisory Only
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-4">
              <div className="text-xs text-neutral-400 mb-1">Exchanges with Unusual Activity</div>
              <div className="text-2xl text-purple-500 font-bold">{aiAdvisory.unusualActivity}</div>
              <div className="text-xs text-neutral-500 mt-1">Flagged for review</div>
            </div>
            
            <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-4">
              <div className="text-xs text-neutral-400 mb-1">High-Value Exchanges Monitored</div>
              <div className="text-2xl text-purple-500 font-bold">{aiAdvisory.highValueMonitored}</div>
              <div className="text-xs text-neutral-500 mt-1">Active tracking</div>
            </div>
            
            <div className="bg-[#153240] border border-[#243F4D] rounded-lg p-4">
              <div className="text-xs text-neutral-400 mb-1">Pattern Accuracy Rate</div>
              <div className="text-2xl text-purple-500 font-bold">{aiAdvisory.patternAccuracy}</div>
              <div className="text-xs text-neutral-500 mt-1">Informational only</div>
            </div>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <p className="text-xs text-purple-300 leading-relaxed">
                AI highlights unusual access patterns for review. All governance decisions remain human-owned and auditable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
