import React from 'react'
import getIcon from '@/utils/getIcon'
import { FiAlertTriangle } from 'react-icons/fi'

const TabEmployeeType = ({ setFormData, formData, error, setError }) => {
    return (
        <section className="step-body mt-4 body current">
            <form id="project-type">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Employee type</h2>
                        <p className="text-muted">Select Employee type first.</p>
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
                        // id={"project_personal"}
                        id={"GeM"}
                        name={"project-type"}
                        isRequired={true}
                        setFormData={setFormData}
                        formData={formData}
                        setError={setError}
                    />

                    <EmployeeTypeCard
                        icon={"feather-users"}
                        title={"Corporate Employee"}
                        description={"Create corporate Employee"}
                        // id={"project_team"}

                        id={"corporate"}
                        name={"project-type"}
                        isRequired={false}
                        setFormData={setFormData}
                        formData={formData}
                        setError={setError}
                    />
                </fieldset>
            </form>
        </section>
    )
}

export default TabEmployeeType


export const EmployeeTypeCard = ({
    icon, title, description, id, isRequired, name,
    setFormData, formData, setError
}) => {

    const handleOnChange = (e) => {
        const id = e.target.id;
        const selectedId = e.target.id;
        console.log('Selected Employee Type:', selectedId);

        // console.log('this is my fsdfsdform data',formData);
        // Only projectType remains
       const fomrrr =  setFormData({ ...formData, projectType: id });
        // console.log('this is my fsdfsdform data',fomrrr);

        setError(false);
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
                checked={formData.projectType === id}
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
