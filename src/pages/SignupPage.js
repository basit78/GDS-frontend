
import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

const SignupPage = () => {
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      await register(name, email, password)
      setSuccess("Signup successful! Please login.")
      setTimeout(() => navigate("/login"), 1500)
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
          <h1>Start your journey with us today. 🌍</h1>
        </div>
        <div></div>
      </div>

      <div className="auth-form-section">
        <div className="auth-container">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join us and start booking your flights.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <button type="submit">Create Account <span>→</span></button>
          </form>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>

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

export default SignupPage
