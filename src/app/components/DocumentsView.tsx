import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Edit2, 
  FileInput, 
  Trash2, 
  Archive,
  FileText,
  File,
  FileImage
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { DocumentUploadModal } from './DocumentUploadModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { downloadDummyPDF, inferDocumentType } from '../utils/pdfUtils';
import { toast } from 'sonner';

export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'JPG' | 'PNG' | 'Other';
  category: string;
  tags: string[];
  description?: string;
  uploadedBy: string;
  uploadedDate: string;
  lastUpdated: string;
  status: 'Active' | 'Inactive';
  size: string;
}

interface DocumentsViewProps {
  userRole?: string;
}

const MOCK_DOCUMENTS: Document[] = [
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
  {
    id: 'DOC-004',
    name: 'Insurance Requirements.pdf',
    type: 'PDF',
    category: 'Policies',
    tags: ['Insurance', 'Compliance'],
    uploadedBy: 'Admin',
    uploadedDate: '11/15/2025 03:20 PM',
    lastUpdated: '11/15/2025 03:20 PM',
    status: 'Inactive',
    size: '890 KB'
  }
];

export function DocumentsView({ userRole }: DocumentsViewProps) {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);

  const handleDownload = (doc: Document) => {
    downloadDummyPDF(inferDocumentType(doc.name), doc.name, {
      documentId: doc.id,
      participantName: doc.uploadedBy,
    });
    toast.success(`Downloading ${doc.name}`);
  };

  // Filter Logic
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(doc.category);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(doc.type);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(doc.status);

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleStatusToggle = (docId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId 
        ? { ...doc, status: doc.status === 'Active' ? 'Inactive' : 'Active' }
        : doc
    ));
  };

  const handleSaveDocument = (doc: Document) => {
    if (editingDocument) {
      setDocuments(documents.map(d => d.id === editingDocument.id ? doc : d));
    } else {
      setDocuments([doc, ...documents]);
    }
    setIsModalOpen(false);
    setEditingDocument(null);
  };

  const handleDeleteDocument = (docId: string) => {
    // In a real app, verify if linked to workspaces first
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== docId));
    }
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Documents</h2>
          <p className="text-neutral-600 mt-1">Manage reusable document templates and files</p>
        </div>
        <button
          onClick={() => {
            setEditingDocument(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer"
        >
          New Document
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 relative min-w-[300px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Name, Category, or Tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          
          {/* Category Multi-Select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer">
                <Filter className="w-4 h-4" />
                <span>Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {['Contracts', 'Applications', 'Service', 'Policies'].map(category => (
                <label key={category} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-neutral-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      }
                    }}
                    className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-neutral-700">{category}</span>
                </label>
              ))}
              {selectedCategories.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="w-full px-2 py-1.5 text-left text-sm text-neutral-600 hover:bg-neutral-50 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Multi-Select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer">
                <Filter className="w-4 h-4" />
                <span>Type {selectedTypes.length > 0 && `(${selectedTypes.length})`}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {['PDF', 'DOCX', 'JPG', 'PNG'].map(type => (
                <label key={type} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-neutral-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTypes([...selectedTypes, type]);
                      } else {
                        setSelectedTypes(selectedTypes.filter(t => t !== type));
                      }
                    }}
                    className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-neutral-700">{type}</span>
                </label>
              ))}
              {selectedTypes.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <button
                    onClick={() => setSelectedTypes([])}
                    className="w-full px-2 py-1.5 text-left text-sm text-neutral-600 hover:bg-neutral-50 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Multi-Select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer">
                <Filter className="w-4 h-4" />
                <span>Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {['Active', 'Inactive'].map(status => (
                <label key={status} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-neutral-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStatuses([...selectedStatuses, status]);
                      } else {
                        setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                      }
                    }}
                    className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-neutral-900">{status}</span>
                </label>
              ))}
              {selectedStatuses.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <button
                    onClick={() => setSelectedStatuses([])}
                    className="w-full px-2 py-1.5 text-left text-sm text-neutral-600 hover:bg-neutral-50 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Document Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category / Tags</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Uploaded By</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{doc.name}</div>
                      <div className="text-xs text-neutral-500">{doc.size} • {doc.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-neutral-900">{doc.category}</span>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-medium border border-neutral-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{doc.uploadedBy}</div>
                  <div className="text-xs text-neutral-500">{doc.uploadedDate}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => setPreviewDocument(doc)}
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDownload(doc)}
                        className="cursor-pointer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingDocument(doc);
                          setIsModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Metadata
                      </DropdownMenuItem>
                      {/* Hide delete for Primary Operations User */}
                      {userRole !== 'Primary Operations User' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocumentUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingDocument}
        onSave={handleSaveDocument}
      />

      <PDFPreviewModal
        isOpen={previewDocument !== null}
        onClose={() => setPreviewDocument(null)}
        document={previewDocument}
      />
    </div>
  );
}