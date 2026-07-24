import {
  DashboardStats,
  RechargeOrder,
  TransferLog,
  ReconciliationRow,
  ExceptionRecord,
  CategoryItem,
  QuestionItem,
  AuditQuestion,
  ActiveRoom,
  HistoryRoom,
  GameLog,
  PlayerProfile,
  SponsorProfile,
  BlacklistUser,
  WechatPayConfig,
  RiskRulesConfig,
  AdminUser,
  AdminLog,
  GameModeItem
} from '../types';

export const MOCK_GAME_MODES: GameModeItem[] = [
  {
    id: 'GMD-01',
    code: 'QUIZ_QUESTION',
    name: '知识答题',
    interactionType: '4选1选择题',
    ruleConfigSummary: '单题限时: 15秒 / 题量: 10题',
    status: 'ENABLED',
    config: {
      timeLimitSec: 15,
      questionCount: 10
    }
  },
  {
    id: 'GMD-02',
    code: 'SPEED_CLICK',
    name: '极致秒表',
    interactionType: '10.00秒手速抢按',
    ruleConfigSummary: '目标秒数: 10.00s / 允许误差: ±0.05s',
    status: 'ENABLED',
    config: {
      targetSeconds: 10.00,
      allowedErrorSec: 0.05
    }
  },
  {
    id: 'GMD-03',
    code: 'SHAKE_RACE',
    name: '摇一摇赛马',
    interactionType: '手机陀螺仪摇晃',
    ruleConfigSummary: '摇晃限时: 15秒 / 目标频次: 80次',
    status: 'DISABLED',
    config: {
      shakeTimeLimitSec: 15,
      targetShakeCount: 80
    }
  },
  {
    id: 'GMD-04',
    code: 'VOICE_SPEECH',
    name: '绕口令朗读',
    interactionType: '麦克风语音识别',
    ruleConfigSummary: '语音匹配度门槛: 85%',
    status: 'DISABLED',
    config: {
      voiceMatchThreshold: 85,
      voiceSensitivity: 'MEDIUM'
    }
  },
  {
    id: 'GMD-05',
    code: 'FAMILY_TRIVIA',
    name: '家族猜猜看',
    interactionType: '心理猜测/默契',
    ruleConfigSummary: '题目类型: 长辈私房题',
    status: 'ENABLED',
    config: {
      triviaPromptTemplate: '[长辈] 年轻时最喜欢的歌是？'
    }
  }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRecharge: 185600.00,
  totalPayout: 168450.00,
  todayRecharge: 12800.00,
  todayPayout: 11450.00,
  todayRoomsCreated: 42,
  todayActivePlayers: 386,
  wxTransferSuccessRate: 99.2,
  pendingExceptionsCount: 3,
  pendingAuditQuestionsCount: 5,
};

export const MOCK_RECHARGE_ORDERS: RechargeOrder[] = [
  {
    id: 'RCG-1001',
    outTradeNo: 'WX_PAY_98231200192',
    wxPayNo: '4200001892202607238812',
    roomCode: '888888',
    sponsorOpenId: 'oWX_user_891230129',
    sponsorName: '张伯伯 (长辈代表)',
    sponsorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    amount: 1000.00,
    status: 'SUCCESS',
    payTime: '2026-07-23 19:42:10',
  },
  {
    id: 'RCG-1002',
    outTradeNo: 'WX_PAY_98231200888',
    wxPayNo: '4200001892202607238813',
    roomCode: '666666',
    sponsorOpenId: 'oWX_user_99218231',
    sponsorName: '李阿姨 (热心赞助人)',
    sponsorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    amount: 500.00,
    status: 'SUCCESS',
    payTime: '2026-07-23 18:20:05',
  },
  {
    id: 'RCG-1003',
    outTradeNo: 'WX_PAY_98231200762',
    wxPayNo: '4200001892202607238814',
    roomCode: '520000',
    sponsorOpenId: 'oWX_user_11209381',
    sponsorName: '陈爷爷',
    sponsorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    amount: 200.00,
    status: 'REFUNDED',
    payTime: '2026-07-23 17:15:30',
  },
  {
    id: 'RCG-1004',
    outTradeNo: 'WX_PAY_98231200551',
    wxPayNo: '4200001892202607238815',
    roomCode: '999999',
    sponsorOpenId: 'oWX_user_7712391',
    sponsorName: '王叔叔',
    sponsorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    amount: 300.00,
    status: 'PENDING',
    payTime: '2026-07-23 20:01:10',
  }
];

