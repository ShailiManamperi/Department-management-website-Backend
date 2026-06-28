import { db } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      quote_ref,project_name,client_name,scope,sale_center,sales_person,value_amount,gp_amount,status,revision_count,remark
    } = req.body;

    const sql = `
      INSERT INTO quotations 
      (quote_ref, project_name, client_name, scope, sale_center, sales_person, value_amount, gp_amount, status, revision_count, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      quote_ref,project_name,client_name,scope,sale_center,sales_person,value_amount,gp_amount,status,revision_count,remark
    ]);

    res.status(200).json({
      success: true,
      id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}