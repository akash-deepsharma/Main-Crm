'use client'
import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import EmployeeViewHeader from '@/components/EmployeeView/EmployeeViewHeader'
import ProjectViewTabItems from '@/components/EmployeeView/ClientViewTabItems'
import TabEmployeeOverview from '@/components/EmployeeView/TabEmployeeOverview'
import LeadsEmptyCard from '@/components/leadsViewCreate/LeadsEmptyCard'
import TabEmployeeAddress from '@/components/EmployeeView/TabEmployeeAddress'
import TabEmployeeBankFamily from '@/components/EmployeeView/TabEmployeeBankFamily'
import TabDownloadSheet from '@/components/EmployeeView/TabDownloadSheet'
import { useSearchParams } from 'next/navigation'

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';


const page = () => {

 const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("first table data ", tableData);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setCompid(sessionStorage.getItem('selected_company'));
  }, []);

  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const employee_id = searchParams.get('employee_id');

  useEffect(() => {
    if (!token || !compid) return;

    const fetchClients = async () => {
      try {
        setLoading(true);

        // const params = new URLSearchParams({
        //   employee_id: employee_id,
        // });

        const response = await fetch(
          `${BASE_URL}/employee/view/${employee_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("emoloyee view api data", result)

        if (!result?.status) {
          console.error(result?.message || 'API Error');
          return;
        }

     

        setTableData(result);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token, compid]);



  return (
    <>
      <PageHeader>
        <EmployeeViewHeader />
      </PageHeader>
      <ProjectViewTabItems />
      <div className='main-content'>
        <div className='tab-content'>
          <TabEmployeeOverview data={tableData.data} />
          <div className="tab-pane fade" id="activityTab"><TabEmployeeBankFamily data={tableData.data}/></div>
          <div className="tab-pane fade" id="timesheetsTab"><TabEmployeeAddress data={tableData.data} /></div>
          <div className="tab-pane fade" id="discussionsTab"><TabDownloadSheet data={tableData.data}/></div>
        </div>
      </div>
    </>
  )
}

export default page