"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./FlightSearchForm.css"
import allData from 'airport-iata-codes'

function FlightSearchForm({ onSearch }) {
  const [departureDate, setDepartureDate] = useState(new Date())
  const [returnDate, setReturnDate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [originSearch, setOriginSearch] = useState("")
  const [destinationSearch, setDestinationSearch] = useState("")

  // Get all airports data and sort by name
  const airports = useMemo(() => {
    const airportList = allData();
    return airportList.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter airports based on search
  const filteredOriginAirports = useMemo(() => {
    return airports.filter(airport =>
      airport.name?.toLowerCase().includes(originSearch?.toLowerCase()) ||
      airport.iata_code?.toLowerCase().includes(originSearch?.toLowerCase()) ||
      airport.city?.toLowerCase().includes(originSearch?.toLowerCase()) ||
      airport.city_code?.toLowerCase().includes(originSearch?.toLowerCase()) ||
      airport.country_id?.toLowerCase().includes(originSearch?.toLowerCase())
    );
  }, [airports, originSearch]);

  const filteredDestinationAirports = useMemo(() => {
    return airports.filter(airport =>
      airport.name?.toLowerCase().includes(destinationSearch?.toLowerCase()) ||
      airport.iata_code?.toLowerCase().includes(destinationSearch?.toLowerCase()) ||
      airport.city?.toLowerCase().includes(destinationSearch?.toLowerCase()) ||
      airport.city_code?.toLowerCase().includes(destinationSearch?.toLowerCase()) ||
      airport.country_id?.toLowerCase().includes(destinationSearch?.toLowerCase())
    );
  }, [airports, destinationSearch]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      origin: "",
      destination: "",
      adults: "1",
      children: "0",
      travelClass: "ECONOMY",
    },
  })

  const onSubmit = (data) => {
    setIsLoading(true)

    // Format dates for API
    const formattedDepartureDate = departureDate ? formatDate(departureDate) : null
    const formattedReturnDate = returnDate ? formatDate(returnDate) : null

    const searchParams = {
      ...data,
      departureDate: formattedDepartureDate,
      returnDate: formattedReturnDate,
    }

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false)
      onSearch(searchParams)
    }, 500)
  }

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flight-search-form">
      <div className="grid grid-cols-1 grid-cols-2">
        <div className="form-group">
          <label htmlFor="origin" className="form-label">
            <span>📍</span> Origin
          </label>
          <div className="input-container">
            <span className="input-icon">🛫</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for airport, city or country"
              value={originSearch}
              onChange={(e) => setOriginSearch(e.target.value)}
            />
            {originSearch && filteredOriginAirports.length > 0 && (
              <div className="dropdown-container">
                {filteredOriginAirports.slice(0, 10).map((airport) => (
                  <div
                    key={airport.iata}
                    className="dropdown-item"
                    onClick={() => {
                      setValue("origin", airport.iata_code);
                      setOriginSearch(`${Boolean(airport.city) ? airport.city : airport?.city_code} - ${airport.name} (${airport.iata_code})`);
                    }}
                  >
                    <div className="dropdown-item-header">
                      {Boolean(airport.city) ? airport.city : airport?.city_code} - {airport.name}
                    </div>
                    <div className="dropdown-item-sub">
                      {airport.country_id} ({airport.iata_code})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.origin && <p className="form-error">{errors.origin.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="destination" className="form-label">
            <span>📍</span> Destination
          </label>
          <div className="input-container">
            <span className="input-icon">🛬</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for airport, city or country"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
            />
            {destinationSearch && filteredDestinationAirports.length > 0 && (
              <div className="dropdown-container">
                {filteredDestinationAirports.slice(0, 10).map((airport) => (
                  <div
                    key={airport.iata}
                    className="dropdown-item"
                    onClick={() => {
                      setValue("destination", airport.iata_code);
                      setDestinationSearch(`${Boolean(airport.city) ? airport.city : airport?.city_code} - ${airport.name} (${airport.iata_code})`);
                    }}
                  >
                    <div className="dropdown-item-header">
                      {Boolean(airport.city) ? airport.city : airport?.city_code} - {airport.name}
                    </div>
                    <div className="dropdown-item-sub">
                      {airport.country_id} ({airport.iata_code})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.destination && <p className="form-error">{errors.destination.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 grid-cols-2">
        <div className="form-group">
          <label htmlFor="departureDate" className="form-label">
            <span>📅</span> Departure Date
          </label>
          <div className="input-container">
            <span className="input-icon">🗓️</span>
            <DatePicker
              id="departureDate"
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              minDate={new Date()}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="returnDate" className="form-label">
            <span>📅</span> Return Date (Optional)
          </label>
          <div className="input-container">
            <span className="input-icon">🔄</span>
            <DatePicker
              id="returnDate"
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              minDate={departureDate}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              placeholderText="One-way trip"
              isClearable
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 grid-cols-3">
        <div className="form-group">
          <label htmlFor="adults" className="form-label">
            <span>👤</span> Adults
          </label>
          <div className="input-container">
            <span className="input-icon">🚶</span>
            <select id="adults" className="form-control" {...register("adults")}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="children" className="form-label">
            <span>👶</span> Children (0-17)
          </label>
          <div className="input-container">
            <span className="input-icon">🍼</span>
            <select id="children" className="form-control" {...register("children")}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="travelClass" className="form-label">
            <span>🏷️</span> Travel Class
          </label>
          <div className="input-container">
            <span className="input-icon">💎</span>
            <select id="travelClass" className="form-control" {...register("travelClass")}>
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className="btn-search" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="spinner mr-2"></div>
            Searching...
          </>
        ) : (
          <>
            <span>🔍</span> Search Flights
          </>
        )}
      </button>
    </form>
  )
}

export default FlightSearchForm
