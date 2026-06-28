import pool from "./db.js";

export default async function handler(req, res) {
  // GET test (optional debug)
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query("SELECT 1 + 2 AS result");

      return res.status(200).json({
        success: true,
        message: "Backend connected to MySQL",
        data: rows,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  // POST insert quotation
  if (req.method === "POST") {
    try {
      const {
        quote_ref,
        project_name,
        client_name,
        scope,
        sale_center,
        sales_person,
        value_amount,
        gp_amount,
        status,
        revision_count,
        remark
      } = req.body;

      const sql = `
        INSERT INTO quotations
        (quote_ref, project_name, client_name, scope, sale_center, sales_person, value_amount, gp_amount, status, revision_count, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(sql, [
        quote_ref,
        project_name,
        client_name,
        scope,
        sale_center,
        sales_person,
        value_amount,
        gp_amount,
        status,
        revision_count,
        remark
      ]);

      return res.status(200).json({
        success: true,
        id: result.insertId
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}