import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat, Message } from '@/data/chats';
import Avatar from './Avatar';
import CallScreen from './CallScreen';
import EmojiPicker from './EmojiPicker';
import ContextMenu from './ContextMenu';
import Icon from '@/components/ui/icon';

interface ChatWindowProps {
  chat: Chat | null;
  onBack: () => void;
}

const REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

const MessageBubble: React.FC<{
  msg: Message;
  onContext: (e: React.MouseEvent, msg: Message) => void;
  onReact: (msgId: string, emoji: string) => void;
  reactions: Record<string, string[]>;
}> = ({ msg, onContext, onReact, reactions }) => {
  const [playing, setPlaying] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const msgReactions = reactions[msg.id] || [];

  const waveHeights = useRef(
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 14) + 4)
  );

  return (
    <div
      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} mb-1.5 group`}
      onContextMenu={e => { e.preventDefault(); onContext(e, msg); }}
    >
      <div className="relative max-w-[72%]">
        {/* Reactions bar on hover */}
        <div
          className={`absolute ${msg.isOwn ? 'right-0' : 'left-0'} -top-7 z-10 flex items-center gap-1 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
          style={{ background: 'hsl(var(--msg-surface-2))', border: '1px solid hsl(var(--msg-surface-3))' }}
        >
          {REACTIONS.map(emoji => (
            <button
              key={emoji}
              onClick={() => onReact(msg.id, emoji)}
              className="text-base hover:scale-125 transition-transform leading-none"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Bubble */}
        <div
          className="px-3.5 py-2 animate-fade-in cursor-pointer"
          style={{
            background: msg.isOwn ? 'hsl(var(--msg-accent))' : 'hsl(var(--msg-surface-2))',
            borderRadius: msg.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          }}
          onDoubleClick={() => onReact(msg.id, '❤️')}
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
                  {waveHeights.current.map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full flex-shrink-0 transition-all duration-100"
                      style={{
                        height: `${playing && i <= Math.floor(Date.now() / 200) % 20 ? h : h * 0.5}px`,
                        background: msg.isOwn ? 'rgba(255,255,255,0.6)' : 'hsl(var(--msg-accent))',
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] opacity-60 text-white">{msg.duration}</span>
              </div>
            </div>
          ) : (
            <p className={`text-sm leading-relaxed ${msg.isOwn ? 'text-white' : 'text-[hsl(var(--msg-text))]'}`}>
              {msg.text}
            </p>
          )}

          <div className="flex items-center gap-1 justify-end mt-0.5">
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

        {/* Reactions display */}
        {msgReactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            {Object.entries(
              msgReactions.reduce<Record<string, number>>((acc, r) => { acc[r] = (acc[r] || 0) + 1; return acc; }, {})
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact(msg.id, emoji)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all hover:scale-105"
                style={{ background: 'hsl(var(--msg-surface-2))', border: '1px solid hsl(var(--msg-surface-3))' }}
              >
                <span>{emoji}</span>
                {count > 1 && <span className="text-[hsl(var(--msg-text-muted))]">{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [messages, setMessages] = useState<Message[]>(chat?.messages || []);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msg: Message } | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [pinnedMsg, setPinnedMsg] = useState<Message | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMessages(chat?.messages || []);
    setReplyTo(null);
    setReactions({});
  }, [chat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      recordInterval.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } else {
      if (recordInterval.current) clearInterval(recordInterval.current);
    }
    return () => { if (recordInterval.current) clearInterval(recordInterval.current); };
  }, [isRecording]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: replyTo ? `↩ ${replyTo.text.slice(0, 30)}...\n${inputValue}` : inputValue,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      isRead: false,
      type: 'text',
    };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setReplyTo(null);
  }, [inputValue, replyTo]);

  const handleSendVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      const dur = `0:${recordSeconds.toString().padStart(2, '0')}`;
      const newMsg: Message = {
        id: `m${Date.now()}`,
        text: '',
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        isRead: false,
        type: 'voice',
        duration: dur,
      };
      setMessages(prev => [...prev, newMsg]);
    }
  };

  const handleReact = (msgId: string, emoji: string) => {
    setReactions(prev => {
      const cur = prev[msgId] || [];
      if (cur.includes(emoji)) {
        return { ...prev, [msgId]: cur.filter(e => e !== emoji) };
      }
      return { ...prev, [msgId]: [...cur, emoji] };
    });
  };

  const handleContext = (e: React.MouseEvent, msg: Message) => {
    setContextMenu({ x: e.clientX, y: e.clientY, msg });
  };

  const handleDeleteMsg = (msgId: string) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
  };

  const handlePinMsg = (msg: Message) => {
    setPinnedMsg(prev => prev?.id === msg.id ? null : msg);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'hsl(var(--msg-bg))' }}>
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'hsl(var(--msg-surface-2))' }}>
            <Icon name="MessageCircle" size={36} className="text-[hsl(var(--msg-text-dim))]" />
          </div>
          <p className="font-semibold text-[hsl(var(--msg-text))] mb-1">Выберите чат</p>
          <p className="text-[hsl(var(--msg-text-dim))] text-sm">для начала общения</p>
        </div>
      </div>
    );
  }

  const statusLabel: Record<string, string> = {
    online: 'В сети',
    offline: 'Не в сети',
    dnd: 'Не беспокоить',
    voice: 'Говорит...',
  };

  return (
    <div className="flex-1 flex flex-col relative" style={{ background: 'hsl(var(--msg-bg))' }}>
      {/* Call screen overlay */}
      {callType && (
        <CallScreen
          chat={chat}
          type={callType}
          onEnd={() => setCallType(null)}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-2.5 border-b flex-shrink-0 z-10"
        style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
      >
        <button
          onClick={onBack}
          className="md:hidden p-1.5 rounded-lg transition-colors hover:bg-[hsl(var(--msg-surface-2))]"
        >
          <Icon name="ArrowLeft" size={20} className="text-[hsl(var(--msg-text-muted))]" />
        </button>

        <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => {}}>
          <Avatar
            src={chat.avatar}
            initials={chat.initials}
            avatarColor={chat.avatarColor}
            name={chat.name}
            size="sm"
            status={chat.status}
            verified={chat.verified}
          />
          <div className="min-w-0">
            <div className="font-semibold text-sm text-[hsl(var(--msg-text))] truncate">{chat.name}</div>
            <div
              className="text-xs"
              style={{ color: chat.status === 'online' ? 'hsl(var(--msg-online))' : 'hsl(var(--msg-text-dim))' }}
            >
              {statusLabel[chat.status]}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setCallType('audio')}
            className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))]"
          >
            <Icon name="Phone" size={18} className="text-[hsl(var(--msg-text-muted))]" />
          </button>
          <button
            onClick={() => setCallType('video')}
            className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))]"
          >
            <Icon name="Video" size={18} className="text-[hsl(var(--msg-text-muted))]" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))]"
            >
              <Icon name="MoreVertical" size={18} className="text-[hsl(var(--msg-text-muted))]" />
            </button>
            {showMoreMenu && (
              <ContextMenu
                x={0}
                y={0}
                items={[
                  { icon: 'Search', label: 'Поиск в чате', onClick: () => {} },
                  { icon: 'Bell', label: 'Уведомления', onClick: () => {} },
                  { icon: 'UserPlus', label: 'Добавить участника', onClick: () => {} },
                  { icon: 'Trash2', label: 'Очистить историю', danger: true, onClick: () => setMessages([]) },
                ]}
                onClose={() => setShowMoreMenu(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Pinned message */}
      {pinnedMsg && (
        <div
          className="flex items-center gap-3 px-4 py-2 border-b cursor-pointer hover:bg-[hsl(var(--msg-surface-2))] transition-colors"
          style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
        >
          <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--msg-accent))' }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium" style={{ color: 'hsl(var(--msg-accent))' }}>📌 Закреплённое</div>
            <div className="text-xs text-[hsl(var(--msg-text-muted))] truncate">{pinnedMsg.text}</div>
          </div>
          <button onClick={() => setPinnedMsg(null)}>
            <Icon name="X" size={14} className="text-[hsl(var(--msg-text-dim))]" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <Icon name="MessageCircle" size={48} className="text-[hsl(var(--msg-text-dim))] mb-2" />
            <p className="text-sm text-[hsl(var(--msg-text-dim))]">Нет сообщений</p>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            onContext={handleContext}
            onReact={handleReact}
            reactions={reactions}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply banner */}
      {replyTo && (
        <div
          className="flex items-center gap-3 px-4 py-2 border-t animate-slide-up"
          style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
        >
          <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--msg-accent))' }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium" style={{ color: 'hsl(var(--msg-accent))' }}>Ответ</div>
            <div className="text-xs text-[hsl(var(--msg-text-muted))] truncate">{replyTo.text}</div>
          </div>
          <button onClick={() => setReplyTo(null)}>
            <Icon name="X" size={16} className="text-[hsl(var(--msg-text-dim))]" />
          </button>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div
          className="flex items-center gap-3 px-4 py-2 border-t animate-fade-in"
          style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-[hsl(var(--msg-text-muted))]">
            Запись голосового · {recordSeconds}с
          </span>
          <button className="ml-auto text-xs text-[hsl(var(--msg-text-dim))]" onClick={() => setIsRecording(false)}>
            Отмена
          </button>
        </div>
      )}

      {/* Input area */}
      <div
        className="px-3 py-3 border-t flex items-end gap-2 relative"
        style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
      >
        {/* Emoji picker */}
        {showEmoji && (
          <div className="absolute bottom-full left-3 mb-1 z-50">
            <EmojiPicker
              onSelect={e => setInputValue(prev => prev + e)}
              onClose={() => setShowEmoji(false)}
            />
          </div>
        )}

        <button
          className="p-2 rounded-xl transition-colors hover:bg-[hsl(var(--msg-surface-2))] flex-shrink-0"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/*,application/*';
            input.click();
          }}
        >
          <Icon name="Paperclip" size={20} className="text-[hsl(var(--msg-text-muted))]" />
        </button>

        <div
          className="flex-1 flex items-center rounded-2xl px-3 py-2"
          style={{ background: 'hsl(var(--msg-surface-2))' }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Сообщение..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1 bg-transparent text-sm outline-none text-[hsl(var(--msg-text))] placeholder:text-[hsl(var(--msg-text-dim))]"
          />
          <button
            className="ml-2 transition-transform hover:scale-110"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <Icon name="Smile" size={18} className="text-[hsl(var(--msg-text-muted))]" />
          </button>
        </div>

        <button
          onClick={inputValue.trim() ? handleSend : handleSendVoice}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-95"
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

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={[
            { icon: 'CornerUpLeft', label: 'Ответить', onClick: () => setReplyTo(contextMenu.msg) },
            { icon: 'Copy', label: 'Копировать', onClick: () => navigator.clipboard.writeText(contextMenu.msg.text) },
            { icon: 'Pin', label: pinnedMsg?.id === contextMenu.msg.id ? 'Открепить' : 'Закрепить', onClick: () => handlePinMsg(contextMenu.msg) },
            { icon: 'Forward', label: 'Переслать', onClick: () => {} },
            { icon: 'Trash2', label: 'Удалить', danger: true, onClick: () => handleDeleteMsg(contextMenu.msg.id) },
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
