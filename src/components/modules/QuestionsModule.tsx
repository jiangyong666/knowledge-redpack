import React, { useState } from 'react';
import { 
  Gamepad2,
  Sliders,
  Layers, 
  BookOpen, 
  UploadCloud, 
  FileCheck, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Settings2,
  Mic,
  Timer,
  Activity,
  Users,
  HelpCircle,
  Check,
  X,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  QuestionsSubTab, 
  CategoryItem, 
  QuestionItem, 
  AuditQuestion, 
  QuestionDifficulty,
  SecurityModalConfig,
  GameModeItem,
  GameModeCode
} from '../../types';

interface QuestionsModuleProps {
  subTab: QuestionsSubTab;
  onSelectSubTab: (sub: QuestionsSubTab) => void;
  gameModes?: GameModeItem[];
  categories: CategoryItem[];
  questions: QuestionItem[];
  auditQuestions: AuditQuestion[];
  onToggleGameModeStatus?: (id: string) => void;
  onUpdateGameModeConfig?: (id: string, newConfig: Partial<GameModeItem['config']>, newStatus?: 'ENABLED' | 'DISABLED') => void;
  onToggleCategoryStatus: (id: string) => void;
  onAddCategory: (category: Partial<CategoryItem>) => void;
  onToggleQuestionStatus: (id: string) => void;
  onAddQuestion: (question: Partial<QuestionItem>) => void;
  onDeleteQuestion: (id: string) => void;
  onApproveAuditQuestion: (id: string) => void;
  onRejectAuditQuestion: (id: string, reason: string) => void;
  onRequestSecurityModal: (config: SecurityModalConfig) => void;
  isCompact: boolean;
}

