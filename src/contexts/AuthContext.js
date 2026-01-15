import React, { createContext, useContext, useState, useEffect } from "react"
import { signin, signup } from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem("token") || null)

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user))
    else localStorage.removeItem("user")
    if (token) localStorage.setItem("token", token)
    else localStorage.removeItem("token")
  }, [user, token])

  const login = async (email, password) => {
    const data = await signin({ email, password })
    setUser(data.user)
    setToken(data.token)
    return data
  }

  const register = async (name, email, password) => {
    return await signup({ name, email, password })
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
