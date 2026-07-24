import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  ShieldCheck, 
  Users, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  KeyRound, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { 
  SettingsSubTab, 
  WechatPayConfig, 
  RiskRulesConfig, 
  AdminUser, 
  AdminLog, 
  SecurityModalConfig 
} from '../../types';

interface SettingsModuleProps {
  subTab: SettingsSubTab;
  onSelectSubTab: (sub: SettingsSubTab) => void;
  wechatPayConfig: WechatPayConfig;
  riskRulesConfig: RiskRulesConfig;
  admins: AdminUser[];
  adminLogs: AdminLog[];
  onUpdateWechatPay: (config: Partial<WechatPayConfig>) => void;
  onUpdateRiskRules: (config: Partial<RiskRulesConfig>) => void;
  onRequestSecurityModal: (config: SecurityModalConfig) => void;
  isCompact: boolean;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  subTab,
  onSelectSubTab,
  wechatPayConfig,
  riskRulesConfig,
  admins,
  adminLogs,
  onUpdateWechatPay,
  onUpdateRiskRules,
  onRequestSecurityModal,
  isCompact
}) => {
  // Local form states
  const [showApiKey, setShowApiKey] = useState(false);
  const [appIdInput, setAppIdInput] = useState(wechatPayConfig.appId);
  const [mchIdInput, setMchIdInput] = useState(wechatPayConfig.mchId);
  const [v3KeyInput, setV3KeyInput] = useState(wechatPayConfig.apiV3Key);

  const [dailyLimit, setDailyLimit] = useState(riskRulesConfig.singleUserDailyMaxPayout);
  const [autoTransferThreshold, setAutoTransferThreshold] = useState(riskRulesConfig.autoTransferNoAuditMax);
  const [minAnswerMs, setMinAnswerMs] = useState(riskRulesConfig.minAnswerTimeMs);

  const [saveSuccess, setSaveSuccess] = useState('');

  const tabs = [
    { id: 'wechat-pay' as SettingsSubTab, label: '6.1 微信支付/商户配置', icon: Key },
    { id: 'risk-rules' as SettingsSubTab, label: '6.2 业务风控与规则配置', icon: ShieldCheck },
    { id: 'admins' as SettingsSubTab, label: '6.3 管理员与权限配置', icon: Users },
  ];

  const handleSaveWechatConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestSecurityModal({
      isOpen: true,
      title: '更新微信商户号 API v3 核心密钥',
      description: '修改微信商户号及 API v3 密钥将直接影响全局所有充值订单与提现划拨接口调用。请确认填写的商户号与证书序列号完全对应。',
      type: 'DANGER',
      requiresFundPin: true,
      actionButtonText: '确认更新微信接口配置',
      onConfirm: () => {
        onUpdateWechatPay({ appId: appIdInput, mchId: mchIdInput, apiV3Key: v3KeyInput });
        setSaveSuccess('微信支付及商家转账商户配置已更新并生效！');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    });
  };

  const handleSaveRiskRules = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRiskRules({
      singleUserDailyMaxPayout: Number(dailyLimit),
      autoTransferNoAuditMax: Number(autoTransferThreshold),
      minAnswerTimeMs: Number(minAnswerMs)
    });
    setSaveSuccess('业务风控拦截规则配置已成功保存！');
    setTimeout(() => setSaveSuccess(''), 3000);
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
            </button>
          );
        })}
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* 6.1 微信支付/商户配置 */}
      {subTab === 'wechat-pay' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  微信支付与商家转账到零钱商户凭证
                </h3>
                <p className="text-xs text-slate-500 mt-1">用于驱动 Applet 的微信 JSAPI 充值下单与 `/v3/transfer/batches` 零钱派发 API。</p>
              </div>
              <button
                type="button"
                onClick={() => alert('微信 API 连通性测试成功！响应 HTTP 200 OK，证书序列号匹配良好。')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-300 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>测试微信接口连通性</span>
              </button>
            </div>

            <form onSubmit={handleSaveWechatConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">小程序 AppID</label>
                  <input
                    type="text"
                    required
                    value={appIdInput}
                    onChange={(e) => setAppIdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">微信商户号 (MCH_ID)</label>
                  <input
                    type="text"
                    required
                    value={mchIdInput}
                    onChange={(e) => setMchIdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">API v3 密钥 (32 位字符串)</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    required
                    value={v3KeyInput}
                    onChange={(e) => setV3KeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs pr-10 focus:ring-2 focus:ring-amber-500 tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">商户 API 证书序列号 (Serial No)</label>
                  <input
                    type="text"
                    readOnly
                    value={wechatPayConfig.certSerialNo}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-xs text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">私钥证书文件 (apiclient_key.pem)</label>
                  <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-xs text-emerald-800 flex items-center justify-between">
                    <span>{wechatPayConfig.isCertUploaded ? '✓ 证书已上传托管 (2027年到期)' : '✕ 证书未托管'}</span>
                    <button type="button" onClick={() => alert('已调起文件更新组件，覆盖私钥证书')} className="text-emerald-700 underline font-bold">更新证书</button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>保存微信商户号配置</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6.2 业务风控与规则配置 */}
      {subTab === 'risk-rules' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                防刷量与高风险派发现金限制阈值
              </h3>
              <p className="text-xs text-slate-500 mt-1">设置后，超额提现或秒刷作弊请求将自动进入异常补发人工审核队列，保障资金池安全。</p>
            </div>

            <form onSubmit={handleSaveRiskRules} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <label className="block font-bold text-slate-900">单人单日最高领红包累计上限 (元)</label>
                  <p className="text-[11px] text-slate-500">单个微信 OpenID 单日赢得的提现总额超过该值后，当日暂停继续发奖。</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold">¥</span>
                    <input
                      type="number"
                      required
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-xs font-bold text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <label className="block font-bold text-slate-900">微信免人工审核自动转账上限 (元)</label>
                  <p className="text-[11px] text-slate-500">单笔提现大于此金额时，微信接口将暂停自动划拨，需管理员手打审核。</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold">¥</span>
                    <input
                      type="number"
                      required
                      value={autoTransferThreshold}
                      onChange={(e) => setAutoTransferThreshold(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-xs font-bold text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <label className="block font-bold text-slate-900">答题极速作弊拦截阈值 (毫秒)</label>
                  <p className="text-[11px] text-slate-500">单题作答提交时间低于此阈值判为连点器作弊挂，当题记 0 分。</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      value={minAnswerMs}
                      onChange={(e) => setMinAnswerMs(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-xs font-bold text-slate-900 bg-white"
                    />
                    <span className="font-mono text-slate-500">ms</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <label className="block font-bold text-slate-900">二级资金风控二次 PIN 密码</label>
                  <p className="text-[11px] text-slate-500">进行强制解散房间、高额补发、删除题库时触发验证。</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value="888888"
                      className="w-full px-3 py-2 border rounded-lg font-mono text-xs font-bold text-slate-900 bg-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => alert('资金风控 PIN 码修改指令已发至系统二级邮箱。')}
                      className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs shrink-0"
                    >
                      修改 PIN 码
                    </button>
                  </div>
                </div>

              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>保存业务风控拦截规则</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6.3 管理员与权限配置 */}
      {subTab === 'admins' && (
        <div className="space-y-6">
          
          {/* Admin Accounts Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">后台管理员账号与二级资金权限</h3>
                <p className="text-xs text-slate-500 mt-0.5">控制各运维与运营角色的敏感资金划拨与审题权限。</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">管理员账号</th>
                    <th className="p-3.5">真实姓名</th>
                    <th className="p-3.5">角色权限等级</th>
                    <th className="p-3.5">资金操作双因子 (2FA)</th>
                    <th className="p-3.5">最后登录 IP</th>
                    <th className="p-3.5 text-right">账号管控</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {admins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{adm.username}</td>
                      <td className="p-3.5 font-semibold text-slate-800">{adm.realName}</td>
                      <td className="p-3.5 font-semibold">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono text-[11px]">
                          {adm.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold">
                        {adm.hasFundPermission ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px]">已开通资金直派</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono text-[11px]">仅基础内容管理</span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">{adm.lastLoginIp}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => alert(`已为管理员 ${adm.username} 发送重置密钥邮件。`)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs"
                        >
                          重置密码
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Audit Log */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  高风险资金与题库操作审计日志 (Audit Log)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">不可篡改的操作记录日志，记载人工补发、解散房间及风控改动。</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">只读不可删除</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">日志 ID</th>
                    <th className="p-3.5">操作管理员</th>
                    <th className="p-3.5">高风险操作行为</th>
                    <th className="p-3.5">操作对象与参数</th>
                    <th className="p-3.5">IP 地址</th>
                    <th className="p-3.5 text-right">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {adminLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{log.id}</td>
                      <td className="p-3.5 font-bold text-indigo-700">{log.operator}</td>
                      <td className="p-3.5 font-bold text-red-600">{log.action}</td>
                      <td className="p-3.5 text-slate-800">{log.target}</td>
                      <td className="p-3.5 text-slate-500">{log.ip}</td>
                      <td className="p-3.5 text-slate-400 text-right">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
