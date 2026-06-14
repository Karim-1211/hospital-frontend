import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/patients", label: "Patients" },
    { path: "/doctors", label: "Doctors" },
    { path: "/appointments", label: "Appointments" },
    { path: "/departments", label: "Departments" },
  ];

  return (
    <nav style={styles.nav}>
      {/* Brand */}
      <div style={styles.left}>
        <div style={styles.logo}>+</div>
        <span style={styles.brand}>MediCare Pro</span>
      </div>

      {/* Nav Links */}
      <div style={styles.links}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.linkActive : {}),
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div style={styles.right}>
        <button style={styles.bell}>🔔</button>

        {/* Avatar with dropdown */}
        <div ref={dropdownRef} style={styles.avatarWrapper}>
          <div
            style={styles.avatar}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Account"
          >
            AD
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div style={styles.dropdown}>
              {/* User info */}
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownAvatar}>AD</div>
                <div>
                  <div style={styles.dropdownName}>Admin</div>
                  <div style={styles.dropdownEmail}>admin@hospital.com</div>
                </div>
              </div>

              <div style={styles.divider} />

              {/* Menu items */}
              <button style={styles.dropdownItem} onClick={() => { setDropdownOpen(false); }}>
                👤 My Profile
              </button>
              <button style={styles.dropdownItem} onClick={() => { setDropdownOpen(false); }}>
                ⚙️ Settings
              </button>

              <div style={styles.divider} />

              <button
                style={{ ...styles.dropdownItem, ...styles.logoutItem }}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    padding: "0 32px",
    height: "64px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "32px",
    height: "32px",
    background: "rgba(255,255,255,0.25)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "18px",
  },
  brand: {
    fontWeight: "700",
    fontSize: "17px",
    color: "#fff",
  },
  links: {
    display: "flex",
    gap: "4px",
  },
  link: {
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.75)",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  linkActive: {
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontWeight: "600",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  bell: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
    color: "#fff",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: "36px",
    height: "36px",
    background: "rgba(255,255,255,0.25)",
    border: "2px solid rgba(255,255,255,0.5)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    userSelect: "none",
  },
  dropdown: {
    position: "absolute",
    top: "48px",
    right: 0,
    background: "#fff",
    border: "1px solid #e8edf5",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    minWidth: "220px",
    zIndex: 200,
    overflow: "hidden",
    padding: "8px 0",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
  },
  dropdownAvatar: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },
  dropdownName: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#1e293b",
  },
  dropdownEmail: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "2px",
  },
  divider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "4px 0",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "10px 16px",
    background: "none",
    border: "none",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s",
  },
  logoutItem: {
    color: "#dc2626",
    fontWeight: "600",
  },
};