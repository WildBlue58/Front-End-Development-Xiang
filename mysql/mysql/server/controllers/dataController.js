import pool from "../config/db.js";
import { sanitizeTableName } from "../utils/validation.js";
import {
  checkTableOrView,
  getPrimaryKey,
  getTableColumns,
} from "../utils/dbHelpers.js";

// 获取指定表的数据
export async function getTableData(req, res) {
  try {
    const { tableName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    // 验证表名，防止 SQL 注入
    const sanitizedTableName = sanitizeTableName(tableName);
    if (!sanitizedTableName) {
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
}

// 插入新记录
export async function insertData(req, res) {
  try {
    const { tableName } = req.params;
    const data = req.body;

    const sanitizedTableName = sanitizeTableName(tableName);
    if (!sanitizedTableName) {
      return res.status(400).json({
        success: false,
        message: "无效的表名",
      });
    }

    // 检查表是否存在
    const tableType = await checkTableOrView(sanitizedTableName);
    if (!tableType || tableType === "VIEW") {
      return res.status(404).json({
        success: false,
        message: "表不存在或不能对视图进行插入操作",
      });
    }

    // 获取表的列信息
    const columns = await getTableColumns(sanitizedTableName);
    if (columns.length === 0) {
      return res.status(404).json({
        success: false,
        message: "无法获取表的列信息",
      });
    }

    // 过滤掉不存在的列和自动生成的列（如 AUTO_INCREMENT）
    const validColumns = columns.filter(
      (col) => !col.EXTRA.includes("auto_increment")
    );
    const columnNames = validColumns.map((col) => col.COLUMN_NAME);
    const dataColumns = Object.keys(data).filter((key) =>
      columnNames.includes(key)
    );

    if (dataColumns.length === 0) {
      return res.status(400).json({
        success: false,
        message: "没有有效的列数据",
      });
    }

    // 构建 INSERT 语句
    const placeholders = dataColumns.map(() => "?").join(", ");
    const columnList = dataColumns.map((col) => `\`${col}\``).join(", ");
    const values = dataColumns.map((col) => data[col]);

    const sql = `INSERT INTO \`${sanitizedTableName}\` (${columnList}) VALUES (${placeholders})`;

    const [result] = await pool.execute(sql, values);

    res.json({
      success: true,
      message: "记录插入成功",
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("插入数据错误:", error);
    res.status(500).json({
      success: false,
      message: "插入数据失败",
      error: error.message,
    });
  }
}

// 更新记录
export async function updateData(req, res) {
  try {
    const { tableName } = req.params;
    const { id, idColumn, ...data } = req.body;

    const sanitizedTableName = sanitizeTableName(tableName);
    if (!sanitizedTableName) {
      return res.status(400).json({
        success: false,
        message: "无效的表名",
      });
    }

    // 检查表是否存在
    const tableType = await checkTableOrView(sanitizedTableName);
    if (!tableType || tableType === "VIEW") {
      return res.status(404).json({
        success: false,
        message: "表不存在或不能对视图进行更新操作",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "缺少记录ID",
      });
    }

    // 确定主键列名
    let primaryKey = idColumn;
    if (!primaryKey) {
      primaryKey = await getPrimaryKey(sanitizedTableName);
      if (!primaryKey) {
        return res.status(400).json({
          success: false,
          message: "无法确定主键列，请指定 idColumn",
        });
      }
    }

    // 获取表的列信息
    const columns = await getTableColumns(sanitizedTableName);
    const columnNames = columns.map((col) => col.COLUMN_NAME);
    const dataColumns = Object.keys(data).filter((key) =>
      columnNames.includes(key)
    );

    if (dataColumns.length === 0) {
      return res.status(400).json({
        success: false,
        message: "没有有效的列数据",
      });
    }

    // 构建 UPDATE 语句
    const setClause = dataColumns.map((col) => `\`${col}\` = ?`).join(", ");
    const values = dataColumns.map((col) => data[col]);
    values.push(id); // 添加 WHERE 条件的值

    const sql = `UPDATE \`${sanitizedTableName}\` SET ${setClause} WHERE \`${primaryKey}\` = ?`;

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "未找到要更新的记录",
      });
    }

    res.json({
      success: true,
      message: "记录更新成功",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("更新数据错误:", error);
    res.status(500).json({
      success: false,
      message: "更新数据失败",
      error: error.message,
    });
  }
}

// 删除记录
export async function deleteData(req, res) {
  try {
    const { tableName } = req.params;
    const { id, idColumn } = req.body;

    const sanitizedTableName = sanitizeTableName(tableName);
    if (!sanitizedTableName) {
      return res.status(400).json({
        success: false,
        message: "无效的表名",
      });
    }

    // 检查表是否存在
    const tableType = await checkTableOrView(sanitizedTableName);
    if (!tableType || tableType === "VIEW") {
      return res.status(404).json({
        success: false,
        message: "表不存在或不能对视图进行删除操作",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "缺少记录ID",
      });
    }

    // 确定主键列名
    let primaryKey = idColumn;
    if (!primaryKey) {
      primaryKey = await getPrimaryKey(sanitizedTableName);
      if (!primaryKey) {
        return res.status(400).json({
          success: false,
          message: "无法确定主键列，请指定 idColumn",
        });
      }
    }

    // 构建 DELETE 语句
    const sql = `DELETE FROM \`${sanitizedTableName}\` WHERE \`${primaryKey}\` = ?`;

    const [result] = await pool.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "未找到要删除的记录",
      });
    }

    res.json({
      success: true,
      message: "记录删除成功",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("删除数据错误:", error);
    res.status(500).json({
      success: false,
      message: "删除数据失败",
      error: error.message,
    });
  }
}
