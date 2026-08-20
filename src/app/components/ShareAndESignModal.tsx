import { useState } from 'react';
import { X, Plus, User, Mail, Phone, Calendar, CheckCircle, FileSignature } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  linkExpiry: string;
  authMethod: string;
}

interface ShareAndESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocuments: Array<{ id: string; name: string }>;
  onContinueToEditor: (recipients: Recipient[], settings: AccessSettings) => void;
}

const AVAILABLE_CLIENTS = [
  { id: 'cli_1', name: 'Acme Corp', email: 'contact@acmecorp.com', phone: '(555) 123-4567', type: 'Customer' },
  { id: 'cli_2', name: 'Global Tech', email: 'admin@globaltech.com', phone: '(555) 987-6543', type: 'Customer' },
  { id: 'cli_3', name: 'Legal Partners LLP', email: 'info@legalpartners.com', phone: '(555) 246-8135', type: 'Provider' },
  { id: 'cli_4', name: 'City Bank', email: 'loans@citybank.com', phone: '(555) 369-2580', type: 'Lender' },
] as const;

export function ShareAndESignModal({
  isOpen,
  onClose,
  selectedDocuments,
  onContinueToEditor,
}: ShareAndESignModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [accessSettings, setAccessSettings] = useState<AccessSettings>({
    allowDownload: true, // Default from org settings
    allowUpload: false, // Default from org settings
    linkExpiry: '', // Will be set by user
    authMethod: 'Email OTP (Org Policy)', // Read-only from org policy
  });

  const [newRecipient, setNewRecipient] = useState<Recipient>({
    id: '',
    name: '',
    email: '',
    phone: '',
    type: 'Customer',
  });

  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  if (!isOpen) return null;

  const handleAddRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      setRecipients([
        ...recipients,
        { ...newRecipient, id: `REC-${Date.now()}` },
      ]);
      setNewRecipient({
        id: '',
        name: '',
        email: '',
        phone: '',
        type: 'Customer',
      });
      setIsAddingRecipient(false);
    }
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  const handleUpdateRecipientType = (id: string, type: 'Customer' | 'Provider' | 'Lender') => {
    setRecipients(
      recipients.map((r) => (r.id === id ? { ...r, type } : r))
    );
  };

  const handleNext = () => {
    if (step === 1 && recipients.length === 0) {
      alert('Please add at least one participant');
      return;
    }
    if (step === 2 && !accessSettings.linkExpiry) {
      alert('Please select a link expiry date');
      return;
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

  const handleContinue = () => {
    onContinueToEditor(recipients, accessSettings);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setRecipients([]);
    setAccessSettings({
      allowDownload: true,
      allowUpload: false,
      linkExpiry: '',
      authMethod: 'Email OTP (Org Policy)',
    });
    setIsAddingRecipient(false);
    setSelectedClientId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#153240] rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-[#243F4D]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#243F4D] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[#FFFFFF]">Share & eSign</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-purple-900/50 text-purple-200 border border-purple-700">
                <FileSignature className="w-3.5 h-3.5" />
                Signing Required
              </span>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              {selectedDocuments.length} {selectedDocuments.length === 1 ? 'document' : 'documents'} selected
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-[#FFFFFF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-[#243F4D]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= 1
                    ? 'bg-emerald-500 text-[#0F2936] font-medium'
                    : 'bg-[#243F4D] text-neutral-400'
                }`}
              >
                1
              </div>
              <span className={`text-sm ${step === 1 ? 'text-[#FFFFFF]' : 'text-neutral-400'}`}>
                Choose Participants
              </span>
            </div>
            <div className="flex-1 h-px bg-[#243F4D] mx-4" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= 2
                    ? 'bg-emerald-500 text-[#0F2936] font-medium'
                    : 'bg-[#243F4D] text-neutral-400'
                }`}
              >
                2
              </div>
              <span className={`text-sm ${step === 2 ? 'text-[#FFFFFF]' : 'text-neutral-400'}`}>
                Access Settings
              </span>
            </div>
            <div className="flex-1 h-px bg-[#243F4D] mx-4" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= 3
                    ? 'bg-emerald-500 text-[#0F2936] font-medium'
                    : 'bg-[#243F4D] text-neutral-400'
                }`}
              >
                3
              </div>
              <span className={`text-sm ${step === 3 ? 'text-[#FFFFFF]' : 'text-neutral-400'}`}>
                Review & Continue
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#243F4D] scrollbar-track-transparent">
          {/* Step 1: Choose Participants */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#FFFFFF]">Participants</h3>
                <button
                  onClick={() => setIsAddingRecipient(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-[#0F2936] rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Participant
                </button>
              </div>

              {/* Add Recipient Form */}
              {isAddingRecipient && (
                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-300 mb-1">
                      Select Client
                    </label>
                    <Select
                      value={selectedClientId || "placeholder"}
                      onValueChange={(value) => {
                        const clientId = value === "placeholder" ? "" : value;
                        setSelectedClientId(clientId);
                        if (clientId) {
                          const client = AVAILABLE_CLIENTS.find(c => c.id === clientId);
                          if (client) {
                            setNewRecipient({
                              id: '',
                              name: client.name,
                              email: client.email,
                              phone: client.phone,
                              type: client.type,
                            });
                          }
                        } else {
                          setNewRecipient({
                            id: '',
                            name: '',
                            email: '',
                            phone: '',
                            type: 'Customer',
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full border-[#243F4D] bg-[#0F2936] text-[#FFFFFF] focus:ring-emerald-500">
                        <SelectValue placeholder="Select a client..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E3A4A] border-[#243F4D] text-[#FFFFFF]">
                        <SelectItem value="placeholder" className="text-neutral-400 focus:bg-[#243F4D] focus:text-[#FFFFFF]">Select a client...</SelectItem>
                        {AVAILABLE_CLIENTS.map((client) => (
                          <SelectItem key={client.id} value={client.id} className="focus:bg-[#243F4D] focus:text-[#FFFFFF] text-[#FFFFFF]">
                            {client.name} ({client.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setIsAddingRecipient(false)}
                      className="px-4 py-2 text-sm text-neutral-300 hover:bg-[#243F4D] rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRecipient}
                      disabled={!newRecipient.name || !newRecipient.email}
                      className="px-4 py-2 text-sm bg-emerald-500 text-[#0F2936] rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Recipients List */}
              {recipients.length === 0 && !isAddingRecipient && (
                <div className="text-center py-12 bg-[#1E3A4A] rounded-lg border border-[#243F4D]">
                  <User className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
                  <p className="text-sm text-neutral-300">No participants added</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add participants who will sign documents
                  </p>
                </div>
              )}

              {recipients.length > 0 && (
                <div className="space-y-4">
                  {recipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 grid grid-cols-[1fr_2fr_1fr] gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-neutral-400" />
                              <span className="text-xs text-neutral-400">Name</span>
                            </div>
                            <p className="text-sm text-[#FFFFFF] truncate" title={recipient.name}>{recipient.name}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="w-4 h-4 text-neutral-400" />
                              <span className="text-xs text-neutral-400">Email</span>
                            </div>
                            <p className="text-sm text-[#FFFFFF] truncate" title={recipient.email}>{recipient.email}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Phone className="w-4 h-4 text-neutral-400" />
                              <span className="text-xs text-neutral-400">Phone</span>
                            </div>
                            <p className="text-sm text-[#FFFFFF]">
                              {recipient.phone || '—'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={recipient.type}
                            onValueChange={(val) =>
                              handleUpdateRecipientType(
                                recipient.id,
                                val as 'Customer' | 'Provider' | 'Lender'
                              )
                            }
                          >
                            <SelectTrigger className="w-[120px] px-3 py-1.5 h-8 text-sm border-[#243F4D] bg-[#0F2936] text-[#FFFFFF] focus:ring-emerald-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1E3A4A] border-[#243F4D] text-[#FFFFFF]">
                              <SelectItem value="Customer" className="focus:bg-[#243F4D] focus:text-[#FFFFFF] text-[#FFFFFF]">Customer</SelectItem>
                              <SelectItem value="Provider" className="focus:bg-[#243F4D] focus:text-[#FFFFFF] text-[#FFFFFF]">Provider</SelectItem>
                              <SelectItem value="Lender" className="focus:bg-[#243F4D] focus:text-[#FFFFFF] text-[#FFFFFF]">Lender</SelectItem>
                            </SelectContent>
                          </Select>
                          <button
                            onClick={() => handleRemoveRecipient(recipient.id)}
                            className="text-rose-400 hover:bg-rose-900/20 p-1.5 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Access Settings */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-[#FFFFFF] mb-4">Access Settings</h3>

              <div className="space-y-4">
                {/* Allow Download */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="allowDownload"
                    checked={accessSettings.allowDownload}
                    onChange={(e) =>
                      setAccessSettings({
                        ...accessSettings,
                        allowDownload: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 text-emerald-500 border-[#243F4D] bg-[#0F2936] rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="allowDownload" className="text-sm text-[#FFFFFF] cursor-pointer">
                      Allow Download
                    </label>
                    <p className="text-xs text-neutral-400 mt-1">
                      Participants can download documents after signing
                    </p>
                  </div>
                </div>

                {/* Allow Upload */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="allowUpload"
                    checked={accessSettings.allowUpload}
                    onChange={(e) =>
                      setAccessSettings({
                        ...accessSettings,
                        allowUpload: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 text-emerald-500 border-[#243F4D] bg-[#0F2936] rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="allowUpload" className="text-sm text-[#FFFFFF] cursor-pointer">
                      Allow Upload
                    </label>
                    <p className="text-xs text-neutral-400 mt-1">
                      Participants can upload requested files
                    </p>
                  </div>
                </div>

                {/* Link Expiry */}
                <div>
                  <label className="block text-sm text-[#FFFFFF] mb-2">
                    Link Expiry *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={accessSettings.linkExpiry}
                      onChange={(e) =>
                        setAccessSettings({
                          ...accessSettings,
                          linkExpiry: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pl-10 border border-[#243F4D] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-[#0F2936] text-[#FFFFFF] [color-scheme:dark]"
                    />
                    <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Link will expire at 11:59 PM on this date
                  </p>
                </div>

                {/* Authentication Method (Read-only) */}
                <div>
                  <label className="block text-sm text-[#FFFFFF] mb-2">
                    Authentication Method
                  </label>
                  <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg px-3 py-2">
                    <p className="text-sm text-neutral-300">{accessSettings.authMethod}</p>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Locked by organization policy
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Continue */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-[#FFFFFF] mb-4">Review & Continue</h3>

              {/* Selected Documents */}
              <div>
                <h4 className="text-sm text-[#FFFFFF] mb-2">Documents ({selectedDocuments.length})</h4>
                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-2">
                  {selectedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-300">{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signing Participants */}
              <div>
                <h4 className="text-sm text-[#FFFFFF] mb-2">Signing Participants ({recipients.length})</h4>
                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-2">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileSignature className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-sm text-[#FFFFFF]">{recipient.name}</p>
                          <p className="text-xs text-neutral-400">{recipient.email}</p>
                        </div>
                      </div>
                      <span className="inline-flex px-2.5 py-1 rounded text-xs bg-[#0F2936] text-neutral-300 border border-[#243F4D]">
                        {recipient.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signing Intent Summary */}
              <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
                <h4 className="text-sm text-purple-200 mb-2 flex items-center gap-2">
                  <FileSignature className="w-4 h-4" />
                  Signing Intent
                </h4>
                <p className="text-xs text-purple-300">
                  {recipients.length} {recipients.length === 1 ? 'participant' : 'participants'} will be required to electronically sign {selectedDocuments.length} {selectedDocuments.length === 1 ? 'document' : 'documents'}. 
                  Signature fields will be configured in the next step.
                </p>
              </div>

              {/* Access Settings Summary */}
              <div>
                <h4 className="text-sm text-[#FFFFFF] mb-2">Access Settings</h4>
                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Download</span>
                    <span className="text-[#FFFFFF]">
                      {accessSettings.allowDownload ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Upload</span>
                    <span className="text-[#FFFFFF]">
                      {accessSettings.allowUpload ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Link Expiry</span>
                    <span className="text-[#FFFFFF]">
                      {new Date(accessSettings.linkExpiry).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Authentication</span>
                    <span className="text-[#FFFFFF]">{accessSettings.authMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#243F4D] flex items-center justify-between">
          <button
            onClick={step === 1 ? handleClose : handleBack}
            className="px-4 py-2 text-sm text-neutral-300 hover:bg-[#243F4D] rounded-lg transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={step === 3 ? handleContinue : handleNext}
            className="px-6 py-2 text-sm bg-emerald-500 text-[#0F2936] rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            {step === 3 ? 'Continue to Editor' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}