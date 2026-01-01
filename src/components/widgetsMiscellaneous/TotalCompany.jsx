"use client"
import CircleProgress from "@/components/shared/CircleProgress"
// import ProjectAssingeMiscellaneous from "./CompanyMiscellaneous"
import CreateCompanyModal from "../common/CreateCompanyModal"
import CompanyMiscellaneous from "./CompanyMiscellaneous"
import { useEffect, useState } from "react"
const projectData = [
  { project_name: "Apps Developemnt Company", progress: "40", progress_color: "#ea4d4d", deadiline: "20 days left" },
  { project_name: "NFT Developemnt Company", progress: "85", progress_color: "#3454d1", deadiline: "18 days left" },
  { project_name: "Mobile Apps Company", progress: "50", progress_color: "#ffa21d", deadiline: "16 days left" },
]

const TotalCompany = () => {
    // console.log('sd');
    const [projectData2, setProjectData] = useState([])
    const [loading, setLoading ] = useState([])

    const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token")
      // const token = "63|qkN7z5q20cK2t4VcewzDDDgYUvdFgT6Qd6IyfVke16a7f469";
      console.log('this is my token here', token);
      const res = await fetch(
        "https://green-owl-255815.hostingersite.com/api/company/view",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
    
      // console.log('what happend',res.json());
    
    
      const result = await res.json()
      console.log("API DATA ", result)
    
      setProjectData(result)
    } catch (error) {
      console.error("API Error:", error)
    } finally {
      setLoading(false)
    }
    }
console.log("this is jaskdakskasdj",projectData2);


  // ✅ API CALL HERE
  useEffect(() => {
    fetchProjects()
  }, [])
    

  const [selectedCard, setSelectedCard] = useState(null)

  // ✅ Modal state
  const [showCompanyModal, setShowCompanyModal] = useState(false)

  
  // ✅ Open modal
  const openCompanyModal = () => {
    setShowCompanyModal(true)
  }

  // ✅ Close modal
  const closeCompanyModal = () => {
    setShowCompanyModal(false)
  }

  // ✅ Optional verify handler
  const handleVerifyOtp = (data) => {
    console.log("OTP Verified:", data)
    closeCompanyModal()
  }
  const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

  return (
    <>
    <div className="col-8">
      <div className="card stretch stretch-full">
        <div className="card-body">
          <div className="hstack justify-content-between mb-4">
            <div>
              <h5 className="mb-1">Company</h5>
              <span className="fs-12 text-muted">First Select company</span>
            </div>

            {/* ✅ Open Modal Button */}
            <button
              className="btn btn-light-brand"
              onClick={openCompanyModal}
            >
              Create Company
            </button>
          </div>

          <div className="row g-4">
            {projectData2.map((item, index) => (
              <div key={index} className="col-xxl-3 col-md-6">
                <div
                  className={`card-body border border-dashed rounded-3 position-relative ${
                    selectedCard === index ? "border-success" : "border-gray-5"
                  }`}
                  onClick={() => setSelectedCard(index)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="hstack justify-content-between gap-4">
                    <div>
                      <h6 className="fs-14 text-truncate-1-line text-uppercase">{item.company_name}</h6>
                      <div className="fs-12 text-muted">
                        <span className="text-dark fw-medium">Created At:</span> {formatDateTime(item.created_at)}
                      </div>
                    </div>
                    <div className="project-progress-1">
                      {/* <CircleProgress
                        value={progress}
                        text_sym="%"
                        path_width="8px"
                        path_color={progress_color}
                      /> */}
                    </div>
                  </div>
                  <div className="badge bg-gray-200 text-dark project-mini-card-badge">
                    Updates
                  </div>
                </div>

                <CompanyMiscellaneous
                  index={index}
                  projectData={projectData}
                  projectData2={projectData2}

                  isSelected={selectedCard === index}
                  onSelect={() => setSelectedCard(index)}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
          {/* ✅ Modal Render */}
          {showCompanyModal && (
            <CreateCompanyModal
              onCancel={closeCompanyModal}
              onClose={closeCompanyModal}
              onVerify={handleVerifyOtp}
              type="company"
            />
          )}
          </>
  )
}

export default TotalCompany
