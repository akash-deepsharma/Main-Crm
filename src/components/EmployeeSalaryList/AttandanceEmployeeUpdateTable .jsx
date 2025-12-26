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
// import Input from 'react-select/dist/declarations/src/components/Input';

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
  ({ options, defaultSelect, rowIndex, onChangeStatus }) => {
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

const StatusModal = ({ isOpen, onClose, onSubmit, selectedStatus }) => {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h4 className="mb-3">Update Status – {selectedStatus}</h4>

        <label className="form-label">Reason (required)</label>
        <textarea
          className="form-control mb-3"
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <label className="form-label">Attachment (optional)</label>
        <input
          type="file"
          className="form-control mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="d-flex justify-content-end gap-3">
          <button className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSubmit({ reason, file })}
            disabled={!reason.trim()}
          >
            Submit
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
        }

      `}</style>
    </div>
  );
};

const employeeAttandanceTableData = [
  {
    id: 1,
    "employee-name": {
      title: "Spark",
      img: "/images/brand/app-store.png",
    },
    "employee-id": {
      name: "EMPNI9623",
    },
    phone: "9876543210",
    email: "alexandra@gmail.com",
    designation: "Fire Pump Wet Riser Operator",
    salary_status: "Hold",
    month: "Dec",
    client_contract: "Gemc-511687796725840",
    days: "23",
    extra_hr: "23",
    status: {
      status: [
        { value: "Hold", label: "Hold" },
        { value: "Process", label: "Process" },
      ],
      defaultSelect: "Process",
    },
  },
  {
    id: 2,
    "employee-name": {
      title: "Nexus",
      img: "/images/brand/dropbox.png",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    "employee-id": {
      name: "EMPNI9623",
    },
    phone: "9876543210",
    email: "alexandra@gmail.com",
    designation: "Helper",
    salary_status: "Hold",
    month: "Dec",
    client_contract: "Gemc-511687796725840",
    days: "23",
    extra_hr: "23",
    status: {
      status: [
        { value: "Hold", label: "Hold" },
        { value: "Process", label: "Process" },
      ],
      defaultSelect: "Process",
    },
  },
  {
    id: 3,
    "employee-name": {
      title: "Velocity",
      img: "/images/brand/facebook.png",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    "employee-id": {
      name: "EMPNI9623",
    },
    phone: "9876543210",
    email: "alexandra@gmail.com",
    designation: "Electrician",
    salary_status: "Hold",
    month: "Dec",
    client_contract: "Gemc-511687796725840",
    days: "23",
    extra_hr: "23",
    status: {
      status: [
        { value: "Hold", label: "Hold" },
        { value: "Process", label: "Process" },
      ],
      defaultSelect: "Process",
    },
  },
];

const AttandanceEmployeeUpdateTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingRow, setPendingRow] = useState(null);

  // Triggered when status dropdown is changed
  const handleStatusChange = (rowIndex, selectedStatus) => {
    setPendingRow(rowIndex);
    setPendingStatus(selectedStatus);
    setModalOpen(true);
  };

  const handleSubmitModal = (data) => {
    console.log("Reason:", data.reason);
    console.log("File:", data.file);
    console.log("Status Applied:", pendingStatus);

    setModalOpen(false);
  };
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
        const roles = info.getValue();
        return (
          <a href="#" className="hstack gap-3">
            {roles?.img ? (
              <div className="avatar-image avatar-md">
                <img src={roles?.img} alt="" className="img-fluid" />
              </div>
            ) : (
              <div className="text-white avatar-text user-avatar-text avatar-md">
                {roles?.name.substring(0, 1)}
              </div>
            )}
            <div>
              <span className="text-truncate-1-line">{roles?.name}</span>
              <small className="fs-12 fw-normal text-muted">
                {roles?.email}
              </small>
            </div>
          </a>
        );
      },
    },
    {
      accessorKey: "employee-name",
      header: () => "Employee-name",
      cell: (info) => {
        const roles = info.getValue();
        return (
          <div className="hstack gap-4">
            <div className="avatar-image border-0">
              <img src={roles?.img} alt="" className="img-fluid" />
            </div>
            <div>
              <a href="projects-view.html" className="text-truncate-1-line">
                {roles?.title}
              </a>
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
    },
    {
      accessorKey: "designation",
      header: () => "Designation",
    },
    {
      accessorKey: "client_contract",
      header: () => "Client Contract",
    },
    {
      accessorKey: "month",
      header: () => "Month",
    },
    
    {
      accessorKey: "status",
      header: () => "Status",
      cell: (info) => (
        <TableCell
          rowIndex={info.row.index}
          options={info.getValue().status}
          defaultSelect={info.getValue().defaultSelect}
          onChangeStatus={handleStatusChange}
        />
      ),
    },
  ];

  return (
    <>
      <Table data={employeeAttandanceTableData} columns={columns} />
      <StatusModal
        isOpen={modalOpen}
        selectedStatus={pendingStatus}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitModal}
      />
    </>
  );
};

export default AttandanceEmployeeUpdateTable;
