'use client'
import React, { useEffect, useRef, useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const TabProjectDetails = ({ formData }) => {

  /* ================= STATES ================= */
  const [clients, setClients] = useState([])
  const [designations, setDesignations] = useState([])

  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedDesignation, setSelectedDesignation] = useState(null)

  const [oldBasic, setOldBasic] = useState('')
  const [newBasic, setNewBasic] = useState('')

  const [loadingClients, setLoadingClients] = useState(false)
  const [loadingDesignations, setLoadingDesignations] = useState(false)

  /* ================= DATE PICKER ================= */
  const [openPicker, setOpenPicker] = useState(false)
  const pickerRef = useRef(null)
  const inputRef = useRef(null)

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  /* ================= CLOSE DATE PICKER ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpenPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* ================= FETCH CLIENTS ================= */
  useEffect(() => {
    const companyId = localStorage.getItem('selected_company')
    if (formData?.projectType && companyId) {
      fetchClients(formData.projectType, companyId)
    }
  }, [formData?.projectType])

  const fetchClients = async (type, companyId) => {
    try {
      setLoadingClients(true)
      const token = localStorage.getItem('token')

      const res = await fetch(
        `https://green-owl-255815.hostingersite.com/api/client/empl/view?client_type=${type}&company_id=${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const result = await res.json()

      if (result?.status && Array.isArray(result.data)) {
        const options = result.data.map(c => ({
          value: c.id,
          label: c.contract_no || `Client ${c.id}`,
        }))
        setClients(options)
      } else {
        setClients([])
      }
    } finally {
      setLoadingClients(false)
    }
  }

  /* ================= FETCH DESIGNATIONS ================= */
  const fetchDesignations = async (clientId) => {
    try {
      setLoadingDesignations(true)
      const token = localStorage.getItem('token')

      const res = await fetch(
        `https://green-owl-255815.hostingersite.com/api/client-designation?client_id=${clientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const result = await res.json()

      if (result?.status && Array.isArray(result.data)) {
        const options = result.data.map(d => ({
          value: d.id,
          label: d.name || `Designation ${d.id}`,
        }))
        setDesignations(options)
      } else {
        setDesignations([])
      }
    } finally {
      setLoadingDesignations(false)
    }
  }

  /* ================= HANDLERS ================= */
  const handleClientSelect = (option) => {
    setSelectedClient(option)
    setSelectedDesignation(null)
    setDesignations([])

    if (option?.value) {
      fetchDesignations(option.value)
    }
  }

  const getMonthYear = (date) => ({
    month: date.toLocaleString('default', { month: 'long' }),
    year: date.getFullYear(),
  })

  /* ================= SUBMIT API ================= */
  const handleSubmit = async () => {
    if (!selectedClient || !selectedDesignation) {
      alert('Client & Designation required')
      return
    }

    const token = localStorage.getItem('token')
    const from = getMonthYear(range[0].startDate)
    const to = getMonthYear(range[0].endDate)

    const payload = {
      client_id: selectedClient.value,
      designation_id: selectedDesignation.value,
      from_month: from.month,
      from_year: from.year,
      to_month: to.month,
      to_year: to.year,
      old_basic: Number(oldBasic),
      new_basic: Number(newBasic),
      type: 'designation',
    }

    console.log('PAYLOAD 👉', payload)

    try {
      const res = await fetch(
        'https://green-owl-255815.hostingersite.com/api/create/arrear',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const result = await res.json()

      if (result?.status) {
        alert('Arrear Created Successfully ✅')
      } else {
        alert(result?.message || 'Error')
      }
    } catch (err) {
      console.error(err)
      alert('Server Error')
    }
  }

  /* ================= UI ================= */
  return (
    <section className="step-body mt-4 body current stepChange h-100">
      <div className="row">

        {/* Client */}
        <div className="col-lg-3 mb-4">
          <label>Select Client *</label>
          <SelectDropdown
            options={clients}
            selectedOption={selectedClient}
            defaultSelect={loadingClients ? 'Loading...' : 'Select Client'}
            onSelectOption={handleClientSelect}
          />
        </div>

        {/* Designation */}
        <div className="col-lg-3 mb-4">
          <label>Select Designation *</label>
          <SelectDropdown
            options={designations}
            selectedOption={selectedDesignation}
            defaultSelect={loadingDesignations ? 'Loading...' : 'Select Designation'}
            onSelectOption={setSelectedDesignation}
            isDisabled={!selectedClient}
          />
        </div>

        {/* Date */}
        <div className="col-lg-3 mb-4" style={{ position: 'relative', zIndex: 9999 }}>
          <label>Select Month From – To *</label>
          <input
            ref={inputRef}
            readOnly
            className="form-control"
            value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
            onClick={() => setOpenPicker(true)}
          />

          {openPicker && (
            <div ref={pickerRef} className="bg-white shadow p-2 rounded">
              <DateRange
                editableDateInputs
                moveRangeOnFirstSelection={false}
                ranges={range}
                onChange={(item) => setRange([item.selection])}
              />
              <button className="btn btn-primary w-100 mt-2" onClick={() => setOpenPicker(false)}>
                Done
              </button>
            </div>
          )}
        </div>

        {/* Old Basic */}
        <div className="col-lg-3 mb-4">
          <label>Old Basic *</label>
          <input
            type="number"
            className="form-control"
            value={oldBasic}
            onChange={(e) => setOldBasic(e.target.value)}
          />
        </div>

        {/* New Basic */}
        <div className="col-lg-3 mb-4">
          <label>New Basic *</label>
          <input
            type="number"
            className="form-control"
            value={newBasic}
            onChange={(e) => setNewBasic(e.target.value)}
          />
        </div>

        <div className="col-lg-3 mb-4 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleSubmit}>
            Create Arrear
          </button>
        </div>

      </div>
    </section>
  )
}

export default TabProjectDetails
