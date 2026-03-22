import React from 'react';
import Icon from '@/components/ui/icon';
import Avatar from './Avatar';

const channels = [
  { id: 'ch1', name: 'Дизайн-канал', initials: '✦', avatarColor: '#7c3aed', members: '12.4K', lastPost: 'Новый тренд: glassmorphism возвращается', time: 'Пт', subscribed: true },
  { id: 'ch2', name: 'Tech Новости', initials: 'TN', avatarColor: '#0891b2', members: '89.1K', lastPost: 'Apple анонсировал новые Mac с M4 Ultra', time: 'Сб', subscribed: true },
  { id: 'ch3', name: 'Криптовалюта', initials: '₿', avatarColor: '#d97706', members: '203K', lastPost: 'BTC пробил отметку $100k', time: 'Вс', subscribed: false },
  { id: 'ch4', name: 'Подборки книг', initials: '📚', avatarColor: '#059669', members: '34.7K', lastPost: '10 книг, которые изменили мою жизнь', time: 'Чт', subscribed: true },
];

const ChannelsTab: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-3">
        <button
          className="w-full flex items-center gap-3 py-2.5 px-3.5 rounded-2xl font-medium text-sm transition-all"
          style={{ background: 'hsl(var(--msg-accent) / 0.12)', color: 'hsl(var(--msg-accent))' }}
        >
          <Icon name="Plus" size={18} />
          Создать канал
        </button>
      </div>

      <div className="px-4 py-1.5">
        <span className="text-xs font-medium text-[hsl(var(--msg-text-dim))] uppercase tracking-wider">Мои каналы</span>
      </div>

      {channels.filter(c => c.subscribed).map(ch => (
        <ChannelItem key={ch.id} channel={ch} />
      ))}

      <div className="px-4 py-1.5 mt-2">
        <span className="text-xs font-medium text-[hsl(var(--msg-text-dim))] uppercase tracking-wider">Рекомендуемые</span>
      </div>

      {channels.filter(c => !c.subscribed).map(ch => (
        <ChannelItem key={ch.id} channel={ch} />
      ))}
    </div>
  );
};

interface Channel {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  members: string;
  lastPost: string;
  time: string;
  subscribed: boolean;
}

const ChannelItem: React.FC<{ channel: Channel }> = ({ channel }) => (
  <div className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--msg-surface-2))] transition-colors cursor-pointer">
    <Avatar name={channel.name} initials={channel.initials} avatarColor={channel.avatarColor} size="md" showStatus={false} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-semibold text-sm text-[hsl(var(--msg-text))]">{channel.name}</span>
        <span className="text-xs text-[hsl(var(--msg-text-dim))]">{channel.time}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[hsl(var(--msg-text-muted))] truncate mr-2">{channel.lastPost}</span>
        <span className="text-xs text-[hsl(var(--msg-text-dim))] flex-shrink-0 flex items-center gap-1">
          <Icon name="Users" size={10} />
          {channel.members}
        </span>
      </div>
    </div>
  </div>
);

export default ChannelsTab;
