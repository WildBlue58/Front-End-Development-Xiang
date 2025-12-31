import express from "express";
import {
  testConnection,
  getTables,
  getAllData,
} from "../controllers/tableController.js";
import {
  getTableData,
  insertData,
  updateData,
  deleteData,
} from "../controllers/dataController.js";
import {
  getTableStructure,
  createTable,
  alterTable,
} from "../controllers/structureController.js";
import { executeSQL } from "../controllers/sqlController.js";

const router = express.Router();

// 测试连接
router.get("/test", testConnection);

// 表相关路由
router.get("/tables", getTables);
router.get("/all-data", getAllData);

// 数据操作路由
router.get("/data/:tableName", getTableData);
router.post("/data/:tableName", insertData);
router.put("/data/:tableName", updateData);
router.delete("/data/:tableName", deleteData);

// 表结构管理路由
router.get("/table-structure/:tableName", getTableStructure);
router.post("/table-structure", createTable);
router.put("/table-structure/:tableName", alterTable);

// SQL执行器路由
router.post("/execute-sql", executeSQL);

export default router;

