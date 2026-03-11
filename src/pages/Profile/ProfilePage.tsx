import React from 'react';
import { User, Mail, Shield, Key, Save } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">My Profile</h1>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 text-center">
            <div className="mx-auto bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
              <User size={40} />
            </div>
            <h4 className="mb-1">Admin User</h4>
            <p className="text-muted small mb-3">Administrator</p>
            <span className="badge bg-success-subtle text-success mb-4 px-3 py-2">Account Active</span>
            
            <div className="border-top pt-3 text-start">
              <div className="d-flex align-items-center gap-3 mb-3">
                <Mail size={18} className="text-muted" />
                <div>
                  <p className="text-muted small mb-0">Email</p>
                  <p className="mb-0 fw-medium">admin@pharma.com</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Shield size={18} className="text-muted" />
                <div>
                  <p className="text-muted small mb-0">Role</p>
                  <p className="mb-0 fw-medium">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 mb-4">
            <h5 className="mb-4">Personal Information</h5>
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Full Name</label>
                  <input type="text" className="form-control" defaultValue="Admin User" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <input type="email" className="form-control" defaultValue="admin@pharma.com" disabled />
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-primary d-flex align-items-center gap-2">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="card border-0 shadow-sm rounded-3 p-4">
            <h5 className="mb-4">Security Settings</h5>
            <form>
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label small fw-bold text-muted">Current Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Key size={18} /></span>
                    <input type="password" className="form-control" placeholder="••••••••" />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">New Password</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-outline-primary">Update Password</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
