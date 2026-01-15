"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import "./FlightList.css"
import airlines from '../airlines.json'

function FlightList({ flights, onSelectFlight }) {
  const [loadingFlightId, setLoadingFlightId] = useState(null)


  const calculateDuration = (departure, arrival) => {
    const departureTime = parseISO(departure)
    const arrivalTime = parseISO(arrival)
    const durationMinutes = Math.round((arrivalTime - departureTime) / (1000 * 60))
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const formatTime = (dateString) => {
    return format(parseISO(dateString), "HH:mm")
  }

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "EEE, MMM d")
  }

  
  const getAirlineName = (carrierCode) => {
    const airline = airlines.find(a => a.iata === carrierCode)
    return airline ? airline.name : carrierCode
  }

  const handleSelectFlight = async (flight) => {
    setLoadingFlightId(flight.id)
    try {
      await onSelectFlight(flight)
    } finally {
      setLoadingFlightId(null)
    }
  }

  if (flights.length === 0) {
    return (
      <div className="no-flights">
        <h2>No Flights Found</h2>
        <p>Try adjusting your search criteria or selecting different dates.</p>
      </div>
    )
  }
  

  return (
    <div className="flight-list">
      <div className="flight-list-header">
        <h2>Available Flights</h2>
        <p>{flights.length} flights found</p>
      </div>

      {flights.map((flight) => {
        const outbound = flight.itineraries[0]
        const inbound = flight?.itineraries?.[1]
        const firstSegment = outbound.segments[0]
        const lastSegment = outbound.segments[outbound.segments.length - 1]

        return (
          <div key={flight.id} className="flight-card">
            <div className="flight-card-header">
              <div className="airline">
                <h3>{getAirlineName(firstSegment.carrierCode)}</h3>
                <span className="flight-number">
                  {firstSegment.carrierCode}
                  {firstSegment.number}
                </span>
              </div>
            </div>

            <div className="flight-card-content">
              <div className="flight-route">
                <div className="flight-time">
                  <div className="time">
                    {formatTime(firstSegment.departure.at)}
                  </div>
                  <div className="airport">
                    {firstSegment.departure.iataCode}
                  </div>
                </div>

                <div className="flight-duration">
                  <div className="duration-text">
                    {calculateDuration(
                      firstSegment.departure.at,
                      lastSegment.arrival.at
                    )}
                  </div>
                  <div className="duration-line">
                    <div className="plane-icon">✈</div>
                  </div>
                  <div className="stops-text">
                    {outbound.segments.length > 1
                      ? `${outbound.segments.length - 1} stop(s)`
                      : "Direct"}
                  </div>
                </div>

                <div className="flight-time">
                  <div className="time">
                    {formatTime(lastSegment.arrival.at)}
                  </div>
                  <div className="airport">{lastSegment.arrival.iataCode}</div>
                </div>

                <div className="flight-price">
                  <div className="price">
                    {flight.price.total} {flight.price.currency}
                  </div>
                  <div className="date">
                    {formatDate(firstSegment.departure.at)}
                  </div>
                </div>
              </div>

              {inbound && (
                <>
                  <div className="separator"></div>
                  <div className="flight-route">
                    <div className="flight-time">
                      <div className="time">
                        {formatTime(inbound.segments[0].departure.at)}
                      </div>
                      <div className="airport">
                        {inbound.segments[0].departure.iataCode}
                      </div>
                    </div>

                    <div className="flight-duration">
                      <div className="duration-text">
                        {calculateDuration(
                          inbound.segments[0].departure.at,
                          inbound.segments[inbound.segments.length - 1].arrival
                            .at
                        )}
                      </div>
                      <div className="duration-line">
                        <div className="plane-icon return">✈</div>
                      </div>
                      <div className="stops-text">
                        {inbound.segments.length > 1
                          ? `${inbound.segments.length - 1} stop(s)`
                          : "Direct"}
                      </div>
                    </div>

                    <div className="flight-time">
                      <div className="time">
                        {formatTime(
                          inbound.segments[inbound.segments.length - 1].arrival
                            .at
                        )}
                      </div>
                      <div className="airport">
                        {
                          inbound.segments[inbound.segments.length - 1].arrival
                            .iataCode
                        }
                      </div>
                    </div>

                    <div className="flight-price">
                      <div className="date">
                        {formatDate(inbound.segments[0].departure.at)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flight-details">
                <div className="details-header">Flight Details</div>
                <div className="details-content">
                  <div className="details-section">
                    <h4>Outbound Flight</h4>
                    {outbound.segments.map((segment, index) => (
                      <div key={index} className="segment">
                        <div className="segment-header">
                          <div>
                            <div className="segment-times">
                              {formatTime(segment.departure.at)} -{" "}
                              {formatTime(segment.arrival.at)}
                            </div>
                            <div className="segment-airports">
                              {segment.departure.iataCode} to{" "}
                              {segment.arrival.iataCode}
                            </div>
                          </div>
                          <div className="segment-airline">
                            <div>
                              {(getAirlineName(segment.carrierCode))}
                            </div>
                            <div className="segment-flight">
                              {segment.carrierCode}
                              {segment.number}
                            </div>
                          </div>
                        </div>
                        <div className="segment-duration">
                          Duration:{" "}
                          {calculateDuration(
                            segment.departure.at,
                            segment.arrival.at
                          )}
                        </div>
                        {index < outbound.segments.length - 1 && (
                          <div className="connection-time">
                            Connection time:{" "}
                            {calculateDuration(
                              segment.arrival.at,
                              outbound.segments[index + 1].departure.at
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {inbound && (
                    <div className="details-section">
                      <h4>Return Flight</h4>
                      {inbound.segments.map((segment, index) => (
                        <div key={index} className="segment">
                          <div className="segment-header">
                            <div>
                              <div className="segment-times">
                                {formatTime(segment.departure.at)} -{" "}
                                {formatTime(segment.arrival.at)}
                              </div>
                              <div className="segment-airports">
                                {segment.departure.iataCode} to{" "}
                                {segment.arrival.iataCode}
                              </div>
                            </div>
                            <div className="segment-airline">
                              <div>{getAirlineName(segment.carrierCode)}</div>
                              <div className="segment-flight">
                                {segment.carrierCode}
                                {segment.number}
                              </div>
                            </div>
                          </div>
                          <div className="segment-duration">
                            Duration:{" "}
                            {calculateDuration(
                              segment.departure.at,
                              segment.arrival.at
                            )}
                          </div>
                          {index < inbound.segments.length - 1 && (
                            <div className="connection-time">
                              Connection time:{" "}
                              {calculateDuration(
                                segment.arrival.at,
                                inbound.segments[index + 1].departure.at
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="details-section">
                    <h4>Fare Details</h4>
                    <div className="fare-details">
                      <div className="fare-item">
                        <div className="fare-label">Fare Type</div>
                        <div className="fare-value">
                          {
                            flight.travelerPricings[0].fareDetailsBySegment[0]
                              .cabin
                          }
                        </div>
                      </div>
                      <div className="fare-item">
                        <div className="fare-label">Baggage Allowance</div>
                        <div className="fare-value">
                          {flight.travelerPricings[0].fareDetailsBySegment[0]
                            .includedCheckedBags.weight
                            ? `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight}${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weightUnit}`
                            : `${
                                flight.travelerPricings[0]
                                  .fareDetailsBySegment[0].includedCheckedBags
                                  .quantity || 0
                              } piece(s)`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flight-card-footer">
              <div className="price-guarantee">
                <span className="guarantee-icon">💰</span>
                <span>Best Price Guarantee</span>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleSelectFlight(flight)}
                disabled={loadingFlightId === flight.id}
              >
                {loadingFlightId === flight.id ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Select"
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default FlightList
