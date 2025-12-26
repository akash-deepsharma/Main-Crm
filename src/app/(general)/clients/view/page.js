import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectViewHeader from '@/components/ClientView/ClientViewHeader'
import ProjectViewTabItems from '@/components/ClientView/ClientViewTabItems'
import TabProjectOverview from '@/components/ClientView/TabClientOverview'
import LeadsEmptyCard from '@/components/leadsViewCreate/LeadsEmptyCard'
import TabProjectConsignee from '@/components/ClientView/TabClientConsignee'
import TabClientServices from '@/components/ClientView/TabClientServices'
import TabWagesSheet from '@/components/ClientView/TabWagesSheet'
import TabDownloadSheet from '@/components/ClientView/TabDownloadSheet'
import ClientViewHeader from '@/components/ClientView/ClientViewHeader'
import ClientViewTabItems from '@/components/ClientView/ClientViewTabItems'

const page = () => {
  return (
    <>
      <PageHeader>
        <ClientViewHeader />
      </PageHeader>
      <ClientViewTabItems />
      <div className='main-content'>
        <div className='tab-content'>
          <TabProjectOverview />
          <div className="tab-pane fade" id="activityTab"><TabProjectConsignee /></div>
          <div className="tab-pane fade" id="timesheetsTab"><TabClientServices /></div>
          <div className="tab-pane fade" id="milestonesTab"><TabWagesSheet /></div>
          <div className="tab-pane fade" id="discussionsTab"><TabDownloadSheet /></div>
          {/* <div className="tab-pane fade" id="discussionsTab"><LeadsEmptyCard title="No discussions yet!" description="There is no discussions on this project" /></div> */}
        </div>
      </div>
    </>
  )
}

export default page