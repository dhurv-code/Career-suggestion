import { NextResponse } from "next/server";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const snap = await getDoc(doc(db, "reports", String(id)));

    if (!snap.exists()) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const report = snap.data().report;
    const careers = snap.data().careers || [];

    // Create PDF
    const pdf = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    // ==== PREMIUM HEADER ====
    pdf.setFillColor(60, 20, 140);
    pdf.rect(0, 0, 595, 80, "F");

    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text("CareerAI - Detailed Career Report", 30, 50);

    // ==== SELECTED CAREERS SECTION ====
    pdf.setFontSize(15);
    pdf.setTextColor(80, 80, 160);

    let y = 120;
    pdf.text("Selected Careers:", 40, y);

    y += 25;

    pdf.setFontSize(12);
    pdf.setTextColor(20, 20, 20);
    pdf.text(careers.join(", "), 40, y);

    y += 40;

    // === PREMIUM FORMATTED BODY ===
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40);

    const pageWidth = pdf.internal.pageSize.width;
    const margin = 40;
    const maxWidth = pageWidth - margin * 2;

    // Split report into paragraphs
    const paragraphs = report.split("\n\n");

    paragraphs.forEach((para: string) => {
      if (!para.trim()) return;

      // Check for heading (Markdown style)
      if (para.startsWith("##") || para.startsWith("**")) {
        let title = para.replace(/[#*]/g, "").trim();

        // Add new page if space ends
        if (y > 760) {
          pdf.addPage();
          y = 60;
        }

        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(50, 50, 120);
        pdf.text(title, margin, y);
        y += 25;

        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(12);
        pdf.setTextColor(40, 40, 40);

        return;
      }

      // Normal paragraph
      const lines = pdf.splitTextToSize(para, maxWidth);

      lines.forEach((line: string) => {
        if (y > 780) {
          pdf.addPage();
          y = 60;
        }
        pdf.text(line, margin, y);
        y += 18; // PERFECT balanced line spacing
      });

      y += 10; // paragraph spacing
    });

    // Return PDF
    const pdfBuffer = pdf.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=CareerAI_Report.pdf",
      },
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
