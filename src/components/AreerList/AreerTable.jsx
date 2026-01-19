'use client'
import React, { useEffect, useState } from 'react';
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
// TABLE COMPONENT
// ===============================
const AreerTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [months, setMonths] = useState([]);

  // Extract client_id from URL
  const getClientIdFromURL = () => {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('client_id');
    return clientId;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientId = getClientIdFromURL();
        
        if (!clientId) {
          setError("Client ID not found in URL");
          setLoading(false);
          return;
        }

        const apiUrl = `https://green-owl-255815.hostingersite.com/api/get-arrear-details?client_id=${clientId}`;
        const token = localStorage.getItem('token');

        console.log("Fetching data from:", apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("API Response:", result);
        if (result.status && result.data) {
          const { transformedData, monthsList } = transformApiDataToTableFormat(result.data);
          setData(transformedData);
          setMonths(monthsList);
        } else {
          throw new Error(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform API data to table format - NO CALCULATIONS
  const transformApiDataToTableFormat = (apiData) => {
    // Group data by employee
    const employeeMap = new Map();
    const allMonthsSet = new Set();

    apiData.forEach(item => {
      // Extract month-year key (e.g., "Jan-26")
      const monthKey = `${item.month.substring(0, 3)}-${item.year.toString().slice(-2)}`;
      allMonthsSet.add(monthKey);
      
      if (!employeeMap.has(item.employee_id)) {
        employeeMap.set(item.employee_id, {
          employee: item.employee,
          designation: item.designation,
          monthsData: new Map(),
          // Store first item's min wages (assuming they're same for all months)
          minWages: {
            old_min_wages: item.old_min_wages,
            new_min_wages: item.new_min_wages
          },
          // Store all arrear items
          arrearItems: []
        });
      }

      const employeeData = employeeMap.get(item.employee_id);
      
      // Store arrear item
      employeeData.arrearItems.push(item);
      
      // Store month data exactly as it comes from API
      employeeData.monthsData.set(monthKey, {
        month: item.month,
        year: item.year,
        old_basic: item.old_basic,
        old_gross: item.old_gross,
        new_basic: item.new_basic,
        new_gross: item.new_gross,
        arrear_basic: item.arrear_basic,
        arrear_gross: item.arrear_gross,
        old_min_wages: item.old_min_wages,
        new_min_wages: item.new_min_wages,
        // You can add more fields here if needed
      });
    });

    // Sort months chronologically
    const monthOrder = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };

    const monthsList = Array.from(allMonthsSet).sort((a, b) => {
      const [monthA, yearA] = a.split('-');
      const [monthB, yearB] = b.split('-');
      
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return monthOrder[monthA] - monthOrder[monthB];
    });

    // Convert to table format
    const transformedData = Array.from(employeeMap.entries()).map(([employeeId, employeeData]) => {
      // Get the min wages difference (new - old)
      const minWageDiff = employeeData.minWages.new_min_wages - employeeData.minWages.old_min_wages;
      
      // Create days object for each month (showing min wage difference or other data)
      const daysObj = {};
      monthsList.forEach(month => {
        const monthData = employeeData.monthsData.get(month);
        if (monthData) {
          // Show the arrear amount for that month
          daysObj[month] = parseFloat(monthData.arrear_gross).toFixed(2);
        } else {
          daysObj[month] = "-";
        }
      });

      return {
        id: employeeId,
        employee_name: employeeData.employee.name,
        designation: employeeData.designation.name,
        // employee_id: `emp-${employeeId.toString().padStart(3, '0')}`,
        employee_id: employeeData.employee.rand_id,

        rates: {
          "New Rate": { paid: employeeData.minWages.new_min_wages },
          "Old Rate": { paid: employeeData.minWages.old_min_wages },
          "Diff Rate": { paid: minWageDiff }
        },
        days: {
          "days": daysObj
        },
        // Store original data for reference
        originalData: {
          monthsData: employeeData.monthsData,
          arrearItems: employeeData.arrearItems
        }
      };
    });

    return { transformedData, monthsList };
  };

  const rateKeys = ["New Rate", "Old Rate", "Diff Rate"];
  const dayKeys = ["days"];

  // Use months from state
  const monthsKeys = months.length > 0 ? months : [];

  // ===============================
  // CALCULATION FUNCTION - REMOVED
  // ===============================
  
  // No calculations, just use the data as is
  const enrichedData = data.map(item => ({
    ...item,
    // Add any additional display fields if needed
    total_days: Object.values(item.days.days).filter(v => v !== "-").length,
    total_arrear: Object.values(item.days.days)
      .filter(v => v !== "-")
      .reduce((sum, v) => sum + parseFloat(v), 0)
      .toFixed(2)
  }));

  // ===============================
  // TABLE COLUMNS
  // ===============================
  const columns = [
    { accessorKey: "employee_id", header: "Employee ID" },
    { accessorKey: "employee_name", header: "Employee Name" },
    { accessorKey: "designation", header: "Designation" },

    // ===============================
    // RATES GROUP - MINIMUM WAGES
    // ===============================
    ...rateKeys.flatMap(rate => [
      {
        header: rate,
        id: `${rate}_group`,
        isRate: true,
        columns: [
          {
            header: "Minimum Wages",
            id: `${rate}_paid`,
            isRateColumn: true,
            cell: ({ row }) => `₹${row.original.rates[rate].paid}`
          }
        ]
      }
    ]),

    // ===============================
    // DAYS GROUP - ARREAR AMOUNTS BY MONTH
    // ===============================
    ...dayKeys.flatMap(day => [
      {
        header: "Arrear Amount",
        id: `${day}_group`,
        isDay: true,
        columns: monthsKeys.map((month, index) => ({
          header: month,
          id: `${day}_${month}_${index}`,
          isDayColumn: true,
          cell: ({ row }) => {
            const monthData = row.original.days[day];
            const value = monthData?.[month];
            return value !== "-" ? `₹${value}` : "-";
          }
        }))
      }
    ]),

    // ===============================
    // SUMMARY FIELDS
    // ===============================
    { 
      accessorKey: "total_days", 
      header: "Total Months", 
      cell: ({ row }) => row.original.total_days 
    },
    { 
      accessorKey: "total_arrear", 
      header: "Total Arrear", 
      cell: ({ row }) => `₹${row.original.total_arrear}` 
    },

    // ===============================
    // ACTIONS
    // ===============================
    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: ({ row }) => {
        // Show when arrear was generated
        const createdDate = row.original.originalData?.arrearItems[0]?.created_at;
        const formattedDate = createdDate ? new Date(createdDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : "N/A";
        
        return (
          <div className="hstack gap-2 justify-content-end align-items-center">
            <span className="text-muted small" title={`Generated on: ${formattedDate}`}>
              {formattedDate}
            </span>
            <a href="/attendance/view" className="avatar-text avatar-md" title="View Details">
              <FiEye />
            </a>
            <Dropdown 
              dropdownItems={actions} 
              triggerClassName="avatar-md" 
              triggerPosition="0,21" 
              triggerIcon={<FiMoreHorizontal />} 
            />
          </div>
        );
      },
      meta: { headerClassName: "text-end" }
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading arrear data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Data</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please check the URL and try again.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <h4 className="alert-heading">No Arrear Data Found</h4>
        <p>No arrear records found for this client.</p>
      </div>
    );
  }

  // Debug information
  console.log("Transformed Data:", enrichedData);
  console.log("Months:", monthsKeys);

  return (
    <>
      <div className="alert alert-info mb-3">
        <h6>Arrear Summary</h6>
        <p>Showing arrears for {enrichedData.length} employee(s)</p>
        <p>Months: {monthsKeys.join(', ')}</p>
      </div>
      
      <TableAreer data={enrichedData} columns={columns} />
    </>
  );
};

export default AreerTable;