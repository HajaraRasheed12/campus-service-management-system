import { useState } from "react";
import {
  ArrowLeft,
  Send,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Copy,
} from "lucide-react";

import campusImage from "../assets/lbs-campus.jpg";
import lbsLogo from "../assets/logo.png";

import "./Complaint.css";

function Complaint() {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [category, setCategory] = useState("");
  const [regarding, setRegarding] = useState("");
  const [complaint, setComplaint] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !studentName.trim() ||
      !studentId.trim() ||
      !category ||
      !complaint.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (category === "Other" && !regarding.trim()) {
      alert("Please enter what the complaint is regarding.");
      return;
    }

    const newComplaint = {
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      category,
      regarding: category === "Other" ? regarding.trim() : "",
      description: complaint.trim(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComplaint),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint.");
      }

      setComplaintId(data.complaint.id);
      setSubmitted(true);
    } catch (error) {
      console.error("Complaint submission error:", error);
      alert("Unable to submit complaint. Please try again.");
    }
  };

  const copyComplaintId = () => {
    navigator.clipboard.writeText(complaintId);
    alert("Complaint ID copied!");
  };

  const goHome = () => {
    window.location.href = "/";
  };

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (submitted) {
    return (
      <div className="complaint-page">
        <main className="complaint-main">
          <div className="complaint-card success-card">
            <CheckCircle
              size={85}
              className="success-icon"
            />

            <h1>
              Complaint Submitted Successfully!
            </h1>

            <div className="form-divider">
              <span></span>
              <b>✦</b>
              <span></span>
            </div>

            <p className="success-message">
              Thank you for bringing this issue to our attention.
            </p>

            <div className="complaint-id-box">
              <p>
                Your Complaint ID
              </p>

              <div className="complaint-id-row">
                <strong>
                  {complaintId}
                </strong>

                <button
                  type="button"
                  className="copy-id-btn"
                  onClick={copyComplaintId}
                  title="Copy Complaint ID"
                >
                  <Copy size={19} />
                </button>
              </div>
            </div>

            <p className="id-note">
              Please save this Complaint ID. You will need it
              to track the status of your complaint.
            </p>

            <button
              type="button"
              className="submit-btn"
              onClick={goHome}
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // COMPLAINT FORM
  // =========================

  return (
    <div className="complaint-page">

      {/* HEADER */}

      <header
        className="complaint-header"
        style={{
          backgroundImage: `url(${campusImage})`,
        }}
      >
        <div className="header-overlay"></div>

        <div className="header-content">

          <div className="college-brand">

            <img
              src={lbsLogo}
              alt="LBS Institute of Technology for Women Logo"
              className="complaint-logo"
            />

            <div className="college-info">

              <h2>
                LBS INSTITUTE OF TECHNOLOGY FOR WOMEN
              </h2>

              <p className="location">
                Poojappura, Thiruvananthapuram
              </p>

              <p
                className="college-tagline"
                style={{ color: "#ffffff" }}
              >
                Empowering Women, Building Futures
              </p>

            </div>

          </div>

          <button
            className="back-btn"
            onClick={goHome}
            type="button"
          >
            <ArrowLeft size={19} />
            <span>Back to Home</span>
          </button>

        </div>
      </header>


      {/* FORM */}

      <main className="complaint-main">

        <div className="complaint-card">

          <div className="form-heading">

            <h1>
              Raise a Complaint
            </h1>

            <div className="form-divider">
              <span></span>
              <b>✦</b>
              <span></span>
            </div>

            <p>
              Tell us about your concern and we will help get it resolved.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* STUDENT NAME */}

            <div className="form-group">

              <label htmlFor="studentName">
                Student Name <span>*</span>
              </label>

              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value)
                }
                placeholder="Enter your name"
              />

            </div>


            {/* STUDENT ID */}

            <div className="form-group">

              <label htmlFor="studentId">
                Student ID <span>*</span>
              </label>

              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) =>
                  setStudentId(e.target.value)
                }
                placeholder="Enter your student ID"
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label htmlFor="category">
                Complaint Category <span>*</span>
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);

                  if (e.target.value !== "Other") {
                    setRegarding("");
                  }
                }}
              >

                <option value="">
                  Select a category
                </option>

                <option value="Campus Cleanliness">
                  Campus Cleanliness
                </option>

                <option value="Faculty Behaviour">
                  Faculty Behaviour
                </option>

                <option value="Staff Behaviour">
                  Staff Behaviour
                </option>

                <option value="Canteen / Food">
                  Canteen / Food
                </option>

                <option value="Store / Service">
                  Store / Service
                </option>

                <option value="Transportation">
                  Transportation
                </option>

                <option value="Lab / Computer Facilities">
                  Lab / Computer Facilities
                </option>

                <option value="Infrastructure / Facilities">
                  Infrastructure / Facilities
                </option>

                <option value="Academic Related">
                  Academic Related
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* REGARDING - ONLY FOR OTHER */}

            {category === "Other" && (
              <div className="form-group">

                <label htmlFor="regarding">
                  Regarding <span>*</span>
                </label>

                <input
                  type="text"
                  id="regarding"
                  value={regarding}
                  onChange={(e) =>
                    setRegarding(e.target.value)
                  }
                  placeholder="What is the complaint regarding?"
                />

              </div>
            )}


            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="complaint">
                Describe Your Complaint <span>*</span>
              </label>

              <textarea
                id="complaint"
                value={complaint}
                onChange={(e) =>
                  setComplaint(e.target.value)
                }
                placeholder="Write your complaint in detail..."
                rows="7"
              ></textarea>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="submit-btn"
            >
              <Send size={20} />
              <span>Submit Complaint</span>
            </button>

          </form>


          <p className="form-note">
            Please provide accurate details so that we can resolve
            your issue faster.
          </p>

        </div>

      </main>


      {/* FOOTER */}

      <footer className="complaint-footer">

        <div className="footer-item">
          <MapPin size={19} />
          <span>
            Poojappura, Thiruvananthapuram
          </span>
        </div>

        <div className="footer-item">
          <Phone size={19} />
          <span>LBSITW</span>
        </div>

        <div className="footer-item">
          <Mail size={19} />
          <span>Campus Service Portal</span>
        </div>

      </footer>

    </div>
  );
}

export default Complaint;