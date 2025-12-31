// 验证表名，防止 SQL 注入
export function sanitizeTableName(tableName) {
  const sanitized = tableName.replace(/[^a-zA-Z0-9_]/g, "");
  if (!sanitized || sanitized !== tableName) {
    return null;
  }
  return sanitized;
}

// 验证SQL语句，防止危险操作
export function validateSQL(sql) {
  const upperSQL = sql.trim().toUpperCase();
  const dangerousKeywords = [
    "DROP",
    "TRUNCATE",
    "ALTER",
    "CREATE",
    "DELETE",
    "UPDATE",
    "INSERT",
  ];

  // 允许 SELECT 查询
  if (upperSQL.startsWith("SELECT")) {
    return { valid: true, message: "允许执行SELECT查询" };
  }

  // 检查是否包含危险关键字
  for (const keyword of dangerousKeywords) {
    if (upperSQL.includes(keyword)) {
      return {
        valid: false,
        message: `检测到危险操作: ${keyword}，出于安全考虑，请使用专门的API接口`,
      };
    }
  }

  return { valid: true, message: "SQL验证通过" };
}
