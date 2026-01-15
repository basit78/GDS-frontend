import { format, parseISO } from "date-fns"
import "./FlightSummary.css"

function FlightSummary({ flight, pricedOffer }) {
  // Extract flight details
  const outbound = flight.itineraries[0]
  const inbound = flight.itineraries[1] // May be undefined for one-way flights
  const firstOutboundSegment = outbound.segments[0]
  const lastOutboundSegment = outbound.segments[outbound.segments.length - 1]

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

  // Get number of passengers
  const numAdults = flight.travelerPricings.filter((p) => p.travelerType === "ADULT").length
  const numChildren = flight.travelerPricings.filter((p) => p.travelerType === "CHILD").length

  return (
    <div className="flight-summary">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Booking Summary</h3>
        </div>
        <div className="card-content">
          <div className="summary-section">
            <div className="section-header">
              <span className="section-icon">✈️</span>
              <h4>Outbound Flight</h4>
            </div>
            <div className="section-content">
              <p className="route">
                {firstOutboundSegment.departure.iataCode} to {lastOutboundSegment.arrival.iataCode}
              </p>
              <p className="date">{formatDate(firstOutboundSegment.departure.at)}</p>
              <p className="time">
                {formatTime(firstOutboundSegment.departure.at)} - {formatTime(lastOutboundSegment.arrival.at)}
              </p>
              <p className="duration">Duration: {calculateDuration(outbound.segments)}</p>
            </div>
          </div>

          {inbound && (
            <div className="summary-section">
              <div className="section-header">
                <span className="section-icon return">✈️</span>
                <h4>Return Flight</h4>
              </div>
              <div className="section-content">
                <p className="route">
                  {inbound.segments[0].departure.iataCode} to{" "}
                  {inbound.segments[inbound.segments.length - 1].arrival.iataCode}
                </p>
                <p className="date">{formatDate(inbound.segments[0].departure.at)}</p>
                <p className="time">
                  {formatTime(inbound.segments[0].departure.at)} -{" "}
                  {formatTime(inbound.segments[inbound.segments.length - 1].arrival.at)}
                </p>
                <p className="duration">Duration: {calculateDuration(inbound.segments)}</p>
              </div>
            </div>
          )}

          <div className="summary-section">
            <div className="section-header">
              <span className="section-icon">👥</span>
              <h4>Passengers</h4>
            </div>
            <div className="section-content">
              <p>
                {numAdults} Adult(s){numChildren > 0 ? `, ${numChildren} Child(ren)` : ""}
              </p>
            </div>
          </div>

          <div className="separator"></div>

          <div className="price-summary">
            <div className="price-row">
              <span>Base Fare</span>
              <span>
                {flight.price.base} {flight.price.currency}
              </span>
            </div>
            <div className="price-row">
              <span>Taxes & Fees</span>
              <span>
                {(Number.parseFloat(flight.price.total) - Number.parseFloat(flight.price.base)).toFixed(2)}{" "}
                {flight.price.currency}
              </span>
            </div>
            <div className="separator"></div>
            <div className="price-row total">
              <span>Total Price</span>
              <span>
                {flight.price.total} {flight.price.currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightSummary
