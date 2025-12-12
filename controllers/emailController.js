const db = require("../db");
const { generatePDF } = require("../services/pdfservice");
const { sendEmailSMTP } = require("../services/emailService");
const { path } = require("pdfkit");
const { generateExcel } = require("../services/excelService");

exports.sendEmailController = async (req, res) => {
  try {
    const { email, client_name, subject, costing_name } = req.body;

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
    await sendEmailSMTP({
      to: email,
      subject: `Quotation - ${costing_name}`,
      message: `Dear ${client_name},\n\nPlease find attached your quotation for ${costing_name}.\n\nRegards,\nHeinrich ERP`,
      attachments: [
        {
          filename: pdfPath.split("/").pop(),
          path: pdfPath
        },
        {
          filename: excelPath.split("/").pop(),
          path: excelPath
        }
      ]
    });

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
    res.json({ success: false, message: "Error sending email." });
  }
};