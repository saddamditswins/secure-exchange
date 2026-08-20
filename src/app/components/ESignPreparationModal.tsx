import { useState, useMemo, useRef } from 'react';
import { X, Plus, User, Mail, Phone, Calendar, CheckCircle, Trash2, Search, FileSignature, Clock, AlertTriangle, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from './ui/switch';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  signingOrder?: number;
}

interface ESignSettings {
  signingOrder: 'any_order' | 'in_order';
  allowDownload: boolean;
  expiryType: 'hours' | 'datetime';
  expiryValue: string;
  otpEnabled: boolean;
}

interface ESignPreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocuments: Array<{ id: string; name: string }>;
  onContinueToEditor: (participants: Participant[], settings: ESignSettings) => void;
}

const AVAILABLE_CLIENTS = [
  { id: 'CL-001', name: 'Acme Corp', email: 'contact@acmecorp.com', phone: '(555) 123-4567' },
  { id: 'CL-002', name: 'Legal Partners LLP', email: 'info@legalpartners.com', phone: '(555) 987-6543' },
  { id: 'CL-003', name: 'Global Tech', email: 'admin@globaltech.com', phone: '(555) 246-8135' },
  { id: 'CL-004', name: 'Smith Motors', email: 'sales@smithmotors.com', phone: '(555) 111-2222' },
  { id: 'CL-005', name: 'Fast Finance', email: 'loans@fastfinance.com', phone: '(555) 333-4444' },
];

const CURRENT_USER = {
  name: 'James Rodriguez',
  email: 'james.rodriguez@example.com',
  phone: '(555) 777-8888'
};

const PARTICIPANT_TYPE = 'participant';

interface DraggableParticipantProps {
  participant: Participant;
  index: number;
  moveParticipant: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string) => void;
  isDraggable: boolean;
}

