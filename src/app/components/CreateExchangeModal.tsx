import { useState } from 'react';
import { X, Plus, FileText, Upload, Calendar, Shield, Lock, ArrowRight, Save, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from 'sonner';

interface CreateExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (exchangeData: any) => void;
}

interface Document {
  id: string;
  name: string;
  size: string;
  source: 'Library' | 'Workspace' | 'Upload';
}

export function CreateExchangeModal({ isOpen, onClose, onSuccess }: CreateExchangeModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Form State
  const [name, setName] = useState('');
  const [recipientType, setRecipientType] = useState<'Customer' | 'Provider'>('Customer');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Documents
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // Permissions
  const [permissions, setPermissions] = useState({
    allowDownload: true,
    allowUpload: false,
    allowForwarding: false,
    passwordProtect: false,
    expiryDate: '',
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!name || !recipientEmail) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    if (step === 2 && documents.length === 0) {
      toast.error('Please add at least one document');
      return;
    }
    if (step < 4) setStep((prev) => (prev + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  const handleSaveDraft = () => {
    const exchangeData = {
      name,
      recipientType,
      recipientEmail,
      message,
      documents,
      permissions,
      status: 'Draft'
    };
    onSuccess(exchangeData);
    onClose();
  };

  const handleSend = () => {
    const exchangeData = {
      name,
      recipientType,
      recipientEmail,
      message,
      documents,
      permissions,
      status: 'Sent'
    };
    onSuccess(exchangeData);
    onClose();
  };

  const addMockDocument = (source: 'Library' | 'Workspace') => {
    const newDoc: Document = {
      id: `DOC-${Date.now()}`,
      name: source === 'Library' ? 'Standard_NDA_Template.pdf' : 'Project_Specs_v2.pdf',
      size: '1.2 MB',
      source
    };
    setDocuments([...documents, newDoc]);
  };

  const handleFileUpload = () => {
    // Mock upload
    const newDoc: Document = {
      id: `DOC-${Date.now()}`,
      name: 'Uploaded_File_XYZ.pdf',
      size: '2.5 MB',
      source: 'Upload'
    };
    setDocuments([...documents, newDoc]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#153240] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-[#243F4D]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#243F4D] flex items-center justify-between bg-[#1E3A4A]">
          <div>
            <h2 className="text-xl font-semibold text-white">{t('exchanges.newExchange')}</h2>
            <p className="text-sm text-neutral-400">Create a secure document package</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 py-4 bg-[#153240] border-b border-[#243F4D]">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s ? 'bg-emerald-500 text-[#0F2936]' : 'bg-[#243F4D] text-neutral-400'
                }`}>
                  {s}
                </div>
                <span className={`text-sm ${step === s ? 'text-white font-medium' : 'text-neutral-400'}`}>
                  {s === 1 ? 'Details' : s === 2 ? 'Content' : s === 3 ? 'Permissions' : 'Review'}
                </span>
                {s < 4 && <div className="w-12 h-px bg-[#243F4D] ml-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#243F4D] scrollbar-track-transparent bg-[#153240]">
          {step === 1 && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Exchange Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q4 Financial Review Package"
                  className="w-full px-4 py-2.5 bg-[#0F2936] border border-[#243F4D] rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Recipient Type</label>
                  <div className="flex bg-[#0F2936] rounded-lg p-1 border border-[#243F4D]">
                    <button
                      onClick={() => setRecipientType('Customer')}
                      className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
                        recipientType === 'Customer' ? 'bg-[#1E3A4A] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => setRecipientType('Provider')}
                      className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
                        recipientType === 'Provider' ? 'bg-[#1E3A4A] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Provider
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Recipient Email *</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="email@company.com"
                    className="w-full px-4 py-2.5 bg-[#0F2936] border border-[#243F4D] rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-[#0F2936] border border-[#243F4D] rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => addMockDocument('Library')}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0F2936] border border-[#243F4D] border-dashed rounded-xl hover:bg-[#1E3A4A] hover:border-emerald-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1E3A4A] flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <FileText className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-white">Add from Library</span>
                </button>
                <button
                  onClick={() => addMockDocument('Workspace')}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0F2936] border border-[#243F4D] border-dashed rounded-xl hover:bg-[#1E3A4A] hover:border-emerald-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1E3A4A] flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <FileText className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-white">Add from Workspace</span>
                </button>
                <button
                  onClick={handleFileUpload}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0F2936] border border-[#243F4D] border-dashed rounded-xl hover:bg-[#1E3A4A] hover:border-emerald-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1E3A4A] flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Upload className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-white">Upload New</span>
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400 mb-4">Package Contents ({documents.length})</h3>
                {documents.length === 0 ? (
                  <div className="text-center py-12 border border-[#243F4D] rounded-lg bg-[#0F2936]/50">
                    <p className="text-neutral-500">No documents added yet</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-[#1E3A4A] border border-[#243F4D] rounded-lg group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-[#0F2936] flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{doc.name}</p>
                          <p className="text-xs text-neutral-400">{doc.size} • From {doc.source}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="space-y-4">
                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.allowDownload}
                      onChange={(e) => setPermissions({ ...permissions, allowDownload: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-[#243F4D] bg-[#0F2936] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#1E3A4A]"
                    />
                    <div>
                      <span className="text-sm font-medium text-white block">{t('exchanges.permissions.download')}</span>
                      <span className="text-xs text-neutral-400">Recipients can download files to their device</span>
                    </div>
                  </label>
                </div>

                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.allowUpload}
                      onChange={(e) => setPermissions({ ...permissions, allowUpload: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-[#243F4D] bg-[#0F2936] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#1E3A4A]"
                    />
                    <div>
                      <span className="text-sm font-medium text-white block">{t('exchanges.permissions.upload')}</span>
                      <span className="text-xs text-neutral-400">Recipients can upload documents back to this exchange</span>
                    </div>
                  </label>
                </div>

                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.allowForwarding}
                      onChange={(e) => setPermissions({ ...permissions, allowForwarding: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-[#243F4D] bg-[#0F2936] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#1E3A4A]"
                    />
                    <div>
                      <span className="text-sm font-medium text-white block">{t('exchanges.permissions.forward')}</span>
                      <span className="text-xs text-neutral-400">Recipients can share the link with others</span>
                    </div>
                  </label>
                </div>

                <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.passwordProtect}
                      onChange={(e) => setPermissions({ ...permissions, passwordProtect: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-[#243F4D] bg-[#0F2936] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#1E3A4A]"
                    />
                    <div>
                      <span className="text-sm font-medium text-white block">{t('exchanges.permissions.password')}</span>
                      <span className="text-xs text-neutral-400">Require a password to access the exchange</span>
                    </div>
                  </label>
                  {permissions.passwordProtect && (
                    <div className="mt-3 pl-8">
                       <input
                        type="password"
                        placeholder="Set Password"
                        className="w-full px-3 py-2 bg-[#0F2936] border border-[#243F4D] rounded text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-neutral-300">Expiration Date (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      value={permissions.expiryDate}
                      onChange={(e) => setPermissions({ ...permissions, expiryDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0F2936] border border-[#243F4D] rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">Review Exchange</h3>
                <p className="text-neutral-400">Review settings before sending</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Details</h4>
                    <div>
                      <p className="text-xs text-neutral-400">Name</p>
                      <p className="text-sm text-white font-medium">{name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Recipient</p>
                      <p className="text-sm text-white font-medium">{recipientEmail} <span className="text-emerald-500">({recipientType})</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Expires</p>
                      <p className="text-sm text-white font-medium">{permissions.expiryDate || 'Never'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Permissions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${permissions.allowDownload ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                        <span className="text-sm text-white">Download</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${permissions.allowUpload ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                        <span className="text-sm text-white">Upload</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${permissions.allowForwarding ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                        <span className="text-sm text-white">Forward</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${permissions.passwordProtect ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                        <span className="text-sm text-white">Password</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                   <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Content</h4>
                   <span className="text-xs text-neutral-400">{documents.length} Items</span>
                </div>
                <div className="space-y-1">
                  {documents.slice(0, 3).map(doc => (
                    <div key={doc.id} className="text-sm text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      {doc.name}
                    </div>
                  ))}
                  {documents.length > 3 && (
                    <div className="text-xs text-neutral-400 pl-6">+ {documents.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#1E3A4A] border-t border-[#243F4D] flex justify-between items-center">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-4 py-2 text-sm text-neutral-300 hover:text-white transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <div className="flex items-center gap-3">
             {step === 4 && (
               <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 text-sm text-white border border-[#243F4D] hover:bg-[#243F4D] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
             )}
            <button
              onClick={step === 4 ? handleSend : handleNext}
              className="px-6 py-2 bg-emerald-500 text-[#0F2936] text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
            >
              {step === 4 ? (
                <>
                  <Send className="w-4 h-4" />
                  Send Exchange
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
