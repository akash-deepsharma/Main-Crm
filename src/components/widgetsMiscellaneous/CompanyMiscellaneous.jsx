"use client"

import { recentDealData } from "@/utils/fackData/recentDealData"
import Link from "next/link"

const CompanyMiscellaneous = ({ index, isSelected, onSelect }) => {
  const deal = recentDealData[index]

  if (!deal) return null

  const { clossing_date, deal_name, deal_price, dealr_img, dealr_name } = deal

  return (
            <div className="col-xxl-12">
              <div
                className={`border border-dashed p-4 rounded-3 gap-4 text-center ${isSelected ? "border-success" : "border-gray-5"}`}
                onClick={onSelect}
                style={{ cursor: "pointer" }}
              >
                <div
                  className={`sales-progress-${index} m-auto overflow-hidden img-fluid cover`}
                  style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                >
                  <img src="/images/avatar/1.png" alt={deal_name} />
                </div>
                <div className="mt-4">
                  <p className="fs-12 text-muted mb-1">
                    Renual date: <span className="fs-11 fw-medium text-dark">{clossing_date}</span>
                  </p>
                  <Link href="#" className="fs-18 fw-bold text-truncate-1-line">
                    {deal_name}
                  </Link>
                  <div className="hstack gap-3 mt-3 justify-content-center">
                    <div className="avatar-image avatar-sm">
                      <img src={dealr_img || "/placeholder.svg"} alt="" className="img-fluid" />
                    </div>
                    <Link href="#">{dealr_name}</Link>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default CompanyMiscellaneous
