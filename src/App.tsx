import React, { useState } from 'react';
import { 
  PrimaryMenuId, 
  SubMenuId, 
  FinanceSubTab, 
  QuestionsSubTab, 
  RoomsSubTab, 
  UsersSubTab, 
  SettingsSubTab,
  RechargeOrder,
  TransferLog,
  ExceptionRecord,
  CategoryItem,
  QuestionItem,
  AuditQuestion,
  ActiveRoom,
  HistoryRoom,
  PlayerProfile,
  BlacklistUser,
  WechatPayConfig,
  RiskRulesConfig,
  SecurityModalConfig,
  GameModeItem
} from './types';

import { 
  MOCK_DASHBOARD_STATS,
  MOCK_RECHARGE_ORDERS,
  MOCK_TRANSFER_LOGS,
  MOCK_RECONCILIATION_ROWS,
  MOCK_EXCEPTIONS,
  MOCK_CATEGORIES,
  MOCK_QUESTIONS,
  MOCK_AUDIT_QUESTIONS,
  MOCK_ACTIVE_ROOMS,
  MOCK_HISTORY_ROOMS,
  MOCK_GAME_LOGS,
  MOCK_PLAYERS,
  MOCK_SPONSORS,
  MOCK_BLACKLIST,
  MOCK_WECHAT_PAY_CONFIG,
  MOCK_RISK_RULES_CONFIG,
  MOCK_ADMINS,
  MOCK_ADMIN_LOGS,
  MOCK_GAME_MODES
} from './mock/data';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SecurityModal } from './components/SecurityModal';

// 6 Core Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { QuestionsModule } from './components/modules/QuestionsModule';
import { RoomsModule } from './components/modules/RoomsModule';
import { UsersModule } from './components/modules/UsersModule';
import { SettingsModule } from './components/modules/SettingsModule';

