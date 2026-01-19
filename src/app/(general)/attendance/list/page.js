// import React from 'react'
// import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import ProjectTable from '@/components/ClientAttendanceList/ProjectTable'
// import ProjectsListHeader from '@/components/ClientList/ClientListHeader'

// const page = () => {
//     return (
//         <>
//             <PageHeader>
//                 <ProjectsListHeader />
//             </PageHeader>
//             <div className='main-content'>
//                 <div className='row'>
//                     <ProjectTable />
//                 </div>
//             </div>
//         </>
//     )
// }

// export default page



"use client";

import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/ClientList/ClientListHeader'
import dynamic from 'next/dynamic'

const ProjectTable = dynamic(
  () => import('@/components/ClientAttendanceList/ProjectTable'),
  { ssr: false }
)

const Page = () => {
    return (
        <>
            <PageHeader>
                <ProjectsListHeader />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <ProjectTable />
                </div>
            </div>
        </>
    )
}

export default Page