export const MOCK_TRANSFER_LOGS: TransferLog[] = [
  {
    id: 'TRF-2001',
    outBatchNo: 'MCH_BATCH_2026072301',
    detailNo: 'DTL_10029312',
    roomNo: '888888',
    playerOpenId: 'oWX_ply_1029381',
    playerName: '小明 (晚辈高才生)',
    playerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    totalAmount: 188.00,
    baseAmount: 30.00,
    scoreAmount: 128.00,
    tipAmount: 30.00,
    status: 'SUCCESS',
    completeTime: '2026-07-23 19:45:12',
  },
  {
    id: 'TRF-2002',
    outBatchNo: 'MCH_BATCH_2026072302',
    detailNo: 'DTL_10029313',
    roomNo: '888888',
    playerOpenId: 'oWX_ply_1029382',
    playerName: '小红',
    playerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
    totalAmount: 120.00,
    baseAmount: 30.00,
    scoreAmount: 90.00,
    tipAmount: 0.00,
    status: 'SUCCESS',
    completeTime: '2026-07-23 19:45:13',
  },
  {
    id: 'TRF-2003',
    outBatchNo: 'MCH_BATCH_2026072303',
    detailNo: 'DTL_10029411',
    roomNo: '666666',
    playerOpenId: 'oWX_ply_9918231',
    playerName: '堂弟小杰',
    playerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    totalAmount: 250.00,
    baseAmount: 50.00,
    scoreAmount: 150.00,
    tipAmount: 50.00,
    status: 'FAILED',
    completeTime: '2026-07-23 18:25:00',
    errorJson: '{"code":"NO_AUTH","message":"接收方微信未实名认证，无法完成商家转账"}',
  }
];

export const MOCK_RECONCILIATION_ROWS: ReconciliationRow[] = [
  {
    date: '2026-07-23',
    initialBalance: 52100.00,
    depositTotal: 12800.00,
    transferTotal: 11450.00,
    refundTotal: 200.00,
    theoreticalEndBalance: 53250.00,
    actualMchBalance: 53250.00,
    status: 'BALANCED',
  },
  {
    date: '2026-07-22',
    initialBalance: 48900.00,
    depositTotal: 15400.00,
    transferTotal: 12200.00,
    refundTotal: 0.00,
    theoreticalEndBalance: 52100.00,
    actualMchBalance: 52100.00,
    status: 'BALANCED',
  }
];

export const MOCK_EXCEPTIONS: ExceptionRecord[] = [
  {
    id: 'EXP-3001',
    outBatchNo: 'MCH_BATCH_2026072303',
    roomNo: '666666',
    playerOpenId: 'oWX_ply_9918231',
    playerName: '堂弟小杰',
    amount: 250.00,
    status: 'FAILED',
    failReason: 'NO_AUTH: 用户微信未绑定身份证实名，微信拒绝转账',
    createdAt: '2026-07-23 18:25:00',
    retryCount: 2,
  },
  {
    id: 'EXP-3002',
    outBatchNo: 'MCH_BATCH_2026072308',
    roomNo: '520000',
    playerOpenId: 'oWX_ply_1109232',
    playerName: '表妹小芳',
    amount: 100.00,
    status: 'FAILED',
    failReason: 'FREQUENCY_LIMITED: 触发单用户当日提现频次上限规则',
    createdAt: '2026-07-23 17:10:00',
    retryCount: 1,
  }
];

export const MOCK_CATEGORIES: CategoryItem[] = [
  {
    id: 'CAT-101',
    code: 'CYCS',
    name: '成语接龙与常识',
    iconUrl: '🏮',
    sortOrder: 1,
    questionCount: 128,
    status: 'ENABLED',
  },
  {
    id: 'CAT-102',
    code: 'SCSC',
    name: '古诗词与传统文化',
    iconUrl: '📜',
    sortOrder: 2,
    questionCount: 95,
    status: 'ENABLED',
  },
  {
    id: 'CAT-103',
    code: 'CDDM',
    name: '新春灯谜与民俗',
    iconUrl: '🧧',
    sortOrder: 3,
    questionCount: 82,
    status: 'ENABLED',
  }
];

