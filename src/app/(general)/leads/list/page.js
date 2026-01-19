"use client"
import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import LeadsHeader from '@/components/leads/LeadsHeader'
// import LeadssTable from '@/components/leads/LeadsTable'
import Footer from '@/components/shared/Footer'
import dynamic from 'next/dynamic'
const LeadssTable = dynamic(
  () => import('@/components/leads/LeadsTable'),
  { ssr: false }
)
const page = () => {
    return (
        <>
            <PageHeader>
                <LeadsHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <LeadssTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page