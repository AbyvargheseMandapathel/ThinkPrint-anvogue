'use client'
import React, { useState } from 'react'

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone:''
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact-form',  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
      }

      const result = await response.json()

      if (result.success) {
        setShowSuccessModal(true)
        setFormData({ name: '', email: '', phone: '', message: '' }) // Reset form
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      setErrorMessage(error.message || 'An unknown error occurred')
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Header Components */}
      <div id="header" className="relative w-full">
        <div className="contact-us md:py-20 py-10">
          <div className="container">
            <div className="flex justify-between max-lg:flex-col gap-y-10">
              {/* Left Form Section */}
              <div className="left lg:w-2/3 lg:pr-4">
                <div className="heading3">Drop Us A Line</div>
                <div className="body1 text-secondary2 mt-3">
                  Use the form below to get in touch with the sales team
                </div>

                <form className="md:mt-6 mt-4" onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-4">
                    <input
                      className="border-line px-8 py-3 w-full rounded-lg"
                      id="name"
                      type="text"
                      placeholder="Your Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <input
                      className="border-line px-8 py-3 w-full rounded-lg"
                      id="email"
                      type="email"
                      placeholder="Your Email *"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div className="mb-4">
                    <input
                      className="border-line px-8 py-3 w-full rounded-lg"
                      id="phone"
                      type="tel"
                      placeholder="Your Phone Number *"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Message Field */}
                  <div className="mb-4">
                    <textarea
                      className="border-line px-8 pt-3 pb-3 w-full rounded-lg"
                      id="message"
                      rows={4}
                      placeholder="Your Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="block-button md:mt-6 mt-4">
                    <button
                      className="bg-black text-[#d2ef9a] px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 w-full"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send message'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Info Section */}
              <div className="right lg:w-1/4 lg:pl-4">
                <div className="item">
                  <div className="heading4">Our Store</div>
                  <p className="mt-3">
                    Phone: <span className="whitespace-nowrap">+91 99538 63364</span>
                  </p>
                  <p className="mt-1">
                    Email: <span className="whitespace-nowrap">sales@thinkprint.shop</span>
                  </p>
                </div>
                <div className="item mt-10">
                  <div className="heading4">Open Hours</div>
                  <p className="mt-3">Mon - Sat: 7:30am - 8:00pm IST</p>
                  <p className="mt-3">Sunday: 9:00am - 5:00pm IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto text-center animate-fadeIn">
            <svg
              className="w-16 h-16 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mt-4 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your message has been sent successfully. We will get back to you shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 px-6 py-2 bg-black text-[#d2ef9a] rounded hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto text-center animate-fadeIn">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-red-500">
              Oops! Something Went Wrong
            </h3>
            <p className="text-gray-600">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 px-6 py-2 bg-black text-[#d2ef9a] rounded hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ContactUs