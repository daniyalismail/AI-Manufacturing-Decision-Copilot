import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { User, ShieldCheck, Bell, Cpu, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { userProfile, updateProfile } = useAppStore();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [company, setCompany] = useState(userProfile.company);
  const [confidenceThreshold, setConfidenceThreshold] = useState('85');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, role, company });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-[40px] sm:text-[52px] font-bold tracking-tight text-ink-black leading-tight">
          System Settings
        </h1>
        <p className="text-[16px] text-stone-gray font-medium mt-1">
          Manage user profile, AI decision thresholds, and compliance parameters.
        </p>
      </div>

      <Card className="p-8 md:p-10 space-y-8 bg-pure-white border border-hairline-mist card-shadow">
        <form onSubmit={handleSave} className="space-y-8">
          {/* User Profile Section */}
          <div className="space-y-4">
            <h3 className="text-[20px] font-bold text-ink-black flex items-center gap-2">
              <User className="w-5 h-5 text-sky-pop" />
              User Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Work Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Role Title"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Input
                label="Organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          {/* AI Decision Engine Settings */}
          <div className="pt-6 border-t border-hairline-mist space-y-4">
            <h3 className="text-[20px] font-bold text-ink-black flex items-center gap-2">
              <Cpu className="w-5 h-5 text-fresh-grass" />
              AI Decision Engine Controls
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[14px] font-medium text-ink-black/90">
                  Minimum Citation Confidence Threshold ({confidenceThreshold}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(e.target.value)}
                  className="w-full h-2 bg-sandstone rounded-lg appearance-none cursor-pointer accent-ink-black"
                />
                <p className="text-[12px] text-stone-gray">
                  Extracts with confidence below this score will be flagged for human audit review.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-hairline-mist flex justify-between items-center">
            {saved ? (
              <span className="text-[14px] font-bold text-fresh-grass flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Settings saved successfully!
              </span>
            ) : (
              <span className="text-[13px] text-stone-gray font-medium">
                Changes persist locally in your session.
              </span>
            )}

            <Button type="submit" variant="action" className="gap-2">
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
