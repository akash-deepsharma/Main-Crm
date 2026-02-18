"use client"
import React, { Suspense } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import EmployeeCreateHeader from '@/components/employeeCreate/EmployeeCreateHeader'
import UploadDocument from '@/components/uploadDocument/uploadDocument'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <>
      <PageHeader>
        <EmployeeCreateHeader />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <UploadDocument/>
        </div>
      </div>
    </>
    </Suspense>
  )
}

export default page