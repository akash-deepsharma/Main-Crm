"use client"
import React, { Suspense } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import ProjectsListHeader from '@/components/employeeList/employeeListHeader'
import dynamic from 'next/dynamic'
import ProjectsListHeader from '@/components/EmployeeSalaryList/ProjectsListHeader'
import EmployeeData from '@/components/common/employeeData'
// import ProjectTable from '@/components/employeeList/ProjectTable'
const ProjectTable = dynamic(
  () => import('@/components/employeeList/ProjectTable'),
  { ssr: false }
)
const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>

        <>
            <PageHeader>
                <ProjectsListHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <EmployeeData/>
                    <ProjectTable />
                </div>
            </div>
        </>
        </Suspense>
    )
}

export default page