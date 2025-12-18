const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const now = new Date(
  new Date().toLocaleDateString("en-IN", {timeZone: "Asia/Delhi"})
);

exports.generateExcel = async (company_name,costing_name,costingRows) => {

  const uploadsDir = path.join(__dirname, "..", "uploads");

  if(!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
  }

  const filePath = path.join(
    uploadsDir,
    `quotation_${Date.now()}.xlsx`
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("BOQ", {
    pageSetup: { paperSize: 9, orientation: "portrait" }
  });

  // ===============================
  // HEADER SECTION
  // ===============================

  sheet.mergeCells("A1:H1");
  sheet.getCell("A1").value = "HEINRICH CORPORATION INDIA PRIVATE LIMITED";
  sheet.getCell("A1").font = { size: 14, bold: true };
  sheet.getCell("A1").alignment = { horizontal: "center" };

  sheet.mergeCells("A2:H2");
  sheet.getCell("A2").value = "(A Heinrich Limited Group Company)";
  sheet.getCell("A2").alignment = { horizontal: "center" };

  sheet.mergeCells("A3:H3");
  sheet.getCell("A3").value = "1202 Tower A-2, Corporate Park, Sector 142, Noida";
  sheet.getCell("A3").alignment = { horizontal: "center" };

  sheet.mergeCells("A4:H4");
  sheet.getCell("A4").value = "Uttar Pradesh - 201301  Tel: +91-120-4987345";
  sheet.getCell("A4").alignment = { horizontal: "center" };

  // Empty space
  sheet.addRow([]);

  // QUOTATION TITLE
  sheet.mergeCells("A6:C6");
  sheet.getCell("A6").value = "Quotation NO:-";
  sheet.getCell("A6").font = { bold: true, size: 12 };

  sheet.mergeCells("D6:H6");
  sheet.getCell("D6").value = `Date: ${now.toLocaleDateString("en-IN")}`;
  sheet.getCell("D6").alignment = { horizontal: "right" };

  sheet.mergeCells("A7:H7");
  sheet.getCell("A7").value = `Project Name : ${company_name}`;
  sheet.getCell("A7").font = { bold: true };


  // ===============================
  // TABLE HEADER
  // ===============================

  sheet.addRow([]);
  const headerRow = sheet.addRow([
    "S.No", "Item Description", "Unit", "Quantity", "Rate", "Amount"
  ]);

  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };

  // Set column widths
  sheet.getColumn(1).width = 10;  
  sheet.getColumn(2).width = 40;
  sheet.getColumn(3).width = 12;
  sheet.getColumn(4).width = 12;
  sheet.getColumn(5).width = 15;
  sheet.getColumn(6).width = 18;

  // Add Borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    };
  });


  // ===============================
  // TABLE BODY (COSTING ITEMS)
  // ===============================

  let serial = 1;

  costingRows.forEach((item) => {
    const row = sheet.addRow([
      serial++,
      item.description,
      item.unit,
      item.qty,
      item.rate,
      item.amount
    ]);

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });

  // ===============================
  // FOOTER SECTION
  // ===============================

  sheet.addRow([]);
  sheet.addRow([]);
  const footer = sheet.addRow([`Prepared By: ${costing_name}`, "", "", "", "Checked By:"]);
  footer.font = { bold: true };

  sheet.getCell("A18").value = "PAYMENT TERMS AND CONDITION";
  sheet.getCell("A18").font = { size: 12, bold: true };
  sheet.getCell("A18").alignment = { horizontal: "left" };

  sheet.getCell("A19").value = "1   100% Advance";
  sheet.getCell("A19").alignment = { horizontal: "left" };

  sheet.getCell("A20").value = "2   Prices: Only Supply Rate, Taxes will be Extra, Freight Extra (GST 18%)";
  sheet.getCell("A20").alignment = { horizontal: "left" };

  sheet.getCell("A21").value = "3   Packing: Included";
  sheet.getCell("A21").alignment = { horizontal: "left" };

  sheet.getCell("A22").value = "4   Forwarding: Extra Charges";
  sheet.getCell("A22").alignment = { horizontal: "left" };

  sheet.getCell("A23").value = "5   Validity: 30days from date of offer";
  sheet.getCell("A23").alignment = { horizontal: "left" };

  sheet.getCell("A24").value = "6   Warranty: 1Year Against Manufacturing Defect";
  sheet.getCell("A24").alignment = { horizontal: "left" };

  sheet.getCell("A25").value = "7   Please visit www.heinrichlimited.com for Product datasheets";
  sheet.getCell("A25").alignment = { horizontal: "left" };

  sheet.getCell("A26").value = "8   Currency: INR";
  sheet.getCell("A26").alignment = { horizontal: "left" };

  // OUTPUT FILE

  await workbook.xlsx.writeFile(filePath);

  return filePath;
};