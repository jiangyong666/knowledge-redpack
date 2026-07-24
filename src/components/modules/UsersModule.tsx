import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Award, 
  Wallet, 
  Plus, 
  Lock, 
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { 
  UsersSubTab, 
  PlayerProfile, 
  SponsorProfile, 
  BlacklistUser, 
  SecurityModalConfig 
} from '../../types';

interface UsersModuleProps {
  subTab: UsersSubTab;
  onSelectSubTab: (sub: UsersSubTab) => void;
  players: PlayerProfile[];
  sponsors: SponsorProfile[];
  blacklist: BlacklistUser[];
  onToggleBlockUser: (openId: string) => void;
  onAddBlacklistUser: (openId: string, nickname: string, reason: string) => void;
  onRemoveBlacklistUser: (id: string) => void;
  onRequestSecurityModal: (config: SecurityModalConfig) => void;
  isCompact: boolean;
}

export const UsersModule: React.FC<UsersModuleProps> = ({
  subTab,
  onSelectSubTab,
  players,
  sponsors,
  blacklist,
  onToggleBlockUser,
  onAddBlacklistUser,
  onRemoveBlacklistUser,
  onRequestSecurityModal,
  isCompact
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Blacklist modal form state
  const [isAddBlacklistOpen, setIsAddBlacklistOpen] = useState(false);
  const [addOpenId, setAddOpenId] = useState('');
  const [addNickname, setAddNickname] = useState('');
  const [addReason, setAddReason] = useState('使用连点脚本/作弊挂');

  const tabs = [
    { id: 'players' as UsersSubTab, label: '5.1 玩家档案管理', icon: Users },
    { id: 'sponsors' as UsersSubTab, label: '5.2 赞助人(长辈)管理', icon: Award },
    { 
      id: 'blacklist' as UsersSubTab, 
      label: '5.3 黑名单与风险拦截', 
      icon: ShieldAlert,
      badge: blacklist.length
    },
  ];

  const handleAddBlacklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addOpenId) return;
    onAddBlacklistUser(addOpenId, addNickname || '未知账号', addReason);
    setAddOpenId('');
    setAddNickname('');
    setIsAddBlacklistOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Sub Tabs */}
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
                  ? 'bg-slate-900 text-amber-400 shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-red-500 text-white font-mono text-[10px] rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5.1 玩家档案管理 */}
      {subTab === 'players' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索玩家微信昵称 / OpenID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-mono">
              注册玩家总数: <strong className="text-slate-900 font-bold">{players.length}</strong> 人
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">玩家信息 (OpenID)</th>
                    <th className="p-3.5">参与房间数</th>
                    <th className="p-3.5">累计赢得零钱奖金</th>
                    <th className="p-3.5">答题积分榜</th>
                    <th className="p-3.5">风控画像等级</th>
                    <th className="p-3.5">账号状态</th>
                    <th className="p-3.5 text-right">风控管控</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {players
                    .filter(p => !searchQuery || p.nickname.includes(searchQuery) || p.openId.includes(searchQuery))
                    .map((pl) => (
                      <tr key={pl.openId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img src={pl.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{pl.nickname}</div>
                              <div className="text-[10px] font-mono text-slate-400">{pl.openId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {pl.totalRoomsJoined} 场
                        </td>
                        <td className="p-3.5 font-mono font-black text-red-600 text-sm">
                          ¥{pl.totalPrizeWon.toFixed(2)}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-indigo-600">
                          {pl.rankScore} 分
                        </td>
                        <td className="p-3.5 font-semibold">
                          {pl.riskLevel === 'NORMAL' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px]">正常良好</span>}
                          {pl.riskLevel === 'SUSPICIOUS' && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[11px]">疑似脚本</span>}
                          {pl.riskLevel === 'BLACK' && <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono text-[11px]">高风险拦截</span>}
                        </td>
                        <td className="p-3.5 font-semibold">
                          {pl.status === 'NORMAL' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px]">正常使用</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono text-[11px]">封禁黑名单</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              onRequestSecurityModal({
                                isOpen: true,
                                title: pl.status === 'NORMAL' ? '封禁该玩家微信账号' : '解封该玩家账号',
                                description: pl.status === 'NORMAL'
                                  ? `确认将玩家 “${pl.nickname}” 加入黑名单？封禁后该微信 OpenID 将无法再参加任何房间答题或提取红包。`
                                  : `确认解除玩家 “${pl.nickname}” 的黑名单限制？`,
                                type: pl.status === 'NORMAL' ? 'DANGER' : 'WARNING',
                                actionButtonText: pl.status === 'NORMAL' ? '确认限制封禁' : '确认解除封禁',
                                onConfirm: () => onToggleBlockUser(pl.openId)
                              });
                            }}
                            className={`px-3 py-1 font-bold text-xs rounded-lg transition-colors ${
                              pl.status === 'NORMAL'
                                ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {pl.status === 'NORMAL' ? '拉黑封禁' : '解封账号'}
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

      {/* 5.2 赞助人(长辈)管理 */}
      {subTab === 'sponsors' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">建房长辈 (赞助人) 档案库</h3>
              <p className="text-xs text-slate-500 mt-0.5">记录赞助建房资金的长辈，关注其累计充值投入及剩余可用奖金池。</p>
            </div>
            <div className="text-xs font-mono text-slate-500">赞助长辈数: <strong className="text-slate-900">{sponsors.length}</strong> 人</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">赞助长辈微信 (OpenID)</th>
                    <th className="p-3.5">VIP 等级</th>
                    <th className="p-3.5">累计充值资金</th>
                    <th className="p-3.5">累计建房数量</th>
                    <th className="p-3.5">微信个人账户结余</th>
                    <th className="p-3.5">注册时间</th>
                    <th className="p-3.5 text-right">赞助服务</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sponsors.map((sp) => (
                    <tr key={sp.openId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={sp.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-amber-400/40" />
                          <div>
                            <div className="font-bold text-slate-900">{sp.nickname}</div>
                            <div className="text-[10px] font-mono text-slate-400">{sp.openId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px]">
                          ⭐ {sp.vipTier}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-black text-emerald-600 text-sm">
                        ¥{sp.totalRecharged.toFixed(2)}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {sp.roomsCreatedCount} 间
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        ¥{sp.unspentBalance.toFixed(2)}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                        {sp.createdAt}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => alert(`长辈 ${sp.nickname} 的VIP权限与专属答题模板已生效。`)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs"
                        >
                          发长辈关怀礼券
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

      {/* 5.3 黑名单与风险拦截 */}
      {subTab === 'blacklist' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>
                <strong>黑名单拦截数据库：</strong>被录入此处的微信 OpenID 或 IP 地址将无法发起提现、无法进入任何答题房间。
              </span>
            </div>
            <button
              onClick={() => setIsAddBlacklistOpen(true)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>新增黑名单 OpenID</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">微信 OpenID / IP</th>
                    <th className="p-3.5">昵称备注</th>
                    <th className="p-3.5">拦截风控原因</th>
                    <th className="p-3.5">拦截时间</th>
                    <th className="p-3.5">执行操作人</th>
                    <th className="p-3.5 text-right">解封操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blacklist.map((bl) => (
                    <tr key={bl.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono text-slate-900 font-bold">
                        <div>{bl.openId}</div>
                        <div className="text-[10px] text-slate-400 font-normal">IP: {bl.ip}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{bl.nickname}</td>
                      <td className="p-3.5 font-mono text-red-600 font-bold">{bl.blockReason}</td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">{bl.blockedAt}</td>
                      <td className="p-3.5 font-mono text-slate-700 text-[11px]">{bl.blockedBy}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            onRequestSecurityModal({
                              isOpen: true,
                              title: '确认将账号移出黑名单',
                              description: `解封后该微信 OpenID (${bl.openId}) 将恢复小程序答题及红包提现权限。`,
                              type: 'WARNING',
                              actionButtonText: '确认解封移出',
                              onConfirm: () => onRemoveBlacklistUser(bl.id)
                            });
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors border border-slate-300"
                        >
                          移出黑名单
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

      {/* Modal: Add Blacklist */}
      {isAddBlacklistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">新增黑名单 OpenID 拦截</h3>
              <button onClick={() => setIsAddBlacklistOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddBlacklistSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">微信 OpenID (或特定微信账号)</label>
                <input
                  type="text"
                  required
                  placeholder="如：wx_openid_9982"
                  value={addOpenId}
                  onChange={(e) => setAddOpenId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">玩家昵称备注</label>
                <input
                  type="text"
                  placeholder="如：作弊号A"
                  value={addNickname}
                  onChange={(e) => setAddNickname(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">拦截黑名单原因</label>
                <input
                  type="text"
                  required
                  value={addReason}
                  onChange={(e) => setAddReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="text-right pt-2 space-x-2">
                <button type="button" onClick={() => setIsAddBlacklistOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">取消</button>
                <button type="submit" className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold">保存并立即封禁</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
