import React from 'react'
import getIcon from '@/utils/getIcon'
import { FiAlertTriangle } from 'react-icons/fi'

const TabProjectType = ({ setFormData, formData, error, setError, onUpdate }) => {
    
    const handleOnChange = (e) => {
        const id = e.target.id;
        
        // Update form data
        setFormData({ ...formData, projectType: id });
        
        // Call the onUpdate callback
        if (onUpdate) {
            onUpdate('projectType', id);
        }
        
        // Clear error
        setError(false);
    };

    return (
        <section className="step-body mt-4 body current">
            <form id="project-type">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Client type</h2>
                        <p className="text-muted">Select Client type first to Create Salary</p>
                        {error && (
                            <div className="alert alert-danger mt-2 py-2 px-3 d-inline-flex align-items-center">
                                <FiAlertTriangle className="me-2" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <ProjectTypeCard
                        icon={"feather-user"}
                        title={"Gem Client"}
                        description={"If you need more info, please check it out"}
                        id={"GeM"}
                        name={"project-type"}
                        isRequired={true}
                        onChange={handleOnChange}
                        checked={formData.projectType === "GeM"}
                    />

                    <ProjectTypeCard
                        icon={"feather-users"}
                        title={"Corporate Client"}
                        description={"Create Corporate Salary "}
                        id={"Corporate"}
                        name={"project-type"}
                        isRequired={false}
                        onChange={handleOnChange}
                        checked={formData.projectType === "Corporate"}
                    />
                </fieldset>
            </form>
        </section>
    )
}

export default TabProjectType

export const ProjectTypeCard = ({
    icon, title, description, id, isRequired, name,
    onChange, checked
}) => {
    return (
        <label className="w-100" htmlFor={id}>
            <input
                className="card-input-element"
                type="radio"
                name={name}
                id={id}
                required={isRequired}
                onChange={onChange}
                checked={checked}
            />
            <span className="card card-body d-flex flex-row justify-content-between align-items-center ">
                <span className="hstack gap-3">
                    <span className="avatar-text">
                        {React.cloneElement(getIcon(icon), { size: "16", strokeWidth: "1.6" })}
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
    )
}