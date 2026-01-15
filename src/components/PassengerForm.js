import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { countries } from "../utils/countries"
import "./PassengerForm.css"

// SVG Icons for professional look
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

function PassengerForm({ numAdults, numChildren, onSubmit, isLoading }) {
  const [activePassenger, setActivePassenger] = useState(0)
  const totalPassengers = numAdults + numChildren

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    defaultValues: {
      passengers: Array(totalPassengers)
        .fill(0)
        .map(() => ({
          firstName: "",
          lastName: "",
          dateOfBirth: new Date(1990, 0, 1),
          email: "",
          phone: "",
          passportNumber: "",
          passportExpiry: new Date(2030, 0, 1),
          passportCountry: "US",
        })),
      cardNumber: "",
      cardName: "",
      cardExpiry: null,
      cardCvv: "",
    },
  })

  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const validateAndNext = async () => {
    const fieldsToValidate = [
      `passengers.${activePassenger}.firstName`,
      `passengers.${activePassenger}.lastName`,
      `passengers.${activePassenger}.dateOfBirth`,
      `passengers.${activePassenger}.email`,
      `passengers.${activePassenger}.phone`,
      `passengers.${activePassenger}.passportNumber`,
      `passengers.${activePassenger}.passportExpiry`,
      `passengers.${activePassenger}.passportCountry`,
    ]

    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      setActivePassenger((prev) => Math.min(prev + 1, totalPassengers))
    }
  }

  const goToPrevious = () => {
    setActivePassenger((prev) => Math.max(prev - 1, 0))
  }

  const onFormSubmit = (data) => {
    // Format passenger data for the API
    const formatDate = (date) => {
      if (!date) return ""
      const d = new Date(date)
      return d.toISOString().split("T")[0]
    }

    const formattedPassengers = data.passengers.map((passenger, index) => ({
      id: (index + 1).toString(),
      dateOfBirth: formatDate(passenger.dateOfBirth),
      name: {
        firstName: passenger.firstName,
        lastName: passenger.lastName,
      },
      gender: "MALE",
      contact: {
        emailAddress: passenger.email,
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: "1",
            number: passenger.phone,
          },
        ],
      },
      documents: [
        {
          documentType: "PASSPORT",
          birthPlace: "New York",
          issuanceLocation: "New York",
          issuanceDate: "2015-04-14",
          number: passenger.passportNumber,
          expiryDate: formatDate(passenger.passportExpiry),
          issuanceCountry: passenger.passportCountry,
          validityCountry: passenger.passportCountry,
          nationality: passenger.passportCountry,
          holder: true,
        },
      ],
    }))

    onSubmit(formattedPassengers)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="passenger-form">
      {activePassenger < totalPassengers ? (
        <div className="passenger-details-card">
          <div className="passenger-header">
            <div className="passenger-title">
              <span className="passenger-badge">Passenger {activePassenger + 1}</span>
              <h3>
                {activePassenger < numAdults ? "Adult Passenger" : "Child Passenger"}
              </h3>
            </div>
            <div className="passenger-progress">
              {Array(totalPassengers)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`progress-step-container ${index === activePassenger ? "active" : ""} ${index < activePassenger ? "completed" : ""}`}
                    onClick={() => index < activePassenger && setActivePassenger(index)}
                  >
                    <div className="progress-step-ring">
                      <div className="progress-step-dot">{index + 1}</div>
                    </div>
                    {index < totalPassengers - 1 && <div className="progress-connector"></div>}
                  </div>
                ))}
            </div>
          </div>

          <div className="form-section">
            <div className="grid grid-cols-1 grid-cols-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <UserIcon />
                  </div>
                  <input
                    type="text"
                    className="form-control-premium"
                    placeholder="John"
                    {...register(`passengers.${activePassenger}.firstName`, {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                    })}
                  />
                </div>
                {errors.passengers?.[activePassenger]?.firstName && (
                  <p className="form-error">{errors.passengers[activePassenger].firstName.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <UserIcon />
                  </div>
                  <input
                    type="text"
                    className="form-control-premium"
                    placeholder="Doe"
                    {...register(`passengers.${activePassenger}.lastName`, {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                    })}
                  />
                </div>
                {errors.passengers?.[activePassenger]?.lastName && (
                  <p className="form-error">{errors.passengers[activePassenger].lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 grid-cols-2">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <CalendarIcon />
                  </div>
                  <Controller
                    control={control}
                    name={`passengers.${activePassenger}.dateOfBirth`}
                    rules={{
                      required: "Date of birth is required",
                      validate: (value) => {
                        if (activePassenger >= numAdults) {
                          const age = calculateAge(value)
                          if (age >= 17) {
                            return "Child passenger must be under 17 years old"
                          }
                        }
                        return true
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        className="form-control-premium date-picker-premium"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MMMM d, yyyy"
                        maxDate={new Date()}
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="Select date"
                      />
                    )}
                  />
                </div>
                {errors.passengers?.[activePassenger]?.dateOfBirth && (
                  <p className="form-error">{errors.passengers[activePassenger].dateOfBirth.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <MailIcon />
                  </div>
                  <input
                    type="email"
                    className="form-control-premium"
                    placeholder="john.doe@example.com"
                    {...register(`passengers.${activePassenger}.email`, {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.passengers?.[activePassenger]?.email && (
                  <p className="form-error">{errors.passengers[activePassenger].email.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="phone-input-wrapper-premium">
                <div className="phone-prefix">
                  <PhoneIcon />
                  <span className="country-code-text">+</span>
                </div>
                <input
                  type="tel"

                  className="form-control-premium phone-input-field"
                  placeholder="202 555 0199"
                  {...register(`passengers.${activePassenger}.phone`, {
                    required: "Phone number is required",
                    minLength: {
                      value: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                  })}
                />
              </div>
              {errors.passengers?.[activePassenger]?.phone && (
                <p className="form-error">{errors.passengers[activePassenger].phone.message}</p>
              )}
            </div>

            <div className="form-divider-premium">
              <span>PASSPORT INFORMATION</span>
            </div>

            <div className="grid grid-cols-1 grid-cols-3">
              <div className="form-group">
                <label className="form-label">Passport Number</label>
                <input
                  type="text"
                  className="form-control-premium text-uppercase"
                  placeholder="AB1234567"
                  {...register(`passengers.${activePassenger}.passportNumber`, {
                    required: "Passport number is required",
                    minLength: {
                      value: 5,
                      message: "Passport number must be at least 5 characters",
                    },
                  })}
                />
                {errors.passengers?.[activePassenger]?.passportNumber && (
                  <p className="form-error">{errors.passengers[activePassenger].passportNumber.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Passport Expiry</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <CalendarIcon />
                  </div>
                  <Controller
                    control={control}
                    name={`passengers.${activePassenger}.passportExpiry`}
                    rules={{ required: "Passport expiry date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        className="form-control-premium date-picker-premium"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date()}
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="Select date"
                      />
                    )}
                  />
                </div>
                {errors.passengers?.[activePassenger]?.passportExpiry && (
                  <p className="form-error">{errors.passengers[activePassenger].passportExpiry.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Issuing Country</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <GlobeIcon />
                  </div>
                  <select
                    className="form-control-premium select-premium"
                    {...register(`passengers.${activePassenger}.passportCountry`, {
                      required: "Passport country is required",
                    })}
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.passengers?.[activePassenger]?.passportCountry && (
                  <p className="form-error">{errors.passengers[activePassenger].passportCountry.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions-premium">
            <button
              type="button"
              className="btn-premium btn-secondary-premium"
              onClick={goToPrevious}
              disabled={activePassenger === 0}
            >
              <ArrowLeftIcon />
              <span>Back</span>
            </button>
            <button type="button" className="btn-premium btn-primary-premium" onClick={validateAndNext}>
              <span>Continue</span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      ) : (
        <div className="payment-details-card">
          <div className="passenger-header">
            <div className="passenger-title">
              <h3>Payment Information</h3>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <div className="input-with-icon-wrapper">
                <div className="input-icon-container">
                  <CreditCardIcon />
                </div>
                <input
                  type="text"
                  className="form-control-premium"
                  placeholder="4111 1111 1111 1111"
                  {...register("cardNumber", {
                    required: "Card number is required",
                    minLength: {
                      value: 16,
                      message: "Card number must be at least 16 digits",
                    },
                  })}
                />
              </div>
              {errors.cardNumber && <p className="form-error">{errors.cardNumber.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <div className="input-with-icon-wrapper">
                <div className="input-icon-container">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  className="form-control-premium"
                  placeholder="John Doe"
                  {...register("cardName", {
                    required: "Cardholder name is required",
                    minLength: {
                      value: 2,
                      message: "Cardholder name must be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.cardName && <p className="form-error">{errors.cardName.message}</p>}
            </div>

            <div className="grid grid-cols-1 grid-cols-2">
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <CalendarIcon />
                  </div>
                  <Controller
                    control={control}
                    name="cardExpiry"
                    rules={{ required: "Expiry date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        className="form-control-premium date-picker-premium"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        minDate={new Date()}
                        placeholderText="MM/YYYY"
                      />
                    )}
                  />
                </div>
                {errors.cardExpiry && <p className="form-error">{errors.cardExpiry.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">CVV</label>
                <div className="input-with-icon-wrapper">
                  <div className="input-icon-container">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    className="form-control-premium"
                    placeholder="123"
                    {...register("cardCvv", {
                      required: "CVV is required",
                      minLength: {
                        value: 3,
                        message: "CVV must be at least 3 digits",
                      },
                    })}
                  />
                </div>
                {errors.cardCvv && <p className="form-error">{errors.cardCvv.message}</p>}
              </div>
            </div>
          </div>

          <div className="form-actions-premium">
            <button
              type="button"
              className="btn-premium btn-secondary-premium"
              onClick={goToPrevious}
            >
              <ArrowLeftIcon />
              <span>Back</span>
            </button>
            <button type="submit" className="btn-premium btn-primary-premium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Complete Booking</span>
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

export default PassengerForm
