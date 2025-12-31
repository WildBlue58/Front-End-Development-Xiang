import pool from "../config/db.js";
import { dbConfig } from "../config/db.js";

// 测试数据库连接
export async function testConnection(req, res) {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ success: true, message: "数据库连接成功" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "数据库连接失败",
      error: error.message,
    });
  }
}

// 获取所有表名和视图名
export async function getTables(req, res) {
  try {
    const [tables] = await pool.execute("SHOW FULL TABLES");
    console.log("获取到表列表:", tables);

    // 处理表名，区分表和视图
    const tableKey =
      Object.keys(tables[0] || {})[0] || "Tables_in_enterprise_power";
    const typeKey = Object.keys(tables[0] || {})[1] || "Table_type";

    const processedTables = tables.map((table) => ({
      name: table[tableKey],
      type: table[typeKey] || "BASE TABLE",
    }));

    res.json({ success: true, data: processedTables });
  } catch (error) {
    console.error("获取表列表错误:", error);
    res.status(500).json({
      success: false,
      message: "获取表列表失败",
      error: error.message,
    });
  }
}

// 获取所有表的数据（简化版，用于快速展示）
export async function getAllData(req, res) {
  try {
    const [tables] = await pool.execute("SHOW TABLES");
    const tableKey =
      Object.keys(tables[0] || {})[0] || "Tables_in_enterprise_power";

    const allData = {};

    for (const table of tables) {
      const tableName = table[tableKey];
      try {
        // 使用反引号包裹表名
        const [rows] = await pool.execute(
          `SELECT * FROM \`${tableName}\` LIMIT 100`
        );
        allData[tableName] = rows;
      } catch (error) {
        console.error(`获取表 ${tableName} 数据失败:`, error);
        allData[tableName] = { error: error.message };
      }
    }

    res.json({ success: true, data: allData });
  } catch (error) {
    console.error("获取所有数据错误:", error);
    res.status(500).json({
      success: false,
      message: "获取数据失败",
      error: error.message,
    });
  }
}
