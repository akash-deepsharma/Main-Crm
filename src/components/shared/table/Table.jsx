import React, { useState, useEffect } from "react";
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

const Table = ({ 
  data, 
  columns, 
  loading,
  totalEntries,
  currentPage,
  lastPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearch, // Add this for server-side search
  onSort // Add this for server-side sorting
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: currentPage - 1, // TanStack uses 0-based indexing
    pageSize: pageSize,
  });

  // Update pagination when props change
  useEffect(() => {
    setPagination({
      pageIndex: currentPage - 1,
      pageSize: pageSize,
    });
  }, [currentPage, pageSize]);

  // Handle search with debounce for server-side
  useEffect(() => {
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(globalFilter);
      }, 500); // Debounce search
      
      return () => clearTimeout(timer);
    }
  }, [globalFilter, onSearch]);

  // Handle sort change
  const handleSortingChange = (updater) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    
    if (onSort && newSorting.length > 0) {
      onSort({
        field: newSorting[0].id,
        order: newSorting[0].desc ? 'desc' : 'asc'
      });
    } else if (onSort) {
      onSort(null); // Clear sorting
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Enable manual pagination
    manualSorting: true, // Enable manual sorting
    manualFiltering: true, // Enable manual filtering
    pageCount: lastPage, // Total number of pages
  });

  // Handle page change
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  return (
    <div className="card stretch stretch-full function-table">
      <div className="card-body p-0">
        <div className="table-responsive">
          <div className="dataTables_wrapper dt-bootstrap5 no-footer">
            <TableSearch
              table={table}
              setGlobalFilter={setGlobalFilter}
              globalFilter={globalFilter}
              onPageSizeChange={handlePageSizeChange}
              currentPageSize={pageSize}
            />

            <div className="row dt-row">
              <div className="col-sm-12 px-0">
                <table
                  className="table table-hover dataTable no-footer"
                  id="projectList"
                >
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <th
                              key={header.id}
                              className={
                                header.column.columnDef.meta?.headerClassName
                              }
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {header.id === "select" ? (
                                <div className="d-flex gap-2">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </div>
                              ) : (
                                <ArrowToggle header={header}>
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </ArrowToggle>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-4">
                          <div className="text-muted">No data found</div>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="single-item chat-single-item">
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <td
                                key={cell.id}
                                className={cell.column.columnDef.meta?.className}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <TablePagination 
              table={table}
              totalEntries={totalEntries}
              currentPage={currentPage}
              lastPage={lastPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

const ArrowToggle = ({ header, children }) => {
  const position = header.column.getIsSorted();
  return (
    <div
      className="table-head d-flex align-items-center gap-1"
      style={{
        cursor: header.column.getCanSort() ? "pointer" : "default",
      }}
      onClick={header.column.getToggleSortingHandler()}
    >
      {children}
      {
        {
          asc: <FaSortUp size={13} opacity={position === "asc" ? 1 : 0.5} />,
          desc: <FaSortDown size={13} opacity={position === "desc" ? 1 : 0.5} />,
        }[position]
      }
      {header.column.getCanSort() && !position ? (
        <FaSort size={13} opacity={0.3} />
      ) : null}
    </div>
  );
};




// import React, { useState, useEffect } from "react";
// import TableSearch from "./TableSearch";
// import TablePagination from "./TablePagination";
// import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// const Table = ({ 
//   data, 
//   columns, 
//   loading,
//   totalEntries,
//   currentPage,
//   lastPage,
//   pageSize,
//   onPageChange,
//   onPageSizeChange 
// }) => {
//   const [sorting, setSorting] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [pagination, setPagination] = useState({
//     pageIndex: currentPage - 1, // TanStack uses 0-based indexing
//     pageSize: pageSize,
//   });

//   // Update pagination when props change
//   useEffect(() => {
//     setPagination({
//       pageIndex: currentPage - 1,
//       pageSize: pageSize,
//     });
//   }, [currentPage, pageSize]);

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       globalFilter,
//       pagination,
//     },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onGlobalFilterChange: setGlobalFilter,
//     getPaginationRowModel: getPaginationRowModel(),
//     onPaginationChange: setPagination,
//     manualPagination: true, // Enable manual pagination
//     pageCount: lastPage, // Total number of pages
//   });

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (onPageChange) {
//       onPageChange(newPage);
//     }
//   };

//   // Handle page size change
//   const handlePageSizeChange = (newSize) => {
//     if (onPageSizeChange) {
//       onPageSizeChange(newSize);
//     }
//   };

//   return (
//     <div className="card stretch stretch-full function-table">
//       <div className="card-body p-0">
//         <div className="table-responsive">
//           <div className="dataTables_wrapper dt-bootstrap5 no-footer">
//             <TableSearch
//               table={table}
//               setGlobalFilter={setGlobalFilter}
//               globalFilter={globalFilter}
//               onPageSizeChange={handlePageSizeChange}
//               currentPageSize={pageSize}
//             />

//             <div className="row dt-row">
//               <div className="col-sm-12 px-0">
//                 <table
//                   className="table table-hover dataTable no-footer"
//                   id="projectList"
//                 >
//                   <thead>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                       <tr key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => {
//                           return (
//                             <th
//                               key={header.id}
//                               className={
//                                 header.column.columnDef.meta?.headerClassName
//                               }
//                               style={{ whiteSpace: "nowrap" }}
//                             >
//                               {header.id === "id" ? (
//                                 <div className="d-flex gap-2">
//                                   {flexRender(
//                                     header.column.columnDef.header,
//                                     header.getContext()
//                                   )}
//                                   <ArrowToggle header={header} />
//                                 </div>
//                               ) : (
//                                 <ArrowToggle header={header}>
//                                   {flexRender(
//                                     header.column.columnDef.header,
//                                     header.getContext()
//                                   )}
//                                 </ArrowToggle>
//                               )}
//                             </th>
//                           );
//                         })}
//                       </tr>
//                     ))}
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       <tr>
//                         <td colSpan={columns.length} className="text-center py-4">
//                           Loading...
//                         </td>
//                       </tr>
//                     ) : table.getRowModel().rows.length === 0 ? (
//                       <tr>
//                         <td colSpan={columns.length} className="text-center py-4">
//                           No data found
//                         </td>
//                       </tr>
//                     ) : (
//                       table.getRowModel().rows.map((row) => (
//                         <tr key={row.id} className="single-item chat-single-item">
//                           {row.getVisibleCells().map((cell) => {
//                             return (
//                               <td
//                                 key={cell.id}
//                                 className={cell.column.columnDef.meta?.className}
//                               >
//                                 {flexRender(
//                                   cell.column.columnDef.cell,
//                                   cell.getContext()
//                                 )}
//                               </td>
//                             );
//                           })}
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <TablePagination 
//               table={table}
//               totalEntries={totalEntries}
//               currentPage={currentPage}
//               lastPage={lastPage}
//               pageSize={pageSize}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Table;

// const ArrowToggle = ({ header, children }) => {
//   const position = header.column.getIsSorted();
//   return (
//     <div
//       className="table-head"
//       style={{
//         cursor: header.column.getCanSort() ? "pointer" : "default",
//       }}
//       onClick={header.column.getToggleSortingHandler()}
//     >
//       {children}
//       {
//         {
//           asc: <FaSortUp size={13} opacity={position === "asc" ? 1 : 0.125} />,
//           desc: (
//             <FaSortDown size={13} opacity={position === "desc" ? 1 : 0.125} />
//           ),
//         }[position]
//       }
//       {header.column.getCanSort() && !position ? (
//         <FaSort size={13} opacity={0.125} />
//       ) : null}
//     </div>
//   );
// };