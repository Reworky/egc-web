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

export const api = {
  stats: () => get<ClubStats>('/api/stats'),
  leaderboard: (type: 'overall' | 'weekly' = 'overall') =>
    get<LeaderboardEntry[]>(`/api/leaderboard?type=${type}`),
  quests: (params?: { game?: string; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.game) q.set('game', params.game);
    if (params?.category) q.set('category', params.category);
    return get<Quest[]>(`/api/quests${q.size ? '?' + q : ''}`);
  },
  games: () => get<string[]>('/api/quests/games'),
  shopItems: () => get<RewardItem[]>('/api/shop/items'),
  profile: () => get<UserProfile>('/api/profile', true),
  submissions: () => get<Submission[]>('/api/profile/submissions', true),
  rewards: () => get<RewardRequest[]>('/api/profile/rewards', true),
  authTelegram: (data: Record<string, unknown>) =>
    fetch(`${BASE}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()) as Promise<{ token: string; registered: boolean }>,
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
}

export interface RewardItem {
  id: number;
  title: string;
  description: string;
  category: string;
  priceCoins: number;
  effectivePrice: number;
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

export interface RewardRequest {
  id: number;
  rewardTitle: string;
  category: string;
  priceCoins: number;
  status: string;
  adminComment: string | null;
  createdAt: string;
}
