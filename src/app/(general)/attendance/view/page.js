import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectViewHeader from '@/components/ClientView/ClientViewHeader'
import ProjectViewTabItems from '@/components/ClientView/ClientViewTabItems'
// import TabProjectOverview from '@/components/ClientView/TabProjectOverview'
import LeadsEmptyCard from '@/components/leadsViewCreate/LeadsEmptyCard'
import TabProjectConsignee from '@/components/ClientView/TabClientConsignee'
import TabClientServices from '@/components/ClientView/TabClientServices'
import TabWagesSheet from '@/components/ClientView/TabWagesSheet'
import TabDownloadSheet from '@/components/ClientView/TabDownloadSheet'
import ClientViewHeader from '@/components/ClientView/ClientViewHeader'
import ClientViewTabItems from '@/components/ClientView/ClientViewTabItems'
import TabProjectOverview from '@/components/EmployeeAttandanceView/TabProjectOverview'

const page = () => {
  return (
    <>
      <PageHeader>
        <ClientViewHeader />
      </PageHeader>
      {/* <ClientViewTabItems /> */}
      <div className='main-content'>
        <div className='tab-content'>
          <TabProjectOverview />
        </div>
      </div>
    </>
  )
}

export default page