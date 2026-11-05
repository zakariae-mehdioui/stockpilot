import { useState, type FormEvent } from 'react';
import { Bell, Globe, Moon, Monitor, Database, Shield, Check } from 'lucide-react';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-slate-900' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    lowStock: true,
    newOrders: true,
  });
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('usd');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure your workspace, notifications, and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <Card>
          <CardHeader title="General" subtitle="Workspace defaults" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </Select>
              <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="usd">USD — US Dollar</option>
                <option value="eur">EUR — Euro</option>
                <option value="gbp">GBP — British Pound</option>
                <option value="jpy">JPY — Japanese Yen</option>
              </Select>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Globe },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      theme === value
                        ? 'border-slate-900 bg-slate-50 text-slate-900'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader title="Notifications" subtitle="Choose what you want to be notified about" />
          <CardBody className="divide-y divide-slate-50">
            {[
              { key: 'email' as const, label: 'Email notifications', desc: 'Receive updates via email', icon: Bell },
              { key: 'push' as const, label: 'Push notifications', desc: 'Get alerts on your devices', icon: Bell },
              { key: 'lowStock' as const, label: 'Low stock alerts', desc: 'Notify when items drop below threshold', icon: Database },
              { key: 'newOrders' as const, label: 'New orders', desc: 'Notify on every new order', icon: Shield },
            ].map(({ key, label, desc, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={notifications[key]}
                  onChange={(v) => setNotifications({ ...notifications, [key]: v })}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader title="Security" subtitle="Keep your account secure" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <div />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Input label="Confirm Password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Two-factor authentication</p>
                <p className="text-xs text-slate-500">Add an extra layer of security</p>
              </div>
              <Toggle checked={false} onChange={() => {}} />
            </div>
          </CardBody>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit">
            <Check className="h-4 w-4" /> Save Settings
          </Button>
          {saved && <span className="text-sm text-emerald-600">Settings saved successfully</span>}
        </div>
      </form>
    </div>
  );
}
