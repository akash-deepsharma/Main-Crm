"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

const CompanyMiscellaneous = ({ index, isSelected, projectData2 }) => {
  const router = useRouter()

  if (!projectData2 || !projectData2[index]) return null

  const company = projectData2[index]

  const handleCompanyClick = () => {
    localStorage.setItem("selected_company", JSON.stringify(company['id']))
    router.push("/dashboards/crm")
  }

  return (
    <div className="col-xxl-12">
      <div
        className={`border border-dashed p-4 rounded-3 gap-4 text-center ${
          isSelected ? "border-success" : "border-gray-5"
        }`}
        onClick={handleCompanyClick}
        style={{ cursor: "pointer" }}
      >
        <div
          className="m-auto overflow-hidden"
          style={{ width: "150px", height: "150px", borderRadius: "50%",boxShadow:"#9a9a9a 0px 0px 6px 2px" }}
        >
          <img
            src={ `https://green-owl-255815.hostingersite.com/${company.company_logo}`
            }
            alt={company.company_name} style={{width:"inherit",height:"100%"}}
          />
        </div>

        <div className="mt-4">
          <p className="fs-12 text-muted mb-1">
            Company Code:{" "}
            <span className="fs-11 fw-medium text-dark">
              {company.company_code}
            </span>
          </p>

          <Link href="#" className="fs-18 fw-bold text-truncate-1-line text-capitalize ">
            {company.company_name}
          </Link>

          <div className="hstack gap-3 mt-3 justify-content-center">            
            <Link href="#" style={{textWrap:'wrap'}}>{company.company_business_email}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyMiscellaneous
