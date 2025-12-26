'use client'
import React, { useState } from 'react'
import { FiCalendar, FiEye } from 'react-icons/fi'
import AreerTable from '../AreerList/AreerTable'
import MonthPicker from '../shared/MonthPicker'

const TabProjectOverview = () => {
    const [toggleDateRange, setToggleDateRange] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(new Date()) 

    return (
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body task-header d-md-flex align-items-center justify-content-between">
                            <div className="me-4">
                                <h4 className="mb-4 fw-bold d-flex">
                                    <span className="text-truncate-1-line">
                                        Client Name  || Arrer  
                                        {/* <span className="badge bg-soft-primary text-primary mx-3 fs-16">
                                            Dec
                                        </span> */}
                                        <span className="badge bg-soft-primary text-primary mx-3 fs-16">
                                            {selectedMonth.toLocaleString("en-US", { month: "short", year: "numeric" })}
                                        </span>
                                    </span>
                                </h4>

                                <div className="d-flex align-items-center mb-2">
                                    <div className="img-group lh-0 justify-content-start">
                                        <span className="d-none d-sm-flex">
                                            <h6 className="fs-16 text-muted text-truncate-1-line mb-0">
                                                <b>Phone :-</b> 9876543210
                                            </h6>
                                        </span>
                                    </div>
                                    <span className="vr mx-3 text-muted" />
                                    <div className="img-group lh-0 ms-2 justify-content-start">
                                        <span className="d-none d-sm-flex">
                                            <h6 className="fs-16 text-muted text-truncate-1-line mb-0">
                                                <b>Email :-</b> asdf@gmail.com
                                            </h6>
                                            <span className="badge bg-soft-success text-dark mx-3">
                                                4 Employee
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* -------- Right Side Buttons -------- */}
                            <div className="mt-4 mt-md-0">
                                <div className="d-flex gap-2">
                                    <div
                                        className="position-relative "
                                        onClick={() => setToggleDateRange(!toggleDateRange)}
                                    >
                                        <MonthPicker
                                            selectedMonth={selectedMonth}
                                            setSelectedMonth={setSelectedMonth}
                                            toggleDateRange={toggleDateRange}
                                        />
                                    </div>

                                    <a href="#" className="btn btn-success">
                                        <FiEye size={16} className='me-2' />
                                        <span>View Attached Doc</span>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <AreerTable />
                </div>
            </div>
        </div>
    )
}

export default TabProjectOverview
