"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { getBooking } from "../services/api"
import BookingDetails from "./BookingDetails.js"
import "./BookingLookupPage.css"

function BookingLookupPage() {
  const [bookingId, setBookingId] = useState("")
  const [pnr, setPnr] = useState("")
  const [lastName, setLastName] = useState("")
  const [bookingDetails, setBookingDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // if (!pnr || !lastName) {
    //   toast.error("Please enter both booking reference and last name")
    //   return
    // }
    
    if (!bookingId) {
      toast.error("Please enter booking id")
      return
    }

    setIsLoading(true)

    try {
      // Call the API to get booking details
      const result = await getBooking(bookingId)

      console.log("result getBooking", result);
      
      // Store the booking details
      setBookingDetails(result)

    //   // Store in session storage for potential use in other pages
    //   sessionStorage.setItem("bookingConfirmation", JSON.stringify(result))

      toast.success("Booking found!")
    } catch (error) {
      console.error("Error retrieving booking:", error)
      toast.error(error.message || "Booking not found. Please check your details and try again.")
      setBookingDetails(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewAnotherBooking = () => {
    setBookingDetails(null)
    setPnr("")
    setLastName("")
  }

  return (
    <div className="booking-lookup-page">
      <div className="container">
        <h1 className="page-title">Retrieve Your Booking</h1>

        {!bookingDetails ? (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Enter Your Booking Details</h2>
              <p className="card-description">
                Please enter your booking reference number and last name to retrieve your booking
              </p>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} className="lookup-form">
                {/* <div className="form-group">
                  <label htmlFor="pnr" className="form-label">
                    Booking Reference (PNR)
                  </label>
                  <input
                    id="pnr"
                    type="text"
                    className="form-control"
                    placeholder="e.g. ABC123"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.toUpperCase())}
                    required
                  />
                  <p className="form-hint">The 6-character code from your booking confirmation</p>
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div> */}

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Booking ID
                  </label>
                  <input
                    id="bookingId"
                    type="text"
                    className="form-control"
                    placeholder="Enter Bookinng ID"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    required
                  />
                </div> 
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Retrieving Booking...
                    </>
                  ) : (
                    "Retrieve Booking"
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <BookingDetails booking={bookingDetails} />

            <div className="lookup-actions">
              <button className="btn btn-outline" onClick={handleViewAnotherBooking}>
                Look Up Another Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BookingLookupPage
