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
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false)
            setSubmitSuccess(true)
            
            // Reset form after success
            setTimeout(() => {
                setSubmitSuccess(false)
                closeModalEnquiry()
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                })
            }, 2000)
        }, 1000)
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