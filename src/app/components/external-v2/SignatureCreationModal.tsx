import { useState, useRef, useEffect } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { X, Type, PenTool, RotateCcw } from 'lucide-react';

interface SignatureCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string, initialsData: string) => void;
  participantName: string;
}

export function SignatureCreationModal({
  isOpen,
  onClose,
  onSave,
  participantName,
}: SignatureCreationModalProps) {
  const { tokens } = useExternalTheme();
  const [activeTab, setActiveTab] = useState<'type' | 'draw'>('type');
  const [typedSignature, setTypedSignature] = useState(participantName);
  const [typedInitials, setTypedInitials] = useState(
    participantName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  );
  const [fontStyle, setFontStyle] = useState<'cursive' | 'serif' | 'sans'>('cursive');
  
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const initialsCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const [isDrawingInitials, setIsDrawingInitials] = useState(false);

  useEffect(() => {
    if (isOpen && signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = tokens.surface.elevated;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    if (isOpen && initialsCanvasRef.current) {
      const canvas = initialsCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = tokens.surface.elevated;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isOpen, tokens]);

  const startDrawing = (canvas: HTMLCanvasElement, e: React.MouseEvent | React.TouchEvent, isSignature: boolean) => {
    if (isSignature) {
      setIsDrawingSignature(true);
    } else {
      setIsDrawingInitials(true);
    }
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (canvas: HTMLCanvasElement, e: React.MouseEvent | React.TouchEvent, isDrawing: boolean) => {
    if (!isDrawing) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      
      ctx.strokeStyle = tokens.text.primary;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (isSignature: boolean) => {
    if (isSignature) {
      setIsDrawingSignature(false);
    } else {
      setIsDrawingInitials(false);
    }
  };

  const clearCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = tokens.surface.elevated;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    let signatureData = '';
    let initialsData = '';

    if (activeTab === 'type') {
      // For typed signatures, we'll just save the text with font info
      signatureData = `typed:${typedSignature}:${fontStyle}`;
      initialsData = `typed:${typedInitials}:${fontStyle}`;
    } else {
      // For drawn signatures, save canvas data
      if (signatureCanvasRef.current) {
        signatureData = signatureCanvasRef.current.toDataURL();
      }
      if (initialsCanvasRef.current) {
        initialsData = initialsCanvasRef.current.toDataURL();
      }
    }

    onSave(signatureData, initialsData);
    onClose();
  };

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'cursive':
        return "'Brush Script MT', cursive";
      case 'serif':
        return "'Times New Roman', serif";
      case 'sans':
        return "'Arial', sans-serif";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: tokens.surface.overlay }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl p-8"
        style={{
          backgroundColor: tokens.surface.elevated,
          boxShadow: tokens.shadow.md,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: tokens.text.primary }}>
            Create Signature
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: tokens.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('type')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: activeTab === 'type' ? tokens.brand.primary : 'transparent',
              color: activeTab === 'type' ? tokens.text.primary : tokens.text.secondary,
            }}
          >
            <Type className="h-4 w-4" />
            <span>Type</span>
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: activeTab === 'draw' ? tokens.brand.primary : 'transparent',
              color: activeTab === 'draw' ? tokens.text.primary : tokens.text.secondary,
            }}
          >
            <PenTool className="h-4 w-4" />
            <span>Draw</span>
          </button>
        </div>

        {/* Type Tab Content */}
        {activeTab === 'type' && (
          <div className="space-y-6">
            {/* Font Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: tokens.text.secondary }}>
                Font Style
              </label>
              <div className="flex gap-2">
                {(['cursive', 'serif', 'sans'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setFontStyle(style)}
                    className="px-4 py-2 rounded-lg border transition-colors cursor-pointer capitalize"
                    style={{
                      borderColor: fontStyle === style ? tokens.brand.primary : tokens.border.soft,
                      backgroundColor: fontStyle === style ? `${tokens.brand.primary}20` : 'transparent',
                      color: tokens.text.primary,
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: tokens.text.secondary }}>
                Full Signature
              </label>
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: tokens.surface.card,
                  borderColor: tokens.border.soft,
                  color: tokens.text.primary,
                }}
              />
              {/* Signature Preview */}
              <div
                className="w-full h-24 rounded-lg border flex items-center justify-center"
                style={{
                  backgroundColor: tokens.surface.card,
                  borderColor: tokens.border.soft,
                }}
              >
                <span
                  className="text-3xl"
                  style={{
                    fontFamily: getFontFamily(),
                    color: tokens.text.primary,
                  }}
                >
                  {typedSignature}
                </span>
              </div>
            </div>

            {/* Initials Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: tokens.text.secondary }}>
                Initials
              </label>
              <input
                type="text"
                value={typedInitials}
                onChange={(e) => setTypedInitials(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: tokens.surface.card,
                  borderColor: tokens.border.soft,
                  color: tokens.text.primary,
                }}
              />
              {/* Initials Preview */}
              <div
                className="w-full h-20 rounded-lg border flex items-center justify-center"
                style={{
                  backgroundColor: tokens.surface.card,
                  borderColor: tokens.border.soft,
                }}
              >
                <span
                  className="text-2xl"
                  style={{
                    fontFamily: getFontFamily(),
                    color: tokens.text.primary,
                  }}
                >
                  {typedInitials}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Draw Tab Content */}
        {activeTab === 'draw' && (
          <div className="space-y-6">
            {/* Signature Canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: tokens.text.secondary }}>
                  Draw Your Signature
                </label>
                <button
                  onClick={() => clearCanvas(signatureCanvasRef.current)}
                  className="flex items-center gap-1 text-sm cursor-pointer transition-colors"
                  style={{ color: tokens.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tokens.text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = tokens.text.secondary;
                  }}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </div>
              <canvas
                ref={signatureCanvasRef}
                width={640}
                height={160}
                className="w-full border rounded-lg cursor-crosshair"
                style={{
                  borderColor: tokens.border.soft,
                  backgroundColor: tokens.surface.elevated,
                }}
                onMouseDown={(e) => startDrawing(signatureCanvasRef.current!, e, true)}
                onMouseMove={(e) => draw(signatureCanvasRef.current!, e, isDrawingSignature)}
                onMouseUp={() => stopDrawing(true)}
                onMouseLeave={() => stopDrawing(true)}
                onTouchStart={(e) => startDrawing(signatureCanvasRef.current!, e, true)}
                onTouchMove={(e) => draw(signatureCanvasRef.current!, e, isDrawingSignature)}
                onTouchEnd={() => stopDrawing(true)}
              />
            </div>

            {/* Initials Canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: tokens.text.secondary }}>
                  Draw Your Initials
                </label>
                <button
                  onClick={() => clearCanvas(initialsCanvasRef.current)}
                  className="flex items-center gap-1 text-sm cursor-pointer transition-colors"
                  style={{ color: tokens.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tokens.text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = tokens.text.secondary;
                  }}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </div>
              <canvas
                ref={initialsCanvasRef}
                width={320}
                height={120}
                className="w-full border rounded-lg cursor-crosshair"
                style={{
                  borderColor: tokens.border.soft,
                  backgroundColor: tokens.surface.elevated,
                }}
                onMouseDown={(e) => startDrawing(initialsCanvasRef.current!, e, false)}
                onMouseMove={(e) => draw(initialsCanvasRef.current!, e, isDrawingInitials)}
                onMouseUp={() => stopDrawing(false)}
                onMouseLeave={() => stopDrawing(false)}
                onTouchStart={(e) => startDrawing(initialsCanvasRef.current!, e, false)}
                onTouchMove={(e) => draw(initialsCanvasRef.current!, e, isDrawingInitials)}
                onTouchEnd={() => stopDrawing(false)}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg font-medium border transition-colors cursor-pointer"
            style={{
              borderColor: tokens.border.soft,
              color: tokens.text.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer"
            style={{
              backgroundColor: tokens.brand.primary,
              color: tokens.text.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = tokens.shadow.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
}
