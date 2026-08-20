import { useState, useMemo } from 'react';
import { X, Plus, User, Mail, Phone, Calendar, CheckCircle, Trash2, Search, AlertTriangle, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from './ui/switch';

interface Recipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Customer' | 'Provider' | 'Lender';
}

interface AccessSettings {
  allowDownload: boolean;
  allowUpload: boolean;
  expiryType: 'hours' | 'datetime';
  expiryValue: string; // '24', '48', or ISO date string
  otpEnabled: boolean;
}

interface SecureShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocuments: Array<{ id: string; name: string }>;
  onSuccess: (recipients: Recipient[], settings: AccessSettings, exchangeInfo: { id: string; name: string }) => void;
}

const AVAILABLE_CLIENTS = [
  { id: 'CL-001', name: 'Acme Corp', email: 'contact@acmecorp.com', phone: '(555) 123-4567', type: 'Customer' as const },
  { id: 'CL-002', name: 'Legal Partners LLP', email: 'info@legalpartners.com', phone: '(555) 987-6543', type: 'Provider' as const },
  { id: 'CL-003', name: 'Global Tech', email: 'admin@globaltech.com', phone: '(555) 246-8135', type: 'Customer' as const },
  { id: 'CL-004', name: 'Smith Motors', email: 'sales@smithmotors.com', phone: '(555) 111-2222', type: 'Customer' as const },
  { id: 'CL-005', name: 'Fast Finance', email: 'loans@fastfinance.com', phone: '(555) 333-4444', type: 'Lender' as const },
];

