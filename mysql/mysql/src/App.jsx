import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("检查中...");

  // 检查数据库连接
  useEffect(() => {
    checkConnection();
    loadTables();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await axios.get("/api/test");
      if (response.data.success) {
        setConnectionStatus("已连接");
      } else {
        setConnectionStatus("连接失败");
      }
    } catch (err) {
      setConnectionStatus("连接失败");
      setError("无法连接到后端服务器，请确保后端服务已启动");
    }
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/tables");
      if (response.data.success) {
        // 处理新的数据结构：可能是对象数组 {name, type} 或旧的格式
        let tableNames = [];
        if (response.data.data && response.data.data.length > 0) {
          if (
            typeof response.data.data[0] === "object" &&
            response.data.data[0].name
          ) {
            // 新格式：对象数组
            tableNames = response.data.data.map((table) => table.name);
          } else {
            // 旧格式：对象，需要提取表名
            const tableKey =
              Object.keys(response.data.data[0] || {})[0] ||
              "Tables_in_enterprise_power";
            tableNames = response.data.data.map((table) => table[tableKey]);
          }
        }
        setTables(tableNames);
        if (tableNames.length > 0 && !selectedTable) {
          setSelectedTable(tableNames[0]);
        }
      }
    } catch (err) {
      setError(
        "获取表列表失败: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName) => {
    try {
      setLoading(true);
      setError(null);
      setTableData(null);
      const response = await axios.get(`/api/data/${tableName}`, {
        params: { page: 1, limit: 100 },
      });
      if (response.data.success) {
        setTableData(response.data);
      } else {
        setError(response.data.message || "获取数据失败");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || err.message;
      const fullError = err.response?.data?.details
        ? `${errorMsg}\n详细信息: ${err.response.data.details}`
        : errorMsg;
      setError("获取数据失败: " + fullError);
      setTableData(null);
      console.error("加载表数据错误:", {
        message: errorMsg,
        response: err.response?.data,
        error: err,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  }, [selectedTable]);

  const renderTable = (data) => {
    if (!data || !data.data) {
      return <p className="empty-message">数据格式错误</p>;
    }

    if (data.data.length === 0) {
      return <p className="empty-message">表中没有数据</p>;
    }

    const columns = Object.keys(data.data[0]);

    if (columns.length === 0) {
      return <p className="empty-message">表中没有列</p>;
    }

    return (
      <div className="table-container">
        <div className="table-info">
          <h3>
            {data.tableType === "VIEW" ? "视图" : "表"}: {selectedTable}
            {data.tableType === "VIEW" && (
              <span className="view-badge">视图</span>
            )}
          </h3>
          {data.pagination && (
            <p>
              共 {data.pagination.total} 条记录，当前显示 {data.data.length} 条
              （第 {data.pagination.page} 页，共 {data.pagination.totalPages}{" "}
              页）
            </p>
          )}
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => {
                    const cellValue = row[col];
                    let displayValue = "";

                    if (cellValue === null || cellValue === undefined) {
                      displayValue = <span className="null-value">NULL</span>;
                    } else if (typeof cellValue === "object") {
                      displayValue = JSON.stringify(cellValue);
                    } else {
                      displayValue = String(cellValue);
                    }

                    return (
                      <td key={col} title={String(cellValue)}>
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Enterprise Power 数据库查看器</h1>
        <div className="connection-status">
          连接状态:{" "}
          <span
            className={
              connectionStatus === "已连接"
                ? "status-connected"
                : "status-error"
            }
          >
            {connectionStatus}
          </span>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <h2>数据表列表</h2>
          <button onClick={loadTables} className="refresh-btn">
            刷新列表
          </button>
          {loading && <p>加载中...</p>}
          <ul className="table-list">
            {tables.map((table) => (
              <li
                key={table}
                className={selectedTable === table ? "active" : ""}
                onClick={() => setSelectedTable(table)}
              >
                {table}
              </li>
            ))}
          </ul>
        </aside>

        <main className="content-area">
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}
          {loading && !tableData && <p>加载数据中...</p>}
          {tableData && renderTable(tableData)}
          {!loading && !tableData && !error && selectedTable && (
            <p>选择左侧的数据表以查看数据</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
