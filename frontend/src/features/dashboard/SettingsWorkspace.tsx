import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Monitor, Moon, Shield, Sliders } from 'lucide-react';
import { GlassPanel } from '@/components/common/GlassPanel';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/utils/cn';
import { staggerContainer, fadeUp } from '@/utils/motion';

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function SettingsWorkspace() {
  const [toggles, setToggles] = useState<ToggleSetting[]>([
    { id: 'live-logs', label: 'Live Mission Logs', description: 'Stream real-time telemetry to bottom dock', enabled: true },
    { id: 'ai-insights', label: 'AI Insights Panel', description: 'Show neural inference recommendations', enabled: true },
    { id: 'animations', label: 'Cinematic Animations', description: 'Enable motion effects and transitions', enabled: true },
    { id: 'notifications', label: 'Alert Notifications', description: 'Notify on pipeline stage completion', enabled: false },
  ]);

  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [theme, setTheme] = useState<'dark' | 'high-contrast'>('dark');

  const flipToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <motion.div variants={fadeUp}>
        <Badge color="ice">Configuration</Badge>
        <h2 className="mt-2 font-display text-xl font-bold text-text-primary">Settings</h2>
        <p className="text-sm text-text-secondary">
          Mission Control platform preferences and display configuration
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp}>
          <GlassPanel animate={false} className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Sliders className="size-4 text-ice" />
              Display Preferences
            </h3>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs text-text-muted">Measurement Units</p>
                <div className="flex gap-2">
                  {(['metric', 'imperial'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnits(u)}
                      className={cn(
                        'flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all',
                        units === u
                          ? 'border-ice/30 bg-ice/10 text-ice'
                          : 'border-border-subtle text-text-muted hover:text-text-secondary',
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs text-text-muted">Theme Mode</p>
                <div className="flex gap-2">
                  {([
                    { id: 'dark' as const, icon: Moon, label: 'Deep Space' },
                    { id: 'high-contrast' as const, icon: Monitor, label: 'High Contrast' },
                  ]).map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTheme(id)}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                        theme === id
                          ? 'border-ice/30 bg-ice/10 text-ice'
                          : 'border-border-subtle text-text-muted hover:text-text-secondary',
                      )}
                    >
                      <Icon className="size-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassPanel animate={false} className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Bell className="size-4 text-mission" />
              System Toggles
            </h3>
            <ul className="space-y-3">
              {toggles.map((toggle) => (
                <li
                  key={toggle.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-white/2 px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs font-medium text-text-primary">{toggle.label}</p>
                    <p className="text-[10px] text-text-muted">{toggle.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={toggle.enabled}
                    onClick={() => flipToggle(toggle.id)}
                    className={cn(
                      'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200',
                      toggle.enabled ? 'bg-ice/40' : 'bg-white/10',
                    )}
                  >
                    <motion.span
                      className="absolute top-0.5 size-4 rounded-full bg-white shadow-sm"
                      animate={{ left: toggle.enabled ? '18px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlassPanel animate={false} className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Shield className="size-4 text-signal" />
              Mission Control Access
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Globe, label: 'DSN Endpoint', value: 'dsn14.isro.gov.in' },
                { icon: Shield, label: 'Security Level', value: 'CLASSIFIED-INTERNAL' },
                { icon: Moon, label: 'Mission ID', value: 'C2-SAR-ICE-2026' },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-border-subtle bg-white/2 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5 text-text-muted" />
                    <span className="text-[10px] text-text-muted">{label}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
