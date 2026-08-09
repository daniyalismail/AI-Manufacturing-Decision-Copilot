import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowRight, Loader2, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('sarah.jenkins@mindmarket.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-12 py-12 animate-in fade-in duration-500">
      {/* Left Column: Hero Copy */}
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fresh-grass/20 border border-fresh-grass/40 text-[13px] font-bold text-pure-ink">
          <Sparkles className="w-4 h-4 text-ink-black" />
          <span>Enterprise AI Decision Support Platform</span>
        </div>

        <h1 className="text-[52px] sm:text-[68px] md:text-[80px] font-bold tracking-tight text-ink-black leading-[1.05]">
          Procure <br className="hidden sm:block" />
          <span className="text-stone-gray font-normal">Smarter.</span>
        </h1>

        <p className="text-[18px] md:text-[22px] text-ink-black/80 max-w-lg leading-relaxed font-normal">
          The AI decision engine that ingests unstructured RFP documents, evaluates constraints, and generates audit-ready supplier recommendations.
        </p>

        <div className="space-y-3 pt-2 text-[15px] font-medium text-ink-black">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-fresh-grass shrink-0" />
            <span>Deterministic requirement-vs-quote constraint checking</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-fresh-grass shrink-0" />
            <span>Verifiable source citations directly to original PDF pages</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-fresh-grass shrink-0" />
            <span>Interactive what-if scenario weight simulation</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 w-full max-w-md">
        <Card className="space-y-6 bg-pure-white border border-hairline-mist card-shadow p-8 md:p-10">
          <div className="space-y-2">
            <h2 className="text-[28px] font-bold text-ink-black tracking-tight">
              Sign in to Workspace
            </h2>
            <p className="text-[14px] text-stone-gray font-medium">
              Enter credentials to access procurement project workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && <p className="text-[13px] text-coral-pop font-medium">{error}</p>}

            <Button
              type="submit"
              variant="action"
              size="lg"
              disabled={loading}
              className="w-full justify-between group shadow-md"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Copilot'}</span>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-pure-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 text-pure-white" />
                </div>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-hairline-mist text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('sarah.jenkins@mindmarket.com');
                setPassword('demo1234');
              }}
              className="text-[13px] text-stone-gray hover:text-ink-black underline cursor-pointer"
            >
              Autofill Demo Credentials
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
