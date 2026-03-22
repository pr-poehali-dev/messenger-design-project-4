import React from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface CallEntry {
  id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
  initials?: string;
  time: string;
  type: string;
  duration: string;
}

const ANNA_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/1f4842f7-38be-408a-acdb-0c657d934937.jpg';
const ARTEM_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/ed3cff40-b157-49d4-a1de-4fcd81a99627.jpg';
const MAMA_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/302c0eaa-3878-426c-afc9-42d368bee42b.jpg';

const callsList: CallEntry[] = [
  { id: 'cl1', name: 'Анна К.', avatar: ANNA_AVATAR, time: 'Сегодня, 19:20', type: 'incoming', duration: '12:34' },
  { id: 'cl2', name: 'Артём', avatar: ARTEM_AVATAR, time: 'Вчера, 15:05', type: 'outgoing', duration: '3:21' },
  { id: 'cl3', name: 'Мама', avatar: MAMA_AVATAR, time: 'Вс, 11:00', type: 'missed', duration: '' },
  { id: 'cl4', name: 'Работа (Dev Team)', avatarColor: '#2563eb', initials: 'DT', time: 'Пт, 10:00', type: 'outgoing', duration: '45:00' },
];

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  incoming: { icon: 'PhoneIncoming', color: 'hsl(var(--msg-online))', label: 'Входящий' },
  outgoing: { icon: 'PhoneOutgoing', color: 'hsl(var(--msg-accent))', label: 'Исходящий' },
  missed: { icon: 'PhoneMissed', color: 'hsl(var(--msg-unread))', label: 'Пропущенный' },
};

const CallsTab: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-3">
        <button
          className="w-full flex items-center gap-3 py-2.5 px-3.5 rounded-2xl font-medium text-sm transition-all"
          style={{ background: 'hsl(var(--msg-accent) / 0.12)', color: 'hsl(var(--msg-accent))' }}
        >
          <Icon name="Phone" size={18} />
          Новый звонок
        </button>
      </div>

      <div className="px-4 py-1.5">
        <span className="text-xs font-medium text-[hsl(var(--msg-text-dim))] uppercase tracking-wider">Недавние</span>
      </div>

      {callsList.map(call => {
        const cfg = typeConfig[call.type] || typeConfig.outgoing;
        return (
          <div key={call.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--msg-surface-2))] transition-colors cursor-pointer">
            <Avatar
              src={call.avatar}
              initials={call.initials}
              avatarColor={call.avatarColor}
              name={call.name}
              size="md"
              showStatus={false}
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[hsl(var(--msg-text))] mb-0.5">{call.name}</div>
              <div className="flex items-center gap-1.5 text-xs">
                <Icon name={cfg.icon} size={12} style={{ color: cfg.color }} />
                <span style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="text-[hsl(var(--msg-text-dim))]">· {call.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {call.duration && (
                <span className="text-xs text-[hsl(var(--msg-text-dim))] mr-2">{call.duration}</span>
              )}
              <button className="p-2 rounded-xl hover:bg-[hsl(var(--msg-surface-3))] transition-colors">
                <Icon name="Phone" size={18} className="text-[hsl(var(--msg-accent))]" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CallsTab;