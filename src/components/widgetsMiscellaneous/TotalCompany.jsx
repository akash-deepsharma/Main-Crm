"use client"
import { useState } from "react"
import CircleProgress from "@/components/shared/CircleProgress"
// import ProjectAssingeMiscellaneous from "./CompanyMiscellaneous"
import CreateCompanyModal from "../common/CreateCompanyModal"
import CompanyMiscellaneous from "./CompanyMiscellaneous"

const projectData = [
  { project_name: "Apps Developemnt Company", progress: "40", progress_color: "#ea4d4d", deadiline: "20 days left" },
  { project_name: "NFT Developemnt Company", progress: "85", progress_color: "#3454d1", deadiline: "18 days left" },
  { project_name: "Mobile Apps Company", progress: "50", progress_color: "#ffa21d", deadiline: "16 days left" },
  { project_name: "Seo Company", progress: "75", progress_color: "#17c666", deadiline: "10 days left" },
]

const TotalCompany = () => {
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

  return (
    <>
    <div className="col-12">
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
            {projectData.map(({ deadiline, progress, progress_color, project_name }, index) => (
              <div key={index} className="col-xxl-3 col-md-6">
                {/* <div
                  className={`card-body border border-dashed rounded-3 position-relative ${
                    selectedCard === index ? "border-success" : "border-gray-5"
                  }`}
                  onClick={() => setSelectedCard(index)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="hstack justify-content-between gap-4">
                    <div>
                      <h6 className="fs-14 text-truncate-1-line">{project_name}</h6>
                      <div className="fs-12 text-muted">
                        <span className="text-dark fw-medium">Deadline:</span> {deadiline}
                      </div>
                    </div>
                    <div className="project-progress-1">
                      <CircleProgress
                        value={progress}
                        text_sym="%"
                        path_width="8px"
                        path_color={progress_color}
                      />
                    </div>
                  </div>
                  <div className="badge bg-gray-200 text-dark project-mini-card-badge">
                    Updates
                  </div>
                </div> */}

                <CompanyMiscellaneous
                  index={index}
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
