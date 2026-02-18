import React from "react";
import getIcon from "@/utils/getIcon";
import { FiAlertTriangle } from "react-icons/fi";

const TabType = ({
  setFormData,
  formData,
  error,
  setError,
  onSelectType,
}) => {
  return (
    <section className="step-body mt-4 body current">
      <form id="project-type">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Document Upload type</h2>
            <p className="text-muted">Select Document Upload type first.</p>
            {error && (
              <label id="project-type-error" className="error">
                <FiAlertTriangle /> This field is required.
              </label>
            )}
          </div>

          {/* ONLY THESE TWO CARDS */}
          <EmployeeTypeCard
            icon={"feather-user"}
            title={"Gem Employee"}
            description={"Create Gem Employee"}
            id={"GeM"}
            name={"project-type"}
            isRequired={true}
            setFormData={setFormData}
            formData={formData}
            setError={setError}
            onSelectType={onSelectType}
          />

          <EmployeeTypeCard
            icon={"feather-users"}
            title={"Corporate Employee"}
            description={"Create corporate Employee"}
            id={"corporate"}
            name={"project-type"}
            isRequired={false}
            setFormData={setFormData}
            formData={formData}
            setError={setError}
            onSelectType={onSelectType}
          />
        </fieldset>
      </form>
    </section>
  );
};

export default TabType;

export const EmployeeTypeCard = ({
  icon,
  title,
  description,
  id,
  isRequired,
  name,
  setFormData,
  formData,
  setError,
  onSelectType, // ✅ NEW
}) => {
  const handleOnChange = (e) => {
    const selectedId = e.target.id;

    setFormData({ ...formData, employeeType: selectedId });
    setError(false);

    // ✅ AUTO MOVE TO NEXT STEP
    onSelectType?.();
  };

  return (
    <label className="w-100" htmlFor={id}>
      <input
        className="card-input-element"
        type="radio"
        name={name}
        id={id}
        required={isRequired}
        onChange={handleOnChange}
        checked={formData.employeeType === id}
      />

      <span className="card card-body d-flex flex-row justify-content-between align-items-center">
        <span className="hstack gap-3">
          <span className="avatar-text">
            {React.cloneElement(getIcon(icon), {
              size: "16",
              strokeWidth: "1.6",
            })}
          </span>
          <span>
            <span className="d-block fs-13 fw-bold text-dark">{title}</span>
            <span
              className="d-block text-muted mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </span>
        </span>
      </span>
    </label>
  );
};
