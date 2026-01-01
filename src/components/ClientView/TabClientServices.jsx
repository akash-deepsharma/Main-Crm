
'use client'
import React from 'react'

const TabClientServices = (data) => {
    const servicesData = data.data
    console.log( "servicesData" , servicesData)
    return (
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                {servicesData?.map((item,index)=>(
                <div className="col-xl-12" key={index}>
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Service details For <span className='text-primary'>{item.list_of_profile  }</span> </h3>
                            <div className="row">
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Consignee </label>
                                    <p>{item.consignee?.consignee_name}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Designation </label>
                                    <p>{item.consignee?.consigness_designation}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Gender  </label>
                                    <p>{item.gender}</p>
                                </div>
                               <div className="col-md-3 mb-2">
                                    <label className="form-label">Age Limit </label>
                                    <p>{item.age_limit}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Educational Qualification </label>
                                    <p>{item.education_qualification}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Specialization for PG  </label>
                                    <p>{item.specialization_for_pg}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Post Graduation </label>
                                    <p>{item.post_graduation}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Types of Function </label>
                                    <p>{item.type_of_function}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Years of Experience </label>
                                    <p>{item.year_of_experience}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Specialization  </label>
                                    <p>{item.specialization}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Skill Category </label>
                                    <p>{item.skill_category}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">District  </label>
                                    <p>{item.district}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Zipcode  </label>
                                    <p>{item.zip_code}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Duty Hours in a Day </label>
                                    <p>{item.duty_hours} Hours</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Min Daily Wages </label>
                                    <p>{item.min_daily_wages}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Monthly Salery </label>
                                    <p>{item.monthly_salary}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Bonus  </label>
                                    <p>{item.bonus}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Provident Fund (per/day)  </label>
                                    <p>{item.provideant_fund}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">EPF Admin Charge (per/day) </label>
                                    <p>{item.epf_admin_charge}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">EDLI (per/day) </label>
                                    <p>{item.edliPerDay}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">ESI (per/day) </label>
                                    <p>{item.esiPerDay}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Optional Allowance 1 (per/day)  </label>
                                    <p>{item.optionAllowance1}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Optional Allowance 2 (per/day)  </label>
                                    <p>{item.optionAllowance2}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Optional Allowance 3 (per/day) </label>
                                    <p>{item.optionAllowance3}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Number of Working Days (per/month) </label>
                                    <p>{item.no_of_working_day}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Tenure/Duration of Employment(in Months)  </label>
                                    <p>{item.tenure_duration}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Number Of Hired Resources </label>
                                    <p>{item.number_of_hire_resource}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Percent Service charge </label>
                                    <p>{item.perecnt_service_charge}</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Additional Requirement </label>
                                    <p>{item.additional_requirement}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ))}
                {/* <div className="col-xl-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Service details <span className='text-primary'> STP Operator</span> </h3>
                            <div className="row">
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Consignee </label>
                                    <p>raj</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Designation </label>
                                    <p>cmo</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Gender  </label>
                                    <p>Male</p>
                                </div>
                               <div className="col-md-3 mb-2">
                                    <label className="form-label">Age Limit </label>
                                    <p>60</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Educational Qualification </label>
                                    <p>High School</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Specialization for PG  </label>
                                    <p>Not Applicable</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Post Graduation </label>
                                    <p>Not Required</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Types of Function </label>
                                    <p>Others</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Years of Experience </label>
                                    <p>0 to 3 years</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Specialization  </label>
                                    <p>Not Required</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Skill Category </label>
                                    <p>Semi Skilled</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">District  </label>
                                    <p>NA</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Zipcode  </label>
                                    <p>NA</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Duty Hours in a Day </label>
                                    <p>9 Hours</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Min Daily Wages </label>
                                    <p>816</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Monthly Salery </label>
                                    <p>developer , designer</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Bonus  </label>
                                    <p>0</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Provident Fund (per/day)  </label>
                                    <p>97.92</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">EPF Admin Charge (per/day) </label>
                                    <p>4.08</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">EDLI (per/day) </label>
                                    <p>4.08</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">ESI (per/day) </label>
                                    <p>26.52</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Optional Allowance 1 (per/day)  </label>
                                    <p>8.16</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Optional Allowance 2 (per/day)  </label>
                                    <p>10</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Optional Allowance 3 (per/day) </label>
                                    <p>0</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Number of Working Days (per/day) </label>
                                    <p>30</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Tenure/Duration of Employment(in Months)  </label>
                                    <p>12</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Number Of Hired Resources </label>
                                    <p>3</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Percent Service charge </label>
                                    <p>3.85</p>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Additional Requirement </label>
                                    <p>No</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>

    )
}

export default TabClientServices
