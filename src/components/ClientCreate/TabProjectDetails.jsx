import React, { useEffect, useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { customerListTagsOptions, projectBillingOptions, projectStatusOptions, propasalLeadOptions } from '@/utils/options'
import MultiSelectTags from '@/components/shared/MultiSelectTags';
import DatePicker from 'react-datepicker';
import useDatePicker from '@/hooks/useDatePicker';
import useJoditConfig from '@/hooks/useJoditConfig';
import JoditEditor from 'jodit-react';

const TabProjectDetails = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const config = useJoditConfig()
    const [value, setValue] = useState('');
    useEffect(() => {
        setStartDate(new Date())
        setValue(`
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores beatae inventore reiciendis ipsum natus, porro recusandae sunt accusantium reprehenderit aliquid commodi est veniam sit molestiae, nesciunt cupiditate. Laborum, culpa maxime.
            `)
    }, []);
    

    return (
        <section className="step-body mt-4 body current stepChange">
            <form id="project-details">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Organisation details</h2>
                        <p className="text-muted">Organisation details gose here.</p>
                    </div>
                    <fieldset>
                        <div className='row'>
                        <div className="col-xl-3 col-lg-4 col-md-6  mb-4">
                            <label htmlFor="projectName" className="form-label">Contract No. <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="projectName" name="projectName" defaultValue="Website design and development" required />
                        </div>
                       
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Onboard Date <span className="text-danger">*</span></label>
                            {/* <input type="date" className="form-control" id="ratePerHour" name="ratePerHour" required /> */}
                            <div className='input-group date '>
                                <DatePicker
                                    placeholderText='Pick Onboard Date'
                                    selected={startDate}
                                    showPopperArrow={false}
                                    onChange={(date) => setStartDate(date)}
                                    className='form-control'
                                    popperPlacement="bottom-start"
                                    calendarContainer={({ children }) => (
                                        <div className='bg-white react-datepicker'>
                                            {children}
                                            {renderFooter("start")}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>



                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Bid No. <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Service Start Date <span className="text-danger">*</span></label>
                            {/* <input type="date" className="form-control" id="ratePerHour" name="ratePerHour" required /> */}
                            <div className='input-group date '>
                                <DatePicker
                                    placeholderText='Pick Start Date'
                                    selected={startDate}
                                    showPopperArrow={false}
                                    onChange={(date) => setStartDate(date)}
                                    className='form-control'
                                    popperPlacement="bottom-start"
                                    calendarContainer={({ children }) => (
                                        <div className='bg-white react-datepicker'>
                                            {children}
                                            {renderFooter("start")}
                                        </div>
                                    )}
                                />
                            </div>
                            
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Service End Date <span className="text-danger">*</span></label>
                            {/* <input type="date" className="form-control" id="ratePerHour" name="ratePerHour" required /> */}
                            <div className='input-group date '>
                                <DatePicker
                                    placeholderText='Pick End Date'
                                    selected={startDate}
                                    showPopperArrow={false}
                                    onChange={(date) => setStartDate(date)}
                                    className='form-control'
                                    popperPlacement="bottom-start"
                                    calendarContainer={({ children }) => (
                                        <div className='bg-white react-datepicker'>
                                            {children}
                                            {renderFooter("start")}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Customer Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Type <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Ministry <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Department <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Department Nickname <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="projectName" className="form-label">Organisation Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="projectName" name="projectName" defaultValue="Website design and development" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Office Zone <span className="text-danger"></span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>

                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Buyer Name <span className="text-danger"></span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Designation <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Contact No <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Email <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">GSTIN <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                         <div className="col-xl-9 col-lg-12 col-md-12 mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Address <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="ratePerHour" name="ratePerHour" required />
                        </div>
                        <hr className="mb-5" />
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="sendProjectEmail"  />
                            <label className="custom-control-label c-pointer" htmlFor="sendProjectEmail">GSTIN (18%)</label>
                        </div>
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="calculateTasks" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="calculateTasks">Apply CGST 9% / SGST 9%</label>
                        </div>
                            
                        </div>
                        {/* <div className="mb-4 ">
                            <label className="form-label">Project Description <span className="text-danger">*</span></label>
                            <JoditEditor
                                value={value}
                                config={config}
                                onChange={(htmlString) => setValue(htmlString)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="projectClient" className="form-label">Project Client <span className="text-danger">*</span></label>
                            <SelectDropdown
                                options={propasalLeadOptions}
                                selectedOption={selectedOption}
                                defaultSelect="ui"
                                onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="billingType" className="form-label">Billing type <span className="text-danger">*</span></label>
                            <SelectDropdown
                                options={projectBillingOptions}
                                selectedOption={selectedOption}
                                defaultSelect="tasks-hours"
                                onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                        <div className="mb-4">

                            <label htmlFor="projectStatus" className="form-label">Project status <span className="text-danger">*</span></label>
                            <SelectDropdown
                                options={projectStatusOptions}
                                selectedOption={selectedOption}
                                defaultSelect="active"
                                onSelectOption={(option) => setSelectedOption(option)}
                            />

                        </div>
                        <div className="mb-4">
                            <label htmlFor="projectTags" className="form-label">Project tags <span className="text-danger">*</span></label>
                            <MultiSelectTags
                                options={customerListTagsOptions}
                                selectedOption={selectedOption}
                                defaultSelect={[customerListTagsOptions[10]]}
                                onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="projectReleaseDate" className="form-label">Release Date <span className="text-danger">*</span></label>
                            <div className='input-group date '>
                                <DatePicker
                                    placeholderText='Pick start date'
                                    selected={startDate}
                                    showPopperArrow={false}
                                    onChange={(date) => setStartDate(date)}
                                    className='form-control'
                                    popperPlacement="bottom-start"
                                    calendarContainer={({ children }) => (
                                        <div className='bg-white react-datepicker'>
                                            {children}
                                            {renderFooter("start")}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <hr className="mb-5" />
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="sendProjectEmail" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="sendProjectEmail">Send project created email.</label>
                        </div>
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="calculateTasks" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="calculateTasks">Calculate progress through tasks.</label>
                        </div>
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="allowNotifications" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="allowNotifications">Allow Notifications by Phone or Email.</label>
                        </div> */}
                    </fieldset>
                </fieldset>
                
            </form>
        </section>

    )
}

export default TabProjectDetails