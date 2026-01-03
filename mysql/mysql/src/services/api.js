import axios from "axios";

// 创建axios实例
const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "请求失败";
    return Promise.reject(new Error(message));
  }
);

// 表相关API
export const tableAPI = {
  // 测试数据库连接
  testConnection: () => api.get("/test"),

  // 获取所有表
  getTables: () => api.get("/tables"),

  // 获取所有表的数据
  getAllData: () => api.get("/all-data"),
};

// 数据操作API
export const dataAPI = {
  // 获取表数据
  getTableData: (tableName, page = 1, limit = 100) =>
    api.get(`/data/${tableName}`, { params: { page, limit } }),

  // 插入数据
  insertData: (tableName, data) => api.post(`/data/${tableName}`, data),

  // 更新数据
  updateData: (tableName, id, idColumn, data) =>
    api.put(`/data/${tableName}`, { id, idColumn, ...data }),

  // 删除数据
  deleteData: (tableName, id, idColumn) =>
    api.delete(`/data/${tableName}`, {
      data: { id, idColumn },
      headers: {
        "Content-Type": "application/json",
      },
    }),
};

// 表结构管理API
export const structureAPI = {
  // 获取表结构
  getTableStructure: (tableName) => api.get(`/table-structure/${tableName}`),

  // 创建表
  createTable: (tableName, columns) =>
    api.post("/table-structure", { tableName, columns }),

  // 修改表结构
  alterTable: (tableName, action, column) =>
    api.put(`/table-structure/${tableName}`, { action, column }),
};

// SQL执行器API
export const sqlAPI = {
  // 执行SQL查询
  executeSQL: (sql) => api.post("/execute-sql", { sql }),
};

export default api;
