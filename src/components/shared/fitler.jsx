'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiFilter, FiX, FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const ClientFilter = ({ 
  onFilterApply, 
  onFilterReset, 
  triggerPosition,
  triggerIcon,
  triggerClass,
  isAvatar,
  dropdownAutoClose,
  isItemIcon,
  companyId = 18 // Default company ID
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    clientName: null,
    ministry: null,
    organizationName: null,
    email: null,
    department: null,
    officeZone: null,
    dateRange: { start: null, end: null },
    status: null,
    contractType: null
  });

  // State for dynamic options from API
  const [options, setOptions] = useState({
    clientNameOptions: [],
    ministryOptions: [],
    organizationOptions: [],
    emailOptions: [],
    departmentOptions: [],
    officeZoneOptions: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Static options that don't come from API
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const contractTypeOptions = [
    { value: 'gem', label: 'GeM' },
    { value: 'regular', label: 'Regular' },
  ];

  // Function to get token from localStorage
  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token'); // Adjust key name if different
    }
    return null;
  }, []);

  // Fetch filter options from API with token
  const fetchFilterOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const token = getToken();
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://green-owl-255815.hostingersite.com/api/client-filter-options?company_id=${companyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        } else if (response.status === 500) {
          throw new Error('Server error (500). Please try again later or contact support.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const responseData = await response.json();
      console.log('API Response Data:', responseData);
      
      // Check if response has the expected structure
      if (responseData.status === true && responseData.data) {
        const data = responseData.data;
        
        // Transform API data to react-select format
        const transformedOptions = {
          clientNameOptions: data.clientNames?.map(item => ({ 
            value: item, 
            label: item 
          })) || [],
          
          ministryOptions: data.ministries?.map(item => ({ 
            value: item, 
            label: item 
          })) || [],
          
          organizationOptions: data.organizationNames?.map(item => ({ 
            value: item, 
            label: item 
          })) || [],
          
          emailOptions: data.emails?.map(item => ({ 
            value: item, 
            label: item 
          })) || [],
          
          departmentOptions: data.departments?.map(item => ({ 
            value: item, 
            label: item 
          })) || [],
          
          officeZoneOptions: data.officeZones?.map(item => ({ 
            value: item, 
            label: item 
          })) || []
        };
        
        setOptions(transformedOptions);
        console.log('Transformed Options:', transformedOptions);
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (err) {
      console.error('Error fetching filter options:', err);
      setError(err.message);
      
      // Set fallback options in case of error
      setOptions({
        clientNameOptions: [
          { value: 'client1', label: 'Client 1' },
          { value: 'client2', label: 'Client 2' },
        ],
        ministryOptions: [
          { value: 'ministry1', label: 'Ministry 1' },
          { value: 'ministry2', label: 'Ministry 2' },
        ],
        organizationOptions: [
          { value: 'org1', label: 'Organization 1' },
          { value: 'org2', label: 'Organization 2' },
        ],
        emailOptions: [
          { value: 'email1', label: 'email1@example.com' },
          { value: 'email2', label: 'email2@example.com' },
        ],
        departmentOptions: [
          { value: 'dept1', label: 'Department 1' },
          { value: 'dept2', label: 'Department 2' },
        ],
        officeZoneOptions: [
          { value: 'zone1', label: 'Zone 1' },
          { value: 'zone2', label: 'Zone 2' },
        ]
      });
    } finally {
      setLoading(false);
    }
  }, [companyId, getToken]);

  // Fetch options when component mounts
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Custom styles for react-select to match Bootstrap
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '38px',
      borderColor: state.isFocused ? '#86b7fe' : '#dee2e6',
      boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#86b7fe',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1060,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#0d6efd' 
        : state.isFocused 
        ? '#f8f9fa' 
        : 'white',
      color: state.isSelected ? 'white' : '#212529',
      '&:active': {
        backgroundColor: state.isSelected ? '#0d6efd' : '#e9ecef',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6c757d',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#212529',
    }),
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setFilters(prev => ({ ...prev, dateRange: { start, end } }));
  };

  const handleApplyFilters = () => {
    // Convert Select options back to values for the callback
    const filterValues = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key === 'dateRange') {
        acc[key] = value;
      } else if (value && typeof value === 'object') {
        acc[key] = value.value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    if (onFilterApply) {
      onFilterApply(filterValues);
    }
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      clientName: null,
      ministry: null,
      organizationName: null,
      email: null,
      department: null,
      officeZone: null,
      dateRange: { start: null, end: null },
      status: null,
      contractType: null
    });
    if (onFilterReset) {
      onFilterReset();
    }
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'dateRange') {
        return value.start || value.end;
      }
      return value !== null && value !== "";
    }).length;
  };

  const activeFilterCount = getActiveFilterCount();

  // Refresh options button handler
  const handleRefreshOptions = () => {
    fetchFilterOptions();
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        className={`${triggerClass} position-relative`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {triggerIcon}
        {activeFilterCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Dropdown Panel */}
      {isOpen && (
        <div 
          className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg"
          style={{ 
            width: "800px", 
            zIndex: 1050,
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h6 className="mb-0 fw-semibold">Filter Clients</h6>
            <div className="d-flex gap-2">
              {error && (
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleRefreshOptions}
                  title="Retry loading options"
                >
                  Retry
                </button>
              )}
              <button 
                className="btn btn-link text-dark p-0"
                onClick={() => setIsOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-3 text-center">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Loading filter options...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-3">
              <div className="alert alert-warning mb-0">
                <strong>Note:</strong> Using default options. API Error: {error}
              </div>
            </div>
          )}

          {/* Filter Body */}
          {!loading && (
            <div className="p-3">
              <div className="row g-3">
                {/* Client Name */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Client Name <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={options.clientNameOptions}
                    value={filters.clientName}
                    onChange={(value) => handleFilterChange("clientName", value)}
                    placeholder="Choose Any One"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Ministry */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Ministry <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={options.ministryOptions}
                    value={filters.ministry}
                    onChange={(value) => handleFilterChange("ministry", value)}
                    placeholder="Choose Any One"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Organization Name */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Organization Name <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={options.organizationOptions}
                    value={filters.organizationName}
                    onChange={(value) => handleFilterChange("organizationName", value)}
                    placeholder="Choose Any One"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Email</label>
                  <Select
                    options={options.emailOptions}
                    value={filters.email}
                    onChange={(value) => handleFilterChange("email", value)}
                    placeholder="Choose Any One"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Department */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Department <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={options.departmentOptions}
                    value={filters.department}
                    onChange={(value) => handleFilterChange("department", value)}
                    placeholder="Choose Any One"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Office Zone */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Office Zone <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={options.officeZoneOptions}
                    value={filters.officeZone}
                    onChange={(value) => handleFilterChange("officeZone", value)}
                    placeholder="Choose Any One"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Date Range Filter */}
                <div className="col-12">
                  <label className="form-label fw-medium">Date Range</label>
                  <div className="d-flex gap-2 align-items-center">
                    <div className="flex-grow-1">
                      <DatePicker
                        selectsRange={true}
                        startDate={filters.dateRange.start}
                        endDate={filters.dateRange.end}
                        onChange={handleDateRangeChange}
                        placeholderText="Select date range"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        isClearable={true}
                      />
                    </div>
                    <FiCalendar className="text-muted" size={18} />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Status</label>
                  <Select
                    options={statusOptions}
                    value={filters.status}
                    onChange={(value) => handleFilterChange("status", value)}
                    placeholder="All Status"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>

                {/* Contract Type */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Contract Type</label>
                  <Select
                    options={contractTypeOptions}
                    value={filters.contractType}
                    onChange={(value) => handleFilterChange("contractType", value)}
                    placeholder="All Types"
                    isClearable
                    styles={customSelectStyles}
                    isDisabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer with Actions */}
          <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
            <button 
              className="btn btn-outline-secondary"
              onClick={handleResetFilters}
              disabled={loading}
            >
              Reset
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleApplyFilters}
              disabled={loading}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientFilter;