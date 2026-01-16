"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useRouter } from "next/navigation";

const API_BASE = "https://green-owl-255815.hostingersite.com/api";

const TabAddressDetails = forwardRef(({ error, initialData }, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  /* =========================
     STATE
  ========================== */

  const [presentAddress, setPresentAddress] = useState({
    presentAddress: "",
    presentCity: "",
    presentState: "",
    presentCountry: "",
    presentZipCode: ""
  });

  const [permanentAddress, setPermanentAddress] = useState({
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentzipcode: ""
  });

  /* =========================
     INITIALIZE WITH EXISTING DATA
  ========================== */

  useEffect(() => {
    if (initialData) {
      // Set present address
      if (initialData.presentAddress) {
        setPresentAddress(prev => ({
          ...prev,
          presentAddress: initialData.presentAddress || "",
          presentCity: initialData.presentCity || "",
          presentState: initialData.presentState || "",
          presentCountry: initialData.presentCountry || "",
          presentZipCode: initialData.presentZipCode || ""
        }));
      }

      // Set permanent address
      if (initialData.permanentAddress) {
        setPermanentAddress(prev => ({
          ...prev,
          permanentAddress: initialData.permanentAddress || "",
          permanentCity: initialData.permanentCity || "",
          permanentState: initialData.permanentState || "",
          permanentCountry: initialData.permanentCountry || "",
          permanentzipcode: initialData.permanentzipcode || ""
        }));
      }

      // Check if addresses are the same
      if (
        initialData.presentAddress === initialData.permanentAddress &&
        initialData.presentCity === initialData.permanentCity &&
        initialData.presentState === initialData.permanentState &&
        initialData.presentCountry === initialData.permanentCountry
      ) {
        setSameAsPresent(true);
      }
    }
  }, [initialData]);

  /* =========================
     VALIDATION FUNCTIONS
  ========================== */

  const validateZipCode = (zipCode, fieldName) => {
    if (!zipCode) {
      return `${fieldName} is required`;
    }
    
    // For India: 6 digits
    if (presentAddress.presentCountry.toLowerCase() === 'india' || 
        permanentAddress.permanentCountry.toLowerCase() === 'india') {
      if (!/^\d{6}$/.test(zipCode)) {
        return "Indian ZIP code must be 6 digits";
      }
    }
    // For US: 5 digits or 5+4 format
    else if (presentAddress.presentCountry.toLowerCase() === 'united states' || 
             permanentAddress.permanentCountry.toLowerCase() === 'united states') {
      if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
        return "US ZIP code format: 12345 or 12345-6789";
      }
    }
    // For UK: Various formats
    else if (presentAddress.presentCountry.toLowerCase() === 'united kingdom' || 
             permanentAddress.permanentCountry.toLowerCase() === 'united kingdom') {
      if (!/^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/.test(zipCode.toUpperCase())) {
        return "UK postcode format: e.g., SW1A 1AA";
      }
    }
    // Generic validation for other countries: 3-10 alphanumeric characters
    else if (!/^[A-Z0-9\s-]{3,10}$/i.test(zipCode)) {
      return "Enter a valid ZIP/Postal code (3-10 characters)";
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate present address fields
    if (!presentAddress.presentAddress?.trim()) {
      newErrors.presentAddress = "Present address is required";
    }
    
    if (!presentAddress.presentCity?.trim()) {
      newErrors.presentCity = "Present city is required";
    } else if (!/^[A-Za-z\s]{2,50}$/.test(presentAddress.presentCity)) {
      newErrors.presentCity = "Enter a valid city name";
    }
    
    if (!presentAddress.presentState?.trim()) {
      newErrors.presentState = "Present state is required";
    } else if (!/^[A-Za-z\s]{2,50}$/.test(presentAddress.presentState)) {
      newErrors.presentState = "Enter a valid state name";
    }
    
    if (!presentAddress.presentCountry?.trim()) {
      newErrors.presentCountry = "Present country is required";
    } else if (!/^[A-Za-z\s]{2,50}$/.test(presentAddress.presentCountry)) {
      newErrors.presentCountry = "Enter a valid country name";
    }
    
    const zipError = validateZipCode(presentAddress.presentZipCode, "Present ZIP code");
    if (zipError) {
      newErrors.presentZipCode = zipError;
    }

    // Validate permanent address fields (only if not same as present)
    if (!sameAsPresent) {
      if (!permanentAddress.permanentAddress?.trim()) {
        newErrors.permanentAddress = "Permanent address is required";
      }
      
      if (!permanentAddress.permanentCity?.trim()) {
        newErrors.permanentCity = "Permanent city is required";
      } else if (!/^[A-Za-z\s]{2,50}$/.test(permanentAddress.permanentCity)) {
        newErrors.permanentCity = "Enter a valid city name";
      }
      
      if (!permanentAddress.permanentState?.trim()) {
        newErrors.permanentState = "Permanent state is required";
      } else if (!/^[A-Za-z\s]{2,50}$/.test(permanentAddress.permanentState)) {
        newErrors.permanentState = "Enter a valid state name";
      }
      
      if (!permanentAddress.permanentCountry?.trim()) {
        newErrors.permanentCountry = "Permanent country is required";
      } else if (!/^[A-Za-z\s]{2,50}$/.test(permanentAddress.permanentCountry)) {
        newErrors.permanentCountry = "Enter a valid country name";
      }
      
      const permanentZipError = validateZipCode(permanentAddress.permanentzipcode, "Permanent ZIP code");
      if (permanentZipError) {
        newErrors.permanentzipcode = permanentZipError;
      }
    } else {
      // If same as present, copy validation from present fields
      const permanentZipError = validateZipCode(permanentAddress.permanentzipcode, "Permanent ZIP code");
      if (permanentZipError) {
        newErrors.permanentzipcode = permanentZipError;
      }
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  /* =========================
     HANDLERS
  ========================== */

  const handlePresentAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Format based on field type
    let formattedValue = value;
    if (name === 'presentZipCode') {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');
    } else if (name === 'presentCity' || name === 'presentState' || name === 'presentCountry') {
      formattedValue = value.replace(/[^A-Za-z\s]/g, '');
    }
    
    setPresentAddress(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    clearError(name);

    // If "same as present" is checked, update permanent address too
    if (sameAsPresent) {
      const permanentField = name.replace('present', 'permanent');
      setPermanentAddress(prev => ({
        ...prev,
        [permanentField]: formattedValue
      }));
      
      // Also clear error for corresponding permanent field
      clearError(permanentField);
    }
  };

  const handlePermanentAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Format based on field type
    let formattedValue = value;
    if (name === 'permanentzipcode') {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');
    } else if (name === 'permanentCity' || name === 'permanentState' || name === 'permanentCountry') {
      formattedValue = value.replace(/[^A-Za-z\s]/g, '');
    }
    
    setPermanentAddress(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    clearError(name);
  };

  const handleSameAsPresentChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsPresent(isChecked);

    if (isChecked) {
      // Copy present address to permanent address
      setPermanentAddress({
        permanentAddress: presentAddress.presentAddress,
        permanentCity: presentAddress.presentCity,
        permanentState: presentAddress.presentState,
        permanentCountry: presentAddress.presentCountry,
        permanentzipcode: presentAddress.presentZipCode
      });

      // Clear all permanent address errors
      const permanentFields = ['permanentAddress', 'permanentCity', 'permanentState', 'permanentCountry', 'permanentzipcode'];
      permanentFields.forEach(field => clearError(field));
    }
  };

  // Handle ZIP code input with formatting
  const handleZipCodeInput = (e, fieldName, setAddressFunction) => {
    const { value } = e.target;
    let formattedValue = value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');
    
    // Auto-format for US ZIP codes
    if ((presentAddress.presentCountry.toLowerCase() === 'united states' || 
         permanentAddress.permanentCountry.toLowerCase() === 'united states') && 
        formattedValue.length === 5 && !formattedValue.includes('-')) {
      formattedValue = formattedValue.slice(0, 5);
    }
    
    setAddressFunction(prev => ({
      ...prev,
      [fieldName]: formattedValue
    }));
    
    clearError(fieldName);
  };

  /* =========================
     SUBMIT (API)
  ========================== */

  const handleSaveAddressDetails = async () => {
    // Validate form before submission
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      
      return false;
    }

    const token = localStorage.getItem("token");
    const employeeId = sessionStorage.getItem("employee_id");

    if (!token || !employeeId) {
      alert("Employee not found. Complete previous steps first.");
      router.replace("/employee");
      return false;
    }

    try {
      setLoading(true);

      // Create payload
      const addressPayload = {
        presentAddress: presentAddress.presentAddress,
        presentCity: presentAddress.presentCity,
        presentState: presentAddress.presentState,
        presentCountry: presentAddress.presentCountry,
        presentZipCode: presentAddress.presentZipCode,
        
        permanentAddress: permanentAddress.permanentAddress,
        permanentCity: permanentAddress.permanentCity,
        permanentState: permanentAddress.permanentState,
        permanentCountry: permanentAddress.permanentCountry,
        permanentzipcode: permanentAddress.permanentzipcode
      };

      console.log("Address payload:", addressPayload);

      const formData = new FormData();
      formData.append("employee_id", employeeId);
      formData.append("step", "4");
      
      Object.keys(addressPayload).forEach(key => {
        formData.append(key, addressPayload[key]);
      });

      const response = await fetch(`${API_BASE}/employee/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Address response", result);

      if (result?.status === true) {
        console.log("Address details saved", result);
        return true;
      } else {
        throw new Error(result?.message || "Save failed");
      }
    } catch (err) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EXPOSE SUBMIT
  ========================== */

  useImperativeHandle(ref, () => ({
    submit: handleSaveAddressDetails,
  }));

  /* =========================
     HELPER FUNCTION
  ========================== */

  const renderErrorMessage = (fieldName) => {
    if (validationErrors[fieldName]) {
      return <div className="text-danger small mt-1">{validationErrors[fieldName]}</div>;
    }
    return null;
  };

  /* =========================
     UI
  ========================== */

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-target">
        {/* Present Address Section */}
        <fieldset>
          <div className="mb-4">
            <h2 className="fs-16 fw-bold">Present Address</h2>
            <p className="text-muted">Complete Present Address details goes here</p>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                Address <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.presentAddress ? "is-invalid" : ""}`}
                name="presentAddress"
                value={presentAddress.presentAddress}
                onChange={handlePresentAddressChange}
                placeholder="Enter present address"
                required
              />
              {renderErrorMessage("presentAddress")}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.presentCity ? "is-invalid" : ""}`}
                name="presentCity"
                value={presentAddress.presentCity}
                onChange={handlePresentAddressChange}
                placeholder="Enter city"
                required
              />
              {renderErrorMessage("presentCity")}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                State <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.presentState ? "is-invalid" : ""}`}
                name="presentState"
                value={presentAddress.presentState}
                onChange={handlePresentAddressChange}
                placeholder="Enter state"
                required
              />
              {renderErrorMessage("presentState")}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                Country <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.presentCountry ? "is-invalid" : ""}`}
                name="presentCountry"
                value={presentAddress.presentCountry}
                onChange={handlePresentAddressChange}
                placeholder="Enter country"
                required
              />
              {renderErrorMessage("presentCountry")}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                ZIP/Postal Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.presentZipCode ? "is-invalid" : ""}`}
                name="presentZipCode"
                value={presentAddress.presentZipCode}
                onChange={(e) => handleZipCodeInput(e, 'presentZipCode', setPresentAddress)}
                placeholder={
                  presentAddress.presentCountry.toLowerCase() === 'india' ? "6 digits (e.g., 110001)" :
                  presentAddress.presentCountry.toLowerCase() === 'united states' ? "12345 or 12345-6789" :
                  presentAddress.presentCountry.toLowerCase() === 'united kingdom' ? "SW1A 1AA" :
                  "Enter ZIP/Postal code"
                }
                maxLength="10"
                required
              />
              {renderErrorMessage("presentZipCode")}
            </div>
          </div>

          {error && (
            <label className="error d-flex align-items-center gap-2 mt-2">
              <FiAlertTriangle /> Please fill all required fields
            </label>
          )}
        </fieldset>

        {/* Same as Present Checkbox */}
        <div className="custom-control custom-checkbox mb-4">
          <input
            type="checkbox"
            className="custom-control-input"
            id="sameAsPresent"
            checked={sameAsPresent}
            onChange={handleSameAsPresentChange}
          />
          <label className="custom-control-label c-pointer" htmlFor="sameAsPresent">
            Permanent Address is same as Present Address
          </label>
        </div>

        {/* Permanent Address Section */}
        <fieldset className="mt-4">
          <div className="mb-4">
            <h2 className="fs-16 fw-bold">Permanent Address</h2>
            <p className="text-muted">Complete Permanent Address details goes here</p>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                Address <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.permanentAddress ? "is-invalid" : ""}`}
                name="permanentAddress"
                value={permanentAddress.permanentAddress}
                onChange={handlePermanentAddressChange}
                placeholder="Enter permanent address"
                required
                disabled={sameAsPresent}
              />
              {renderErrorMessage("permanentAddress")}
              {sameAsPresent && (
                <small className="text-muted">Auto-filled from present address</small>
              )}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.permanentCity ? "is-invalid" : ""}`}
                name="permanentCity"
                value={permanentAddress.permanentCity}
                onChange={handlePermanentAddressChange}
                placeholder="Enter city"
                required
                disabled={sameAsPresent}
              />
              {renderErrorMessage("permanentCity")}
              {sameAsPresent && (
                <small className="text-muted">Auto-filled from present address</small>
              )}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                State <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.permanentState ? "is-invalid" : ""}`}
                name="permanentState"
                value={permanentAddress.permanentState}
                onChange={handlePermanentAddressChange}
                placeholder="Enter state"
                required
                disabled={sameAsPresent}
              />
              {renderErrorMessage("permanentState")}
              {sameAsPresent && (
                <small className="text-muted">Auto-filled from present address</small>
              )}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                Country <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.permanentCountry ? "is-invalid" : ""}`}
                name="permanentCountry"
                value={permanentAddress.permanentCountry}
                onChange={handlePermanentAddressChange}
                placeholder="Enter country"
                required
                disabled={sameAsPresent}
              />
              {renderErrorMessage("permanentCountry")}
              {sameAsPresent && (
                <small className="text-muted">Auto-filled from present address</small>
              )}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                ZIP/Postal Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${validationErrors.permanentzipcode ? "is-invalid" : ""}`}
                name="permanentzipcode"
                value={permanentAddress.permanentzipcode}
                onChange={(e) => handleZipCodeInput(e, 'permanentzipcode', setPermanentAddress)}
                placeholder={
                  permanentAddress.permanentCountry.toLowerCase() === 'india' ? "6 digits (e.g., 110001)" :
                  permanentAddress.permanentCountry.toLowerCase() === 'united states' ? "12345 or 12345-6789" :
                  permanentAddress.permanentCountry.toLowerCase() === 'united kingdom' ? "SW1A 1AA" :
                  "Enter ZIP/Postal code"
                }
                maxLength="10"
                required
                disabled={sameAsPresent}
              />
              {renderErrorMessage("permanentzipcode")}
              {sameAsPresent && (
                <small className="text-muted">Auto-filled from present address</small>
              )}
            </div>
          </div>

          {error && (
            <label className="error d-flex align-items-center gap-2 mt-2">
              <FiAlertTriangle /> Please fill all required fields
            </label>
          )}
        </fieldset>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-4">
            <p className="text-info">Saving address details...</p>
          </div>
        )}
      </form>
    </section>
  );
});

TabAddressDetails.displayName = "TabAddressDetails";

export default TabAddressDetails;