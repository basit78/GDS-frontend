import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Header.css"

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">G</div>
            <h1>GDS Flight</h1>
          </Link>

          <nav className="nav">
            <ul className="nav-list">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/search" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Search
                </NavLink>
              </li>
              <li>
                <NavLink to="/lookup" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Manage Booking
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="user-actions">
            {user && (
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
