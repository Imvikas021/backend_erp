const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const PDFTable = require("pdfkit-table");

exports.generatePDF = (client_name, costing_name, costingRows) => {
  return new Promise((resolve, reject) => {


    const uploadDir = path.join(__dirname, "..", "uploads");

    if(!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, {recursive: true});
    }

    const safeName = costing_name.replace("_");
    
    // PDF file path
    const filePath = path.join(
      uploadDir,
      `quotation_${costing_name}.pdf`
    );

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    //  HEADER 
    doc.image("icons/heinrich.png", 40, 30,{
      width: 120,
      height: 20,
    })
      .fillColor("black")
      .moveDown(0.5);

    doc
      .fontSize(16)
      .text("Quotation Report", { align: "right" })
      .moveDown(2);


    //  CLIENT DETAILS
    doc.fontSize(14).text(`Client Name: ${client_name}`);
    doc.fontSize(14).text(`Costing Name: ${costing_name}`);
    doc.moveDown(2);

    //  TABLE HEADER 
    doc
      .fontSize(14)
      .text("Item", 60, doc.y, { continued: true })
      .text("Costing", 300);

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    let total = 0;

    // COSTING ROWS
    costingRows.forEach((row) => {
      let price = isNaN(row.costing) ? 0 : Number(row.costing);

      total += price;

      doc
        .fontSize(12)
        .text(row.costing_name, 60, doc.y + 10, { continued: true })
        .text(row.costing, 300);
    });

    doc.moveDown(2);

    // TOTAL
    doc.fontSize(14).text(`Total Cost: INR ${total}.00`, { align: "right" });


    // Fixed footer area height
   const footerHeight = 200;

    // Start Y of footer block
  const footerY = doc.page.height - footerHeight;

// Background (optional)
// doc.rect(0, footerY, doc.page.width, footerHeight).fill('#f9f9f9');

// Reset fill for text
doc.fillColor("black");

// Payment Terms Title
doc.font("Helvetica-Bold")
   .fontSize(12)
   .text("Payment Terms :-", 40, footerY);

// Payment Terms Content
doc.font("Helvetica")
   .fontSize(11);

let y = footerY + 20; // next line after title

const paymentTerms = [
  "1   100% Advance",
  "2   Prices: Only Supply Rate, Taxes will be Extra, Freight Extra (GST 18%)",
  "3   Packing: Included",
  "4   Forwarding: Extra",
  "5   Validity: 30 days from date of offer",
  "6   Warranty: 1 Year Against Manufacturing Defect",
  "7   Please visit www.heinrichlimited.com for Product datasheets",
  "8   Currency: INR"
];

// Print payment terms in fixed footer area
paymentTerms.forEach(term => {
  doc.text(term, 40, y);
  y += 18; // line spacing
});

// LINE above footer text
const lineY = footerY + footerHeight - 40;

doc.moveTo(40, lineY)
   .lineTo(doc.page.width - 40, lineY)
   .stroke();

// Footer Text below line
doc.fontSize(12)
   .text(
     "For Any question regarding this Quotation please Email us Info@heinrichlimited.com or Make a call to 011-22788336",
     40,
     lineY + 10,
     { align: "center" }
   );

    doc.end();

    stream.on("finish", () =>{ 
      resolve(filePath);
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
};