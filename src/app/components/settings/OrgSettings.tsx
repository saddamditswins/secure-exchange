import { useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Building2, 
  Globe, 
  Shield, 
  Clock, 
  AlertTriangle,
  Save,
  CheckCircle2,
  Lock,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function OrgSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    // ponytail: stubbed save delay -- always succeeds. Swap for the real call
    // once there is a backend, and surface failures with toast.error.
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Organization settings saved');
    }, 1000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Organization Settings</h2>
          <p className="text-neutral-500 mt-1">Manage governance, defaults, and compliance policies.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isSaving ? (
            <>
              <span className="w-3 h-3 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
            </>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 w-full justify-start bg-neutral-100 p-1 border border-neutral-200">
          <TabsTrigger value="general" className="flex items-center gap-2 px-4 cursor-pointer">
            <Building2 className="w-4 h-4" /> General Info
          </TabsTrigger>
          <TabsTrigger value="exchange" className="flex items-center gap-2 px-4 cursor-pointer">
            <Globe className="w-4 h-4" /> Exchange Defaults
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 px-4 cursor-pointer">
            <Shield className="w-4 h-4" /> Security & Compliance
          </TabsTrigger>
        </TabsList>

        {/* 1.1 General Information */}
        <TabsContent value="general" className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-neutral-500" />
              Organization Profile
            </h3>
            
            {/* Logo Upload Section */}
            <div className="mb-8 p-4 border border-neutral-100 bg-neutral-50 rounded-lg">
               <label className="block text-sm font-medium text-neutral-700 mb-3">Organization Logo</label>
               <div className="flex items-start gap-6">
                 <div className="w-24 h-24 bg-white border border-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative group">
                   {logoPreview ? (
                     <>
                       <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                            onClick={handleRemoveLogo}
                            className="p-1 bg-white rounded-full text-rose-600 hover:text-rose-700 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                       </div>
                     </>
                   ) : (
                     <ImageIcon className="w-8 h-8 text-neutral-300" />
                   )}
                 </div>
                 
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                     <label className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors inline-flex items-center gap-2">
                       <Upload className="w-4 h-4" />
                       Upload New Logo
                       <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                     </label>
                     {logoPreview && (
                       <button 
                         onClick={handleRemoveLogo}
                         className="px-4 py-2 text-rose-600 text-sm font-medium hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                       >
                         Remove
                       </button>
                     )}
                   </div>
                   <p className="text-xs text-neutral-500">
                     Recommended size: 512x512px. Supported formats: PNG, JPG. Max size: 2MB.
                   </p>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Organization Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  defaultValue="Acme Financial Services" 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Legal Entity Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  defaultValue="Acme Financial Services, LLC" 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Primary Contact Email <span className="text-rose-500">*</span></label>
                <input 
                  type="email" 
                  defaultValue="admin@acmefinancial.com" 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Timezone <span className="text-rose-500">*</span></label>
                <Select defaultValue="Eastern Time (US & Canada)">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eastern Time (US & Canada)">Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="Central Time (US & Canada)">Central Time (US & Canada)</SelectItem>
                    <SelectItem value="Mountain Time (US & Canada)">Mountain Time (US & Canada)</SelectItem>
                    <SelectItem value="Pacific Time (US & Canada)">Pacific Time (US & Canada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  Data Residency Region
                  <Lock className="w-3 h-3 text-neutral-400" />
                </label>
                <input 
                  type="text" 
                  defaultValue="US-East (Virginia)" 
                  readOnly
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 1.2 Exchange Defaults */}
        <TabsContent value="exchange" className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-neutral-500" />
              Default Enforcement Behavior
            </h3>
            <p className="text-sm text-neutral-500 mb-8">
              These settings define the baseline security posture for all external document exchanges.
            </p>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-neutral-100">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Default Access Expiry (Days) <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    defaultValue="7"
                    min="1"
                    max="90"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                  <p className="text-xs text-neutral-500">Value enforced at decision time</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Minimum Expiry (Days) <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    defaultValue="1"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Maximum Expiry (Days) <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    defaultValue="30"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                  <p className="text-xs text-neutral-500">Cannot exceed global limit (90 days)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-neutral-900 uppercase tracking-wide">Default Permissions</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="text-sm text-neutral-700">View Only</span>
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Always Enabled</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <span className="text-sm text-neutral-700">Download Allowed</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <span className="text-sm text-neutral-700">Signing Allowed</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-neutral-900 uppercase tracking-wide">Authentication</h4>
                  
                  <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-neutral-700">OTP Authentication Required</span>
                      <p className="text-xs text-neutral-500 mt-1">When enabled, all external participants must verify via OTP</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-neutral-900 rounded border-neutral-300 focus:ring-neutral-900 ml-3" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 1.3 Security & Compliance */}
        <TabsContent value="security" className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-neutral-500" />
              Governance Rules
            </h3>

            <div className="space-y-8">
              {/* Approval Rules */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-neutral-900 uppercase tracking-wide">Explicit Approvals</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <span className="text-sm text-neutral-700">Require approval for External Sharing</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-neutral-900 rounded border-neutral-300 focus:ring-neutral-900" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <span className="text-sm text-neutral-700">Require approval for External Signing</span>
                    <input type="checkbox" className="w-4 h-4 text-neutral-900 rounded border-neutral-300 focus:ring-neutral-900" />
                  </label>
                </div>
              </div>

              {/* Revocation Rules */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-neutral-900 uppercase tracking-wide">Revocation Policy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Who can revoke access?</label>
                    <Select defaultValue="Org Admins Only">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Org Admins Only">Org Admins Only</SelectItem>
                        <SelectItem value="Document Owners & Org Admins">Document Owners & Org Admins</SelectItem>
                        <SelectItem value="Any Staff Member">Any Staff Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-neutral-900 rounded border-neutral-300 focus:ring-neutral-900" />
                      <span className="text-sm text-neutral-700">Mandatory reason required on revocation</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Retention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Audit Retention Duration <span className="text-rose-500">*</span></label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      defaultValue="7" 
                      className="w-24 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <span className="text-sm text-neutral-500">Years</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Re-authentication Frequency <span className="text-rose-500">*</span></label>
                  <Select defaultValue="Every 7 Days">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Every 24 Hours">Every 24 Hours</SelectItem>
                      <SelectItem value="Every Access">Every Access</SelectItem>
                      <SelectItem value="Every 7 Days">Every 7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="bg-neutral-50 rounded-xl p-6 mt-6 border border-neutral-200">
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-4">Active Compliance Controls</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-neutral-700">Audit Immutability Enforced</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-neutral-700">Decision Record Immutability</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">AI Advisory Only (No Auto-Action)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}