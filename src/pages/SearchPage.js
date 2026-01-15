"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import FlightSearchForm from "../components/FlightSearchForm"
import FlightList from "../components/FlightList"
import FlightFilters from "../components/FlightFilters"
import { searchFlights, getPricing } from "../services/api"
import "./SearchPage.css"

function SearchPage() {
  const [flights, setFlights] = useState([])
  const [filters, setFilters] = useState({ price: 2000, stops: [], airlines: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedParams = sessionStorage.getItem("flightSearchParams")
    if (storedParams) {
      const params = JSON.parse(storedParams)
      setSearchParams(params)
      handleSearch(params)
    }
  }, [])

  const handleSearch = async (params) => {
    setIsLoading(true)
    setSearchParams(params)

    try {
      const results = await searchFlights(params)
      setFlights(results)

      if (results.length === 0) {
        toast.error("No flights found. Try different dates or destinations.")
      } else {
        toast.success(`Found ${results.length} flights matching your criteria.`)
      }
    } catch (error) {
      console.error("Error searching flights:", error)
      toast.error(error.message || "Failed to search flights. Please try again.")
      setFlights([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      // Price filter
      if (parseFloat(flight.price.total) > filters.price) return false

      // Stops filter
      const stops = flight.itineraries[0].segments.length - 1
      if (filters.stops.length > 0) {
        if (filters.stops.includes(0) && stops === 0) {
          // Keep if direct and direct is selected
        } else if (filters.stops.includes(1) && stops === 1) {
          // Keep if 1 stop and 1 stop is selected
        } else if (filters.stops.includes(2) && stops >= 2) {
          // Keep if 2+ stops and 2+ is selected
        } else {
          return false
        }
      }

      // Airline filter
      if (filters.airlines.length > 0) {
        const flightAirlines = new Set(flight.itineraries[0].segments.map(s => s.carrierCode))
        const matchesAirline = filters.airlines.some(a => flightAirlines.has(a))
        if (!matchesAirline) return false
      }

      return true
    })
  }, [flights, filters])

  const handleSelectFlight = async (flight) => {
    try {
      toast.loading("Processing your selection...", { id: "flightSelection" })

      const pricedOffer = await getPricing(flight)

      sessionStorage.setItem("selectedFlight", JSON.stringify(flight))
      sessionStorage.setItem("pricedOffer", JSON.stringify(pricedOffer))

      toast.success("Flight selected!", { id: "flightSelection" })

      navigate(`/booking/${flight.id}`)
    } catch (error) {
      console.error("Error selecting flight:", error)
      toast.error(error.message || "This flight may no longer be available", { id: "flightSelection" })
    }
  }

  return (
    <div className="search-page">
      <div className="container">
        <h1 className="page-title">Flight Search</h1>

        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Search Criteria</h2>
          </div>
          <div className="card-content">
            <FlightSearchForm onSearch={handleSearch} initialValues={searchParams} />
          </div>
        </div>

        {flights.length > 0 && !isLoading && (
          <div className="search-layout">
            <aside className="filter-sidebar">
              <FlightFilters flights={flights} onFilterChange={handleFilterChange} />
            </aside>
            <main className="results-content">
              <FlightList flights={filteredFlights} onSelectFlight={handleSelectFlight} />
            </main>
          </div>
        )}

        {flights.length === 0 && !isLoading && (
          <div className="search-results">
            <FlightList flights={[]} onSelectFlight={handleSelectFlight} />
          </div>
        )}

        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Searching for flights...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
