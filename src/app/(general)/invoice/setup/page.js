import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ClientViewHeader from '@/components/ClientView/ClientViewHeader'
import TabProjectOverview from '@/components/Invoice/TabProjectOverview'

const page = () => {
  return (
    <>
      <PageHeader>
        <ClientViewHeader />
      </PageHeader>
      <div className='main-content'>
        <div className='tab-content'>
          <TabProjectOverview  />
        </div>
      </div>
    </>
  )
}

export default page