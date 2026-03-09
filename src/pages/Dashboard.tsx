import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container-fluid vh-100 bg-dark text-white">

      {/* Top Bar */}

      <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">

        <h4 className="m-0">Smart Inventory AI</h4>

        <button
          className="btn btn-outline-light"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* Content */}

      <div className="p-4">

        <h1 className="fw-bold">Dashboard</h1>

        <p className="text-secondary">
          Welcome to your inventory management dashboard.
        </p>

      </div>

    </div>
  );
}