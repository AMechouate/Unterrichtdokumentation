import type { Cell } from "exceljs";
import type { jsPDF as PdfDocument } from "jspdf";
import type { DailyReport } from "./types";

const NAVY = "18324A";
const TEAL = "17847A";
const PALE = "EAF4F2";
const LIGHT = "F3F6F8";
const WHITE = "FFFFFF";
const TEXT = "263746";

function formatDate(date: string) {
  if (!date) return "Kein Datum";
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function safeFileDate(date: string) {
  return date || new Date().toISOString().slice(0, 10);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function addPdfSection(
  doc: PdfDocument,
  title: string,
  content: string,
  startY: number,
) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const lines = doc.splitTextToSize(content.trim() || "—", 174) as string[];
  const boxHeight = Math.max(24, lines.length * 5.2 + 14);
  let y = startY;

  if (y + boxHeight > pageHeight - 20) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(243, 246, 248);
  doc.roundedRect(18, y, 174, boxHeight, 2, 2, "F");
  doc.setTextColor(23, 132, 122);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), 24, y + 8);
  doc.setTextColor(38, 55, 70);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(lines, 24, y + 15);

  return y + boxHeight + 6;
}

export async function exportPdf(report: DailyReport) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setProperties({
    title: `Unterrichtsdokumentation ${report.date}`,
    subject: report.course,
    author: report.instructor,
  });

  doc.setFillColor(24, 50, 74);
  doc.rect(0, 0, pageWidth, 41, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Unterrichtsdokumentation", 18, 19);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(formatDate(report.date), 18, 29);
  doc.text(report.course, pageWidth - 18, 19, { align: "right" });
  doc.text(report.instructor, pageWidth - 18, 29, { align: "right" });

  let y = 52;
  y = addPdfSection(doc, "Lernfeld", report.learningField, y);
  y = addPdfSection(doc, "Unterrichtsdokumentation", report.documentation, y);
  y = addPdfSection(doc, "Aufgaben für die Selbstlernphase", report.assignments, y);
  y = addPdfSection(doc, "Besonderheiten", report.notes, y);

  if (y > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(24, 50, 74);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Teilnehmerbeobachtungen", 18, y + 2);

  autoTable(doc, {
    startY: y + 7,
    margin: { left: 18, right: 18 },
    head: [["Teilnehmer/in", "Bewertung"]],
    body: report.assessments.map((item) => [
      item.name,
      item.rating || "Keine Bewertung",
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9.5,
      cellPadding: 3.5,
      textColor: [38, 55, 70],
      lineColor: [219, 227, 232],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [24, 50, 74],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [243, 246, 248] },
    columnStyles: {
      0: { cellWidth: 75 },
      1: { cellWidth: 99 },
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setTextColor(116, 130, 141);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Seite ${page} von ${pageCount}`, pageWidth - 18, 289, {
      align: "right",
    });
  }

  const blob = doc.output("blob");
  download(blob, `Unterrichtsdokumentation_${safeFileDate(report.date)}.pdf`);
}

function applySectionTitle(cell: Cell) {
  cell.font = { bold: true, color: { argb: TEAL }, size: 10 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PALE } };
  cell.alignment = { vertical: "middle" };
}

export async function exportExcel(report: DailyReport) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Unterrichtsdokumentation";
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet("Tagesbericht", {
    views: [{ showGridLines: false }],
    pageSetup: {
      orientation: "portrait",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.35,
        right: 0.35,
        top: 0.5,
        bottom: 0.5,
        header: 0.2,
        footer: 0.2,
      },
    },
  });

  sheet.columns = [
    { width: 19 },
    { width: 23 },
    { width: 18 },
    { width: 23 },
    { width: 18 },
    { width: 18 },
  ];

  sheet.mergeCells("A1:F2");
  const title = sheet.getCell("A1");
  title.value = "Unterrichtsdokumentation";
  title.font = { bold: true, color: { argb: WHITE }, size: 20 };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  title.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(1).height = 24;
  sheet.getRow(2).height = 24;

  const metadata = [
    ["Datum", formatDate(report.date), "Kurs", report.course],
    ["Dozent/in", report.instructor, "Erstellt am", new Date().toLocaleDateString("de-DE")],
  ];

  metadata.forEach((entry, index) => {
    const rowNumber = index + 4;
    sheet.mergeCells(rowNumber, 2, rowNumber, 3);
    sheet.mergeCells(rowNumber, 5, rowNumber, 6);
    const row = sheet.getRow(rowNumber);
    row.getCell(1).value = entry[0];
    row.getCell(2).value = entry[1];
    row.getCell(4).value = entry[2];
    row.getCell(5).value = entry[3];
    [1, 4].forEach((column) => {
      row.getCell(column).font = { bold: true, color: { argb: TEAL }, size: 10 };
    });
    [2, 5].forEach((column) => {
      row.getCell(column).font = { color: { argb: TEXT }, size: 10 };
    });
    row.height = 22;
  });

  const sections = [
    ["Lernfeld", report.learningField],
    ["Unterrichtsdokumentation", report.documentation],
    ["Aufgaben für die Selbstlernphase", report.assignments],
    ["Besonderheiten", report.notes],
  ];

  let rowNumber = 7;
  sections.forEach(([heading, content]) => {
    sheet.mergeCells(rowNumber, 1, rowNumber, 6);
    const headingCell = sheet.getCell(rowNumber, 1);
    headingCell.value = heading;
    applySectionTitle(headingCell);
    sheet.getRow(rowNumber).height = 22;

    sheet.mergeCells(rowNumber + 1, 1, rowNumber + 2, 6);
    const contentCell = sheet.getCell(rowNumber + 1, 1);
    contentCell.value = content.trim() || "—";
    contentCell.font = { color: { argb: TEXT }, size: 10 };
    contentCell.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
      indent: 1,
    };
    contentCell.border = {
      left: { style: "thin", color: { argb: "DCE4E8" } },
      right: { style: "thin", color: { argb: "DCE4E8" } },
      bottom: { style: "thin", color: { argb: "DCE4E8" } },
    };
    sheet.getRow(rowNumber + 1).height = 34;
    sheet.getRow(rowNumber + 2).height = 12;
    rowNumber += 4;
  });

  sheet.mergeCells(rowNumber, 1, rowNumber, 6);
  const participantsHeading = sheet.getCell(rowNumber, 1);
  participantsHeading.value = "Teilnehmerbeobachtungen";
  participantsHeading.font = { bold: true, color: { argb: WHITE }, size: 11 };
  participantsHeading.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: NAVY },
  };
  participantsHeading.alignment = { vertical: "middle", indent: 1 };
  sheet.getRow(rowNumber).height = 24;
  rowNumber += 1;

  sheet.mergeCells(rowNumber, 1, rowNumber, 3);
  sheet.mergeCells(rowNumber, 4, rowNumber, 6);
  sheet.getCell(rowNumber, 1).value = "Teilnehmer/in";
  sheet.getCell(rowNumber, 4).value = "Bewertung";
  [1, 4].forEach((column) => {
    const cell = sheet.getCell(rowNumber, column);
    cell.font = { bold: true, color: { argb: WHITE }, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TEAL } };
    cell.alignment = { vertical: "middle", indent: 1 };
  });
  sheet.getRow(rowNumber).height = 22;

  report.assessments.forEach((assessment, index) => {
    rowNumber += 1;
    sheet.mergeCells(rowNumber, 1, rowNumber, 3);
    sheet.mergeCells(rowNumber, 4, rowNumber, 6);
    sheet.getCell(rowNumber, 1).value = assessment.name;
    sheet.getCell(rowNumber, 4).value = assessment.rating || "Keine Bewertung";
    [1, 4].forEach((column) => {
      const cell = sheet.getCell(rowNumber, column);
      cell.font = { color: { argb: TEXT }, size: 10 };
      cell.alignment = { vertical: "middle", indent: 1 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: index % 2 === 0 ? LIGHT : WHITE },
      };
      cell.border = {
        bottom: { style: "thin", color: { argb: "DCE4E8" } },
      };
    });
    sheet.getRow(rowNumber).height = 22;
  });

  sheet.autoFilter = {
    from: { row: rowNumber - report.assessments.length, column: 1 },
    to: { row: rowNumber, column: 6 },
  };
  sheet.headerFooter.oddFooter = "&LUnterrichtsdokumentation&RSeite &P von &N";
  sheet.pageSetup.printArea = `A1:F${rowNumber}`;

  const buffer = await workbook.xlsx.writeBuffer();
  download(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Unterrichtsdokumentation_${safeFileDate(report.date)}.xlsx`,
  );
}
