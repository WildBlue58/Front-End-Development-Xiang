function TableStructureViewer({ structure }) {
  if (!structure) return null;

  return (
    <div className="flex flex-col gap-8 p-6 overflow-y-auto w-full">
      <div className="flex flex-col gap-4">
        <h3 className="text-slate-100 font-semibold text-lg border-b border-white/10 pb-2">
          列信息
        </h3>
        <div className="w-full overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm text-left border-collapse min-w-full">
            <thead className="bg-slate-900 text-slate-400 font-medium uppercase text-xs tracking-wider">
              <tr>
                {["Field", "Type", "Null", "Key", "Default", "Extra"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-5 py-3 border-b border-white/10 whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/10">
              {structure.columns.map((col) => (
                <tr
                  key={col.COLUMN_NAME}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-slate-200">
                    {col.COLUMN_NAME}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {col.COLUMN_TYPE}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {col.IS_NULLABLE === "YES" ? (
                      <span className="text-slate-500">YES</span>
                    ) : (
                      <span className="text-red-400 font-medium text-xs bg-red-400/10 px-1.5 py-0.5 rounded">
                        NO
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {col.COLUMN_KEY === "PRI" && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        PRIMARY
                      </span>
                    )}
                    {col.COLUMN_KEY === "MUL" && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        INDEX
                      </span>
                    )}
                    {col.COLUMN_KEY === "UNI" && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        UNIQUE
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs">
                    {col.COLUMN_DEFAULT === null ? (
                      <span className="text-slate-600 italic">NULL</span>
                    ) : (
                      col.COLUMN_DEFAULT
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-400 italic text-xs">
                    {col.EXTRA}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {structure.indexes && structure.indexes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-slate-100 font-semibold text-lg border-b border-white/10 pb-2">
            索引信息
          </h3>
          <div className="w-full overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm text-left border-collapse min-w-full">
              <thead className="bg-slate-900 text-slate-400 font-medium uppercase text-xs tracking-wider">
                <tr>
                  {[
                    "Key Name",
                    "Non-Unique",
                    "Column Name",
                    "Collation",
                    "Cardinality",
                    "Index Type",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-3 border-b border-white/10 whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/10">
                {structure.indexes.map((idx, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-300">
                      {idx.INDEX_NAME}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {idx.NON_UNIQUE == 1 ? "Yes" : "No"}
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {idx.COLUMN_NAME}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {idx.COLLATION}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {idx.CARDINALITY}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {idx.INDEX_TYPE}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableStructureViewer;
