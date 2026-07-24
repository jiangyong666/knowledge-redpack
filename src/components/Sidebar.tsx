import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  BookOpen, 
  Home, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PrimaryMenuId, SubMenuId } from '../types';

interface SidebarProps {
  primaryTab: PrimaryMenuId;
  subTab: SubMenuId;
  onSelectTab: (primary: PrimaryMenuId, sub?: SubMenuId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingExceptionsCount: number;
  pendingAuditQuestionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  primaryTab,
  subTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingExceptionsCount,
  pendingAuditQuestionsCount
}) => {
  // Track open state for accordion menus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    finance: true,
    questions: true,
    rooms: true,
    users: true,
    settings: true,
  });

  const toggleAccordion = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuTree = [
    {
      id: 'dashboard' as PrimaryMenuId,
      label: '数据概览控制台',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'finance' as PrimaryMenuId,
      label: '资金与对账中心',
      icon: Wallet,
      path: '/finance',
      children: [
        { id: 'recharge-orders' as SubMenuId, label: '充值订单流水', code: '2.1' },
        { id: 'transfer-logs' as SubMenuId, label: '提现派发明细', code: '2.2' },
        { id: 'reconciliation' as SubMenuId, label: '资金对账总表', code: '2.3' },
        { 
          id: 'exceptions' as SubMenuId, 
          label: '异常补发与退款', 
          code: '2.4',
          badge: pendingExceptionsCount > 0 ? `${pendingExceptionsCount}` : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-black'
        },
      ]
    },
    {
      id: 'questions' as PrimaryMenuId,
      label: '玩法与内容管理',
      icon: BookOpen,
      path: '/game-center',
      children: [
        { id: 'modes' as SubMenuId, label: '玩法模式开关与配置', code: '3.1' },
        { id: 'categories' as SubMenuId, label: '竞赛/题库分类管理', code: '3.2' },
        { id: 'list' as SubMenuId, label: '题库与素材管理', code: '3.3' },
        { id: 'import-export' as SubMenuId, label: '批量导入与导出', code: '3.4' },
        { 
          id: 'audit' as SubMenuId, 
          label: '待审核长辈自定义题', 
          code: '3.5',
          badge: pendingAuditQuestionsCount > 0 ? `${pendingAuditQuestionsCount}` : undefined,
          badgeColor: 'bg-red-500 text-white font-black'
        },
      ]
    },
    {
      id: 'rooms' as PrimaryMenuId,
      label: '房间与实时对局',
      icon: Home,
      path: '/rooms',
      children: [
        { id: 'active' as SubMenuId, label: '实时房间监控', code: '4.1' },
        { id: 'history' as SubMenuId, label: '历史房间记录', code: '4.2' },
        { id: 'logs' as SubMenuId, label: '对局日志明细', code: '4.3' },
      ]
    },
    {
      id: 'users' as PrimaryMenuId,
      label: '用户与风控管理',
      icon: Users,
      path: '/users',
      children: [
        { id: 'players' as SubMenuId, label: '玩家档案管理', code: '5.1' },
        { id: 'sponsors' as SubMenuId, label: '赞助人(长辈)管理', code: '5.2' },
        { id: 'blacklist' as SubMenuId, label: '黑名单与风险拦截', code: '5.3' },
      ]
    },
    {
      id: 'settings' as PrimaryMenuId,
      label: '系统与接口设置',
      icon: Settings,
      path: '/settings',
      children: [
        { id: 'wechat-pay' as SubMenuId, label: '微信支付/商户配置', code: '6.1' },
        { id: 'risk-rules' as SubMenuId, label: '业务风控与规则配置', code: '6.2' },
        { id: 'admins' as SubMenuId, label: '管理员与权限配置', code: '6.3' },
      ]
    }
  ];

  return (
    <aside className={`relative flex flex-col bg-[#0b0f19] text-slate-300 transition-all duration-300 z-40 border-r border-slate-800/80 shrink-0 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-400 flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-red-500/20 shrink-0">
            答
          </div>
          {!isCollapsed && (
            <div className="leading-tight overflow-hidden whitespace-nowrap">
              <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>答题领红包后台</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-gradient-to-r from-red-500/20 to-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">v3.0</span>
              </h1>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>资金风控 & 商户零钱直派</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Tree */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuTree.map((parent) => {
          const Icon = parent.icon;
          const isPrimaryActive = primaryTab === parent.id;
          const hasChildren = parent.children && parent.children.length > 0;
          const isOpen = openMenus[parent.id] ?? true;

          return (
            <div key={parent.id} className="space-y-1">
              {/* Parent Button */}
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleAccordion(parent.id);
                    if (!isPrimaryActive) {
                      onSelectTab(parent.id, parent.children[0].id);
                    }
                  } else {
                    onSelectTab(parent.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isPrimaryActive
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-amber-400 shadow-sm border border-slate-700/80'
                    : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                }`}
                title={isCollapsed ? parent.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isPrimaryActive ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="truncate text-left font-bold text-xs">{parent.label}</span>}
                </div>

                {!isCollapsed && hasChildren && (
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                )}
              </button>

              {/* Child Sub-Menu List */}
              {!isCollapsed && hasChildren && isOpen && (
                <div className="pl-5 space-y-1 my-1 border-l border-slate-800/80 ml-5">
                  {parent.children.map((child) => {
                    const isChildActive = isPrimaryActive && subTab === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => onSelectTab(parent.id, child.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] transition-all relative ${
                          isChildActive
                            ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-bold shadow-md shadow-red-950/60'
                            : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`font-mono text-[10px] ${isChildActive ? 'text-white/80' : 'text-slate-500'}`}>{child.code}</span>
                          <span className="truncate">{child.label}</span>
                        </div>

                        {child.badge && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded-full shadow-xs ${
                            isChildActive ? 'bg-white text-red-700' : child.badgeColor || 'bg-amber-500 text-slate-950'
                          }`}>
                            {child.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Safety Footer Info */}
      {!isCollapsed && (
        <div className="p-3 m-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>商户直派风控安全防护</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            全量资金划拨均受单日额度限制，异常提现与退款开启二次 PIN 码与确认验证。
          </p>
        </div>
      )}

      {/* Toggle Sidebar Collapse Button */}
      <button
        onClick={onToggleCollapse}
        className="h-10 flex items-center justify-center border-t border-slate-800/80 hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors text-xs"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[11px] font-mono">收起左侧导航</span>
          </div>
        )}
      </button>

    </aside>
  );
};
