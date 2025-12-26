import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ClientViewHeader from '@/components/EmployeeComplianceView/ClientViewHeader'
import TabBonusOverview from '@/components/EmployeeComplianceView/TabBonusOverview'

const page = () => {
  return (
    <>
      <PageHeader>
        <ClientViewHeader />
      </PageHeader>
      {/* <ClientViewTabItems /> */}
      <div className='main-content'>
        <div className='tab-content'>
          <TabBonusOverview />
        </div>
      </div>
    </>
  ) 
}

export default page