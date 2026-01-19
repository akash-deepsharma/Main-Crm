"use client"
import React, { Suspense } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/ClientList/ClientListHeader'
import dynamic from 'next/dynamic'
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
                    <ProjectTable />
                </div>
            </div>
        </>
        </Suspense>
    )
}

export default page