import { useNavigate } from "react-router-dom"
import FlightSearchForm from "../components/FlightSearchForm"
import "./HomePage.css"

function HomePage() {
  const navigate = useNavigate()

  const handleSearch = (searchParams) => {
    sessionStorage.setItem("flightSearchParams", JSON.stringify(searchParams))
    navigate("/search")
  }

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find and Book Your Perfect Flight</h1>
          <p className="hero-subtitle">Search hundreds of airlines and book your next trip with ease</p>
        </div>
      </div>

      <div className="search-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Search Flights</h2>
            <p className="card-description">Enter your travel details to find available flights</p>
          </div>
          <div className="card-content">
            <FlightSearchForm onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2 className="section-title">Why Book With Us</h2>
          <div className="grid grid-cols-1 grid-cols-3">
            <div className="feature-card">
              <div className="feature-icon">✈️</div>
              <h3 className="feature-title">Best Flight Deals</h3>
              <p className="feature-description">Find the best prices on flights from hundreds of airlines</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Booking</h3>
              <p className="feature-description">Book with confidence with our secure payment system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Global Coverage</h3>
              <p className="feature-description">Search and book flights to destinations worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
