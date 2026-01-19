'use client'
import React, { Suspense } from 'react'
import EmployeeView from '@/components/EmployeeView/EmployeeView'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <EmployeeView/>
    </Suspense>
  )
}

export default page