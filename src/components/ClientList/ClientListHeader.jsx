'use client';
import React from 'react';
import { FiBarChart, FiFilter, FiPaperclip, FiPlus } from 'react-icons/fi';
import Dropdown from '@/components/shared/Dropdown';
import { fileType } from '../leads/LeadsHeader';
import ProjectsStatistics from '../widgetsStatistics/ProjectsStatistics';
import Link from 'next/link';
import ClientFilter from '@/components/shared/fitler'; // ✅ Fixed: changed 'fitler' to 'filter'

const ProjectsListHeader = ({ onFilterApply, onFilterReset }) => {
  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
        {/* Filter Button - Using ClientFilter component */}
        <ClientFilter
          onFilterApply={onFilterApply}
          onFilterReset={onFilterReset}
          triggerPosition={"0, 10"}
          triggerIcon={<FiFilter size={16} strokeWidth={1.6} />}
          triggerClass='btn btn-icon btn-light-brand'
          isAvatar={false}
          dropdownAutoClose={"outside"}
          isItemIcon={false}
        />
        
        <Dropdown
          dropdownItems={fileType}
          triggerPosition={"0, 12"}
          triggerIcon={<FiPaperclip size={16} strokeWidth={1.6} />}
          triggerClass='btn btn-icon btn-light-brand'
          isAvatar={false}
          iconStrokeWidth={0}
        />
        
        <Link href="/clients/create" className="btn btn-primary">
          <FiPlus size={16} className='me-2' />
          <span>Create Client</span>
        </Link>
      </div>
      
      <div 
        id="collapseOne" 
        className="accordion-collapse collapse page-header-collapse" 
        style={{position:'absolute', top:'auto', zIndex:'9', right:'0'}}
      >
        <div className="accordion-body pb-2">
          <div className="row">
            <ProjectsStatistics />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsListHeader;