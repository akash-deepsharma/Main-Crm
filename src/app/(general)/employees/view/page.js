import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import EmployeeViewHeader from '@/components/EmployeeView/EmployeeViewHeader'
import ProjectViewTabItems from '@/components/EmployeeView/ClientViewTabItems'
import TabEmployeeOverview from '@/components/EmployeeView/TabEmployeeOverview'
import LeadsEmptyCard from '@/components/leadsViewCreate/LeadsEmptyCard'
import TabEmployeeAddress from '@/components/EmployeeView/TabEmployeeAddress'
import TabEmployeeBankFamily from '@/components/EmployeeView/TabEmployeeBankFamily'
import TabDownloadSheet from '@/components/EmployeeView/TabDownloadSheet'

const page = () => {
  return (
    <>
      <PageHeader>
        <EmployeeViewHeader />
      </PageHeader>
      <ProjectViewTabItems />
      <div className='main-content'>
        <div className='tab-content'>
          <TabEmployeeOverview />
          <div className="tab-pane fade" id="activityTab"><TabEmployeeBankFamily /></div>
          <div className="tab-pane fade" id="timesheetsTab"><TabEmployeeAddress /></div>
          <div className="tab-pane fade" id="discussionsTab"><TabDownloadSheet /></div>
        </div>
      </div>
    </>
  )
}

export default page