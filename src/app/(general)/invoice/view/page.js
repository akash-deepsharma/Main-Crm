"use client"
import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PaymentHeader from '@/components/payment/PaymentHeader'
import dynamic from 'next/dynamic'
// import InvoiceView from '@/components/Invoice/InvoiceView'
const InvoiceView = dynamic(
  () => import('@/components/Invoice/InvoiceView'),
  { ssr: false }
)

const page = () => {
  return (
    <>
      <PageHeader>
        <PaymentHeader />
      </PageHeader>
      <div className='main-content container-lg'>
        <div className='row'>
          {/* <PaymentTable /> */}
          <InvoiceView />
        </div>
      </div>
    </>
  )
}

export default page