export const MOCK_QUESTIONS: QuestionItem[] = [
  {
    id: 'QST-1001',
    modeCode: 'QUIZ_QUESTION',
    title: '微信小程序“商家转账到零钱”单笔转账默认最高额度是多少？',
    categoryCode: 'FKWX',
    categoryName: '微信风控与支付安全',
    difficulty: 'EASY',
    options: ['A. 200元', 'B. 500元', 'C. 1000元', 'D. 2000元'],
    correctAnswerIndex: 0,
    status: 'ENABLED',
    usageCount: 142,
    updatedAt: '2026-07-23 10:30',
  },
  {
    id: 'QST-1002',
    modeCode: 'QUIZ_QUESTION',
    title: '“爆竹声中一岁除，春风送暖入屠苏”出自哪位诗人？',
    categoryCode: 'SCSC',
    categoryName: '古诗词与传统文化',
    difficulty: 'MEDIUM',
    options: ['A. 王安石', 'B. 苏轼', 'C. 杜甫', 'D. 李白'],
    correctAnswerIndex: 0,
    status: 'ENABLED',
    usageCount: 230,
    updatedAt: '2026-07-21 09:20',
  },
  {
    id: 'MAT-2001',
    modeCode: 'VOICE_SPEECH',
    title: '吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮',
    categoryCode: 'RKL',
    categoryName: '趣味绕口令',
    difficulty: 'EASY',
    options: [],
    correctAnswerIndex: 0,
    pinyin: 'chī pú tao bù tǔ pú tao pí, bù chī pú tao dào tǔ pú tao pí',
    keywords: ['葡萄', '吐', '葡萄皮'],
    status: 'ENABLED',
    usageCount: 88,
    updatedAt: '2026-07-22 14:10',
  },
  {
    id: 'MAT-2002',
    modeCode: 'VOICE_SPEECH',
    title: '八百标兵奔北坡，炮兵并排北边跑',
    categoryCode: 'RKL',
    categoryName: '趣味绕口令',
    difficulty: 'HARD',
    options: [],
    correctAnswerIndex: 0,
    pinyin: 'bā bǎi biāo bīng bēn běi pō, pào bīng bìng pái běi biān pǎo',
    keywords: ['八百标兵', '奔北坡', '炮兵'],
    status: 'ENABLED',
    usageCount: 104,
    updatedAt: '2026-07-22 15:30',
  },
  {
    id: 'MAT-3001',
    modeCode: 'FAMILY_TRIVIA',
    title: '[长辈] 年轻时最喜欢的经典老歌是哪一首？',
    categoryCode: 'JZMQ',
    categoryName: '家族私房猜猜看',
    difficulty: 'EASY',
    options: ['A. 甜蜜蜜', 'B. 渴望', 'C. 难忘今宵', 'D. 军港之夜'],
    correctAnswerIndex: 0,
    triviaTemplate: '[长辈] 年轻时最喜欢的经典老歌是？',
    presetAnswers: ['A. 甜蜜蜜', 'B. 渴望', 'C. 难忘今宵', 'D. 军港之夜'],
    status: 'ENABLED',
    usageCount: 195,
    updatedAt: '2026-07-23 18:00',
  },
  {
    id: 'MAT-3002',
    modeCode: 'FAMILY_TRIVIA',
    title: '[长辈] 记忆里当年领的第一份工作工资是多少？',
    categoryCode: 'JZMQ',
    categoryName: '家族私房猜猜看',
    difficulty: 'MEDIUM',
    options: ['A. 18元', 'B. 36元', 'C. 50元', 'D. 100元以上'],
    correctAnswerIndex: 1,
    triviaTemplate: '[长辈] 记忆里当年领的第一份工作工资是多少？',
    presetAnswers: ['A. 18元', 'B. 36元', 'C. 50元', 'D. 100元以上'],
    status: 'ENABLED',
    usageCount: 160,
    updatedAt: '2026-07-23 18:30',
  }
];

export const MOCK_AUDIT_QUESTIONS: AuditQuestion[] = [
  {
    id: 'AUD-5001',
    submitterName: '张伯伯',
    submitterOpenId: 'oWX_user_891230129',
    roomNo: '888888',
    questionTitle: '长辈私房题：张伯伯今年最希望晚辈在哪方面有新突破？',
    options: ['A. 身体健康常锻炼', 'B. 事业顺利升职加薪', 'C. 早日成家立业', 'D. 以上都是'],
    correctAnswerIndex: 3,
    submitTime: '2026-07-23 19:10:00',
    status: 'PENDING',
  }
];

