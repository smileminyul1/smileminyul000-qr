/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Globe, Hash, Download, ArrowRight, Share2, Copy, Check } from 'lucide-react';

type Mode = 'website' | 'text';

export default function App() {
  const [mode, setMode] = useState<Mode>('website');
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-pulse-${mode}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyValue = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getQRValue = () => {
    if (!value) return '';
    if (mode === 'website') {
      return value.startsWith('http') ? value : `https://${value}`;
    }
    return value; // For 'text' mode, just returns the raw string/number
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-black selection:text-white p-6 md:p-12 flex flex-col items-center">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-black text-white rounded-full text-xs font-medium tracking-tight">
          <QrCode size={14} />
          <span>V1.0 정식 출시</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-4">
          QR PULSE
        </h1>
        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed text-sm md:text-base">
          웹사이트 주소나 숫자를 입력하여 고해상도 QR 코드를 단 몇 초 만에 생성하세요.
        </p>
      </motion.header>

      <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-start justify-center">
        {/* Controls Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-[400px] space-y-8"
        >
          {/* Mode Selector */}
          <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm flex">
            <button
              onClick={() => { setMode('website'); setValue(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm ${
                mode === 'website' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              <Globe size={16} />
              웹사이트
            </button>
            <button
              onClick={() => { setMode('text'); setValue(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm ${
                mode === 'text' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              <Hash size={16} />
              숫자/텍스트
            </button>
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">
                {mode === 'website' ? '연결할 URL 주소' : '변환할 숫자 또는 텍스트'}
              </label>
              <div className="relative">
                <input
                  type={mode === 'website' ? 'url' : 'text'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === 'website' ? 'example.com' : '숫자 또는 내용을 입력하세요'}
                  className="w-full bg-white border border-gray-200 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-lg font-medium placeholder:text-gray-300"
                />
                <button 
                  onClick={handleCopyValue}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-black transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-500">
              <ArrowRight size={14} className="shrink-0" />
              <p className="line-clamp-1 break-all italic font-mono text-xs">
                {getQRValue() || '입력을 기다리는 중...'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDownload}
              disabled={!value}
              className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-xl shadow-black/10"
            >
              <Download size={20} />
              다운로드
            </button>
            <button
              disabled={!value}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-4 rounded-2xl font-bold tracking-tight hover:bg-gray-50 transition-all disabled:opacity-30"
            >
              <Share2 size={20} />
              공유하기
            </button>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-[48px] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-white border border-gray-100 p-12 rounded-[40px] shadow-2xl flex flex-col items-center justify-center min-w-[320px] min-h-[320px]">
            <AnimatePresence mode="wait">
              {value ? (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="p-3 bg-white border-2 border-black/5 rounded-3xl">
                    <QRCodeCanvas
                      ref={qrRef}
                      value={getQRValue()}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                      스캔 시 {mode === 'website' ? '웹사이트 이동' : '텍스트 표시'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center gap-4 py-8"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-200">
                    <QrCode size={40} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium text-sm max-w-[150px]">
                    {mode === 'website' ? '웹사이트 주소' : '숫자나 텍스트'}를 입력하시면 QR 코드가 생성됩니다.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <footer className="mt-auto pt-24 pb-8 flex flex-col items-center gap-4">
        <div className="flex gap-8 text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase">
          <span>H-레벨 오류 정정</span>
          <span>벡터 정밀도</span>
          <span>오픈 표준</span>
        </div>
        <p className="text-gray-300 text-[10px] lowercase font-mono">
          © {new Date().getFullYear()} QR PULSE // 시스템 준비됨
        </p>
      </footer>
    </div>
  );
}
