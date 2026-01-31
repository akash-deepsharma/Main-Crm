'use client'

import React, { useEffect, useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { crmStatisticsData as staticData } from '@/utils/fackData/crmStatisticsData'
import getIcon from '@/utils/getIcon'
import Link from 'next/link'

const SiteOverviewStatistics = () => {
    const [crmStatisticsData, setCrmStatisticsData] = useState(staticData)

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const token = localStorage.getItem('token')
                const company_id = localStorage.getItem('selected_company');
                                const response = await fetch(
                      `https://green-owl-255815.hostingersite.com/api/dashboard/counts?company_id=${company_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const res = await response.json()

                if (res?.status) {
                    const { gem, corporate } = res.counts

                    setCrmStatisticsData(prev =>
                        prev.map(item => {
                            switch (item.title) {
                                // 🔹 GOVERNMENT (GeM)
                                case 'Government Client':
                                    return { ...item, total_number: gem.clients }

                                case 'Government Employee':
                                    return { ...item, total_number: gem.designations }

                                // 🔹 CORPORATE
                                case 'Corporate Client':
                                    return { ...item, total_number: corporate.clients }

                                case 'Corporate Employee':
                                    return { ...item, total_number: corporate.designations }

                                // 🔹 TOTAL COUNTS
                                case 'Total Consign':
                                    return {
                                        ...item,
                                        total_number:
                                            gem.consignees + corporate.consignees,
                                    }

                                case 'Total Employee':
                                    return {
                                        ...item,
                                        total_number:
                                            gem.designations + corporate.designations,
                                    }

                                case 'Total Services':
                                    return {
                                        ...item,
                                        total_number:
                                            gem.services + corporate.services,
                                    }

                                // 🔹 TOTAL SALARY
                                case 'Total Salary':
                                    return {
                                        ...item,
                                        total_number:
                                            Number(gem.salary) +
                                            Number(corporate.salary),
                                    }

                                // 🔹 TOTAL WAGES (NEW)
                                case 'Total Wages':
                                    return {
                                        ...item,
                                        total_number:
                                            Number(gem.wagescount) +
                                            Number(corporate.wagescount),
                                    }

                                default:
                                    return item
                            }
                        })
                    )
                }
            } catch (error) {
                console.error('Dashboard API error:', error)
            }
        }

        fetchCounts()
    }, [])

    return (
        <>
            {crmStatisticsData.map(
                ({ id, title, total_number, icon, progress }) => (
                    <div key={id} className="col-xxl-3 col-md-6">
                        <div className="card stretch stretch-full short-info-card">
                            <div className="card-body">
                                <div className="d-flex align-items-start justify-content-between mb-4">
                                    <div className="d-flex gap-4 align-items-center">
                                        <div className="avatar-text avatar-lg bg-gray-200 icon">
                                            {getIcon(icon) &&
                                                React.cloneElement(getIcon(icon), {
                                                    size: 16,
                                                })}
                                        </div>
                                        <div>
                                            {/* ✅ ONLY BACKEND DATA */}
                                            <div className="fs-4 fw-bold text-dark">
                                                {total_number}
                                            </div>
                                            <h3 className="fs-13 fw-semibold text-truncate-1-line">
                                                {title}
                                            </h3>
                                        </div>
                                    </div>
                                    <Link href="#" className="lh-1">
                                        <FiMoreVertical className="fs-16" />
                                    </Link>
                                </div>

                                {/* Progress bar optional */}
                                <div className="progress mt-2 ht-3">
                                    <div
                                        className={`progress-bar progress-${id}`}
                                        role="progressbar"
                                        style={{ width: progress }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    )
}

export default SiteOverviewStatistics
