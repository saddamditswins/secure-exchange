import { useState, useEffect } from 'react';
import { FeatureToggle } from './FeatureToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SuperAdminCreateTenantProps {
  initialData?: any;
  onBack: () => void;
  onCreate: () => void;
  isEdit?: boolean;
  className?: string;
  contentClassName?: string;
  scrollable?: boolean;
  theme?: 'light' | 'dark';
}

export function SuperAdminCreateTenant({ 
  initialData, 
  onBack, 
  onCreate, 
  isEdit = false, 
  className, 
  contentClassName, 
  scrollable = true,
  theme = 'light' 
}: SuperAdminCreateTenantProps) {
  const [formData, setFormData] = useState({
    orgName: '',
    region: '',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
    eSignEnabled: true,
    aiToolsEnabled: false,
    advancedAuditLogsEnabled: false,
    dealertrackDMSEnabled: false,
    dealertrackFIEnabled: false,
  });

  const isDark = theme === 'dark';

  // Theme-based classes
  const textPrimary = isDark ? 'text-[#FFFFFF]' : 'text-neutral-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-neutral-700';
  const textMuted = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const bgCard = isDark ? 'bg-[#1E3A4A]' : 'bg-white';
  const borderCard = isDark ? 'border-[#243F4D]' : 'border-neutral-200';
  const inputBg = isDark ? 'bg-[#0F2936]' : 'bg-white';
  const inputBorder = isDark ? 'border-[#243F4D]' : 'border-neutral-200';
  const inputRing = isDark ? 'focus:ring-emerald-500' : 'focus:ring-neutral-900';
  const inputScheme = isDark ? '[color-scheme:dark]' : '';

  useEffect(() => {
    if (initialData) {
      setFormData({
        orgName: initialData.orgName || '',
        region: initialData.region || '',
        adminEmail: initialData.adminEmail || '',
        adminFirstName: initialData.adminFirstName || '', 
        adminLastName: initialData.adminLastName || '',
        eSignEnabled: initialData.eSignEnabled ?? true,
        aiToolsEnabled: initialData.aiToolsEnabled ?? false,
        advancedAuditLogsEnabled: initialData.advancedAuditLogsEnabled ?? false,
        dealertrackDMSEnabled: initialData.dealertrackDMSEnabled ?? false,
        dealertrackFIEnabled: initialData.dealertrackFIEnabled ?? false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  return (
    <div className={`${scrollable ? 'h-full flex flex-col' : ''} ${className || ''} ${isDark ? 'text-[#FFFFFF]' : ''}`}>
      <div className={`${scrollable ? 'flex-1 overflow-y-auto' : ''} ${contentClassName || 'px-1'}`}>
        <form id="org-form" onSubmit={handleSubmit} className="space-y-6 pb-6 pt-2">
          
          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className={`text-sm font-medium ${isDark ? 'text-[#FFFFFF]' : 'text-neutral-900'} uppercase tracking-wide`}>Organization Details</h3>
            
            <div className={`${bgCard} border ${borderCard} rounded-lg p-4 space-y-4`}>
              <div>
                <label htmlFor="orgName" className={`block text-sm ${textSecondary} mb-2`}>
                  Organization Name *
                </label>
                <input
                  id="orgName"
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={(e) => handleChange('orgName', e.target.value)}
                  placeholder="e.g., Acme Financial Services"
                  className={`w-full px-4 py-2.5 border ${inputBorder} rounded-lg ${isDark ? 'text-[#FFFFFF] placeholder:text-neutral-500' : 'text-neutral-900'} focus:outline-none focus:ring-2 ${inputRing} ${inputBg} ${inputScheme}`}
                />
              </div>

              <div>
                <label htmlFor="region" className={`block text-sm ${textSecondary} mb-2`}>
                  Region *
                </label>
                <div className={isDark ? "dark-select-wrapper" : ""}>
                  <Select 
                    value={formData.region} 
                    onValueChange={(val) => handleChange('region', val)}
                  >
                    <SelectTrigger className={`w-full h-[42px] border ${inputBorder} ${inputBg} ${isDark ? 'text-[#FFFFFF]' : 'text-neutral-900'}`}>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent className={`${inputBg} ${borderCard} ${isDark ? 'text-[#FFFFFF]' : ''}`}>
                      <SelectItem value="US-East" className={isDark ? 'focus:bg-[#243F4D] focus:text-[#FFFFFF]' : ''}>US-East</SelectItem>
                      <SelectItem value="US-West" className={isDark ? 'focus:bg-[#243F4D] focus:text-[#FFFFFF]' : ''}>US-West</SelectItem>
                      <SelectItem value="EU-West" className={isDark ? 'focus:bg-[#243F4D] focus:text-[#FFFFFF]' : ''}>EU-West</SelectItem>
                      <SelectItem value="APAC" className={isDark ? 'focus:bg-[#243F4D] focus:text-[#FFFFFF]' : ''}>APAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Info - Only show for create or if specifically editable */}
          {!isEdit && (
            <div className="space-y-4">
              <h3 className={`text-sm font-medium ${isDark ? 'text-[#FFFFFF]' : 'text-neutral-900'} uppercase tracking-wide`}>Organization Admin</h3>
              
              <div className={`${bgCard} border ${borderCard} rounded-lg p-4 space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adminFirstName" className={`block text-sm ${textSecondary} mb-2`}>
                      First Name *
                    </label>
                    <input
                      id="adminFirstName"
                      type="text"
                      required
                      value={formData.adminFirstName}
                      onChange={(e) => handleChange('adminFirstName', e.target.value)}
                      placeholder="John"
                      className={`w-full px-4 py-2.5 border ${inputBorder} rounded-lg ${isDark ? 'text-[#FFFFFF] placeholder:text-neutral-500' : 'text-neutral-900'} focus:outline-none focus:ring-2 ${inputRing} ${inputBg} ${inputScheme}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="adminLastName" className={`block text-sm ${textSecondary} mb-2`}>
                      Last Name *
                    </label>
                    <input
                      id="adminLastName"
                      type="text"
                      required
                      value={formData.adminLastName}
                      onChange={(e) => handleChange('adminLastName', e.target.value)}
                      placeholder="Doe"
                      className={`w-full px-4 py-2.5 border ${inputBorder} rounded-lg ${isDark ? 'text-[#FFFFFF] placeholder:text-neutral-500' : 'text-neutral-900'} focus:outline-none focus:ring-2 ${inputRing} ${inputBg} ${inputScheme}`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="adminEmail" className={`block text-sm ${textSecondary} mb-2`}>
                    Admin Email *
                  </label>
                  <input
                    id="adminEmail"
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={(e) => handleChange('adminEmail', e.target.value)}
                    placeholder="admin@company.com"
                    className={`w-full px-4 py-2.5 border ${inputBorder} rounded-lg ${isDark ? 'text-[#FFFFFF] placeholder:text-neutral-500' : 'text-neutral-900'} focus:outline-none focus:ring-2 ${inputRing} ${inputBg} ${inputScheme}`}
                  />
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Will receive setup instructions and admin privileges
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="space-y-4">
            <h3 className={`text-sm font-medium ${isDark ? 'text-[#FFFFFF]' : 'text-neutral-900'} uppercase tracking-wide`}>Features & Settings</h3>
            
            <div className={`${bgCard} border ${borderCard} rounded-lg p-4 space-y-3`}>
              <FeatureToggle 
                label="E-Sign" 
                description="Digital signature capabilities"
                checked={formData.eSignEnabled}
                onChange={() => handleToggle('eSignEnabled')}
                color="blue"
              />
              <FeatureToggle 
                label="AI Tools" 
                description="AI-powered risk assessment"
                checked={formData.aiToolsEnabled}
                onChange={() => handleToggle('aiToolsEnabled')}
                color="purple"
              />
              <FeatureToggle 
                label="Advanced Audit Logs" 
                description="Detailed compliance reporting"
                checked={formData.advancedAuditLogsEnabled}
                onChange={() => handleToggle('advancedAuditLogsEnabled')}
                color="green"
              />
            </div>
          </div>

          {/* Integrations */}
          <div className="space-y-4">
            <h3 className={`text-sm font-medium ${isDark ? 'text-[#FFFFFF]' : 'text-neutral-900'} uppercase tracking-wide`}>Integrations</h3>
            
            <div className={`${bgCard} border ${borderCard} rounded-lg p-4 space-y-3`}>
              <FeatureToggle 
                label="Dealertrack DMS" 
                description="Dealer Management System"
                checked={formData.dealertrackDMSEnabled}
                onChange={() => handleToggle('dealertrackDMSEnabled')}
                color="orange"
              />
              <FeatureToggle 
                label="Dealertrack F&I" 
                description="Finance & Insurance"
                checked={formData.dealertrackFIEnabled}
                onChange={() => handleToggle('dealertrackFIEnabled')}
                color="teal"
              />
            </div>
          </div>

          {!isEdit && (
            <div className={`${isDark ? 'bg-amber-900/20 border-amber-700/50' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4 flex gap-3`}>
              <svg className={`w-5 h-5 ${isDark ? 'text-amber-500' : 'text-amber-600'} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
                This will provision a new isolated environment. This action cannot be undone.
              </p>
            </div>
          )}
        </form>
      </div>

      <div className={`py-4 mt-auto border-t ${isDark ? 'border-[#243F4D] bg-[#153240]' : 'border-neutral-200 bg-white'} flex justify-end gap-3 z-10 px-6`}>
        <button
          type="button"
          onClick={onBack}
          className={`px-4 py-2 border rounded-lg transition-colors cursor-pointer ${
            isDark 
              ? 'bg-[#1E3A4A] border-[#243F4D] text-[#FFFFFF] hover:bg-[#243F4D]' 
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer font-medium"
        >
          {isEdit ? 'Save Changes' : 'Create Organization'}
        </button>
      </div>
    </div>
  );
}
