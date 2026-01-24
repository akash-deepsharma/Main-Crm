import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import TabEmployeeType from "./TabEmployeeType";
import SelectDropdown from "@/components/shared/SelectDropdown";
import {
  ConsigneeOptions,
  ClientOptions,
  DesignationOptions,
  GenderOptions,
  ShiftOptions,
  ReplacedOptions,
  ReligionOptions,
  MaritalOptions,
} from "@/utils/options";
import DatePicker from "react-datepicker";
import useDatePicker from "@/hooks/useDatePicker";
import useJoditConfig from "@/hooks/useJoditConfig";
import JoditEditor from "jodit-react";
import { useRouter, useSearchParams } from "next/navigation";

const TabEmployeeDetails = forwardRef(({ clientId, clientType }, ref) => {
  const router = useRouter();
  const client_Type = clientType;
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // Validation state
  const [errors, setErrors] = useState({});

  // console.log( "client type sept 1", client_Type)
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedConsignee, setSelectedConsignee] = useState(null);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedReplaced, setSelectedReplaced] = useState(null);
  const [selectedReligion, setSelectedReligion] = useState(null);
  const [selectedMarital, setSelectedMarital] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const { startDate, setStartDate, renderFooter } = useDatePicker();
  const config = useJoditConfig();
  const [value, setValue] = useState("");

  const API_BASE = "https://green-owl-255815.hostingersite.com/api";

  const [employee, setEmployee] = useState({
    contract_id: null,
    client_name: "",
    step: "1",
    consignee_id: null,
    designation_id: null,
    designation_name: "",
    name: "",
    email: "",
    mobile_no: "",
    total_experience: "",
    dob: null,
    gender: null,
    shift: null,
    replaced_employee: null,
    religion: null,
    marital_status: null,
    no_of_children: "",
    ip_no: "",
    uan: "",
    aadhar: "",
    pan: "",
    address_proof: "",
    reference: "",
    about: "",
  });

  // Validation functions
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!employee.contract_id) {
      newErrors.contract_id = "Contract is required";
    }
    
    if (!employee.name?.trim()) {
      newErrors.name = "Employee name is required";
    }
    
    // Email validation
    if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Mobile number validation (10 digits only)
    if (!employee.mobile_no) {
      newErrors.mobile_no = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(employee.mobile_no)) {
      newErrors.mobile_no = "Please enter a valid 10-digit mobile number starting with 6-9";
    }
    
    // Total experience validation (numeric only, 0-50 years)
    if (employee.total_experience) {
      if (!/^\d+$/.test(employee.total_experience)) {
        newErrors.total_experience = "Experience must be a number only";
      } else if (parseInt(employee.total_experience) > 50) {
        newErrors.total_experience = "Experience cannot exceed 50 years";
      }
    }
    
    // Date of Birth validation (must be at least 18 years ago)
    if (employee.dob) {
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 18);
      
      if (employee.dob > minDate) {
        newErrors.dob = "Employee must be at least 18 years old";
      }
    }
    
    // IP Number validation (format: 2-4 letters followed by 4-6 digits)
    if (!employee.ip_no) {
      newErrors.ip_no = "IP number is required";
    } else if (!/^[A-Z]{2,4}\d{4,6}$/.test(employee.ip_no)) {
      newErrors.ip_no = "Format: 2-4 letters followed by 4-6 digits (e.g., ABC12345)";
    }
    
    // UAN validation (12 digits only)
    if (!employee.uan) {
      newErrors.uan = "UAN is required";
    } else if (!/^\d{12}$/.test(employee.uan)) {
      newErrors.uan = "UAN must be exactly 12 digits";
    }
    
    // Aadhar validation (12 digits only)
    if (!employee.aadhar) {
      newErrors.aadhar = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(employee.aadhar)) {
      newErrors.aadhar = "Aadhar must be exactly 12 digits";
    }
    
    // PAN validation (format: 5 letters, 4 digits, 1 letter)
    if (!employee.pan) {
      newErrors.pan = "PAN number is required";
    } else if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(employee.pan)) {
      newErrors.pan = "Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)";
    }
    
    // Address proof validation
    if (!employee.address_proof?.trim()) {
      newErrors.address_proof = "Address proof is required";
    }
    
    // Reference validation
    if (!employee.reference?.trim()) {
      newErrors.reference = "Reference is required";
    }
    
    // Number of children validation (single digit 0-9)
    if (employee.no_of_children) {
      if (!/^\d$/.test(employee.no_of_children)) {
        newErrors.no_of_children = "Enter single digit only (0-9)";
      } else if (parseInt(employee.no_of_children) > 9) {
        newErrors.no_of_children = "Maximum 9 children allowed";
      }
    }
    
    // About employee validation
    if (!employee.about?.trim()) {
      newErrors.about = "About employee is required";
    }
    
    return newErrors;
  };

  // Input handlers with format restrictions
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formattedValue = value.slice(0, 10); // Limit to 10 digits
    
    setEmployee(prev => ({
      ...prev,
      mobile_no: formattedValue
    }));
    clearError("mobile_no");
  };

  const handleChildrenInput = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formattedValue = value.slice(0, 1); // Limit to 1 digit
    
    setEmployee(prev => ({
      ...prev,
      no_of_children: formattedValue
    }));
    clearError("no_of_children");
  };

  const handleExperienceInput = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formattedValue = value.slice(0, 2); // Limit to 2 digits (max 50)
    
    setEmployee(prev => ({
      ...prev,
      total_experience: formattedValue
    }));
    clearError("total_experience");
  };

  const handleUANAadharInput = (e) => {
    const { name, value } = e.target;
    const formattedValue = value.replace(/\D/g, '').slice(0, 12); // Only digits, max 12
    
    setEmployee(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    clearError(name);
  };

  const handlePANInput = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    const formattedValue = value.replace(/[^A-Z0-9]/g, ''); // Only letters and numbers
    const slicedValue = formattedValue.slice(0, 10); // PAN is always 10 chars
    
    setEmployee(prev => ({
      ...prev,
      pan: slicedValue
    }));
    clearError("pan");
  };

  const handleIPInput = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    const formattedValue = value.replace(/[^A-Z0-9]/g, ''); // Only letters and numbers
    const slicedValue = formattedValue.slice(0, 10); // Max 10 chars (4 letters + 6 digits)
    
    setEmployee(prev => ({
      ...prev,
      ip_no: slicedValue
    }));
    clearError("ip_no");
  };

  // Format validation for PAN on blur
  const validatePANOnBlur = () => {
    if (employee.pan && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(employee.pan)) {
      setErrors(prev => ({
        ...prev,
        pan: "Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)"
      }));
    } else {
      clearError("pan");
    }
  };

  // Format validation for IP on blur
  const validateIPOnBlur = () => {
    if (employee.ip_no && !/^[A-Z]{2,4}\d{4,6}$/.test(employee.ip_no)) {
      setErrors(prev => ({
        ...prev,
        ip_no: "Format: 2-4 letters followed by 4-6 digits (e.g., ABC12345)"
      }));
    } else {
      clearError("ip_no");
    }
  };

  // Clear error when field changes
  const clearError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Initialize from session storage
