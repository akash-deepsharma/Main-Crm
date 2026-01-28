import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import ProjectCreateContent from '@/components/projectsCreate/ProjectCreateContent'
import ProjectCreateHeader from '@/components/MaterialCreate/ClientCreateHeader'
import ProjectCreateContent from '@/components/MaterialCreate/ProjectCreateContent'

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