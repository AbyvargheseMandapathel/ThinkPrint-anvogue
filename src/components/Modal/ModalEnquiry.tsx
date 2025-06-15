'use client'

import React, { useState } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import { useModalEnquiryContext } from '@/context/ModalEnquiryContext'
import { ProductType } from '@/type/ProductType'

interface Props {
    data: ProductType
}

const ModalEnquiry: React.FC<Props> = ({ data }) => {
    const { isModalOpen, closeModalEnquiry } = useModalEnquiryContext()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError('')
        
        try {
            const response = await fetch('https://www.thinkprint.shop/api/product-enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    message: formData.message,
                    product: data?.name || 'Unknown Product'
                })
            })

            const result = await response.json()
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit enquiry')
            }
            
            setSubmitSuccess(true)
            
            // Reset form after success
            setTimeout(() => {
                setSubmitSuccess(false)
                closeModalEnquiry()
                setFormData({
                    name: '',
                    email: '',
                    message: '',
                    phoneNumber: ''
                })
            }, 2000)
        } catch (error) {
            console.error('Enquiry submission error:', error)
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit enquiry. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`modal-enquiry-block fixed inset-0 z-[200] ${isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeModalEnquiry}>
            <div className="overlay fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="modal-main w-full max-w-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="heading flex items-center justify-between pb-3 border-b border-line">
                    <div className="heading5">Enquire About {data?.name}</div>
                    <div
                        className="cursor-pointer"
                        onClick={closeModalEnquiry}
                    >
                        <Icon.X size={24} />
                    </div>
                </div>
                <div className="form-block pt-6">
                    {submitSuccess ? (
                        <div className="success-message text-center py-8">
                            <Icon.CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                            <div className="heading5 mb-2">Thank You!</div>
                            <p className="text-secondary">Your enquiry has been submitted successfully. We will get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            {submitError && (
                                <div className="error-message p-3 bg-red-50 text-red-600 rounded-lg">
                                    <p>{submitError}</p>
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="name" className="block mb-2 text-button">Name *</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border border-line px-4 py-3 w-full rounded-lg" 
                                    placeholder="Your Name" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="block mb-2 text-button">Email *</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-line px-4 py-3 w-full rounded-lg" 
                                    placeholder="Your Email" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber" className="block mb-2 text-button">Phone Number *</label>
                                <input 
                                    type="tel" 
                                    id="phoneNumber" 
                                    name="phoneNumber" 
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="border border-line px-4 py-3 w-full rounded-lg" 
                                    placeholder="Your Phone Number" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message" className="block mb-2 text-button">Message *</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="border border-line px-4 py-3 w-full rounded-lg min-h-[120px]" 
                                    placeholder="Your Message" 
                                    required
                                ></textarea>
                            </div>
                            <button 
    type="submit" 
    className="button-main w-full text-center mt-2"
    style={{ backgroundColor: '#d2ef9a', color: 'black' }}
    onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#000000';
        e.currentTarget.style.color = '#d2ef9a';
    }}
    onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#d2ef9a';
        e.currentTarget.style.color = '#000000';
    }}
    disabled={isSubmitting}
>
                                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModalEnquiry