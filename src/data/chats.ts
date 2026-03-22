export type MessageType = 'text' | 'voice' | 'image';
export type ChatStatus = 'online' | 'offline' | 'dnd' | 'voice';

export interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  isRead: boolean;
  type: MessageType;
  duration?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  avatarColor?: string;
  initials?: string;
  status: ChatStatus;
  verified: boolean;
  pinned: boolean;
  lastMessage: string;
  lastMessageType: MessageType;
  lastMessageTime: string;
  lastMessageOwn: boolean;
  lastMessageRead: boolean;
  unread: number;
  messages: Message[];
}

const ANNA_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/1f4842f7-38be-408a-acdb-0c657d934937.jpg';
const ARTEM_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/ed3cff40-b157-49d4-a1de-4fcd81a99627.jpg';
const MAMA_AVATAR = 'https://cdn.poehali.dev/projects/68aa4a3d-e723-4653-aaff-f2dac8c6ed22/files/302c0eaa-3878-426c-afc9-42d368bee42b.jpg';

export const chats: Chat[] = [
  {
    id: '1',
    name: 'Работа (Dev Team)',
    avatar: '',
    avatarColor: '#2563eb',
    initials: 'DT',
    status: 'online',
    verified: true,
    pinned: true,
    lastMessage: 'Скинь документы к митингу',
    lastMessageType: 'text',
    lastMessageTime: '21:45',
    lastMessageOwn: false,
    lastMessageRead: false,
    unread: 3,
    messages: [
      { id: 'm1', text: 'Всем привет! Завтра митинг в 10:00', time: '09:00', isOwn: false, isRead: true, type: 'text' },
      { id: 'm2', text: 'Буду', time: '09:15', isOwn: true, isRead: true, type: 'text' },
      { id: 'm3', text: 'Я тоже', time: '09:20', isOwn: false, isRead: true, type: 'text' },
      { id: 'm4', text: 'Скинь документы к митингу', time: '21:45', isOwn: false, isRead: false, type: 'text' },
    ],
  },
  {
    id: '2',
    name: 'Анна К.',
    avatar: ANNA_AVATAR,
    status: 'online',
    verified: true,
    pinned: true,
    lastMessage: 'Ок, жду 🎉',
    lastMessageType: 'text',
    lastMessageTime: '20:12',
    lastMessageOwn: false,
    lastMessageRead: true,
    unread: 0,
    messages: [
      { id: 'm1', text: 'Привет! Как дела?', time: '19:30', isOwn: false, isRead: true, type: 'text' },
      { id: 'm2', text: 'Всё отлично, скоро буду', time: '19:45', isOwn: true, isRead: true, type: 'text' },
      { id: 'm3', text: 'Ок, жду 🎉', time: '20:12', isOwn: false, isRead: true, type: 'text' },
    ],
  },
  {
    id: '3',
    name: 'Мама',
    avatar: MAMA_AVATAR,
    status: 'offline',
    verified: false,
    pinned: false,
    lastMessage: 'Голосовое сообщение',
    lastMessageType: 'voice',
    lastMessageTime: 'Вс',
    lastMessageOwn: false,
    lastMessageRead: false,
    unread: 1,
    messages: [
      { id: 'm1', text: 'Как ты там?', time: '18:00', isOwn: false, isRead: true, type: 'text' },
      { id: 'm2', text: 'Всё хорошо, мам!', time: '18:05', isOwn: true, isRead: true, type: 'text' },
      { id: 'm3', text: '', time: '20:30', isOwn: false, isRead: false, type: 'voice', duration: '0:42' },
    ],
  },
  {
    id: '4',
    name: 'Артём',
    avatar: ARTEM_AVATAR,
    status: 'dnd',
    verified: false,
    pinned: false,
    lastMessage: 'Увидимся завтра',
    lastMessageType: 'text',
    lastMessageTime: '18:03',
    lastMessageOwn: true,
    lastMessageRead: true,
    unread: 0,
    messages: [
      { id: 'm1', text: 'Встречаемся?', time: '17:00', isOwn: false, isRead: true, type: 'text' },
      { id: 'm2', text: 'Увидимся завтра', time: '18:03', isOwn: true, isRead: true, type: 'text' },
    ],
  },
  {
    id: '5',
    name: 'Дизайн-канал',
    avatar: '',
    avatarColor: '#7c3aed',
    initials: '✦',
    status: 'offline',
    verified: true,
    pinned: false,
    lastMessage: 'Новый тренд: glassmorphism возвращается',
    lastMessageType: 'text',
    lastMessageTime: 'Пт',
    lastMessageOwn: false,
    lastMessageRead: true,
    unread: 0,
    messages: [
      { id: 'm1', text: 'Новый тренд: glassmorphism возвращается', time: 'Пт', isOwn: false, isRead: true, type: 'text' },
    ],
  },
  {
    id: '6',
    name: 'Служба поддержки',
    avatar: '',
    avatarColor: '#0891b2',
    initials: 'SP',
    status: 'online',
    verified: true,
    pinned: false,
    lastMessage: 'Ваш запрос принят в обработку',
    lastMessageType: 'text',
    lastMessageTime: 'Пн',
    lastMessageOwn: false,
    lastMessageRead: true,
    unread: 0,
    messages: [
      { id: 'm1', text: 'Ваш запрос принят в обработку', time: 'Пн', isOwn: false, isRead: true, type: 'text' },
    ],
  },
];

export const contacts = [
  { id: 'c1', name: 'Анна К.', avatar: ANNA_AVATAR, phone: '+7 900 123-45-67', status: 'online' as ChatStatus },
  { id: 'c2', name: 'Артём', avatar: ARTEM_AVATAR, phone: '+7 911 234-56-78', status: 'dnd' as ChatStatus },
  { id: 'c3', name: 'Мама', avatar: MAMA_AVATAR, phone: '+7 926 345-67-89', status: 'offline' as ChatStatus },
  { id: 'c4', name: 'Дизайн-канал', avatar: '', phone: '@design_ch', status: 'offline' as ChatStatus, initials: '✦', avatarColor: '#7c3aed' },
];

export const calls = [
  { id: 'cl1', name: 'Анна К.', avatar: ANNA_AVATAR, time: 'Сегодня, 19:20', type: 'incoming', duration: '12:34' },
  { id: 'cl2', name: 'Артём', avatar: ARTEM_AVATAR, time: 'Вчера, 15:05', type: 'outgoing', duration: '3:21' },
  { id: 'cl3', name: 'Мама', avatar: MAMA_AVATAR, time: 'Вс, 11:00', type: 'missed', duration: '' },
  { id: 'cl4', name: 'Работа (Dev Team)', avatar: '', avatarColor: '#2563eb', initials: 'DT', time: 'Пт, 10:00', type: 'outgoing', duration: '45:00' },
];
