import { useState } from "react";
import {
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  LoaderCircle,
  MessageSquare,
} from "lucide-react";

import campusImage from "../assets/lbs-campus.jpg";
import lbsLogo from "../assets/logo.png";

import "./TrackComplaint.css";

function TrackComplaint() {

  const [studentId, setStudentId] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // =========================
  // GO HOME
  // =========================

  const goHome = () => {
    window.location.href = "/";
  };

  // =========================
  // FIND STUDENT COMPLAINTS
  // =========================

  const handleFindComplaints = async (e) => {

    e.preventDefault();

    setError("");
    setComplaints([]);
    setSelectedComplaint(null);
    setSearched(false);

    if (!studentId.trim()) {
      setError("Please enter your Student ID.");
      return;
    }

    try {

      // Get complaints from MongoDB
      const response = await fetch(
        "https://campus-service-management-system.onrender.com/api/complaints"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();

      // Find all complaints belonging to this student
      const studentComplaints = data.filter(
        (item) =>
          item.studentId &&
          item.studentId.toUpperCase() ===
            studentId.trim().toUpperCase()
      );

      if (studentComplaints.length === 0) {

        setError(
          "No complaints found for this Student ID. Please check your Student ID and try again."
        );

        setSearched(true);

        return;
      }

      // Show all complaints belonging to student
      setComplaints(studentComplaints);

      setSearched(true);

    } catch (error) {

      console.error(
        "Error fetching complaints:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );

    }

  };

  // =========================
  // SELECT COMPLAINT
  // =========================

  const handleSelectComplaint = (
    complaint
  ) => {

    setSelectedComplaint(complaint);

    setError("");

    // Scroll down to tracking section
    setTimeout(() => {

      document
        .getElementById(
          "complaint-tracking"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

    }, 100);

  };

  // =========================
  // STATUS ORDER
  // =========================

  const statusOrder = [
    "Pending",
    "Under Review",
    "In Progress",
    "Resolved",
  ];

  // =========================
  // GET CURRENT STATUS INDEX
  // =========================

  const getStatusIndex = (status) => {

    const index =
      statusOrder.indexOf(status);

    return index === -1
      ? 0
      : index;

  };

  // =========================
  // DISPLAY CATEGORY
  // =========================

  const getDisplayCategory = (
    complaint
  ) => {

    if (
      complaint.category === "Other" &&
      complaint.regarding &&
      complaint.regarding.trim()
    ) {

      return complaint.regarding;

    }

    return complaint.category;

  };

  return (
    <div className="track-page">

      {/* =========================
          HEADER
      ========================= */}

      <header
        className="track-header"
        style={{
          backgroundImage: `url(${campusImage})`,
        }}
      >

        <div className="track-header-overlay"></div>

        <div className="track-header-content">

          <div className="track-college-brand">

            <img
              src={lbsLogo}
              alt="LBS Institute of Technology for Women Logo"
              className="track-logo"
            />

            <div className="track-college-info">

              <h2>
                LBS INSTITUTE OF TECHNOLOGY FOR WOMEN
              </h2>

              <p className="track-location">
                Poojappura, Thiruvananthapuram
              </p>

              <p className="track-tagline">
                Empowering Women, Building Futures
              </p>

            </div>

          </div>

          <button
            className="track-back-btn"
            onClick={goHome}
            type="button"
          >

            <ArrowLeft size={19} />

            <span>
              Back to Home
            </span>

          </button>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="track-main">

        <div className="track-card">

          {/* =========================
              HEADING
          ========================= */}

          <div className="track-heading">

            <h1>
              Track My Complaints
            </h1>

            <div className="track-divider">

              <span></span>

              <b>✦</b>

              <span></span>

            </div>

            <p>
              Enter your Student ID to view all your complaints.
            </p>

          </div>

          {/* =========================
              STUDENT ID SEARCH FORM
          ========================= */}

          <form
            onSubmit={
              handleFindComplaints
            }
          >

            <div className="track-form-group">

              <label htmlFor="studentId">

                Student ID <span>*</span>

              </label>

              <div className="track-input-wrapper">

                <Search size={20} />

                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => {

                    setStudentId(
                      e.target.value
                    );

                    setError("");

                  }}
                  placeholder="Example: LBT23EC027"
                />

              </div>

              {/* ERROR */}

              {error && (

                <p className="track-error">
                  {error}
                </p>

              )}

            </div>

            <button
              type="submit"
              className="track-submit-btn"
            >

              <Search size={20} />

              <span>
                Find My Complaints
              </span>

            </button>

          </form>

          {/* =========================
              COMPLAINT LIST
          ========================= */}

          {searched &&
            complaints.length > 0 && (

            <div className="track-result">

              <div className="result-divider">

                <span></span>

                <b>✦</b>

                <span></span>

              </div>

              <h2 className="status-title">
                Your Complaints
              </h2>

              <p
                style={{
                  textAlign: "center",
                  marginBottom: "25px",
                  opacity: 0.75,
                }}
              >
                Select a complaint to view its current status.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >

                {complaints.map(
                  (complaint) => (

                    <div
                      key={complaint.id}
                      style={{
                        border:
                          selectedComplaint?.id ===
                          complaint.id
                            ? "2px solid #1b6b57"
                            : "1px solid #dfe7e5",
                        borderRadius:
                          "12px",
                        padding:
                          "18px 20px",
                        background:
                          selectedComplaint?.id ===
                          complaint.id
                            ? "#f2f9f6"
                            : "#ffffff",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "15px",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        <div>

                          <strong
                            className="complaint-id-text"
                          >
                            {complaint.id}
                          </strong>

                          <p
                            style={{
                              margin:
                                "7px 0 4px",
                              fontWeight:
                                "600",
                            }}
                          >
                            {getDisplayCategory(
                              complaint
                            )}
                          </p>

                          <span
                            style={{
                              fontSize:
                                "14px",
                              opacity:
                                0.7,
                            }}
                          >
                            Submitted on{" "}
                            {complaint.date}
                          </span>

                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "12px",
                          }}
                        >

                          <span
                            className={`status-badge ${
                              complaint.status
                            }`}
                          >
                            {complaint.status}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleSelectComplaint(
                                complaint
                              )
                            }
                            style={{
                              border:
                                "none",
                              borderRadius:
                                "8px",
                              padding:
                                "10px 16px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "600",
                            }}
                          >

                            <Search
                              size={16}
                            />

                            {" "}Track

                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

          {/* =========================
              SELECTED COMPLAINT TRACKING
          ========================= */}

          {selectedComplaint && (

            <div
              id="complaint-tracking"
              className="track-result"
            >

              <div className="result-divider">

                <span></span>

                <b>✦</b>

                <span></span>

              </div>

              <h2 className="status-title">
                Complaint Status
              </h2>

              {/* =========================
                  COMPLAINT DETAILS
              ========================= */}

              <div className="complaint-details">

                <div className="detail-row">

                  <span>
                    Complaint ID
                  </span>

                  <strong className="complaint-id-text">
                    {selectedComplaint.id}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Student Name
                  </span>

                  <strong>
                    {selectedComplaint.studentName}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Student ID
                  </span>

                  <strong>
                    {selectedComplaint.studentId}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Category
                  </span>

                  <strong>
                    {getDisplayCategory(
                      selectedComplaint
                    )}
                  </strong>

                </div>

                {selectedComplaint.regarding &&
                  selectedComplaint.category !==
                    "Other" && (

                  <div className="detail-row">

                    <span>
                      Regarding
                    </span>

                    <strong>
                      {selectedComplaint.regarding}
                    </strong>

                  </div>

                )}

                <div className="detail-row">

                  <span>
                    Submitted On
                  </span>

                  <strong>
                    {selectedComplaint.date}
                  </strong>

                </div>

                <div className="detail-row description-row">

                  <span>
                    Complaint
                  </span>

                  <strong>
                    {selectedComplaint.description}
                  </strong>

                </div>

              </div>

              {/* =========================
                  STATUS TIMELINE
              ========================= */}

              <div className="status-timeline">

                {(() => {

                  const currentStatusIndex =
                    getStatusIndex(
                      selectedComplaint.status
                    );

                  return (
                    <>

                      {/* SUBMITTED */}

                      <div
                        className={`status-item ${
                          currentStatusIndex >= 0
                            ? "completed"
                            : ""
                        }`}
                      >

                        <div className="status-icon">

                          <CheckCircle
                            size={24}
                          />

                        </div>

                        <div className="status-content">

                          <h3>
                            Submitted
                          </h3>

                          <p>
                            Your complaint has been submitted successfully.
                          </p>

                        </div>

                      </div>

                      {/* UNDER REVIEW */}

                      <div
                        className={`status-item ${
                          currentStatusIndex === 1
                            ? "current"
                            : currentStatusIndex > 1
                            ? "completed"
                            : ""
                        }`}
                      >

                        <div className="status-icon">

                          <Clock
                            size={24}
                          />

                        </div>

                        <div className="status-content">

                          <h3>
                            Under Review
                          </h3>

                          <p>

                            {currentStatusIndex >= 1
                              ? "Your complaint has been reviewed by the authority."
                              : "Your complaint will be reviewed by the authority."}

                          </p>

                        </div>

                      </div>

                      {/* IN PROGRESS */}

                      <div
                        className={`status-item ${
                          currentStatusIndex === 2
                            ? "current"
                            : currentStatusIndex > 2
                            ? "completed"
                            : ""
                        }`}
                      >

                        <div className="status-icon">

                          <LoaderCircle
                            size={24}
                          />

                        </div>

                        <div className="status-content">

                          <h3>
                            In Progress
                          </h3>

                          <p>

                            {currentStatusIndex >= 2
                              ? "Action is being taken regarding your complaint."
                              : "This stage will be updated when action begins."}

                          </p>

                        </div>

                      </div>

                      {/* RESOLVED */}

                      <div
                        className={`status-item ${
                          currentStatusIndex === 3
                            ? "current"
                            : ""
                        }`}
                      >

                        <div className="status-icon">

                          <CheckCircle
                            size={24}
                          />

                        </div>

                        <div className="status-content">

                          <h3>
                            Resolved
                          </h3>

                          <p>

                            {currentStatusIndex === 3
                              ? "Your complaint has been resolved successfully."
                              : "The complaint will be marked resolved after the issue is addressed."}

                          </p>

                        </div>

                      </div>

                    </>
                  );

                })()}

              </div>

              {/* =========================
                  AUTHORITY RESPONSE
              ========================= */}

              {selectedComplaint.status ===
                "Resolved" &&
                selectedComplaint.resolutionMessage && (

                <div className="authority-response">

                  <div className="authority-response-icon">

                    <MessageSquare
                      size={20}
                    />

                  </div>

                  <div className="authority-response-content">

                    <h3>
                      Authority Response
                    </h3>

                    <p>
                      {
                        selectedComplaint.resolutionMessage
                      }
                    </p>

                  </div>

                </div>

              )}

            </div>

          )}

          {/* =========================
              EMPTY STATE
          ========================= */}

          {!searched && !selectedComplaint && (

            <div className="track-empty">

              <Search size={42} />

              <h2>
                Find Your Complaints
              </h2>

              <p>
                Enter your Student ID above to view
                all complaints submitted by you.
              </p>

            </div>

          )}

          {/* =========================
              INFORMATION NOTE
          ========================= */}

          <div className="track-note">

            <div className="note-icon">
              i
            </div>

            <div>

              <strong>
                Keep your Student ID safe.
              </strong>

              <p>
                Enter your Student ID to view all complaints
                submitted under your account.
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="track-footer">

        <div className="track-footer-item">

          <MapPin size={19} />

          <span>
            Poojappura, Thiruvananthapuram
          </span>

        </div>

        <div className="track-footer-item">

          <Phone size={19} />

          <span>
            LBSITW
          </span>

        </div>

        <div className="track-footer-item">

          <Mail size={19} />

          <span>
            Campus Service Portal
          </span>

        </div>

      </footer>

    </div>
  );
}

export default TrackComplaint;