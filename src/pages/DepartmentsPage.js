import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api.get('/departments')
      .then(res => setDepartments(res.data))
      .catch(() => alert('Could not load departments'));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-icon">🏢</div>
        <div>
          <h2>Departments</h2>
          <p>View all hospital departments</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>All Departments</h3></div>
        <div className="table-wrap">
          {departments.length === 0 ? <p className="empty">No departments found.</p> : (
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th></tr>
              </thead>
              <tbody>
                {departments.map((d, i) => (
                  <tr key={d.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td><span className="table-id">#{d.id}</span></td>
                    <td>
                      <div className="table-name-cell">
                        <div className="table-avatar" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)'}}>
                          {d.name ? d.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="table-name">{d.name}</span>
                      </div>
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

export default DepartmentsPage;