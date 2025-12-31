import mysql from "mysql2/promise";

// MySQL 数据库连接配置
export const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
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

export default pool;
