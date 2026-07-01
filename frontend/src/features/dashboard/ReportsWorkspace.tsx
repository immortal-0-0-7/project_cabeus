import { motion } from 'framer-motion';
import { Download, FileText, Printer, Share2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  ReportSectionPreview,
  useMissionReport,
} from '@/features/reports';
import { cn } from '@/utils/cn';
import { staggerContainer, fadeUp } from '@/utils/motion';

export function ReportsWorkspace() {
  const {
    data,
    sections,
    selectedSection,
    setSelectedSection,
    exporting,
    exportPdf,
    printPreview,
  } = useMissionReport();

  const activeSection = sections.find((s) => s.id === selectedSection)!;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col"
    >
      <motion.div variants={fadeUp} className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <Badge color="ice">Report Generator</Badge>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary">
            Mission Report
          </h2>
          <p className="mt-3 text-lg font-light text-text-secondary">
            Professional PDF export · ISRO standard format
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={exportPdf} disabled={exporting}>
            <Download className="size-3.5" strokeWidth={1.25} />
            {exporting ? 'Generating…' : 'Export PDF'}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="size-3.5" strokeWidth={1.25} />
            Share
          </Button>
        </div>
      </motion.div>

      <div className="grid min-h-0 flex-1 gap-12 border-t border-border-subtle pt-10 lg:grid-cols-[240px_1fr]">
        <motion.div variants={fadeUp}>
          <p className="text-label mb-6">Sections</p>
          <ul className="divide-y divide-border-subtle">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => setSelectedSection(section.id)}
                  className={cn(
                    'flex w-full items-center gap-3 py-4 text-left transition-colors duration-500',
                    selectedSection === section.id
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-secondary',
                  )}
                >
                  <FileText className="size-3.5 shrink-0" strokeWidth={1.25} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{section.title}</p>
                    <p className="text-label mt-1">{section.pages} page{section.pages > 1 ? 's' : ''}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className="min-h-0 border-t border-border-subtle pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div className="mb-8 flex items-start justify-between border-b border-border-subtle pb-8">
            <div>
              <p className="text-label">{data.meta.missionId}</p>
              <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-text-primary">
                {data.meta.missionName}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {activeSection.title}
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ReportSectionPreview data={data} section={selectedSection} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-border-subtle pt-8">
            <Button variant="outline" size="sm" onClick={printPreview}>
              <Printer className="size-3.5" strokeWidth={1.25} />
              Print Preview
            </Button>
            <Button variant="outline" size="sm" onClick={exportPdf} disabled={exporting}>
              <Download className="size-3.5" strokeWidth={1.25} />
              {exporting ? 'Generating…' : 'Download PDF'}
            </Button>
            <p className="ml-auto self-center font-mono text-[10px] text-text-muted">
              {data.meta.totalPages} pages · {new Date(data.meta.generatedAt).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
