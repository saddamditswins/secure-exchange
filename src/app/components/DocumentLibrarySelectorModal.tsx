import { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  File, 
  FileImage,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Document } from './DocumentsView';

interface DocumentLibrarySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (documents: Document[]) => void;
  existingDocumentIds?: string[];
}

// Mock data - ideally this would come from a shared context or API
const MOCK_LIBRARY_DOCUMENTS: Document[] = [
  {
    id: 'DOC-001',
    name: 'Standard Lease Agreement v2.pdf',
    type: 'PDF',
    category: 'Contracts',
    tags: ['Lease', 'Legal'],
    uploadedBy: 'Sarah Mitchell',
    uploadedDate: '01/02/2026 10:30 AM',
    lastUpdated: '01/02/2026 10:30 AM',
    status: 'Active',
    size: '2.4 MB'
  },
  {
    id: 'DOC-002',
    name: 'Credit Application Form.pdf',
    type: 'PDF',
    category: 'Applications',
    tags: ['Credit', 'Finance'],
    uploadedBy: 'James Rodriguez',
    uploadedDate: '01/03/2026 02:15 PM',
    lastUpdated: '01/03/2026 02:15 PM',
    status: 'Active',
    size: '1.1 MB'
  },
  {
    id: 'DOC-003',
    name: 'Vehicle Inspection Checklist.docx',
    type: 'DOCX',
    category: 'Service',
    tags: ['Inspection', 'Internal'],
    uploadedBy: 'Sarah Mitchell',
    uploadedDate: '12/28/2025 09:00 AM',
    lastUpdated: '01/04/2026 11:45 AM',
    status: 'Active',
    size: '450 KB'
  },
  // Inactive docs are filtered out by default or logic
];

export function DocumentLibrarySelectorModal({ isOpen, onClose, onSelect, existingDocumentIds = [] }: DocumentLibrarySelectorModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredDocuments = MOCK_LIBRARY_DOCUMENTS.filter(doc => {
    // Only show Active documents
    if (doc.status !== 'Active') return false;
    
    // Filter out already attached documents
    if (existingDocumentIds.includes(doc.id)) return false;

    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleToggleSelect = (docId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedDocs = MOCK_LIBRARY_DOCUMENTS.filter(doc => selectedIds.has(doc.id));
    onSelect(selectedDocs);
    setSelectedIds(new Set());
    onClose();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-4 h-4 text-red-500" />;
      case 'DOCX': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'JPG': 
      case 'PNG': return <FileImage className="w-4 h-4 text-purple-500" />;
      default: return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-neutral-200">
          <DialogTitle>Add from Documents Library</DialogTitle>
          <DialogDescription>
            Select reusable documents to attach to this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 border-b border-neutral-200 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Contracts">Contracts</SelectItem>
                <SelectItem value="Applications">Applications</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Policies">Policies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
              <File className="w-12 h-12 mb-2 text-neutral-300" />
              <p>No documents found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map(doc => {
                const isSelected = selectedIds.has(doc.id);
                return (
                  <div 
                    key={doc.id}
                    onClick={() => handleToggleSelect(doc.id)}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                        : 'border-transparent bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors flex-shrink-0 ${
                      isSelected 
                        ? 'bg-emerald-500 border-emerald-500 shadow-sm' 
                        : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                    
                    <div className="mr-3">
                      {getFileIcon(doc.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900 truncate">{doc.name}</span>
                        <span className="text-xs text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{doc.category}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-neutral-500">{doc.size}</span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-xs text-neutral-500">Updated {doc.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t border-neutral-200">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-neutral-500">
              {selectedIds.size} document{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Add Selected
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
