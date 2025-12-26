import React, { useState } from 'react'
import SelectDropdown from '../shared/SelectDropdown';
import { QualificationOptions } from '@/utils/options';


const TabEmployeeEducation = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    return (
        <section className="step-body mt-4 body current stepChange">
            <form id="project-settings">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Education Details </h2>
                        <p className="text-muted">Employee Education details gose here.</p>
                    </div>
                    <fieldset>
                        <div className='row'>   
                        <div className="col-xl-4 col-lg-4 col-md-6  mb-4">
                            <label htmlFor="projectName" className="form-label">10th Qualification</label>
                            <SelectDropdown
                            options={QualificationOptions}
                            selectedOption={selectedOption}
                            defaultSelect="10th"
                            onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                    
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Qualification Year </label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Upload Marksheet </label>
                            <input type="file" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6  mb-4">
                            <label htmlFor="projectName" className="form-label">12th Qualification </label>
                            <SelectDropdown
                            options={QualificationOptions}
                            selectedOption={selectedOption}
                            defaultSelect="12th"
                            onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                    
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Qualification Year </label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Upload Marksheet </label>
                            <input type="file" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6  mb-4">
                            <label htmlFor="projectName" className="form-label">Select Qualifications </label>
                            <SelectDropdown
                            options={QualificationOptions}
                            selectedOption={selectedOption}
                            defaultSelect="SQualifiaction"
                            onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                    
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Qualification Year </label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Upload Marksheet </label>
                            <input type="file" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        
                                                   
                        </div>
                    </fieldset>
                </fieldset>
            </form>
        </section>

    )
}

export default TabEmployeeEducation

