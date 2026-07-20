"use client";

import { Settings as SettingsIcon, Save, Webhook, Database, Clock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isTestingDiscord, setIsTestingDiscord] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [channelId, setChannelId] = useState("123456789012345678");
  const [timezone, setTimezone] = useState("UTC");

  const handleTestDiscord = async () => {
    setIsTestingDiscord(true);
    // Mock API call
    setTimeout(() => {
      setIsTestingDiscord(false);
      toast.success("Discord connection successful!");
    }, 1000);
  };

  const handleTestDb = async () => {
    setIsTestingDb(true);
    // Mock API call
    setTimeout(() => {
      setIsTestingDb(false);
      toast.success("Database connection successful!");
    }, 1000);
  };

  const handleSave = () => {
    if (!channelId || channelId.length < 17) {
      toast.error("Invalid Channel ID");
      return;
    }
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <SettingsIcon className="text-slate-400" size={24} />
            System Settings
          </h1>
          <p className="text-sm text-white/50 mt-1">Configure global dashboard and bot integrations.</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={16} /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Discord Config */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-400">
              <Webhook size={18} /> Discord Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Bot Token</label>
              <div className="flex gap-2">
                <Input type="password" value="*************************" readOnly className="opacity-50 flex-1" />
                <Button variant="secondary" onClick={handleTestDiscord} disabled={isTestingDiscord}>
                  {isTestingDiscord ? <RefreshCw className="animate-spin" size={16} /> : "Test Connection"}
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Signal Channel ID</label>
              <Input 
                type="text" 
                value={channelId} 
                onChange={(e) => setChannelId(e.target.value)}
                className={!channelId || channelId.length < 17 ? "border-red-500/50 focus-visible:border-red-500/50 focus-visible:ring-red-500/50" : ""}
              />
              {(!channelId || channelId.length < 17) && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle size={12} /> Channel ID must be a valid Discord snowflake.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Config */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <Database size={18} /> Database Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">MongoDB URI</label>
              <div className="flex gap-2">
                <Input type="password" value="mongodb+srv://..." readOnly className="opacity-50 flex-1" />
                <Button variant="secondary" onClick={handleTestDb} disabled={isTestingDb}>
                  {isTestingDb ? <RefreshCw className="animate-spin" size={16} /> : "Test Connection"}
                </Button>
              </div>
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> Connected successfully
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Clock size={18} /> Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Default Timezone</label>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 transition-all appearance-none"
              >
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
