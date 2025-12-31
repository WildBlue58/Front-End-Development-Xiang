import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
const PORT = 3001;

// 启用 CORS
app.use(cors());
app.use(express.json());

// 注册路由
app.use("/api", routes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
