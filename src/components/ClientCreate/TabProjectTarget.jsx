"use client";

import { useEffect, useState, forwardRef, useImperativeHandle, useMemo } from "react";
// import useJoditConfig from "@/hooks/useJoditConfig";
import SelectDropdown from "@/components/shared/SelectDropdown";

const TabProjectTarget = forwardRef(({ clientId }, ref) => {
  const emptyBlock = {
    selectedConsignee: null,
    selectedDesignation: null,
    designationOptions: [],
    selectedGender: null,
    selectedSkill: null,
    ageLimit: "",
    educationalQualification: "",
    specializationPG: "",
    postGraduation: "",
    typesOfFunction: "",
    yearsOfExperience: "",
    specialization: "",
    district: "",
    zipcode: "",
    dutyHours: "",
    dutyExtraHours: "",
    minDailyWages: "",
    monthlySalary: "",
    bonusInput: "",
    providentFund: "",
    epfAdminCharge: "",
    edli: "",
    esi: "",
    optionalAllowance1: "",
    optionalAllowance2: "",
    optionalAllowance3: "",
    workingDays: "",
    tenureMonths: "",
    hiredResources: "",
    serviceCharge: "",
    additionalRequirement: "",
    checkboxes: {
      bonus: false,
      pf: false,
      epfAdmin: false,
      edli: false,
      esi: false,
      opt1: false,
      opt2: false,
      opt3: false,
    },
  };

  const [services, setServices] = useState([emptyBlock]);
  const [consigneeOptions, setConsigneeOptions] = useState([]);

  const [totals, setTotals] = useState({
    totalWithoutAddons: "",
    totalAddons: "",
    totalWithAddons: "",
    totalContractValue: "",
  });

  useEffect(() => {
    fetchConsignees();
  }, []);

  const fetchConsignees = async () => {
    try {
      const token = localStorage.getItem("token");
      const client_id = localStorage.getItem("client_id");
      const selected_company = localStorage.getItem("selected_company");

      const response = await fetch(
        `https://green-owl-255815.hostingersite.com/api/select/consignee?client_id=${client_id}&company_id=${selected_company}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API returned non-JSON response:", await response.text());
        return;
      }

      const result = await response.json();

      if (result?.status) {
        const options = result.data.map((c) => ({
          label: c.consignee_name,
          value: c.id,
        }));

        setConsigneeOptions(options);
      }
    } catch (err) {
      console.error("Error fetching consignees:", err);
    }
  };

  const fetchDesignations = async (consigneeId, index) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching designations for consigneeId:", consigneeId);

      const response = await fetch(
        `https://green-owl-255815.hostingersite.com/api/select/designation?consignee_id=${consigneeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API returned non-JSON response:", await response.text());
        return;
      }

      const result = await response.json();
  

      if (result?.status) {
        const options = result.data.map((d) => ({
          label: d.name,
          value: d.id,
        }));

        setServices((prev) =>
          prev.map((s, i) =>
            i === index ? { ...s, designationOptions: options } : s
          )
        );
      }
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };

  const handleTotalsChange = (field, value) => {
    setTotals((prev) => ({ ...prev, [field]: value }));
  };

  // const Gender = [
  //   { value: "Male", label: "Male", color: "#3454d1" },
  //   { value: "Female", label: "Female", color: "#41b2c4" },
  //   { value: "Any", label: "Any", color: "#ea4d4d" },
  // ];

  // const Skill = [
  //   { value: "Semi-Skilled", label: "Semi-Skilled", color: "#3454d1" },
  //   { value: "Skilled", label: "Skilled", color: "#41b2c4" },
  //   { value: "Any", label: "Any", color: "#ea4d4d" },
  // ];
  const Gender = useMemo(() => [
  { value: "Male", label: "Male", color: "#3454d1" },
  { value: "Female", label: "Female", color: "#41b2c4" },
  { value: "Any", label: "Any", color: "#ea4d4d" },
], []);

const Skill = useMemo(() => [
  { value: "Semi-Skilled", label: "Semi-Skilled", color: "#3454d1" },
  { value: "Skilled", label: "Skilled", color: "#41b2c4" },
  { value: "Any", label: "Any", color: "#ea4d4d" },
], []);

  const handleAddService = (e) => {
    e.preventDefault();
    setServices([...services, { ...emptyBlock }]);
  };

  const handleDeleteLastService = (e) => {
    e.preventDefault();
    if (services.length > 1) {
      setServices(services.slice(0, -1));
    }
  };

  const handleChange = (index, field, value) => {
    setServices((prev) => {
      const newServices = [...prev];
      const currentService = newServices[index];

      // Only update if the value actually changed
      if (currentService[field] === value) {
        return prev;
      }

      newServices[index] = { ...currentService, [field]: value };
      return newServices;
    });
  };

  const handleCheckboxChange = (index, checkbox) => {
    setServices((prev) => {
      const newServices = [...prev];
      newServices[index] = {
        ...newServices[index],
        checkboxes: {
          ...newServices[index].checkboxes,
          [checkbox]: !newServices[index].checkboxes[checkbox],
        },
      };
      return newServices;
    });
  };

  const handleConsigneeChange = (index, consignee) => {
    setServices((prev) => {
      const newServices = [...prev];
      newServices[index] = {
        ...newServices[index],
        selectedConsignee: consignee,
        selectedDesignation: null,
        designationOptions: [],
      };
      return newServices;
    });

    if (consignee?.value) {
      fetchDesignations(consignee.value, index);
    }
  };

  const handleSaveAndNext = async () => {

    for (let i = 0; i < services.length; i++) {
      const s = services[i];

      if (!s.selectedConsignee) {
        alert(`Service ${i + 1}: Consignee is required`);
        return;
      }
      if (!s.selectedDesignation) {
        alert(`Service ${i + 1}: Designation is required`);
        return;
      }
      if (!s.selectedGender) {
        alert(`Service ${i + 1}: Gender is required`);
        return;
      }
      if (!s.selectedSkill) {
        alert(`Service ${i + 1}: Skill is required`);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const client_id = localStorage.getItem("client_id");
      const company_id = localStorage.getItem("selected_company");

      const payload = {
        client_id,
        company_id,
        totals: {
          total_without_addons: totals.totalWithoutAddons,
          total_addons_value: totals.totalAddons,
          total_with_addons: totals.totalWithAddons,
          total_contract_value: totals.totalContractValue,
        },
        services: services.map((service, index) => ({
          index: index + 1,
          consignee_id: service.selectedConsignee?.value,
          designation_id: service.selectedDesignation?.value,
          gender: service.selectedGender?.value,
          skill_category: service.selectedSkill?.value,
          age_limit: service.ageLimit,
          education_qualification: service.educationalQualification,
          specialization_for_pg: service.specializationPG,
          post_graduation: service.postGraduation,
          type_of_function: service.typesOfFunction,
          year_of_experience: service.yearsOfExperience,
          specialization: service.specialization,
          district: service.district,
          zip_code: service.zipcode,
          duty_hours: service.dutyHours,
          duty_extra_hours: service.dutyExtraHours,
          min_daily_wages: service.minDailyWages,
          monthly_salary: service.monthlySalary,
          bonus: service.bonusInput,
          provideant_fund: service.providentFund,
          epf_admin_charge: service.epfAdminCharge,
          edliPerDay: service.edli,
          esiPerDay: service.esi,
          optionAllowance1: service.optionalAllowance1,
          optionAllowance2: service.optionalAllowance2,
          optionAllowance3: service.optionalAllowance3,
          no_of_working_day: service.workingDays,
          tenure_duration: service.tenureMonths,
          number_of_hire_resource: service.hiredResources,
          perecnt_service_charge: service.serviceCharge,
          additional_requirement: service.additionalRequirement,
          // Boolean fields required by API
          is_bonus_applicable: service.checkboxes.bonus ? 1 : 0,
          is_pf_applicable: service.checkboxes.pf ? 1 : 0,
          is_epf_admin_charge_applicable: service.checkboxes.epfAdmin ? 1 : 0,
          is_edli_applicable: service.checkboxes.edli ? 1 : 0,
          is_esi_applicable: service.checkboxes.esi ? 1 : 0,
          is_optional_allowance_1_applicable: service.checkboxes.opt1 ? 1 : 0,
          is_optional_allowance_2_applicable: service.checkboxes.opt2 ? 1 : 0,
          is_optional_allowance_3_applicable: service.checkboxes.opt3 ? 1 : 0,
        })),

      };

      const response = await fetch(
        "https://green-owl-255815.hostingersite.com/api/create/client/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("API returned non-JSON response:", errorText);
        alert("API error: Server returned invalid response");
        return;
      }

      const result = await response.json();


      console.log("========== API RESPONSE ==========");
      console.log(JSON.stringify(result, null, 2));
       if (!result?.status) {
        throw new Error(result.message || 'Failed to save settings')
      }

      if (result?.status) {localStorage.setItem('Client_Services', JSON.stringify({ result }))} 

      if (result.status) {
        alert("Services created successfully!");
      } else {
        alert(result.message || "Something went wrong");
      }
      return true;
    } catch (error) {
      // console.log("========== API ERROR ==========");
      console.error(error);
      alert("API error: " + error.message);
    }
  };
  useEffect(() => {
  const saved = localStorage.getItem("Client_Services");
  console.log("services saved data ", saved)
  if (!saved) return;

  const parsed = JSON.parse(saved);
  const datach = parsed?.result
  console.log("services parshed data ", datach)

  const restoredServices = datach.data.map((s) => ({
    selectedConsignee: {
      label: consigneeOptions.find(c => c.value === s.consignee_id)?.label || "",
      value: s.consignee_id,
    },
    selectedDesignation: {
      label: s.designation_id,
      value: s.designation_id,
    },
    designationOptions: [], 
    selectedGender: {
      label: s.gender,
      value: s.gender,
    },
    selectedSkill: {
      label: s.skill_category,
      value: s.skill_category,
    },
    ageLimit: s.age_limit || "",
    educationalQualification: s.education_qualification || "",
    specializationPG: s.specialization_for_pg || "",
    postGraduation: s.post_graduation || "",
    typesOfFunction: s.type_of_function || "",
    yearsOfExperience: s.year_of_experience || "",
    specialization: s.specialization || "",
    district: s.district || "",
    zipcode: s.zip_code || "",
    dutyHours: s.duty_hours || "",
    dutyExtraHours: s.duty_extra_hours || "",
    minDailyWages: s.min_daily_wages || "",
    monthlySalary: s.monthly_salary || "",
    bonusInput: s.bonus || "",
    providentFund: s.provideant_fund || "",
    epfAdminCharge: s.epf_admin_charge || "",
    edli: s.edliPerDay || "",
    esi: s.esiPerDay || "",
    optionalAllowance1: s.optionAllowance1 || "",
    optionalAllowance2: s.optionAllowance2 || "",
    optionalAllowance3: s.optionAllowance3 || "",
    workingDays: s.no_of_working_day || "",
    tenureMonths: s.tenure_duration || "",
    hiredResources: s.number_of_hire_resource || "",
    serviceCharge: s.perecnt_service_charge || "",
    additionalRequirement: s.additional_requirement || "",
    checkboxes: {
      bonus: !!s.is_bonus_applicable,
      pf: !!s.is_pf_applicable,
      epfAdmin: !!s.is_epf_admin_charge_applicable,
      edli: !!s.is_edli_applicable,
      esi: !!s.is_esi_applicable,
      opt1: !!s.is_optional_allowance_1_applicable,
      opt2: !!s.is_optional_allowance_2_applicable,
      opt3: !!s.is_optional_allowance_3_applicable,
    },
  }));


  console.log("services Totals data ", datach?.totals)

  const restoredTotals = {
  totalWithoutAddons: datach?.totals?.total_without_addons || "",
  totalAddons: datach?.totals?.total_addons || "",
  totalWithAddons: datach?.totals?.total_with_addons || "",
  totalContractValue: datach?.totals?.total_contract_value || "",
};

setTotals(restoredTotals);

  setTotals(restoredTotals);

  setServices(restoredServices);

  
  restoredServices.forEach((srv, index) => {
    if (srv.selectedConsignee?.value) {
      fetchDesignations(srv.selectedConsignee.value, index);
    }
  });
}, [consigneeOptions]);





  // useImperativeHandle(ref, () => ({
  //   submit: handleSaveAndNext,
  // }));
   useImperativeHandle(ref, () => ({
      submit: handleSaveAndNext,
    }))

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-target">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Services Detail</h2>
            <p className="text-muted">Complete Services details goes here</p>
          </div>

          
          {services.map((service, index) => (
            <fieldset className="mb-4" key={service.id || index}>
              <div className="row">
                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Select Consignee<span className="text-danger">*</span>
                  </label>
                  <SelectDropdown
                    options={consigneeOptions}
                    selectedOption={service.selectedConsignee}
                    defaultSelect="Select Consignee"
                    onSelectOption={(opt) => handleConsigneeChange(index, opt)}
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Select Designation<span className="text-danger">*</span>
                  </label>
                  <SelectDropdown
                    options={service.designationOptions || []}
                    selectedOption={service.selectedDesignation}
                    defaultSelect={
                      service.selectedConsignee
                        ? "Select Designation"
                        : "Select Consignee First"
                    }
                    onSelectOption={(opt) =>
                      handleChange(index, "selectedDesignation", opt)
                    }
                    disabled={!service.selectedConsignee}
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Gender<span className="text-danger">*</span>
                  </label>
                  <SelectDropdown
                    options={Gender}
                    selectedOption={service.selectedGender}
                    defaultSelect="Select Gender"
                    onSelectOption={(opt) =>
                      handleChange(index, "selectedGender", opt)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="form-label">Age Limit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.ageLimit}
                    onChange={(e) =>
                      handleChange(index, "ageLimit", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Educational Qualification
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.educationalQualification}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "educationalQualification",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Specialization for PG
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.specializationPG}
                    onChange={(e) =>
                      handleChange(index, "specializationPG", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Post Graduation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.postGraduation}
                    onChange={(e) =>
                      handleChange(index, "postGraduation", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Types of Function
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.typesOfFunction}
                    onChange={(e) =>
                      handleChange(index, "typesOfFunction", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.yearsOfExperience}
                    onChange={(e) =>
                      handleChange(index, "yearsOfExperience", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.specialization}
                    onChange={(e) =>
                      handleChange(index, "specialization", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Skill Category<span className="text-danger">*</span>
                  </label>
                  <SelectDropdown
                    options={Skill}
                    selectedOption={service.selectedSkill}
                    defaultSelect="Select Skill"
                    onSelectOption={(opt) =>
                      handleChange(index, "selectedSkill", opt)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">District</label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.district}
                    onChange={(e) =>
                      handleChange(index, "district", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">Zipcode</label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.zipcode}
                    onChange={(e) =>
                      handleChange(index, "zipcode", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Duty Hours in a Day
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.dutyHours}
                    onChange={(e) =>
                      handleChange(index, "dutyHours", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Duty Extra Hours in a Day
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.dutyExtraHours}
                    onChange={(e) =>
                      handleChange(index, "dutyExtraHours", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Min Daily Wages
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.minDailyWages}
                    onChange={(e) =>
                      handleChange(index, "minDailyWages", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Monthly salary
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.monthlySalary}
                    onChange={(e) =>
                      handleChange(index, "monthlySalary", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label
                    htmlFor="targetTitle"
                    className="fw-semibold text-dark"
                  >
                    Bonus<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.bonusInput}
                    onChange={(e) =>
                      handleChange(index, "bonusInput", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Provident Fund (per/day)
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.providentFund}
                    onChange={(e) =>
                      handleChange(index, "providentFund", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    EPF Admin Charge (per/day)
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.epfAdminCharge}
                    onChange={(e) =>
                      handleChange(index, "epfAdminCharge", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    EDLI (per/day)<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.edli}
                    onChange={(e) =>
                      handleChange(index, "edli", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    ESI (per/day)<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.esi}
                    onChange={(e) => handleChange(index, "esi", e.target.value)}
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Optional Allowance 1 (per/day)
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.optionalAllowance1}
                    onChange={(e) =>
                      handleChange(index, "optionalAllowance1", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Optional Allowance 2 (per/day)
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.optionalAllowance2}
                    onChange={(e) =>
                      handleChange(index, "optionalAllowance2", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Optional Allowance 3 (per/day)
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.optionalAllowance3}
                    onChange={(e) =>
                      handleChange(index, "optionalAllowance3", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">Working Days</label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.workingDays}
                    onChange={(e) =>
                      handleChange(index, "workingDays", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Tenure in Months
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.tenureMonths}
                    onChange={(e) =>
                      handleChange(index, "tenureMonths", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Hired Resources
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.hiredResources}
                    onChange={(e) =>
                      handleChange(index, "hiredResources", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Service Charge
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.serviceCharge}
                    onChange={(e) =>
                      handleChange(index, "serviceCharge", e.target.value)
                    }
                  />
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 mb-4">
                  <label className="fw-semibold text-dark">
                    Additional Requirement
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={service.additionalRequirement}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "additionalRequirement",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="d-flex flex-wrap gap-5">
                  {Object.entries(service.checkboxes).map(
                    ([key, checked], i) => (
                      <div
                        key={i}
                        className="custom-control custom-checkbox mb-2"
                      >
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`${key}_${index}`}
                          checked={checked}
                          onChange={() => handleCheckboxChange(index, key)}
                        />
                        <label
                          className="custom-control-label c-pointer"
                          htmlFor={`${key}_${index}`}
                        >
                          {key === "bonus"
                            ? "Bonus"
                            : key === "pf"
                            ? "Provident Fund"
                            : key === "epfAdmin"
                            ? "EPF Admin Charge"
                            : key === "edli"
                            ? "EDLI"
                            : key === "esi"
                            ? "ESI"
                            : key === "opt1"
                            ? "Optional Allowance 1"
                            : key === "opt2"
                            ? "Optional Allowance 2"
                            : "Optional Allowance 3"}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </fieldset>
          ))}

          <div className="col-xl-3 col-lg-4 col-md-6 mb-4 d-flex justify-content-start gap-2">
            {services.length > 1 && (
              <button
                type="button"
                className="btn btn-md bg-soft-danger text-danger"
                onClick={handleDeleteLastService}
              >
                Delete Service
              </button>
            )}
            <button
              type="button"
              className="btn btn-md btn-primary"
              onClick={handleAddService}
            >
              + Add More Service
            </button>
          </div>
        </fieldset>
        <fieldset>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Total Value Without Addons{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={totals.totalWithoutAddons}
                onChange={(e) =>
                  handleTotalsChange("totalWithoutAddons", e.target.value)
                }
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Total Addons Value <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={totals.totalAddons}
                onChange={(e) =>
                  handleTotalsChange("totalAddons", e.target.value)
                }
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Total Value Including Addons{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={totals.totalWithAddons}
                onChange={(e) =>
                  handleTotalsChange("totalWithAddons", e.target.value)
                }
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Total Contract Value <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={totals.totalContractValue}
                onChange={(e) =>
                  handleTotalsChange("totalContractValue", e.target.value)
                }
                required
              />
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
});

TabProjectTarget.displayName = "TabProjectTarget";

export default TabProjectTarget;
