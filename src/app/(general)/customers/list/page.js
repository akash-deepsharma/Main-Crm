"use client"
import CustomersHeader from '@/components/customers/CustomersHeader'
// import CustomersTable from '@/components/customers/CustomersTable'
import Footer from '@/components/shared/Footer'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import dynamic from 'next/dynamic'
import React from 'react'

const CustomersTable = dynamic(
  () => import('@/components/customers/CustomersTable'),
  { ssr: false }
)

const page = () => {
    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <CustomersTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page