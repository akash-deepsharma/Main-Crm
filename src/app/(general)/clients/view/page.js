"use client"
import React, { Suspense } from 'react'
import ClientView from '@/components/ClientCreate/ClientView'
const page = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>

    <ClientView />
    </Suspense>
  )
}

export default page