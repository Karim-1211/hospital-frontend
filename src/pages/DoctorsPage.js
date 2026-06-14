import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DoctorsPage() {
  const [doctors, setDoctors]       = useState([]);
  const [name, setName]             = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [saveMsg, setSaveMsg]       = useState('');

  const fetchDoctors = async () => {
    try { const res = await api.get('/doctors'); setDoctors(res.data); }
    catch { alert('Could not load doctors'); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleAdd = async () => {
    if (!name) return alert('Please enter a name');
    try {
      await api.post('/doctors', { name, specialization, phone, email });
      setName(''); setSpecialization(''); setPhone(''); setEmail('');
      fetchDoctors();
    } catch { alert('Could not add doctor'); }
  };

  const startEdit = (d) => {
    setEditingId(d.id);
    setEditForm({ name: d.name, specialization: d.specialization || '', phone: d.phone || '', email: d.email || '' });
    setSaveMsg('');
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (id) => {
    try {
      await api.put(`/doctors/${id}`, editForm);
      setSaveMsg('✅ Doctor updated!');
      setEditingId(null);
      fetchDoctors();
      setTimeout(() => setSaveMsg(''), 3000);
    } catch { setSaveMsg('❌ Update failed.'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>👨‍⚕️ Doctors</h2>
          <p>Add and manage all medical staff</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="card">
        <div className="card-header"><h3>Add New Doctor</h3></div>
        <div className="card-body">
          <div className="form-grid">
            <input className="form-input" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />
            <input className="form-input" placeholder="Specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} />
            <input className="form-input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <input className="form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className="btn btn-blue" onClick={handleAdd}>+ Add Doctor</button>
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
        <div className="card-header"><h3>All Doctors</h3></div>
        <div className="table-wrap">
          {doctors.length === 0 ? <p className="empty">No doctors found.</p> : (
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Specialization</th><th>Phone</th><th>Email</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d, i) =>
                  editingId === d.id ? (
                    /* ── EDIT ROW ── */
                    <tr key={d.id} style={{ background: '#f0f9ff' }}>
                      <td><span className="table-id">#{d.id}</span></td>
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
                          value={editForm.specialization}
                          onChange={e => setEditForm({ ...editForm, specialization: e.target.value })}
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
                      <td style={{ display: 'flex', gap: '8px', paddingTop: '18px' }}>
                        <button onClick={() => saveEdit(d.id)} className="btn btn-green">💾 Save</button>
                        <button onClick={cancelEdit} className="btn btn-red">✖ Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    /* ── READ ROW ── */
                    <tr key={d.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td><span className="table-id">#{d.id}</span></td>
                      <td>
                        <div className="table-name-cell">
                          <div className="table-avatar" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                            {d.name ? d.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="table-name">{d.name}</span>
                        </div>
                      </td>
                      <td><span className="spec-badge">{d.specialization || '—'}</span></td>
                      <td>{d.phone || '—'}</td>
                      <td>{d.email || '—'}</td>
                      <td>
                        <button onClick={() => startEdit(d)} className="btn btn-blue" style={{ padding: '6px 16px', fontSize: '13px' }}>
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

export default DoctorsPage;