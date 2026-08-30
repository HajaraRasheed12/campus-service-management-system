import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Hash,
  Tag,
  CalendarDays,
  FileText,
  Clock,
  Save,
  ShieldCheck,
} from "lucide-react";

import "./ComplaintReview.css";

function ComplaintReview() {
  // =========================
  // STATE
  // =========================

  const [complaint, setComplaint] = useState(null);

  const [status, setStatus] = useState("");

  const [resolutionMessage, setResolutionMessage] = useState(
    "Your issue has been resolved successfully. Thank you for bringing this to our attention."
  );

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // DISPLAY CATEGORY
  // =========================

  const getDisplayCategory = (complaint) => {
    if (
      complaint.category === "Other" &&
      complaint.regarding &&
      complaint.regarding.trim()
    ) {
      return complaint.regarding;
    }

    return complaint.category;
  };

  // =========================
  // LOAD SELECTED COMPLAINT
  // =========================

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        // Get complaint ID from URL
        const params = new URLSearchParams(
          window.location.search
        );

        const complaintId = params.get("id");

        if (!complaintId) {
          setError("No complaint ID was provided.");
          return;
        }

        // Get complaints from MongoDB
        const response = await fetch(
          "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch complaints."
          );
        }

        const data = await response.json();

        if (data.length === 0) {
          setError("No complaints found.");
          return;
        }

        // Find the exact complaint selected from Admin Dashboard
        const selectedComplaint = data.find(
          (item) =>
            item.id &&
            item.id.toUpperCase() ===
              complaintId.trim().toUpperCase()
        );

        if (!selectedComplaint) {
          setError(
            "The selected complaint could not be found."
          );
          return;
        }

        // Set selected complaint
        setComplaint(selectedComplaint);

        setStatus(selectedComplaint.status);

        setResolutionMessage(
          selectedComplaint.resolutionMessage ||
            "Your issue has been resolved successfully. Thank you for bringing this to our attention."
        );

      } catch (err) {
        console.error(
          "Error fetching complaint:",
          err
        );

        setError(
          "Unable to load complaint. Please make sure the server is running."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, []);

  // =========================
  // GO BACK
  // =========================

  const goBack = () => {
    window.location.href = "/admin";
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!complaint) {
      return;
    }

    // If resolving, resolution message is required
    if (
      status === "Resolved" &&
      !resolutionMessage.trim()
    ) {
      alert(
        "Please enter a resolution message before resolving the complaint."
      );

      return;
    }

    try {
      setUpdating(true);

      // Send update to MongoDB through backend
      const response = await fetch(
        `http://localhost:5000/api/complaints/${complaint.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: status,

            resolutionMessage:
              status === "Resolved"
                ? resolutionMessage.trim()
                : complaint.resolutionMessage || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update complaint."
        );
      }

      // Update page using database response
      setComplaint(data.complaint);

      setStatus(data.complaint.status);

      setResolutionMessage(
        data.complaint.resolutionMessage || ""
      );

      alert(
        `Complaint ${data.complaint.id} updated successfully.`
      );

    } catch (err) {
      console.error(
        "Error updating complaint:",
        err
      );

      alert(
        "Unable to update complaint. Please make sure the server is running."
      );

    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="complaint-review-page">

        <header className="review-header">

          <div className="review-brand">

            <div className="review-brand-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2>LBSITW</h2>
              <span>Authority Portal</span>
            </div>

          </div>

        </header>

        <main className="review-main">

          <div className="review-heading">

            <p>COMPLAINT REVIEW</p>

            <h1>Complaint Details</h1>

            <span>
              Loading complaint from MongoDB...
            </span>

          </div>

        </main>

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="complaint-review-page">

        <header className="review-header">

          <div className="review-brand">

            <div className="review-brand-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2>LBSITW</h2>
              <span>Authority Portal</span>
            </div>

          </div>

          <button
            className="review-back-btn"
            onClick={goBack}
            type="button"
          >

            <ArrowLeft size={18} />

            <span>
              Back to Dashboard
            </span>

          </button>

        </header>

        <main className="review-main">

          <div className="review-heading">

            <p>COMPLAINT REVIEW</p>

            <h1>Complaint Details</h1>

            <span>
              {error}
            </span>

          </div>

        </main>

      </div>
    );
  }

  // =========================
  // CHECK RESOLVED
  // =========================

  const isResolved =
    complaint.status === "Resolved";

  // =========================
  // PAGE
  // =========================

  return (
    <div className="complaint-review-page">

      {/* HEADER */}

      <header className="review-header">

        <div className="review-brand">

          <div className="review-brand-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2>LBSITW</h2>
            <span>Authority Portal</span>
          </div>

        </div>

        <button
          className="review-back-btn"
          onClick={goBack}
          type="button"
        >

          <ArrowLeft size={18} />

          <span>
            Back to Dashboard
          </span>

        </button>

      </header>

      {/* MAIN */}

      <main className="review-main">

        {/* HEADING */}

        <div className="review-heading">

          <p>
            COMPLAINT REVIEW
          </p>

          <h1>
            Complaint Details
          </h1>

          <span>
            Review the submitted complaint and update its status.
          </span>

        </div>

        {/* COMPLAINT CARD */}

        <section className="review-card">

          {/* CARD HEADER */}

          <div className="review-card-header">

            <div>

              <span className="review-id-label">
                COMPLAINT ID
              </span>

              <h2>
                {complaint.id}
              </h2>

            </div>

            <span className="review-current-status">
              {complaint.status}
            </span>

          </div>

          {/* STUDENT INFORMATION */}

          <div className="review-section">

            <h3>
              Student Information
            </h3>

            <div className="review-info-grid">

              <div className="review-info-item">

                <div className="review-info-icon">
                  <User size={18} />
                </div>

                <div>

                  <span>
                    Student Name
                  </span>

                  <strong>
                    {complaint.studentName}
                  </strong>

                </div>

              </div>

              <div className="review-info-item">

                <div className="review-info-icon">
                  <Hash size={18} />
                </div>

                <div>

                  <span>
                    Student ID
                  </span>

                  <strong>
                    {complaint.studentId}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* COMPLAINT INFORMATION */}

          <div className="review-section">

            <h3>
              Complaint Information
            </h3>

            <div className="review-info-grid">

              <div className="review-info-item">

                <div className="review-info-icon">
                  <Tag size={18} />
                </div>

                <div>

                  <span>
                    Category
                  </span>

                  <strong>
                    {getDisplayCategory(complaint)}
                  </strong>

                </div>

              </div>

              <div className="review-info-item">

                <div className="review-info-icon">
                  <CalendarDays size={18} />
                </div>

                <div>

                  <span>
                    Submitted On
                  </span>

                  <strong>
                    {complaint.date}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="review-section">

            <h3>
              Complaint Description
            </h3>

            <div className="description-box">

              <FileText size={20} />

              <p>
                {complaint.description}
              </p>

            </div>

          </div>

          {/* UPDATE STATUS */}

          <div className="review-section status-section">

            <h3>
              Update Complaint Status
            </h3>

            <p className="status-help">

              {isResolved
                ? "This complaint has already been resolved."
                : "Select the current stage of this complaint."
              }

            </p>

            <form onSubmit={handleUpdate}>

              <div className="status-update-row">

                {/* STATUS SELECT */}

                <div className="status-select-wrapper">

                  <Clock size={18} />

                  <select
                    name="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                    disabled={
                      isResolved ||
                      updating
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Under Review">
                      Under Review
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                  </select>

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  className="update-status-btn"
                  disabled={
                    isResolved ||
                    updating
                  }
                >

                  <Save size={18} />

                  <span>

                    {updating
                      ? "Saving..."
                      : isResolved
                        ? "Resolved"
                        : status === "Resolved"
                          ? "Resolve & Send"
                          : "Update Status"
                    }

                  </span>

                </button>

              </div>

              {/* RESOLUTION MESSAGE */}

              {status === "Resolved" && (

                <div
                  className={`resolution-message ${
                    isResolved
                      ? "resolution-locked"
                      : ""
                  }`}
                >

                  <label htmlFor="resolutionMessage">

                    Resolution Message

                    <span>
                      *
                    </span>

                  </label>

                  <p>

                    {isResolved
                      ? "This message has been sent to the student and can no longer be edited."
                      : "This message will be shown to the student when they track their complaint."
                    }

                  </p>

                  <textarea
                    id="resolutionMessage"
                    value={resolutionMessage}
                    onChange={(e) =>
                      setResolutionMessage(
                        e.target.value
                      )
                    }
                    placeholder="Enter a message for the student..."
                    rows="4"
                    required
                    disabled={
                      isResolved ||
                      updating
                    }
                  />

                </div>

              )}

            </form>

          </div>

          {/* AUTHORITY NOTE */}

          <div className="authority-note">

            <ShieldCheck size={18} />

            <div>

              <strong>
                Authority Action
              </strong>

              <p>

                {isResolved
                  ? "This complaint has been resolved."
                  : "Status changes should be made only after reviewing the complaint and taking appropriate action."
                }

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ComplaintReview;