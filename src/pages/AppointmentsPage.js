import React, { useEffect, useState } from 'react';
import api from '../services/api';
 
function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
 
  const fetchAll = async () => {
    try {
      const [aRes, dRes, pRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors'),
        api.get('/patients'),
      ]);
      setAppointments(aRes.data);
      setDoctors(dRes.data);
      setPatients(pRes.data);
    } catch { alert('Could not load data'); }
  };
 
  useEffect(() => { fetchAll(); }, []);
 
  const handleAdd = async () => {
    if (!doctorId || !patientId || !date || !time)
      return alert('Please fill all fields');
    try {
      await api.post('/appointments', {
        doctor_id: parseInt(doctorId),
        patient_id: parseInt(patientId),
        appointment_date: date,
        appointment_time: time,
      });
      setDoctorId(''); setPatientId(''); setDate(''); setTime('');
      fetchAll();
    } catch { alert('Could not book appointment'); }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await api.delete(`/appointments/${id}`); fetchAll(); }
    catch { alert('Could not delete'); }
  };
 
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      fetchAll();
    } catch { alert('Could not update status'); }
  };
 
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-icon">📅</div>
        <div>
          <h2>Appointments</h2>
          <p>Book and manage all appointments</p>
        </div>
      </div>
 
      <div className="card">
        <div className="card-header"><h3>Book New Appointment</h3></div>
        <div className="card-body">
          <div className="form-grid">
            <select className="form-input" value={patientId} onChange={e => setPatientId(e.target.value)}>
              <option value="">-- Select Patient --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className="form-input" value={doctorId} onChange={e => setDoctorId(e.target.value)}>
              <option value="">-- Select Doctor --</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <button className="btn btn-blue" onClick={handleAdd}>+ Book Appointment</button>
        </div>
      </div>
 
      <div className="card">
        <div className="card-header"><h3>All Appointments</h3></div>
        <div className="table-wrap">
          {appointments.length === 0 ? <p className="empty">No appointments found.</p> : (
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Patient</th><th>Doctor</th>
                  <th>Date</th><th>Time</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, i) => (
                  <tr key={a.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td><span className="table-id">#{a.id}</span></td>
                    <td>
                      <div className="table-name-cell">
                        <div className="table-avatar" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                          {a.patient_name ? a.patient_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="table-name">{a.patient_name || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-name-cell">
                        <div className="table-avatar" style={{background:'linear-gradient(135deg,#10b981,#059669)'}}>
                          {a.doctor_name ? a.doctor_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="table-name">{a.doctor_name || '—'}</span>
                      </div>
                    </td>
                    <td><span className="table-date">{a.appointment_date}</span></td>
                    <td><span className="table-time">{a.appointment_time}</span></td>
                    <td>
                      <span className={`badge ${
                        a.status === 'Pending' ? 'badge-pending' :
                        a.status === 'Confirmed' ? 'badge-confirmed' : 'badge-done'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-input"
                        style={{width:'130px', padding:'4px', fontSize:'13px'}}
                        value={a.status}
                        onChange={e => handleStatusChange(a.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button className="btn btn-red btn-sm" style={{marginLeft:'6px'}} onClick={() => handleDelete(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
 
export default AppointmentsPage;