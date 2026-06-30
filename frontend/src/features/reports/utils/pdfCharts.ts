import type jsPDF from 'jspdf';

export const PDF_COLORS = {
  primary: [0, 122, 255] as [number, number, number],
  ice: [103, 216, 255] as [number, number, number],
  mission: [77, 140, 255] as [number, number, number],
  signal: [52, 199, 89] as [number, number, number],
  warning: [255, 149, 0] as [number, number, number],
  danger: [255, 59, 48] as [number, number, number],
  text: [29, 29, 31] as [number, number, number],
  textSecondary: [110, 110, 115] as [number, number, number],
  textMuted: [142, 142, 147] as [number, number, number],
  border: [229, 229, 234] as [number, number, number],
  surface: [242, 242, 247] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  saffron: [255, 153, 51] as [number, number, number],
  green: [19, 136, 8] as [number, number, number],
};

export function setFill(doc: jsPDF, color: [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

export function setStroke(doc: jsPDF, color: [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

export function setText(doc: jsPDF, color: [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

export function drawSectionHeader(doc: jsPDF, title: string, y: number): number {
  setFill(doc, PDF_COLORS.primary);
  doc.rect(20, y, 3, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  setText(doc, PDF_COLORS.text);
  doc.text(title, 28, y + 11);
  setStroke(doc, PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(20, y + 18, 190, y + 18);
  return y + 26;
}

export function drawMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  accent: [number, number, number] = PDF_COLORS.primary,
) {
  setFill(doc, PDF_COLORS.surface);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');
  setFill(doc, accent);
  doc.rect(x, y + 4, 2, h - 8, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(doc, PDF_COLORS.textMuted);
  doc.text(label.toUpperCase(), x + 8, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  setText(doc, PDF_COLORS.text);
  doc.text(value, x + 8, y + 28);
}

export function drawBarChart(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  data: { label: string; value: number; color?: [number, number, number] }[],
  title: string,
) {
  setFill(doc, PDF_COLORS.white);
  doc.roundedRect(x, y, w, h, 4, 4, 'F');
  setStroke(doc, PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text(title, x + 10, y + 14);

  const chartX = x + 10;
  const chartY = y + 22;
  const chartW = w - 20;
  const chartH = h - 36;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barW = chartW / data.length - 4;

  data.forEach((item, i) => {
    const barH = (item.value / maxVal) * chartH;
    const bx = chartX + i * (barW + 4);
    const by = chartY + chartH - barH;
    setFill(doc, item.color ?? PDF_COLORS.mission);
    doc.roundedRect(bx, by, barW, barH, 1, 1, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setText(doc, PDF_COLORS.textMuted);
    doc.text(item.label, bx + barW / 2, chartY + chartH + 8, { align: 'center' });
  });
}

export function drawGroupedBarChart(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  data: { label: string; values: { value: number; color: [number, number, number] }[] }[],
  title: string,
  legend: { label: string; color: [number, number, number] }[],
) {
  setFill(doc, PDF_COLORS.white);
  doc.roundedRect(x, y, w, h, 4, 4, 'F');
  setStroke(doc, PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setText(doc, PDF_COLORS.text);
  doc.text(title, x + 10, y + 14);

  let lx = x + 10;
  legend.forEach((item) => {
    setFill(doc, item.color);
    doc.rect(lx, y + 18, 6, 4, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setText(doc, PDF_COLORS.textMuted);
    doc.text(item.label, lx + 9, y + 21.5);
    lx += doc.getTextWidth(item.label) + 18;
  });

  const chartX = x + 10;
  const chartY = y + 28;
  const chartW = w - 20;
  const chartH = h - 44;
  const maxVal = Math.max(...data.flatMap((d) => d.values.map((v) => v.value)), 1);
  const groupW = chartW / data.length;
  const barW = groupW / 3;

  data.forEach((group, gi) => {
    group.values.forEach((bar, bi) => {
      const barH = (bar.value / maxVal) * chartH;
      const bx = chartX + gi * groupW + bi * barW + 2;
      const by = chartY + chartH - barH;
      setFill(doc, bar.color);
      doc.roundedRect(bx, by, barW - 2, barH, 1, 1, 'F');
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setText(doc, PDF_COLORS.textMuted);
    doc.text(group.label, chartX + gi * groupW + groupW / 2, chartY + chartH + 8, {
      align: 'center',
    });
  });
}

export function drawDonutChart(
  doc: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  value: number,
  label: string,
) {
  const pct = Math.min(100, Math.max(0, value)) / 100;
  const segments = 60;
  const startAngle = -Math.PI / 2;

  setStroke(doc, PDF_COLORS.border);
  doc.setLineWidth(6);
  for (let i = 0; i < segments; i++) {
    const a1 = startAngle + (i / segments) * 2 * Math.PI;
    const a2 = startAngle + ((i + 1) / segments) * 2 * Math.PI;
    doc.line(
      cx + radius * Math.cos(a1),
      cy + radius * Math.sin(a1),
      cx + radius * Math.cos(a2),
      cy + radius * Math.sin(a2),
    );
  }

  const filledSegments = Math.round(segments * pct);
  setStroke(doc, PDF_COLORS.signal);
  doc.setLineWidth(6);
  for (let i = 0; i < filledSegments; i++) {
    const a1 = startAngle + (i / segments) * 2 * Math.PI;
    const a2 = startAngle + ((i + 1) / segments) * 2 * Math.PI;
    doc.line(
      cx + radius * Math.cos(a1),
      cy + radius * Math.sin(a1),
      cx + radius * Math.cos(a2),
      cy + radius * Math.sin(a2),
    );
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  setText(doc, PDF_COLORS.text);
  doc.text(`${value.toFixed(0)}%`, cx, cy + 2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(doc, PDF_COLORS.textMuted);
  doc.text(label, cx, cy + 12, { align: 'center' });
}

export function drawHorizontalBars(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  items: { label: string; value: number; max: number; color?: [number, number, number] }[],
) {
  let cy = y;
  items.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setText(doc, PDF_COLORS.text);
    doc.text(item.label, x, cy + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.value.toFixed(1)}%`, x + w - 2, cy + 4, { align: 'right' });

    setFill(doc, PDF_COLORS.border);
    doc.roundedRect(x, cy + 8, w, 5, 2, 2, 'F');
    const barW = (item.value / item.max) * w;
    setFill(doc, item.color ?? PDF_COLORS.primary);
    doc.roundedRect(x, cy + 8, barW, 5, 2, 2, 'F');
    cy += 20;
  });
  return cy;
}

export function drawPageFooter(doc: jsPDF, missionId: string, page: number, total: number) {
  setStroke(doc, PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(20, 280, 190, 280);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(doc, PDF_COLORS.textMuted);
  doc.text('PROJECT CABEUS · ISRO Mission Control', 20, 287);
  doc.text(missionId, 105, 287, { align: 'center' });
  doc.text(`${page} / ${total}`, 190, 287, { align: 'right' });
}

export function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

export function riskColor(level: string): [number, number, number] {
  switch (level) {
    case 'low':
      return PDF_COLORS.signal;
    case 'moderate':
      return PDF_COLORS.ice;
    case 'elevated':
      return PDF_COLORS.warning;
    default:
      return PDF_COLORS.danger;
  }
}
