import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ClientViewHeader from '@/components/EmployeeComplianceView/ClientViewHeader'
import TabArrerOverview from '@/components/EmployeeComplianceView/TabArrerOverview'

const page = () => {
  return (
    <>
      <PageHeader>
        <ClientViewHeader />
      </PageHeader>
      {/* <ClientViewTabItems /> */}
      <div className='main-content'>
        <div className='tab-content'>
          <TabArrerOverview />
        </div>
      </div>
    </>
  )
}

export default page