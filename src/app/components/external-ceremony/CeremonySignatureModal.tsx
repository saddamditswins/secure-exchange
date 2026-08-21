import { useState, useRef, useEffect } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { X, Type, PenTool, Upload, RotateCcw, Check } from 'lucide-react';

interface CeremonySignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string, initialsData: string) => void;
  participantName: string;
}

export function CeremonySignatureModal({
  isOpen,
  onClose,
  onSave,
  participantName,
}: CeremonySignatureModalProps) {
  const { tokens } = useExternalTheme();
  const [activeTab, setActiveTab] = useState<'type' | 'draw' | 'upload'>('type');
  const [typedSignature, setTypedSignature] = useState(participantName);
  const [selectedFont, setSelectedFont] = useState('font-cursive');
  const [consentChecked, setConsentChecked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConsentChecked(false);
      setActiveTab('type');
    }
  }, [isOpen]);

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = tokens.text.primary;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (!consentChecked) return;

    let signatureData = '';

    if (activeTab === 'type') {
      signatureData = typedSignature;
    } else if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        signatureData = canvas.toDataURL();
      }
    }

    // Generate simple initials from first letters
    const initials = participantName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    onSave(signatureData, initials);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{
        backgroundColor: tokens.surface.overlay,
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          backgroundColor: tokens.surface.elevated,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-8 py-6 flex items-center justify-between border-b"
          style={{ borderColor: tokens.border.soft }}
        >
          <h2 className="text-2xl font-bold" style={{ color: tokens.text.primary }}>
            Create Your Signature
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: tokens.text.muted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
              e.currentTarget.style.color = tokens.text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = tokens.text.muted;
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b"
          style={{ borderColor: tokens.border.soft }}
        >
          {[
            { id: 'type', label: 'Type', icon: Type },
            { id: 'draw', label: 'Draw', icon: PenTool },
            { id: 'upload', label: 'Upload', icon: Upload },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-all cursor-pointer border-b-2"
              style={{
                color: activeTab === tab.id ? tokens.brand.primary : tokens.text.muted,
                borderColor: activeTab === tab.id ? tokens.brand.primary : 'transparent',
                backgroundColor: activeTab === tab.id ? `${tokens.brand.primary}05` : 'transparent',
              }}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Type Tab */}
          {activeTab === 'type' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                  Type your full name
                </label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-base transition-all"
                  style={{
                    borderColor: tokens.border.soft,
                    backgroundColor: tokens.surface.app,
                    color: tokens.text.primary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = tokens.brand.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${tokens.brand.primary}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = tokens.border.soft;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                  Choose a font style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'font-cursive', name: 'Cursive', style: 'Dancing Script' },
                    { id: 'font-script', name: 'Script', style: 'Pacifico' },
                    { id: 'font-elegant', name: 'Elegant', style: 'Great Vibes' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className="p-4 rounded-xl border-2 transition-all cursor-pointer"
                      style={{
                        borderColor: selectedFont === font.id ? tokens.brand.primary : tokens.border.soft,
                        backgroundColor: selectedFont === font.id ? `${tokens.brand.primary}10` : tokens.surface.app,
                      }}
                    >
                      <p className="text-xs font-medium mb-2" style={{ color: tokens.text.muted }}>
                        {font.name}
                      </p>
                      <p className="text-2xl" style={{ fontFamily: font.style, color: tokens.text.primary }}>
                        {typedSignature || participantName}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div
                className="rounded-xl p-4 sm:p-8 flex items-center justify-center border"
                style={{
                  backgroundColor: tokens.surface.app,
                  borderColor: tokens.border.soft,
                  minHeight: '120px',
                }}
              >
                <p
                  className="text-4xl"
                  style={{
                    fontFamily: selectedFont === 'font-cursive' ? 'Dancing Script' : selectedFont === 'font-script' ? 'Pacifico' : 'Great Vibes',
                    color: tokens.text.primary,
                  }}
                >
                  {typedSignature || participantName}
                </p>
              </div>
            </div>
          )}

          {/* Draw Tab */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                  Draw your signature below
                </p>
                <button
                  onClick={handleClearCanvas}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: tokens.text.muted,
                    backgroundColor: tokens.surface.app,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                    e.currentTarget.style.color = tokens.text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.surface.app;
                    e.currentTarget.style.color = tokens.text.muted;
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className="w-full rounded-xl border-2 cursor-crosshair"
                style={{
                  backgroundColor: tokens.surface.app,
                  borderColor: tokens.border.soft,
                }}
                onMouseDown={handleDrawStart}
                onMouseMove={handleDrawMove}
                onMouseUp={handleDrawEnd}
                onMouseLeave={handleDrawEnd}
              />

              <p className="text-xs text-center" style={{ color: tokens.text.muted }}>
                Use your mouse or trackpad to sign above
              </p>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                className="rounded-xl p-12 border-2 border-dashed text-center cursor-pointer transition-all"
                style={{
                  backgroundColor: tokens.surface.app,
                  borderColor: tokens.border.soft,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tokens.brand.primary;
                  e.currentTarget.style.backgroundColor = `${tokens.brand.primary}05`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = tokens.border.soft;
                  e.currentTarget.style.backgroundColor = tokens.surface.app;
                }}
              >
                <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: tokens.text.muted }} />
                <p className="font-medium mb-2" style={{ color: tokens.text.primary }}>
                  Click to upload or drag and drop
                </p>
                <p className="text-sm" style={{ color: tokens.text.muted }}>
                  PNG, JPG or GIF (max. 2MB)
                </p>
              </div>
            </div>
          )}

          {/* Consent */}
          <div
            className="mt-6 rounded-xl p-4"
            style={{ backgroundColor: `${tokens.brand.primary}10` }}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="h-5 w-5 rounded cursor-pointer appearance-none border-2 transition-all"
                  style={{
                    borderColor: consentChecked ? tokens.brand.primary : tokens.border.soft,
                    backgroundColor: consentChecked ? '#10b981' : 'transparent',
                  }}
                />
                {consentChecked && (
                  <Check
                    className="h-3 w-3 absolute pointer-events-none"
                    style={{ color: tokens.text.inverse }}
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                  I agree that my electronic signature is legally binding.
                </p>
                <p className="text-xs mt-1" style={{ color: tokens.text.secondary }}>
                  By checking this box, you consent to sign this document electronically and acknowledge that your electronic signature has the same legal effect as a handwritten signature.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-6 flex items-center justify-end gap-3 border-t"
          style={{ borderColor: tokens.border.soft }}
        >
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer"
            style={{
              color: tokens.text.primary,
              backgroundColor: tokens.surface.app,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tokens.surface.app;
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!consentChecked}
            className="px-8 py-3 rounded-xl font-medium transition-all cursor-pointer"
            style={{
              backgroundColor: consentChecked ? tokens.brand.primary : tokens.text.muted,
              color: tokens.text.inverse,
              opacity: consentChecked ? '1' : tokens.interaction.disabled.opacity,
            }}
            onMouseEnter={(e) => {
              if (consentChecked) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
