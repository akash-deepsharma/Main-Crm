import React, { useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import './CoverLetter.css'

export default function WagesSheetEmployer(attendanceData) {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("attendanceData", attendanceData)

  // Calculate wages for each employee
  const calculateWages = (employee) => {
    const dailyWageRate = 500; // Base daily wage rate
    const overtimeRate = 75; // Overtime rate per hour
    
    const presentDays = employee?.present_days || 0;
    const extraHours = employee?.extra_hours || 0;
    
    // Calculate wages
    const regularWages = presentDays * dailyWageRate;
    const overtimeWages = extraHours * overtimeRate;
    const totalWages = regularWages + overtimeWages;
    
    return {
      regularWages,
      overtimeWages,
      totalWages,
      dailyWageRate,
      overtimeRate
    };
  };

  // Filter employees based on search term
  const filteredEmployees = attendanceData?.attendanceData?.filter(emp => 
    emp?.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp?.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp?.['employee-id']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalPresentDays = 0;
    let totalExtraHours = 0;
    let totalRegularWages = 0;
    let totalOvertimeWages = 0;
    let totalWages = 0;

    filteredEmployees.forEach(emp => {
      const wages = calculateWages(emp);
      totalPresentDays += emp?.present_days || 0;
      totalExtraHours += emp?.extra_hours || 0;
      totalRegularWages += wages.regularWages;
      totalOvertimeWages += wages.overtimeWages;
      totalWages += wages.totalWages;
    });

    return {
      totalPresentDays,
      totalExtraHours,
      totalRegularWages,
      totalOvertimeWages,
      totalWages
    };
  };

  const totals = calculateTotals();

  return (
    <div className="wages-sheet-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bolder text-uppercase m-0">Wages Sheet for Employer</h3>
      </div>


      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">EMPLOYEE</th>
              <th scope="col">EMPLOYEE ID</th>
              <th scope="col">DESIGNATION</th>
              <th scope="col">PRESENT DAYS</th>
              <th scope="col">DAILY WAGE</th>
              <th scope="col">REGULAR WAGES</th>
              <th scope="col">EXTRA HOURS</th>
              <th scope="col">OT RATE/HR</th>
              <th scope="col">OT WAGES</th>
              <th scope="col">TOTAL WAGES</th>
              <th scope="col">MONTH</th>
              {/* <th scope="col">ACTIONS</th> */}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((item, key) => {
              const wages = calculateWages(item);
              return (
                <tr key={key}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="employee-avatar bg-light rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '36px', height: '36px' }}>
                        <span className="fw-bold text-primary small">
                          {item?.employee?.name?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold">{item?.employee?.name}</div>
                        <small className="text-muted">{item?.employee?.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fw-semibold">{item?.['employee-id']}</span>
                  </td>
                  <td>{item?.designation}</td>
                  <td>
                    <span className="fw-semibold text-success">{item?.present_days}</span> Days
                  </td>
                  <td>
                    <span className="fw-semibold">₹{wages.dailyWageRate}</span>
                  </td>
                  <td>
                    <span className="fw-semibold text-primary">₹{wages.regularWages.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="fw-semibold text-warning">{item?.extra_hours}</span> Hrs
                  </td>
                  <td>
                    <span className="fw-semibold">₹{wages.overtimeRate}/hr</span>
                  </td>
                  <td>
                    <span className="fw-semibold text-info">₹{wages.overtimeWages.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="fw-bold text-dark">₹{wages.totalWages.toLocaleString()}</span>
                  </td>
                  <td>{item?.month}</td>
                  {/* <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" title="View Details">
                        <FaEye size={14} />
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" title="More Actions">
                        <BsThreeDotsVertical size={14} />
                      </button>
                    </div>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
          {/* Table Footer with Totals */}
          <tfoot className="table-light fw-bold">
            <tr>
              <td colSpan="3" className="text-end">Totals:</td>
              <td>{totals.totalPresentDays} Days</td>
              <td>-</td>
              <td>₹{totals.totalRegularWages.toLocaleString()}</td>
              <td>{totals.totalExtraHours} Hrs</td>
              <td>-</td>
              <td>₹{totals.totalOvertimeWages.toLocaleString()}</td>
              <td colSpan="3">₹{totals.totalWages.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      

      <style jsx>{` 
        .wages-sheet-container {
          padding: 24px;
          background-color: #f8f9fa;
        }

        .summary-card {
          transition: transform 0.2s;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .table thead th {
          background-color: #f8f9fa;
          color: #495057;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 2px solid #dee2e6;
          padding: 16px 12px;
          white-space: nowrap;
        }

        .table tbody td {
          padding: 16px 12px;
          vertical-align: middle;
          color: #212529;
          font-size: 14px;
          border-bottom: 1px solid #f0f0f0;
        }

        .table tfoot td {
          padding: 16px 12px;
          background-color: #f8f9fa;
          border-top: 2px solid #dee2e6;
          font-size: 14px;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .employee-avatar {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        }

        .employee-avatar span {
          font-size: 14px;
          color: #495057;
        }

        .btn-sm {
          padding: 6px 10px;
          font-size: 12px;
          border-radius: 6px;
        }

        .btn-outline-primary:hover, .btn-outline-secondary:hover {
          transform: translateY(-1px);
        }

        .pagination {
          gap: 5px;
        }

        .page-link {
          border: none;
          padding: 8px 12px;
          color: #6c757d;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .page-link:hover {
          background: #f8f9fa;
          color: #0d6efd;
        }

        .page-item.active .page-link {
          background: #0d6efd;
          color: white;
        }

        .page-item.disabled .page-link {
          color: #dee2e6;
          cursor: not-allowed;
          background: white;
        }

        .form-select-sm, .form-control-sm {
          border-radius: 8px;
          border: 1px solid #dee2e6;
          padding: 8px 12px;
          font-size: 14px;
        }

        .form-select-sm:focus, .form-control-sm:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.25);
        }

        @media (max-width: 1200px) {
          .table {
            font-size: 13px;
          }
          
          .table td, .table th {
            white-space: nowrap;
          }
        }

        @media (max-width: 768px) {
          .wages-sheet-container {
            padding: 16px;
          }
          
          .d-flex.justify-content-between {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}