import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { DisplayHeading } from '@/components/common/DisplayHeading';
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
      className="flex h-full min-h-0 flex-col"
    >
      <motion.div variants={fadeUp} className="mb-12">
        <Badge color="ice">Configuration</Badge>
        <DisplayHeading
          accent="warm"
          className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary"
        >
          Settings
        </DisplayHeading>
        <p className="mt-3 text-lg font-light text-text-secondary">
          Mission Control platform preferences
        </p>
      </motion.div>

      <div className="grid gap-16 lg:grid-cols-2">
        <motion.div variants={fadeUp}>
          <p className="text-label mb-8">Display Preferences</p>

          <div className="space-y-10">
            <div>
              <p className="mb-4 text-sm text-text-secondary">Measurement Units</p>
              <div className="flex gap-8">
                {(['metric', 'imperial'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnits(u)}
                    className={cn(
                      'font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-500',
                      units === u ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary',
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-sm text-text-secondary">Theme Mode</p>
              <div className="flex gap-8">
                {([
                  { id: 'dark' as const, label: 'Deep Space' },
                  { id: 'high-contrast' as const, label: 'High Contrast' },
                ]).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTheme(id)}
                    className={cn(
                      'font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-500',
                      theme === id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <p className="text-label mb-8">System Toggles</p>
          <ul className="divide-y divide-border-subtle">
            {toggles.map((toggle) => (
              <li
                key={toggle.id}
                className="flex items-center justify-between gap-6 py-6"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">{toggle.label}</p>
                  <p className="mt-1 text-sm font-light text-text-muted">{toggle.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggle.enabled}
                  onClick={() => flipToggle(toggle.id)}
                  className={cn(
                    'relative h-5 w-9 shrink-0 transition-colors duration-500',
                    toggle.enabled ? 'bg-mission/40' : 'bg-white/8',
                  )}
                >
                  <motion.span
                    className="absolute top-0.5 size-4 bg-text-primary"
                    animate={{ left: toggle.enabled ? '18px' : '2px' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <p className="text-label mb-8">Mission Control Access</p>
          <div className="grid gap-10 border-t border-border-subtle pt-10 sm:grid-cols-3">
            {[
              { label: 'DSN Endpoint', value: 'dsn14.isro.gov.in' },
              { label: 'Security Level', value: 'CLASSIFIED-INTERNAL' },
              { label: 'Mission ID', value: 'C2-SAR-ICE-2026' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-label">{label}</p>
                <p className="mt-2 font-mono text-sm text-text-primary">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
