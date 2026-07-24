export type PrimaryMenuId = 
  | 'dashboard'
  | 'finance'
  | 'questions'
  | 'rooms'
  | 'users'
  | 'settings';

export type FinanceSubTab = 'recharge-orders' | 'transfer-logs' | 'reconciliation' | 'exceptions';
export type QuestionsSubTab = 'modes' | 'categories' | 'list' | 'import-export' | 'audit';
export type RoomsSubTab = 'active' | 'history' | 'logs';
export type UsersSubTab = 'players' | 'sponsors' | 'blacklist';
export type SettingsSubTab = 'wechat-pay' | 'risk-rules' | 'admins';

export type SubMenuId = FinanceSubTab | QuestionsSubTab | RoomsSubTab | UsersSubTab | SettingsSubTab;

export type GameModeCode = 'QUIZ_QUESTION' | 'SPEED_CLICK' | 'SHAKE_RACE' | 'VOICE_SPEECH' | 'FAMILY_TRIVIA';

export interface GameModeItem {
  id: string;
  code: GameModeCode;
  name: string;
  interactionType: string;
  ruleConfigSummary: string;
  status: 'ENABLED' | 'DISABLED';
  config: {
    timeLimitSec?: number;
    questionCount?: number;
    targetSeconds?: number;
    allowedErrorSec?: number;
    shakeTimeLimitSec?: number;
    targetShakeCount?: number;
    voiceMatchThreshold?: number;
    voiceSensitivity?: 'HIGH' | 'MEDIUM' | 'LOW';
    triviaPromptTemplate?: string;
  };
}

// 1. Dashboard Metrics
export interface DashboardStats {
  totalRecharge: number;
  totalPayout: number;
  todayRecharge: number;
  todayPayout: number;
  todayRoomsCreated: number;
  todayActivePlayers: number;
  wxTransferSuccessRate: number;
  pendingExceptionsCount: number;
  pendingAuditQuestionsCount: number;
}

// 2. Finance Data Models
export interface RechargeOrder {
  id: string;
  outTradeNo: string;
  wxPayNo: string;
  roomCode: string;
  sponsorOpenId: string;
  sponsorName: string;
  sponsorAvatar: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED';
  payTime: string;
}

export interface TransferLog {
  id: string;
  outBatchNo: string;
  detailNo: string;
  roomNo: string;
  playerOpenId: string;
  playerName: string;
  playerAvatar: string;
  totalAmount: number;
  baseAmount: number;
  scoreAmount: number;
  tipAmount: number;
  status: 'SUCCESS' | 'PROCESSING' | 'FAILED';
  completeTime: string;
  errorJson?: string;
}

export interface ReconciliationRow {
  date: string;
  initialBalance: number;
  depositTotal: number;
  transferTotal: number;
  refundTotal: number;
  theoreticalEndBalance: number;
  actualMchBalance: number;
  status: 'BALANCED' | 'DISCREPANCY';
}

export interface ExceptionRecord {
  id: string;
  outBatchNo: string;
  roomNo: string;
  playerOpenId: string;
  playerName: string;
  amount: number;
  status: 'FAILED' | 'RETRYING' | 'RESOLVED' | 'REFUNDED';
  failReason: string;
  createdAt: string;
  retryCount: number;
}

// 3. Question Data Models
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CategoryItem {
  id: string;
  code: string;
  name: string;
  iconUrl: string;
  sortOrder: number;
  questionCount: number;
  status: 'ENABLED' | 'DISABLED';
}

export interface QuestionItem {
  id: string;
  modeCode?: GameModeCode;
  title: string;
  categoryCode: string;
  categoryName: string;
  difficulty: QuestionDifficulty;
  options: string[];
  correctAnswerIndex: number;
  
  // Specific to VOICE_SPEECH (绕口令朗读)
  pinyin?: string;
  keywords?: string[];

  // Specific to FAMILY_TRIVIA (家族猜猜看)
  triviaTemplate?: string;
  presetAnswers?: string[];

  status: 'ENABLED' | 'DISABLED';
  usageCount: number;
  updatedAt: string;
}

export interface AuditQuestion {
  id: string;
  submitterName: string;
  submitterOpenId: string;
  roomNo: string;
  questionTitle: string;
  options: string[];
  correctAnswerIndex: number;
  submitTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectReason?: string;
}

// 4. Room Data Models
export interface RoomLeaderboardItem {
  rank: number;
  name: string;
  score: number;
  amount: number;
}

export interface ActiveRoom {
  roomCode: string;
  createdAt: string;
  hostOpenId: string;
  hostName: string;
  hostAvatar: string;
  prizePool: number;
  categoryName: string;
  currentPlayers: number;
  maxPlayers: number;
  status: 'WAITING' | 'PLAYING' | 'SETTLED';
  leaderboard: RoomLeaderboardItem[];
}

export interface HistoryRoom {
  roomCode: string;
  settledAt: string;
  initialPrizePool: number;
  actualPayout: number;
  winnerName: string;
  winnerOpenId: string;
  status: 'SETTLED' | 'DISSOLVED';
}

export interface GameLog {
  id: string;
  roomNo: string;
  roundIndex: number;
  playerOpenId: string;
  playerName: string;
  optionChosen: string;
  durationMs: number;
  result: 'CORRECT' | 'WRONG';
  pointsEarned: number;
  timestamp: string;
}

// 5. User & Risk Management Data Models
export interface PlayerProfile {
  id: string;
  openId: string;
  nickname: string;
  avatar: string;
  firstLoginAt: string;
  totalMatches?: number;
  totalRoomsJoined: number;
  correctAnswers?: number;
  totalRedPackets?: number;
  totalPrizeWon: number;
  rankScore: number;
  riskLevel: 'NORMAL' | 'SUSPICIOUS' | 'BLACK';
  status: 'NORMAL' | 'BLOCKED';
}

export interface SponsorProfile {
  id: string;
  openId: string;
  nickname: string;
  avatar: string;
  totalRoomsCreated: number;
  roomsCreatedCount: number;
  totalFundInjected?: number;
  totalRecharged: number;
  unspentBalance: number;
  vipTier: string;
  lastCreatedRoomAt?: string;
  createdAt: string;
}

export interface BlacklistUser {
  id: string;
  openId: string;
  nickname: string;
  avatar?: string;
  ip: string;
  blockReason: string;
  blockedAt: string;
  blockedBy: string;
}

// 6. Settings Data Models
export interface WechatPayConfig {
  appId: string;
  appSecret?: string;
  mchId: string;
  apiV3Key: string;
  certSerialNo: string;
  isCertUploaded: boolean;
}

export interface RiskRulesConfig {
  singleUserDailyMaxPayout: number;
  autoTransferNoAuditMax: number;
  minAnswerTimeMs: number;
}

export interface AdminUser {
  id: string;
  username: string;
  realName: string;
  role: string;
  hasFundPermission: boolean;
  lastLoginIp: string;
  status: 'ACTIVE' | 'DISABLED';
}

export interface AdminLog {
  id: string;
  operator: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
}

export interface SecurityModalConfig {
  isOpen: boolean;
  title: string;
  description: string;
  type: 'DANGER' | 'WARNING' | 'INFO';
  requiredConfirmText?: string;
  requiresFundPin?: boolean;
  actionButtonText: string;
  onConfirm: () => void;
  dataSummary?: string;
}