export function SecureShareModal({
  isOpen,
  onClose,
  selectedDocuments,
  onSuccess,
}: SecureShareModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [accessSettings, setAccessSettings] = useState<AccessSettings>({
    allowDownload: true,
    allowUpload: false,
    expiryType: 'hours',
    expiryValue: '24',
    otpEnabled: true,
  });

  // Participant Search State
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  
  // Manual Participant Form
  const [manualParticipant, setManualParticipant] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Customer' as 'Customer' | 'Provider' | 'Lender'
  });

  const filteredClients = useMemo(() => {
    if (!clientSearchQuery) return [];
    return AVAILABLE_CLIENTS.filter(client => 
      client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
    ).filter(client => !recipients.some(r => r.email === client.email));
  }, [clientSearchQuery, recipients]);

  if (!isOpen) return null;

  const handleAddClient = (client: typeof AVAILABLE_CLIENTS[0]) => {
    setRecipients([
      ...recipients,
      { 
        id: `REC-${Date.now()}`,
        name: client.name,
        email: client.email,
        phone: client.phone,
        type: client.type 
      },
    ]);
    setClientSearchQuery('');
    setShowSearchResults(false);
  };

  const handleAddManualParticipant = () => {
    if (!manualParticipant.name || !manualParticipant.email) return;

    setRecipients([
      ...recipients,
      {
        id: `REC-${Date.now()}`,
        name: manualParticipant.name,
        email: manualParticipant.email,
        phone: manualParticipant.phone,
        type: manualParticipant.type
      }
    ]);
    setManualParticipant({ name: '', email: '', phone: '', type: 'Customer' });
    setIsAddingManual(false);
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  const handleNext = () => {
    if (step === 1 && recipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }
    if (step === 2) {
      if (accessSettings.expiryType === 'datetime' && !accessSettings.expiryValue) {
        alert('Please select an expiry date and time');
        return;
      }
    }
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleSend = () => {
    const exchangeNumber = Math.floor(Math.random() * 1000) + 1;
    const exchangeInfo = {
      id: `EX-${new Date().getFullYear()}-${String(exchangeNumber).padStart(4, '0')}`,
      name: `Exchange #${exchangeNumber}`
    };
    onSuccess(recipients, accessSettings, exchangeInfo);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setRecipients([]);
    setAccessSettings({
      allowDownload: true,
      allowUpload: false,
      expiryType: 'hours',
      expiryValue: '24',
      otpEnabled: true,
    });
    setClientSearchQuery('');
    setIsAddingManual(false);
    onClose();
  };

  const getExpiryDisplay = () => {
    if (accessSettings.expiryType === 'hours') {
      return `${accessSettings.expiryValue} Hours`;
    }
    if (!accessSettings.expiryValue) return 'Not set';
    return new Date(accessSettings.expiryValue).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#153240] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-[#243F4D]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#243F4D] flex items-center justify-between">
          <div>
            <h2 className="text-[#ffffff] text-lg font-semibold">Secure Share</h2>
            <p className="text-sm text-neutral-400 mt-1">
              {selectedDocuments.length} {selectedDocuments.length === 1 ? 'document' : 'documents'} selected
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-[#ffffff] transition-colors p-1 hover:bg-[#243F4D] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-[#243F4D]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  step >= 1
                    ? 'bg-emerald-500 text-[#0F2936] font-bold'
                    : 'bg-[#243F4D] text-neutral-400'
                }`}
              >
                1
              </div>
              <span className={`text-sm font-medium ${step === 1 ? 'text-[#ffffff]' : 'text-neutral-400'}`}>
                Choose Participants
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 2 ? 'bg-emerald-500' : 'bg-[#243F4D]'}`} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  step >= 2
                    ? 'bg-emerald-500 text-[#0F2936] font-bold'
                    : 'bg-[#243F4D] text-neutral-400'
                }`}
              >
                2
              </div>
              <span className={`text-sm font-medium ${step === 2 ? 'text-[#ffffff]' : 'text-neutral-400'}`}>
                Access Settings
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 3 ? 'bg-emerald-500' : 'bg-[#243F4D]'}`} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  step >= 3
                    ? 'bg-emerald-500 text-[#0F2936] font-bold'
                    : 'bg-[#243F4D] text-neutral-400'
                }`}
              >
                3
              </div>
              <span className={`text-sm font-medium ${step === 3 ? 'text-[#ffffff]' : 'text-neutral-400'}`}>
                Review & Send
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#243F4D] scrollbar-track-transparent">
          {/* Step 1: Choose Participants */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-end gap-3">
                 <div className="flex-1 relative">
                    <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Add Participants</label>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                            type="text"
                            placeholder="Search existing clients..."
                            value={clientSearchQuery}
                            onChange={(e) => {
                                setClientSearchQuery(e.target.value);
                                setShowSearchResults(true);
                            }}
                            onFocus={() => setShowSearchResults(true)}
                            className="w-full pl-9 pr-4 py-2.5 bg-[#0F2936] border border-[#243F4D] rounded-lg text-sm text-[#ffffff] placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    {/* Autocomplete Results */}
                    {showSearchResults && clientSearchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E3A4A] border border-[#243F4D] rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                            {filteredClients.length > 0 ? (
                                filteredClients.map(client => (
                                    <button
                                        key={client.id}
                                        onClick={() => handleAddClient(client)}
                                        className="w-full text-left px-4 py-3 hover:bg-[#243F4D] flex items-center justify-between group transition-colors"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-[#ffffff]">{client.name}</div>
                                            <div className="text-xs text-neutral-400">{client.email}</div>
                                        </div>
                                        <Plus className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-neutral-400">No clients found</div>
                            )}
                        </div>
                    )}
                 </div>
                 <button
                    onClick={() => setIsAddingManual(true)}
                    className="h-[42px] px-4 bg-[#1E3A4A] border border-[#243F4D] text-emerald-400 rounded-lg hover:bg-[#243F4D] hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                 >
                    <Plus className="w-4 h-4" />
                    Add Participant
                 </button>
              </div>

              {/* Manual Entry Form */}
              {isAddingManual && (
                  <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[#ffffff] font-medium text-sm">New Participant Details</h4>
                          <button onClick={() => setIsAddingManual(false)} className="text-neutral-400 hover:text-[#ffffff]"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs text-neutral-400 mb-1">Name</label>
                              <input 
                                  type="text" 
                                  value={manualParticipant.name}
                                  onChange={e => setManualParticipant({...manualParticipant, name: e.target.value})}
                                  className="w-full px-3 py-2 bg-[#0F2936] border border-[#243F4D] rounded text-sm text-[#ffffff] focus:ring-1 focus:ring-emerald-500 outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs text-neutral-400 mb-1">Email</label>
                              <input 
                                  type="email" 
                                  value={manualParticipant.email}
                                  onChange={e => setManualParticipant({...manualParticipant, email: e.target.value})}
                                  className="w-full px-3 py-2 bg-[#0F2936] border border-[#243F4D] rounded text-sm text-[#ffffff] focus:ring-1 focus:ring-emerald-500 outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs text-neutral-400 mb-1">Phone (Optional)</label>
                              <input 
                                  type="text" 
                                  value={manualParticipant.phone}
                                  onChange={e => setManualParticipant({...manualParticipant, phone: e.target.value})}
                                  className="w-full px-3 py-2 bg-[#0F2936] border border-[#243F4D] rounded text-sm text-[#ffffff] focus:ring-1 focus:ring-emerald-500 outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs text-neutral-400 mb-1">Type</label>
                              <Select 
                                value={manualParticipant.type} 
                                onValueChange={(val: any) => setManualParticipant({...manualParticipant, type: val})}
                              >
                                  <SelectTrigger className="w-full bg-[#0F2936] border-[#243F4D] text-[#ffffff] h-[38px]">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#1E3A4A] border-[#243F4D] text-[#ffffff]">
                                      <SelectItem value="Customer">Customer</SelectItem>
                                      <SelectItem value="Provider">Provider</SelectItem>
                                      <SelectItem value="Lender">Lender</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                      <div className="flex justify-end">
                          <button 
                            onClick={handleAddManualParticipant}
                            disabled={!manualParticipant.name || !manualParticipant.email}
                            className="px-4 py-2 bg-emerald-500 text-[#0F2936] rounded text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
                          >
                              Add to List
                          </button>
                      </div>
                  </div>
              )}

              {/* Recipients List */}
              <div className="space-y-3">
                 <h3 className="text-sm font-medium text-neutral-300">Selected Participants ({recipients.length})</h3>
                 
                 {recipients.length === 0 ? (
                    <div className="border border-dashed border-[#243F4D] rounded-lg p-8 flex flex-col items-center justify-center text-center">
                        <User className="w-10 h-10 text-[#243F4D] mb-3" />
                        <p className="text-sm text-neutral-400">No participants added yet.</p>
                        <p className="text-xs text-neutral-500 mt-1">Search or add manually above.</p>
                    </div>
                 ) : (
                    <div className="grid gap-3">
                        {recipients.map((recipient) => (
                            <div key={recipient.id} className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#0F2936] flex items-center justify-center text-emerald-500 font-bold border border-[#243F4D]">
                                        {recipient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-[#ffffff]">{recipient.name}</div>
                                        <div className="text-xs text-neutral-400 flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {recipient.email}</span>
                                            {recipient.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {recipient.phone}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-sm text-neutral-300 font-medium px-3 py-1 bg-[#0F2936] rounded border border-[#243F4D]">
                                        {recipient.type}
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveRecipient(recipient.id)}
                                        className="text-neutral-500 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-500/10"
                                        title="Remove participant"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
              </div>
            </div>
          )}

          {/* Step 2: Access Settings */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-5">
                <h3 className="text-[#ffffff] font-medium border-b border-[#243F4D] pb-2">Permissions</h3>
                {/* Allow Download */}
                <div className="flex items-start gap-3">
                    <Switch 
                        checked={accessSettings.allowDownload}
                        onCheckedChange={(c) => setAccessSettings({...accessSettings, allowDownload: c})}
                    />
                    <div>
                        <label className="text-sm font-medium text-[#ffffff] block">Allow Download</label>
                        <p className="text-xs text-neutral-400">Recipients can download original files to their device.</p>
                    </div>
                </div>

                {/* Allow Upload */}
                <div className="flex items-start gap-3">
                    <Switch 
                        checked={accessSettings.allowUpload}
                        onCheckedChange={(c) => setAccessSettings({...accessSettings, allowUpload: c})}
                    />
                    <div>
                        <label className="text-sm font-medium text-[#ffffff] block">Allow Upload</label>
                        <p className="text-xs text-neutral-400">Recipients can upload documents back to the workspace.</p>
                    </div>
                </div>
              </div>

              <div className="space-y-5">
                 <h3 className="text-[#ffffff] font-medium border-b border-[#243F4D] pb-2">Link Security</h3>
                 
                 {/* Expiry */}
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-xs text-neutral-400 mb-1.5">Expiry Type</label>
                         <Select 
                            value={accessSettings.expiryType} 
                            onValueChange={(val: 'hours' | 'datetime') => setAccessSettings({
                                ...accessSettings, 
                                expiryType: val,
                                expiryValue: val === 'hours' ? '24' : '' 
                            })}
                         >
                            <SelectTrigger className="bg-[#0F2936] border-[#243F4D] text-[#ffffff]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1E3A4A] border-[#243F4D] text-[#ffffff]">
                                <SelectItem value="hours">Duration (Hours)</SelectItem>
                                <SelectItem value="datetime">Date & Time</SelectItem>
                            </SelectContent>
                         </Select>
                     </div>
                     <div>
                        <label className="block text-xs text-neutral-400 mb-1.5">
                            {accessSettings.expiryType === 'hours' ? 'Duration' : 'Date & Time'}
                        </label>
                        {accessSettings.expiryType === 'hours' ? (
                            <Select 
                                value={accessSettings.expiryValue}
                                onValueChange={(val) => setAccessSettings({...accessSettings, expiryValue: val})}
                            >
                                <SelectTrigger className="bg-[#0F2936] border-[#243F4D] text-[#ffffff]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1E3A4A] border-[#243F4D] text-[#ffffff]">
                                    <SelectItem value="24">24 Hours</SelectItem>
                                    <SelectItem value="48">48 Hours</SelectItem>
                                    <SelectItem value="72">72 Hours</SelectItem>
                                    <SelectItem value="168">7 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="relative">
                                <input 
                                    type="datetime-local"
                                    value={accessSettings.expiryValue}
                                    onChange={(e) => setAccessSettings({...accessSettings, expiryValue: e.target.value})}
                                    className="w-full px-3 py-2 pl-9 bg-[#0F2936] border border-[#243F4D] rounded-md text-sm text-[#ffffff] focus:ring-1 focus:ring-emerald-500 outline-none [color-scheme:dark]"
                                />
                                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        )}
                     </div>
                 </div>

                 {/* OTP Authentication */}
                 <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <input 
                            type="checkbox"
                            checked={accessSettings.otpEnabled}
                            onChange={(e) => setAccessSettings({...accessSettings, otpEnabled: e.target.checked})}
                            className="mt-1 w-4 h-4 text-emerald-500 bg-[#0F2936] border-[#243F4D] rounded focus:ring-emerald-500 focus:ring-offset-0"
                        />
                        <div>
                            <label className="text-sm font-medium text-[#ffffff] block">OTP Authentication</label>
                            <p className="text-xs text-neutral-400">Require recipients to verify their identity via email code.</p>
                            
                            {!accessSettings.otpEnabled && (
                                <div className="flex items-center gap-2 mt-2 text-amber-500 text-xs bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                    <AlertTriangle className="w-3 h-3" />
                                    Warning: Disabling OTP makes the link accessible to anyone who has it.
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                      <h3 className="text-[#ffffff] font-medium text-sm">Ready to Share</h3>
                      <p className="text-xs text-neutral-400">Review your settings before sending.</p>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                  <div>
                      <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-3">Recipients ({recipients.length})</h4>
                      <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg overflow-hidden">
                          {recipients.map((recipient, i) => (
                              <div key={recipient.id} className={`p-3 flex items-center justify-between ${i !== recipients.length - 1 ? 'border-b border-[#243F4D]' : ''}`}>
                                  <div>
                                      <div className="text-sm text-[#ffffff] font-medium">{recipient.name}</div>
                                      <div className="text-xs text-neutral-400">{recipient.email}</div>
                                  </div>
                                  <span className="text-xs bg-[#0F2936] text-emerald-400 px-2 py-0.5 rounded border border-[#243F4D]">{recipient.type}</span>
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  <div>
                      <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-3">Configuration</h4>
                      <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-3">
                          <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Documents</span>
                              <span className="text-[#ffffff]">{selectedDocuments.length} Selected</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Download</span>
                              <span className={accessSettings.allowDownload ? 'text-emerald-400' : 'text-rose-400'}>
                                  {accessSettings.allowDownload ? 'Allowed' : 'Forbidden'}
                              </span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Upload</span>
                              <span className={accessSettings.allowUpload ? 'text-emerald-400' : 'text-neutral-500'}>
                                  {accessSettings.allowUpload ? 'Allowed' : 'Disabled'}
                              </span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Expiry</span>
                              <span className="text-[#ffffff] flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {getExpiryDisplay()}
                              </span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Security</span>
                              <span className={accessSettings.otpEnabled ? 'text-emerald-400' : 'text-amber-400'}>
                                  {accessSettings.otpEnabled ? 'OTP Enabled' : 'Public Link'}
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#243F4D] flex items-center justify-between bg-[#153240]">
          <button
            onClick={step === 1 ? handleClose : handleBack}
            className="px-4 py-2 text-sm text-neutral-300 hover:text-[#ffffff] hover:bg-[#243F4D] rounded-lg transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={step === 3 ? handleSend : handleNext}
            className="px-6 py-2 text-sm bg-emerald-500 text-[#0F2936] rounded-lg hover:bg-emerald-600 transition-colors font-bold shadow-lg shadow-emerald-900/20"
          >
            {step === 3 ? 'Send Secure Link' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
}
