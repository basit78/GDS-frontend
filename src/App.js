


import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Header from "./components/Header.js"
import HomePage from "./pages/HomePage.js"
import SearchPage from "./pages/SearchPage.js"
import BookingPage from "./pages/BookingPage.js"
import ConfirmationPage from "./pages/ConfirmationPage.js"
import NotFoundPage from "./pages/NotFoundPage.js"
import "./App.css"
import BookingLookupPage from "./pages/BookingLookupPage.js"
import LoginPage from "./pages/LoginPage.js"
import SignupPage from "./pages/SignupPage.js"
import ProtectedRoute from "./components/ProtectedRoute.js"
import { AuthProvider } from "./contexts/AuthContext.js"

function AppContent() {
  const location = useLocation()
  const hideHeaderPaths = ["/login", "/signup"]
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname)

  return (
    <div className="app">
      {!shouldHideHeader && <Header />}
      <main className={shouldHideHeader ? "auth-main" : "main-content"}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } />
          <Route path="/booking/:flightId" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/confirmation/:bookingId" element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          } />
          <Route path="/lookup" element={
            <ProtectedRoute>
              <BookingLookupPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
