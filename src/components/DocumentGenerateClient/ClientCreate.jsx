import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectCreateContent from '@/components/ClientCreate/ClientCreateContent'
import ProjectCreateHeader from '@/components/ClientCreate/ClientCreateHeader'
export default function ClientCreate() {
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
