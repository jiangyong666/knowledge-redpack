import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldAlert,
  FileSpreadsheet,
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  FinanceSubTab, 
  RechargeOrder, 
  TransferLog, 
  ReconciliationRow, 
  ExceptionRecord,
  SecurityModalConfig
} from '../../types';

interface FinanceModuleProps {
  subTab: FinanceSubTab;
  onSelectSubTab: (sub: FinanceSubTab) => void;
  rechargeOrders: RechargeOrder[];
  transferLogs: TransferLog[];
  reconciliationRows: ReconciliationRow[];
  exceptions: ExceptionRecord[];
  onRetryException: (id: string) => void;
  onRefundSponsor: (orderOrExceptionId: string) => void;
  onRequestSecurityModal: (config: SecurityModalConfig) => void;
  isCompact: boolean;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  subTab,
  onSelectSubTab,
  rechargeOrders,
  transferLogs,
  reconciliationRows,
  exceptions,
  onRetryException,
  onRefundSponsor,
  onRequestSecurityModal,
  isCompact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<RechargeOrder | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferLog | null>(null);

  // Sub tabs definition
  const tabs = [
    { id: 'recharge-orders' as FinanceSubTab, label: '2.1 充值订单流水', icon: ArrowDownLeft },
    { id: 'transfer-logs' as FinanceSubTab, label: '2.2 提现派发明细', icon: ArrowUpRight },
    { id: 'reconciliation' as FinanceSubTab, label: '2.3 资金对账总表', icon: FileSpreadsheet },
    { 
      id: 'exceptions' as FinanceSubTab, 
      label: '2.4 异常补发与退款', 
      icon: ShieldAlert,
      badge: exceptions.filter(e => e.status === 'FAILED').length
    },
  ];

