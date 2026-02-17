import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/ClientList/ClientListHeader'
import ProjectTable from '@/components/ClientList/ClientTable'
import ClientData from '../common/clientData'

export default function ClientList() {
  return (
    <>
            <PageHeader>
                <ProjectsListHeader />
            </PageHeader>
             <ClientData/>
            <div className='main-content'>
                <div className='row'>
                    <ProjectTable />
                </div> 
            </div>
        </>
  )
}
