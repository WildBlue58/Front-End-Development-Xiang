# Enterprise Power 数据库查看器

## 项目说明

这是一个用于连接和查看 MySQL 数据库 `enterprise_power` 的前后端分离项目。

## 功能特性

1. 连接到 MySQL 中的 `enterprise_power` 数据库
2. 将数据库中的内容显示到前端页面上
3. 支持查看所有数据表
4. 支持查看每个表的详细数据
5. 实时显示数据库连接状态

## 安装步骤

### 1. 安装前端依赖

```bash
cd mysql/mysql
pnpm install
```

### 2. 安装后端依赖

```bash
cd mysql/mysql/server
pnpm install
```

或者使用 npm：

```bash
cd mysql/mysql/server
npm install
```

### 3. 配置数据库连接

编辑 `mysql/mysql/server/index.js` 文件，修改数据库连接配置：

```javascript
const dbConfig = {
  host: 'localhost',        // 数据库主机地址
  user: 'root',             // 数据库用户名
  password: '',             // 数据库密码
  database: 'enterprise_power', // 数据库名称
};
```

## 运行项目

### 1. 启动后端服务器

在一个终端窗口中运行：

```bash
cd mysql/mysql/server
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

后端服务器将在 `http://localhost:3001` 启动。

### 2. 启动前端开发服务器

在另一个终端窗口中运行：

```bash
cd mysql/mysql
pnpm dev
```

前端应用将在 `http://localhost:5173` 启动（Vite 默认端口）。

## 使用说明

1. 确保 MySQL 服务正在运行
2. 确保 `enterprise_power` 数据库存在
3. 启动后端服务器
4. 启动前端开发服务器
5. 在浏览器中打开前端应用
6. 查看左侧的数据表列表，点击表名查看数据

## API 端点

后端提供以下 API 端点：

- `GET /api/test` - 测试数据库连接
- `GET /api/tables` - 获取所有表名
- `GET /api/data/:tableName` - 获取指定表的数据（支持分页）
- `GET /api/all-data` - 获取所有表的数据

## 项目结构

```bash
mysql/
├── server/              # 后端服务器
│   ├── index.js        # 服务器主文件
│   └── package.json    # 后端依赖配置
├── src/                # 前端源代码
│   ├── App.jsx         # 主应用组件
│   ├── App.css         # 应用样式
│   └── main.jsx        # 入口文件
├── package.json        # 前端依赖配置
└── vite.config.js      # Vite 配置（包含代理设置）
```

## 注意事项

- 确保 MySQL 服务已启动
- 确保数据库用户有足够的权限访问 `enterprise_power` 数据库
- 如果遇到 CORS 错误，检查后端服务器的 CORS 配置
- 如果无法连接，检查数据库配置信息是否正确
