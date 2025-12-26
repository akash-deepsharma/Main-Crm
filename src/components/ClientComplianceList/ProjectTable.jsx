'use client'
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import Input from '../shared/Input';
import { taskAssigneeOptions } from '@/utils/options';

const actions = [
    { label: "Edit", icon: <FiEdit3 /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },
    { label: "Delete", icon: <FiTrash2 /> },
];

const statusOptions = [
    { value: "bonus", label: "Bonus", color: "#3454d1", slug: "bonus" },
    { value: "arrer", label: "Arrer", color: "#ffa21d", slug: "arrer" },
    { value: "epfo", label: "EPFO", color: "#17c666", slug: "epfo" },
    { value: "esic", label: "ESIC", color: "#ea4d4d", slug: "esic" },
];

const assigned = taskAssigneeOptions;

// ⬇️ FIXED DROPDOWN CELL
const TableCell = memo(({ options, defaultSelect, onStatusChange }) => {
    const [selectedValue, setSelectedValue] = useState(defaultSelect);

    useEffect(() => {
        setSelectedValue(defaultSelect);
    }, [defaultSelect]);

    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
        <SelectDropdown
            options={options}
            value={selectedValue}
            defaultSelect={selectedValue}
            selectedOption={selectedOption}
            onSelectOption={(option) => {
                setSelectedValue(option.value);
                onStatusChange(option.value);
            }}
        />
    );
});

// TABLE DATA
const ComplianceClientTableData = [
    {
        id: 1,
        "project-name": {
            title: "Spark: This name could work well for a project related to innovation.",
            img: "/images/brand/app-store.png",
            description: "Lorem ipsum dolor.",
        },
        customer: { name: "Alexandra Della", img: "/images/avatar/1.png" },
        phone: "9876543210",
        email: "alexandra@gmail.com",
        organisation: "National Security Guard (NSG)",
        ministry: "Ministry of Home Affairs",
        assigned: { assigned, defaultSelect: 'arcie.tones@gmail.com' },
        status: { statusOptions, defaultSelect: "bonus" },
    },
    {
        id: 2,
        "project-name": {
            title: "Nexus: This name could work well for connectivity and innovation.",
            img: "/images/brand/dropbox.png",
            description: "Lorem ipsum dolor.",
        },
        customer: { name: "Green Cute", img: "/images/avatar/2.png" },
        phone: "9876543210",
        email: "green@gmail.com",
        organisation: "National Security Guard (NSG)",
        ministry: "Ministry of Home Affairs",
        assigned: { assigned, defaultSelect: 'jon.tones@gmail.com' },
        status: { statusOptions, defaultSelect: "epfo" },
    },
];

const ProjectTable = () => {

    // FIX: store & update selected status for each row
    const [rowStatus, setRowStatus] = useState(
        ComplianceClientTableData.map(item => item.status.defaultSelect)
    );

    const updateRowStatus = (rowIndex, newStatus) => {
        const updated = [...rowStatus];
        updated[rowIndex] = newStatus;
        setRowStatus(updated);
    };

    const columns = [
        // CHECKBOX
        {
            accessorKey: 'id',
            header: ({ table }) => {
                const checkboxRef = React.useRef(null);
                useEffect(() => {
                    if (checkboxRef.current) {
                        checkboxRef.current.indeterminate =
                            table.getIsSomeRowsSelected();
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
            meta: { headerClassName: 'width-30' },
        },

        // CLIENT NAME
        {
            accessorKey: 'project-name',
            header: () => 'Client Name',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <div className="hstack gap-4">
                        <div className="avatar-image border-0">
                            <img src={roles?.img} alt="" className="img-fluid" />
                        </div>
                        <div>
                            <a href="#" className="text-truncate-1-line">{roles?.title}</a>
                        </div>
                    </div>
                );
            },
        },

        // CUSTOMER
        {
            accessorKey: 'customer',
            header: () => 'Customer',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        <div className="avatar-image avatar-md">
                            <img src={roles?.img} alt="" className="img-fluid" />
                        </div>
                        <div>
                            <span>{roles?.name}</span>
                            <small className="text-muted">{roles?.email}</small>
                        </div>
                    </a>
                );
            }
        },

        { accessorKey: 'organisation', header: () => 'Organisation Name' },
        { accessorKey: 'ministry', header: () => 'Ministry' },
        { accessorKey: 'phone', header: () => 'Phone' },
        { accessorKey: 'email', header: () => 'E-mail' },

        // STATUS DROPDOWN
        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: (info) => {
                const rowIndex = info.row.index;
                const { statusOptions } = info.getValue();

                return (
                    <TableCell
                        options={statusOptions}
                        defaultSelect={rowStatus[rowIndex]}  // FIXED 🔥
                        onStatusChange={(value) => updateRowStatus(rowIndex, value)}
                    />
                );
            },
        },

        // ACTIONS
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: ({ row }) => {
                const index = row.index;
                const selectedStatus = rowStatus[index];
                const slug = selectedStatus || "bonus";

                return (
                    <div className="hstack gap-2 justify-content-end">
                        <a href={`/compliance/${slug}`} className="avatar-text avatar-md">
                            <FiEye />
                        </a>
                        <a href={`/compliance/view/${slug}`} className="avatar-text avatar-md">
                            <FiEye />
                        </a>
                        <Dropdown
                            dropdownItems={actions}
                            triggerClassNaclassName="avatar-md"
                            triggerPosition={"0,21"}
                            triggerIcon={<FiMoreHorizontal />}
                        />
                    </div>
                );
            },
            meta: { headerClassName: 'text-end' },
        },
    ];

    return <Table data={ComplianceClientTableData} columns={columns} />;
};

export default ProjectTable;
