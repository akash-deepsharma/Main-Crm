"use client";

import { useEffect, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";

const TabProjectTarget = forwardRef(({ clientId }, ref) => {
  const emptyBlock = {
    selectedConsignee: null,
    selectedDesignation: null,
    designationOptions: [],
    selectedGender: null,
    selectedSkill: null,
    ageLimit: "",
    id: "",
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
    totalWithoutAddons: "",
    totalAddons: "",
    totalWithAddons: "",
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
  const [designationsCache, setDesignationsCache] = useState({});
  const [totals, setTotals] = useState({
    totalContractValue: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Predefined options without colors for better compatibility
  const Gender = useMemo(() => [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Any", label: "Any" },
  ], []);

  const Skill = useMemo(() => [
    { value: "Semi-Skilled", label: "Semi-Skilled" },
    { value: "Skilled", label: "Skilled" },
    { value: "Any", label: "Any" },
  ], []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchConsignees();
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Load saved data when consigneeOptions are available
  useEffect(() => {
    if (consigneeOptions.length > 0) {
      loadSavedData();
    }
  }, [consigneeOptions]);

  const fetchConsignees = async () => {
    try {
      const token = localStorage.getItem("token");
      const client_id = localStorage.getItem("client_id");
      const selected_company = localStorage.getItem("selected_company");

      if (!token || !client_id || !selected_company) return;

      const response = await fetch(
        `https://green-owl-255815.hostingersite.com/api/select/consignee?client_id=${client_id}&company_id=${selected_company}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result?.status && Array.isArray(result.data)) {
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

  const fetchDesignations = async (consigneeId) => {
    if (!consigneeId) return [];
    
    if (designationsCache[consigneeId]) {
      return designationsCache[consigneeId];
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://green-owl-255815.hostingersite.com/api/select/designation?consignee_id=${consigneeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result?.status && Array.isArray(result.data)) {
        const options = result.data.map((d) => ({
          label: d.name,
          value: d.id,
        }));

        setDesignationsCache(prev => ({
          ...prev,
          [consigneeId]: options
        }));

        return options;
      }
      return [];
    } catch (err) {
      console.error("Error fetching designations:", err);
      return [];
    }
  };

  const isDesignationSelectedElsewhere = (consigneeId, designationId, currentServiceIndex) => {
    return services.some((service, idx) => 
      idx !== currentServiceIndex && 
      service.selectedConsignee?.value === consigneeId && 
      service.selectedDesignation?.value === designationId
    );
  };

  const getAllDesignationsForConsignee = (consigneeId) => {
    if (!consigneeId || !designationsCache[consigneeId]) {
      return [];
    }
    return designationsCache[consigneeId];
  };

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
      newServices[index] = { ...newServices[index], [field]: value };
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

  const handleConsigneeChange = async (index, consignee) => {
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
      const options = await fetchDesignations(consignee.value);
      setServices((prev) => {
        const newServices = [...prev];
        newServices[index] = {
          ...newServices[index],
          designationOptions: options,
        };
        return newServices;
      });
    }
  };

  const handleDesignationChange = (index, designation) => {
    const currentService = services[index];
    if (currentService.selectedConsignee?.value && designation?.value) {
      const isDuplicate = isDesignationSelectedElsewhere(
        currentService.selectedConsignee.value,
        designation.value,
        index
      );

      if (isDuplicate) {
        alert("This designation is already selected in another service. Please choose a different designation.");
        return;
      }
    }
    handleChange(index, "selectedDesignation", designation);
  };

  const handleSaveAndNext = async () => {
    // Validation
    const designationMap = new Map();
    
    for (let i = 0; i < services.length; i++) {
      const s = services[i];

      if (!s.selectedConsignee) {
        alert(`Service ${i + 1}: Consignee is required`);
        return false;
      }
      if (!s.selectedDesignation) {
        alert(`Service ${i + 1}: Designation is required`);
        return false;
      }
      if (!s.selectedGender) {
        alert(`Service ${i + 1}: Gender is required`);
        return false;
      }
      if (!s.selectedSkill) {
        alert(`Service ${i + 1}: Skill is required`);
        return false;
      }

      const key = `${s.selectedConsignee.value}-${s.selectedDesignation.value}`;
      if (designationMap.has(key)) {
        alert(`Service ${i + 1}: This Consignee-Designation combination is already used in Service ${designationMap.get(key) + 1}`);
        return false;
      }
      designationMap.set(key, i);
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const client_id = localStorage.getItem("client_id");
      const company_id = localStorage.getItem("selected_company");

      if (!token || !client_id || !company_id) {
        alert("Missing required data");
        setIsSaving(false);
        return false;
      }

      // Prepare payload - only include id if it exists and is not empty
      const servicesPayload = services.map((service, index) => {
        const payloadItem = {
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
          is_bonus_applicable: service.checkboxes.bonus ? 1 : 0,
          is_pf_applicable: service.checkboxes.pf ? 1 : 0,
          is_epf_admin_charge_applicable: service.checkboxes.epfAdmin ? 1 : 0,
          is_edli_applicable: service.checkboxes.edli ? 1 : 0,
          is_esi_applicable: service.checkboxes.esi ? 1 : 0,
          is_optional_allowance_1_applicable: service.checkboxes.opt1 ? 1 : 0,
          is_optional_allowance_2_applicable: service.checkboxes.opt2 ? 1 : 0,
          is_optional_allowance_3_applicable: service.checkboxes.opt3 ? 1 : 0,
          total_without_addons: service.totalWithoutAddons,
          total_addons_value: service.totalAddons,
          total_with_addons: service.totalWithAddons,
        };

        // Only add id if it exists and is not empty (for existing services)
        if (service.id && service.id !== "") {
          payloadItem.id = service.id;
        }

        return payloadItem;
      });

      const payload = {
        client_id,
        company_id,
        totals: {
          total_contract_value: totals.totalContractValue || "",
        },
        services: servicesPayload,
      };

      console.log("Saving services payload:", JSON.stringify(payload, null, 2));

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

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("API returned non-JSON response:", errorText);
        alert("Server error: Please try again");
        setIsSaving(false);
        return false;
      }

      const result = await response.json();
      console.log("Services API response:", result);

      if (!response.ok) {
        throw new Error(result?.message || `HTTP error! status: ${response.status}`);
      }

      if (!result?.status) {
        throw new Error(result?.message || 'Failed to save services');
      }

      // Save to localStorage
      localStorage.setItem('Client_Services', JSON.stringify({ services, totals }));

      alert("Services saved successfully!");
      setIsSaving(false);
      return true;
      
    } catch (error) {
      console.error("Save services error:", error);
      alert(`Error saving services: ${error.message}`);
      setIsSaving(false);
      return false;
    }
  };

  // Load saved data from localStorage
  const loadSavedData = async () => {
    try {
      const saved = localStorage.getItem("Client_Services");
      console.log("Saved services data:", saved);
      
      if (!saved) return;

      const parsed = JSON.parse(saved);
      console.log("Parsed services data:", parsed);
      
      if (parsed?.services && parsed.services.length > 0) {
        // First, fetch all unique consignee IDs to load their designations
        const uniqueConsigneeIds = [...new Set(parsed.services.map(s => s.selectedConsignee?.value))];
        
        // Fetch designations for each consignee
        for (const consigneeId of uniqueConsigneeIds) {
          if (consigneeId) {
            await fetchDesignations(consigneeId);
          }
        }

        // Map the saved data to match the exact option objects
        const processedServices = parsed.services.map(savedService => {
          // Find matching consignee option
          const consigneeOption = consigneeOptions.find(
            c => c.value === savedService.selectedConsignee?.value
          );

          // Find matching gender option
          const genderOption = Gender.find(
            g => g.value === savedService.selectedGender?.value
          );

          // Find matching skill option
          const skillOption = Skill.find(
            s => s.value === savedService.selectedSkill?.value
          );

          // Get designation options for this consignee
          const desigOptions = designationsCache[savedService.selectedConsignee?.value] || [];

          // Find matching designation option
          const designationOption = desigOptions.find(
            d => d.value === savedService.selectedDesignation?.value
          );

          return {
            ...savedService,
            selectedConsignee: consigneeOption || savedService.selectedConsignee,
            selectedGender: genderOption || savedService.selectedGender,
            selectedSkill: skillOption || savedService.selectedSkill,
            selectedDesignation: designationOption || savedService.selectedDesignation,
            designationOptions: desigOptions
          };
        });

        console.log("Processed services:", processedServices);
        setServices(processedServices);
        setTotals(parsed.totals || { totalContractValue: "" });
      }
    } catch (error) {
      console.error("Error loading saved services:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: handleSaveAndNext,
  }));

  if (isLoading) {
    return (
      <section className="step-body mt-4 body current stepChange">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading services data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-target">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Services Detail</h2>
            <p className="text-muted">Complete Services details goes here</p>
          </div>

          {services.map((service, index) => (
            <fieldset className="mb-4 border p-4 rounded" key={index}>
              <h5 className="mb-3">Service #{index + 1}</h5>
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
                  {service.selectedConsignee && (
                    <small className="text-success d-block mt-1">
                      Selected: {service.selectedConsignee.label}
                    </small>
                  )}
                </div>

                <div className="col-lg-3 mb-4">
                  <label className="fw-semibold text-dark">
                    Select Designation<span className="text-danger">*</span>
                  </label>
                  <SelectDropdown
                    options={service.selectedConsignee?.value 
                      ? getAllDesignationsForConsignee(service.selectedConsignee.value)
                      : []}
                    selectedOption={service.selectedDesignation}
                    defaultSelect={
                      service.selectedConsignee
                        ? "Select Designation"
                        : "Select Consignee First"
                    }
                    onSelectOption={(opt) =>
                      handleDesignationChange(index, opt)
                    }
                    disabled={!service.selectedConsignee}
                  />
                  {service.selectedDesignation && (
                    <small className="text-success d-block mt-1">
                      Selected: {service.selectedDesignation.label}
                    </small>
                  )}
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
                  {service.selectedGender && (
                    <small className="text-success d-block mt-1">
                      Selected: {service.selectedGender.label}
                    </small>
                  )}
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
                  {service.selectedSkill && (
                    <small className="text-success d-block mt-1">
                      Selected: {service.selectedSkill.label}
                    </small>
                  )}
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
                  <label className="fw-semibold text-dark">
                    Bonus
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
                    EDLI (per/day)
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
                    ESI (per/day)
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
                
                <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <label className="form-label">
                    Total Value Without Addons
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.totalWithoutAddons}
                    onChange={(e) =>
                      handleChange(index, "totalWithoutAddons", e.target.value)
                    }
                  />
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <label className="form-label">
                    Total Addons Value
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.totalAddons}
                    onChange={(e) =>
                      handleChange(index, "totalAddons", e.target.value)
                    }
                  />
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <label className="form-label">
                    Total Value Including Addons
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.totalWithAddons}
                    onChange={(e) =>
                      handleChange(index, "totalWithAddons", e.target.value)
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
                Delete Last Service
              </button>
            )}
            <button
              type="button"
              className="btn btn-md btn-primary"
              onClick={handleAddService}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "+ Add More Service"}
            </button>
          </div>
        </fieldset>
        <fieldset>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Total Contract Value
              </label>
              <input
                type="text"
                className="form-control"
                value={totals.totalContractValue}
                onChange={(e) =>
                  setTotals({ totalContractValue: e.target.value })
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