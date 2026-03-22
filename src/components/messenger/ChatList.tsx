import React from 'react';
import { Chat } from '@/data/chats';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatListProps {
  chats: Chat[];
  activeId: string | null;
  onSelect: (chat: Chat) => void;
}

const ChatItem: React.FC<{ chat: Chat; active: boolean; onClick: () => void; delay: number }> = ({
  chat, active, onClick, delay
}) => {
  const renderLastMessage = () => {
    if (chat.lastMessageType === 'voice') {
      return (
        <span className="flex items-center gap-1 text-[hsl(var(--msg-text-muted))]">
          <Icon name="Mic" size={12} />
          <span>Голосовое сообщение</span>
        </span>
      );
    }
    return (
      <span className={chat.lastMessageOwn ? 'text-[hsl(var(--msg-text-muted))]' : 'text-[hsl(var(--msg-text-muted))]'}>
        {chat.lastMessageOwn && <span className="text-[hsl(var(--msg-accent))] mr-1">Вы:</span>}
        {chat.lastMessage}
      </span>
    );
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 relative group"
      style={{
        background: active ? 'hsl(var(--msg-surface-3))' : chat.pinned ? 'hsl(var(--msg-pin) / 0.5)' : 'transparent',
        animationDelay: `${delay}ms`,
      }}
    >
      {active && (
        <div
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
          style={{ background: 'hsl(var(--msg-accent))' }}
        />
      )}

      <Avatar
        src={chat.avatar}
        initials={chat.initials}
        avatarColor={chat.avatarColor}
        name={chat.name}
        size="md"
        status={chat.status}
        verified={chat.verified}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {chat.pinned && (
              <Icon name="Pin" size={11} className="text-[hsl(var(--msg-text-dim))] flex-shrink-0 rotate-45" />
            )}
            <span className="font-semibold text-sm text-[hsl(var(--msg-text))] truncate">{chat.name}</span>
          </div>
          <span className="text-xs text-[hsl(var(--msg-text-dim))] flex-shrink-0 ml-2">{chat.lastMessageTime}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs truncate flex-1 mr-2 flex items-center gap-1">
            {chat.lastMessageOwn && chat.lastMessageRead && (
              <Icon name="CheckCheck" size={12} className="text-[hsl(var(--msg-accent))] flex-shrink-0" />
            )}
            {chat.lastMessageOwn && !chat.lastMessageRead && (
              <Icon name="Check" size={12} className="text-[hsl(var(--msg-text-dim))] flex-shrink-0" />
            )}
            {renderLastMessage()}
          </div>
          {chat.unread > 0 && (
            <div
              className="flex-shrink-0 min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 text-xs font-semibold text-white"
              style={{ background: 'hsl(var(--msg-unread))' }}
            >
              {chat.unread > 99 ? '99+' : chat.unread}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

const ChatList: React.FC<ChatListProps> = ({ chats, activeId, onSelect }) => {
  const pinned = chats.filter(c => c.pinned);
  const regular = chats.filter(c => !c.pinned);

  return (
    <div className="flex-1 overflow-y-auto">
      {pinned.length > 0 && (
        <>
          <div className="px-4 py-1.5">
            <span className="text-xs font-medium text-[hsl(var(--msg-text-dim))] uppercase tracking-wider">
              Закреплённые
            </span>
          </div>
          {pinned.map((chat, i) => (
            <ChatItem key={chat.id} chat={chat} active={activeId === chat.id} onClick={() => onSelect(chat)} delay={i * 40} />
          ))}
          <div className="h-px mx-4 my-1" style={{ background: 'hsl(var(--msg-surface-3))' }} />
        </>
      )}

      {regular.map((chat, i) => (
        <ChatItem key={chat.id} chat={chat} active={activeId === chat.id} onClick={() => onSelect(chat)} delay={(pinned.length + i) * 40} />
      ))}
    </div>
  );
};

export default ChatList;
