import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Box, Loader2 } from 'lucide-react';
import api from '@/services/api';
import image from '@/assets/image.png';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.auth.register(name, email, password);
      // Automatically navigate to login page upon success
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0 m-0 overflow-hidden bg-white">
      <div className="row h-100 g-0 m-0">

        {/* LEFT SIDE */}

        <div className="col-lg-6 col-md-6 p-0 position-relative d-none d-md-block">
          <img
            src={image}
            alt="factory"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top,#000000aa,#00000022)"
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "70px",
              left: "50px",
              color: "white",
              maxWidth: "420px"
            }}
          >
            <h1 className="titleAnim">The Future of</h1>
            <h1 className="titleBlueAnim">Supply Chain</h1>

            <p className="subtitleAnim">
              Optimize warehouse operations with AI logistics automation
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center bg-white p-0">

          <div
            className="card bg-white text-dark shadow-lg p-4 w-100 border-0"
            style={{ maxWidth: "420px", borderRadius: "18px" }}
          >

            {/* LOGO */}

            <div className="d-flex align-items-center gap-3 mb-4">

              <div className="logoBox" style={{ background: '#0ea5e9', padding: '10px', borderRadius: '12px' }}>
                <Box size={26} className="text-white" />
              </div>

              <div>
                <h5 className="m-0">Smart Inventory AI</h5>
                <small className="text-secondary">
                  Enterprise Management Suite
                </small>
              </div>

            </div>

            {/* TITLE */}

            <div className="mb-4">
              <h4 className="fw-bold">Join the future</h4>

              <p className="text-secondary small">
                Create an account to start optimizing your warehouse
              </p>
            </div>

            {error && (
              <div className="alert bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger small py-2 mb-4" role="alert">
                {error}
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleRegister}>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  FULL NAME
                </label>

                <input
                  type="text"
                  className="form-control bg-white text-dark border-secondary"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  className="form-control bg-white text-dark border-secondary"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  PASSWORD
                </label>

                <input
                  type="password"
                  className="form-control bg-white text-dark border-secondary"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn w-100 d-flex align-items-center justify-content-center gap-2 mt-4 text-white"
                style={{ background: '#0ea5e9', border: 'none' }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>

            </form>

            {/* SWITCH */}

            <p className="text-center text-secondary mt-4 small">

              Already have an account?

              <button
                className="btn btn-link text-info p-0 ms-1 text-decoration-none"
                onClick={() => navigate("/login")}
                style={{ color: '#0ea5e9' }}
              >
                Log in instead
              </button>

            </p>

          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
