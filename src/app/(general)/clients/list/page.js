import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/ClientList/ClientListHeader'
import ProjectTable from '@/components/ClientList/ClientTable'

const page = () => {
    return (
        // <Suspense fallback={<div>Loading...</div>}>
        <>
            <PageHeader>
                <ProjectsListHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ProjectTable />
                </div>
            </div>
        </>
        // </Suspense>
    )
}

export default page