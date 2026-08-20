import { toast } from 'sonner';

// Document type mapping for generating appropriate dummy PDFs
export type DocumentType = 
  | 'purchase-agreement'
  | 'vehicle-inspection'
  | 'compliance-disclosure'
  | 'identity-verification'
  | 'payment-authorization'
  | 'service-contract'
  | 'credit-application'
  | 'insurance-verification'
  | 'trade-in-appraisal'
  | 'credit-report'
  | 'evidence-package'
  | 'audit-report'
  | 'generic';

interface PDFMetadata {
  workspaceId?: string;
  exchangeId?: string;
  documentId?: string;
  participantName?: string;
  participantEmail?: string;
  timestamp?: string;
}

/**
 * Generates a dummy PDF with realistic content based on document type
 * This creates a minimal but valid PDF file with Secure Exchange branding
 */
export function generateDummyPDF(
  documentType: DocumentType,
  filename: string,
  metadata: PDFMetadata = {}
): Blob {
  const timestamp = metadata.timestamp || new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Simple PDF generation using text
  const content = generatePDFContent(documentType, metadata, timestamp);
  
  // Create a minimal PDF structure
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
/F2 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length ${content.length}
>>
stream
${content}
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000364 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${414 + content.length}
%%EOF`;

  return new Blob([pdfContent], { type: 'application/pdf' });
}

/**
 * Generates the content stream for the PDF based on document type
 */
function generatePDFContent(
  documentType: DocumentType,
  metadata: PDFMetadata,
  timestamp: string
): string {
  const baseY = 720;
  let content = '';

  // Header with branding
  content += `BT\n`;
  content += `/F2 16 Tf\n`;
  content += `50 ${baseY} Td\n`;
  content += `(Secure Exchange) Tj\n`;
  content += `ET\n`;

  // Document title
  content += `BT\n`;
  content += `/F2 14 Tf\n`;
  content += `50 ${baseY - 40} Td\n`;
  content += `(${getDocumentTitle(documentType)}) Tj\n`;
  content += `ET\n`;

  // Metadata section
  let y = baseY - 80;
  if (metadata.workspaceId) {
    content += addTextLine(`Workspace ID: ${metadata.workspaceId}`, y, false);
    y -= 20;
  }
  if (metadata.exchangeId) {
    content += addTextLine(`Exchange ID: ${metadata.exchangeId}`, y, false);
    y -= 20;
  }
  if (metadata.documentId) {
    content += addTextLine(`Document ID: ${metadata.documentId}`, y, false);
    y -= 20;
  }
  content += addTextLine(`Generated: ${timestamp}`, y, false);
  y -= 40;

  // Document-specific content
  content += getDocumentSpecificContent(documentType, metadata, y);

  return content;
}

function addTextLine(text: string, y: number, bold: boolean = false): string {
  return `BT\n/${bold ? 'F2' : 'F1'} 10 Tf\n50 ${y} Td\n(${text}) Tj\nET\n`;
}

function getDocumentTitle(type: DocumentType): string {
  const titles: Record<DocumentType, string> = {
    'purchase-agreement': 'Purchase Agreement',
    'vehicle-inspection': 'Vehicle Inspection Report',
    'compliance-disclosure': 'Compliance Disclosure Statement',
    'identity-verification': 'Identity Verification Form',
    'payment-authorization': 'Payment Authorization',
    'service-contract': 'Service Contract Summary',
    'credit-application': 'Credit Application',
    'insurance-verification': 'Insurance Verification',
    'trade-in-appraisal': 'Trade-In Appraisal Report',
    'credit-report': 'Credit Report',
    'evidence-package': 'Evidence Package - Audit Trail',
    'audit-report': 'Audit Log Report',
    'generic': 'Document'
  };
  return titles[type] || 'Document';
}

function getDocumentSpecificContent(type: DocumentType, metadata: PDFMetadata, startY: number): string {
  let content = '';
  let y = startY;

  switch (type) {
    case 'purchase-agreement':
      content += addTextLine('PARTIES TO THIS AGREEMENT', y, true);
      y -= 25;
      content += addTextLine(`Buyer: ${metadata.participantName || 'John Smith'}`, y);
      y -= 15;
      content += addTextLine(`Email: ${metadata.participantEmail || 'john.smith@example.com'}`, y);
      y -= 15;
      content += addTextLine('Seller: Acme Financial Services', y);
      y -= 30;
      content += addTextLine('TERMS AND CONDITIONS', y, true);
      y -= 20;
      content += addTextLine('1. Purchase Price: $35,000.00', y);
      y -= 15;
      content += addTextLine('2. Down Payment: $7,000.00', y);
      y -= 15;
      content += addTextLine('3. Financing Amount: $28,000.00', y);
      y -= 30;
      content += addTextLine('SIGNATURES', y, true);
      y -= 20;
      content += addTextLine('Buyer Signature: ___________________________', y);
      y -= 20;
      content += addTextLine('Date: ___________________________', y);
      break;

    case 'vehicle-inspection':
      content += addTextLine('VEHICLE INFORMATION', y, true);
      y -= 25;
      content += addTextLine('Make: Toyota', y);
      y -= 15;
      content += addTextLine('Model: Camry', y);
      y -= 15;
      content += addTextLine('Year: 2024', y);
      y -= 15;
      content += addTextLine('VIN: 1HGBH41JXMN109186', y);
      y -= 30;
      content += addTextLine('INSPECTION RESULTS', y, true);
      y -= 20;
      content += addTextLine('Exterior Condition: Excellent', y);
      y -= 15;
      content += addTextLine('Interior Condition: Good', y);
      y -= 15;
      content += addTextLine('Mechanical Condition: Excellent', y);
      y -= 15;
      content += addTextLine('Odometer Reading: 12,345 miles', y);
      break;

    case 'compliance-disclosure':
      content += addTextLine('REGULATORY COMPLIANCE STATEMENT', y, true);
      y -= 25;
      content += addTextLine('This document contains important compliance disclosures', y);
      y -= 15;
      content += addTextLine('required by federal and state regulations.', y);
      y -= 30;
      content += addTextLine('TRUTH IN LENDING DISCLOSURE', y, true);
      y -= 20;
      content += addTextLine('Annual Percentage Rate: 5.99%', y);
      y -= 15;
      content += addTextLine('Finance Charge: $4,200.00', y);
      y -= 15;
      content += addTextLine('Amount Financed: $28,000.00', y);
      y -= 15;
      content += addTextLine('Total of Payments: $32,200.00', y);
      break;

    case 'identity-verification':
      content += addTextLine('IDENTITY VERIFICATION FORM', y, true);
      y -= 25;
      content += addTextLine(`Full Name: ${metadata.participantName || 'John Smith'}`, y);
      y -= 15;
      content += addTextLine('Date of Birth: __/__/____', y);
      y -= 15;
      content += addTextLine('Social Security Number: ***-**-____', y);
      y -= 15;
      content += addTextLine('Drivers License: ______________', y);
      y -= 30;
      content += addTextLine('I certify that the information provided is accurate.', y);
      y -= 25;
      content += addTextLine('Signature: ___________________________', y);
      y -= 15;
      content += addTextLine('Date: ___________________________', y);
      break;

    case 'evidence-package':
      content += addTextLine('AUDIT TRAIL EVIDENCE PACKAGE', y, true);
      y -= 25;
      content += addTextLine(`Exchange ID: ${metadata.exchangeId || 'EX-XXXX'}`, y);
      y -= 15;
      content += addTextLine(`Workspace ID: ${metadata.workspaceId || 'WS-XXXX'}`, y);
      y -= 30;
      content += addTextLine('ACTIVITY TIMELINE', y, true);
      y -= 20;
      content += addTextLine('- Exchange created', y);
      y -= 15;
      content += addTextLine('- Documents uploaded', y);
      y -= 15;
      content += addTextLine('- Shared with external participant', y);
      y -= 15;
      content += addTextLine('- Documents accessed', y);
      y -= 15;
      content += addTextLine('- Exchange completed', y);
      y -= 30;
      content += addTextLine('This package contains immutable proof of all activities.', y);
      break;

    default:
      content += addTextLine('DOCUMENT CONTENT', y, true);
      y -= 25;
      content += addTextLine('This is a dummy document generated by Secure Exchange.', y);
      y -= 15;
      content += addTextLine('In a production environment, this would contain', y);
      y -= 15;
      content += addTextLine('the actual document content and data.', y);
      break;
  }

  // Footer
  y = 50;
  content += addTextLine('---', y);
  y -= 15;
  content += addTextLine('This document was generated by Secure Exchange', y);
  y -= 15;
  content += addTextLine('For demonstration purposes only', y);

  return content;
}

/**
 * Downloads a dummy PDF with appropriate filename
 */
export function downloadDummyPDF(
  documentType: DocumentType,
  originalFilename: string,
  metadata: PDFMetadata = {}
): void {
  // Generate meaningful filename
  const filename = generateFilename(documentType, originalFilename, metadata);
  
  // Generate the PDF
  const pdfBlob = generateDummyPDF(documentType, filename, metadata);
  
  // Create download link
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
  
  toast.success(`Downloaded: ${filename}`);
}

/**
 * Generates a meaningful filename for the PDF
 */
export function generateFilename(
  documentType: DocumentType,
  originalFilename: string,
  metadata: PDFMetadata = {}
): string {
  // If original filename already has .pdf, use it with optional metadata
  if (originalFilename.toLowerCase().endsWith('.pdf')) {
    // Add exchange ID if available and not already in filename
    if (metadata.exchangeId && !originalFilename.includes(metadata.exchangeId)) {
      const baseName = originalFilename.replace('.pdf', '');
      return `${baseName}_${metadata.exchangeId}.pdf`;
    }
    return originalFilename;
  }

  // Otherwise, create a meaningful filename
  const baseName = originalFilename.replace(/\.[^/.]+$/, ''); // Remove any extension
  const suffix = metadata.exchangeId || metadata.documentId || '';
  
  if (suffix) {
    return `${baseName}_${suffix}.pdf`;
  }
  
  return `${baseName}.pdf`;
}

/**
 * Gets the appropriate document type based on filename or context
 */
export function inferDocumentType(filename: string): DocumentType {
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('purchase') && lowerName.includes('agreement')) {
    return 'purchase-agreement';
  }
  if (lowerName.includes('vehicle') && lowerName.includes('inspection')) {
    return 'vehicle-inspection';
  }
  if (lowerName.includes('compliance') || lowerName.includes('disclosure')) {
    return 'compliance-disclosure';
  }
  if (lowerName.includes('identity') || lowerName.includes('verification')) {
    return 'identity-verification';
  }
  if (lowerName.includes('payment') || lowerName.includes('authorization')) {
    return 'payment-authorization';
  }
  if (lowerName.includes('service') && lowerName.includes('contract')) {
    return 'service-contract';
  }
  if (lowerName.includes('credit') && lowerName.includes('application')) {
    return 'credit-application';
  }
  if (lowerName.includes('insurance')) {
    return 'insurance-verification';
  }
  if (lowerName.includes('trade') || lowerName.includes('appraisal')) {
    return 'trade-in-appraisal';
  }
  if (lowerName.includes('credit') && lowerName.includes('report')) {
    return 'credit-report';
  }
  if (lowerName.includes('evidence') || lowerName.includes('package')) {
    return 'evidence-package';
  }
  if (lowerName.includes('audit')) {
    return 'audit-report';
  }
  
  return 'generic';
}

/**
 * Creates a data URL for PDF preview
 */
export function createPDFPreviewURL(
  documentType: DocumentType,
  filename: string,
  metadata: PDFMetadata = {}
): string {
  const pdfBlob = generateDummyPDF(documentType, filename, metadata);
  return URL.createObjectURL(pdfBlob);
}
