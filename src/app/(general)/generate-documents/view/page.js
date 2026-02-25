"use client"
export const dynamic = 'force-dynamic'

import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import ClientView from '@/components/ClientCreate/ClientView'
import CoverLetter from '@/components/CoverLetter/CoverLetter'
import AttendanceSheet from '@/components/CoverLetter/AttandanceSheet'
import GstDesign from '@/components/CoverLetter/GstDesign'
import WagesSheetEmployee from '@/components/CoverLetter/WagesSheetEmployee'
import WagesSheetEmployer from '@/components/CoverLetter/WagesSheetEmployer'
import { FiPrinter, FiShare2, FiDownload, FiMail, FiCopy, FiExternalLink, FiX, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas' 

// Error Message Component
const ErrorMessage = ({ message, onRetry, type = 'error' }) => {
  const bgColor = type === 'warning' ? 'bg-warning bg-opacity-10' : 'bg-danger bg-opacity-10';
  const textColor = type === 'warning' ? 'text-white' : 'text-danger';
  const borderColor = type === 'warning' ? 'border-warning' : 'border-danger';
  
  return (
    <div className={`alert ${bgColor} ${borderColor} border-start border-4 py-3 mb-3 mt-3`} role="alert">
      <div className="d-flex align-items-center gap-3">
        <FiAlertCircle className={textColor} size={24} />
        <div className="flex-grow-1">
          <strong className={textColor}>
            {type === 'warning' ? 'Warning: ' : 'Error: '}
          </strong>
          <span className="text-white">{message}</span>
        </div>
        {onRetry && (
          <button 
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={onRetry}
          >
            <FiRefreshCw size={14} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ message, icon: Icon, onAction, actionLabel }) => (
  <div className="text-center py-5 my-4">
    <div className="mb-3">
      {Icon && <Icon size={48} className="text-muted" />}
    </div>
    <p className="text-muted mb-3">{message}</p>
    {onAction && actionLabel && (
      <button className="btn btn-primary" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

// Loading Spinner Component
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="text-center py-4">
    <div className="spinner-border text-primary mb-2" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="text-muted small">{message}</p>
  </div>
);

// Create a separate component that uses useSearchParams
function ViewContent() {
  const searchParams = useSearchParams()
  
  // Get parameters from URL
  const clientType = searchParams.get('type')
  const clientId = searchParams.get('client_id')
  
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [filteredData, setFilteredData] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [wagesLoading, setWagesLoading] = useState(false)
  const [coverLetterLoading, setCoverLetterLoading] = useState(false)
  const [error, setError] = useState(null)
  const [documentsError, setDocumentsError] = useState(null)
  const [attendanceError, setAttendanceError] = useState(null)
  const [wagesError, setWagesError] = useState(null)
  const [coverLetterError, setCoverLetterError] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [coverLetterData, setCoverLetterData] = useState(null)
  console.log("coverLetterData swati", coverLetterData);
  
  // Print and Share states
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [generateshowData, setGenerateshowData] = useState(null)
  const [selectedDocuments, setSelectedDocuments] = useState({
    coverLetter: true,
    attendanceSheet: true,
    gstDesign: true,
    wagesSheetEmployee: true,
    wagesSheetEmployer: true
  })
  const [copied, setCopied] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [exportFormat, setExportFormat] = useState('pdf')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  // Refs for each document
  const coverLetterRef = useRef(null)
  const attendanceSheetRef = useRef(null)
  const gstDesignRef = useRef(null)
  const wagesSheetEmployeeRef = useRef(null)
  const wagesSheetEmployerRef = useRef(null)
  const documentsContainerRef = useRef(null)

  const DEBUG = process.env.NODE_ENV === 'development'

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  // Load profile data from localStorage only on client side
  useEffect(() => {
    const storedProfileData = localStorage.getItem('profileData')
    if (storedProfileData) {
      try {
        setProfileData(storedProfileData)
      } catch (e) {
        if (DEBUG) console.error('Error parsing profile data:', e)
      }
    }
  }, [DEBUG])

  // Log URL parameters on component mount
  useEffect(() => {
    if (clientType && clientId && DEBUG) {
      console.log('URL Parameters:', { 
        clientType, 
        clientId,
        timestamp: new Date().toISOString() 
      })
    }
  }, [clientType, clientId, DEBUG])

  // Define hasDocument FIRST before any other functions that depend on it
  const hasDocument = useCallback((docName) => {
    return generateshowData?.data?.documents?.some(
      (doc) => doc?.toLowerCase().trim() === docName.toLowerCase()
    ) ?? false
  }, [generateshowData])

  // Check if any documents are available
  const hasAnyDocument = useCallback(() => {
    return generateshowData?.data?.documents?.length > 0
  }, [generateshowData])

  // Fetch attendance data only if attendance document exists
  const fetchAttendanceData = useCallback(async () => {
    if (!hasDocument('attendance')) {
      return
    }

    try {
      setAttendanceLoading(true)
      setAttendanceError(null)
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.')
      }

      let apiMonth = selectedMonth
      let apiYear = selectedYear
      
      if (!apiMonth || !apiYear) {
        const now = new Date()
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        apiMonth = prevMonth.toLocaleString('en-US', { month: 'long' })
        apiYear = prevMonth.getFullYear().toString()
      }
      
      const response = await fetch(
        `https://green-owl-255815.hostingersite.com/api/client-wise-attendance?client_id=${clientId}&month=${apiMonth}&year=${apiYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.')
        } else if (response.status === 404) {
          throw new Error('Attendance data not found for the selected period.')
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      const result = await response.json()

      if (result.status && result.data) {
        const formattedData = result.data.map(item => ({
          id: item.id,
          employee: {
            id: item.employee_rand_id,
            name: item.employee_name,
            email: item.employee?.email || `${item.employee_name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            img: item.employee?.img || null
          },
          'employee-id': item.employee_id,
          'employee-rand-id': item.employee_rand_id,
          'employee-name': {
            title: item.employee_name,
            img: item.employee?.img || null
          },
          designation: item.employee?.designation?.name || 
                      (item.post === "271" ? "STP Operator" : 
                       item.post === "272" ? "Pump Operator" : 
                       `Post ${item.post}`) || 'Not specified',
          designation_details: item.employee?.designation || {
            id: item.post,
            name: item.employee?.designation?.name || 'Not specified'
          },
          present_days: item.total || 0,
          absent_days: item.absent || 0,
          extra_hours: item.extra_hr || 0,
          month: item.month || 'N/A',
          year: item.year || 'N/A',
          month_year: `${item.month || 'N/A'} ${item.year || ''}`.trim(),
          daily_attendance: {
            day_1: item.day_1 || '',
            day_2: item.day_2 || '',
            day_3: item.day_3 || '',
            day_4: item.day_4 || '',
            day_5: item.day_5 || '',
            day_6: item.day_6 || '',
            day_7: item.day_7 || '',
            day_8: item.day_8 || '',
            day_9: item.day_9 || '',
            day_10: item.day_10 || '',
            day_11: item.day_11 || '',
            day_12: item.day_12 || '',
            day_13: item.day_13 || '',
            day_14: item.day_14 || '',
            day_15: item.day_15 || '',
            day_16: item.day_16 || '',
            day_17: item.day_17 || '',
            day_18: item.day_18 || '',
            day_19: item.day_19 || '',
            day_20: item.day_20 || '',
            day_21: item.day_21 || '',
            day_22: item.day_22 || '',
            day_23: item.day_23 || '',
            day_24: item.day_24 || '',
            day_25: item.day_25 || '',
            day_26: item.day_26 || '',
            day_27: item.day_27 || '',
            day_28: item.day_28 || '',
            day_29: item.day_29 || '',
            day_30: item.day_30 || '',
            day_31: item.day_31 || '',
          }
        }))
        
        setAttendanceData(formattedData)
        setFilteredData(formattedData)
      } else {
        setAttendanceData([])
        setFilteredData([])
        if (result.message) {
          throw new Error(result.message)
        }
      }
    } catch (error) {
      if (DEBUG) console.error('Error fetching attendance data:', error)
      setAttendanceError(error.message || 'Failed to fetch attendance data')
      setAttendanceData([])
      setFilteredData([])
    } finally {
      setAttendanceLoading(false)
    }
  }, [clientId, selectedMonth, selectedYear, DEBUG, hasDocument])

  // Fetch wages data only if wages sheets exist
  const fetchWagesData = useCallback(async () => {
    if (!clientId || (!hasDocument('employee_wages_sheet') && !hasDocument('employer_wages_sheet'))) {
      return
    }

    try {
      setWagesLoading(true)
      setWagesError(null)
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.')
      }

      let apiMonth = selectedMonth
      let apiYear = selectedYear
      
      if (!apiMonth || !apiYear) {
        const now = new Date()
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        apiMonth = prevMonth.toLocaleString('en-US', { month: 'long' })
        apiYear = prevMonth.getFullYear().toString()
      }
      
      const response = await fetch(
        `https://green-owl-255815.hostingersite.com/api/employee/salaries?client_id=${clientId}&month=${apiMonth}&year=${apiYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.')
        } else if (response.status === 404) {
          throw new Error('Wages data not found for the selected period.')
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      const result = await response.json()
      
      if (result.status && result.data) {
        // Process wages data here
        // You can store this in state for the wages components
        console.log('Wages data:', result.data)
      }

    } catch (error) {
      if (DEBUG) console.error('Error fetching wages data:', error)
      setWagesError(error.message || 'Failed to fetch wages data')
    } finally {
      setWagesLoading(false)
    }
  }, [clientId, selectedMonth, selectedYear, DEBUG, hasDocument])

  // Fetch cover letter data only if covering_letter document exists
  const fetchCoverLetterData = useCallback(async () => {
    if (!hasDocument('covering_letter')) {
      return
    }

    try {
      setCoverLetterLoading(true)
      setCoverLetterError(null)
      
      const token = localStorage.getItem('token')
      const selected_company = localStorage.getItem('selected_company')
      
      if (!selected_company) {
        throw new Error('Company ID not found. Please log in again.')
      }
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.')
      }

      let apiMonth = selectedMonth
      let apiYear = selectedYear
      
      if (!apiMonth || !apiYear) {
        const now = new Date()
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        apiMonth = prevMonth.toLocaleString('en-US', { month: 'long' })
        apiYear = prevMonth.getFullYear().toString()
      }
      
      const response = await fetch(
        `https://green-owl-255815.hostingersite.com/api/cover-letter-docs?client_id=${clientId}&month=${apiMonth}&year=${apiYear}&company_id=${selected_company}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.')
        } else if (response.status === 404) {
          throw new Error('Cover letter data not found for the selected period.')
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      const result = await response.json()
      console.log('Cover letter data:', result)
      
      if (result.status) {
        setCoverLetterData(result)
      }

    } catch (error) {
      if (DEBUG) console.error('Error fetching cover letter data:', error)
      setCoverLetterError(error.message || 'Failed to fetch cover letter data')
    } finally {
      setCoverLetterLoading(false)
    }
  }, [clientId, selectedMonth, selectedYear, DEBUG, hasDocument])

  // Fetch documents data
  const fetchShowDocument = useCallback(async (clientId, month, year) => {
    if (!clientId || !month || !year) return

    try {
      setDocumentsLoading(true)
      setDocumentsError(null)
      setGenerateshowData(null)

      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const url = `https://green-owl-255815.hostingersite.com/api/get-documents?client_id=${clientId}&month=${month}&year=${year}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.")
        } else if (response.status === 404) {
          throw new Error("Documents not found for the selected period.")
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      const data = await response.json()
      setGenerateshowData(data)
      return data

    } catch (error) {
      if (DEBUG) console.error("Error fetching documents:", error)
      setDocumentsError(error.message)
      setGenerateshowData(null)
    } finally {
      setDocumentsLoading(false)
    }
  }, [DEBUG])

  // Fetch documents when clientId, month, and year are available
  useEffect(() => {
    if (clientId) {
      let apiMonth = selectedMonth
      let apiYear = selectedYear
      
      if (!apiMonth || !apiYear) {
        const now = new Date()
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        apiMonth = prevMonth.toLocaleString('en-US', { month: 'long' })
        apiYear = prevMonth.getFullYear().toString()
      }
      
      fetchShowDocument(clientId, apiMonth, apiYear)
    }
  }, [clientId, selectedMonth, selectedYear, fetchShowDocument])

  // Fetch attendance data only when documents are loaded and attendance exists
  useEffect(() => {
    if (generateshowData && hasDocument('attendance')) {
      fetchAttendanceData()
    }
  }, [generateshowData, fetchAttendanceData, hasDocument])

  // Fetch wages data only when documents are loaded and wages sheets exist
  useEffect(() => {
    if (generateshowData && (hasDocument('employee_wages_sheet') || hasDocument('employer_wages_sheet'))) {
      fetchWagesData()
    }
  }, [generateshowData, fetchWagesData, hasDocument])

  // Fetch cover letter data only when documents are loaded and covering_letter exists
  useEffect(() => {
    if (generateshowData && hasDocument('covering_letter')) {
      fetchCoverLetterData()
    }
  }, [generateshowData, fetchCoverLetterData, hasDocument])

  const handleMonthChange = (e) => {
    const month = e.target.value
    setSelectedMonth(month)
    // Clear errors when changing filters
    setError(null)
    setDocumentsError(null)
    setAttendanceError(null)
    setWagesError(null)
    setCoverLetterError(null)
  }

  const handleYearChange = (e) => {
    const year = e.target.value
    setSelectedYear(year)
    // Clear errors when changing filters
    setError(null)
    setDocumentsError(null)
    setAttendanceError(null)
    setWagesError(null)
    setCoverLetterError(null)
  }

  const handleApplyFilter = () => {
    if (selectedMonth && selectedYear) {
      fetchShowDocument(clientId, selectedMonth, selectedYear)
    }
  }

  const handleResetFilter = () => {
    setSelectedMonth('')
    setSelectedYear('')
    setFilteredData(attendanceData)
    setError(null)
    setDocumentsError(null)
    setAttendanceError(null)
    setWagesError(null)
    setCoverLetterError(null)
    
    // Fetch with default month/year
    if (clientId) {
      const now = new Date()
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const defaultMonth = prevMonth.toLocaleString('en-US', { month: 'long' })
      const defaultYear = prevMonth.getFullYear().toString()
      fetchShowDocument(clientId, defaultMonth, defaultYear)
    }
  }

  const handleRetryDocuments = () => {
    if (clientId) {
      fetchShowDocument(clientId, selectedMonth, selectedYear)
    }
  }

  const handleRetryAttendance = () => {
    if (hasDocument('attendance')) {
      fetchAttendanceData()
    }
  }

  const handleRetryWages = () => {
    if (hasDocument('employee_wages_sheet') || hasDocument('employer_wages_sheet')) {
      fetchWagesData()
    }
  }

  const handleRetryCoverLetter = () => {
    if (hasDocument('covering_letter')) {
      fetchCoverLetterData()
    }
  }

  // Print functionality
  const handlePrint = () => {
    setShowPrintOptions(true)
  }

  const handlePrintSelected = () => {
    setShowPrintOptions(false)
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print documents')
      return
    }

    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Documents - ${selectedMonth} ${selectedYear}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .page-break { page-break-after: always; }
          @media print {
            .page-break { page-break-after: always; }
            body { margin: 0; padding: 15px; }
          }
        </style>
      </head>
      <body>
    `

    if (selectedDocuments.coverLetter && coverLetterRef.current) {
      printContent += '<div>' + coverLetterRef.current.innerHTML + '</div><div class="page-break"></div>'
    }
    
    if (selectedDocuments.attendanceSheet && attendanceSheetRef.current) {
      printContent += '<div>' + attendanceSheetRef.current.innerHTML + '</div><div class="page-break"></div>'
    }
    
    if (selectedDocuments.gstDesign && gstDesignRef.current) {
      printContent += '<div>' + gstDesignRef.current.innerHTML + '</div><div class="page-break"></div>'
    }
    
    if (selectedDocuments.wagesSheetEmployee && wagesSheetEmployeeRef.current) {
      printContent += '<div>' + wagesSheetEmployeeRef.current.innerHTML + '</div><div class="page-break"></div>'
    }
    
    if (selectedDocuments.wagesSheetEmployer && wagesSheetEmployerRef.current) {
      printContent += '<div>' + wagesSheetEmployerRef.current.innerHTML + '</div>'
    }

    printContent += '</body></html>'

    printWindow.document.write(printContent)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  // Share functionality
  const handleShare = () => {
    const baseUrl = window.location.origin + window.location.pathname
    const shareUrl = `${baseUrl}?client_id=${clientId}&type=${clientType}&month=${selectedMonth}&year=${selectedYear}`
    setShareLink(shareUrl)
    setShowShareModal(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareEmail = () => {
    const subject = `Documents for ${selectedMonth} ${selectedYear} - Client ${clientId}`
    const body = `Please find the documents at the following link:\n\n${shareLink}\n\nRegards,`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  // Export functionality
  const handleExport = () => {
    setShowExportOptions(true)
  }

  const handleExportSelected = async () => {
    setShowExportOptions(false)
    
    if (exportFormat === 'pdf') {
      await exportToPDF()
    } else {
      exportToExcel()
    }
  }

  const exportToPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const pdf = new jsPDF('p', 'pt', 'a4')
      let isFirstPage = true

      const addContentToPDF = async (element, title) => {
        if (!element) return

        if (!isFirstPage) {
          pdf.addPage()
        }
        
        pdf.setFontSize(16)
        pdf.setTextColor(0, 0, 0)
        pdf.text(title, 40, 40)
        
        const canvas = await html2canvas(element, {
          scale: 1.25,
          backgroundColor: '#ffffff'
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = pdf.internal.pageSize.getWidth() - 80
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', 40, 60, imgWidth, imgHeight)
        isFirstPage = false
      }

      if (selectedDocuments.coverLetter && coverLetterRef.current) {
        await addContentToPDF(coverLetterRef.current, 'Cover Letter')
      }
      
      if (selectedDocuments.attendanceSheet && attendanceSheetRef.current) {
        await addContentToPDF(attendanceSheetRef.current, 'Attendance Sheet')
      }
      
      if (selectedDocuments.gstDesign && gstDesignRef.current) {
        await addContentToPDF(gstDesignRef.current, 'GST Invoice')
      }
      
      if (selectedDocuments.wagesSheetEmployee && wagesSheetEmployeeRef.current) {
        await addContentToPDF(wagesSheetEmployeeRef.current, 'Employee Wages Sheet')
      }
      
      if (selectedDocuments.wagesSheetEmployer && wagesSheetEmployerRef.current) {
        await addContentToPDF(wagesSheetEmployerRef.current, 'Employer Wages Sheet')
      }

      pdf.save(`documents-${selectedMonth}-${selectedYear}.pdf`)
    } catch (error) {
      if (DEBUG) console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new()
      
      if (selectedDocuments.coverLetter && coverLetterRef.current) {
        const wsData = [
          ['Cover Letter'],
          ['Generated on:', new Date().toLocaleString()],
          ['Client ID:', clientId],
          ['Client Type:', clientType],
          ['Month/Year:', `${selectedMonth} ${selectedYear}`],
          [],
          ['Document Content'],
          [coverLetterRef.current.innerText]
        ]
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'Cover Letter')
      }
      
      if (selectedDocuments.attendanceSheet && attendanceSheetRef.current) {
        const wsData = [
          ['Attendance Sheet'],
          ['Generated on:', new Date().toLocaleString()],
          ['Client ID:', clientId],
          ['Client Type:', clientType],
          ['Month/Year:', `${selectedMonth} ${selectedYear}`],
          [],
          ['Employee Name', 'Employee ID', 'Designation', 'Present Days', 'Absent Days', 'Extra Hours']
        ]
        
        attendanceData.forEach(item => {
          wsData.push([
            item.employee?.name || '',
            item['employee-id'] || '',
            item.designation || '',
            item.present_days || 0,
            item.absent_days || 0,
            item.extra_hours || 0
          ])
        })
        
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance')
      }
      
      if (selectedDocuments.wagesSheetEmployee && wagesSheetEmployeeRef.current) {
        const wsData = [
          ['Employee Wages Sheet'],
          ['Generated on:', new Date().toLocaleString()],
          ['Client ID:', clientId],
          ['Client Type:', clientType],
          ['Month/Year:', `${selectedMonth} ${selectedYear}`],
          [],
          ['Employee Name', 'Present Days', 'Extra Hours', 'Daily Wage', 'Regular Wages', 'OT Wages', 'Total Wages']
        ]
        
        attendanceData.forEach(item => {
          const dailyWage = 500
          const overtimeRate = 75
          const regularWages = (item.present_days || 0) * dailyWage
          const overtimeWages = (item.extra_hours || 0) * overtimeRate
          
          wsData.push([
            item.employee?.name || '',
            item.present_days || 0,
            item.extra_hours || 0,
            dailyWage,
            regularWages,
            overtimeWages,
            regularWages + overtimeWages
          ])
        })
        
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, 'Employee Wages')
      }
      
      XLSX.writeFile(wb, `documents-${selectedMonth}-${selectedYear}.xlsx`)
    } catch (error) {
      if (DEBUG) console.error('Error generating Excel:', error)
      alert('Error generating Excel file. Please try again.')
    }
  }

  return (
    <div className='pt-5'>
      {/* URL Parameters Display */}
      {clientType && clientId && (
        <div className="container mb-3">
          <div className="bg-light p-2 rounded" style={{ borderRadius: '8px' }}>
            <small className="text-muted">
              <strong>Client Type:</strong> {clientType} | <strong>Client ID:</strong> {clientId}
            </small>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="main-content mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Filter by Month & Year</h5>
            
            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={handlePrint}
                disabled={!selectedMonth || !selectedYear || documentsLoading || !hasAnyDocument()}
                style={{ borderRadius: '10px' }}
                aria-label="Print documents"
                title={!hasAnyDocument() ? "No documents available to print" : ""}
              >
                <FiPrinter size={18} />
                Print
              </button>
              <button 
                className="btn btn-outline-success d-flex align-items-center gap-2"
                onClick={handleExport}
                disabled={!selectedMonth || !selectedYear || documentsLoading || isGeneratingPDF || !hasAnyDocument()}
                style={{ borderRadius: '10px' }}
                aria-label="Export documents"
                title={!hasAnyDocument() ? "No documents available to export" : ""}
              >
                <FiDownload size={18} />
                {isGeneratingPDF ? 'Generating...' : 'Export'}
              </button>
              <button 
                className="btn btn-outline-info d-flex align-items-center gap-2"
                onClick={handleShare}
                disabled={!selectedMonth || !selectedYear || documentsLoading}
                style={{ borderRadius: '10px' }}
                aria-label="Share documents"
              >
                <FiShare2 size={18} />
                Share
              </button>
            </div>
          </div>

          {/* Print Options Modal */}
          {showPrintOptions && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}>
              <div className="modal-content" style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                width: '90%',
                maxWidth: '450px'
              }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Select Documents to Print</h5>
                  <button 
                    className="btn btn-sm btn-light"
                    onClick={() => setShowPrintOptions(false)}
                    aria-label="Close"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                
                <div className="mb-4">
                  {Object.keys(selectedDocuments).map((key) => {
                    const docName = key === 'coverLetter' ? 'covering_letter' : 
                                   key === 'attendanceSheet' ? 'attendance' :
                                   key === 'gstDesign' ? 'bill' :
                                   key === 'wagesSheetEmployee' ? 'employee_wages_sheet' :
                                   key === 'wagesSheetEmployer' ? 'employer_wages_sheet' : '';
                    
                    return (
                      <div key={key} className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={key}
                          checked={selectedDocuments[key]}
                          onChange={(e) => setSelectedDocuments({
                            ...selectedDocuments,
                            [key]: e.target.checked
                          })}
                          disabled={!hasDocument(docName)}
                        />
                        <label className="form-check-label" htmlFor={key}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          {!hasDocument(docName) && (
                            <span className="badge bg-secondary ms-2">Not Available</span>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
                
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    onClick={handlePrintSelected}
                    disabled={!Object.values(selectedDocuments).some(Boolean)}
                  >
                    <FiPrinter size={18} />
                    Print Selected
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPrintOptions(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Export Options Modal */}
          {showExportOptions && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}>
              <div className="modal-content" style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Export Documents</h5>
                  <button 
                    className="btn btn-sm btn-light"
                    onClick={() => setShowExportOptions(false)}
                    aria-label="Close"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold">Select Format</label>
                  <div className="d-flex gap-3 mb-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="pdf"
                        checked={exportFormat === 'pdf'}
                        onChange={() => setExportFormat('pdf')}
                      />
                      <label className="form-check-label" htmlFor="pdf">
                        <FaFilePdf className="me-1 text-danger" /> PDF
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="excel"
                        checked={exportFormat === 'excel'}
                        onChange={() => setExportFormat('excel')}
                      />
                      <label className="form-check-label" htmlFor="excel">
                        <FaFileExcel className="me-1 text-success" /> Excel
                      </label>
                    </div>
                  </div>
                  
                  <label className="form-label fw-semibold">Select Documents</label>
                  {Object.keys(selectedDocuments).map((key) => {
                    const docName = key === 'coverLetter' ? 'covering_letter' : 
                                   key === 'attendanceSheet' ? 'attendance' :
                                   key === 'gstDesign' ? 'bill' :
                                   key === 'wagesSheetEmployee' ? 'employee_wages_sheet' :
                                   key === 'wagesSheetEmployer' ? 'employer_wages_sheet' : '';
                    
                    return (
                      <div key={key} className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`export-${key}`}
                          checked={selectedDocuments[key]}
                          onChange={(e) => setSelectedDocuments({
                            ...selectedDocuments,
                            [key]: e.target.checked
                          })}
                          disabled={!hasDocument(docName)}
                        />
                        <label className="form-check-label" htmlFor={`export-${key}`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          {!hasDocument(docName) && (
                            <span className="badge bg-secondary ms-2">Not Available</span>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
                
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleExportSelected}
                    disabled={isGeneratingPDF || !Object.values(selectedDocuments).some(Boolean)}
                  >
                    <FiDownload size={18} />
                    {isGeneratingPDF ? 'Generating...' : `Export as ${exportFormat.toUpperCase()}`}
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowExportOptions(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Share Modal */}
          {showShareModal && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}>
              <div className="modal-content" style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Share Documents</h5>
                  <button 
                    className="btn btn-sm btn-light"
                    onClick={() => setShowShareModal(false)}
                    aria-label="Close"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                
                <p className="text-muted small mb-3">
                  Share this link to give access to documents for {selectedMonth} {selectedYear}
                </p>
                
                <div className="input-group mb-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    value={shareLink} 
                    readOnly 
                    aria-label="Share link"
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={handleCopyLink}
                    aria-label={copied ? "Copied" : "Copy link"}
                  >
                    {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  </button>
                </div>
                
                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    onClick={handleShareEmail}
                  >
                    <FiMail size={18} />
                    Email
                  </button>
                  <button 
                    className="btn btn-outline-success d-flex align-items-center gap-2"
                    onClick={() => window.open(shareLink, '_blank')}
                  >
                    <FiExternalLink size={18} />
                    Open
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold text-muted mb-1">
                  <i className="bi bi-calendar me-1"></i> Month
                </label>
                <select 
                  className="form-select"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  style={{ borderRadius: '10px' }}
                  aria-label="Select month"
                >
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-semibold text-muted mb-1">
                  <i className="bi bi-calendar3 me-1"></i> Year
                </label>
                <select 
                  className="form-select"
                  value={selectedYear}
                  onChange={handleYearChange}
                  style={{ borderRadius: '10px' }}
                  aria-label="Select year"
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-4">
                <div className="d-flex gap-2">
                  <button className="btn btn-primary flex-grow-1"
                    onClick={handleApplyFilter}
                    disabled={!selectedMonth || !selectedYear || loading || documentsLoading}
                    style={{ borderRadius: '10px' }}
                    aria-label="Apply filter"
                  >
                    {loading || documentsLoading ? 'Loading...' : 'Apply Filter'}
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleResetFilter}
                    style={{ borderRadius: '10px' }}
                    aria-label="Reset filter"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Status */}
            {selectedMonth && selectedYear && (
              <div className="mt-3 p-2 bg-primary bg-opacity-10 rounded" style={{ borderRadius: '8px' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary">Active Filter</span>
                  <span className="text-dark small">
                    Showing data for <strong>{selectedMonth} {selectedYear}</strong> | 
                    Client: <strong>{clientType} - {clientId}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Documents Error Display */}
            {documentsError && (
              <ErrorMessage 
                message={documentsError} 
                onRetry={handleRetryDocuments}
                type="warning"
              />
            )}

            {/* Attendance Error Display */}
            {attendanceError && (
              <ErrorMessage 
                message={attendanceError} 
                onRetry={handleRetryAttendance}
                type="error"
              />
            )}

            {/* Wages Error Display */}
            {wagesError && (
              <ErrorMessage 
                message={wagesError} 
                onRetry={handleRetryWages}
                type="error"
              />
            )}

            {/* Cover Letter Error Display */}
            {coverLetterError && (
              <ErrorMessage 
                message={coverLetterError} 
                onRetry={handleRetryCoverLetter}
                type="error"
              />
            )}

            {/* Loading Indicators */}
            {documentsLoading && (
              <LoadingSpinner message="Fetching document list..." />
            )}
            
            {attendanceLoading && (
              <LoadingSpinner message="Fetching attendance data..." />
            )}
            
            {wagesLoading && (
              <LoadingSpinner message="Fetching wages data..." />
            )}

            {coverLetterLoading && (
              <LoadingSpinner message="Fetching cover letter data..." />
            )}
          </div>
        </div>
      </div>

      {/* Documents Container */}
      <div ref={documentsContainerRef}>
        {!documentsLoading && !hasAnyDocument() && !documentsError && (
          <EmptyState 
            message="No documents available for the selected period. Please try a different month or year."
            icon={FiAlertCircle}
          />
        )}
        {console.log("coverLetterData print by swati", coverLetterData)}
        
        {hasDocument("covering_letter") && (
          <div ref={coverLetterRef}>
            <CoverLetter
              month={selectedMonth}
              year={selectedYear}
              clientId={clientId}
              clientType={clientType}
              profileData={profileData}
              coverLetterData={coverLetterData}
            />
          </div>
        )}
        
        {hasDocument("attendance") && (
          <div ref={attendanceSheetRef}>
            <AttendanceSheet 
              month={selectedMonth} 
              year={selectedYear}
              clientId={clientId}
              clientType={clientType}
              attendanceData={attendanceData}
              filteredData={filteredData}
              loading={attendanceLoading}
              error={attendanceError}
            />
          </div>
        )}
        
        {hasDocument("bill") && (
          <div ref={gstDesignRef}>
            <GstDesign />
          </div>
        )}
 
        {hasDocument("employee_wages_sheet") && (
          <div ref={wagesSheetEmployeeRef}>
            <WagesSheetEmployee 
              attendanceData={attendanceData}
              loading={wagesLoading}
              error={wagesError}
            />
          </div>
        )}
        
        {hasDocument("employer_wages_sheet") && (
          <div ref={wagesSheetEmployerRef}>
            <WagesSheetEmployer 
              attendanceData={attendanceData}
              loading={wagesLoading}
              error={wagesError}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

// Main page component with Suspense
const Page = () => {
  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
      <ViewContent />
    </Suspense>
  )
}

export default Page