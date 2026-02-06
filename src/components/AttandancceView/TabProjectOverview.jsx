// 'use client'
// import React, { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import MonthPicker from '../shared/MonthPicker'
// import AttandanceViewTable from './AttandanceViewTable'

// const TabProjectOverview = () => {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const employee_name = searchParams.get('employee_name')

//     const [toggleDateRange, setToggleDateRange] = useState(false)

//     const [selectedMonth, setSelectedMonth] = useState(() => {
//         const monthParam = searchParams.get('month')
//         const yearParam = searchParams.get('year')

//         if (monthParam && yearParam) {
//             return new Date(parseInt(yearParam), getMonthIndex(monthParam), 1)
//         }

//         // default = previous month
//         const now = new Date()
//         return new Date(now.getFullYear(), now.getMonth() - 1, 1)
//     })

//     function getMonthIndex(monthName) {
//         const months = [
//             'january','february','march','april','may','june',
//             'july','august','september','october','november','december'
//         ]
//         return months.findIndex(m => m === monthName.toLowerCase())
//     }

//     const handleMonthChange = (date) => {
//         setSelectedMonth(date)

//         const monthName = date.toLocaleString('en-US', { month: 'long' })
//         const year = date.getFullYear()

//         const params = new URLSearchParams(searchParams.toString())
//         params.set('month', monthName)
//         params.set('year', year)

//         router.push(`?${params.toString()}`)
//     }

//     const month = selectedMonth?.toLocaleString('en-US', { month: 'long' }) || null
//     const year = selectedMonth?.getFullYear()?.toString() || null

//     return (
//         <div className="tab-pane fade active show">
//             <div className="row">
//                 <div className="col-lg-12">
//                     <div className="card stretch stretch-full">
//                         <div className="card-body d-flex justify-content-between align-items-center">
//                             <h4 className="fw-bold">
//                                 Employee Name :- {employee_name}
//                             </h4>

//                             <div onClick={() => setToggleDateRange(!toggleDateRange)}>
//                                 <MonthPicker
//                                     selectedMonth={selectedMonth}
//                                     onChange={handleMonthChange}
//                                     toggleDateRange={toggleDateRange}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-xl-12">
//                     <AttandanceViewTable
//                         month={month}
//                         year={year}
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default TabProjectOverview



'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MonthPicker from '../shared/MonthPicker'
import AttandanceViewTable from './AttandanceViewTable'

const TabProjectOverview = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const employee_name = searchParams.get('employee_name')

    const [toggleDateRange, setToggleDateRange] = useState(false)

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const monthParam = searchParams.get('month')
        const yearParam = searchParams.get('year')

        if (monthParam && yearParam) {
            return new Date(parseInt(yearParam), getMonthIndex(monthParam), 1)
        }

        // Return null if no month/year in URL
        return null
    })

    function getMonthIndex(monthName) {
        const months = [
            'january','february','march','april','may','june',
            'july','august','september','october','november','december'
        ]
        return months.findIndex(m => m === monthName.toLowerCase())
    }

    const handleMonthChange = (date) => {
        setSelectedMonth(date)

        const monthName = date.toLocaleString('en-US', { month: 'long' })
        const year = date.getFullYear()

        const params = new URLSearchParams(searchParams.toString())
        params.set('month', monthName)
        params.set('year', year)

        router.push(`?${params.toString()}`)
    }

    const handleClearMonth = () => {
        setSelectedMonth(null)
        
        const params = new URLSearchParams(searchParams.toString())
        params.delete('month')
        params.delete('year')
        
        router.push(`?${params.toString()}`)
    }

    const month = selectedMonth?.toLocaleString('en-US', { month: 'long' }) || null
    const year = selectedMonth?.getFullYear()?.toString() || null

    return (
        <div className="tab-pane fade active show">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold">
                                Employee Name: {employee_name || 'Not specified'}
                            </h4>

                            <div className="d-flex align-items-center gap-3">
                                <button
                                    onClick={handleClearMonth}
                                    className="btn btn-outline-danger btn-sm"
                                    disabled={!selectedMonth}
                                >
                                    Clear Date
                                </button>
                                
                                <div onClick={() => setToggleDateRange(!toggleDateRange)}>
                                    <MonthPicker
                                        selectedMonth={selectedMonth}
                                        onChange={handleMonthChange}
                                        toggleDateRange={toggleDateRange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <AttandanceViewTable
                        month={month}
                        year={year}
                        selectedMonth={selectedMonth}
                    />
                </div>
            </div>
        </div>
    )
}

export default TabProjectOverview