
import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSocialLogin = (platform) => {
    alert(`Currently Not Working for ${platform}`)
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-brand-section">
        <div className="auth-brand-logo">
          <span>GDS Flight</span>
        </div>
        <div className="auth-brand-content">
          <h1>Unleash your inner traveler today. ✈️</h1>
        </div>
        <div></div> {/* Spacer for flex-between */}
      </div>

      <div className="auth-form-section">
        <div className="auth-container">
          <h2>Sign In To Your Account</h2>
          <p className="auth-subtitle">Let's sign in to your account and get started.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit">Sign In <span>→</span></button>
          </form>

          {error && <div className="error">{error}</div>}

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>

          <Link to="#" className="forgot-password">Forgot Password</Link>

          <div className="divider">OR</div>

          <div className="social-buttons">
            <button className="social-btn" onClick={() => handleSocialLogin('Facebook')}>
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('X')}>
              <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" alt="X" />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('Google')}>
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
