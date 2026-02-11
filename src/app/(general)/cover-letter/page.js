"use client"
import CoverLetter from '@/components/CoverLetter/CoverLetter'
import IciciBankFormate from '@/components/CoverLetter/IciciBankFormate'
import IdfcBankFormate from '@/components/CoverLetter/IdfcBankFormate'
import IobToIob from '@/components/CoverLetter/IobToIob'
import IobToOthers from '@/components/CoverLetter/IobToOthers'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React from 'react'

const page = () => {
  return (
    <>
    <PageHeader>
        {/* <ClientViewHeader/>      */}
      </PageHeader>
       <div className="main-content">
                <div className="row">
        <CoverLetter/>
        <IobToIob/>
        <IdfcBankFormate/>
        <IobToOthers/>
        <IciciBankFormate/>
        </div>
        </div>
    </>
  )
}

export default page