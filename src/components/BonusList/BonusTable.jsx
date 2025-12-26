'use client'
import React, { useState, memo, useEffect } from 'react'
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import TableBonus from '../shared/table/TableBonus';

// ------------------------------
// AUTO CALCULATION FUNCTIONS
// ------------------------------
const calculateTotalDays = (months) => {
  return Object.values(months).reduce((sum, m) => sum + (m.days_paid || 0), 0);
};

const calculateTotalSalary = (months) => {
  return Object.values(months).reduce((sum, m) => sum + (m.salary || 0), 0);
};

const calculateAll = (emp) => {
  const total_days = calculateTotalDays(emp.months);
  const total_salary = calculateTotalSalary(emp.months);

  const bonus_8_33_percent = +(total_salary * 0.0833).toFixed(2);
  const services_3_85_percent = +(bonus_8_33_percent * 0.0385).toFixed(2);
  const services_total = +(bonus_8_33_percent + services_3_85_percent).toFixed(2);
  const isgt_18_percent = +(services_total * 0.18).toFixed(2);
  const sub_total = +(services_total + isgt_18_percent).toFixed(2);

  return {
    ...emp,
    total_days,
    total_salary,
    bonus_8_33_percent,
    bonus_total: bonus_8_33_percent,
    services_3_85_percent,
    services_total,
    isgt_18_percent,
    sub_total
  };
};
// ------------------------------
// END CALCULATION FUNCTIONS
// ------------------------------


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


const TableCell = memo(({ options, defaultSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <SelectDropdown
      options={options}
      defaultSelect={defaultSelect}
      selectedOption={selectedOption}
      onSelectOption={(option) => setSelectedOption(option)}
    />
  );
});


// ------------------------------
// ORIGINAL DATA WITH MONTHS ONLY
// (Totals will be auto-calculated)
// ------------------------------
let employeeBonusTableData = [
  {
    id: 1,
    employee_name: "Ajeet Kumar",
    designation: "Mali/Gardner Helper(Semi-skilled)",
    project_division: "Mali",
    months: {
      "Oct-23": { days_paid: 22, salary: 6313 },
      "Nov-23": { days_paid: 26, salary: 19279 },
      "Dec-23": { days_paid: 26, salary: 19279 },
      "Jan-23": { days_paid: 26, salary: 19279 },
      "Feb-23": { days_paid: 26, salary: 19279 },
      "Mar-23": { days_paid: 26, salary: 19279 },
    }
  },
  {
    id: 2,
    employee_name: "Bindu Devi",
    designation: "Mali/Gardner Helper(Semi-skilled)",
    project_division: "Mali",
    months: {
      "Oct-23": { days_paid: 22, salary: 19279 },
      "Nov-23": { days_paid: 26, salary: 19279 },
      "Dec-23": { days_paid: 26, salary: 19279 },
      "Jan-23": { days_paid: 26, salary: 19279 },
      "Feb-23": { days_paid: 26, salary: 19279 },
      "Mar-23": { days_paid: 26, salary: 19279 },
    }
  },
  {
    id: 3,
    employee_name: "Pankaj Kumar",
    designation: "Mali/Gardner Helper(Semi-skilled)",
    project_division: "Mali",
    months: {
      "Oct-23": { days_paid: 26, salary: 19279 },
      "Nov-23": { days_paid: 26, salary: 19279 },
      "Dec-23": { days_paid: 26, salary: 19279 },
      "Jan-23": { days_paid: 26, salary: 19279 },
      "Feb-23": { days_paid: 26, salary: 19279 },
      "Mar-23": { days_paid: 26, salary: 19279 },
    }
  }
];

// -------------------------------------
// DYNAMICALLY APPLY CALCULATION HERE
// -------------------------------------
employeeBonusTableData = employeeBonusTableData.map(emp => calculateAll(emp));


const BonusTable = () => {

  const monthKeys = ["Oct-23", "Nov-23", "Dec-23", "Jan-23", "Feb-23", "Mar-23"];

  const columns = [
    { accessorKey: "employee_name", header: "Employee Name" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "project_division", header: "Project / Division" },

    ...monthKeys.flatMap(month => [
      {
        header: month,
        id: `${month}_group`,
        isMonthGroup: true,
        columns: [
          {
            header: "Days Paid",
            id: `${month}_days`,
            isMonthSubColumn: true,
            cell: ({ row }) => row.original.months[month].days_paid
          },
          {
            header: "SALARY",
            id: `${month}_salary`,
            isMonthSubColumn: true,
            cell: ({ row }) => row.original.months[month].salary
          }
        ]
      }
    ]),

    { accessorKey: "total_days", header: "Total Days" },
    { accessorKey: "total_salary", header: "Total Salary" },
    { accessorKey: "bonus_8_33_percent", header: "Bonus @8.33%" },
    { accessorKey: "services_3_85_percent", header: "Services @3.85%" },
    { accessorKey: "services_total", header: "Total" },
    { accessorKey: "isgt_18_percent", header: "ISGT @18%" },
    { accessorKey: "sub_total", header: "Sub Total" },

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
      meta: { headerClassName: 'text-end' }
    },
  ];


  return (
    <>
      <TableBonus data={employeeBonusTableData} columns={columns} />
    </>
  );
};

export default BonusTable
