import connectDB from "./db.js";
import Student from "../model/Students.js";

export default async function handler(req, res) {
  try {
    await connectDB();

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // GET students
    if (req.method === "GET") {
      const data = await Student.find();
      return res.status(200).json(data);
    }

    // POST student
    if (req.method === "POST") {
      const data = await Student.create(req.body);
      return res.status(201).json(data);
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error(error); // IMPORTANT for Vercel logs
    return res.status(500).json({ error: error.message });
  }
}