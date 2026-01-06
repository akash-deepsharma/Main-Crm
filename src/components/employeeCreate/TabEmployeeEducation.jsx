"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import SelectDropdown from "../shared/SelectDropdown";
import { QualificationOptions } from "@/utils/options";
import { useRouter } from "next/navigation";

const API_BASE = "https://green-owl-255815.hostingersite.com/api";

const TabEmployeeEducation = forwardRef((props, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [educations, setEducations] = useState([
    {
      id: 1,
      qualification: null,
      year: "",
      marksheet: null,
      qualificationType: "10th",
    },
  ]);

  const [nextId, setNextId] = useState(2);

  /* =========================
     Helpers
  ========================== */

  const getAvailableOptions = (currentId) => {
    const used = educations
      .filter((e) => e.id !== currentId && e.qualification)
      .map((e) => e.qualification.value);

    return QualificationOptions.filter(
      (opt) => !used.includes(opt.value)
    );
  };

  /* =========================
     Field Handlers
  ========================== */

  const addEducationField = () => {
    if (getAvailableOptions(null).length === 0) {
      alert("All qualifications have been used");
      return;
    }

    setEducations((prev) => [
      ...prev,
      {
        id: nextId,
        qualification: null,
        year: "",
        marksheet: null,
        qualificationType: "Select Qualification",
      },
    ]);

    setNextId((prev) => prev + 1);
  };

  const removeEducationField = (id) => {
    if (educations.length === 1) {
      alert("At least one education entry is required");
      return;
    }
    setEducations((prev) => prev.filter((e) => e.id !== id));
  };

  const handleQualificationChange = (id, option) => {
    setEducations((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              qualification: option,
              qualificationType: option?.label || "Select Qualification",
            }
          : e
      )
    );
  };

  const handleYearChange = (id, value) => {
    setEducations((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, year: value } : e
      )
    );
  };

  const handleFileChange = (id, file) => {
    setEducations((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, marksheet: file } : e
      )
    );
  };

  /* =========================
     SUBMIT (FormData + JSON)
  ========================== */

  const handleSaveEducation = async () => {
    const token = localStorage.getItem("token");
    const employeeId = sessionStorage.getItem("employee_id");

    if (!token || !employeeId) {
      alert("Employee not found. Complete step 1 first.");
      router.replace("/employee");
      return false;
    }

    try {
      setLoading(true);

      // Clean JSON payload
      const educationPayload = educations.map((edu) => ({
        qualification: edu.qualification?.value || null,
        year: edu.year || null,
      }));

      const formData = new FormData();

      formData.append("employee_id", employeeId);
      formData.append("step", "2");
      formData.append(
        "educations",
        JSON.stringify(educationPayload)
      );

      // Append files
      educations.forEach((edu, index) => {
        if (edu.marksheet) {
          formData.append(
            `marksheets[${index}]`,
            edu.marksheet
          );
        }
      });
      
      const response = await fetch(
          `${API_BASE}/employee/store`,
          {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );
        
        const result = await response.json();
        
        console.log("rssult education ", result)
      if (result?.status === true) {
        console.log("Education saved successfully", result);
        return true;
      } else {
        throw new Error(result?.message || "Save failed");
      }
    } catch (err) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Expose submit() to parent
  ========================== */

  useImperativeHandle(ref, () => ({
    submit: handleSaveEducation,
  }));

  /* =========================
     UI
  ========================== */

  return (
    <section className="step-body mt-4 body current stepChange">
      <form>
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Education Details</h2>
            <p className="text-muted">
              Employee education details go here.
            </p>
          </div>

          {educations.map((edu, index) => (
            <div className="row" key={edu.id}>
              <div className="col-xl-4 col-md-6 mb-4">
                <label className="form-label">
                  {edu.qualificationType}
                </label>
                <SelectDropdown
                  options={getAvailableOptions(edu.id)}
                  selectedOption={edu.qualification}
                  defaultSelect={edu.qualificationType}
                  onSelectOption={(opt) =>
                    handleQualificationChange(edu.id, opt)
                  }
                />
              </div>

              <div className="col-xl-4 col-md-6 mb-4">
                <label className="form-label">
                  Qualification Year
                </label>
                <input
                  className="form-control"
                  value={edu.year}
                  onChange={(e) =>
                    handleYearChange(edu.id, e.target.value)
                  }
                />
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <label className="form-label">
                  Upload Marksheet
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    handleFileChange(
                      edu.id,
                      e.target.files[0]
                    )
                  }
                />
              </div>

              <div className="col-xl-1 mb-4 d-flex align-items-end">
                {index === educations.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={addEducationField}
                  >
                    +
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      removeEducationField(edu.id)
                    }
                  >
                    −
                  </button>
                )}
              </div>
            </div>
          ))}
        </fieldset>
      </form>

      {loading && <p>Saving education...</p>}
    </section>
  );
});

export default TabEmployeeEducation;
