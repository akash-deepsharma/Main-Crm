"use client"
import CoverLetter from '@/components/CoverLetter/CoverLetter'
import IobToIob from '@/components/CoverLetter/IobToIob'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React from 'react'

const page = () => {
  return (
    <>
    <PageHeader>
        {/* <ClientViewHeader/>      */}
      </PageHeader>
        <CoverLetter/>
        <IobToIob/>
    </>
  )
}

export default page