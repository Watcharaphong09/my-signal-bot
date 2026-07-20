"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function CreateSignalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    providerId: "",
    providerName: "",
    asset: "XAUUSD",
    signalType: "Scalping",
    action: "BUY",
    entry: "",
    sl: "",
    tp1: "",
    tp2: "",
    fullTp: ""
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const payload = {
      ...formData,
      entry: parseFloat(formData.entry),
      sl: parseFloat(formData.sl),
      tp1: parseFloat(formData.tp1),
      tp2: formData.tp2 ? parseFloat(formData.tp2) : undefined,
      fullTp: formData.fullTp ? parseFloat(formData.fullTp) : undefined,
    };

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create signal");
      } else {
        setSuccess(`Signal created successfully! Trade ID: ${data.tradeId}`);
        // Optional: clear form
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Create New Signal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Provider ID</label>
                <input required type="text" name="providerId" value={formData.providerId} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" placeholder="Discord User ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Provider Name</label>
                <input required type="text" name="providerName" value={formData.providerName} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" placeholder="Username" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Asset</label>
                <select name="asset" value={formData.asset} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white">
                  <option value="XAUUSD">XAUUSD</option>
                  <option value="BTCUSD">BTCUSD</option>
                  <option value="EURUSD">EURUSD</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="US30">US30</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                <select name="signalType" value={formData.signalType} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white">
                  <option value="Scalping">Scalping</option>
                  <option value="Run">Run</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Action</label>
                <select name="action" value={formData.action} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white">
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Entry Price</label>
                <input required type="number" step="any" name="entry" value={formData.entry} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Stop Loss (SL)</label>
                <input required type="number" step="any" name="sl" value={formData.sl} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">TP 1</label>
                <input required type="number" step="any" name="tp1" value={formData.tp1} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">TP 2 (Optional)</label>
                <input type="number" step="any" name="tp2" value={formData.tp2} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full TP (Optional)</label>
                <input type="number" step="any" name="fullTp" value={formData.fullTp} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-4"
            >
              {loading ? "Sending Signal..." : "Send Signal"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-white">Discord Preview</h2>
          <div className="bg-[#313338] p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div>
                <p className="text-white text-sm font-medium">Signal Bot <span className="bg-[#5865F2] text-[10px] px-1 rounded text-white ml-1">BOT</span></p>
                <p className="text-xs text-gray-400">Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            <p className="text-[#dbdee1] mb-2">⚡ สัญญาณเทรดใหม่มาแล้วครับ!</p>
            
            <div className={`border-l-4 p-3 rounded bg-[#2b2d31] ${formData.action === 'BUY' ? 'border-[#00ff9f]' : 'border-[#ff3333]'}`}>
              <h3 className="text-white font-bold mb-2">
                ⚡ SIGNAL ALERT: {formData.asset} {formData.action} ({formData.signalType})
              </h3>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-400 font-semibold text-xs">🎯 Entry</p>
                  <p className="text-white font-bold">{formData.entry || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold text-xs">🛑 Stop Loss</p>
                  <p className="text-white font-bold">{formData.sl || '-'}</p>
                </div>
                <div></div>
                
                <div>
                  <p className="text-gray-400 font-semibold text-xs">🚀 TP1</p>
                  <p className="text-white font-bold">{formData.tp1 || '-'}</p>
                </div>
                {formData.tp2 && (
                  <div>
                    <p className="text-gray-400 font-semibold text-xs">🚀 TP2</p>
                    <p className="text-white font-bold">{formData.tp2}</p>
                  </div>
                )}
                {formData.fullTp && (
                  <div>
                    <p className="text-gray-400 font-semibold text-xs">🌕 Full TP</p>
                    <p className="text-white font-bold">{formData.fullTp}</p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-4">VIP Trade • การลงทุนมีความเสี่ยง</p>
            </div>
            
            {/* Mock Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="bg-[#248046] text-white text-sm px-4 py-1.5 rounded hover:bg-[#1a6334]">🎯 TP1</button>
              {formData.tp2 && <button className="bg-[#248046] text-white text-sm px-4 py-1.5 rounded hover:bg-[#1a6334]">🎯 TP2</button>}
              {formData.fullTp && <button className="bg-[#248046] text-white text-sm px-4 py-1.5 rounded hover:bg-[#1a6334]">🚀 Full TP</button>}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button className="bg-[#da373c] text-white text-sm px-4 py-1.5 rounded hover:bg-[#a1282c]">🛑 Hit SL</button>
              <button className="bg-[#4e5058] text-white text-sm px-4 py-1.5 rounded hover:bg-[#404249]">🔔 แจ้ง BE</button>
              <button className="bg-[#4e5058] text-white text-sm px-4 py-1.5 rounded hover:bg-[#404249]">🛡️ BE</button>
              <button className="bg-[#5865F2] text-white text-sm px-4 py-1.5 rounded hover:bg-[#4752c4]">⏹️ Close</button>
              <button className="bg-[#da373c] text-white text-sm px-4 py-1.5 rounded hover:bg-[#a1282c]">❌ ยกเลิกออเดอร์</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
