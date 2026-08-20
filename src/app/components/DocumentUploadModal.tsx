import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Trash2 
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
import { Switch } from './ui/switch';
import { Document } from './DocumentsView';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Document, saveToLibrary?: boolean, file?: File | null) => void;
  onBulkUpload?: (files: File[]) => void;
  initialData: Document | null;
  isWorkspaceUpload?: boolean;
  bulkOnly?: boolean;
}

export function DocumentUploadModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onBulkUpload,
  initialData, 
  isWorkspaceUpload = false,
  bulkOnly = false
}: DocumentUploadModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<File[]>([]); // For bulk upload
  const [file, setFile] = useState<File | null>(null); // For single upload
  const [saveToLibrary, setSaveToLibrary] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category || 'Other');
      setTags(initialData.tags);
      setFile(null); // Reset file for edit mode unless replaced
      setFiles([]);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setName('');
    setCategory('Other');
    setTags([]);
    setTagInput('');
    setFile(null);
    setFiles([]);
    setSaveToLibrary(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    if (bulkOnly) {
      const newFiles = Array.from(fileList);
      setFiles(prev => [...prev, ...newFiles]);
    } else {
      // Single file mode - auto-use file name
      const selectedFile = fileList[0];
      setFile(selectedFile);
      setName(selectedFile.name); // Always use file name
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (bulkOnly) {
      if (files.length > 0 && onBulkUpload) {
        onBulkUpload(files);
        onClose();
      }
      return;
    }

    // Single File Submission
    // Basic Validation - only need file now, name is auto-set from file
    if (!initialData && !file) return;

    const newDoc: Document = {
      id: initialData?.id || `DOC-${Date.now()}`,
      name: name || (file ? file.name : initialData?.name || ''),
      type: file ? file.name.split('.').pop()?.toUpperCase() as any || 'FILE' : initialData?.type || 'FILE',
      category, 
      tags,
      description: '',
      status: 'Active',
      uploadedBy: initialData?.uploadedBy || 'Current User', 
      uploadedDate: initialData?.uploadedDate || new Date().toLocaleString('en-US', { 
        month: '2-digit', day: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }).replace(',', ''),
      lastUpdated: new Date().toLocaleString('en-US', { 
        month: '2-digit', day: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }).replace(',', ''),
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : initialData?.size || '0 MB'
    };

    onSave(newDoc, saveToLibrary, file);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bulkOnly ? 'Upload Documents' : (initialData ? 'Update Document' : 'New Document')}</DialogTitle>
          <DialogDescription>
            {bulkOnly 
              ? 'Upload multiple documents to this workspace.' 
              : (initialData ? 'Update document metadata or replace the file.' : isWorkspaceUpload ? 'Upload a document for this workspace.' : 'Upload a new reusable document to the library.')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">File Upload {(!initialData && !bulkOnly) && <span className="text-rose-500">*</span>}</label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple={bulkOnly}
                onChange={handleChange}
              />
              
              {!bulkOnly && file ? (
                <div className="w-full flex items-center justify-between bg-neutral-100 p-3 rounded-md">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-neutral-700 truncate">{file.name}</span>
                    <span className="text-xs text-neutral-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 hover:bg-neutral-200 rounded-full text-neutral-500 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : bulkOnly && files.length > 0 ? (
                 <div className="w-full space-y-2">
                    {files.map((f, idx) => (
                      <div key={idx} className="w-full flex items-center justify-between bg-neutral-100 p-3 rounded-md">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-neutral-700 truncate">{f.name}</span>
                          <span className="text-xs text-neutral-500 flex-shrink-0">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="p-1 hover:bg-neutral-200 rounded-full text-neutral-500 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="pt-2 text-sm text-neutral-500">
                        <span className="font-medium text-emerald-600">Click to add more</span> or drag and drop
                    </div>
                 </div>
              ) : initialData ? (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium text-emerald-600">Click to replace</span> or drag and drop
                  </p>
                  <p className="text-xs text-neutral-400">Current file: {initialData.name} ({initialData.size})</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium text-emerald-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-neutral-400">
                     {bulkOnly ? 'Upload multiple files' : 'PDF, DOCX, XLSX up to 10MB'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {!bulkOnly && (
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contracts">Contracts</SelectItem>
                    <SelectItem value="Applications">Applications</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Policies">Policies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Tags</label>
                <div className="border border-neutral-200 rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-neutral-900 ring-offset-1">
                    {tags.map(tag => (
                    <span key={tag} className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-rose-500 cursor-pointer">
                        <X className="w-3 h-3" />
                        </button>
                    </span>
                    ))}
                    <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                    className="flex-1 outline-none text-sm min-w-[120px]"
                    />
                </div>
                </div>

                {isWorkspaceUpload && (
                <div className="flex items-center gap-3 pt-2">
                    <Switch 
                    checked={saveToLibrary}
                    onCheckedChange={setSaveToLibrary}
                    />
                    <span className="text-sm text-neutral-700">Save to Documents Library for future use</span>
                </div>
                )}
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={bulkOnly ? files.length === 0 : (!initialData && !file)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {bulkOnly ? `Upload (${files.length})` : (initialData ? 'Update' : 'Save')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}