export const QuestionsModule: React.FC<QuestionsModuleProps> = ({
  subTab,
  onSelectSubTab,
  gameModes = [],
  categories,
  questions,
  auditQuestions,
  onToggleGameModeStatus,
  onUpdateGameModeConfig,
  onToggleCategoryStatus,
  onAddCategory,
  onToggleQuestionStatus,
  onAddQuestion,
  onDeleteQuestion,
  onApproveAuditQuestion,
  onRejectAuditQuestion,
  onRequestSecurityModal,
  isCompact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  // Modal 1: Game Mode Config Modal
  const [configModeItem, setConfigModeItem] = useState<GameModeItem | null>(null);
  const [configStatus, setConfigStatus] = useState<'ENABLED' | 'DISABLED'>('ENABLED');
  const [cfgTimeLimit, setCfgTimeLimit] = useState<number>(15);
  const [cfgQuestionCount, setCfgQuestionCount] = useState<number>(10);
  const [cfgTargetSec, setCfgTargetSec] = useState<number>(10.00);
  const [cfgAllowedErr, setCfgAllowedErr] = useState<number>(0.05);
  const [cfgShakeLimit, setCfgShakeLimit] = useState<number>(15);
  const [cfgTargetShake, setCfgTargetShake] = useState<number>(80);
  const [cfgVoiceThresh, setCfgVoiceThresh] = useState<number>(85);
  const [cfgVoiceSens, setCfgVoiceSens] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [cfgTriviaPrompt, setCfgTriviaPrompt] = useState<string>('[长辈] 年轻时最喜欢的歌是？');

  // Modal 2: Add Category Modal
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📖');

  // Modal 3: Add Material Modal (Supports Quiz, Voice, Family Trivia)
  const [isAddMatOpen, setIsAddMatOpen] = useState(false);
  const [newMatMode, setNewMatMode] = useState<GameModeCode>('QUIZ_QUESTION');
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatCategory, setNewMatCategory] = useState(categories[0]?.code || 'CYCS');
  const [newMatDifficulty, setNewMatDifficulty] = useState<QuestionDifficulty>('EASY');
  
  // Quiz specific
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);

  // Voice Speech specific
  const [newPinyin, setNewPinyin] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  // Family Trivia specific
  const [newTriviaTemplate, setNewTriviaTemplate] = useState('');
  const [newPresetAnswers, setNewPresetAnswers] = useState('');

  // Modal 4: Reject Audit Question Modal
  const [rejectingAuditId, setRejectingAuditId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // Import feedback
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const tabs = [
    { id: 'modes' as QuestionsSubTab, label: '3.1 玩法模式开关与配置', icon: Gamepad2 },
    { id: 'categories' as QuestionsSubTab, label: '3.2 竞赛/题库分类管理', icon: Layers },
    { id: 'list' as QuestionsSubTab, label: '3.3 题库与素材管理', icon: BookOpen },
    { id: 'import-export' as QuestionsSubTab, label: '3.4 批量导入与导出', icon: UploadCloud },
    { 
      id: 'audit' as QuestionsSubTab, 
      label: '3.5 待审核长辈自定义题', 
      icon: FileCheck,
      badge: auditQuestions.filter(q => q.status === 'PENDING').length
    },
  ];

  // Open Game Mode Config Modal
  const handleOpenConfigModal = (item: GameModeItem) => {
    setConfigModeItem(item);
    setConfigStatus(item.status);
    if (item.code === 'QUIZ_QUESTION') {
      setCfgTimeLimit(item.config.timeLimitSec ?? 15);
      setCfgQuestionCount(item.config.questionCount ?? 10);
    } else if (item.code === 'SPEED_CLICK') {
      setCfgTargetSec(item.config.targetSeconds ?? 10.00);
      setCfgAllowedErr(item.config.allowedErrorSec ?? 0.05);
    } else if (item.code === 'SHAKE_RACE') {
      setCfgShakeLimit(item.config.shakeTimeLimitSec ?? 15);
      setCfgTargetShake(item.config.targetShakeCount ?? 80);
    } else if (item.code === 'VOICE_SPEECH') {
      setCfgVoiceThresh(item.config.voiceMatchThreshold ?? 85);
      setCfgVoiceSens(item.config.voiceSensitivity ?? 'MEDIUM');
    } else if (item.code === 'FAMILY_TRIVIA') {
      setCfgTriviaPrompt(item.config.triviaPromptTemplate ?? '[长辈] 年轻时最喜欢的歌是？');
    }
  };

  // Save Game Mode Config
  const handleSaveModeConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configModeItem || !onUpdateGameModeConfig) return;

    let partialCfg: Partial<GameModeItem['config']> = {};
    if (configModeItem.code === 'QUIZ_QUESTION') {
      partialCfg = { timeLimitSec: Number(cfgTimeLimit), questionCount: Number(cfgQuestionCount) };
    } else if (configModeItem.code === 'SPEED_CLICK') {
      partialCfg = { targetSeconds: Number(cfgTargetSec), allowedErrorSec: Number(cfgAllowedErr) };
    } else if (configModeItem.code === 'SHAKE_RACE') {
      partialCfg = { shakeTimeLimitSec: Number(cfgShakeLimit), targetShakeCount: Number(cfgTargetShake) };
    } else if (configModeItem.code === 'VOICE_SPEECH') {
      partialCfg = { voiceMatchThreshold: Number(cfgVoiceThresh), voiceSensitivity: cfgVoiceSens };
    } else if (configModeItem.code === 'FAMILY_TRIVIA') {
      partialCfg = { triviaPromptTemplate: cfgTriviaPrompt };
    }

    onUpdateGameModeConfig(configModeItem.id, partialCfg, configStatus);
    setConfigModeItem(null);
  };

  // Handle Category Creation
  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatCode) return;
    onAddCategory({
      name: newCatName,
      code: newCatCode.toUpperCase(),
      iconUrl: newCatIcon,
      sortOrder: categories.length + 1,
      questionCount: 0,
      status: 'ENABLED'
    });
    setNewCatName('');
    setNewCatCode('');
    setIsAddCatOpen(false);
  };

  // Handle Material Creation
  const handleCreateMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle) return;
    const catObj = categories.find(c => c.code === newMatCategory);

    const baseItem: Partial<QuestionItem> = {
      modeCode: newMatMode,
      title: newMatTitle,
      categoryCode: newMatCategory,
      categoryName: catObj ? catObj.name : '通用分类',
      difficulty: newMatDifficulty,
      status: 'ENABLED',
      usageCount: 0,
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    if (newMatMode === 'QUIZ_QUESTION') {
      baseItem.options = [`A. ${newOptA}`, `B. ${newOptB}`, `C. ${newOptC}`, `D. ${newOptD}`].filter(Boolean);
      baseItem.correctAnswerIndex = correctIdx;
    } else if (newMatMode === 'VOICE_SPEECH') {
      baseItem.pinyin = newPinyin || 'chī pú tao bù tǔ pú tao pí';
      baseItem.keywords = newKeywords ? newKeywords.split(/[,，]/).map(s => s.trim()) : ['绕口令', '语音识别'];
      baseItem.options = [];
      baseItem.correctAnswerIndex = 0;
    } else if (newMatMode === 'FAMILY_TRIVIA') {
      baseItem.triviaTemplate = newTriviaTemplate || newMatTitle;
      baseItem.presetAnswers = newPresetAnswers ? newPresetAnswers.split(/[,，\n]/).map(s => s.trim()) : ['选项1', '选项2'];
      baseItem.options = baseItem.presetAnswers;
      baseItem.correctAnswerIndex = 0;
    }

    onAddQuestion(baseItem);

    // Reset Form
    setNewMatTitle('');
    setNewOptA('');
    setNewOptB('');
    setNewOptC('');
    setNewOptD('');
    setNewPinyin('');
    setNewKeywords('');
    setNewTriviaTemplate('');
    setNewPresetAnswers('');
    setIsAddMatOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = subTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectSubTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-md border border-slate-800'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-red-500 text-white font-mono text-[10px] rounded-full font-black">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3.1 玩法模式开关与配置 */}
      {subTab === 'modes' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 rounded-2xl text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full">
                  GAME CENTER
                </span>
                <span className="text-xs text-slate-400 font-mono">玩法模式开关 & 判定规则引擎</span>
              </div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                小程序端游戏玩法模式管理
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                实时调控小程序允许开启的互动玩法，支持定制手速偏差、语音识别阈值、长辈猜猜看出题引导。
              </p>
            </div>
            <div className="text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-slate-300 shrink-0">
              <div>已启用玩法: <span className="text-emerald-400 font-bold">{gameModes.filter(m => m.status === 'ENABLED').length} / {gameModes.length}</span></div>
              <div className="text-[10px] text-slate-400 mt-0.5">更改设置后对新建对局实时生效</div>
            </div>
          </div>

          {/* Game Modes Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-4">玩法名称</th>
                    <th className="p-4">玩法标识 (Code)</th>
                    <th className="p-4">互动形式</th>
                    <th className="p-4">规则配置参数</th>
                    <th className="p-4">当前状态</th>
                    <th className="p-4 text-right">操作控制</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gameModes.map((mode) => (
                    <tr key={mode.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            mode.code === 'QUIZ_QUESTION' ? 'bg-amber-100 text-amber-700' :
                            mode.code === 'SPEED_CLICK' ? 'bg-red-100 text-red-700' :
                            mode.code === 'SHAKE_RACE' ? 'bg-indigo-100 text-indigo-700' :
                            mode.code === 'VOICE_SPEECH' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {mode.code === 'QUIZ_QUESTION' && <HelpCircle className="w-4 h-4" />}
                            {mode.code === 'SPEED_CLICK' && <Timer className="w-4 h-4" />}
                            {mode.code === 'SHAKE_RACE' && <Activity className="w-4 h-4" />}
                            {mode.code === 'VOICE_SPEECH' && <Mic className="w-4 h-4" />}
                            {mode.code === 'FAMILY_TRIVIA' && <Users className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{mode.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{mode.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px]">
                          {mode.code}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {mode.interactionType}
                      </td>
                      <td className="p-4 font-mono text-slate-800 font-semibold">
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg text-[11px]">
                          {mode.ruleConfigSummary}
                        </span>
                      </td>
                      <td className="p-4 font-bold">
                        {mode.status === 'ENABLED' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-mono flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ● 已启用
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[11px] font-mono flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> ○ 已禁用
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenConfigModal(mode)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl transition-all shadow-2xs inline-flex items-center gap-1"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>配置</span>
                        </button>
                        <button
                          onClick={() => onToggleGameModeStatus && onToggleGameModeStatus(mode.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
                            mode.status === 'ENABLED'
                              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {mode.status === 'ENABLED' ? '禁用' : '启用'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3.2 竞赛/题库分类管理 */}
      {subTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">小程序前端竞赛大类管理</h3>
              <p className="text-xs text-slate-500 mt-0.5">控制小程序首页显示的竞赛类型。禁用某分类后，小程序对应房间将无法选此题库。</p>
            </div>
            <button
              onClick={() => setIsAddCatOpen(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>新增竞赛大类</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100">{cat.iconUrl}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">Code: {cat.code} | 排序: {cat.sortOrder}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleCategoryStatus(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                      cat.status === 'ENABLED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {cat.status === 'ENABLED' ? '已启用' : '已禁用'}
                  </button>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>收录题目: <strong className="text-slate-900 font-bold">{questions.filter(q => q.categoryCode === cat.code).length} 题</strong></span>
                  <span className="text-[10px] text-slate-400">系统默认大类</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3.3 题库与素材管理 (Supports Quiz, Voice Twister, Family Trivia) */}
      {subTab === 'list' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {/* Gameplay Mode Filter */}
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="ALL">所有玩法素材</option>
                <option value="QUIZ_QUESTION">知识答题 (QUIZ_QUESTION)</option>
                <option value="VOICE_SPEECH">绕口令朗读 (VOICE_SPEECH)</option>
                <option value="FAMILY_TRIVIA">家族猜猜看 (FAMILY_TRIVIA)</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="ALL">全部分类</option>
                {categories.map(c => (
                  <option key={c.id} value={c.code}>{c.name}</option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="ALL">全部难度</option>
                <option value="EASY">简单 (EASY)</option>
                <option value="MEDIUM">中等 (MEDIUM)</option>
                <option value="HARD">困难 (HARD)</option>
              </select>

              {/* Search Field */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="搜索题目、绕口令、猜猜看关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            <button
              onClick={() => setIsAddMatOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>录入新素材/题目</span>
            </button>
          </div>

          {/* Material Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-4">绑定玩法</th>
                    <th className="p-4 max-w-md">素材标题 / 题干 / 文本</th>
                    <th className="p-4">所属分类</th>
                    <th className="p-4">难度</th>
                    <th className="p-4">特有属性 (选项 / 拼音 / 模板)</th>
                    <th className="p-4">使用频次</th>
                    <th className="p-4">状态</th>
                    <th className="p-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions
                    .filter(q => {
                      const modeMatch = filterMode === 'ALL' || (q.modeCode || 'QUIZ_QUESTION') === filterMode;
                      const catMatch = filterCategory === 'ALL' || q.categoryCode === filterCategory;
                      const diffMatch = filterDifficulty === 'ALL' || q.difficulty === filterDifficulty;
                      const searchMatch = !searchQuery || q.title.includes(searchQuery) || (q.pinyin && q.pinyin.includes(searchQuery));
                      return modeMatch && catMatch && diffMatch && searchMatch;
                    })
                    .map((q) => {
                      const modeCode = q.modeCode || 'QUIZ_QUESTION';
                      return (
                        <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-mono font-bold">
                            {modeCode === 'QUIZ_QUESTION' && (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold">
                                知识答题
                              </span>
                            )}
                            {modeCode === 'VOICE_SPEECH' && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold">
                                绕口令朗读
                              </span>
                            )}
                            {modeCode === 'FAMILY_TRIVIA' && (
                              <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold">
                                家族猜猜看
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900 text-xs leading-relaxed">{q.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {q.id} | 更新: {q.updatedAt}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200/80 rounded text-[11px] font-bold text-slate-700">
                              {q.categoryName}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold">
                            {q.difficulty === 'EASY' && <span className="text-emerald-600">简单</span>}
                            {q.difficulty === 'MEDIUM' && <span className="text-amber-600">中等</span>}
                            {q.difficulty === 'HARD' && <span className="text-red-600">困难</span>}
                          </td>
                          <td className="p-4 max-w-xs">
                            {modeCode === 'QUIZ_QUESTION' && q.options && (
                              <div className="space-y-0.5 text-[11px]">
                                {q.options.map((opt, idx) => (
                                  <div key={idx} className={idx === q.correctAnswerIndex ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                                    {opt} {idx === q.correctAnswerIndex && '✓'}
                                  </div>
                                ))}
                              </div>
                            )}

                            {modeCode === 'VOICE_SPEECH' && (
                              <div className="space-y-1 text-[11px]">
                                <div className="font-mono text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                                  注音: {q.pinyin || 'chī pú tao...'}
                                </div>
                                {q.keywords && (
                                  <div className="flex gap-1 flex-wrap">
                                    {q.keywords.map((kw, i) => (
                                      <span key={i} className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">
                                        #{kw}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {modeCode === 'FAMILY_TRIVIA' && (
                              <div className="space-y-1 text-[11px]">
                                <div className="text-purple-900 font-bold bg-purple-50 p-1.5 rounded border border-purple-200">
                                  模板: {q.triviaTemplate || q.title}
                                </div>
                                {q.presetAnswers && (
                                  <div className="text-slate-500">
                                    备选: {q.presetAnswers.join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-800">
                            {q.usageCount} 次
                          </td>
                          <td className="p-4 font-bold">
                            {q.status === 'ENABLED' ? (
                              <span className="text-emerald-600 text-[11px]">● 已上架</span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">○ 已下架</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => onToggleQuestionStatus(q.id)}
                              className="text-slate-600 hover:text-slate-900 font-bold underline text-xs"
                            >
                              {q.status === 'ENABLED' ? '下架' : '上架'}
                            </button>
                            <button
                              onClick={() => onDeleteQuestion(q.id)}
                              className="text-red-600 hover:text-red-700 font-bold underline text-xs"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3.4 批量导入与导出 */}
      {subTab === 'import-export' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-red-600" />
              全量素材 & 题库批量导入 (支持知识题、绕口令与猜猜看)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              可下载 EXCEL / CSV 模板填写后批量导入。导入时系统会自动根据 Mode 标识解析出对应为 [知识答题]、[绕口令朗读] 或 [家族猜猜看模板]。
            </p>

            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={() => alert('已开始下载 标准玩法素材导入模板.xlsx')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>下载 EXCEL 导入模板 (.xlsx)</span>
              </button>
              <button 
                onClick={() => alert('已导出全量题库为库镜像.json')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>全量题库 JSON 备份导出</span>
              </button>
            </div>

            {/* Drag Drop Area */}
            <div className="border-2 border-dashed border-slate-200 hover:border-red-400 bg-slate-50/50 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition-colors">
              <UploadCloud className="w-10 h-10 text-red-500 mx-auto" />
              <div>
                <div className="text-xs font-bold text-slate-800">点击上传或拖拽文件至此处</div>
                <div className="text-[11px] text-slate-400 mt-0.5">支持 .xlsx, .csv, .json 格式 (单次最多 5000 条)</div>
              </div>
              <button
                onClick={() => {
                  setImportStatus('✅ 成功解析 CSV 文件：新增 12 题 [知识答题]、5 条 [绕口令朗读]、3 条 [家族猜猜看]！');
                }}
                className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 inline-block"
              >
                模拟拖入并校验导入
              </button>
            </div>

            {importStatus && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3.5 待审核长辈自定义题 */}
      {subTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-red-50/80 border border-red-200/80 p-4 rounded-2xl text-red-900 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <div className="font-bold text-red-950">长辈自定义私房题审核池说明：</div>
              <p className="mt-0.5 text-red-800 leading-relaxed">
                长辈建房时可手动录入针对晚辈的趣味回忆题目。管理员审核通过后，题目方可在对应的微信答题房间内展示。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-4">长辈赞助人</th>
                    <th className="p-4">对应房间号</th>
                    <th className="p-4 max-w-xs">长辈出题题干</th>
                    <th className="p-4">录入选项</th>
                    <th className="p-4">正确答案</th>
                    <th className="p-4">提交时间</th>
                    <th className="p-4">审核状态</th>
                    <th className="p-4 text-right">人工审核</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{q.submitterName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{q.submitterOpenId}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">#{q.roomNo}</td>
                      <td className="p-4 font-bold text-slate-900 text-xs leading-relaxed max-w-xs">
                        {q.questionTitle}
                      </td>
                      <td className="p-4 text-[11px] text-slate-600">
                        {q.options.join(' / ')}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600">
                        {q.options[q.correctAnswerIndex]}
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-[11px]">
                        {q.submitTime}
                      </td>
                      <td className="p-4 font-semibold">
                        {q.status === 'PENDING' && <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-mono font-bold">待人工审核</span>}
                        {q.status === 'APPROVED' && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-mono font-bold">审核通过</span>}
                        {q.status === 'REJECTED' && <span className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-[11px] font-mono font-bold">已驳回</span>}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {q.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => onApproveAuditQuestion(q.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                            >
                              审核通过
                            </button>
                            <button
                              onClick={() => setRejectingAuditId(q.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors border border-red-200"
                            >
                              驳回
                            </button>
                          </>
                        )}
                        {q.status === 'REJECTED' && q.rejectReason && (
                          <span className="text-[10px] text-red-600 font-mono">驳回原因: {q.rejectReason}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Game Mode Config Modal */}
      {configModeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">【{configModeItem.name}】玩法参数配置</h3>
              </div>
              <button onClick={() => setConfigModeItem(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveModeConfig} className="space-y-4">
              
              {/* Gameplay Enable Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-900">玩法开关控制</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">关闭后，小程序建房列表将隐藏该玩法选项</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfigStatus(prev => prev === 'ENABLED' ? 'DISABLED' : 'ENABLED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    configStatus === 'ENABLED'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {configStatus === 'ENABLED' ? '已开启' : '已关闭'}
                </button>
              </div>

              {/* Mode Specific Dynamic Form Fields */}
              {configModeItem.code === 'QUIZ_QUESTION' && (
                <div className="space-y-3 p-4 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" /> 知识答题规则参数
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">单题限时 (秒)</label>
                      <input
                        type="number"
                        value={cfgTimeLimit}
                        onChange={(e) => setCfgTimeLimit(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                        min={5}
                        max={60}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">默认局内题量 (题)</label>
                      <input
                        type="number"
                        value={cfgQuestionCount}
                        onChange={(e) => setCfgQuestionCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                        min={1}
                        max={50}
                      />
                    </div>
                  </div>
                </div>
              )}

              {configModeItem.code === 'SPEED_CLICK' && (
                <div className="space-y-3 p-4 bg-red-50/60 rounded-xl border border-red-200/80">
                  <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-red-600" /> 极致秒表手速参数
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">目标秒数 (秒)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cfgTargetSec}
                        onChange={(e) => setCfgTargetSec(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">允许难度误差 (±秒)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cfgAllowedErr}
                        onChange={(e) => setCfgAllowedErr(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    提示：偏差 ≤ {cfgAllowedErr} 秒判定为满分得分。
                  </div>
                </div>
              )}

              {configModeItem.code === 'SHAKE_RACE' && (
                <div className="space-y-3 p-4 bg-indigo-50/60 rounded-xl border border-indigo-200/80">
                  <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-600" /> 摇一摇赛马参数
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">摇晃比赛限时 (秒)</label>
                      <input
                        type="number"
                        value={cfgShakeLimit}
                        onChange={(e) => setCfgShakeLimit(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">胜出目标频次 (次)</label>
                      <input
                        type="number"
                        value={cfgTargetShake}
                        onChange={(e) => setCfgTargetShake(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {configModeItem.code === 'VOICE_SPEECH' && (
                <div className="space-y-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-emerald-600" /> 绕口令语音 API 比对阈值
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">匹配度通关门槛 (%)</label>
                      <input
                        type="number"
                        value={cfgVoiceThresh}
                        onChange={(e) => setCfgVoiceThresh(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                        min={50}
                        max={100}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">API 识别敏感度</label>
                      <select
                        value={cfgVoiceSens}
                        onChange={(e) => setCfgVoiceSens(e.target.value as any)}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                      >
                        <option value="HIGH">高 (严格咬字)</option>
                        <option value="MEDIUM">中等 (标准普通话)</option>
                        <option value="LOW">低 (兼容方言)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {configModeItem.code === 'FAMILY_TRIVIA' && (
                <div className="space-y-3 p-4 bg-purple-50/60 rounded-xl border border-purple-200/80">
                  <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" /> 家族猜猜看预设模板
                  </h4>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">长辈出题默认引导问题</label>
                    <input
                      type="text"
                      value={cfgTriviaPrompt}
                      onChange={(e) => setCfgTriviaPrompt(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-purple-950"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setConfigModeItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 hover:bg-slate-800 text-xs font-bold rounded-xl shadow-md"
                >
                  保存配置并生效
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Category Modal */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">新增竞赛大类</h3>
              <button onClick={() => setIsAddCatOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateCategorySubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">分类名称</label>
                <input
                  type="text"
                  placeholder="如: 唐诗宋词特辑"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">分类标识 Code</label>
                <input
                  type="text"
                  placeholder="如: TSSC"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono uppercase"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">显示 Emoji / 图标</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddCatOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">取消</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-xs">提交保存</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Material Modal (Supports Quiz, Voice, Family Trivia) */}
      {isAddMatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">录入新素材 / 题目</h3>
              <button onClick={() => setIsAddMatOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateMaterialSubmit} className="space-y-4">
              
              {/* Gameplay Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">绑定玩法 (Mode)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMatMode('QUIZ_QUESTION')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      newMatMode === 'QUIZ_QUESTION'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    知识答题
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMatMode('VOICE_SPEECH')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      newMatMode === 'VOICE_SPEECH'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    绕口令朗读
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMatMode('FAMILY_TRIVIA')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      newMatMode === 'FAMILY_TRIVIA'
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    家族猜猜看
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {newMatMode === 'QUIZ_QUESTION' && '题干部 / 问题描述'}
                  {newMatMode === 'VOICE_SPEECH' && '绕口令朗读文本 (如: 吃葡萄不吐葡萄皮)'}
                  {newMatMode === 'FAMILY_TRIVIA' && '长辈猜测问题 (如: [长辈] 年轻时最喜欢的歌是？)'}
                </label>
                <textarea
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  placeholder="请输入具体内容..."
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Specific Form Elements */}
              {newMatMode === 'QUIZ_QUESTION' && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <label className="text-[11px] font-bold text-slate-700 block">4选1 备选项录入与正确答案勾选</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="选项 A"
                      value={newOptA}
                      onChange={(e) => setNewOptA(e.target.value)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="选项 B"
                      value={newOptB}
                      onChange={(e) => setNewOptB(e.target.value)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="选项 C"
                      value={newOptC}
                      onChange={(e) => setNewOptC(e.target.value)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="选项 D"
                      value={newOptD}
                      onChange={(e) => setNewOptD(e.target.value)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="font-bold text-slate-700">正确选项:</span>
                    {['A', 'B', 'C', 'D'].map((lbl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCorrectIdx(idx)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                          correctIdx === idx ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {newMatMode === 'VOICE_SPEECH' && (
                <div className="space-y-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">拼音注音 (供语音算法比对)</label>
                    <input
                      type="text"
                      placeholder="chī pú tao bù tǔ pú tao pí..."
                      value={newPinyin}
                      onChange={(e) => setNewPinyin(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">难读关键字词 (逗号分隔)</label>
                    <input
                      type="text"
                      placeholder="葡萄, 吐, 葡萄皮"
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {newMatMode === 'FAMILY_TRIVIA' && (
                <div className="space-y-3 p-3 bg-purple-50/60 rounded-xl border border-purple-200/80">
                  <div>
                    <label className="text-[11px] font-bold text-purple-900 block mb-1">出题长辈参考引导备选项 (逗号或换行分隔)</label>
                    <textarea
                      placeholder="甜蜜蜜, 渴望, 难忘今宵, 军港之夜"
                      value={newPresetAnswers}
                      onChange={(e) => setNewPresetAnswers(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">所属竞赛分类</label>
                  <select
                    value={newMatCategory}
                    onChange={(e) => setNewMatCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">素材难度</label>
                  <select
                    value={newMatDifficulty}
                    onChange={(e) => setNewMatDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                  >
                    <option value="EASY">简单 (EASY)</option>
                    <option value="MEDIUM">中等 (MEDIUM)</option>
                    <option value="HARD">困难 (HARD)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsAddMatOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">取消</button>
                <button type="submit" className="px-5 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-xl shadow-xs">提交录入</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Reject Audit Reason Modal */}
      {rejectingAuditId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-red-600 text-sm">驳回长辈自定义私房题</h3>
            <p className="text-xs text-slate-500">请输入驳回原因，系统将通过微信订阅消息反馈长辈：</p>
            <input
              type="text"
              placeholder="如: 包含敏感词或答案选项逻辑错误"
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRejectingAuditId(null)} className="px-3 py-1.5 bg-slate-100 text-xs font-bold rounded-xl">取消</button>
              <button
                onClick={() => {
                  onRejectAuditQuestion(rejectingAuditId, rejectReasonInput || '题目未通过规则审核');
                  setRejectingAuditId(null);
                  setRejectReasonInput('');
                }}
                className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
