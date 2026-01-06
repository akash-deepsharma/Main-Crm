"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useRouter } from "next/navigation";

const API_BASE = "https://green-owl-255815.hostingersite.com/api";

const TabAddressDetails = forwardRef(({ error, initialData }, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sameAsPresent, setSameAsPresent] = useState(false);

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
     HANDLERS
  ========================== */

  const handlePresentAddressChange = (e) => {
    const { name, value } = e.target;
    setPresentAddress(prev => ({
      ...prev,
      [name]: value
    }));

    // If "same as present" is checked, update permanent address too
    if (sameAsPresent) {
      const permanentField = name.replace('present', 'permanent');
      setPermanentAddress(prev => ({
        ...prev,
        [permanentField]: value
      }));
    }
  };

  const handlePermanentAddressChange = (e) => {
    const { name, value } = e.target;
    setPermanentAddress(prev => ({
      ...prev,
      [name]: value
    }));
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
    }
  };

  /* =========================
     VALIDATION
  ========================== */

  const validateForm = () => {
    // Check required fields for present address
    const requiredPresentFields = ['presentAddress', 'presentCity', 'presentState', 'presentCountry', 'presentZipCode'];
    for (const field of requiredPresentFields) {
      if (!presentAddress[field]?.trim()) {
        alert(`Please fill in Present ${field.replace('present', '').replace(/([A-Z])/g, ' $1').trim()}`);
        return false;
      }
    }

    // Check required fields for permanent address
    const requiredPermanentFields = ['permanentAddress', 'permanentCity', 'permanentState', 'permanentCountry', 'permanentzipcode'];
    for (const field of requiredPermanentFields) {
      if (!permanentAddress[field]?.trim()) {
        alert(`Please fill in Permanent ${field.replace('permanent', '').replace(/([A-Z])/g, ' $1').trim()}`);
        return false;
      }
    }

    return true;
  };

  /* =========================
     SUBMIT (API) - CORRECTED VERSION
  ========================== */

  const handleSaveAddressDetails = async () => {
    const token = localStorage.getItem("token");
    const employeeId = sessionStorage.getItem("employee_id");

    if (!token || !employeeId) {
      alert("Employee not found. Complete previous steps first.");
      router.replace("/employee");
      return false;
    }

    // Validate form
    if (!validateForm()) {
      return false;
    }

    try {
      setLoading(true);

      // CORRECTION: Create a single object with all address fields
      const addressPayload = {
        // Present address fields
        presentAddress: presentAddress.presentAddress,
        presentCity: presentAddress.presentCity,
        presentState: presentAddress.presentState,
        presentCountry: presentAddress.presentCountry,
        presentZipCode: presentAddress.presentZipCode,
        
        // Permanent address fields
        permanentAddress: permanentAddress.permanentAddress,
        permanentCity: permanentAddress.permanentCity,
        permanentState: permanentAddress.permanentState,
        permanentCountry: permanentAddress.permanentCountry,
        permanentzipcode: permanentAddress.permanentzipcode
      };

      console.log("Address payload:", addressPayload);

      const formData = new FormData();

      // Append employee_id and step
      formData.append("employee_id", employeeId);
      formData.append("step", "4"); // Assuming address is step 4
      
      // CORRECTION: Append each address field individually
      Object.keys(addressPayload).forEach(key => {
        formData.append(key, addressPayload[key]);
      });

      // OR if your API expects a JSON string for address_details:
      // formData.append("address_details", JSON.stringify(addressPayload));

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

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
                className="form-control"
                name="presentAddress"
                value={presentAddress.presentAddress}
                onChange={handlePresentAddressChange}
                placeholder="Enter present address"
                required
              />
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="presentCity"
                value={presentAddress.presentCity}
                onChange={handlePresentAddressChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                State <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="presentState"
                value={presentAddress.presentState}
                onChange={handlePresentAddressChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                Country <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="presentCountry"
                value={presentAddress.presentCountry}
                onChange={handlePresentAddressChange}
                placeholder="Enter country"
                required
              />
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                ZIP Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="presentZipCode"
                value={presentAddress.presentZipCode}
                onChange={handlePresentAddressChange}
                placeholder="Enter ZIP code"
                required
              />
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
                className="form-control"
                name="permanentAddress"
                value={permanentAddress.permanentAddress}
                onChange={handlePermanentAddressChange}
                placeholder="Enter permanent address"
                required
                disabled={sameAsPresent}
              />
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
                className="form-control"
                name="permanentCity"
                value={permanentAddress.permanentCity}
                onChange={handlePermanentAddressChange}
                placeholder="Enter city"
                required
                disabled={sameAsPresent}
              />
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
                className="form-control"
                name="permanentState"
                value={permanentAddress.permanentState}
                onChange={handlePermanentAddressChange}
                placeholder="Enter state"
                required
                disabled={sameAsPresent}
              />
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
                className="form-control"
                name="permanentCountry"
                value={permanentAddress.permanentCountry}
                onChange={handlePermanentAddressChange}
                placeholder="Enter country"
                required
                disabled={sameAsPresent}
              />
              {sameAsPresent && (
                <small className="text-muted">Auto-filled from present address</small>
              )}
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <label className="fw-semibold text-dark">
                ZIP Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="permanentzipcode"
                value={permanentAddress.permanentzipcode}
                onChange={handlePermanentAddressChange}
                placeholder="Enter ZIP code"
                required
                disabled={sameAsPresent}
              />
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