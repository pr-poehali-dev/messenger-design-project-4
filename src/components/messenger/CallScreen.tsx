import React, { useState, useEffect } from 'react';
import { Chat } from '@/data/chats';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface CallScreenProps {
  chat: Chat;
  type: 'audio' | 'video';
  onEnd: () => void;
}

const CallScreen: React.FC<CallScreenProps> = ({ chat, type, onEnd }) => {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [videoOn, setVideoOn] = useState(type === 'video');
  const [status, setStatus] = useState<'calling' | 'connected'>('calling');

  useEffect(() => {
    const t = setTimeout(() => setStatus('connected'), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6 animate-fade-in"
      style={{ background: 'linear-gradient(160deg, hsl(220 20% 10%) 0%, hsl(213 60% 14%) 100%)' }}
    >
      {/* Top info */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar
            src={chat.avatar}
            initials={chat.initials}
            avatarColor={chat.avatarColor}
            name={chat.name}
            size="xl"
            showStatus={false}
          />
          {status === 'calling' && (
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'hsl(var(--msg-accent))' }} />
          )}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{chat.name}</div>
          <div className="text-sm" style={{ color: 'hsl(213 80% 75%)' }}>
            {status === 'calling' ? 'Вызов...' : fmt(seconds)}
          </div>
          {type === 'video' && status === 'connected' && (
            <div className="text-xs mt-1 opacity-50 text-white">HD-видеозвонок</div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs">
        {/* Main row */}
        <div className="flex items-center justify-between mb-6">
          <ControlBtn
            icon={muted ? 'MicOff' : 'Mic'}
            label={muted ? 'Откл. микр.' : 'Микрофон'}
            active={muted}
            onClick={() => setMuted(!muted)}
          />
          <ControlBtn
            icon={speakerOn ? 'Volume2' : 'VolumeX'}
            label="Динамик"
            active={!speakerOn}
            onClick={() => setSpeakerOn(!speakerOn)}
          />
          {type === 'video' && (
            <ControlBtn
              icon={videoOn ? 'Video' : 'VideoOff'}
              label="Камера"
              active={!videoOn}
              onClick={() => setVideoOn(!videoOn)}
            />
          )}
          <ControlBtn icon="MessageCircle" label="Чат" onClick={() => onEnd()} />
        </div>

        {/* End call */}
        <div className="flex justify-center">
          <button
            onClick={onEnd}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: '#ef4444' }}
          >
            <Icon name="PhoneOff" size={26} className="text-white" />
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-white/40">Завершить</div>
      </div>
    </div>
  );
};

const ControlBtn: React.FC<{
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
      style={{ background: active ? 'hsl(var(--msg-accent))' : 'rgba(255,255,255,0.1)' }}
    >
      <Icon name={icon} size={22} className="text-white" />
    </div>
    <span className="text-xs text-white/60">{label}</span>
  </button>
);

export default CallScreen;
