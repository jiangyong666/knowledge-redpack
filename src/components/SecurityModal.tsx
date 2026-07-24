import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, KeyRound, X, CheckCircle, Info } from 'lucide-react';
import { SecurityModalConfig } from '../types';

interface SecurityModalProps {
  config: SecurityModalConfig;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ config, onClose }) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [fundPinInput, setFundPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setConfirmInput('');
    setFundPinInput('');
    setErrorMsg('');
  }, [config.isOpen]);

  if (!config.isOpen) return null;

  const handleConfirm = () => {
    // Validate text match if specified
    if (config.requiredConfirmText && confirmInput.trim() !== config.requiredConfirmText) {
      setErrorMsg(`请输入精确的确认文字 “${config.requiredConfirmText}”`);
      return;
    }

    // Validate Fund PIN if required (default test PIN is 888888)
    if (config.requiresFundPin && fundPinInput !== '888888') {
      setErrorMsg('二级资金风控密码不正确 (测试验证码: 888888)');
      return;
    }

    config.onConfirm();
    onClose();
  };

  const isDanger = config.type === 'DANGER';
  const isWarning = config.type === 'WARNING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border ${isDanger ? 'border-red-200' : 'border-amber-200'}`}>
        
        {/* Modal Header */}
        <div className={`p-5 flex items-start justify-between border-b ${isDanger ? 'bg-red-50/80 border-red-100 text-red-900' : 'bg-amber-50/80 border-amber-100 text-amber-900'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDanger ? 'bg-red-500 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'}`}>
              {isDanger ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight flex items-center gap-2">
                {config.title}
                <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${isDanger ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isDanger ? '高风险资金操作' : '安全二次确认'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">请谨慎核对操作风险，避免手滑造成经济损失</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {config.dataSummary && (
            <div className="bg-slate-50 p-3.5 rounded-xl text-xs font-mono text-slate-700 border border-slate-200 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-1">📋 操作对象摘要：</span>
              {config.dataSummary}
            </div>
          )}

          <div className="text-sm text-slate-700 leading-relaxed font-sans">
            {config.description}
          </div>

          {/* Condition 1: Requires typing exact confirmation string */}
          {config.requiredConfirmText && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-800">
                防误触安全校验：请输入指定文字 <span className="text-red-600 font-mono text-sm underline select-all">{config.requiredConfirmText}</span>
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => { setConfirmInput(e.target.value); setErrorMsg(''); }}
                placeholder={`请输入 ${config.requiredConfirmText}`}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          )}

          {/* Condition 2: Requires Fund Secondary PIN */}
          {config.requiresFundPin && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                二级资金风控密码（默认测试密码: <code className="bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold">888888</code>）
              </label>
              <input
                type="password"
                maxLength={6}
                value={fundPinInput}
                onChange={(e) => { setFundPinInput(e.target.value); setErrorMsg(''); }}
                placeholder="请输入 6 位资金风控密码"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            取消操作
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-1.5 ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-red-200' 
                : 'bg-amber-600 hover:bg-amber-700 active:scale-95 shadow-amber-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {config.actionButtonText}
          </button>
        </div>

      </div>
    </div>
  );
};
