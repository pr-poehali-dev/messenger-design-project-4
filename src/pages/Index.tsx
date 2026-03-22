import React, { useState } from 'react';
import { chats, Chat } from '@/data/chats';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import CallsTab from '@/components/messenger/CallsTab';
import ContactsTab from '@/components/messenger/ContactsTab';
import ChannelsTab from '@/components/messenger/ChannelsTab';
import SettingsTab from '@/components/messenger/SettingsTab';
import Avatar from '@/components/messenger/Avatar';
import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'calls' | 'channels' | 'contacts' | 'settings';

const MY_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/1f4842f7-38be-408a-acdb-0c657d934937.jpg';

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'calls', icon: 'Phone', label: 'Звонки' },
  { id: 'channels', icon: 'Radio', label: 'Каналы' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'settings', icon: 'Settings', label: 'Профиль' },
];

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  const filteredChats = searchQuery
    ? chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setShowSidebar(false);
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <ChatList
            chats={filteredChats}
            activeId={activeChat?.id ?? null}
            onSelect={handleSelectChat}
          />
        );
      case 'calls': return <CallsTab />;
      case 'channels': return <ChannelsTab />;
      case 'contacts': return <ContactsTab />;
      case 'settings': return <SettingsTab />;
    }
  };

  const getTabTitle = () => tabs.find(t => t.id === activeTab)?.label ?? '';

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'hsl(var(--msg-bg))' }}>
      {/* Sidebar */}
      <div
        className={`
          flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300
          ${showSidebar ? 'w-full' : 'w-0'} md:w-80 lg:w-96
        `}
        style={{
          background: 'hsl(var(--msg-surface))',
          borderRight: '1px solid hsl(var(--msg-surface-3))',
        }}
      >
        {/* Header */}
        {activeTab !== 'settings' && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0"
            style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
          >
            <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--msg-surface-2))] transition-colors">
              <Icon name="Menu" size={20} className="text-[hsl(var(--msg-text-muted))]" />
            </button>

            {searchOpen ? (
              <div
                className="flex-1 flex items-center gap-2 rounded-xl px-3 py-1.5 animate-fade-in"
                style={{ background: 'hsl(var(--msg-surface-2))' }}
              >
                <Icon name="Search" size={15} className="text-[hsl(var(--msg-text-dim))]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-[hsl(var(--msg-text))] placeholder:text-[hsl(var(--msg-text-dim))]"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                  <Icon name="X" size={14} className="text-[hsl(var(--msg-text-dim))]" />
                </button>
              </div>
            ) : (
              <>
                <span className="font-bold text-[15px] text-[hsl(var(--msg-text))] flex-1">{getTabTitle()}</span>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-[hsl(var(--msg-surface-2))] transition-colors"
                >
                  <Icon name="Search" size={18} className="text-[hsl(var(--msg-text-muted))]" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--msg-surface-2))] transition-colors">
                  <Icon name="UserPlus" size={18} className="text-[hsl(var(--msg-text-muted))]" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--msg-surface-2))] transition-colors">
                  <Icon name="MoreVertical" size={18} className="text-[hsl(var(--msg-text-muted))]" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Tab content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderTabContent()}
        </div>

        {/* Bottom nav */}
        <div
          className="flex-shrink-0 border-t"
          style={{ background: 'hsl(var(--msg-surface))', borderColor: 'hsl(var(--msg-surface-3))' }}
        >
          <div className="flex items-center pb-safe">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowSidebar(true);
                    if (tab.id !== 'chats') setActiveChat(null);
                  }}
                  className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative transition-all duration-200"
                >
                  {isActive && (
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                      style={{ background: 'hsl(var(--msg-accent))' }}
                    />
                  )}
                  <div className="relative">
                    {tab.id === 'settings' ? (
                      <div className={`rounded-full transition-all ${isActive ? 'ring-2 ring-offset-1' : ''}`} style={{ ringColor: 'hsl(var(--msg-accent))', ringOffsetColor: 'hsl(var(--msg-surface))' }}>
                        <Avatar
                          src={MY_AVATAR}
                          name="Алексей"
                          size="sm"
                          showStatus={false}
                        />
                      </div>
                    ) : (
                      <Icon
                        name={tab.icon}
                        size={22}
                        style={{ color: isActive ? 'hsl(var(--msg-accent))' : 'hsl(var(--msg-text-dim))' }}
                      />
                    )}
                    {tab.id === 'chats' && totalUnread > 0 && !isActive && (
                      <span
                        className="absolute -top-1 -right-2 min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 text-[9px] font-bold text-white"
                        style={{ background: 'hsl(var(--msg-unread))' }}
                      >
                        {totalUnread > 99 ? '99+' : totalUnread}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-medium leading-none"
                    style={{ color: isActive ? 'hsl(var(--msg-accent))' : 'hsl(var(--msg-text-dim))' }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div
        className={`flex-1 flex-col ${!showSidebar ? 'flex' : 'hidden md:flex'}`}
      >
        <ChatWindow chat={activeTab === 'chats' ? activeChat : null} onBack={handleBack} />
      </div>
    </div>
  );
};

export default Index;
