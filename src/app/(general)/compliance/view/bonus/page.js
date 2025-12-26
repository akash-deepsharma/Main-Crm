import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PaymentHeader from '@/components/payment/PaymentHeader'
import InvoiceBonusView from '@/components/Invoice/InvoiceBonusView'

const page = () => {
  return (
    <>
      <PageHeader>
        <PaymentHeader />
      </PageHeader>
      <div className='main-content container-lg'>
        <div className='row'>
            <InvoiceBonusView />
        </div>
      </div>
    </>
  )
}

export default page