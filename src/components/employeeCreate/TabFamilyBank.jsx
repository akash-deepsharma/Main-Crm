"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { FiAlertTriangle, FiPlus, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

const API_BASE = "https://green-owl-255815.hostingersite.com/api";

const TabFamilyBank = forwardRef(({ error }, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nextChildId, setNextChildId] = useState(1);

  /* =========================
     STATE
  ========================== */

  const [isMarried, setIsMarried] = useState(false);
  
  // Family state with dynamic children
  const [family, setFamily] = useState({
    spouse_name: "",
    spouse_contact: "",
    children: [], // Changed from child_name to array
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
     HANDLERS
  ========================== */

  const handleIsMarriedChange = (e) => {
    const isChecked = e.target.checked;
    setIsMarried(isChecked);
    
    // Clear spouse data if unchecked
    if (!isChecked) {
      setFamily(prev => ({
        ...prev,
        spouse_name: "",
        spouse_contact: "",
        children: [] // Clear children when not married
      }));
    }
  };

  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setFamily((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBank((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFamily((prev) => ({ ...prev, family_photo: file }));
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
  };

  // Handle child field change
  const handleChildChange = (id, field, value) => {
    setFamily(prev => ({
      ...prev,
      children: prev.children.map(child =>
        child.id === id ? { ...child, [field]: value } : child
      )
    }));
  };

  /* =========================
     SUBMIT (API) - EXACTLY AS YOU PROVIDED
  ========================== */

  const handleSaveFamilyBank = async () => {
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

      // Prepare family payload EXACTLY as in your example
      const familyPayload = {
        is_married: isMarried ? 1 : 0,
        spouse_name: isMarried ? family.spouse_name : null,
        spouse_contact: isMarried ? family.spouse_contact : null,
        // Single child_name field (could use first child or concatenate)
        child_name: isMarried && family.children.length > 0 
          ? family.children.map(c => c.name).join(", ") 
          : null,
        father_name: family.father_name,
        father_contact: family.father_contact,
        mother_name: family.mother_name || "",
        mother_contact: family.mother_contact || ""
      };

      // Prepare bank payload EXACTLY as in your example
      const bankPayload = {
        bank_name: bank.bank_name,
        branch_name: bank.branch_name,
        ifsc: bank.ifsc,
        account_no: bank.account_no,
      };

      // Create FormData EXACTLY as in your example
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
                    className="form-control"
                    value={family.spouse_name}
                    onChange={handleFamilyChange}
                    required={isMarried}
                  />
                </div>

                <div className="col-md-4 mb-4">
                  <label className="form-label">
                    Spouse Contact <span className="text-danger">*</span>
                  </label>
                  <input
                    name="spouse_contact"
                    className="form-control"
                    value={family.spouse_contact}
                    onChange={handleFamilyChange}
                    required={isMarried}
                  />
                </div>

                {/* Children Management */}
                <div className="col-12 mb-4">
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
                      
                      <div className="col-md-3 mb-2">
                        <label className="form-label">Age</label>
                        <input
                          type="number"
                          className="form-control"
                          value={child.age}
                          onChange={(e) => handleChildChange(child.id, 'age', e.target.value)}
                          placeholder="Age"
                        />
                      </div>
                      
                      <div className="col-md-3 mb-2">
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
                className="form-control"
                value={family.father_name}
                onChange={handleFamilyChange}
                required
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label">
                Father Contact <span className="text-danger">*</span>
              </label>
              <input
                name="father_contact"
                className="form-control"
                value={family.father_contact}
                onChange={handleFamilyChange}
                required
              />
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
                className="form-control"
                value={family.mother_contact}
                onChange={handleFamilyChange}
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label">
                Family Photo <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className="form-control"
                onChange={handlePhotoChange}
                accept="image/*"
                required
              />
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
                className="form-control"
                value={bank.bank_name}
                onChange={handleBankChange}
                required
              />
            </div>

            <div className="col-md-3 mb-4">
              <label className="form-label">Branch <span className="text-danger">*</span></label>
              <input
                name="branch_name"
                className="form-control"
                value={bank.branch_name}
                onChange={handleBankChange}
                required
              />
            </div>

            <div className="col-md-3 mb-4">
              <label className="form-label">IFSC <span className="text-danger">*</span></label>
              <input
                name="ifsc"
                className="form-control"
                value={bank.ifsc}
                onChange={handleBankChange}
                required
              />
            </div>

            <div className="col-md-3 mb-4">
              <label className="form-label">Account No <span className="text-danger">*</span></label>
              <input
                name="account_no"
                className="form-control"
                value={bank.account_no}
                onChange={handleBankChange}
                required
              />
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