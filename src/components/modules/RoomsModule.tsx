import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Play, 
  Users, 
  Trophy, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle, 
  History, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { 
  RoomsSubTab, 
  ActiveRoom, 
  HistoryRoom, 
  GameLog, 
  SecurityModalConfig 
} from '../../types';

interface RoomsModuleProps {
  subTab: RoomsSubTab;
  onSelectSubTab: (sub: RoomsSubTab) => void;
  activeRooms: ActiveRoom[];
  historyRooms: HistoryRoom[];
  gameLogs: GameLog[];
  onForceDissolveRoom: (roomCode: string) => void;
  onRequestSecurityModal: (config: SecurityModalConfig) => void;
  isCompact: boolean;
}

export const RoomsModule: React.FC<RoomsModuleProps> = ({
  subTab,
  onSelectSubTab,
  activeRooms,
  historyRooms,
  gameLogs,
  onForceDissolveRoom,
  onRequestSecurityModal,
  isCompact
}) => {
  const [searchRoom, setSearchRoom] = useState('');
  const [selectedActiveRoom, setSelectedActiveRoom] = useState<ActiveRoom | null>(null);

  const tabs = [
    { id: 'active' as RoomsSubTab, label: '4.1 实时房间监控', icon: Play, badge: activeRooms.length },
    { id: 'history' as RoomsSubTab, label: '4.2 历史房间记录', icon: History },
    { id: 'logs' as RoomsSubTab, label: '4.3 对局日志明细', icon: FileText },
  ];

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
              {t.badge !== undefined && (
                <span className="px-1.5 py-0.2 bg-emerald-500 text-white font-mono text-[10px] rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4.1 实时房间监控 */}
      {subTab === 'active' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="text-xs text-slate-600">
              全网正在运行房间: <strong className="font-mono text-slate-900 text-sm">{activeRooms.length}</strong> 间
            </div>
            <div className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>WebSocket 长连接状态正常</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeRooms.map((room) => (
              <div key={room.roomCode} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={room.hostAvatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/50" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-base">#{room.roomCode}</span>
                        {room.status === 'PLAYING' && <span className="px-2 py-0.2 bg-red-100 text-red-700 text-[10px] font-mono font-bold rounded">对局进行中</span>}
                        {room.status === 'WAITING' && <span className="px-2 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-mono font-bold rounded">组队等待中</span>}
                      </div>
                      <p className="text-xs text-slate-500">房主: {room.hostName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">资金池总额</span>
                    <strong className="text-slate-900 font-black text-sm">¥{room.prizePool.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">房间人数</span>
                    <strong className="text-slate-900 text-sm">{room.currentPlayers} / {room.maxPlayers} 人</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>竞赛大类: <span className="font-bold text-slate-800">{room.categoryName}</span></div>
                  <div className="text-[11px] font-mono text-slate-400">创建时间: {room.createdAt}</div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedActiveRoom(room)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Trophy className="w-3.5 h-3.5" /> 实时战况榜
                  </button>

                  <button
                    onClick={() => {
                      onRequestSecurityModal({
                        isOpen: true,
                        title: '高风险：强制解散房间',
                        description: `警告：强制解散该违规房间将中断所有玩家答题。房间未派发的奖金余额 ¥${room.prizePool.toFixed(2)} 将通过微信退款原路退回房主。`,
                        type: 'DANGER',
                        requiredConfirmText: room.roomCode,
                        requiresFundPin: true,
                        actionButtonText: '强制解散并原路退款',
                        dataSummary: `房间号: #${room.roomCode} | 房主: ${room.hostName} | 资金池: ¥${room.prizePool}`,
                        onConfirm: () => onForceDissolveRoom(room.roomCode)
                      });
                    }}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg border border-red-200 transition-colors"
                  >
                    强制解散
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4.2 历史房间记录 */}
      {subTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="text-xs text-slate-600 font-medium">
              全量已归档结算房间: <strong className="font-mono text-slate-900 text-sm">{historyRooms.length}</strong> 间
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">房间邀请码</th>
                    <th className="p-3.5">初始赞助资金池</th>
                    <th className="p-3.5">实际派发金额</th>
                    <th className="p-3.5">答题榜第一名 (胜者)</th>
                    <th className="p-3.5">结算状态</th>
                    <th className="p-3.5">结算时间</th>
                    <th className="p-3.5 text-right">结算报告</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyRooms.map((hr) => (
                    <tr key={hr.roomCode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">#{hr.roomCode}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">¥{hr.initialPrizePool.toFixed(2)}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-600">¥{hr.actualPayout.toFixed(2)}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-amber-700">{hr.winnerName}</span>
                        <div className="text-[10px] font-mono text-slate-400">{hr.winnerOpenId}</div>
                      </td>
                      <td className="p-3.5 font-semibold">
                        {hr.status === 'SETTLED' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px]">已完成结算</span>}
                        {hr.status === 'DISSOLVED' && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono text-[11px]">管理员解散</span>}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">{hr.settledAt}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => alert(`房间 #${hr.roomCode} 完整对局结算报告正常，已归档。`)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs"
                        >
                          查看明细报告
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

      {/* 4.3 对局日志明细 */}
      {subTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">防作弊对局毫秒级流水日志</h3>
              <p className="text-xs text-slate-500 mt-0.5">记录玩家每一题提交答案的耗时 (ms) 与系统判定加分结果。</p>
            </div>
            <div className="text-xs font-mono text-slate-500">毫秒级精确判定</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">房间号 / 轮次</th>
                    <th className="p-3.5">参赛玩家</th>
                    <th className="p-3.5">选择选项内容</th>
                    <th className="p-3.5">答题耗时 (ms)</th>
                    <th className="p-3.5">判定结果</th>
                    <th className="p-3.5">获得积分</th>
                    <th className="p-3.5 text-right">时间戳</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gameLogs.map((gl) => (
                    <tr key={gl.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-slate-900">#{gl.roomNo}</span>
                        <span className="text-[10px] text-slate-400 block">第 {gl.roundIndex} 题</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{gl.playerName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{gl.playerOpenId}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-800 font-medium">{gl.optionChosen}</td>
                      <td className="p-3.5 font-mono font-bold">
                        <span className={gl.durationMs < 500 ? 'text-red-600 font-black' : 'text-slate-800'}>
                          {gl.durationMs} ms {gl.durationMs < 500 && '(极速过快)'}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold">
                        {gl.result === 'CORRECT' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px]">回答正确</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono text-[11px]">回答错误</span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono font-black text-indigo-600">
                        +{gl.pointsEarned} 分
                      </td>
                      <td className="p-3.5 font-mono text-slate-400 text-[11px] text-right">
                        {gl.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal for Active Room */}
      {selectedActiveRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                房间 #{selectedActiveRoom.roomCode} 实时排行榜
              </h3>
              <button onClick={() => setSelectedActiveRoom(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-2">
              {selectedActiveRoom.leaderboard.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-mono">组队阶段，暂无玩家答题分数</div>
              ) : (
                selectedActiveRoom.leaderboard.map((lb) => (
                  <div key={lb.rank} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full font-mono font-black text-xs flex items-center justify-center ${lb.rank === 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                        {lb.rank}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{lb.name}</span>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div className="font-bold text-slate-800">{lb.score} 分</div>
                      <div className="text-emerald-600 font-bold">已领 ¥{lb.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-right pt-2">
              <button onClick={() => setSelectedActiveRoom(null)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
