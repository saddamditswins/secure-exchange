import { useState, useRef } from 'react';
import { 
  ArrowLeft,
  Save,
  FileText,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Send,
  File,
  Check,
  Trash2,
  Type,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Field {
  id: string;
  type: 'signature' | 'initials' | 'date';
  participantId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  required: boolean;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  color: string;
}

interface Document {
  id: string;
  name: string;
  pageCount: number;
}

interface ESignEditorViewProps {
  documentName: string;
  participants: Array<{ id: string; name: string; email: string; phone?: string }>;
  onBack: () => void;
  onSaveDraft: () => void;
  onSendForSignature: () => void;
  initialFields?: Field[];
}

type ResizeHandle = 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 'n' | 's' | null;

export function ESignEditorView({ 
  documentName, 
  participants: propParticipants,
  onBack, 
  onSaveDraft, 
  onSendForSignature,
  initialFields,
}: ESignEditorViewProps) {
  // Assign colors to participants
  const participantColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
  const participants: Participant[] = propParticipants.map((p, i) => ({
    ...p,
    color: participantColors[i % participantColors.length]
  }));

  // Mock documents (in real app, would be passed as props)
  const [documents] = useState<Document[]>([
    { id: 'doc-1', name: 'Credit Application.pdf', pageCount: 3 },
    { id: 'doc-2', name: 'Purchase Agreement.pdf', pageCount: 3 }
  ]);

  const [activeDocumentId, setActiveDocumentId] = useState(documents[0].id);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(120);
  const [fields, setFields] = useState<Field[]>(initialFields || []);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(participants[0].id);
  const [draggedFieldType, setDraggedFieldType] = useState<'signature' | 'initials' | 'date' | null>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [resizingFieldId, setResizingFieldId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [autoFillDate, setAutoFillDate] = useState(false);
  // Below lg the two side panels become off-canvas drawers: the canvas needs
  // the full width on a phone, but both panels are still reachable.
  const [showDocPanel, setShowDocPanel] = useState(false);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const activeDocument = documents.find(d => d.id === activeDocumentId);
  const selectedField = fields.find(f => f.id === selectedFieldId);

  // Field type definitions - all use same default height for consistency
  const fieldTypes = [
    { type: 'signature' as const, label: 'Signature', defaultWidth: 200, defaultHeight: 50, icon: FileText },
    { type: 'initials' as const, label: 'Initials', defaultWidth: 80, defaultHeight: 50, icon: User },
    { type: 'date' as const, label: 'Date Signed', defaultWidth: 150, defaultHeight: 50, icon: Calendar },
  ];

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, fieldType: 'signature' | 'initials' | 'date') => {
    setDraggedFieldType(fieldType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedFieldType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    const fieldConfig = fieldTypes.find(f => f.type === draggedFieldType);
    if (!fieldConfig) return;

    const newField: Field = {
      id: `field-${Date.now()}-${Math.random()}`,
      type: draggedFieldType,
      participantId: selectedParticipantId,
      x: Math.max(0, x - fieldConfig.defaultWidth / 2),
      y: Math.max(0, y - fieldConfig.defaultHeight / 2),
      width: fieldConfig.defaultWidth,
      height: fieldConfig.defaultHeight,
      page: currentPage,
      required: draggedFieldType === 'signature',
    };

    setFields([...fields, newField]);
    setDraggedFieldType(null);
    setSelectedFieldId(newField.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Resize handlers
  const handleResizeMouseDown = (e: React.MouseEvent, fieldId: string, handle: ResizeHandle) => {
    e.stopPropagation();
    const field = fields.find(f => f.id === fieldId);
    if (!field || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setResizeStart({
      x: (e.clientX - rect.left) / (zoom / 100),
      y: (e.clientY - rect.top) / (zoom / 100),
      width: field.width,
      height: field.height,
    });
    setResizingFieldId(fieldId);
    setResizeHandle(handle);
    setSelectedFieldId(fieldId);
  };

  const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    const field = fields.find(f => f.id === fieldId);
    if (!field || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) / (zoom / 100) - field.x,
      y: (e.clientY - rect.top) / (zoom / 100) - field.y,
    });
    setDraggingFieldId(fieldId);
    setSelectedFieldId(fieldId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (zoom / 100);
    const mouseY = (e.clientY - rect.top) / (zoom / 100);

    // Handle resize
    if (resizingFieldId && resizeHandle) {
      const field = fields.find(f => f.id === resizingFieldId);
      if (!field) return;

      let newWidth = field.width;
      let newHeight = field.height;
      let newX = field.x;
      let newY = field.y;

      const deltaX = mouseX - resizeStart.x;
      const deltaY = mouseY - resizeStart.y;

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(50, resizeStart.width + deltaX);
      }
      if (resizeHandle.includes('w')) {
        newWidth = Math.max(50, resizeStart.width - deltaX);
        newX = field.x + (field.width - newWidth);
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(30, resizeStart.height + deltaY);
      }
      if (resizeHandle.includes('n')) {
        newHeight = Math.max(30, resizeStart.height - deltaY);
        newY = field.y + (field.height - newHeight);
      }

      setFields(fields.map(f =>
        f.id === resizingFieldId
          ? { ...f, x: newX, y: newY, width: newWidth, height: newHeight }
          : f
      ));
      return;
    }

    // Handle drag
    if (draggingFieldId) {
      const field = fields.find(f => f.id === draggingFieldId);
      if (!field) return;

      const x = mouseX - dragOffset.x;
      const y = mouseY - dragOffset.y;

      setFields(fields.map(f =>
        f.id === draggingFieldId
          ? { ...f, x: Math.max(0, x), y: Math.max(0, y) }
          : f
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingFieldId(null);
    setResizingFieldId(null);
    setResizeHandle(null);
  };

  const handleFieldClick = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    setSelectedFieldId(fieldId);
  };

  // Validation
  const validateFields = (): string[] => {
    const errors: string[] = [];
    
    participants.forEach(participant => {
      const participantFields = fields.filter(f => f.participantId === participant.id);
      const hasSignature = participantFields.some(f => f.type === 'signature');
      
      if (!hasSignature) {
        errors.push(`${participant.name} needs at least one signature field`);
      }
    });

    return errors;
  };

  const isValid = validateFields().length === 0 && fields.length > 0;

  // Action handlers
  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
    onSaveDraft();
  };

  const handlePublish = () => {
    const errors = validateFields();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    onSendForSignature();
  };

  const handleAIAutoDetect = () => {
    // AI Auto-Detect logic
    toast.success('AI detected signature fields and placed them automatically');
    
    // Example: Auto-place signature fields for all participants
    const newFields: Field[] = [];
    participants.forEach((participant, index) => {
      // Place signature field
      newFields.push({
        id: `field-ai-signature-${participant.id}-${Date.now()}`,
        type: 'signature',
        participantId: participant.id,
        x: 50,
        y: 650 + (index * 80),
        width: 200,
        height: 60,
        page: 1,
        required: true,
      });
      
      if (autoFillDate) {
        // Place date field
        newFields.push({
          id: `field-ai-date-${participant.id}-${Date.now()}`,
          type: 'date',
          participantId: participant.id,
          x: 270,
          y: 650 + (index * 80),
          width: 150,
          height: 30,
          page: 1,
          required: false,
        });
      }
    });
    
    setFields([...fields, ...newFields]);
  };

  const selectedParticipant = participants.find(p => p.id === selectedParticipantId);
  const participantFieldCount = fields.filter(f => f.participantId === selectedParticipantId).length;

  return (
    <div className="h-full flex flex-col bg-[#0c1e28]">
      {/* Top Header */}
      <div className="bg-[#0f2838] border-b border-[#1a3544] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-300 hover:text-[#ffffff] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="h-5 w-px bg-[#1a3544]" />
          <h1 className="text-base font-semibold text-[#ffffff]">Prepare Document</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleAIAutoDetect}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-[#ffffff] border border-purple-400 rounded hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/20 cursor-pointer text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            AI Auto-Detect Fields
          </button>
          
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a3544] text-neutral-300 border border-[#2a4554] rounded hover:bg-[#1e3d4f] hover:border-[#3a5564] transition-colors cursor-pointer text-sm"
          >
            <Save className="w-4 h-4" />
            Save as Draft
          </button>
          
          <button
            onClick={handlePublish}
            disabled={!isValid}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
              isValid
                ? 'bg-emerald-500 text-[#ffffff] hover:bg-emerald-600 cursor-pointer'
                : 'bg-[#1a3544] text-neutral-500 cursor-not-allowed border border-[#2a4554]'
            }`}
          >
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Drawer toggles. Only below lg, where the panels are off-canvas. */}
      <div className="flex items-center gap-2 border-b border-[#1a3544] bg-[#0f2838] px-4 py-2 lg:hidden">
        <button
          onClick={() => { setShowDocPanel(true); setShowToolPanel(false); }}
          className="flex items-center gap-2 rounded border border-[#2a4554] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-[#1a3544] cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          Documents
        </button>
        <button
          onClick={() => { setShowToolPanel(true); setShowDocPanel(false); }}
          className="flex items-center gap-2 rounded border border-[#2a4554] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-[#1a3544] cursor-pointer"
        >
          <Type className="w-3.5 h-3.5" />
          Fields
          {participantFieldCount > 0 && (
            <span className="rounded-full bg-emerald-500 px-1.5 text-[10px] font-semibold text-[#0a1920]">
              {participantFieldCount}
            </span>
          )}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Backdrop for the off-canvas panels */}
        {(showDocPanel || showToolPanel) && (
          <div
            className="absolute inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => { setShowDocPanel(false); setShowToolPanel(false); }}
          />
        )}

        {/* LEFT SIDEBAR */}
        <div
          className={`absolute inset-y-0 left-0 z-30 w-64 shrink-0 bg-[#0a1920] flex flex-col border-r border-[#1a3544] transition-transform duration-200 lg:static lg:translate-x-0 ${
            showDocPanel ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand Section */}
          <div className="p-6 border-b border-[#1a3544]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#ffffff]" />
              </div>
              <div>
                <div className="text-[#ffffff] font-semibold text-base">Secure Exchange</div>
                <div className="text-emerald-400 text-xs">Document Signing</div>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-3">
                DOCUMENTS
              </div>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDocumentId(doc.id)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      activeDocumentId === doc.id
                        ? 'bg-emerald-500 text-[#ffffff]'
                        : 'bg-[#1a3544] text-neutral-400 hover:bg-[#1e3d4f]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <File className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activeDocumentId === doc.id ? 'text-[#ffffff]' : 'text-emerald-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{doc.name}</div>
                        <div className={`text-xs mt-1 ${activeDocumentId === doc.id ? 'text-emerald-100' : 'text-neutral-500'}`}>
                          {doc.pageCount} pages
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipients List */}
            <div className="p-4 border-t border-[#1a3544]">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-3">
                RECIPIENTS
              </div>
              <div className="space-y-2">
                {participants.map((participant) => {
                  const participantFields = fields.filter(f => f.participantId === participant.id);
                  
                  return (
                    <div
                      key={participant.id}
                      className="p-3 bg-[#1a3544] rounded"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: participant.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#ffffff] truncate">{participant.name}</div>
                          <div className="text-xs text-neutral-400 mt-0.5 truncate">{participant.email}</div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {participantFields.length} fields
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER - PDF Viewer */}
        <div className="flex-1 flex flex-col bg-[#0c1e28]">
          {/* Toolbar */}
          <div className="bg-[#0f2838] border-b border-[#1a3544] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 text-neutral-400 hover:text-[#ffffff] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-neutral-300">
                Page {currentPage} of {activeDocument?.pageCount || 1}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(activeDocument?.pageCount || 1, currentPage + 1))}
                disabled={currentPage === (activeDocument?.pageCount || 1)}
                className="p-1 text-neutral-400 hover:text-[#ffffff] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 text-neutral-400 hover:text-[#ffffff] cursor-pointer"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm text-neutral-300 w-14 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="p-1 text-neutral-400 hover:text-[#ffffff] cursor-pointer"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Canvas with Info Banner */}
          <div className="flex-1 overflow-auto flex items-start justify-center pt-8 pb-8 px-8">
            <div className="flex flex-col items-center gap-4">
              {/* Info Banner */}
              <div className="bg-white border border-blue-200 rounded-lg px-4 py-2.5 shadow-sm">
                <p className="text-sm text-blue-200">
                  ← Drag fields from the <span className="font-semibold text-blue-600">right panel</span> to place signature fields on the document
                </p>
              </div>

              {/* PDF Document */}
              <div
                ref={canvasRef}
                className="relative bg-white shadow-2xl"
                style={{
                  width: `${612 * (zoom / 100)}px`,
                  height: `${792 * (zoom / 100)}px`,
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={() => setSelectedFieldId(null)}
              >
                {/* Mock PDF content */}
                <div 
                  className="absolute inset-0 p-12 text-neutral-800 text-sm leading-relaxed overflow-hidden"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    width: '612px',
                    height: '792px'
                  }}
                >
                  <div className="text-center mb-6">
                    <div className="font-bold text-base mb-2">EVALUATION FORM - PRODUCT COPYRIGHT AGREEMENT</div>
                    <div className="text-xs text-neutral-600">
                      Nissan-Gent Participants in Motorcar, Bike, Scooter, ATV, PWC,<br />
                      Electric Bicycle & Golf Cart Theft Protection Program
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-bold text-xs mb-3 uppercase border-b border-neutral-300 pb-1">
                      Customer Information
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                      <div><span className="text-neutral-600">Last Name:</span> Thomas</div>
                      <div><span className="text-neutral-600">First Name:</span> Simon</div>
                      <div><span className="text-neutral-600">Street Address:</span> 232 West 17th Street</div>
                      <div><span className="text-neutral-600">City:</span> New York</div>
                      <div><span className="text-neutral-600">State:</span> NY</div>
                      <div><span className="text-neutral-600">ZIP Code:</span> 10018</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-bold text-xs mb-3 uppercase border-b border-neutral-300 pb-1">
                      Co-Signing Customer Information
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                      <div><span className="text-neutral-600">Last Name:</span></div>
                      <div><span className="text-neutral-600">First Name:</span></div>
                      <div><span className="text-neutral-600">Street Address:</span></div>
                      <div><span className="text-neutral-600">City:</span></div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-bold text-xs mb-3 uppercase border-b border-neutral-300 pb-1">
                      Covered Vehicle Information
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                      <div><span className="text-neutral-600">Make/Model:</span> CRX X1</div>
                      <div><span className="text-neutral-600">VIN:</span> J-00000001</div>
                      <div className="col-span-2"><span className="text-neutral-600">Lease Ref #:</span> 1234567/89</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="font-bold text-xs mb-3 uppercase border-b border-neutral-300 pb-1">
                      Theft Protection Program Limited Product Warranty Information
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                      <div><span className="text-neutral-600">Warranty Term:</span> 36 months</div>
                      <div><span className="text-neutral-600">Theft Protection Product Retail Price:</span> $334.00</div>
                    </div>
                  </div>
                </div>

                {/* Render fields for current page */}
                {fields
                  .filter(f => f.page === currentPage)
                  .map((field) => {
                    const participant = participants.find(p => p.id === field.participantId);
                    const isSelected = field.id === selectedFieldId;

                    return (
                      <div
                        key={field.id}
                        className={`absolute group border-2 ${
                          isSelected ? 'border-emerald-400 shadow-lg' : 'border-dashed'
                        }`}
                        style={{
                          left: `${field.x * (zoom / 100)}px`,
                          top: `${field.y * (zoom / 100)}px`,
                          width: `${field.width * (zoom / 100)}px`,
                          height: `${field.height * (zoom / 100)}px`,
                          backgroundColor: participant ? `${participant.color}30` : '#f0f0f0',
                          borderColor: participant?.color || '#999',
                          cursor: draggingFieldId === field.id ? 'grabbing' : 'grab',
                        }}
                        onMouseDown={(e) => {
                          // Check if clicking on a resize handle or delete button
                          const target = e.target as HTMLElement;
                          if (!target.classList.contains('resize-handle') && !target.closest('.delete-button')) {
                            handleFieldMouseDown(e, field.id);
                          }
                        }}
                        onClick={(e) => handleFieldClick(e, field.id)}
                      >
                        <div className="flex items-center justify-center h-full text-xs font-medium px-2 pointer-events-none text-[#ffffff]">
                          {field.type === 'signature' && '✍️ Signature'}
                          {field.type === 'initials' && 'Init.'}
                          {field.type === 'date' && '📅 Date'}
                        </div>
                        
                        {/* Delete Button - Show on hover or when selected */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFields(fields.filter(f => f.id !== field.id));
                            setSelectedFieldId(null);
                            toast.success('Field removed');
                          }}
                          className="delete-button absolute -top-2 -right-2 w-5 h-5 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          style={{
                            opacity: isSelected ? 1 : undefined,
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        
                        {/* Resize Handles - Only show when selected */}
                        {isSelected && (
                          <>
                            {/* Corner Handles */}
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-nwse-resize"
                              style={{ top: '-6px', left: '-6px' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 'nw')}
                            />
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-nesw-resize"
                              style={{ top: '-6px', right: '-6px' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 'ne')}
                            />
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-nesw-resize"
                              style={{ bottom: '-6px', left: '-6px' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 'sw')}
                            />
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-nwse-resize"
                              style={{ bottom: '-6px', right: '-6px' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 'se')}
                            />
                            {/* Edge Handles */}
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-ew-resize"
                              style={{ top: '50%', left: '-6px', transform: 'translateY(-50%)' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 'w')}
                            />
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-ew-resize"
                              style={{ top: '50%', right: '-6px', transform: 'translateY(-50%)' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 'e')}
                            />
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-ns-resize"
                              style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 'n')}
                            />
                            <div
                              className="resize-handle absolute w-3 h-3 bg-emerald-500 border border-white rounded-full cursor-ns-resize"
                              style={{ bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }}
                              onMouseDown={(e) => handleResizeMouseDown(e, field.id, 's')}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Field Tools */}
        <div
          className={`absolute inset-y-0 right-0 z-30 w-80 max-w-[85vw] shrink-0 bg-[#0a1920] border-l border-[#1a3544] flex flex-col overflow-y-auto transition-transform duration-200 lg:static lg:max-w-none lg:translate-x-0 ${
            showToolPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* User Selector */}
          <div className="p-4 border-b border-[#1a3544]">
            <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
              <SelectTrigger className="w-full bg-[#0f2838] border-[#1a3544] text-[#ffffff] hover:bg-[#1a3544]">
                <div className="flex items-center gap-2 text-[#ffffff]">
                  <User className="w-4 h-4 text-neutral-400" />
                  <SelectValue className="text-[#ffffff]" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Signature Fields Section */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-[#ffffff] mb-3">Signature fields</div>
              <div className="space-y-2">
                {fieldTypes.map((fieldType) => (
                  <div
                    key={fieldType.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, fieldType.type)}
                    className="p-3 rounded cursor-move transition-all text-[#ffffff] hover:opacity-90"
                    style={{
                      backgroundColor: selectedParticipant?.color || '#10b981',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <fieldType.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{fieldType.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-fill Fields Section */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-[#ffffff] mb-3">Auto-fill fields</div>
              <label className="flex items-center gap-3 p-3 bg-[#1a3544] rounded cursor-pointer hover:bg-[#1e3d4f] transition-colors">
                <input
                  type="checkbox"
                  checked={autoFillDate}
                  onChange={(e) => setAutoFillDate(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-400 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <Calendar className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-[#ffffff]">Date Signed</span>
              </label>
            </div>

            {/* Instructions */}
            <div className="bg-[#0f2838] border border-[#1a3544] rounded-lg p-4 mb-6">
              <div className="text-sm font-semibold text-[#ffffff] mb-2">How to add fields</div>
              <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                <li>Select a recipient from the dropdown above</li>
                <li>Drag signature fields onto the document</li>
                <li>Click a field to move or edit it</li>
                <li>Each recipient needs at least one signature</li>
              </ul>
            </div>

            {/* Fields Added Summary */}
            <div className="border-t border-[#1a3544] pt-4">
              <div className="text-sm font-semibold text-[#ffffff] mb-2">Fields Added</div>
              <div className="text-2xl font-bold text-[#ffffff]">{participantFieldCount} <span className="text-sm font-normal text-neutral-400">fields placed</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}