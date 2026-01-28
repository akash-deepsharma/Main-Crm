'use client';

import React, { useState, useEffect, memo } from 'react';
import Table from '@/components/shared/table/Table';
import {
    FiClock,
    FiEdit3,
    FiEye,
    FiMoreHorizontal,
    FiTrash2,
} from 'react-icons/fi';
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';

/* ------------------ ACTIONS ------------------ */
const actions = [
    { label: 'Edit', icon: <FiEdit3 /> },
    { label: 'Remind', icon: <FiClock /> },
    { type: 'divider' },
    { label: 'Delete', icon: <FiTrash2 /> },
];

/* ------------------ STATUS OPTIONS ------------------ */
const statusOptions = [
    { value: 'bonus', label: 'Bonus', color: '#3454d1' },
    { value: 'arrer', label: 'Arrer', color: '#ffa21d' },
    { value: 'epfo', label: 'EPFO', color: '#17c666' },
    { value: 'esic', label: 'ESIC', color: '#ea4d4d' },
];

/* ------------------ STATUS CELL ------------------ */
const TableCell = memo(({ options, defaultSelect, onStatusChange }) => {
    const [selectedValue, setSelectedValue] = useState(defaultSelect);

    useEffect(() => {
        setSelectedValue(defaultSelect);
    }, [defaultSelect]);

    const selectedOption = options.find(
        (opt) => opt.value === selectedValue
    );

    return (
        <SelectDropdown
            options={options}
            value={selectedValue}
            selectedOption={selectedOption}
            onSelectOption={(option) => {
                setSelectedValue(option.value);
                onStatusChange(option.value);
            }}
        />
    );
});

/* ------------------ MAIN COMPONENT ------------------ */
const ProjectTable = () => {
    const [data, setData] = useState([]);
    const [rowStatus, setRowStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientData();
    }, []);

    /* ------------------ API CALL ------------------ */
    const fetchClientData = async () => {
        try {
            setLoading(true);
            setError(null);

            const company_id = localStorage.getItem('selected_company');
            const client_type = 'GeM';
            const token = localStorage.getItem('token');

            if (!company_id) throw new Error('Company not selected');
            if (!token) throw new Error('Token missing');

            const response = await fetch(
                `https://green-owl-255815.hostingersite.com/api/client/employee/view?company_id=${company_id}&client_type=${client_type}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'API Error');
            }

            if (result.status && Array.isArray(result.data)) {
                setData(result.data);
                setRowStatus(result.data.map(() => 'bonus'));
            } else {
                setData([]);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateRowStatus = (index, value) => {
        const updated = [...rowStatus];
        updated[index] = value;
        setRowStatus(updated);
    };

    /* ------------------ TABLE COLUMNS ------------------ */
    const columns = [
        {
            id: 'contract_no', // Add id
            accessorKey: 'contract_no',
            header: () => 'Contract No',
            cell: ({ row }) => (
                <div>
                    <div className="fw-bold">{row.original.contract_no}</div>
                    <small className="text-muted">
                        {row.original.service_title}
                    </small>
                </div>
            ),
        },
        {
            id: 'customer_name', // Add id
            accessorKey: 'customer_name',
            header: () => 'Customer',
            cell: ({ row }) => (
                <div>
                    <div className="fw-bold">{row.original.customer_name}</div>
                    <small className="text-muted">{row.original.email}</small>
                </div>
            ),
        },
        {
            id: 'organisation', // Add id
            accessorKey: 'organisation_name',
            header: () => 'Organisation',
            cell: ({ row }) => (
                <div>
                    <div>{row.original.organisation_name}</div>
                    <small className="text-muted">
                        {row.original.ministry}
                    </small>
                </div>
            ),
        },
        {
            id: 'contact', // Add id
            accessorKey: 'contact_no',
            header: () => 'Contact',
            cell: ({ row }) => (
                <div>
                    <div>{row.original.contact_no}</div>
                    <small className="text-muted">
                        {row.original.buyer_name}
                    </small>
                </div>
            ),
        },
        {
            id: 'dates', // Add id
            header: () => 'Dates',
            cell: ({ row }) => (
                <div>
                    <div>
                        From:{' '}
                        {new Date(
                            row.original.service_start_date
                        ).toLocaleDateString()}
                    </div>
                    <div>
                        To:{' '}
                        {new Date(
                            row.original.service_end_date
                        ).toLocaleDateString()}
                    </div>
                </div>
            ),
        },
        {
            id: 'status', // Add id
            header: () => 'Status',
            cell: ({ row }) => (
                <TableCell
                    options={statusOptions}
                    defaultSelect={rowStatus[row.index] || 'bonus'}
                    onStatusChange={(value) =>
                        updateRowStatus(row.index, value)
                    }
                />
            ),
        },
        {
            id: 'actions', // Add id
            header: () => 'Actions',
            cell: ({ row }) => (
                <div className="hstack gap-2 justify-content-end">
                    <a
                          href={`/compliance/arrer/?status=arrer&client_id=${row.original.id}`}

                        className="avatar-text avatar-md"
                    >
                        <FiEye />
                    </a>
                    <a
                        href={`/compliance/edit/${row.original.id}`}
                        className="avatar-text avatar-md"
                    >
                        <FiEdit3 />
                    </a>
                    <Dropdown
                        dropdownItems={actions}
                        triggerClassNaclassName="avatar-md"
                        triggerPosition="0,21"
                        triggerIcon={<FiMoreHorizontal />}
                    />
                </div>
            ),
        },
    ];

    /* ------------------ UI STATES ------------------ */
    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error)
        return (
            <div className="text-center py-4 text-danger">
                Error: {error}
            </div>
        );
    if (!data.length)
        return <div className="text-center py-4">No data found</div>;

    return <Table data={data} columns={columns} />;
};

export default ProjectTable;