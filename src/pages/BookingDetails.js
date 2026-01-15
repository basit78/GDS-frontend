"use client"

import { format, parseISO } from "date-fns"
import "./BookingDetails.css"
import allData from 'airport-iata-codes'

function BookingDetails({ booking }) {
  // Extract booking details
  const pnr = booking?.rawResponse?.associatedRecords[0].reference
  const flightOffer = booking?.rawResponse?.flightOffers[0]
  const outbound = flightOffer?.itineraries[0]
  const inbound = flightOffer?.itineraries[1] // May be undefined for one-way flights
  const travelers = booking?.rawResponse?.travelers
  const airlines = booking?.rawResponse?.airlines


  console.log("outbound", outbound);
  
  // Format time for display
  const formatTime = (dateString) => {
    return format(parseISO(dateString), "HH:mm")
  }

  // Format date for display
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "EEE, MMM d, yyyy")
  }

  // Calculate flight duration in hours and minutes
  const calculateDuration = (segments) => {
    const departureTime = parseISO(segments[0].departure.at)
    const arrivalTime = parseISO(segments[segments.length - 1].arrival.at)
    const durationMinutes = Math.round((arrivalTime - departureTime) / (1000 * 60))
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return `${hours}h ${minutes}m`
  }

  // Get airline name from carrier code
  const getAirlineName = (carrierCode) => {
    // In a real app, you would have a mapping of carrier codes to airline names
    const airlines = {
      AF: "Air France",
      BA: "British Airways",
      LH: "Lufthansa",
      QF: "Qantas",
      SQ: "Singapore Airlines",
      EK: "Emirates",
      TG: "Thai Airways",
      // Add more airlines as needed
    }
    return airlines[carrierCode] || carrierCode
  }

  // Get booking status
  const getBookingStatus = () => {
    // In a real app, you would get this from the booking data
    return "Confirmed"
  }

  return (
    <div className="booking-details">
      <div className="booking-header">
        <div className="booking-status">
          <span className={`status-indicator ${getBookingStatus().toLowerCase()}`}></span>
          <span className="status-text">{getBookingStatus()}</span>
        </div>
        <h2 className="booking-reference">
          Booking Reference: <span className="pnr">{pnr}</span>
        </h2>
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Flight Details</h2>
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
                    <p className="airport" title={allData(outbound.segments[0].departure.iataCode)?.[0]?.name}>
                      {outbound.segments[0].departure.iataCode}
                    </p>
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
                    <p className="airport" title={allData(outbound.segments[outbound.segments.length - 1].arrival.iataCode)?.[0]?.name}>
                      {outbound.segments[outbound.segments.length - 1].arrival.iataCode}
                    </p>
                  </div>
                </div>

                <div className="separator"></div>

                <div className="flight-segments">
                  {outbound.segments.map((segment, index) => (
                    <div key={index} className="segment">
                      <div className="segment-airline">
                        <p className="airline">{airlines?.find(val => val?.iataCode == segment.carrierCode)?.commonName ?? ""} ({getAirlineName(segment.carrierCode)})</p>
                        <p className="flight-number">
                          Flight {segment.carrierCode}
                          {segment.number}
                        </p>
                      </div>
                      <div className="segment-route">
                        <p title={`${allData(segment?.departure?.iataCode ?? '')?.[0]?.name} → ${allData(segment?.arrival?.iataCode ?? '')?.[0]?.name}`}  >
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
                      <p className="airport" title={allData(inbound.segments[0].departure.iataCode)?.[0]?.name}>
                        {inbound.segments[0].departure.iataCode}
                      </p>
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
                      <p className="airport" title={allData(inbound.segments[inbound.segments.length - 1].arrival.iataCode)?.[0]?.name}>
                        {inbound.segments[inbound.segments.length - 1].arrival.iataCode}
                      </p>
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
                            {allData(segment?.departure?.iataCode ?? '')?.[0]?.name} {segment.departure.iataCode} {formatTime(segment.departure.at)} → {segment.arrival.iataCode}{" "}
                            {formatTime(segment.arrival.at)}
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

            <div className="flight-section">
              <div className="section-header">
                <span className="section-icon">💰</span>
                <h3>Price Details</h3>
              </div>

              <div className="price-details">
                <div className="price-row">
                  <span>Base Fare</span>
                  <span>
                    {flightOffer.price.base} {flightOffer.price.currency}
                  </span>
                </div>
                <div className="price-row">
                  <span>Taxes & Fees</span>
                  <span>
                    {(Number.parseFloat(flightOffer.price.total) - Number.parseFloat(flightOffer.price.base)).toFixed(
                      2,
                    )}{" "}
                    {flightOffer.price.currency}
                  </span>
                </div>
                <div className="separator"></div>
                <div className="price-row total">
                  <span>Total Price</span>
                  <span>
                    {flightOffer.price.total} {flightOffer.price.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer">
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
        </ul>
      </div>
    </div>
  )
}

export default BookingDetails
