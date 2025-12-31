import pool from "../config/db.js";
import { validateSQL } from "../utils/validation.js";

// 执行SQL查询
export async function executeSQL(req, res) {
  try {
    const { sql } = req.body;

    if (!sql || typeof sql !== "string") {
      return res.status(400).json({
        success: false,
        message: "SQL语句是必需的",
      });
    }

    // 验证SQL（只允许SELECT查询）
    const validation = validateSQL(sql);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    // 执行SQL查询
    const [rows] = await pool.execute(sql);

    res.json({
      success: true,
      data: rows,
      affectedRows: rows.length,
    });
  } catch (error) {
    console.error("执行SQL错误:", error);
    res.status(500).json({
      success: false,
      message: "执行SQL失败",
      error: error.message,
    });
  }
}

