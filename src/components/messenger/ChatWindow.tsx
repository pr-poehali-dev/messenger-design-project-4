import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message } from '@/data/chats';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatWindowProps {
  chat: Chat | null;
  onBack: () => void;
}

const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} mb-1.5 animate-fade-in`}>
      <div
        className={`max-w-[72%] px-3.5 py-2 rounded-2xl relative`}
        style={{
          background: msg.isOwn ? 'hsl(var(--msg-accent))' : 'hsl(var(--msg-surface-2))',
          borderRadius: msg.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        }}
      >
        {msg.type === 'voice' ? (
          <div className="flex items-center gap-2.5 min-w-[140px]">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: msg.isOwn ? 'rgba(255,255,255,0.2)' : 'hsl(var(--msg-accent))' }}
            >
              <Icon name={playing ? 'Pause' : 'Play'} size={14} className="text-white" />
            </button>
            <div className="flex-1">
              <div className="flex items-end gap-0.5 h-5 mb-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 rounded-full flex-shrink-0"
                    style={{
                      height: `${Math.random() * 14 + 4}px`,
                      background: msg.isOwn ? 'rgba(255,255,255,0.6)' : 'hsl(var(--msg-accent))',
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] opacity-60">{msg.duration}</span>
            </div>
          </div>
        ) : (
          <p className={`text-sm leading-relaxed ${msg.isOwn ? 'text-white' : 'text-[hsl(var(--msg-text))]'}`}>
            {msg.text}
          </p>
        )}
        <div className={`flex items-center gap-1 justify-end mt-0.5 ${msg.type === 'voice' ? 'mt-1' : ''}`}>
          <span className={`text-[10px] ${msg.isOwn ? 'text-white/60' : 'text-[hsl(var(--msg-text-dim))]'}`}>
            {msg.time}
          </span>
          {msg.isOwn && (
            <Icon
              name={msg.isRead ? 'CheckCheck' : 'Check'}
              size={12}
              className={msg.isRead ? 'text-white/80' : 'text-white/50'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>(chat?.messages || []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chat?.messages || []);
  }, [chat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'hsl(var(--msg-bg))' }}>
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'hsl(var(--msg-surface-2))' }}>
            <Icon name="MessageCircle" size={36} className="text-[hsl(var(--msg-text-dim))]" />
          </div>
          <p className="text-[hsl(var(--msg-text-dim))] text-sm">Выберите чат для начала общения</p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: inputValue,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      isRead: false,
      type: 'text',
    };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
  };

  const statusLabel: Record<string, string> = {
    online: 'В сети',
    offline: 'Не в сети',
    dnd: 'Не беспокоить',
    voice: 'Говорит...',
  };

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'hsl(var(--msg-bg))' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
      >
        <button onClick={onBack} className="md:hidden p-1.5 rounded-lg transition-colors hover:bg-[hsl(var(--msg-surface-2))]">
          <Icon name="ArrowLeft" size={20} className="text-[hsl(var(--msg-text-muted))]" />
        </button>
        <Avatar src={chat.avatar} initials={chat.initials} avatarColor={chat.avatarColor} name={chat.name} size="sm" status={chat.status} verified={chat.verified} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-[hsl(var(--msg-text))]">{chat.name}</div>
          <div className="text-xs" style={{ color: chat.status === 'online' ? 'hsl(var(--msg-online))' : 'hsl(var(--msg-text-dim))' }}>
            {statusLabel[chat.status]}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))]">
            <Icon name="Phone" size={18} className="text-[hsl(var(--msg-text-muted))]" />
          </button>
          <button className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))]">
            <Icon name="Video" size={18} className="text-[hsl(var(--msg-text-muted))]" />
          </button>
          <button className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))]">
            <Icon name="MoreVertical" size={18} className="text-[hsl(var(--msg-text-muted))]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-3 py-3 border-t flex items-end gap-2"
        style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
      >
        <button className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))] flex-shrink-0">
          <Icon name="Paperclip" size={20} className="text-[hsl(var(--msg-text-muted))]" />
        </button>

        <div
          className="flex-1 flex items-center rounded-2xl px-3 py-2"
          style={{ background: 'hsl(var(--msg-surface-2))' }}
        >
          <input
            type="text"
            placeholder="Сообщение..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-sm outline-none text-[hsl(var(--msg-text))] placeholder:text-[hsl(var(--msg-text-dim))]"
          />
          <button className="ml-2">
            <Icon name="Smile" size={18} className="text-[hsl(var(--msg-text-muted))]" />
          </button>
        </div>

        <button
          onClick={inputValue.trim() ? handleSend : () => setIsRecording(!isRecording)}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: isRecording ? '#ef4444' : 'hsl(var(--msg-accent))',
            transform: isRecording ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <Icon
            name={inputValue.trim() ? 'Send' : isRecording ? 'Square' : 'Mic'}
            size={18}
            className="text-white"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