export default function App() {
  // Navigation State
  const [primaryTab, setPrimaryTab] = useState<PrimaryMenuId>('dashboard');
  const [subTab, setSubTab] = useState<SubMenuId>('recharge-orders');

  // UI Environment States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // App Core Managed States
  const [rechargeOrders, setRechargeOrders] = useState<RechargeOrder[]>(MOCK_RECHARGE_ORDERS);
  const [transferLogs, setTransferLogs] = useState<TransferLog[]>(MOCK_TRANSFER_LOGS);
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>(MOCK_EXCEPTIONS);
  const [gameModes, setGameModes] = useState<GameModeItem[]>(MOCK_GAME_MODES);
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [questions, setQuestions] = useState<QuestionItem[]>(MOCK_QUESTIONS);
  const [auditQuestions, setAuditQuestions] = useState<AuditQuestion[]>(MOCK_AUDIT_QUESTIONS);
  const [activeRooms, setActiveRooms] = useState<ActiveRoom[]>(MOCK_ACTIVE_ROOMS);
  const [historyRooms, setHistoryRooms] = useState<HistoryRoom[]>(MOCK_HISTORY_ROOMS);
  const [players, setPlayers] = useState<PlayerProfile[]>(MOCK_PLAYERS);
  const [blacklist, setBlacklist] = useState<BlacklistUser[]>(MOCK_BLACKLIST);
  const [wechatPayConfig, setWechatPayConfig] = useState<WechatPayConfig>(MOCK_WECHAT_PAY_CONFIG);
  const [riskRulesConfig, setRiskRulesConfig] = useState<RiskRulesConfig>(MOCK_RISK_RULES_CONFIG);

  // High Risk Modal State
  const [securityModal, setSecurityModal] = useState<SecurityModalConfig>({
    isOpen: false,
    title: '',
    description: '',
    type: 'DANGER',
    actionButtonText: '确定',
    onConfirm: () => {}
  });

  // Calculate Badges
  const pendingExceptionsCount = exceptions.filter(e => e.status === 'FAILED').length;
  const pendingAuditQuestionsCount = auditQuestions.filter(q => q.status === 'PENDING').length;

  // Handle Tab Switch
  const handleSelectTab = (primary: PrimaryMenuId, sub?: SubMenuId) => {
    setPrimaryTab(primary);
    if (sub) {
      setSubTab(sub);
    } else {
      // Default subtabs for primary
      if (primary === 'finance') setSubTab('recharge-orders');
      if (primary === 'questions') setSubTab('modes');
      if (primary === 'rooms') setSubTab('active');
      if (primary === 'users') setSubTab('players');
      if (primary === 'settings') setSubTab('wechat-pay');
    }
  };

  // --- Handlers for Game Modes & Questions ---
  const handleToggleGameModeStatus = (id: string) => {
    setGameModes(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'ENABLED' ? 'DISABLED' : 'ENABLED' } : m));
  };

  const handleUpdateGameModeConfig = (id: string, newConfig: Partial<GameModeItem['config']>, newStatus?: 'ENABLED' | 'DISABLED') => {
    setGameModes(prev => prev.map(m => {
      if (m.id !== id) return m;
      const mergedConfig = { ...m.config, ...newConfig };
      
      let summary = m.ruleConfigSummary;
      if (m.code === 'QUIZ_QUESTION') {
        summary = `单题限时: ${mergedConfig.timeLimitSec || 15}秒 / 题量: ${mergedConfig.questionCount || 10}题`;
      } else if (m.code === 'SPEED_CLICK') {
        summary = `目标秒数: ${(mergedConfig.targetSeconds ?? 10).toFixed(2)}s / 允许误差: ±${(mergedConfig.allowedErrorSec ?? 0.05).toFixed(2)}s`;
      } else if (m.code === 'SHAKE_RACE') {
        summary = `摇晃限时: ${mergedConfig.shakeTimeLimitSec || 15}秒 / 目标频次: ${mergedConfig.targetShakeCount || 80}次`;
      } else if (m.code === 'VOICE_SPEECH') {
        summary = `语音匹配度门槛: ${mergedConfig.voiceMatchThreshold || 85}% / 敏感度: ${mergedConfig.voiceSensitivity || 'MEDIUM'}`;
      } else if (m.code === 'FAMILY_TRIVIA') {
        summary = `题目类型: 长辈私房题`;
      }

      return {
        ...m,
        status: newStatus || m.status,
        config: mergedConfig,
        ruleConfigSummary: summary
      };
    }));
  };

  // --- Handlers for Finance ---
  const handleRetryException = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'RESOLVED', retryCount: e.retryCount + 1 } : e));
  };

  const handleRefundSponsor = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'REFUNDED' } : e));
    setRechargeOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'REFUNDED' } : o));
  };

  // --- Handlers for Questions ---
  const handleToggleCategoryStatus = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'ENABLED' ? 'DISABLED' : 'ENABLED' } : c));
  };

  const handleAddCategory = (newCat: Partial<CategoryItem>) => {
    const item: CategoryItem = {
      id: `CAT-${Date.now().toString().slice(-4)}`,
      name: newCat.name || '新大类',
      code: newCat.code || 'NEW',
      iconUrl: newCat.iconUrl || '📖',
      sortOrder: newCat.sortOrder || categories.length + 1,
      questionCount: 0,
      status: 'ENABLED'
    };
    setCategories([...categories, item]);
  };

  const handleToggleQuestionStatus = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: q.status === 'ENABLED' ? 'DISABLED' : 'ENABLED' } : q));
  };

  const handleAddQuestion = (newQ: Partial<QuestionItem>) => {
    const item: QuestionItem = {
      id: `QST-${Date.now().toString().slice(-4)}`,
      title: newQ.title || '新增题目',
      categoryCode: newQ.categoryCode || 'CYCS',
      categoryName: newQ.categoryName || '成语接龙与常识',
      difficulty: newQ.difficulty || 'EASY',
      options: newQ.options || ['选项 A', '选项 B'],
      correctAnswerIndex: newQ.correctAnswerIndex || 0,
      status: 'ENABLED',
      usageCount: 0,
      updatedAt: '刚刚'
    };
    setQuestions([item, ...questions]);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleApproveAuditQuestion = (id: string) => {
    setAuditQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'APPROVED' } : q));
  };

  const handleRejectAuditQuestion = (id: string, reason: string) => {
    setAuditQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'REJECTED', rejectReason: reason } : q));
  };

  // --- Handlers for Rooms ---
  const handleForceDissolveRoom = (roomCode: string) => {
    const roomToDissolve = activeRooms.find(r => r.roomCode === roomCode);
    setActiveRooms(prev => prev.filter(r => r.roomCode !== roomCode));
    if (roomToDissolve) {
      setHistoryRooms(prev => [{
        roomCode: roomToDissolve.roomCode,
        initialPrizePool: roomToDissolve.prizePool,
        actualPayout: 0,
        winnerName: '强制退款退回房主',
        winnerOpenId: roomToDissolve.hostOpenId,
        status: 'DISSOLVED',
        settledAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      }, ...prev]);
    }
  };

  // --- Handlers for Users ---
  const handleToggleBlockUser = (openId: string) => {
    setPlayers(prev => prev.map(p => p.openId === openId ? { ...p, status: p.status === 'NORMAL' ? 'BLOCKED' : 'NORMAL' } : p));
  };

  const handleAddBlacklistUser = (openId: string, nickname: string, reason: string) => {
    const newBl: BlacklistUser = {
      id: `BLK-${Date.now().toString().slice(-4)}`,
      openId,
      ip: '118.21.90.11',
      nickname,
      blockReason: reason,
      blockedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      blockedBy: 'admin_master'
    };
    setBlacklist([newBl, ...blacklist]);
  };

  const handleRemoveBlacklistUser = (id: string) => {
    setBlacklist(prev => prev.filter(b => b.id !== id));
  };

  // --- Handlers for Settings ---
  const handleUpdateWechatPay = (updates: Partial<WechatPayConfig>) => {
    setWechatPayConfig(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateRiskRules = (updates: Partial<RiskRulesConfig>) => {
    setRiskRulesConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col antialiased selection:bg-red-500 selection:text-white">
      
      {/* Header */}
      <Header
        primaryTab={primaryTab}
        subTab={subTab}
        onSelectTab={handleSelectTab}
        pendingExceptionsCount={pendingExceptionsCount}
        pendingAuditCount={pendingAuditQuestionsCount}
        isSandbox={isSandbox}
        onToggleSandbox={() => setIsSandbox(!isSandbox)}
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact(!isCompact)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Accordion Navigation Tree Sidebar */}
        <Sidebar
          primaryTab={primaryTab}
          subTab={subTab}
          onSelectTab={handleSelectTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          pendingExceptionsCount={pendingExceptionsCount}
          pendingAuditQuestionsCount={pendingAuditQuestionsCount}
        />

        {/* View Router Main Frame */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all ${isCompact ? 'max-w-none' : 'max-w-[1536px] mx-auto w-full'}`}>
          
          {/* Module 1: Dashboard */}
          {primaryTab === 'dashboard' && (
            <DashboardModule
              stats={{
                ...MOCK_DASHBOARD_STATS,
                pendingExceptionsCount,
                pendingAuditQuestionsCount
              }}
              onNavigateSubTab={(primary, sub) => handleSelectTab(primary, sub)}
              isCompact={isCompact}
            />
          )}

          {/* Module 2: Finance */}
          {primaryTab === 'finance' && (
            <FinanceModule
              subTab={subTab as FinanceSubTab}
              onSelectSubTab={(sub) => handleSelectTab('finance', sub)}
              rechargeOrders={rechargeOrders}
              transferLogs={transferLogs}
              reconciliationRows={MOCK_RECONCILIATION_ROWS}
              exceptions={exceptions}
              onRetryException={handleRetryException}
              onRefundSponsor={handleRefundSponsor}
              onRequestSecurityModal={setSecurityModal}
              isCompact={isCompact}
            />
          )}

          {/* Module 3: Questions & Game Center */}
          {primaryTab === 'questions' && (
            <QuestionsModule
              subTab={subTab as QuestionsSubTab}
              onSelectSubTab={(sub) => handleSelectTab('questions', sub)}
              gameModes={gameModes}
              categories={categories}
              questions={questions}
              auditQuestions={auditQuestions}
              onToggleGameModeStatus={handleToggleGameModeStatus}
              onUpdateGameModeConfig={handleUpdateGameModeConfig}
              onToggleCategoryStatus={handleToggleCategoryStatus}
              onAddCategory={handleAddCategory}
              onToggleQuestionStatus={handleToggleQuestionStatus}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onApproveAuditQuestion={handleApproveAuditQuestion}
              onRejectAuditQuestion={handleRejectAuditQuestion}
              onRequestSecurityModal={setSecurityModal}
              isCompact={isCompact}
            />
          )}

          {/* Module 4: Rooms */}
          {primaryTab === 'rooms' && (
            <RoomsModule
              subTab={subTab as RoomsSubTab}
              onSelectSubTab={(sub) => handleSelectTab('rooms', sub)}
              activeRooms={activeRooms}
              historyRooms={historyRooms}
              gameLogs={MOCK_GAME_LOGS}
              onForceDissolveRoom={handleForceDissolveRoom}
              onRequestSecurityModal={setSecurityModal}
              isCompact={isCompact}
            />
          )}

          {/* Module 5: Users */}
          {primaryTab === 'users' && (
            <UsersModule
              subTab={subTab as UsersSubTab}
              onSelectSubTab={(sub) => handleSelectTab('users', sub)}
              players={players}
              sponsors={MOCK_SPONSORS}
              blacklist={blacklist}
              onToggleBlockUser={handleToggleBlockUser}
              onAddBlacklistUser={handleAddBlacklistUser}
              onRemoveBlacklistUser={handleRemoveBlacklistUser}
              onRequestSecurityModal={setSecurityModal}
              isCompact={isCompact}
            />
          )}

          {/* Module 6: Settings */}
          {primaryTab === 'settings' && (
            <SettingsModule
              subTab={subTab as SettingsSubTab}
              onSelectSubTab={(sub) => handleSelectTab('settings', sub)}
              wechatPayConfig={wechatPayConfig}
              riskRulesConfig={riskRulesConfig}
              admins={MOCK_ADMINS}
              adminLogs={MOCK_ADMIN_LOGS}
              onUpdateWechatPay={handleUpdateWechatPay}
              onUpdateRiskRules={handleUpdateRiskRules}
              onRequestSecurityModal={setSecurityModal}
              isCompact={isCompact}
            />
          )}

        </main>

      </div>

      {/* High-Risk Security PIN / Confirmation Modal */}
      <SecurityModal
        config={securityModal}
        onClose={() => setSecurityModal(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
