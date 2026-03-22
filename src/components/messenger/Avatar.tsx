import React from 'react';
import { ChatStatus } from '@/data/chats';

interface AvatarProps {
  src?: string;
  initials?: string;
  avatarColor?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: ChatStatus;
  verified?: boolean;
  showStatus?: boolean;
}

const sizeMap = {
  sm: { outer: 'w-8 h-8', text: 'text-xs', badge: 'w-2.5 h-2.5', badgePos: '-bottom-0 -right-0', verifySize: 14 },
  md: { outer: 'w-12 h-12', text: 'text-sm', badge: 'w-3 h-3', badgePos: 'bottom-0 right-0', verifySize: 16 },
  lg: { outer: 'w-16 h-16', text: 'text-base', badge: 'w-3.5 h-3.5', badgePos: 'bottom-0.5 right-0.5', verifySize: 18 },
  xl: { outer: 'w-20 h-20', text: 'text-xl', badge: 'w-4 h-4', badgePos: 'bottom-1 right-1', verifySize: 22 },
};

const statusColors: Record<ChatStatus, string> = {
  online: '#22c55e',
  offline: '#6b7280',
  dnd: '#f59e0b',
  voice: '#3b82f6',
};

const StatusIcon = ({ status, size }: { status: ChatStatus; size: number }) => {
  if (status === 'online') return null;
  if (status === 'dnd') return <span style={{ fontSize: size * 0.6 }}>🌙</span>;
  if (status === 'voice') return <span style={{ fontSize: size * 0.6 }}>🎙</span>;
  return null;
};

const Avatar: React.FC<AvatarProps> = ({
  src, initials, avatarColor, name, size = 'md', status, verified, showStatus = true
}) => {
  const s = sizeMap[size];
  const fallbackColor = avatarColor || '#1d4ed8';

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${s.outer} rounded-full overflow-hidden flex items-center justify-center font-semibold text-white`}
        style={{ background: src ? undefined : fallbackColor }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className={s.text}>{initials || name.charAt(0)}</span>
        )}
      </div>

      {showStatus && status && status !== 'offline' && (
        <div
          className={`absolute ${s.badgePos} ${s.badge} rounded-full border-2 flex items-center justify-center`}
          style={{
            background: statusColors[status],
            borderColor: 'hsl(220 16% 8%)',
          }}
        >
          {status !== 'online' && (
            <StatusIcon status={status} size={parseInt(s.badge)} />
          )}
        </div>
      )}

      {verified && (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-blue-500 flex items-center justify-center"
          style={{ width: s.verifySize, height: s.verifySize, border: '2px solid hsl(220 16% 8%)' }}
        >
          <svg width={s.verifySize * 0.55} height={s.verifySize * 0.55} viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar;
