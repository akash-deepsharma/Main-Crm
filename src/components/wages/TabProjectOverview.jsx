"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  FiCalendar,
  FiEye,
  FiAlertTriangle,
  FiX,
  FiCheck,
  FiDollarSign,
  FiPercent,
} from "react-icons/fi";
import WagesTable from "./WagesTable";
import SelectDropdown from "../shared/SelectDropdown";

const TabProjectOverview = () => {
  const [clients, setClients] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [designationsValue, setDesignationsValue] = useState(null);
  const [clientType, setClientType] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingDesignationsValue, setLoadingDesignationsValue] = useState(false);
  const [showWagesModal, setShowWagesModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [epfoType, setEpfoType] = useState("full"); // full | ceiling
  const [esiType, setEsiType] = useState("full"); // full | ceiling - NEW STATE
  const [otApplicable, setOtApplicable] = useState(0); // 0 | 1
  const [otBase, setOtBase] = useState("full"); // full | ceiling
  const [bonusApplicable, setBonusApplicable] = useState(0); // 0 | 1
  const [bonusFrequency, setBonusFrequency] = useState("monthly");
  const [arrearApplicable, setArrearApplicable] = useState(0); // 0 | 1
  const [arrearFrequency, setArrearFrequency] = useState("monthly");
  const [otRateType, setOtRateType] = useState("same"); // same | twice | custom
  const [customOtRate, setCustomOtRate] = useState("");
  const [optionalAllowances, setOptionalAllowances] = useState({});
  const [additionalAllowance, setAdditionalAllowance] = useState({ enabled: false, amount: "" });
console.log("modal data", modalData)
  // Client type options
  const clientTypeOptions = [
    { value: "GeM", label: "GeM" },
    { value: "Corporate", label: "Corporate" },
  ];

  // Calculate values based on min_daily_wages and selected options
  const calculateValues = useMemo(() => {
    if (!modalData?.designationValue?.min_daily_wages) {
      return null;
    }

    const minDailyWages = parseFloat(modalData.designationValue.min_daily_wages) || 0;
    const monthworkingdays = parseInt(modalData.designationValue.no_of_working_day);
    const duty_hours = parseInt(modalData.designationValue.duty_hours) ;
    // Constants
    const WORKING_DAYS_PER_MONTH = monthworkingdays;
    const WORKING_HOURS_PER_DAY = duty_hours;
    const MONTHLY_HOURS = WORKING_DAYS_PER_MONTH * WORKING_HOURS_PER_DAY;
    const EPFO_CEILING = 15000;
    const ESI_CEILING = 21000;
    const EPFO_EMPLOYER_CONTRIBUTION_RATE = 0.13; // 13%
    const EPFO_EMPLOYEE_CONTRIBUTION_RATE = 0.12; // 12%
    const ESI_EMPLOYER_CONTRIBUTION_RATE = 0.0325; // 3.25%
    const ESI_EMPLOYEE_CONTRIBUTION_RATE = 0.0075; // 0.75%
    
    // Calculate monthly salary
    const monthlySalary = minDailyWages * WORKING_DAYS_PER_MONTH;
    
    // Calculate EPFO Base
    const epfoBase = epfoType === "ceiling" 
      ? Math.min(monthlySalary, EPFO_CEILING)
      : monthlySalary;
    
    // Calculate ESI Base
    const esiBase = esiType === "ceiling"
      ? Math.min(monthlySalary, ESI_CEILING)
      : monthlySalary;
    
    // Calculate EPFO Contributions
    const epfoEmployerContribution = epfoBase * EPFO_EMPLOYER_CONTRIBUTION_RATE;
    const epfoEmployeeContribution = epfoBase * EPFO_EMPLOYEE_CONTRIBUTION_RATE;
    const totalEPFOContribution = epfoEmployerContribution + epfoEmployeeContribution;
    
    // Calculate ESI Contributions
    const esiEmployerContribution = esiBase * ESI_EMPLOYER_CONTRIBUTION_RATE;
    const esiEmployeeContribution = esiBase * ESI_EMPLOYEE_CONTRIBUTION_RATE;
    const totalESIContribution = esiEmployerContribution + esiEmployeeContribution;
    
    // Calculate OT Rate
    let hourlyRate = monthlySalary / MONTHLY_HOURS;
    let otRate = 0;
    
    if (otApplicable === 1) {
      const otCalculationBase = otBase === "ceiling" 
        ? Math.min(monthlySalary, EPFO_CEILING)
        : monthlySalary;
      
      const otHourlyRate = otCalculationBase / MONTHLY_HOURS;
      
      switch (otRateType) {
        case "same":
          otRate = otHourlyRate;
          break;
        case "twice":
          otRate = otHourlyRate * 2;
          break;
        case "custom":
          otRate = parseFloat(customOtRate) || 0;
          break;
        default:
          otRate = otHourlyRate;
      }
    }
    
    // Calculate Bonus
    let bonusAmount = 0;
    if (bonusApplicable === 1 && modalData.designationValue.bonus) {
      const bonusPercentage = parseFloat(modalData.designationValue.bonus) || 0;
      bonusAmount = monthlySalary * (bonusPercentage / 100);
    }
    
    // Calculate Optional Allowances
    let totalOptionalAllowances = 0;
    if (modalData.designationValue) {
      // Check for optionAllowance1, optionAllowance2, optionAllowance3 from API
      for (let i = 1; i <= 3; i++) {
        const allowanceKey = `optionAllowance${i}`;
        const allowanceValue = modalData.designationValue[allowanceKey];
        const allowanceEnabled = optionalAllowances[i]?.enabled || false;
        
        if (allowanceEnabled && allowanceValue && !isNaN(parseFloat(allowanceValue))) {
          const dailyAllowance = parseFloat(allowanceValue);
          const monthlyAllowance = dailyAllowance * WORKING_DAYS_PER_MONTH;
          totalOptionalAllowances += monthlyAllowance;
        }
      }
    }
    
    // Calculate Additional Allowance
    let additionalAllowanceAmount = 0;
    if (additionalAllowance.enabled && additionalAllowance.amount && !isNaN(parseFloat(additionalAllowance.amount))) {
      additionalAllowanceAmount = parseFloat(additionalAllowance.amount) * WORKING_DAYS_PER_MONTH;
    }
    
    // Calculate Total Allowances
    const totalAllowances = totalOptionalAllowances + additionalAllowanceAmount;
    
    // Calculate Total Cost to Company
    const totalCTC = monthlySalary + 
      epfoEmployerContribution + 
      esiEmployerContribution +
      (otApplicable === 1 ? (otRate * WORKING_HOURS_PER_DAY * 4) : 0) + // Assuming 4 OT hours per week
      bonusAmount +
      totalAllowances;
    
    return {
      minDailyWages,
      monthlySalary,
      epfoBase,
      esiBase,
      epfoEmployerContribution,
      epfoEmployeeContribution,
      totalEPFOContribution,
      esiEmployerContribution,
      esiEmployeeContribution,
      totalESIContribution,
      hourlyRate,
      otRate,
      bonusAmount,
      totalOptionalAllowances,
      additionalAllowanceAmount,
      totalAllowances,
      totalCTC,
      workingDays: WORKING_DAYS_PER_MONTH,
      workingHours: WORKING_HOURS_PER_DAY,
      monthlyHours: MONTHLY_HOURS
    };
  }, [modalData, epfoType, esiType, otApplicable, otBase, otRateType, customOtRate, bonusApplicable, optionalAllowances, additionalAllowance]);

  // Initialize optional allowances when designation value is loaded
  useEffect(() => {
    if (modalData?.designationValue) {
      const newOptionalAllowances = {};
      
      // Check for optionAllowance1, optionAllowance2, optionAllowance3 from API
      for (let i = 1; i <= 3; i++) {
        const allowanceKey = `optionAllowance${i}`;
        const allowanceValue = modalData.designationValue[allowanceKey];
        
        if (allowanceValue && parseFloat(allowanceValue) > 0) {
          newOptionalAllowances[i] = {
            enabled: false,
            amount: allowanceValue,
            key: allowanceKey
          };
        }
      }
      
      setOptionalAllowances(newOptionalAllowances);
    }
  }, [modalData?.designationValue]);

  // Fetch clients from API based on client type
  const fetchClients = async (type, companyId) => {
    try {
      setLoadingClients(true);
      const token = localStorage.getItem("token");
      console.log("wages companyId", companyId);

      const res = await fetch(
        `https://green-owl-255815.hostingersite.com/api/client/empl/view?client_type=${type}&company_id=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result?.status && Array.isArray(result.data)) {
        const options = result.data.map((c) => ({
          value: c.id,
          label: c.contract_no || c.name || `Client ${c.id}`,
          ...c,
        }));

        setClients(options);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  // Fetch designations from API based on client id
  const fetchDesignations = async (clientId) => {
    try {
      setLoadingDesignations(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://green-owl-255815.hostingersite.com/api/client-designation?client_id=${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      console.log("Designation API Response:", result);

      if (result?.status && Array.isArray(result.data)) {
        const options = result.data.map((d) => ({
          value: d.id,
          label: d.name || `Designation ${d.id}`,
          ...d,
        }));

        setDesignations(options);
      } else {
        console.warn("No Designations from API");
        setDesignations([]);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
      setDesignations([]);
    } finally {
      setLoadingDesignations(false);
    }
  };

  // Fetch designations value from API based on client id and designation id
  const fetchDesignationsValue = async (clientId, designationId) => {
    try {
      setLoadingDesignationsValue(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://green-owl-255815.hostingersite.com/api/get-service-designation?client_id=${clientId}&designation_id=${designationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      console.log("Designation value API Response:", result);

      if (result?.status && result.data) {
        // Store the entire data object
        setDesignationsValue(result.data);
      } else {
        console.warn("No Designation Value data from API");
        setDesignationsValue(null);
      }
    } catch (error) {
      console.error("Error fetching designation value:", error);
      setDesignationsValue(null);
    } finally {
      setLoadingDesignationsValue(false);
    }
  };

  // Handle client type change
  const handleClientTypeChange = (option) => {
    setClientType(option?.value || "");
    setClients([]);
    setSelectedClient(null);
    setDesignations([]);
    setSelectedDesignation(null);
    setDesignationsValue(null);

    const companyId = sessionStorage.getItem("selected_company");
    if (option?.value && companyId) {
      fetchClients(option.value, companyId);
    }
  };

  const handleClientSelect = (opt) => {
    if (opt && opt.value) {
      setSelectedClient(opt);
      setSelectedDesignation(null);
      setDesignationsValue(null);
      // Fetch designations for selected client
      fetchDesignations(opt.value);
    } else {
      setSelectedClient(null);
      setDesignations([]);
      setSelectedDesignation(null);
      setDesignationsValue(null);
    }
  };

  // Handle designation change properly
  const handleDesignationChange = async (e) => {
    const designationId = e.target.value;
    if (designationId) {
      const selectedDesig = designations.find(
        (d) => d.value.toString() === designationId.toString()
      );
      setSelectedDesignation(selectedDesig || null);
      
      // Fetch designation value when designation is selected
      if (selectedClient && selectedDesig) {
        await fetchDesignationsValue(selectedClient.value, selectedDesig.value);
      }
    } else {
      setSelectedDesignation(null);
      setDesignationsValue(null);
    }
  };

  const handleOpenModal = () => {
    // Validate all required fields are selected
    if (!clientType) {
      alert("Please select Client Type first");
      return;
    }

    if (!selectedClient) {
      alert("Please select a Client first");
      return;
    }

    if (!selectedDesignation) {
      alert("Please select a Designation first");
      return;
    }

    // Set modal data with the actual selected designation object and designation value
    setModalData({
      clientType: clientType,
      client: selectedClient,
      designation: selectedDesignation,
      designationValue: designationsValue // Add the fetched designation value
    });

    // Reset radio button states to defaults
    setEpfoType("full");
    setEsiType("full");
    setOtApplicable(0);
    setOtBase("full");
    setBonusApplicable(0);
    setBonusFrequency("monthly");
    setArrearApplicable(0);
    setArrearFrequency("monthly");
    setOtRateType("same");
    setCustomOtRate("");
    setOptionalAllowances({});
    setAdditionalAllowance({ enabled: false, amount: "" });

    // Open wages modal
    setShowWagesModal(true);
  };

  const handleModalSubmit = async () => {
    // Validate required fields
    if (!epfoType || !esiType) {
      alert("Please select both EPFO and ESI options");
      return;
    }

    // Validate custom OT rate if selected
    if (
      otApplicable === 1 &&
      otRateType === "custom" &&
      (!customOtRate || customOtRate <= 0)
    ) {
      alert("Please enter a valid custom OT rate");
      return;
    }

    // Prepare wages data
    const wagesData = {
      clientType: modalData.clientType,
      client_id: modalData.client.value,
      clientName: modalData.client.label,
      designation_id: modalData.designation.value,
      designationName: modalData.designation.label,
      min_daily_wages: modalData.designationValue?.min_daily_wages || 0,
      epfoType: epfoType,
      epfoBase: calculateValues?.epfoBase || 0,
      epfoEmployerContribution: calculateValues?.epfoEmployerContribution || 0,
      epfoEmployeeContribution: calculateValues?.epfoEmployeeContribution || 0,
      esiType: esiType,
      esiBase: calculateValues?.esiBase || 0,
      esiEmployerContribution: calculateValues?.esiEmployerContribution || 0,
      esiEmployeeContribution: calculateValues?.esiEmployeeContribution || 0,
      otApplicable: otApplicable,
      otBase: otApplicable === 1 ? otBase : null,
      otRateType: otApplicable === 1 ? otRateType : null,
      otRate: calculateValues?.otRate || 0,
      customOtRate:
        otApplicable === 1 && otRateType === "custom" ? customOtRate : null,
      bonusApplicable: bonusApplicable,
      bonusAmount: calculateValues?.bonusAmount || 0,
      bonusFrequency: bonusApplicable === 1 ? bonusFrequency : null,
      arrearApplicable: arrearApplicable,
      arrearFrequency: arrearApplicable === 1 ? arrearFrequency : null,
      monthlySalary: calculateValues?.monthlySalary || 0,
      totalOptionalAllowances: calculateValues?.totalOptionalAllowances || 0,
      additionalAllowanceAmount: calculateValues?.additionalAllowanceAmount || 0,
      totalAllowances: calculateValues?.totalAllowances || 0,
      totalCTC: calculateValues?.totalCTC || 0,
    };

    // Add optional allowances data
    Object.entries(optionalAllowances).forEach(([key, allowance]) => {
      if (allowance.enabled) {
        wagesData[`optionalAllowance${key}_enabled`] = allowance.enabled;
        wagesData[`optionalAllowance${key}_amount`] = allowance.amount;
        wagesData[`optionalAllowance${key}_monthly`] = parseFloat(allowance.amount) * calculateValues?.workingDays || 0;
      }
    });

    // Add additional allowance data
    if (additionalAllowance.enabled) {
      wagesData.additionalAllowance_enabled = additionalAllowance.enabled;
      wagesData.additionalAllowance_amount = additionalAllowance.amount;
      wagesData.additionalAllowance_monthly = calculateValues?.additionalAllowanceAmount || 0;
    }

    // Add all designation details
    if (modalData.designation) {
      Object.entries(modalData.designation).forEach(([key, value]) => {
        if (key !== "value" && key !== "label" && value) {
          wagesData[key] = value;
        }
      });
    }

    // Add designation value details if available
    if (modalData.designationValue) {
      Object.entries(modalData.designationValue).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          wagesData[`designationValue_${key}`] = value;
        }
      });
    }

    console.log("Wages data payload to submit:", wagesData);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://green-owl-255815.hostingersite.com/api/employee-wages/store",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(wagesData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result?.status) {
        // Close modal and reset states
        setShowWagesModal(false);

        // Reset all form states
        setEpfoType("full");
        setEsiType("full");
        setOtApplicable(0);
        setOtBase("full");
        setOtRateType("same");
        setCustomOtRate("");
        setBonusApplicable(0);
        setBonusFrequency("monthly");
        setArrearApplicable(0);
        setArrearFrequency("monthly");
        setOptionalAllowances({});
        setAdditionalAllowance({ enabled: false, amount: "" });

        alert("Wages saved successfully!");
      } else {
        alert("Failed to save wages: " + (result?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving wages:", error);
      alert("Failed to save wages. Please try again.");
    }
  };

  const handleModalClose = () => {
    setShowWagesModal(false);
  };

  // Check if all fields are filled
  const isFormComplete = clientType && selectedClient && selectedDesignation;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Handle optional allowance toggle
  const handleOptionalAllowanceToggle = (allowanceNumber, enabled) => {
    setOptionalAllowances(prev => ({
      ...prev,
      [allowanceNumber]: {
        ...prev[allowanceNumber],
        enabled: enabled
      }
    }));
  };

  // Handle additional allowance change
  const handleAdditionalAllowanceChange = (field, value) => {
    setAdditionalAllowance(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <div className="tab-pane fade active show" id="overviewTab">
        <div className="row">
          <div className="col-lg-12">
            <div className="card stretch stretch-full">
              <div className="card-body task-header align-items-center">
                <fieldset>
                  <div className="mb-5">
                    <h2 className="fs-16 fw-bold">Select Client</h2>
                  </div>

                  <fieldset>
                    <div className="row mb-5 pb-5">
                      {/* Client Type Dropdown */}
                      <div className="col-lg-3 mb-4">
                        <label className="fw-semibold text-dark">
                          Client Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={clientType}
                          onChange={(e) =>
                            handleClientTypeChange({ value: e.target.value })
                          }
                        >
                          <option value="">Select Client Type</option>
                          {clientTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {!clientType && (
                          <small className="text-muted">
                            Select GeM or Corporate
                          </small>
                        )}
                      </div>

                      {/* Select Client Dropdown */}
                      <div className="col-lg-3 mb-4">
                        <label className="fw-semibold text-dark">
                          Select Client <span className="text-danger">*</span>
                        </label>
                        <SelectDropdown
                          options={clients}
                          selectedOption={selectedClient}
                          defaultSelect="Select Client"
                          onSelectOption={handleClientSelect}
                          isLoading={loadingClients}
                          loadingText="Loading clients..."
                          isDisabled={!clientType}
                        />
                        {!clientType && (
                          <small className="text-muted d-block mt-1">
                            Please select client type first
                          </small>
                        )}
                        {loadingClients && (
                          <small className="text-muted d-block mt-1">
                            Fetching {clientType} clients...
                          </small>
                        )}
                      </div>

                      {/* Designation Selector */}
                      <div className="col-lg-3 mb-4">
                        <label className="fw-semibold text-dark">
                          Select Designation{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedDesignation?.value || ""}
                          onChange={handleDesignationChange}
                          disabled={!selectedClient || loadingDesignations}
                        >
                          <option value="">Select Designation</option>
                          {loadingDesignations ? (
                            <option value="" disabled>
                              Loading designations...
                            </option>
                          ) : (
                            designations.map((designation) => (
                              <option
                                key={designation.value}
                                value={designation.value}
                              >
                                {designation.label}
                              </option>
                            ))
                          )}
                        </select>
                        {loadingDesignations && (
                          <small className="text-muted d-block mt-1">
                            Fetching designations...
                          </small>
                        )}
                        {!selectedClient && (
                          <small className="text-muted d-block mt-1">
                            Please select a client first
                          </small>
                        )}
                      </div>

                      {/* Open Modal Button */}
                      <div className="col-lg-3 mb-4 d-flex align-items-end">
                        <button
                          className={`btn w-100 ${
                            isFormComplete ? "btn-primary" : "btn-secondary"
                          }`}
                          onClick={handleOpenModal}
                          disabled={!isFormComplete}
                        >
                          <FiCheck className="me-2" />
                          Set Wages
                        </button>
                      </div>

                      {/* Summary Panel with Designation Value */}
                      <div className="col-lg-12 mt-3">
                        <div className="p-3 bg-light rounded">
                          <h6 className="fw-bold mb-2">Selection Summary:</h6>
                          <div className="row">
                            <div className="col-md-3">
                              <small className="text-muted d-block">
                                <strong>Client Type:</strong>{" "}
                                {clientType || "Not selected"}
                              </small>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted d-block">
                                <strong>Client:</strong>{" "}
                                {selectedClient?.label || "Not selected"}
                              </small>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted d-block">
                                <strong>Designation:</strong>{" "}
                                {selectedDesignation?.label || "Not selected"}
                              </small>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted d-block">
                                <strong>Designation Value Status:</strong>{" "}
                                {loadingDesignationsValue ? (
                                  <span className="text-warning">Loading...</span>
                                ) : designationsValue ? (
                                  <span className="text-success">Loaded ✓</span>
                                ) : (
                                  <span className="text-muted">Not loaded</span>
                                )}
                              </small>
                            </div>
                          </div>
                          
                          {/* Display Designation Value Details if available */}
                          {designationsValue && (
                            <div className="row mt-3 pt-3 border-top">
                              <div className="col-12">
                                <h6 className="fw-bold mb-2">Designation Value Details:</h6>
                                <div className="row">
                                  {Object.entries(designationsValue).map(([key, value]) => (
                                    <div className="col-md-3 mb-1" key={key}>
                                      <small className="text-muted d-block">
                                        <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>{" "}
                                        {value !== null && value !== undefined ? value.toString() : 'N/A'}
                                      </small>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </fieldset>
              </div>
            </div>
          </div>

          {/* <div className="col-xl-12">
            <WagesTable />
          </div> */}
        </div>
      </div>

      {/* Wages Setup Modal */}
      {showWagesModal && modalData && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white">
                  Set Wages for Designation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleModalClose}
                >
                  {/* <FiX /> */}
                </button>
              </div>
              <div className="modal-body">
                {/* Selected Information */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Selected Information:</h6>
                  <div className="row">
                    <div className="col-md-3 mb-2">
                      <div className="card bg-light">
                        <div className="card-body py-2">
                          <small className="text-muted d-block">
                            Client Type
                          </small>
                          <strong>{modalData.clientType}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-2">
                      <div className="card bg-light">
                        <div className="card-body py-2">
                          <small className="text-muted d-block">Client</small>
                          <strong>{modalData.client?.label}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-2">
                      <div className="card bg-light">
                        <div className="card-body py-2">
                          <small className="text-muted d-block">
                            Designation
                          </small>
                          <strong>{modalData.designation?.label}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-2">
                      <div className="card bg-light">
                        <div className="card-body py-2">
                          <small className="text-muted d-block">
                            Value Status
                          </small>
                          <strong className={modalData.designationValue ? "text-success" : "text-warning"}>
                            {modalData.designationValue ? "Loaded" : "Not Available"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Designation Value in Modal if available */}
                {modalData.designationValue && (
                  <div className="mb-4 p-3 border rounded bg-light">
                    <h6 className="fw-bold mb-3">Designation Value Details:</h6>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Min Daily Wages:</span>
                          <span className="fw-bold">
                            ₹{modalData.designationValue.min_daily_wages}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Bonus %:</span>
                          <span className="fw-bold">
                            {modalData.designationValue.bonus}%
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Provident Fund:</span>
                          <span className="fw-bold">
                            ₹{modalData.designationValue.provideant_fund}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">EDLI per Day:</span>
                          <span className="fw-bold">
                            ₹{modalData.designationValue.edliPerDay}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">ESI per Day:</span>
                          <span className="fw-bold">
                            ₹{modalData.designationValue.esiPerDay}
                          </span>
                        </div>
                      </div>
                      {modalData.designationValue.optionAllowance1 && (
                        <div className="col-md-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Option Allowance 1:</span>
                            <span className="fw-bold">
                              ₹{modalData.designationValue.optionAllowance1}/day
                            </span>
                          </div>
                        </div>
                      )}
                      {modalData.designationValue.optionAllowance2 && (
                        <div className="col-md-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Option Allowance 2:</span>
                            <span className="fw-bold">
                              ₹{modalData.designationValue.optionAllowance2}/day
                            </span>
                          </div>
                        </div>
                      )}
                      {modalData.designationValue.optionAllowance3 && (
                        <div className="col-md-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Option Allowance 3:</span>
                            <span className="fw-bold">
                              ₹{modalData.designationValue.optionAllowance3}/day
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Calculation Summary */}
                {calculateValues && (
                  <div className="mb-4 p-3 border rounded bg-light bg-opacity-10">
                    <h6 className="fw-bold mb-3">Calculation Summary:</h6>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card mb-3">
                          <div className="card-body">
                            <h6 className="card-title text-muted">Basic Salary</h6>
                            <div className="d-flex justify-content-between">
                              <span>Daily Wages:</span>
                              <strong>{formatCurrency(calculateValues.minDailyWages)}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Monthly Salary:</span>
                              <strong>{formatCurrency(calculateValues.monthlySalary)}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Working Days:</span>
                              <strong>{calculateValues.workingDays} days</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Hourly Rate:</span>
                              <strong>{formatCurrency(calculateValues.hourlyRate)}/hr</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card mb-3">
                          <div className="card-body">
                            <h6 className="card-title text-muted">EPFO Calculation</h6>
                            <div className="d-flex justify-content-between">
                              <span>Calculation Base:</span>
                              <strong>{epfoType === "full" ? "Full Salary" : "Ceiling (₹15,000)"}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Base Amount:</span>
                              <strong>{formatCurrency(calculateValues.epfoBase)}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Employer (13%):</span>
                              <strong>{formatCurrency(calculateValues.epfoEmployerContribution)}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Employee (12%):</span>
                              <strong>{formatCurrency(calculateValues.epfoEmployeeContribution)}</strong>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-1">
                              <span>Total EPFO:</span>
                              <strong className="text-primary">{formatCurrency(calculateValues.totalEPFOContribution)}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card mb-3">
                          <div className="card-body">
                            <h6 className="card-title text-muted">ESI Calculation</h6>
                            <div className="d-flex justify-content-between">
                              <span>Calculation Base:</span>
                              <strong>{esiType === "full" ? "Full Salary" : "Ceiling (₹21,000)"}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Base Amount:</span>
                              <strong>{formatCurrency(calculateValues.esiBase)}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Employer (3.25%):</span>
                              <strong>{formatCurrency(calculateValues.esiEmployerContribution)}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Employee (0.75%):</span>
                              <strong>{formatCurrency(calculateValues.esiEmployeeContribution)}</strong>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-1">
                              <span>Total ESI:</span>
                              <strong className="text-primary">{formatCurrency(calculateValues.totalESIContribution)}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* OT Calculation */}
                      {otApplicable === 1 && (
                        <div className="col-md-4">
                          <div className="card mb-3">
                            <div className="card-body">
                              <h6 className="card-title text-muted">Overtime Calculation</h6>
                              <div className="d-flex justify-content-between">
                                <span>Calculation Base:</span>
                                <strong>{otBase === "full" ? "Full Salary" : "Ceiling (₹15,000)"}</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Rate Type:</span>
                                <strong>
                                  {otRateType === "same" ? "Same as Salary" : 
                                   otRateType === "twice" ? "Twice Salary" : 
                                   "Custom Rate"}
                                </strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>OT Rate:</span>
                                <strong>{formatCurrency(calculateValues.otRate)}/hr</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>1 hours:</span>
                                <strong>{formatCurrency(calculateValues.otRate * 1)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Bonus Calculation */}
                      {bonusApplicable === 1 && modalData.designationValue?.bonus && (
                        <div className="col-md-4">
                          <div className="card mb-3">
                            <div className="card-body">
                              <h6 className="card-title text-muted">Bonus Calculation</h6>
                              <div className="d-flex justify-content-between">
                                <span>Frequency:</span>
                                <strong className="text-capitalize">{bonusFrequency}</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Percentage:</span>
                                <strong>{modalData.designationValue.bonus}%</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Bonus Amount:</span>
                                <strong>{formatCurrency(calculateValues.bonusAmount)}</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Per {bonusFrequency}:</span>
                                <strong>{formatCurrency(calculateValues.bonusAmount)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Allowances Calculation */}
                      {(calculateValues.totalOptionalAllowances > 0 || calculateValues.additionalAllowanceAmount > 0) && (
                        <div className="col-md-4">
                          <div className="card mb-3">
                            <div className="card-body">
                              <h6 className="card-title text-muted">Allowances</h6>
                              {calculateValues.totalOptionalAllowances > 0 && (
                                <>
                                  <div className="d-flex justify-content-between">
                                    <span>Optional Allowances:</span>
                                    <strong>{formatCurrency(calculateValues.totalOptionalAllowances)}</strong>
                                  </div>
                                  <small className="text-muted d-block">
                                    ({Object.values(optionalAllowances).filter(a => a.enabled).length} selected)
                                  </small>
                                </>
                              )}
                              {calculateValues.additionalAllowanceAmount > 0 && (
                                <div className="d-flex justify-content-between mt-2">
                                  <span>Additional Allowance:</span>
                                  <strong>{formatCurrency(calculateValues.additionalAllowanceAmount)}</strong>
                                </div>
                              )}
                              <div className="d-flex justify-content-between border-top pt-1">
                                <span>Total Allowances:</span>
                                <strong className="text-primary">{formatCurrency(calculateValues.totalAllowances)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Total CTC */}
                      <div className="col-md-4">
                        <div className="card mb-3 bg-light border-primary">
                          <div className="card-body">
                            <h6 className="card-title text-primary fw-bold">Total Cost to Company (CTC)</h6>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Basic Salary:</span>
                              <strong>{formatCurrency(calculateValues.monthlySalary)}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>EPFO Employer:</span>
                              <strong>{formatCurrency(calculateValues.epfoEmployerContribution)}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>ESI Employer:</span>
                              <strong>{formatCurrency(calculateValues.esiEmployerContribution)}</strong>
                            </div>
                            {otApplicable === 1 && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>Overtime (4hrs/week):</span>
                                <strong>{formatCurrency(calculateValues.otRate * 4)}</strong>
                              </div>
                            )}
                            {bonusApplicable === 1 && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>Bonus:</span>
                                <strong>{formatCurrency(calculateValues.bonusAmount)}</strong>
                              </div>
                            )}
                            {calculateValues.totalAllowances > 0 && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>Allowances:</span>
                                <strong>{formatCurrency(calculateValues.totalAllowances)}</strong>
                              </div>
                            )}
                            <div className="d-flex justify-content-between border-top pt-2 mt-2">
                              <span className="fw-bold">Total Monthly CTC:</span>
                              <strong className="text-success fs-3">{formatCurrency(calculateValues.totalCTC)}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row">
                  {/* EPFO Section */}
                  <div className="col-lg-6 mb-4">
                    <h6 className="fw-bold mb-3">EPFO Configuration:</h6>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">
                          EPFO Calculation Base{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="epfoType"
                              id="epfoFull"
                              value="full"
                              checked={epfoType === "full"}
                              onChange={(e) => setEpfoType(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="epfoFull"
                            >
                              Full Salary
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="epfoType"
                              id="epfoCeiling"
                              value="ceiling"
                              checked={epfoType === "ceiling"}
                              onChange={(e) => setEpfoType(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="epfoCeiling"
                            >
                              Ceiling (₹15,000)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* ESI Section */}
                  <div className="col-lg-6 mb-4">
                    <h6 className="fw-bold mb-3">ESI Configuration:</h6>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">
                          ESI Calculation Base{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="esiType"
                              id="esiFull"
                              value="full"
                              checked={esiType === "full"}
                              onChange={(e) => setEsiType(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="esiFull">
                              Full Salary
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="esiType"
                              id="esiCeiling"
                              value="ceiling"
                              checked={esiType === "ceiling"}
                              onChange={(e) => setEsiType(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="esiCeiling"
                            >
                              Ceiling (₹21,000)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bonus Section */}
                  <div className="col-lg-6 mb-4">
                    <h6 className="fw-bold mb-3">Bonus Configuration:</h6>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">
                          Bonus Applicable?
                        </label>
                        <div className="d-flex gap-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="bonusApplicable"
                              id="bonusYes"
                              value={1}
                              checked={bonusApplicable === 1}
                              onChange={(e) =>
                                setBonusApplicable(Number(e.target.value))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="bonusYes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="bonusApplicable"
                              id="bonusNo"
                              value={0}
                              checked={bonusApplicable === 0}
                              onChange={(e) =>
                                setBonusApplicable(Number(e.target.value))
                              }
                            />
                            <label className="form-check-label" htmlFor="bonusNo">
                              No
                            </label>
                          </div>
                        </div>
                      </div>

                      {bonusApplicable === 1 && (
                        <div className="col-md-12">
                          <label className="form-label fw-semibold">
                            Bonus Frequency
                          </label>
                          <div className="d-flex flex-wrap gap-3">
                            {["monthly", "quarterly", "halfyearly", "yearly"].map(
                              (freq) => (
                                <div className="form-check" key={freq}>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="bonusFrequency"
                                    id={`bonus${freq}`}
                                    value={freq}
                                    checked={bonusFrequency === freq}
                                    onChange={(e) =>
                                      setBonusFrequency(e.target.value)
                                    }
                                  />
                                  <label
                                    className="form-check-label text-capitalize"
                                    htmlFor={`bonus${freq}`}
                                  >
                                    {freq}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrear Section */}
                  <div className="col-lg-6 mb-4">
                    <h6 className="fw-bold mb-3">Arrear Configuration:</h6>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">
                          Arrear Applicable?
                        </label>
                        <div className="d-flex gap-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="arrearApplicable"
                              id="arrearYes"
                              value={1}
                              checked={arrearApplicable === 1}
                              onChange={(e) =>
                                setArrearApplicable(Number(e.target.value))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="arrearYes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="arrearApplicable"
                              id="arrearNo"
                              value={0}
                              checked={arrearApplicable === 0}
                              onChange={(e) =>
                                setArrearApplicable(Number(e.target.value))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="arrearNo"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>

                      {arrearApplicable === 1 && (
                        <div className="col-md-12">
                          <label className="form-label fw-semibold">
                            Arrear Frequency
                          </label>
                          <div className="d-flex flex-wrap gap-3">
                            {["monthly", "quarterly", "halfyearly", "yearly"].map(
                              (freq) => (
                                <div className="form-check" key={freq}>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="arrearFrequency"
                                    id={`arrear${freq}`}
                                    value={freq}
                                    checked={arrearFrequency === freq}
                                    onChange={(e) =>
                                      setArrearFrequency(e.target.value)
                                    }
                                  />
                                  <label
                                    className="form-check-label text-capitalize"
                                    htmlFor={`arrear${freq}`}
                                  >
                                    {freq}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* OT Section */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Overtime Configuration:</h6>
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        OT Applicable?
                      </label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="otApplicable"
                            id="otYes"
                            value={1}
                            checked={otApplicable === 1}
                            onChange={(e) =>
                              setOtApplicable(Number(e.target.value))
                            }
                          />
                          <label className="form-check-label" htmlFor="otYes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="otApplicable"
                            id="otNo"
                            value={0}
                            checked={otApplicable === 0}
                            onChange={(e) =>
                              setOtApplicable(Number(e.target.value))
                            }
                          />
                          <label className="form-check-label" htmlFor="otNo">
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    {otApplicable === 1 && (
                      <>
                        {/* OT Calculation Base */}
                        <div className="col-md-12">
                          <label className="form-label fw-semibold">
                            OT Calculation Base
                          </label>
                          <div className="d-flex gap-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="otBase"
                                id="otFull"
                                value="full"
                                checked={otBase === "full"}
                                onChange={(e) => setOtBase(e.target.value)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="otFull"
                              >
                                Full Salary
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="otBase"
                                id="otCeiling"
                                value="ceiling"
                                checked={otBase === "ceiling"}
                                onChange={(e) => setOtBase(e.target.value)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="otCeiling"
                              >
                                Ceiling (₹15,000)
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* OT Rate Type */}
                        <div className="col-md-12">
                          <label className="form-label fw-semibold">
                            OT Rate Type
                          </label>
                          <div className="d-flex flex-wrap gap-3 mb-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="otRateType"
                                id="otSame"
                                value="same"
                                checked={otRateType === "same"}
                                onChange={(e) => setOtRateType(e.target.value)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="otSame"
                              >
                                Same as Salary Rate
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="otRateType"
                                id="otTwice"
                                value="twice"
                                checked={otRateType === "twice"}
                                onChange={(e) => setOtRateType(e.target.value)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="otTwice"
                              >
                                Twice the Salary Rate
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="otRateType"
                                id="otCustom"
                                value="custom"
                                checked={otRateType === "custom"}
                                onChange={(e) => setOtRateType(e.target.value)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="otCustom"
                              >
                                Custom Rate
                              </label>
                            </div>
                          </div>

                          {/* Custom Rate Input Field */}
                          {otRateType === "custom" && (
                            <div className="row mt-2">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label fw-semibold">
                                    Custom OT Rate (per hour)
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">₹</span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Enter custom OT rate"
                                      value={customOtRate}
                                      onChange={(e) =>
                                        setCustomOtRate(e.target.value)
                                      }
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                  <small className="text-muted">
                                    Enter the hourly overtime rate
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Optional Allowance Section */}
                {Object.keys(optionalAllowances).length > 0 && (
                  <div className="mb-4 ">
                    <h6 className="fw-bold mb-3">Optional Allowance Configuration</h6>
                    <div className="row g-3">
                      {Object.entries(optionalAllowances).map(([key, allowance]) => (
                        <div className="col-md-4 mb-3" key={key}>
                          <div className="card">
                            <div className="card-body">
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`allowance${key}`}
                                  checked={allowance.enabled}
                                  onChange={(e) => handleOptionalAllowanceToggle(key, e.target.checked)}
                                />
                                <label
                                  className="form-check-label fw-semibold"
                                  htmlFor={`allowance${key}`}
                                >
                                  Optional Allowance {key}
                                </label>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">Daily Amount:</span>
                                <strong>₹{allowance.amount}/day</strong>
                              </div>
                              {allowance.enabled && (
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                  <span className="text-muted">Monthly Amount:</span>
                                  <strong className="text-success">
                                    ₹{(parseFloat(allowance.amount) * (calculateValues?.workingDays || 26)).toFixed(2)}
                                  </strong>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Allowance Section */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Additional Allowance Configuration</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="additionalAllowanceCheck"
                          checked={additionalAllowance.enabled}
                          onChange={(e) => handleAdditionalAllowanceChange("enabled", e.target.checked)}
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="additionalAllowanceCheck"
                        >
                          Add Additional Allowance
                        </label>
                      </div>
                      
                      {additionalAllowance.enabled && (
                        <div className="card">
                          <div className="card-body">
                            <div className="form-group">
                              <label className="form-label fw-semibold">
                                Additional Allowance Amount (per day)
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">₹</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Enter additional allowance per day"
                                  value={additionalAllowance.amount}
                                  onChange={(e) => handleAdditionalAllowanceChange("amount", e.target.value)}
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <small className="text-muted">
                                Daily allowance amount that will be multiplied by working days
                              </small>
                            </div>
                            {additionalAllowance.amount && !isNaN(parseFloat(additionalAllowance.amount)) && (
                              <div className="mt-3">
                                <div className="d-flex justify-content-between">
                                  <span className="text-muted">Daily Amount:</span>
                                  <strong>₹{parseFloat(additionalAllowance.amount).toFixed(2)}/day</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <span className="text-muted">Monthly Amount:</span>
                                  <strong className="text-success">
                                    ₹{(parseFloat(additionalAllowance.amount) * (calculateValues?.workingDays || 26)).toFixed(2)}
                                  </strong>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleModalClose}
                >
                  <FiX className="me-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalSubmit}
                >
                  <FiCheck className="me-2" />
                  Save Wages
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabProjectOverview;