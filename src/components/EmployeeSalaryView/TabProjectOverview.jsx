// 'use client'
// import React, { useEffect, useState } from 'react'
// import { FiCalendar, FiEye } from 'react-icons/fi'
// import AttandanceEmployeeTable from '../EmployeeSalaryList/AttandanceEmployeeTable'
// import MonthPicker from '../shared/MonthPicker'   // ✅ New component
// import { useSearchParams } from 'next/navigation'




// const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';
// const TabProjectOverview = () => {
//     const [toggleDateRange, setToggleDateRange] = useState(false)
//     const [selectedMonth, setSelectedMonth] = useState(new Date()) 



// const [token, setToken] = useState(null)
//   const [compid, setCompid] = useState(null)
//     const [tableData, setTableData] = useState([]);
  
//     const [loading, setLoading] = useState(false);
  

//   const searchParams = useSearchParams()
//   const type = searchParams.get('type')
//   const client_id = searchParams.get('client_id')
//   console.log("client id salery", client_id)

//   // get token & company id
//   useEffect(() => {
//     setToken(localStorage.getItem('token'))
//     setCompid(sessionStorage.getItem('selected_company'))
//   }, [])

//   useEffect(() => {
//      if (!token || !compid) return;
 
//      const fetchClients = async () => {
//        try {
//          setLoading(true);
 
//          const params = new URLSearchParams({
//            company_id: compid,
//            client_type: type,
//            client_id: client_id
//          });
 
//          const response = await fetch(
//            `${BASE_URL}/employee/salaries?${params.toString()}`,
//            {
//              headers: {
//                Authorization: `Bearer ${token}`,
//              },
//            }
//          );
 
//          const result = await response.json();
//          console.log(" salary view data", result)
 
//          if (!result?.status) {
//            console.error(result?.message || 'API Error');
//            return;
//          }
 
//          // ✅ Normalize API data for UI
//          const mappedData = result.data.salary.map((item) => ({
          
//            id: item.id,
 
//            project: {
//              title: item.contract_no,
//             //  description: item.customer_name,
//             //  img: '/images/project-placeholder.png',
//            },
           
 
//            customer: {
//              name: item.customer_name,
//              email: item.email,
//              img: null,
//            },
 
//            contact_no: item.contact_no,
//            email: item.email,
//            organisation_name: item.organisation_name,
//            ministry: item.ministry,
//            onboard_date: item.onboard_date,
//            service_start_date: item.service_start_date,
//            service_end_date: item.service_end_date,
 
//            status: {
//              status: [
//                { label: 'Active', value: 'active' },
//                { label: 'Inactive', value: 'inactive' },
//              ],
//              defaultSelect: { label: 'Active', value: 'active' },
//            },
 
//          }));
 
//          setTableData(mappedData);
//        } catch (error) {
//          console.error('Fetch error:', error);
//        } finally {
//          setLoading(false);
//        }
//      };
 
//      fetchClients();
//    }, [token, compid]);


//     return (
//         <div className="tab-pane fade active show" id="overviewTab">
//             <div className="row">
//                 <div className="col-lg-12">
//                     <div className="card stretch stretch-full">
//                         <div className="card-body task-header d-md-flex align-items-center justify-content-between">
//                             <div className="me-4">
//                                 <h4 className="mb-4 fw-bold d-flex">
//                                     <span className="text-truncate-1-line">
//                                         Client Name  || Customer Name  
//                                         {/* <span className="badge bg-soft-primary text-primary mx-3 fs-16">
//                                             Dec
//                                         </span> */}
//                                         <span className="badge bg-soft-primary text-primary mx-3 fs-16">
//                                             {selectedMonth.toLocaleString("en-US", { month: "short", year: "numeric" })}
//                                         </span>
//                                     </span>
//                                 </h4>

//                                 <div className="d-flex align-items-center mb-2">
//                                     <div className="img-group lh-0 justify-content-start">
//                                         <span className="d-none d-sm-flex">
//                                             <h6 className="fs-16 text-muted text-truncate-1-line mb-0">
//                                                 <b>Phone :-</b> 9876543210
//                                             </h6>
//                                         </span>
//                                     </div>
//                                     <span className="vr mx-3 text-muted" />
//                                     <div className="img-group lh-0 ms-2 justify-content-start">
//                                         <span className="d-none d-sm-flex">
//                                             <h6 className="fs-16 text-muted text-truncate-1-line mb-0">
//                                                 <b>Email :-</b> asdf@gmail.com
//                                             </h6>
//                                             <span className="badge bg-soft-success text-dark mx-3">
//                                                 4 Employee
//                                             </span>
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* -------- Right Side Buttons -------- */}
//                             <div className="mt-4 mt-md-0">
//                                 <div className="d-flex gap-2">
//                                     <div
//                                         className="position-relative "
//                                         onClick={() => setToggleDateRange(!toggleDateRange)}
//                                     >
//                                         <MonthPicker
//                                             selectedMonth={selectedMonth}
//                                             setSelectedMonth={setSelectedMonth}
//                                             toggleDateRange={toggleDateRange}
//                                         />
//                                     </div>

//                                     <a href="#" className="btn btn-success">
//                                         <FiEye size={16} className='me-2' />
//                                         <span>View Attached Doc</span>
//                                     </a>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-xl-12">
//                     <AttandanceEmployeeTable />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default TabProjectOverview































































































