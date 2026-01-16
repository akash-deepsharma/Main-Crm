'use client'
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';

const actions = [
    { label: "Edit", icon: <FiEdit3 /> },
    { label: "Print", icon: <FiPrinter /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },
    { label: "Archive", icon: <FiArchive /> },
    { label: "Report Spam", icon: <FiAlertOctagon />, },
    { type: "divider" },
    { label: "Delete", icon: <FiTrash2 />, },
];


const employeeSalaryTableData = [
    {
        "id": 1,
        "employee-name": {
            "title": "Spark",
            "img": "/images/brand/app-store.png",
        },
        "employee-id": {
            "name": "EMPNI9623",
        },
        "esi_no": "1014853713",
        "epf_uan_no": "100257814054",
        "designation": "Fire Pump Wet Riser Operator",        
        "salary_status":"Paid",
        "month_days": "30",
        "days": "23",
         "Extra_hr": "23",
        "rate": "724",
        "total_basic": "24480",
        "annual_bonus": "2039.1	",
        "pf_12": "1800",
        "esic_75": "184.0",
        "pf_13": "1950",
        "esic_325": "795.0	",
        "total_salary": "29264",
    },
    {
        "id": 2,
        "employee-name": {
            "title": "Nexus",
            "img": "/images/brand/dropbox.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "employee-id": {
            "name": "EMPNI9623",
        },
        "esi_no": "1014853713",
        "epf_uan_no": "100257814054",
        "designation": "Helper",        
        "salary_status":"Process",
        "month_days": "30",
        "days": "23",
         "Extra_hr": "23",
        "rate": "724",
        "total_basic": "24480",
        "annual_bonus": "2039.1	",
        "pf_12": "1800",
        "esic_75": "184.0",
        "pf_13": "1950",
        "esic_325": "795.0	",
        "total_salary": "29264",
    },
    {
        "id": 3,
        "employee-name": {
            "title": "Velocity",
            "img": "/images/brand/facebook.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "employee-id": {
            "name": "EMPNI9623",
        },
        "esi_no": "1014853713",
        "epf_uan_no": "100257814054",
        "designation": "Electrician",        
        "salary_status":"Hold",
        "month_days": "30",
        "days": "23",
        "Extra_hr": "23",
        "rate": "724",
        "total_basic": "24480",
        "annual_bonus": "2039.1	",
        "pf_12": "1800",
        "esic_75": "184.0",
        "pf_13": "1950",
        "esic_325": "795.0	",
        "total_salary": "29264",
    },
 
]

const WagesTable = () => {

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
            accessorKey: 'employee-id',
            header: () => 'Employee ID',
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
            accessorKey: 'employee-name',
            header: () => 'Employee-name',
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
            accessorKey: 'designation',
            header: () => 'DESIGNATION',
        }, 
        // {
        //     accessorKey: 'salary_status',
        //     header: () => 'Salary Status',
        //     cell: info => (
        //         <span className="badge bg-soft-primary text-primary mx-3 fs-16">
        //             {info.getValue()}
        //         </span>
        //     ),
        // },
        {
    accessorKey: 'salary_status',
    header: () => 'Salary Status',
    cell: info => {
        const status = info.getValue();
        let badgeClass = "badge mx-3 fs-16";

        if (status.toLowerCase() === "hold") {
            badgeClass += " bg-soft-danger text-danger";
        } else if (status.toLowerCase() === "process") {
            badgeClass += " bg-soft-primary text-primary";
        } else if (status.toLowerCase() === "paid") {
            badgeClass += " bg-soft-success text-success";
        }

        return <span className={badgeClass}>{status}</span>;
    },
},      
        {
            accessorKey: 'esi_no',
            header: () => 'ESI NO',
        }, 
        {
            accessorKey: 'epf_uan_no',
            header: () => 'EPF UAN NO',
        },
        {   
            accessorKey: 'month_days',
            header: () => 'MONTH DAYS',
        }, 
        {
            accessorKey: 'days',
            header: () => 'Days',
        },
        {
            accessorKey: 'Extra_hr',
            header: () => 'Extra Hr',
        },
        {
            accessorKey: 'rate',
            header: () => 'RATE',
        },
         {
            accessorKey: 'total_basic',
            header: () => 'TOTAL BASIC',
        },
         {
            accessorKey: 'annual_bonus',
            header: () => 'ANNUAL BONUS',
        },
         {
            accessorKey: 'pf_12',
            header: () => 'PF E’R 12%',
        },
         {
            accessorKey: 'esic_75',
            header: () => 'ESIC E’R 0.75%',
        },
         {
            accessorKey: 'pf_13',
            header: () => 'PF E’R 13%',
        },
         {
            accessorKey: 'esic_325',
            header: () => 'ESIC E’R 3.25%',
        },
         {
            accessorKey: 'total_salary',
            header: () => 'TOTAL SALARY',
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: info => (
                <div className="hstack gap-2 justify-content-end">
                    <a href="/salary/salary-slip" className="avatar-text avatar-md">
                        <FiEye />
                    </a>
                    {/* <Dropdown dropdownItems={actions} triggerClassNaclassName='avatar-md' triggerPosition={"0,21"} triggerIcon={<FiMoreHorizontal />} /> */}
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ]

    return (
        <>
            <Table data={employeeSalaryTableData} columns={columns} />
        </>
    )
}

export default WagesTable
