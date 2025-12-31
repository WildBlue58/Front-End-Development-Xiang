import pool, { dbConfig } from "../config/db.js";

// 检查对象是表还是视图
export async function checkTableOrView(tableName) {
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

// 获取表的主键列名
export async function getPrimaryKey(tableName) {
  try {
    const [result] = await pool.execute(
      `SELECT COLUMN_NAME 
       FROM information_schema.KEY_COLUMN_USAGE 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = ? 
       AND CONSTRAINT_NAME = 'PRIMARY'`,
      [dbConfig.database, tableName]
    );
    return result.length > 0 ? result[0].COLUMN_NAME : null;
  } catch (error) {
    console.error(`获取主键错误: ${tableName}`, error);
    return null;
  }
}

// 获取表的列信息
export async function getTableColumns(tableName) {
  try {
    const [columns] = await pool.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY, EXTRA, COLUMN_TYPE, CHARACTER_MAXIMUM_LENGTH
       FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
       ORDER BY ORDINAL_POSITION`,
      [dbConfig.database, tableName]
    );
    return columns;
  } catch (error) {
    console.error(`获取列信息错误: ${tableName}`, error);
    return [];
  }
}

// 获取表的主键、外键、索引信息
export async function getTableConstraints(tableName) {
  try {
    // 获取主键
    const [primaryKeys] = await pool.execute(
      `SELECT COLUMN_NAME 
       FROM information_schema.KEY_COLUMN_USAGE 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = ? 
       AND CONSTRAINT_NAME = 'PRIMARY'`,
      [dbConfig.database, tableName]
    );

    // 获取外键
    const [foreignKeys] = await pool.execute(
      `SELECT 
         CONSTRAINT_NAME,
         COLUMN_NAME,
         REFERENCED_TABLE_NAME,
         REFERENCED_COLUMN_NAME
       FROM information_schema.KEY_COLUMN_USAGE 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = ? 
       AND REFERENCED_TABLE_NAME IS NOT NULL`,
      [dbConfig.database, tableName]
    );

    // 获取索引
    const [indexes] = await pool.execute(
      `SELECT 
         INDEX_NAME,
         COLUMN_NAME,
         NON_UNIQUE,
         SEQ_IN_INDEX
       FROM information_schema.STATISTICS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = ?
       ORDER BY INDEX_NAME, SEQ_IN_INDEX`,
      [dbConfig.database, tableName]
    );

    return {
      primaryKeys: primaryKeys.map((pk) => pk.COLUMN_NAME),
      foreignKeys,
      indexes,
    };
  } catch (error) {
    console.error(`获取约束信息错误: ${tableName}`, error);
    return { primaryKeys: [], foreignKeys: [], indexes: [] };
  }
}

