import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { FadeIn, SectionHeading } from '@/components/motion';
import { ReportSectionPreview } from '@/features/reports/components/ReportSectionPreview';
import { useMissionReport } from '@/features/reports/hooks/useMissionReport';
import { ROUTES } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

export function MissionReportSection() {
  const { data, sections, selectedSection, setSelectedSection, exporting, exportPdf } =
    useMissionReport();
  const [exportAnimating, setExportAnimating] = useState(false);

  const handleExport = async () => {
    setExportAnimating(true);
    await exportPdf();
    setTimeout(() => setExportAnimating(false), 1200);
  };

  return (
    <LandingSectionShell id="report" className="px-8 py-32 md:px-12 md:py-48 lg:px-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label="07 — Mission Report"
          title="Intelligence Briefing"
          subtitle="AI-generated mission report with charts, landing recommendation, and confidence metrics."
        />

        <FadeIn className="mt-16 flex flex-wrap items-center gap-6" delay={0.1}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setSelectedSection(section.id)}
              className={cn(
                'relative pb-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors duration-500',
                selectedSection === section.id
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {section.title}
              {selectedSection === section.id && (
                <motion.span
                  layoutId="report-tab-active"
                  className="absolute inset-x-0 -bottom-px h-px bg-text-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </FadeIn>

        <FadeIn className="mt-10" delay={0.15}>
          <div className="border border-border-subtle p-8 md:p-10">
            <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-label">Mission Report</p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary">
                  {data.meta.missionId}
                </p>
              </div>
              <Button
                variant="outline"
                size="md"
                loading={exporting}
                onClick={handleExport}
              >
                Export PDF
              </Button>
            </div>

            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_PREMIUM }}
            >
              <ReportSectionPreview data={data} section={selectedSection} />
            </motion.div>

            {exportAnimating && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center font-mono text-sm text-signal"
              >
                Report exported successfully
              </motion.p>
            )}
          </div>
        </FadeIn>

        <FadeIn className="mt-16 flex justify-start" delay={0.2}>
          <Link to={ROUTES.reports}>
            <Button size="lg">
              Open Reports Workspace
            </Button>
          </Link>
        </FadeIn>
      </div>
    </LandingSectionShell>
  );
}