'use client'
import React, { useEffect, useState } from 'react'
import { FiCalendar, FiEye } from 'react-icons/fi'
import AttandanceEmployeeTable from '../EmployeeSalaryList/AttandanceEmployeeTable'
import MonthPicker from '../shared/MonthPicker'
import { useSearchParams } from 'next/navigation'

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const TabProjectOverview = () => {
    const [toggleDateRange, setToggleDateRange] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [token, setToken] = useState(null)
    const [compid, setCompid] = useState(null)
    const [clientData, setClientData] = useState(null)
    const [salaryData, setSalaryData] = useState([])
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const client_id = searchParams.get('client_id')
    
    // Get token & company id
    useEffect(() => {
        setToken(localStorage.getItem('token'))
        setCompid(sessionStorage.getItem('selected_company'))
    }, [])

    useEffect(() => {
        if (!token || !compid || !client_id) return;

        const fetchClientSalaries = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams({
                    company_id: compid,
                    client_type: type,
                    client_id: client_id
                });

                const response = await fetch(
                    `${BASE_URL}/employee/salaries?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();
                console.log("Salary view data", result)

                if (!result?.status) {
                    console.error(result?.message || 'API Error');
                    return;
                }

                // Set client data and salary data
                if (result.data?.client) {
                    setClientData(result.data.client);
                }

                if (result.data?.salary) {
                    setSalaryData(result.data.salary);
                    
                    // If there's salary data, set the selected month based on the first salary entry
                    if (result.data.salary.length > 0) {
                        const firstSalary = result.data.salary[0];
                        const monthIndex = new Date(`${firstSalary.month} 1, ${firstSalary.year}`).getMonth();
                        const year = firstSalary.year;
                        setSelectedMonth(new Date(year, monthIndex));
                    }
                }

            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientSalaries();
    }, [token, compid, client_id, type]);

    // Format date to display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    // Calculate total employees
    const totalEmployees = salaryData.length;

    // Get contact info from the first employee or client data
    const getContactInfo = () => {
        if (clientData) {
            return {
                phone: '9876543210', // Replace with actual client phone from API if available
                email: 'asdf@gmail.com', // Replace with actual client email from API if available
                clientName: clientData.contract_no || 'Client Name'
            }
        }
        return {
            phone: '9876543210',
            email: 'asdf@gmail.com',
            clientName: 'Client Name'
        }
    }

    const contactInfo = getContactInfo();

    return (
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body task-header d-md-flex align-items-center justify-content-between">
                            <div className="me-4">
                                <h4 className="mb-4 fw-bold d-flex">
                                    <span className="text-truncate-1-line">
                                        {contactInfo.clientName}
                                        <span className="badge bg-soft-primary text-primary mx-3 fs-16">
                                            {selectedMonth.toLocaleString("en-US", { month: "short", year: "numeric" })}
                                        </span>
                                    </span>
                                </h4>

                                {clientData?.service_title && (
                                    <p className="text-muted mb-2">
                                        <b>Service:</b> {clientData.service_title}
                                    </p>
                                )}

                                <div className="d-flex align-items-center mb-2">
                                    <div className="img-group lh-0 justify-content-start">
                                        <span className="d-none d-sm-flex">
                                            <h6 className="fs-16 text-muted text-truncate-1-line mb-0">
                                                <b>Phone :-</b> {contactInfo.phone}
                                            </h6>
                                        </span>
                                    </div>
                                    <span className="vr mx-3 text-muted" />
                                    <div className="img-group lh-0 ms-2 justify-content-start">
                                        <span className="d-none d-sm-flex">
                                            <h6 className="fs-16 text-muted text-truncate-1-line mb-0">
                                                <b>Email :-</b> {contactInfo.email}
                                            </h6>
                                            <span className="badge bg-soft-success text-dark mx-3">
                                                {totalEmployees} Employee{totalEmployees !== 1 ? 's' : ''}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* -------- Right Side Buttons -------- */}
                            <div className="mt-4 mt-md-0">
                                <div className="d-flex gap-2">
                                    <div
                                        className="position-relative"
                                        onClick={() => setToggleDateRange(!toggleDateRange)}
                                    >
                                        <MonthPicker
                                            selectedMonth={selectedMonth}
                                            setSelectedMonth={setSelectedMonth}
                                            toggleDateRange={toggleDateRange}
                                        />
                                    </div>

                                    <a href="#" className="btn btn-success">
                                        <FiEye size={16} className='me-2' />
                                        <span>View Attached Doc</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : salaryData.length > 0 ? (
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Employee ID</th>
                                                <th>Employee Name</th>
                                                <th>Month</th>
                                                <th>Present Days</th>
                                                <th>Basic Salary</th>
                                                <th>Gross Salary</th>
                                                <th>EPF</th>
                                                <th>ESI</th>
                                                <th>Bonus</th>
                                                <th>EP Epfo</th>
                                                <th>EP Esi</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {salaryData.map((salary) => (
                                                <tr key={salary.id}>
                                                    <td>{salary.employee?.rand_id || 'N/A'}</td>
                                                    <td>{salary.employee?.name || 'N/A'}</td>
                                                    <td>{salary.month} {salary.year}</td>
                                                    <td>{salary.present_days}</td>
                                                    <td>₹{Number(salary.basic_salary).toLocaleString('en-IN')}</td>
                                                    <td>₹{Number(salary.gross_salary).toLocaleString('en-IN')}</td>
                                                    <td>₹{Number(salary.epf).toLocaleString('en-IN')}</td>
                                                    <td>₹{Number(salary.esi).toLocaleString('en-IN')}</td>
                                                    <td>₹{Number(salary.bonus).toLocaleString('en-IN')}</td>
                                                    <td>₹{Number(salary.employee_epfo).toLocaleString('en-IN')}</td>
                                                    <td>₹{Number(salary.employee_esi).toLocaleString('en-IN')}</td>
                                                    <td>
                                                        <span className={`badge bg-soft-${salary.status === 'processing' ? 'warning' : 'success'} text-${salary.status === 'processing' ? 'warning' : 'success'}`}>
                                                            {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-muted">No salary data found for this client.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TabProjectOverview
