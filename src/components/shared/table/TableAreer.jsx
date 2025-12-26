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

const TableAreer = ({ data, columns }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedRows, setSelectedRows] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination, sorting },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(table.getRowModel().rows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

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
                <table className="table table-hover table-bordered dataTable no-footer">
                  {/* ================= HEADERS ================= */}
                  <thead>
                    {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
                      <React.Fragment key={headerGroup.id}>
                        {/* ===== MAIN HEADER ROW ===== */}
                        {headerGroupIndex === 0 && (
                          <tr>
                            {/* Select All Checkbox */}
                            <th rowSpan={2}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={allSelected}
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </th>

                            {headerGroup.headers.map((header) => {
                              const colDef = header.column.columnDef;

                              // Rate or Day Group
                              if (colDef.isRate || colDef.isDay) {
                                return (
                                  <th
                                    key={header.id}
                                    colSpan={colDef.columns.length}
                                    className="text-center"
                                  >
                                    {colDef.header}
                                  </th>
                                );
                              }

                              // Regular columns
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

                        {/* ===== SUB HEADER ROW ===== */}
                        {headerGroupIndex === 1 && (
                          <tr>
                            {headerGroup.headers.map((header) => {
                              const colDef = header.column.columnDef;

                              // Sub columns for Rate / Day
                              if (colDef.isRateColumn || colDef.isDayColumn) {
                                return (
                                  <th key={header.id} className="text-center" style={{ whiteSpace: "nowrap" }}>
                                    {flexRender(colDef.header, header.getContext())}
                                  </th>
                                );
                              }
                              return null;
                            })}
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </thead>

                  {/* ================= BODY ================= */}
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="single-item chat-single-item">
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
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

export default TableAreer;

// ================= SORT ICON =================
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