export const MOCK_ACTIVE_ROOMS: ActiveRoom[] = [
  {
    roomCode: '888888',
    createdAt: '2026-07-23 19:30:00',
    hostOpenId: 'oWX_user_891230129',
    hostName: '张伯伯',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    prizePool: 1000.00,
    categoryName: '古诗词与传统文化',
    currentPlayers: 8,
    maxPlayers: 10,
    status: 'PLAYING',
    leaderboard: [
      { rank: 1, name: '小明', score: 95, amount: 188.00 },
      { rank: 2, name: '小红', score: 82, amount: 120.00 },
    ],
  }
];

export const MOCK_HISTORY_ROOMS: HistoryRoom[] = [
  {
    roomCode: '520000',
    settledAt: '2026-07-23 17:15:00',
    initialPrizePool: 200.00,
    actualPayout: 200.00,
    winnerName: '堂弟小杰',
    winnerOpenId: 'oWX_ply_9918231',
    status: 'SETTLED',
  }
];

export const MOCK_GAME_LOGS: GameLog[] = [
  {
    id: 'LOG-8001',
    roomNo: '888888',
    roundIndex: 1,
    playerOpenId: 'oWX_ply_1029381',
    playerName: '小明',
    optionChosen: 'A. 王安石',
    durationMs: 1420,
    result: 'CORRECT',
    pointsEarned: 10,
    timestamp: '2026-07-23 19:35:10',
  }
];

export const MOCK_PLAYERS: PlayerProfile[] = [
  {
    id: 'PLY-101',
    openId: 'oWX_ply_1029381',
    nickname: '小明 (晚辈高才生)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    firstLoginAt: '2026-07-01 12:00',
    totalRoomsJoined: 34,
    totalPrizeWon: 1450.00,
    rankScore: 1890,
    riskLevel: 'NORMAL',
    status: 'NORMAL'
  },
  {
    id: 'PLY-102',
    openId: 'oWX_ply_1029382',
    nickname: '小红',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
    firstLoginAt: '2026-07-05 14:20',
    totalRoomsJoined: 22,
    totalPrizeWon: 820.00,
    rankScore: 1240,
    riskLevel: 'NORMAL',
    status: 'NORMAL'
  }
];

export const MOCK_SPONSORS: SponsorProfile[] = [
  {
    id: 'SPS-201',
    openId: 'oWX_user_891230129',
    nickname: '张伯伯 (长辈代表)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    roomsCreatedCount: 12,
    totalRoomsCreated: 12,
    totalRecharged: 8500.00,
    unspentBalance: 1200.00,
    vipTier: '黑金资深长辈',
    createdAt: '2026-07-01 10:00'
  }
];

export const MOCK_BLACKLIST: BlacklistUser[] = [
  {
    id: 'BLK-301',
    openId: 'oWX_spammer_001',
    nickname: '可疑自动化脚本',
    ip: '118.21.90.11',
    blockReason: '答题耗时低于 100ms，连点器异常挂',
    blockedAt: '2026-07-22 10:15',
    blockedBy: 'admin_master'
  }
];

export const MOCK_WECHAT_PAY_CONFIG: WechatPayConfig = {
  appId: 'wx8829103981290312',
  mchId: '1689201928',
  apiV3Key: 'a9f20102938102938102938102938100',
  certSerialNo: '7A921B008C39D12048E7210A88219488',
  isCertUploaded: true,
};

export const MOCK_RISK_RULES_CONFIG: RiskRulesConfig = {
  singleUserDailyMaxPayout: 200.00,
  autoTransferNoAuditMax: 50.00,
  minAnswerTimeMs: 300,
};

export const MOCK_ADMINS: AdminUser[] = [
  {
    id: 'ADM-101',
    username: 'admin_master',
    realName: '李运维',
    role: '超级管理员',
    hasFundPermission: true,
    lastLoginIp: '116.228.88.102',
    status: 'ACTIVE',
  },
  {
    id: 'ADM-102',
    username: 'finance_auditor_01',
    realName: '王风控',
    role: '资金对账审计员',
    hasFundPermission: true,
    lastLoginIp: '116.228.88.105',
    status: 'ACTIVE',
  }
];

export const MOCK_ADMIN_LOGS: AdminLog[] = [
  {
    id: 'LOG-9001',
    operator: 'admin_master',
    action: '手动调起异常重新补发',
    target: '批次 MCH_BATCH_2026072312',
    timestamp: '2026-07-23 14:00:00',
    ip: '116.228.88.102',
  }
];
