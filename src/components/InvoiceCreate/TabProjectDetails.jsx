import React, { useEffect, useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import useDatePicker from '@/hooks/useDatePicker'
import useJoditConfig from '@/hooks/useJoditConfig'

const TabProjectDetails = ({
  clientType,
  selectedClient,
  setSelectedClient,
  selectedConsignee,
  setSelectedConsignee
}) => {

  const [clients, setClients] = useState([])
  const [consignees, setConsignees] = useState([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [loadingConsignees, setLoadingConsignees] = useState(false)

  const { setStartDate } = useDatePicker()
  useJoditConfig()

  useEffect(() => {
    setStartDate(new Date())
    const companyId = localStorage.getItem('selected_company')

    if (clientType && companyId) {
      fetchClients(clientType, companyId)
    }
  }, [clientType])

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
          label: c.contract_no || `Client ${c.id}`
        }))

        setClients(options)

        if (options.length === 1) {
          setSelectedClient(options[0])
          // fetchConsignees(options[0].value)
        }
      }
    } finally {
      setLoadingClients(false)
    }
  }



  const handleClientSelect = (option) => {
    setSelectedClient(option)
    // setSelectedConsignee(null)
    // if (option?.value) fetchConsignees(option.value)
  }

  return (
    <section className="step-body mt-4 body current stepChange">
      <div className="row">

        <div className="col-lg-3 mb-4">
          <label>Select Client *</label>
          <SelectDropdown
            options={clients}
            selectedOption={selectedClient}
            defaultSelect={loadingClients ? "Loading..." : "Select Client"}
            onSelectOption={handleClientSelect}
          />
        </div>

      </div>
    </section>
  )
}

export default TabProjectDetails
