"use client"
import React,{ useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectViewHeader from '@/components/ClientView/ClientViewHeader'
import ProjectViewTabItems from '@/components/ClientView/ClientViewTabItems'
import TabProjectOverview from '@/components/ClientView/TabClientOverview'
import LeadsEmptyCard from '@/components/leadsViewCreate/LeadsEmptyCard'
import TabProjectConsignee from '@/components/ClientView/TabClientConsignee'
import TabClientServices from '@/components/ClientView/TabClientServices'
import TabFinancialSheet from '@/components/ClientView/TabFinancialSheet'
import TabWagesSheet from '@/components/ClientView/TabWagesSheet'
import TabDownloadSheet from '@/components/ClientView/TabDownloadSheet'
import ClientViewHeader from '@/components/ClientView/ClientViewHeader'
import ClientViewTabItems from '@/components/ClientView/ClientViewTabItems'
import { useSearchParams } from 'next/navigation';



const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';
export default function ClientView() {
    
 const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [wagesData, setWagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("first table data", tableData);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setCompid(localStorage.getItem('selected_company'));
  }, []);

  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const client_id = searchParams.get('client_id');

  useEffect(() => {
    if (!token || !compid) return;

    const fetchClients = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          company_id: compid,
          client_type: type,
          client_id: client_id,
        });

        const response = await fetch(
          `${BASE_URL}/client/view?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("client view api data", result)

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



  useEffect(() => {
    if (!token || !compid) return;

    const fetchwagesData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          company_id: compid,
          client_type: type,
          client_id: client_id,
        });

        const response = await fetch(
          `${BASE_URL}/client/wages?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("client view wages api data", result)

        if (!result?.status) {
          console.error(result?.message || 'API Error');
          return;
        }

     

        setWagesData(result);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchwagesData();
  }, [token, compid]);
  
  const consigneeData = tableData.data?.consignees
  const servicesData = tableData.data?.services
  const financialData = tableData.data?.financial_approval
  return (
      <>
      <PageHeader>
        <ClientViewHeader />
      </PageHeader>
      <ClientViewTabItems />
      <div className='main-content'>
        <div className='tab-content'>
          <TabProjectOverview data={tableData}/>
          <div className="tab-pane fade" id="financialTab"><TabFinancialSheet data={financialData} /></div>
          <div className="tab-pane fade" id="activityTab"><TabProjectConsignee  data={consigneeData}/></div>
          <div className="tab-pane fade" id="timesheetsTab"><TabClientServices data={servicesData} /></div>
          <div className="tab-pane fade" id="milestonesTab"><TabWagesSheet data={wagesData}/></div>
          <div className="tab-pane fade" id="discussionsTab"><TabDownloadSheet data={tableData}/></div>
          {/* <div className="tab-pane fade" id="discussionsTab"><LeadsEmptyCard title="No discussions yet!" description="There is no discussions on this project" /></div> */}
        </div>
      </div>
    </>
  )
}
