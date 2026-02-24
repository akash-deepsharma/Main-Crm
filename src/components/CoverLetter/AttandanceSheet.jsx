import React, { useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import './CoverLetter.css'

export default function AttendanceSheet(attendanceData) {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
console.log("attendanceData", attendanceData    )
  // Sample employee data based on the image
  const employees = [
    {
      id: 1,
      name: "Akashy Kumar",
      email: "akashy.kumar@example.com",
      employeeId: "EMPUADOJT",
      designation: "STP Operator",
      presentDays: 17,
      extraHours: 21,
      month: "January 2026"
    },
    {
      id: 2,
      name: "Pradeep Prajapati",
      email: "pradeep.prajapati@example.com",
      employeeId: "EMPV2IAP8",
      designation: "Pump Operator",
      presentDays: 11,
      extraHours: 20,
      month: "January 2026"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      employeeId: "EMPRK1234",
      designation: "Technician",
      presentDays: 15,
      extraHours: 18,
      month: "January 2026"
    },
    {
      id: 4,
      name: "Sunita Sharma",
      email: "sunita.sharma@example.com",
      employeeId: "EMPSS5678",
      designation: "Supervisor",
      presentDays: 20,
      extraHours: 25,
      month: "January 2026"
    },
    {
      id: 5,
      name: "Amit Singh",
      email: "amit.singh@example.com",
      employeeId: "EMPAS9012",
      designation: "Operator",
      presentDays: 14,
      extraHours: 16,
      month: "January 2026"
    },
    {
      id: 6,
      name: "Priya Patel",
      email: "priya.patel@example.com",
      employeeId: "EMPPP3456",
      designation: "Quality Check",
      presentDays: 18,
      extraHours: 22,
      month: "January 2026"
    },
    {
      id: 7,
      name: "Vikram Mehta",
      email: "vikram.mehta@example.com",
      employeeId: "EMPVM7890",
      designation: "Maintenance",
      presentDays: 12,
      extraHours: 15,
      month: "January 2026"
    },
    {
      id: 8,
      name: "Neha Gupta",
      email: "neha.gupta@example.com",
      employeeId: "EMPNG2345",
      designation: "HR Assistant",
      presentDays: 19,
      extraHours: 24,
      month: "January 2026"
    },
    {
      id: 9,
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      employeeId: "EMPRV6789",
      designation: "Security",
      presentDays: 16,
      extraHours: 19,
      month: "January 2026"
    },
    {
      id: 10,
      name: "Anjali Desai",
      email: "anjali.desai@example.com",
      employeeId: "EMPAD0123",
      designation: "Accountant",
      presentDays: 17,
      extraHours: 21,
      month: "January 2026"
    }
  ];

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="attendance-sheet-container">
      {/* Header with Show entries and Search */}
      <div className="d-flex justify-content-center align-items-center mb-4 bg-light py-3 max-content">
            <h3 className=" fw-bolder text-uppercase w-auto">Attandance Sheet</h3>
        
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              {/* <th scope="col" style={{ width: '30px' }}>
                <input type="checkbox" className="form-check-input" />
              </th> */}
              <th scope="col">EMPLOYEE</th>
              <th scope="col">EMPLOYEE ID</th>
              <th scope="col">DESIGNATION</th>
              <th scope="col">PRESENT DAYS</th>
              <th scope="col">ABSENT DAYS</th>
              <th scope="col">EXTRA HOURS</th>
              <th scope="col">MONTH</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData?.attendanceData?.map((tiem, key) => (
              <tr key={key}>
                {/* <td>
                  <input type="checkbox" className="form-check-input" />
                </td> */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="employee-avatar bg-light rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '36px', height: '36px' }}>
                      <span className="fw-bold text-primary small">
                        {tiem?.employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="fw-semibold">{tiem?.employee.name}</div>
                      <small className="text-muted">{tiem?.employee.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                 <span className="fw-semibold">{tiem?.['employee-id']}</span>
                </td>
                <td>{tiem?.designation}</td>
                <td>
                  <span className="fw-semibold">{tiem?.present_days}</span> Days
                </td>
                <td>
                  <span className="fw-semibold">{tiem?.absent_days}</span> Days
                </td>
                <td>
                  <span className="fw-semibold">{tiem?.extra_hours}</span> Hrs
                </td>
                <td>{tiem?.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      <style jsx>{`
        .attendance-sheet-container {
          padding: 24px;
          background-color: #f8f9fa;
        //   min-height: 100vh;
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
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 2px solid #dee2e6;
          padding: 16px 12px;
        }

        .table tbody td {
          padding: 16px 12px;
          vertical-align: middle;
          color: #212529;
          font-size: 14px;
          border-bottom: 1px solid #f0f0f0;
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

        .btn-link {
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          color: #0d6efd;
        }

        .btn-link:hover {
          text-decoration: underline;
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

        .form-check-input {
          cursor: pointer;
        }

        .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        @media (max-width: 768px) {
          .attendance-sheet-container {
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