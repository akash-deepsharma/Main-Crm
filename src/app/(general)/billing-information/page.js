import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import BillingInfo from '@/components/BillingInfo/BillingInfo'

const page = () => {
  return (
    <>
      <PageHeader>
        {/* <PaymentHeader /> */}
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          {/* <PaymentTable /> */}
          <BillingInfo />
        </div>
      </div>
    </>
  )
}

export default page