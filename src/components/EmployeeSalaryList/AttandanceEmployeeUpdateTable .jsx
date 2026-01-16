"use client";
import React, { useState, memo, useEffect } from "react";
import Table from "@/components/shared/table/Table";
import {
  FiAlertOctagon,
  FiArchive,
  FiClock,
  FiEdit3,
  FiEye,
  FiMoreHorizontal,
  FiPrinter,
  FiTrash2,
} from "react-icons/fi";
import Dropdown from "@/components/shared/Dropdown";
import SelectDropdown from "@/components/shared/SelectDropdown";

const actions = [
  { label: "Edit", icon: <FiEdit3 /> },
  { label: "Print", icon: <FiPrinter /> },
  { label: "Remind", icon: <FiClock /> },
  { type: "divider" },
  { label: "Archive", icon: <FiArchive /> },
  { label: "Report Spam", icon: <FiAlertOctagon /> },
  { type: "divider" },
  { label: "Delete", icon: <FiTrash2 /> },
];

const TableCell = memo(
  ({ options, defaultSelect, rowIndex, onChangeStatus, employeeData }) => {
    const [selectedOption, setSelectedOption] = useState(defaultSelect);

    const handleSelect = (opt) => {
      setSelectedOption(opt);
      onChangeStatus(rowIndex, opt.value);
    };

    return (
      <SelectDropdown
        options={options}
        defaultSelect={defaultSelect}
        selectedOption={selectedOption}
        onSelectOption={handleSelect}
      />
    );
  }
);

const StatusModal = ({ isOpen, onClose, onSubmit, selectedStatus, employeeData }) => {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit({ reason, file });
    setIsSubmitting(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h4 className="mb-3">Update Status – {selectedStatus}</h4>
        
        {employeeData && (
          <div className="alert alert-info mb-3 p-2">
            <small>
              <strong>Employee:</strong> {employeeData["employee-name"]?.title} 
              ({employeeData["employee-id"]?.name})
            </small>
          </div>
        )}

        <label className="form-label">Reason (required)</label>
        <textarea
          className="form-control mb-3"
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          placeholder="Enter reason for status update..."
        />

        <label className="form-label">Attachment (optional)</label>
        <input
          type="file"
          className="form-control mb-4"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        />

        <div className="d-flex justify-content-end gap-3">
          <button 
            className="btn btn-light" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
          
        .modal-box {
          background: #fff;
          padding: 25px;
          border-radius: 10px;
          width: 450px;
          max-width: 90vw;
        }
      `}</style>
    </div>
  );
};

const AttandanceEmployeeUpdateTable = ({ 
  clientData, 
  month, 
  year, 
  projectType, 
  onProcessDataSubmit,
  isSubmittingProcess 
}) => { 
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingRow, setPendingRow] = useState(null);
  const [pendingEmployeeData, setPendingEmployeeData] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [processResults, setProcessResults] = useState(null);

  // Fetch data from API when clientData, month, or year changes
 useEffect(() => {
  const fetchApiData = async () => {
    if (clientData?.value) {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        const apiUrl = `https://green-owl-255815.hostingersite.com/api/employee/salaryemployee?client_id=${clientData.value}&month=${month}&year=${year}`;

        console.log("📡 Fetching employee data from:", apiUrl);
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log("📦 API Response Data:", result);

        if (result?.status && Array.isArray(result.data)) {
          const transformedData = result.data.map((employee, index) => {
            // Determine initial status based on salary object
            let initialStatus = "Process"; // Default to Process
            
            if (employee.salary && employee.salary.status) {
              // If salary exists and has status, use it
              const salaryStatus = employee.salary.status.toLowerCase();
              if (salaryStatus === "hold") {
                initialStatus = "Hold";
              } else if (salaryStatus === "process") {
                initialStatus = "Process";
              }
            }
            
            return {
              id: employee.id || index + 1,
              "employee-name": {
                title: employee.name || "Unknown",
                img: "/images/brand/app-store.png",
                description: employee.designation3?.name || employee.designation || "No designation"
              },
              "employee-id": {
                name: employee.rand_id || `EMP${employee.id}`,
                email: employee.email || "No email"
              },
              phone: employee.mobile_no || employee.contact_no || "N/A",
              email: employee.email || "N/A",
              designation: employee.designation3?.name || "N/A",
              salary_status: initialStatus,
              month: month || "N/A",
              client_contract: clientData?.label || "N/A",
              days: "23",
              extra_hr: "23",
              status: {
                status: [
                  { value: "Hold", label: "Hold" },
                  { value: "Process", label: "Process" },
                ],
                defaultSelect: { value: initialStatus, label: initialStatus },
              },
              _originalData: employee
            };
          });
          
          console.log(`✅ Loaded ${transformedData.length} employees`);
          setApiData(transformedData);
        } else {
          console.log("⚠️ No data returned from API");
          setApiData([]);
        }
      } catch (err) {
        console.error("❌ Error fetching employee salary:", err);
        setError(err.message);
        setApiData([]);
      } finally {
        setLoading(false);
      }
    } else {
      setApiData([]);
    }
  };

  fetchApiData();
}, [clientData, month, year, projectType]);

  // Function to send form data to API
