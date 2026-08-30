import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  LoaderCircle,
  CheckCircle,
  Search,
  LogOut,
  Eye,
  MapPin,
  Phone,
  Mail,
  Filter,
} from "lucide-react";

import "./AdminDashboard.css";

function AdminDashboard() {

  // =========================
  // CHECK ADMIN LOGIN
  // =========================

  useEffect(() => {
    const isLoggedIn =
      sessionStorage.getItem("adminLoggedIn");

    if (isLoggedIn !== "true") {
      window.location.href = "/admin-login";
    }
  }, []);


  // =========================
  // COMPLAINT DATA
  // =========================

  const [complaints, setComplaints] = useState([]);


  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");


  // =========================
  // LOAD COMPLAINTS FROM MONGODB
  // =========================

  useEffect(() => {

    const fetchComplaints = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch complaints"
          );
        }

        const data = await response.json();

        setComplaints(data);

      } catch (error) {

        console.error(
          "Error fetching complaints:",
          error
        );

      }

    };


    // Fetch immediately when dashboard opens
    fetchComplaints();


    // Automatically refresh every 15 seconds
    const refreshInterval = setInterval(
      fetchComplaints,
      15000
    );


    // Stop automatic refresh when leaving dashboard
    return () => {
      clearInterval(refreshInterval);
    };

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    sessionStorage.removeItem(
      "adminLoggedIn"
    );

    window.location.href = "/";

  };


  // =========================
  // OPEN COMPLAINT REVIEW
  // =========================

  const handleViewComplaint = (
    complaintId
  ) => {

    window.location.href =
      `/complaint-review?id=${complaintId}`;

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


  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (
    status
  ) => {

    if (status === "Resolved") {
      return "status-resolved";
    }

    if (status === "In Progress") {
      return "status-progress";
    }

    if (status === "Under Review") {
      return "status-review";
    }

    return "status-pending";

  };


  // =========================
  // SUMMARY COUNTS
  // =========================

  const totalComplaints =
    complaints.length;


  const underReviewCount =
    complaints.filter(
      (complaint) =>
        complaint.status ===
        "Under Review"
    ).length;


  const inProgressCount =
    complaints.filter(
      (complaint) =>
        complaint.status ===
        "In Progress"
    ).length;


  const resolvedCount =
    complaints.filter(
      (complaint) =>
        complaint.status ===
        "Resolved"
    ).length;


  // =========================
  // SEARCH + STATUS FILTER
  // =========================

  const filteredComplaints =
    complaints.filter((complaint) => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      const matchesSearch =
        !search ||
        complaint.id
          ?.toLowerCase()
          .includes(search) ||
        complaint.studentId
          ?.toLowerCase()
          .includes(search) ||
        complaint.studentName
          ?.toLowerCase()
          .includes(search);


      const matchesStatus =
        statusFilter === "All" ||
        complaint.status ===
          statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });


  // =========================
  // RENDER
  // =========================

  return (
    <div className="admin-dashboard">


      {/* =========================
          TOP NAVIGATION
      ========================= */}

      <header className="admin-dashboard-header">

        <div className="dashboard-brand">

          <div className="dashboard-brand-icon">

            <LayoutDashboard size={22} />

          </div>


          <div>

            <h2>
              LBSITW
            </h2>

            <span>
              Authority Portal
            </span>

          </div>

        </div>


        <div className="dashboard-user">

          <div className="user-info">

            <strong>
              Administrator
            </strong>

            <span>
              Authority
            </span>

          </div>


          <button
            className="logout-btn"
            onClick={handleLogout}
            type="button"
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-main">


        {/* =========================
            WELCOME
        ========================= */}

        <section className="dashboard-welcome">

          <div>

            <p className="dashboard-label">
              AUTHORITY DASHBOARD
            </p>

            <h1>
              Welcome, Administrator
            </h1>

            <p>
              Review and manage campus complaints from one place.
            </p>

          </div>

        </section>


        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <section className="summary-grid">


          {/* TOTAL */}

          <div className="summary-card">

            <div className="summary-icon total-icon">

              <ClipboardList size={22} />

            </div>


            <div>

              <span>
                Total Complaints
              </span>

              <strong>
                {totalComplaints}
              </strong>

            </div>

          </div>


          {/* UNDER REVIEW */}

          <div className="summary-card">

            <div className="summary-icon review-icon">

              <Clock size={22} />

            </div>


            <div>

              <span>
                Under Review
              </span>

              <strong>
                {underReviewCount}
              </strong>

            </div>

          </div>


          {/* IN PROGRESS */}

          <div className="summary-card">

            <div className="summary-icon progress-icon">

              <LoaderCircle size={22} />

            </div>


            <div>

              <span>
                In Progress
              </span>

              <strong>
                {inProgressCount}
              </strong>

            </div>

          </div>


          {/* RESOLVED */}

          <div className="summary-card">

            <div className="summary-icon resolved-icon">

              <CheckCircle size={22} />

            </div>


            <div>

              <span>
                Resolved
              </span>

              <strong>
                {resolvedCount}
              </strong>

            </div>

          </div>

        </section>


        {/* =========================
            COMPLAINTS SECTION
        ========================= */}

        <section className="complaints-section">


          {/* SECTION HEADER */}

          <div className="complaints-header">

            <div>

              <h2>
                Recent Complaints
              </h2>

              <p>
                View and review submitted campus complaints.
              </p>

            </div>


            <button
              className="view-all-btn"
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
            >

              <Search size={17} />

              View All

            </button>

          </div>


          {/* =========================
              SEARCH & FILTER
          ========================= */}

          <div
            className="complaint-filters"
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "25px",
              flexWrap: "wrap",
            }}
          >

            {/* SEARCH */}

            <div
              style={{
                position: "relative",
                flex: "1",
                minWidth: "250px",
              }}
            >

              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  opacity: 0.6,
                }}
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search by Complaint ID, Student ID or Name..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding:
                    "14px 15px 14px 45px",
                  borderRadius: "10px",
                  border:
                    "1px solid #d7e2e5",
                  outline: "none",
                  fontSize: "15px",
                }}
              />

            </div>


            {/* STATUS FILTER */}

            <div
              style={{
                position: "relative",
                minWidth: "210px",
              }}
            >

              <Filter
                size={18}
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  opacity: 0.6,
                  pointerEvents: "none",
                }}
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding:
                    "14px 40px 14px 45px",
                  borderRadius: "10px",
                  border:
                    "1px solid #d7e2e5",
                  outline: "none",
                  fontSize: "15px",
                  background:
                    "white",
                  cursor: "pointer",
                }}
              >

                <option value="All">
                  All Statuses
                </option>

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

          </div>


          {/* =========================
              RESULT COUNT
          ========================= */}

          <p
            style={{
              marginBottom: "15px",
              opacity: 0.7,
              fontSize: "14px",
            }}
          >

            Showing{" "}
            <strong>
              {filteredComplaints.length}
            </strong>{" "}
            of{" "}
            <strong>
              {complaints.length}
            </strong>{" "}
            complaints

          </p>


          {/* =========================
              COMPLAINT TABLE
          ========================= */}

          <div className="complaints-table-wrapper">

            <table className="complaints-table">

              <thead>

                <tr>

                  <th>
                    Complaint ID
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Submitted On
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredComplaints.length >
                0 ? (

                  filteredComplaints.map(
                    (complaint) => (

                      <tr
                        key={complaint.id}
                      >

                        {/* ID */}

                        <td>

                          <strong className="complaint-id">

                            {complaint.id}

                          </strong>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          {getDisplayCategory(
                            complaint
                          )}

                        </td>


                        {/* DATE */}

                        <td>

                          {complaint.date}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status-badge ${getStatusClass(
                              complaint.status
                            )}`}
                          >

                            {complaint.status}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            className="view-complaint-btn"
                            type="button"
                            onClick={() =>
                              handleViewComplaint(
                                complaint.id
                              )
                            }
                          >

                            <Eye size={16} />

                            View

                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign:
                          "center",
                        padding: "40px",
                      }}
                    >

                      <Search
                        size={30}
                        style={{
                          marginBottom:
                            "10px",
                          opacity: 0.5,
                        }}
                      />

                      <strong>
                        No complaints found.
                      </strong>

                      <p
                        style={{
                          marginTop:
                            "8px",
                          opacity: 0.7,
                        }}
                      >

                        Try changing your search
                        or status filter.

                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="dashboard-footer">

        <div className="footer-item">

          <MapPin size={17} />

          <span>
            Poojappura, Thiruvananthapuram
          </span>

        </div>


        <div className="footer-item">

          <Phone size={17} />

          <span>
            LBSITW
          </span>

        </div>


        <div className="footer-item">

          <Mail size={17} />

          <span>
            Campus Service Portal
          </span>

        </div>

      </footer>

    </div>
  );
}

export default AdminDashboard;