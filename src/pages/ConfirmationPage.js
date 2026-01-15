"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, parseISO } from "date-fns"
import toast from "react-hot-toast"
import "./ConfirmationPage.css"
import airlines from '../airlines.json'

function ConfirmationPage() {
  const [confirmation, setConfirmation] = useState(null)
  const { bookingId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const storedConfirmation = sessionStorage.getItem("bookingConfirmation")

    if (storedConfirmation) {
      const bookingConfirmation = JSON.parse(storedConfirmation)

      if (bookingConfirmation.id === bookingId) {
        setConfirmation(bookingConfirmation)
      } else {
        // toast.error("Booking information mismatch.")
        navigate("/")
      }
    } else {
      toast.error("No booking information found.")
      navigate("/")
    }
  }, [bookingId, navigate])

  const handleStartOver = () => {
    // Clear stored data
    sessionStorage.removeItem("flightSearchParams")
    sessionStorage.removeItem("selectedFlight")
    sessionStorage.removeItem("pricedOffer")
    sessionStorage.removeItem("bookingConfirmation")

    navigate("/")
  }

  if (!confirmation) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading booking details...</p>
      </div>
    )
  }

  const pnr = confirmation.associatedRecords[0].reference
  const flightOffer = confirmation.flightOffers[0]
  const outbound = flightOffer.itineraries[0]
  const inbound = flightOffer?.itineraries?.[1] 
  const travelers = confirmation.travelers

  const formatTime = (dateString) => {
    return format(parseISO(dateString), "HH:mm")
  }

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "EEE, MMM d, yyyy")
  }

  const calculateDuration = (segments) => {
    const departureTime = parseISO(segments[0].departure.at)
    const arrivalTime = parseISO(segments[segments.length - 1].arrival.at)
    const durationMinutes = Math.round((arrivalTime - departureTime) / (1000 * 60))
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return `${hours}h ${minutes}m`
  }
  const getAirlineName = (carrierCode) => {
    const airline = airlines.find(a => a.iata === carrierCode)
    return airline ? airline.name : carrierCode
  }


  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p className="booking-reference">
            Your booking reference number is <span className="pnr">{pnr}</span>
          </p>
        </div>

        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Flight Details</h2>
            <p className="card-description">Please arrive at the airport at least 2 hours before departure</p>
          </div>

          <div className="card-content">
            <div className="flight-details">
              <div className="flight-section">
                <div className="section-header">
                  <span className="section-icon">✈️</span>
                  <h3>Outbound Flight</h3>
                </div>

                <div className="flight-info">
                  <div className="flight-route">
                    <div className="departure">
                      <p className="date">{formatDate(outbound.segments[0].departure.at)}</p>
                      <p className="time">{formatTime(outbound.segments[0].departure.at)}</p>
                      <p className="airport">{outbound.segments[0].departure.iataCode}</p>
                    </div>

                    <div className="flight-duration">
                      <p>{calculateDuration(outbound.segments)}</p>
                      <div className="duration-line">
                        <div className="plane-icon">✈</div>
                      </div>
                      <p>{outbound.segments.length > 1 ? `${outbound.segments.length - 1} stop(s)` : "Direct"}</p>
                    </div>

                    <div className="arrival">
                      <p className="date">{formatDate(outbound.segments[outbound.segments.length - 1].arrival.at)}</p>
                      <p className="time">{formatTime(outbound.segments[outbound.segments.length - 1].arrival.at)}</p>
                      <p className="airport">{outbound.segments[outbound.segments.length - 1].arrival.iataCode}</p>
                    </div>
                  </div>

                  <div className="separator"></div>

                  <div className="flight-segments">
                    {outbound.segments.map((segment, index) => (
                      <div key={index} className="segment">
                        <div className="segment-airline">
                          <p className="airline">{getAirlineName(segment.carrierCode)}</p>
                          <p className="flight-number">
                            Flight {segment.carrierCode}
                            {segment.number}
                          </p>
                        </div>
                        <div className="segment-route">
                          <p>
                            {segment.departure.iataCode} {formatTime(segment.departure.at)} → {segment.arrival.iataCode}{" "}
                            {formatTime(segment.arrival.at)}
                          </p>
                          <p className="duration">Duration: {calculateDuration([segment])}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {inbound && (
                <div className="flight-section">
                  <div className="section-header">
                    <span className="section-icon return">✈️</span>
                    <h3>Return Flight</h3>
                  </div>

                  <div className="flight-info">
                    <div className="flight-route">
                      <div className="departure">
                        <p className="date">{formatDate(inbound.segments[0].departure.at)}</p>
                        <p className="time">{formatTime(inbound.segments[0].departure.at)}</p>
                        <p className="airport">{inbound.segments[0].departure.iataCode}</p>
                      </div>

                      <div className="flight-duration">
                        <p>{calculateDuration(inbound.segments)}</p>
                        <div className="duration-line">
                          <div className="plane-icon return">✈</div>
                        </div>
                        <p>{inbound.segments.length > 1 ? `${inbound.segments.length - 1} stop(s)` : "Direct"}</p>
                      </div>

                      <div className="arrival">
                        <p className="date">{formatDate(inbound.segments[inbound.segments.length - 1].arrival.at)}</p>
                        <p className="time">{formatTime(inbound.segments[inbound.segments.length - 1].arrival.at)}</p>
                        <p className="airport">{inbound.segments[inbound.segments.length - 1].arrival.iataCode}</p>
                      </div>
                    </div>

                    <div className="separator"></div>

                    <div className="flight-segments">
                      {inbound.segments.map((segment, index) => (
                        <div key={index} className="segment">
                          <div className="segment-airline">
                            <p className="airline">{getAirlineName(segment.carrierCode)}</p>
                            <p className="flight-number">
                              Flight {segment.carrierCode}
                              {segment.number}
                            </p>
                          </div>
                          <div className="segment-route">
                            <p>
                              {segment.departure.iataCode} {formatTime(segment.departure.at)} →{" "}
                              {segment.arrival.iataCode} {formatTime(segment.arrival.at)}
                            </p>
                            <p className="duration">Duration: {calculateDuration([segment])}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flight-section">
                <div className="section-header">
                  <span className="section-icon">👥</span>
                  <h3>Passenger Information</h3>
                </div>

                <div className="passenger-list">
                  {travelers.map((traveler, index) => (
                    <div key={index} className="passenger">
                      <div className="passenger-name">
                        <p className="name">
                          {traveler.name.firstName} {traveler.name.lastName}
                        </p>
                        <p className="passenger-number">Passenger {index + 1}</p>
                      </div>
                      <div className="passenger-ticket">
                        <p className="ticket-number">
                          Ticket #: {pnr}-{index + 1}
                        </p>
                        <p className="passport">
                          {traveler.documents && traveler.documents[0]
                            ? `Passport: ${traveler.documents[0].number}`
                            : "No document information"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button className="btn btn-outline" onClick={handleStartOver}>
              Book Another Flight
            </button>
            <div className="action-buttons">
              <button className="btn btn-outline" onClick={() => window.print()}>
                📄 Download
              </button>
              <button className="btn btn-outline">📤 Share</button>
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          <h4>Important Information:</h4>
          <ul className="info-list">
            <li>Please arrive at the airport at least 2 hours before your flight departure time.</li>
            <li>Don't forget to bring your passport and booking confirmation.</li>
            <li>Check-in opens 24 hours before departure and closes 1 hour before departure.</li>
            <li>
              For any changes or cancellations, please contact our customer service at least 24 hours before departure.
            </li>
            <li>Baggage allowance varies by fare type. Please check your ticket details for specific information.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage
