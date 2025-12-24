const db = require("../db");
const { generatePDF } = require("../services/pdfservice");
const { sendMail } = require("../services/emailService");
const { generateExcel } = require("../services/excelService");
const fs = require("fs");
const path = require("path");

exports.sendEmailController = async (req, res) => {
  try {
    const { email, client_name, costing_name } = req.body;

    // Fetch ALL costing rows for the selected costingName
    const result = await db.query(
      "SELECT * FROM costing WHERE costing_name = $1",
      [costing_name]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Costing not found!" });
    }

    const costingRows = result.rows;

    // Generate PDF
    const pdfPath = await generatePDF(client_name, costing_name, costingRows);
    const excelPath = await generateExcel(client_name, costing_name, costingRows);

    // Send email with PDF

    console.log("PDF PATH:", pdfPath);
    console.log("EXCEL PATH:", excelPath);
    
    if(!pdfPath || !excelPath){
      throw new Error("Attachment file path is missing");
    }

    const pdfBase64 = fs.readFileSync(pdfPath).toString("base64");
    const excelBase64 = fs.readFileSync(excelPath).toString("base64");

    try{
      await sendMail({
      to: email,
      subject: `Quotation - ${costing_name}`,
      message: `Dear ${client_name},\n\nPlease find attached your quotation for ${costing_name}.\n\nRegards,\nHeinrich ERP`,
      attachments: [
        {
          filename: path.basename(pdfPath),
          content: pdfBase64,
          type: "application/pdf",
          disposition:'attachment'
        },
        {
          filename: path.basename(excelPath),
          content: excelBase64,
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          disposition: "attachment"
        }
      ]
    });
  } catch (mailError){
    console.error("SENDGRID ERROR:", mailError.response?.body || mailError.message);
    return res.status(500).json({
      success:false,
      message: "Email sending failed"
    });
  }

    await db.query(
      `INSERT INTO email_logs (client_name, costing_name, email_to, pdf_path, status)
      VALUES($1, $2, $3, $4, 'SENT')`,
      [client_name, costing_name, email,pdfPath,]
    );

    res.json({ success: true, message: "Email sent successfully!" });

  } catch (err) {
    console.log(err);

    try{
      await db.query(
        `INSERT INTO email_logs 
        (client_name, costing_name, email_to, status)
        VALUES ($1,$2,$3, 'FAILED)`
        [req.body.client_name, req.body.costing_name, req.body.email]
      );
    } catch (e) {
      console.log("ERROR SAVING FAILED LOGS", e);
    }
  }
};