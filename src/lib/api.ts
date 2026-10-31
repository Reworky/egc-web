const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function authHeader(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('egc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string, auth = false): Promise<T> {
  const isServer = typeof window === 'undefined';
  const res = await fetch(`${BASE}${path}`, {
    headers: auth ? authHeader() : {},
    ...(isServer ? { next: { revalidate: 60 } } : {}),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

/** Обложки 16:9 (1280×720), лежащие в самом сайте (public/games): ровно встают в карточки и не зависят от фото, загруженного в бота. */
const LOCAL_GAME_COVERS: Record<string, string> = {
  'Brawl Stars': '/games/brawl-stars.jpg',
  'Clash of Clans': '/games/clash-of-clans.jpg',
  'Clash Royale': '/games/clash-royale.jpg',
  'CS2': '/games/cs2.jpg',
  'PUBG Mobile': '/games/pubg-mobile.jpg',
  'PUBG PC': '/games/pubg-pc.jpg',
};

/** Обложка игры (баннер): своя из public/games, если есть, иначе фото, загруженное админом через бота (бэкенд отдаёт без авторизации; 404, если у игры её нет). */
export const gamePhotoUrl = (name: string) =>
  LOCAL_GAME_COVERS[name] ?? `${BASE}/api/quests/games/${encodeURIComponent(name)}/photo`;

export const api = {
  stats: () => get<ClubStats>('/api/stats'),
  leaderboard: (type: 'overall' | 'weekly' = 'overall') =>
    get<LeaderboardResponse>(`/api/leaderboard?type=${type}`),
  quests: (params?: { game?: string; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.game) q.set('game', params.game);
    if (params?.category) q.set('category', params.category);
    return get<Quest[]>(`/api/quests${q.size ? '?' + q : ''}`);
  },
  games: () => get<string[]>('/api/quests/games'),
  shopItems: () => get<RewardItem[]>('/api/shop/items'),
  cs2Cases: () => get<Cs2Case[]>('/api/shop/cs2-cases'),
  profile: () => get<UserProfile>('/api/profile', true),
  submissions: () => get<Submission[]>('/api/profile/submissions', true),
  rewards: () => get<RewardRequest[]>('/api/profile/rewards', true),
  wheelStatus: () => get<WheelStatus>('/api/wheel', true),
  wheelSpin: async (): Promise<SpinResponse> => {
    const r = await fetch(`${BASE}/api/wheel/spin`, {
      method: 'POST',
      headers: { ...authHeader() },
    });
    if (!r.ok) throw new Error(`API error ${r.status}`);
    return r.json();
  },
  authTelegram: async (data: Record<string, unknown>): Promise<{ token: string; registered: boolean }> => {
    const r = await fetch(`${BASE}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`HTTP ${r.status}: ${text.substring(0, 300)}`);
    }
  },
};

export interface ClubStats {
  totalPlayers: number;
  totalQuestsCompleted: number;
  totalExcIssued: number;
  topGame: string;
  healthRatioPercent: number;
  payoutPoolRub: number;
}

export interface LeaderboardEntry {
  rank: number;
  telegramId: number;
  nickname: string;
  levelName: string;
  profileTitle: string | null;
  xp: number;
  completedQuests: number;
  leagueName?: string | null;
  leagueExcPrize?: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  me: LeaderboardEntry | null;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  gameName: string;
  category: string;
  platform: string;
  durationDays: number;
  rewardXp: number;
  rewardCoins: number;
  councilOnly: boolean;
  // поля, которые бэкенд тоже отдаёт в /api/quests (нужны главной странице)
  sponsored?: boolean;
  highlightNew?: boolean;
  ticketReward?: number;
  brawlAutoVerify?: boolean;
  campaignClosed?: boolean;
  externalAutoApprove?: boolean;
}

export interface Cs2Case {
  key: string;
  name: string;
  priceExc: number;
  withKey: boolean;
  skins: string[];
  itemId: number | null;
}

export interface RewardItem {
  id: number;
  title: string;
  description: string;
  category: string;
  priceCoins: number;
  effectivePrice: number;
  locked?: boolean;
}

export interface UserProfile {
  telegramId: number;
  nickname: string;
  country: string;
  platformsCsv: string;
  interestsCsv: string;
  profileTitle: string | null;
  xp: number;
  coins: number;
  level: number;
  levelName: string;
  completedQuests: number;
  streakDays: number;
  monthlyWithdrawalLimit: number;
  remainingWithdrawalLimit: number;
}

export interface Submission {
  id: number;
  questTitle: string;
  gameName: string;
  category: string;
  status: string;
  rewardXp: number;
  rewardCoins: number;
  moderatorComment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WheelStatus {
  tickets: number;
  spinsToday: number;
  maxSpinsPerDay: number;
}

export interface SpinResponse {
  success: boolean;
  message: string;
  type: string | null;
  excAmount: number;
  label: string | null;
  newTickets: number;
  spinsToday: number;
}

export interface RewardRequest {
  id: number;
  rewardTitle: string;
  category: string;
  priceCoins: number;
  status: string;
  adminComment: string | null;
  createdAt: string;
}
