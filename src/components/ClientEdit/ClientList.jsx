'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import ProjectsListHeader from '@/components/ClientList/ClientListHeader';
import ProjectTable from '@/components/ClientList/ClientTable';
import ClientData from '../common/clientData';

export default function ClientList() {
  const [filters, setFilters] = useState({});

  const handleFilterApply = (filterValues) => {
    console.log("Applying filters:", filterValues);
    setFilters(filterValues);
  };

  const handleFilterReset = () => {
    console.log("Resetting filters");
    setFilters({});
  };

  return (
    <>
      <PageHeader>
        <ProjectsListHeader 
          onFilterApply={handleFilterApply}
          onFilterReset={handleFilterReset}
        />
      </PageHeader>
      
      <ClientData />
      
      <div className='main-content'>
        <div className='row'>
          <ProjectTable filters={filters} />
        </div> 
      </div>
    </>
  );
}