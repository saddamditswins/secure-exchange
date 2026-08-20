import { useState } from 'react';
import { 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const integrations = [
  {
    id: 'dealertrack',
    name: 'Dealertrack DMS',
    description: 'Sync customer data and deal jackets directly from Dealertrack.',
    status: 'Active', // 'Not Configured', 'Pending Validation', 'Active', 'Error', 'Disabled'
    icon: 'DT', // Placeholder for logo
    lastSync: '10 mins ago'
  }
];

export function IntegrationsSettings() {
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [dealerId, setDealerId] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleOpenSettings = (integration: typeof integrations[0]) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
    setAgreedToTerms(false);
    setDealerId(integration.id === 'dealertrack' && integration.status === 'Active' ? 'DT-998877' : '');
  };

  const handleSave = () => {
    setIsValidating(true);
    // Simulate validation
    setTimeout(() => {
      setIsValidating(false);
      setIsModalOpen(false);
      console.log('Audit Event: IntegrationConfigured', { integration: selectedIntegration?.name, dealerId, actor: 'OrgAdmin' });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3" /> Active</span>;
      case 'Not Configured':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">Not Configured</span>;
      case 'Pending Validation':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><AlertCircle className="w-3 h-3" /> Pending</span>;
      case 'Error':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><XCircle className="w-3 h-3" /> Error</span>;
      case 'Disabled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-400">Disabled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900">Integrations</h2>
        <p className="text-neutral-500 mt-1">Connect Secure Exchange with your existing ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {integration.icon}
              </div>
              <button 
                onClick={() => handleOpenSettings(integration)}
                className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-medium text-neutral-900 mb-2">{integration.name}</h3>
            <p className="text-sm text-neutral-500 mb-6 h-10 line-clamp-2">
              {integration.description}
            </p>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              {getStatusBadge(integration.status)}
              {integration.status === 'Active' && (
                <span className="text-xs text-neutral-400">Synced {integration.lastSync}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Settings Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              {selectedIntegration?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {selectedIntegration?.id === 'dealertrack' && (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                  <div className="bg-blue-100 p-1 rounded text-blue-600 h-fit">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Authorization Required</p>
                    <p>You will need your Dealer ID and an API Key from your Dealertrack Admin Portal.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Dealer ID <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={dealerId}
                    onChange={(e) => setDealerId(e.target.value)}
                    placeholder="e.g. DT-12345"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-2">
                   <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-neutral-300" 
                    />
                    <span className="text-sm text-neutral-600 leading-snug">
                      I agree to the <span className="underline text-neutral-900">Terms & Conditions</span> for data synchronization between Secure Exchange and Dealertrack DMS.
                    </span>
                  </label>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={selectedIntegration?.id === 'dealertrack' && (!agreedToTerms || !dealerId || isValidating)}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isValidating && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save & Validate
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