function DraggableParticipant({ participant, index, moveParticipant, onRemove, isDraggable }: DraggableParticipantProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: PARTICIPANT_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current || !isDraggable) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveParticipant(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: PARTICIPANT_TYPE,
    item: () => {
      return { id: participant.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-4">
        {isDraggable && (
          <div
            ref={drag}
            className="cursor-move text-neutral-500 hover:text-neutral-300 transition-colors flex-shrink-0"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}
        {participant.signingOrder !== undefined && (
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm text-emerald-300 font-bold border border-emerald-500/30 flex-shrink-0">
            {participant.signingOrder}
          </div>
        )}
        {participant.signingOrder === undefined && !isDraggable && (
          <div className="w-8 h-8 rounded-full bg-emerald-900/30 border border-emerald-700 flex items-center justify-center text-sm text-emerald-300 font-medium flex-shrink-0">
            {participant.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#ffffff] font-medium mb-1">{participant.name}</p>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{participant.email}</span>
            </div>
            {participant.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{participant.phone}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(participant.id)}
          className="text-neutral-400 hover:text-rose-400 p-2 hover:bg-rose-900/20 rounded transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ESignPreparationModal({
  isOpen,
  onClose,
  selectedDocuments,
  onContinueToEditor,
}: ESignPreparationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [includeMeAsSigner, setIncludeMeAsSigner] = useState(false);
  const [signingOrderType, setSigningOrderType] = useState<'any_order' | 'in_order'>('any_order');
  
  const [settings, setSettings] = useState<ESignSettings>({
    signingOrder: 'any_order',
    allowDownload: true,
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
    phone: ''
  });

  const filteredClients = useMemo(() => {
    if (!clientSearchQuery) return [];
    return AVAILABLE_CLIENTS.filter(client => 
      client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
    ).filter(client => !participants.some(p => p.email === client.email));
  }, [clientSearchQuery, participants]);

  if (!isOpen) return null;

  const canAddMoreParticipants = participants.length < 2;

  const handleAddClient = (client: typeof AVAILABLE_CLIENTS[0]) => {
    if (!canAddMoreParticipants) return;
    
    const newParticipant: Participant = { 
      id: `PAR-${Date.now()}`,
      name: client.name,
      email: client.email,
      phone: client.phone,
    };

    const updatedParticipants = [...participants, newParticipant];
    
    // Update signing order when in_order mode
    if (signingOrderType === 'in_order') {
      updatedParticipants.forEach((p, i) => {
        p.signingOrder = i + 1;
      });
    }
    
    setParticipants(updatedParticipants);
    setClientSearchQuery('');
    setShowSearchResults(false);
  };

  const handleAddManualParticipant = () => {
    if (!manualParticipant.name || !manualParticipant.email) return;
    if (!canAddMoreParticipants) return;

    const newParticipant: Participant = {
      id: `PAR-${Date.now()}`,
      name: manualParticipant.name,
      email: manualParticipant.email,
      phone: manualParticipant.phone,
    };

    const updatedParticipants = [...participants, newParticipant];
    
    // Update signing order when in_order mode
    if (signingOrderType === 'in_order') {
      updatedParticipants.forEach((p, i) => {
        p.signingOrder = i + 1;
      });
    }

    setParticipants(updatedParticipants);
    setManualParticipant({ name: '', email: '', phone: '' });
    setIsAddingManual(false);
  };

  const handleRemoveParticipant = (id: string) => {
    const updatedParticipants = participants.filter(p => p.id !== id);
    
    // Reorder if in_order mode
    if (signingOrderType === 'in_order') {
      updatedParticipants.forEach((p, index) => {
        p.signingOrder = index + 1;
      });
    }
    
    setParticipants(updatedParticipants);
  };

  const handleIncludeMeToggle = (checked: boolean) => {
    setIncludeMeAsSigner(checked);
  };

  const handleSigningOrderChange = (value: 'any_order' | 'in_order') => {
    setSigningOrderType(value);
    
    if (value === 'in_order') {
      // Add signing order numbers
      const updatedParticipants = participants.map((p, i) => ({
        ...p,
        signingOrder: i + 1
      }));
      setParticipants(updatedParticipants);
    } else {
      // Remove signing order numbers
      const updatedParticipants = participants.map(p => ({
        ...p,
        signingOrder: undefined
      }));
      setParticipants(updatedParticipants);
    }
  };

  const moveParticipant = (dragIndex: number, hoverIndex: number) => {
    const updatedParticipants = [...participants];
    const [draggedItem] = updatedParticipants.splice(dragIndex, 1);
    updatedParticipants.splice(hoverIndex, 0, draggedItem);
    
    // Update signing order numbers
    updatedParticipants.forEach((p, i) => {
      p.signingOrder = i + 1;
    });
    
    setParticipants(updatedParticipants);
  };

  const handleClose = () => {
    setStep(1);
    setParticipants([]);
    setIncludeMeAsSigner(false);
    setSigningOrderType('any_order');
    setClientSearchQuery('');
    setShowSearchResults(false);
    setIsAddingManual(false);
    setManualParticipant({ name: '', email: '', phone: '' });
    setSettings({
      signingOrder: 'any_order',
      allowDownload: true,
      expiryType: 'hours',
      expiryValue: '24',
      otpEnabled: true,
    });
    onClose();
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate: must have at least one participant
      const totalParticipants = participants.length + (includeMeAsSigner ? 1 : 0);
      if (totalParticipants === 0) {
        return;
      }
      // Update settings with selected signing order
      setSettings({ ...settings, signingOrder: signingOrderType });
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
    const allParticipants = [...participants];
    
    if (includeMeAsSigner) {
      const meAsParticipant: Participant = {
        id: 'ME',
        name: CURRENT_USER.name,
        email: CURRENT_USER.email,
        phone: CURRENT_USER.phone,
      };
      
      if (signingOrderType === 'in_order') {
        meAsParticipant.signingOrder = participants.length + 1;
      }
      
      allParticipants.push(meAsParticipant);
    }
    
    onContinueToEditor(allParticipants, settings);
    handleClose();
  };

  const getExpiryDisplay = () => {
    if (settings.expiryType === 'hours') {
      const hours = parseInt(settings.expiryValue);
      if (hours < 24) return `${hours} hours`;
      if (hours === 24) return '24 hours';
      if (hours === 48) return '48 hours';
      if (hours === 72) return '72 hours';
      if (hours === 168) return '7 days';
      return `${hours} hours`;
    } else {
      return settings.expiryValue ? new Date(settings.expiryValue).toLocaleString() : 'Not set';
    }
  };

  const totalParticipants = participants.length + (includeMeAsSigner ? 1 : 0);
  const canProceed = step === 1 ? totalParticipants > 0 : true;
  const showSigningOrderDropdown = totalParticipants > 1;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-[#153240] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-[#243F4D]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#243F4D] flex items-center justify-between">
            <div>
              <h2 className="text-[#ffffff] text-lg font-semibold">Prepare for E-Sign</h2>
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
                  Signing Setup
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
                {/* Participants Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[#ffffff] font-medium mb-1">Participants</h3>
                    <p className="text-xs text-neutral-400">
                      Maximum 2 participants total {totalParticipants > 0 && `(${totalParticipants}/2)`}
                    </p>
                  </div>

                  {/* Include Me as Signer */}
                  <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="includeMeAsSigner"
                        checked={includeMeAsSigner}
                        onChange={(e) => handleIncludeMeToggle(e.target.checked)}
                        className="mt-1 w-4 h-4 text-emerald-500 bg-[#0F2936] border-[#243F4D] rounded focus:ring-emerald-500 focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor="includeMeAsSigner" 
                          className="text-sm font-medium text-[#ffffff] block cursor-pointer"
                        >
                          Include me as a signer
                        </label>
                        <p className="text-xs text-neutral-400 mt-1">Add yourself to the signing sequence</p>
                      </div>
                    </div>
                    {includeMeAsSigner && (
                      <div className="mt-3 pt-3 border-t border-[#243F4D]">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-emerald-400" />
                          <div className="flex-1">
                            <p className="text-sm text-[#ffffff]">{CURRENT_USER.name}</p>
                            <p className="text-xs text-neutral-400">{CURRENT_USER.email}</p>
                          </div>
                          {signingOrderType === 'in_order' && totalParticipants > 1 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                              {participants.length + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Participant Section */}
                  {canAddMoreParticipants && (
                    <div className="space-y-4">
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
                                    className="w-full text-left px-4 py-3 hover:bg-[#243F4D] transition-colors border-b border-[#243F4D] last:border-0"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm text-[#ffffff] font-medium">{client.name}</div>
                                        <div className="text-xs text-neutral-400">{client.email}</div>
                                      </div>
                                      <Plus className="w-4 h-4 text-emerald-400" />
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center text-sm text-neutral-400">
                                  No clients found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setIsAddingManual(true);
                            setShowSearchResults(false);
                            setClientSearchQuery('');
                          }}
                          className="px-4 py-2.5 text-sm text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-colors font-medium"
                        >
                          Add Manually
                        </button>
                      </div>

                      {/* Manual Participant Form */}
                      {isAddingManual && (
                        <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-3">
                          <h4 className="text-sm text-[#ffffff] font-medium">Manual Entry</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-neutral-400 mb-1">Name *</label>
                              <input
                                type="text"
                                value={manualParticipant.name}
                                onChange={(e) => setManualParticipant({ ...manualParticipant, name: e.target.value })}
                                className="w-full px-3 py-2 bg-[#0F2936] border border-[#243F4D] rounded-lg text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Full name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-neutral-400 mb-1">Email *</label>
                              <input
                                type="email"
                                value={manualParticipant.email}
                                onChange={(e) => setManualParticipant({ ...manualParticipant, email: e.target.value })}
                                className="w-full px-3 py-2 bg-[#0F2936] border border-[#243F4D] rounded-lg text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="email@example.com"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">Phone</label>
                            <input
                              type="tel"
                              value={manualParticipant.phone}
                              onChange={(e) => setManualParticipant({ ...manualParticipant, phone: e.target.value })}
                              className="w-full px-3 py-2 bg-[#0F2936] border border-[#243F4D] rounded-lg text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setIsAddingManual(false);
                                setManualParticipant({ name: '', email: '', phone: '' });
                              }}
                              className="px-4 py-2 text-sm text-neutral-300 hover:bg-[#243F4D] rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddManualParticipant}
                              disabled={!manualParticipant.name || !manualParticipant.email}
                              className="px-4 py-2 text-sm bg-emerald-500 text-[#0F2936] rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Max Participants Warning */}
                  {!canAddMoreParticipants && (
                    <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-3 text-sm text-orange-200">
                      Maximum of 2 participants reached. Remove a participant to add another.
                    </div>
                  )}

                  {/* Participants List */}
                  {participants.length === 0 && !includeMeAsSigner && (
                    <div className="text-center py-12 bg-[#1E3A4A] rounded-lg border border-[#243F4D]">
                      <FileSignature className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
                      <p className="text-sm text-neutral-300">No participants added</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Add participants who will sign documents or include yourself
                      </p>
                    </div>
                  )}

                  {participants.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm text-neutral-400">Selected Participants ({participants.length})</h4>
                      {participants.map((participant, index) => (
                        <DraggableParticipant
                          key={participant.id}
                          participant={participant}
                          index={index}
                          moveParticipant={moveParticipant}
                          onRemove={handleRemoveParticipant}
                          isDraggable={signingOrderType === 'in_order' && totalParticipants > 1}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Signing Order - Only show when > 1 participant */}
                {showSigningOrderDropdown && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[#ffffff] font-medium mb-1">Signing Order</h3>
                      <p className="text-xs text-neutral-400">
                        Choose how participants will sign. This determines the signing sequence.
                      </p>
                    </div>

                    <div>
                      <Select value={signingOrderType} onValueChange={handleSigningOrderChange}>
                        <SelectTrigger className="bg-[#0F2936] border-[#243F4D] text-[#ffffff]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1E3A4A] border-[#243F4D] text-[#ffffff]">
                          <SelectItem value="any_order">Any Order (participants can sign in parallel)</SelectItem>
                          <SelectItem value="in_order">In Order (participants sign sequentially)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {signingOrderType === 'in_order' && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-200">
                          <p>Participants will be notified one at a time based on this order.</p>
                          {totalParticipants > 1 && (
                            <p className="mt-1 font-medium">Drag participants above to reorder the signing sequence.</p>
                          )}
                        </div>
                      </div>
                    )}
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
                      checked={settings.allowDownload}
                      onCheckedChange={(c) => setSettings({ ...settings, allowDownload: c })}
                    />
                    <div>
                      <label className="text-sm font-medium text-[#ffffff] block">Allow Download</label>
                      <p className="text-xs text-neutral-400">Participants can download documents after signing.</p>
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
                        value={settings.expiryType}
                        onValueChange={(val: 'hours' | 'datetime') => setSettings({
                          ...settings,
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
                        {settings.expiryType === 'hours' ? 'Duration' : 'Date & Time'}
                      </label>
                      {settings.expiryType === 'hours' ? (
                        <Select
                          value={settings.expiryValue}
                          onValueChange={(val) => setSettings({ ...settings, expiryValue: val })}
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
                            value={settings.expiryValue}
                            onChange={(e) => setSettings({ ...settings, expiryValue: e.target.value })}
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
                        checked={settings.otpEnabled}
                        onChange={(e) => setSettings({ ...settings, otpEnabled: e.target.checked })}
                        className="mt-1 w-4 h-4 text-emerald-500 bg-[#0F2936] border-[#243F4D] rounded focus:ring-emerald-500 focus:ring-offset-0"
                      />
                      <div>
                        <label className="text-sm font-medium text-[#ffffff] block">OTP Authentication</label>
                        <p className="text-xs text-neutral-400">Require participants to verify their identity via email code.</p>
                        
                        {!settings.otpEnabled && (
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
                      Participants ({totalParticipants})
                    </h4>
                    <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg overflow-hidden">
                      {participants.map((participant, i) => (
                        <div key={participant.id} className={`p-3 flex items-center justify-between ${i !== participants.length - 1 || includeMeAsSigner ? 'border-b border-[#243F4D]' : ''}`}>
                          <div className="flex items-center gap-2">
                            {signingOrderType === 'in_order' && totalParticipants > 1 && (
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold border border-emerald-500/30">
                                {participant.signingOrder}
                              </span>
                            )}
                            <div>
                              <div className="text-sm text-[#ffffff] font-medium">{participant.name}</div>
                              <div className="text-xs text-neutral-400">{participant.email}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {includeMeAsSigner && (
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {signingOrderType === 'in_order' && totalParticipants > 1 && (
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold border border-emerald-500/30">
                                {participants.length + 1}
                              </span>
                            )}
                            <div>
                              <div className="text-sm text-[#ffffff] font-medium">{CURRENT_USER.name}</div>
                              <div className="text-xs text-neutral-400">{CURRENT_USER.email}</div>
                            </div>
                          </div>
                          <span className="text-xs bg-emerald-900/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">You</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-3">Configuration</h4>
                    <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-4 space-y-3">
                      {totalParticipants > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Signing Order</span>
                          <span className="text-[#ffffff]">
                            {signingOrderType === 'any_order' ? 'Any Order' : 'In Order'}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Documents</span>
                        <span className="text-[#ffffff]">{selectedDocuments.length} Selected</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Download</span>
                        <span className={settings.allowDownload ? 'text-emerald-400' : 'text-rose-400'}>
                          {settings.allowDownload ? 'Allowed' : 'Disabled'}
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
                        <span className={settings.otpEnabled ? 'text-emerald-400' : 'text-neutral-500'}>
                          {settings.otpEnabled ? 'OTP Enabled' : 'OTP Disabled'}
                        </span>
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
              onClick={step === 1 ? handleClose : handleBack}
              className="px-4 py-2 text-sm text-neutral-300 hover:text-[#ffffff] hover:bg-[#243F4D] rounded-lg transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={step === 3 ? handleSend : handleNext}
              disabled={!canProceed}
              className="px-6 py-2 bg-emerald-500 text-[#0F2936] rounded-lg hover:bg-emerald-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? 'Send for Signature' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
