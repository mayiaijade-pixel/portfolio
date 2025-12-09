// Static data store for a purely static build (no server / no blob).
// Edit this file and redeploy to change the public data.

export const defaultReels = [
  {
    id: 'yt-demo',
    type: 'youtube',
    src: 'https://www.youtube.com/watch?v=0CDxgFoVUls',
    duration: 44,
    title: '화성에서 온 편지',
    description: '2025 화성시 별별화성 공모전 출품작'
  },
  {
    id: 'glacier',
    type: 'youtube',
    src: 'https://www.youtube.com/watch?v=rlLh5YCtVvw',
    duration: 300,
    title: 'K 블라인드 스타',
    description: '2025년 문화다양성 AI 콘텐츠 공모전'
  },
  {
    id: 'city',
    type: 'youtube',
    src: 'https://www.youtube.com/watch?v=5gM8kzVR_hU',
    duration: 151,
    title: '잊고 있던 꿈을 찾아서 (Chase your dream)',
    description: 'AI와 상상이 만나 잊고 있던 꿈을 다시 꾼다 '
  },
  {
    id: 'analog',
    type: 'youtube',
    src: 'https://www.youtube.com/watch?v=sx5qvaz_12Q',
    duration: 30,
    title: '한진택배 모두가 원하던 원클릭 & 원스타 서비스',
    description: '제2회 매경미디어 AI 영상 광고 숏폼 공모전'
  },
  {
    id: 'city2',
    type: 'youtube',
    src: 'https://www.youtube.com/watch?v=-Rya6tELN2c',
    duration: 30,
    title: '타임폴리오 당신의 미래를 위한 타이밍',
    description: '제2회 매경미디어 AI 영상 광고 숏폼 공모전'
  }
];
let currentReels = defaultReels;

export async function fetchReels() {
  currentReels = defaultReels;
  return currentReels;
}

export function getReels() {
  return currentReels;
}

export function setReels(list) {
  if (!Array.isArray(list)) return;
  currentReels = list;
}

export function toJson() {
  return JSON.stringify(currentReels, null, 2);
}
