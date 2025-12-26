import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import ProjectsListHeader from '@/components/projectsList/ProjectsListHeader'
import ProjectTable from '@/components/SalaryList/ProjectTable'
import ProjectsListHeader from '@/components/SalaryList/ProjectsListHeader'

const page = () => {
    return (
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
    )
}

export default page