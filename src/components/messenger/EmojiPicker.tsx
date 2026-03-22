import React from 'react';

const EMOJIS = [
  '😀','😂','🥹','😍','🤩','😎','🥳','😭','😡','🤔',
  '👍','👎','❤️','🔥','🎉','💯','👏','🙏','💪','✨',
  '😅','😬','🫡','🤗','😏','🥺','😴','🤯','🫶','💀',
  '🍕','🎮','🚀','⚡','🌟','💎','🏆','🎯','🎶','📱',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className="absolute bottom-full mb-2 left-0 z-40 rounded-2xl p-3 shadow-2xl animate-slide-up"
        style={{ background: 'hsl(var(--msg-surface-2))', border: '1px solid hsl(var(--msg-surface-3))' }}
      >
        <div className="grid grid-cols-10 gap-1">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => { onSelect(emoji); onClose(); }}
              className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-[hsl(var(--msg-surface-3))] transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmojiPicker;
