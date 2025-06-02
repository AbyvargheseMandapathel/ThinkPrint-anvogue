'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductType } from '@/type/ProductType';

interface ModalEnquiryContextProps {
    children: ReactNode;
}

interface ModalEnquiryContextValue {
    isModalOpen: boolean;
    productData: ProductType | null;
    openModalEnquiry: (product: ProductType) => void;
    closeModalEnquiry: () => void;
}

const ModalEnquiryContext = createContext<ModalEnquiryContextValue | undefined>(undefined);

export const ModalEnquiryProvider: React.FC<ModalEnquiryContextProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [productData, setProductData] = useState<ProductType | null>(null);

    const openModalEnquiry = (product: ProductType) => {
        setProductData(product);
        setIsModalOpen(true);
    };

    const closeModalEnquiry = () => {
        setIsModalOpen(false);
    };

    return (
        <ModalEnquiryContext.Provider value={{ isModalOpen, productData, openModalEnquiry, closeModalEnquiry }}>
            {children}
        </ModalEnquiryContext.Provider>
    );
};

export const useModalEnquiryContext = () => {
    const context = useContext(ModalEnquiryContext);
    if (!context) {
        throw new Error('useModalEnquiryContext must be used within a ModalEnquiryProvider');
    }
    return context;
};