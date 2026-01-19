"use client"
import React, { Suspense } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import EmployeeCreateContent from '@/components/employeeCreate/employeeCreateContent'
import EmployeeCreateHeader from '@/components/employeeCreate/EmployeeCreateHeader'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <>
      <PageHeader>
        <EmployeeCreateHeader />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <EmployeeCreateContent />
        </div>
      </div>

    </>
    </Suspense>
  )
}

export default page