"use client"
// import ClientList from '@/components/ClientCreate/ClientList'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const ClientList = dynamic(
  () => import('@/components/ClientCreate/ClientList'),
  { ssr: false }
)
const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClientList />
        </Suspense>
    )
}

export default page