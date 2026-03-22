import React from 'react';
import Icon from '@/components/ui/icon';

interface MenuItem {
  icon: string;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 rounded-2xl py-1 shadow-2xl min-w-[180px] animate-scale-in"
        style={{
          left: Math.min(x, window.innerWidth - 200),
          top: Math.min(y, window.innerHeight - items.length * 44 - 16),
          background: 'hsl(var(--msg-surface-2))',
          border: '1px solid hsl(var(--msg-surface-3))',
          transformOrigin: 'top left',
        }}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && item.danger && (
              <div className="h-px mx-3 my-1" style={{ background: 'hsl(var(--msg-surface-3))' }} />
            )}
            <button
              onClick={() => { item.onClick(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[hsl(var(--msg-surface-3))]"
              style={{ color: item.danger ? 'hsl(var(--msg-unread))' : 'hsl(var(--msg-text))' }}
            >
              <Icon name={item.icon} size={16} style={{ color: item.danger ? 'hsl(var(--msg-unread))' : 'hsl(var(--msg-text-muted))' }} />
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default ContextMenu;
