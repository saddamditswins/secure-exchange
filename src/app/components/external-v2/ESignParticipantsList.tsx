import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { ExternalCard } from './ExternalCard';
import { CheckCircle2, Clock, User } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed';
  signedAt?: string;
}

interface ESignParticipantsListProps {
  participants: Participant[];
  currentParticipantId: string;
  onStartSigning: (participantId: string) => void;
}

export function ESignParticipantsList({
  participants,
  currentParticipantId,
  onStartSigning,
}: ESignParticipantsListProps) {
  const { tokens } = useExternalTheme();

  return (
    <ExternalCard>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: tokens.text.primary }}>
            Participants
          </h1>
          <p className="text-base" style={{ color: tokens.text.secondary }}>
            Multiple participants will sign on this device
          </p>
        </div>

        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{
                backgroundColor: tokens.surface.elevated,
                borderColor: tokens.border.soft,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      participant.status === 'signed'
                        ? `${tokens.status.success}20`
                        : `${tokens.text.muted}20`,
                  }}
                >
                  {participant.status === 'signed' ? (
                    <CheckCircle2 className="h-5 w-5" style={{ color: tokens.status.success }} />
                  ) : participant.id === currentParticipantId ? (
                    <Clock className="h-5 w-5" style={{ color: tokens.brand.primary }} />
                  ) : (
                    <User className="h-5 w-5" style={{ color: tokens.text.muted }} />
                  )}
                </div>

                <div>
                  <p className="font-medium" style={{ color: tokens.text.primary }}>
                    {participant.name}
                  </p>
                  <p className="text-sm" style={{ color: tokens.text.muted }}>
                    {participant.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {participant.status === 'signed' ? (
                  <div className="text-right">
                    <p className="text-sm font-medium" style={{ color: tokens.status.success }}>
                      Signed
                    </p>
                    {participant.signedAt && (
                      <p className="text-xs" style={{ color: tokens.text.muted }}>
                        {participant.signedAt}
                      </p>
                    )}
                  </div>
                ) : participant.id === currentParticipantId ? (
                  <button
                    onClick={() => onStartSigning(participant.id)}
                    className="px-4 py-2 rounded-lg font-medium transition-all cursor-pointer"
                    style={{
                      backgroundColor: tokens.brand.primary,
                      color: tokens.text.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = tokens.shadow.sm;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Sign Documents
                  </button>
                ) : (
                  <span
                    className="text-sm font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${tokens.text.muted}20`,
                      color: tokens.text.muted,
                    }}
                  >
                    Waiting
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ExternalCard>
  );
}
