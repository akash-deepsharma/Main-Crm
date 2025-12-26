import React, { useState } from "react";
import TableSearch from "./TableSearch";
import TablePagination from "./TablePagination";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const Table = ({ data, columns }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  /** ------------------------------
   * STATE FOR CHECKBOX SELECTION
   * ------------------------------ */
  const [selectedRows, setSelectedRows] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /** ------------------------------
   * SELECT ALL HANDLER
   * ------------------------------ */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = table.getRowModel().rows.map((row) => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  /** ------------------------------
   * SINGLE ROW CHECKBOX HANDLER
   * ------------------------------ */
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  /** Check if ALL rows selected */
  const allSelected =
    selectedRows.length > 0 &&
    selectedRows.length === table.getRowModel().rows.length;

  return (
    <div className="card stretch stretch-full function-table">
      <div className="card-body p-0">
        <div className="table-responsive">
          <div className="dataTables_wrapper dt-bootstrap5 no-footer">
            <TableSearch
              table={table}
              setGlobalFilter={setGlobalFilter}
              globalFilter={globalFilter}
            />

            <div className="row dt-row">
              <div className="col-sm-12 px-0">
                <table
                  className="table table-hover table-bordered dataTable no-footer"
                  id="projectList"
                >
                  {/* ===========================================================
                      HEAD SECTION WITH ROWSPAN + COLSPAN
                  =========================================================== */}
                  <thead>
                    {table.getHeaderGroups().map(
                      (headerGroup, headerGroupIndex) => (
                        <React.Fragment key={headerGroup.id}>
                          {/* ========== MAIN HEADER ROW ========== */}
                          {headerGroupIndex === 0 && (
                            <tr>
                              {/* Select All Checkbox */}
                              <th rowSpan={2}>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                  />
                                </div>
                              </th>

                              {headerGroup.headers.map((header) => {
                                const colDef = header.column.columnDef;

                                if (colDef.isMonthGroup) {
                                  return (
                                    <th
                                      key={header.id}
                                      colSpan={2}
                                      style={{
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {colDef.header}
                                    </th>
                                  );
                                }

                                return (
                                  <th
                                    key={header.id}
                                    rowSpan={2}
                                    className={colDef.meta?.headerClassName}
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    <ArrowToggle header={header}>
                                      {flexRender(
                                        colDef.header,
                                        header.getContext()
                                      )}
                                    </ArrowToggle>
                                  </th>
                                );
                              })}
                            </tr>
                          )}

                          {/* ========== SUB HEADER ROW ========== */}
                          {headerGroupIndex === 1 && (
                            <tr>
                              {headerGroup.headers.map((header) => {
                                const colDef = header.column.columnDef;

                                if (colDef.isMonthSubColumn) {
                                  return (
                                    <th
                                      key={header.id}
                                      className="text-center"
                                    >
                                      {flexRender(
                                        colDef.header,
                                        header.getContext()
                                      )}
                                    </th>
                                  );
                                }

                                return null;
                              })}
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </thead>

                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="single-item chat-single-item">
                        {/* Row checkbox */}
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => handleSelectRow(row.id)}
                          />
                        </td>

                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={cell.column.columnDef.meta?.className}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <TablePagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

/* ===========================================================
   SORT ICON HANDLER
=========================================================== */
const ArrowToggle = ({ header, children }) => {
  const position = header.column.getIsSorted();

  return (
    <div
      className="table-head"
      style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
      onClick={header.column.getToggleSortingHandler()}
    >
      {children}

      {{
        asc: <FaSortUp size={13} opacity={1} />,
        desc: <FaSortDown size={13} opacity={1} />,
      }[position] || <FaSort size={13} opacity={0.2} />}
    </div>
  );
};
