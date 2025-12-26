import React, { useState } from 'react'


const TabProjectSettings = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    return (
        <section className="step-body mt-4 body current stepChange">
            <form id="project-settings">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Financial Approval Details/ Paying Authority Details</h2>
                        <p className="text-muted">You Financial/Paying Authority details gose here.</p>
                    </div>
                    <fieldset>
                        <div className='row'>
                        <div className="col-xl-3 col-lg-4 col-md-6  mb-4">
                            <label htmlFor="projectName" className="form-label">IFD Concurrence <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="projectName" name="projectName" defaultValue="" required />
                        </div>
                    
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Designation of Administrative Approval <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Designation of Financial Approval <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Role <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Payment Mode <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Designation <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Email <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="projectName" className="form-label">GSTIN <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="projectName" name="projectName" defaultValue="" required />
                        </div>
                        <div className="col-xl-8 col-lg-8 col-md-12 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Address <span className="text-danger"></span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>                            
                        </div>
                    </fieldset>
                </fieldset>
            </form>
        </section>

    )
}

export default TabProjectSettings

