import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, ShieldCheck, Cpu } from 'lucide-react';
import api from '../../services/api';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Mocking password change success
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess('Password changed successfully. Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="vh-100 w-100 d-flex align-items-center justify-content-center p-3" style={{ background: '#f1f5f9' }}>
      <div className="row g-0 glass-card overflow-hidden shadow-glow" style={{ maxWidth: '1000px', width: '100%', minHeight: '600px', background: '#fff' }}>
        {/* Visual Section */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center p-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(255, 255, 255, 0) 100%)' }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-20" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="z-1 text-center">
            <div className="mb-4 d-inline-block p-4 rounded-circle bg-info bg-opacity-10 border border-info border-opacity-20 shadow-glow">
              <Cpu size={64} className="text-info" />
            </div>
            <h1 className="display-5 fw-bold neon-text mb-3">SmartAI</h1>
            <h4 className="text-dark opacity-75 mb-4">Security Protocol Update</h4>
            
            <div className="d-flex flex-column gap-3 align-items-start mt-5">
              <div className="d-flex align-items-center gap-3 text-info">
                <ShieldCheck size={20} />
                <span className="small fw-bold tracking-wider">MANDATORY KEY ROTATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="col-md-6 p-5 d-flex flex-column justify-content-center bg-white">
          <div className="mb-5">
            <h2 className="text-dark fw-bold mb-2">Update Security Key</h2>
            <p className="text-muted">Set a new key for your terminal session</p>
          </div>
          
          {error && (
            <div className="alert bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger small py-2 mb-4" role="alert">
              <ShieldCheck size={16} className="me-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="alert bg-success bg-opacity-10 border-success border-opacity-20 text-success small py-2 mb-4" role="alert">
              <ShieldCheck size={16} className="me-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-info opacity-75 tracking-wider">CURRENT KEY</label>
              <div className="input-group glass-card border-0 p-1">
                <span className="input-group-text bg-transparent border-0">
                  <Lock size={18} className="text-muted" />
                </span>
                <input 
                  type="password" 
                  className="form-control bg-transparent border-0 text-dark" 
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-info opacity-75 tracking-wider">NEW KEY</label>
              <div className="input-group glass-card border-0 p-1">
                <span className="input-group-text bg-transparent border-0">
                  <Lock size={18} className="text-info" />
                </span>
                <input 
                  type="password" 
                  className="form-control bg-transparent border-0 text-dark" 
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-5">
              <label className="form-label small fw-bold text-info opacity-75 tracking-wider">CONFIRM NEW KEY</label>
              <div className="input-group glass-card border-0 p-1">
                <span className="input-group-text bg-transparent border-0">
                  <Lock size={18} className="text-info" />
                </span>
                <input 
                  type="password" 
                  className="form-control bg-transparent border-0 text-dark" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-info w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-glow border-0"
              disabled={loading || !!success}
              style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)', color: '#fff' }}
            >
              {loading && !success ? <Loader2 className="animate-spin" size={20} /> : 'UPDATE PROTOCOL'}
            </button>
            
            <button
              type="button"
              className="btn btn-link w-100 mt-3 text-muted text-decoration-none small"
              onClick={() => navigate('/')}
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
