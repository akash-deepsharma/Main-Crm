import React from 'react'
import { Suspense } from "react";
import ClientCreate from '@/components/ClientEdit/ClientCreate';
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCreate/> 
    </Suspense>
  )
}

export default page