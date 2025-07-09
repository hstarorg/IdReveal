import { faXTwitter, faTelegram, faDiscord, faGoogle } from '@fortawesome/free-brands-svg-icons';

export const Platforms = [
  {
    name: 'google',
    label: 'Google',
    icon: faGoogle,
    desc: 'Connect to your Google account to get your user info on Google',
  },
  { name: 'x', label: 'X', icon: faXTwitter, desc: 'Connect to your X account to get your user info on X' },
  {
    name: 'telegram',
    label: 'Telegram',
    icon: faTelegram,
    desc: 'Connect to your Telegram account to get your user info on Telegram',
  },
  {
    name: 'discord',
    label: 'Discord',
    icon: faDiscord,
    desc: 'Connect to your Discord account to get your user info on Discord',
  },
];