const sendStatusUpdateToAPI = async (employeeId, status, reason, imageFile) => {
  console.log(`📤 Sending API request for employee ${employeeId}:`);
  console.log('- Status:', status);
  console.log('- Reason:', reason);
  console.log('- Month:', month);
  console.log('- Year:', year);
  console.log('- Has image:', !!imageFile);
  
  let response; // Declare response variable outside try block

  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Create FormData
    const formData = new FormData();
    formData.append('employee_id', employeeId);
    formData.append('status', status.toLowerCase());
    formData.append('reason', reason);
    formData.append('month', month);
    formData.append('year', year);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    response = await fetch('https://green-owl-255815.hostingersite.com/api/employee/salarycalculate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    const result = await response.json();
    console.log(`📥 API Response for employee ${employeeId}:`, result);
    
    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    return { 
      success: true, 
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error(`❌ API Error for employee ${employeeId}:`, error);
    return { 
      success: false, 
      error: error.message,
      status: response?.status // Now response is accessible
    };
  }
};

  // Triggered when status dropdown is changed
  const handleStatusChange = (rowIndex, selectedStatus) => {
    const employeeData = apiData[rowIndex];
    setPendingRow(rowIndex);
    setPendingStatus(selectedStatus);
    setPendingEmployeeData(employeeData);
    
    // Only open modal for "Hold" status
    if (selectedStatus === "Hold") {
      setModalOpen(true);
    } else {
      // For other statuses, update directly without modal
      updateStatusInTable(rowIndex, selectedStatus);
    }
  };

  const handleSubmitModal = async (modalData) => {
    if (pendingStatus !== "Hold" || pendingRow === null || !pendingEmployeeData) {
      console.error("Invalid state for modal submission");
      setModalOpen(false);
      return;
    }

    try {
      // Get employee ID from the pending employee data
      const employeeId = pendingEmployeeData._originalData?.id;
      
      if (!employeeId) {
        throw new Error("Employee ID not found");
      }

      // Send data to API
      const apiResponse = await sendStatusUpdateToAPI(
        employeeId,
        pendingStatus,
        modalData.reason,
        modalData.file
      );

      if (apiResponse.success) {
        // Update the status in local state
        updateStatusInTable(pendingRow, pendingStatus);
        
        // Show success notification
        setNotification({
          type: 'success',
          message: `Status updated to ${pendingStatus} successfully!`
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
      } else {
        throw new Error(apiResponse.error);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setNotification({
        type: 'error',
        message: `Failed to update status: ${error.message}`
      });
    } finally {
      setModalOpen(false);
    }
  };

  const updateStatusInTable = (rowIndex, newStatus) => {
  setApiData(prevData => {
    const newData = [...prevData];
    const statusOptions = [
      { value: "Hold", label: "Hold" },
      { value: "Process", label: "Process" },
    ];
    
    newData[rowIndex] = {
      ...newData[rowIndex],
      salary_status: newStatus,
      status: {
        status: statusOptions,
        defaultSelect: { value: newStatus, label: newStatus }
      }
    };
    return newData;
  });
};

  const getProcessEmployees = () => {
    return apiData.filter(employee => {
      const statusValue = employee.status?.defaultSelect?.value || 
                         employee.status?.defaultSelect;
      return statusValue === "Process";
    });
  };

  // Function to submit all "Process" status employees to API
  const submitAllProcessEmployees = async () => {
    const processEmployees = getProcessEmployees();
    
    console.log("📊 Starting bulk process...");
    console.log(`Found ${processEmployees.length} employees with 'Process' status`);
    
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    console.log("🔄 Processing employees...");
    
    for (const [index, employee] of processEmployees.entries()) {
      try {
        const employeeId = employee._originalData?.id;
        
        if (!employeeId) {
          throw new Error("Employee ID not found");
        }

        // console.log(`Processing employee ${index + 1}/${processEmployees.length}: ${employee["employee-name"]?.title}`);
        
        const apiResponse = await sendStatusUpdateToAPI(
          employeeId,
          "processing", // Changed to "process" instead of "processing"
          "Bulk status update for process",
          null
        );

        if (apiResponse.success) {
          successCount++;
          console.log(`✅ Success: ${employee["employee-name"]?.title}`);
        } else {
          failCount++;
          console.log(`❌ Failed: ${employee["employee-name"]?.title} - ${apiResponse.error}`);
        }

        results.push({
          employeeId,
          name: employee["employee-name"]?.title,
          success: apiResponse.success,
          error: apiResponse.error,
          data: apiResponse.data,
          response: apiResponse
        });

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        failCount++;
        console.log(`❌ Error: ${employee["employee-name"]?.title} - ${error.message}`);
        results.push({
          employeeId: employee._originalData?.id,
          name: employee["employee-name"]?.title,
          success: false,
          error: error.message
        });
      }
    }

    const allSuccess = failCount === 0;
    
    console.log("📈 Processing completed:");
    console.log(`- Total: ${processEmployees.length}`);
    console.log(`- Success: ${successCount}`);
    console.log(`- Failed: ${failCount}`);
    console.log(`- All successful: ${allSuccess}`);
    
    // Log detailed results
    results.forEach((result, idx) => {
      console.log(`${idx + 1}. ${result.name}: ${result.success ? '✅' : '❌'} ${result.error || ''}`);
    });

    const result = {
      success: allSuccess,
      results: results,
      message: allSuccess 
        ? `Successfully processed all ${processEmployees.length} employees`
        : `${failCount} out of ${processEmployees.length} employees failed to process`,
      summary: {
        total: processEmployees.length,
        success: successCount,
        failed: failCount
      }
    };
    
    setProcessResults(result);
    return result;
  };

  // Pass the process function to parent
  useEffect(() => {
    console.log("📤 Passing process function to parent");
    if (onProcessDataSubmit) {
      onProcessDataSubmit(submitAllProcessEmployees);
    }
  }, [apiData]);

  const columns = [
    {
      accessorKey: "id",
      header: ({ table }) => {
        const checkboxRef = React.useRef(null);

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
          }
        }, [table.getIsSomeRowsSelected()]);

        return (
          <input
            type="checkbox"
            className="custom-table-checkbox"
            ref={checkboxRef}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        );
      },
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="custom-table-checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: {
        headerClassName: "width-30",
      },
    },
    {
      accessorKey: "employee-id",
      header: () => "Employee ID",
      cell: (info) => {
        const employeeId = info.getValue();
        return (
          <a href="#" className="hstack gap-3">
            <div className="text-white avatar-text user-avatar-text avatar-md bg-primary">
              {employeeId?.name?.substring(0, 2) || "EMP"}
            </div>
            <div>
              <span className="text-truncate-1-line fw-semibold">
                {employeeId?.name || "N/A"}
              </span>
              <small className="fs-12 fw-normal text-muted d-block">
                {employeeId?.email || "No email"}
              </small>
            </div>
          </a>
        );
      },
    },
    {
      accessorKey: "employee-name",
      header: () => "Employee Name",
      cell: (info) => {
        const employee = info.getValue();
        const originalData = info.row.original._originalData;
        return (
          <div className="hstack gap-4">
            <div className="avatar-image border-0">
              <img 
                src={employee?.img || "/images/brand/app-store.png"} 
                alt={employee?.title} 
                className="img-fluid rounded-circle"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <a href="#" className="text-truncate-1-line fw-semibold d-block">
                {employee?.title || "Unknown"}
              </a>
              <small className="text-muted fs-12">
                {employee?.description || "No designation"}
              </small>
              {originalData?.client?.service_title && (
                <small className="d-block text-primary fs-11">
                  {originalData.client.service_title}
                </small>
              )}
            </div>
          </div>
        );
      },
      meta: {
        className: "project-name-td",
      },
    },
    {
      accessorKey: "email",
      header: () => "E-mail",
      cell: (info) => (
        <div>
          <span className="d-block">{info.getValue() || "N/A"}</span>
          <small className="text-muted fs-11">Email</small>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: () => "Phone",
      cell: (info) => (
        <div>
          <span className="d-block">{info.getValue() || "N/A"}</span>
          <small className="text-muted fs-11">Mobile</small>
        </div>
      ),
    },
    {
      accessorKey: "designation",
      header: () => "Designation",
      cell: (info) => {
        const originalData = info.row.original._originalData;
        return (
          <div>
            <span className="d-block">{info.getValue() || "N/A"}</span>
            {originalData?.consignee?.consignee_name && (
              <small className="text-muted fs-11">
                Consignee: {originalData.consignee.consignee_name}
              </small>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "client_contract",
      header: () => "Client Contract",
      cell: (info) => (
        <div>
          <span className="d-block text-truncate" style={{ maxWidth: '150px' }}>
            {info.getValue() || "N/A"}
          </span>
          <small className="text-muted fs-11">Contract</small>
        </div>
      ),
    },
    {
      accessorKey: "month",
      header: () => "Month",
      cell: (info) => (
        <div>
          <span className="d-block fw-semibold">{info.getValue() || "N/A"}</span>
          <small className="text-muted fs-11">Selected Month</small>
        </div>
      ),
    },
    {
  accessorKey: "status",
  header: () => "Status",
  cell: (info) => (
    <TableCell
      rowIndex={info.row.index}
      options={info.getValue().status}
      defaultSelect={info.getValue().defaultSelect}
      employeeData={info.row.original._originalData}
      onChangeStatus={handleStatusChange}
    />
  ),
},
  ];

  const DebugPanel = () => (
    <div className="debug-panel p-3 mb-3 bg-light border rounded">
      <h6 className="fw-bold mb-2">Employee Data</h6>
      <div className="row">
        <div className="col-md-3">
          <small className="text-muted">Client:</small>
          <div className="fw-semibold">{clientData?.label || "Not selected"}</div>
        </div>
        <div className="col-md-2">
          <small className="text-muted">Month:</small>
          <div className="fw-semibold">{month || "Not selected"}</div>
        </div>
        <div className="col-md-2">
          <small className="text-muted">Year:</small>
          <div className="fw-semibold">{year || "Not selected"}</div>
        </div>
        <div className="col-md-2">
          <small className="text-muted">Status:</small>
          <div className={`fw-semibold ${loading ? 'text-warning' : apiData.length ? 'text-success' : 'text-danger'}`}>
            {loading ? "⏳ Loading..." : apiData.length ? `✅ ${apiData.length} employees` : "❌ No data"}
          </div>
        </div>
        <div className="col-md-3">
          <small className="text-muted">Project Type:</small>
          <div className="fw-semibold">{projectType || "Not selected"}</div>
        </div>
      </div>
      {error && (
        <div className="mt-2 alert alert-danger py-2">
          <small>Error: {error}</small>
        </div>
      )}
      
      {/* Process Status */}
      {processResults && (
        <div className="mt-2">
          <small className="text-muted">Last Process:</small>
          <div className={`fw-semibold ${processResults.success ? 'text-success' : 'text-danger'}`}>
            {processResults.success ? '✅ Success' : '❌ Failed'} - {processResults.summary.success}/{processResults.summary.total} processed
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DebugPanel />
      
      {/* Notification Banner */}
      {notification.message && (
        <div className={`alert alert-${notification.type === 'error' ? 'danger' : 'success'} mb-3 ASDCASDFASDCASDFCASDC`}>
          {notification.message}
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading employee data...</p>
        </div>
      ) : apiData.length > 0 ? (
        <>
          <div className="alert alert-info mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Note:</strong> Showing {apiData.length} employee(s) for client "{clientData?.label}"
                <div className="small mt-1">
                  Employees with "Process" status: <strong>{getProcessEmployees().length}</strong>
                </div>
              </div>
              {isSubmittingProcess && (
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Processing...</span>
                </div>
              )}
            </div>
          </div>
          <Table data={apiData} columns={columns} />
        </>
      ) : (
        <div className="text-center p-5 border rounded bg-light">
          <div className="mb-3">
            <FiAlertOctagon size={48} className="text-muted" />
          </div>
          <h5 className="mb-2">No Employee Data Found</h5>
          <p className="text-muted mb-0">
            {clientData?.value 
              ? "No employees found for the selected client."
              : "Please select a client first."
            }
          </p>
        </div>
      )}
      
      <StatusModal
        isOpen={modalOpen}
        selectedStatus={pendingStatus}
        employeeData={pendingEmployeeData}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitModal}
      />
    </>
  );
};

export default AttandanceEmployeeUpdateTable;