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
  
  // Invoice fields

  const [billingCycle, setBillingCycle] = useState("monthly");
  const [gstType, setGstType] = useState("cgst_sgst");
  const [gstApplicableOn, setGstApplicableOn] = useState("full_salary");
  const [gstOnMaterial, setGstOnMaterial] = useState(false);
  const [gstOnAllowances, setGstOnAllowances] = useState(false);
  const [adminChargeApplicable, setAdminChargeApplicable] = useState(false);
  const [adminChargeType, setAdminChargeType] = useState("");
  const [adminChargeValue, setAdminChargeValue] = useState("");
  const [adminChargeApplicableOn, setAdminChargeApplicableOn] = useState("full_salary");
  const [adminChargeOnMaterial, setAdminChargeOnMaterial] = useState(false);
  const [adminChargeOnAllowances, setAdminChargeOnAllowances] = useState(false);

  const clientTypeOptions = [
    { value: "GeM", label: "GeM" },
    { value: "Corporate", label: "Corporate" },
  ];

  // Fetch clients from API
  const fetchClients = async (type, companyId) => {
    try {
      setLoadingClients(true);
      const token = localStorage.getItem("token");

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
    setAdminChargeApplicable(false);
    setAdminChargeType("");
    setAdminChargeValue("");
    setAdminChargeApplicableOn("full_salary");
    setAdminChargeOnMaterial(false);
    setAdminChargeOnAllowances(false);

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
      billing_cycle: billingCycle,
      gst_type: gstType,
      gst_applicable_on: gstApplicableOn,
      gst_on_material: gstOnMaterial,
      gst_on_allowances: gstOnAllowances,
      admin_charge_applicable: adminChargeApplicable,
      admin_charge_type: adminChargeApplicable ? adminChargeType : null,
      admin_charge_value: adminChargeApplicable && adminChargeValue ? parseFloat(adminChargeValue) : null,
      admin_charge_applicable_on: adminChargeApplicable ? adminChargeApplicableOn : null,
      admin_charge_on_material: adminChargeOnMaterial,
      admin_charge_on_allowances: adminChargeOnAllowances
    };

    console.log("Sending invoice data:", invoiceData);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://green-owl-255815.hostingersite.com/api/invoices",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Invoice save response:", result);
      
      if (result?.success === true) {
        setShowInvoiceModal(false);
        alert("Invoice saved successfully!");
      } else {
        alert("Failed to save invoice: " + (result?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice. Please try again.");
    }
  };

  const handleModalClose = () => {
    setShowInvoiceModal(false);
  };



  const isClientSelected = selectedClient !== null;

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
                          disabled={!isClientSelected}
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

                {/* Invoice Basic Information */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Invoice Details:</h6>
                  <div className="row g-3">
                    
                    <div className="col-md-3">
                      <label className="form-label fw-semibold">Billing Cycle</label>
                      <select
                        className="form-select"
                        value={billingCycle}
                        onChange={(e) => setBillingCycle(e.target.value)}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="halfyearly">Half Yearly</option>
                        <option value="yearly">Yearly</option>
                        <option value="one_time">One Time</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* GST Configuration */}
                <div className="mb-4">
                  <div className="card">
                    <div className="card-body">
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
                      </div>

                      {/* Allowances GST */}
                      <div className="row mb-3">
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
                                Wages Only
                              </label>
                            </div>
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
                            <div className="col-md-4">
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
                            
                            <div className="col-md-4">
                              <label className="form-label fw-semibold">
                                {adminChargeType === "percentage" ? "Charge Percentage" : "Charge Amount"}
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
                                  step={adminChargeType === "percentage" ? "0.01" : "1"}
                                  placeholder="Optional"
                                />
                              </div>
                              <small className="text-muted">Can be left empty</small>
                            </div>
                            
                            <div className="col-md-4">
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
                                    Wages Only
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
                  Save Invoice
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