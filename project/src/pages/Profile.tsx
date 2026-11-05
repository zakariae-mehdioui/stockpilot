import { useState, type FormEvent } from 'react';
import { User as UserIcon, Mail, Calendar, Shield, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.email?.split('@')[0] ?? 'Admin');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('Inventory Manager');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = (user?.email ?? 'AD').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile summary */}
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white">
              {initials}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">{name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-3">
              <Badge className="bg-blue-50 text-blue-700 ring-blue-700/20">
                <Shield className="h-3 w-3" /> Administrator
              </Badge>
            </div>
            <div className="mt-6 w-full space-y-3 border-t border-slate-100 pt-4 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <UserIcon className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{title}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  Joined {user?.created_at ? formatDate(user.created_at) : 'Recently'}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardHeader title="Personal Information" subtitle="Update your account details" />
          <CardBody>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Job Title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  hint="Email cannot be changed here"
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
                {saved && <span className="text-sm text-emerald-600">Saved successfully</span>}
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
