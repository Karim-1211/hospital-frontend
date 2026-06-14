import React, { useEffect, useState } from 'react';
import api from '../services/api';

function PatientsPage() {
  const [patients, setPatients]     = useState([]);
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [dob, setDob]               = useState('');
  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [saveMsg, setSaveMsg]       = useState('');

  const fetchPatients = async () => {
    try { const res = await api.get('/patients'); setPatients(res.data); }
    catch { alert('Could not load patients'); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleAdd = async () => {
    if (!name) return alert('Please enter a name');
    try {
      await api.post('/patients', { name, phone, email, date_of_birth: dob });
      setName(''); setPhone(''); setEmail(''); setDob('');
      fetchPatients();
    } catch { alert('Could not add patient'); }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, phone: p.phone || '', email: p.email || '', date_of_birth: p.date_of_birth || '' });
    setSaveMsg('');
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (id) => {
    try {
      await api.put(`/patients/${id}`, editForm);
      setSaveMsg('✅ Patient updated!');
      setEditingId(null);
      fetchPatients();
      setTimeout(() => setSaveMsg(''), 3000);
    } catch { setSaveMsg('❌ Update failed.'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>👥 Patients</h2>
          <p>Add and manage all patient records</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="card">
        <div className="card-header"><h3>Add New Patient</h3></div>
        <div className="card-body">
          <div className="form-grid">
            <input className="form-input" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />
            <input className="form-input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <input className="form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="form-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
          </div>
          <button className="btn btn-blue" onClick={handleAdd}>+ Add Patient</button>
        </div>
      </div>

      {/* Success message */}
      {saveMsg && (
        <div style={{ margin: '0 0 16px', padding: '12px 16px', background: '#d1fae5', borderRadius: '10px', color: '#065f46', fontWeight: '600' }}>
          {saveMsg}
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div className="card-header"><h3>All Patients</h3></div>
        <div className="table-wrap">
          {patients.length === 0 ? <p className="empty">No patients found.</p> : (
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Date of Birth</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) =>
                  editingId === p.id ? (
                    /* ── EDIT ROW ── */
                    <tr key={p.id} style={{ background: '#f0f9ff' }}>
                      <td><span className="table-id">#{p.id}</span></td>
                      <td>
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="form-input"
                          style={{ minWidth: '130px' }}
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.phone}
                          onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                          className="form-input"
                          style={{ minWidth: '110px' }}
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.email}
                          onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          className="form-input"
                          style={{ minWidth: '150px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={editForm.date_of_birth}
                          onChange={e => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                          className="form-input"
                        />
                      </td>
                      <td style={{ display: 'flex', gap: '8px', paddingTop: '18px' }}>
                        <button onClick={() => saveEdit(p.id)} className="btn btn-green">💾 Save</button>
                        <button onClick={cancelEdit} className="btn btn-red">✖ Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    /* ── READ ROW ── */
                    <tr key={p.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td><span className="table-id">#{p.id}</span></td>
                      <td>
                        <div className="table-name-cell">
                          <div className="table-avatar" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                            {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="table-name">{p.name}</span>
                        </div>
                      </td>
                      <td>{p.phone || '—'}</td>
                      <td>{p.email || '—'}</td>
                      <td>{p.date_of_birth || '—'}</td>
                      <td>
                        <button onClick={() => startEdit(p)} className="btn btn-blue" style={{ padding: '6px 16px', fontSize: '13px' }}>
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientsPage;