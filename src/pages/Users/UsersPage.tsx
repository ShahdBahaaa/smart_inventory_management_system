import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Plus, Edit2, UserX, UserCheck, Save, X, Power } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../shared/Layout/PageHeader';
import DataTable from '../../shared/Tables/DataTable';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'WAREHOUSE_STAFF', status: 'ACTIVE' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { id: Date.now(), ...formData };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    // Reset form
    setFormData({ name: '', email: '', password: '', role: 'WAREHOUSE_STAFF', status: 'ACTIVE' });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, name: formData.name, role: formData.role, status: formData.status } : u));
    setEditingUser(null);
  };

  const handleInlineUpdate = (id: number, field: string, value: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (user: any) => (
        <div className="d-flex align-items-center gap-3">
          <div className="bg-info bg-opacity-10 p-2 rounded-circle border border-info border-opacity-25">
            <ShieldCheck size={16} className="text-info" />
          </div>
          <span className="fw-medium">{user.name}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email', render: (user: any) => <span className="text-muted">{user.email}</span> },
    {
      key: 'role',
      label: 'Role',
      render: (user: any) => (
        <div className="d-flex justify-content-start">
          <div className="bg-white border rounded-pill px-4 py-2 d-flex align-items-center justify-content-center" style={{ minWidth: '180px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span className="fw-bold small">{user.role}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: any) => (
        <div className="d-flex align-items-center gap-2">
          {user.status === 'ACTIVE' ? (
            <span className="badge rounded-pill px-3 fw-bold" style={{ backgroundColor: '#E4F3ED', color: '#14805A', border: '1px solid #C4DFD3', padding: '6px 14px', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              ACTIVE
            </span>
          ) : (
            <span className="badge rounded-pill px-3 fw-bold" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', padding: '6px 14px', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              INACTIVE
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      align: 'end' as const,
      render: (user: any) => (
        <div className="d-flex justify-content-end align-items-center gap-4">
          <button
            className={`btn rounded-circle d-flex align-items-center justify-content-center p-0 transition-all ${user.status === 'ACTIVE' ? 'text-white border-0' : 'bg-light text-secondary border border-secondary border-opacity-25'}`}
            style={{ width: '32px', height: '32px', backgroundColor: user.status === 'ACTIVE' ? '#14805A' : '' }}
            title={user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
            onClick={() => handleInlineUpdate(user.id, 'status', user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
          >
            <Power size={14} strokeWidth={2.5} />
          </button>
          
          <button
            className="btn rounded-1 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: '#D9F3FA', color: '#00BFFF', border: 'none', width: '32px', height: '32px' }}
            title="Edit User"
            onClick={() => {
              setFormData({ name: user.name, email: user.email, password: '', role: user.role, status: user.status });
              setEditingUser(user);
            }}
          >
            <Edit2 size={16} strokeWidth={2} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <PageHeader
          title="Authorized Personnel"
          subtitle="Manage system access and security protocols"
        />
        <button
          className="btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-bold transition-all"
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'WAREHOUSE_STAFF', status: 'ACTIVE' });
            setShowAddModal(true);
          }}
          style={{ 
            background: '#00BFFF', 
            color: '#111827',
            border: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 191, 255, 0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 191, 255, 0.5)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 191, 255, 0.3)'}
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add User</span>
        </button>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-6 col-lg-4">
          <div className="input-group glass-card border-0 p-1">
            <span className="input-group-text bg-transparent border-0">
              <Search size={18} className="text-info" />
            </span>
            <input
              type="text"
              className="form-control bg-transparent border-0 text-dark"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="input-group glass-card border-0 p-1">
            <span className="input-group-text bg-transparent border-0">
              <Filter size={18} className="text-info" />
            </span>
            <select
              className="form-select bg-transparent border-0 text-dark"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="INVENTORY_MANAGER">Inventory Manager</option>
              <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
      />

      {/* Add / Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-0">
              <div className="modal-header border-secondary border-opacity-10">
                <h5 className="modal-title fw-bold neon-text">
                  {editingUser ? 'Edit Personnel' : 'Add New Personnel'}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); setEditingUser(null); }}></button>
              </div>
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  {!editingUser && (
                    <>
                      <div className="mb-3">
                        <label className="form-label small text-muted fw-bold">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small text-muted fw-bold">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Role</label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="INVENTORY_MANAGER">Inventory Manager</option>
                        <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-10">
                  <button type="button" className="btn btn-light" onClick={() => { setShowAddModal(false); setEditingUser(null); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-info text-white border-0 shadow-glow" style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)' }}>
                    <Save size={16} className="me-2 d-inline-block" />
                    {editingUser ? 'Save Updates' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
