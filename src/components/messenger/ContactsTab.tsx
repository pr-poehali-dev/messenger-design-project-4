import React, { useState } from 'react';
import { contacts } from '@/data/chats';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const ContactsTab: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-3">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: 'hsl(var(--msg-surface-2))' }}
        >
          <Icon name="Search" size={16} className="text-[hsl(var(--msg-text-dim))]" />
          <input
            type="text"
            placeholder="Поиск контактов..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-[hsl(var(--msg-text))] placeholder:text-[hsl(var(--msg-text-dim))]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-1.5">
          <span className="text-xs font-medium text-[hsl(var(--msg-text-dim))] uppercase tracking-wider">Все контакты</span>
        </div>

        {filtered.map(contact => (
          <div
            key={contact.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--msg-surface-2))] transition-colors cursor-pointer"
          >
            <Avatar
              src={contact.avatar}
              initials={(contact as { initials?: string }).initials}
              avatarColor={(contact as { avatarColor?: string }).avatarColor}
              name={contact.name}
              size="md"
              status={contact.status}
              showStatus={true}
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[hsl(var(--msg-text))]">{contact.name}</div>
              <div className="text-xs text-[hsl(var(--msg-text-dim))]">{contact.phone}</div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-xl hover:bg-[hsl(var(--msg-surface-3))] transition-colors">
                <Icon name="MessageCircle" size={16} className="text-[hsl(var(--msg-text-muted))]" />
              </button>
              <button className="p-2 rounded-xl hover:bg-[hsl(var(--msg-surface-3))] transition-colors">
                <Icon name="Phone" size={16} className="text-[hsl(var(--msg-text-muted))]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsTab;
