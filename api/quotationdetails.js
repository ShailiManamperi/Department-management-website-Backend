import pool from "./db.js";

const allowedOrigin =
  "https://deparmentmanagementwebsite.shailimanamperi2002.workers.dev";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =========================
  // GET (quote + revisions)
  // =========================
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      console.log(id);
      const [quote] = await pool.query(
        "SELECT * FROM quotations WHERE id = ?",
        [id]
      );
      console.log(quote);

      const [revisions] = await pool.query(
        "SELECT * FROM quotation_revisions WHERE quote_id = ? ORDER BY id DESC",
        [id]
      );

      return res.status(200).json({
        success: true,
        quote: quote[0],
        revisions
      });

    } catch (err) {
      console.error("GET error:", err);

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  // =========================
  // POST (add revision)
  // =========================
  if (req.method === "POST") {
    try {
      const { quote_id, quote_ref, value_amount } = req.body;

      const [result] = await pool.query(
        `INSERT INTO quotation_revisions (quote_id, quote_ref, value_amount)
         VALUES (?, ?, ?)`,
        [quote_id, quote_ref, value_amount]
      );

      return res.status(200).json({
        success: true,
        id: result.insertId
      });

    } catch (err) {
      console.error("POST error:", err);

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  // =========================
  // METHOD NOT ALLOWED
  // =========================
  return res.status(405).json({
    success: false,
    message: "Method Not Allowed"
  });
}

