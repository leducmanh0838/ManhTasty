import { FaThumbsUp, FaLaughSquint, FaSurprise, FaAngry } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import { GiCook } from 'react-icons/gi';

export const LoginType = {
  SYSTEM: 1,
  GOOGLE: 2,
  FACEBOOK: 3,

  labels: {
    1: 'System',
    2: 'Google',
    3: 'Facebook',
  },

  getLabel(value) {
    return LoginType.labels[value] || null;
  }
};

export const ReasonType = {
  SPAM: 1,
  ABUSE: 2,
  INACCURATE: 3,
  OTHER: 4,

  labels: {
    1: 'Spam',
    2: 'Abuse',
    3: 'Inaccurate',
    4: 'Other',
  },

  getLabel(value) {
    return ReasonType.labels[value] || null;
  }
};

export const MediaType = {
  IMAGE: 1,
  GIF: 2,
  VIDEO: 3,

  labels: {
    1: 'Image',
    2: 'GIF',
    3: 'Video',
  },

  getLabel(value) {
    return LoginType.labels[value] || null;
  }
};

export const EmotionType = {
  LIKE: 1,
  LOVE: 2,
  HAHA: 3,
  WOW: 4,
  DELICIOUS: 5,
  SAD: 6,

  labels: {
    1: 'Thích',
    2: 'Yêu thích',
    3: 'Haha',
    4: 'Wow',
    5: 'Thèm ăn',
    6: 'Phẫn nộ',
  },

  icons: {
    1: '👍', // Like
    2: '❤️', // Love
    3: '😂', // Haha
    4: '😮', // Wow
    5: '😋', // Delicious
    6: '😠', // Angry
  },

  getLabel(value) {
    return EmotionType.labels[value] || null;
  },

  getIcon(value) {
    return EmotionType.icons[value] || null;
  },
};

export const emotionTypes = [
    { id: 1, label: 'Thích', icon: '👍' },
    { id: 2, label: 'Yêu thích', icon: '❤️' },
    { id: 3, label: 'Haha', icon: '😂' },
    { id: 4, label: 'Wow', icon: '😮' },
    { id: 5, label: 'Ngon', icon: '😋' },
    { id: 6, label: 'Phẫn nộ', icon: '😠' },
];



// class MediaType(models.IntegerChoices):
//     IMAGE = 1, 'Image'
//     GIF = 2, 'GIF'
//     VIDEO = 3, 'Video'