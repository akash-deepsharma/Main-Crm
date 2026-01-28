import { useRouter } from "next/navigation";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { FiAlertTriangle } from "react-icons/fi";
const API_BASE = 'https://green-owl-255815.hostingersite.com/api'
const TabProjectBudget = forwardRef(({ clientId, error, setError }, ref) => {


// const isValidContact = (value) => /^[6-9]\d{9}$/.test(value);
const isValidContact = (value) => {
  if (!value) return false;
  return /^\d{10}$/.test(value.trim());
};

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidGSTIN = (value) =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.trim());


  // MULTIPLE CONSIGNEES
  const [consignees, setConsignees] = useState([
    {
      id: '',
      items: [],
      modalOpen: false,
        editingRowId: null,
      modalData: {
        designation: "",
        experience: "",
        qualification: "",
        skill: "",
        resources: "",
      },
    },
  ]);

  const editRow = (consigneeId, row) => {
  setConsignees(prev =>
    prev.map(c =>
      c.id === consigneeId
        ? {
            ...c,
            modalOpen: true,
            editingRowId: row.id,
            modalData: {
              designation: row.designation,
              experience: row.experience,
              qualification: row.qualification,
              skill: row.skill,
              resources: row.resources,
            },
          }
        : c
    )
  );
};

  // Add New Consignee Block
 const addConsignee = (e) => {
  e.preventDefault();

  setConsignees(prev => [
    ...prev,
    {
      id: `tmp-${Date.now()}`, // UI only
      isNew: true,            // ✅ IMPORTANT
      items: [],
      modalOpen: false,
      editingRowId: null,
      modalData: {
        designation: "",
        experience: "",
        qualification: "",
        skill: "",
        resources: "",
      },
    },
  ]);
};


  // DELETE CONSIGNEE
  const deleteConsignee = (consigneeId, e) => {
    e.preventDefault();

    setConsignees((prev) => prev.filter((c) => c.id !== consigneeId));
  };

  // Open modal for specific consignee
  const openModal = (consigneeId, e) => {
    e.preventDefault();

    setConsignees((prev) =>
      prev.map((c) => (c.id === consigneeId ? { ...c, modalOpen: true } : c))
    );
  };

  // Close modal
  const closeModal = (consigneeId) => {
    setConsignees((prev) =>
      prev.map((c) => (c.id === consigneeId ? { ...c, modalOpen: false } : c))
    );
  };

  // Update modal input
  const updateModalField = (consigneeId, field, value) => {
    setConsignees((prev) =>
      prev.map((c) =>
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
        alert("Designation and Skill are required");
        return c;
      }

      // ✏️ EDIT MODE
      if (c.editingRowId) {
        return {
          ...c,
          items: c.items.map(item =>
            item.id === c.editingRowId
              ? { ...item, ...data }
              : item
          ),
          modalOpen: false,
          editingRowId: null,
          modalData: {
            designation: "",
            experience: "",
            qualification: "",
            skill: "",
            resources: "",
          },
        };
      }

      // ➕ ADD MODE
      return {
        ...c,
        // items: [
        //   ...c.items,
        //   {
        //     id: c.items.length + 1,
        //     ...data,
        //   },
        // ],
        items: [
    ...c.items,
    {
      id: `tmp-${Date.now()}`, // UI key only
      isNew: true,             // ✅ IMPORTANT
      ...data,
    },
  ],
        modalOpen: false,
        modalData: {
          designation: "",
          experience: "",
          qualification: "",
          skill: "",
          resources: "",
        },
      };
    })
  );
};


  // Delete Row for specific consignee
  const deleteRow = (consigneeId, rowId) => {
    setConsignees((prev) =>
      prev.map((c) =>
        c.id === consigneeId
          ? { ...c, items: c.items.filter((item) => item.id !== rowId) }
          : c
      )
    );
  };

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const client_id = localStorage.getItem("client_id");


  const updateConsigneeField = (id, field, value) => {
  setConsignees(prev =>
    prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    )
  );
};

  useEffect(() => {
    const company_id = localStorage.getItem("selected_company");

    if (!company_id) {
      alert("Company not selected");
      router.replace("/company");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ called by parent via ref
const handleSaveAndNext = async () => {
    if (!validateBeforeSubmit()) return false;
  try {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Auth error");
      return false;
    }

    const payload = {
  client_id: client_id || null,
  consignees: consignees.map(c => {
    const consigneePayload = {
      consignee_name: c.consignee_name,
      consigness_designation: c.consigness_designation,
      consignee_contact_no: c.consignee_contact_no,
      consignee_email: c.consignee_email,
      consignee_gstin: c.consignee_gstin,
      consignee_addess: c.consignee_addess,
      dealing_contact: c.dealing_contact,
      dealing_designation: c.dealing_designation,
      dealing_hand_name: c.dealing_hand_name,
      dealing_email: c.dealing_email,

      designations: c.items.map(item => {
        const d = {
          name: item.designation,
          skill: item.skill,
          qualification: item.qualification,
          experience_in_years: item.experience,
          hire_employee: item.resources,
          type: item.skill,
        };

        // ✅ only existing designation
        if (!item.isNew) {
          d.id = item.id;
        }

        return d;
      }),
    };

    // ✅ only existing consignee
    if (!c.isNew) {
      consigneePayload.id = c.id;
    }

    return consigneePayload;
  }),
};


    const response = await fetch(`${API_BASE}/create/client/consignee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("consignees data result",result)

    if (!result?.status) {
      throw new Error(result.message || "Failed to save settings");
    }

    localStorage.setItem("Consignee", JSON.stringify({ consignees }));

    return true;
  } catch (err) {
    alert(err.message);
    return false;
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  const saved = localStorage.getItem("Consignee");

  if (saved) {
    const parsed = JSON.parse(saved);

    if (parsed?.consignees?.length) {
      // setConsignees(parsed.consignees);
      setConsignees(
  parsed.consignees.map(c => ({
    ...c,
    isNew: false, // ✅ existing
    items: (c.items || []).map(d => ({
      ...d,
      isNew: false, // ✅ existing designation
    })),
  }))
);
    }
  }
}, []);

const validateBeforeSubmit = () => {
  for (let c of consignees) {
    if (
      !c.consignee_name ||
      !c.consignee_contact_no ||
      !c.consignee_email ||
        !c.consignee_gstin
    ) {
      alert("Please fill all required consignee fields");
      return false;
    }

    // Contact validation
    if (!isValidContact(c.consignee_contact_no)) {
      alert("Invalid Contact Number (must be 10 digits)");
      return false;
    }

    // Email validation
    if (!isValidEmail(c.consignee_email)) {
      alert("Invalid Email Address");
      return false;
    }

    // GSTIN validation
    if (!isValidGSTIN(c.consignee_gstin)) {
      alert("Invalid GSTIN Number");
      return false;
    }

    // At least one designation
    if (!c.items || c.items.length === 0) {
      alert("Please add at least one designation");
      return false;
    }
    if (
  !c.dealing_hand_name ||
  !c.dealing_designation ||
  !c.dealing_contact ||
  !c.dealing_email
) {
  alert("Please fill all Dealing Hand details");
  return false;
}
if (!isValidContact(c.dealing_contact)) {
  alert("Invalid Dealing Contact Number");
  return false;
}

if (!isValidEmail(c.dealing_email)) {
  alert("Invalid Dealing Email Address");
  return false;
}
  }
  return true;
};

  // ✅ expose submit
  useImperativeHandle(ref, () => ({
    submit: handleSaveAndNext,
  }));

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-budgets">
        {consignees.map((consignee) => (
          <fieldset key={consignee.id}>
            <fieldset>
              {/* HEADER */}
              <div className="mb-5">
                <h2 className="fs-16 fw-bold">Consignee Details</h2>
                <p className="text-muted">Consignee details go here</p>
              </div>

              {/* CONSIGNEE FORM */}
              <fieldset>
                <div className="row">
                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Consignee Name <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        className="form-control"
                        value={consignee.consignee_name}
                        onChange={(e) =>
                            updateConsigneeField(consignee.id,"consignee_name",e.target.value )
                        }
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Designation <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        className="form-control"
                        value={consignee.consigness_designation}
                        onChange={(e) =>
                            updateConsigneeField(
                            consignee.id,
                            "consigness_designation",
                            e.target.value
                            )
                        }
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Contact No <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        className="form-control"
                        maxLength={10}
                        value={consignee.consignee_contact_no || ""}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            updateConsigneeField(consignee.id, "consignee_contact_no", val);
                        }}
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="email"
                        className="form-control"
                        value={consignee.consignee_email}
                        onChange={(e) =>
                            updateConsigneeField(
                            consignee.id,
                            "consignee_email",
                            e.target.value
                            )
                        }
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      GSTIN <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        className="form-control"
                        maxLength={15}
                        value={consignee.consignee_gstin}
                         onChange={(e) =>
                            updateConsigneeField(
                            consignee.id,
                            "consignee_gstin",
                            e.target.value.toUpperCase()
                            )
                        }
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        className="form-control"
                        value={consignee.consignee_addess}
                        onChange={(e) =>
                            updateConsigneeField(
                            consignee.id,
                            "consignee_addess",
                            e.target.value
                            )
                        }
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4 d-flex justify-content-start gap-2 mt-5">
                    <button
                      className="btn btn-md btn-primary"
                      onClick={(e) => openModal(consignee.id, e)}
                    >
                      Create Designation
                    </button>
                  </div>
                </div>
              </fieldset>
              <div className="mb-3">
                <h2 className="fs-16 fw-bold">Dealing Hand Details</h2>
                <p className="text-muted">Dealing details go here</p>
              </div>
              <fieldset>
                <div className="row">
                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Dealing Hand Name <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        className="form-control"
                        value={consignee.dealing_hand_name}
                        onChange={(e) =>
                            updateConsigneeField(
                            consignee.id,
                            "dealing_hand_name",
                            e.target.value
                            )
                        }
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Designation <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        className="form-control"
                        value={consignee.dealing_designation}
                        onChange={(e) =>
                            updateConsigneeField(
                            consignee.id,
                            "dealing_designation",
                            e.target.value
                            )
                        }
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Contact No <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="text"
                        maxLength={10}
                        className="form-control"
                        value={consignee.dealing_contact}
                         onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            updateConsigneeField(consignee.id, "dealing_contact", val);
                        }}
                        required
                        />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    {/* <input type="text" className="form-control" required /> */}
                    <input
                        type="email"
                        className="form-control"
                        value={consignee.dealing_email || "" }
                        onChange={(e) =>
                            updateConsigneeField(
                            consignee.id,
                            "dealing_email",
                            e.target.value
                            )
                        }
                        required
                        />
                  </div>
                </div>
              </fieldset>

              {/* ERROR LABEL */}
              {error && (
                <label className="error">
                  <FiAlertTriangle /> This field is required.
                </label>
              )}

              {/* TABLE */}
              <fieldset>
                <div className="col-12">
                  <div className="card stretch stretch-full proposal-table">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mb-4">
                            <h5 className="fw-bold">Add Designation:</h5>
                            <span className="fs-12 text-muted">
                              Add Designation to Consignee
                            </span>
                          </div>

                          <div className="table-responsive">
                            <table
                              className="table table-bordered overflow-hidden"
                              id="tab_logic"
                            >
                              <thead>
                                <tr>
                                  <th className="text-center">#</th>
                                  <th className="text-center">Designation</th>
                                  <th className="text-center">Skill</th>
                                  <th className="text-center">Qualification</th>
                                  <th className="text-center">
                                    Experience (Years)
                                  </th>
                                  <th className="text-center">
                                    Hired Resources
                                  </th>
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
                                    <td className="border-0">
                                      <div className="d-flex gap-2   ">
                                      <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            editRow(consignee.id, item);
                                        }}
                                        >
                                        Edit
                                        </button>
                                        <button
                                        className="btn btn-md bg-soft-danger text-danger"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          deleteRow(consignee.id, item.id);
                                        }}
                                      >
                                        Delete
                                      </button>
                                      </div>
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
              <div
                className="modal fade show d-block"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Create Designation</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => closeModal(consignee.id)}
                      ></button>
                    </div>

                    <div className="modal-body row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Designation</label>
                        <input
                          type="text"
                          className="form-control"
                          value={consignee.modalData.designation}
                          onChange={(e) =>
                            updateModalField(
                              consignee.id,
                              "designation",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Qualification</label>
                        <input
                          type="text"
                          className="form-control"
                          value={consignee.modalData.qualification}
                          onChange={(e) =>
                            updateModalField(
                              consignee.id,
                              "qualification",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Skill</label>
                        <select
                          className="form-control"
                          value={consignee.modalData.skill}
                          onChange={(e) =>
                            updateModalField(
                              consignee.id,
                              "skill",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Skill</option>
                          <option value="Semi Skilled">Semi-skilled</option>
                          <option value="Skilled">Skilled</option>
                          <option value="Unskilled">Unskilled</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">
                          Experience in Years
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={consignee.modalData.experience}
                          onChange={(e) =>
                            updateModalField(
                              consignee.id,
                              "experience",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Hired Resources</label>
                        <input
                          type="number"
                          className="form-control"
                          value={consignee.modalData.resources}
                          onChange={(e) =>
                            updateModalField(
                              consignee.id,
                              "resources",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => closeModal(consignee.id)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => submitDesignation(consignee.id)}
                      >
                        Submit
                      </button>
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
              <button
                className="btn btn-md bg-soft-danger text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  setConsignees((prev) => prev.slice(0, prev.length - 1));
                }}
              >
                Delete Consignee
              </button>
            </div>
          )}
          <button className="btn btn-md btn-primary" onClick={addConsignee}>
            {" "}
            + Add Consignee{" "}
          </button>
        </div>
      </form>
    </section>
  );
});

export default TabProjectBudget;
