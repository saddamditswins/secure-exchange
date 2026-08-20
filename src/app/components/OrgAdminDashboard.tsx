import { useState } from 'react';
import { 
  Shield, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  TrendingUp,
  Package,
  Timer,
  Calendar,
  Eye,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'emerald' | 'amber' | 'blue' | 'purple';
  icon: React.ReactNode;
  onClick?: () => void;
}

function KPICard({ title, value, subtitle, color, icon, onClick }: KPICardProps) {
  const colorMap = {
    emerald: {
      number: 'text-emerald-400',
      icon: 'text-emerald-400',
      accent: 'border-l-emerald-400'
    },
    amber: {
      number: 'text-amber-400',
      icon: 'text-amber-400',
      accent: 'border-l-amber-400'
    },
    blue: {
      number: 'text-blue-400',
      icon: 'text-blue-400',
      accent: 'border-l-blue-400'
    },
    purple: {
      number: 'text-purple-400',
      icon: 'text-purple-400',
      accent: 'border-l-purple-400'
    }
  };

  const colors = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`bg-[#1E3A4A] border border-[#243F4D] border-l-4 ${colors.accent} rounded-lg p-6 ${onClick ? 'cursor-pointer hover:bg-[#243F4D] transition-all' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.icon}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <div className={`text-4xl font-bold ${colors.number}`}>{value}</div>
        <div className="text-sm font-medium text-[#ffffff]">{title}</div>
        {subtitle && <div className="text-xs text-neutral-400">{subtitle}</div>}
      </div>
    </div>
  );
}

interface GovernanceAction {
  id: string;
  exchangeId: string;
  exchangeTitle: string;
  action: 'Approved' | 'Revoked' | 'Expired' | 'Extended';
  decisionOwner: string;
  timestamp: string;
}

interface OrgAdminDashboardProps {
  onNavigateToWorkspaceWithFilter?: (workspaceId: string, filter: string) => void;
  onNavigateToExchangeDetail?: (workspaceId: string, exchangeId: string) => void;
}

export function OrgAdminDashboard({ onNavigateToWorkspaceWithFilter, onNavigateToExchangeDetail }: OrgAdminDashboardProps) {
  const { t } = useTranslation();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  // In a real app, this would be fetched from API
  // For demo purposes, using a default workspace ID
  const DEFAULT_WORKSPACE_ID = 'WS-001';

  // Mock data for charts
  const accessTrendData = [
    { month: 'Aug', active: 45, revoked: 8 },
    { month: 'Sep', active: 52, revoked: 12 },
    { month: 'Oct', active: 61, revoked: 9 },
    { month: 'Nov', active: 58, revoked: 15 },
    { month: 'Dec', active: 67, revoked: 11 },
    { month: 'Jan', active: 73, revoked: 14 },
  ];

  const otpComparisonData = [
    { category: 'With OTP', count: 58, percentage: 79 },
    { category: 'Without OTP', count: 15, percentage: 21 },
  ];

  const recentActions: GovernanceAction[] = [
    {
      id: 'GA-001',
      exchangeId: 'EX-2024-0891',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      action: 'Approved',
      decisionOwner: 'Sarah Mitchell',
      timestamp: '01/07/2026 09:15 AM'
    },
    {
      id: 'GA-002',
      exchangeId: 'EX-2024-0889',
      exchangeTitle: 'Vendor Contract - Legal Review',
      action: 'Extended',
      decisionOwner: 'Michael Chen',
      timestamp: '01/07/2026 08:42 AM'
    },
    {
      id: 'GA-003',
      exchangeId: 'EX-2024-0885',
      exchangeTitle: 'Employee NDA Package',
      action: 'Revoked',
      decisionOwner: 'Sarah Mitchell',
      timestamp: '01/06/2026 04:30 PM'
    },
    {
      id: 'GA-004',
      exchangeId: 'EX-2024-0882',
      exchangeTitle: 'Partnership Agreement Draft',
      action: 'Expired',
      decisionOwner: 'System',
      timestamp: '01/06/2026 12:00 PM'
    },
    {
      id: 'GA-005',
      exchangeId: 'EX-2024-0878',
      exchangeTitle: 'Compliance Audit Documents',
      action: 'Approved',
      decisionOwner: 'Michael Chen',
      timestamp: '01/05/2026 03:15 PM'
    },
  ];

  const handleKPIClick = (kpiType: string) => {
    setSelectedKPI(kpiType);
    // In a real app, this would navigate to filtered views
    if (onNavigateToWorkspaceWithFilter) {
      onNavigateToWorkspaceWithFilter(DEFAULT_WORKSPACE_ID, kpiType);
    }
  };

  const getActionBadge = (action: string) => {
    const styles = {
      Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Revoked: 'bg-rose-50 text-rose-700 border-rose-200',
      Expired: 'bg-neutral-100 text-neutral-600 border-neutral-200',
      Extended: 'bg-blue-50 text-blue-700 border-blue-200'
    };
    return styles[action as keyof typeof styles] || styles.Approved;
  };

  return (
    <div className="flex-1 overflow-y-auto h-full bg-neutral-50">
      <div className="mx-auto p-8 pb-20 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Governance Command Center</h1>
          <p className="text-neutral-600 mt-2">
            Executive oversight of external document access, compliance readiness, and risk management
          </p>
        </div>

        {/* Top KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Active External Access"
            value="73"
            subtitle="Live exchanges with external parties"
            color="emerald"
            icon={<Shield className="w-6 h-6" />}
            onClick={() => handleKPIClick('active')}
          />
          <KPICard
            title="Expiring in 7 Days"
            value="12"
            subtitle="Requiring attention or renewal"
            color="amber"
            icon={<Clock className="w-6 h-6" />}
            onClick={() => handleKPIClick('expiring')}
          />
          <KPICard
            title="Revoked Access (30d)"
            value="14"
            subtitle="Governance actions enforced"
            color="blue"
            icon={<XCircle className="w-6 h-6" />}
            onClick={() => handleKPIClick('revoked')}
          />
          <KPICard
            title="Audit-Ready Exchanges"
            value="94%"
            subtitle="With complete evidence packages"
            color="emerald"
            icon={<CheckCircle2 className="w-6 h-6" />}
            onClick={() => handleKPIClick('audit-ready')}
          />
        </div>

        {/* Risk & Governance Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Access Trend Chart */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">External Access Trend</h3>
                <p className="text-sm text-neutral-600 mt-1">Active vs Revoked access over 6 months</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={accessTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#34d399" 
                  strokeWidth={2}
                  name="Active Access"
                  dot={{ fill: '#34d399', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revoked" 
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  name="Revoked Access"
                  dot={{ fill: '#60a5fa', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* OTP vs Non-OTP Chart */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Authentication Security</h3>
                <p className="text-sm text-neutral-600 mt-1">OTP vs Non-OTP protected access</p>
              </div>
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={otpComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="category" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#34d399" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>79% of exchanges use OTP verification</span>
            </div>
          </div>
        </div>

        {/* AI Advisory & Risk Indicator */}
        <div className="bg-[#1E3A4A] border border-[#243F4D] border-l-4 border-l-purple-400 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-[#ffffff]">AI Risk Advisory</h3>
                <span className="px-2 py-0.5 bg-purple-900/30 text-purple-300 text-xs font-medium rounded-full border border-purple-400/30">
                  Advisory Only
                </span>
              </div>
              <p className="text-neutral-900 mb-4 text-sm">
                AI highlights unusual access patterns for your review. All governance decisions remain human-owned and auditable.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#243F4D] rounded-lg p-4 border border-[#2a4a5a]">
                  <div className="text-2xl font-bold text-amber-400 mb-1">3</div>
                  <div className="text-sm text-neutral-800">Exchanges with unusual activity</div>
                  <button 
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium mt-2 cursor-pointer"
                    onClick={() => handleKPIClick('unusual-activity')}
                  >
                    Review flagged items →
                  </button>
                </div>
                <div className="bg-[#243F4D] rounded-lg p-4 border border-[#2a4a5a]">
                  <div className="text-2xl font-bold text-blue-400 mb-1">8</div>
                  <div className="text-sm text-neutral-800">High-value exchanges monitored</div>
                  <button 
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium mt-2 cursor-pointer"
                    onClick={() => handleKPIClick('high-value')}
                  >
                    View monitored →
                  </button>
                </div>
                <div className="bg-[#243F4D] rounded-lg p-4 border border-[#2a4a5a]">
                  <div className="text-2xl font-bold text-neutral-200 mb-1">100%</div>
                  <div className="text-sm text-neutral-800">Pattern accuracy rate</div>
                  <button 
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium mt-2 cursor-pointer"
                    onClick={() => handleKPIClick('ai-insights')}
                  >
                    View insights →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence & Compliance Readiness */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">Evidence & Compliance Readiness</h2>
            <p className="text-sm text-neutral-600 mt-0.5">Immutable decision records and compliance package status</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs text-neutral-500">Last 30 days</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">68</div>
              <div className="text-sm text-neutral-600">Evidence Packages Generated</div>
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <div className="text-xs text-neutral-500">↑ 12% from previous period</div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-neutral-500">Efficiency metric</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">2.4m</div>
              <div className="text-sm text-neutral-600">Avg Time to Produce Evidence</div>
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <div className="text-xs text-emerald-600 font-medium">↓ 18% faster than target</div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs text-neutral-500">Risk indicator</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">47d</div>
              <div className="text-sm text-neutral-600">Oldest Active External Access</div>
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <button 
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
                  onClick={() => handleKPIClick('oldest-access')}
                >
                  Review for renewal →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Governance Actions Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
            <div>
              <h3 className="font-semibold text-neutral-900">Recent Governance Actions</h3>
              <p className="text-sm text-neutral-600 mt-0.5">Last 5 decision events across the organization</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Exchange ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Exchange Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Decision Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentActions.map((action) => (
                  <tr 
                    key={action.id} 
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (onNavigateToExchangeDetail) {
                        onNavigateToExchangeDetail(DEFAULT_WORKSPACE_ID, action.exchangeId);
                      }
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-neutral-900">{action.exchangeId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-700">{action.exchangeTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getActionBadge(action.action)}`}>
                        {action.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                          {action.decisionOwner.charAt(0)}
                        </div>
                        <span className="text-sm text-neutral-700">{action.decisionOwner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">{action.timestamp}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Governance Philosophy Statement */}
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 border border-neutral-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">Governance Principles</h4>
              <p className="text-sm text-neutral-700 leading-relaxed">
                This dashboard provides oversight and decision support. All governance actions are human-owned, 
                fully auditable, and designed to balance operational efficiency with compliance requirements. 
                Evidence packages ensure regulatory readiness while respecting operational workflows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}