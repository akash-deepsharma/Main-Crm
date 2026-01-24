'use client'
import React, { useState, useEffect } from "react"
import { FiAlertTriangle } from 'react-icons/fi'

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const TabAttachement = ({ onDataChange, currentStep, initialData, setError = () => {}, error }) => {
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [dueDate, setDueDate] = useState("")
  
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - 1900 + 1 }, 
    (_, i) => currentYear - i
  )
  
  // Initialize with default values or initialData
  useEffect(() => {
    const currentDate = new Date()
    const currentMonthName = monthNames[currentDate.getMonth()]
    
    if (initialData && initialData.month) {
      setSelectedMonth(initialData.month)
      setSelectedYear(initialData.year || currentYear.toString())
      setDueDate(initialData.dueDate || "")
    } else {
      setSelectedMonth(currentMonthName)
      setSelectedYear(currentYear.toString())
      
      // Set default due date (today + 30 days)
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      setDueDate(futureDate.toISOString().split('T')[0])
    }
  }, [initialData, currentYear])

  // Update parent whenever values change
  useEffect(() => {
    if (selectedMonth && selectedYear && dueDate) {
      const monthYearData = {
        month: selectedMonth,
        year: selectedYear,
        dueDate: dueDate,

      }
      
      
      if (onDataChange) {
        onDataChange(monthYearData)
        setError(false)
      }
    }
  }, [selectedMonth, selectedYear, dueDate, onDataChange, setError, initialData])

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
    if (e.target.value && setError) {
      setError(false)
    }
  }

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value)
    if (e.target.value && setError) {
      setError(false)
    }
  }

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value)
    if (e.target.value && setError) {
      setError(false)
    }
  }

  return (
    <section className="step-body body stepChange mt-4">
      <div>
        <div className="mb-5">
          <h2 className="fs-16 fw-bold">Select Month & Year</h2>
          <p className="text-muted">
            Please select the month and year for create Invoice.
          </p>
          {error && currentStep === 2 && (
            <label id="attachment-error" className="error">
              <FiAlertTriangle /> Please select month, year, and due date.
            </label>
          )}
        </div>

        {/* Month and Year Selection */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Select Month *</label>
              <select 
                className={`form-select ${error && !selectedMonth ? 'is-invalid' : ''}`}
                value={selectedMonth}
                onChange={handleMonthChange}
                required
              >
                <option value="">Select Month</option>
                {monthNames.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              {error && !selectedMonth && (
                <div className="invalid-feedback">Month is required</div>
              )}
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Select Year *</label>
              <select 
                className={`form-select ${error && !selectedYear ? 'is-invalid' : ''}`}
                value={selectedYear}
                onChange={handleYearChange}
                required
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {error && !selectedYear && (
                <div className="invalid-feedback">Year is required</div>
              )}
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Due Date *</label>
              <input
                type="date" 
                className={`form-control ${error && !dueDate ? 'is-invalid' : ''}`}
                value={dueDate}
                onChange={handleDueDateChange}
                required
              />
              {error && !dueDate && (
                <div className="invalid-feedback">Due date is required</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Display selected values for confirmation */}
        {selectedMonth && selectedYear && dueDate && (
          <div className="alert alert-success">
            <strong>✅ Selected:</strong> {selectedMonth} {selectedYear} | 
            <strong> Due Date:</strong> {new Date(dueDate).toLocaleDateString()}
            <br />
            <small>Click "Next" to proceed to Employees Data</small>
          </div>
        )}
      </div>
    </section>
  )
}

export default TabAttachement