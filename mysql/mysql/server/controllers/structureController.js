import pool from "../config/db.js";
import { dbConfig } from "../config/db.js";
import { sanitizeTableName } from "../utils/validation.js";
import {
  checkTableOrView,
  getTableColumns,
  getTableConstraints,
} from "../utils/dbHelpers.js";

// 获取表结构
export async function getTableStructure(req, res) {
  try {
    const { tableName } = req.params;

    const sanitizedTableName = sanitizeTableName(tableName);
    if (!sanitizedTableName) {
      return res.status(400).json({
        success: false,
        message: "无效的表名",
      });
    }

    // 检查表是否存在
    const tableType = await checkTableOrView(sanitizedTableName);
    if (!tableType) {
      return res.status(404).json({
        success: false,
        message: "表或视图不存在",
      });
    }

    // 获取列信息
    const columns = await getTableColumns(sanitizedTableName);
    const constraints = await getTableConstraints(sanitizedTableName);

    res.json({
      success: true,
      data: {
        tableName: sanitizedTableName,
        tableType,
        columns,
        constraints,
      },
    });
  } catch (error) {
    console.error("获取表结构错误:", error);
    res.status(500).json({
      success: false,
      message: "获取表结构失败",
      error: error.message,
    });
  }
}

// 创建新表
export async function createTable(req, res) {
  try {
    const { tableName, columns } = req.body;

    if (
      !tableName ||
      !columns ||
      !Array.isArray(columns) ||
      columns.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "表名和列定义是必需的",
      });
    }

    const sanitizedTableName = sanitizeTableName(tableName);
    if (!sanitizedTableName) {
      return res.status(400).json({
        success: false,
        message: "无效的表名",
      });
    }

    // 检查表是否已存在
    const existingTable = await checkTableOrView(sanitizedTableName);
    if (existingTable) {
      return res.status(409).json({
        success: false,
        message: "表已存在",
      });
    }

    // 构建 CREATE TABLE 语句
    const columnDefinitions = columns.map((col) => {
      let def = `\`${col.name}\` ${col.type}`;
      if (col.length) {
        def += `(${col.length})`;
      }
      if (col.notNull) {
        def += " NOT NULL";
      }
      if (col.defaultValue !== undefined && col.defaultValue !== null) {
        def += ` DEFAULT '${col.defaultValue}'`;
      }
      if (col.autoIncrement) {
        def += " AUTO_INCREMENT";
      }
      if (col.primaryKey) {
        def += " PRIMARY KEY";
      }
      return def;
    });

    const sql = `CREATE TABLE \`${sanitizedTableName}\` (${columnDefinitions.join(
      ", "
    )})`;

    await pool.execute(sql);

    res.json({
      success: true,
      message: "表创建成功",
      tableName: sanitizedTableName,
    });
  } catch (error) {
    console.error("创建表错误:", error);
    res.status(500).json({
      success: false,
      message: "创建表失败",
      error: error.message,
    });
  }
}

// 修改表结构（添加列）
export async function alterTable(req, res) {
  try {
    const { tableName } = req.params;
    const { action, column } = req.body; // action: 'add', 'drop', 'modify'

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
        message: "表不存在或不能修改视图结构",
      });
    }

    let sql = "";
    if (action === "add" && column) {
      let def = `\`${column.name}\` ${column.type}`;
      if (column.length) {
        def += `(${column.length})`;
      }
      if (column.notNull) {
        def += " NOT NULL";
      }
      if (column.defaultValue !== undefined && column.defaultValue !== null) {
        def += ` DEFAULT '${column.defaultValue}'`;
      }
      sql = `ALTER TABLE \`${sanitizedTableName}\` ADD COLUMN ${def}`;
    } else if (action === "drop" && column && column.name) {
      sql = `ALTER TABLE \`${sanitizedTableName}\` DROP COLUMN \`${column.name}\``;
    } else if (action === "modify" && column) {
      let def = `\`${column.name}\` ${column.type}`;
      if (column.length) {
        def += `(${column.length})`;
      }
      if (column.notNull) {
        def += " NOT NULL";
      }
      if (column.defaultValue !== undefined && column.defaultValue !== null) {
        def += ` DEFAULT '${column.defaultValue}'`;
      }
      sql = `ALTER TABLE \`${sanitizedTableName}\` MODIFY COLUMN ${def}`;
    } else {
      return res.status(400).json({
        success: false,
        message: "无效的操作或列定义",
      });
    }

    await pool.execute(sql);

    res.json({
      success: true,
      message: "表结构修改成功",
    });
  } catch (error) {
    console.error("修改表结构错误:", error);
    res.status(500).json({
      success: false,
      message: "修改表结构失败",
      error: error.message,
    });
  }
}
