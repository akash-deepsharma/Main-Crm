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
import { FiPrinter, FiShare2, FiDownload, FiMail, FiCopy, FiExternalLink, FiX, FiCheck } from 'react-icons/fi'
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

const Page = () => {
  const searchParams = useSearchParams()
  
  // Get parameters from URL
  const clientType = searchParams.get('type')
  const clientId = searchParams.get('client_id')
  
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [filteredData, setFilteredData] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Print and Share states
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState({
    coverLetter: true,
    attendanceSheet: true,
    gstDesign: true,
    wagesSheetEmployee: true,
    wagesSheetEmployer: true
  })
  const [copied, setCopied] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [exportFormat, setExportFormat] = useState('pdf') // 'pdf' or 'excel'
  
  // Refs for each document
  const coverLetterRef = useRef(null)
  const attendanceSheetRef = useRef(null)
  const gstDesignRef = useRef(null)
  const wagesSheetEmployeeRef = useRef(null)
  const wagesSheetEmployerRef = useRef(null)
  const documentsContainerRef = useRef(null)

  console.log("attendanceData ", attendanceData)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  // Log URL parameters on component mount
  useEffect(() => {
    if (clientType && clientId) {
      console.log('URL Parameters:', { 
        clientType, 
        clientId,
        timestamp: new Date().toISOString() 
      })
    }
  }, [clientType, clientId])

  const fetchAttendanceData = useCallback(async () => {
    if (!clientId) {
      console.error('No client ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log("token is here", token);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      
      // If month and year are not selected, use previous month as default
      let apiMonth = selectedMonth;
      let apiYear = selectedYear;
      
      if (!apiMonth || !apiYear) {
        const now = new Date();
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        apiMonth = prevMonth.toLocaleString('en-US', { month: 'long' });
        apiYear = prevMonth.getFullYear().toString();
        console.log('Using default month/year:', apiMonth, apiYear);
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
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.status && result.data) {
        // Format the API data to match your table structure
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
        }));
        
        console.log('Formatted Data:', formattedData);
        setAttendanceData(formattedData);
        setFilteredData(formattedData);
      } else {
        console.log('No data found or API returned false status');
        setAttendanceData([]);
        setFilteredData([]);
        if (result.message) {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError(error.message || 'Failed to fetch attendance data');
      setAttendanceData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [clientId, selectedMonth, selectedYear]);

  // Fetch attendance data when component mounts and when filters change
  useEffect(() => {
    if (clientId) {
      fetchAttendanceData();
    }
  }, [clientId, fetchAttendanceData]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      console.log('Filter Applied:', { 
        month: selectedMonth, 
        year: selectedYear,
        clientId,
        clientType,
        timestamp: new Date().toISOString()
      });
      
      // Re-fetch data when filters change
      fetchAttendanceData();
    }
  }, [selectedMonth, selectedYear, clientId, clientType, fetchAttendanceData]);

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    if (month) console.log('Month selected:', month);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (year) console.log('Year selected:', year);
  };

  const handleApplyFilter = () => {
    if (selectedMonth && selectedYear) {
      const filterParams = { 
        month: selectedMonth, 
        year: selectedYear,
        clientId,
        clientType,
        monthIndex: months.indexOf(selectedMonth) + 1
      };
      console.log('Applying filter with:', filterParams);
      fetchAttendanceData();
    }
  };

  const handleResetFilter = () => {
    setSelectedMonth('');
    setSelectedYear('');
    setFilteredData(attendanceData); // Reset to original data
    console.log('Filters reset at:', new Date().toLocaleString());
  };

  // Print functionality
  const handlePrint = () => {
    setShowPrintOptions(true)
  }

  const handlePrintSelected = () => {
    setShowPrintOptions(false)
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print documents')
      return
    }

    // Start building the print content
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

    // Add selected documents to print content
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

    // Write to new window and print
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  // Share functionality
  const handleShare = () => {
    // Generate share link
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
    try {
      const pdf = new jsPDF('p', 'pt', 'a4')
      let isFirstPage = true

      // Helper function to add content to PDF
      const addContentToPDF = async (element, title) => {
        if (!element) return

        if (!isFirstPage) {
          pdf.addPage()
        }
        
        // Add title
        pdf.setFontSize(16)
        pdf.setTextColor(0, 0, 0)
        pdf.text(title, 40, 40)
        
        // Capture the element as canvas
        const canvas = await html2canvas(element, {
          scale: 1.5,
          backgroundColor: '#ffffff'
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = pdf.internal.pageSize.getWidth() - 80
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', 40, 60, imgWidth, imgHeight)
        isFirstPage = false
      }

      // Add selected documents to PDF
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

      // Save PDF
      pdf.save(`documents-${selectedMonth}-${selectedYear}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const exportToExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new()
      
      // Add sheets for each selected document
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
        // Convert attendance data to worksheet
        const wsData = [
          ['Attendance Sheet'],
          ['Generated on:', new Date().toLocaleString()],
          ['Client ID:', clientId],
          ['Client Type:', clientType],
          ['Month/Year:', `${selectedMonth} ${selectedYear}`],
          [],
          ['Employee Name', 'Employee ID', 'Designation', 'Present Days', 'Extra Hours']
        ]
        
        // Add attendance data
        attendanceData.forEach(item => {
          wsData.push([
            item.employee?.name || '',
            item['employee-id'] || '',
            item.designation || '',
            item.present_days || 0,
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
        
        // Add wage data (you can calculate this from attendance data)
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
      
      // Save Excel file
      XLSX.writeFile(wb, `documents-${selectedMonth}-${selectedYear}.xlsx`)
    } catch (error) {
      console.error('Error generating Excel:', error)
      alert('Error generating Excel file. Please try again.')
    }
  }

  const profileData = localStorage.getItem('profileData');

  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
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
                  disabled={!selectedMonth || !selectedYear}
                  style={{ borderRadius: '10px' }}
                >
                  <FiPrinter size={18} />
                  Print
                </button>
                <button 
                  className="btn btn-outline-success d-flex align-items-center gap-2"
                  onClick={handleExport}
                  disabled={!selectedMonth || !selectedYear}
                  style={{ borderRadius: '10px' }}
                >
                  <FiDownload size={18} />
                  Export
                </button>
                <button 
                  className="btn btn-outline-info d-flex align-items-center gap-2"
                  onClick={handleShare}
                  disabled={!selectedMonth || !selectedYear}
                  style={{ borderRadius: '10px' }}
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
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    {Object.keys(selectedDocuments).map((key) => (
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
                        />
                        <label className="form-check-label" htmlFor={key}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      onClick={handlePrintSelected}
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
                    {Object.keys(selectedDocuments).map((key) => (
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
                        />
                        <label className="form-check-label" htmlFor={`export-${key}`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      onClick={handleExportSelected}
                    >
                      <FiDownload size={18} />
                      Export as {exportFormat.toUpperCase()}
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
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={handleCopyLink}
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
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary flex-grow-1"
                      onClick={handleApplyFilter}
                      disabled={!selectedMonth || !selectedYear || loading}
                      style={{ borderRadius: '10px' }}
                    >
                      {loading ? 'Loading...' : 'Apply Filter'}
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={handleResetFilter}
                      style={{ borderRadius: '10px' }}
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

              {/* Error Display */}
              {error && (
                <div className="mt-3 alert alert-danger py-2">
                  <small>{error}</small>
                </div>
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="mt-3 text-center">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="ms-2 small">Fetching attendance data...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Documents Container */}
        <div ref={documentsContainerRef}>
          {/* Components with refs for printing/exporting */}
          <div ref={coverLetterRef}>
            <CoverLetter 
              month={selectedMonth} 
              year={selectedYear}
              clientId={clientId}
              clientType={clientType}
              profileData={profileData}
            />
          </div>
          
          <div ref={attendanceSheetRef}>
            <AttendanceSheet 
              month={selectedMonth} 
              year={selectedYear}
              clientId={clientId}
              clientType={clientType}
              attendanceData={attendanceData}
              filteredData={filteredData}
              loading={loading}
              error={error}
            />
          </div>

          <div ref={gstDesignRef}>
            <GstDesign />
          </div>
          
          <div ref={wagesSheetEmployeeRef}>
            <WagesSheetEmployee attendanceData={attendanceData} />
          </div>
          
          <div ref={wagesSheetEmployerRef}>
            <WagesSheetEmployer attendanceData={attendanceData} />
          </div>
        </div>
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
    </Suspense>
  )
}

export default Page