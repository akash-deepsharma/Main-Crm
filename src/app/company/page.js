import React from 'react'
import TotalCompany from '@/components/widgetsMiscellaneous/TotalCompany'
import ProjectAssingeMiscellaneous from '@/components/widgetsMiscellaneous/CompanyMiscellaneous'

const page = () => {
    return (
        <>
            <div className='page-header-container h-100 my-5'>
            <div className='main-content h-100 m-auto d-flex flex-column align-items-center justify-content-center px-5'>
                <div className='row align-items-center'>
                    <TotalCompany />                    
                </div>
            </div>
            </div>
        </>
    )
}

export default page