// Initialize from session storage
useEffect(() => {
  const savedEmployee = sessionStorage.getItem("employee_step1");

  if (savedEmployee) {
    const data = JSON.parse(savedEmployee);
    
    // Restore all employee fields
    setEmployee(prev => ({
      ...prev,
      ...data,
      dob: data.dob ? new Date(data.dob) : null,
    }));

    // Restore Jodit editor
    setValue(data.about || "");
    
    // Restore dropdown selections
    if (data.contract_id && contractOptions.length > 0) {
      const contract = contractOptions.find(opt => opt.value === data.contract_id);
      if (contract) {
        setSelectedContract(contract);
      }
    }

    if (data.consignee_id && consigneeOptions.length > 0) {
      const consignee = consigneeOptions.find(opt => opt.value === data.consignee_id);
      if (consignee) {
        setSelectedConsignee(consignee);
      }
    }

    if (data.designation_id && designationOptions.length > 0) {
      const designation = designationOptions.find(opt => opt.value === data.designation_id);
      if (designation) {
        setSelectedDesignation(designation);
      }
    }

    // Restore gender
    if (data.gender) {
      const gender = GenderOptions.find(opt => opt.value === data.gender);
      if (gender) {
        setSelectedGender(gender);
      }
    }

    // Restore shift
    if (data.shift) {
      const shift = ShiftOptions.find(opt => opt.value === data.shift);
      if (shift) {
        setSelectedShift(shift);
      }
    }

    // Restore religion
    if (data.religion) {
      const religion = ReligionOptions.find(opt => opt.value === data.religion);
      if (religion) {
        setSelectedReligion(religion);
      }
    }

    // Restore marital status
    if (data.marital_status) {
      const marital = MaritalOptions.find(opt => opt.value === data.marital_status);
      if (marital) {
        setSelectedMarital(marital);
      }
    }

    // Restore replaced employee selection
    if (data.replaced_employee) {
      const replaced = ReplacedOptions.find(opt => opt.value === data.replaced_employee);
      if (replaced) {
        setSelectedReplaced(replaced);
      }
    }
  }
}, [contractOptions, consigneeOptions, designationOptions]);

  // Fetch contracts
  useEffect(() => {
    const company_id = sessionStorage.getItem("selected_company");
    // console.log( company_id)
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/client/employee/view?company_id=${company_id}?client_type=${client_Type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
          console.log("fatch contract detail", result)
        if (result.status && Array.isArray(result.data)) {
          const formatted = result.data.map((item) => ({
            value: item.id,
            buyer_name: item.buyer_name,
            label: item.contract_no,
          }));
          setContractOptions(formatted);
          
          // Check if we have saved contract ID to restore
          const savedEmployee = sessionStorage.getItem("employee_step1");
          if (savedEmployee) {
            const data = JSON.parse(savedEmployee);
            if (data.contract_id) {
              const contract = formatted.find(opt => opt.value === data.contract_id);
              if (contract) {
                setSelectedContract(contract);
                // Fetch consignees for this contract
                await fetchConsigneebyclient(data.contract_id);
              }
            }
          }
        } else {
          console.error("API data is not an array:", result);
        }
      } catch (error) {
        console.error("Contract API Error:", error);
      }
    };

    fetchContracts();
  }, []);

  const handleContractChange = async (option) => {
    setSelectedContract(option);
    clearError("contract_id");

    setEmployee((prev) => ({
      ...prev,
      contract_id: option.value,
      client_name: option.buyer_name || "",
    }));

    await fetchConsigneebyclient(option.value);
  };

  const handleConsigneeChange = async (option) => {
    setSelectedConsignee(option);

    setEmployee((prev) => ({
      ...prev,
      consignee_id: option.value,
    }));

    await fethconsigneedesignation(option.value);
  };

  const fethconsigneedesignation = async (consigneeID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/client/consignee/designation/${consigneeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.status && Array.isArray(result.data)) {
        const formatted = result.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));

        setDesignationOptions(formatted);
        
        // Check if we have saved designation ID to restore
        const savedEmployee = sessionStorage.getItem("employee_step1");
        if (savedEmployee) {
          const data = JSON.parse(savedEmployee);
          if (data.designation_id) {
            const designation = formatted.find(opt => opt.value === data.designation_id);
            if (designation) {
              setSelectedDesignation(designation);
            }
          }
        }
      }
    } catch (error) {
      console.error("Designation API Error:", error);
    }
  };

  const handleDesignationChange = (option) => {
    setSelectedDesignation(option);

    setEmployee((prev) => ({
      ...prev,
      designation_id: option.value,
      designation_name: option.label,
    }));
  };

  const fetchConsigneebyclient = async (clientId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/client/consignee/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.status && Array.isArray(result.data)) {
        const formatted = result.data.map((item) => ({
          value: item.id,
          label: item.consignee_name,
        }));

        setConsigneeOptions(formatted);
        
        // Check if we have saved consignee ID to restore
        const savedEmployee = sessionStorage.getItem("employee_step1");
        if (savedEmployee) {
          const data = JSON.parse(savedEmployee);
          if (data.consignee_id) {
            const consignee = formatted.find(opt => opt.value === data.consignee_id);
            if (consignee) {
              setSelectedConsignee(consignee);
              // Fetch designations for this consignee
              await fethconsigneedesignation(data.consignee_id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Consignee API Error:", error);
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError(name);
  };

  const handleSelectChange = (key, option) => {
    setEmployee((prev) => ({
      ...prev,
      [key]: option?.value ?? null,
    }));
    clearError(key);
  };

  const handleSaveAndNext = async (e) => {
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
    }
    
    alert("Please fix the validation errors before proceeding.");
    return false;
  }

  const token = localStorage.getItem("token");
  const company_id = sessionStorage.getItem("selected_company");

  if (!company_id) {
    alert("Company not selected");
    router.replace("/company");
    return false;
  }

  if (!token) {
    alert("Auth error");
    return false;
  }

  try {
    setLoading(true);

    const employeeId = sessionStorage.getItem("employee_id");

    // Convert replaced_employee to boolean
    const replacedEmployeeBool = employee.replaced_employee === "yes" ? true : 
                                employee.replaced_employee === "no" ? false : null;

    const payload = {
      id: employeeId ? Number(employeeId) : undefined,
      company_id: Number(company_id),
      client_id: clientId || null,
      client_type: client_Type,
      step: "1",
      contract_id: employee.contract_id,
      client_name: employee.client_name,
      consignee_id: employee.consignee_id,
      designation_id: employee.designation_name,
      designation: employee.designation_id,
      name: employee.name,
      email: employee.email,
      mobile_no: employee.mobile_no,
      total_experience: employee.total_experience,
      dob: formatDate(employee.dob),
      gender: employee.gender,
      shift: employee.shift,
      religion: employee.religion,
      marital_status: employee.marital_status,
      no_of_children: employee.no_of_children,
      ip_no: employee.ip_no,
      uan: employee.uan,
      aadhar: employee.aadhar,
      pan: employee.pan,
      address_proof: employee.address_proof,
      reference: employee.reference,
      about: employee.about,
      replaced_employee: replacedEmployeeBool, // यहाँ boolean format में भेजें
    };

    const response = await fetch(
      `${API_BASE}/employee/store`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("result", result);
    
    if (result?.status === true) {
      const employeeId = result.employee.id;

      // Store employee id
      sessionStorage.setItem("employee_id", employeeId);

      // Store full employee form data
      sessionStorage.setItem(
        "employee_step1",
        JSON.stringify({
          ...employee,
          id: employeeId,
          dob: employee.dob ? formatDate(employee.dob) : null,
          replaced_employee: employee.replaced_employee, // Store as string for UI
        })
      );
      
      console.log("Saved successfully", result);
      return true;
    } else {
      throw new Error(result.message || "Failed to save employee details");
    }
  } catch (err) {
    alert(err.message);
    return false;
  } finally {
    setLoading(false);
  }
};

  useImperativeHandle(ref, () => ({
    submit: handleSaveAndNext,
  }));

  // Helper function to render error message
  const renderErrorMessage = (fieldName) => {
    if (errors[fieldName]) {
      return <div className="text-danger small mt-1">{errors[fieldName]}</div>;
    }
    return null;
  };

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-details">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Employee details</h2>
            <p className="text-muted">Employee details gose here.</p>
          </div>

          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Select Client Contract <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={contractOptions}
                selectedOption={selectedContract}
                defaultSelect="SContract"
                onSelectOption={handleContractChange}
                className={errors.contract_id ? "is-invalid" : ""}
              />
              {renderErrorMessage("contract_id")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label"> Client Name</label>
              <input
                className="form-control"
                value={employee.client_name}
                readOnly
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Select Consignee</label>
              <SelectDropdown
                options={consigneeOptions}
                selectedOption={selectedConsignee}
                defaultSelect="SConsignee"
                onSelectOption={handleConsigneeChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Select Designation</label>
              <SelectDropdown
                options={designationOptions}
                selectedOption={selectedDesignation}
                defaultSelect="SD"
                onSelectOption={handleDesignationChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Employee Name <span className="text-danger">*</span></label>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={employee.name}
                onChange={handleInputChange}
              />
              {renderErrorMessage("name")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Email</label>
              <input
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={employee.email}
                onChange={handleInputChange}
              />
              {renderErrorMessage("email")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Mobile No <span className="text-danger">*</span></label>
              <input
                className={`form-control ${errors.mobile_no ? "is-invalid" : ""}`}
                name="mobile_no"
                value={employee.mobile_no}
                onChange={handlePhoneInput}
                maxLength="10"
                placeholder="10 digits only"
              />
              {renderErrorMessage("mobile_no")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Total Experience (Years)</label>
              <input 
                className={`form-control ${errors.total_experience ? "is-invalid" : ""}`}
                name="total_experience"
                value={employee.total_experience}
                onChange={handleExperienceInput}
                placeholder="Digits only (0-50)"
              />
              {renderErrorMessage("total_experience")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Gender</label>
              <SelectDropdown
                options={GenderOptions}
                selectedOption={selectedGender}
                onSelectOption={(option) => {
                  setSelectedGender(option);
                  setEmployee((prev) => ({
                    ...prev,
                    gender: option?.value ?? null,
                  }));
                }}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Date of Birth</label>
              <DatePicker
                selected={employee.dob}
                onChange={(date) => {
                  setEmployee((prev) => ({ ...prev, dob: date }));
                  clearError("dob");
                }}
                className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd/MM/yyyy"
              />
              {renderErrorMessage("dob")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Shift</label>
              <SelectDropdown
                options={ShiftOptions}
                selectedOption={selectedShift}
                onSelectOption={(option) => {
                  setSelectedShift(option);
                  setEmployee((prev) => ({
                    ...prev,
                    shift: option?.value ?? null,
                  }));
                }}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Replaced Employee</label>
              <SelectDropdown
                options={ReplacedOptions}
                selectedOption={selectedReplaced}
                onSelectOption={(option) => {
                  setSelectedReplaced(option);
                  setEmployee((prev) => ({
                    ...prev,
                    replaced_employee: option?.value ?? null,
                  }));
                }}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Religion</label>
              <SelectDropdown
                options={ReligionOptions}
                selectedOption={selectedReligion}
                onSelectOption={(option) => {
                  setSelectedReligion(option);
                  setEmployee((prev) => ({
                    ...prev,
                    religion: option?.value ?? null,
                  }));
                }}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Marital Status</label>
              <SelectDropdown
                options={MaritalOptions}
                selectedOption={selectedMarital}
                onSelectOption={(option) => {
                  setSelectedMarital(option);
                  setEmployee((prev) => ({
                    ...prev,
                    marital_status: option?.value ?? null,
                  }));
                }}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Number of Children (Optional)
              </label>
              <input
                type="text"
                className={`form-control ${errors.no_of_children ? "is-invalid" : ""}`}
                name="no_of_children"
                value={employee.no_of_children}
                onChange={handleChildrenInput}
                placeholder="Single digit (0-9)"
                maxLength="1"
              />
              {renderErrorMessage("no_of_children")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                IP No <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.ip_no ? "is-invalid" : ""}`}
                name="ip_no"
                value={employee.ip_no}
                onChange={handleIPInput}
                onBlur={validateIPOnBlur}
                placeholder="e.g., ABC12345"
              />
              {renderErrorMessage("ip_no")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                UAN <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.uan ? "is-invalid" : ""}`}
                name="uan"
                value={employee.uan}
                onChange={handleUANAadharInput}
                maxLength="12"
                placeholder="12 digits only"
              />
              {renderErrorMessage("uan")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Aadhar no <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.aadhar ? "is-invalid" : ""}`}
                name="aadhar"
                value={employee.aadhar}
                onChange={handleUANAadharInput}
                maxLength="12"
                placeholder="12 digits only"
              />
              {renderErrorMessage("aadhar")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Pan Card no <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.pan ? "is-invalid" : ""}`}
                name="pan"
                value={employee.pan}
                onChange={handlePANInput}
                onBlur={validatePANOnBlur}
                placeholder="e.g., ABCDE1234F"
                style={{ textTransform: "uppercase" }}
              />
              {renderErrorMessage("pan")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Rent Agreement/ Electricity bill Proof{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.address_proof ? "is-invalid" : ""}`}
                name="address_proof"
                value={employee.address_proof}
                onChange={handleInputChange}
              />
              {renderErrorMessage("address_proof")}
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Reference <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.reference ? "is-invalid" : ""}`}
                name="reference"
                value={employee.reference}
                onChange={handleInputChange}
              />
              {renderErrorMessage("reference")}
            </div>

            <div className="mb-4">
              <label className="form-label">
                About Employee <span className="text-danger">*</span>
              </label>
              <JoditEditor
                value={value}
                config={config}
                onChange={(html) => {
                  setValue(html);
                  setEmployee(prev => ({ ...prev, about: html }));
                  clearError("about");
                }}
              />
              {renderErrorMessage("about")}
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
});

export default TabEmployeeDetails;