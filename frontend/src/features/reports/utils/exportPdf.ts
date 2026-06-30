import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MissionReportData } from '../types';
import {
  PDF_COLORS,
  drawBarChart,
  drawDonutChart,
  drawGroupedBarChart,
  drawHorizontalBars,
  drawMetricCard,
  drawPageFooter,
  drawSectionHeader,
  riskColor,
  setFill,
  setStroke,
  setText,
  wrapText,
} from './pdfCharts';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function drawCoverPage(doc: jsPDF, data: MissionReportData) {
  setFill(doc, PDF_COLORS.white);
  doc.rect(0, 0, 210, 297, 'F');

  setFill(doc, PDF_COLORS.saffron);
  doc.rect(0, 0, 210, 4, 'F');
  setFill(doc, PDF_COLORS.green);
  doc.rect(0, 4, 210, 2, 'F');

  setFill(doc, PDF_COLORS.surface);
  doc.roundedRect(20, 30, 170, 80, 6, 6, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textMuted);
  doc.text('CLASSIFICATION: MISSION INTERNAL', 105, 48, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  setText(doc, PDF_COLORS.text);
  doc.text('Mission Report', 105, 68, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  setText(doc, PDF_COLORS.textSecondary);
  doc.text(data.meta.missionName, 105, 82, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  setText(doc, PDF_COLORS.textMuted);
  doc.text(data.meta.missionId, 105, 96, { align: 'center' });

  drawMetricCard(doc, 20, 130, 52, 38, 'Ice Probability', `${data.detectedIce.iceProbability.toFixed(1)}%`, PDF_COLORS.ice);
  drawMetricCard(doc, 79, 130, 52, 38, 'Landing Score', `${data.landing.primary.compositeScore.toFixed(1)}`, PDF_COLORS.primary);
  drawMetricCard(doc, 138, 130, 52, 38, 'Confidence', `${data.confidence.overall}%`, PDF_COLORS.signal);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textSecondary);
  const summaryLines = wrapText(doc, data.summary.headline, 150);
  doc.text(summaryLines, 105, 195, { align: 'center' });

  setStroke(doc, PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(60, 220, 150, 220);

  doc.setFontSize(9);
  setText(doc, PDF_COLORS.textMuted);
  doc.text(`Orbiter: ${data.meta.orbiter}`, 105, 232, { align: 'center' });
  doc.text(data.meta.targetRegion, 105, 240, { align: 'center' });
  doc.text(`Generated: ${formatDate(data.meta.generatedAt)}`, 105, 248, { align: 'center' });

  setFill(doc, PDF_COLORS.primary);
  doc.roundedRect(70, 260, 70, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setText(doc, PDF_COLORS.white);
  doc.text('PROJECT CABEUS', 105, 266.5, { align: 'center' });
}

function drawSummaryPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Mission Summary', 24);

  drawMetricCard(doc, 20, y, 40, 32, 'Coverage', `${data.summary.coverageKm2} km²`, PDF_COLORS.mission);
  drawMetricCard(doc, 65, y, 40, 32, 'Processing', `${data.summary.processingComplete}%`, PDF_COLORS.primary);
  drawMetricCard(doc, 110, y, 40, 32, 'Sites Ranked', `${data.summary.sitesRanked}`, PDF_COLORS.ice);
  drawMetricCard(doc, 155, y, 35, 32, 'Risk', `${data.risk.riskLabel}`, riskColor(data.risk.riskLevel));
  y += 42;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(doc, PDF_COLORS.text);
  doc.text('Overview', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textSecondary);
  const overview = wrapText(doc, data.summary.overview, 170);
  doc.text(overview, 20, y + 4);
  y += overview.length * 5 + 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(doc, PDF_COLORS.text);
  doc.text('Primary Finding', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textSecondary);
  const finding = wrapText(doc, data.summary.primaryFinding, 170);
  doc.text(finding, 20, y + 4);
  y += finding.length * 5 + 14;

  setFill(doc, PDF_COLORS.surface);
  doc.roundedRect(20, y, 170, 24, 4, 4, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setText(doc, PDF_COLORS.textMuted);
  doc.text('Pipeline Status', 28, y + 10);
  doc.setFont('helvetica', 'bold');
  setText(doc, PDF_COLORS.text);
  doc.text(data.summary.timelineStatus, 28, y + 18);

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawIcePage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Detected Ice', 24);

  drawMetricCard(doc, 20, y, 40, 32, 'Detections', `${data.detectedIce.totalDetections}`, PDF_COLORS.mission);
  drawMetricCard(doc, 65, y, 40, 32, 'High Conf.', `${data.detectedIce.highConfidenceCount}`, PDF_COLORS.signal);
  drawMetricCard(doc, 110, y, 40, 32, 'Ice Prob.', `${data.detectedIce.iceProbability.toFixed(1)}%`, PDF_COLORS.ice);
  drawMetricCard(doc, 155, y, 35, 32, 'Penetration', `${data.detectedIce.penetrationDepthM} m`, PDF_COLORS.primary);
  y += 42;

  drawGroupedBarChart(
    doc,
    20,
    y,
    170,
    72,
    data.detectedIce.spectralData.map((b) => ({
      label: b.band,
      values: [
        { value: b.intensity, color: PDF_COLORS.mission },
        { value: b.ice, color: PDF_COLORS.ice },
      ],
    })),
    'L-Band Spectral Response · DFSAR 1.25 GHz',
    [
      { label: 'Backscatter', color: PDF_COLORS.mission },
      { label: 'Ice Signal', color: PDF_COLORS.ice },
    ],
  );
  y += 82;

  drawBarChart(
    doc,
    20,
    y,
    170,
    64,
    data.detectedIce.confidenceDistribution.map((b) => ({
      label: b.range,
      value: b.count,
      color: b.range.startsWith('80') ? PDF_COLORS.signal : PDF_COLORS.mission,
    })),
    'Detection Confidence Distribution',
  );

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawIceDepositsPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Detected Ice — Deposits', 24);

  autoTable(doc, {
    startY: y,
    head: [['Deposit', 'Yield (kg)', 'Confidence', 'Status']],
    body: data.detectedIce.deposits.map((d) => [
      d.label,
      d.yieldKg.toFixed(2),
      `${d.confidence}%`,
      d.confidence >= 90 ? 'Primary Target' : d.confidence >= 80 ? 'Confirmed' : 'Candidate',
    ]),
    theme: 'plain',
    headStyles: {
      fillColor: PDF_COLORS.surface,
      textColor: PDF_COLORS.textMuted,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      textColor: PDF_COLORS.text,
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: [250, 250, 252] },
    margin: { left: 20, right: 20 },
    styles: { cellPadding: 4 },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textSecondary);
  const note = wrapText(
    doc,
    `Five subsurface ice deposits identified within the ${data.landing.primary.name} operational envelope. Average deposit confidence ${data.detectedIce.avgConfidence.toFixed(1)}%. L-band penetration depth of ${data.detectedIce.penetrationDepthM} m enables detection of buried volatiles in permanently shadowed terrain.`,
    170,
  );
  doc.text(note, 20, y);

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawLandingPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  const primary = data.landing.primary;
  let y = drawSectionHeader(doc, 'Landing Recommendation', 24);

  setFill(doc, PDF_COLORS.surface);
  doc.roundedRect(20, y, 170, 36, 4, 4, 'F');
  setFill(doc, PDF_COLORS.signal);
  doc.rect(20, y + 4, 3, 28, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setText(doc, PDF_COLORS.text);
  doc.text(primary.name, 30, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setText(doc, PDF_COLORS.textMuted);
  doc.text(`Rank #1 · ${primary.status.toUpperCase()} TARGET`, 30, y + 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  setText(doc, PDF_COLORS.primary);
  doc.text(`${primary.compositeScore.toFixed(1)}`, 170, y + 18, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(doc, PDF_COLORS.textMuted);
  doc.text('Composite Score', 170, y + 26, { align: 'right' });
  y += 46;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textSecondary);
  const why = wrapText(doc, data.landing.explainability.whySelected, 170);
  doc.text(why, 20, y);
  y += why.length * 5 + 12;

  autoTable(doc, {
    startY: y,
    head: [['Site', 'Rank', 'Score', 'Ice %', 'Risk', 'Status']],
    body: data.landing.candidates.map((c) => [
      c.name,
      `#${c.rank}`,
      c.compositeScore.toFixed(1),
      `${c.iceProbability.toFixed(1)}%`,
      `${c.risk.toFixed(1)}%`,
      c.status,
    ]),
    theme: 'plain',
    headStyles: {
      fillColor: PDF_COLORS.surface,
      textColor: PDF_COLORS.textMuted,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { textColor: PDF_COLORS.text, fontSize: 8 },
    alternateRowStyles: { fillColor: [250, 250, 252] },
    margin: { left: 20, right: 20 },
    styles: { cellPadding: 3 },
  });

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawLandingDetailPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  const exp = data.landing.explainability;
  let y = drawSectionHeader(doc, 'Landing Recommendation — Analysis', 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text('Terrain Profile', 20, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    body: [
      ['Classification', exp.terrain.classification],
      ['Composition', exp.terrain.surfaceComposition],
      ['Crater Context', exp.terrain.craterProximity],
      ['Slope', `${exp.slope.degrees.toFixed(1)}° · ${exp.slope.grade}`],
    ],
    theme: 'plain',
    bodyStyles: { textColor: PDF_COLORS.text, fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40, textColor: PDF_COLORS.textMuted } },
    margin: { left: 20, right: 20 },
    styles: { cellPadding: 3 },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text('Nearby Detections', 20, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [['Detection', 'Distance', 'Confidence', 'Type']],
    body: exp.nearbyDetections.map((d) => [
      d.label,
      `${d.distanceKm.toFixed(1)} km`,
      `${d.confidence}%`,
      d.type,
    ]),
    theme: 'plain',
    headStyles: {
      fillColor: PDF_COLORS.surface,
      textColor: PDF_COLORS.textMuted,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { textColor: PDF_COLORS.text, fontSize: 8 },
    margin: { left: 20, right: 20 },
    styles: { cellPadding: 3 },
  });

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawSciencePage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Scientific Analysis', 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textSecondary);
  const reasoning = wrapText(doc, data.science.reasoning, 170);
  doc.text(reasoning, 20, y);
  y += reasoning.length * 5 + 14;

  drawMetricCard(doc, 20, y, 52, 32, 'Permittivity εr', `${data.science.permittivity}`, PDF_COLORS.ice);
  drawMetricCard(doc, 79, y, 52, 32, 'Ice Conc.', `${data.science.iceConcentration}%`, PDF_COLORS.mission);
  drawMetricCard(doc, 138, y, 52, 32, 'Model', data.science.modelVersion, PDF_COLORS.primary);
  y += 42;

  drawHorizontalBars(
    doc,
    20,
    y,
    170,
    data.science.processingMetrics.map((m) => ({
      label: m.label,
      value: m.value,
      max: m.max,
      color: PDF_COLORS.primary,
    })),
  );

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawScienceDetailPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Scientific Analysis — Radar Signature', 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.textSecondary);
  doc.text(data.science.radarSignature, 20, y);
  y += 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text('Supporting Evidence', 20, y);
  y += 8;

  data.landing.explainability.supportingEvidence.forEach((item, i) => {
    setFill(doc, PDF_COLORS.signal);
    doc.circle(24, y - 1, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setText(doc, PDF_COLORS.textSecondary);
    const lines = wrapText(doc, `${item.label}: ${item.value} (${item.source})`, 160);
    doc.text(lines, 30, y);
    y += lines.length * 5 + 6;
    if (i >= 4) return;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(doc, PDF_COLORS.textMuted);
  doc.text(
    `Inference: ${data.science.inferenceTimeMs} ms · ${data.science.modelVersion}`,
    20,
    270,
  );

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawYieldPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Expected Yield', 24);

  drawMetricCard(doc, 20, y, 40, 32, 'Primary Yield', `${data.yield.primaryYieldLm3} L/m³`, PDF_COLORS.ice);
  drawMetricCard(doc, 65, y, 40, 32, 'Rover Total', `${data.yield.totalProjectedKg.toFixed(2)} kg`, PDF_COLORS.mission);
  drawMetricCard(doc, 110, y, 40, 32, 'Duration', `${data.yield.missionDurationSols} sols`, PDF_COLORS.primary);
  drawMetricCard(doc, 155, y, 35, 32, 'Extraction', `${data.yield.extractionPotential.toFixed(1)}%`, PDF_COLORS.signal);
  y += 42;

  drawBarChart(
    doc,
    20,
    y,
    85,
    70,
    data.yield.depositYields.map((d) => ({
      label: d.label.split(' ')[0],
      value: d.yieldKg * 100,
      color: PDF_COLORS.ice,
    })),
    'Deposit Yields (×100 kg)',
  );

  drawBarChart(
    doc,
    105,
    y,
    85,
    70,
    data.yield.siteComparison.map((s) => ({
      label: s.name.split(' ')[0],
      value: s.expectedYield * 50,
      color: s.status === 'primary' ? PDF_COLORS.signal : PDF_COLORS.mission,
    })),
    'Site Yield Comparison (×50 L/m³)',
  );
  y += 80;

  autoTable(doc, {
    startY: y,
    head: [['Deposit', 'Yield (kg)', 'Confidence']],
    body: data.yield.depositYields.map((d) => [d.label, d.yieldKg.toFixed(2), `${d.confidence}%`]),
    theme: 'plain',
    headStyles: {
      fillColor: PDF_COLORS.surface,
      textColor: PDF_COLORS.textMuted,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { textColor: PDF_COLORS.text, fontSize: 9 },
    margin: { left: 20, right: 20 },
    styles: { cellPadding: 3 },
  });

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawRiskPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Mission Risk', 24);

  drawDonutChart(doc, 55, y + 36, 22, 100 - data.risk.overallRisk, 'Safety Index');
  drawDonutChart(doc, 155, y + 36, 22, data.risk.overallRisk, 'Risk Score');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setText(doc, riskColor(data.risk.riskLevel));
  doc.text(data.risk.riskLabel.toUpperCase(), 105, y + 78, { align: 'center' });
  y += 90;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text('Risk Factors', 20, y);
  y += 8;

  y = drawHorizontalBars(
    doc,
    20,
    y,
    170,
    data.risk.factors.map((f) => ({
      label: f.label,
      value: f.score,
      max: 100,
      color: riskColor(f.level),
    })),
  );

  autoTable(doc, {
    startY: y + 4,
    head: [['Site', 'Risk Score', 'Level']],
    body: data.risk.siteRisks.map((s) => [
      s.name,
      `${s.risk.toFixed(1)}%`,
      s.riskLevel.toUpperCase(),
    ]),
    theme: 'plain',
    headStyles: {
      fillColor: PDF_COLORS.surface,
      textColor: PDF_COLORS.textMuted,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { textColor: PDF_COLORS.text, fontSize: 8 },
    margin: { left: 20, right: 20 },
    styles: { cellPadding: 3 },
  });

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawConfidencePage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Confidence', 24);

  drawDonutChart(doc, 55, y + 38, 24, data.confidence.overall, 'Overall');
  drawDonutChart(doc, 155, y + 38, 24, data.confidence.modelConfidence, 'Model');

  y += 88;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text('Confidence Factors', 20, y);
  y += 8;

  y = drawHorizontalBars(
    doc,
    20,
    y,
    170,
    data.confidence.factors.map((f) => ({
      label: f.label,
      value: f.value,
      max: 100,
      color: PDF_COLORS.primary,
    })),
  );

  drawBarChart(
    doc,
    20,
    y + 4,
    170,
    58,
    data.confidence.distribution.map((b) => ({
      label: b.range,
      value: b.count,
      color: b.range.startsWith('80') ? PDF_COLORS.signal : PDF_COLORS.mission,
    })),
    'Confidence Distribution',
  );

  drawPageFooter(doc, data.meta.missionId, page, total);
}

function drawRecommendationsPage(doc: jsPDF, data: MissionReportData, page: number, total: number) {
  let y = drawSectionHeader(doc, 'Recommendations', 24);

  data.recommendations.forEach((rec, i) => {
    setFill(doc, PDF_COLORS.surface);
    doc.roundedRect(20, y, 170, 22, 3, 3, 'F');
    setFill(doc, PDF_COLORS.primary);
    doc.roundedRect(20, y, 22, 22, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    setText(doc, PDF_COLORS.white);
    doc.text(`${i + 1}`, 31, y + 14, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setText(doc, PDF_COLORS.textSecondary);
    const lines = wrapText(doc, rec, 138);
    doc.text(lines, 48, y + 10);
    y += 28;
  });

  setFill(doc, PDF_COLORS.surface);
  doc.roundedRect(20, y + 8, 170, 28, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text('Mission Decision', 28, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setText(doc, PDF_COLORS.textSecondary);
  doc.text(
    `Proceed with ${data.landing.primary.name} as primary landing target. All confidence thresholds met.`,
    28,
    y + 28,
  );

  drawPageFooter(doc, data.meta.missionId, page, total);
}

export async function exportMissionReportPdf(data: MissionReportData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const totalPages = 12;

  drawCoverPage(doc, data);
  doc.addPage();
  drawSummaryPage(doc, data, 2, totalPages);
  doc.addPage();
  drawIcePage(doc, data, 3, totalPages);
  doc.addPage();
  drawIceDepositsPage(doc, data, 4, totalPages);
  doc.addPage();
  drawLandingPage(doc, data, 5, totalPages);
  doc.addPage();
  drawLandingDetailPage(doc, data, 6, totalPages);
  doc.addPage();
  drawSciencePage(doc, data, 7, totalPages);
  doc.addPage();
  drawScienceDetailPage(doc, data, 8, totalPages);
  doc.addPage();
  drawYieldPage(doc, data, 9, totalPages);
  doc.addPage();
  drawRiskPage(doc, data, 10, totalPages);
  doc.addPage();
  drawConfidencePage(doc, data, 11, totalPages);
  doc.addPage();
  drawRecommendationsPage(doc, data, 12, totalPages);

  const filename = `${data.meta.missionId}-mission-report.pdf`;
  doc.save(filename);
}
