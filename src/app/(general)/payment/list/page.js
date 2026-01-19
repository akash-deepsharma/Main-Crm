"use client"
import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import PaymentTable from '@/components/payment/PaymentTable'
import PaymentHeader from '@/components/payment/PaymentHeader'
import Footer from '@/components/shared/Footer'
import dynamic from 'next/dynamic'
const PaymentTable = dynamic(
  () => import('@/components/payment/PaymentTable'),
  { ssr: false }
)
const page = () => {
    return (
        <>
            <PageHeader>
                <PaymentHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <PaymentTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page