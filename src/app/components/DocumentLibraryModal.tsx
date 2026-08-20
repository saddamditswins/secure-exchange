import { useState } from 'react';
import { Search, Filter, FileText, File, FileImage } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  tags: string[];
  uploadedBy: string;
  uploadedDate: string;
  size: string;
}

// Mock data shared with DocumentsView (ideally would be in a store/context)
const MOCK_LIBRARY_DOCUMENTS: Document[] = [
  {
    id: 'DOC-001',
    name: 'Standard Lease Agreement v2.pdf',
    type: 'PDF',
    category: 'Contracts',
    tags: ['Lease', 'Legal'],
    uploadedBy: 'Sarah Mitchell',
    uploadedDate: '01/02/2026',
    size: '2.4 MB'
  },
  {
    id: 'DOC-002',
    name: 'Credit Application Form.pdf',
    type: 'PDF',
    category: 'Applications',
    tags: ['Credit', 'Finance'],
    uploadedBy: 'James Rodriguez',
    uploadedDate: '01/03/2026',
    size: '1.1 MB'
  },
  {
    id: 'DOC-003',
    name: 'Vehicle Inspection Checklist.docx',
    type: 'DOCX',
    category: 'Service',
    tags: ['Inspection', 'Internal'],
    uploadedBy: 'Sarah Mitchell',
    uploadedDate: '12/28/2025',
    size: '450 KB'
  },
  {
    id: 'DOC-004',
    name: 'Insurance Requirements.pdf',
    type: 'PDF',
    category: 'Policies',
    tags: ['Insurance', 'Compliance'],
    uploadedBy: 'Admin',
    uploadedDate: '11/15/2025',
    size: '890 KB'
  }
];

interface DocumentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (documents: Document[]) => void;
  alreadySelectedIds?: string[];
}

export function DocumentLibraryModal({ isOpen, onClose, onSelect, alreadySelectedIds = [] }: DocumentLibraryModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredDocuments = MOCK_LIBRARY_DOCUMENTS.filter(doc => {
    // Exclude already selected in workspace if needed, or just let them select again?
    // Usually we disable or hide. Let's hide if passed in.
    if (alreadySelectedIds.includes(doc.id)) return false;

    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleSelection = (docId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    const selectedDocs = MOCK_LIBRARY_DOCUMENTS.filter(doc => selectedIds.has(doc.id));
    onSelect(selectedDocs);
    setSelectedIds(new Set());
    onClose();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-3 h-3 text-red-500" />;
      case 'DOCX': return <FileText className="w-3 h-3 text-blue-500" />;
      case 'JPG': 
      case 'PNG': return <FileImage className="w-3 h-3 text-purple-500" />;
      default: return <File className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Select Documents from Library</DialogTitle>
          <DialogDescription>
            Choose existing documents to attach to this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-2 flex gap-3 border-b border-neutral-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div className="w-[180px]">
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

        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full">
            <thead className="bg-neutral-50 sticky top-0">
              <tr>
                <th className="w-12 px-6 py-3"></th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Document</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-500 text-sm">
                    No matching documents found.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map(doc => (
                  <tr 
                    key={doc.id} 
                    className={`hover:bg-neutral-50 cursor-pointer ${selectedIds.has(doc.id) ? 'bg-emerald-50/50' : ''}`}
                    onClick={() => toggleSelection(doc.id)}
                  >
                    <td className="px-6 py-4">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIds.has(doc.id) ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-300'}`}>
                        {selectedIds.has(doc.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{doc.name}</div>
                          <div className="text-xs text-neutral-500">{doc.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">{doc.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900">{doc.uploadedDate}</div>
                      <div className="text-xs text-neutral-500">{doc.uploadedBy}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter className="p-4 border-t border-neutral-100">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-neutral-500">
              {selectedIds.size} document{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
