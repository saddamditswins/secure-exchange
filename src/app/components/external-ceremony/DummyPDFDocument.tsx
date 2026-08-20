import { useEffect, useRef } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';

interface DummyPDFDocumentProps {
  pageNumber: number;
  documentName: string;
}

export function DummyPDFDocument({ pageNumber, documentName }: DummyPDFDocumentProps) {
  const { tokens } = useExternalTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to standard letter size ratio
    const scale = 2; // For better resolution
    canvas.width = 612 * scale;
    canvas.height = 792 * scale;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle page border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Document Header
    ctx.fillStyle = tokens.text.primary;
    ctx.font = `bold ${28 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(documentName, 60 * scale, 80 * scale);

    // Horizontal line under header
    ctx.strokeStyle = tokens.border.soft;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(60 * scale, 100 * scale);
    ctx.lineTo(552 * scale, 100 * scale);
    ctx.stroke();

    // Document Content - Paragraphs
    ctx.fillStyle = tokens.text.secondary;
    ctx.font = `${16 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    
    const paragraphs = [
      'This Electronic Signature Agreement ("Agreement") is entered into between the parties',
      'named herein, effective as of the date of the last signature below. This document confirms',
      'that all parties agree to conduct business electronically and accept electronic signatures',
      'as legally binding.',
      '',
      'By signing this document electronically, you acknowledge and agree that:',
      '',
      '1. Your electronic signature is the legal equivalent of your manual signature.',
      '2. You consent to be legally bound by the terms and conditions of this Agreement.',
      '3. You have the authority to enter into this Agreement on behalf of yourself or your',
      '   organization, if applicable.',
      '4. You will retain a copy of this Agreement for your records.',
      '',
      'The parties acknowledge that this Agreement may be executed in counterparts, each of',
      'which shall be deemed an original and all of which together shall constitute one and the',
      'same instrument. Electronic signatures shall have the same legal effect as original',
      'signatures.',
    ];

    let yPosition = 140 * scale;
    const lineHeight = 24 * scale;

    paragraphs.forEach((line) => {
      ctx.fillText(line, 60 * scale, yPosition);
      yPosition += lineHeight;
    });

    // Signature Section
    yPosition += 40 * scale;

    // Signature line label
    ctx.fillStyle = tokens.text.primary;
    ctx.font = `${14 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText('Signature:', 60 * scale, yPosition);

    // Signature line
    yPosition += 10 * scale;
    ctx.strokeStyle = tokens.text.muted;
    ctx.lineWidth = 1 * scale;
    ctx.setLineDash([5 * scale, 5 * scale]);
    ctx.beginPath();
    ctx.moveTo(60 * scale, yPosition);
    ctx.lineTo(400 * scale, yPosition);
    ctx.stroke();
    ctx.setLineDash([]);

    // Date line
    yPosition += 50 * scale;
    ctx.fillStyle = tokens.text.primary;
    ctx.fillText('Date:', 60 * scale, yPosition);
    
    yPosition += 10 * scale;
    ctx.strokeStyle = tokens.text.muted;
    ctx.lineWidth = 1 * scale;
    ctx.setLineDash([5 * scale, 5 * scale]);
    ctx.beginPath();
    ctx.moveTo(60 * scale, yPosition);
    ctx.lineTo(250 * scale, yPosition);
    ctx.stroke();
    ctx.setLineDash([]);

    // Footer - Page number
    ctx.fillStyle = tokens.text.muted;
    ctx.font = `${12 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(
      `Page ${pageNumber}`,
      canvas.width / 2 - 30 * scale,
      canvas.height - 40 * scale
    );

    // Footer - Watermark
    ctx.fillStyle = tokens.text.muted;
    ctx.globalAlpha = 0.3;
    ctx.font = `${10 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(
      'Secured by Secure Exchange',
      canvas.width / 2 - 70 * scale,
      canvas.height - 20 * scale
    );
    ctx.globalAlpha = 1;
  }, [pageNumber, documentName, tokens]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full h-auto" />
    </div>
  );
}
