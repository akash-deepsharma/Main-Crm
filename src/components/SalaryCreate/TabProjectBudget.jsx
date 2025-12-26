import React, { useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

const TabProjectBudget = ({ error, setError }) => {

    // MULTIPLE CONSIGNEES
    const [consignees, setConsignees] = useState([
        {
            id: 1,
            items: [],
            modalOpen: false,
            modalData: {
                designation: "",
                experience: "",
                qualification: "",
                skill: "",
                resources: ""
            }
        }
    ]);

    // Add New Consignee Block
    const addConsignee = (e) => {
        e.preventDefault();

        setConsignees(prev => [
            ...prev,
            {
                id: prev.length + 1,
                items: [],
                modalOpen: false,
                modalData: {
                    designation: "",
                    experience: "",
                    qualification: "",
                    skill: "",
                    resources: ""
                }
            }
        ]);
    };

    // DELETE CONSIGNEE
const deleteConsignee = (consigneeId, e) => {
    e.preventDefault();

    setConsignees(prev => prev.filter(c => c.id !== consigneeId));
};

    // Open modal for specific consignee
    const openModal = (consigneeId, e) => {
        e.preventDefault();

        setConsignees(prev =>
            prev.map(c =>
                c.id === consigneeId
                    ? { ...c, modalOpen: true }
                    : c
            )
        );
    };

    // Close modal
    const closeModal = (consigneeId) => {
        setConsignees(prev =>
            prev.map(c =>
                c.id === consigneeId
                    ? { ...c, modalOpen: false }
                    : c
            )
        );
    };

    // Update modal input
    const updateModalField = (consigneeId, field, value) => {
        setConsignees(prev =>
            prev.map(c =>
                c.id === consigneeId
                    ? { ...c, modalData: { ...c.modalData, [field]: value } }
                    : c
            )
        );
    };

    // Submit designation → Add to specific consignee
    const submitDesignation = (consigneeId) => {
        setConsignees(prev =>
            prev.map(c => {
                if (c.id !== consigneeId) return c;

                const data = c.modalData;

                if (!data.designation || !data.skill) {
                    alert("Please fill required fields");
                    return c;
                }

                const newItem = {
                    id: c.items.length + 1,
                    designation: data.designation,
                    experience: data.experience,
                    qualification: data.qualification,
                    skill: data.skill,
                    resources: data.resources
                };

                return {
                    ...c,
                    items: [...c.items, newItem],
                    modalData: {
                        designation: "",
                        experience: "",
                        qualification: "",
                        skill: "",
                        resources: ""
                    },
                    modalOpen: false
                };
            })
        );
    };

    // Delete Row for specific consignee
    const deleteRow = (consigneeId, rowId) => {
        setConsignees(prev =>
            prev.map(c =>
                c.id === consigneeId
                    ? { ...c, items: c.items.filter(item => item.id !== rowId) }
                    : c
            )
        );
    };


    return (
        <section className="step-body mt-4 body current stepChange">
            <form id="project-budgets">

                {consignees.map((consignee) => (
                    <fieldset key={consignee.id} > 
                        <fieldset>

                            {/* HEADER */}
                            <div className="mb-5">
                                <h2 className="fs-16 fw-bold">Consignee Details</h2>
                                <p className="text-muted">Consignee details go here</p>
                            </div>

                            {/* CONSIGNEE FORM */}
                            <fieldset>
                                <div className='row'>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Consignee Name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Designation <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Contact No <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Email <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">GSTIN <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                        <label className="form-label">Address <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required />
                                    </div>

                                    <div className="col-xl-3 col-lg-4 col-md-6 mb-4 d-flex justify-content-start gap-2 mt-5">
                                        <button className="btn btn-md btn-primary"
                                            onClick={(e) => openModal(consignee.id, e)}>
                                            Create Designation
                                        </button>
                                    </div>

                                </div>
                            </fieldset>

                            {/* ERROR LABEL */}
                            {error &&
                                <label className="error"><FiAlertTriangle /> This field is required.</label>
                            }

                            {/* TABLE */}
                            <fieldset>
                                <div className="col-12">
                                    <div className="card stretch stretch-full proposal-table">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="mb-4">
                                                        <h5 className="fw-bold">Add Designation:</h5>
                                                        <span className="fs-12 text-muted">Add Designation to Consignee</span>
                                                    </div>

                                                    <div className="table-responsive">
                                                        <table className="table table-bordered overflow-hidden" id="tab_logic">
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-center">#</th>
                                                                    <th className="text-center">Designation</th>
                                                                    <th className="text-center">Skill</th>
                                                                    <th className="text-center">Qualification</th>
                                                                    <th className="text-center">Experience (Years)</th>
                                                                    <th className="text-center">Hired Resources</th>
                                                                    <th className="text-center">Action</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {consignee.items.map((item) => (
                                                                    <tr key={item.id}>
                                                                        <td>{item.id}</td>
                                                                        <td>{item.designation}</td>
                                                                        <td>{item.skill}</td>
                                                                        <td>{item.qualification}</td>
                                                                        <td>{item.experience}</td>
                                                                        <td>{item.resources}</td>
                                                                        <td>
                                                                            <button
                                                                                className="btn btn-md bg-soft-danger text-danger"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    deleteRow(consignee.id, item.id);
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>

                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                        </fieldset>

                        {/* MODAL */}
                        {consignee.modalOpen && (
                            <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content">

                                        <div className="modal-header">
                                            <h5 className="modal-title">Create Designation</h5>
                                            <button type="button" className="btn-close" onClick={() => closeModal(consignee.id)}></button>
                                        </div>

                                        <div className="modal-body row g-3">

                                            <div className="col-md-6">
                                                <label className="form-label">Designation</label>
                                                <input type="text" className="form-control"
                                                    value={consignee.modalData.designation}
                                                    onChange={(e) => updateModalField(consignee.id, "designation", e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Qualification</label>
                                                <input type="text" className="form-control"
                                                    value={consignee.modalData.qualification}
                                                    onChange={(e) => updateModalField(consignee.id, "qualification", e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Skill</label>
                                                <select className="form-control"
                                                    value={consignee.modalData.skill}
                                                    onChange={(e) => updateModalField(consignee.id, "skill", e.target.value)}
                                                >
                                                    <option value="">Select Skill</option>
                                                    <option value="Semi Skilled">Semi-skilled</option>
                                                    <option value="Skilled">Skilled</option>
                                                    <option value="Unskilled">Unskilled</option>
                                                </select>
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Experience in Years</label>
                                                <input type="number" className="form-control"
                                                    value={consignee.modalData.experience}
                                                    onChange={(e) => updateModalField(consignee.id, "experience", e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Hired Resources</label>
                                                <input type="number" className="form-control"
                                                    value={consignee.modalData.resources}
                                                    onChange={(e) => updateModalField(consignee.id, "resources", e.target.value)}
                                                />
                                            </div>

                                        </div>

                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" onClick={() => closeModal(consignee.id)}>Cancel</button>
                                            <button className="btn btn-primary" onClick={() => submitDesignation(consignee.id)}>Submit</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}

                    </fieldset>
                ))}

                {/* ADD/REMOVE CONSIGNEE BUTTON */}
                <div className="d-flex justify-content-end gap-2 mt-3">
                     {consignees.length > 1 && (
        <div className="d-flex justify-content-end ">
            <button className="btn btn-md bg-soft-danger text-danger"
                onClick={(e) => {e.preventDefault(); setConsignees(prev => prev.slice(0, prev.length - 1));}} >Delete Consignee</button>
        </div>
    )}
                    <button className="btn btn-md btn-primary" onClick={addConsignee}> + Add Consignee </button>
                </div>

            </form>
        </section>
    );
};

export default TabProjectBudget;
