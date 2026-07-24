import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  ArrowUpRight, 
  HelpCircle,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { DashboardStats, SubMenuId } from '../../types';

interface DashboardModuleProps {
  stats: DashboardStats;
  onNavigateSubTab: (primary: any, sub: SubMenuId) => void;
  isCompact: boolean;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  stats,
  onNavigateSubTab,
  isCompact
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Alert / Festive Tech Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] tracking-wide rounded-full uppercase shadow-xs">
                实战对账 & 商家直派
              </span>
              <span className="text-xs text-slate-400 font-mono">商户号: 1689201928 (已安全双因子加密)</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              答题领红包 · 运营概览控制台
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              实时监测微信充值订单流水、微信商家转账到零钱出金成功率、长辈赞助出题队列及全网实时答题房间安全。
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => onNavigateSubTab('finance', 'exceptions')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-950/40"
            >
              <AlertTriangle className="w-4 h-4 text-slate-950" />
              <span>处理异常补发 ({stats.pendingExceptionsCount})</span>
            </button>

            <button
              onClick={() => onNavigateSubTab('questions', 'audit')}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-950/50"
            >
              <Bell className="w-4 h-4" />
              <span>审题队列 ({stats.pendingAuditQuestionsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold text-slate-600">累计充值资金池</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ¥{stats.totalRecharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>长辈赞助资金累计注入</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold text-slate-600">累计派发红包额</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 text-white shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ¥{stats.totalPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2.5">
            <span>微信零钱直派成功率</span>
            <span className="text-red-600 font-black font-mono">{stats.wxTransferSuccessRate}%</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold text-slate-600">今日新增充值 / 派发</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-lg font-black text-emerald-600">+¥{stats.todayRecharge}</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-lg font-black text-red-600">-¥{stats.todayPayout}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5">
            今日净结余: <span className="font-mono font-bold text-slate-900">¥{(stats.todayRecharge - stats.todayPayout).toFixed(2)}</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold text-slate-600">今日活动房间 / 玩家</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3 font-mono">
            <span className="text-2xl font-black text-slate-900">{stats.todayRoomsCreated} <span className="text-xs text-slate-500 font-sans font-normal">间</span></span>
            <span className="text-sm font-bold text-slate-600">{stats.todayActivePlayers} <span className="text-xs text-slate-500 font-sans font-normal">人参赛</span></span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>实时高并发稳定无延迟</span>
          </div>
        </div>

      </div>

      {/* Middle Section: Trend Visualizer & Category Popularity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Financial Flow Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                充值与提现资金走势 (最近 7 日)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">对比长辈赞助注入 vs 晚辈答题提现划拨趋势</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" /> 充值注入</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-xs" /> 零钱提现</span>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-3">
            {[
              { day: '07-17', in: 12000, out: 10500 },
              { day: '07-18', in: 15400, out: 13200 },
              { day: '07-19', in: 18000, out: 16500 },
              { day: '07-20', in: 11000, out: 9800 },
              { day: '07-21', in: 21000, out: 19200 },
              { day: '07-22', in: 16500, out: 14800 },
              { day: '07-23', in: 12800, out: 11450 },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                
                {/* Hover Tooltip */}
                <div className="absolute -top-12 bg-slate-950 text-amber-300 text-[10px] py-1.5 px-2.5 rounded-lg font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg border border-slate-800">
                  入金: ¥{item.in} | 出金: ¥{item.out}
                </div>

                <div className="w-full max-w-[32px] h-40 flex items-end gap-1 bg-slate-50/80 p-1 rounded-lg">
                  <div 
                    style={{ height: `${(item.in / 25000) * 100}%` }} 
                    className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xs group-hover:brightness-110 transition-all shadow-xs" 
                  />
                  <div 
                    style={{ height: `${(item.out / 25000) * 100}%` }} 
                    className="w-1/2 bg-gradient-to-t from-red-600 to-red-400 rounded-t-xs group-hover:brightness-110 transition-all shadow-xs" 
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-medium">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">峰值节点：07-21 单日流动总资金超 4 万元</span>
            <button 
              onClick={() => onNavigateSubTab('finance', 'reconciliation')}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
            >
              查看完整对账总表 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Category Popularity Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              热门竞赛类型参与度分布
            </h3>
            <p className="text-xs text-slate-500 mb-4">分析玩家偏好的竞赛学科题目</p>

            <div className="space-y-4">
              {[
                { name: '古诗词与传统文化', pct: 42, color: 'bg-red-500', count: '162 局' },
                { name: '成语接龙与常识', pct: 28, color: 'bg-amber-500', count: '108 局' },
                { name: '新春灯谜与民俗', pct: 18, color: 'bg-emerald-500', count: '70 局' },
                { name: '科技与算法常识', pct: 8, color: 'bg-indigo-500', count: '31 局' },
                { name: '微信风控与安全', pct: 4, color: 'bg-purple-500', count: '15 局' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-mono text-slate-500">{item.pct}% ({item.count})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div style={{ width: `${item.pct}%` }} className={`h-full ${item.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">已上线 5 个答题大类</span>
            <button
              onClick={() => onNavigateSubTab('questions', 'categories')}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors"
            >
              配置分类与权重 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="bg-slate-200/50 p-5 rounded-2xl border border-slate-200/80">
        <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>核心管理功能一键通道</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateSubTab('finance', 'transfer-logs')}
            className="p-4 bg-white rounded-xl border border-slate-200/80 text-left hover:border-red-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-red-600">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-red-500" />
                提现派发明细
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">查看微信商家转账批次与明细</p>
          </button>

          <button
            onClick={() => onNavigateSubTab('questions', 'list')}
            className="p-4 bg-white rounded-xl border border-slate-200/80 text-left hover:border-red-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-red-600">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                全量题库列表
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">新增、编辑或导入出题规则</p>
          </button>

          <button
            onClick={() => onNavigateSubTab('rooms', 'active')}
            className="p-4 bg-white rounded-xl border border-slate-200/80 text-left hover:border-red-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-red-600">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                实时对局监控
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">强拆违规房间或查看实时积分</p>
          </button>

          <button
            onClick={() => onNavigateSubTab('settings', 'wechat-pay')}
            className="p-4 bg-white rounded-xl border border-slate-200/80 text-left hover:border-red-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-red-600">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                微信商户号密钥
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">维护 API v3 密钥与证书序列号</p>
          </button>
        </div>
      </div>

    </div>
  );
};
