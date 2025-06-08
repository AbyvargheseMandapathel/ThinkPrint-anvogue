'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import Menu from '@/components/Header/Menu/Menu';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer';

const ContactUs = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // State to handle form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://www.thinkprint.shop/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('Form Data:', formData);

      console.log('Response:', response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.success) {
        setSubmissionSuccess(true);
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan="🎉 Free Shipping on Bulk Orders" />
      <div id="header" className='relative w-full'>
      <Menu props="bg-transparent" />
        <Breadcrumb heading='Contact us' subHeading='Contact us' />
      </div>
      <div className='contact-us md:py-20 py-10'>
        <div className="container">
          <div className="flex justify-between max-lg:flex-col gap-y-10">
            <div className="left lg:w-2/3 lg:pr-4">
              <div className="heading3">Drop Us A Line</div>
              <div className="body1 text-secondary2 mt-3">Use the form below to get in touch with the sales team</div>
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
    className="bg-black text-[#d2ef9a] px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300"
    type="submit"
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Sending...' : 'Send message'}
  </button>
</div>

                {/* Submission Feedback */}
                {submissionSuccess && (
                  <p className="text-green-500 mt-2">Email sent successfully!</p>
                )}
                {submissionError && (
                  <p className="text-red-500 mt-2">{submissionError}</p>
                )}
              </form>
            </div>

            <div className="right lg:w-1/4 lg:pl-4">
              <div className="item">
                <div className="heading4">Our Store</div>
                {/* <p className="mt-3">2163 Phillips Gap Rd, West Jefferson, North Carolina, United States</p> */}
                <p className="mt-3">Phone: <span className='whitespace-nowrap'>+91 99538 63364</span></p>
                <p className="mt-1">Email: <span className='whitespace-nowrap'>sales@thinkprint.shop</span></p>
              </div>
              <div className="item mt-10">
                <div className="heading4">Open Hours</div>
                <p className="mt-3">Mon - Sat: <span className='whitespace-nowrap'>7:30am - 8:00pm IST</span></p>
                <p className="mt-3">Sunday: <span className='whitespace-nowrap'>9:00am - 5:00pm IST</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;