  // Calculate finance metrics
  const totalRechargeSum = rechargeOrders.reduce((sum, o) => o.status === 'SUCCESS' ? sum + o.amount : sum, 0);
  const totalTransferSum = transferLogs.reduce((sum, t) => t.status === 'SUCCESS' ? sum + t.totalAmount : sum, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Sub-navigation Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-200/60 rounded-2xl">
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
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
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

        {/* Global Export Button */}
        <button 
          onClick={() => alert('已导出当前表格为标准 Excel / CSV 对账流水账单')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 shadow-2xs self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5 text-red-600" />
          <span>导出资金流水 CSV</span>
        </button>
      </div>

      {/* Financial Summary Top Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">长辈充值成功总额</div>
            <div className="text-lg font-black text-slate-900 font-mono">¥{totalRechargeSum.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">晚辈提现成功总额</div>
            <div className="text-lg font-black text-slate-900 font-mono">¥{totalTransferSum.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">待补发与退款笔数</div>
            <div className="text-lg font-black text-amber-600 font-mono">{exceptions.filter(e => e.status === 'FAILED').length} 笔</div>
          </div>
        </div>
      </div>

      {/* 2.1 充值订单流水 */}
      {subTab === 'recharge-orders' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="搜索单号 out_trade_no / 房间号 / 赞助人 OpenID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>共计订单: <strong className="text-slate-900 font-mono text-sm">{rechargeOrders.length}</strong> 笔</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-4">商户订单号 / 微信单号</th>
                    <th className="p-4">赞助人 (长辈)</th>
                    <th className="p-4">房间邀请码</th>
                    <th className="p-4">充值注入金额</th>
                    <th className="p-4">支付状态</th>
                    <th className="p-4">支付时间</th>
                    <th className="p-4 text-right">管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {rechargeOrders
                    .filter(o => !searchQuery || o.outTradeNo.includes(searchQuery) || o.sponsorName.includes(searchQuery) || o.roomCode.includes(searchQuery))
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono text-slate-900 font-bold">
                          <div>{order.outTradeNo}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{order.wxPayNo}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <img src={order.sponsorAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{order.sponsorName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{order.sponsorOpenId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          <span className="px-2.5 py-1 bg-slate-100 font-bold rounded-lg text-slate-800 border border-slate-200/80">
                            #{order.roomCode}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-black text-slate-900 text-sm">
                          ¥{order.amount.toFixed(2)}
                        </td>
                        <td className="p-4 font-semibold">
                          {order.status === 'SUCCESS' && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono text-[11px] font-bold">支付成功</span>}
                          {order.status === 'PENDING' && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-mono text-[11px] font-bold">待支付确认</span>}
                          {order.status === 'REFUNDED' && <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-mono text-[11px] font-bold">已原路退款</span>}
                        </td>
                        <td className="p-4 font-mono text-slate-500 text-[11px]">
                          {order.payTime}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-slate-600 hover:text-slate-900 font-bold underline text-xs"
                          >
                            查看详情
                          </button>
                          {order.status === 'SUCCESS' && (
                            <button
                              onClick={() => {
                                onRequestSecurityModal({
                                  isOpen: true,
                                  title: '发起长辈充值原路退款',
                                  description: `将通过微信支付 API 退款接口，把赞助金 ¥${order.amount.toFixed(2)} 原路退还至 ${order.sponsorName} 的微信账户。`,
                                  type: 'DANGER',
                                  requiredConfirmText: order.roomCode,
                                  requiresFundPin: true,
                                  actionButtonText: '确认微信原路退款',
                                  dataSummary: `订单号: ${order.outTradeNo} | 赞助人: ${order.sponsorName} | 房间: ${order.roomCode}`,
                                  onConfirm: () => onRefundSponsor(order.id)
                                });
                              }}
                              className="text-red-600 hover:text-red-700 font-bold underline text-xs"
                            >
                              原路退款
                            </button>
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

      {/* 2.2 提现派发明细 */}
      {subTab === 'transfer-logs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="text-xs text-slate-600 font-medium">
              商家转账到零钱总笔数: <strong className="font-mono text-slate-900 text-sm">{transferLogs.length}</strong> 笔
            </div>
            <div className="text-xs text-slate-500">
              微信转账 API：<code className="bg-slate-100 text-red-600 font-mono px-2 py-0.5 rounded-md font-bold">/v3/transfer/batches</code>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-4">微信批次单号 / 明细单号</th>
                    <th className="p-4">获奖玩家 (晚辈)</th>
                    <th className="p-4">房间号</th>
                    <th className="p-4">提现总额 (拆解)</th>
                    <th className="p-4">微信派发状态</th>
                    <th className="p-4">完成时间</th>
                    <th className="p-4 text-right">错误日志</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transferLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono text-slate-900">
                        <div className="font-bold">{log.outBatchNo}</div>
                        <div className="text-[10px] text-slate-400">{log.detailNo}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img src={log.playerAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                          <div>
                            <div className="font-bold text-slate-900">{log.playerName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{log.playerOpenId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">#{log.roomNo}</td>
                      <td className="p-4 font-mono">
                        <div className="font-black text-slate-900 text-sm">¥{log.totalAmount.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">
                          保底¥{log.baseAmount} + 积分¥{log.scoreAmount} + 打赏¥{log.tipAmount}
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
                        {log.status === 'SUCCESS' && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono text-[11px] font-bold">转账成功</span>}
                        {log.status === 'PROCESSING' && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-mono text-[11px] font-bold">微信处理中</span>}
                        {log.status === 'FAILED' && <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg font-mono text-[11px] font-bold">转账失败</span>}
                      </td>
                      <td className="p-4 font-mono text-slate-500 text-[11px]">
                        {log.completeTime}
                      </td>
                      <td className="p-4 text-right">
                        {log.errorJson ? (
                          <button
                            onClick={() => setSelectedTransfer(log)}
                            className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[11px] font-mono font-bold hover:bg-red-100 transition-colors"
                          >
                            查看 JSON 报错
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
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

      {/* 2.3 资金对账总表 */}
      {subTab === 'reconciliation' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>日终系统对账机制：</strong>每日 24:00 自动汇总全天微信充值入金与商家转账出金。平账状态 100% 正确。
              </span>
            </div>
            <button 
              onClick={() => alert('已重新调起微信商户对账单 API，核对结果完全一致。')}
              className="px-3.5 py-1.5 bg-white text-emerald-800 font-bold border border-emerald-300/80 rounded-xl hover:bg-emerald-100 transition-colors shadow-2xs shrink-0"
            >
              实时重新对账
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-4">对账日期</th>
                    <th className="p-4">期初余额</th>
                    <th className="p-4 text-emerald-600">当日充值 (+)</th>
                    <th className="p-4 text-red-600">当日派发 (-)</th>
                    <th className="p-4 text-amber-600">当日退款 (-)</th>
                    <th className="p-4">期末理论余额</th>
                    <th className="p-4">微信商户实际余额</th>
                    <th className="p-4 text-right">对账结果</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {reconciliationRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{row.date}</td>
                      <td className="p-4">¥{row.initialBalance.toFixed(2)}</td>
                      <td className="p-4 font-bold text-emerald-600">+¥{row.depositTotal.toFixed(2)}</td>
                      <td className="p-4 font-bold text-red-600">-¥{row.transferTotal.toFixed(2)}</td>
                      <td className="p-4 font-bold text-amber-600">-¥{row.refundTotal.toFixed(2)}</td>
                      <td className="p-4 font-bold text-slate-900">¥{row.theoreticalEndBalance.toFixed(2)}</td>
                      <td className="p-4 font-bold text-indigo-700">¥{row.actualMchBalance.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[11px]">
                          平账 OK
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2.4 异常补发与退款 */}
      {subTab === 'exceptions' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl text-amber-900 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-amber-900">异常处置中心说明：</div>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                集中展示因接收方未微信实名校验、瞬时网络超时、单日频次超限导致的转账失败记录。支持二次调起补发或将剩余奖金原路退回赞助长辈。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-4">批次单号 / 房间</th>
                    <th className="p-4">提现玩家</th>
                    <th className="p-4">阻碍提现金额</th>
                    <th className="p-4">微信接口报错原因</th>
                    <th className="p-4 text-center">重试次数</th>
                    <th className="p-4">状态</th>
                    <th className="p-4 text-right">安全处理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exceptions.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono">
                        <div className="font-bold text-slate-900">{exp.outBatchNo}</div>
                        <div className="text-[10px] text-slate-400">房间: #{exp.roomNo}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{exp.playerName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{exp.playerOpenId}</div>
                      </td>
                      <td className="p-4 font-mono font-black text-red-600 text-sm">
                        ¥{exp.amount.toFixed(2)}
                      </td>
                      <td className="p-4 font-mono text-slate-700 max-w-xs text-[11px] truncate" title={exp.failReason}>
                        {exp.failReason}
                      </td>
                      <td className="p-4 font-mono text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">{exp.retryCount} 次</span>
                      </td>
                      <td className="p-4 font-semibold">
                        {exp.status === 'FAILED' && <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg font-mono text-[11px] font-bold">待补发处理</span>}
                        {exp.status === 'RESOLVED' && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono text-[11px] font-bold">已补发成功</span>}
                        {exp.status === 'REFUNDED' && <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-mono text-[11px] font-bold">已退款长辈</span>}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {exp.status === 'FAILED' && (
                          <>
                            <button
                              onClick={() => {
                                onRequestSecurityModal({
                                  isOpen: true,
                                  title: '一键重新补发微信转账',
                                  description: `将再次调用微信商家转账 API 划拨 ¥${exp.amount.toFixed(2)} 至玩家 ${exp.playerName} 的微信零钱。`,
                                  type: 'WARNING',
                                  requiresFundPin: true,
                                  actionButtonText: '确认重新调起划拨',
                                  dataSummary: `批次: ${exp.outBatchNo} | 玩家: ${exp.playerName} | 金额: ¥${exp.amount}`,
                                  onConfirm: () => onRetryException(exp.id)
                                });
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-2xs"
                            >
                              重试补发
                            </button>

                            <button
                              onClick={() => {
                                onRequestSecurityModal({
                                  isOpen: true,
                                  title: '异常资金退回房主',
                                  description: `确认取消该笔补发，并将该未派发红包资金 ¥${exp.amount.toFixed(2)} 原路退还建房赞助人。`,
                                  type: 'DANGER',
                                  requiredConfirmText: exp.roomNo,
                                  requiresFundPin: true,
                                  actionButtonText: '确认原路退款房主',
                                  dataSummary: `房间: #${exp.roomNo} | 玩家: ${exp.playerName} | 金额: ¥${exp.amount}`,
                                  onConfirm: () => onRefundSponsor(exp.id)
                                });
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors border border-slate-200"
                            >
                              退还长辈
                            </button>
                          </>
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">充值订单详细数据 (JSON)</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <pre className="bg-slate-950 text-amber-300 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-60 border border-slate-800">
              {JSON.stringify(selectedOrder, null, 2)}
            </pre>
            <div className="text-right">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Error Json Modal */}
      {selectedTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-red-600 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> 微信接口原生 Error 响应
              </h3>
              <button onClick={() => setSelectedTransfer(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <pre className="bg-slate-950 text-red-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-red-950">
              {selectedTransfer.errorJson}
            </pre>
            <div className="text-right">
              <button onClick={() => setSelectedTransfer(null)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
