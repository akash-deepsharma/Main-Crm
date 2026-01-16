"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { FiAlertTriangle, FiPlus, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

const API_BASE = "https://green-owl-255815.hostingersite.com/api";

const TabFamilyBank = forwardRef(({ error }, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nextChildId, setNextChildId] = useState(1);
  const [errors, setErrors] = useState({});

  /* =========================
     STATE
  ========================== */

  const [isMarried, setIsMarried] = useState(false);
  
  // Family state with dynamic children
  const [family, setFamily] = useState({
    spouse_name: "",
    spouse_contact: "",
    children: [],
    father_name: "",
    father_contact: "",
    mother_name: "",
    mother_contact: "",
    family_photo: null,
  });

  const [bank, setBank] = useState({
    bank_name: "",
    branch_name: "",
    ifsc: "",
    account_no: "",
  });

  /* =========================
     VALIDATION FUNCTIONS
  ========================== */

  const validateForm = () => {
    const newErrors = {};

    // Family validation
    if (!family.father_name?.trim()) {
      newErrors.father_name = "Father name is required";
    }

    if (!family.father_contact) {
      newErrors.father_contact = "Father contact is required";
    } else if (!/^[6-9]\d{9}$/.test(family.father_contact)) {
      newErrors.father_contact = "Please enter a valid 10-digit mobile number";
    }

    // Mother fields are optional, but if provided, validate contact
    if (family.mother_contact && !/^[6-9]\d{9}$/.test(family.mother_contact)) {
      newErrors.mother_contact = "Please enter a valid 10-digit mobile number";
    }

    // Married validation
    if (isMarried) {
      if (!family.spouse_name?.trim()) {
        newErrors.spouse_name = "Spouse name is required";
      }

      if (!family.spouse_contact) {
        newErrors.spouse_contact = "Spouse contact is required";
      } else if (!/^[6-9]\d{9}$/.test(family.spouse_contact)) {
        newErrors.spouse_contact = "Please enter a valid 10-digit mobile number";
      }

      // Validate children if any
      family.children.forEach((child, index) => {
        if (child.name && !child.age) {
          newErrors[`child_age_${index}`] = `Age is required for child ${index + 1}`;
        }
        if (child.age && !/^\d{1,2}$/.test(child.age)) {
          newErrors[`child_age_${index}`] = `Age must be a valid number`;
        }
      });
    }

    // Family photo validation
    if (!family.family_photo) {
      newErrors.family_photo = "Family photo is required";
    } else if (!family.family_photo.type.startsWith('image/')) {
      newErrors.family_photo = "Please upload a valid image file";
    }

    // Bank validation
    if (!bank.bank_name?.trim()) {
      newErrors.bank_name = "Bank name is required";
    }

    if (!bank.branch_name?.trim()) {
      newErrors.branch_name = "Branch name is required";
    }

    if (!bank.ifsc) {
      newErrors.ifsc = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc)) {
      newErrors.ifsc = "Invalid IFSC format (e.g., SBIN0001234)";
    }

    if (!bank.account_no) {
      newErrors.account_no = "Account number is required";
    } else if (!/^\d{9,18}$/.test(bank.account_no)) {
      newErrors.account_no = "Account number must be 9-18 digits";
    }

    return newErrors;
  };

  const clearError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  /* =========================
     HANDLERS WITH VALIDATION
  ========================== */

  const handleIsMarriedChange = (e) => {
    const isChecked = e.target.checked;
    setIsMarried(isChecked);
    
    // Clear spouse and children errors
    clearError("spouse_name");
    clearError("spouse_contact");
    
    // Clear spouse data if unchecked
    if (!isChecked) {
      setFamily(prev => ({
        ...prev,
        spouse_name: "",
        spouse_contact: "",
        children: []
      }));
    }
  };

  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for contact numbers
    if (name.includes('contact')) {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFamily((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFamily((prev) => ({ ...prev, [name]: value }));
    }
    
    clearError(name);
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ifsc') {
      // IFSC should be uppercase
      setBank(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (name === 'account_no') {
      // Account number should be digits only
      const numericValue = value.replace(/\D/g, '');
      setBank(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setBank((prev) => ({ ...prev, [name]: value }));
    }
    
    clearError(name);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFamily((prev) => ({ ...prev, family_photo: file }));
    clearError("family_photo");
  };

  // Add a child
  const addChild = () => {
    const newChild = {
      id: nextChildId,
      name: "",
      age: "",
      education: ""
    };
    setFamily(prev => ({
      ...prev,
      children: [...prev.children, newChild]
    }));
    setNextChildId(prev => prev + 1);
  };

  // Remove a child
  const removeChild = (id) => {
    setFamily(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== id)
    }));
    
    // Clear any errors for this child
    const childIndex = family.children.findIndex(child => child.id === id);
    if (childIndex !== -1) {
      clearError(`child_age_${childIndex}`);
    }
  };

  // Handle child field change
  const handleChildChange = (id, field, value) => {
    setFamily(prev => ({
      ...prev,
      children: prev.children.map(child =>
        child.id === id ? { 
          ...child, 
          [field]: field === 'age' ? value.replace(/\D/g, '').slice(0, 2) : value 
        } : child
      )
    }));
    
    // Clear error for this child if age is being set
    if (field === 'age') {
      const childIndex = family.children.findIndex(child => child.id === id);
      if (childIndex !== -1) {
        clearError(`child_age_${childIndex}`);
      }
    }
  };

  /* =========================
     SUBMIT (API) WITH VALIDATION
  ========================== */

  const handleSaveFamilyBank = async () => {
    // Validate form before submission
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      } else {
        // If it's a child error, scroll to children section
        if (firstErrorField.startsWith('child_age_')) {
          const childrenSection = document.querySelector('.children-section');
          if (childrenSection) {
            childrenSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
      
      alert("Please fix the validation errors before proceeding.");
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

      // Format children array for API
      const childrenData = isMarried ? family.children.map(child => ({
        name: child.name,
        age: child.age,
        education: child.education
      })) : [];

      // Prepare family payload
      const familyPayload = {
        is_married: isMarried ? 1 : 0,
        spouse_name: isMarried ? family.spouse_name : null,
        spouse_contact: isMarried ? family.spouse_contact : null,
        child_name: isMarried && family.children.length > 0 
          ? family.children.map(c => c.name).join(", ") 
          : null,
        father_name: family.father_name,
        father_contact: family.father_contact,
        mother_name: family.mother_name || "",
        mother_contact: family.mother_contact || ""
      };

      // Prepare bank payload
      const bankPayload = {
        bank_name: bank.bank_name,
        branch_name: bank.branch_name,
        ifsc: bank.ifsc,
        account_no: bank.account_no,
      };

      // Create FormData
      const formData = new FormData();

      formData.append("employee_id", employeeId);
      formData.append("step", "3");

      formData.append("family_details", JSON.stringify(familyPayload));
      formData.append("bank_details", JSON.stringify(bankPayload));

      if (family.family_photo) {
        formData.append("family_photo", family.family_photo);
      }

      // Add children data separately if needed
      if (childrenData.length > 0) {
        formData.append("children", JSON.stringify(childrenData));
      }

      console.log("Submitting form data:", {
        employee_id: employeeId,
        step: "3",
        family_details: familyPayload,
        bank_details: bankPayload,
        has_photo: !!family.family_photo,
        children_count: childrenData.length
      });

      const response = await fetch(`${API_BASE}/employee/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Family response", result);

      if (result?.status === true) {
        console.log("Family & Bank saved", result);
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
    submit: handleSaveFamilyBank,
  }));

  /* =========================
     HELPER FUNCTIONS
  ========================== */

  const renderErrorMessage = (fieldName) => {
    if (errors[fieldName]) {
      return <div className="text-danger small mt-1">{errors[fieldName]}</div>;
    }
    return null;
  };

  const renderChildErrorMessage = (index, field) => {
    const errorKey = `child_${field}_${index}`;
    if (errors[errorKey]) {
      return <div className="text-danger small mt-1">{errors[errorKey]}</div>;
    }
    return null;
  };

  /* =========================
     UI
  ========================== */

  return (
    <section className="step-body mt-4 body current stepChange">
      <form>
        {/* ================= FAMILY DETAILS ================= */}
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Family Details</h2>
            <p className="text-muted">Family details go here</p>
          </div>

          <div className="custom-control custom-checkbox mb-4">
            <input
              type="checkbox"
              className="custom-control-input"
              id="isMarried"
              checked={isMarried}
              onChange={handleIsMarriedChange}
            />
            <label
              className="custom-control-label c-pointer"
              htmlFor="isMarried"
            >
              If Married, check this
            </label>
          </div>

          <div className="row">
            {isMarried && (
              <>
                <div className="col-md-4 mb-4">
                  <label className="form-label">
                    Spouse Name <span className="text-danger">*</span>
                  </label>
                  <input
                    name="spouse_name"
                    className={`form-control ${errors.spouse_name ? "is-invalid" : ""}`}
                    value={family.spouse_name}
                    onChange={handleFamilyChange}
                    required={isMarried}
                  />
                  {renderErrorMessage("spouse_name")}
                </div>

                <div className="col-md-4 mb-4">
                  <label className="form-label">
                    Spouse Contact <span className="text-danger">*</span>
                  </label>
                  <input
                    name="spouse_contact"
                    className={`form-control ${errors.spouse_contact ? "is-invalid" : ""}`}
                    value={family.spouse_contact}
                    onChange={handleFamilyChange}
                    maxLength="10"
                    placeholder="10 digits only"
                    required={isMarried}
                  />
                  {renderErrorMessage("spouse_contact")}
                </div>

                {/* Children Management */}
                <div className="col-12 mb-4 children-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="fs-14 fw-bold">Children Details</h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addChild}
                    >
                      <FiPlus /> Add Child
                    </button>
                  </div>
                  
                  {family.children.map((child, index) => (
                    <div className="row child-row mb-3 border-bottom pb-3" key={child.id}>
                      <div className="col-md-3 mb-2">
                        <label className="form-label">Child Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={child.name}
                          onChange={(e) => handleChildChange(child.id, 'name', e.target.value)}
                          placeholder="Child name"
                        />
                      </div>
                      
                      <div className="col-md-2 mb-2">
                        <label className="form-label">Age</label>
                        <input
                          type="text"
                          className={`form-control ${errors[`child_age_${index}`] ? "is-invalid" : ""}`}
                          value={child.age}
                          onChange={(e) => handleChildChange(child.id, 'age', e.target.value)}
                          placeholder="Age"
                          maxLength="2"
                        />
                        {renderErrorMessage(`child_age_${index}`)}
                      </div>
                      
                      <div className="col-md-4 mb-2">
                        <label className="form-label">Education</label>
                        <input
                          type="text"
                          className="form-control"
                          value={child.education}
                          onChange={(e) => handleChildChange(child.id, 'education', e.target.value)}
                          placeholder="Education"
                        />
                      </div>
                      
                      <div className="col-md-3 mb-2 d-flex align-items-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger d-flex align-items-center"
                          onClick={() => removeChild(child.id)}
                        >
                          <FiTrash2 style={{fontSize:'12px', marginRight:'6px'}}/>  Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="col-md-4 mb-4">
              <label className="form-label">
                Father Name <span className="text-danger">*</span>
              </label>
              <input
                name="father_name"
                className={`form-control ${errors.father_name ? "is-invalid" : ""}`}
                value={family.father_name}
                onChange={handleFamilyChange}
                required
              />
              {renderErrorMessage("father_name")}
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label">
                Father Contact <span className="text-danger">*</span>
              </label>
              <input
                name="father_contact"
                className={`form-control ${errors.father_contact ? "is-invalid" : ""}`}
                value={family.father_contact}
                onChange={handleFamilyChange}
                maxLength="10"
                placeholder="10 digits only"
                required
              />
              {renderErrorMessage("father_contact")}
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label">
                Mother Name
              </label>
              <input
                name="mother_name"
                className="form-control"
                value={family.mother_name}
                onChange={handleFamilyChange}
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label">
                Mother Contact
              </label>
              <input
                name="mother_contact"
                className={`form-control ${errors.mother_contact ? "is-invalid" : ""}`}
                value={family.mother_contact}
                onChange={handleFamilyChange}
                maxLength="10"
                placeholder="10 digits only"
              />
              {renderErrorMessage("mother_contact")}
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label">
                Family Photo <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className={`form-control ${errors.family_photo ? "is-invalid" : ""}`}
                onChange={handlePhotoChange}
                accept="image/*"
                required
              />
              {renderErrorMessage("family_photo")}
              {family.family_photo && (
                <small className="text-success mt-1 d-block">
                  Selected: {family.family_photo.name}
                </small>
              )}
            </div>
          </div>

          {error && (
            <label className="error d-flex align-items-center gap-2 mt-2">
              <FiAlertTriangle /> Required fields missing
            </label>
          )}
        </fieldset>

        {/* ================= BANK DETAILS ================= */}
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Bank Details</h2>
            <p className="text-muted">Bank details go here</p>
          </div>

          <div className="row">
            <div className="col-md-3 mb-4">
              <label className="form-label">Bank Name <span className="text-danger">*</span></label>
              <input
                name="bank_name"
                className={`form-control ${errors.bank_name ? "is-invalid" : ""}`}
                value={bank.bank_name}
                onChange={handleBankChange}
                required
              />
              {renderErrorMessage("bank_name")}
            </div>

            <div className="col-md-3 mb-4">
              <label className="form-label">Branch <span className="text-danger">*</span></label>
              <input
                name="branch_name"
                className={`form-control ${errors.branch_name ? "is-invalid" : ""}`}
                value={bank.branch_name}
                onChange={handleBankChange}
                required
              />
              {renderErrorMessage("branch_name")}
            </div>

            <div className="col-md-3 mb-4">
              <label className="form-label">IFSC <span className="text-danger">*</span></label>
              <input
                name="ifsc"
                className={`form-control ${errors.ifsc ? "is-invalid" : ""}`}
                value={bank.ifsc}
                onChange={handleBankChange}
                placeholder="e.g., SBIN0001234"
                style={{ textTransform: "uppercase" }}
                maxLength="11"
                required
              />
              {renderErrorMessage("ifsc")}
            </div>

            <div className="col-md-3 mb-4">
              <label className="form-label">Account No <span className="text-danger">*</span></label>
              <input
                name="account_no"
                className={`form-control ${errors.account_no ? "is-invalid" : ""}`}
                value={bank.account_no}
                onChange={handleBankChange}
                maxLength="18"
                placeholder="9-18 digits only"
                required
              />
              {renderErrorMessage("account_no")}
            </div>
          </div>
        </fieldset>

        {loading && <p className="text-info">Saving family & bank details...</p>}
      </form>
    </section>
  );
});

TabFamilyBank.displayName = "TabFamilyBank";

export default TabFamilyBank;