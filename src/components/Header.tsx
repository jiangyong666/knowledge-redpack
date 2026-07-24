import React from 'react';
import { 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  ChevronRight, 
  User, 
  Lock,
  RefreshCw,
  Bell
} from 'lucide-react';
import { PrimaryMenuId, SubMenuId } from '../types';

interface HeaderProps {
  primaryTab: PrimaryMenuId;
  subTab: SubMenuId;
  onSelectTab: (primary: PrimaryMenuId, sub?: SubMenuId) => void;
  pendingExceptionsCount: number;
  pendingAuditCount: number;
  isSandbox: boolean;
  onToggleSandbox: () => void;
  isCompact: boolean;
  onToggleCompact: () => void;
}

const PRIMARY_LABELS: Record<PrimaryMenuId, string> = {
  dashboard: '数据概览控制台',
  finance: '资金与对账中心',
  questions: '玩法与内容管理',
  rooms: '房间与实时对局',
  users: '用户与风控管理',
  settings: '系统与接口设置',
};

const SUB_LABELS: Record<SubMenuId, string> = {
  'recharge-orders': '2.1 充值订单流水',
  'transfer-logs': '2.2 提现派发明细',
  'reconciliation': '2.3 资金对账总表',
  'exceptions': '2.4 异常补发与退款',
  'modes': '3.1 玩法模式开关与配置',
  'categories': '3.2 竞赛/题库分类管理',
  'list': '3.3 题库与素材管理',
  'import-export': '3.4 批量导入与导出',
  'audit': '3.5 待审核长辈自定义题',
  'active': '4.1 实时房间监控',
  'history': '4.2 历史房间记录',
  'logs': '4.3 对局日志明细',
  'players': '5.1 玩家档案管理',
  'sponsors': '5.2 赞助人(长辈)管理',
  'blacklist': '5.3 黑名单与风险拦截',
  'wechat-pay': '6.1 微信支付/商户配置',
  'risk-rules': '6.2 业务风控与规则配置',
  'admins': '6.3 管理员与权限配置',
};

export const Header: React.FC<HeaderProps> = ({
  primaryTab,
  subTab,
  onSelectTab,
  pendingExceptionsCount,
  pendingAuditCount,
  isSandbox,
  onToggleSandbox,
  isCompact,
  onToggleCompact
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-6 py-3.5 flex items-center justify-between">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span 
          className="hover:text-slate-900 cursor-pointer font-medium text-slate-600 transition-colors" 
          onClick={() => onSelectTab('dashboard')}
        >
          答题领红包后台
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span 
          className="hover:text-slate-900 cursor-pointer text-slate-700 font-semibold transition-colors"
          onClick={() => onSelectTab(primaryTab)}
        >
          {PRIMARY_LABELS[primaryTab]}
        </span>
        {primaryTab !== 'dashboard' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-red-700 font-bold bg-red-50/80 border border-red-200/80 px-2.5 py-0.5 rounded-lg text-[11px]">
              {SUB_LABELS[subTab]}
            </span>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Pending Audit Notification */}
        {pendingAuditCount > 0 && (
          <button
            onClick={() => onSelectTab('questions', 'audit')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all shadow-2xs"
            title="查看待审核的长辈自定义题目"
          >
            <Bell className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            <span>待审题目: {pendingAuditCount} 题</span>
          </button>
        )}

        {/* Global Exception Alert Badge */}
        {pendingExceptionsCount > 0 && (
          <button
            onClick={() => onSelectTab('finance', 'exceptions')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-all animate-pulse shadow-2xs"
            title="查看待补发与退款的异常转账"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>异常补发: {pendingExceptionsCount} 笔待处理</span>
          </button>
        )}

        {/* Sandbox Switcher */}
        <button
          onClick={onToggleSandbox}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-colors border shadow-2xs ${
            isSandbox
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
          }`}
          title="点击切换正式/沙箱环境"
        >
          <span className={`w-2 h-2 rounded-full ${isSandbox ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
          <span>{isSandbox ? '[SANDBOX] 微信沙箱模式' : '[PROD] 微信商户号: 1689201928'}</span>
          <RefreshCw className="w-3 h-3 text-slate-400 ml-1" />
        </button>

        {/* Density Toggle */}
        <button
          onClick={onToggleCompact}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs flex items-center gap-1.5 font-medium"
          title={isCompact ? '切换到舒适分布' : '切换到高密度表格'}
        >
          {isCompact ? <Maximize2 className="w-3.5 h-3.5 text-slate-500" /> : <Minimize2 className="w-3.5 h-3.5 text-slate-500" />}
          <span className="hidden sm:inline font-mono text-[11px]">{isCompact ? '紧凑布局' : '舒适布局'}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Admin Info */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-200 shadow-2xs">
            <User className="w-4 h-4 text-amber-400" />
          </div>
          <div className="hidden md:block text-left leading-none">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              admin_master
              <Lock className="w-3 h-3 text-emerald-600" title="风控密钥与二级权限已锁定" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">超级管理员 (双因子已校验)</div>
          </div>
        </div>

      </div>

    </header>
  );
};
