import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../../api/auth.api";
import factory from "../../assets/factory.png";
import { ArrowRight, Box } from "lucide-react";
import "../../App.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registerRequest(name, email, password);

      alert("Account created successfully");

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="container-fluid vh-100 p-0 m-0 overflow-hidden">
      <div className="row h-100 g-0 m-0">

        {/* LEFT SIDE */}

        <div className="col-lg-6 col-md-6 p-0 position-relative d-none d-md-block">
          <img
            src={factory}
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

        <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center bg-dark p-0">

          <div
            className="card bg-dark text-white shadow-lg p-4 w-100"
            style={{ maxWidth: "420px", borderRadius: "18px" }}
          >

            {/* LOGO */}

            <div className="d-flex align-items-center gap-3 mb-4">

              <div className="logoBox">
                <Box size={26} />
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

            {/* FORM */}

            <form onSubmit={handleRegister}>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  FULL NAME
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  PASSWORD
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="btn btn-info w-100 d-flex align-items-center justify-content-center gap-2 mt-3">
                Create Account
                <ArrowRight size={18} />
              </button>

            </form>

            {/* SWITCH */}

            <p className="text-center text-secondary mt-4 small">

              Already have an account?

              <button
                className="btn btn-link text-info p-0 ms-1"
                onClick={() => navigate("/login")}
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