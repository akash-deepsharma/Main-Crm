import React, { useEffect, useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import MultiSelectTags from '@/components/shared/MultiSelectTags';
import DatePicker from 'react-datepicker';
import useDatePicker from '@/hooks/useDatePicker';
import useJoditConfig from '@/hooks/useJoditConfig';
import JoditEditor from 'jodit-react';

const TabProjectDetails = () => {

    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedConsignee, setSelectedConsignee] = useState(null);

    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const config = useJoditConfig()
    const [value, setValue] = useState('');

    useEffect(() => {
        setStartDate(new Date())
        setValue(`
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        `)
    }, []);

   const Clients = [
    { value: "Select Client", label: "Select Client", color: "#3454d1" },
    { value: "Client One", label: "Client One", color: "#3454d1" },
    { value: "Client Two", label: "Client Two", color: "#41b2c4" },
    { value: "Client Three", label: "Client Three", color: "#ea4d4d" },
    { value: "Client Four", label: "Client Four", color: "#ffa21d" },
    { value: "Client Five", label: "Client Five", color: "#17c666" },
];
    

    return (
        <section className="step-body mt-4 body current stepChange h-100">
            <form id="project-details">
                <fieldset>

                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Select Client</h2>
                        <p className="text-muted">Client details go here.</p>
                    </div>

                    <fieldset>
                        <div className="row mb-5 pb-5">

                            

                            {/* Select Client */}
                            <div className="col-lg-3 mb-4">
                                <label className="fw-semibold text-dark">
                                    Select Client <span className="text-danger">*</span>
                                </label>

                                <SelectDropdown
                                    options={Clients}
                                    selectedOption={selectedClient}
                                    defaultSelect="Select Client"
                                    onSelectOption={(opt) => setSelectedClient(opt)}
                                />
                            </div>


                        </div>
                    </fieldset>

                </fieldset>
            </form>
        </section>
    )
}

export default TabProjectDetails
