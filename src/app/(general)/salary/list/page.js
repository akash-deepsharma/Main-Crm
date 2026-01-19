"use client"
import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import ProjectsListHeader from '@/components/projectsList/ProjectsListHeader'
// import ProjectTable from '@/components/SalaryList/ProjectTable'
import ProjectsListHeader from '@/components/SalaryList/ProjectsListHeader'
import dynamic from 'next/dynamic'

const ProjectTable = dynamic(
  () => import('@/components/components/SalaryList/ProjectTable'),
  { ssr: false }
)

const page = () => {
    return (
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
    )
}

export default page