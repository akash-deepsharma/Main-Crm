"use client"
import React from 'react'
// import ProposalTable from '@/components/proposal/ProposalTable'
import ProposalHeadr from '@/components/proposal/ProposalHeadr'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProposalHeaderContent from '@/components/proposal/ProposalHeaderContent'
import Footer from '@/components/shared/Footer'
import dynamic from 'next/dynamic'

const ProposalTable = dynamic(
  () => import('@/components/proposal/ProposalTable'),
  { ssr: false }
)

const page = () => {
    return (
        <>
            <PageHeader>
                <ProposalHeadr />
            </PageHeader>
            <ProposalHeaderContent />
                <div className='main-content'>
                    <div className='row'>
                        <ProposalTable />
                    </div>
                </div>
            <Footer />
        </>
    )
}

export default page