import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const PORT = 3001;

// 启用 CORS
app.use(cors());
app.use(express.json());

// MySQL 数据库连接配置
const dbConfig = {
  host: "localhost",
  user: "root", // 请根据实际情况修改
  password: "123456", // 请根据实际情况修改
  database: "enterprise_power",
};

// 创建数据库连接池
let pool;

try {
  pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("数据库连接池创建成功");
} catch (error) {
  console.error("数据库连接池创建失败:", error);
}

// 测试数据库连接
app.get("/api/test", async (req, res) => {
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
});

// 检查对象是表还是视图
async function checkTableOrView(tableName) {
  try {
    const [result] = await pool.execute(
      `SELECT TABLE_TYPE FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [dbConfig.database, tableName]
    );
    if (result.length > 0) {
      return result[0].TABLE_TYPE; // 'BASE TABLE' 或 'VIEW'
    }
    return null;
  } catch (error) {
    console.error(`检查表/视图类型错误: ${tableName}`, error);
    return null;
  }
}

// 获取所有表名和视图名
app.get("/api/tables", async (req, res) => {
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
});

// 获取指定表的数据
app.get("/api/data/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    // 验证表名，防止 SQL 注入
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, "");
    if (!sanitizedTableName || sanitizedTableName !== tableName) {
      return res.status(400).json({
        success: false,
        message: "无效的表名",
      });
    }

    // 检查是表还是视图
    const tableType = await checkTableOrView(sanitizedTableName);
    if (!tableType) {
      return res.status(404).json({
        success: false,
        message: "表或视图不存在",
      });
    }

    // 获取总数 - 使用反引号包裹表名
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM \`${sanitizedTableName}\``
    );
    const total = Number(countResult[0].total);

    // 获取分页数据 - 确保 limit 和 offset 都是整数
    // MySQL 的 LIMIT 和 OFFSET 必须是非负整数
    // 注意：LIMIT 和 OFFSET 不能使用占位符，需要直接拼接
    const limitInt = Math.max(1, Math.min(limit, 1000)); // 限制最大1000条
    const offsetInt = Math.max(0, offset);

    // 验证参数是安全的整数
    if (!Number.isInteger(limitInt) || !Number.isInteger(offsetInt)) {
      throw new Error("分页参数必须是整数");
    }

    const [rows] = await pool.execute(
      `SELECT * FROM \`${sanitizedTableName}\` LIMIT ${limitInt} OFFSET ${offsetInt}`
    );

    res.json({
      success: true,
      data: rows,
      tableType: tableType,
      pagination: {
        total,
        page: page,
        limit: limitInt,
        totalPages: Math.ceil(total / limitInt),
      },
    });
  } catch (error) {
    console.error("获取数据错误:", error);
    console.error("错误堆栈:", error.stack);
    res.status(500).json({
      success: false,
      message: "获取数据失败",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// 获取所有表的数据（简化版，用于快速展示）
app.get("/api/all-data", async (req, res) => {
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
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
