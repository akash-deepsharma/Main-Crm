import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectCreateContent from '@/components/ClientCreate/ClientCreateContent'
import ProjectCreateHeader from '@/components/ClientCreate/ClientCreateHeader'
// import { Suspense } from "react";
const page = () => {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
    <>
      <PageHeader>
        <ProjectCreateHeader />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <ProjectCreateContent />
        </div>
      </div>
    </>
// </Suspense>
  )
}

export default page