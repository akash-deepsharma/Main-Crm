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
    }
  }, [contractOptions, consigneeOptions, designationOptions]);

  // Fetch contracts
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/client/employee/view`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

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
  };

  const handleSelectChange = (key, option) => {
    setEmployee((prev) => ({
      ...prev,
      [key]: option?.value ?? null,
    }));
  };

  const handleSaveAndNext = async (e) => {
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
      console.log( "result", result)
      if (result?.status === true) {
        const employeeId = result.employee.id;

        // Store employee id
        sessionStorage.setItem("employee_id", employeeId);

        // Store full employee form data
        sessionStorage.setItem(
          "employee_step1",
          JSON.stringify({
            ...result,
            id: employeeId,
            dob: employee.dob ? formatDate(employee.dob) : null,
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
              />
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
              <label className="form-label">Employee Name</label>
              <input
                className="form-control"
                name="name"
                value={employee.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                name="email"
                value={employee.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Mobile No</label>
              <input
                className="form-control"
                name="mobile_no"
                value={employee.mobile_no}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Total Experience</label>
              <input 
                className="form-control"
                name="total_experience"
                value={employee.total_experience}
                onChange={handleInputChange}
              />
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
                onChange={(date) =>
                  setEmployee((prev) => ({ ...prev, dob: date }))
                }
                className="form-control"
              />
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
                className="form-control"
                name="no_of_children"
                value={employee.no_of_children}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                IP No <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="ip_no"
                value={employee.ip_no}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                UAN <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="uan"
                value={employee.uan}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Aadhar no <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="aadhar"
                value={employee.aadhar}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Pan Card no <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="pan"
                value={employee.pan}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Rent Agreement/ Electricity bill Proof{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="address_proof"
                value={employee.address_proof}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Reference <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="reference"
                value={employee.reference}
                onChange={handleInputChange}
              />
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
                }}
              />
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
});

export default TabEmployeeDetails;