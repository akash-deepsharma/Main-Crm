import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectCreateHeader from '@/components/ClientCreate/ClientCreateHeader'
import ProjectCreateContent from '@/components/Invoice/ProjectCreateContent'

const page = () => {
  return (
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
  )
}

export default page