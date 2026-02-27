'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectCreateContent from '@/components/ClientEdit/ClientCreateContent'
import ProjectCreateHeader from '@/components/ClientEdit/ClientCreateHeader'

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

export default function ClientCreate() {
  const searchParams = useSearchParams();
  const client_id = searchParams.get('client_id');
  const type = searchParams.get('type');
  const [loading, setLoading] = useState(!!client_id);

  useEffect(() => {
    // Cleanup function - runs when page changes (component unmount)
    return () => {
      // Only remove if not in edit mode
      if (!client_id) {
        localStorage.removeItem("Client_details");
        localStorage.removeItem("Financial_Approval");
        localStorage.removeItem("Consignee");
        localStorage.removeItem("Client_Services");
        localStorage.removeItem("client_id");
      }
    };
  }, [client_id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only remove if not in edit mode
      if (!client_id) {
        localStorage.removeItem("Client_details");
        localStorage.removeItem("Financial_Approval");
        localStorage.removeItem("Consignee");
        localStorage.removeItem("Client_Services");
        localStorage.removeItem("client_id");
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [client_id]);

  // Fetch client data for edit mode
  useEffect(() => {
    if (!client_id) {
      setLoading(false);
      return;
    }

    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const compid = localStorage.getItem('selected_company');

        if (!token || !compid) {
          console.error('Missing token or company ID');
          setLoading(false);
          return;
        }

        const params = new URLSearchParams({
          company_id: compid,
          client_type: type || 'GeM',
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
        console.log("result foromasdasjdkcasdc", result)
        
        if (!result?.status) {
          console.error(result?.message || 'API Error');
          setLoading(false);
          return;
        }

        // Store client_id
        localStorage.setItem("client_id", client_id);

        // Populate all localStorage with API data
        populateLocalStorage(result.data);
        
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [client_id, type]);


  const populateLocalStorage = (data) => {
    // 1. Client Details (Step 1)
    const clientDetails = {
      formData: {
        client_type: data.client_type || "GeM",
        client_id: data.id || null,
        contract_no: data.contract_no || '',
        bid_no: data.bid_no || '',
        service_start_date: data.service_start_date || '',
        service_end_date: data.service_end_date || '',
        customer_name: data.customer_name || '',
        type: data.type || '',
        ministry: data.ministry || '',
        department: data.department || '',
        department_nickname: data.department_nickname || '',
        organisation_name: data.organisation_name || '',
        office_zone: data.office_zone || '',
        buyer_name: data.buyer_name || '',
        designation: data.designation || '',
        contact_no: data.contact_no || '',
        email: data.email || '',
        gstin: data.gstin || '',
        address: data.address || '',
        gst_percentage: data.gst_percentage || 18,
        apply_gst: Boolean(data.apply_gst),
        apply_cgst_sgst: Boolean(data.apply_cgst_sgst),
        onboard_date: data.onboard_date || '',
      },
      startDate: data.onboard_date || new Date().toISOString(),
    };
    localStorage.setItem("Client_details", JSON.stringify(clientDetails));

    // 2. Financial Approval (Step 2)
    if (data.financial_approval) {
      const financial = data.financial_approval;
      const Financial_Approval = {
        formData: {
          client_id: financial.client_id,
          ifd_concurrence: financial.ifd_concurrence || '',
          designation_admin_approval: financial.designation_admin_approval || '',
          designation_financial_approval: financial.designation_financial_approval || '',
          role: financial.role || '',
          payment_mode: financial.payment_mode || '',
          designation: financial.designation || '',
          email: financial.email || '',
          gstin: financial.gstin || '',
          address: financial.address || '',
        },
      };
      localStorage.setItem("Financial_Approval", JSON.stringify(Financial_Approval));
    }

    // 3. Consignees (Step 3)
    if (data.consignees && data.consignees.length > 0) {
      const consigneesData = {
        consignees: data.consignees.map((consignee, cIndex) => ({
          id: consignee.id || `existing-${cIndex}`,
          isNew: false, // Mark as existing
          items: (consignee.designations || []).map((d, dIndex) => ({
            id: d.id || `existing-${dIndex}`,
            isNew: false, // Mark as existing
            designation: d.name || '',
            experience: d.experience_in_years || '',
            qualification: d.qualification || '',
            skill: d.skill || '',
            resources: d.hire_employee || '',
          })),
          modalOpen: false,
          editingRowId: null,
          modalData: {
            designation: "",
            experience: "",
            qualification: "",
            skill: "",
            resources: "",
          },
          consignee_name: consignee.consignee_name || '',
          consigness_designation: consignee.consigness_designation || '',
          consignee_contact_no: consignee.consignee_contact_no || '',
          consignee_email: consignee.consignee_email || '',
          consignee_gstin: consignee.consignee_gstin || '',
          consignee_addess: consignee.consignee_addess || '',
          dealing_hand_name: consignee.dealing_hand_name || '',
          dealing_designation: consignee.dealing_designation || '',
          dealing_contact: consignee.dealing_contact || '',
          dealing_email: consignee.dealing_email || '',
        })),
      };
      localStorage.setItem("Consignee", JSON.stringify(consigneesData));
    }
    const client_addons = data?.client_addon?.total_contract_value
    // 4. Services (Step 4)
    if (data.services && data.services.length > 0) {
      // Get unique consignees for dropdown options
      const uniqueConsignees = {};
      data.services.forEach(service => {
        if (service.consignee && !uniqueConsignees[service.consignee.id]) {
          uniqueConsignees[service.consignee.id] = {
            label: service.consignee.consignee_name,
            value: service.consignee.id
          };
        }
      });

      const servicesData = {
        services: data.services.map(service => ({
          selectedConsignee: service.consignee ? {
            label: service.consignee.consignee_name,
            value: service.consignee_id
          } : null,
          selectedDesignation: {
            label: service.consignee?.designations?.find(d => d.id == service.designation_id)?.name || '',
            value: service.designation_id
          },
          selectedGender: service.gender ? {
            label: service.gender,
            value: service.gender
          } : null,
          selectedSkill: service.skill_category ? {
            label: service.skill_category,
            value: service.skill_category
          } : null,
          ageLimit: service.age_limit || '',
          id: service.id || '',
          educationalQualification: service.education_qualification || '',
          specializationPG: service.specialization_for_pg || '',
          postGraduation: service.post_graduation || '',
          typesOfFunction: service.type_of_function || '',
          yearsOfExperience: service.year_of_experience || '',
          specialization: service.specialization || '',
          district: service.district || '',
          zipcode: service.zip_code || '',
          dutyHours: service.duty_hours || '',
          dutyExtraHours: service.duty_extra_hours || '',
          minDailyWages: service.min_daily_wages || '',
          monthlySalary: service.monthly_salary || '',
          bonusInput: service.bonus || '',
          providentFund: service.provideant_fund || '',
          epfAdminCharge: service.epf_admin_charge || '',
          edli: service.edliPerDay || '',
          esi: service.esiPerDay || '',
          optionalAllowance1: service.optionAllowance1 || '',
          optionalAllowance2: service.optionAllowance2 || '',
          optionalAllowance3: service.optionAllowance3 || '',
          workingDays: service.no_of_working_day || '',
          tenureMonths: service.tenure_duration || '',
          hiredResources: service.number_of_hire_resource || '',
          serviceCharge: service.perecnt_service_charge || '',
          additionalRequirement: service.additional_requirement || '',
          totalWithoutAddons: service.total_without_addons || '',
          totalAddons: service.total_addons_value || '',
          totalWithAddons: service.total_with_addons || '',
          checkboxes: {
            bonus: Boolean(service.is_bonus_applicable),
            pf: Boolean(service.is_pf_applicable),
            epfAdmin: Boolean(service.is_epf_admin_charge_applicable),
            edli: Boolean(service.is_edli_applicable),
            esi: Boolean(service.is_esi_applicable),
            opt1: Boolean(service.is_optional_allowance_1_applicable),
            opt2: Boolean(service.is_optional_allowance_2_applicable),
            opt3: Boolean(service.is_optional_allowance_3_applicable),
          },
        })),
        totals: {
          totalContractValue: client_addons || '',
        },
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("Client_Services", JSON.stringify(servicesData));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading client data...</span>
        </div>
      </div>
    );
  }

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
  );
} 