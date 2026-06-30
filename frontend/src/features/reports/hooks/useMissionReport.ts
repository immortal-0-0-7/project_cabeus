import { useCallback, useMemo, useState } from 'react';
import { generateMissionReportData, REPORT_SECTIONS } from '../utils/generateReportData';
import { exportMissionReportPdf } from '../utils/exportPdf';
import type { MissionReportData, ReportSectionId } from '../types';

export function useMissionReport() {
  const [exporting, setExporting] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ReportSectionId>('summary');

  const data = useMemo<MissionReportData>(() => generateMissionReportData(), []);

  const exportPdf = useCallback(async () => {
    setExporting(true);
    try {
      await exportMissionReportPdf(data);
    } finally {
      setExporting(false);
    }
  }, [data]);

  const printPreview = useCallback(() => {
    window.print();
  }, []);

  return {
    data,
    sections: REPORT_SECTIONS,
    selectedSection,
    setSelectedSection,
    exporting,
    exportPdf,
    printPreview,
  };
}
