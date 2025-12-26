'use client'
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { AttandanceClientTableData } from '@/utils/fackData/AttandanceClientTableData';
import Input from '../shared/Input';

const actions = [
    { label: "Edit", icon: <FiEdit3 /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },
    { label: "Delete", icon: <FiTrash2 />, },
];


const TableCell = memo(({ options }) => {
    console.log("options", options)
     const { text, color } = options;
    return (
         <span className={`badge bg-soft-${color} text-${color} mx-3`}>
            {text}
        </span>
    );
});

const ProjectTable = () => {

    const columns = [
        {
            accessorKey: 'id',
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
                headerClassName: 'width-30',
            },
        },

        {
            accessorKey: 'project-name',
            header: () => 'Client-name',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <div className="hstack gap-4">
                        <div className="avatar-image border-0">
                            <img src={roles?.img} alt="" className="img-fluid" />
                        </div>
                        <div>
                            <a href="projects-view.html" className="text-truncate-1-line">{roles?.title}</a>
                            
                        </div>
                    </div>
                )
            },
            meta: {
                className: 'project-name-td'
            }
        },
        {
            accessorKey: 'customer',
            header: () => 'Customer',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        {
                            roles?.img ?
                                <div className="avatar-image avatar-md">
                                    <img src={roles?.img} alt="" className="img-fluid" />
                                </div>
                                :
                                <div className="text-white avatar-text user-avatar-text avatar-md">{roles?.name.substring(0, 1)}</div>
                        }
                        <div>
                            <span className="text-truncate-1-line">{roles?.name}</span>
                            <small className="fs-12 fw-normal text-muted">{roles?.email}</small>
                        </div>
                    </a>
                )
            }
        },
        {
            accessorKey: 'phone',
            header: () => 'Phone',
        }, 
        {
            accessorKey: 'email',
            header: () => 'E-mail',
        },
        {
            accessorKey: 'organisation',
            header: () => 'Organisation Name',
        },
        {
            accessorKey: 'ministry',
            header: () => 'Ministry',
        }, 
        {
            accessorKey: 'onboard-date',
            header: () => 'Month',
        },
        {
    accessorKey: 'status',
    header: () => 'Status',
    cell: (info) => {
    const value = info.getValue();
    return <TableCell options={{ text: value.defaultSelect, color: value.color }} />;
}
},
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: info => (
                <div className="hstack gap-2 justify-content-end">
                    <a href="/attendance/view" className="avatar-text avatar-md">
                        <FiEye />
                    </a>
                    <Dropdown dropdownItems={actions} triggerClassNaclassName='avatar-md' triggerPosition={"0,21"} triggerIcon={<FiMoreHorizontal />} />
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ]

    return (
        <>
            <Table data={AttandanceClientTableData} columns={columns} />
        </>
    )
}

export default ProjectTable
