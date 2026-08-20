import { useState, useEffect } from 'react';
import { 
  X, 
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Mail,
  User
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  order?: number;
}

interface PrepareESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  onSend: (config: any) => void;
  onPrepareDocument: () => void;
}

export function PrepareESignModal({ 
  isOpen, 
  onClose, 
  documents, 
  onSend,
  onPrepareDocument 
}: PrepareESignModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [signingOrder, setSigningOrder] = useState<'any' | 'sequential' | null>(null);
  const [includeMeAsSigner, setIncludeMeAsSigner] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  // Access & Security (identical to Secure Share)
  const [allowDownload, setAllowDownload] = useState(true);
  const [expiryType, setExpiryType] = useState<'hours' | 'datetime'>('hours');
  const [expiryValue, setExpiryValue] = useState('24');
  const [otpEnabled, setOtpEnabled] = useState(true);

  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setSigningOrder(null);
    setIncludeMeAsSigner(false);
    setParticipants([]);
    setAllowDownload(true);
    setExpiryType('hours');
    setExpiryValue('24');
    setOtpEnabled(true);
    setShowValidation(false);
  };

  const addParticipant = () => {
    if (participants.length >= 2) {
      toast.error('Maximum 2 external participants allowed');
      return;
    }
    
    const newParticipant: Participant = {
      id: `P-${Date.now()}`,
      name: '',
      email: '',
      order: signingOrder === 'sequential' ? participants.length + 1 : undefined
    };
    setParticipants([...participants, newParticipant]);
  };

  const updateParticipant = (id: string, field: 'name' | 'email', value: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removeParticipant = (id: string) => {
    const updatedParticipants = participants.filter(p => p.id !== id);
    if (signingOrder === 'sequential') {
      updatedParticipants.forEach((p, idx) => {
        p.order = idx + 1;
      });
    }
    setParticipants(updatedParticipants);
  };

  const validateStep1 = () => {
    if (!signingOrder) return false;
    if (participants.length === 0 && !includeMeAsSigner) return false;
    
    for (const p of participants) {
      if (!p.name.trim() || !p.email.trim()) return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) {
        setShowValidation(true);
        if (!signingOrder) {
          toast.error('Please select a signing order');
        } else if (participants.length === 0 && !includeMeAsSigner) {
          toast.error('Please add at least one participant');
        }
        return;
      }
    }
    if (step === 2) {
      if (expiryType === 'datetime' && !expiryValue) {
        toast.error('Please select an expiry date and time');
        return;
      }
    }
    setStep((step + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getExpiryDisplay = () => {
    if (expiryType === 'hours') {
      return `${expiryValue} Hours`;
    }
    if (!expiryValue) return 'Not set';
    return new Date(expiryValue).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#153240] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-[#243F4D]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#243F4D] flex items-center justify-between">
          <div>
            <h2 className="text-[#ffffff] text-lg font-semibold">Prepare for E-Sign</h2>
            <p className="text-sm text-neutral-400 mt-1">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'} selected
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-[#ffffff] transition-colors p-1 hover:bg-[#243F4D] rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator - Identical to Secure Share */}
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
                Signing Order
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
                Access & Security
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
          {/* Step 1: Signing Setup */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Signing Order - MANDATORY FIRST */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1.5 font-medium">
                    Signing Order <span className="text-rose-400">*</span>
                  </label>
                  <p className="text-xs text-neutral-400 mb-3">
                    Choose how participants will sign. This determines the signing sequence.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-[#1E3A4A] border-2 border-[#243F4D] rounded-lg cursor-pointer hover:border-emerald-500/50 transition-all">
                    <input
                      type="radio"
                      name="signingOrder"
                      value="any"
                      checked={signingOrder === 'any'}
                      onChange={() => {
                        setSigningOrder('any');
                        if (participants.length > 0) {
                          setParticipants(participants.map(p => ({ ...p, order: undefined })));
                        }
                      }}
                      className="mt-0.5 w-4 h-4 text-emerald-500 bg-[#0F2936] border-[#243F4D] focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#ffffff]">Any Order</div>
                      <div className="text-xs text-neutral-400 mt-1">Participants can sign in parallel</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-[#1E3A4A] border-2 border-[#243F4D] rounded-lg cursor-pointer hover:border-emerald-500/50 transition-all">
                    <input
                      type="radio"
                      name="signingOrder"
                      value="sequential"
                      checked={signingOrder === 'sequential'}
                      onChange={() => {
                        setSigningOrder('sequential');
                        if (participants.length > 0) {
                          setParticipants(participants.map((p, idx) => ({ ...p, order: idx + 1 })));
                        }
                      }}
                      className="mt-0.5 w-4 h-4 text-emerald-500 bg-[#0F2936] border-[#243F4D] focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#ffffff]">In Order</div>
                      <div className="text-xs text-neutral-400 mt-1">Participants sign sequentially</div>
                    </div>
                  </label>
                </div>

                {showValidation && !signingOrder && (
                  <p className="text-sm text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Please select a signing order
                  </p>
                )}
              </div>

              {/* Participants Section - Only enabled after signing order selected */}
              {signingOrder && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm text-neutral-300 font-medium">
                        Participants <span className="text-rose-400">*</span>
                      </label>
                      {signingOrder === 'sequential' && (
                        <p className="text-xs text-neutral-400 mt-1">
                          Participants will be notified one at a time based on this order.
                        </p>
                      )}
                    </div>
                    {participants.length < 2 && (
                      <button
                        type="button"
                        onClick={addParticipant}
                        className="h-[36px] px-4 bg-[#1E3A4A] border border-[#243F4D] text-emerald-400 rounded-lg hover:bg-[#243F4D] hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Participant
                      </button>
                    )}
                  </div>

                  {/* Include Me Checkbox */}
                  <div className="flex items-start gap-3 p-3 bg-[#1E3A4A] border border-[#243F4D] rounded-lg">
                    <input
                      type="checkbox"
                      id="include-me"
                      checked={includeMeAsSigner}
                      onChange={(e) => setIncludeMeAsSigner(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-500 bg-[#0F2936] border-[#243F4D] rounded focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="include-me" className="text-sm text-neutral-300 cursor-pointer">
                      Include me as a signer
                    </label>
                  </div>

                  {/* Participant List */}
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {signingOrder === 'sequential' && (
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-[#0F2936] flex items-center justify-center font-bold flex-shrink-0">
                              {participant.order}
                            </div>
                          )}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-neutral-400 mb-1">
                                Name <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                  type="text"
                                  value={participant.name}
                                  onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                                  placeholder="Full name"
                                  className={`w-full pl-9 pr-3 py-2 bg-[#0F2936] border rounded text-sm text-[#ffffff] placeholder-neutral-500 focus:ring-1 focus:ring-emerald-500 outline-none ${
                                    showValidation && !participant.name.trim() ? 'border-rose-500' : 'border-[#243F4D]'
                                  }`}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-neutral-400 mb-1">
                                Email <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                  type="email"
                                  value={participant.email}
                                  onChange={(e) => updateParticipant(participant.id, 'email', e.target.value)}
                                  placeholder="email@example.com"
                                  className={`w-full pl-9 pr-3 py-2 bg-[#0F2936] border rounded text-sm text-[#ffffff] placeholder-neutral-500 focus:ring-1 focus:ring-emerald-500 outline-none ${
                                    showValidation && !participant.email.trim() ? 'border-rose-500' : 'border-[#243F4D]'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeParticipant(participant.id)}
                            className="text-neutral-500 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-500/10 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showValidation && participants.length === 0 && !includeMeAsSigner && (
                    <p className="text-sm text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Please add at least one participant or include yourself as a signer
                    </p>
                  )}

                  {participants.length === 0 && (
                    <div className="border border-dashed border-[#243F4D] rounded-lg p-8 flex flex-col items-center justify-center text-center">
                      <User className="w-10 h-10 text-[#243F4D] mb-3" />
                      <p className="text-sm text-neutral-400">No participants added yet.</p>
                      <p className="text-xs text-neutral-500 mt-1">Click "Add Participant" above to begin.</p>
                    </div>
                  )}
                </div>
              )}

              {!signingOrder && (
                <div className="border border-dashed border-[#243F4D] rounded-lg p-8 flex flex-col items-center justify-center text-center">
                  <AlertTriangle className="w-10 h-10 text-[#243F4D] mb-3" />
                  <p className="text-sm text-neutral-400">Select a signing order to continue</p>
                  <p className="text-xs text-neutral-500 mt-1">Participant entry will be enabled after selection</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Access & Security - IDENTICAL TO SECURE SHARE */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-5">
                <h3 className="text-[#ffffff] font-medium border-b border-[#243F4D] pb-2">Permissions</h3>
                
                {/* Allow Download */}
                <div className="flex items-start gap-3">
                  <Switch 
                    checked={allowDownload}
                    onCheckedChange={setAllowDownload}
                  />
                  <div>
                    <label className="text-sm font-medium text-[#ffffff] block">Allow Download</label>
                    <p className="text-xs text-neutral-400">Recipients can download original files to their device.</p>
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
                      value={expiryType} 
                      onValueChange={(val: 'hours' | 'datetime') => {
                        setExpiryType(val);
                        setExpiryValue(val === 'hours' ? '24' : '');
                      }}
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
                      {expiryType === 'hours' ? 'Duration' : 'Date & Time'}
                    </label>
                    {expiryType === 'hours' ? (
                      <Select 
                        value={expiryValue}
                        onValueChange={setExpiryValue}
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
                          value={expiryValue}
                          onChange={(e) => setExpiryValue(e.target.value)}
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
                      checked={otpEnabled}
                      onChange={(e) => setOtpEnabled(e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-500 bg-[#0F2936] border-[#243F4D] rounded focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div>
                      <label className="text-sm font-medium text-[#ffffff] block">OTP Authentication</label>
                      <p className="text-xs text-neutral-400">Require recipients to verify their identity via email code.</p>
                      
                      {!otpEnabled && (
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

          {/* Step 3: Review & Send - IDENTICAL TO SECURE SHARE */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#ffffff] font-medium text-sm">Ready to Send</h3>
                  <p className="text-xs text-neutral-400">Review your settings before sending.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-3">
                    Participants ({(includeMeAsSigner ? 1 : 0) + participants.length})
                  </h4>
                  <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg overflow-hidden">
                    {includeMeAsSigner && (
                      <div className="p-3 border-b border-[#243F4D]">
                        <div className="text-sm text-[#ffffff] font-medium">You (Current User)</div>
                        <div className="text-xs text-neutral-400">Internal Signer</div>
                      </div>
                    )}
                    {participants.map((participant, i) => (
                      <div 
                        key={participant.id} 
                        className={`p-3 flex items-center gap-3 ${
                          i !== participants.length - 1 || includeMeAsSigner ? 'border-b border-[#243F4D]' : ''
                        }`}
                      >
                        {signingOrder === 'sequential' && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-[#0F2936] flex items-center justify-center text-xs font-bold">
                            {participant.order}
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-[#ffffff] font-medium">{participant.name}</div>
                          <div className="text-xs text-neutral-400">{participant.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-3">Signing Order</h4>
                  <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 mb-4">
                    <p className="text-sm text-[#ffffff]">
                      {signingOrder === 'any' 
                        ? 'Any Order - participants can sign in parallel' 
                        : 'In Order - participants sign sequentially'}
                    </p>
                  </div>

                  <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-3">Configuration</h4>
                  <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Documents</span>
                      <span className="text-[#ffffff] font-medium">{documents.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Download</span>
                      <span className="text-[#ffffff] font-medium">{allowDownload ? 'Allowed' : 'Disabled'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Expiry</span>
                      <span className="text-[#ffffff] font-medium">{getExpiryDisplay()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Security</span>
                      <span className="text-[#ffffff] font-medium">{otpEnabled ? 'OTP Enabled' : 'OTP Disabled'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Identical to Secure Share */}
        <div className="px-6 py-4 border-t border-[#243F4D] flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-neutral-400 hover:text-[#ffffff] transition-colors text-sm font-medium cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-[#1E3A4A] border border-[#243F4D] text-neutral-300 rounded hover:bg-[#243F4D] transition-colors text-sm font-medium cursor-pointer"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-emerald-500 text-[#0F2936] rounded hover:bg-emerald-600 transition-colors text-sm font-bold cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onPrepareDocument}
                className="px-5 py-2 bg-emerald-500 text-[#0F2936] rounded hover:bg-emerald-600 transition-colors text-sm font-bold cursor-pointer"
              >
                Send for Signature
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}