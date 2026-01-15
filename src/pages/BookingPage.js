"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import PassengerForm from "../components/PassengerForm"
import FlightSummary from "../components/FlightSummary"
import { bookFlight } from "../services/api"
import "./BookingPage.css"

function BookingPage() {
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [pricedOffer, setPricedOffer] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { flightId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const storedFlight = sessionStorage.getItem("selectedFlight")
    const storedPricedOffer = sessionStorage.getItem("pricedOffer")

    if (storedFlight && storedPricedOffer) {
      const flight = JSON.parse(storedFlight)
      const pricedOffer = JSON.parse(storedPricedOffer)

      if (flight.id === flightId) {
        setSelectedFlight(flight)
        setPricedOffer(pricedOffer)
      } else {
        // toast.error("Flight information mismatch. Please search again.")
        navigate("/search")
      }
    } else {
      toast.error("No flight selected. Please search and select a flight.")
      navigate("/search")
    }
  }, [flightId, navigate])

  const handleBooking = async (passengerData) => {
    setIsLoading(true)

    try {
      const bookingResult = await bookFlight(pricedOffer.flightOffers[0], passengerData)

      sessionStorage.setItem("bookingConfirmation", JSON.stringify(bookingResult))

      toast.success("Booking successful!")

      navigate(`/confirmation/${bookingResult.id}`)
    } catch (error) {
      console.error("Error booking flight:", error)
      toast.error(error.message || "Failed to book flight. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedFlight || !pricedOffer) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading flight details...</p>
      </div>
    )
  }

  const numAdults = Number.parseInt(selectedFlight.travelerPricings.filter((p) => p.travelerType === "ADULT").length)
  const numChildren = Number.parseInt(selectedFlight.travelerPricings.filter((p) => p.travelerType === "CHILD").length)
  const totalPassengers = numAdults + numChildren

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Complete Your Booking</h1>

        <div className="booking-container">
          <div className="booking-main">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Passenger Information</h2>
                <p className="card-description">Please enter details for all {totalPassengers} passenger(s)</p>
              </div>
              <div className="card-content">
                <PassengerForm
                  numAdults={numAdults}
                  numChildren={numChildren}
                  onSubmit={handleBooking}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="booking-sidebar">
            <FlightSummary flight={selectedFlight} pricedOffer={pricedOffer} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
