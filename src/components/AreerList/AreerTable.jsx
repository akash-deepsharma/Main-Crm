'use client'
import React from 'react';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi';
import Dropdown from '@/components/shared/Dropdown';
import TableAreer from '../shared/table/TableAreer';

// ===============================
// ACTION ITEMS
// ===============================
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

// ===============================
// SAMPLE DATA (DYNAMIC MONTH VALUES)
// ===============================
let employeeBonusTableData = [
  {
    id: 1,
    employee_name: "Ajeet Kumar",
    designation: "Mali/Gardner Helper(Semi-skilled)",
    employee_id: "emp-001",

    rates: {
      "New Rate": { paid: 672.85 },
      "Old Rate": { paid: 662.85 },
      "Diff Rate": { paid: 10 }
    },

    days: {
      "days": {
        "Oct-23": 26,
        "Nov-23": 25,
        "Dec-23": 27,
        "Jan-23": 28,
        "Feb-23": 24,
        "Mar-23": 26,
      }
    }
  },
  {
    id: 2,
    employee_name: "Ajeet Kumar",
    designation: "Mali/Gardner Helper(Semi-skilled)",
    employee_id: "emp-001",

    rates: {
      "New Rate": { paid: 672.85 },
      "Old Rate": { paid: 662.85 },
      "Diff Rate": { paid: 10 }
    },

    days: {
      "days": {
        "Oct-23": 26,
        "Nov-23": 25,
        "Dec-23": 27,
        "Jan-23": 28,
        "Feb-23": 24,
        "Mar-23": 26,
      }
    }
  },
  {
    id: 3,
    employee_name: "Ajeet Kumar",
    designation: "Mali/Gardner Helper(Semi-skilled)",
    employee_id: "emp-001",

    rates: {
      "New Rate": { paid: 672.85 },
      "Old Rate": { paid: 662.85 },
      "Diff Rate": { paid: 10 }
    },

    days: {
      "days": {
        "Oct-23": 26,
        "Nov-23": 25,
        "Dec-23": 27,
        "Jan-23": 28,
        "Feb-23": 24,
        "Mar-23": 26,
      }
    }
  },
  {
    id: 4,
    employee_name: "Ajeet Kumar",
    designation: "Mali/Gardner Helper(Semi-skilled)",
    employee_id: "emp-001",

    rates: {
      "New Rate": { paid: 672.85 },
      "Old Rate": { paid: 662.85 },
      "Diff Rate": { paid: 10 }
    },

    days: {
      "days": {
        "Oct-23": 26,
        "Nov-23": 25,
        "Dec-23": 27,
        "Jan-23": 28,
        "Feb-23": 24,
        "Mar-23": 26,
      }
    }
  }
];

// ===============================
// TABLE COMPONENT
// ===============================
const AreerTable = () => {

  const rateKeys = ["New Rate", "Old Rate", "Diff Rate"];
  const dayKeys = ["days"];

  // Auto generate months from the object
  const monthsKeys = Object.keys(employeeBonusTableData[0].days["days"]);

  // ===============================
  // CALCULATION FUNCTION
  // ===============================
  const calculateRowValues = (row) => {
    const diffRate = row.rates["Diff Rate"].paid // using New Rate for salary calculations
    const monthValues = row.days["days"];

    const totalDays = Object.values(monthValues).reduce((sum, v) => sum + v, 0);
    const totalSalary = totalDays * diffRate;

    const bonus = totalSalary * 0.0833;
    // const service = totalSalary * 0.0385;
    const service = totalSalary + (totalSalary * 0.12) + (totalSalary * 0.0833) + (totalSalary * 0.0325) + (totalSalary * 0.01);

    const servicesTotal = service + (totalSalary * 0.0075) + (service * 0.0385);
    const igst = servicesTotal * 0.18;
    console.log("igst", igst)
    const subTotal = servicesTotal + igst;

    return {
      total_days: totalDays.toFixed(2),
      total_salary: totalSalary.toFixed(2),
      epf_12: (totalSalary * 0.12).toFixed(2),
      esi_075: (totalSalary * 0.0075).toFixed(2),
      esi_325: (totalSalary * 0.0325).toFixed(2),
      edliAdmin: (totalSalary * 0.01).toFixed(2),
      total: (totalSalary + (totalSalary * 0.12) + (totalSalary * 0.0833) + (totalSalary * 0.0325) + (totalSalary * 0.01)).toFixed(2),
      bonus_8_33_percent: bonus.toFixed(2),
      services_3_85_percent: (service * 0.0385).toFixed(2),
      services_total: servicesTotal.toFixed(2),
      isgt_18_percent: igst.toFixed(2),
      sub_total: subTotal.toFixed(2)
    };
  };

  // Add calculated fields to row
  const enrichedData = employeeBonusTableData.map(item => ({
    ...item,
    ...calculateRowValues(item)
  }));

  // ===============================
  // TABLE COLUMNS
  // ===============================
  const columns = [
    { accessorKey: "employee_id", header: "Employee ID" },
    { accessorKey: "employee_name", header: "Employee Name" },
    { accessorKey: "designation", header: "Designation" },

    // ===============================
    // RATES GROUP
    // ===============================
    ...rateKeys.flatMap(rate => [
      {
        header: rate,
        id: `${rate}_group`,
        isRate: true,
        columns: [
          {
            header: "Wages per day",
            id: `${rate}_paid`,
            isRateColumn: true,
            cell: ({ row }) => row.original.rates[rate].paid
          }
        ]
      }
    ]),

    // ===============================
    // DAYS GROUP (DYNAMIC MONTHS)
// ===============================
    ...dayKeys.flatMap(day => [
      {
        header: day,
        id: `${day}_group`,
        isDay: true,
        columns: monthsKeys.map((month, index) => ({
          header: month,
          id: `${day}_${month}_${index}`,
          isDayColumn: true,
          cell: ({ row }) => {
            const monthData = row.original.days[day];
            return monthData?.[month] ?? "-";
          }
        }))
      }
    ]),

    // ===============================
    // AUTO CALCULATED FIELDS
    // ===============================
    { accessorKey: "total_days", header: "Total Days" },
    { accessorKey: "total_salary", header: "Total Salary" },
    { accessorKey: "epf_12", header: "EPF @12%" },
    { accessorKey: "bonus_8_33_percent", header: "Bonus @8.33%" },
    { accessorKey: "esi_325", header: "ESI @3.25%" },
    { accessorKey: "edliAdmin", header: "EDLI Admin Charge @1%" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "services_3_85_percent", header: "Services @3.85%" },
    { accessorKey: "esi_075", header: "ESI @0.75%" },
    { accessorKey: "services_total", header: "Total" },
    { accessorKey: "isgt_18_percent", header: "ISGT @18%" },
    { accessorKey: "sub_total", header: "Sub Total" },

    // ===============================
    // ACTIONS
    // ===============================
    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: () => (
        <div className="hstack gap-2 justify-content-end">
          <a href="/attendance/view" className="avatar-text avatar-md"><FiEye /></a>
          <Dropdown dropdownItems={actions} triggerClassName="avatar-md" triggerPosition="0,21" triggerIcon={<FiMoreHorizontal />} />
        </div>
      ),
      meta: { headerClassName: "text-end" }
    }
  ];

  // Render table with enriched data
  return <TableAreer data={enrichedData} columns={columns} />;
};

export default AreerTable;
