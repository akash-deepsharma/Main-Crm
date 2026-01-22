'use client'
import React, { useState, useEffect } from 'react'
import { FiEye } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import AttandanceEmployeeTable from '../ClientAttendanceList/AttandanceEmployeeTable'
import MonthPicker from '../shared/MonthPicker'

const TabProjectOverview = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const monthParam = searchParams.get('month')

    const [toggleDateRange, setToggleDateRange] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(
        monthParam ? new Date(monthParam + '-01') : new Date()
    )

    // 👉 jab month change ho → URL update
const handleMonthChange = (date) => {
    setSelectedMonth(date)

    const monthName = date.toLocaleString('en-US', { month: 'long' }) // January
    const year = date.getFullYear() // 2026

    // 👉 existing params preserve
    const params = new URLSearchParams(searchParams.toString())

    // 👉 new format me save
    params.set('month', monthName)
    params.set('year', year)

    router.push(`?${params.toString()}`)
}



    return (
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body task-header d-md-flex align-items-center justify-content-between">

                            <h4 className="fw-bold">
                                Client Name
                                <span className="badge bg-soft-primary text-primary mx-3 fs-16">
                                    {selectedMonth.toLocaleString("en-US", {
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </span>
                            </h4>

                            <div className="d-flex gap-2">
                                <div onClick={() => setToggleDateRange(!toggleDateRange)}>
                                    <MonthPicker
                                        selectedMonth={selectedMonth}
                                        onChange={handleMonthChange}
                                        toggleDateRange={toggleDateRange}
                                    />
                                </div>

                                <a href="#" className="btn btn-success">
                                    <FiEye size={16} className='me-2' />
                                    View Attached Doc
                                </a>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <AttandanceEmployeeTable />
                </div>
            </div>
        </div>
    )
}

export default TabProjectOverview
