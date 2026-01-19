"use client"
import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import ProjectCreateContent from '@/components/projectsCreate/ProjectCreateContent'
import ProjectCreateHeader from '@/components/ClientCreate/ClientCreateHeader'
import dynamic from 'next/dynamic'
// import ProjectCreateContent from '@/components/ComplianceCreate/ProjectCreateContent'


const ProjectCreateContent = dynamic(
  () => import('@/components/ComplianceCreate/ProjectCreateContent'),
  { ssr: false }
)
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