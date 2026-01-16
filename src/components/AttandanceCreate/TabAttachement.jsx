'use client'
import React, { useState, useEffect } from "react"
import { FiMinus } from "react-icons/fi"

const documentOptions = [
  "Attendance Document",
]

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const TabAttachement = ({ onNext, setIsUploading, currentStep }) => {
  const [selectedDocs, setSelectedDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - 1900 + 1 }, 
    (_, i) => currentYear - i
  )
  
  // Set default values on component mount
  useEffect(() => {
    const currentDate = new Date()
    const currentMonthName = monthNames[currentDate.getMonth()]
    setSelectedMonth(currentMonthName)
    setSelectedYear(currentYear.toString())
  }, [])

  const handleSelectDoc = (docType, file) => {
    if (!docType || !file) return

    const icon = getIconByFile(file)

    setSelectedDocs(prev => [
      ...prev,
      { type: docType, file, icon }
    ])
  }

  const handleRemoveDoc = (type) => {
    setSelectedDocs(prev => prev.filter(d => d.type !== type))
  }

  /* 🔥 API SUBMIT */
  const handleUpload = async () => {
    if (!selectedDocs.length) {
      alert("No file selected")
      return
    }

    if (!selectedMonth || !selectedYear) {
      alert("Please select both month and year")
      return
    }

    try {
      setLoading(true)
      if (setIsUploading) setIsUploading(true)

      const token = localStorage.getItem("token")

      const formData = new FormData()
      formData.append("file", selectedDocs[0].file)
      formData.append("month", selectedMonth)
      formData.append("year", parseInt(selectedYear))

      const res = await fetch(
        "https://green-owl-255815.hostingersite.com/api/attendance/upload-excel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const result = await res.json()
      console.log("Upload result:", result)

      if (result?.status) {
        alert("Excel uploaded successfully")
        
        // Prepare data to pass to next step
        const uploadedData = {
          month: selectedMonth,
          year: selectedYear,
          fileName: selectedDocs[0].file.name,
          fileUrl: result.data?.fileUrl || "",
          uploadedAt: new Date().toISOString()
        }
        
        // Pass data to parent and move to next step
        if (onNext) {
          await onNext(uploadedData)
        }
        
        setSelectedDocs([])
      } else {
        alert(result?.message || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
      if (setIsUploading) setIsUploading(false)
    }
  }

  /* Handle Next Button Click (when file not uploaded) */
  const handleNextWithoutUpload = () => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select both month and year")
      return
    }

    // Pass only month/year without file data
    const monthYearData = {
      month: selectedMonth,
      year: selectedYear,
      fileName: "",
      fileUrl: "",
      isUploaded: false
    }
    
    if (onNext) {
      onNext(monthYearData)
    }
  }

  return (
    <section className="step-body body stepChange mt-4">
      <div>
        <div className="mb-5">
          <h2 className="fs-16 fw-bold">Attachment Files</h2>
          <p className="text-muted">
            Upload attendance related documents or proceed with month/year selection
          </p>
        </div>

        {/* Month and Year Selection */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Select Month</label>
              <select 
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
              >
                <option value="">Select Month</option>
                {monthNames.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Select Year</label>
              <select 
                className="form-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-4">
          <label
            htmlFor="choose-file"
            className="custom-file-upload"
          >
            Upload Document
          </label>

          <input
            type="file"
            id="choose-file"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0]
              handleSelectDoc(documentOptions[0], file)
              e.target.value = null
            }}
          />
        </div>

        {/* FILE LIST */}
        {selectedDocs.length > 0 && (
          <div className="row mb-4">
            {selectedDocs.map((doc, index) => (
              <AttachementCard
                key={index}
                title={doc.type}
                iconSrc={doc.icon}
                onRemove={() => handleRemoveDoc(doc.type)}
              />
            ))}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="d-flex gap-3">
          {/* Upload Button (only show if file is selected) */}
          {selectedDocs.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={loading || !selectedMonth || !selectedYear}
            >
              {loading ? "Uploading..." : "Upload & Continue"}
            </button>
          )}

          {/* Next Button (always show - for skipping upload) */}
          <button
            className={`btn ${selectedDocs.length > 0 ? "btn-outline-primary" : "btn-primary"}`}
            onClick={handleNextWithoutUpload}
            disabled={!selectedMonth || !selectedYear}
          >
            Continue Without Upload
          </button>
        </div>
      </div>
    </section>
  )
}

export default TabAttachement

/* ---------- ICON UTILS ---------- */
const getIconByFile = (file) => {
  const ext = file.name.split(".").pop().toLowerCase()

  if (ext === "pdf") return "/images/file-icons/pdf.png"
  if (["png"].includes(ext)) return "/images/file-icons/png.png"
  if (["jpg", "jpeg"].includes(ext)) return "/images/file-icons/jpg.png"
  if (["webp"].includes(ext)) return "/images/file-icons/webp.png"
  if (["doc", "docx", "txt"].includes(ext)) return "/images/file-icons/doc.png"
  if (["zip", "rar", "7z"].includes(ext)) return "/images/file-icons/zip.png"

  return "/images/file-icons/file.png"
}

/* ---------- CARD ---------- */
const AttachementCard = ({ title, iconSrc, onRemove }) => {
  return (
    <div className="col-sm-4 col-md-3 col-lg-2 mb-4">
      <div className="card stretch stretch-full position-relative">
        <div className="card-body p-0 ht-200 d-flex align-items-center justify-content-center">
          <img src={iconSrc} className="img-fluid wd-80 ht-80" alt={title} />
        </div>

        <button
          type="button"
          className="btn btn-danger btn-sm position-absolute"
          style={{ top: "4px", right: "4px" }}
          onClick={onRemove}
        >
          <FiMinus />
        </button>

        <div className="card-footer p-2">
          <h2 className="fs-13 mb-0 text-truncate-1-line">{title}</h2>
        </div>
      </div>
    </div>
  )
}