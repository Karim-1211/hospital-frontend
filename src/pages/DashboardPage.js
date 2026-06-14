import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const avatarColors = [
  { bg: '#f5f3ff', color: '#5b21b6' },
  { bg: '#f0fdf4', color: '#065f46' },
  { bg: '#fff1f2', color: '#9f1239' },
  { bg: '#fefce8', color: '#854d0e' },
];

function DashboardPage() {
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0, departments: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, d, a, dep] = await Promise.all([
          api.get('/patients'), api.get('/doctors'),
          api.get('/appointments'), api.get('/departments')
        ]);
        setCounts({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length, departments: dep.data.length });
        setRecent(a.data.slice(0, 5));
      } catch {}
    };
    load();
  }, []);

  const initials = name => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <>
      <div className="hero">
        <div className="hero-blob1"></div>
        <div className="hero-blob2"></div>
        <div className="hero-content">
          <div className="hero-tag"><span className="pulse"></span> System Live</div>
          <h1>The Smarter Way to<br />Run <em>Your Hospital</em></h1>
          <p>One beautiful dashboard to manage patients, doctors, and appointments — faster than ever before.</p>
          <div className="hero-btns">
            <Link to="/appointments"><button className="hbtn hbtn-p">+ Book Appointment</button></Link>
            <Link to="/patients"><button className="hbtn hbtn-s">View Patients →</button></Link>
          </div>
        </div>
      </div>

      <div className="body">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-ring" style={{ background: '#f5f3ff' }}>👥</div>
            <div className="stat-value" style={{ color: '#4338ca' }}>{counts.patients}</div>
            <div className="stat-label">Total Patients</div>
            <div className="stat-pill" style={{ background: '#f5f3ff', color: '#4338ca' }}>Registered</div>
          </div>
          <div className="stat-card">
            <div className="stat-ring" style={{ background: '#f0fdf4' }}>👨‍⚕️</div>
            <div className="stat-value" style={{ color: '#059669' }}>{counts.doctors}</div>
            <div className="stat-label">Active Doctors</div>
            <div className="stat-pill" style={{ background: '#f0fdf4', color: '#065f46' }}>All on duty</div>
          </div>
          <div className="stat-card">
            <div className="stat-ring" style={{ background: '#fefce8' }}>📅</div>
            <div className="stat-value" style={{ color: '#d97706' }}>{counts.appointments}</div>
            <div className="stat-label">Appointments</div>
            <div className="stat-pill" style={{ background: '#fefce8', color: '#854d0e' }}>Booked</div>
          </div>
          <div className="stat-card">
            <div className="stat-ring" style={{ background: '#fff1f2' }}>🏢</div>
            <div className="stat-value" style={{ color: '#e11d48' }}>{counts.departments}</div>
            <div className="stat-label">Departments</div>
            <div className="stat-pill" style={{ background: '#fff1f2', color: '#9f1239' }}>Hospital wings</div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="section-label">Quick Access</div>
        <div className="dash-grid">
          <Link to="/patients" className="dash-card" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
            <div className="dash-icon" style={{ background: '#ddd6fe' }}>👥</div>
            <h3 style={{ color: '#4c1d95' }}>Patients</h3>
            <p style={{ color: '#5b21b6' }}>Add &amp; manage records</p>
          </Link>
          <Link to="/doctors" className="dash-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="dash-icon" style={{ background: '#bbf7d0' }}>👨‍⚕️</div>
            <h3 style={{ color: '#14532d' }}>Doctors</h3>
            <p style={{ color: '#166534' }}>Medical staff directory</p>
          </Link>
          <Link to="/appointments" className="dash-card" style={{ background: '#fefce8', borderColor: '#fef08a' }}>
            <div className="dash-icon" style={{ background: '#fef08a' }}>📅</div>
            <h3 style={{ color: '#713f12' }}>Appointments</h3>
            <p style={{ color: '#854d0e' }}>Schedule &amp; track</p>
          </Link>
          <Link to="/departments" className="dash-card" style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
            <div className="dash-icon" style={{ background: '#fecdd3' }}>🏢</div>
            <h3 style={{ color: '#881337' }}>Departments</h3>
            <p style={{ color: '#9f1239' }}>Hospital wings</p>
          </Link>
        </div>

        {/* Recent Appointments */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Appointments</h3>
            <Link to="/appointments">View all →</Link>
          </div>
          <div className="table-wrap">
            {recent.length === 0 ? <p className="empty">No appointments yet.</p> : (
              <table>
                <thead>
                  <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recent.map((a, i) => {
                    const c = avatarColors[i % avatarColors.length];
                    return (
                      <tr key={a.id}>
                        <td><span className="avatar" style={{ background: c.bg, color: c.color }}>{initials(a.patient_name)}</span>{a.patient_name}</td>
                        <td>{a.doctor_name}</td>
                        <td>{a.appointment_date}</td>
                        <td>{a.appointment_time}</td>
                        <td><span className={`badge ${a.status === 'Pending' ? 'badge-pending' : 'badge-done'}`}>{a.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;