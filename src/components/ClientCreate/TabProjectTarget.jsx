import React, { useState } from "react";
import useJoditConfig from "@/hooks/useJoditConfig";
import SelectDropdown from "@/components/shared/SelectDropdown";

const TabProjectTarget = () => {
  const config = useJoditConfig();
  const emptyBlock = {
    selectedConsignee: null,
    selectedDesignation: null,
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

  const Consignee = [
    { value: "Select Consignee", label: "Select Consignee", color: "#3454d1" },
    { value: "Consignee One", label: "Consignee One", color: "#3454d1" },
    { value: "Consignee Two", label: "Consignee Two", color: "#41b2c4" },
    { value: "Consignee Three", label: "Consignee Three", color: "#ea4d4d" },
    { value: "Consignee Four", label: "Consignee Four", color: "#ffa21d" },
    { value: "Consignee Five", label: "Consignee Five", color: "#17c666" },
  ];

  const Designation = [
    { value: "Select Designation", label: "Select Designation", color: "#3454d1" },
    { value: "Designation One", label: "Designation One", color: "#3454d1" },
    { value: "Designation Two", label: "Designation Two", color: "#41b2c4" },
    { value: "Designation Three", label: "Designation Three", color: "#ea4d4d" },
    { value: "Designation Four", label: "Designation Four", color: "#ffa21d" },
    { value: "Designation Five", label: "Designation Five", color: "#17c666" },
  ];

  const Gender = [
    { value: "Select Gender", label: "Select Gender", color: "#3454d1" },
    { value: "Male", label: "Male", color: "#3454d1" },
    { value: "Female", label: "Female", color: "#41b2c4" },
    { value: "Any", label: "Any", color: "#ea4d4d" },
  ];

  const Skill = [
    { value: "Select Skill", label: "Select Skill", color: "#3454d1" },
    { value: "Semi-Skilled", label: "Semi-Skilled", color: "#3454d1" },
    { value: "Skilled", label: "Skilled", color: "#41b2c4" },
    { value: "Any", label: "Any", color: "#ea4d4d" },
  ];

  // -----------------------------
  // ADD / DELETE SERVICE
  // -----------------------------
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

  // -----------------------------
  // HANDLE CHANGE
  // -----------------------------
  const handleChange = (index, field, value) => {
    setServices((prev) =>
      prev.map((service, i) => (i === index ? { ...service, [field]: value } : service))
    );
  };

  const handleCheckboxChange = (index, checkbox) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index
          ? {
              ...service,
              checkboxes: { ...service.checkboxes, [checkbox]: !service.checkboxes[checkbox] },
            }
          : service
      )
    );
  };

  // -----------------------------
  // SERVICE BLOCK COMPONENT
  // -----------------------------
  const ServiceBlock = ({ service, index }) => {
    return (
      <fieldset className="mb-4">
        <div className="row">
          {/* Consignee */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Select Consignee<span className="text-danger">*</span>
            </label>
            <SelectDropdown
              options={Consignee}
              selectedOption={service.selectedConsignee}
              defaultSelect="Select Consignee"
              onSelectOption={(opt) => handleChange(index, "selectedConsignee", opt)}
            />
          </div>

          {/* Designation */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Select Designation<span className="text-danger">*</span>
            </label>
            <SelectDropdown
              options={Designation}
              selectedOption={service.selectedDesignation}
              defaultSelect="Select Designation"
              onSelectOption={(opt) => handleChange(index, "selectedDesignation", opt)}
            />
          </div>

          {/* Gender */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Gender<span className="text-danger">*</span>
            </label>
            <SelectDropdown
              options={Gender}
              selectedOption={service.selectedGender}
              defaultSelect="Select Gender"
              onSelectOption={(opt) => handleChange(index, "selectedGender", opt)}
            />
          </div>

          {/* Age Limit */}
          <div className="col-lg-3 mb-4">
            <label className="form-label">Age Limit</label>
            <input
              type="text"
              className="form-control"
              value={service.ageLimit}
              onChange={(e) => handleChange(index, "ageLimit", e.target.value)}
            />
          </div>

          {/* Educational Qualification */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Educational Qualification<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.educationalQualification}
              onChange={(e) => handleChange(index, "educationalQualification", e.target.value)}
            />
          </div>

          {/* Specialization for PG */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Specialization for PG</label>
            <input
              type="text"
              className="form-control"
              value={service.specializationPG}
              onChange={(e) => handleChange(index, "specializationPG", e.target.value)}
            />
          </div>

          {/* Post Graduation */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Post Graduation</label>
            <input
              type="text"
              className="form-control"
              value={service.postGraduation}
              onChange={(e) => handleChange(index, "postGraduation", e.target.value)}
            />
          </div>

          {/* Types of Function */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Types of Function</label>
            <input
              type="text"
              className="form-control"
              value={service.typesOfFunction}
              onChange={(e) => handleChange(index, "typesOfFunction", e.target.value)}
            />
          </div>

          {/* Years of Experience */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Years of Experience</label>
            <input
              type="text"
              className="form-control"
              value={service.yearsOfExperience}
              onChange={(e) => handleChange(index, "yearsOfExperience", e.target.value)}
            />
          </div>

          {/* Specialization */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Specialization</label>
            <input
              type="text"
              className="form-control"
              value={service.specialization}
              onChange={(e) => handleChange(index, "specialization", e.target.value)}
            />
          </div>

          {/* Skill */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Skill Category<span className="text-danger">*</span>
            </label>
            <SelectDropdown
              options={Skill}
              selectedOption={service.selectedSkill}
              defaultSelect="Select Skill"
              onSelectOption={(opt) => handleChange(index, "selectedSkill", opt)}
            />
          </div>

          {/* Remaining Inputs */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">District</label>
            <input
              type="text"
              className="form-control"
              value={service.district}
              onChange={(e) => handleChange(index, "district", e.target.value)}
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Zipcode</label>
            <input
              type="text"
              className="form-control"
              value={service.zipcode}
              onChange={(e) => handleChange(index, "zipcode", e.target.value)}
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Duty Hours in a Day</label>
            <input
              type="text"
              className="form-control"
              value={service.dutyHours}
              onChange={(e) => handleChange(index, "dutyHours", e.target.value)}
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Duty Extra Hours in a Day</label>
            <input
              type="text"
              className="form-control"
              value={service.dutyExtraHours}
              onChange={(e) => handleChange(index, "dutyExtraHours", e.target.value)}
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Min Daily Wages</label>
            <input
              type="text"
              className="form-control"
              value={service.minDailyWages}
              onChange={(e) => handleChange(index, "minDailyWages", e.target.value)}
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Monthly salary</label>
            <input
              type="text"
              className="form-control"
              value={service.monthlySalary}
              onChange={(e) => handleChange(index, "monthlySalary", e.target.value)}
            />
          </div>
          {/* Bonus */}
           <div className="col-lg-3 mb-4">
                            <label htmlFor="targetTitle" className="fw-semibold text-dark">Bonus<span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={service.bonusInput}
              onChange={(e) => handleChange(index, "bonusInput", e.target.value)} />
                        </div>

          {/* Provident Fund */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Provident Fund (per/day)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.providentFund}
              onChange={(e) => handleChange(index, "providentFund", e.target.value)}
            />
          </div>

          {/* EPF Admin */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              EPF Admin Charge (per/day)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.epfAdminCharge}
              onChange={(e) => handleChange(index, "epfAdminCharge", e.target.value)}
            />
          </div>

          {/* EDLI */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              EDLI (per/day)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.edli}
              onChange={(e) => handleChange(index, "edli", e.target.value)}
            />
          </div>

          {/* ESI */}
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

          {/* Optional Allowances */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Optional Allowance 1 (per/day)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.optionalAllowance1}
              onChange={(e) => handleChange(index, "optionalAllowance1", e.target.value)}
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Optional Allowance 2 (per/day)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.optionalAllowance2}
              onChange={(e) => handleChange(index, "optionalAllowance2", e.target.value)}
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Optional Allowance 3 (per/day)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.optionalAllowance3}
              onChange={(e) => handleChange(index, "optionalAllowance3", e.target.value)}
            />
          </div>

          {/* Working Days */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Number of Working Days<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.workingDays}
              onChange={(e) => handleChange(index, "workingDays", e.target.value)}
            />
          </div>

          {/* Tenure */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Tenure/Duration of Employment (in month)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.tenureMonths}
              onChange={(e) => handleChange(index, "tenureMonths", e.target.value)}
            />
          </div>

          {/* Hired Resources */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Number Of Hired Resources<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.hiredResources}
              onChange={(e) => handleChange(index, "hiredResources", e.target.value)}
            />
          </div>

          {/* Service Charge */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Percent Service Charge<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.serviceCharge}
              onChange={(e) => handleChange(index, "serviceCharge", e.target.value)}
            />
          </div>

          {/* Additional Requirement */}
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">
              Additional Requirement<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={service.additionalRequirement}
              onChange={(e) => handleChange(index, "additionalRequirement", e.target.value)}
            />
          </div>

          {/* Checkboxes */}
          <div className="d-flex flex-wrap gap-5">
            {Object.entries(service.checkboxes).map(([key, checked], i) => (
              <div key={i} className="custom-control custom-checkbox mb-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`${key}_${index}`}
                  checked={checked}
                  onChange={() => handleCheckboxChange(index, key)}
                />
                <label className="custom-control-label c-pointer" htmlFor={`${key}_${index}`}>
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
            ))}
          </div>
        </div>
      </fieldset>
    );
  };

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-target">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Services Detail</h2>
            <p className="text-muted">Complete Services details gose here</p>
          </div>

          {services.map((service, index) => (
            <ServiceBlock key={index} service={service} index={index} />
          ))}

          {/* Add / Delete buttons */}
          <div className="col-xl-3 col-lg-4 col-md-6 mb-4 d-flex justify-content-start gap-2">
            {services.length > 1 && (
              <button
                className="btn btn-md bg-soft-danger text-danger"
                onClick={handleDeleteLastService}
              >
                Delete Service
              </button>
            )}
            <button className="btn btn-md btn-primary" onClick={handleAddService}>
              + Add More Service
            </button>
          </div>
        </fieldset>
        <fieldset>
                                <div className='row'>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Total Value Without Addons <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Total Addons Value <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Total Value Including Addons <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Total Contract Value <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                </div>
                            </fieldset>
      </form>
    </section>
  );
};

export default TabProjectTarget;
