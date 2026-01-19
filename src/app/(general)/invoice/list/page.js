"use client"
import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/ClientList/ClientListHeader'
import dynamic from 'next/dynamic'
// import ProjectTable from '@/components/ClientInvoiceList/ProjectTable'
const ProjectTable = dynamic(
  () => import('@/components/ClientInvoiceList/ProjectTable'),
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