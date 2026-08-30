import { useState } from "react";
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import authorityCampus from "../assets/authority-campus.jpg";
import lbsLogo from "../assets/logo.png";

import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // GO HOME
  // =========================

  const goHome = () => {
    window.location.href = "/";
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter your username and password.");
      return;
    }

    // Admin credentials
    if (
      username.trim() === "admin" &&
      password === "admin123"
    ) {
      // Create admin login session
      sessionStorage.setItem("adminLoggedIn", "true");

      // Open Authority Dashboard
      window.location.href = "/admin";
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="admin-login-page">

      {/* =========================
          LEFT SECTION
      ========================= */}

      <section
        className="admin-login-left"
        style={{
          backgroundImage: `url(${authorityCampus})`,
        }}
      >

        <div className="admin-image-overlay"></div>

        <div className="admin-branding">

          <img
            src={lbsLogo}
            alt="LBS Institute of Technology for Women Logo"
            className="admin-logo"
          />

          <h1>
            LBSITW
          </h1>

          <h2>
            AUTHORITY PORTAL
          </h2>

          <div className="admin-line"></div>

          <p>
            Campus Service Management System
          </p>

          <span>
            Manage, review and resolve
            <br />
            campus complaints efficiently.
          </span>

        </div>

      </section>

      {/* =========================
          RIGHT SECTION
      ========================= */}

      <section className="admin-login-right">

        {/* Back To Home */}

        <button
          className="admin-back-btn"
          onClick={goHome}
          type="button"
        >

          <ArrowLeft size={18} />

          <span>
            Back to Home
          </span>

        </button>

        {/* =========================
            LOGIN CARD
        ========================= */}

        <div className="admin-login-card">

          {/* Shield Icon */}

          <div className="admin-shield">

            <ShieldCheck size={30} />

          </div>

          {/* Heading */}

          <h1>
            Welcome Back!
          </h1>

          <p className="admin-subtitle">
            Sign in to your authority account
          </p>

          {/* =========================
              LOGIN FORM
          ========================= */}

          <form onSubmit={handleLogin}>

            {/* USERNAME */}

            <div className="admin-form-group">

              <label htmlFor="username">
                Username
              </label>

              <div className="admin-input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter your username"
                  autoComplete="username"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="admin-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="admin-input-wrapper">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                {/* Show / Hide Password */}

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                </button>

              </div>

            </div>

            {/* =========================
                OPTIONS
            ========================= */}

            <div className="admin-options">

              {/* Remember Me */}

              <label className="remember-option">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

              {/* Forgot Password */}

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  alert(
                    "Password recovery will be added later."
                  )
                }
              >

                Forgot Password?

              </button>

            </div>

            {/* =========================
                SIGN IN BUTTON
            ========================= */}

            <button
              type="submit"
              className="admin-login-btn"
            >

              <ShieldCheck size={19} />

              <span>
                Sign In
              </span>

            </button>

          </form>

          {/* =========================
              SECURITY NOTE
          ========================= */}

          <div className="admin-security">

            <ShieldCheck size={16} />

            <span>
              Authorized Access Only
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminLogin;