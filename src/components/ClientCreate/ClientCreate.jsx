'use client'
import React, { useEffect } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectCreateContent from '@/components/ClientCreate/ClientCreateContent'
import ProjectCreateHeader from '@/components/ClientCreate/ClientCreateHeader'

export default function ClientCreate() {

  useEffect(() => {
    // Cleanup function - runs when page changes (component unmount)
    return () => {
      localStorage.removeItem("Client_details");
      localStorage.removeItem("Financial_Approval");
      localStorage.removeItem("Consignee");
      localStorage.removeItem("Client_Services");
      localStorage.removeItem("client_id");
    };
  }, []);
  useEffect(() => {
    const handleBeforeUnload = () => {
        // Refresh या tab close पर clear होगा
        localStorage.removeItem("Client_details");
        localStorage.removeItem("Financial_Approval");
        localStorage.removeItem("Consignee");
        localStorage.removeItem("Client_Services");
         localStorage.removeItem("client_id");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, []);

  return (
    <>
      <PageHeader>
        <ProjectCreateHeader />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <ProjectCreateContent />
        </div>
      </div>
    </>
  )
}