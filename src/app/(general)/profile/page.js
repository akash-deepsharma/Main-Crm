import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProfileCreate from '@/components/Profile/ProfileCreate'

const page = () => {
  return (
    <>
      <PageHeader>
        {/* <PaymentHeader /> */}
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          {/* <PaymentTable /> */}
          <ProfileCreate />
        </div>
      </div>
    </>
  )
}

export default page