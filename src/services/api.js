// API functions for interacting with the flight booking backend

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4324/api"

/**
 * Handle API response errors
 * @param {Response} response
 * @throws {Error}
 */
const handleResponseError = async (response) => {
  let errorData
  try {
    errorData = await response.json()
  } catch (e) {
    // If parsing JSON fails, fallback to status text
    throw new Error(`Server Error: ${response.status} ${response.statusText}`)
  }

  // Handle Amadeus API error structure
  if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    const primaryError = errorData.errors[0]
    throw new Error(primaryError.detail || primaryError.title || "An unexpected error occurred with the flight service.")
  }

  // Handle standard error structure
  throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`)
}

/**
 * Handle network or fetch errors
 * @param {Error} error
 * @throws {Error}
 */
const handleNetworkError = (error) => {
  console.error("API Call Failed:", error)
  if (error.message === "Failed to fetch") {
    throw new Error("Unable to connect to the server. Please check your internet connection and try again.")
  }
  throw error
}

/**
 * User signup
 * @param {Object} userData - { email, password, name }
 * @returns {Promise<Object>} - API response
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      await handleResponseError(response)
    }

    return await response.json()
  } catch (error) {
    handleNetworkError(error)
  }
}

/**
 * User signin
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - API response with token and user
 */
export const signin = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      await handleResponseError(response)
    }

    return await response.json()
  } catch (error) {
    handleNetworkError(error)
  }
}

/**
 * Search for flights based on search criteria
 * @param {Object} searchParams - Flight search parameters
 * @returns {Promise<Array>} - Array of flight offers
 */
export const searchFlights = async (searchParams) => {
  try {
    const queryString = new URLSearchParams({
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      ...(searchParams.returnDate && { returnDate: searchParams.returnDate }),
      adults: searchParams.adults || "1",
      ...(searchParams.children && { children: searchParams.children }),
      ...(searchParams.travelClass && { travelClass: searchParams.travelClass }),
    }).toString()

    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/flights/search?${queryString}`, {
      credentials: 'include',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    })

    if (!response.ok) {
      await handleResponseError(response)
    }

    return await response.json()
  } catch (error) {
    handleNetworkError(error)
  }
}

/**
 * Get pricing for a specific flight offer
 * @param {Object} flightOffer - Flight offer to price
 * @returns {Promise<Object>} - Priced flight offer
 */
export const getPricing = async (flightOffer) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/flights/price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      credentials: 'include',
      body: JSON.stringify({ flightOfferId: flightOffer.id }),
    })

    if (!response.ok) {
      await handleResponseError(response)
    }

    return await response.json()
  } catch (error) {
    handleNetworkError(error)
  }
}

/**
 * Book a flight
 * @param {Object} flightOffer - Priced flight offer
 * @param {Array} travelers - Array of traveler information
 * @returns {Promise<Object>} - Booking confirmation
 */
export const bookFlight = async (flightOffer, travelers) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/flights/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      credentials: 'include',
      body: JSON.stringify({ travelers }),
    })

    if (!response.ok) {
      await handleResponseError(response)
    }

    return await response.json()
  } catch (error) {
    handleNetworkError(error)
  }
}

/**
 * Get booking details
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} - Booking details
 */
export const getBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/flights/booking/${bookingId}`, {
      credentials: 'include',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    })

    if (!response.ok) {
      await handleResponseError(response)
    }

    return await response.json()
  } catch (error) {
    handleNetworkError(error)
  }
}

/**
 * Cancel booking
 * @param {string} bookingId - Booking ID to cancel
 * @returns {Promise<Object>} - Success status
 */
export const cancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/flights/booking/${bookingId}`, {
      method: "DELETE",
      credentials: 'include',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    })

    if (!response.ok) {
      await handleResponseError(response)
    }

    return await response.json()
  } catch (error) {
    handleNetworkError(error)
  }
}
