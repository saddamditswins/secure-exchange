import { ReactNode } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';

interface ExternalCardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export function ExternalCard({ children, className = '', elevated = false }: ExternalCardProps) {
  const { tokens } = useExternalTheme();

  return (
    <div
      className={`rounded-3xl p-8 md:p-10 ${className}`}
      style={{
        backgroundColor: elevated ? tokens.surface.elevated : tokens.surface.card,
        boxShadow: tokens.shadow.md,
      }}
    >
      {children}
    </div>
  );
}
