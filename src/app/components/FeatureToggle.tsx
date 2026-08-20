import { Switch } from "./ui/switch";

interface FeatureToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string; // Kept for API compatibility but ignored for design consistency
}

export function FeatureToggle({ label, description, checked, onChange }: FeatureToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <div className="text-sm font-medium text-[inherit]">{label}</div>
        <div className="text-xs opacity-70">{description}</div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange} 
        className="data-[state=unchecked]:bg-neutral-600 data-[state=checked]:bg-emerald-500 border-0"
      />
    </div>
  );
}
