import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from './Avatar';

const ANNA_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/1f4842f7-38be-408a-acdb-0c657d934937.jpg';

interface SettingItem {
  icon: string;
  label: string;
  sublabel?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  accent?: boolean;
}

const settingsSections: { title?: string; items: SettingItem[] }[] = [
  {
    items: [
      { icon: 'UserPen', label: 'Редактировать профиль', sublabel: '@user · +7 900 *** **67' },
    ],
  },
  {
    items: [
      { icon: 'Bell', label: 'Уведомления и звуки' },
      { icon: 'ShieldCheck', label: 'Конфиденциальность', sublabel: 'Двухфакторная аутентификация' },
      { icon: 'HardDrive', label: 'Данные и память', sublabel: '1.2 ГБ использовано' },
    ],
  },
  {
    items: [
      { icon: 'Palette', label: 'Внешний вид' },
      { icon: 'Moon', label: 'Тёмная тема', toggle: true, toggleValue: true },
      { icon: 'Languages', label: 'Язык', sublabel: 'Русский' },
    ],
  },
  {
    items: [
      { icon: 'HelpCircle', label: 'Помощь и поддержка' },
      { icon: 'Info', label: 'О приложении', sublabel: 'Вестник v1.0.0' },
      { icon: 'LogOut', label: 'Выйти из аккаунта', accent: true },
    ],
  },
];

const SettingsTab: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Profile hero */}
      <div
        className="flex flex-col items-center py-6 px-4"
        style={{ background: 'hsl(var(--msg-surface))' }}
      >
        <div className="relative mb-3">
          <Avatar src={ANNA_AVATAR} name="Вы" size="xl" showStatus={false} />
          <button
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'hsl(var(--msg-accent))', border: '2px solid hsl(var(--msg-bg))' }}
          >
            <Icon name="Camera" size={13} className="text-white" />
          </button>
        </div>
        <div className="font-bold text-lg text-[hsl(var(--msg-text))]">Алексей И.</div>
        <div className="text-sm text-[hsl(var(--msg-text-muted))]">@alexey · В сети</div>
      </div>

      <div className="h-3" style={{ background: 'hsl(var(--msg-bg))' }} />

      {settingsSections.map((section, si) => (
        <React.Fragment key={si}>
          <div style={{ background: 'hsl(var(--msg-surface))' }}>
            {section.items.map((item, ii) => (
              <div
                key={ii}
                className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-[hsl(var(--msg-surface-2))] transition-colors"
                style={{ borderBottom: ii < section.items.length - 1 ? '1px solid hsl(var(--msg-surface-2))' : 'none' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.accent ? 'hsl(0 84% 60% / 0.12)' : 'hsl(var(--msg-accent) / 0.12)' }}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    style={{ color: item.accent ? 'hsl(var(--msg-unread))' : 'hsl(var(--msg-accent))' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium"
                    style={{ color: item.accent ? 'hsl(var(--msg-unread))' : 'hsl(var(--msg-text))' }}
                  >
                    {item.label}
                  </div>
                  {item.sublabel && (
                    <div className="text-xs text-[hsl(var(--msg-text-dim))]">{item.sublabel}</div>
                  )}
                </div>
                {item.toggle ? (
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{ background: darkMode ? 'hsl(var(--msg-accent))' : 'hsl(var(--msg-surface-3))' }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-sm"
                      style={{ left: darkMode ? '22px' : '2px' }}
                    />
                  </button>
                ) : !item.accent ? (
                  <Icon name="ChevronRight" size={16} className="text-[hsl(var(--msg-text-dim))] flex-shrink-0" />
                ) : null}
              </div>
            ))}
          </div>
          {si < settingsSections.length - 1 && (
            <div className="h-3" style={{ background: 'hsl(var(--msg-bg))' }} />
          )}
        </React.Fragment>
      ))}

      <div className="h-6" />
    </div>
  );
};

export default SettingsTab;
