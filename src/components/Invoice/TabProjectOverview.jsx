"use client";
import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiX,
  FiCheck,
  FiFileText,
  FiTag,
  FiTool,
  FiPercent
} from "react-icons/fi";
import SelectDropdown from "../shared/SelectDropdown";
import InvoiceTable from "./InvoiceTable";

const TabProjectOverview = () => {
  const [clients, setClients] = useState([]);
  const [clientType, setClientType] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientName, setSelectedClientName] = useState(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Invoice fields
  const [gstType, setGstType] = useState("cgst_sgst");
  const [gstApplicableOn, setGstApplicableOn] = useState("full_salary");
  const [gstOnMaterial, setGstOnMaterial] = useState(false);
  const [gstOnAllowances, setGstOnAllowances] = useState(false);
  const [holdSalery, setHoldSalery] = useState(false);
  const [adminChargeApplicable, setAdminChargeApplicable] = useState(false);
  const [adminChargeType, setAdminChargeType] = useState("percentage");
  const [adminChargeValue, setAdminChargeValue] = useState("");
  const [adminChargeApplicableOn, setAdminChargeApplicableOn] = useState("full_salary");
  
  // Fixed: Renamed these state variables to avoid duplicates
  const [adminEsi, setAdminEsi] = useState(false);
  const [adminEpf, setAdminEpf] = useState(false);
  const [adminBonus, setAdminBonus] = useState(false);
  const [adminAreer, setAdminAreer] = useState(false);

  const [gstEsi, setGstEsi] = useState(false);
  const [gstEpf, setGstEpf] = useState(false);
  const [gstBonus, setGstBonus] = useState(false);
  const [gstAreer, setGstAreer] = useState(false);
  
  const [adminChargeOnMaterial, setAdminChargeOnMaterial] = useState(false);
  const [adminChargeOnAllowances, setAdminChargeOnAllowances] = useState(false);

  const clientTypeOptions = [
    { value: "GeM", label: "GeM" },
    { value: "Corporate", label: "Corporate" },
  ];

  // Fetch clients from API with improved error handling
  const fetchClients = async (type, companyId) => {
    try {
      setLoadingClients(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found in localStorage");
        setClients([]);
        return;
      }

      // Construct URL with proper encoding
      const apiUrl = new URL("https://green-owl-255815.hostingersite.com/api/client/empl/view");
      apiUrl.searchParams.append("client_type", type);
      apiUrl.searchParams.append("company_id", companyId);

      console.log("Fetching clients from:", apiUrl.toString());

      const res = await fetch(apiUrl.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "same-origin", // or "include" if needed
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
      }

      const result = await res.json();
      console.log("API Response:", result);

      if (result?.status && Array.isArray(result.data)) {
        const options = result.data.map((c) => ({
          value: c.id,
          label: c.contract_no || c.name || `Client ${c.id}`,
          ...c,
        }));
        setClients(options);
      } else {
        console.warn("Unexpected API response structure:", result);
        setClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
      // Show user-friendly error
      alert(`Failed to load clients: ${error.message}. Please check your connection and try again.`);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleClientTypeChange = (option) => {
    setClientType(option?.value || "");
    setClients([]);
    setSelectedClient(null);
    setSelectedClientName(null);

    const companyId = localStorage.getItem("selected_company");
    if (option?.value && companyId) {
      fetchClients(option.value, companyId);
    }
  };

  const handleClientSelect = (opt) => {
    if (opt && opt.value) {
      setSelectedClient(opt);
      setSelectedClientName(opt.label);
    } else {
      setSelectedClient(null);
      setSelectedClientName(null);
    }
  };

  const handleOpenInvoiceModal = () => {
    if (!selectedClient) {
      alert("Please select a Client first");
      return;
    }

    // Reset to defaults
    setGstType("cgst_sgst");
    setGstApplicableOn("full_salary");
    setGstOnMaterial(false);
    setGstOnAllowances(false);
    setHoldSalery(false);
    setAdminChargeApplicable(false);
    setAdminChargeType("percentage");
    setAdminChargeValue("");
    setAdminChargeApplicableOn("full_salary");
    setAdminEsi(false);
    setAdminEpf(false);
    setAdminBonus(false);
    setAdminAreer(false);
    setGstEsi(false);
    setGstEpf(false);
    setGstBonus(false);
    setGstAreer(false);
    setAdminChargeOnMaterial(false);
    setAdminChargeOnAllowances(false);
    setSaveError(null);

    setModalData({
      clientType: clientType,
      client: selectedClient,
    });

    setShowInvoiceModal(true);
  };

  const handleModalSubmit = async () => {
    if (adminChargeApplicable && adminChargeValue) {
      const adminChargeNum = parseFloat(adminChargeValue);

      if (adminChargeNum <= 0) {
        alert("Please enter a valid admin charge value (greater than 0)");
        return;
      }
    }

    const invoiceData = {
  client_id: modalData.client.value,
  client_name: modalData.client.label,
  client_type: modalData.clientType,
  gst_type: gstType,
  gst_applicable_on: gstApplicableOn,
  gst_on_material: gstOnMaterial,
  gst_on_allowances: gstOnAllowances,
  holdSalery: holdSalery,
  gst_esi: gstEsi,
  gst_epf: gstEpf,
  gst_bonus: gstBonus,
  gst_areer: gstAreer,
  admin_charge_applicable: adminChargeApplicable,
  admin_charge_type: adminChargeApplicable ? adminChargeType : null,
  admin_charge_value: adminChargeApplicable && adminChargeValue ? parseFloat(adminChargeValue) : null,
  admin_charge_applicable_on: adminChargeApplicable ? adminChargeApplicableOn : null,
  admin_charge_on_material: adminChargeOnMaterial,
  admin_charge_on_allowances: adminChargeOnAllowances,
  admin_charge_esi: adminEsi,
  admin_charge_epf: adminEpf,
  admin_charge_bonus: adminBonus,
  admin_charge_areer: adminAreer
};


const formattedData ={
  client: {
    id: invoiceData.client_id,
    name: invoiceData.client_name,
    type: invoiceData.client_type
  },
  gst: {
    type: invoiceData.gst_type,
    applicable_on: invoiceData.gst_applicable_on,
    on_material: invoiceData.gst_on_material,
    on_allowances: invoiceData.gst_on_allowances,
    components: {
      esi: invoiceData.gst_esi,
      epf: invoiceData.gst_epf,
      bonus: invoiceData.gst_bonus,
      arrear: invoiceData.gst_areer
    }
  },
  admin_charge: {
    applicable: invoiceData.admin_charge_applicable,
    type: invoiceData.admin_charge_type,
    value: invoiceData.admin_charge_value,
    applicable_on: invoiceData.admin_charge_applicable_on,
    on_material: invoiceData.admin_charge_on_material,
    on_allowances: invoiceData.admin_charge_on_allowances,
    components: {
      esi: invoiceData.admin_charge_esi,
      epf: invoiceData.admin_charge_epf,
      bonus: invoiceData.admin_charge_bonus,
      arrear: invoiceData.admin_charge_areer
    }
  }
  ,
  holdSalery: invoiceData.holdSalery
};

    console.log("Sending invoice data:", formattedData);
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(
        "https://green-owl-255815.hostingersite.com/api/invoices",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );
        const result1 = await response.json();
        
        console.log("Response status:", result1);
        
        let result;
        
      // Try to parse response even if it's not OK
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        const text = await response.text();
        throw new Error(`Server returned invalid JSON: ${text}`);
      }

      console.log("Invoice save response:", result);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result?.message || "Unknown error"}`);
      }

      if (result?.success === true || result?.status === "success") {
        setShowInvoiceModal(false);
        alert("Invoice saved successfully!",result);
        // You might want to refresh the invoice table here
      } else {
        throw new Error(result?.message || "Failed to save invoice");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      setSaveError(error.message);
      alert(`Failed to save invoice: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalClose = () => {
    setShowInvoiceModal(false);
    setSaveError(null);
  };

  const isClientSelected = selectedClient !== null;

  // Test API connection on component mount (optional)
  useEffect(() => {
    // You can add a test API call here to check connectivity
    const testConnection = async () => {
      try {
        await fetch("https://green-owl-255815.hostingersite.com/", {
          method: "HEAD",
          mode: "cors",
        });
        console.log("API server is reachable");
      } catch (error) {
        console.warn("API server may be unreachable:", error);
      }
    };
    testConnection();
  }, []);

  return (
    <>
      <div className="tab-pane fade active show" id="overviewTab">
        <div className="row">
          <div className="col-lg-12">
            <div className="card stretch stretch-full">
              <div className="card-body task-header align-items-center">
                <fieldset>
                  <div className="mb-5">
                    <h2 className="fs-16 fw-bold">Select Client for Invoice</h2>
                  </div>

                  <fieldset>
                    <div className="row mb-5 pb-5">
                      {/* Client Type Dropdown */}
                      <div className="col-lg-4 mb-4">
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
                      </div>

                      {/* Select Client Dropdown */}
                      <div className="col-lg-4 mb-4">
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
                      </div>

                      {/* Open Modal Button */}
                      <div className="col-lg-4 mb-4 d-flex align-items-end">
                        <button
                          className={`btn w-100 ${isClientSelected ? "btn-primary" : "btn-secondary"}`}
                          onClick={handleOpenInvoiceModal}
                          disabled={!isClientSelected || loadingClients}
                        >
                          <FiFileText className="me-2" />
                          Set Invoice
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            <InvoiceTable selectedClientId={selectedClient?.value || null} selectedClientName={selectedClientName || null} />
          </div>
        </div>
      </div>

      {/* Invoice Setup Modal */}
      {showInvoiceModal && modalData && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white">
                  <FiFileText className="me-2" />
                  Create New Invoice
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                {/* Show error if exists */}
                {saveError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> {saveError}
                    <button type="button" className="btn-close" onClick={() => setSaveError(null)}></button>
                  </div>
                )}

                {/* Client Information */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Client Information:</h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <div className="card bg-light">
                        <div className="card-body py-2">
                          <small className="text-muted d-block">Client Type</small>
                          <strong>{modalData.clientType}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8 mb-2">
                      <div className="card bg-light">
                        <div className="card-body py-2">
                          <small className="text-muted d-block">Client</small>
                          <strong>{modalData.client?.label}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row"></div>

                {/* GST Configuration */}
                <div className="mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                      <h6 className="card-title fw-bold">
                        <FiPercent className="me-2" />
                        GST Configuration
                      </h6>
                      
                      {/* Material GST */}
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <div className="form-check form-switch mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="materialGstSwitch"
                              checked={gstOnMaterial}
                              onChange={(e) => setGstOnMaterial(e.target.checked)}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="materialGstSwitch">
                              GST on Material
                            </label>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-check form-switch mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="allowancesGstSwitch"
                              checked={gstOnAllowances}
                              onChange={(e) => setGstOnAllowances(e.target.checked)}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="allowancesGstSwitch">
                              GST on Allowances
                            </label>
                          </div>
                        </div>
                      </div>

                        </div>
                        <div className="col-6">
                        {/* Apply on Hold Salery or Not */}
                          <div className="form-check form-switch mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="holdSalerySwitch"
                              checked={holdSalery}
                              onChange={(e) => setHoldSalery(e.target.checked)}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="holdSalerySwitch">
                              Apply on Hold Salery or Not
                            </label>
                          </div>
                     

                        </div>
                      </div>


                      {/* GST Type */}
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">GST Type</label>
                          <div className="d-flex flex-wrap gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gstType"
                                id="gstCgstSgst"
                                value="cgst_sgst"
                                checked={gstType === "cgst_sgst"}
                                onChange={(e) => setGstType(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="gstCgstSgst">
                                CGST + SGST
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gstType"
                                id="gstIgst"
                                value="igst"
                                checked={gstType === "igst"}
                                onChange={(e) => setGstType(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="gstIgst">
                                IGST
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        
                        {/* GST Applicable On */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Applicable On</label>
                          <div className="d-flex flex-column gap-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gstApplicableOn"
                                id="gstFullSalary"
                                value="full_salary"
                                checked={gstApplicableOn === "full_salary"}
                                onChange={(e) => setGstApplicableOn(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="gstFullSalary">
                                Full Salary (Wages + Compliance)
                              </label>
                            </div>
                             {gstApplicableOn === "full_salary" && (
                                    <div className="row ms-3">
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={gstEsi}
                                          onChange={(e) => setGstEsi(e.target.checked)}
                                          id="gstEsi"
                                        />
                                        <label className="form-check-label" htmlFor="gstEsi">
                                          ESI
                                        </label>
                                      </div>
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={gstEpf}
                                          onChange={(e) => setGstEpf(e.target.checked)}
                                          id="gstEpf"
                                        />
                                        <label className="form-check-label" htmlFor="gstEpf">
                                          EPF
                                        </label>
                                      </div>
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={gstBonus}
                                          onChange={(e) => setGstBonus(e.target.checked)}
                                          id="gstBonus"
                                        />
                                        <label className="form-check-label" htmlFor="gstBonus">
                                          Bonus
                                        </label>
                                      </div>
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={gstAreer}
                                          onChange={(e) => setGstAreer(e.target.checked)}
                                          id="gstAreer"
                                        />
                                        <label className="form-check-label" htmlFor="gstAreer">
                                          Areer
                                        </label>
                                      </div>
                                    </div>
                                  )}
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gstApplicableOn"
                                id="gstWagesOnly"
                                value="wages_only"
                                checked={gstApplicableOn === "wages_only"}
                                onChange={(e) => setGstApplicableOn(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="gstWagesOnly">
                                Basic Only
                              </label>
                            </div>
                             {gstApplicableOn === "wages_only" && ( 
                                  <div className="col-xl-12 mt-2"><p> <b className="badge bg-warning text-white">Note :- </b> Invoice will be calculte on the basis on emplyee Attandance*Minimum Daily wages </p></div>

                                )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Charge Configuration */}
                <div className="mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title fw-bold">
                        <FiTool className="me-2" />
                        Admin Charge Configuration
                      </h6>
                      
                      {/* General Admin Charge */}
                      <div className="row g-3">
                        <div className="col-md-12 mb-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="adminChargeSwitch"
                              checked={adminChargeApplicable}
                              onChange={(e) => setAdminChargeApplicable(e.target.checked)}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="adminChargeSwitch">
                              General Admin Charge Applicable
                            </label>
                          </div>
                        </div>
                        
                        {adminChargeApplicable && (
                          <>
                            <div className="col-md-4 mb-3">
                              <div>
                                <label className="form-label fw-semibold">Charge Type</label>
                                <div className="d-flex gap-3">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="adminChargeType"
                                      id="adminPercentage"
                                      value="percentage"
                                      checked={adminChargeType === "percentage"}
                                      onChange={(e) => setAdminChargeType(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="adminPercentage">
                                      Percentage
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="adminChargeType"
                                      id="adminFixed"
                                      value="fixed"
                                      checked={adminChargeType === "fixed"}
                                      onChange={(e) => setAdminChargeType(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="adminFixed">
                                      Fixed Amount
                                    </label>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <label className="form-label fw-semibold">
                                  {adminChargeType === "percentage" ? "Charge Percentage" : "Charge Amount"}
                                  {adminChargeApplicable && <span className="text-danger ms-1">*</span>}
                                </label>
                                <div className="input-group">
                                  <span className="input-group-text">
                                    {adminChargeType === "percentage" ? "%" : "₹"}
                                  </span>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={adminChargeValue}
                                    onChange={(e) => setAdminChargeValue(e.target.value)}
                                    min="0"
                                    max={adminChargeType === "percentage" ? "100" : undefined}
                                    step={adminChargeType === "percentage" ? "0.01" : "1"}
                                    placeholder={adminChargeApplicable ? "Required" : "Optional"}
                                    required={adminChargeApplicable}
                                    disabled={!adminChargeApplicable}
                                  />
                                </div>
                                {adminChargeType === "percentage" && adminChargeApplicable && (
                                  <small className="text-muted">Enter a value between 0 and 100</small>
                                )}
                              </div>
                            </div>

                          

                            {adminChargeType !== "fixed" && (
                              <div className="col-md-6">
                                <label className="form-label fw-semibold">Applicable On</label>
                                <div className="d-flex flex-column gap-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="adminChargeApplicableOn"
                                      id="adminFullSalary"
                                      value="full_salary"
                                      checked={adminChargeApplicableOn === "full_salary"}
                                      onChange={(e) => setAdminChargeApplicableOn(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="adminFullSalary">
                                      Full Salary (Wages + Compliance)
                                    </label>
                                  </div>
                                  {adminChargeApplicableOn === "full_salary" && (
                                    <div className="row ms-3">
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={adminEsi}
                                          onChange={(e) => setAdminEsi(e.target.checked)}
                                          id="adminEsi"
                                        />
                                        <label className="form-check-label" htmlFor="adminEsi">
                                          ESI
                                        </label>
                                      </div>
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={adminEpf}
                                          onChange={(e) => setAdminEpf(e.target.checked)}
                                          id="adminEpf"
                                        />
                                        <label className="form-check-label" htmlFor="adminEpf">
                                          EPF
                                        </label>
                                      </div>
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={adminBonus}
                                          onChange={(e) => setAdminBonus(e.target.checked)}
                                          id="adminBonus"
                                        />
                                        <label className="form-check-label" htmlFor="adminBonus">
                                          Bonus
                                        </label>
                                      </div>
                                      <div className="col-3 form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox"
                                          checked={adminAreer}
                                          onChange={(e) => setAdminAreer(e.target.checked)}
                                          id="adminAreer"
                                        />
                                        <label className="form-check-label" htmlFor="adminAreer">
                                          Areer
                                        </label>
                                      </div>
                                    </div>
                                  )}
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="adminChargeApplicableOn"
                                      id="adminWagesOnly"
                                      value="wages_only"
                                      checked={adminChargeApplicableOn === "wages_only"}
                                      onChange={(e) => setAdminChargeApplicableOn(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="adminWagesOnly">
                                      Basic Only
                                    </label>
                                  </div>
                                </div>
                                {adminChargeApplicableOn === "wages_only" && ( 
                                  <div className="col-xl-12 mt-2"><p> <b className="badge bg-warning text-white">Note :- </b> Invoice will be calculte on the basis on emplyee Attandance*Minimum Daily wages </p></div>

                                )}
                              </div>
                            )}

                            {/* Material Admin Charge */}
                            <div className="row mb-3">
                              <div className="col-md-12">
                                <div className="form-check form-switch mb-3">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="materialAdminSwitch"
                                    checked={adminChargeOnMaterial}
                                    onChange={(e) => setAdminChargeOnMaterial(e.target.checked)}
                                  />
                                  <label className="form-check-label fw-semibold" htmlFor="materialAdminSwitch">
                                    Admin Charge on Material
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Allowances Admin Charge */}
                            <div className="row mb-3">
                              <div className="col-md-12">
                                <div className="form-check form-switch mb-3">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="allowancesAdminSwitch"
                                    checked={adminChargeOnAllowances}
                                    onChange={(e) => setAdminChargeOnAllowances(e.target.checked)}
                                  />
                                  <label className="form-check-label fw-semibold" htmlFor="allowancesAdminSwitch">
                                    Admin Charge on Allowances
                                  </label>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleModalClose}
                  disabled={isSaving}
                >
                  <FiX className="me-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="me-2" />
                      Save Invoice
                    </>
                  )}
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