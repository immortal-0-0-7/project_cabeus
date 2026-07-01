import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/common/Button';
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
    <section id="report" className="relative px-8 py-32 md:px-12 md:py-48 lg:px-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label="07 — Mission Report"
          title="Intelligence Briefing"
          subtitle="AI-generated mission report with charts, landing recommendation, and confidence metrics."
        />

        <FadeIn className="mt-16 flex flex-wrap justify-center gap-8 border-b border-border-subtle pb-8" delay={0.1}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setSelectedSection(section.id)}
              className={cn(
                'font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-500',
                selectedSection === section.id
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {section.title}
            </button>
          ))}
        </FadeIn>

        <FadeIn className="mt-12" delay={0.15}>
          <div className="border-t border-border-subtle pt-10">
            <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-label">Mission Report</p>
                <p className="mt-2 font-display text-2xl font-medium tracking-tight text-text-primary">
                  {data.meta.missionId}
                </p>
              </div>
              <Button
                variant="outline"
                size="md"
                loading={exporting}
                leftIcon={<Download className="size-4" strokeWidth={1.5} />}
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

        <FadeIn className="mt-16 flex justify-center" delay={0.2}>
          <Link to={ROUTES.reports}>
            <Button size="lg" rightIcon={<ArrowRight className="size-4 opacity-60" strokeWidth={1.5} />}>
              Open Reports Workspace
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
