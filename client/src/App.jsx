import {
  LogIn,
  FilePenLine,
  Search,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import TrackComplaint from "./pages/TrackComplaint";
import Complaint from "./pages/Complaint";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintReview from "./pages/ComplaintReview";

import campusImage from "./assets/lbs-campus.jpg";
import lbsLogo from "./assets/logo.png";

import "./App.css";

function App() {

  // =========================
  // PAGE NAVIGATION
  // =========================

  // Complaint page
  if (window.location.pathname === "/complaint") {
    return <Complaint />;
  }

  // Track Complaint page
  if (window.location.pathname === "/track") {
    return <TrackComplaint />;
  }

  // Authority Login page
  if (window.location.pathname === "/admin-login") {
    return <AdminLogin />;
  }

  // Authority Dashboard
  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  // Complaint Review page
  if (window.location.pathname === "/complaint-review") {
    return <ComplaintReview />;
  }


  // =========================
  // OPEN COMPLAINT PAGE
  // =========================

  const openComplaintPage = () => {
    window.location.href = "/complaint";
  };


  // =========================
  // OPEN TRACK PAGE
  // =========================

  const openTrackPage = () => {
    window.location.href = "/track";
  };


  // =========================
  // OPEN AUTHORITY LOGIN
  // =========================

  const openAdminLogin = () => {
    window.location.href = "/admin-login";
  };


  // =========================
  // HOME PAGE
  // =========================

  return (
    <div
      className="landing-page"
      style={{
        backgroundImage: `url(${campusImage})`,
      }}
    >

      {/* Dark overlay */}
      <div className="overlay"></div>


      {/* =========================
          NAVIGATION
      ========================= */}

      <header className="navbar">

        <div className="brand">

          <img
            src={lbsLogo}
            alt="LBS Institute of Technology for Women logo"
            className="college-logo"
          />

          <div className="brand-text">

            <h2>
              LBSITW
            </h2>

            <span>
              Empowering Women in Technology
            </span>

          </div>

        </div>


        {/* Authority Login Button */}

        <button
          className="login-btn"
          onClick={openAdminLogin}
          type="button"
        >

          <LogIn size={20} />

          <span>
            Login
          </span>

        </button>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="hero-content">

        <p className="college-name">
          LBS INSTITUTE OF TECHNOLOGY
          <br />
          FOR WOMEN
        </p>


        {/* Gold divider */}

        <div className="gold-line">

          <span>
            ✦
          </span>

        </div>


        {/* Tagline */}

        <p className="tagline">
          Empowering Women, Building Futures
        </p>


        {/* Project title */}

        <h1>
          CAMPUS SERVICE MANAGEMENT
        </h1>


        {/* Description */}

        <p className="description">
          Raise your concerns. Track your requests. Get things resolved.
        </p>


        {/* =========================
            ACTION BUTTONS
        ========================= */}

        <div className="action-buttons">


          {/* RAISE COMPLAINT */}

          <button
            className="action-btn complaint-btn"
            onClick={openComplaintPage}
            type="button"
          >

            <FilePenLine size={30} />

            <span>
              Raise a

              <strong>
                Complaint
              </strong>
            </span>

          </button>


          {/* TRACK COMPLAINT */}

          <button
            className="action-btn track-btn"
            onClick={openTrackPage}
            type="button"
          >

            <Search size={30} />

            <span>
              Track My

              <strong>
                Complaint
              </strong>
            </span>

          </button>

        </div>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <div className="footer-item">

          <MapPin size={18} />

          <span>
            Poojappura, Thiruvananthapuram
          </span>

        </div>


        <div className="footer-item">

          <Phone size={18} />

          <span>
            LBSITW
          </span>

        </div>


        <div className="footer-item">

          <Mail size={18} />

          <span>
            Campus Service Portal
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;